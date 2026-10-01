---
title: UNION · UNION ALL
date: 2026-09-18 22:40:00 +0900
slug: union-union-all
permalink: /posts/union-union-all/
categories: [CS, 데이터베이스]
tags: [UNION, UNIONALL, 집합연산자, SQL, 중복제거, 정보처리기사, NCS]
math: true
---

`UNION`과 `UNION ALL`은 <mark>여러 SELECT문의 결과를 세로 방향으로 합치는 집합 연산자</mark>입니다.

차이는 중복 Row를 제거하는지 여부입니다.

<blockquote class="prompt-info">
<p>한 줄: UNION은 중복 제거, UNION ALL은 중복 유지입니다.</p>
</blockquote>

<details markdown="1">
<summary>한 줄로</summary>

두 SELECT 결과를 아래로 합치되, `UNION`은 중복을 제거하고 `UNION ALL`은 그대로 유지합니다.

</details>

## 대표 예시

두 지역의 고객 이름을 하나의 결과로 합친다고 가정합니다.

### 입력 Table 1 · CUSTOMER_A

| NAME |
| --- |
| 김철수 |
| 이영희 |
| 박민수 |

### 입력 Table 2 · CUSTOMER_B

| NAME |
| --- |
| 박민수 |
| 최수진 |

```sql
SELECT NAME
FROM CUSTOMER_A

UNION

SELECT NAME
FROM CUSTOMER_B;
```

### 결과 Table

| NAME |
| --- |
| 김철수 |
| 이영희 |
| 박민수 |
| 최수진 |

`박민수`는 두 SELECT 결과에 모두 존재하지만 `UNION`이 중복을 제거합니다.

## UNION ALL

같은 입력 Table에 `UNION ALL`을 사용합니다.

```sql
SELECT NAME
FROM CUSTOMER_A

UNION ALL

SELECT NAME
FROM CUSTOMER_B;
```

### 결과 Table

| NAME |
| --- |
| 김철수 |
| 이영희 |
| 박민수 |
| 박민수 |
| 최수진 |

`UNION ALL`은 중복 Row를 제거하지 않습니다.

```text
UNION
→ 중복 제거

UNION ALL
→ 중복 유지
```

## 기본 문법

```sql
SELECT Column1, Column2
FROM Table1

UNION

SELECT Column1, Column2
FROM Table2;
```

또는

```sql
SELECT Column1, Column2
FROM Table1

UNION ALL

SELECT Column1, Column2
FROM Table2;
```

## SELECT Column 수가 같아야 한다

UNION 계열 연산에서는 각 SELECT가 반환하는 Column 수가 같아야 합니다.

### 올바른 예

```sql
SELECT CUSTOMER_ID, NAME
FROM CUSTOMER

UNION

SELECT EMP_ID, EMP_NAME
FROM EMPLOYEE;
```

두 SELECT 모두 Column이 2개입니다.

### 잘못된 예

```sql
SELECT CUSTOMER_ID, NAME
FROM CUSTOMER

UNION

SELECT EMP_ID
FROM EMPLOYEE;
```

첫 번째 SELECT는 2개, 두 번째 SELECT는 1개의 Column을 반환합니다.

```text
Column 수 불일치
→ 집합 연산 불가
```

## 대응되는 Column의 자료형도 호환되어야 한다

같은 위치의 Column끼리 서로 비교되고 합쳐집니다.

### 예시

```sql
SELECT CUSTOMER_ID, NAME
FROM CUSTOMER

UNION ALL

SELECT EMP_ID, EMP_NAME
FROM EMPLOYEE;
```

```text
1번째 Column
CUSTOMER_ID ↔ EMP_ID

2번째 Column
NAME ↔ EMP_NAME
```

각 위치의 자료형이 서로 호환될 수 있어야 합니다.

## 결과 Column 이름은 첫 번째 SELECT 기준

### 입력 Query

```sql
SELECT
    CUSTOMER_ID AS ID,
    NAME AS PERSON_NAME
FROM CUSTOMER

UNION ALL

SELECT
    EMP_ID AS EMPLOYEE_ID,
    EMP_NAME AS EMPLOYEE_NAME
FROM EMPLOYEE;
```

