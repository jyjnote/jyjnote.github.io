---
title: IN · EXISTS
date: 2026-09-18 22:30:00 +0900
slug: in-exists
permalink: /posts/in-exists/
categories: [CS, 데이터베이스]
tags: [IN, EXISTS, NOTIN, NOTEXISTS, Subquery, 서브쿼리, SQL, 정보처리기사, NCS]
math: true
---

`IN`과 `EXISTS`는 <mark>서브쿼리 결과를 이용해 조건을 판단하는 대표적인 연산자</mark>입니다.

`IN`은 특정 값이 결과 집합에 포함되는지를 확인하고, `EXISTS`는 조건을 만족하는 Row가 하나라도 존재하는지를 확인합니다.

<blockquote class="prompt-info">
<p>한 줄: IN은 값 비교, EXISTS는 Row 존재 여부 확인입니다.</p>
</blockquote>

<details markdown="1">
<summary>한 줄로</summary>

`IN`은 여러 값 중 하나와 일치하는지, `EXISTS`는 조건에 맞는 Row가 존재하는지를 확인합니다.

</details>

## IN

`IN`은 왼쪽 값이 서브쿼리 결과 중 하나와 같으면 참입니다.

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

서브쿼리 결과는 `10`, `30`입니다.

```text
DEPT_ID IN (10, 30)

→ 10 또는 30이면 참
```

## EXISTS

`EXISTS`는 서브쿼리가 Row를 하나라도 반환하면 참입니다.

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

개발과 인사에는 직원 Row가 존재하므로 결과에 포함됩니다.

영업은 연결되는 직원 Row가 없으므로 제외됩니다.

```text
조건을 만족하는 Row 존재
→ TRUE

조건을 만족하는 Row 없음
→ FALSE
```

## IN과 EXISTS 비교

| 구분 | IN | EXISTS |
| --- | --- | --- |
| 판단 기준 | 값의 포함 여부 | Row 존재 여부 |
| 서브쿼리 결과 | 여러 값 | Row가 존재하는지만 확인 |
| 대표 형태 | 다중행 서브쿼리 | 상관 서브쿼리와 자주 사용 |
| 핵심 질문 | 이 값이 목록 안에 있는가? | 조건에 맞는 Row가 있는가? |

### IN

```sql
WHERE DEPT_ID IN (
    SELECT DEPT_ID
    FROM DEPARTMENT
)
```

```text
DEPT_ID 값
→ 서브쿼리 결과에 포함되는가?
```

### EXISTS

```sql
WHERE EXISTS (
    SELECT 1
    FROM EMPLOYEE E
    WHERE E.DEPT_ID = D.DEPT_ID
)
```

```text
현재 부서와 연결되는 직원 Row가 존재하는가?
```

## EXISTS에서 SELECT 1을 쓰는 이유

`EXISTS`는 서브쿼리가 어떤 값을 SELECT하는지보다 <mark>Row가 존재하는지</mark>를 확인합니다.

따라서 다음과 같이 `SELECT 1`을 자주 사용합니다.

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

`1`이라는 값 자체가 중요한 것은 아닙니다.

조건을 만족하는 Row가 하나라도 존재하는지가 중요합니다.

## NOT EXISTS

`NOT EXISTS`는 조건에 맞는 Row가 하나도 없을 때 참입니다.

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
| 직원2 | 20 |

```sql
SELECT
    D.DEPT_NAME
FROM DEPARTMENT D
WHERE NOT EXISTS (
    SELECT 1
    FROM EMPLOYEE E
    WHERE E.DEPT_ID = D.DEPT_ID
);
```

### 결과 Table

| DEPT_NAME |
| --- |
| 영업 |

영업 부서는 연결되는 직원 Row가 하나도 없으므로 결과에 포함됩니다.

## NOT IN과 NULL 주의

`NOT IN`은 서브쿼리 결과에 `NULL`이 포함되면 예상과 다른 결과가 나올 수 있습니다.

### 입력 Table · EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | 20 |
| 직원3 | 30 |

### 서브쿼리 결과

| DEPT_ID |
| --- |
| 10 |
| NULL |

```sql
SELECT
    EMP_NAME
FROM EMPLOYEE
WHERE DEPT_ID NOT IN (
    SELECT DEPT_ID
    FROM SOME_TABLE
);
```

이 경우 `NULL` 때문에 비교 결과가 단순한 참·거짓으로 결정되지 않을 수 있습니다.

<blockquote class="prompt-warning">
<p>NOT IN 문제에서는 서브쿼리 결과에 NULL이 포함될 가능성을 반드시 확인합니다.</p>
</blockquote>

필요하면 서브쿼리에서 NULL을 제거할 수 있습니다.

```sql
SELECT
    EMP_NAME
FROM EMPLOYEE
WHERE DEPT_ID NOT IN (
    SELECT DEPT_ID
    FROM SOME_TABLE
    WHERE DEPT_ID IS NOT NULL
);
```

## 잘 놓치는 핵심

