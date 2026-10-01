---
title: Dirty Read · Non-repeatable Read · Phantom Read
date: 2026-09-18 23:50:00 +0900
slug: dirty-nonrepeatable-phantom-read
permalink: /posts/dirty-nonrepeatable-phantom-read/
categories: [CS, 데이터베이스]
tags: [DirtyRead, NonRepeatableRead, PhantomRead, IsolationLevel, Transaction, Concurrency, 정보처리기사, NCS]
math: true
---

Dirty Read, Non-repeatable Read, Phantom Read는 동시에 실행되는 Transaction 때문에 읽기 결과가 달라지는 대표적인 동시성 이상 현상입니다.

이 글에서는 용어를 외우는 데서 끝내지 않고 Transaction의 시간 순서와 실제 결과를 연결해서 봅니다.

<blockquote class="prompt-info">
<p>한 줄: Dirty Read는 미확정 값, Non-repeatable Read는 같은 Row 값 변경, Phantom Read는 조건에 맞는 Row 집합 변경입니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

Dirty = 미확정 / Non-repeatable = 같은 Row 값 변화 / Phantom = Row 집합 변화

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


## Dirty Read

아직 COMMIT되지 않은 값을 다른 Transaction이 읽는 현상입니다.

```text
T1: SALARY 3000 → 4000 수정
T1: 아직 COMMIT 안 함

T2: SALARY = 4000 읽음

T1: ROLLBACK
```

T2는 결국 존재하지 않게 된 값을 읽었습니다.

## Dirty Read 시간 순서

표로 보면 더 쉽습니다.

| 순서 | T1 | T2 |
| --- | --- | --- |
| 1 | SALARY=4000 UPDATE | |
| 2 | 미확정 | SALARY=4000 READ |
| 3 | ROLLBACK | |
| 결과 | 실제 값은 3000 | T2는 잘못된 4000을 읽음 |

핵심은 **COMMIT 전 값**입니다.

## Non-repeatable Read

같은 Transaction에서 같은 Row를 두 번 읽었는데 값이 달라지는 현상입니다.

```text
T1: EMP_ID=1001 SALARY → 3000 읽음

T2: SALARY → 3500 수정
T2: COMMIT

T1: 같은 Row 다시 읽음
→ 3500
```

같은 Row를 다시 읽었는데 값이 바뀌었습니다.

## Non-repeatable 시간 순서

| 순서 | T1 | T2 |
| --- | --- | --- |
| 1 | EMP 1001 = 3000 READ | |
| 2 | | 3500 UPDATE |
| 3 | | COMMIT |
| 4 | EMP 1001 다시 READ → 3500 | |

핵심은 **같은 Row의 값 변화**입니다.

## Phantom Read

같은 조건으로 Query를 다시 실행했는데 조건에 맞는 Row 개수가 달라지는 현상입니다.

```text
T1:
SELECT *
FROM EMPLOYEE
WHERE SALARY >= 4000;
→ 3 Row

T2:
새 직원 INSERT
SALARY = 4500
COMMIT

T1:
같은 Query 다시 실행
→ 4 Row
```

새로운 Row가 유령처럼 나타난 것처럼 보입니다.

## Phantom 시간 순서

| 순서 | T1 | T2 |
| --- | --- | --- |
| 1 | SALARY>=4000 → 3 Row | |
| 2 | | 새 Row INSERT |
| 3 | | COMMIT |
| 4 | 같은 조건 재조회 → 4 Row | |

핵심은 **조건에 맞는 Row 집합 변화**입니다.

## 세 현상 비교

| 현상 | 무엇이 달라지는가 | 핵심 |
| --- | --- | --- |
| Dirty Read | 미확정 값 읽음 | COMMIT 전 데이터 |
| Non-repeatable Read | 같은 Row의 값 | UPDATE 영향 |
| Phantom Read | 조건 결과 Row 집합 | INSERT·DELETE 영향 |

