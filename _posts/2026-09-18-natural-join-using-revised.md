---
title: Natural Join · USING
date: 2026-09-18 22:05:00 +0900
slug: natural-join-using
permalink: /posts/natural-join-using/
categories: [CS, 데이터베이스]
tags: [NATURALJOIN, USING, JOIN, SQL, 관계형데이터베이스, 정보처리기사, NCS]
math: true
---

Natural Join과 USING은 <mark>같은 이름의 Column을 이용해 JOIN 조건을 간단하게 표현하는 방법</mark>입니다.

Natural Join은 공통 이름의 Column을 자동으로 사용하고, USING은 사용할 공통 Column을 직접 지정합니다.

<blockquote class="prompt-info">
<p>한 줄: Natural Join은 공통 Column 자동 선택, USING은 공통 Column 직접 지정입니다.</p>
</blockquote>

<details markdown="1">
<summary>한 줄로</summary>

같은 이름의 Column을 이용하되, Natural Join은 자동이고 USING은 직접 지정합니다.

</details>

## 대표 예시

직원과 부서 Table에 같은 이름의 `DEPT_ID`가 있다고 가정합니다.

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

### Natural Join

```sql
SELECT
    EMP_NAME,
    DEPT_ID,
    DEPT_NAME
FROM EMPLOYEE
NATURAL JOIN DEPARTMENT;
```

### 결과 Table

| EMP_NAME | DEPT_ID | DEPT_NAME |
| --- | --- | --- |
| 직원1 | 10 | 개발 |
| 직원2 | 20 | 인사 |

두 Table에 공통으로 존재하는 `DEPT_ID`를 자동으로 연결 기준으로 사용합니다.

## USING

USING은 어떤 공통 Column을 JOIN에 사용할지 직접 지정합니다.

### 입력 Table 1 · EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | 20 |

### 입력 Table 2 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |

```sql
SELECT
    EMP_NAME,
    DEPT_ID,
    DEPT_NAME
FROM EMPLOYEE
JOIN DEPARTMENT
USING (DEPT_ID);
```

### 결과 Table

| EMP_NAME | DEPT_ID | DEPT_NAME |
| --- | --- | --- |
| 직원1 | 10 | 개발 |
| 직원2 | 20 | 인사 |

다음 ON 조건을 간단하게 적은 것과 같은 의미로 볼 수 있습니다.

```sql
ON EMPLOYEE.DEPT_ID = DEPARTMENT.DEPT_ID
```

## Natural Join과 USING 차이

| 구분 | Natural Join | USING |
| --- | --- | --- |
| 연결 Column 선택 | 자동 | 직접 지정 |
| 공통 Column이 여러 개일 때 | 여러 Column이 자동으로 조건에 포함될 수 있음 | 원하는 Column만 지정 |
| 조건의 명확성 | 상대적으로 낮음 | 높음 |

Natural Join은 편하지만, 같은 이름의 Column이 여러 개 있으면 의도하지 않은 Column까지 JOIN 조건에 포함될 수 있습니다.

## 공통 Column이 여러 개일 때

### 입력 Table 1 · A

| ID | REGION | NAME |
| --- | --- | --- |
| 1 | 서울 | 가 |
| 2 | 부산 | 나 |

### 입력 Table 2 · B

| ID | REGION | VALUE |
| --- | --- | --- |
| 1 | 서울 | 하나 |
| 2 | 서울 | 둘 |

두 Table에는 `ID`, `REGION`이라는 같은 이름의 Column이 있습니다.

```sql
SELECT *
FROM A
NATURAL JOIN B;
```

### 결과 Table

| ID | REGION | NAME | VALUE |
| --- | --- | --- | --- |
| 1 | 서울 | 가 | 하나 |

`ID = 2`는 같지만 REGION이 다르기 때문에 연결되지 않습니다.

```text
ID
→ 같음

REGION
→ 다름

→ 연결 실패
```

<blockquote class="prompt-warning">
<p>Natural Join은 같은 이름의 Column이 여러 개라면 모두 연결 조건에 영향을 줄 수 있습니다.</p>
</blockquote>

## USING으로 필요한 Column만 지정

앞의 예시에서 `ID`만 기준으로 연결하고 싶다면 USING을 사용할 수 있습니다.

### 입력 Table 1 · A

| ID | REGION | NAME |
| --- | --- | --- |
| 1 | 서울 | 가 |
| 2 | 부산 | 나 |

### 입력 Table 2 · B

| ID | REGION | VALUE |
| --- | --- | --- |
| 1 | 서울 | 하나 |
| 2 | 서울 | 둘 |

```sql
SELECT
    ID,
    A.REGION AS A_REGION,
    B.REGION AS B_REGION,
    NAME,
    VALUE
FROM A
JOIN B
USING (ID);
```

### 결과 Table

| ID | A_REGION | B_REGION | NAME | VALUE |
| --- | --- | --- | --- | --- |
| 1 | 서울 | 서울 | 가 | 하나 |
| 2 | 부산 | 서울 | 나 | 둘 |

USING은 `ID`만 연결 조건으로 사용했기 때문에 두 Row가 모두 연결됩니다.

## ON과 USING 비교

### ON

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

### USING

```sql
SELECT
    EMP_NAME,
    DEPT_NAME
FROM EMPLOYEE
JOIN DEPARTMENT
USING (DEPT_ID);
```

두 Table의 Column 이름이 같을 때 USING으로 간단하게 작성할 수 있습니다.

```text
ON
→ 양쪽 Column을 직접 적음

USING
→ 공통 Column 이름만 적음
```

## 잘 놓치는 핵심

