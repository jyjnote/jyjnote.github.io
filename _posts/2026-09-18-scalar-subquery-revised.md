---
title: Scalar Subquery · 스칼라 서브쿼리
date: 2026-09-18 22:15:00 +0900
slug: scalar-subquery
permalink: /posts/scalar-subquery/
categories: [CS, 데이터베이스]
tags: [ScalarSubquery, 스칼라서브쿼리, Subquery, 서브쿼리, SQL, 정보처리기사, NCS]
math: true
---

Scalar Subquery는 <mark>실행 결과가 한 Row, 한 Column인 서브쿼리</mark>입니다.

즉 하나의 값만 반환하며, 일반적인 단일 값처럼 사용할 수 있습니다.

<blockquote class="prompt-info">
<p>한 줄: Scalar Subquery는 하나의 값만 반환하는 서브쿼리입니다.</p>
</blockquote>

<details markdown="1">
<summary>한 줄로</summary>

결과가 한 Row · 한 Column인 서브쿼리입니다.

</details>

## 대표 예시

전체 직원의 평균 급여를 각 직원 Row에 함께 표시한다고 가정합니다.

### 입력 Table · EMPLOYEE

| EMP_NAME | SALARY |
| --- | ---: |
| 직원1 | 3000 |
| 직원2 | 4000 |
| 직원3 | 5000 |

```sql
SELECT
    EMP_NAME,
    SALARY,
    (
        SELECT AVG(SALARY)
        FROM EMPLOYEE
    ) AS AVG_SALARY
FROM EMPLOYEE;
```

### 결과 Table

| EMP_NAME | SALARY | AVG_SALARY |
| --- | ---: | ---: |
| 직원1 | 3000 | 4000 |
| 직원2 | 4000 | 4000 |
| 직원3 | 5000 | 4000 |

안쪽 Query의 결과는 평균 급여 `4000` 하나입니다.

이 값이 바깥 Query의 각 Row에 하나의 Column처럼 사용됩니다.

## 기본 구조

```sql
SELECT
    Column,
    (
        SELECT 단일값
        FROM Table
    ) AS 별칭
FROM Table;
```

Scalar Subquery의 핵심은 결과가 반드시 하나의 값이어야 한다는 점입니다.

```text
한 Row
+
한 Column
=
한 값
```

## WHERE에서 사용

Scalar Subquery는 하나의 값을 반환하므로 `=`, `>`, `<` 같은 비교 연산자와 함께 사용할 수 있습니다.

### 입력 Table · EMPLOYEE

| EMP_NAME | SALARY |
| --- | ---: |
| 직원1 | 3000 |
| 직원2 | 4000 |
| 직원3 | 5000 |

```sql
SELECT
    EMP_NAME,
    SALARY
FROM EMPLOYEE
WHERE SALARY > (
    SELECT AVG(SALARY)
    FROM EMPLOYEE
);
```

### 결과 Table

| EMP_NAME | SALARY |
| --- | ---: |
| 직원3 | 5000 |

서브쿼리가 `4000` 하나를 반환하므로 바깥 Query에서는 일반 숫자처럼 비교할 수 있습니다.

## SELECT에서 사용

Scalar Subquery는 SELECT 절에서 하나의 Column처럼 사용할 수 있습니다.

### 입력 Table · EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | 20 |

### 입력 Table · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |

```sql
SELECT
    E.EMP_NAME,
    (
        SELECT D.DEPT_NAME
        FROM DEPARTMENT D
        WHERE D.DEPT_ID = E.DEPT_ID
    ) AS DEPT_NAME
FROM EMPLOYEE E;
```

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | 인사 |

각 직원 Row마다 해당 부서 이름 하나가 반환됩니다.

이 경우 바깥 Query의 값을 참조하므로 상관 서브쿼리 성격도 가집니다.

상관 서브쿼리의 자세한 구조는 별도 글에서 다룹니다.

