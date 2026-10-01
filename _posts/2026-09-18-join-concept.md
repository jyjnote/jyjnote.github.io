---
title: JOIN · 조인의 개념
date: 2026-09-18 21:30:00 +0900
slug: join-concept
permalink: /posts/sql-join-concept/
categories: [CS, 데이터베이스]
tags: [JOIN, 조인, INNERJOIN, OUTERJOIN, LEFTJOIN, RIGHTJOIN, FULLJOIN, SELFJOIN, CROSSJOIN, SQL, 정보처리기사, NCS]
math: true
---

JOIN은 <mark>서로 관련된 여러 Table의 Row를 하나의 결과로 연결해서 조회하는 방법</mark>입니다.

관계형 데이터베이스에서는 데이터를 여러 Table로 나누어 저장하기 때문에, 필요한 정보를 한 번에 보기 위해 JOIN을 사용합니다.

<blockquote class="prompt-info">
<p>한 줄: JOIN은 서로 다른 Table에서 관계가 있는 Row를 찾아 하나의 결과 Table로 연결하는 방법입니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

입력 Table 여러 개를 연결 조건으로 묶어서 새로운 결과 Table을 만든다고 생각하면 됩니다.

</details>

## 연습 데이터베이스

실제 연습 데이터베이스는 아래에서 확인할 수 있습니다.

<div style="width:100%; overflow:hidden; border:1px solid var(--main-border-color,#ddd); border-radius:12px; margin:1rem 0;">
<iframe
  src="https://docs.google.com/spreadsheets/d/1mtu6pFcGyOfwpFizaJskfFD87GxyjAmB/preview"
  width="100%"
  height="500"
  style="border:0;"
  loading="lazy">
</iframe>
</div>

실제 데이터베이스에는 다음 관계가 있습니다.

```text
EMPLOYEE.DEPT_ID
→ DEPARTMENT.DEPT_ID

ORDERS.CUSTOMER_ID
→ CUSTOMER.CUSTOMER_ID

ORDER_ITEM.ORDER_ID
→ ORDERS.ORDER_ID

ORDER_ITEM.PRODUCT_ID
→ PRODUCT.PRODUCT_ID
```

JOIN 동작을 쉽게 보기 위해 본문에서는 작은 예시 Table로 축약해서 설명합니다.

<blockquote class="prompt-info">
<p>이 글에서는 JOIN 설명과 문제마다 입력 Table과 결과 Table을 함께 제시합니다.</p>
</blockquote>

## 가장 먼저 볼 예시

### 입력 Table 1 · EMPLOYEE

| EMP_ID | EMP_NAME | DEPT_ID |
| --- | --- | --- |
| 1001 | 직원1 | 10 |
| 1002 | 직원2 | 20 |
| 1003 | 직원3 | 30 |

### 입력 Table 2 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |
| 30 | 영업 |

직원 이름과 부서 이름을 한 번에 보고 싶다고 가정합니다.

두 Table의 공통 연결점은 `DEPT_ID`입니다.

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

핵심 구문은 <mark style="background-color:#DFF5E8;">JOIN DEPARTMENT D ON E.DEPT_ID = D.DEPT_ID</mark>입니다.

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | 인사 |
| 직원3 | 영업 |

`DEPT_ID`가 같은 Row끼리 연결되었습니다.

```text
직원1의 DEPT_ID = 10
개발 부서의 DEPT_ID = 10

→ 연결
```

## 왜 JOIN이 필요한가

관계형 데이터베이스는 하나의 거대한 Table에 모든 정보를 반복해서 저장하지 않습니다.

직원 정보와 부서 정보를 따로 저장한 뒤 필요할 때 JOIN으로 다시 연결할 수 있습니다.

### 입력 Table 1 · EMPLOYEE

| EMP_ID | EMP_NAME | DEPT_ID |
| --- | --- | --- |
| 1001 | 직원1 | 10 |
| 1002 | 직원2 | 10 |
| 1003 | 직원3 | 20 |

### 입력 Table 2 · DEPARTMENT

| DEPT_ID | DEPT_NAME | REGION |
| --- | --- | --- |
| 10 | 개발 | 서울 |
| 20 | 인사 | 부산 |

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME,
    D.REGION
FROM EMPLOYEE E
JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

### 결과 Table

| EMP_NAME | DEPT_NAME | REGION |
| --- | --- | --- |
| 직원1 | 개발 | 서울 |
| 직원2 | 개발 | 서울 |
| 직원3 | 인사 | 부산 |

<blockquote class="prompt-info">
<p>저장은 여러 Table로 나누고, 필요한 조회 시점에 JOIN으로 관계를 다시 연결합니다.</p>
</blockquote>

## JOIN의 기본 구조

JOIN은 보통 다음 구조로 작성합니다.

```sql
SELECT 조회할_Column
FROM 기준_Table
JOIN 연결할_Table
    ON 연결_조건;
```

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
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

각 요소의 역할은 다음과 같습니다.