### 1. Natural Join은 Key를 자동으로 찾는 것이 아니다

Primary Key나 Foreign Key 여부보다 <mark>Column 이름이 같은지</mark>를 기준으로 합니다.

### 2. USING은 같은 이름의 Column에 사용한다

양쪽 Column 이름이 서로 다르면 일반적으로 ON을 사용합니다.

```text
EMPLOYEE.DEPT_ID
DEPARTMENT.ID
```

이 경우에는 다음과 같이 작성합니다.

```sql
ON EMPLOYEE.DEPT_ID = DEPARTMENT.ID
```

### 3. Natural Join은 구조 변경에 영향을 받을 수 있다

나중에 같은 이름의 Column이 추가되면 JOIN 조건도 달라질 수 있습니다.

### 4. USING은 연결 기준을 눈으로 확인하기 쉽다

어떤 Column을 사용하는지 직접 적으므로 Natural Join보다 의도가 명확합니다.

## 시험·면접

### 핵심 암기

```text
NATURAL JOIN
→ 같은 이름의 Column 자동 사용
```

```text
USING
→ 같은 이름의 Column 직접 지정
```

```text
USING (DEPT_ID)
≈
ON 왼쪽.DEPT_ID = 오른쪽.DEPT_ID
```

### 시험 함정

Natural Join은 Foreign Key를 자동으로 찾아 연결하는 것이 아닙니다.

같은 이름의 Column이 여러 개라면 예상보다 더 많은 Column이 JOIN 조건에 포함될 수 있습니다.

### 면접 짧은 답변

Natural Join은 두 Table에서 이름이 같은 Column을 자동으로 JOIN 조건으로 사용하는 방식입니다. USING은 같은 이름의 공통 Column 중 어떤 Column을 사용할지 직접 지정하는 문법이며, 조건을 명확하게 표현할 수 있다는 차이가 있습니다.

## 객관식 문제

### 문제 1 · Natural Join

#### A

| ID | NAME |
| --- | --- |
| 1 | 가 |
| 2 | 나 |

#### B

| ID | VALUE |
| --- | --- |
| 1 | 하나 |
| 2 | 둘 |

다음 Query의 결과 Row 수는?

```sql
SELECT *
FROM A
NATURAL JOIN B;
```

① 0개  
② 1개  
③ 2개  
④ 4개

<details markdown="1">
<summary>정답</summary>

③

공통 Column인 ID를 기준으로 두 Row가 연결됩니다.

| ID | NAME | VALUE |
| --- | --- | --- |
| 1 | 가 | 하나 |
| 2 | 나 | 둘 |

</details>

### 문제 2 · USING

다음 조건을 간단하게 표현한 것은?

```sql
ON A.ID = B.ID
```

단, 양쪽 Column 이름이 모두 `ID`이다.

① `USING (ID)`  
② `USING (A.ID = B.ID)`  
③ `NATURAL (ID)`  
④ `CROSS (ID)`

<details markdown="1">
<summary>정답</summary>

①

```sql
JOIN B
USING (ID)
```

처럼 작성할 수 있습니다.

</details>

### 문제 3 · 공통 Column 여러 개

#### A

| ID | REGION |
| --- | --- |
| 1 | 서울 |

#### B

| ID | REGION |
| --- | --- |
| 1 | 부산 |

다음 Query의 결과는?

```sql
SELECT *
FROM A
NATURAL JOIN B;
```

① 한 Row가 나온다.  
② 두 Row가 나온다.  
③ 결과가 없다.  
④ CROSS JOIN이 된다.

<details markdown="1">
<summary>정답</summary>

③

`ID`는 같지만 `REGION`이 다르기 때문에 연결되지 않습니다.

</details>

### 문제 4 · Natural Join 설명

Natural Join에 대한 설명으로 옳은 것은?

① Foreign Key만 자동으로 찾는다.  
② 같은 이름의 Column을 자동으로 연결 기준에 사용할 수 있다.  
③ 항상 CROSS JOIN과 같다.  
④ 같은 Table에서만 사용할 수 있다.

<details markdown="1">
<summary>정답</summary>

②

Natural Join은 양쪽 Table에서 이름이 같은 Column을 기준으로 연결합니다.

</details>

### 문제 5 · USING의 장점

USING의 특징으로 가장 적절한 것은?

① 연결 Column을 직접 지정할 수 있다.  
② 모든 공통 Column을 반드시 자동으로 사용한다.  
③ Column 이름이 달라도 항상 사용할 수 있다.  
④ JOIN 조건을 만들 수 없다.

<details markdown="1">
<summary>정답</summary>

①

USING은 어떤 공통 Column을 JOIN 기준으로 사용할지 직접 지정합니다.

</details>

## Natural Join · USING 전체 요약

### 입력 Table 1 · EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | 20 |

### 입력 Table 2 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |

```sql
SELECT
    EMP_NAME,
    DEPT_ID,
    DEPT_NAME
FROM EMPLOYEE
JOIN DEPARTMENT
USING (DEPT_ID);
```

### 결과 Table

| EMP_NAME | DEPT_ID | DEPT_NAME |
| --- | --- | --- |
| 직원1 | 10 | 개발 |
| 직원2 | 20 | 인사 |

```text
Natural Join
→ 공통 Column 자동 선택

USING
→ 공통 Column 직접 지정
```

<blockquote class="prompt-danger">
<p>Natural Join 문제에서는 먼저 두 Table에 같은 이름의 Column이 몇 개인지 확인합니다.</p>
</blockquote>

## 다음에 이을 글

**Subquery**입니다.

Query 안에서 다른 Query의 결과를 사용하는 기본 구조를 살펴봅니다.
