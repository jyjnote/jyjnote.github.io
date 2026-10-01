---
title: INNER JOIN · 이너 조인
date: 2026-09-18 21:35:00 +0900
slug: inner-join
permalink: /posts/inner-join/
categories: [CS, 데이터베이스]
tags: [INNERJOIN, 이너조인, JOIN, SQL, 관계형데이터베이스, ForeignKey, 정보처리기사, NCS]
math: true
---

INNER JOIN은 <mark>두 Table에서 JOIN 조건을 만족하는 Row만 결과에 남기는 JOIN</mark>입니다.

양쪽 Table 중 한쪽에만 존재하고 서로 연결되지 않는 Row는 결과에서 제외됩니다.

<blockquote class="prompt-info">
<p>한 줄: INNER JOIN은 두 Table에서 서로 연결되는 Row만 가져옵니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

양쪽 Table의 공통 연결 조건을 만족하는 Row만 결과 Table에 남습니다.

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

이 글에서는 실제 연습 데이터베이스의 관계를 기준으로 설명하되, JOIN 결과를 한눈에 볼 수 있도록 작은 예시 Table로 줄여서 사용합니다.

대표 관계는 다음과 같습니다.

```text
EMPLOYEE.DEPT_ID
→ DEPARTMENT.DEPT_ID
```

```text
ORDERS.CUSTOMER_ID
→ CUSTOMER.CUSTOMER_ID
```

```text
ORDER_ITEM.ORDER_ID
→ ORDERS.ORDER_ID
```

```text
ORDER_ITEM.PRODUCT_ID
→ PRODUCT.PRODUCT_ID
```

<blockquote class="prompt-info">
<p>모든 예시는 입력 Table, SQL, 결과 Table을 함께 확인합니다.</p>
</blockquote>

## INNER JOIN의 가장 기본적인 예시

먼저 직원과 부서 Table이 있다고 생각합니다.

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

직원 이름과 부서 이름을 함께 조회합니다.

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
| 직원2 | 인사 |
| 직원3 | 영업 |

세 직원 모두 자신의 `DEPT_ID`와 같은 부서가 존재하므로 결과에 남습니다.

```text
직원1의 10 = 개발의 10
→ 연결

직원2의 20 = 인사의 20
→ 연결

직원3의 30 = 영업의 30
→ 연결
```

## INNER JOIN의 핵심

INNER JOIN의 핵심은 다음 한 문장입니다.

<mark>양쪽 Table에서 JOIN 조건을 만족하는 Row만 결과에 남는다.</mark>

다음 예시에서는 연결되지 않는 Row를 일부러 추가해 봅니다.

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

<pre><code class="language-sql">SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
<span style="background-color:#DFF5E8;">INNER JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID</span>;</code></pre>

여기서 연녹색으로 강조된 부분이 실제 Row 연결을 결정합니다.

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | 인사 |

직원3은 `DEPT_ID`가 `NULL`이므로 연결되는 부서가 없습니다.

영업 부서는 존재하지만 `DEPT_ID = 30`인 직원이 없습니다.

따라서 두 Row 모두 결과에서 제외됩니다.

```text
직원3
→ 연결 실패
→ 제외

영업
→ 연결 실패
→ 제외
```

## INNER JOIN은 교집합처럼 생각하면 쉽다

INNER JOIN은 흔히 두 집합의 교집합처럼 설명합니다.

정확히는 두 Table 자체의 교집합이라기보다 <mark>JOIN 조건을 만족해 서로 연결할 수 있는 Row만 남긴다</mark>고 이해하는 것이 좋습니다.

### 입력 Table 1 · A

| ID | NAME |
| --- | --- |
| 1 | 가 |
| 2 | 나 |
| 4 | 라 |

### 입력 Table 2 · B

| ID | VALUE |
| --- | --- |
| 1 | 하나 |
| 2 | 둘 |
| 3 | 셋 |

다음과 같이 `ID`를 기준으로 연결합니다.

```sql
SELECT
    A.ID,
    A.NAME,
    B.VALUE
FROM A
INNER JOIN B
    ON A.ID = B.ID;
```

### 결과 Table

| ID | NAME | VALUE |
| --- | --- | --- |
| 1 | 가 | 하나 |
| 2 | 나 | 둘 |

`ID = 1`, `ID = 2`는 양쪽에 모두 존재합니다.

`A.ID = 4`는 B에 없으므로 제외됩니다.