### 결과 Column

| ID | PERSON_NAME |
| --- | --- |

결과 Column 이름은 일반적으로 첫 번째 SELECT의 Column 이름 또는 별칭을 기준으로 정해집니다.

두 번째 SELECT의 별칭이 최종 Column 이름을 결정하는 것은 아닙니다.

## ORDER BY는 마지막에 작성

전체 UNION 결과를 정렬하려면 마지막 SELECT 뒤에 `ORDER BY`를 작성합니다.

### 입력 Table 1 · A

| NAME |
| --- |
| 나 |
| 가 |

### 입력 Table 2 · B

| NAME |
| --- |
| 라 |
| 다 |

```sql
SELECT NAME
FROM A

UNION ALL

SELECT NAME
FROM B

ORDER BY NAME;
```

### 결과 Table

| NAME |
| --- |
| 가 |
| 나 |
| 다 |
| 라 |

`ORDER BY`는 합쳐진 전체 결과에 적용됩니다.

## UNION과 JOIN 차이

둘은 데이터를 합친다는 점에서 헷갈리기 쉽지만 방향이 다릅니다.

### UNION

```text
SELECT 결과
↓
SELECT 결과
```

Row를 아래로 합칩니다.

### JOIN

```text
Table A | Table B
```

관계가 있는 Column을 옆으로 연결합니다.

| 구분 | UNION | JOIN |
| --- | --- | --- |
| 결합 방향 | 세로 | 가로 |
| 기준 | SELECT 결과 구조 | JOIN 조건 |
| 대표 목적 | 같은 형식의 결과 합치기 | 관련 Table 연결 |

JOIN의 자세한 내용은 JOIN 글에서 별도로 다룹니다.

## UNION과 UNION ALL의 성능 차이

`UNION`은 중복을 제거하는 과정이 필요합니다.

`UNION ALL`은 중복 제거 없이 결과를 그대로 합칩니다.

따라서 중복 제거가 필요하지 않다면 일반적으로 `UNION ALL`이 더 단순한 처리가 가능합니다.

<blockquote class="prompt-warning">
<p>중복을 제거할 필요가 없다면 UNION을 습관적으로 사용하지 말고 UNION ALL이 목적에 맞는지 확인합니다.</p>
</blockquote>

## 잘 놓치는 핵심

### 1. UNION은 중복 제거

완전히 같은 결과 Row가 여러 번 나오면 하나만 남깁니다.

### 2. UNION ALL은 중복 유지

각 SELECT가 반환한 Row를 그대로 이어 붙입니다.

### 3. Column 수가 같아야 한다

```text
첫 번째 SELECT
2 Column

두 번째 SELECT
2 Column

→ 가능
```

### 4. 같은 위치의 Column끼리 대응한다

Column 이름이 같아야 하는 것은 아니지만, 같은 위치의 자료형은 호환되어야 합니다.

### 5. 결과 Column 이름은 첫 번째 SELECT 기준

두 번째 SELECT의 별칭보다 첫 번째 SELECT의 이름이 중요합니다.

## 시험·면접

### 핵심 암기

```text
UNION
→ 세로 결합
→ 중복 제거
```

```text
UNION ALL
→ 세로 결합
→ 중복 유지
```

```text
집합 연산
→ SELECT Column 수 동일
→ 대응 Column 자료형 호환
```

```text
ORDER BY
→ 전체 집합 연산 마지막
```

### 시험 함정

`UNION ALL`도 중복을 제거한다고 생각하면 안 됩니다.

또한 두 SELECT의 Column 이름이 반드시 같아야 하는 것은 아니지만, Column 수와 위치별 자료형은 맞아야 합니다.

### 면접 짧은 답변

`UNION`과 `UNION ALL`은 여러 SELECT 결과를 세로 방향으로 합치는 집합 연산자입니다. `UNION`은 중복 Row를 제거하고, `UNION ALL`은 중복을 그대로 유지합니다. 각 SELECT의 Column 수가 같고 대응되는 Column의 자료형이 호환되어야 합니다.

