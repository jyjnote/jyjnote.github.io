---
title: Multi-row Subquery · 다중행 서브쿼리
date: 2026-09-18 22:20:00 +0900
slug: multi-row-subquery
permalink: /posts/multi-row-subquery/
categories: [CS, 데이터베이스]
tags: [MultiRowSubquery, 다중행서브쿼리, Subquery, 서브쿼리, IN, ANY, ALL, SQL, 정보처리기사, NCS]
math: true
---

Multi-row Subquery는 <mark>서브쿼리의 실행 결과가 여러 Row로 반환되는 서브쿼리</mark>입니다.

여러 값을 반환하므로 `=`처럼 하나의 값만 비교하는 연산자보다 `IN`, `ANY`, `ALL` 같은 연산자와 함께 사용합니다.

<blockquote class="prompt-info">
<p>한 줄: 다중행 서브쿼리는 여러 값을 반환하므로 여러 값을 처리할 수 있는 연산자가 필요합니다.</p>
</blockquote>

<details markdown="1">
<summary>한 줄로</summary>

서브쿼리가 여러 Row를 반환하는 경우입니다.

</details>

## 대표 예시

서울 지역에 있는 부서의 직원들을 조회한다고 가정합니다.

### 입력 Table 1 · DEPARTMENT

| DEPT_ID | DEPT_NAME | REGION |
| --- | --- | --- |
| 10 | 개발 | 서울 |
| 20 | 인사 | 부산 |
| 30 | 영업 | 서울 |

### 입력 Table 2 · EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | 20 |
| 직원3 | 30 |
| 직원4 | 40 |

```sql
SELECT
    EMP_NAME,
    DEPT_ID
FROM EMPLOYEE
WHERE DEPT_ID IN (
    SELECT DEPT_ID
    FROM DEPARTMENT
    WHERE REGION = '서울'
);
```

### 결과 Table

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원3 | 30 |

안쪽 Query는 서울 지역의 부서 번호를 여러 개 반환합니다.

```text
서브쿼리 결과

10
30
```

바깥 Query에서는 `DEPT_ID`가 `10` 또는 `30`인 직원을 조회합니다.

## 기본 구조

```sql
SELECT Column
FROM Table
WHERE Column IN (
    SELECT Column
    FROM Table
);
```

다중행 서브쿼리에서는 안쪽 Query가 한 값이 아니라 여러 값을 반환할 수 있습니다.

```text
Scalar Subquery
→ 한 값

Multi-row Subquery
→ 여러 값
```

## IN

`IN`은 서브쿼리 결과 중 하나와 일치하면 참입니다.

### 입력 Table · EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | 20 |
| 직원3 | 30 |

```sql
SELECT
    EMP_NAME
FROM EMPLOYEE
WHERE DEPT_ID IN (
    SELECT DEPT_ID
    FROM DEPARTMENT
    WHERE REGION = '서울'
);
```

### 결과 Table

| EMP_NAME |
| --- |
| 직원1 |
| 직원3 |

다음처럼 생각하면 됩니다.

```text
DEPT_ID IN (10, 30)

→ DEPT_ID가 10 또는 30이면 참
```

## = 를 사용하면 안 되는 경우

서브쿼리가 여러 Row를 반환할 수 있는데 `=`를 사용하면 문제가 발생할 수 있습니다.

### 입력 Table · DEPARTMENT

| DEPT_ID | REGION |
| --- | --- |
| 10 | 서울 |
| 30 | 서울 |

```sql
SELECT
    EMP_NAME
FROM EMPLOYEE
WHERE DEPT_ID = (
    SELECT DEPT_ID
    FROM DEPARTMENT
    WHERE REGION = '서울'
);
```

### 서브쿼리 결과

| DEPT_ID |
| --- |
| 10 |
| 30 |

바깥의 `=`는 하나의 값을 기대하지만 안쪽 Query는 두 값을 반환합니다.

```text
=
→ 한 값 비교

IN
→ 여러 값 중 하나와 비교
```

따라서 이런 경우에는 보통 `IN`을 사용합니다.

## ANY

`ANY`는 서브쿼리 결과 중 <mark>하나라도 비교 조건을 만족하면 참</mark>입니다.

### 입력 Table · EMPLOYEE

| EMP_NAME | SALARY |
| --- | ---: |
| 직원1 | 2500 |
| 직원2 | 3500 |
| 직원3 | 4500 |

### 비교값

서브쿼리 결과가 다음과 같다고 가정합니다.

| SALARY |
| ---: |
| 3000 |
| 4000 |

```sql
SELECT
    EMP_NAME,
    SALARY
FROM EMPLOYEE
WHERE SALARY > ANY (
    SELECT SALARY
    FROM EMPLOYEE
    WHERE DEPT_ID = 10
);
```

`> ANY`는 여러 값 중 하나보다만 커도 참입니다.

```text
비교값
3000, 4000

3500
→ 3000보다 큼
→ 참
```

ANY의 자세한 비교 방식은 별도 `ANY · ALL` 글에서 다룹니다.

## ALL

`ALL`은 서브쿼리 결과의 <mark>모든 값에 대해 비교 조건을 만족해야 참</mark>입니다.

같은 비교값이 `3000`, `4000`이라면 다음과 같습니다.

```text
3500 > ALL (3000, 4000)
→ 거짓

4500 > ALL (3000, 4000)
→ 참
```