| 구문 | 역할 | 현재 예시 |
| --- | --- | --- |
| SELECT | 결과에 보여 줄 Column | 직원 이름, 부서 이름 |
| FROM | 기준 Table | EMPLOYEE |
| JOIN | 연결할 Table | DEPARTMENT |
| ON | Row 연결 조건 | DEPT_ID가 같은 경우 |

강조해서 기억할 부분은 <mark style="background-color:#DFF5E8;">ON E.DEPT_ID = D.DEPT_ID</mark>입니다.

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | 인사 |

## JOIN 조건

`ON` 뒤에는 어떤 Row와 어떤 Row를 연결할지 적습니다.

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

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

```text
직원1의 10 = 개발의 10
→ 연결

직원2의 20 = 인사의 20
→ 연결
```

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | 인사 |

반대로 다음처럼 연결 기준을 잘못 잡으면 원하는 결과가 나오지 않습니다.

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
JOIN DEPARTMENT D
    ON E.EMP_ID = D.DEPT_ID;
```

### 잘못된 조건의 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 결과 없음 | 결과 없음 |

현재 값에서는 `1001 = 10`, `1002 = 20`이 모두 거짓이기 때문입니다.

<blockquote class="prompt-warning">
<p>JOIN 문제에서는 SQL을 쓰기 전에 두 Table을 실제로 연결하는 Column이 무엇인지 먼저 찾습니다.</p>
</blockquote>

## Table 별칭

JOIN에서는 Table 이름을 짧은 별칭으로 바꾸어 자주 사용합니다.

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

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

```text
EMPLOYEE → E
DEPARTMENT → D
```

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | 인사 |

`E.DEPT_ID`는 `EMPLOYEE.DEPT_ID`를 의미하고 `D.DEPT_ID`는 `DEPARTMENT.DEPT_ID`를 의미합니다.

## 같은 이름의 Column 구분

두 Table에 같은 이름의 Column이 존재할 수 있습니다.

### 입력 Table 1 · EMPLOYEE

| EMP_ID | EMP_NAME | DEPT_ID |
| --- | --- | --- |
| 1001 | 직원1 | 10 |

### 입력 Table 2 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |

두 Table 모두 `DEPT_ID`를 가지고 있으므로 별칭을 붙이면 명확합니다.

```sql
SELECT
    E.DEPT_ID,
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

핵심은 <mark style="background-color:#DFF5E8;">E.DEPT_ID</mark>처럼 Table까지 구분해 주는 것입니다.

### 결과 Table

| DEPT_ID | EMP_NAME | DEPT_NAME |
| --- | --- | --- |
| 10 | 직원1 | 개발 |

## JOIN과 Foreign Key

Foreign Key와 JOIN은 자주 함께 사용되지만 같은 개념은 아닙니다.

### 입력 Table 1 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |

### 입력 Table 2 · EMPLOYEE

| EMP_ID | EMP_NAME | DEPT_ID |
| --- | --- | --- |
| 1001 | 직원1 | 10 |
| 1002 | 직원2 | 20 |

관계는 다음과 같습니다.

```text
EMPLOYEE.DEPT_ID
→ DEPARTMENT.DEPT_ID
```

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
| 직원2 | 인사 |

| 구분 | Foreign Key | JOIN |
| --- | --- | --- |
| 역할 | 참조 관계와 무결성 정의 | 조회 시 Row 연결 |
| 위치 | Table 구조 | Query |
| 결과 Table 생성 | 아님 | 맞음 |

<blockquote class="prompt-warning">
<p>Foreign Key가 정의되어 있지 않아도 값의 관계를 알고 있다면 JOIN Query 자체는 작성할 수 있습니다.</p>
</blockquote>

## JOIN 종류를 위한 공통 예시

다음 두 Table을 기준으로 각 JOIN 결과를 비교합니다.

### EMPLOYEE

| EMP_ID | EMP_NAME | DEPT_ID |
| --- | --- | --- |
| 1001 | 직원1 | 10 |
| 1002 | 직원2 | 20 |
| 1003 | 직원3 | NULL |

### DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |
| 30 | 영업 |

여기서 직원3은 연결되는 부서가 없습니다.

영업 부서는 연결되는 직원이 없습니다.

이 두 Row가 각 JOIN에서 어떻게 처리되는지 보면 차이가 쉽게 보입니다.

## INNER JOIN

`INNER JOIN`은 양쪽 Table에서 연결 조건을 만족하는 Row만 남깁니다.

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
| 30 | 영업 |

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
INNER JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

핵심 구문은 <mark style="background-color:#DFF5E8;">INNER JOIN DEPARTMENT D</mark>입니다.

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | 인사 |

직원3은 연결되는 부서가 없어 제외됩니다.

영업 부서는 연결되는 직원이 없어 제외됩니다.

```text
INNER JOIN
→ 양쪽 모두 연결 성공
→ 결과에 포함
```

### INNER 생략 예시

다음 두 Query는 같은 의미로 사용됩니다.

```sql
SELECT *
FROM EMPLOYEE E
INNER JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

```sql
SELECT *
FROM EMPLOYEE E
JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

