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

왼쪽 Table에 연결되는 Row가 없으면 왼쪽 Column에는 `NULL`이 들어갑니다.

<blockquote class="prompt-info">
<p>한 줄: RIGHT JOIN은 오른쪽 Table은 전부 살리고, 왼쪽에서 맞는 Row가 없으면 NULL로 채웁니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

오른쪽 Table 전체를 유지하고 왼쪽 Table은 연결되는 경우만 붙입니다.

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

이 글에서는 실제 데이터베이스의 관계를 기준으로 설명하되, RIGHT JOIN 결과를 바로 볼 수 있도록 작은 Table로 줄여서 사용합니다.

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

## RIGHT JOIN의 가장 기본적인 예시

먼저 직원과 부서 Table이 있다고 가정합니다.

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

모든 부서를 보고 싶고, 연결되는 직원이 있다면 같이 보고 싶습니다.

<pre><code class="language-sql">SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
<span style="background-color:#DFF5E8;">RIGHT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID</span>;</code></pre>

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | 인사 |
| NULL | 영업 |

개발과 인사는 연결되는 직원이 있습니다.

영업은 연결되는 직원이 없지만 오른쪽 `DEPARTMENT`의 Row이므로 결과에 남습니다.

```text
개발
→ 연결 성공
→ 직원1

인사
→ 연결 성공
→ 직원2

영업
→ 연결 실패
→ 영업은 유지
→ 왼쪽 값은 NULL
```

## RIGHT JOIN의 핵심

RIGHT JOIN은 다음 한 문장으로 기억할 수 있습니다.

<mark>오른쪽 Table의 Row는 모두 유지한다.</mark>

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
    A.NAME,
    B.ID,
    B.VALUE
FROM A
RIGHT JOIN B
    ON A.ID = B.ID;
```

### 결과 Table

| NAME | B.ID | VALUE |
| --- | --- | --- |
| 가 | 1 | 하나 |
| 나 | 2 | 둘 |
| NULL | 3 | 셋 |

`B.ID = 3`은 A에 연결되는 Row가 없습니다.

하지만 B는 오른쪽 Table이므로 결과에 남습니다.

반면 `A.ID = 4`는 왼쪽에만 있으므로 결과에 나오지 않습니다.

## RIGHT JOIN의 기본 문법

기본 구조는 다음과 같습니다.

```sql
SELECT 조회할_Column
FROM 왼쪽_Table
RIGHT JOIN 오른쪽_Table
    ON 연결_조건;
```

### 입력 Table 1 · EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |

### 입력 Table 2 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |

<pre><code class="language-sql">SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
<span style="background-color:#DFF5E8;">RIGHT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID</span>;</code></pre>

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| NULL | 인사 |

각 요소의 역할은 다음과 같습니다.

| 구문 | 역할 |
| --- | --- |
| FROM EMPLOYEE E | 왼쪽 Table |
| RIGHT JOIN DEPARTMENT D | 오른쪽 Table |
| ON | Row 연결 조건 |
| SELECT | 최종 출력 Column |

## 왜 RIGHT라고 부르는가

RIGHT JOIN에서 중요한 것은 SQL 문장의 오른쪽에 있는 Table입니다.

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

`RIGHT JOIN DEPARTMENT D`의 `DEPARTMENT`가 오른쪽 Table입니다.

따라서 개발과 인사가 모두 남습니다.

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| NULL | 인사 |

왼쪽에만 있는 Row가 있다면 결과에 남지 않습니다.

```text
RIGHT JOIN
→ JOIN 뒤쪽 Table 전체 유지
```

## OUTER는 생략할 수 있다

`RIGHT JOIN`과 `RIGHT OUTER JOIN`은 일반적으로 같은 의미입니다.

### 입력 Table 1 · A

| ID | NAME |
| --- | --- |
| 1 | 가 |

### 입력 Table 2 · B

| ID | VALUE |
| --- | --- |
| 1 | 하나 |
| 2 | 둘 |

첫 번째 Query입니다.

```sql
SELECT
    A.NAME,
    B.VALUE
FROM A
RIGHT JOIN B
    ON A.ID = B.ID;