`B.ID = 3`은 A에 없으므로 제외됩니다.

## INNER JOIN의 기본 문법

기본 구조는 다음과 같습니다.

```sql
SELECT 조회할_Column
FROM 기준_Table
INNER JOIN 연결할_Table
    ON 연결_조건;
```

실제 예시를 다시 봅니다.

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

각 요소의 역할은 다음과 같습니다.

| 구문 | 역할 |
| --- | --- |
| SELECT | 최종 결과에 표시할 Column |
| FROM | 기준 Table |
| INNER JOIN | 연결할 Table |
| ON | 어떤 Row끼리 연결할지 결정 |

## INNER는 생략할 수 있다

다음 두 Query는 일반적으로 같은 의미입니다.

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

첫 번째 Query입니다.

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
INNER JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

두 번째 Query입니다.

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

### 두 Query의 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | 인사 |

즉, 단순히 `JOIN`이라고 작성한 경우 일반적으로 `INNER JOIN`을 의미합니다.

<blockquote class="prompt-info">
<p>시험에서는 JOIN만 적혀 있으면 보통 INNER JOIN으로 해석합니다.</p>
</blockquote>

## ON 조건이 가장 중요하다

INNER JOIN에서는 `ON` 뒤의 조건이 어떤 Row를 연결할지 결정합니다.

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

올바른 조건은 다음과 같습니다.

<pre><code class="language-sql">SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
INNER JOIN DEPARTMENT D
    <span style="background-color:#DFF5E8;">ON E.DEPT_ID = D.DEPT_ID</span>;</code></pre>

### 올바른 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | 인사 |

반대로 다음처럼 잘못된 Column을 연결하면 원하는 결과가 나오지 않습니다.

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
INNER JOIN DEPARTMENT D
    ON E.EMP_ID = D.DEPT_ID;
```

### 잘못된 조건의 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 결과 없음 | 결과 없음 |

현재 값에서는 `1001 = 10`, `1002 = 20`이 모두 거짓이기 때문입니다.

<blockquote class="prompt-warning">
<p>JOIN 문제를 보면 먼저 두 Table을 연결하는 실제 관계 Column이 무엇인지 찾습니다.</p>
</blockquote>

## 같은 이름의 Column은 Table을 구분한다

JOIN에서는 같은 이름의 Column이 양쪽 Table에 존재하는 경우가 많습니다.

### 입력 Table 1 · EMPLOYEE

| EMP_ID | EMP_NAME | DEPT_ID |
| --- | --- | --- |
| 1001 | 직원1 | 10 |

### 입력 Table 2 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |

두 Table 모두 `DEPT_ID`를 가지고 있습니다.

따라서 다음처럼 Table 별칭을 붙이면 명확합니다.

```sql
SELECT
    E.DEPT_ID,
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
INNER JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

### 결과 Table

| DEPT_ID | EMP_NAME | DEPT_NAME |
| --- | --- | --- |
| 10 | 직원1 | 개발 |

`E.DEPT_ID`는 직원 Table의 부서 번호입니다.

`D.DEPT_ID`는 부서 Table의 부서 번호입니다.

## Foreign Key와 INNER JOIN

실제 데이터베이스에서는 Foreign Key 관계를 따라 INNER JOIN하는 경우가 매우 많습니다.

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
INNER JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | 인사 |

Foreign Key는 관계를 정의하고 참조 무결성을 유지하는 제약조건입니다.

INNER JOIN은 실제 조회에서 그 관계를 이용해 Row를 연결합니다.

## 일대일 관계의 INNER JOIN

먼저 한 Row가 한 Row와 연결되는 단순한 상황을 봅니다.

### 입력 Table 1 · MEMBER

| MEMBER_ID | NAME |
| --- | --- |
| 1 | 회원1 |
| 2 | 회원2 |

### 입력 Table 2 · PROFILE

| MEMBER_ID | NICKNAME |
| --- | --- |
| 1 | 하나 |
| 2 | 둘 |

```sql
SELECT
    M.NAME,
    P.NICKNAME
FROM MEMBER M
INNER JOIN PROFILE P
    ON M.MEMBER_ID = P.MEMBER_ID;
```

### 결과 Table

| NAME | NICKNAME |
| --- | --- |
| 회원1 | 하나 |
| 회원2 | 둘 |

각 회원이 프로필 하나와 연결되므로 결과도 두 Row입니다.

## 일대다 관계의 INNER JOIN

