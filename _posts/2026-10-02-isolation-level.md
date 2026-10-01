---
title: Isolation Level · 격리 수준
date: 2026-10-02 08:25:00 +0900
slug: isolation-level
permalink: /posts/isolation-level/
categories: [CS, 데이터베이스]
tags: [IsolationLevel, 격리수준, Transaction, DirtyRead, NonRepeatableRead, PhantomRead, 동시성제어, 정보처리기사, NCS]
math: true
---

`Isolation Level`은 <mark>여러 Transaction이 동시에 실행될 때 서로의 작업을 어느 정도까지 격리할지 정하는 수준</mark>입니다.

격리 수준이 높을수록 데이터 일관성은 강해지지만 동시 처리 성능은 낮아질 수 있습니다.

<blockquote class="prompt-info">
<p>한 줄: Isolation Level은 Transaction 사이의 간섭을 얼마나 허용할지 정하는 기준입니다.</p>
</blockquote>

<details markdown="1">
<summary>한 줄로</summary>

격리 수준이 높아질수록 이상 현상은 줄어들지만 동시성은 낮아질 수 있습니다.

</details>

## 전체 단계

SQL 표준에서 대표적으로 다음 네 단계로 구분합니다.

```text
Read Uncommitted
↓
Read Committed
↓
Repeatable Read
↓
Serializable
```

아래로 갈수록 일반적으로 격리 수준이 높아집니다.

```text
격리 수준
↑

데이터 안정성
↑

동시성
↓
```

## 세 가지 대표 이상 현상

Isolation Level을 이해하려면 먼저 세 가지 문제를 구분해야 합니다.

| 현상 | 핵심 |
| --- | --- |
| Dirty Read | 아직 COMMIT되지 않은 데이터를 읽음 |
| Non-repeatable Read | 같은 Row를 다시 읽었는데 값이 달라짐 |
| Phantom Read | 같은 조건으로 다시 조회했는데 Row 집합이 달라짐 |

이 세 현상은 다음 글에서 각각 더 자세히 다룹니다.

## Read Uncommitted

가장 낮은 수준의 격리입니다.

다른 Transaction이 아직 COMMIT하지 않은 데이터도 읽을 수 있습니다.

### 상황

```text
Transaction 1
→ SALARY를 3000에서 5000으로 수정
→ 아직 COMMIT 안 함
```

```text
Transaction 2
→ SALARY = 5000을 읽음
```

이후 Transaction 1이 ROLLBACK하면 실제로 존재하지 않게 될 값을 Transaction 2가 읽은 셈입니다.

```text
미확정 데이터 읽음
→ Dirty Read
```

Read Uncommitted에서는 Dirty Read가 발생할 수 있습니다.

## Read Committed

다른 Transaction이 COMMIT한 데이터만 읽도록 제한합니다.

따라서 Dirty Read는 방지됩니다.

### 첫 번째 조회

| EMP_ID | SALARY |
| --- | ---: |
| 1001 | 3000 |

Transaction 1이 다음 값을 읽었다고 가정합니다.

```text
SALARY
→ 3000
```

그 사이 Transaction 2가 값을 수정하고 COMMIT합니다.

```sql
UPDATE EMPLOYEE
SET SALARY = 4000
WHERE EMP_ID = 1001;

COMMIT;
```

Transaction 1이 같은 Row를 다시 조회하면

```text
SALARY
→ 4000
```

이 될 수 있습니다.

```text
같은 Row를 두 번 읽음
3000 → 4000
→ Non-repeatable Read
```

즉, Read Committed는 Dirty Read는 막지만 Non-repeatable Read는 발생할 수 있습니다.

## Repeatable Read

하나의 Transaction 안에서 같은 Row를 반복해서 읽을 때 동일한 결과를 유지하도록 하는 수준입니다.

```text
첫 번째 조회
→ SALARY = 3000

두 번째 조회
→ SALARY = 3000
```

따라서 Dirty Read와 Non-repeatable Read를 방지합니다.

다만 SQL 표준 기준으로는 같은 조건으로 조회했을 때 새로운 Row가 추가되는 `Phantom Read`는 발생할 수 있습니다.

### 예시

첫 번째 조회에서

```sql
SELECT *
FROM EMPLOYEE
WHERE DEPT_ID = 10;
```

결과가 다음과 같다고 가정합니다.

| EMP_ID | DEPT_ID |
| --- | --- |
| 1001 | 10 |
| 1002 | 10 |