## 객관식 문제

### 문제 1 · UNION

#### A

| NAME |
| --- |
| 가 |
| 나 |

#### B

| NAME |
| --- |
| 나 |
| 다 |

다음 Query의 결과 Row 수는?

```sql
SELECT NAME
FROM A

UNION

SELECT NAME
FROM B;
```

① 2개  
② 3개  
③ 4개  
④ 5개

<details markdown="1">
<summary>정답</summary>

②

중복된 `나`가 한 번만 남습니다.

| NAME |
| --- |
| 가 |
| 나 |
| 다 |

</details>

### 문제 2 · UNION ALL

같은 입력 Table에 다음 Query를 실행하면 결과 Row 수는?

```sql
SELECT NAME
FROM A

UNION ALL

SELECT NAME
FROM B;
```

① 2개  
② 3개  
③ 4개  
④ 5개

<details markdown="1">
<summary>정답</summary>

③

`UNION ALL`은 중복을 제거하지 않습니다.

| NAME |
| --- |
| 가 |
| 나 |
| 나 |
| 다 |

</details>

### 문제 3 · Column 수

다음 중 집합 연산이 가능한 형태는?

① 첫 번째 SELECT 2개 Column, 두 번째 SELECT 1개 Column  
② 첫 번째 SELECT 3개 Column, 두 번째 SELECT 2개 Column  
③ 두 SELECT 모두 2개 Column  
④ Column 수는 상관없음

<details markdown="1">
<summary>정답</summary>

③

각 SELECT가 반환하는 Column 수가 같아야 합니다.

</details>

### 문제 4 · 결과 Column 이름

다음 Query의 첫 번째 결과 Column 이름은?

```sql
SELECT CUSTOMER_ID AS ID
FROM CUSTOMER

UNION ALL

SELECT EMP_ID AS EMPLOYEE_ID
FROM EMPLOYEE;
```

① `ID`  
② `EMPLOYEE_ID`  
③ 두 이름이 합쳐진다.  
④ Column 이름이 없다.

<details markdown="1">
<summary>정답</summary>

①

결과 Column 이름은 일반적으로 첫 번째 SELECT의 Column 이름 또는 별칭을 따릅니다.

</details>

### 문제 5 · UNION과 JOIN

UNION과 JOIN의 차이로 옳은 것은?

① UNION은 가로 결합, JOIN은 세로 결합  
② UNION은 세로 결합, JOIN은 가로 연결  
③ 둘은 항상 같은 결과를 만든다.  
④ UNION은 반드시 ON 조건이 필요하다.

<details markdown="1">
<summary>정답</summary>

②

UNION은 SELECT 결과를 세로로 합치고, JOIN은 관련 Row의 Column을 가로로 연결합니다.

</details>

## UNION · UNION ALL 전체 요약

### 입력 Table 1 · A

| NAME |
| --- |
| 가 |
| 나 |

### 입력 Table 2 · B

| NAME |
| --- |
| 나 |
| 다 |

```sql
SELECT NAME
FROM A

UNION

SELECT NAME
FROM B;
```

### UNION 결과

| NAME |
| --- |
| 가 |
| 나 |
| 다 |

```sql
SELECT NAME
FROM A

UNION ALL

SELECT NAME
FROM B;
```

### UNION ALL 결과

| NAME |
| --- |
| 가 |
| 나 |
| 나 |
| 다 |

```text
UNION
→ 세로 결합
→ 중복 제거

UNION ALL
→ 세로 결합
→ 중복 유지
```

<blockquote class="prompt-danger">
<p>집합 연산 문제에서는 먼저 SELECT Column 수와 위치별 자료형을 확인한 뒤, 중복 제거 여부를 판단합니다.</p>
</blockquote>

## 다음에 이을 글

**INTERSECT · EXCEPT**입니다.

두 SELECT 결과의 공통 Row와 차집합 Row를 구하는 집합 연산을 살펴봅니다.