## 여러 Row가 나오면 문제

Scalar Subquery는 하나의 값만 반환해야 합니다.

### 입력 Table · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |

다음 서브쿼리는 두 Row를 반환합니다.

```sql
SELECT DEPT_ID
FROM DEPARTMENT;
```

이를 한 값처럼 비교하면 문제가 발생할 수 있습니다.

```sql
SELECT *
FROM EMPLOYEE
WHERE DEPT_ID = (
    SELECT DEPT_ID
    FROM DEPARTMENT
);
```

```text
서브쿼리 결과

10
20

→ 한 값이 아님
→ Scalar Subquery 조건 불충족
```

여러 Row를 처리하는 방법은 다중행 서브쿼리에서 다룹니다.

## 결과가 0 Row라면

Scalar Subquery가 결과를 하나도 반환하지 않으면 일반적으로 `NULL`처럼 처리될 수 있습니다.

### 입력 Table · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |

```sql
SELECT
    (
        SELECT DEPT_NAME
        FROM DEPARTMENT
        WHERE DEPT_ID = 99
    ) AS DEPT_NAME;
```

### 결과 Table

| DEPT_NAME |
| --- |
| NULL |

조건을 만족하는 Row가 없기 때문에 하나의 실제 값 대신 `NULL`이 반환됩니다.

## 집계 함수와 함께 자주 사용

집계 함수는 여러 Row를 하나의 값으로 줄이는 경우가 많기 때문에 Scalar Subquery와 잘 맞습니다.

### 입력 Table · EMPLOYEE

| EMP_NAME | SALARY |
| --- | ---: |
| 직원1 | 3000 |
| 직원2 | 4000 |
| 직원3 | 5000 |

```sql
SELECT
    EMP_NAME,
    SALARY
FROM EMPLOYEE
WHERE SALARY = (
    SELECT MAX(SALARY)
    FROM EMPLOYEE
);
```

### 결과 Table

| EMP_NAME | SALARY |
| --- | ---: |
| 직원3 | 5000 |

`MAX(SALARY)`는 최대 급여 하나만 반환합니다.

## 잘 놓치는 핵심

### 1. Scalar는 한 Row · 한 Column이다

```text
1 Row
×
1 Column
=
1 Value
```

### 2. 여러 Row가 반환되면 사용할 수 없다

`=`처럼 하나의 값을 기대하는 위치에 여러 Row가 나오면 오류가 발생할 수 있습니다.

### 3. 집계 함수와 함께 자주 나온다

`AVG`, `MAX`, `MIN`, `COUNT`처럼 하나의 값을 만드는 함수가 자주 사용됩니다.

### 4. SELECT 절에서도 사용할 수 있다

Scalar Subquery는 하나의 값이므로 SELECT 절에서 하나의 Column처럼 사용할 수 있습니다.

## 시험·면접

### 핵심 암기

```text
Scalar Subquery
→ 한 Row · 한 Column
→ 하나의 값
```

```text
사용 가능
→ SELECT
→ WHERE
```

```text
한 값
→ =, >, < 등 비교 가능
```

### 시험 함정

Scalar Subquery라는 이름 때문에 반드시 숫자 하나만 반환한다고 생각하면 안 됩니다.

문자열, 날짜 등도 한 Row · 한 Column이면 Scalar Subquery가 될 수 있습니다.

### 면접 짧은 답변

Scalar Subquery는 실행 결과가 한 Row와 한 Column으로 하나의 값만 반환하는 서브쿼리입니다. 따라서 SELECT 절의 하나의 값이나 WHERE 절의 비교 대상으로 사용할 수 있으며, 여러 Row가 반환되면 Scalar Subquery 조건에 맞지 않습니다.

## 객관식 문제

### 문제 1 · 기본 개념

Scalar Subquery의 결과 형태로 옳은 것은?

