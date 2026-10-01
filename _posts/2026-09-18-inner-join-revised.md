---
title: INNER JOIN · 이너 조인
date: 2026-09-18 21:35:00 +0900
slug: inner-join
permalink: /posts/inner-join/
categories: [CS, 데이터베이스]
tags: [INNERJOIN, 이너조인, JOIN, SQL, 관계형데이터베이스, ForeignKey, 정보처리기사, NCS]
math: true
---

INNER JOIN은 <mark>두 Table에서 JOIN 조건을 만족하는 Row만 결과에 남기는 JOIN</mark>입니다.

한쪽에만 존재하거나 연결 조건을 만족하지 않는 Row는 결과에서 제외됩니다.

<blockquote class="prompt-info">
<p>한 줄: INNER JOIN은 양쪽 Table에서 서로 연결되는 Row만 남깁니다.</p>
</blockquote>

<details markdown="1">
<summary>한 줄로</summary>

JOIN 조건을 만족하는 공통 Row만 결과에 포함합니다.

</details>

## 가장 먼저 볼 예시

직원과 부서 Table을 `DEPT_ID`로 연결합니다.

### 입력 Table 1 · EMPLOYEE

| EMP_ID | EMP_NAME | DEPT_ID |
| --- | --- | --- |
| 1001 | 직원1 | 10 |
| 1002 | 직원2 | 20 |
| 1003 | 직원3 | 99 |

### 입력 Table 2 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |
| 30 | 영업 |

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
INNER JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | 인사 |

직원3의 `DEPT_ID = 99`는 DEPARTMENT에 없으므로 제외됩니다.

영업 부서의 `DEPT_ID = 30`도 연결되는 직원이 없으므로 제외됩니다.

```text
10 = 10
→ 연결

20 = 20
→ 연결

99
→ 상대 없음
→ 제외

30
→ 상대 없음
→ 제외
```

## INNER JOIN의 기본 문법

```sql
SELECT 조회할_Column
FROM Table1
INNER JOIN Table2
    ON 연결_조건;
```

핵심은 `ON` 조건입니다.

### 입력 Table 1 · EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |

### 입력 Table 2 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
INNER JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |

`ON`에서 어떤 Column을 기준으로 Row를 연결할지 결정합니다.

## INNER는 생략할 수 있다

다음 두 Query는 같은 의미로 사용됩니다.

```sql
SELECT *
FROM EMPLOYEE E
INNER JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

```sql
SELECT *
FROM EMPLOYEE E
JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

즉 일반적인 `JOIN`은 보통 `INNER JOIN`을 의미합니다.

## 연결되지 않은 Row는 사라진다

INNER JOIN의 가장 중요한 특징입니다.

### 입력 Table 1 · EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | NULL |
| 직원3 | 99 |

### 입력 Table 2 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
INNER JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |

직원2의 `DEPT_ID`는 `NULL`이고 직원3의 `99`는 일치하는 부서가 없습니다.

인사 부서도 연결되는 직원이 없습니다.

모두 결과에서 제외됩니다.

## 일대다 관계에서는 Row가 늘어날 수 있다

하나의 부서에 여러 직원이 연결되면 부서 Row가 여러 번 나타납니다.

### 입력 Table 1 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |

### 입력 Table 2 · EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | 10 |
| 직원3 | 10 |

```sql
SELECT
    D.DEPT_NAME,
    E.EMP_NAME
FROM DEPARTMENT D
INNER JOIN EMPLOYEE E
    ON D.DEPT_ID = E.DEPT_ID;
```

### 결과 Table

| DEPT_NAME | EMP_NAME |
| --- | --- |
| 개발 | 직원1 |
| 개발 | 직원2 |
| 개발 | 직원3 |

<blockquote class="prompt-warning">
<p>INNER JOIN이라고 해서 결과 Row 수가 원본 Table의 Row 수와 같다고 볼 수 없습니다.</p>
</blockquote>

## 중복 Key가 있으면 조합 수만큼 연결된다

