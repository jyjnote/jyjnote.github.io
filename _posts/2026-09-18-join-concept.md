---
title: JOIN · 조인의 개념
date: 2026-09-18 21:30:00 +0900
slug: sql-join-concept
permalink: /posts/sql-join-concept/
categories: [CS, 데이터베이스]
tags: [JOIN, 조인, INNERJOIN, LEFTJOIN, RIGHTJOIN, FULLJOIN, SELFJOIN, CROSSJOIN, SQL, 정보처리기사, NCS]
math: true
---

JOIN은 <mark>서로 관련된 여러 Table의 Row를 하나의 결과로 연결하여 조회하는 방법</mark>입니다.

관계형 데이터베이스에서는 데이터를 여러 Table로 나누어 저장하므로, 필요한 정보를 함께 볼 때 JOIN을 사용합니다.

<blockquote class="prompt-info">
<p>한 줄: JOIN은 서로 다른 Table에서 관계가 있는 Row를 찾아 하나의 결과 Table로 연결합니다.</p>
</blockquote>

<details markdown="1">
<summary>한 줄로</summary>

여러 Table을 연결 조건으로 묶어 하나의 조회 결과를 만드는 방법입니다.

</details>

## 가장 먼저 볼 예시

직원과 부서 정보가 서로 다른 Table에 저장되어 있다고 가정합니다.

### 입력 Table 1 · EMPLOYEE

| EMP_ID | EMP_NAME | DEPT_ID |
| --- | --- | --- |
| 1001 | 직원1 | 10 |
| 1002 | 직원2 | 20 |
| 1003 | 직원3 | 10 |

### 입력 Table 2 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |

직원 이름과 부서 이름을 같이 보고 싶다면 `DEPT_ID`를 기준으로 연결합니다.

<pre><code class="language-sql">SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
<span style="background-color:#DFF5E8;">INNER JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID</span>;</code></pre>

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | 인사 |
| 직원3 | 개발 |

```text
직원1.DEPT_ID = 10
개발.DEPT_ID = 10

→ 같은 값
→ 연결
```

## 왜 JOIN이 필요한가

직원 Table에 부서 이름까지 반복해서 저장하면 부서 이름이 바뀔 때 여러 Row를 수정해야 할 수 있습니다.

그래서 데이터를 역할별 Table로 나누고 필요한 순간에 JOIN으로 연결합니다.

### 입력 Table 1 · EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | 10 |
| 직원3 | 20 |

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
| 직원2 | 개발 |
| 직원3 | 인사 |

<blockquote class="prompt-info">
<p>저장은 여러 Table로 나누고, 조회할 때 필요한 관계를 JOIN으로 다시 연결합니다.</p>
</blockquote>

## JOIN의 기본 구조

가장 기본적인 형태는 다음과 같습니다.

```sql
SELECT 조회할_Column
FROM 기준_Table
JOIN 연결할_Table
    ON 연결_조건;
```

핵심은 `ON`입니다.

### 입력 Table 1 · EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |

### 입력 Table 2 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |

<pre><code class="language-sql">SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
JOIN DEPARTMENT D
    <span style="background-color:#DFF5E8;">ON E.DEPT_ID = D.DEPT_ID</span>;</code></pre>

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |

`ON E.DEPT_ID = D.DEPT_ID`는 두 Table에서 어떤 Row끼리 연결할지를 정합니다.

## Table 별칭

JOIN에서는 같은 이름의 Column이 여러 Table에 존재할 수 있으므로 별칭을 많이 사용합니다.

```text
EMPLOYEE
→ E

DEPARTMENT
→ D
```

### 입력 Table

| EMPLOYEE.DEPT_ID | DEPARTMENT.DEPT_ID |
| --- | --- |
| 10 | 10 |

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |

`E.DEPT_ID`처럼 적으면 어느 Table의 Column인지 바로 구분할 수 있습니다.

## JOIN의 주요 종류

JOIN 종류는 **어떤 Row를 결과에 남길 것인가**로 구분하면 쉽습니다.

공통 입력 Table을 사용합니다.

### 입력 Table 1 · EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | NULL |

### 입력 Table 2 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |

### INNER JOIN

양쪽에서 조건이 맞는 Row만 남깁니다.

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
INNER JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

#### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |

### LEFT JOIN

왼쪽 Table의 Row는 모두 남깁니다.

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
LEFT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

#### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | NULL |

### RIGHT JOIN

오른쪽 Table의 Row는 모두 남깁니다.

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
RIGHT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

#### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| NULL | 인사 |

### FULL OUTER JOIN

양쪽 Table의 Row를 모두 남깁니다.

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
FULL OUTER JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

#### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | NULL |
| NULL | 인사 |

### 한 번에 비교

| 종류 | 왼쪽 미연결 Row | 연결 Row | 오른쪽 미연결 Row |
| --- | --- | --- | --- |
| INNER JOIN | 제외 | 포함 | 제외 |
| LEFT JOIN | 포함 | 포함 | 제외 |
| RIGHT JOIN | 제외 | 포함 | 포함 |
| FULL OUTER JOIN | 포함 | 포함 | 포함 |

