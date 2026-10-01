---
title: LEFT JOIN · 레프트 조인
date: 2026-09-18 21:40:00 +0900
slug: left-join
permalink: /posts/sql-left-outer-join/
categories: [CS, 데이터베이스]
tags: [LEFTJOIN, 레프트조인, OUTERJOIN, JOIN, SQL, 관계형데이터베이스, NULL, 정보처리기사, NCS]
math: true
---

LEFT JOIN은 <mark>왼쪽 Table의 모든 Row를 유지하면서, 오른쪽 Table에서 조건이 맞는 Row를 연결하는 JOIN</mark>입니다.

오른쪽 Table에 연결되는 Row가 없으면 오른쪽 Column에는 `NULL`이 들어갑니다.

<blockquote class="prompt-info">
<p>한 줄: LEFT JOIN은 왼쪽 Table은 전부 살리고, 오른쪽에서 맞는 Row가 없으면 NULL로 채웁니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

왼쪽 Table 전체를 유지하고 오른쪽 Table은 연결되는 경우만 붙입니다.

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

이 글에서는 실제 데이터베이스의 관계를 기준으로 설명하되, LEFT JOIN 결과를 바로 볼 수 있도록 작은 Table로 줄여서 사용합니다.

대표 관계는 다음과 같습니다.

```text
EMPLOYEE.DEPT_ID
→ DEPARTMENT.DEPT_ID
```

```text
ORDERS.CUSTOMER_ID
→ CUSTOMER.CUSTOMER_ID
```

<blockquote class="prompt-info">
<p>모든 핵심 설명과 문제에서 입력 Table과 결과 Table을 함께 확인합니다.</p>
</blockquote>

## LEFT JOIN의 가장 기본적인 예시

먼저 직원과 부서 Table이 있다고 가정합니다.

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

직원은 모두 보고 싶고, 연결되는 부서 이름이 있다면 같이 보고 싶습니다.

<pre><code class="language-sql">SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
<span style="background-color:#DFF5E8;">LEFT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID</span>;</code></pre>

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | 인사 |
| 직원3 | NULL |

직원1과 직원2는 연결되는 부서가 있으므로 부서 이름이 붙습니다.

직원3은 `DEPT_ID`가 `NULL`이라 연결되는 부서가 없지만, 왼쪽 `EMPLOYEE`의 Row이므로 결과에 남습니다.

```text
직원1
→ 연결 성공
→ 개발

직원2
→ 연결 성공
→ 인사

직원3
→ 연결 실패
→ 직원3은 유지
→ 오른쪽 값은 NULL
```

## LEFT JOIN의 핵심

LEFT JOIN은 다음 한 문장으로 기억할 수 있습니다.

<mark>왼쪽 Table의 Row는 모두 유지한다.</mark>

다음 예시를 봅니다.

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

```sql
SELECT
    A.ID,
    A.NAME,
    B.VALUE
FROM A
LEFT JOIN B
    ON A.ID = B.ID;
```

### 결과 Table

| ID | NAME | VALUE |
| --- | --- | --- |
| 1 | 가 | 하나 |
| 2 | 나 | 둘 |
| 4 | 라 | NULL |

`A.ID = 4`는 B에 연결되는 Row가 없습니다.

하지만 A는 왼쪽 Table이므로 결과에 남습니다.

반면 `B.ID = 3`은 오른쪽 Table에만 존재하므로 결과에 나오지 않습니다.

## LEFT JOIN의 기본 문법

기본 구조는 다음과 같습니다.

```sql
SELECT 조회할_Column
FROM 왼쪽_Table
LEFT JOIN 오른쪽_Table
    ON 연결_조건;
```

실제 예시를 봅니다.

### 입력 Table 1 · EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | NULL |

### 입력 Table 2 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |

<pre><code class="language-sql">SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
<span style="background-color:#DFF5E8;">LEFT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID</span>;</code></pre>

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | NULL |

각 요소의 역할은 다음과 같습니다.

| 구문 | 역할 |
| --- | --- |
| FROM EMPLOYEE E | 왼쪽 Table |
| LEFT JOIN DEPARTMENT D | 오른쪽 Table 연결 |
| ON | Row 연결 조건 |
| SELECT | 최종 출력 Column |

## 왜 LEFT라고 부르는가

LEFT JOIN에서 중요한 것은 SQL 문장의 왼쪽에 있는 Table입니다.

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

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
LEFT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

`FROM EMPLOYEE E`가 왼쪽입니다.

따라서 직원1과 직원2가 모두 남습니다.

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | NULL |