두 Table 모두 같은 Key를 여러 Row 가지고 있다면 가능한 조합이 모두 생성됩니다.

### 입력 Table 1 · A

| ID | NAME |
| --- | --- |
| 1 | 가1 |
| 1 | 가2 |

### 입력 Table 2 · B

| ID | VALUE |
| --- | --- |
| 1 | 하나 |
| 1 | 첫째 |

```sql
SELECT
    A.NAME,
    B.VALUE
FROM A
INNER JOIN B
    ON A.ID = B.ID;
```

### 결과 Table

| NAME | VALUE |
| --- | --- |
| 가1 | 하나 |
| 가1 | 첫째 |
| 가2 | 하나 |
| 가2 | 첫째 |

```text
왼쪽 2 Row
×
오른쪽 2 Row
=
4 Row
```

## WHERE와 함께 사용

JOIN으로 Row를 연결한 뒤 WHERE에서 최종 결과를 다시 필터링할 수 있습니다.

### 입력 Table 1 · EMPLOYEE

| EMP_NAME | DEPT_ID | SALARY |
| --- | --- | ---: |
| 직원1 | 10 | 3500 |
| 직원2 | 10 | 2500 |
| 직원3 | 20 | 4000 |

### 입력 Table 2 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |

```sql
SELECT
    E.EMP_NAME,
    E.SALARY,
    D.DEPT_NAME
FROM EMPLOYEE E
INNER JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID
WHERE E.SALARY >= 3000;
```

### 결과 Table

| EMP_NAME | SALARY | DEPT_NAME |
| --- | ---: | --- |
| 직원1 | 3500 | 개발 |
| 직원3 | 4000 | 인사 |

```text
ON
→ Table 연결

WHERE
→ 연결된 결과 필터링
```

## INNER JOIN과 LEFT JOIN 비교

같은 입력 Table로 비교하면 차이가 명확합니다.

### 입력 Table 1 · EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | NULL |

### 입력 Table 2 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |

### INNER JOIN 결과

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
INNER JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |

### LEFT JOIN 결과

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
LEFT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | NULL |

```text
INNER JOIN
→ 연결되는 Row만

LEFT JOIN
→ 왼쪽 Row 전체 유지
```

## Foreign Key와 INNER JOIN

Foreign Key 관계는 JOIN 조건으로 자주 사용됩니다.

```text
EMPLOYEE.DEPT_ID
→ DEPARTMENT.DEPT_ID
```

하지만 Foreign Key가 있어야만 JOIN할 수 있는 것은 아닙니다.

JOIN은 SQL의 조회 연산이고 Foreign Key는 참조 무결성을 관리하는 제약입니다.

## 잘 놓치는 핵심

### 1. INNER JOIN은 교집합처럼 생각할 수 있다

양쪽에서 조건이 맞는 Row만 결과에 남습니다.

### 2. NULL은 등호 JOIN에서 일반 값처럼 연결되지 않는다

### 입력 Table

| A.ID |
| --- |
| NULL |

| B.ID |
| --- |
| NULL |

```sql
SELECT *
FROM A
INNER JOIN B
    ON A.ID = B.ID;
```

### 결과 Table

| A.ID | B.ID |
| --- | --- |
| 결과 없음 | 결과 없음 |

`NULL = NULL`을 참으로 판단하지 않기 때문입니다.

### 3. 중복 Key가 있으면 Row 수가 늘어난다

한쪽 2개, 다른 쪽 3개가 같은 Key로 연결된다면 6개의 결과가 만들어질 수 있습니다.

### 4. JOIN과 WHERE의 역할을 구분한다

```text
ON
→ Row 연결 기준

WHERE
→ 최종 결과 조건
```

## 시험·면접

### 핵심 암기

```text
INNER JOIN
→ 양쪽에서 연결되는 Row만
```

```text
JOIN
→ INNER JOIN의 INNER 생략 가능
```

```text
연결 실패
→ 결과에서 제외
```

```text
중복 Key
→ 조합 수만큼 Row 증가 가능
```

