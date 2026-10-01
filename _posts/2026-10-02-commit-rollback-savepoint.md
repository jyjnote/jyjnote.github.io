---
title: COMMIT · ROLLBACK · SAVEPOINT
date: 2026-10-02 08:10:00 +0900
slug: commit-rollback-savepoint
permalink: /posts/commit-rollback-savepoint/
categories: [CS, 데이터베이스]
tags: [COMMIT, ROLLBACK, SAVEPOINT, Transaction, TCL, 트랜잭션, 정보처리기사, NCS]
math: true
---

`COMMIT`, `ROLLBACK`, `SAVEPOINT`는 <mark>Transaction의 변경 내용을 확정하거나 취소하고, 중간 복구 지점을 만드는 명령</mark>입니다.

세 명령의 차이는 **전체 확정**, **전체 취소**, **특정 지점까지 취소**로 기억하면 됩니다.

<blockquote class="prompt-info">
<p>한 줄: COMMIT은 확정, ROLLBACK은 취소, SAVEPOINT는 중간 복구 지점입니다.</p>
</blockquote>

<details markdown="1">
<summary>한 줄로</summary>

COMMIT = 확정, ROLLBACK = 되돌리기, SAVEPOINT = 중간 저장 지점입니다.

</details>

## 전체 구조

| 명령 | 핵심 역할 |
| --- | --- |
| COMMIT | Transaction 변경 내용 확정 |
| ROLLBACK | Transaction 변경 내용 취소 |
| SAVEPOINT | Transaction 내부 중간 지점 생성 |

```text
정상 완료
→ COMMIT

문제 발생
→ ROLLBACK

일부만 되돌리고 싶음
→ SAVEPOINT
```

## COMMIT

`COMMIT`은 현재 Transaction에서 수행한 변경 내용을 최종 확정합니다.

### 입력 Table · ACCOUNT

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

`COMMIT`이 실행되면 Transaction의 변경 내용이 확정됩니다.

```text
작업 수행
↓
COMMIT
↓
변경 확정
```

## COMMIT 이후

COMMIT된 변경 내용은 일반적으로 해당 Transaction의 단순 ROLLBACK으로 되돌릴 수 없습니다.

```text
UPDATE
↓
COMMIT
↓
확정
```

따라서 COMMIT 전에는 변경 내용을 다시 확인하는 것이 중요합니다.

<blockquote class="prompt-warning">
<p>COMMIT 이후의 복구 방식은 DBMS의 백업·로그·복구 기능 등에 따라 달라질 수 있습니다.</p>
</blockquote>

## ROLLBACK

`ROLLBACK`은 현재 Transaction에서 아직 확정하지 않은 변경 내용을 취소합니다.

### 입력 Table · ACCOUNT

| ACCOUNT_ID | BALANCE |
| --- | ---: |
| A | 50000 |
| B | 30000 |

A 계좌에서 10,000원을 뺀 뒤 문제가 발생했다고 가정합니다.

```sql
BEGIN TRANSACTION;

UPDATE ACCOUNT
SET BALANCE = BALANCE - 10000
WHERE ACCOUNT_ID = 'A';

ROLLBACK;
```

### 결과 Table

| ACCOUNT_ID | BALANCE |
| --- | ---: |
| A | 50000 |
| B | 30000 |

변경 내용이 확정되지 않았으므로 원래 상태로 돌아갑니다.

```text
UPDATE
↓
문제 발생
↓
ROLLBACK
↓
변경 취소
```

## COMMIT과 ROLLBACK 비교

| 구분 | COMMIT | ROLLBACK |
| --- | --- | --- |
| 목적 | 변경 확정 | 변경 취소 |
| 결과 | 변경 내용 유지 | 이전 상태로 복구 |
| 사용 시점 | 정상 완료 | 오류·취소 필요 |
| Transaction | 종료되는 것이 일반적 | 취소 후 종료되는 것이 일반적 |

```text
COMMIT
→ 살린다

ROLLBACK
→ 되돌린다
```

## SAVEPOINT

`SAVEPOINT`는 Transaction 내부에 중간 복구 지점을 만듭니다.

전체 Transaction을 모두 취소하는 대신 특정 지점까지만 되돌릴 수 있습니다.

### 예시

```sql
BEGIN TRANSACTION;

UPDATE EMPLOYEE
SET BONUS = 300
WHERE EMP_ID = 1001;

SAVEPOINT S1;

UPDATE EMPLOYEE
SET BONUS = 500
WHERE EMP_ID = 1002;

ROLLBACK TO S1;

COMMIT;
```

