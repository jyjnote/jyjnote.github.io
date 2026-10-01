---
title: Isolation Level
date: 2026-09-18 23:45:00 +0900
slug: isolation-level
permalink: /posts/isolation-level/
categories: [CS, 데이터베이스]
tags: [IsolationLevel, ReadUncommitted, ReadCommitted, RepeatableRead, Serializable, Transaction, 정보처리기사, NCS]
math: true
---

Isolation Level은 동시에 실행되는 Transaction 사이에서 어느 정도의 간섭과 이상 현상을 허용할지 정하는 격리 수준입니다.

이 글에서는 용어를 외우는 데서 끝내지 않고 Transaction의 시간 순서와 실제 결과를 연결해서 봅니다.

<blockquote class="prompt-info">
<p>한 줄: 격리 수준이 높을수록 동시성 이상 현상은 줄지만 대기와 충돌 비용이 커질 수 있습니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

READ UNCOMMITTED → READ COMMITTED → REPEATABLE READ → SERIALIZABLE

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


## 표준 네 단계

대표적인 표준 격리 수준은 다음 네 가지입니다.

```text
READ UNCOMMITTED
READ COMMITTED
REPEATABLE READ
SERIALIZABLE
```

아래로 갈수록 일반적으로 격리가 강해집니다.

## READ UNCOMMITTED

아직 COMMIT되지 않은 다른 Transaction의 변경을 읽을 수 있는 수준으로 설명합니다.

Dirty Read가 허용될 수 있습니다.

실제 지원 방식과 동작은 DBMS마다 다릅니다.

## READ COMMITTED

다른 Transaction이 COMMIT한 데이터만 읽는 수준으로 설명합니다.

Dirty Read는 막지만 같은 Row를 다시 읽었을 때 값이 달라지는 Non-repeatable Read는 발생할 수 있습니다.

## REPEATABLE READ

같은 Transaction에서 이미 읽은 Row를 다시 읽을 때 같은 값을 유지하도록 하는 수준입니다.

표준 분류에서는 Dirty Read와 Non-repeatable Read를 막지만 Phantom Read는 허용될 수 있다고 설명합니다.

다만 실제 DBMS 구현은 MVCC와 Lock 방식에 따라 다를 수 있습니다.

## SERIALIZABLE

가장 강한 표준 격리 수준입니다.

동시 실행 결과가 직렬 실행과 같은 효과를 가지도록 제한합니다.

동시성이 줄거나 Retry가 증가할 수 있습니다.

## 표준 이상 현상 표

전통적인 SQL 표준 설명은 다음처럼 기억합니다.

| Isolation Level | Dirty Read | Non-repeatable Read | Phantom Read |
| --- | --- | --- | --- |
| READ UNCOMMITTED | 가능 | 가능 | 가능 |
| READ COMMITTED | 방지 | 가능 | 가능 |
| REPEATABLE READ | 방지 | 방지 | 가능 |
| SERIALIZABLE | 방지 | 방지 | 방지 |

이 표는 시험용 기본 모델입니다.

<blockquote class="prompt-warning">
<p>실제 DBMS의 MVCC·Lock 구현에서는 같은 이름의 Isolation Level이라도 세부 동작이 표준 표와 다를 수 있습니다.</p>
</blockquote>

## 격리 수준과 성능

격리를 높이면 다음 현상이 생길 수 있습니다.

```text
Lock 대기 증가
충돌 증가
재시도 증가
동시 처리량 감소 가능
```

반대로 낮추면 동시성은 좋아질 수 있지만 읽기 일관성 문제가 늘 수 있습니다.

## MySQL·PostgreSQL 차이 관점

같은 REPEATABLE READ라도 MySQL InnoDB와 PostgreSQL은 내부 구현과 Phantom 처리 방식이 다릅니다.

따라서 실무에서는 격리 수준 이름만 보고 정확한 현상을 단정하지 않고 사용하는 DBMS 문서를 확인해야 합니다.

## SQLite의 Isolation

SQLite는 일반적인 서버형 DBMS와 동일한 네 단계 모델로 동작하지 않습니다.

기본적으로 별도 Connection 사이에서는 uncommitted 변경을 읽지 않으며, `PRAGMA read_uncommitted`도 공유 캐시 같은 특정 조건이 아니면 일반적인 Dirty Read를 허용하는 방식으로 단순 해석하면 안 됩니다.

