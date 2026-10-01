---
title: RIGHT OUTER JOIN · 라이트 아우터 조인
date: 2026-09-18 21:45:00 +0900
slug: right-outer-join
permalink: /posts/right-outer-join/
categories: [CS, 데이터베이스]
tags: [RIGHTJOIN, RIGHTOUTERJOIN, 라이트조인, OUTERJOIN, JOIN, SQL, NULL, 정보처리기사, NCS]
math: true
---

RIGHT OUTER JOIN은 <mark>오른쪽 Table의 모든 Row를 유지하면서, 왼쪽 Table에서 조건이 맞는 Row를 연결하는 JOIN</mark>입니다.

왼쪽에서 연결되는 Row가 없으면 왼쪽 Column에는 `NULL`이 들어갑니다.

<blockquote class="prompt-info">
<p>한 줄: RIGHT JOIN은 오른쪽 Table은 전부 살리고, 왼쪽에서 맞는 Row가 없으면 NULL로 채웁니다.</p>
</blockquote>

<details markdown="1">
<summary>한 줄로</summary>

오른쪽 Table 전체를 유지하고 왼쪽 Table은 연결되는 경우만 붙입니다.

</details>

## 대표 예시

모든 부서와 소속 직원을 조회한다고 가정합니다.

### 입력 Table 1 · EMPLOYEE

| EMP_ID | EMP_NAME | DEPT_ID |
| --- | --- | --- |
| 1001 | 직원1 | 10 |
| 1002 | 직원2 | 20 |

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
RIGHT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | 인사 |
| NULL | 영업 |

영업 부서는 연결되는 직원이 없지만 오른쪽 DEPARTMENT의 Row이므로 결과에 남습니다.

```text
개발
→ 직원1 연결

인사
→ 직원2 연결

영업
→ 연결 실패
→ 영업은 유지
→ 직원 값은 NULL
```

## 기본 문법

```sql
SELECT 조회할_Column
FROM 왼쪽_Table
RIGHT JOIN 오른쪽_Table
    ON 연결_조건;
```

`RIGHT OUTER JOIN`이라고 작성해도 같은 의미입니다.

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
RIGHT OUTER JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

즉 `OUTER`는 생략할 수 있습니다.

## LEFT JOIN과 비교

RIGHT JOIN은 오른쪽 Table을 유지하고, LEFT JOIN은 왼쪽 Table을 유지합니다.

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

### RIGHT JOIN

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
RIGHT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| NULL | 인사 |

```text
LEFT JOIN
→ 왼쪽 전체 유지

RIGHT JOIN
→ 오른쪽 전체 유지
```

## LEFT JOIN으로 바꿔 생각할 수 있다

RIGHT JOIN은 Table 순서를 바꾸면 LEFT JOIN으로 표현할 수 있습니다.

### 입력 Table 1 · EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |

### 입력 Table 2 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |

다음 두 Query는 같은 결과를 만듭니다.

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
RIGHT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM DEPARTMENT D
LEFT JOIN EMPLOYEE E
    ON E.DEPT_ID = D.DEPT_ID;
```

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| NULL | 인사 |

```text
A RIGHT JOIN B
≈
B LEFT JOIN A
```

## 연결되지 않은 오른쪽 Row 찾기

RIGHT JOIN은 왼쪽에 연결 상대가 없는 오른쪽 Row를 찾을 때 사용할 수 있습니다.

### 입력 Table 1 · EMPLOYEE

| EMP_ID | EMP_NAME | DEPT_ID |
| --- | --- | --- |
| 1 | 직원1 | 10 |

### 입력 Table 2 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |

```sql
SELECT
    D.DEPT_NAME
FROM EMPLOYEE E
RIGHT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID
WHERE E.EMP_ID IS NULL;
```

### 결과 Table

| DEPT_NAME |
| --- |
| 인사 |

인사 부서는 연결되는 직원이 없기 때문에 왼쪽 직원 정보가 `NULL`입니다.

## WHERE 사용 시 주의

RIGHT JOIN으로 유지한 오른쪽 Row도 WHERE 조건 때문에 제거될 수 있습니다.

### 입력 Table 1 · EMPLOYEE

| EMP_NAME | DEPT_ID | SALARY |
| --- | --- | ---: |
| 직원1 | 10 | 3500 |

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
RIGHT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID
WHERE E.SALARY >= 3000;
```

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |

인사는 RIGHT JOIN 직후에는 남지만 `E.SALARY`가 `NULL`이므로 WHERE에서 제거됩니다.

<blockquote class="prompt-warning">
<p>RIGHT JOIN으로 살린 오른쪽 Row도 WHERE 조건에 따라 최종 결과에서 제거될 수 있습니다.</p>
</blockquote>

## 잘 놓치는 핵심

### 1. 오른쪽 Table의 Row는 모두 유지한다

연결되는 왼쪽 Row가 없어도 오른쪽 Row는 결과에 남습니다.

