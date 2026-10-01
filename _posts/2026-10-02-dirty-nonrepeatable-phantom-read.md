---
title: Dirty Read · Non-repeatable Read · Phantom Read
date: 2026-10-02 08:30:00 +0900
slug: dirty-nonrepeatable-phantom-read
permalink: /posts/dirty-nonrepeatable-phantom-read/
categories: [CS, 데이터베이스]
tags: [DirtyRead, NonRepeatableRead, PhantomRead, IsolationLevel, Transaction, 동시성제어, 정보처리기사, NCS]
math: true
---

`Dirty Read`, `Non-repeatable Read`, `Phantom Read`는 <mark>여러 Transaction이 동시에 실행될 때 발생할 수 있는 대표적인 읽기 이상 현상</mark>입니다.

세 현상은 각각 **미확정 데이터**, **같은 Row의 값 변경**, **Row 집합 변경**으로 구분하면 가장 쉽습니다.

<blockquote class="prompt-info">
<p>한 줄: Dirty Read는 미확정 값, Non-repeatable Read는 같은 Row의 값 변화, Phantom Read는 Row 집합의 변화입니다.</p>
</blockquote>

<details markdown="1">
<summary>한 줄로</summary>

미확정 데이터를 읽으면 Dirty Read, 같은 Row의 값이 달라지면 Non-repeatable Read, 같은 조건의 Row 개수가 달라지면 Phantom Read입니다.

</details>

## 세 현상 한눈에 보기

| 현상 | 핵심 |
| --- | --- |
| Dirty Read | COMMIT되지 않은 데이터를 읽음 |
| Non-repeatable Read | 같은 Row를 다시 읽었는데 값이 달라짐 |
| Phantom Read | 같은 조건으로 다시 조회했는데 Row 집합이 달라짐 |

```text
미확정 값 읽음
→ Dirty Read
```

```text
같은 Row의 값 변경
→ Non-repeatable Read
```

```text
Row가 생기거나 사라짐
→ Phantom Read
```

## Dirty Read

`Dirty Read`는 다른 Transaction이 아직 `COMMIT`하지 않은 값을 읽는 현상입니다.

### 입력 Table · EMPLOYEE

| EMP_ID | EMP_NAME | SALARY |
| --- | --- | ---: |
| 1001 | 직원1 | 3000 |

### Transaction 1

직원1의 급여를 5000으로 수정했지만 아직 COMMIT하지 않았습니다.

```sql
BEGIN TRANSACTION;

UPDATE EMPLOYEE
SET SALARY = 5000
WHERE EMP_ID = 1001;
```

현재 Transaction 1 내부에서는 다음처럼 보입니다.

| EMP_ID | EMP_NAME | SALARY |
| --- | --- | ---: |
| 1001 | 직원1 | 5000 |

### Transaction 2

이때 Transaction 2가 같은 데이터를 읽습니다.

```sql
SELECT SALARY
FROM EMPLOYEE
WHERE EMP_ID = 1001;
```

만약 5000을 읽었다면 아직 확정되지 않은 값을 읽은 것입니다.

```text
Transaction 1
→ 5000으로 수정
→ COMMIT 안 함

Transaction 2
→ 5000 읽음
```

이후 Transaction 1이 ROLLBACK합니다.

```sql
ROLLBACK;
```

실제 데이터는 다시 3000이 됩니다.

```text
Transaction 2가 읽은 5000
→ 실제로는 취소된 값
→ Dirty Read
```

## Dirty Read 핵심

```text
미확정 데이터
→ 다른 Transaction이 읽음
```

핵심은 `COMMIT 이전 값`이라는 점입니다.

## Non-repeatable Read

`Non-repeatable Read`는 하나의 Transaction이 같은 Row를 두 번 읽었는데 값이 달라지는 현상입니다.

### 첫 번째 조회

Transaction 1이 직원1의 급여를 읽습니다.

```sql
SELECT SALARY
FROM EMPLOYEE
WHERE EMP_ID = 1001;
```

### 첫 번째 결과

| EMP_ID | SALARY |
| --- | ---: |
| 1001 | 3000 |

그 사이 Transaction 2가 같은 Row를 수정하고 COMMIT합니다.

```sql
UPDATE EMPLOYEE
SET SALARY = 4000
WHERE EMP_ID = 1001;

COMMIT;
```

Transaction 1이 같은 Row를 다시 조회합니다.

```sql
SELECT SALARY
FROM EMPLOYEE
WHERE EMP_ID = 1001;
```

### 두 번째 결과

| EMP_ID | SALARY |
| --- | ---: |
| 1001 | 4000 |

```text
첫 번째 조회
→ 3000

두 번째 조회
→ 4000
```

같은 Row인데 값이 달라졌습니다.

```text
같은 Row
+
다른 값
→ Non-repeatable Read
```

## Non-repeatable Read 핵심

Dirty Read와 달리 두 번째로 읽은 값은 이미 COMMIT된 값일 수 있습니다.