다른 Transaction이 새로운 Row를 추가하고 COMMIT합니다.

```sql
INSERT INTO EMPLOYEE(
    EMP_ID,
    EMP_NAME,
    DEPT_ID
)
VALUES (
    1003,
    '직원3',
    10
);

COMMIT;
```

같은 조건으로 다시 조회했을 때

| EMP_ID | DEPT_ID |
| --- | --- |
| 1001 | 10 |
| 1002 | 10 |
| 1003 | 10 |

새로운 Row가 나타날 수 있습니다.

```text
같은 조건 재조회
→ 새로운 Row 출현
→ Phantom Read
```

## Serializable

가장 높은 수준의 격리입니다.

여러 Transaction을 병행 실행하더라도 결과가 순차적으로 하나씩 실행한 것과 같은 효과를 내도록 합니다.

```text
Transaction 1
↓
Transaction 2
```

처럼 직렬 실행한 것과 동일한 결과를 목표로 합니다.

SQL 표준 기준으로 다음 세 가지 문제를 모두 방지합니다.

```text
Dirty Read
→ 방지

Non-repeatable Read
→ 방지

Phantom Read
→ 방지
```

대신 Lock 대기나 충돌이 증가해 동시 처리 성능이 낮아질 수 있습니다.

## 격리 수준 비교

| 격리 수준 | Dirty Read | Non-repeatable Read | Phantom Read |
| --- | --- | --- | --- |
| Read Uncommitted | 가능 | 가능 | 가능 |
| Read Committed | 방지 | 가능 | 가능 |
| Repeatable Read | 방지 | 방지 | 가능 |
| Serializable | 방지 | 방지 | 방지 |

이 표는 시험에서 가장 중요합니다.

```text
Read Uncommitted
→ 모두 가능

Read Committed
→ Dirty만 방지

Repeatable Read
→ Dirty + Non-repeatable 방지

Serializable
→ 모두 방지
```

<blockquote class="prompt-warning">
<p>실제 DBMS는 내부 구현 방식이 달라 SQL 표준 표와 다른 현상이 나타날 수 있으므로 실무에서는 사용하는 DBMS의 문서를 확인해야 합니다.</p>
</blockquote>

## 격리 수준이 높으면 무조건 좋은가

격리 수준이 높다고 항상 더 좋은 것은 아닙니다.

높은 격리는 데이터 안정성을 높이지만 대기와 충돌도 증가시킬 수 있습니다.

```text
격리 수준 증가
→ 데이터 안정성 증가
→ 동시성 감소 가능
```

반대로 격리 수준이 낮으면

```text
동시 처리 성능 증가 가능
→ 이상 현상 위험 증가
```

따라서 시스템 특성에 맞는 수준을 선택해야 합니다.

## Read Committed와 Repeatable Read 차이

둘은 시험에서 자주 비교됩니다.

### Read Committed

```text
COMMIT된 데이터만 읽음
→ Dirty Read 방지
```

하지만 같은 Row를 다시 읽으면 값이 바뀔 수 있습니다.

### Repeatable Read

```text
같은 Row 반복 조회
→ 같은 결과 유지
```

따라서 Non-repeatable Read까지 방지합니다.

| 구분 | Read Committed | Repeatable Read |
| --- | --- | --- |
| Dirty Read | 방지 | 방지 |
| Non-repeatable Read | 가능 | 방지 |
| Phantom Read | 가능 | 표준상 가능 |

## Non-repeatable Read와 Phantom Read 차이

### Non-repeatable Read

같은 `Row`의 값이 달라집니다.

```text
첫 조회
→ 직원1 SALARY = 3000

두 번째 조회
→ 직원1 SALARY = 4000
```

### Phantom Read

같은 `조건`으로 조회했는데 Row 자체가 늘거나 줄어듭니다.

```text
첫 조회
→ 2개 Row

두 번째 조회
→ 3개 Row
```

```text
값이 바뀜
→ Non-repeatable Read

Row 집합이 바뀜
→ Phantom Read
```

## Isolation과 Lock

격리 수준은 내부적으로 Lock이나 MVCC 같은 다양한 기법으로 구현할 수 있습니다.

```text
Isolation Level
→ 얼마나 격리할지 결정
```

```text
Lock · MVCC
→ 그 격리를 구현하는 방법
```

즉, Isolation Level은 정책이고 Lock은 이를 구현하는 수단 중 하나라고 볼 수 있습니다.

## 잘 놓치는 핵심

### 1. 가장 낮은 수준은 Read Uncommitted