흐름은 다음과 같습니다.

```text
직원1 BONUS 수정
↓
SAVEPOINT S1
↓
직원2 BONUS 수정
↓
ROLLBACK TO S1
↓
직원2 수정만 취소
↓
COMMIT
```

즉, SAVEPOINT 이전 작업은 남기고 이후 작업만 되돌릴 수 있습니다.

## SAVEPOINT 예시

### 입력 Table · EMPLOYEE

| EMP_ID | EMP_NAME | BONUS |
| --- | --- | ---: |
| 1001 | 직원1 | 100 |
| 1002 | 직원2 | 100 |

```sql
BEGIN TRANSACTION;

UPDATE EMPLOYEE
SET BONUS = 300
WHERE EMP_ID = 1001;

SAVEPOINT S1;

UPDATE EMPLOYEE
SET BONUS = 500
WHERE EMP_ID = 1002;

ROLLBACK TO S1;

COMMIT;
```

### 결과 Table

| EMP_ID | EMP_NAME | BONUS |
| --- | --- | ---: |
| 1001 | 직원1 | 300 |
| 1002 | 직원2 | 100 |

`S1` 이후의 직원2 수정만 취소되었습니다.

## 전체 ROLLBACK과 SAVEPOINT ROLLBACK 차이

### 전체 ROLLBACK

```sql
ROLLBACK;
```

```text
Transaction의 미확정 변경 전체 취소
```

### 특정 SAVEPOINT까지 ROLLBACK

```sql
ROLLBACK TO S1;
```

```text
S1 이후 변경만 취소
S1 이전 변경은 유지
```

| 구분 | ROLLBACK | ROLLBACK TO SAVEPOINT |
| --- | --- | --- |
| 취소 범위 | Transaction 전체 | 특정 지점 이후 |
| 중간 지점 필요 | 없음 | SAVEPOINT 필요 |
| 목적 | 전체 취소 | 부분 취소 |

## SAVEPOINT 여러 개 사용

하나의 Transaction 안에서 여러 SAVEPOINT를 만들 수도 있습니다.

```sql
BEGIN TRANSACTION;

UPDATE EMPLOYEE
SET BONUS = 200
WHERE EMP_ID = 1001;

SAVEPOINT S1;

UPDATE EMPLOYEE
SET BONUS = 300
WHERE EMP_ID = 1002;

SAVEPOINT S2;

UPDATE EMPLOYEE
SET BONUS = 400
WHERE EMP_ID = 1003;

ROLLBACK TO S2;

COMMIT;
```

흐름은 다음과 같습니다.

```text
직원1 수정
↓
S1
↓
직원2 수정
↓
S2
↓
직원3 수정
↓
ROLLBACK TO S2
```

직원3의 수정은 취소되고 S2 이전 변경은 남습니다.

## Transaction 흐름으로 보기

```text
BEGIN
↓
작업 1
↓
SAVEPOINT
↓
작업 2
↓
문제 발생
↓
ROLLBACK TO SAVEPOINT
↓
다른 작업 계속
↓
COMMIT
```

SAVEPOINT는 긴 Transaction에서 일부 작업만 취소하고 나머지는 유지하고 싶을 때 유용합니다.

## TCL

`COMMIT`, `ROLLBACK`, `SAVEPOINT`는 일반적으로 Transaction을 제어하는 명령으로 분류합니다.

```text
TCL
→ Transaction Control Language
→ Transaction 제어
```

대표 명령은 다음과 같습니다.

```text
COMMIT
ROLLBACK
SAVEPOINT
```

## 자동 Commit과 주의점

자동 Commit이 켜져 있다면 SQL 실행 직후 변경 내용이 자동 확정될 수 있습니다.

```text
자동 Commit 켜짐
→ SQL 실행
→ 자동 COMMIT
```

이 경우 사용자가 기대한 방식으로 ROLLBACK이 동작하지 않을 수 있습니다.

따라서 실습 환경의 자동 Commit 설정을 먼저 확인해야 합니다.

<blockquote class="prompt-warning">
<p>Transaction 시작 방식, SAVEPOINT 문법, 자동 Commit 동작은 DBMS와 사용하는 도구에 따라 차이가 있을 수 있습니다.</p>
</blockquote>

## 잘 놓치는 핵심

### 1. COMMIT은 확정

```text
COMMIT
→ 변경 내용 확정
```