### 1. IN은 값 자체를 비교한다

```text
값 IN (값1, 값2, 값3)
```

형태로 생각하면 쉽습니다.

### 2. EXISTS는 반환값보다 Row 존재 여부가 중요하다

`SELECT 1`의 `1` 자체를 비교하는 것이 아닙니다.

### 3. EXISTS는 상관 서브쿼리와 자주 사용된다

안쪽 Query가 바깥 Query의 현재 Row를 참조하여 관련 Row가 존재하는지 확인하는 형태가 대표적입니다.

### 4. NOT IN에서는 NULL을 조심한다

서브쿼리 결과에 `NULL`이 있으면 조건 판단이 예상과 달라질 수 있습니다.

## 시험·면접

### 핵심 암기

```text
IN
→ 여러 값 중 하나와 일치
```

```text
EXISTS
→ 조건을 만족하는 Row가 하나라도 존재
```

```text
NOT EXISTS
→ 조건을 만족하는 Row가 없음
```

```text
NOT IN
→ NULL 주의
```

### 시험 함정

`EXISTS (SELECT 1 ...)`에서 숫자 `1`을 비교한다고 생각하면 안 됩니다.

`EXISTS`는 서브쿼리가 Row를 반환했는지만 확인합니다.

또한 `NOT IN` 문제에서는 서브쿼리에 `NULL`이 포함되는지 먼저 확인해야 합니다.

### 면접 짧은 답변

`IN`은 특정 값이 서브쿼리가 반환한 값 집합에 포함되는지를 확인하고, `EXISTS`는 서브쿼리 조건을 만족하는 Row가 하나라도 존재하는지를 확인합니다. `EXISTS`는 상관 서브쿼리와 자주 사용되며, `NOT IN`은 NULL이 포함될 때 주의가 필요합니다.

## 객관식 문제

### 문제 1 · IN

#### EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | 20 |
| 직원3 | 30 |

서브쿼리 결과가 `10`, `30`일 때 결과는?

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

① 직원1  
② 직원2  
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

### 문제 2 · EXISTS

`EXISTS`의 판단 기준으로 옳은 것은?

① 서브쿼리가 반환한 숫자의 크기  
② 서브쿼리가 반환한 Column 개수  
③ 조건을 만족하는 Row의 존재 여부  
④ 반드시 첫 번째 값이 1인지 여부

<details markdown="1">
<summary>정답</summary>

③

`EXISTS`는 조건을 만족하는 Row가 하나라도 존재하는지를 확인합니다.

</details>

### 문제 3 · SELECT 1

다음 SQL에서 `SELECT 1`의 의미로 가장 적절한 것은?

```sql
WHERE EXISTS (
    SELECT 1
    FROM EMPLOYEE E
    WHERE E.DEPT_ID = D.DEPT_ID
)
```

① 숫자 1과 DEPT_ID를 비교한다.  
② 숫자 1을 결과에 출력한다.  
③ 반환값 자체보다 Row가 존재하는지를 확인하기 위한 표현이다.  
④ 첫 번째 Row만 검색한다.

<details markdown="1">
<summary>정답</summary>

③

`EXISTS`에서는 SELECT하는 실제 값보다 Row가 존재하는지가 중요합니다.

</details>

### 문제 4 · NOT EXISTS

다음 Query의 목적은?

```sql
SELECT
    D.DEPT_NAME
FROM DEPARTMENT D
WHERE NOT EXISTS (
    SELECT 1
    FROM EMPLOYEE E
    WHERE E.DEPT_ID = D.DEPT_ID
);
```

① 직원이 있는 부서 조회  
② 직원이 없는 부서 조회  
③ 모든 직원 조회  
④ 모든 Row 조합 생성

<details markdown="1">
<summary>정답</summary>

②

연결되는 직원 Row가 하나도 없는 부서만 남습니다.

</details>

### 문제 5 · NOT IN

`NOT IN` 사용 시 가장 주의해야 할 것은?

① 서브쿼리의 Column 이름 길이  
② 결과에 NULL이 포함되는지 여부  
③ SELECT문의 들여쓰기  
④ Table 별칭의 길이

<details markdown="1">
<summary>정답</summary>

②

`NOT IN`의 서브쿼리 결과에 `NULL`이 포함되면 조건 결과가 예상과 달라질 수 있습니다.

</details>

## IN · EXISTS 전체 요약

### IN

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

```text
IN
→ 값이 결과 집합 안에 있는가?
```

### EXISTS

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

```text
EXISTS
→ 조건을 만족하는 Row가 있는가?
```

<blockquote class="prompt-danger">
<p>IN과 EXISTS 문제에서는 값 자체를 비교하는지, Row의 존재 여부를 확인하는지 먼저 구분합니다.</p>
</blockquote>

## 다음에 이을 글

**ANY · ALL**입니다.

여러 값 중 하나와 비교하는 ANY와 모든 값과 비교하는 ALL의 차이를 살펴봅니다.
