---
title: FULL OUTER JOIN · 풀 아우터 조인
date: 2026-09-18 21:50:00 +0900
slug: full-outer-join
permalink: /posts/full-outer-join/
categories: [CS, 데이터베이스]
tags: [FULLOUTERJOIN, FULLJOIN, 풀아우터조인, OUTERJOIN, JOIN, SQL, NULL, 정보처리기사, NCS]
math: true
---

FULL OUTER JOIN은 <mark>왼쪽 Table과 오른쪽 Table의 모든 Row를 유지하면서, 조건이 맞는 Row는 서로 연결하는 JOIN</mark>입니다.

한쪽에만 존재하는 Row도 결과에 남으며, 반대쪽에 연결되는 값이 없으면 `NULL`이 들어갑니다.

<blockquote class="prompt-info">
<p>한 줄: FULL OUTER JOIN은 양쪽 Table의 Row를 모두 살리고, 연결되지 않는 쪽은 NULL로 채웁니다.</p>
</blockquote>

<details markdown="1">
<summary>한 줄로</summary>

왼쪽과 오른쪽 Table의 모든 Row를 유지하는 JOIN입니다.

</details>

## 대표 예시

직원과 부서 Table을 연결한다고 가정합니다.

### 입력 Table 1 · EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | 99 |

### 입력 Table 2 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |

```sql
SELECT
    E.EMP_NAME,
    E.DEPT_ID AS EMP_DEPT_ID,
    D.DEPT_ID AS DEPT_ID,
    D.DEPT_NAME
FROM EMPLOYEE E
FULL OUTER JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

### 결과 Table

| EMP_NAME | EMP_DEPT_ID | DEPT_ID | DEPT_NAME |
| --- | --- | --- | --- |
| 직원1 | 10 | 10 | 개발 |
| 직원2 | 99 | NULL | NULL |
| NULL | NULL | 20 | 인사 |

직원1과 개발 부서는 `DEPT_ID = 10`으로 연결됩니다.

직원2는 연결되는 부서가 없지만 왼쪽 Row이므로 남습니다.

인사 부서도 연결되는 직원이 없지만 오른쪽 Row이므로 남습니다.

```text
양쪽에 존재
→ 연결

왼쪽에만 존재
→ 오른쪽 NULL

오른쪽에만 존재
→ 왼쪽 NULL
```

## 기본 문법

```sql
SELECT 조회할_Column
FROM 왼쪽_Table
FULL OUTER JOIN 오른쪽_Table
    ON 연결_조건;
```

`FULL JOIN`이라고 작성할 수 있는 환경도 있습니다.

```sql
SELECT *
FROM A
FULL JOIN B
    ON A.ID = B.ID;
```

핵심은 양쪽 Table의 미연결 Row도 모두 유지한다는 점입니다.

## INNER · LEFT · RIGHT · FULL 비교

같은 입력 Table로 비교하면 차이가 명확합니다.

### 입력 Table 1 · A

| ID |
| --- |
| 1 |
| 2 |

### 입력 Table 2 · B

| ID |
| --- |
| 1 |
| 3 |

### INNER JOIN 결과

| A.ID | B.ID |
| --- | --- |
| 1 | 1 |

### LEFT JOIN 결과

| A.ID | B.ID |
| --- | --- |
| 1 | 1 |
| 2 | NULL |

### RIGHT JOIN 결과

| A.ID | B.ID |
| --- | --- |
| 1 | 1 |
| NULL | 3 |

### FULL OUTER JOIN 결과

| A.ID | B.ID |
| --- | --- |
| 1 | 1 |
| 2 | NULL |
| NULL | 3 |

| JOIN | 왼쪽 미연결 Row | 연결 Row | 오른쪽 미연결 Row |
| --- | --- | --- | --- |
| INNER JOIN | 제외 | 포함 | 제외 |
| LEFT JOIN | 포함 | 포함 | 제외 |
| RIGHT JOIN | 제외 | 포함 | 포함 |
| FULL OUTER JOIN | 포함 | 포함 | 포함 |

## 연결되지 않은 Row 찾기

FULL OUTER JOIN을 사용하면 양쪽 중 한쪽에만 존재하는 Row를 한 번에 찾을 수 있습니다.

### 입력 Table 1 · A

| ID | NAME |
| --- | --- |
| 1 | 가 |
| 2 | 나 |

### 입력 Table 2 · B

| ID | VALUE |
| --- | --- |
| 1 | 하나 |
| 3 | 셋 |

```sql
SELECT
    A.ID AS A_ID,
    A.NAME,
    B.ID AS B_ID,
    B.VALUE