### 결과 Table

| EMP_ID | EMP_NAME | E.DEPT_ID | D.DEPT_ID | DEPT_NAME |
| --- | --- | --- | --- | --- |
| 1001 | 직원1 | 10 | 10 | 개발 |
| 1002 | 직원2 | 20 | 20 | 인사 |

<blockquote class="prompt-info">
<p>JOIN만 적혀 있으면 일반적으로 INNER JOIN으로 이해합니다.</p>
</blockquote>

## LEFT JOIN

`LEFT JOIN`은 왼쪽 Table의 Row를 모두 유지합니다.

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
| 30 | 영업 |

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
LEFT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

핵심 구문은 <mark style="background-color:#DFF5E8;">LEFT JOIN DEPARTMENT D</mark>입니다.

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | 인사 |
| 직원3 | NULL |

직원3은 왼쪽 Table에 있으므로 결과에 남습니다.

연결되는 오른쪽 Row가 없기 때문에 `DEPT_NAME`이 `NULL`입니다.

영업 부서는 오른쪽에만 있으므로 나오지 않습니다.

```text
LEFT JOIN
→ 왼쪽은 전부 유지
→ 오른쪽에 없으면 NULL
```

## RIGHT JOIN

`RIGHT JOIN`은 오른쪽 Table의 Row를 모두 유지합니다.

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
| 30 | 영업 |

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
RIGHT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

핵심 구문은 <mark style="background-color:#DFF5E8;">RIGHT JOIN DEPARTMENT D</mark>입니다.

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | 인사 |
| NULL | 영업 |

영업 부서는 오른쪽 Table에 있으므로 결과에 남습니다.

연결되는 직원이 없기 때문에 `EMP_NAME`이 `NULL`입니다.

직원3은 왼쪽에만 있으므로 나오지 않습니다.

```text
RIGHT JOIN
→ 오른쪽은 전부 유지
→ 왼쪽에 없으면 NULL
```

## LEFT JOIN과 RIGHT JOIN 방향 바꾸기

RIGHT JOIN은 Table 순서를 바꾸어 LEFT JOIN으로 표현할 수도 있습니다.

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
| 30 | 영업 |

다음 RIGHT JOIN을 봅니다.

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
RIGHT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

Table 순서를 바꾸어 다음처럼 쓸 수 있습니다.

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM DEPARTMENT D
LEFT JOIN EMPLOYEE E
    ON E.DEPT_ID = D.DEPT_ID;
```

### 두 Query의 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | 인사 |
| NULL | 영업 |

어느 Table을 반드시 남길지에 따라 방향을 결정합니다.

## FULL OUTER JOIN

`FULL OUTER JOIN`은 왼쪽과 오른쪽 Table의 Row를 모두 유지합니다.

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
| 30 | 영업 |

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
FULL OUTER JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

핵심 구문은 <mark style="background-color:#DFF5E8;">FULL OUTER JOIN</mark>입니다.

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | 인사 |
| 직원3 | NULL |
| NULL | 영업 |

직원3은 왼쪽에만 있어도 남습니다.

영업은 오른쪽에만 있어도 남습니다.

```text
FULL OUTER JOIN
→ 왼쪽 전체
+
오른쪽 전체
```

DBMS에 따라 지원 여부나 세부 문법 차이가 있을 수 있으므로 실제 사용 환경을 확인합니다.

## INNER · LEFT · RIGHT · FULL 비교

### 공통 입력 Table 1

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | 20 |
| 직원3 | NULL |

### 공통 입력 Table 2

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |
| 30 | 영업 |

### INNER JOIN 결과

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | 인사 |

### LEFT JOIN 결과

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | 인사 |
| 직원3 | NULL |

### RIGHT JOIN 결과

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | 인사 |
| NULL | 영업 |

### FULL OUTER JOIN 결과

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | 인사 |
| 직원3 | NULL |
| NULL | 영업 |

시험에서는 같은 입력값으로 네 결과를 직접 그려 보는 것이 가장 빠릅니다.

## SELF JOIN

`SELF JOIN`은 하나의 Table을 자기 자신과 연결하는 방식입니다.

### 입력 Table · EMPLOYEE

| EMP_ID | EMP_NAME | MANAGER_ID |
| --- | --- | --- |
| 1001 | 김팀장 | NULL |
| 1002 | 직원1 | 1001 |
| 1003 | 직원2 | 1001 |

직원1의 `MANAGER_ID = 1001`입니다.

같은 Table에서 `EMP_ID = 1001`인 Row는 김팀장입니다.

```sql
SELECT
    E.EMP_NAME AS 직원,
    M.EMP_NAME AS 관리자
FROM EMPLOYEE E
LEFT JOIN EMPLOYEE M
    ON E.MANAGER_ID = M.EMP_ID;
```

핵심 구문은 <mark style="background-color:#DFF5E8;">EMPLOYEE E LEFT JOIN EMPLOYEE M</mark>입니다.

```text
E
→ 직원 역할