### 시험 함정

INNER JOIN이라고 해서 결과 Row 수가 항상 두 Table 중 작은 Row 수 이하인 것은 아닙니다.

중복 Key가 있으면 결과가 더 많아질 수 있습니다.

### 면접 짧은 답변

INNER JOIN은 두 Table에서 JOIN 조건을 만족하는 Row만 연결하여 반환하는 방식입니다. 연결되는 Row가 없는 데이터는 결과에서 제외되며, 같은 Key가 여러 Row에 존재하면 가능한 조합만큼 결과 Row가 증가할 수 있습니다.

## 객관식 문제

### 문제 1 · 기본 INNER JOIN

#### EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | 99 |

#### DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |

다음 Query의 결과는?

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
INNER JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

① 직원1·개발만 나온다.  
② 직원1·개발, 직원2·NULL이 나온다.  
③ 직원1·개발, NULL·인사가 나온다.  
④ 모두 나온다.

<details markdown="1">
<summary>정답</summary>

①

조건을 만족하는 `DEPT_ID = 10`만 연결됩니다.

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |

</details>

### 문제 2 · 연결되지 않은 Row

INNER JOIN에 대한 설명으로 옳은 것은?

① 왼쪽 Row는 항상 모두 남는다.  
② 오른쪽 Row는 항상 모두 남는다.  
③ 연결 조건을 만족하지 않는 Row는 제외된다.  
④ 모든 Row 조합을 만든다.

<details markdown="1">
<summary>정답</summary>

③

INNER JOIN은 양쪽에서 JOIN 조건을 만족하는 Row만 결과에 포함합니다.

</details>

### 문제 3 · 중복 Key

#### A

| ID |
| --- |
| 1 |
| 1 |

#### B

| ID |
| --- |
| 1 |
| 1 |
| 1 |

다음 INNER JOIN의 결과 Row 수는?

```sql
SELECT *
FROM A
INNER JOIN B
    ON A.ID = B.ID;
```

① 2개  
② 3개  
③ 5개  
④ 6개

<details markdown="1">
<summary>정답</summary>

④

왼쪽 2 Row와 오른쪽 3 Row가 모두 서로 연결됩니다.

```text
2 × 3
= 6 Row
```

</details>

### 문제 4 · INNER 생략

다음과 같은 의미의 Query는?

```sql
FROM A
JOIN B
    ON A.ID = B.ID
```

① 일반적으로 INNER JOIN  
② LEFT JOIN  
③ CROSS JOIN  
④ FULL OUTER JOIN

<details markdown="1">
<summary>정답</summary>

①

일반적인 `JOIN`은 `INNER JOIN`에서 INNER를 생략한 형태로 사용됩니다.

</details>

### 문제 5 · NULL

#### A

| ID |
| --- |
| NULL |

#### B

| ID |
| --- |
| NULL |

다음 Query 결과로 옳은 것은?

```sql
SELECT *
FROM A
INNER JOIN B
    ON A.ID = B.ID;
```

① 한 Row가 연결된다.  
② 두 Row가 나온다.  
③ 연결되는 Row가 없다.  
④ CROSS JOIN이 된다.

<details markdown="1">
<summary>정답</summary>

③

일반적인 등호 비교에서 `NULL = NULL`은 참이 아니므로 연결되지 않습니다.

</details>

## INNER JOIN 전체 요약

### 입력 Table 1 · EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | 20 |
| 직원3 | 99 |

### 입력 Table 2 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
INNER JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | 인사 |

```text
조건 일치
→ 연결

조건 불일치
→ 제외
```

<blockquote class="prompt-danger">
<p>INNER JOIN 문제는 먼저 ON 조건이 참이 되는 Row 조합만 골라낸 뒤 SELECT와 WHERE를 적용합니다.</p>
</blockquote>

## 다음에 이을 글

**LEFT OUTER JOIN**입니다.

왼쪽 Table의 모든 Row를 유지하면서 연결되는 오른쪽 Row를 붙이는 구조를 살펴봅니다.