핵심은 미확정 여부가 아니라

```text
같은 Transaction 안에서
같은 Row를 반복 조회했는데
값이 달라짐
```

입니다.

## Phantom Read

`Phantom Read`는 같은 조건으로 두 번 조회했는데 Row의 집합이 달라지는 현상입니다.

### 입력 Table · EMPLOYEE

| EMP_ID | EMP_NAME | DEPT_ID |
| --- | --- | --- |
| 1001 | 직원1 | 10 |
| 1002 | 직원2 | 10 |
| 1003 | 직원3 | 20 |

Transaction 1이 개발 부서 직원들을 조회합니다.

```sql
SELECT EMP_ID, EMP_NAME, DEPT_ID
FROM EMPLOYEE
WHERE DEPT_ID = 10;
```

### 첫 번째 결과

| EMP_ID | EMP_NAME | DEPT_ID |
| --- | --- | --- |
| 1001 | 직원1 | 10 |
| 1002 | 직원2 | 10 |

그 사이 Transaction 2가 개발 부서 직원 한 명을 추가하고 COMMIT합니다.

```sql
INSERT INTO EMPLOYEE(
    EMP_ID,
    EMP_NAME,
    DEPT_ID
)
VALUES (
    1004,
    '직원4',
    10
);

COMMIT;
```

Transaction 1이 같은 조건으로 다시 조회합니다.

```sql
SELECT EMP_ID, EMP_NAME, DEPT_ID
FROM EMPLOYEE
WHERE DEPT_ID = 10;
```

### 두 번째 결과

| EMP_ID | EMP_NAME | DEPT_ID |
| --- | --- | --- |
| 1001 | 직원1 | 10 |
| 1002 | 직원2 | 10 |
| 1004 | 직원4 | 10 |

```text
첫 번째 조회
→ 2개 Row

두 번째 조회
→ 3개 Row
```

새로운 Row가 나타났습니다.

```text
같은 조건
+
Row 집합 변화
→ Phantom Read
```

## Phantom Read 핵심

Non-repeatable Read와 가장 많이 헷갈립니다.

```text
기존 Row의 값 변경
→ Non-repeatable Read
```

```text
Row 자체가 추가 또는 삭제
→ Phantom Read
```

## 세 현상 비교

| 구분 | Dirty Read | Non-repeatable Read | Phantom Read |
| --- | --- | --- | --- |
| 핵심 | 미확정 값 읽기 | 같은 Row 값 변화 | Row 집합 변화 |
| 다른 Transaction COMMIT 필요 | 아니어도 발생 | 일반적으로 COMMIT 후 변화 | 일반적으로 COMMIT 후 변화 |
| 대표 변화 | 3000 → 미확정 5000 | 3000 → 4000 | 2개 Row → 3개 Row |
| 초점 | 확정 여부 | Row의 값 | Row의 존재 여부 |

## 가장 빠른 구분법

시험에서는 다음 세 문장으로 구분하면 됩니다.

```text
COMMIT 안 된 값 읽음
→ Dirty Read
```

```text
같은 사람 다시 봤는데 급여가 바뀜
→ Non-repeatable Read
```

```text
같은 조건으로 다시 검색했는데 사람이 늘어남
→ Phantom Read
```

## Dirty Read와 Non-repeatable Read 차이

### Dirty Read

```text
아직 COMMIT 안 됨
→ 그 값을 읽음
```

핵심은 `미확정 데이터`입니다.

### Non-repeatable Read

```text
다른 Transaction이 수정 후 COMMIT
→ 같은 Row를 다시 읽음
→ 값이 달라짐
```

핵심은 `반복 조회 결과 변화`입니다.

| 구분 | Dirty Read | Non-repeatable Read |
| --- | --- | --- |
| COMMIT 여부 | 미확정 값 | 확정된 변경일 수 있음 |
| 핵심 | 잘못된 중간값 읽기 | 같은 Row 값이 달라짐 |

## Non-repeatable Read와 Phantom Read 차이

### Non-repeatable Read

같은 Row가 존재하지만 값이 바뀝니다.

```text
직원1
3000 → 4000
```

### Phantom Read

조회 조건에 해당하는 Row가 추가되거나 삭제됩니다.

```text
개발 부서 직원
2명 → 3명
```

```text
값 변화
→ Non-repeatable Read

Row 집합 변화
→ Phantom Read
```

## Isolation Level과 연결

SQL 표준 기준으로 격리 수준에 따라 허용 여부가 달라집니다.

| 격리 수준 | Dirty Read | Non-repeatable Read | Phantom Read |
| --- | --- | --- | --- |
| Read Uncommitted | 가능 | 가능 | 가능 |
| Read Committed | 방지 | 가능 | 가능 |
| Repeatable Read | 방지 | 방지 | 가능 |
| Serializable | 방지 | 방지 | 방지 |

```text
Read Uncommitted
→ 모두 가능
```

```text
Read Committed
→ Dirty Read 방지
```

