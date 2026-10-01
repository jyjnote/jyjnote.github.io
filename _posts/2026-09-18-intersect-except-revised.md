---
title: INTERSECT · EXCEPT
date: 2026-09-18 22:45:00 +0900
slug: intersect-except
permalink: /posts/intersect-except/
categories: [CS, 데이터베이스]
tags: [INTERSECT, EXCEPT, 집합연산자, SQL, 교집합, 차집합, 정보처리기사, NCS]
math: true
---

`INTERSECT`와 `EXCEPT`는 <mark>두 SELECT 결과를 집합처럼 비교하는 연산자</mark>입니다.

`INTERSECT`는 양쪽 결과에 공통으로 존재하는 Row를 구하고, `EXCEPT`는 첫 번째 결과에만 존재하는 Row를 구합니다.

<blockquote class="prompt-info">
<p>한 줄: INTERSECT는 교집합, EXCEPT는 첫 번째 SELECT에서 두 번째 SELECT를 뺀 차집합입니다.</p>
</blockquote>

<details markdown="1">
<summary>한 줄로</summary>

`INTERSECT`는 공통 Row, `EXCEPT`는 첫 번째 결과에만 남는 Row를 반환합니다.

</details>

## INTERSECT

`INTERSECT`는 두 SELECT 결과에 모두 존재하는 Row만 반환합니다.

### 입력 Table 1 · A

| NAME |
| --- |
| 가 |
| 나 |
| 다 |

### 입력 Table 2 · B

| NAME |
| --- |
| 나 |
| 다 |
| 라 |

```sql
SELECT NAME
FROM A

INTERSECT

SELECT NAME
FROM B;
```

### 결과 Table

| NAME |
| --- |
| 나 |
| 다 |

양쪽 결과에 모두 존재하는 `나`, `다`만 남습니다.

```text
A
→ 가, 나, 다

B
→ 나, 다, 라

공통
→ 나, 다
```

## EXCEPT

`EXCEPT`는 첫 번째 SELECT 결과에서 두 번째 SELECT 결과에 존재하는 Row를 제외합니다.

### 입력 Table 1 · A

| NAME |
| --- |
| 가 |
| 나 |
| 다 |

### 입력 Table 2 · B

| NAME |
| --- |
| 나 |
| 다 |
| 라 |

```sql
SELECT NAME
FROM A

EXCEPT

SELECT NAME
FROM B;
```

### 결과 Table

| NAME |
| --- |
| 가 |

첫 번째 결과 A에는 있지만 B에도 존재하는 `나`, `다`는 제거됩니다.

`가`만 남습니다.

## EXCEPT는 순서가 중요하다

차집합은 SELECT 순서가 바뀌면 결과도 달라집니다.

### A EXCEPT B

```sql
SELECT NAME
FROM A

EXCEPT

SELECT NAME
FROM B;
```

### 결과 Table

| NAME |
| --- |
| 가 |

### B EXCEPT A

```sql
SELECT NAME
FROM B

EXCEPT

SELECT NAME
FROM A;
```

### 결과 Table

| NAME |
| --- |
| 라 |

```text
A - B
→ 가

B - A
→ 라
```

<blockquote class="prompt-warning">
<p>EXCEPT는 앞뒤 SELECT의 순서가 바뀌면 결과가 달라질 수 있습니다.</p>
</blockquote>

## INTERSECT와 EXCEPT 비교

| 연산자 | 의미 | 결과 |
| --- | --- | --- |
| `INTERSECT` | 교집합 | 양쪽에 모두 존재 |
| `EXCEPT` | 차집합 | 첫 번째 결과에만 존재 |

```text
INTERSECT
→ A ∩ B

EXCEPT
→ A - B
```

## Column 조건

`INTERSECT`와 `EXCEPT`도 집합 연산이므로 두 SELECT의 구조가 맞아야 합니다.

### 올바른 예

```sql
SELECT CUSTOMER_ID, NAME
FROM CUSTOMER

INTERSECT

SELECT EMP_ID, EMP_NAME
FROM EMPLOYEE;
```

두 SELECT 모두 2개의 Column을 반환합니다.

### 잘못된 예

```sql
SELECT CUSTOMER_ID, NAME
FROM CUSTOMER

EXCEPT

SELECT EMP_ID
FROM EMPLOYEE;
```

첫 번째 SELECT는 2개, 두 번째 SELECT는 1개의 Column을 반환합니다.

```text
집합 연산

→ Column 수 동일
→ 같은 위치의 자료형 호환
```

## 여러 Column이면 Row 전체를 비교한다

집합 연산에서는 선택한 Column 전체가 하나의 Row로 비교됩니다.

### 입력 Table 1 · A

| ID | NAME |
| --- | --- |
| 1 | 가 |
| 2 | 나 |

### 입력 Table 2 · B

| ID | NAME |
| --- | --- |
| 1 | 가 |
| 2 | 다 |

```sql
SELECT ID, NAME
FROM A

INTERSECT

SELECT ID, NAME
FROM B;
```

### 결과 Table

| ID | NAME |
| --- | --- |
| 1 | 가 |

`ID = 2`는 같지만 NAME이 다르므로 같은 Row로 보지 않습니다.

```text
2, 나
≠
2, 다
```

## 중복 Row

일반적인 `INTERSECT`와 `EXCEPT`는 집합 연산이므로 결과에서 중복 Row가 제거됩니다.

### 입력 Table 1 · A

| NAME |
| --- |
| 가 |
| 가 |
| 나 |

### 입력 Table 2 · B

| NAME |
| --- |
| 가 |

```sql
SELECT NAME
FROM A

INTERSECT

SELECT NAME
FROM B;
```

### 결과 Table

| NAME |
| --- |
| 가 |

