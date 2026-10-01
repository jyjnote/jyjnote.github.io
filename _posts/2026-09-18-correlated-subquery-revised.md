---
title: Correlated Subquery · 상관 서브쿼리
date: 2026-09-18 22:25:00 +0900
slug: correlated-subquery
permalink: /posts/correlated-subquery/
categories: [CS, 데이터베이스]
tags: [CorrelatedSubquery, 상관서브쿼리, Subquery, 서브쿼리, SQL, EXISTS, 정보처리기사, NCS]
math: true
---

Correlated Subquery는 <mark>안쪽 Query가 바깥 Query의 Column을 참조하는 서브쿼리</mark>입니다.

바깥 Query의 현재 Row 값이 안쪽 Query의 조건에 사용되므로, 일반적인 독립 서브쿼리와 실행 관계가 다릅니다.

<blockquote class="prompt-info">
<p>한 줄: 상관 서브쿼리는 안쪽 Query가 바깥 Query의 현재 Row를 참조합니다.</p>
</blockquote>

<details markdown="1">
<summary>한 줄로</summary>

바깥 Query와 안쪽 Query가 서로 연결되어 있는 서브쿼리입니다.

</details>

## 대표 예시

각 직원이 자신의 부서 평균 급여보다 많이 받는지 확인한다고 가정합니다.

### 입력 Table · EMPLOYEE

| EMP_ID | EMP_NAME | DEPT_ID | SALARY |
| --- | --- | --- | ---: |
| 1 | 직원1 | 10 | 3000 |
| 2 | 직원2 | 10 | 5000 |
| 3 | 직원3 | 20 | 4000 |
| 4 | 직원4 | 20 | 6000 |

```sql
SELECT
    E.EMP_NAME,
    E.DEPT_ID,
    E.SALARY
FROM EMPLOYEE E
WHERE E.SALARY > (
    SELECT AVG(E2.SALARY)
    FROM EMPLOYEE E2
    WHERE E2.DEPT_ID = E.DEPT_ID
);
```

### 결과 Table

| EMP_NAME | DEPT_ID | SALARY |
| --- | --- | ---: |
| 직원2 | 10 | 5000 |
| 직원4 | 20 | 6000 |

안쪽 Query의 `E.DEPT_ID`가 바깥 Query의 EMPLOYEE Row를 참조합니다.

```text
직원1
→ 부서 10 평균 4000
→ 3000 > 4000 거짓

직원2
→ 부서 10 평균 4000
→ 5000 > 4000 참

직원3
→ 부서 20 평균 5000
→ 4000 > 5000 거짓

직원4
→ 부서 20 평균 5000
→ 6000 > 5000 참
```

## 기본 구조

```sql
SELECT
    바깥_Column
FROM 바깥_Table A
WHERE 조건 (
    SELECT 값
    FROM 안쪽_Table B
    WHERE B.Column = A.Column
);
```

핵심은 안쪽 Query 안에서 바깥 Query의 별칭을 사용한다는 점입니다.

```text
A
→ 바깥 Query

B
→ 안쪽 Query

B.Column = A.Column
→ 안쪽에서 바깥 Row 참조
```

## 일반 서브쿼리와 차이

### 일반 서브쿼리

```sql
SELECT
    EMP_NAME
FROM EMPLOYEE
WHERE SALARY > (
    SELECT AVG(SALARY)
    FROM EMPLOYEE
);
```

안쪽 Query는 바깥 Query의 Row를 참조하지 않습니다.

```text
전체 평균 급여
→ 한 번 계산해서 비교 가능
```

### 상관 서브쿼리

```sql
SELECT
    E.EMP_NAME
FROM EMPLOYEE E
WHERE E.SALARY > (
    SELECT AVG(E2.SALARY)
    FROM EMPLOYEE E2
    WHERE E2.DEPT_ID = E.DEPT_ID
);
```

안쪽 Query가 바깥 Row의 `E.DEPT_ID`를 사용합니다.

```text
현재 직원의 부서
→ 해당 부서 평균 계산
→ 현재 직원 급여와 비교
```

논리적으로는 바깥 Query의 각 Row에 맞추어 안쪽 조건이 달라진다고 이해하면 됩니다.

실제 데이터베이스에서는 최적화 과정에서 다른 실행 방식으로 변환될 수 있습니다.

## SELECT 절에서도 사용할 수 있다

각 직원 옆에 자신의 부서 평균 급여를 표시할 수 있습니다.

### 입력 Table · EMPLOYEE