### 2. 연결 실패 시 왼쪽 Column이 NULL이 된다

```text
오른쪽 Row 존재
+
왼쪽 연결 실패

→ 오른쪽 유지
→ 왼쪽 NULL
```

### 3. Table 순서가 중요하다

```sql
A RIGHT JOIN B
```

에서는 B의 Row를 모두 유지합니다.

### 4. RIGHT JOIN은 LEFT JOIN으로 바꿔 생각할 수 있다

Table 순서를 뒤집으면 같은 결과를 LEFT JOIN으로 표현할 수 있습니다.

## 시험·면접

### 핵심 암기

```text
RIGHT JOIN
→ 오른쪽 전체 유지
```

```text
연결 성공
→ 왼쪽 값 연결
```

```text
연결 실패
→ 왼쪽 NULL
```

```text
RIGHT JOIN + 왼쪽 Key IS NULL
→ 연결되지 않은 오른쪽 Row 찾기
```

### 시험 함정

RIGHT JOIN은 양쪽 Table의 모든 Row를 유지하는 JOIN이 아닙니다.

오른쪽 Table만 모두 유지하고, 왼쪽에만 있는 미연결 Row는 결과에서 제외됩니다.

### 면접 짧은 답변

RIGHT OUTER JOIN은 오른쪽 Table의 모든 Row를 유지하면서 왼쪽 Table에서 JOIN 조건을 만족하는 Row를 연결하는 방식입니다. 연결되는 왼쪽 Row가 없으면 왼쪽 Column이 NULL이 되며, Table 순서를 바꾸면 LEFT JOIN으로도 같은 결과를 표현할 수 있습니다.

## 객관식 문제

### 문제 1 · 기본 RIGHT JOIN

#### EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |

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
RIGHT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

① 직원1·개발만 나온다.  
② 직원1·개발, NULL·인사가 나온다.  
③ 직원1·개발, 직원1·인사가 나온다.  
④ 결과가 없다.

<details markdown="1">
<summary>정답</summary>

②

오른쪽 DEPARTMENT의 모든 Row가 유지됩니다.

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| NULL | 인사 |

</details>

### 문제 2 · OUTER 생략

다음 중 일반적으로 같은 의미인 것은?

① `RIGHT JOIN`과 `RIGHT OUTER JOIN`  
② `RIGHT JOIN`과 `INNER JOIN`  
③ `RIGHT JOIN`과 `CROSS JOIN`  
④ `RIGHT JOIN`과 `FULL OUTER JOIN`

<details markdown="1">
<summary>정답</summary>

①

`OUTER`는 생략할 수 있습니다.

</details>

### 문제 3 · 연결되지 않은 부서 찾기

다음 Query의 목적은?

```sql
SELECT
    D.DEPT_NAME
FROM EMPLOYEE E
RIGHT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID
WHERE E.EMP_ID IS NULL;
```

① 직원이 있는 부서  
② 직원이 없는 부서  
③ 모든 직원  
④ 모든 Row 조합

<details markdown="1">
<summary>정답</summary>

②

왼쪽 직원 Key가 NULL이면 연결되는 직원이 없는 오른쪽 부서 Row입니다.

</details>

### 문제 4 · 유지되는 Table

RIGHT JOIN에서 반드시 유지되는 쪽은?

① 왼쪽 Table  
② 오른쪽 Table  
③ 양쪽 Table  
④ 어느 쪽도 아님

<details markdown="1">
<summary>정답</summary>

②

RIGHT JOIN은 오른쪽 Table의 모든 Row를 유지합니다.

</details>

### 문제 5 · LEFT JOIN으로 변환

다음과 같은 의미의 표현은?

```sql
A RIGHT JOIN B
    ON A.ID = B.ID
```

① `A LEFT JOIN B`  
② `B LEFT JOIN A`  
③ `A CROSS JOIN B`  
④ `A INNER JOIN B`

<details markdown="1">
<summary>정답</summary>

②

Table 순서를 바꾸고 LEFT JOIN을 사용하면 같은 보존 방향을 만들 수 있습니다.

```sql
B LEFT JOIN A
    ON A.ID = B.ID
```

</details>

## RIGHT OUTER JOIN 전체 요약

### 입력 Table 1 · EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |

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
RIGHT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| NULL | 인사 |

```text
RIGHT JOIN
→ 오른쪽 전체 유지
→ 왼쪽 연결 실패 시 NULL
```

<blockquote class="prompt-danger">
<p>RIGHT JOIN 문제에서는 먼저 어느 Table이 오른쪽인지 확인하고, 연결 실패 Row의 왼쪽 값이 NULL이 된다는 점을 기억합니다.</p>
</blockquote>

## 다음에 이을 글

**FULL OUTER JOIN**입니다.

왼쪽과 오른쪽 Table의 Row를 모두 유지하는 구조를 살펴봅니다.