```

두 번째 Query입니다.

```sql
SELECT
    A.NAME,
    B.VALUE
FROM A
RIGHT OUTER JOIN B
    ON A.ID = B.ID;
```

### 두 Query의 결과 Table

| NAME | VALUE |
| --- | --- |
| 가 | 하나 |
| NULL | 둘 |

즉, `OUTER`는 생략할 수 있습니다.

<blockquote class="prompt-info">
<p>RIGHT JOIN과 RIGHT OUTER JOIN은 일반적으로 같은 의미입니다.</p>
</blockquote>

## INNER JOIN과 가장 큰 차이

RIGHT JOIN을 이해하려면 INNER JOIN과 비교하는 것이 가장 빠릅니다.

### 입력 Table 1 · EMPLOYEE

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |

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

이번에는 RIGHT JOIN입니다.

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
RIGHT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

### RIGHT JOIN 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| NULL | 인사 |

차이는 인사 부서입니다.

```text
INNER JOIN
→ 연결 실패
→ 인사 제외

RIGHT JOIN
→ 연결 실패
→ 인사 유지
→ 왼쪽 NULL
```

| 구분 | INNER JOIN | RIGHT JOIN |
| --- | --- | --- |
| 연결 성공 Row | 포함 | 포함 |
| 오른쪽에만 있는 Row | 제외 | 포함 |
| 연결 실패 시 | Row 제외 | 왼쪽 값 NULL |

## 왼쪽에만 있는 Row는 남지 않는다

RIGHT JOIN은 양쪽 Table의 모든 Row를 남기는 JOIN이 아닙니다.

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

직원2는 왼쪽 Table에만 있고 연결되는 부서가 없습니다.

RIGHT JOIN은 오른쪽 DEPARTMENT를 기준으로 하므로 직원2는 결과에 나오지 않습니다.

<blockquote class="prompt-warning">
<p>RIGHT JOIN은 양쪽 전체를 남기는 JOIN이 아닙니다. 오른쪽 Table만 전부 유지합니다.</p>
</blockquote>

## 연결 실패 시 NULL이 들어간다

RIGHT JOIN에서는 왼쪽에 연결되는 Row가 없으면 왼쪽 Column이 `NULL`이 됩니다.

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
    E.EMP_ID,
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
RIGHT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

### 결과 Table

| EMP_ID | EMP_NAME | DEPT_NAME |
| --- | --- | --- |
| 1001 | 직원1 | 개발 |
| 1002 | 직원2 | 인사 |
| NULL | NULL | 영업 |

영업 부서는 존재하지만 연결되는 직원이 없습니다.

따라서 직원 쪽 Column만 `NULL`이 됩니다.

## 직원이 없는 부서 찾기

RIGHT JOIN은 오른쪽 Table을 모두 유지하므로 연결 상대가 없는 오른쪽 Row를 찾을 수 있습니다.

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

먼저 RIGHT JOIN 결과입니다.

```sql
SELECT
    E.EMP_ID,
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
RIGHT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

### JOIN 직후 결과 Table

| EMP_ID | EMP_NAME | DEPT_NAME |
| --- | --- | --- |
| 1001 | 직원1 | 개발 |
| 1002 | 직원2 | 인사 |
| NULL | NULL | 영업 |

직원이 없는 부서는 왼쪽 직원 정보가 `NULL`입니다.

따라서 다음처럼 찾을 수 있습니다.

<pre><code class="language-sql">SELECT
    D.DEPT_NAME
FROM EMPLOYEE E
RIGHT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID
<span style="background-color:#DFF5E8;">WHERE E.EMP_ID IS NULL</span>;</code></pre>

### 최종 결과 Table

| DEPT_NAME |
| --- |
| 영업 |

```text
RIGHT JOIN
+
왼쪽 Key IS NULL

→ 연결 상대가 없는 오른쪽 Row 찾기
```

## RIGHT JOIN에서 Table 순서가 중요하다

RIGHT JOIN은 어느 Table을 오른쪽에 두느냐에 따라 결과가 달라집니다.

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