| EMP_NAME | DEPT_ID | SALARY |
| --- | --- | ---: |
| 직원1 | 10 | 3000 |
| 직원2 | 10 | 5000 |
| 직원3 | 20 | 4000 |

```sql
SELECT
    E.EMP_NAME,
    E.SALARY,
    (
        SELECT AVG(E2.SALARY)
        FROM EMPLOYEE E2
        WHERE E2.DEPT_ID = E.DEPT_ID
    ) AS DEPT_AVG_SALARY
FROM EMPLOYEE E;
```

### 결과 Table

| EMP_NAME | SALARY | DEPT_AVG_SALARY |
| --- | ---: | ---: |
| 직원1 | 3000 | 4000 |
| 직원2 | 5000 | 4000 |
| 직원3 | 4000 | 4000 |

각 Row마다 현재 직원의 `DEPT_ID`를 이용해 해당 부서 평균을 구합니다.

## EXISTS와 함께 자주 사용된다

상관 서브쿼리는 `EXISTS`와 함께 자주 등장합니다.

### 입력 Table 1 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |
| 30 | 영업 |

### 입력 Table 2 · EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | 10 |
| 직원3 | 20 |

```sql
SELECT
    D.DEPT_NAME
FROM DEPARTMENT D
WHERE EXISTS (
    SELECT 1
    FROM EMPLOYEE E
    WHERE E.DEPT_ID = D.DEPT_ID
);
```

### 결과 Table

| DEPT_NAME |
| --- |
| 개발 |
| 인사 |

안쪽 Query에서 `D.DEPT_ID`를 참조하므로 상관 서브쿼리입니다.

`EXISTS`의 세부 동작과 `IN`과의 비교는 별도 글에서 다룹니다.

## 별칭을 구분해서 읽는다

같은 Table을 바깥과 안쪽에서 동시에 사용하는 경우 별칭이 특히 중요합니다.

```sql
FROM EMPLOYEE E
```

```sql
FROM EMPLOYEE E2
```

```text
E
→ 현재 검사 중인 바깥 직원

E2
→ 비교에 사용하는 안쪽 직원들
```

다음 조건을 보면 관계가 명확해집니다.

```sql
WHERE E2.DEPT_ID = E.DEPT_ID
```

```text
안쪽 직원의 부서
=
현재 바깥 직원의 부서
```

## 잘 놓치는 핵심

### 1. 안쪽 Query가 바깥 Column을 참조한다

상관 서브쿼리를 판별하는 가장 중요한 기준입니다.

### 2. 안쪽 Query만 따로 떼면 실행하기 어려울 수 있다

다음의 `E.DEPT_ID`는 바깥 Query에서 정의된 값입니다.

```sql
SELECT AVG(E2.SALARY)
FROM EMPLOYEE E2
WHERE E2.DEPT_ID = E.DEPT_ID;
```

따라서 이 부분만 독립적으로 보면 `E`의 값이 없습니다.

### 3. 논리적으로 Row마다 조건이 달라진다

바깥 Row가 바뀌면 참조하는 값도 바뀔 수 있습니다.

### 4. 실제 실행은 최적화될 수 있다

시험에서는 보통 바깥 Row와 안쪽 Query의 관계를 중심으로 이해하면 됩니다.

실제 데이터베이스 엔진은 같은 결과를 더 효율적인 실행 계획으로 변환할 수 있습니다.

## 시험·면접

### 핵심 암기

```text
Correlated Subquery
→ 안쪽 Query가 바깥 Query 참조
```

```text
바깥 Row 변경
→ 안쪽 조건도 달라질 수 있음
```

```text
별칭 확인
→ 바깥과 안쪽 역할 구분
```

### 시험 함정

모든 서브쿼리가 반드시 안쪽 Query를 먼저 한 번 실행한 뒤 바깥 Query가 실행되는 것은 아닙니다.

상관 서브쿼리는 바깥 Query의 값을 참조하므로 일반적인 독립 서브쿼리와 다르게 해석해야 합니다.

### 면접 짧은 답변

Correlated Subquery는 안쪽 Query가 바깥 Query의 Column을 참조하는 서브쿼리입니다. 바깥 Row의 값에 따라 안쪽 Query의 조건이 달라질 수 있으며, 부서별 평균과 현재 직원 값을 비교하거나 EXISTS로 관련 데이터 존재 여부를 확인할 때 자주 사용됩니다.

## 객관식 문제

### 문제 1 · 기본 개념

상관 서브쿼리의 특징으로 옳은 것은?