INNER JOIN 결과 Row 수는 원본 Table의 Row 수보다 많아질 수도 있습니다.

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
INNER JOIN EMPLOYEE E
    ON D.DEPT_ID = E.DEPT_ID;
```

### 결과 Table

| DEPT_NAME | EMP_NAME |
| --- | --- |
| 개발 | 직원1 |
| 개발 | 직원2 |
| 인사 | 직원3 |

개발 부서 한 Row가 직원1, 직원2 두 Row와 연결됩니다.

```text
개발
├─ 직원1
└─ 직원2
```

따라서 개발이라는 값이 두 번 나타나는 것은 정상입니다.

<blockquote class="prompt-info">
<p>INNER JOIN이라고 해서 결과 Row 수가 항상 줄어드는 것은 아닙니다.</p>
</blockquote>

## 다대다 관계와 중간 Table

다대다 관계는 중간 Table을 통해 연결하는 경우가 많습니다.

실제 연습 데이터베이스에서는 주문과 상품 사이에 `ORDER_ITEM`이 있습니다.

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

세 Table을 INNER JOIN합니다.

<pre><code class="language-sql">SELECT
    O.ORDER_ID,
    P.PRODUCT_NAME,
    OI.QTY
FROM ORDERS O
<span style="background-color:#DFF5E8;">INNER JOIN ORDER_ITEM OI
    ON O.ORDER_ID = OI.ORDER_ID
INNER JOIN PRODUCT P
    ON OI.PRODUCT_ID = P.PRODUCT_ID</span>;</code></pre>

### 결과 Table

| ORDER_ID | PRODUCT_NAME | QTY |
| --- | --- | --- |
| 1 | 키보드 | 2 |
| 1 | 마우스 | 1 |
| 2 | 키보드 | 3 |

관계는 다음처럼 따라가면 됩니다.

```text
ORDERS
↓ ORDER_ID
ORDER_ITEM
↓ PRODUCT_ID
PRODUCT
```

## 여러 Table을 연속으로 INNER JOIN하기

INNER JOIN은 두 Table에만 제한되지 않습니다.

이번에는 고객 이름까지 함께 조회합니다.

### 입력 Table 1 · CUSTOMER

| CUSTOMER_ID | NAME |
| --- | --- |
| 101 | 고객1 |
| 102 | 고객2 |

### 입력 Table 2 · ORDERS

| ORDER_ID | CUSTOMER_ID |
| --- | --- |
| 1 | 101 |
| 2 | 102 |

### 입력 Table 3 · ORDER_ITEM

| ORDER_ID | PRODUCT_ID | QTY |
| --- | --- | --- |
| 1 | 501 | 2 |
| 2 | 502 | 1 |

### 입력 Table 4 · PRODUCT

| PRODUCT_ID | PRODUCT_NAME |
| --- | --- |
| 501 | 키보드 |
| 502 | 마우스 |

```sql
SELECT
    C.NAME,
    O.ORDER_ID,
    P.PRODUCT_NAME,
    OI.QTY
FROM CUSTOMER C
INNER JOIN ORDERS O
    ON C.CUSTOMER_ID = O.CUSTOMER_ID
INNER JOIN ORDER_ITEM OI
    ON O.ORDER_ID = OI.ORDER_ID
INNER JOIN PRODUCT P
    ON OI.PRODUCT_ID = P.PRODUCT_ID;
```

### 결과 Table

| NAME | ORDER_ID | PRODUCT_NAME | QTY |
| --- | --- | --- | --- |
| 고객1 | 1 | 키보드 | 2 |
| 고객2 | 2 | 마우스 | 1 |

Table이 많아져도 연결 관계를 한 단계씩 따라가면 됩니다.

## INNER JOIN 뒤 WHERE 사용

JOIN 조건과 조회 필터 조건은 역할이 다릅니다.

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

급여 3000 이상 직원만 조회합니다.

<pre><code class="language-sql">SELECT
    E.EMP_NAME,
    D.DEPT_NAME,
    E.SALARY
FROM EMPLOYEE E
INNER JOIN DEPARTMENT D
    <span style="background-color:#DFF5E8;">ON E.DEPT_ID = D.DEPT_ID</span>
<span style="background-color:#DFF5E8;">WHERE E.SALARY &gt;= 3000</span>;</code></pre>

### 결과 Table

| EMP_NAME | DEPT_NAME | SALARY |
| --- | --- | ---: |
| 직원1 | 개발 | 3500 |
| 직원3 | 인사 | 3200 |

역할을 구분하면 다음과 같습니다.

```text
ON
→ 어떤 Row끼리 연결할지

