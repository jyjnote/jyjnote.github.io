---
title: 동시성 제어
date: 2026-09-18 23:35:00 +0900
slug: concurrency-control
permalink: /posts/concurrency-control/
categories: [CS, 데이터베이스]
tags: [동시성제어, ConcurrencyControl, Transaction, Lock, MVCC, Timestamp, Isolation, 정보처리기사, NCS]
math: true
---

동시성 제어는 여러 Transaction이 동시에 실행될 때 데이터 일관성을 유지하면서 가능한 한 높은 병렬성을 확보하는 기법입니다.

이 글에서는 용어를 외우는 데서 끝내지 않고 Transaction의 시간 순서와 실제 결과를 연결해서 봅니다.

<blockquote class="prompt-info">
<p>한 줄: 동시성 제어는 동시에 실행되는 Transaction의 충돌을 조정해 잘못된 읽기와 갱신을 막습니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

동시성 제어 = 일관성 유지 + 동시 실행

</details>

## 실습 데이터 전체 보기

아래 실습 데이터베이스를 기준으로 예시를 설명합니다.

<div style="width:100%; overflow:hidden; border:1px solid var(--main-border-color,#ddd); border-radius:12px; margin:1rem 0;">
<iframe
  src="https://docs.google.com/spreadsheets/d/1mtu6pFcGyOfwpFizaJskfFD87GxyjAmB/preview"
  width="100%"
  height="500"
  style="border:0;"
  loading="lazy">
</iframe>
</div>

트랜잭션 예시에서는 다음 Table을 자주 사용합니다.

| Table | 핵심 Column | 역할 |
| --- | --- | --- |
| EMPLOYEE | EMP_ID, EMP_NAME, DEPT_ID, SALARY | 직원 |
| PRODUCT | PRODUCT_ID, PRODUCT_NAME, PRICE, STOCK | 상품 |
| ORDERS | ORDER_ID, CUSTOMER_ID, ORDER_DATE, STATUS | 주문 |
| ORDER_ITEM | ORDER_ID, PRODUCT_ID, QTY | 주문 상세 |

특히 재고 변경과 주문 상태 변경을 하나의 작업 단위로 묶는 예시를 자주 사용합니다.


## 왜 필요한가

두 Transaction이 같은 상품 재고를 동시에 수정한다고 해봅시다.

```text
초기 STOCK = 10

T1 → 10 읽음
T2 → 10 읽음
T1 → 9 저장
T2 → 9 저장
```

실제로 두 번 판매했는데 재고가 8이 아니라 9가 될 수 있습니다.

이런 문제를 Lost Update라고 합니다.

## Serial Schedule

Transaction을 하나씩 순서대로 실행하면 충돌을 피하기 쉽습니다.

```text
T1 전체 실행
↓
T2 전체 실행
```

이를 직렬 Schedule이라고 볼 수 있습니다.

하지만 동시 처리 성능은 떨어질 수 있습니다.

## Concurrent Schedule

실제 시스템에서는 여러 Transaction을 섞어 실행합니다.

```text
T1 Read
T2 Read
T1 Write
T2 Write
```

성능은 좋아질 수 있지만 충돌 가능성이 생깁니다.

## Serializability

동시 실행 결과가 어떤 직렬 실행 결과와 동등하다면 Serializable한 Schedule이라고 설명합니다.

동시성을 유지하면서도 올바른 결과를 만들기 위한 중요한 이론적 기준입니다.

## Lock 기반 제어

데이터를 읽거나 수정하기 전에 Lock을 획득하게 할 수 있습니다.

```text
Shared Lock
Exclusive Lock
```

Lock 호환성에 따라 다른 Transaction의 접근을 기다리게 합니다.

## MVCC

MVCC는 여러 버전의 Row를 관리해 읽기와 쓰기의 충돌을 줄이는 방식입니다.

PostgreSQL, Oracle, MySQL InnoDB 등 여러 DBMS가 서로 다른 형태로 활용합니다.

DBMS마다 구현 세부는 다릅니다.

## Timestamp 기반 제어

Transaction의 순서를 Timestamp로 관리하여 충돌을 판단하는 방식도 있습니다.