① 안쪽 Query가 바깥 Query와 완전히 독립적이다.  
② 안쪽 Query가 바깥 Query의 Column을 참조할 수 있다.  
③ 항상 여러 Row만 반환한다.  
④ CROSS JOIN에서만 사용할 수 있다.

<details markdown="1">
<summary>정답</summary>

②

상관 서브쿼리의 핵심은 안쪽 Query가 바깥 Query의 값을 참조한다는 점입니다.

</details>

### 문제 2 · 상관 조건 찾기

다음 SQL에서 상관 관계를 만드는 조건은?

```sql
SELECT
    E.EMP_NAME
FROM EMPLOYEE E
WHERE E.SALARY > (
    SELECT AVG(E2.SALARY)
    FROM EMPLOYEE E2
    WHERE E2.DEPT_ID = E.DEPT_ID
);
```

① `E.SALARY >`  
② `AVG(E2.SALARY)`  
③ `E2.DEPT_ID = E.DEPT_ID`  
④ `FROM EMPLOYEE E`

<details markdown="1">
<summary>정답</summary>

③

안쪽 Query의 `E2`가 바깥 Query의 `E`를 참조하고 있습니다.

</details>

### 문제 3 · 결과 판단

#### EMPLOYEE

| EMP_NAME | DEPT_ID | SALARY |
| --- | --- | ---: |
| 직원1 | 10 | 3000 |
| 직원2 | 10 | 5000 |

부서 10의 평균 급여가 4000일 때 다음 Query의 결과는?

```sql
SELECT
    E.EMP_NAME
FROM EMPLOYEE E
WHERE E.SALARY > (
    SELECT AVG(E2.SALARY)
    FROM EMPLOYEE E2
    WHERE E2.DEPT_ID = E.DEPT_ID
);
```

① 직원1  
② 직원2  
③ 직원1, 직원2  
④ 결과 없음

<details markdown="1">
<summary>정답</summary>

②

| EMP_NAME |
| --- |
| 직원2 |

직원2의 급여 5000만 부서 평균 4000보다 큽니다.

</details>

### 문제 4 · 일반 서브쿼리와 차이

다음 중 일반적인 독립 서브쿼리와 상관 서브쿼리를 구분하는 핵심 기준은?

① SELECT문의 Column 개수  
② 바깥 Query의 Column 참조 여부  
③ ORDER BY 존재 여부  
④ Table의 Row 수

<details markdown="1">
<summary>정답</summary>

②

안쪽 Query가 바깥 Query의 Column을 참조하면 상관 서브쿼리입니다.

</details>

### 문제 5 · EXISTS

다음 SQL이 상관 서브쿼리인 이유는?

```sql
SELECT
    D.DEPT_NAME
FROM DEPARTMENT D
WHERE EXISTS (
    SELECT 1
    FROM EMPLOYEE E
    WHERE E.DEPT_ID = D.DEPT_ID
);
```

① `SELECT 1`을 사용해서  
② `EXISTS`를 사용해서  
③ 안쪽 Query가 바깥의 `D.DEPT_ID`를 참조해서  
④ DEPARTMENT를 먼저 조회해서

<details markdown="1">
<summary>정답</summary>

③

`D.DEPT_ID`는 바깥 Query의 DEPARTMENT 별칭 D에서 가져온 값입니다.

</details>

## Correlated Subquery 전체 요약

### 입력 Table · EMPLOYEE

| EMP_NAME | DEPT_ID | SALARY |
| --- | --- | ---: |
| 직원1 | 10 | 3000 |
| 직원2 | 10 | 5000 |
| 직원3 | 20 | 4000 |
| 직원4 | 20 | 6000 |

```sql
SELECT
    E.EMP_NAME,
    E.SALARY
FROM EMPLOYEE E
WHERE E.SALARY > (
    SELECT AVG(E2.SALARY)
    FROM EMPLOYEE E2
    WHERE E2.DEPT_ID = E.DEPT_ID
);
```

### 결과 Table

| EMP_NAME | SALARY |
| --- | ---: |
| 직원2 | 5000 |
| 직원4 | 6000 |

```text
바깥 Row
→ 현재 DEPT_ID 제공

안쪽 Query
→ 같은 부서 평균 계산

바깥 Query
→ 현재 급여와 비교
```

<blockquote class="prompt-danger">
<p>상관 서브쿼리 문제에서는 안쪽 Query 안에 바깥 Query의 별칭이 등장하는지 먼저 확인합니다.</p>
</blockquote>

## 다음에 이을 글

**IN · EXISTS**입니다.

여러 값의 포함 여부를 확인하는 IN과 관련 Row의 존재 여부를 확인하는 EXISTS를 비교합니다.