오른쪽에만 있는 인사 부서는 결과에 나오지 않습니다.

```text
LEFT JOIN
→ FROM 쪽 Table 전체 유지
```

## OUTER는 생략할 수 있다

`LEFT JOIN`과 `LEFT OUTER JOIN`은 일반적으로 같은 의미입니다.

### 입력 Table 1 · A

| ID | NAME |
| --- | --- |
| 1 | 가 |
| 2 | 나 |

### 입력 Table 2 · B

| ID | VALUE |
| --- | --- |
| 1 | 하나 |

첫 번째 Query입니다.

```sql
SELECT
    A.NAME,
    B.VALUE
FROM A
LEFT JOIN B
    ON A.ID = B.ID;
```

두 번째 Query입니다.

```sql
SELECT
    A.NAME,
    B.VALUE
FROM A
LEFT OUTER JOIN B
    ON A.ID = B.ID;
```

### 두 Query의 결과 Table

| NAME | VALUE |
| --- | --- |
| 가 | 하나 |
| 나 | NULL |

즉, `OUTER`는 생략할 수 있습니다.

<blockquote class="prompt-info">
<p>LEFT JOIN과 LEFT OUTER JOIN은 일반적으로 같은 의미입니다.</p>
</blockquote>

## INNER JOIN과 가장 큰 차이

LEFT JOIN을 이해하려면 INNER JOIN과 비교하는 것이 가장 빠릅니다.

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

차이는 직원2입니다.

```text
INNER JOIN
→ 연결 실패
→ 직원2 제외

LEFT JOIN
→ 연결 실패
→ 직원2 유지
→ 오른쪽 NULL
```

| 구분 | INNER JOIN | LEFT JOIN |
| --- | --- | --- |
| 연결 성공 Row | 포함 | 포함 |
| 왼쪽에만 있는 Row | 제외 | 포함 |
| 연결 실패 시 | Row 제외 | 오른쪽 값 NULL |

## 오른쪽에만 있는 Row는 남지 않는다

LEFT JOIN은 양쪽 Table의 모든 Row를 남기는 JOIN이 아닙니다.

### 입력 Table 1 · EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |

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

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |

인사와 영업은 오른쪽 Table에만 존재합니다.

LEFT JOIN은 왼쪽 EMPLOYEE를 기준으로 하므로 두 부서는 결과에 나오지 않습니다.

<blockquote class="prompt-warning">
<p>LEFT JOIN은 양쪽 전체를 남기는 JOIN이 아닙니다. 왼쪽 Table만 전부 유지합니다.</p>
</blockquote>

## 연결 실패 시 NULL이 들어간다

LEFT JOIN에서는 오른쪽에 연결되는 Row가 없으면 오른쪽 Column이 `NULL`이 됩니다.

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

모든 고객을 보고 주문이 있으면 주문 번호까지 함께 보고 싶습니다.

```sql
SELECT
    C.NAME,
    O.ORDER_ID
FROM CUSTOMER C
LEFT JOIN ORDERS O
    ON C.CUSTOMER_ID = O.CUSTOMER_ID;
```

### 결과 Table

| NAME | ORDER_ID |
| --- | --- |
| 고객1 | 1 |
| 고객1 | 2 |
| 고객2 | 3 |
| 고객3 | NULL |

고객3은 주문이 없습니다.

하지만 CUSTOMER가 왼쪽 Table이므로 고객3은 결과에 남습니다.

주문 정보만 `NULL`이 됩니다.

## 주문이 없는 고객 찾기

LEFT JOIN은 <mark>연결되는 데이터가 없는 Row를 찾는 문제</mark>에서 매우 자주 사용됩니다.

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
| 2 | 102 |

먼저 LEFT JOIN 결과를 봅니다.

```sql
SELECT
    C.CUSTOMER_ID,
    C.NAME,
    O.ORDER_ID
FROM CUSTOMER C
LEFT JOIN ORDERS O
    ON C.CUSTOMER_ID = O.CUSTOMER_ID;
```

### JOIN 직후 결과 Table

| CUSTOMER_ID | NAME | ORDER_ID |
| --- | --- | --- |
| 101 | 고객1 | 1 |
| 102 | 고객2 | 2 |
| 103 | 고객3 | NULL |

주문이 없는 고객은 `ORDER_ID`가 `NULL`입니다.

따라서 다음처럼 찾을 수 있습니다.

<pre><code class="language-sql">SELECT
    C.CUSTOMER_ID,
    C.NAME
