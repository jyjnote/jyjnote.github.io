---
title: Transaction · 트랜잭션
date: 2026-10-02 08:00:00 +0900
slug: transaction
permalink: /posts/transaction/
categories: [CS, 데이터베이스]
tags: [Transaction, 트랜잭션, COMMIT, ROLLBACK, ACID, 정보처리기사, NCS]
math: true
---

`Transaction`은 <mark>데이터베이스에서 하나의 논리적인 작업 단위로 처리되는 연산들의 묶음</mark>입니다.

여러 SQL이 하나의 업무를 완성한다면 각각을 따로 보지 않고 하나의 Transaction으로 묶어 처리합니다.

<blockquote class="prompt-info">
<p>한 줄: Transaction은 함께 성공하거나 함께 취소되어야 하는 하나의 작업 단위입니다.</p>
</blockquote>

<details markdown="1">
<summary>한 줄로</summary>

여러 SQL을 하나의 업무 단위로 묶어 처리하는 것이 Transaction입니다.

</details>

## 왜 Transaction이 필요한가

계좌이체를 생각해보겠습니다.

```text
A 계좌
→ 10,000원 감소

B 계좌
→ 10,000원 증가
```

둘 중 하나만 실행되면 데이터가 잘못됩니다.

따라서 두 작업을 하나의 Transaction으로 묶어야 합니다.

## 대표 예시

### 입력 Table · ACCOUNT

| ACCOUNT_ID | BALANCE |
| --- | ---: |
| A | 50000 |
| B | 30000 |

A에서 B로 10,000원을 이체한다고 가정합니다.

```sql
BEGIN TRANSACTION;

UPDATE ACCOUNT
SET BALANCE = BALANCE - 10000
WHERE ACCOUNT_ID = 'A';

UPDATE ACCOUNT
SET BALANCE = BALANCE + 10000
WHERE ACCOUNT_ID = 'B';

COMMIT;
```

### 결과 Table

| ACCOUNT_ID | BALANCE |
| --- | ---: |
| A | 40000 |
| B | 40000 |

```text
Transaction 시작
↓
A 계좌 감소
↓
B 계좌 증가
↓
COMMIT
```

두 UPDATE가 하나의 업무 단위로 처리된 것입니다.

## 기본 흐름

정상적으로 끝나면 변경 내용을 확정합니다.

```text
Transaction 시작
↓
SQL 수행
↓
SQL 수행
↓
정상 완료
↓
COMMIT
```

문제가 발생하면 변경 내용을 취소할 수 있습니다.

```text
Transaction 시작
↓
SQL 수행
↓
오류 발생
↓
ROLLBACK
```

`COMMIT`, `ROLLBACK`, `SAVEPOINT`는 별도 글에서 자세히 다룹니다.

## 하나의 SQL도 Transaction이 될 수 있다

Transaction이 반드시 여러 SQL로 구성되어야 하는 것은 아닙니다.

```sql
UPDATE EMPLOYEE
SET SALARY = 3500
WHERE EMP_ID = 1001;
```

하나의 SQL이라도 하나의 논리적 작업 단위로 처리될 수 있습니다.

핵심은 SQL문의 개수가 아니라 <mark>어디까지를 하나의 작업 단위로 볼 것인지</mark>입니다.

## 주문 처리에서도 중요하다

주문 하나를 완료하기 위해 다음 작업이 함께 필요할 수 있습니다.

```text
주문 생성
+
주문 상품 저장
+
재고 감소
```

중간 작업 하나만 실패하면 주문 데이터와 재고가 서로 맞지 않을 수 있습니다.

따라서 관련 SQL을 하나의 Transaction으로 묶습니다.

### 입력 Table · PRODUCT

| PRODUCT_ID | PRODUCT_NAME | STOCK |
| --- | --- | ---: |
| P001 | 상품1 | 10 |

```sql
BEGIN TRANSACTION;

INSERT INTO ORDERS(
    ORDER_ID,
    CUSTOMER_ID,
    ORDER_DATE,
    STATUS
)
VALUES (
    'O1001',
    'C001',
    '2026-10-02',
    '결제완료'
);

UPDATE PRODUCT
SET STOCK = STOCK - 1
WHERE PRODUCT_ID = 'P001';

COMMIT;
```

### 결과

| 작업 | 결과 |
| --- | --- |
| 주문 생성 | 완료 |
| 재고 감소 | 10 → 9 |
| Transaction | 확정 |

## Transaction이 필요한 이유

### 1. 데이터 일관성 유지

업무상 함께 처리되어야 하는 SQL이 일부만 반영되는 것을 막을 수 있습니다.

### 2. 오류 발생 시 복구

작업 중 문제가 생기면 Transaction 단위로 변경 내용을 취소할 수 있습니다.

### 3. 동시 작업 제어

여러 사용자가 동시에 데이터를 변경할 때 Transaction을 기준으로 충돌을 관리합니다.

### 4. 장애 회복

장애가 발생했을 때 어떤 작업을 반영하고 어떤 작업을 되돌릴지 판단하는 기준이 됩니다.

## 자동 Commit

일부 DBMS나 개발 도구에서는 SQL 실행 후 자동으로 COMMIT되는 설정을 사용할 수 있습니다.

```text
자동 Commit 켜짐
→ SQL 실행 후 자동 확정
```

```text
자동 Commit 꺼짐
→ COMMIT 또는 ROLLBACK을 직접 결정
```

<blockquote class="prompt-warning">
<p>자동 Commit과 Transaction 시작 방식은 DBMS와 사용하는 도구에 따라 차이가 있을 수 있습니다.</p>
</blockquote>