M
→ 관리자 역할
```

### 결과 Table

| 직원 | 관리자 |
| --- | --- |
| 김팀장 | NULL |
| 직원1 | 김팀장 |
| 직원2 | 김팀장 |

김팀장은 `MANAGER_ID`가 `NULL`이므로 연결되는 관리자 Row가 없습니다.

<blockquote class="prompt-info">
<p>SELF JOIN이라는 별도 명령어가 있는 것이 아니라 같은 Table을 서로 다른 별칭으로 두 번 사용하는 방식입니다.</p>
</blockquote>

## CROSS JOIN

`CROSS JOIN`은 두 Table의 가능한 모든 Row 조합을 만듭니다.

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
SELECT
    C.COLOR,
    S.SIZE
FROM COLOR C
CROSS JOIN SIZE S;
```

핵심 구문은 <mark style="background-color:#DFF5E8;">CROSS JOIN SIZE S</mark>입니다.

첫 번째 Table은 2개 Row이고 두 번째 Table은 3개 Row입니다.

$$2\times3=6$$

### 결과 Table

| COLOR | SIZE |
| --- | --- |
| 검정 | S |
| 검정 | M |
| 검정 | L |
| 흰색 | S |
| 흰색 | M |
| 흰색 | L |

모든 가능한 조합이 생성됩니다.

<blockquote class="prompt-warning">
<p>CROSS JOIN은 Row 수가 곱셈으로 증가하므로 큰 Table끼리 사용할 때 특히 주의합니다.</p>
</blockquote>

## JOIN 조건을 빠뜨리면 왜 위험한가

조건이 없거나 잘못되면 의도하지 않은 조합이 대량으로 생길 수 있습니다.

### 입력 Table 1 · EMPLOYEE

| EMP_NAME |
| --- |
| 직원1 |
| 직원2 |

### 입력 Table 2 · DEPARTMENT

| DEPT_NAME |
| --- |
| 개발 |
| 인사 |
| 영업 |

모든 조합이 생기면 다음 결과가 됩니다.

$$2\times3=6$$

### 잘못 만들어진 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원1 | 인사 |
| 직원1 | 영업 |
| 직원2 | 개발 |
| 직원2 | 인사 |
| 직원2 | 영업 |

실제로 원하는 결과가 직원1·개발, 직원2·인사라면 다음처럼 두 Row만 나와야 합니다.

### 원래 원했던 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | 인사 |

따라서 JOIN에서는 연결 조건을 반드시 확인합니다.

## 여러 Table JOIN

JOIN은 세 개 이상의 Table도 순서대로 연결할 수 있습니다.

### 입력 Table 1 · ORDERS

| ORDER_ID | CUSTOMER_ID |
| --- | --- |
| 1 | 101 |
| 2 | 102 |

### 입력 Table 2 · ORDER_ITEM

| ORDER_ID | PRODUCT_ID | QTY |
| --- | --- | --- |
| 1 | 501 | 2 |
| 1 | 502 | 1 |
| 2 | 501 | 3 |

### 입력 Table 3 · PRODUCT

| PRODUCT_ID | PRODUCT_NAME |
| --- | --- |
| 501 | 키보드 |
| 502 | 마우스 |

```sql
SELECT
    O.ORDER_ID,
    P.PRODUCT_NAME,
    OI.QTY
FROM ORDERS O
JOIN ORDER_ITEM OI
    ON O.ORDER_ID = OI.ORDER_ID
JOIN PRODUCT P
    ON OI.PRODUCT_ID = P.PRODUCT_ID;
```

첫 번째 연결은 <mark style="background-color:#DFF5E8;">O.ORDER_ID = OI.ORDER_ID</mark>입니다.

두 번째 연결은 <mark style="background-color:#DFF5E8;">OI.PRODUCT_ID = P.PRODUCT_ID</mark>입니다.

### 결과 Table

| ORDER_ID | PRODUCT_NAME | QTY |
| --- | --- | --- |
| 1 | 키보드 | 2 |
| 1 | 마우스 | 1 |
| 2 | 키보드 | 3 |

관계를 한 단계씩 따라가면 됩니다.

```text
ORDERS
↓ ORDER_ID
ORDER_ITEM
↓ PRODUCT_ID
PRODUCT
```

## 고객과 주문 JOIN

### 입력 Table 1 · CUSTOMER

| CUSTOMER_ID | NAME |
| --- | --- |
| 101 | 고객1 |
| 102 | 고객2 |

### 입력 Table 2 · ORDERS

| ORDER_ID | CUSTOMER_ID | STATUS |
| --- | --- | --- |
| 1 | 101 | 완료 |
| 2 | 101 | 배송중 |
| 3 | 102 | 완료 |

```sql
SELECT
    C.NAME,
    O.ORDER_ID,
    O.STATUS
FROM CUSTOMER C
JOIN ORDERS O
    ON C.CUSTOMER_ID = O.CUSTOMER_ID;
```

### 결과 Table

| NAME | ORDER_ID | STATUS |
| --- | --- | --- |
| 고객1 | 1 | 완료 |
| 고객1 | 2 | 배송중 |
| 고객2 | 3 | 완료 |