EMPLOYEE를 왼쪽, DEPARTMENT를 오른쪽에 둡니다.

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
RIGHT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

### 결과 Table 1

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| NULL | 인사 |

이번에는 순서를 바꿉니다.

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM DEPARTMENT D
RIGHT JOIN EMPLOYEE E
    ON E.DEPT_ID = D.DEPT_ID;
```

### 결과 Table 2

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | NULL |

첫 번째 Query는 모든 부서를 유지합니다.

두 번째 Query는 모든 직원을 유지합니다.

<blockquote class="prompt-warning">
<p>RIGHT JOIN에서는 어떤 Table을 JOIN 뒤쪽에 두느냐가 결과를 결정합니다.</p>
</blockquote>

## LEFT JOIN으로 바꿔 쓸 수 있다

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

RIGHT JOIN입니다.

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
RIGHT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

### RIGHT JOIN 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| NULL | 인사 |

Table 순서를 바꾸고 LEFT JOIN으로 작성합니다.

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM DEPARTMENT D
LEFT JOIN EMPLOYEE E
    ON E.DEPT_ID = D.DEPT_ID;
```

### LEFT JOIN 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| NULL | 인사 |

결과는 같습니다.

```text
A RIGHT JOIN B
≈
B LEFT JOIN A
```

이 관계를 알고 있으면 RIGHT JOIN이 헷갈릴 때 LEFT JOIN으로 바꾸어 생각할 수 있습니다.

## 일대다 관계의 RIGHT JOIN

RIGHT JOIN에서도 하나의 오른쪽 Row가 여러 왼쪽 Row와 연결될 수 있습니다.

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
| 직원2 | 개발 |
| 직원3 | 인사 |
| NULL | 영업 |

개발 부서 한 Row가 직원1과 직원2 두 Row에 연결됩니다.

따라서 오른쪽 Table의 Row를 모두 유지한다고 해서 결과 Row 수가 오른쪽 Table의 Row 수와 항상 같은 것은 아닙니다.

```text
개발
├─ 직원1
└─ 직원2

영업
└─ 직원 없음
   → NULL
```

## RIGHT JOIN 뒤 WHERE가 위험한 이유

RIGHT JOIN에서도 보존되는 오른쪽 Row가 WHERE 조건 때문에 사라질 수 있습니다.

### 입력 Table 1 · EMPLOYEE

| EMP_NAME | DEPT_ID | SALARY |
| --- | --- | ---: |
| 직원1 | 10 | 3500 |
| 직원2 | 10 | 2500 |
| 직원3 | 20 | 3200 |

### 입력 Table 2 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |
| 30 | 영업 |

먼저 단순 RIGHT JOIN입니다.

```sql
SELECT
    E.EMP_NAME,
    E.SALARY,
    D.DEPT_NAME
FROM EMPLOYEE E
RIGHT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

### 단순 RIGHT JOIN 결과 Table

| EMP_NAME | SALARY | DEPT_NAME |
| --- | ---: | --- |
| 직원1 | 3500 | 개발 |
| 직원2 | 2500 | 개발 |
| 직원3 | 3200 | 인사 |
| NULL | NULL | 영업 |

이번에는 `WHERE E.SALARY >= 3000`을 추가합니다.

<pre><code class="language-sql">SELECT
    E.EMP_NAME,
    E.SALARY,
    D.DEPT_NAME
FROM EMPLOYEE E
RIGHT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID
<span style="background-color:#DFF5E8;">WHERE E.SALARY &gt;= 3000</span>;</code></pre>

### WHERE 적용 결과 Table

| EMP_NAME | SALARY | DEPT_NAME |
| --- | ---: | --- |
| 직원1 | 3500 | 개발 |
| 직원3 | 3200 | 인사 |

영업 부서는 RIGHT JOIN 직후에는 존재했습니다.

하지만 영업의 `E.SALARY`는 `NULL`입니다.

`NULL >= 3000`은 참이 아니므로 WHERE 단계에서 제거됩니다.

## 조건을 ON에 넣으면 결과가 달라진다

이번에는 급여 조건을 `ON`에 넣습니다.

### 입력 Table 1 · EMPLOYEE

| EMP_NAME | DEPT_ID | SALARY |
| --- | --- | ---: |
| 직원1 | 10 | 3500 |
| 직원2 | 10 | 2500 |
| 직원3 | 20 | 3200 |

### 입력 Table 2 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |
| 30 | 영업 |

<pre><code class="language-sql">SELECT
    E.EMP_NAME,
    E.SALARY,
    D.DEPT_NAME
FROM EMPLOYEE E
RIGHT JOIN DEPARTMENT D
    <span style="background-color:#DFF5E8;">ON E.DEPT_ID = D.DEPT_ID
   AND E.SALARY &gt;= 3000</span>;</code></pre>

### 결과 Table

| EMP_NAME | SALARY | DEPT_NAME |
| --- | ---: | --- |
| 직원1 | 3500 | 개발 |
| 직원3 | 3200 | 인사 |
| NULL | NULL | 영업 |

영업 부서가 남아 있습니다.

급여 조건이 오른쪽 Row 자체를 제거하는 WHERE가 아니라, 어떤 왼쪽 직원을 연결할지 정하는 ON 조건에 들어갔기 때문입니다.

```text
ON에 조건
→ 어떤 왼쪽 Row를 붙일지 결정
→ 오른쪽 Row는 유지