① 여러 Row · 여러 Column  
② 여러 Row · 한 Column  
③ 한 Row · 한 Column  
④ 반드시 숫자 하나만 반환

<details markdown="1">
<summary>정답</summary>

③

Scalar Subquery는 한 Row와 한 Column으로 하나의 값을 반환합니다.

</details>

### 문제 2 · 평균 급여

#### EMPLOYEE

| EMP_NAME | SALARY |
| --- | ---: |
| 직원1 | 2000 |
| 직원2 | 3000 |
| 직원3 | 4000 |

```sql
SELECT
    EMP_NAME
FROM EMPLOYEE
WHERE SALARY > (
    SELECT AVG(SALARY)
    FROM EMPLOYEE
);
```

결과는?

① 직원1  
② 직원2  
③ 직원3  
④ 직원2, 직원3

<details markdown="1">
<summary>정답</summary>

③

평균 급여는 `3000`이므로 그보다 높은 직원3만 조회됩니다.

| EMP_NAME |
| --- |
| 직원3 |

</details>

### 문제 3 · 여러 Row 반환

다음 서브쿼리가 여러 Row를 반환하면 어떤 문제가 생길 수 있는가?

```sql
WHERE DEPT_ID = (
    SELECT DEPT_ID
    FROM DEPARTMENT
)
```

① 항상 정상 실행된다.  
② 한 값을 기대하는 비교에 여러 값이 들어가 문제가 될 수 있다.  
③ 자동으로 CROSS JOIN된다.  
④ 첫 번째 Row만 자동 선택된다.

<details markdown="1">
<summary>정답</summary>

②

Scalar Subquery는 하나의 값만 반환해야 합니다.

</details>

### 문제 4 · SELECT 절

Scalar Subquery에 대한 설명으로 옳은 것은?

① SELECT 절에서 사용할 수 없다.  
② SELECT 절에서 하나의 값처럼 사용할 수 있다.  
③ 반드시 JOIN과 함께 사용해야 한다.  
④ 문자열은 반환할 수 없다.

<details markdown="1">
<summary>정답</summary>

②

하나의 값을 반환하므로 SELECT 절에서 하나의 Column처럼 사용할 수 있습니다.

</details>

### 문제 5 · 집계 함수

다음 중 Scalar Subquery에 사용하기 가장 자연스러운 것은?

① `AVG(SALARY)`  
② 여러 Row를 그대로 반환하는 `SELECT DEPT_ID FROM DEPARTMENT`  
③ `CROSS JOIN` 결과 전체  
④ 여러 Column을 동시에 반환하는 Query

<details markdown="1">
<summary>정답</summary>

①

`AVG(SALARY)`는 하나의 값만 반환하므로 Scalar Subquery에 적합합니다.

</details>

## Scalar Subquery 전체 요약

### 입력 Table · EMPLOYEE

| EMP_NAME | SALARY |
| --- | ---: |
| 직원1 | 3000 |
| 직원2 | 4000 |
| 직원3 | 5000 |

```sql
SELECT
    EMP_NAME,
    SALARY,
    (
        SELECT AVG(SALARY)
        FROM EMPLOYEE
    ) AS AVG_SALARY
FROM EMPLOYEE;
```

### 결과 Table

| EMP_NAME | SALARY | AVG_SALARY |
| --- | ---: | ---: |
| 직원1 | 3000 | 4000 |
| 직원2 | 4000 | 4000 |
| 직원3 | 5000 | 4000 |

```text
Scalar Subquery
→ 한 Row
→ 한 Column
→ 하나의 값
```

<blockquote class="prompt-danger">
<p>Scalar Subquery 문제에서는 먼저 안쪽 Query가 정확히 하나의 값만 반환하는지 확인합니다.</p>
</blockquote>

## 다음에 이을 글

**Multi-row Subquery**입니다.

서브쿼리가 여러 Row를 반환할 때 사용하는 `IN`, `ANY`, `ALL`의 기본 구조를 살펴봅니다.