고객1은 주문을 두 번 했기 때문에 결과에도 두 Row가 나타납니다.

## 일대다 관계와 Row 증가

하나의 부서에는 여러 직원이 있을 수 있습니다.

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
| 직원3 | 20 |

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
| 인사 | 직원3 |

`개발`이 두 번 보이지만 잘못된 중복이 아닙니다.

```text
개발
├─ 직원1
└─ 직원2
```

<blockquote class="prompt-info">
<p>JOIN 후 Row가 늘어났다고 바로 중복 오류로 판단하지 말고 일대다 관계인지 먼저 확인합니다.</p>
</blockquote>

## JOIN 후 WHERE 사용

JOIN으로 Table을 연결한 뒤 `WHERE`로 원하는 Row만 다시 고를 수 있습니다.

### 입력 Table 1 · EMPLOYEE

| EMP_NAME | DEPT_ID | SALARY |
| --- | --- | ---: |
| 직원1 | 10 | 3500 |
| 직원2 | 10 | 2800 |
| 직원3 | 20 | 3200 |

### 입력 Table 2 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME,
    E.SALARY
FROM EMPLOYEE E
JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID
WHERE E.SALARY >= 3000;
```

JOIN 기준은 <mark style="background-color:#DFF5E8;">ON E.DEPT_ID = D.DEPT_ID</mark>입니다.

필터 기준은 <mark style="background-color:#DFF5E8;">WHERE E.SALARY &gt;= 3000</mark>입니다.

### 결과 Table

| EMP_NAME | DEPT_NAME | SALARY |
| --- | --- | ---: |
| 직원1 | 개발 | 3500 |
| 직원3 | 인사 | 3200 |

```text
ON
→ 어떤 Row끼리 연결할지

WHERE
→ 연결한 결과 중 무엇을 남길지
```

## LEFT JOIN에서 ON과 WHERE의 차이

이 부분은 JOIN에서 자주 틀리는 핵심입니다.

### 입력 Table 1 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |
| 30 | 영업 |

### 입력 Table 2 · EMPLOYEE

| EMP_NAME | DEPT_ID | SALARY |
| --- | --- | ---: |
| 직원1 | 10 | 3500 |
| 직원2 | 10 | 2500 |
| 직원3 | 20 | 3200 |

### 경우 1 · 조건을 ON에 넣기

```sql
SELECT
    D.DEPT_NAME,
    E.EMP_NAME,
    E.SALARY
FROM DEPARTMENT D
LEFT JOIN EMPLOYEE E
    ON D.DEPT_ID = E.DEPT_ID
   AND E.SALARY >= 3000;
```

핵심은 <mark style="background-color:#DFF5E8;">ON D.DEPT_ID = E.DEPT_ID AND E.SALARY &gt;= 3000</mark>입니다.

### 결과 Table

| DEPT_NAME | EMP_NAME | SALARY |
| --- | --- | ---: |
| 개발 | 직원1 | 3500 |
| 인사 | 직원3 | 3200 |
| 영업 | NULL | NULL |

왼쪽 `DEPARTMENT`의 Row는 모두 유지됩니다.

### 경우 2 · 조건을 WHERE에 넣기

```sql
SELECT
    D.DEPT_NAME,
    E.EMP_NAME,
    E.SALARY
FROM DEPARTMENT D
LEFT JOIN EMPLOYEE E
    ON D.DEPT_ID = E.DEPT_ID
WHERE E.SALARY >= 3000;
```

핵심은 <mark style="background-color:#DFF5E8;">WHERE E.SALARY &gt;= 3000</mark>입니다.

### 결과 Table

| DEPT_NAME | EMP_NAME | SALARY |
| --- | --- | ---: |
| 개발 | 직원1 | 3500 |
| 인사 | 직원3 | 3200 |

영업은 JOIN 직후에는 남아 있지만 `E.SALARY = NULL`이므로 WHERE 조건을 만족하지 못해 제거됩니다.

<blockquote class="prompt-warning">
<p>LEFT JOIN에서 오른쪽 Table의 조건을 WHERE에 넣으면 NULL Row가 제거되어 결과가 INNER JOIN처럼 보일 수 있습니다.</p>
</blockquote>

## OUTER JOIN에서 NULL의 의미

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
| 인사 | 직원2 |
| 영업 | NULL |

여기서 `NULL`은 영업 부서가 없다는 뜻이 아닙니다.

영업 부서는 존재하지만 연결되는 직원이 없다는 뜻입니다.

## JOIN과 DISTINCT

JOIN 결과에 같은 값이 여러 번 보여도 정상적인 관계 결과일 수 있습니다.

### 입력 Table 1 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |

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
JOIN EMPLOYEE E
    ON D.DEPT_ID = E.DEPT_ID;
```

### 결과 Table

| DEPT_NAME | EMP_NAME |
| --- | --- |
| 개발 | 직원1 |
| 개발 | 직원2 |