이 표가 가장 중요한 시험 포인트입니다.

## UPDATE와 Phantom 구분

Phantom Read를 단순히 모든 값 변경으로 이해하면 안 됩니다.

전통적인 구분에서는

```text
기존 Row 값 변경
→ Non-repeatable Read

조건에 맞는 Row 추가·삭제
→ Phantom Read
```

로 나눕니다.

## Isolation Level 연결

전통적인 표준 설명은 다음과 같습니다.

```text
READ UNCOMMITTED
→ Dirty 가능

READ COMMITTED
→ Dirty 방지
→ Non-repeatable 가능

REPEATABLE READ
→ Non-repeatable 방지
→ Phantom 가능

SERIALIZABLE
→ 세 현상 방지
```

실제 DBMS 구현 차이는 별도로 확인합니다.

## 시험 빠른 구분

문제 문장에서 다음 단어를 찾습니다.

```text
아직 COMMIT 안 함
→ Dirty Read

같은 Row 다시 읽음
→ Non-repeatable Read

같은 조건 다시 조회
→ Phantom Read
```

이 세 문장만 기억해도 대부분 구분할 수 있습니다.

## 다른 개념과 비교

### 비교 1. Dirty Read

```text
Dirty Read
→ 미확정 값
```

`Dirty Read · Non-repeatable Read · Phantom Read`과 비교할 때는 **언제 발생하는지**, **무엇을 보호하는지**, **실패 시 어떻게 처리하는지**를 함께 봅니다.

### 비교 2. Non-repeatable

```text
Non-repeatable
→ 같은 Row 값 변화
```

`Dirty Read · Non-repeatable Read · Phantom Read`과 비교할 때는 **언제 발생하는지**, **무엇을 보호하는지**, **실패 시 어떻게 처리하는지**를 함께 봅니다.

### 비교 3. Phantom

```text
Phantom
→ Row 집합 변화
```

`Dirty Read · Non-repeatable Read · Phantom Read`과 비교할 때는 **언제 발생하는지**, **무엇을 보호하는지**, **실패 시 어떻게 처리하는지**를 함께 봅니다.

### 비교 4. Serializable

```text
Serializable
→ 세 현상 방지 목표
```

`Dirty Read · Non-repeatable Read · Phantom Read`과 비교할 때는 **언제 발생하는지**, **무엇을 보호하는지**, **실패 시 어떻게 처리하는지**를 함께 봅니다.

## 구체적인 예시 연습

### 예시 1. Dirty

상황은 다음과 같습니다.

```text
COMMIT 전 값 읽음
```

핵심 판단:

```text
미확정 데이터
```

`Dirty Read · Non-repeatable Read · Phantom Read`에서는 시간 순서를 직접 적어보면 문제를 훨씬 쉽게 풀 수 있습니다.

특히 두 Transaction이 등장하면 `T1`, `T2`의 Read·Write·COMMIT 순서를 세로로 나누어 확인합니다.

### 예시 2. Non-repeatable

상황은 다음과 같습니다.

```text
같은 PK 다시 읽음
```

핵심 판단:

```text
값 변경
```

`Dirty Read · Non-repeatable Read · Phantom Read`에서는 시간 순서를 직접 적어보면 문제를 훨씬 쉽게 풀 수 있습니다.

특히 두 Transaction이 등장하면 `T1`, `T2`의 Read·Write·COMMIT 순서를 세로로 나누어 확인합니다.

### 예시 3. Phantom

상황은 다음과 같습니다.

```text
같은 조건 다시 조회
```

핵심 판단:

```text
Row 개수 변경
```

`Dirty Read · Non-repeatable Read · Phantom Read`에서는 시간 순서를 직접 적어보면 문제를 훨씬 쉽게 풀 수 있습니다.

특히 두 Transaction이 등장하면 `T1`, `T2`의 Read·Write·COMMIT 순서를 세로로 나누어 확인합니다.

### 예시 4. UPDATE

