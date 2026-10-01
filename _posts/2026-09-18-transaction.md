---
title: Transaction · 트랜잭션
date: 2026-09-18 23:20:00 +0900
slug: transaction
permalink: /posts/transaction/
categories: [CS, 데이터베이스]
tags: [Transaction, 트랜잭션, ACID, COMMIT, ROLLBACK, 동시성, Recovery, 정보처리기사, NCS]
math: true
---

Transaction(트랜잭션)은 데이터베이스에서 하나의 논리적인 작업 단위로 묶어 처리하는 연산들의 집합입니다.

이 글에서는 용어를 외우는 데서 끝내지 않고 Transaction의 시간 순서와 실제 결과를 연결해서 봅니다.

<blockquote class="prompt-info">
<p>한 줄: 트랜잭션은 여러 SQL을 하나의 작업처럼 묶어 모두 성공하거나 필요하면 모두 되돌릴 수 있게 합니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

Transaction = 하나의 논리적 작업 단위

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

주문 처리에서는 여러 작업이 함께 성공해야 합니다.

```text
1. 주문 생성
2. 주문 상세 생성
3. 상품 재고 감소
4. 결제 상태 변경
```

중간에 하나만 실패하면 데이터가 서로 맞지 않을 수 있습니다.

그래서 관련 작업을 하나의 Transaction으로 묶습니다.

## 기본 흐름

가장 단순한 흐름은 다음과 같습니다.

```text
BEGIN
↓
SQL 1
↓
SQL 2
↓
모두 성공
↓
COMMIT
```

문제가 발생하면 다음처럼 처리합니다.

```text
BEGIN
↓
SQL 실행
↓
오류
↓
ROLLBACK
```

## 실습 예시

상품 재고를 줄이고 주문 상태를 변경한다고 해봅시다.

```sql
BEGIN;

UPDATE PRODUCT
SET STOCK = STOCK - 1
WHERE PRODUCT_ID = 'P001';

UPDATE ORDERS
SET STATUS = 'PAID'
WHERE ORDER_ID = 'O001';

COMMIT;
```

두 변경이 하나의 업무 작업이라면 함께 확정하는 것이 자연스럽습니다.

## 트랜잭션 경계

어디서 시작하고 어디서 끝나는지가 중요합니다.

```text
시작
→ BEGIN 또는 DBMS의 자동 시작

종료
→ COMMIT
또는
→ ROLLBACK
```

애플리케이션이나 DBMS 설정에 따라 자동 커밋 여부가 다를 수 있습니다.

## 트랜잭션과 오류

오류가 발생했다고 해서 모든 DBMS가 자동으로 전체 Transaction을 동일하게 처리하는 것은 아닙니다.

일부 오류는 현재 문장만 실패하고 Transaction은 계속될 수 있습니다.

어떤 오류에서 Transaction 전체가 실패 상태가 되는지는 DBMS별 동작을 확인해야 합니다.

## Transaction과 ACID

트랜잭션의 성질은 ACID로 정리합니다.

```text
Atomicity
Consistency
Isolation
Durability
```

다음 글에서 각각 자세히 다룹니다.

## Transaction과 Lock

여러 사용자가 같은 데이터를 동시에 바꾸면 충돌할 수 있습니다.

이때 Lock, MVCC, Timestamp 같은 동시성 제어 기법이 사용됩니다.

```text
Transaction
+
동시성 제어
→ 일관된 결과
```

## Transaction과 Recovery

시스템 장애가 발생해도 확정된 Transaction을 복구하고 미완료 Transaction을 정리해야 합니다.

이를 위해 Log와 Checkpoint 같은 Recovery 기법이 사용됩니다.

## SQLite에서 Transaction

SQLite에서는 다음과 같은 형태를 사용할 수 있습니다.

```sql
BEGIN TRANSACTION;

UPDATE PRODUCT
SET STOCK = STOCK - 1
WHERE PRODUCT_ID = 'P001';

COMMIT;
```

SQLite는 서버형 DBMS와 Lock 동작이 다르므로 동시성 세부는 별도로 봐야 합니다.

## 다른 개념과 비교

### 비교 1. Transaction

```text
Transaction
→ 논리적 작업 단위
```

`Transaction · 트랜잭션`과 비교할 때는 **언제 발생하는지**, **무엇을 보호하는지**, **실패 시 어떻게 처리하는지**를 함께 봅니다.

### 비교 2. COMMIT

