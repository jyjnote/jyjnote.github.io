---
title: LEFT OUTER JOIN · 레프트 아우터 조인
date: 2026-09-18 21:40:00 +0900
slug: left-join
permalink: /posts/left-outer-join/
categories: [CS, 데이터베이스]
tags: [LEFTJOIN, LEFTOUTERJOIN, 레프트조인, OUTERJOIN, JOIN, SQL, NULL, 정보처리기사, NCS]
math: true
---

LEFT OUTER JOIN은 <mark>왼쪽 Table의 모든 Row를 유지하면서, 오른쪽 Table에서 조건이 맞는 Row를 연결하는 JOIN</mark>입니다.

오른쪽에서 연결되는 Row가 없으면 오른쪽 Column에는 `NULL`이 들어갑니다.

<blockquote class="prompt-info">
<p>한 줄: LEFT JOIN은 왼쪽 Table은 전부 살리고, 오른쪽에서 맞는 Row가 없으면 NULL로 채웁니다.</p>
</blockquote>

<details markdown="1">
<summary>한 줄로</summary>

왼쪽 Table 전체를 유지하고 오른쪽 Table은 연결되는 경우만 붙입니다.

</details>

## 대표 예시

모든 직원과 소속 부서를 조회한다고 가정합니다.

### 입력 Table 1 · EMPLOYEE

| EMP_ID | EMP_NAME | DEPT_ID |
| --- | --- | --- |
| 1001 | 직원1 | 10 |
| 1002 | 직원2 | 20 |
| 1003 | 직원3 | NULL |

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
LEFT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | 인사 |
| 직원3 | NULL |

직원3은 연결되는 부서가 없지만 왼쪽 EMPLOYEE의 Row이므로 결과에 남습니다.

```text
직원1
→ 개발 연결

직원2
→ 인사 연결

직원3
→ 연결 실패
→ 직원3은 유지
→ 부서 값은 NULL
```

## 기본 문법

```sql
SELECT 조회할_Column
FROM 왼쪽_Table
LEFT JOIN 오른쪽_Table
    ON 연결_조건;
```

`LEFT OUTER JOIN`이라고 작성해도 같은 의미입니다.

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
LEFT OUTER JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

즉 `OUTER`는 생략할 수 있습니다.

## INNER JOIN과 차이

같은 입력 Table로 비교합니다.

### 입력 Table 1 · EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | NULL |

### 입력 Table 2 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |

### INNER JOIN

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

### LEFT JOIN

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
LEFT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

### 결과 Table

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

## 연결되지 않은 Row 찾기

LEFT JOIN은 오른쪽에 연결 상대가 없는 왼쪽 Row를 찾을 때 자주 사용합니다.

### 입력 Table 1 · EMPLOYEE

| EMP_ID | EMP_NAME | DEPT_ID |
| --- | --- | --- |
| 1 | 직원1 | 10 |
| 2 | 직원2 | NULL |

### 입력 Table 2 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |

```sql
SELECT
    E.EMP_NAME
FROM EMPLOYEE E
LEFT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID
WHERE D.DEPT_ID IS NULL;
```

### 결과 Table

| EMP_NAME |
| --- |
| 직원2 |

오른쪽 DEPARTMENT에 연결되는 Row가 없기 때문에 `D.DEPT_ID`가 `NULL`이 됩니다.

## ON과 WHERE 주의

LEFT JOIN에서 오른쪽 Table 조건을 `WHERE`에 넣으면 왼쪽 Row가 사라질 수 있습니다.

### 입력 Table 1 · EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | NULL |

### 입력 Table 2 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
LEFT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID
WHERE D.DEPT_NAME = '개발';
```

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |

직원2는 LEFT JOIN 직후에는 남아 있지만 `D.DEPT_NAME`이 `NULL`이므로 WHERE에서 제거됩니다.

<blockquote class="prompt-warning">
<p>LEFT JOIN으로 살린 Row도 WHERE 조건에 따라 최종 결과에서 제거될 수 있습니다.</p>
</blockquote>

## 일대다 관계

오른쪽에서 여러 Row가 연결되면 결과 Row 수도 늘어날 수 있습니다.

### 입력 Table 1 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |

### 입력 Table 2 · EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | 10 |

```sql
SELECT
    D.DEPT_NAME,
    E.EMP_NAME
FROM DEPARTMENT D
LEFT JOIN EMPLOYEE E
    ON D.DEPT_ID = E.DEPT_ID;
```

### 결과 Table

| DEPT_NAME | EMP_NAME |
| --- | --- |
| 개발 | 직원1 |
| 개발 | 직원2 |
| 인사 | NULL |

개발 부서 한 Row가 직원 두 명과 연결되어 결과에서는 두 Row로 나타납니다.

## 잘 놓치는 핵심

### 1. 왼쪽 Table의 Row는 모두 유지한다

연결되는 오른쪽 Row가 없어도 왼쪽 Row는 결과에 남습니다.

### 2. 연결 실패 시 오른쪽 Column이 NULL이 된다

```text
왼쪽 Row 존재
+
오른쪽 연결 실패