WHERE에 조건
→ JOIN 후 최종 Row를 다시 필터링
→ 오른쪽 Row도 제거될 수 있음
```

## ON과 WHERE 비교

같은 입력 Table을 기준으로 결과를 직접 비교합니다.

### 입력 Table 1

| EMP_NAME | DEPT_ID | SALARY |
| --- | --- | ---: |
| 직원1 | 10 | 3500 |
| 직원2 | 10 | 2500 |
| 직원3 | 20 | 3200 |

### 입력 Table 2

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |
| 30 | 영업 |

### 조건을 ON에 넣은 결과

| EMP_NAME | SALARY | DEPT_NAME |
| --- | ---: | --- |
| 직원1 | 3500 | 개발 |
| 직원3 | 3200 | 인사 |
| NULL | NULL | 영업 |

### 조건을 WHERE에 넣은 결과

| EMP_NAME | SALARY | DEPT_NAME |
| --- | ---: | --- |
| 직원1 | 3500 | 개발 |
| 직원3 | 3200 | 인사 |

<blockquote class="prompt-danger">
<p>RIGHT JOIN에서 왼쪽 Table 조건을 WHERE에 넣으면 NULL Row가 제거되어 오른쪽 Row가 최종 결과에서 사라질 수 있습니다.</p>
</blockquote>

## NULL을 찾을 때는 IS NULL

RIGHT JOIN 결과에서 연결되지 않은 오른쪽 Row를 찾을 때는 `= NULL`이 아니라 `IS NULL`을 사용합니다.

### 입력 Table 1 · EMPLOYEE

| EMP_ID | EMP_NAME | DEPT_ID |
| --- | --- | --- |
| 1 | 직원1 | 10 |

### 입력 Table 2 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |

RIGHT JOIN 결과는 다음과 같습니다.

| EMP_ID | EMP_NAME | DEPT_NAME |
| --- | --- | --- |
| 1 | 직원1 | 개발 |
| NULL | NULL | 인사 |

잘못된 조건입니다.

```sql
WHERE E.EMP_ID = NULL
```

올바른 조건입니다.

```sql
WHERE E.EMP_ID IS NULL
```

### 올바른 Query 결과 Table

| DEPT_NAME |
| --- |
| 인사 |

NULL 비교에는 `IS NULL`을 사용해야 합니다.

## 여러 Table과 RIGHT JOIN

RIGHT JOIN도 여러 Table과 함께 사용할 수 있지만, 방향이 많아지면 읽기가 어려워질 수 있습니다.

간단한 예시를 봅니다.

### 입력 Table 1 · ORDER_ITEM

| ORDER_ID | PRODUCT_ID |
| --- | --- |
| 1 | 501 |

### 입력 Table 2 · PRODUCT

| PRODUCT_ID | PRODUCT_NAME |
| --- | --- |
| 501 | 키보드 |
| 502 | 마우스 |

모든 상품을 유지하면서 주문된 상품이면 주문 번호까지 표시합니다.

```sql
SELECT
    OI.ORDER_ID,
    P.PRODUCT_NAME