부서 이름은 반복되지만 직원이 서로 다릅니다.

부서 이름만 조회하면 다음과 같습니다.

```sql
SELECT
    D.DEPT_NAME
FROM DEPARTMENT D
JOIN EMPLOYEE E
    ON D.DEPT_ID = E.DEPT_ID;
```

### 결과 Table

| DEPT_NAME |
| --- |
| 개발 |
| 개발 |

목적상 부서 이름을 한 번만 원한다면 `DISTINCT`를 사용할 수 있습니다.

```sql
SELECT DISTINCT
    D.DEPT_NAME
FROM DEPARTMENT D
JOIN EMPLOYEE E
    ON D.DEPT_ID = E.DEPT_ID;
```

### DISTINCT 적용 결과 Table

| DEPT_NAME |
| --- |
| 개발 |

## JOIN과 Subquery 비교

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

JOIN으로 직원 이름과 부서 이름을 함께 조회합니다.

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

### JOIN 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | 인사 |

특정 부서의 직원만 찾는 문제는 Subquery로도 표현할 수 있습니다.

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

### Subquery 결과 Table

| EMP_NAME |
| --- |
| 직원1 |

| 구분 | JOIN | Subquery |
| --- | --- | --- |
| 기본 생각 | Table끼리 연결 | Query 안에 Query |
| 여러 Table Column 동시 표시 | 자연스러움 | 상황에 따라 다름 |
| 대표 사용 | 관련 데이터 결합 | 조건 계산, 존재 여부 |

## JOIN과 UNION 비교

JOIN은 관련 Column을 옆으로 연결하는 느낌입니다.

### JOIN 입력 Table 1

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |

### JOIN 입력 Table 2

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

### JOIN 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |

반면 UNION은 같은 형태의 결과를 아래로 이어 붙입니다.

### UNION 입력 결과 1

| NAME |
| --- |
| 직원1 |

### UNION 입력 결과 2

| NAME |
| --- |
| 직원2 |

```sql
SELECT '직원1' AS NAME
UNION
SELECT '직원2' AS NAME;
```

### UNION 결과 Table

| NAME |
| --- |
| 직원1 |
| 직원2 |

```text
JOIN
→ 관계를 기준으로 Column 방향 결합

UNION
→ 같은 구조의 결과를 Row 방향 결합
```

## JOIN 문제를 푸는 순서

직원 이름, 부서 이름, 부서 지역을 조회하는 문제를 풀어 봅니다.

### 입력 Table 1 · EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | 20 |

### 입력 Table 2 · DEPARTMENT

| DEPT_ID | DEPT_NAME | REGION |
| --- | --- | --- |
| 10 | 개발 | 서울 |
| 20 | 인사 | 부산 |

첫째, 필요한 Column이 어느 Table에 있는지 찾습니다.

```text
EMP_NAME
→ EMPLOYEE

DEPT_NAME
→ DEPARTMENT

REGION
→ DEPARTMENT
```

둘째, 연결 Column을 찾습니다.

```text
EMPLOYEE.DEPT_ID
=
DEPARTMENT.DEPT_ID
```

셋째, 필요한 JOIN 종류를 결정합니다.

현재는 양쪽에 연결되는 직원만 필요하므로 INNER JOIN을 사용할 수 있습니다.

넷째, Query를 작성합니다.

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME,
    D.REGION
FROM EMPLOYEE E
JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

### 결과 Table

| EMP_NAME | DEPT_NAME | REGION |
| --- | --- | --- |
| 직원1 | 개발 | 서울 |
| 직원2 | 인사 | 부산 |

## 잘 놓치는 핵심

### 1. JOIN은 조건이 맞는 Row를 연결한다

#### 입력 Table

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | 20 |

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

#### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | 인사 |

Table 전체를 무조건 옆에 붙이는 것이 아닙니다.

### 2. INNER JOIN은 연결되지 않은 Row를 제외한다

#### 입력 Table

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | NULL |

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

#### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |

직원2는 연결 상대가 없으므로 제외됩니다.

### 3. LEFT JOIN은 왼쪽 Row를 살린다

같은 입력값에서 LEFT JOIN을 사용합니다.

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

직원2는 살아 있고 오른쪽 값만 `NULL`입니다.

### 4. 일대다 JOIN은 결과 Row가 늘어날 수 있다

#### 입력 Table

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |

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

#### 결과 Table

| DEPT_NAME | EMP_NAME |
| --- | --- |
| 개발 | 직원1 |
| 개발 | 직원2 |
| 개발 | 직원3 |

부서 한 Row가 직원 세 Row와 연결되므로 결과도 세 Row입니다.

### 5. LEFT JOIN 뒤 WHERE는 결과를 줄일 수 있다

#### 입력 Table

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |

| EMP_NAME | DEPT_ID | SALARY |
| --- | --- | ---: |
| 직원1 | 10 | 3500 |

LEFT JOIN만 하면 다음 결과입니다.

| DEPT_NAME | EMP_NAME | SALARY |
| --- | --- | ---: |
| 개발 | 직원1 | 3500 |
| 인사 | NULL | NULL |