### 2. ROLLBACK은 미확정 변경 취소

```text
ROLLBACK
→ Transaction 변경 취소
```

### 3. SAVEPOINT는 중간 복구 지점

```text
SAVEPOINT S1
→ 중간 지점 생성
```

### 4. ROLLBACK TO는 일부만 되돌린다

```text
ROLLBACK TO S1
→ S1 이후 작업 취소
```

## 시험·면접

### 핵심 암기

```text
COMMIT
→ 확정
```

```text
ROLLBACK
→ 전체 취소
```

```text
SAVEPOINT
→ 중간 지점
```

```text
ROLLBACK TO
→ 특정 지점 이후 취소
```

### 시험 함정

`SAVEPOINT` 자체가 Transaction을 확정하는 명령은 아닙니다.

SAVEPOINT는 단지 중간 복구 지점을 만들며 최종 확정은 `COMMIT`으로 수행합니다.

또한 COMMIT 이후에는 일반적인 Transaction ROLLBACK으로 이전 상태로 되돌릴 수 없습니다.

### 면접 짧은 답변

`COMMIT`은 Transaction에서 수행한 변경 내용을 확정하고, `ROLLBACK`은 아직 확정하지 않은 변경 내용을 취소합니다. `SAVEPOINT`는 Transaction 내부에 중간 복구 지점을 만들어 `ROLLBACK TO`를 이용해 해당 지점 이후의 작업만 선택적으로 취소할 수 있도록 합니다.

## 객관식 문제

### 문제 1 · COMMIT

Transaction의 변경 내용을 최종 확정하는 명령은?

① ROLLBACK  
② SAVEPOINT  
③ COMMIT  
④ DELETE

<details markdown="1">
<summary>정답</summary>

③

`COMMIT`은 현재 Transaction의 변경 내용을 확정합니다.

</details>

### 문제 2 · ROLLBACK

현재 Transaction의 미확정 변경 내용을 취소할 때 사용하는 명령은?

① COMMIT  
② ROLLBACK  
③ GRANT  
④ CREATE

<details markdown="1">
<summary>정답</summary>

②

`ROLLBACK`은 아직 확정되지 않은 변경 내용을 취소합니다.

</details>

### 문제 3 · SAVEPOINT

SAVEPOINT의 역할로 가장 적절한 것은?

① Table 생성  
② Transaction 중간 복구 지점 생성  
③ 변경 내용 최종 확정  
④ 사용자 권한 회수

<details markdown="1">
<summary>정답</summary>

②

`SAVEPOINT`는 Transaction 내부의 중간 복구 지점을 만듭니다.

</details>

### 문제 4 · 부분 취소

다음 SQL의 의미로 옳은 것은?

```sql
ROLLBACK TO S1;
```

① Transaction 전체를 확정한다.  
② S1 이전 작업까지 모두 삭제한다.  
③ S1 이후의 변경을 취소한다.  
④ 새로운 SAVEPOINT를 만든다.

<details markdown="1">
<summary>정답</summary>

③

`ROLLBACK TO S1`은 S1 이후의 변경을 되돌리는 데 사용합니다.

</details>

### 문제 5 · 구분

다음 연결 중 옳지 않은 것은?

① COMMIT → 확정  
② ROLLBACK → 취소  
③ SAVEPOINT → 중간 지점  
④ SAVEPOINT → 최종 확정

<details markdown="1">
<summary>정답</summary>

④

SAVEPOINT는 최종 확정 명령이 아니라 중간 복구 지점을 만드는 명령입니다.

</details>

## COMMIT · ROLLBACK · SAVEPOINT 전체 요약

| 명령 | 핵심 |
| --- | --- |
| COMMIT | 변경 확정 |
| ROLLBACK | 변경 취소 |
| SAVEPOINT | 중간 복구 지점 |
| ROLLBACK TO | 특정 지점 이후 취소 |

```text
정상 완료
→ COMMIT
```

```text
전체 취소
→ ROLLBACK
```

```text
부분 취소
→ SAVEPOINT
→ ROLLBACK TO
```

<blockquote class="prompt-danger">
<p>문제에서는 확정인지, 전체 취소인지, 특정 지점 이후만 취소하는지 먼저 구분하면 명령을 빠르게 판단할 수 있습니다.</p>
</blockquote>

## 다음에 이을 글

**동시성 제어**입니다.

여러 Transaction이 동시에 실행될 때 데이터 충돌과 일관성 문제를 어떻게 제어하는지 살펴봅니다.