Dirty Read까지 허용할 수 있습니다.

### 2. Read Committed는 Dirty Read만 먼저 막는다

Non-repeatable Read와 Phantom Read는 발생할 수 있습니다.

### 3. Repeatable Read는 같은 Row의 반복 조회를 보장한다

SQL 표준 기준으로 Phantom Read는 가능할 수 있습니다.

### 4. Serializable은 가장 강한 격리

세 가지 대표 이상 현상을 모두 방지합니다.

## 시험·면접

### 핵심 암기

```text
Read Uncommitted
→ Dirty O
→ Non-repeatable O
→ Phantom O
```

```text
Read Committed
→ Dirty X
→ Non-repeatable O
→ Phantom O
```

```text
Repeatable Read
→ Dirty X
→ Non-repeatable X
→ Phantom O
```

```text
Serializable
→ Dirty X
→ Non-repeatable X
→ Phantom X
```

### 시험 함정

`Repeatable Read`는 같은 Row의 값이 바뀌는 Non-repeatable Read를 방지합니다.

하지만 SQL 표준 기준으로 새로운 Row가 나타나는 Phantom Read까지 반드시 막는 것은 아닙니다.

### 면접 짧은 답변

Isolation Level은 여러 Transaction이 동시에 실행될 때 서로의 작업을 어느 정도까지 격리할지 정하는 기준입니다. 대표적으로 Read Uncommitted, Read Committed, Repeatable Read, Serializable이 있으며 수준이 높아질수록 Dirty Read, Non-repeatable Read, Phantom Read 같은 현상을 더 많이 방지하지만 동시성은 낮아질 수 있습니다.

## 객관식 문제

### 문제 1 · 가장 낮은 격리 수준

다음 중 가장 낮은 Isolation Level은?

① Serializable  
② Repeatable Read  
③ Read Committed  
④ Read Uncommitted

<details markdown="1">
<summary>정답</summary>

④

Read Uncommitted가 가장 낮은 격리 수준입니다.

</details>

### 문제 2 · Dirty Read

Dirty Read를 방지하기 시작하는 가장 낮은 수준은?

① Read Uncommitted  
② Read Committed  
③ Repeatable Read  
④ Serializable만 가능

<details markdown="1">
<summary>정답</summary>

②

Read Committed부터 다른 Transaction의 미확정 데이터를 읽지 않도록 합니다.

</details>

### 문제 3 · Non-repeatable Read

같은 Row를 반복 조회했을 때 같은 값을 유지하도록 하는 수준은?

① Read Uncommitted  
② Read Committed  
③ Repeatable Read  
④ 어떤 수준에서도 불가능

<details markdown="1">
<summary>정답</summary>

③

Repeatable Read는 같은 Row를 반복해서 읽을 때 값이 바뀌는 Non-repeatable Read를 방지합니다.

</details>

### 문제 4 · Phantom Read

SQL 표준 기준으로 Phantom Read를 방지하는 수준은?

① Read Uncommitted  
② Read Committed  
③ Repeatable Read  
④ Serializable

<details markdown="1">
<summary>정답</summary>

④

SQL 표준 기준으로 Serializable에서 Phantom Read까지 방지합니다.

</details>

### 문제 5 · 현상 구분

같은 조건으로 두 번 조회했는데 첫 번째에는 2개 Row, 두 번째에는 3개 Row가 조회되었다면?

① Dirty Read  
② Non-repeatable Read  
③ Phantom Read  
④ Lost Update

<details markdown="1">
<summary>정답</summary>

③

같은 조건의 조회에서 Row 집합 자체가 달라졌으므로 Phantom Read입니다.

</details>

## Isolation Level 전체 요약

| 수준 | Dirty | Non-repeatable | Phantom |
| --- | --- | --- | --- |
| Read Uncommitted | O | O | O |
| Read Committed | X | O | O |
| Repeatable Read | X | X | O |
| Serializable | X | X | X |

```text
격리 수준 증가
↓
이상 현상 감소
↓
동시성 감소 가능
```

<blockquote class="prompt-danger">
<p>Isolation Level 문제에서는 Dirty Read, Non-repeatable Read, Phantom Read 중 무엇을 막는 수준인지 표로 판단하면 가장 빠릅니다.</p>
</blockquote>

## 다음에 이을 글

**Dirty Read · Non-repeatable Read · Phantom Read**입니다.

세 가지 대표적인 Transaction 읽기 이상 현상을 실제 실행 흐름으로 비교합니다.