WHERE
→ 연결된 결과에서 어떤 Row를 남길지
```

## INNER JOIN에서 ON과 WHERE

INNER JOIN에서는 단순한 동등 조건이라면 조건을 `ON`과 `WHERE`로 나누어도 같은 결과가 나오는 경우가 있습니다.

하지만 의미상 관계 조건은 `ON`, 조회 필터는 `WHERE`로 구분하는 것이 좋습니다.

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

다음 Query를 봅니다.

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
INNER JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID
WHERE E.SALARY >= 3000;
```

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원3 | 인사 |

관계는 `DEPT_ID`로 연결하고 급여는 WHERE에서 필터링했습니다.

이렇게 역할을 분리하면 Query를 읽기 쉽습니다.

## 연결되지 않는 Row는 모두 사라진다

INNER JOIN에서는 왼쪽에만 있거나 오른쪽에만 있는 Row가 최종 결과에 남지 않습니다.

### 입력 Table 1 · EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | 20 |
| 직원3 | 99 |

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

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | 인사 |

직원3의 `DEPT_ID = 99`와 연결되는 부서는 없습니다.

영업 부서의 `DEPT_ID = 30`과 연결되는 직원도 없습니다.

따라서 둘 다 결과에서 제외됩니다.

## NULL과 INNER JOIN

`NULL`은 일반적인 값처럼 `=` 비교로 일치하지 않습니다.

### 입력 Table 1 · EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | NULL |

### 입력 Table 2 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| NULL | 미정 |

다음 조건으로 INNER JOIN합니다.

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

`NULL = NULL`은 참으로 처리되지 않으므로 직원2와 미정 부서는 연결되지 않습니다.

<blockquote class="prompt-warning">
<p>NULL끼리 있다고 해서 INNER JOIN의 등호 조건에서 서로 연결되는 것은 아닙니다.</p>
</blockquote>

## INNER JOIN 결과에 같은 값이 반복될 수 있다

JOIN 결과에서 같은 부서 이름이 여러 번 나타날 수 있습니다.

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
INNER JOIN EMPLOYEE E
    ON D.DEPT_ID = E.DEPT_ID;
```

### 결과 Table

| DEPT_NAME | EMP_NAME |
| --- | --- |
| 개발 | 직원1 |
| 개발 | 직원2 |
| 개발 | 직원3 |

부서 이름이 반복되어도 각 Row의 직원이 다릅니다.

즉, 무조건 잘못된 중복이라고 볼 수 없습니다.

## DISTINCT를 무조건 붙이면 안 된다

같은 입력 Table에서 부서 이름만 조회해 봅니다.

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
    D.DEPT_NAME
FROM DEPARTMENT D
INNER JOIN EMPLOYEE E
    ON D.DEPT_ID = E.DEPT_ID;
```

### 결과 Table

| DEPT_NAME |
| --- |
| 개발 |
| 개발 |

이 결과는 관계상 정상입니다.

정말 부서 이름을 한 번만 보고 싶은 목적이라면 `DISTINCT`를 사용할 수 있습니다.

```sql
SELECT DISTINCT
    D.DEPT_NAME
FROM DEPARTMENT D
INNER JOIN EMPLOYEE E
    ON D.DEPT_ID = E.DEPT_ID;
```

### DISTINCT 적용 결과 Table

| DEPT_NAME |
| --- |
| 개발 |

먼저 JOIN 관계를 확인한 뒤 DISTINCT가 필요한지 판단해야 합니다.

## INNER JOIN과 LEFT JOIN 비교

두 JOIN의 차이는 연결되지 않는 왼쪽 Row를 남기는지입니다.

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

먼저 INNER JOIN입니다.

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
INNER JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

### INNER JOIN 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |

이번에는 LEFT JOIN입니다.

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
LEFT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

### LEFT JOIN 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | NULL |

| 구분 | INNER JOIN | LEFT JOIN |
| --- | --- | --- |
| 연결 성공 Row | 포함 | 포함 |
| 왼쪽에만 있는 Row | 제외 | 포함 |
| 연결 실패 시 오른쪽 NULL | 결과 자체가 없음 | 가능 |

```text
INNER JOIN
→ 연결된 것만

LEFT JOIN
→ 왼쪽은 모두
```

## INNER JOIN과 CROSS JOIN 비교