FROM CUSTOMER C
LEFT JOIN ORDERS O
    ON C.CUSTOMER_ID = O.CUSTOMER_ID
<span style="background-color:#DFF5E8;">WHERE O.ORDER_ID IS NULL</span>;</code></pre>

### 최종 결과 Table

| CUSTOMER_ID | NAME |
| --- | --- |
| 103 | 고객3 |

이 패턴은 시험과 실무에서 매우 중요합니다.

```text
LEFT JOIN
+
오른쪽 Key IS NULL

→ 연결 상대가 없는 왼쪽 Row 찾기
```

## 직원이 없는 부서 찾기

같은 패턴을 부서와 직원에도 적용할 수 있습니다.

### 입력 Table 1 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |
| 30 | 영업 |

### 입력 Table 2 · EMPLOYEE

| EMP_ID | EMP_NAME | DEPT_ID |
| --- | --- | --- |
| 1001 | 직원1 | 10 |
| 1002 | 직원2 | 20 |

모든 부서를 유지하도록 DEPARTMENT를 왼쪽에 둡니다.

```sql
SELECT
    D.DEPT_NAME,
    E.EMP_NAME
FROM DEPARTMENT D
LEFT JOIN EMPLOYEE E
    ON D.DEPT_ID = E.DEPT_ID;
```

### JOIN 직후 결과 Table

| DEPT_NAME | EMP_NAME |
| --- | --- |
| 개발 | 직원1 |
| 인사 | 직원2 |
| 영업 | NULL |

직원이 없는 부서만 찾습니다.

<pre><code class="language-sql">SELECT
    D.DEPT_NAME
FROM DEPARTMENT D
LEFT JOIN EMPLOYEE E
    ON D.DEPT_ID = E.DEPT_ID
<span style="background-color:#DFF5E8;">WHERE E.EMP_ID IS NULL</span>;</code></pre>

### 최종 결과 Table

| DEPT_NAME |
| --- |
| 영업 |

핵심은 어느 Table을 왼쪽에 둘지입니다.

## 왼쪽 Table 선택이 중요하다

LEFT JOIN은 Table 순서를 바꾸면 결과가 달라질 수 있습니다.

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

먼저 EMPLOYEE를 왼쪽에 둡니다.

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
LEFT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

### 결과 Table 1

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | NULL |

이번에는 DEPARTMENT를 왼쪽에 둡니다.

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM DEPARTMENT D
LEFT JOIN EMPLOYEE E
    ON E.DEPT_ID = D.DEPT_ID;
```

### 결과 Table 2

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| NULL | 인사 |

첫 번째 Query는 모든 직원을 유지합니다.

두 번째 Query는 모든 부서를 유지합니다.

<blockquote class="prompt-warning">
<p>LEFT JOIN에서는 어떤 Table을 FROM에 두느냐가 결과를 결정합니다.</p>
</blockquote>

## 일대다 관계의 LEFT JOIN

LEFT JOIN에서도 하나의 왼쪽 Row가 여러 오른쪽 Row와 연결될 수 있습니다.

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

```sql
SELECT
    C.NAME,
    O.ORDER_ID
FROM CUSTOMER C
LEFT JOIN ORDERS O
    ON C.CUSTOMER_ID = O.CUSTOMER_ID;
```

### 결과 Table

| NAME | ORDER_ID |
| --- | --- |
| 고객1 | 1 |
| 고객1 | 2 |
| 고객2 | 3 |
| 고객3 | NULL |

고객1은 주문이 두 개라 결과도 두 Row입니다.

고객3은 주문이 없지만 왼쪽 CUSTOMER의 Row이므로 한 Row로 남습니다.

```text
고객1
├─ 주문1
└─ 주문2

고객3
└─ 주문 없음
   → NULL
```

## LEFT JOIN 뒤 WHERE가 위험한 이유

LEFT JOIN에서 가장 중요한 시험 함정입니다.

오른쪽 Table의 조건을 `WHERE`에 넣으면 연결되지 않은 Row가 제거될 수 있습니다.

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

먼저 단순 LEFT JOIN입니다.

```sql
SELECT
    D.DEPT_NAME,
    E.EMP_NAME,
    E.SALARY
FROM DEPARTMENT D
LEFT JOIN EMPLOYEE E
    ON D.DEPT_ID = E.DEPT_ID;