시험에서는 Lock과 함께 대표적인 동시성 제어 기법으로 볼 수 있습니다.

## Optimistic Concurrency

충돌이 적다고 가정하고 먼저 실행한 뒤 마지막에 충돌 여부를 검사하는 낙관적 방식도 있습니다.

웹 애플리케이션에서는 Version Column을 이용한 Optimistic Locking을 사용하기도 합니다.

## 동시성과 Isolation Level

모든 충돌을 가장 강하게 막으면 성능이 낮아질 수 있습니다.

그래서 DBMS는 여러 Isolation Level을 제공합니다.

```text
READ UNCOMMITTED
READ COMMITTED
REPEATABLE READ
SERIALIZABLE
```

세부 동작은 DBMS마다 차이가 있을 수 있습니다.

## SQLite 동시성

SQLite는 하나의 파일 기반 데이터베이스이며 서버형 DBMS와 동시성 구조가 다릅니다.

WAL 모드에서는 읽기와 쓰기의 동시성이 개선될 수 있지만 동시에 여러 Writer가 자유롭게 쓰는 구조는 아닙니다.

SQLite의 정확한 Lock과 Transaction 동작은 저널 모드에 따라 달라질 수 있습니다.

## 다른 개념과 비교

### 비교 1. Lock

```text
Lock
→ 비관적 제어
```

`동시성 제어`과 비교할 때는 **언제 발생하는지**, **무엇을 보호하는지**, **실패 시 어떻게 처리하는지**를 함께 봅니다.

### 비교 2. MVCC

```text
MVCC
→ 여러 버전 활용
```

`동시성 제어`과 비교할 때는 **언제 발생하는지**, **무엇을 보호하는지**, **실패 시 어떻게 처리하는지**를 함께 봅니다.

### 비교 3. Serial Schedule

```text
Serial Schedule
→ 순차 실행
```

`동시성 제어`과 비교할 때는 **언제 발생하는지**, **무엇을 보호하는지**, **실패 시 어떻게 처리하는지**를 함께 봅니다.

### 비교 4. Serializable

```text
Serializable
→ 직렬 결과와 동등
```

`동시성 제어`과 비교할 때는 **언제 발생하는지**, **무엇을 보호하는지**, **실패 시 어떻게 처리하는지**를 함께 봅니다.

## 구체적인 예시 연습

### 예시 1. Lost Update

상황은 다음과 같습니다.

```text
두 Transaction이 같은 10을 읽고 9 저장
```

핵심 판단:

```text
갱신 손실
```

`동시성 제어`에서는 시간 순서를 직접 적어보면 문제를 훨씬 쉽게 풀 수 있습니다.

특히 두 Transaction이 등장하면 `T1`, `T2`의 Read·Write·COMMIT 순서를 세로로 나누어 확인합니다.

### 예시 2. Serial

상황은 다음과 같습니다.

```text
T1 후 T2
```

핵심 판단:

```text
안전하지만 동시성 낮음
```

`동시성 제어`에서는 시간 순서를 직접 적어보면 문제를 훨씬 쉽게 풀 수 있습니다.

특히 두 Transaction이 등장하면 `T1`, `T2`의 Read·Write·COMMIT 순서를 세로로 나누어 확인합니다.

### 예시 3. Lock

상황은 다음과 같습니다.

```text
쓰기 전에 X Lock
```

핵심 판단:

```text
충돌 제어
```

`동시성 제어`에서는 시간 순서를 직접 적어보면 문제를 훨씬 쉽게 풀 수 있습니다.

특히 두 Transaction이 등장하면 `T1`, `T2`의 Read·Write·COMMIT 순서를 세로로 나누어 확인합니다.

### 예시 4. MVCC

상황은 다음과 같습니다.

```text
여러 Row Version
```

핵심 판단:

```text
읽기·쓰기 충돌 감소
```

`동시성 제어`에서는 시간 순서를 직접 적어보면 문제를 훨씬 쉽게 풀 수 있습니다.

특히 두 Transaction이 등장하면 `T1`, `T2`의 Read·Write·COMMIT 순서를 세로로 나누어 확인합니다.