FROM ORDER_ITEM OI
RIGHT JOIN PRODUCT P
    ON OI.PRODUCT_ID = P.PRODUCT_ID;
```

### 결과 Table

| ORDER_ID | PRODUCT_NAME |
| --- | --- |
| 1 | 키보드 |
| NULL | 마우스 |

마우스는 주문되지 않았지만 오른쪽 PRODUCT의 Row이므로 결과에 남습니다.

## RIGHT JOIN과 LEFT JOIN 비교

두 JOIN의 차이는 어느 쪽 Table을 반드시 남기는가입니다.

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

LEFT JOIN입니다.

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

RIGHT JOIN입니다.

```sql
SELECT *
FROM A
RIGHT JOIN B
    ON A.ID = B.ID;
```

### RIGHT JOIN 결과 Table

| A.ID | NAME | B.ID | VALUE |
| --- | --- | --- | --- |
| 1 | 가 | 1 | 하나 |
| NULL | NULL | 3 | 셋 |

```text
LEFT JOIN
→ 왼쪽 전체 유지

RIGHT JOIN
→ 오른쪽 전체 유지
```

## RIGHT JOIN과 FULL OUTER JOIN 비교

RIGHT JOIN은 오른쪽만 전부 유지합니다.

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

RIGHT JOIN 결과입니다.

```sql
SELECT *
FROM A
RIGHT JOIN B
    ON A.ID = B.ID;
```

### RIGHT JOIN 결과 Table

| A.ID | NAME | B.ID | VALUE |
| --- | --- | --- | --- |
| 1 | 가 | 1 | 하나 |
| NULL | NULL | 3 | 셋 |

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

차이는 왼쪽에만 존재하는 `A.ID = 2`입니다.

## 실제 문제 풀이 1 · 모든 부서와 직원

모든 부서를 조회하되 직원이 있다면 직원 이름도 보여 줍니다.

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

모든 부서를 유지해야 하므로 DEPARTMENT를 오른쪽에 둡니다.

<pre><code class="language-sql">SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
<span style="background-color:#DFF5E8;">RIGHT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID</span>;</code></pre>

### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | 인사 |
| NULL | 영업 |

## 실제 문제 풀이 2 · 직원이 없는 부서

### 입력 Table 1 · EMPLOYEE

| EMP_ID | EMP_NAME | DEPT_ID |
| --- | --- | --- |
| 1 | 직원1 | 10 |
| 2 | 직원2 | 20 |

### 입력 Table 2 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |
| 30 | 영업 |

<pre><code class="language-sql">SELECT
    D.DEPT_NAME
FROM EMPLOYEE E
RIGHT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID
<span style="background-color:#DFF5E8;">WHERE E.EMP_ID IS NULL</span>;</code></pre>

### 결과 Table

| DEPT_NAME |
| --- |
| 영업 |

## 실제 문제 풀이 3 · 부서별 직원

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
| 직원2 | 개발 |
| 직원3 | 인사 |
| NULL | 영업 |

개발 부서는 직원이 두 명이라 두 Row가 만들어집니다.

영업 부서는 직원이 없어도 오른쪽 Row이므로 남습니다.

## 실제 문제 풀이 4 · 조건이 있는 RIGHT JOIN

모든 부서를 유지하면서 급여 3000 이상 직원만 연결합니다.

### 입력 Table 1 · EMPLOYEE

| EMP_NAME | DEPT_ID | SALARY |
| --- | --- | ---: |
| 직원1 | 10 | 3500 |
| 직원2 | 10 | 2500 |
| 직원3 | 20 | 3200 |

### 입력 Table 2 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |
| 30 | 영업 |

<pre><code class="language-sql">SELECT
    E.EMP_NAME,
    E.SALARY,
    D.DEPT_NAME
FROM EMPLOYEE E
RIGHT JOIN DEPARTMENT D
    <span style="background-color:#DFF5E8;">ON E.DEPT_ID = D.DEPT_ID
   AND E.SALARY &gt;= 3000</span>;</code></pre>

### 결과 Table

| EMP_NAME | SALARY | DEPT_NAME |
| --- | ---: | --- |
| 직원1 | 3500 | 개발 |
| 직원3 | 3200 | 인사 |
| NULL | NULL | 영업 |

급여 조건을 ON에 두었기 때문에 영업 부서는 유지됩니다.

## RIGHT JOIN 문제 풀이 순서

RIGHT JOIN 문제에서는 먼저 무엇을 반드시 남길지 찾습니다.

### 문제 상황

모든 부서를 조회하고 직원이 있다면 직원 정보도 보여 주라고 합니다.

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

첫째, 반드시 남길 대상을 찾습니다.

```text
모든 부서
→ DEPARTMENT를 오른쪽에 둔다
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