```

### 단순 LEFT JOIN 결과 Table

| DEPT_NAME | EMP_NAME | SALARY |
| --- | --- | ---: |
| 개발 | 직원1 | 3500 |
| 개발 | 직원2 | 2500 |
| 인사 | 직원3 | 3200 |
| 영업 | NULL | NULL |

이번에는 `WHERE E.SALARY >= 3000`을 추가합니다.

<pre><code class="language-sql">SELECT
    D.DEPT_NAME,
    E.EMP_NAME,
    E.SALARY
FROM DEPARTMENT D
LEFT JOIN EMPLOYEE E
    ON D.DEPT_ID = E.DEPT_ID
<span style="background-color:#DFF5E8;">WHERE E.SALARY &gt;= 3000</span>;</code></pre>

### WHERE 적용 결과 Table

| DEPT_NAME | EMP_NAME | SALARY |
| --- | --- | ---: |
| 개발 | 직원1 | 3500 |
| 인사 | 직원3 | 3200 |

영업 부서는 LEFT JOIN 직후에는 남아 있었습니다.

하지만 영업의 `E.SALARY`는 `NULL`입니다.

`NULL >= 3000`은 참이 아니므로 WHERE 단계에서 제거됩니다.

즉, LEFT JOIN을 썼더라도 WHERE 때문에 왼쪽 Row가 최종 결과에서 사라질 수 있습니다.

## 조건을 ON에 넣으면 결과가 달라진다

이번에는 급여 조건을 `ON`에 넣습니다.

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

<pre><code class="language-sql">SELECT
    D.DEPT_NAME,
    E.EMP_NAME,
    E.SALARY
FROM DEPARTMENT D
LEFT JOIN EMPLOYEE E
    <span style="background-color:#DFF5E8;">ON D.DEPT_ID = E.DEPT_ID
   AND E.SALARY &gt;= 3000</span>;</code></pre>

### 결과 Table

| DEPT_NAME | EMP_NAME | SALARY |
| --- | --- | ---: |
| 개발 | 직원1 | 3500 |
| 인사 | 직원3 | 3200 |
| 영업 | NULL | NULL |

영업 부서가 남아 있습니다.

이유는 급여 조건이 JOIN 과정에서 오른쪽 Row를 고르는 조건으로 사용되었기 때문입니다.

```text
ON에 조건
→ 어떤 오른쪽 Row를 붙일지 결정
→ 왼쪽 Row는 유지

WHERE에 조건
→ JOIN 후 최종 Row를 다시 필터링
→ 왼쪽 Row도 제거될 수 있음
```

## ON과 WHERE 비교

같은 입력 Table을 기준으로 두 결과를 직접 비교합니다.

### 입력 Table 1

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |
| 30 | 영업 |

### 입력 Table 2

| EMP_NAME | DEPT_ID | SALARY |
| --- | --- | ---: |
| 직원1 | 10 | 3500 |
| 직원2 | 10 | 2500 |
| 직원3 | 20 | 3200 |

### 조건을 ON에 넣은 결과

| DEPT_NAME | EMP_NAME | SALARY |
| --- | --- | ---: |
| 개발 | 직원1 | 3500 |
| 인사 | 직원3 | 3200 |
| 영업 | NULL | NULL |

### 조건을 WHERE에 넣은 결과

| DEPT_NAME | EMP_NAME | SALARY |
| --- | --- | ---: |
| 개발 | 직원1 | 3500 |
| 인사 | 직원3 | 3200 |

<blockquote class="prompt-danger">
<p>LEFT JOIN에서 오른쪽 Table 조건을 WHERE에 넣으면 NULL Row가 제거될 수 있다는 점을 반드시 기억합니다.</p>
</blockquote>

## NULL을 찾을 때는 IS NULL

LEFT JOIN 결과에서 연결되지 않은 Row를 찾을 때는 `= NULL`이 아니라 `IS NULL`을 사용합니다.

### 입력 Table 1 · CUSTOMER

| CUSTOMER_ID | NAME |
| --- | --- |
| 101 | 고객1 |
| 102 | 고객2 |

### 입력 Table 2 · ORDERS

| ORDER_ID | CUSTOMER_ID |
| --- | --- |
| 1 | 101 |

LEFT JOIN 결과는 다음과 같습니다.

| NAME | ORDER_ID |
| --- | --- |
| 고객1 | 1 |
| 고객2 | NULL |

잘못된 조건입니다.

```sql
WHERE O.ORDER_ID = NULL
```

올바른 조건입니다.

```sql
WHERE O.ORDER_ID IS NULL
```

### 올바른 Query의 결과 Table

| NAME |
| --- |
| 고객2 |

NULL 비교에는 `IS NULL`을 사용해야 합니다.

## 여러 Table과 LEFT JOIN

LEFT JOIN도 여러 Table을 연속해서 연결할 수 있습니다.

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

모든 고객을 유지하면서 주문 상품을 조회한다고 가정합니다.

```sql
SELECT
    C.NAME,
    O.ORDER_ID,
    P.PRODUCT_NAME,
    OI.QTY