### 예시 5. Timestamp

상황은 다음과 같습니다.

```text
순서 기준
```

핵심 판단:

```text
충돌 판정
```

`동시성 제어`에서는 시간 순서를 직접 적어보면 문제를 훨씬 쉽게 풀 수 있습니다.

특히 두 Transaction이 등장하면 `T1`, `T2`의 Read·Write·COMMIT 순서를 세로로 나누어 확인합니다.

### 예시 6. Optimistic

상황은 다음과 같습니다.

```text
충돌 적다고 가정
```

핵심 판단:

```text
마지막 검증
```

`동시성 제어`에서는 시간 순서를 직접 적어보면 문제를 훨씬 쉽게 풀 수 있습니다.

특히 두 Transaction이 등장하면 `T1`, `T2`의 Read·Write·COMMIT 순서를 세로로 나누어 확인합니다.

## 시간 순서 판별 연습

### 판별 1

상황:

```text
BEGIN → SQL 1 → SQL 2 → 오류 또는 성공 → COMMIT/ROLLBACK 판단
```

판단 순서:

```text
1. 누가 먼저 읽거나 쓰는가
2. COMMIT 여부는 무엇인가
3. 다른 Transaction이 어떤 값을 보는가
4. 최종 상태가 무엇인가
```

시간 순서를 적으면 용어 암기보다 훨씬 정확하게 판단할 수 있습니다.

### 판별 2

상황:

```text
BEGIN → SQL 1 → SQL 2 → 오류 또는 성공 → COMMIT/ROLLBACK 판단
```

판단 순서:

```text
1. 누가 먼저 읽거나 쓰는가
2. COMMIT 여부는 무엇인가
3. 다른 Transaction이 어떤 값을 보는가
4. 최종 상태가 무엇인가
```

시간 순서를 적으면 용어 암기보다 훨씬 정확하게 판단할 수 있습니다.

### 판별 3

상황:

```text
BEGIN → SQL 1 → SQL 2 → 오류 또는 성공 → COMMIT/ROLLBACK 판단
```

판단 순서:

```text
1. 누가 먼저 읽거나 쓰는가
2. COMMIT 여부는 무엇인가
3. 다른 Transaction이 어떤 값을 보는가
4. 최종 상태가 무엇인가
```

시간 순서를 적으면 용어 암기보다 훨씬 정확하게 판단할 수 있습니다.

### 판별 4

상황:

```text
BEGIN → SQL 1 → SQL 2 → 오류 또는 성공 → COMMIT/ROLLBACK 판단
```

판단 순서:

```text
1. 누가 먼저 읽거나 쓰는가
2. COMMIT 여부는 무엇인가
3. 다른 Transaction이 어떤 값을 보는가
4. 최종 상태가 무엇인가
```

시간 순서를 적으면 용어 암기보다 훨씬 정확하게 판단할 수 있습니다.

### 판별 5

상황:

```text
BEGIN → SQL 1 → SQL 2 → 오류 또는 성공 → COMMIT/ROLLBACK 판단
```

판단 순서:

```text
1. 누가 먼저 읽거나 쓰는가
2. COMMIT 여부는 무엇인가
3. 다른 Transaction이 어떤 값을 보는가
4. 최종 상태가 무엇인가
```

시간 순서를 적으면 용어 암기보다 훨씬 정확하게 판단할 수 있습니다.

### 판별 6

상황:

```text
BEGIN → SQL 1 → SQL 2 → 오류 또는 성공 → COMMIT/ROLLBACK 판단
```

판단 순서:

```text
1. 누가 먼저 읽거나 쓰는가
2. COMMIT 여부는 무엇인가
3. 다른 Transaction이 어떤 값을 보는가
4. 최종 상태가 무엇인가
```

시간 순서를 적으면 용어 암기보다 훨씬 정확하게 판단할 수 있습니다.

## 자주 하는 실수

### 실수 1. COMMIT되지 않은 상태와 COMMIT된 상태를 구분하지 않는다.

이 실수를 피하려면 다음 순서로 봅니다.