핵심은 문제 문장의 `모든 부서`입니다.

## 잘 놓치는 핵심

### 1. 오른쪽 Table은 모두 유지된다

#### 입력 Table 1

| A.ID | A.NAME |
| --- | --- |
| 1 | 가 |

#### 입력 Table 2

| B.ID | B.VALUE |
| --- | --- |
| 1 | 하나 |
| 2 | 둘 |

```sql
SELECT
    A.NAME,
    B.VALUE
FROM A
RIGHT JOIN B
    ON A.ID = B.ID;
```

#### 결과 Table

| NAME | VALUE |
| --- | --- |
| 가 | 하나 |
| NULL | 둘 |

B의 `ID = 2`는 연결 상대가 없어도 남습니다.

### 2. 왼쪽에만 있는 Row는 제외된다

#### 입력 Table 1

| A.ID |
| --- |
| 1 |
| 2 |

#### 입력 Table 2

| B.ID |
| --- |
| 1 |

```sql
SELECT
    A.ID AS A_ID,
    B.ID AS B_ID
FROM A
RIGHT JOIN B
    ON A.ID = B.ID;
```

#### 결과 Table

| A_ID | B_ID |
| --- | --- |
| 1 | 1 |

`A.ID = 2`는 왼쪽에만 있으므로 나오지 않습니다.

### 3. 연결 실패 시 왼쪽 값이 NULL이 된다

#### 입력 Table 1

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |

#### 입력 Table 2

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

#### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| NULL | 인사 |

### 4. WHERE 때문에 오른쪽 Row가 사라질 수 있다

#### 입력 Table 1

| EMP_NAME | DEPT_ID | SALARY |
| --- | --- | ---: |
| 직원1 | 10 | 3500 |

#### 입력 Table 2

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

#### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |

인사는 RIGHT JOIN 직후에는 존재하지만 WHERE에서 제거됩니다.

### 5. RIGHT JOIN은 LEFT JOIN으로 바꾸어 생각할 수 있다

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
SELECT *
FROM A
RIGHT JOIN B
    ON A.ID = B.ID;
```

다음과 같이 방향을 바꾸어 생각할 수 있습니다.

```sql
SELECT *
FROM B
LEFT JOIN A
    ON A.ID = B.ID;
```

#### 결과 Table

| B.ID | A.ID |
| --- | --- |
| 1 | 1 |
| 2 | NULL |

RIGHT JOIN이 헷갈리면 Table 순서를 뒤집어 LEFT JOIN으로 생각하면 쉽습니다.

## 시험·면접

### 핵심 암기

```text
RIGHT JOIN
→ 오른쪽 전체 유지
```

```text
왼쪽 연결 성공
→ 값 연결
```

```text
왼쪽 연결 실패
→ 왼쪽 Column NULL
```

```text
왼쪽에만 존재
→ 결과 제외
```

```text
RIGHT JOIN + 왼쪽 Key IS NULL
→ 연결되지 않은 오른쪽 Row 찾기
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
    A.NAME,
    B.ID,
    B.VALUE
FROM A
RIGHT JOIN B
    ON A.ID = B.ID;