```text
Repeatable Read
→ Non-repeatable Read까지 방지
```

```text
Serializable
→ Phantom Read까지 방지
```

<blockquote class="prompt-warning">
<p>실제 DBMS는 MVCC나 Lock 구현 방식에 따라 SQL 표준 표와 다르게 동작할 수 있으므로 실무에서는 사용하는 DBMS의 동작을 확인해야 합니다.</p>
</blockquote>

## 잘 놓치는 핵심

### 1. Dirty Read는 미확정 데이터

다른 Transaction이 ROLLBACK하면 읽었던 값 자체가 사라질 수 있습니다.

### 2. Non-repeatable Read는 같은 Row

Row는 같은데 내부 값이 달라집니다.

### 3. Phantom Read는 Row 집합

같은 조건으로 조회했는데 새로운 Row가 생기거나 기존 Row가 사라집니다.

### 4. 세 현상을 순서로 외우지 말고 변화 대상을 본다

```text
확정 여부
→ Dirty

값
→ Non-repeatable

Row
→ Phantom
```

## 시험·면접

### 핵심 암기

```text
Dirty Read
→ 미확정 데이터 읽기
```

```text
Non-repeatable Read
→ 같은 Row 값 변화
```

```text
Phantom Read
→ Row 집합 변화
```

### 시험 함정

두 번 조회한 결과가 달라졌다고 무조건 Phantom Read는 아닙니다.

같은 Row의 값만 바뀌었다면 Non-repeatable Read이고, 조회되는 Row 자체가 추가되거나 삭제되었다면 Phantom Read입니다.

### 면접 짧은 답변

Dirty Read는 다른 Transaction이 아직 COMMIT하지 않은 값을 읽는 현상입니다. Non-repeatable Read는 같은 Transaction에서 같은 Row를 다시 읽었을 때 값이 달라지는 현상이고, Phantom Read는 같은 조건으로 다시 조회했을 때 Row가 추가되거나 삭제되어 결과 집합이 달라지는 현상입니다.

## 객관식 문제

### 문제 1 · Dirty Read

다른 Transaction이 아직 COMMIT하지 않은 데이터를 읽은 현상은?

① Dirty Read  
② Non-repeatable Read  
③ Phantom Read  
④ Deadlock

<details markdown="1">
<summary>정답</summary>

①

미확정 데이터를 읽는 현상은 Dirty Read입니다.

</details>

### 문제 2 · Non-repeatable Read

같은 직원의 급여를 두 번 조회했는데 3000에서 4000으로 변경되어 있었다면?

① Dirty Read  
② Non-repeatable Read  
③ Phantom Read  
④ Lost Update

<details markdown="1">
<summary>정답</summary>

②

같은 Row의 값이 반복 조회 사이에 달라졌으므로 Non-repeatable Read입니다.

</details>

### 문제 3 · Phantom Read

같은 조건으로 직원 목록을 두 번 조회했는데 2명에서 3명으로 늘어났다면?

① Dirty Read  
② Non-repeatable Read  
③ Phantom Read  
④ ROLLBACK

<details markdown="1">
<summary>정답</summary>

③

같은 조건에서 Row 집합 자체가 달라졌으므로 Phantom Read입니다.

</details>

### 문제 4 · 구분

다음 연결 중 옳지 않은 것은?

① Dirty Read → 미확정 값  
② Non-repeatable Read → 같은 Row 값 변화  
③ Phantom Read → Row 집합 변화  
④ Phantom Read → 반드시 미확정 값 읽기

<details markdown="1">
<summary>정답</summary>

④

미확정 값을 읽는 현상은 Dirty Read입니다.

</details>

### 문제 5 · Isolation Level

SQL 표준 기준으로 Dirty Read, Non-repeatable Read, Phantom Read를 모두 방지하는 수준은?

① Read Uncommitted  
② Read Committed  
③ Repeatable Read  
④ Serializable

<details markdown="1">
<summary>정답</summary>

④

Serializable은 세 가지 대표 읽기 이상 현상을 모두 방지하는 가장 높은 격리 수준입니다.

</details>

## 세 현상 전체 요약

| 현상 | 기억할 말 |
| --- | --- |
| Dirty Read | 미확정 값을 읽음 |
| Non-repeatable Read | 같은 Row 값이 달라짐 |
| Phantom Read | Row 집합이 달라짐 |

```text
미확정
→ Dirty
```

```text
값
→ Non-repeatable
```

```text
Row
→ Phantom
```

<blockquote class="prompt-danger">
<p>문제에서 두 번 조회한 결과가 달라졌다면 값이 바뀐 것인지, Row 자체가 생기거나 사라진 것인지부터 구분합니다.</p>
</blockquote>

## 다음에 이을 글

**Deadlock**입니다.

두 Transaction이 서로 상대방이 가진 Lock을 기다리면서 더 이상 진행하지 못하는 교착상태의 발생 조건과 해결 방법을 살펴봅니다.