상황은 다음과 같습니다.

```text
기존 Row 값 변경
```

핵심 판단:

```text
Non-repeatable과 연결
```

`Dirty Read · Non-repeatable Read · Phantom Read`에서는 시간 순서를 직접 적어보면 문제를 훨씬 쉽게 풀 수 있습니다.

특히 두 Transaction이 등장하면 `T1`, `T2`의 Read·Write·COMMIT 순서를 세로로 나누어 확인합니다.

### 예시 5. INSERT

상황은 다음과 같습니다.

```text
조건 Row 추가
```

핵심 판단:

```text
Phantom과 연결
```

`Dirty Read · Non-repeatable Read · Phantom Read`에서는 시간 순서를 직접 적어보면 문제를 훨씬 쉽게 풀 수 있습니다.

특히 두 Transaction이 등장하면 `T1`, `T2`의 Read·Write·COMMIT 순서를 세로로 나누어 확인합니다.

### 예시 6. ROLLBACK

상황은 다음과 같습니다.

```text
읽은 값 사라짐
```

핵심 판단:

```text
Dirty 핵심
```

`Dirty Read · Non-repeatable Read · Phantom Read`에서는 시간 순서를 직접 적어보면 문제를 훨씬 쉽게 풀 수 있습니다.

특히 두 Transaction이 등장하면 `T1`, `T2`의 Read·Write·COMMIT 순서를 세로로 나누어 확인합니다.

## 시간 순서 판별 연습

### 판별 1

상황:

```text
T1 UPDATE → 미COMMIT / T2 READ / T1 ROLLBACK
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
T1 READ / T2 UPDATE+COMMIT / T1 같은 Row READ
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
T1 조건 조회 / T2 INSERT+COMMIT / T1 같은 조건 조회
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
T1 UPDATE → 미COMMIT / T2 READ / T1 ROLLBACK
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
T1 READ / T2 UPDATE+COMMIT / T1 같은 Row READ
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
T1 조건 조회 / T2 INSERT+COMMIT / T1 같은 조건 조회
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
T1 UPDATE → 미COMMIT / T2 READ / T1 ROLLBACK
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
T1 READ / T2 UPDATE+COMMIT / T1 같은 Row READ
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
T1 조건 조회 / T2 INSERT+COMMIT / T1 같은 조건 조회
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
T1 UPDATE → 미COMMIT / T2 READ / T1 ROLLBACK
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

`Dirty Read · Non-repeatable Read · Phantom Read` 문제에서는 시간 순서를 생략하지 않는 것이 가장 중요합니다.

### 실수 2. Lock 대기와 Deadlock을 같은 것으로 본다.

이 실수를 피하려면 다음 순서로 봅니다.

```text
Transaction 상태
→ Read / Write
→ COMMIT 여부
→ Lock 보유·대기
→ 최종 결과
```

`Dirty Read · Non-repeatable Read · Phantom Read` 문제에서는 시간 순서를 생략하지 않는 것이 가장 중요합니다.

### 실수 3. Isolation Level 이름만 보고 모든 DBMS가 동일하게 동작한다고 생각한다.

이 실수를 피하려면 다음 순서로 봅니다.

```text
Transaction 상태
→ Read / Write
→ COMMIT 여부
→ Lock 보유·대기
→ 최종 결과
```

`Dirty Read · Non-repeatable Read · Phantom Read` 문제에서는 시간 순서를 생략하지 않는 것이 가장 중요합니다.

### 실수 4. Dirty Read와 Non-repeatable Read를 같은 현상으로 본다.

이 실수를 피하려면 다음 순서로 봅니다.

```text
Transaction 상태
→ Read / Write
→ COMMIT 여부
→ Lock 보유·대기
→ 최종 결과
```

`Dirty Read · Non-repeatable Read · Phantom Read` 문제에서는 시간 순서를 생략하지 않는 것이 가장 중요합니다.

### 실수 5. 2PL이 Deadlock까지 제거한다고 생각한다.

이 실수를 피하려면 다음 순서로 봅니다.

```text
Transaction 상태
→ Read / Write
→ COMMIT 여부
→ Lock 보유·대기
→ 최종 결과
```

`Dirty Read · Non-repeatable Read · Phantom Read` 문제에서는 시간 순서를 생략하지 않는 것이 가장 중요합니다.

### 실수 6. Checkpoint가 모든 Log를 없애는 기능이라고 생각한다.

이 실수를 피하려면 다음 순서로 봅니다.

```text
Transaction 상태
→ Read / Write
→ COMMIT 여부
→ Lock 보유·대기
→ 최종 결과
```

`Dirty Read · Non-repeatable Read · Phantom Read` 문제에서는 시간 순서를 생략하지 않는 것이 가장 중요합니다.

## 잘 놓치는 핵심

### 1. Dirty Read

아직 COMMIT되지 않은 값을 다른 Transaction이 읽는 현상입니다.

이 항목은 시험에서 비슷한 용어와 바꾸어 출제될 수 있으므로 시간 순서와 상태 변화를 함께 확인합니다.

### 2. Dirty Read 시간 순서

표로 보면 더 쉽습니다.

이 항목은 시험에서 비슷한 용어와 바꾸어 출제될 수 있으므로 시간 순서와 상태 변화를 함께 확인합니다.

### 3. Non-repeatable Read

같은 Transaction에서 같은 Row를 두 번 읽었는데 값이 달라지는 현상입니다.

이 항목은 시험에서 비슷한 용어와 바꾸어 출제될 수 있으므로 시간 순서와 상태 변화를 함께 확인합니다.

### 4. Non-repeatable 시간 순서

| 순서 | T1 | T2 |

이 항목은 시험에서 비슷한 용어와 바꾸어 출제될 수 있으므로 시간 순서와 상태 변화를 함께 확인합니다.

### 5. Phantom Read

같은 조건으로 Query를 다시 실행했는데 조건에 맞는 Row 개수가 달라지는 현상입니다.

이 항목은 시험에서 비슷한 용어와 바꾸어 출제될 수 있으므로 시간 순서와 상태 변화를 함께 확인합니다.

### 6. Phantom 시간 순서

| 순서 | T1 | T2 |

이 항목은 시험에서 비슷한 용어와 바꾸어 출제될 수 있으므로 시간 순서와 상태 변화를 함께 확인합니다.

## 시험·면접

### 핵심 암기

```text
Dirty = 미확정 / Non-repeatable = 같은 Row 값 변화 / Phantom = Row 집합 변화
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

Dirty Read, Non-repeatable Read, Phantom Read는 동시에 실행되는 Transaction 때문에 읽기 결과가 달라지는 대표적인 동시성 이상 현상입니다.

핵심은 데이터 일관성을 유지하면서 동시에 여러 작업을 안전하게 처리하고, 장애가 발생해도 정상 상태로 복구하는 것입니다.

## 예시로 한 바퀴

`Dirty Read · Non-repeatable Read · Phantom Read` 문제를 만나면 다음처럼 시간을 세로로 적습니다.

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

### 1. 미확정 값 읽기는?

① Dirty Read  
② 항상 Table 삭제  
③ 항상 Index 생성  
④ 모든 Lock 해제 금지

<details>
<summary>정답</summary>

①

</details>

해설: `Dirty Read`가 핵심입니다.

### 2. 같은 Row 값 변화는?

① Non-repeatable Read  
② 항상 Table 삭제  
③ 항상 Index 생성  
④ 모든 Lock 해제 금지

<details>
<summary>정답</summary>

①

</details>

해설: `Non-repeatable Read`가 핵심입니다.

### 3. Row 집합 변화는?

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

**Deadlock**입니다.

서로 Lock을 기다리면서 어느 Transaction도 진행하지 못하는 Deadlock을 알아봅니다.