FROM A
FULL OUTER JOIN B
    ON A.ID = B.ID
WHERE A.ID IS NULL
   OR B.ID IS NULL;
```

### 결과 Table

| A_ID | NAME | B_ID | VALUE |
| --- | --- | --- | --- |
| 2 | 나 | NULL | NULL |
| NULL | NULL | 3 | 셋 |

`ID = 2`는 왼쪽에만 있고, `ID = 3`은 오른쪽에만 있습니다.

<blockquote class="prompt-info">
<p>FULL OUTER JOIN에 한쪽 Key의 NULL 조건을 사용하면 서로 대응되지 않는 Row를 찾을 수 있습니다.</p>
</blockquote>

## 중복 Key가 있으면 Row 수가 늘어난다

FULL OUTER JOIN도 중복 Key가 있으면 가능한 연결 조합이 모두 만들어집니다.

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
FULL OUTER JOIN B
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

## WHERE 사용 시 주의

FULL OUTER JOIN으로 살린 Row도 WHERE 조건 때문에 제거될 수 있습니다.

### 입력 Table 1 · EMPLOYEE

| EMP_NAME | DEPT_ID | SALARY |
| --- | --- | ---: |
| 직원1 | 10 | 3500 |
| 직원2 | 99 | 2500 |

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
FULL OUTER JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID
WHERE E.SALARY >= 3000;
```

### 결과 Table

| EMP_NAME | SALARY | DEPT_NAME |
| --- | ---: | --- |
| 직원1 | 3500 | 개발 |

직원2는 급여 조건을 만족하지 못해 제거됩니다.

인사 부서는 `E.SALARY`가 `NULL`이므로 WHERE 조건에서 제거됩니다.

<blockquote class="prompt-warning">
<p>FULL OUTER JOIN이라도 WHERE를 적용한 최종 결과에서는 양쪽의 모든 Row가 남지 않을 수 있습니다.</p>
</blockquote>

## 잘 놓치는 핵심

### 1. 양쪽 Table의 Row를 모두 유지한다

```text
왼쪽만 존재
→ 오른쪽 NULL

오른쪽만 존재
→ 왼쪽 NULL

양쪽 모두 존재
→ 연결
```

### 2. 결과 Row 수는 단순 합이 아니다

같은 Key가 여러 번 존재하면 연결 조합 수만큼 Row가 늘어날 수 있습니다.

### 3. FULL OUTER JOIN과 UNION은 다르다

FULL OUTER JOIN은 관계를 기준으로 Column을 옆으로 연결합니다.

UNION은 같은 구조의 조회 결과를 아래로 합칩니다.

### 4. DBMS 지원 여부를 확인한다

FULL OUTER JOIN의 직접 지원 여부는 사용하는 데이터베이스 시스템에 따라 다를 수 있습니다.

## 시험·면접

### 핵심 암기

```text
FULL OUTER JOIN
→ 양쪽 전체 유지
```

```text
왼쪽만 존재
→ 오른쪽 NULL
```

```text
오른쪽만 존재
→ 왼쪽 NULL
```

```text
한쪽 Key IS NULL
→ 미연결 Row 확인
```

### 시험 함정

FULL OUTER JOIN의 결과 Row 수를 단순히 왼쪽 Row 수와 오른쪽 Row 수의 합으로 계산하면 안 됩니다.

양쪽에서 연결되는 Row는 하나로 합쳐지고, 중복 Key가 있으면 여러 조합이 만들어질 수 있습니다.

### 면접 짧은 답변

FULL OUTER JOIN은 왼쪽과 오른쪽 Table의 모든 Row를 유지하면서 JOIN 조건을 만족하는 Row는 연결하는 방식입니다. 한쪽에만 존재하는 Row도 결과에 남고, 반대쪽 Column에는 NULL이 들어갑니다.