SQLite에서는 Transaction 모드와 Journal/WAL 모드를 함께 봐야 합니다.

## 선택 기준

격리 수준은 다음을 함께 고려합니다.

```text
데이터 정확성 요구
동시 사용자 수
읽기/쓰기 비율
충돌 빈도
재시도 가능성
DBMS 구현
```

무조건 SERIALIZABLE이 가장 좋은 것은 아닙니다.

## 다른 개념과 비교

### 비교 1. READ UNCOMMITTED

```text
READ UNCOMMITTED
→ 가장 약한 표준 수준
```

`Isolation Level`과 비교할 때는 **언제 발생하는지**, **무엇을 보호하는지**, **실패 시 어떻게 처리하는지**를 함께 봅니다.

### 비교 2. READ COMMITTED

```text
READ COMMITTED
→ Dirty 방지
```

`Isolation Level`과 비교할 때는 **언제 발생하는지**, **무엇을 보호하는지**, **실패 시 어떻게 처리하는지**를 함께 봅니다.

### 비교 3. REPEATABLE READ

```text
REPEATABLE READ
→ Non-repeatable 방지
```

`Isolation Level`과 비교할 때는 **언제 발생하는지**, **무엇을 보호하는지**, **실패 시 어떻게 처리하는지**를 함께 봅니다.

### 비교 4. SERIALIZABLE

```text
SERIALIZABLE
→ 가장 강한 표준 수준
```

`Isolation Level`과 비교할 때는 **언제 발생하는지**, **무엇을 보호하는지**, **실패 시 어떻게 처리하는지**를 함께 봅니다.

## 구체적인 예시 연습

### 예시 1. RU

상황은 다음과 같습니다.

```text
미확정 읽기
```

핵심 판단:

```text
Dirty 가능
```

`Isolation Level`에서는 시간 순서를 직접 적어보면 문제를 훨씬 쉽게 풀 수 있습니다.

특히 두 Transaction이 등장하면 `T1`, `T2`의 Read·Write·COMMIT 순서를 세로로 나누어 확인합니다.

### 예시 2. RC

상황은 다음과 같습니다.

```text
COMMIT 데이터만
```

핵심 판단:

```text
Dirty 방지
```

`Isolation Level`에서는 시간 순서를 직접 적어보면 문제를 훨씬 쉽게 풀 수 있습니다.

특히 두 Transaction이 등장하면 `T1`, `T2`의 Read·Write·COMMIT 순서를 세로로 나누어 확인합니다.

### 예시 3. RR

상황은 다음과 같습니다.

```text
같은 Row 재읽기
```

핵심 판단:

```text
Non-repeatable 방지
```

`Isolation Level`에서는 시간 순서를 직접 적어보면 문제를 훨씬 쉽게 풀 수 있습니다.

특히 두 Transaction이 등장하면 `T1`, `T2`의 Read·Write·COMMIT 순서를 세로로 나누어 확인합니다.

### 예시 4. Serializable

상황은 다음과 같습니다.

```text
직렬 수준
```

핵심 판단:

```text
세 현상 방지 목표
```

`Isolation Level`에서는 시간 순서를 직접 적어보면 문제를 훨씬 쉽게 풀 수 있습니다.

특히 두 Transaction이 등장하면 `T1`, `T2`의 Read·Write·COMMIT 순서를 세로로 나누어 확인합니다.

### 예시 5. 낮은 격리

상황은 다음과 같습니다.

```text
동시성 증가
```

핵심 판단:

```text
이상 현상 증가 가능
```

`Isolation Level`에서는 시간 순서를 직접 적어보면 문제를 훨씬 쉽게 풀 수 있습니다.

특히 두 Transaction이 등장하면 `T1`, `T2`의 Read·Write·COMMIT 순서를 세로로 나누어 확인합니다.

### 예시 6. 높은 격리

상황은 다음과 같습니다.

```text
일관성 증가
```

핵심 판단:

```text
대기 증가 가능
```

`Isolation Level`에서는 시간 순서를 직접 적어보면 문제를 훨씬 쉽게 풀 수 있습니다.

특히 두 Transaction이 등장하면 `T1`, `T2`의 Read·Write·COMMIT 순서를 세로로 나누어 확인합니다.