하지만 다음 조건을 추가합니다.

```sql
WHERE E.SALARY >= 3000
```

#### 최종 결과 Table

| DEPT_NAME | EMP_NAME | SALARY |
| --- | --- | ---: |
| 개발 | 직원1 | 3500 |

인사의 `SALARY`는 `NULL`이므로 WHERE에서 제거됩니다.

## 시험·면접

### 핵심 암기

```text
INNER JOIN
→ 양쪽에 연결되는 Row만
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
→ 모든 가능한 조합
```

### 시험용 한 장 예시

#### 입력 Table 1

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | NULL |

#### 입력 Table 2

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |

#### INNER JOIN 결과

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |

#### LEFT JOIN 결과

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | NULL |

#### RIGHT JOIN 결과

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| NULL | 인사 |

#### FULL OUTER JOIN 결과

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | NULL |
| NULL | 인사 |

### 자주 나오는 문장

<mark>INNER JOIN은 JOIN 조건을 만족하는 Row만 반환합니다.</mark>

<mark>LEFT JOIN은 왼쪽 Table의 모든 Row를 유지합니다.</mark>

<mark>SELF JOIN은 같은 Table에 서로 다른 별칭을 부여해 연결합니다.</mark>

<mark>CROSS JOIN은 두 Table의 가능한 모든 Row 조합을 생성합니다.</mark>

### 시험 함정 1 · Foreign Key가 없어도 JOIN은 가능하다

#### 입력 Table 1

| A.ID | A.NAME |
| --- | --- |
| 1 | 가 |

#### 입력 Table 2

| B.ID | B.VALUE |
| --- | --- |
| 1 | 나 |

```sql
SELECT
    A.NAME,
    B.VALUE
FROM A
JOIN B
    ON A.ID = B.ID;
```

#### 결과 Table

| NAME | VALUE |
| --- | --- |
| 가 | 나 |

Foreign Key 제약조건이 없어도 관계를 알고 있다면 JOIN Query를 작성할 수 있습니다.

### 시험 함정 2 · LEFT JOIN은 오른쪽 전체를 보장하지 않는다

#### 입력 Table 1

| A.ID |
| --- |
| 1 |
| 2 |

#### 입력 Table 2

| B.ID |
| --- |
| 1 |
| 3 |

```sql
SELECT
    A.ID AS A_ID,
    B.ID AS B_ID
FROM A
LEFT JOIN B
    ON A.ID = B.ID;
```

#### 결과 Table

| A_ID | B_ID |
| --- | --- |
| 1 | 1 |
| 2 | NULL |

오른쪽에만 존재하는 `B.ID = 3`은 결과에 나오지 않습니다.

### 면접 짧은 답변

JOIN은 관계형 데이터베이스에서 서로 관련된 여러 Table의 Row를 조건에 따라 연결해 하나의 결과로 조회하는 방법입니다. INNER JOIN은 양쪽에서 연결되는 Row만 조회하고, LEFT JOIN은 왼쪽 Table의 Row를 모두 유지하며 연결되지 않는 오른쪽 값은 NULL로 반환할 수 있습니다.

## 객관식 문제

### 문제 1 · INNER JOIN 결과

#### EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | 20 |
| 직원3 | NULL |

#### DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |
| 30 | 영업 |

다음 Query의 결과는 무엇인가?

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
INNER JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

① 직원1·개발만 나온다.  
② 직원1·개발, 직원2·인사만 나온다.  
③ 직원1·개발, 직원2·인사, 직원3·NULL이 나온다.  
④ 직원1·개발, 직원2·인사, NULL·영업이 나온다.

<details>
<summary>정답</summary>

②

INNER JOIN은 양쪽에서 연결되는 Row만 남깁니다.

결과 Table은 다음과 같습니다.

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | 인사 |

직원3은 연결 부서가 없고 영업은 연결 직원이 없으므로 제외됩니다.

</details>

### 문제 2 · LEFT JOIN 결과

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

다음 Query의 결과는 무엇인가?

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
④ 직원2만 나온다.

<details>
<summary>정답</summary>

②

왼쪽 EMPLOYEE의 Row는 모두 남습니다.

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | NULL |

직원2는 연결되는 부서가 없으므로 오른쪽 값만 NULL이 됩니다.

</details>

### 문제 3 · RIGHT JOIN 결과

#### EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |

#### DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |

다음 Query의 결과는 무엇인가?

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
RIGHT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

① 직원1·개발만 나온다.  
② 직원1·개발, 직원1·인사가 나온다.  
③ 직원1·개발, NULL·인사가 나온다.  
④ NULL·개발, NULL·인사가 나온다.

<details>
<summary>정답</summary>

③

오른쪽 DEPARTMENT의 모든 Row가 남습니다.

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| NULL | 인사 |

인사 부서는 연결 직원이 없으므로 직원 이름이 NULL입니다.

</details>

### 문제 4 · SELF JOIN

#### EMPLOYEE