```

#### 결과 Table

| NAME | B.ID | VALUE |
| --- | --- | --- |
| 가 | 1 | 하나 |
| 나 | 2 | 둘 |
| NULL | 3 | 셋 |

오른쪽 B의 `1`, `2`, `3`이 모두 남습니다.

왼쪽에만 있는 `A.ID = 4`는 나오지 않습니다.

### 자주 나오는 문장

<mark>RIGHT JOIN은 오른쪽 Table의 모든 Row를 유지합니다.</mark>

<mark>왼쪽 Table에 연결되는 Row가 없으면 왼쪽 Column이 NULL이 될 수 있습니다.</mark>

<mark>RIGHT JOIN과 RIGHT OUTER JOIN은 일반적으로 같은 의미입니다.</mark>

<mark>RIGHT JOIN은 Table 순서를 바꾸어 LEFT JOIN으로 표현할 수 있습니다.</mark>

### 시험 함정 1 · RIGHT JOIN은 양쪽 전체가 아니다

#### 입력 Table

| A.ID |
| --- |
| 1 |
| 2 |

| B.ID |
| --- |
| 1 |

```sql
SELECT
    A.ID AS A_ID,
    B.ID AS B_ID
FROM A
RIGHT JOIN B
    ON A.ID = B.ID;
```

#### 결과 Table

| A_ID | B_ID |
| --- | --- |
| 1 | 1 |

왼쪽에만 있는 `A.ID = 2`는 결과에 나오지 않습니다.

### 시험 함정 2 · 결과 Row 수는 오른쪽 Table Row 수와 같지 않을 수 있다

#### 입력 Table

| EMP_NAME | DEPT_ID |
| --- | --- |
| 직원1 | 10 |
| 직원2 | 10 |

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

#### 결과 Table

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| 직원2 | 개발 |
| NULL | 인사 |

오른쪽 DEPARTMENT는 2개 Row지만 결과는 3개 Row입니다.

개발 한 Row가 직원 두 Row와 연결되기 때문입니다.

### 면접 짧은 답변

RIGHT JOIN은 오른쪽 Table의 모든 Row를 유지하면서 왼쪽 Table에서 JOIN 조건을 만족하는 Row를 연결하는 방식입니다. 왼쪽에 연결되는 Row가 없으면 왼쪽 Column은 NULL이 되며, Table 순서를 바꾸면 같은 의미를 LEFT JOIN으로 표현할 수 있습니다.

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
② 직원1·개발, NULL·인사가 나온다.  
③ 직원1·개발, 직원1·인사가 나온다.  
④ NULL·개발, NULL·인사가 나온다.

<details>
<summary>정답</summary>

②

오른쪽 DEPARTMENT의 Row가 모두 남습니다.

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| NULL | 인사 |

</details>

### 문제 2 · 왼쪽에만 있는 Row

#### A

| ID | NAME |
| --- | --- |
| 1 | 가 |
| 2 | 나 |

#### B

| ID | VALUE |
| --- | --- |
| 1 | 하나 |

다음 Query의 결과는 무엇인가?

```sql
SELECT
    A.NAME,
    B.VALUE
FROM A
RIGHT JOIN B
    ON A.ID = B.ID;
```

① 가·하나만 나온다.  
② 가·하나, 나·NULL이 나온다.  
③ 나·NULL만 나온다.  
④ 결과가 없다.

<details>
<summary>정답</summary>

①

오른쪽 B에는 `ID = 1`만 존재합니다.

| NAME | VALUE |
| --- | --- |
| 가 | 하나 |

왼쪽에만 있는 `A.ID = 2`는 결과에 나오지 않습니다.

</details>

### 문제 3 · 직원이 없는 부서

#### EMPLOYEE

| EMP_ID | EMP_NAME | DEPT_ID |
| --- | --- | --- |
| 1 | 직원1 | 10 |
| 2 | 직원2 | 20 |

#### DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |
| 30 | 영업 |

다음 Query의 결과는 무엇인가?

```sql
SELECT
    D.DEPT_NAME