INNER JOIN은 조건에 맞는 Row만 연결합니다.

CROSS JOIN은 가능한 모든 조합을 만듭니다.

### 입력 Table 1 · A

| ID | NAME |
| --- | --- |
| 1 | 가 |
| 2 | 나 |

### 입력 Table 2 · B

| ID | VALUE |
| --- | --- |
| 1 | 하나 |
| 2 | 둘 |

INNER JOIN을 사용합니다.

```sql
SELECT
    A.NAME,
    B.VALUE
FROM A
INNER JOIN B
    ON A.ID = B.ID;
```

### INNER JOIN 결과 Table

| NAME | VALUE |
| --- | --- |
| 가 | 하나 |
| 나 | 둘 |

CROSS JOIN을 사용합니다.

```sql
SELECT
    A.NAME,
    B.VALUE
FROM A
CROSS JOIN B;
```

### CROSS JOIN 결과 Table

| NAME | VALUE |
| --- | --- |
| 가 | 하나 |
| 가 | 둘 |
| 나 | 하나 |
| 나 | 둘 |

INNER JOIN은 조건을 만족하는 2개 Row만 남습니다.

CROSS JOIN은 2 × 2의 모든 조합인 4개 Row를 만듭니다.

## INNER JOIN과 Subquery 비교

같은 문제를 항상 같은 방식으로 풀어야 하는 것은 아닙니다.

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

직원 이름과 부서 이름을 함께 보여 주려면 INNER JOIN이 자연스럽습니다.

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
| 직원2 | 인사 |

개발 부서 직원만 찾는 조건 문제라면 Subquery로도 표현할 수 있습니다.

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

### 결과 Table

| EMP_NAME |
| --- |
| 직원1 |

## 실제 문제 풀이 1 · 직원과 부서

직원 이름, 부서 이름, 지역을 조회합니다.

### 입력 Table 1 · EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | 20 |
| 직원3 | 30 |

### 입력 Table 2 · DEPARTMENT

| DEPT_ID | DEPT_NAME | REGION |
| --- | --- | --- |
| 10 | 개발 | 서울 |
| 20 | 인사 | 부산 |
| 30 | 영업 | 대전 |

첫째, 필요한 Column을 찾습니다.

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

셋째, Query를 작성합니다.

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME,
    D.REGION
FROM EMPLOYEE E
INNER JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

### 결과 Table

| EMP_NAME | DEPT_NAME | REGION |
| --- | --- | --- |
| 직원1 | 개발 | 서울 |
| 직원2 | 인사 | 부산 |
| 직원3 | 영업 | 대전 |

## 실제 문제 풀이 2 · 고객과 주문

고객 이름과 주문 번호를 조회합니다.

### 입력 Table 1 · CUSTOMER

| CUSTOMER_ID | NAME |
| --- | --- |
| 101 | 고객1 |
| 102 | 고객2 |
| 103 | 고객3 |

### 입력 Table 2 · ORDERS

| ORDER_ID | CUSTOMER_ID |
| --- | --- |
| 1 | 101 |
| 2 | 101 |
| 3 | 102 |

고객3은 주문이 없습니다.

```sql
SELECT
    C.NAME,
    O.ORDER_ID
FROM CUSTOMER C
INNER JOIN ORDERS O
    ON C.CUSTOMER_ID = O.CUSTOMER_ID;
```

### 결과 Table

| NAME | ORDER_ID |
| --- | --- |
| 고객1 | 1 |
| 고객1 | 2 |
| 고객2 | 3 |

고객3은 연결되는 주문이 없으므로 결과에서 제외됩니다.

고객1은 주문이 두 건이므로 결과도 두 Row입니다.

## 실제 문제 풀이 3 · 주문 상품

주문 번호, 상품 이름, 수량을 조회합니다.

### 입력 Table 1 · ORDERS

| ORDER_ID |
| --- |
| 1 |
| 2 |

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
INNER JOIN ORDER_ITEM OI
    ON O.ORDER_ID = OI.ORDER_ID
INNER JOIN PRODUCT P
    ON OI.PRODUCT_ID = P.PRODUCT_ID;