```text
COMMIT
→ 확정
```

`Transaction · 트랜잭션`과 비교할 때는 **언제 발생하는지**, **무엇을 보호하는지**, **실패 시 어떻게 처리하는지**를 함께 봅니다.

### 비교 3. ROLLBACK

```text
ROLLBACK
→ 취소
```

`Transaction · 트랜잭션`과 비교할 때는 **언제 발생하는지**, **무엇을 보호하는지**, **실패 시 어떻게 처리하는지**를 함께 봅니다.

### 비교 4. ACID

```text
ACID
→ 트랜잭션 성질
```

`Transaction · 트랜잭션`과 비교할 때는 **언제 발생하는지**, **무엇을 보호하는지**, **실패 시 어떻게 처리하는지**를 함께 봅니다.

## 구체적인 예시 연습

### 예시 1. 재고와 주문

상황은 다음과 같습니다.

```text
재고 감소 + 주문 상태 변경
```

핵심 판단:

```text
두 작업을 하나의 Transaction으로
```

`Transaction · 트랜잭션`에서는 시간 순서를 직접 적어보면 문제를 훨씬 쉽게 풀 수 있습니다.

특히 두 Transaction이 등장하면 `T1`, `T2`의 Read·Write·COMMIT 순서를 세로로 나누어 확인합니다.

### 예시 2. 실패 처리

상황은 다음과 같습니다.

```text
두 번째 UPDATE 실패
```

핵심 판단:

```text
전체 ROLLBACK 검토
```

`Transaction · 트랜잭션`에서는 시간 순서를 직접 적어보면 문제를 훨씬 쉽게 풀 수 있습니다.

특히 두 Transaction이 등장하면 `T1`, `T2`의 Read·Write·COMMIT 순서를 세로로 나누어 확인합니다.

### 예시 3. 확정

상황은 다음과 같습니다.

```text
모든 SQL 성공
```

핵심 판단:

```text
COMMIT
```

`Transaction · 트랜잭션`에서는 시간 순서를 직접 적어보면 문제를 훨씬 쉽게 풀 수 있습니다.

특히 두 Transaction이 등장하면 `T1`, `T2`의 Read·Write·COMMIT 순서를 세로로 나누어 확인합니다.

### 예시 4. 동시성

상황은 다음과 같습니다.

```text
두 사용자가 같은 재고 수정
```

핵심 판단:

```text
동시성 제어 필요
```

`Transaction · 트랜잭션`에서는 시간 순서를 직접 적어보면 문제를 훨씬 쉽게 풀 수 있습니다.

특히 두 Transaction이 등장하면 `T1`, `T2`의 Read·Write·COMMIT 순서를 세로로 나누어 확인합니다.

### 예시 5. 장애

상황은 다음과 같습니다.

```text
COMMIT 직후 시스템 중단
```

핵심 판단:

```text
Durability와 Recovery
```

`Transaction · 트랜잭션`에서는 시간 순서를 직접 적어보면 문제를 훨씬 쉽게 풀 수 있습니다.

특히 두 Transaction이 등장하면 `T1`, `T2`의 Read·Write·COMMIT 순서를 세로로 나누어 확인합니다.

### 예시 6. 범위

상황은 다음과 같습니다.

```text
한 업무 흐름
```

핵심 판단:

```text
Transaction Boundary
```

`Transaction · 트랜잭션`에서는 시간 순서를 직접 적어보면 문제를 훨씬 쉽게 풀 수 있습니다.

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

`Transaction · 트랜잭션` 문제에서는 시간 순서를 생략하지 않는 것이 가장 중요합니다.

### 실수 2. Lock 대기와 Deadlock을 같은 것으로 본다.

이 실수를 피하려면 다음 순서로 봅니다.

```text
Transaction 상태
→ Read / Write
→ COMMIT 여부
→ Lock 보유·대기
→ 최종 결과
```

`Transaction · 트랜잭션` 문제에서는 시간 순서를 생략하지 않는 것이 가장 중요합니다.

### 실수 3. Isolation Level 이름만 보고 모든 DBMS가 동일하게 동작한다고 생각한다.

이 실수를 피하려면 다음 순서로 봅니다.

```text
Transaction 상태
→ Read / Write
→ COMMIT 여부
→ Lock 보유·대기
→ 최종 결과
```

`Transaction · 트랜잭션` 문제에서는 시간 순서를 생략하지 않는 것이 가장 중요합니다.