```sql
SELECT
    EMP_NAME,
    SALARY
FROM EMPLOYEE
WHERE SALARY > ALL (
    SELECT SALARY
    FROM EMPLOYEE
    WHERE DEPT_ID = 10
);
```

ANY와 ALL의 세부 변환 관계는 별도 글에서 다룹니다.

## 잘 놓치는 핵심

### 1. 다중행 서브쿼리는 여러 Row를 반환한다

한 Column에서 여러 값이 나오는 형태가 대표적입니다.

### 2. 결과 개수와 연산자를 맞춘다

```text
한 값
→ =, >, <

여러 값
→ IN, ANY, ALL
```

### 3. IN은 여러 값 중 하나와 같으면 참이다

```text
IN (10, 20, 30)
→ 10 또는 20 또는 30
```

### 4. ANY와 ALL은 의미가 다르다

```text
ANY
→ 하나라도 만족

ALL
→ 모두 만족
```

## 시험·면접

### 핵심 암기

```text
Multi-row Subquery
→ 여러 Row 반환
```

```text
IN
→ 여러 값 중 하나와 일치
```

```text
ANY
→ 하나라도 조건 만족
```

```text
ALL
→ 모든 값이 조건 만족
```

### 시험 함정

서브쿼리가 여러 Row를 반환하는데 `=`를 사용하면 오류가 발생할 수 있습니다.

먼저 안쪽 Query의 결과가 한 값인지 여러 값인지 확인해야 합니다.

### 면접 짧은 답변

Multi-row Subquery는 서브쿼리 결과가 여러 Row로 반환되는 형태입니다. 여러 값을 비교해야 하므로 `IN`, `ANY`, `ALL` 같은 다중행 연산자를 사용하며, `IN`은 여러 값 중 하나와 일치하는지를 판단합니다.

## 객관식 문제

### 문제 1 · 기본 개념

다중행 서브쿼리의 특징으로 옳은 것은?

① 반드시 한 Row만 반환한다.  
② 여러 Row를 반환할 수 있다.  
③ SELECT 절에서는 절대 사용할 수 없다.  
④ JOIN만 사용할 수 있다.

<details markdown="1">
<summary>정답</summary>

②

Multi-row Subquery는 여러 Row를 반환할 수 있는 서브쿼리입니다.

</details>

### 문제 2 · IN

#### EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | 20 |
| 직원3 | 30 |

서브쿼리 결과가 `10`, `30`일 때 다음 Query의 결과는?

```sql
SELECT
    EMP_NAME
FROM EMPLOYEE
WHERE DEPT_ID IN (
    SELECT DEPT_ID
    FROM DEPARTMENT
    WHERE REGION = '서울'
);
```

① 직원1만  
② 직원3만  
③ 직원1, 직원3  
④ 직원1, 직원2, 직원3

<details markdown="1">
<summary>정답</summary>

③

`IN`은 여러 값 중 하나와 일치하면 참입니다.

| EMP_NAME |
| --- |
| 직원1 |
| 직원3 |

</details>

### 문제 3 · 잘못된 연산자

서브쿼리가 `10`, `20`, `30`을 반환할 때 주의해야 할 표현은?

① `IN`  
② `ANY`  
③ `ALL`  
④ `=`

<details markdown="1">
<summary>정답</summary>

④

`=`는 하나의 값을 비교할 때 사용하는 것이 일반적이므로 여러 Row가 반환되면 문제가 될 수 있습니다.

</details>

### 문제 4 · ANY

다음 설명으로 옳은 것은?

```sql
SALARY > ANY (3000, 4000)
```

① 3000과 4000 모두보다 커야 한다.  
② 3000 또는 4000 중 하나보다만 커도 된다.  
③ 반드시 4000과 같아야 한다.  
④ 항상 거짓이다.

<details markdown="1">
<summary>정답</summary>

②

ANY는 여러 비교값 중 하나라도 조건을 만족하면 참입니다.

</details>

### 문제 5 · ALL

다음 조건을 만족하는 값은?

```text
값 > ALL (3000, 4000)
```

① 2500  
② 3000  
③ 3500  
④ 4500

<details markdown="1">
<summary>정답</summary>

④

모든 값보다 커야 하므로 4000보다도 큰 4500이 조건을 만족합니다.

</details>

## Multi-row Subquery 전체 요약

### 입력 Table 1 · DEPARTMENT

| DEPT_ID | REGION |
| --- | --- |
| 10 | 서울 |
| 20 | 부산 |
| 30 | 서울 |

### 입력 Table 2 · EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | 20 |
| 직원3 | 30 |

```sql
SELECT
    EMP_NAME
FROM EMPLOYEE
WHERE DEPT_ID IN (
    SELECT DEPT_ID
    FROM DEPARTMENT
    WHERE REGION = '서울'
);
```

### 결과 Table

| EMP_NAME |
| --- |
| 직원1 |
| 직원3 |

```text
Multi-row Subquery
→ 여러 값 반환

IN
→ 하나와 일치

ANY
→ 하나라도 만족

ALL
→ 모두 만족
```

<blockquote class="prompt-danger">
<p>다중행 서브쿼리 문제에서는 먼저 서브쿼리 결과가 여러 Row인지 확인하고, 바깥 연산자가 그 결과를 처리할 수 있는지 확인합니다.</p>
</blockquote>

## 다음에 이을 글

**Correlated Subquery**입니다.

바깥 Query의 Column을 안쪽 Query가 참조하는 상관 서브쿼리 구조를 살펴봅니다.