```

### 결과 Table

| ORDER_ID | PRODUCT_NAME | QTY |
| --- | --- | --- |
| 1 | 키보드 | 2 |
| 1 | 마우스 | 1 |
| 2 | 키보드 | 3 |

## 실제 문제 풀이 4 · 조건 추가

개발 부서이면서 급여가 3000 이상인 직원만 조회합니다.

### 입력 Table 1 · EMPLOYEE

| EMP_NAME | DEPT_ID | SALARY |
| --- | --- | ---: |
| 직원1 | 10 | 3500 |
| 직원2 | 10 | 2800 |
| 직원3 | 20 | 4000 |

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
INNER JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID
WHERE D.DEPT_NAME = '개발'
  AND E.SALARY >= 3000;
```

### 결과 Table

| EMP_NAME | DEPT_NAME | SALARY |
| --- | --- | ---: |
| 직원1 | 개발 | 3500 |

직원2는 개발 부서이지만 급여 조건을 만족하지 못합니다.

직원3은 급여 조건은 만족하지만 개발 부서가 아닙니다.

따라서 직원1만 남습니다.

## INNER JOIN 문제 풀이 순서

INNER JOIN 문제를 보면 다음 순서로 접근합니다.

### 예시 입력 Table 1

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | 20 |

### 예시 입력 Table 2

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |

첫째, 어떤 Table이 필요한지 찾습니다.

둘째, 연결 Column을 찾습니다.

```text
EMPLOYEE.DEPT_ID
=
DEPARTMENT.DEPT_ID
```

셋째, 서로 연결되지 않는 Row가 결과에서 빠진다는 것을 기억합니다.

넷째, 필요한 Column을 SELECT에 작성합니다.

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
| 직원2 | 인사 |

## 잘 놓치는 핵심

### 1. INNER JOIN은 연결되지 않는 Row를 남기지 않는다

#### 입력 Table 1

| A.ID | A.NAME |
| --- | --- |
| 1 | 가 |
| 2 | 나 |

#### 입력 Table 2

| B.ID | B.VALUE |
| --- | --- |
| 1 | 하나 |
| 3 | 셋 |

```sql
SELECT
    A.NAME,
    B.VALUE
FROM A
INNER JOIN B
    ON A.ID = B.ID;
```

#### 결과 Table

| NAME | VALUE |
| --- | --- |
| 가 | 하나 |

`A.ID = 2`와 `B.ID = 3`은 서로 연결되지 않으므로 모두 제외됩니다.

### 2. JOIN만 적혀 있어도 INNER JOIN일 수 있다

#### 입력 Table 1

| A.ID |
| --- |
| 1 |

#### 입력 Table 2

| B.ID |
| --- |
| 1 |

```sql
SELECT *
FROM A
JOIN B
    ON A.ID = B.ID;
```

#### 결과 Table

| A.ID | B.ID |
| --- | --- |
| 1 | 1 |

일반적인 `JOIN`은 `INNER JOIN`과 같은 의미로 사용됩니다.

### 3. NULL은 등호 JOIN에서 서로 연결되지 않는다

#### 입력 Table 1

| A.ID |
| --- |
| NULL |

#### 입력 Table 2

| B.ID |
| --- |
| NULL |

```sql
SELECT *
FROM A
INNER JOIN B
    ON A.ID = B.ID;
```

#### 결과 Table

| A.ID | B.ID |
| --- | --- |
| 결과 없음 | 결과 없음 |

`NULL = NULL`이 참이 아니기 때문입니다.

### 4. 결과 Row 수가 원본보다 많아질 수 있다

#### 입력 Table 1

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |

#### 입력 Table 2

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
INNER JOIN EMPLOYEE E
    ON D.DEPT_ID = E.DEPT_ID;
```

#### 결과 Table

| DEPT_NAME | EMP_NAME |
| --- | --- |
| 개발 | 직원1 |
| 개발 | 직원2 |
| 개발 | 직원3 |

일대다 관계에서는 한 Row가 여러 Row와 연결될 수 있습니다.

### 5. INNER JOIN과 LEFT JOIN을 혼동하지 않는다

#### 입력 Table 1

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | NULL |

#### 입력 Table 2

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |

INNER JOIN 결과입니다.

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |

LEFT JOIN 결과입니다.

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | NULL |

<blockquote class="prompt-warning">
<p>연결되지 않은 왼쪽 Row까지 남겨야 한다면 INNER JOIN이 아니라 LEFT JOIN을 검토합니다.</p>
</blockquote>

## 시험·면접

### 핵심 암기

```text
INNER JOIN
→ 양쪽에서 연결되는 Row만
```

```text
JOIN
→ 일반적으로 INNER JOIN과 같은 의미
```

```text
ON
→ Row 연결 조건
```

```text
연결 실패
→ 결과에서 제외
```

### 시험용 한 장 예시

#### 입력 Table 1 · A

| ID | NAME |
| --- | --- |
| 1 | 가 |
| 2 | 나 |
| 4 | 라 |

#### 입력 Table 2 · B

| ID | VALUE |
| --- | --- |
| 1 | 하나 |
| 2 | 둘 |
| 3 | 셋 |

```sql
SELECT
    A.ID,
    A.NAME,
    B.VALUE