### 실수 4. Dirty Read와 Non-repeatable Read를 같은 현상으로 본다.

이 실수를 피하려면 다음 순서로 봅니다.

```text
Transaction 상태
→ Read / Write
→ COMMIT 여부
→ Lock 보유·대기
→ 최종 결과
```

`Transaction · 트랜잭션` 문제에서는 시간 순서를 생략하지 않는 것이 가장 중요합니다.

### 실수 5. 2PL이 Deadlock까지 제거한다고 생각한다.

이 실수를 피하려면 다음 순서로 봅니다.

```text
Transaction 상태
→ Read / Write
→ COMMIT 여부
→ Lock 보유·대기
→ 최종 결과
```

`Transaction · 트랜잭션` 문제에서는 시간 순서를 생략하지 않는 것이 가장 중요합니다.

### 실수 6. Checkpoint가 모든 Log를 없애는 기능이라고 생각한다.

이 실수를 피하려면 다음 순서로 봅니다.

```text
Transaction 상태
→ Read / Write
→ COMMIT 여부
→ Lock 보유·대기
→ 최종 결과
```

`Transaction · 트랜잭션` 문제에서는 시간 순서를 생략하지 않는 것이 가장 중요합니다.

## 잘 놓치는 핵심

### 1. 왜 필요한가

주문 처리에서는 여러 작업이 함께 성공해야 합니다.

이 항목은 시험에서 비슷한 용어와 바꾸어 출제될 수 있으므로 시간 순서와 상태 변화를 함께 확인합니다.

### 2. 기본 흐름

가장 단순한 흐름은 다음과 같습니다.

이 항목은 시험에서 비슷한 용어와 바꾸어 출제될 수 있으므로 시간 순서와 상태 변화를 함께 확인합니다.

### 3. 실습 예시

상품 재고를 줄이고 주문 상태를 변경한다고 해봅시다.

이 항목은 시험에서 비슷한 용어와 바꾸어 출제될 수 있으므로 시간 순서와 상태 변화를 함께 확인합니다.

### 4. 트랜잭션 경계

어디서 시작하고 어디서 끝나는지가 중요합니다.

이 항목은 시험에서 비슷한 용어와 바꾸어 출제될 수 있으므로 시간 순서와 상태 변화를 함께 확인합니다.

### 5. 트랜잭션과 오류

오류가 발생했다고 해서 모든 DBMS가 자동으로 전체 Transaction을 동일하게 처리하는 것은 아닙니다.

이 항목은 시험에서 비슷한 용어와 바꾸어 출제될 수 있으므로 시간 순서와 상태 변화를 함께 확인합니다.

### 6. Transaction과 ACID

트랜잭션의 성질은 ACID로 정리합니다.

이 항목은 시험에서 비슷한 용어와 바꾸어 출제될 수 있으므로 시간 순서와 상태 변화를 함께 확인합니다.

## 시험·면접

### 핵심 암기

```text
Transaction = 하나의 논리적 작업 단위
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

Transaction(트랜잭션)은 데이터베이스에서 하나의 논리적인 작업 단위로 묶어 처리하는 연산들의 집합입니다.

핵심은 데이터 일관성을 유지하면서 동시에 여러 작업을 안전하게 처리하고, 장애가 발생해도 정상 상태로 복구하는 것입니다.

## 예시로 한 바퀴

`Transaction · 트랜잭션` 문제를 만나면 다음처럼 시간을 세로로 적습니다.

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

### 1. Transaction의 핵심은?

① 논리적 작업 단위  
② 항상 Table 삭제  
③ 항상 Index 생성  
④ 모든 Lock 해제 금지

<details>
<summary>정답</summary>

①

</details>

해설: `논리적 작업 단위`가 핵심입니다.

### 2. 성공 결과 확정은?

① COMMIT  
② 항상 Table 삭제  
③ 항상 Index 생성  
④ 모든 Lock 해제 금지

<details>
<summary>정답</summary>

①

</details>

해설: `COMMIT`가 핵심입니다.

### 3. 실패 시 취소는?

① ROLLBACK  
② 항상 Table 삭제  
③ 항상 Index 생성  
④ 모든 Lock 해제 금지

<details>
<summary>정답</summary>

①

</details>

해설: `ROLLBACK`가 핵심입니다.

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

**ACID**입니다.

트랜잭션이 가져야 하는 네 가지 핵심 성질인 ACID를 정리합니다.