```text
Transaction 상태
→ Read / Write
→ COMMIT 여부
→ Lock 보유·대기
→ 최종 결과
```

`동시성 제어` 문제에서는 시간 순서를 생략하지 않는 것이 가장 중요합니다.

### 실수 2. Lock 대기와 Deadlock을 같은 것으로 본다.

이 실수를 피하려면 다음 순서로 봅니다.

```text
Transaction 상태
→ Read / Write
→ COMMIT 여부
→ Lock 보유·대기
→ 최종 결과
```

`동시성 제어` 문제에서는 시간 순서를 생략하지 않는 것이 가장 중요합니다.

### 실수 3. Isolation Level 이름만 보고 모든 DBMS가 동일하게 동작한다고 생각한다.

이 실수를 피하려면 다음 순서로 봅니다.

```text
Transaction 상태
→ Read / Write
→ COMMIT 여부
→ Lock 보유·대기
→ 최종 결과
```

`동시성 제어` 문제에서는 시간 순서를 생략하지 않는 것이 가장 중요합니다.

### 실수 4. Dirty Read와 Non-repeatable Read를 같은 현상으로 본다.

이 실수를 피하려면 다음 순서로 봅니다.

```text
Transaction 상태
→ Read / Write
→ COMMIT 여부
→ Lock 보유·대기
→ 최종 결과
```

`동시성 제어` 문제에서는 시간 순서를 생략하지 않는 것이 가장 중요합니다.

### 실수 5. 2PL이 Deadlock까지 제거한다고 생각한다.

이 실수를 피하려면 다음 순서로 봅니다.

```text
Transaction 상태
→ Read / Write
→ COMMIT 여부
→ Lock 보유·대기
→ 최종 결과
```

`동시성 제어` 문제에서는 시간 순서를 생략하지 않는 것이 가장 중요합니다.

### 실수 6. Checkpoint가 모든 Log를 없애는 기능이라고 생각한다.

이 실수를 피하려면 다음 순서로 봅니다.

```text
Transaction 상태
→ Read / Write
→ COMMIT 여부
→ Lock 보유·대기
→ 최종 결과
```

`동시성 제어` 문제에서는 시간 순서를 생략하지 않는 것이 가장 중요합니다.

## 잘 놓치는 핵심

### 1. 왜 필요한가

두 Transaction이 같은 상품 재고를 동시에 수정한다고 해봅시다.

이 항목은 시험에서 비슷한 용어와 바꾸어 출제될 수 있으므로 시간 순서와 상태 변화를 함께 확인합니다.

### 2. Serial Schedule

Transaction을 하나씩 순서대로 실행하면 충돌을 피하기 쉽습니다.

이 항목은 시험에서 비슷한 용어와 바꾸어 출제될 수 있으므로 시간 순서와 상태 변화를 함께 확인합니다.

### 3. Concurrent Schedule

실제 시스템에서는 여러 Transaction을 섞어 실행합니다.

이 항목은 시험에서 비슷한 용어와 바꾸어 출제될 수 있으므로 시간 순서와 상태 변화를 함께 확인합니다.

### 4. Serializability

동시 실행 결과가 어떤 직렬 실행 결과와 동등하다면 Serializable한 Schedule이라고 설명합니다.

이 항목은 시험에서 비슷한 용어와 바꾸어 출제될 수 있으므로 시간 순서와 상태 변화를 함께 확인합니다.

### 5. Lock 기반 제어

데이터를 읽거나 수정하기 전에 Lock을 획득하게 할 수 있습니다.

이 항목은 시험에서 비슷한 용어와 바꾸어 출제될 수 있으므로 시간 순서와 상태 변화를 함께 확인합니다.

### 6. MVCC

MVCC는 여러 버전의 Row를 관리해 읽기와 쓰기의 충돌을 줄이는 방식입니다.

이 항목은 시험에서 비슷한 용어와 바꾸어 출제될 수 있으므로 시간 순서와 상태 변화를 함께 확인합니다.

## 시험·면접

### 핵심 암기

```text
동시성 제어 = 일관성 유지 + 동시 실행
```

### 시험 접근 순서