FROM A
INNER JOIN B
    ON A.ID = B.ID;
```

#### 결과 Table

| ID | NAME | VALUE |
| --- | --- | --- |
| 1 | 가 | 하나 |
| 2 | 나 | 둘 |

`1`, `2`만 양쪽에 존재하므로 결과에 남습니다.

### 자주 나오는 문장

<mark>INNER JOIN은 JOIN 조건을 만족하는 Row만 반환합니다.</mark>

<mark>INNER JOIN에서는 한쪽 Table에만 존재하는 Row가 결과에서 제외됩니다.</mark>

<mark>JOIN만 작성해도 일반적으로 INNER JOIN을 의미합니다.</mark>

<mark>INNER JOIN 결과 Row 수는 관계에 따라 원본보다 많아질 수도 있습니다.</mark>

### 시험 함정 1 · INNER JOIN은 항상 Row 수를 줄이지 않는다

#### 입력 Table 1

| ID | NAME |
| --- | --- |
| 1 | 가 |

#### 입력 Table 2

| ID | VALUE |
| --- | --- |
| 1 | 하나 |
| 1 | 둘 |
| 1 | 셋 |

```sql
SELECT
    A.NAME,
    B.VALUE
FROM A
INNER JOIN B
    ON A.ID = B.ID;
```

#### 결과 Table

| NAME | VALUE |
| --- | --- |
| 가 | 하나 |
| 가 | 둘 |
| 가 | 셋 |

A에는 한 Row만 있지만 결과는 세 Row입니다.

### 시험 함정 2 · Foreign Key가 없어도 INNER JOIN 자체는 가능하다

#### 입력 Table 1

| A.ID | A.NAME |
| --- | --- |
| 1 | 가 |

#### 입력 Table 2

| B.ID | B.VALUE |
| --- | --- |
| 1 | 나 |

Foreign Key 제약조건이 없더라도 다음 JOIN은 작성할 수 있습니다.

```sql
SELECT
    A.NAME,
    B.VALUE
FROM A
INNER JOIN B
    ON A.ID = B.ID;
```

#### 결과 Table

| NAME | VALUE |
| --- | --- |
| 가 | 나 |

JOIN 가능 여부와 Foreign Key 제약조건 존재 여부는 같은 문제가 아닙니다.

### 면접 짧은 답변

INNER JOIN은 두 Table을 연결할 때 JOIN 조건을 만족하는 Row만 결과로 반환하는 방식입니다. 한쪽 Table에만 존재하거나 연결 조건을 만족하지 않는 Row는 결과에서 제외되며, 일반적으로 JOIN이라고만 작성해도 INNER JOIN을 의미합니다.

## 객관식 문제

### 문제 1 · 기본 INNER JOIN

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

양쪽에서 연결되는 Row만 남습니다.

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | 인사 |

직원3과 영업 부서는 연결 상대가 없어 제외됩니다.

</details>

### 문제 2 · JOIN 생략 표현

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

다음 두 Query의 관계로 가장 적절한 것은?

```sql
SELECT *
FROM A
INNER JOIN B
    ON A.ID = B.ID;
```

```sql
SELECT *
FROM A
JOIN B
    ON A.ID = B.ID;
```

① 결과가 항상 다르다.  
② 두 번째 Query는 CROSS JOIN이다.  
③ 일반적으로 같은 결과를 반환한다.  
④ 두 번째 Query는 LEFT JOIN이다.

<details>
<summary>정답</summary>

③

일반적인 JOIN은 INNER JOIN으로 사용됩니다.

두 Query의 결과 Table은 같습니다.

| A.ID | NAME | B.ID | VALUE |
| --- | --- | --- | --- |
| 1 | 가 | 1 | 하나 |
| 2 | 나 | 2 | 둘 |

</details>

### 문제 3 · 연결되지 않는 Row

#### A

| ID | NAME |
| --- | --- |
| 1 | 가 |
| 2 | 나 |

#### B

| ID | VALUE |
| --- | --- |
| 1 | 하나 |
| 3 | 셋 |

다음 Query 결과의 Row 수는 몇 개인가?

```sql
SELECT *
FROM A
INNER JOIN B
    ON A.ID = B.ID;
