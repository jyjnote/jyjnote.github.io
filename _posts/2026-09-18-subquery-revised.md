---
title: Subquery · 서브쿼리
date: 2026-09-18 22:10:00 +0900
slug: subquery
permalink: /posts/subquery/
categories: [CS, 데이터베이스]
tags: [Subquery, 서브쿼리, SQL, ScalarSubquery, MultiRowSubquery, CorrelatedSubquery, 정보처리기사, NCS]
math: true
---

Subquery는 <mark>하나의 SQL문 안에 포함된 또 다른 SQL문</mark>입니다.

안쪽 Query의 결과를 바깥 Query가 조건이나 값으로 사용합니다.

<blockquote class="prompt-info">
<p>한 줄: Subquery는 안쪽 Query의 결과를 바깥 Query가 사용하는 구조입니다.</p>
</blockquote>

<details markdown="1">
<summary>한 줄로</summary>

SQL문 안에 SELECT문을 넣어 그 결과를 다른 Query에서 사용합니다.

</details>

## 대표 예시

전체 직원의 평균 급여보다 많이 받는 직원을 조회한다고 가정합니다.

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

안쪽 Query가 먼저 평균 급여 `4000`을 구합니다.

그다음 바깥 Query가 `SALARY > 4000`인 Row를 조회합니다.

```text
안쪽 Query
→ 평균 급여 계산

바깥 Query
→ 평균보다 높은 직원 조회
```

## 기본 구조

```sql
SELECT Column
FROM Table
WHERE Column 연산자 (
    SELECT Column
    FROM Table
);
```

서브쿼리는 보통 괄호 `()` 안에 작성합니다.

```text
바깥 Query
→ Main Query

안쪽 Query
→ Subquery
```

## 서브쿼리는 어디에 사용할 수 있을까

서브쿼리는 대표적으로 `WHERE`, `SELECT`, `FROM` 등에 사용할 수 있습니다.

세부 동작은 각 유형의 글에서 따로 다룹니다.

### WHERE에서 사용

### 입력 Table · EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | 20 |
| 직원3 | 10 |

### 입력 Table · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |

```sql
SELECT
    EMP_NAME
FROM EMPLOYEE
WHERE DEPT_ID = (
    SELECT DEPT_ID
    FROM DEPARTMENT
    WHERE DEPT_NAME = '개발'
);
```

### 결과 Table

| EMP_NAME |
| --- |
| 직원1 |
| 직원3 |

안쪽 Query가 개발 부서의 `DEPT_ID = 10`을 반환하고, 바깥 Query가 해당 부서 직원들을 찾습니다.

## SELECT에서 사용

SELECT 절의 서브쿼리는 한 Row에 하나의 값을 붙일 때 사용할 수 있습니다.

### 입력 Table · EMPLOYEE

| EMP_NAME | SALARY |
| --- | ---: |
| 직원1 | 3000 |
| 직원2 | 5000 |

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
| 직원2 | 5000 | 4000 |

안쪽 Query가 반환한 평균 급여가 각 Row에 하나의 값으로 표시됩니다.

## FROM에서 사용

FROM 절에 서브쿼리를 사용하면 서브쿼리 결과를 임시 Table처럼 사용할 수 있습니다.

### 입력 Table · EMPLOYEE

| DEPT_ID | SALARY |
| --- | ---: |
| 10 | 3000 |
| 10 | 5000 |
| 20 | 4000 |

```sql
SELECT
    T.DEPT_ID,
    T.AVG_SALARY
FROM (
    SELECT
        DEPT_ID,
        AVG(SALARY) AS AVG_SALARY
    FROM EMPLOYEE
    GROUP BY DEPT_ID
) T;
```

### 결과 Table

| DEPT_ID | AVG_SALARY |
| --- | ---: |
| 10 | 4000 |
| 20 | 4000 |

안쪽 Query가 부서별 평균 급여 Table을 만들고, 바깥 Query가 그 결과를 조회합니다.

## 서브쿼리 결과의 형태

서브쿼리는 결과 형태에 따라 사용하는 연산자가 달라질 수 있습니다.

| 형태 | 의미 | 대표 사용 |
| --- | --- | --- |
| 한 Row · 한 Column | 하나의 값 | `=`, `>`, `<` |
| 여러 Row | 여러 값 | `IN`, `ANY`, `ALL` |
| 바깥 Query와 연결 | Row마다 다시 평가 가능 | 상관 서브쿼리 |

각 형태의 자세한 내용은 별도 글에서 다룹니다.

## 실행 순서를 보는 방법

간단한 서브쿼리는 보통 안쪽부터 결과를 확인하면 이해하기 쉽습니다.

```sql
SELECT
    EMP_NAME
FROM EMPLOYEE
WHERE SALARY > (
    SELECT AVG(SALARY)
    FROM EMPLOYEE
);
```

```text
1. 안쪽 Query
   → AVG(SALARY)

2. 결과값을 바깥 조건에 대입

3. 바깥 Query 실행
```

다만 상관 서브쿼리는 바깥 Query의 Row를 참조하므로 실행 관계가 단순한 독립 서브쿼리와 다릅니다.

이 부분은 상관 서브쿼리 글에서 따로 다룹니다.

## 잘 놓치는 핵심

### 1. 서브쿼리는 보통 괄호 안에 작성한다