## SELF JOIN

SELF JOIN은 같은 Table을 서로 다른 역할로 두 번 사용하는 방식입니다.

### 입력 Table · EMPLOYEE

| EMP_ID | EMP_NAME | MANAGER_ID |
| --- | --- | --- |
| 1 | 팀장 | NULL |
| 2 | 직원1 | 1 |
| 3 | 직원2 | 1 |

<pre><code class="language-sql">SELECT
    E.EMP_NAME AS 직원,
    M.EMP_NAME AS 관리자
FROM EMPLOYEE E
<span style="background-color:#DFF5E8;">LEFT JOIN EMPLOYEE M
    ON E.MANAGER_ID = M.EMP_ID</span>;</code></pre>

### 결과 Table

| 직원 | 관리자 |
| --- | --- |
| 팀장 | NULL |
| 직원1 | 팀장 |
| 직원2 | 팀장 |

같은 EMPLOYEE Table을 `E`와 `M`이라는 서로 다른 역할로 사용합니다.

## CROSS JOIN

CROSS JOIN은 두 Table의 가능한 모든 Row 조합을 만듭니다.

### 입력 Table 1 · COLOR

| COLOR |
| --- |
| 검정 |
| 흰색 |

### 입력 Table 2 · SIZE

| SIZE |
| --- |
| S |
| M |
| L |

```sql
SELECT *
FROM COLOR
CROSS JOIN SIZE;
```

### 결과 Table

| COLOR | SIZE |
| --- | --- |
| 검정 | S |
| 검정 | M |
| 검정 | L |
| 흰색 | S |
| 흰색 | M |
| 흰색 | L |

```text
2 Row × 3 Row
= 6 Row
```

## JOIN과 Foreign Key

Foreign Key와 JOIN은 관련이 많지만 같은 개념은 아닙니다.

### 입력 Table 1 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |

### 입력 Table 2 · EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |

Foreign Key는 Table 사이의 참조 무결성을 관리하는 제약이고, JOIN은 조회 시 Row를 연결하는 연산입니다.

<blockquote class="prompt-warning">
<p>Foreign Key가 없더라도 SQL의 JOIN 조건을 만족하면 JOIN 자체는 가능합니다.</p>
</blockquote>

## 일대다 관계에서는 Row가 늘어날 수 있다

한 부서에 여러 직원이 있으면 하나의 부서 Row가 여러 결과 Row에 나타납니다.

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
JOIN EMPLOYEE E
    ON D.DEPT_ID = E.DEPT_ID;
```

### 결과 Table

| DEPT_NAME | EMP_NAME |
| --- | --- |
| 개발 | 직원1 |
| 개발 | 직원2 |
| 개발 | 직원3 |

JOIN 결과 Row 수가 원본 Table의 Row 수와 같다고 가정하면 안 됩니다.

## OUTER JOIN 뒤 WHERE 주의

LEFT JOIN으로 살려 둔 Row도 `WHERE` 조건 때문에 다시 제거될 수 있습니다.

### 입력 Table 1 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |

### 입력 Table 2 · EMPLOYEE

| EMP_NAME | DEPT_ID | SALARY |
| --- | --- | ---: |
| 직원1 | 10 | 4000 |

다음 Query를 봅니다.

```sql
SELECT
    D.DEPT_NAME,
    E.EMP_NAME
FROM DEPARTMENT D
LEFT JOIN EMPLOYEE E
    ON D.DEPT_ID = E.DEPT_ID
WHERE E.SALARY >= 3000;
```

### 결과 Table

| DEPT_NAME | EMP_NAME |
| --- | --- |
| 개발 | 직원1 |

인사 부서는 LEFT JOIN 직후에는 남지만, 직원 급여가 `NULL`이므로 WHERE에서 제거됩니다.

## 잘 놓치는 핵심

### 1. JOIN은 Column이 아니라 Row를 연결한다

`ON` 조건으로 어떤 Row와 어떤 Row가 연결될지 결정하고, SELECT에서 필요한 Column을 꺼냅니다.

### 2. JOIN 종류는 미연결 Row 처리 방식이 핵심이다

```text
INNER
→ 미연결 Row 제외

LEFT
→ 왼쪽 미연결 Row 유지

RIGHT
→ 오른쪽 미연결 Row 유지