```

① 1개  
② 2개  
③ 3개  
④ 4개

<details>
<summary>정답</summary>

①

양쪽에 모두 존재하는 ID는 1뿐입니다.

| A.ID | NAME | B.ID | VALUE |
| --- | --- | --- | --- |
| 1 | 가 | 1 | 하나 |

</details>

### 문제 4 · 일대다 INNER JOIN

#### DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |

#### EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | 10 |
| 직원3 | 10 |

다음 Query 결과의 Row 수는?

```sql
SELECT
    D.DEPT_NAME,
    E.EMP_NAME
FROM DEPARTMENT D
INNER JOIN EMPLOYEE E
    ON D.DEPT_ID = E.DEPT_ID;
```

① 1개  
② 2개  
③ 3개  
④ 4개

<details>
<summary>정답</summary>

③

개발 부서 한 Row가 직원 세 Row와 각각 연결됩니다.

| DEPT_NAME | EMP_NAME |
| --- | --- |
| 개발 | 직원1 |
| 개발 | 직원2 |
| 개발 | 직원3 |

</details>

### 문제 5 · NULL과 INNER JOIN

#### A

| ID | NAME |
| --- | --- |
| NULL | 가 |
| 1 | 나 |

#### B

| ID | VALUE |
| --- | --- |
| NULL | 하나 |
| 1 | 둘 |

다음 Query의 결과는?

```sql
SELECT
    A.NAME,
    B.VALUE
FROM A
INNER JOIN B
    ON A.ID = B.ID;
```

① 가·하나, 나·둘이 모두 나온다.  
② 가·하나만 나온다.  
③ 나·둘만 나온다.  
④ 결과가 없다.

<details>
<summary>정답</summary>

③

`NULL = NULL`은 참이 아니므로 NULL Row끼리는 연결되지 않습니다.

| NAME | VALUE |
| --- | --- |
| 나 | 둘 |

</details>

### 문제 6 · INNER JOIN과 WHERE

#### EMPLOYEE

| EMP_NAME | DEPT_ID | SALARY |
| --- | --- | ---: |
| 직원1 | 10 | 3500 |
| 직원2 | 10 | 2800 |
| 직원3 | 20 | 3200 |

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
INNER JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID
WHERE E.SALARY >= 3000;
```

① 직원1·개발만 나온다.  
② 직원1·개발, 직원2·개발이 나온다.  
③ 직원1·개발, 직원3·인사가 나온다.  
④ 세 직원이 모두 나온다.

<details>
<summary>정답</summary>

③

먼저 DEPT_ID로 INNER JOIN한 뒤 급여가 3000 이상인 Row만 남깁니다.

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원3 | 인사 |

직원2는 급여가 2800이므로 WHERE 조건에서 제외됩니다.

</details>

## INNER JOIN 전체 요약

마지막으로 가장 작은 예시로 정리합니다.

### 입력 Table 1 · A

| ID | NAME |
| --- | --- |
| 1 | 가 |
| 2 | 나 |
| 4 | 라 |

### 입력 Table 2 · B

| ID | VALUE |
| --- | --- |
| 1 | 하나 |
| 2 | 둘 |
| 3 | 셋 |

<pre><code class="language-sql">SELECT
    A.ID,
    A.NAME,
    B.VALUE
FROM A
<span style="background-color:#DFF5E8;">INNER JOIN B
    ON A.ID = B.ID</span>;</code></pre>

### 결과 Table

| ID | NAME | VALUE |
| --- | --- | --- |
| 1 | 가 | 하나 |
| 2 | 나 | 둘 |

```text
A에만 있는 4
→ 제외

B에만 있는 3
→ 제외

양쪽에 있는 1, 2
→ 결과에 포함
```

<blockquote class="prompt-danger">
<p>INNER JOIN 문제는 반드시 입력 Table에서 연결되는 Row를 직접 찾은 뒤 결과 Table을 그려 봅니다.</p>
</blockquote>

## 다음에 이을 글

**LEFT JOIN**입니다.

INNER JOIN과 달리 왼쪽 Table의 Row를 모두 유지하고, 연결되는 오른쪽 Row가 없으면 NULL이 들어가는 과정을 실제 Table로 비교합니다.