FROM CUSTOMER C
LEFT JOIN ORDERS O
    ON C.CUSTOMER_ID = O.CUSTOMER_ID
LEFT JOIN ORDER_ITEM OI
    ON O.ORDER_ID = OI.ORDER_ID
LEFT JOIN PRODUCT P
    ON OI.PRODUCT_ID = P.PRODUCT_ID;
```

### 결과 Table

| NAME | ORDER_ID | PRODUCT_NAME | QTY |
| --- | --- | --- | ---: |
| 고객1 | 1 | 키보드 | 2 |
| 고객2 | 2 | 마우스 | 1 |
| 고객3 | NULL | NULL | NULL |

고객3은 주문이 없어도 CUSTOMER가 가장 왼쪽에 있으므로 결과에 남습니다.

## LEFT JOIN과 RIGHT JOIN의 관계

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

다음 RIGHT JOIN을 봅니다.

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

Table 순서를 바꾸고 LEFT JOIN을 사용합니다.

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

두 Query는 같은 결과를 만들 수 있습니다.

## LEFT JOIN과 FULL OUTER JOIN 비교

LEFT JOIN은 왼쪽만 전부 유지합니다.

FULL OUTER JOIN은 양쪽을 모두 유지합니다.

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

LEFT JOIN 결과입니다.

```sql
SELECT *
FROM A
LEFT JOIN B
    ON A.ID = B.ID;
```

### LEFT JOIN 결과 Table

| A.ID | NAME | B.ID | VALUE |
| --- | --- | --- | --- |
| 1 | 가 | 1 | 하나 |
| 2 | 나 | NULL | NULL |

FULL OUTER JOIN 결과입니다.

```sql
SELECT *
FROM A
FULL OUTER JOIN B
    ON A.ID = B.ID;
```

### FULL OUTER JOIN 결과 Table

| A.ID | NAME | B.ID | VALUE |
| --- | --- | --- | --- |
| 1 | 가 | 1 | 하나 |
| 2 | 나 | NULL | NULL |
| NULL | NULL | 3 | 셋 |

차이는 오른쪽에만 존재하는 `B.ID = 3`입니다.

## LEFT JOIN과 CROSS JOIN 비교

LEFT JOIN은 연결 조건을 기준으로 Row를 연결합니다.

CROSS JOIN은 모든 조합을 만듭니다.

### 입력 Table 1 · A

| ID | NAME |
| --- | --- |
| 1 | 가 |
| 2 | 나 |

### 입력 Table 2 · B

| ID | VALUE |
| --- | --- |
| 1 | 하나 |

LEFT JOIN입니다.

```sql
SELECT
    A.NAME,
    B.VALUE
FROM A
LEFT JOIN B
    ON A.ID = B.ID;