## 객관식 문제

### 문제 1 · 기본 FULL OUTER JOIN

#### A

| ID |
| --- |
| 1 |
| 2 |

#### B

| ID |
| --- |
| 1 |
| 3 |

다음 Query의 결과로 옳은 것은?

```sql
SELECT
    A.ID AS A_ID,
    B.ID AS B_ID
FROM A
FULL OUTER JOIN B
    ON A.ID = B.ID;
```

① `1, 1`만 나온다.  
② `1, 1`, `2, NULL`만 나온다.  
③ `1, 1`, `NULL, 3`만 나온다.  
④ `1, 1`, `2, NULL`, `NULL, 3`이 나온다.

<details markdown="1">
<summary>정답</summary>

④

양쪽 Table의 모든 Row가 유지됩니다.

| A_ID | B_ID |
| --- | --- |
| 1 | 1 |
| 2 | NULL |
| NULL | 3 |

</details>

### 문제 2 · NULL 위치

왼쪽에만 존재하는 Row가 FULL OUTER JOIN 결과에 남으면 어떻게 되는가?

① 왼쪽 값이 NULL이 된다.  
② 오른쪽 값이 NULL이 된다.  
③ Row가 제거된다.  
④ 모든 값이 0이 된다.

<details markdown="1">
<summary>정답</summary>

②

왼쪽 Row는 유지되고 연결되는 오른쪽 Row가 없으므로 오른쪽 Column이 NULL이 됩니다.

</details>

### 문제 3 · 미연결 Row 찾기

다음 조건의 의미로 가장 적절한 것은?

```sql
WHERE A.ID IS NULL
   OR B.ID IS NULL
```

① 양쪽 모두 연결된 Row  
② 어느 한쪽에만 존재하는 Row  
③ 모든 Row 제거  
④ CROSS JOIN 결과

<details markdown="1">
<summary>정답</summary>

②

FULL OUTER JOIN 결과에서 한쪽 Key가 NULL이면 반대쪽에 연결되는 Row가 없다는 뜻입니다.

</details>

### 문제 4 · 중복 Key

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

다음 FULL OUTER JOIN의 결과 Row 수는?

```sql
SELECT *
FROM A
FULL OUTER JOIN B
    ON A.ID = B.ID;
```

① 2개  
② 3개  
③ 5개  
④ 6개

<details markdown="1">
<summary>정답</summary>

④

```text
2 × 3
= 6 Row
```

같은 Key를 가진 가능한 연결 조합이 모두 만들어집니다.

</details>

### 문제 5 · JOIN 비교

다음 중 양쪽 Table의 미연결 Row까지 모두 유지하는 JOIN은?

① INNER JOIN  
② LEFT JOIN  
③ RIGHT JOIN  
④ FULL OUTER JOIN

<details markdown="1">
<summary>정답</summary>

④

FULL OUTER JOIN은 왼쪽과 오른쪽 Table의 모든 Row를 유지합니다.

</details>

## FULL OUTER JOIN 전체 요약

### 입력 Table 1 · A

| ID |
| --- |
| 1 |
| 2 |

### 입력 Table 2 · B

| ID |
| --- |
| 1 |
| 3 |

```sql
SELECT
    A.ID AS A_ID,
    B.ID AS B_ID
FROM A
FULL OUTER JOIN B
    ON A.ID = B.ID;
```

### 결과 Table

| A_ID | B_ID |
| --- | --- |
| 1 | 1 |
| 2 | NULL |
| NULL | 3 |

```text
FULL OUTER JOIN
→ 양쪽 전체 유지
→ 연결 실패한 반대쪽은 NULL
```

<blockquote class="prompt-danger">
<p>FULL OUTER JOIN 문제에서는 연결 Row, 왼쪽 전용 Row, 오른쪽 전용 Row를 나누어 생각하면 빠르게 풀 수 있습니다.</p>
</blockquote>

## 다음에 이을 글

**CROSS JOIN**입니다.

두 Table의 가능한 모든 Row 조합을 만드는 구조를 살펴봅니다.