## 시간 순서 판별 연습

### 판별 1

상황:

```text
T1이 같은 데이터 또는 조건을 반복 조회하고 T2가 중간에 UPDATE/INSERT 후 COMMIT
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
T1이 같은 데이터 또는 조건을 반복 조회하고 T2가 중간에 UPDATE/INSERT 후 COMMIT
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
T1이 같은 데이터 또는 조건을 반복 조회하고 T2가 중간에 UPDATE/INSERT 후 COMMIT
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
T1이 같은 데이터 또는 조건을 반복 조회하고 T2가 중간에 UPDATE/INSERT 후 COMMIT
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
T1이 같은 데이터 또는 조건을 반복 조회하고 T2가 중간에 UPDATE/INSERT 후 COMMIT
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
T1이 같은 데이터 또는 조건을 반복 조회하고 T2가 중간에 UPDATE/INSERT 후 COMMIT
```

판단 순서:

```text
1. 누가 먼저 읽거나 쓰는가
2. COMMIT 여부는 무엇인가
3. 다른 Transaction이 어떤 값을 보는가
4. 최종 상태가 무엇인가
```

시간 순서를 적으면 용어 암기보다 훨씬 정확하게 판단할 수 있습니다.

### 판별 7

상황:

```text
T1이 같은 데이터 또는 조건을 반복 조회하고 T2가 중간에 UPDATE/INSERT 후 COMMIT
```

판단 순서:

```text
1. 누가 먼저 읽거나 쓰는가
2. COMMIT 여부는 무엇인가
3. 다른 Transaction이 어떤 값을 보는가
4. 최종 상태가 무엇인가
```

시간 순서를 적으면 용어 암기보다 훨씬 정확하게 판단할 수 있습니다.

### 판별 8

상황:

```text
T1이 같은 데이터 또는 조건을 반복 조회하고 T2가 중간에 UPDATE/INSERT 후 COMMIT
```

판단 순서:

```text
1. 누가 먼저 읽거나 쓰는가
2. COMMIT 여부는 무엇인가
3. 다른 Transaction이 어떤 값을 보는가
4. 최종 상태가 무엇인가
```

시간 순서를 적으면 용어 암기보다 훨씬 정확하게 판단할 수 있습니다.

### 판별 9

상황:

```text
T1이 같은 데이터 또는 조건을 반복 조회하고 T2가 중간에 UPDATE/INSERT 후 COMMIT
```

판단 순서:

```text
1. 누가 먼저 읽거나 쓰는가
2. COMMIT 여부는 무엇인가
3. 다른 Transaction이 어떤 값을 보는가
4. 최종 상태가 무엇인가
```

시간 순서를 적으면 용어 암기보다 훨씬 정확하게 판단할 수 있습니다.

### 판별 10

상황:

```text
T1이 같은 데이터 또는 조건을 반복 조회하고 T2가 중간에 UPDATE/INSERT 후 COMMIT
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

`Isolation Level` 문제에서는 시간 순서를 생략하지 않는 것이 가장 중요합니다.

### 실수 2. Lock 대기와 Deadlock을 같은 것으로 본다.

이 실수를 피하려면 다음 순서로 봅니다.

```text
Transaction 상태
→ Read / Write
→ COMMIT 여부
→ Lock 보유·대기
→ 최종 결과
```

`Isolation Level` 문제에서는 시간 순서를 생략하지 않는 것이 가장 중요합니다.

### 실수 3. Isolation Level 이름만 보고 모든 DBMS가 동일하게 동작한다고 생각한다.

이 실수를 피하려면 다음 순서로 봅니다.

```text
Transaction 상태
→ Read / Write
→ COMMIT 여부
→ Lock 보유·대기
→ 최종 결과
```

`Isolation Level` 문제에서는 시간 순서를 생략하지 않는 것이 가장 중요합니다.

### 실수 4. Dirty Read와 Non-repeatable Read를 같은 현상으로 본다.

이 실수를 피하려면 다음 순서로 봅니다.

```text
Transaction 상태
→ Read / Write
→ COMMIT 여부
→ Lock 보유·대기
→ 최종 결과
```

`Isolation Level` 문제에서는 시간 순서를 생략하지 않는 것이 가장 중요합니다.

### 실수 5. 2PL이 Deadlock까지 제거한다고 생각한다.

이 실수를 피하려면 다음 순서로 봅니다.

```text
Transaction 상태
→ Read / Write
→ COMMIT 여부
→ Lock 보유·대기
→ 최종 결과
```

`Isolation Level` 문제에서는 시간 순서를 생략하지 않는 것이 가장 중요합니다.

### 실수 6. Checkpoint가 모든 Log를 없애는 기능이라고 생각한다.

이 실수를 피하려면 다음 순서로 봅니다.

```text
Transaction 상태
→ Read / Write
→ COMMIT 여부
→ Lock 보유·대기
→ 최종 결과
```

`Isolation Level` 문제에서는 시간 순서를 생략하지 않는 것이 가장 중요합니다.

## 잘 놓치는 핵심

### 1. 표준 네 단계

대표적인 표준 격리 수준은 다음 네 가지입니다.

이 항목은 시험에서 비슷한 용어와 바꾸어 출제될 수 있으므로 시간 순서와 상태 변화를 함께 확인합니다.

### 2. READ UNCOMMITTED

아직 COMMIT되지 않은 다른 Transaction의 변경을 읽을 수 있는 수준으로 설명합니다.

이 항목은 시험에서 비슷한 용어와 바꾸어 출제될 수 있으므로 시간 순서와 상태 변화를 함께 확인합니다.

### 3. READ COMMITTED

다른 Transaction이 COMMIT한 데이터만 읽는 수준으로 설명합니다.

이 항목은 시험에서 비슷한 용어와 바꾸어 출제될 수 있으므로 시간 순서와 상태 변화를 함께 확인합니다.

### 4. REPEATABLE READ

같은 Transaction에서 이미 읽은 Row를 다시 읽을 때 같은 값을 유지하도록 하는 수준입니다.

이 항목은 시험에서 비슷한 용어와 바꾸어 출제될 수 있으므로 시간 순서와 상태 변화를 함께 확인합니다.

### 5. SERIALIZABLE

가장 강한 표준 격리 수준입니다.

이 항목은 시험에서 비슷한 용어와 바꾸어 출제될 수 있으므로 시간 순서와 상태 변화를 함께 확인합니다.

### 6. 표준 이상 현상 표

전통적인 SQL 표준 설명은 다음처럼 기억합니다.

이 항목은 시험에서 비슷한 용어와 바꾸어 출제될 수 있으므로 시간 순서와 상태 변화를 함께 확인합니다.

## 시험·면접

### 핵심 암기

```text
READ UNCOMMITTED → READ COMMITTED → REPEATABLE READ → SERIALIZABLE
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

Isolation Level은 동시에 실행되는 Transaction 사이에서 어느 정도의 간섭과 이상 현상을 허용할지 정하는 격리 수준입니다.

핵심은 데이터 일관성을 유지하면서 동시에 여러 작업을 안전하게 처리하고, 장애가 발생해도 정상 상태로 복구하는 것입니다.

## 예시로 한 바퀴

`Isolation Level` 문제를 만나면 다음처럼 시간을 세로로 적습니다.

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

### 1. 가장 강한 표준 격리 수준은?

① SERIALIZABLE  
② 항상 Table 삭제  
③ 항상 Index 생성  
④ 모든 Lock 해제 금지

<details>
<summary>정답</summary>

①

</details>

해설: `SERIALIZABLE`가 핵심입니다.

### 2. Dirty Read를 막는 최소 표준 수준은?

① READ COMMITTED  
② 항상 Table 삭제  
③ 항상 Index 생성  
④ 모든 Lock 해제 금지

<details>
<summary>정답</summary>

①

</details>

해설: `READ COMMITTED`가 핵심입니다.

### 3. 표준상 RR에서 가능할 수 있는 것은?

① Phantom Read  
② 항상 Table 삭제  
③ 항상 Index 생성  
④ 모든 Lock 해제 금지

<details>
<summary>정답</summary>

①

</details>

해설: `Phantom Read`가 핵심입니다.

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

**Dirty Read · Non-repeatable Read · Phantom Read**입니다.

격리 수준에서 자주 등장하는 세 가지 읽기 이상 현상을 실제 시간 순서 예시로 비교합니다.