```

### LEFT JOIN 결과 Table

| NAME | VALUE |
| --- | --- |
| 가 | 하나 |
| 나 | NULL |

CROSS JOIN입니다.

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
| 나 | 하나 |

LEFT JOIN은 연결 조건을 사용하고, CROSS JOIN은 모든 조합을 만듭니다.

## 실제 문제 풀이 1 · 모든 고객과 주문

모든 고객을 조회하되 주문이 있다면 주문 번호도 함께 보여 줍니다.

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
| 2 | 102 |

모든 고객을 유지해야 하므로 CUSTOMER를 왼쪽에 둡니다.

<pre><code class="language-sql">SELECT
    C.NAME,
    O.ORDER_ID
FROM CUSTOMER C
<span style="background-color:#DFF5E8;">LEFT JOIN ORDERS O
    ON C.CUSTOMER_ID = O.CUSTOMER_ID</span>;</code></pre>

### 결과 Table

| NAME | ORDER_ID |
| --- | --- |
| 고객1 | 1 |
| 고객2 | 2 |
| 고객3 | NULL |

고객3은 주문이 없어도 결과에 남습니다.

## 실제 문제 풀이 2 · 주문이 없는 고객

앞의 결과에서 주문이 없는 고객만 찾습니다.

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
| 2 | 102 |

<pre><code class="language-sql">SELECT
    C.NAME
FROM CUSTOMER C
LEFT JOIN ORDERS O
    ON C.CUSTOMER_ID = O.CUSTOMER_ID
<span style="background-color:#DFF5E8;">WHERE O.ORDER_ID IS NULL</span>;</code></pre>

### 결과 Table

| NAME |
| --- |
| 고객3 |

이 패턴은 LEFT JOIN의 대표 활용입니다.

## 실제 문제 풀이 3 · 모든 부서와 직원

모든 부서를 조회하되 직원이 있다면 직원 이름을 보여 줍니다.

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
| 인사 | 직원3 |
| 영업 | NULL |

개발 부서는 직원이 두 명이라 두 Row가 만들어집니다.

영업 부서는 직원이 없어도 왼쪽 Row이므로 남습니다.

## 실제 문제 풀이 4 · 조건이 있는 LEFT JOIN

모든 부서를 유지하면서 급여 3000 이상 직원만 연결합니다.

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

<pre><code class="language-sql">SELECT
    D.DEPT_NAME,
    E.EMP_NAME,
    E.SALARY
FROM DEPARTMENT D
LEFT JOIN EMPLOYEE E
    <span style="background-color:#DFF5E8;">ON D.DEPT_ID = E.DEPT_ID
   AND E.SALARY &gt;= 3000</span>;</code></pre>

### 결과 Table

| DEPT_NAME | EMP_NAME | SALARY |
| --- | --- | ---: |
| 개발 | 직원1 | 3500 |
| 인사 | 직원3 | 3200 |
| 영업 | NULL | NULL |

급여 조건을 ON에 두었기 때문에 영업 부서는 유지됩니다.

## LEFT JOIN 문제 풀이 순서

LEFT JOIN 문제에서는 먼저 무엇을 반드시 남길지 찾습니다.

### 문제 상황

모든 고객을 조회하고 주문이 있다면 주문 정보도 보여 주라고 합니다.

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
| 2 | 102 |

첫째, 반드시 남길 대상을 찾습니다.

```text
모든 고객
→ CUSTOMER를 왼쪽에 둔다
```

둘째, 연결 Column을 찾습니다.

```text
CUSTOMER.CUSTOMER_ID
=
ORDERS.CUSTOMER_ID
```

셋째, Query를 작성합니다.

```sql
SELECT
    C.NAME,
    O.ORDER_ID
FROM CUSTOMER C
LEFT JOIN ORDERS O
    ON C.CUSTOMER_ID = O.CUSTOMER_ID;
```

### 결과 Table

| NAME | ORDER_ID |
| --- | --- |
| 고객1 | 1 |
| 고객2 | 2 |
| 고객3 | NULL |

핵심은 문제 문장의 `모든 고객`입니다.

## 잘 놓치는 핵심

### 1. 왼쪽 Table은 모두 유지된다

#### 입력 Table 1

| A.ID | A.NAME |
| --- | --- |
| 1 | 가 |
| 2 | 나 |

#### 입력 Table 2

| B.ID | B.VALUE |
| --- | --- |
| 1 | 하나 |

```sql
SELECT
    A.NAME,
    B.VALUE
FROM A
LEFT JOIN B
    ON A.ID = B.ID;
```

#### 결과 Table

| NAME | VALUE |
| --- | --- |
| 가 | 하나 |
| 나 | NULL |

A의 `ID = 2`는 연결 상대가 없어도 남습니다.

### 2. 오른쪽에만 있는 Row는 제외된다

#### 입력 Table 1

| A.ID |
| --- |
| 1 |

#### 입력 Table 2

| B.ID |
| --- |
| 1 |
| 2 |

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

`B.ID = 2`는 오른쪽에만 있으므로 나오지 않습니다.

### 3. 연결 실패 시 오른쪽 값이 NULL이 된다

#### 입력 Table 1

| CUSTOMER_ID | NAME |
| --- | --- |
| 1 | 고객1 |
| 2 | 고객2 |

#### 입력 Table 2

| ORDER_ID | CUSTOMER_ID |
| --- | --- |
| 10 | 1 |

```sql
SELECT
    C.NAME,
    O.ORDER_ID
FROM CUSTOMER C
LEFT JOIN ORDERS O
    ON C.CUSTOMER_ID = O.CUSTOMER_ID;