A에 `가`가 두 번 있어도 결과에서는 하나의 `가`만 남습니다.

## 잘 놓치는 핵심

### 1. INTERSECT는 교집합이다

```text
양쪽 모두 존재
→ 결과에 포함
```

### 2. EXCEPT는 첫 번째 SELECT 기준이다

```text
첫 번째 결과
-
두 번째 결과
```

이므로 순서가 중요합니다.

### 3. 여러 Column이면 전체 Row가 같아야 한다

한 Column만 같다고 공통 Row가 되는 것은 아닙니다.

### 4. Column 수와 자료형 조건을 확인한다

두 SELECT의 Column 수가 같아야 하고, 같은 위치의 자료형이 서로 호환되어야 합니다.

## 시험·면접

### 핵심 암기

```text
INTERSECT
→ 교집합
→ 양쪽 공통 Row
```

```text
EXCEPT
→ 차집합
→ 첫 번째 SELECT - 두 번째 SELECT
```

```text
EXCEPT
→ 순서 중요
```

```text
집합 연산
→ Column 수 동일
→ 위치별 자료형 호환
```

### 시험 함정

`EXCEPT`를 단순히 서로 다른 Row를 찾는 연산이라고 생각하면 안 됩니다.

첫 번째 SELECT 결과를 기준으로 두 번째 SELECT에 존재하는 Row를 제거하는 방향성이 있습니다.

### 면접 짧은 답변

`INTERSECT`는 두 SELECT 결과에 공통으로 존재하는 Row를 반환하는 교집합 연산이고, `EXCEPT`는 첫 번째 SELECT 결과에서 두 번째 SELECT 결과에 존재하는 Row를 제외하는 차집합 연산입니다. 두 연산 모두 SELECT의 Column 수가 같고 대응되는 자료형이 호환되어야 합니다.

## 객관식 문제

### 문제 1 · INTERSECT

#### A

| NAME |
| --- |
| 가 |
| 나 |
| 다 |

#### B

| NAME |
| --- |
| 나 |
| 다 |
| 라 |

다음 Query의 결과는?

```sql
SELECT NAME
FROM A

INTERSECT

SELECT NAME
FROM B;
```

① 가  
② 나, 다  
③ 라  
④ 가, 라

<details markdown="1">
<summary>정답</summary>

②

양쪽 결과에 공통으로 존재하는 Row는 `나`, `다`입니다.

| NAME |
| --- |
| 나 |
| 다 |

</details>

### 문제 2 · EXCEPT

같은 입력 Table에서 다음 Query의 결과는?

```sql
SELECT NAME
FROM A

EXCEPT

SELECT NAME
FROM B;
```

① 가  
② 나, 다  
③ 라  
④ 가, 라

<details markdown="1">
<summary>정답</summary>

①

A에만 존재하는 `가`가 남습니다.

</details>

### 문제 3 · 순서

다음 설명으로 옳은 것은?

```text
A EXCEPT B
```

① 항상 `B EXCEPT A`와 같다.  
② A와 B의 공통 Row만 반환한다.  
③ A에는 있지만 B에는 없는 Row를 반환한다.  
④ 모든 Row를 합친다.

<details markdown="1">
<summary>정답</summary>

③

EXCEPT는 첫 번째 SELECT 결과에서 두 번째 SELECT 결과를 제외합니다.

</details>

### 문제 4 · 여러 Column

#### A

| ID | NAME |
| --- | --- |
| 1 | 가 |
| 2 | 나 |

#### B

| ID | NAME |
| --- | --- |
| 1 | 가 |
| 2 | 다 |

다음 INTERSECT 결과 Row 수는?

```sql
SELECT ID, NAME
FROM A

INTERSECT

SELECT ID, NAME
FROM B;
```

① 0개  
② 1개  
③ 2개  
④ 4개

<details markdown="1">
<summary>정답</summary>

②

`1, 가`만 두 결과에서 완전히 같은 Row입니다.

| ID | NAME |
| --- | --- |
| 1 | 가 |

</details>

### 문제 5 · 집합 연산 조건

INTERSECT와 EXCEPT를 사용할 때 필요한 조건으로 옳은 것은?

① SELECT Column 수가 달라도 된다.  
② 두 SELECT가 반드시 같은 Table이어야 한다.  
③ Column 수가 같고 대응되는 자료형이 호환되어야 한다.  
④ 반드시 JOIN 조건이 필요하다.

<details markdown="1">
<summary>정답</summary>

③

집합 연산에서는 SELECT 결과의 Column 수와 위치별 자료형이 서로 맞아야 합니다.

</details>

## INTERSECT · EXCEPT 전체 요약

### 입력 Table 1 · A

| NAME |
| --- |
| 가 |
| 나 |
| 다 |

### 입력 Table 2 · B

| NAME |
| --- |
| 나 |
| 다 |
| 라 |

```sql
SELECT NAME
FROM A

INTERSECT

SELECT NAME
FROM B;
```

### INTERSECT 결과

| NAME |
| --- |
| 나 |
| 다 |

```sql
SELECT NAME
FROM A

EXCEPT

SELECT NAME
FROM B;
```

### EXCEPT 결과

| NAME |
| --- |
| 가 |

```text
INTERSECT
→ 교집합

EXCEPT
→ 첫 번째 결과 - 두 번째 결과
```

<blockquote class="prompt-danger">
<p>INTERSECT와 EXCEPT 문제에서는 먼저 두 SELECT 결과를 직접 집합처럼 적고, 공통인지 차집합인지 판단합니다.</p>
</blockquote>

## 다음에 이을 글

다음 글에서는 SQL의 다른 조회 문법과 집합 연산 활용을 이어서 정리할 수 있습니다.