```text
1. Transaction 시작점 확인
2. Read와 Write 순서 확인
3. COMMIT 여부 확인
4. Lock 또는 Isolation 확인
5. 다른 Transaction이 보는 값 확인
6. 최종 상태 확인
```

### 시험 함정

같은 용어라도 실제 DBMS의 구현에 따라 세부 동작이 달라질 수 있습니다.

시험에서는 문제에서 제시한 표준 정의를 우선하고, 실무에서는 사용하는 DBMS의 실제 구현을 확인합니다.

### 면접에서 짧게 답한다면

동시성 제어는 여러 Transaction이 동시에 실행될 때 데이터 일관성을 유지하면서 가능한 한 높은 병렬성을 확보하는 기법입니다.

핵심은 데이터 일관성을 유지하면서 동시에 여러 작업을 안전하게 처리하고, 장애가 발생해도 정상 상태로 복구하는 것입니다.

## 예시로 한 바퀴

`동시성 제어` 문제를 만나면 다음처럼 시간을 세로로 적습니다.

```text
시간 ↓

T1                T2
Read
                  Read
Write
                  Write
COMMIT
                  COMMIT
```

그다음 미확정 값, Lock 대기, 반복 조회 결과, 최종 반영 여부를 하나씩 확인합니다.

이 방식은 Isolation Level, Deadlock, Recovery 문제에도 그대로 사용할 수 있습니다.

## 객관식 문제

### 1. 동시성 제어 목적은?

① 일관성과 병렬성 확보  
② 항상 Table 삭제  
③ 항상 Index 생성  
④ 모든 Lock 해제 금지

<details>
<summary>정답</summary>

①

</details>

해설: `일관성과 병렬성 확보`가 핵심입니다.

### 2. Lost Update는?

① 갱신 손실  
② 항상 Table 삭제  
③ 항상 Index 생성  
④ 모든 Lock 해제 금지

<details>
<summary>정답</summary>

①

</details>

해설: `갱신 손실`가 핵심입니다.

### 3. MVCC는?

① 여러 버전 활용  
② 항상 Table 삭제  
③ 항상 Index 생성  
④ 모든 Lock 해제 금지

<details>
<summary>정답</summary>

①

</details>

해설: `여러 버전 활용`가 핵심입니다.

### 4. DBMS별 차이를 확인해야 하는 이유는?

① 동일 용어라도 구현이 다를 수 있어서  
② 항상 Table 삭제  
③ 항상 Index 생성  
④ 모든 Lock 해제 금지

<details>
<summary>정답</summary>

①

</details>

해설: `동일 용어라도 구현이 다를 수 있어서`가 핵심입니다.

### 5. 동시성 문제를 풀 때 가장 먼저 볼 것은?

① Transaction 실행 순서  
② 항상 Table 삭제  
③ 항상 Index 생성  
④ 모든 Lock 해제 금지

<details>
<summary>정답</summary>

①

</details>

해설: `Transaction 실행 순서`가 핵심입니다.

### 6. 장애 복구와 밀접한 ACID 속성은?

① Atomicity와 Durability  
② 항상 Table 삭제  
③ 항상 Index 생성  
④ 모든 Lock 해제 금지

<details>
<summary>정답</summary>

①

</details>

해설: `Atomicity와 Durability`가 핵심입니다.

### 7. 동시성 제어와 밀접한 ACID 속성은?

① Isolation  
② 항상 Table 삭제  
③ 항상 Index 생성  
④ 모든 Lock 해제 금지

<details>
<summary>정답</summary>

①

</details>

해설: `Isolation`가 핵심입니다.

### 8. COMMIT 전 변경은?

① 아직 확정되지 않은 상태  
② 항상 Table 삭제  
③ 항상 Index 생성  
④ 모든 Lock 해제 금지

<details>
<summary>정답</summary>

①

</details>

해설: `아직 확정되지 않은 상태`가 핵심입니다.

## 다음에 이을 글

**Lock · 2PL**입니다.

Shared Lock, Exclusive Lock과 Two-Phase Locking의 규칙을 구체적으로 알아봅니다.