## SQL과 Transaction 차이

| 구분 | SQL | Transaction |
| --- | --- | --- |
| 의미 | 개별 명령 | 논리적 작업 단위 |
| 예시 | UPDATE 1회 | 계좌이체 전체 |
| 범위 | 하나의 연산 | 하나 이상의 연산 가능 |
| 확정·취소 | 명령 자체 | 작업 단위로 관리 |

```text
SQL
→ 하나의 명령
```

```text
Transaction
→ 업무 단위
```

## Transaction과 ACID

Transaction이 안정적으로 처리되기 위한 대표적인 성질이 `ACID`입니다.

```text
Atomicity
Consistency
Isolation
Durability
```

이 네 가지는 다음 글에서 자세히 다룹니다.

```text
Transaction
→ 작업 단위

ACID
→ Transaction이 지켜야 할 핵심 성질
```

## 잘 놓치는 핵심

### 1. Transaction은 논리적 작업 단위다

SQL문의 개수로 판단하지 않습니다.

### 2. 여러 SQL이 하나의 Transaction을 구성할 수 있다

대표적인 예가 계좌이체입니다.

### 3. 정상 완료와 실패 처리를 구분한다

```text
정상 완료
→ COMMIT

문제 발생
→ ROLLBACK
```

### 4. 자동 Commit 설정을 확인한다

실습 환경에 따라 SQL 실행 즉시 확정될 수 있습니다.

## 시험·면접

### 핵심 암기

```text
Transaction
→ 논리적 작업 단위
```

```text
정상 완료
→ COMMIT
```

```text
오류 발생
→ ROLLBACK
```

```text
대표 예시
→ 계좌이체
```

### 시험 함정

Transaction은 SQL이 두 개 이상일 때만 존재하는 개념이 아닙니다.

하나의 SQL도 하나의 Transaction이 될 수 있으며, 기준은 논리적인 작업 단위입니다.

### 면접 짧은 답변

Transaction은 데이터베이스에서 하나의 논리적 작업 단위로 처리되는 연산들의 묶음입니다. 예를 들어 계좌이체는 출금과 입금이 함께 성공해야 하나의 업무가 완성되므로 하나의 Transaction으로 처리합니다. 정상적으로 끝나면 COMMIT하고 문제가 생기면 ROLLBACK할 수 있습니다.

## 객관식 문제

### 문제 1 · 개념

Transaction에 대한 설명으로 가장 적절한 것은?

① 데이터베이스 파일 하나  
② 하나의 논리적 작업 단위  
③ Column의 자료형  
④ Index의 종류

<details markdown="1">
<summary>정답</summary>

②

Transaction은 하나의 업무를 완성하기 위한 논리적 작업 단위입니다.

</details>

### 문제 2 · 계좌이체

출금과 입금을 하나의 Transaction으로 묶는 가장 중요한 이유는?

① Table 이름을 줄이기 위해  
② 둘 중 하나만 반영되는 상황을 막기 위해  
③ Column 수를 늘리기 위해  
④ Index를 제거하기 위해

<details markdown="1">
<summary>정답</summary>

②

출금과 입금은 함께 성공해야 하나의 이체가 완성됩니다.

</details>

### 문제 3 · COMMIT

Transaction의 변경 내용을 확정하는 명령은?

① SELECT  
② COMMIT  
③ DROP  
④ GRANT

<details markdown="1">
<summary>정답</summary>

②

`COMMIT`은 Transaction의 변경 내용을 확정합니다.

</details>

### 문제 4 · ROLLBACK

작업 중 문제가 발생해 변경 내용을 취소하려고 할 때 사용하는 명령은?

① ROLLBACK  
② CREATE  
③ INSERT  
④ REVOKE

<details markdown="1">
<summary>정답</summary>

①

`ROLLBACK`은 Transaction의 변경 내용을 취소할 때 사용합니다.

</details>

### 문제 5 · SQL 개수

다음 설명으로 옳은 것은?

① Transaction은 반드시 SQL 두 개 이상으로 구성된다.  
② 하나의 SQL도 하나의 Transaction이 될 수 있다.  
③ Transaction에는 UPDATE만 사용할 수 있다.  
④ SELECT는 항상 Transaction 밖에서만 실행된다.

<details markdown="1">
<summary>정답</summary>

②

Transaction의 기준은 SQL문의 개수가 아니라 논리적인 작업 단위입니다.

</details>

## Transaction 전체 요약

### 입력 Table

| ACCOUNT_ID | BALANCE |
| --- | ---: |
| A | 50000 |
| B | 30000 |

```sql
BEGIN TRANSACTION;

UPDATE ACCOUNT
SET BALANCE = BALANCE - 10000
WHERE ACCOUNT_ID = 'A';

UPDATE ACCOUNT
SET BALANCE = BALANCE + 10000
WHERE ACCOUNT_ID = 'B';

COMMIT;
```

### 결과 Table

| ACCOUNT_ID | BALANCE |
| --- | ---: |
| A | 40000 |
| B | 40000 |

```text
Transaction
→ 하나의 논리적 작업 단위
→ 정상 완료 시 COMMIT
→ 문제 발생 시 ROLLBACK
```

<blockquote class="prompt-danger">
<p>Transaction 문제에서는 개별 SQL보다 여러 연산이 하나의 업무 단위로 함께 처리되어야 하는지를 먼저 확인합니다.</p>
</blockquote>

## 다음에 이을 글

**ACID**입니다.

Transaction이 안정적으로 처리되기 위해 필요한 Atomicity, Consistency, Isolation, Durability의 네 가지 성질을 살펴봅니다.