FROM EMPLOYEE E
RIGHT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID
WHERE E.EMP_ID IS NULL;
```

① 개발  
② 인사  
③ 영업  
④ 개발, 인사

<details>
<summary>정답</summary>

③

RIGHT JOIN 결과에서 영업 부서만 연결되는 직원이 없습니다.

| DEPT_NAME |
| --- |
| 영업 |

</details>

### 문제 4 · RIGHT JOIN과 WHERE

#### EMPLOYEE

| EMP_NAME | DEPT_ID | SALARY |
| --- | --- | ---: |
| 직원1 | 10 | 3500 |
| 직원2 | 20 | 2500 |

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
RIGHT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID
WHERE E.SALARY >= 3000;
```

① 직원1·개발만 나온다.  
② 직원1·개발, 직원2·인사가 나온다.  
③ 직원1·개발, NULL·영업이 나온다.  
④ 세 부서가 모두 나온다.

<details>
<summary>정답</summary>

①

직원1만 급여 조건을 만족합니다.

인사의 직원2는 급여가 2500이라 제거됩니다.

영업은 직원이 없어 SALARY가 NULL이므로 WHERE에서 제거됩니다.

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |

</details>

### 문제 5 · ON에 조건을 넣은 경우

#### EMPLOYEE

| EMP_NAME | DEPT_ID | SALARY |
| --- | --- | ---: |
| 직원1 | 10 | 3500 |
| 직원2 | 20 | 2500 |

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
RIGHT JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID
   AND E.SALARY >= 3000;
```

① 직원1·개발만 나온다.  
② 직원1·개발, NULL·인사, NULL·영업이 나온다.  
③ 직원1·개발, 직원2·인사가 나온다.  
④ 영업만 나온다.

<details>
<summary>정답</summary>

②

급여 조건이 ON에 있으므로 어떤 왼쪽 직원을 연결할지만 제한합니다.

오른쪽 DEPARTMENT의 Row는 모두 유지됩니다.

| EMP_NAME | DEPT_NAME |
| --- | --- |
| 직원1 | 개발 |
| NULL | 인사 |
| NULL | 영업 |

</details>

### 문제 6 · LEFT JOIN으로 바꾸기

다음 Query와 같은 결과를 만드는 표현은 무엇인가?

```sql
SELECT *
FROM A
RIGHT JOIN B
    ON A.ID = B.ID;
```

① `A LEFT JOIN B ON A.ID = B.ID`  
② `B LEFT JOIN A ON A.ID = B.ID`  
③ `A CROSS JOIN B`  
④ `A INNER JOIN B ON A.ID = B.ID`

<details>
<summary>정답</summary>

②

RIGHT JOIN은 Table 순서를 바꾸면 LEFT JOIN으로 표현할 수 있습니다.

예를 들어 다음 입력 Table이 있습니다.

| A.ID |
| --- |
| 1 |

| B.ID |
| --- |
| 1 |
| 2 |

두 방식의 결과는 같은 Row를 유지합니다.

| B.ID | A.ID |
| --- | --- |
| 1 | 1 |
| 2 | NULL |

</details>

## RIGHT JOIN 전체 요약

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
    A.NAME,
    B.ID,
    B.VALUE
FROM A
<span style="background-color:#DFF5E8;">RIGHT JOIN B
    ON A.ID = B.ID</span>;</code></pre>

### 결과 Table

| NAME | B.ID | VALUE |
| --- | --- | --- |
| 가 | 1 | 하나 |
| 나 | 2 | 둘 |
| NULL | 3 | 셋 |

```text
B.ID = 1
→ 연결 성공
→ 가

B.ID = 2
→ 연결 성공
→ 나

B.ID = 3
→ 연결 실패
→ B Row 유지
→ A 값 NULL

A.ID = 4
→ 왼쪽에만 존재
→ 결과 제외
```

<blockquote class="prompt-danger">
<p>RIGHT JOIN 문제는 무엇을 반드시 남겨야 하는지 먼저 찾고, 그 Table을 오른쪽에 둡니다.</p>
</blockquote>

## 다음에 이을 글

**FULL OUTER JOIN**입니다.

왼쪽과 오른쪽 Table의 Row를 모두 유지하는 구조를 실제 입력 Table과 결과 Table로 비교합니다.