```sql
WHERE SALARY > (
    SELECT AVG(SALARY)
    FROM EMPLOYEE
)
```

### 2. 서브쿼리 결과 개수와 연산자를 맞춰야 한다

한 개의 값이 필요한 곳에 여러 Row를 반환하면 오류가 발생할 수 있습니다.

```text
한 값
→ =, >, < 등

여러 값
→ IN, ANY, ALL 등
```

### 3. 모든 서브쿼리가 항상 한 번만 실행되는 것은 아니다

상관 서브쿼리는 바깥 Query의 값을 참조하므로 Row에 따라 반복 평가될 수 있습니다.

### 4. JOIN으로 바꿀 수 있는 경우도 있다

같은 결과를 JOIN과 Subquery 양쪽으로 표현할 수 있는 경우가 있습니다.

어느 방식이 더 적절한지는 Query 목적과 실행 계획에 따라 달라질 수 있습니다.

## 시험·면접

### 핵심 암기

```text
Subquery
→ SQL문 안의 SQL문
```

```text
독립적인 일반 서브쿼리
→ 안쪽 결과를 바깥 Query가 사용
```

```text
한 값
→ =, >, < 등
```

```text
여러 값
→ IN, ANY, ALL 등
```

### 시험 함정

서브쿼리가 여러 Row를 반환하는데 `=`처럼 한 값만 기대하는 연산자를 사용하면 문제가 될 수 있습니다.

또한 모든 서브쿼리를 무조건 안쪽부터 한 번만 실행한다고 생각하면 상관 서브쿼리 문제에서 틀릴 수 있습니다.

### 면접 짧은 답변

Subquery는 하나의 SQL문 내부에 포함된 SELECT문입니다. 안쪽 Query의 결과를 바깥 Query의 조건이나 값으로 사용할 수 있으며, 결과 형태에 따라 단일행, 다중행, 상관 서브쿼리 등으로 구분할 수 있습니다.

## 객관식 문제

### 문제 1 · 기본 개념

Subquery에 대한 설명으로 옳은 것은?

① 반드시 두 개의 Table만 사용한다.  
② SQL문 안에 다른 SQL문을 포함할 수 있다.  
③ JOIN에서만 사용할 수 있다.  
④ SELECT 절에서는 사용할 수 없다.

<details markdown="1">
<summary>정답</summary>

②

Subquery는 하나의 SQL문 안에 포함된 또 다른 SQL문입니다.

</details>

### 문제 2 · 실행 결과

#### EMPLOYEE

| EMP_NAME | SALARY |
| --- | ---: |
| 직원1 | 2000 |
| 직원2 | 3000 |
| 직원3 | 4000 |

다음 Query의 결과는?

```sql
SELECT
    EMP_NAME
FROM EMPLOYEE
WHERE SALARY > (
    SELECT AVG(SALARY)
    FROM EMPLOYEE
);
```

① 직원1  
② 직원2  
③ 직원3  
④ 직원1, 직원2

<details markdown="1">
<summary>정답</summary>

③

평균 급여는 `3000`입니다.

따라서 `3000`보다 높은 직원3만 조회됩니다.

| EMP_NAME |
| --- |
| 직원3 |

</details>

### 문제 3 · 여러 Row

서브쿼리가 여러 Row를 반환할 때 일반적으로 사용할 수 있는 연산자는?

① `IN`  
② `=`만 가능  
③ `AS`  
④ `ORDER BY`만 가능

<details markdown="1">
<summary>정답</summary>

①

여러 값 중 하나와 일치하는지를 확인할 때 `IN`을 사용할 수 있습니다.

</details>

### 문제 4 · FROM 절

FROM 절의 서브쿼리에 대한 설명으로 옳은 것은?

① 서브쿼리 결과를 임시 Table처럼 사용할 수 있다.  
② 항상 한 개의 숫자만 반환해야 한다.  
③ WHERE 절에서만 사용할 수 있다.  
④ JOIN을 사용할 수 없다.

<details markdown="1">
<summary>정답</summary>

①

FROM 절의 서브쿼리 결과를 하나의 Table처럼 조회할 수 있습니다.

</details>

### 문제 5 · 상관 서브쿼리

상관 서브쿼리에 대한 설명으로 가장 적절한 것은?

① 바깥 Query와 아무 관계가 없다.  
② 바깥 Query의 Column을 참조할 수 있다.  
③ 반드시 CROSS JOIN으로 변환된다.  
④ 항상 한 번만 실행된다.

<details markdown="1">
<summary>정답</summary>

②

상관 서브쿼리는 바깥 Query의 값을 참조할 수 있습니다.

자세한 실행 구조는 별도 상관 서브쿼리 글에서 다룹니다.

</details>

## Subquery 전체 요약

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

```text
안쪽 Query
→ 필요한 값 또는 결과 생성

바깥 Query
→ 그 결과를 사용
```

<blockquote class="prompt-danger">
<p>Subquery 문제에서는 먼저 안쪽 Query가 한 값인지 여러 값인지 확인하고, 바깥 연산자와 맞는지 확인합니다.</p>
</blockquote>

## 다음에 이을 글

**Scalar Subquery**입니다.

한 Row와 한 Column으로 하나의 값을 반환하는 서브쿼리를 살펴봅니다.