```

#### 결과 Table

| NAME | ORDER_ID |
| --- | --- |
| 고객1 | 10 |
| 고객2 | NULL |

### 4. WHERE 때문에 왼쪽 Row가 사라질 수 있다

#### 입력 Table 1

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |

#### 입력 Table 2

| EMP_NAME | DEPT_ID | SALARY |
| --- | --- | ---: |
| 직원1 | 10 | 3500 |

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

#### 결과 Table

| DEPT_NAME | EMP_NAME |
| --- | --- |
| 개발 | 직원1 |

인사는 LEFT JOIN 직후에는 존재하지만 WHERE에서 제거됩니다.

### 5. 연결되지 않은 Row를 찾을 때 자주 사용한다

#### 입력 Table 1

| CUSTOMER_ID | NAME |
| --- | --- |
| 1 | 고객1 |
| 2 | 고객2 |

#### 입력 Table 2

| ORDER_ID | CUSTOMER_ID |
| --- | --- |
| 10 | 1 |

```sql
SELECT
    C.NAME
FROM CUSTOMER C
LEFT JOIN ORDERS O
    ON C.CUSTOMER_ID = O.CUSTOMER_ID
WHERE O.ORDER_ID IS NULL;
```

#### 결과 Table

| NAME |
| --- |
| 고객2 |

```text
LEFT JOIN
+
오른쪽 Key IS NULL

→ 연결되지 않은 왼쪽 Row
```

## 시험·면접

### 핵심 암기

```text
LEFT JOIN
→ 왼쪽 전체 유지
```

```text
오른쪽 연결 성공
→ 값 연결
```

```text
오른쪽 연결 실패
→ 오른쪽 Column NULL
```

```text
오른쪽에만 존재
→ 결과 제외
```

```text
LEFT JOIN + 오른쪽 Key IS NULL
→ 연결되지 않은 왼쪽 Row 찾기
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
LEFT JOIN B
    ON A.ID = B.ID;
```

#### 결과 Table

| ID | NAME | VALUE |
| --- | --- | --- |
| 1 | 가 | 하나 |
| 2 | 나 | 둘 |
| 4 | 라 | NULL |

왼쪽 A의 `1`, `2`, `4`가 모두 남습니다.

오른쪽에만 있는 `B.ID = 3`은 나오지 않습니다.

### 자주 나오는 문장

<mark>LEFT JOIN은 왼쪽 Table의 모든 Row를 유지합니다.</mark>

<mark>오른쪽 Table에 연결되는 Row가 없으면 오른쪽 Column이 NULL이 될 수 있습니다.</mark>

<mark>LEFT JOIN과 LEFT OUTER JOIN은 일반적으로 같은 의미입니다.</mark>

<mark>LEFT JOIN 뒤 WHERE 조건에 따라 왼쪽 Row가 최종 결과에서 제거될 수 있습니다.</mark>

### 시험 함정 1 · LEFT JOIN은 양쪽 전체가 아니다

#### 입력 Table

| A.ID |
| --- |
| 1 |

| B.ID |
| --- |
| 1 |
| 2 |

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

`B.ID = 2`는 오른쪽에만 있으므로 나오지 않습니다.

### 시험 함정 2 · WHERE가 LEFT JOIN 효과를 약하게 만들 수 있다

#### 입력 Table

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |

| EMP_NAME | DEPT_ID | SALARY |
| --- | --- | ---: |
| 직원1 | 10 | 3500 |

```sql
SELECT
    D.DEPT_NAME,
    E.EMP_NAME
FROM DEPARTMENT D
LEFT JOIN EMPLOYEE E
    ON D.DEPT_ID = E.DEPT_ID
WHERE E.SALARY >= 3000;
```

#### 결과 Table

| DEPT_NAME | EMP_NAME |
| --- | --- |
| 개발 | 직원1 |

인사는 LEFT JOIN 직후에는 존재하지만 WHERE 조건에서 제거됩니다.

### 면접 짧은 답변

LEFT JOIN은 왼쪽 Table의 모든 Row를 유지하면서 오른쪽 Table에서 JOIN 조건을 만족하는 Row를 연결하는 방식입니다. 오른쪽에 연결되는 Row가 없으면 오른쪽 Column은 NULL이 되며, 연결되지 않은 데이터를 찾을 때 `LEFT JOIN`과 `IS NULL` 조합을 자주 사용합니다.

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
④ 직원1·개발, 직원2·NULL, NULL·인사가 모두 나온다.

<details>
<summary>정답</summary>

②

왼쪽 EMPLOYEE의 Row는 모두 남습니다.

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | NULL |

직원2는 연결 부서가 없으므로 오른쪽 값이 NULL입니다.

</details>

### 문제 2 · 오른쪽에만 있는 Row

#### A

| ID | NAME |
| --- | --- |
| 1 | 가 |

#### B

| ID | VALUE |
| --- | --- |
| 1 | 하나 |
| 2 | 둘 |

다음 Query의 결과는 무엇인가?

```sql
SELECT
    A.NAME,
    B.VALUE