→ 왼쪽 유지
→ 오른쪽 NULL
```

### 3. Table 순서가 중요하다

```sql
A LEFT JOIN B
```

와

```sql
B LEFT JOIN A
```

는 유지하는 Table이 다르므로 결과가 달라질 수 있습니다.

### 4. WHERE 조건에 주의한다

오른쪽 Table의 Column을 WHERE에서 제한하면 NULL Row가 제거될 수 있습니다.

## 시험·면접

### 핵심 암기

```text
LEFT JOIN
→ 왼쪽 전체 유지
```

```text
연결 성공
→ 오른쪽 값 연결
```

```text
연결 실패
→ 오른쪽 NULL
```

```text
LEFT JOIN + 오른쪽 Key IS NULL
→ 연결되지 않은 왼쪽 Row 찾기
```

### 시험 함정

LEFT JOIN이라고 해서 최종 결과에서 왼쪽 Row가 무조건 모두 남는 것은 아닙니다.

JOIN 이후 WHERE에서 다시 제거될 수 있습니다.

### 면접 짧은 답변

LEFT OUTER JOIN은 왼쪽 Table의 모든 Row를 유지하면서 오른쪽 Table에서 JOIN 조건을 만족하는 Row를 연결하는 방식입니다. 연결되는 오른쪽 Row가 없으면 오른쪽 Column은 NULL이 되며, 연결되지 않은 데이터를 찾을 때도 자주 사용합니다.

## 객관식 문제

### 문제 1 · 기본 LEFT JOIN

#### EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | NULL |

#### DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |

다음 Query의 결과는?

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
③ 직원1·개발, NULL·직원2가 나온다.  
④ 결과가 없다.

<details markdown="1">
<summary>정답</summary>

②

왼쪽 EMPLOYEE의 모든 Row가 유지됩니다.

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | NULL |

</details>

### 문제 2 · OUTER 생략

다음 중 일반적으로 같은 의미인 것은?

① `LEFT JOIN`과 `LEFT OUTER JOIN`  
② `LEFT JOIN`과 `INNER JOIN`  
③ `LEFT JOIN`과 `CROSS JOIN`  
④ `LEFT JOIN`과 `FULL OUTER JOIN`

<details markdown="1">
<summary>정답</summary>

①

`OUTER`는 생략할 수 있습니다.

</details>

### 문제 3 · 연결되지 않은 Row 찾기

다음 조건의 의미로 가장 적절한 것은?

```sql
FROM EMPLOYEE E
LEFT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID
WHERE D.DEPT_ID IS NULL
```

① 부서가 있는 직원  
② 연결되는 부서가 없는 직원  
③ 모든 부서  
④ 모든 Row 조합

<details markdown="1">
<summary>정답</summary>

②

오른쪽 DEPARTMENT의 Key가 NULL이라는 것은 연결되는 부서 Row가 없다는 뜻입니다.

</details>

### 문제 4 · Table 순서

LEFT JOIN에서 결과를 반드시 유지하는 쪽은?

① 항상 오른쪽  
② 항상 왼쪽  
③ 양쪽 모두  
④ 어느 쪽도 아님

<details markdown="1">
<summary>정답</summary>

②

LEFT JOIN은 왼쪽 Table의 Row를 모두 유지합니다.

</details>

### 문제 5 · WHERE의 영향

#### EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | NULL |

#### DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |

다음 Query의 결과는?

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
LEFT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID
WHERE D.DEPT_NAME = '개발';
```

① 직원1만 나온다.  
② 직원2만 나온다.  
③ 직원1과 직원2가 모두 나온다.  
④ 결과가 없다.

<details markdown="1">
<summary>정답</summary>

①

직원2는 LEFT JOIN 직후에는 남지만 `D.DEPT_NAME`이 NULL이므로 WHERE 조건에서 제거됩니다.

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |

</details>

## LEFT OUTER JOIN 전체 요약

### 입력 Table 1 · EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | NULL |

### 입력 Table 2 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
LEFT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | NULL |

```text
LEFT JOIN
→ 왼쪽 전체 유지
→ 오른쪽 연결 실패 시 NULL
```

<blockquote class="prompt-danger">
<p>LEFT JOIN 문제에서는 먼저 어느 Table이 왼쪽인지 확인하고, 연결 실패 Row의 오른쪽 값이 NULL이 된다는 점을 기억합니다.</p>
</blockquote>

## 다음에 이을 글

**RIGHT OUTER JOIN**입니다.

오른쪽 Table의 모든 Row를 유지하는 구조를 LEFT JOIN과 비교하며 살펴봅니다.