| EMP_ID | EMP_NAME | MANAGER_ID |
| --- | --- | --- |
| 1 | 팀장 | NULL |
| 2 | 직원1 | 1 |
| 3 | 직원2 | 1 |

다음 Query의 목적은 무엇인가?

```sql
SELECT
    E.EMP_NAME AS 직원,
    M.EMP_NAME AS 관리자
FROM EMPLOYEE E
LEFT JOIN EMPLOYEE M
    ON E.MANAGER_ID = M.EMP_ID;
```

① 직원과 부서를 연결한다.  
② 직원과 같은 Table에 있는 관리자를 연결한다.  
③ 모든 직원 조합을 만든다.  
④ 관리자 Row만 삭제한다.

<details>
<summary>정답</summary>

②

같은 EMPLOYEE Table을 `E`와 `M`이라는 두 역할로 사용합니다.

| 직원 | 관리자 |
| --- | --- |
| 팀장 | NULL |
| 직원1 | 팀장 |
| 직원2 | 팀장 |

직원의 MANAGER_ID와 관리자의 EMP_ID를 연결한 SELF JOIN입니다.

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

다음 Query 결과의 Row 수는 몇 개인가?

```sql
SELECT *
FROM COLOR
CROSS JOIN SIZE;
```

① 2  
② 3  
③ 5  
④ 6

<details>
<summary>정답</summary>

④

첫 번째 Table 2개 Row와 두 번째 Table 3개 Row의 모든 조합을 만듭니다.

$$2\times3=6$$

| COLOR | SIZE |
| --- | --- |
| 검정 | S |
| 검정 | M |
| 검정 | L |
| 흰색 | S |
| 흰색 | M |
| 흰색 | L |

</details>

### 문제 6 · LEFT JOIN과 WHERE

#### DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |
| 30 | 영업 |

#### EMPLOYEE

| EMP_NAME | DEPT_ID | SALARY |
| --- | --- | ---: |
| 직원1 | 10 | 3500 |
| 직원2 | 20 | 2500 |

다음 Query의 결과는 무엇인가?

```sql
SELECT
    D.DEPT_NAME,
    E.EMP_NAME
FROM DEPARTMENT D
LEFT JOIN EMPLOYEE E
    ON D.DEPT_ID = E.DEPT_ID
WHERE E.SALARY >= 3000;
```

① 개발·직원1만 나온다.  
② 개발·직원1, 인사·직원2가 나온다.  
③ 개발·직원1, 영업·NULL이 나온다.  
④ 개발·직원1, 인사·NULL, 영업·NULL이 나온다.

<details>
<summary>정답</summary>

①

LEFT JOIN 직후에는 개발, 인사, 영업이 모두 존재할 수 있습니다.

하지만 WHERE에서 급여 3000 이상만 남깁니다.

직원2는 2500이라 제거되고, 영업은 직원이 없어 SALARY가 NULL이므로 제거됩니다.

최종 결과 Table은 다음과 같습니다.

| DEPT_NAME | EMP_NAME |
| --- | --- |
| 개발 | 직원1 |

</details>

## JOIN 전체 요약

마지막으로 가장 작은 Table로 결과를 한 번에 비교합니다.

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

### INNER JOIN

```sql
SELECT *
FROM A
INNER JOIN B
    ON A.ID = B.ID;
```

#### 결과 Table

| A.ID | NAME | B.ID | VALUE |
| --- | --- | --- | --- |
| 1 | 가 | 1 | 하나 |

### LEFT JOIN

```sql
SELECT *
FROM A
LEFT JOIN B
    ON A.ID = B.ID;
```

#### 결과 Table

| A.ID | NAME | B.ID | VALUE |
| --- | --- | --- | --- |
| 1 | 가 | 1 | 하나 |
| 2 | 나 | NULL | NULL |

### RIGHT JOIN

```sql
SELECT *
FROM A
RIGHT JOIN B
    ON A.ID = B.ID;
```

#### 결과 Table

| A.ID | NAME | B.ID | VALUE |
| --- | --- | --- | --- |
| 1 | 가 | 1 | 하나 |
| NULL | NULL | 3 | 셋 |

### FULL OUTER JOIN

```sql
SELECT *
FROM A
FULL OUTER JOIN B
    ON A.ID = B.ID;
```

#### 결과 Table

| A.ID | NAME | B.ID | VALUE |
| --- | --- | --- | --- |
| 1 | 가 | 1 | 하나 |
| 2 | 나 | NULL | NULL |
| NULL | NULL | 3 | 셋 |

이 네 결과 Table을 직접 그릴 수 있으면 기본 JOIN 문제를 대부분 풀 수 있습니다.

<blockquote class="prompt-danger">
<p>JOIN은 문장만 외우지 말고 반드시 입력 Table과 결과 Table을 직접 비교하면서 익힙니다.</p>
</blockquote>

## 다음에 이을 글

**INNER JOIN**입니다.

두 Table에서 연결 조건을 만족하는 Row만 남기는 과정을 더 많은 실전 예제와 결과 Table로 자세히 다룹니다.