FROM A
LEFT JOIN B
    ON A.ID = B.ID;
```

① 가·하나만 나온다.  
② 가·하나, 가·둘이 나온다.  
③ NULL·둘만 나온다.  
④ 두 Row 모두 NULL이 나온다.

<details>
<summary>정답</summary>

①

오른쪽에만 있는 `B.ID = 2`는 LEFT JOIN 결과에 포함되지 않습니다.

| NAME | VALUE |
| --- | --- |
| 가 | 하나 |

</details>

### 문제 3 · 주문이 없는 고객

#### CUSTOMER

| CUSTOMER_ID | NAME |
| --- | --- |
| 1 | 고객1 |
| 2 | 고객2 |
| 3 | 고객3 |

#### ORDERS

| ORDER_ID | CUSTOMER_ID |
| --- | --- |
| 10 | 1 |
| 11 | 2 |

다음 Query의 결과는 무엇인가?

```sql
SELECT
    C.NAME
FROM CUSTOMER C
LEFT JOIN ORDERS O
    ON C.CUSTOMER_ID = O.CUSTOMER_ID
WHERE O.ORDER_ID IS NULL;
```

① 고객1  
② 고객2  
③ 고객3  
④ 고객1, 고객2

<details>
<summary>정답</summary>

③

LEFT JOIN 결과에서 주문이 없는 고객3의 `ORDER_ID`만 NULL입니다.

| NAME |
| --- |
| 고객3 |

</details>

### 문제 4 · LEFT JOIN과 WHERE

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

개발의 직원1만 급여 조건을 만족합니다.

인사의 직원2는 2500이라 제거됩니다.

영업은 직원이 없어 SALARY가 NULL이므로 WHERE에서 제거됩니다.

| DEPT_NAME | EMP_NAME |
| --- | --- |
| 개발 | 직원1 |

</details>

### 문제 5 · ON에 조건을 넣은 경우

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
   AND E.SALARY >= 3000;
```

① 개발·직원1만 나온다.  
② 개발·직원1, 인사·NULL, 영업·NULL이 나온다.  
③ 개발·직원1, 인사·직원2가 나온다.  
④ 영업만 나온다.

<details>
<summary>정답</summary>

②

급여 조건이 ON에 있으므로 오른쪽에서 연결할 직원을 제한합니다.

왼쪽 DEPARTMENT의 개발, 인사, 영업은 모두 유지됩니다.

| DEPT_NAME | EMP_NAME |
| --- | --- |
| 개발 | 직원1 |
| 인사 | NULL |
| 영업 | NULL |

</details>

### 문제 6 · Table 순서

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
FROM DEPARTMENT D
LEFT JOIN EMPLOYEE E
    ON E.DEPT_ID = D.DEPT_ID;
```

① 직원1·개발, 직원2·NULL이 나온다.  
② 직원1·개발, NULL·인사가 나온다.  
③ 직원1·개발만 나온다.  
④ 직원2·NULL만 나온다.

<details>
<summary>정답</summary>

②

이번에는 DEPARTMENT가 왼쪽 Table입니다.

따라서 개발과 인사가 모두 남습니다.

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| NULL | 인사 |

직원2는 EMPLOYEE에만 있고 연결되는 부서가 없으므로 결과에 나오지 않습니다.

</details>

## LEFT JOIN 전체 요약

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
<span style="background-color:#DFF5E8;">LEFT JOIN B
    ON A.ID = B.ID</span>;</code></pre>

### 결과 Table

| ID | NAME | VALUE |
| --- | --- | --- |
| 1 | 가 | 하나 |
| 2 | 나 | 둘 |
| 4 | 라 | NULL |

```text
A.ID = 1
→ 연결 성공
→ 하나

A.ID = 2
→ 연결 성공
→ 둘

A.ID = 4
→ 연결 실패
→ A Row 유지
→ B 값 NULL

B.ID = 3
→ 오른쪽에만 존재
→ 결과 제외
```

<blockquote class="prompt-danger">
<p>LEFT JOIN 문제는 무엇을 반드시 남겨야 하는지 먼저 찾고, 그 Table을 왼쪽에 둡니다.</p>
</blockquote>

## 다음에 이을 글

**RIGHT JOIN**입니다.

LEFT JOIN의 방향을 반대로 생각하여 오른쪽 Table의 모든 Row를 유지하는 구조를 실제 입력 Table과 결과 Table로 비교합니다.