FULL
→ 양쪽 미연결 Row 유지
```

### 3. NULL은 연결되지 않았다는 뜻일 수 있다

OUTER JOIN 결과의 `NULL`은 원래 값이 NULL인 경우뿐 아니라, 반대쪽에 연결되는 Row가 없어서 생길 수도 있습니다.

### 4. CROSS JOIN은 결과 Row 수가 곱으로 증가한다

큰 Table끼리 사용하면 결과가 급격히 커질 수 있습니다.

## 시험·면접

### 핵심 암기

```text
INNER JOIN
→ 연결되는 Row만
```

```text
LEFT JOIN
→ 왼쪽 전체 유지
```

```text
RIGHT JOIN
→ 오른쪽 전체 유지
```

```text
FULL OUTER JOIN
→ 양쪽 전체 유지
```

```text
SELF JOIN
→ 같은 Table을 서로 다른 역할로 연결
```

```text
CROSS JOIN
→ 모든 조합
```

### 시험 함정

JOIN 결과 Row 수는 단순히 원본 Table Row 수와 같지 않습니다.

특히 일대다 관계와 CROSS JOIN에서는 결과 Row가 크게 늘어날 수 있습니다.

### 면접 짧은 답변

JOIN은 두 개 이상의 Table에서 관련된 Row를 연결하여 하나의 결과로 조회하는 연산입니다. INNER JOIN은 연결되는 Row만, LEFT와 RIGHT JOIN은 각각 한쪽 Table의 Row를 모두 유지하며, FULL OUTER JOIN은 양쪽을 모두 유지합니다.

## 객관식 문제

### 문제 1 · INNER JOIN

#### EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | NULL |

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

INNER JOIN은 연결되는 Row만 남깁니다.

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |

</details>

### 문제 2 · LEFT JOIN

같은 입력 Table에서 다음 Query의 결과는?

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
LEFT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

① 직원1·개발만 나온다.  
② 직원1·개발, 직원2·NULL이 나온다.  
③ 직원1·개발, NULL·인사가 나온다.  
④ NULL·인사만 나온다.

<details markdown="1">
<summary>정답</summary>

②

왼쪽 EMPLOYEE의 Row를 모두 유지합니다.

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | NULL |

</details>

### 문제 3 · RIGHT JOIN

같은 입력 Table에서 다음 Query의 결과는?

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
RIGHT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

① 직원1·개발만 나온다.  
② 직원1·개발, 직원2·NULL이 나온다.  
③ 직원1·개발, NULL·인사가 나온다.  
④ 직원2·인사가 나온다.

<details markdown="1">
<summary>정답</summary>

③

오른쪽 DEPARTMENT의 모든 Row가 남습니다.

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| NULL | 인사 |

</details>

### 문제 4 · SELF JOIN

#### EMPLOYEE

| EMP_ID | EMP_NAME | MANAGER_ID |
| --- | --- | --- |
| 1 | 팀장 | NULL |
| 2 | 직원1 | 1 |

다음 Query의 목적은?

```sql
SELECT
    E.EMP_NAME,
    M.EMP_NAME
FROM EMPLOYEE E
LEFT JOIN EMPLOYEE M
    ON E.MANAGER_ID = M.EMP_ID;
```

① 직원과 부서를 연결한다.  
② 직원과 같은 Table의 관리자를 연결한다.  
③ 모든 직원 조합을 만든다.  
④ 직원 Row를 삭제한다.

<details markdown="1">
<summary>정답</summary>

②

같은 EMPLOYEE Table을 직원과 관리자 역할로 나누어 연결합니다.

| 직원 | 관리자 |
| --- | --- |
| 팀장 | NULL |
| 직원1 | 팀장 |

</details>

### 문제 5 · CROSS JOIN

#### COLOR

| COLOR |
| --- |
| 검정 |
| 흰색 |

#### SIZE

| SIZE |
| --- |
| S |
| M |
| L |

다음 Query의 결과 Row 수는?

```sql
SELECT *
FROM COLOR
CROSS JOIN SIZE;
```

① 2개  
② 3개  
③ 5개  
④ 6개

<details markdown="1">
<summary>정답</summary>

④

2 Row와 3 Row의 모든 조합이므로 6 Row입니다.

| COLOR | SIZE |
| --- | --- |
| 검정 | S |
| 검정 | M |
| 검정 | L |
| 흰색 | S |
| 흰색 | M |
| 흰색 | L |

</details>

## JOIN 전체 요약

| JOIN | 기억할 기준 |
| --- | --- |
| INNER JOIN | 양쪽에서 연결되는 Row만 |
| LEFT JOIN | 왼쪽 전체 유지 |
| RIGHT JOIN | 오른쪽 전체 유지 |
| FULL OUTER JOIN | 양쪽 전체 유지 |
| SELF JOIN | 같은 Table을 서로 다른 역할로 연결 |
| CROSS JOIN | 모든 Row 조합 |

<blockquote class="prompt-danger">
<p>JOIN 문제에서는 먼저 어떤 Table의 Row를 반드시 남겨야 하는지 확인한 뒤 JOIN 종류와 ON 조건을 판단합니다.</p>
</blockquote>

## 다음에 이을 글

**INNER JOIN**입니다.

JOIN 조건을 만족하는 Row만 결과에 남기는 가장 기본적인 JOIN부터 자세히 살펴봅니다.
