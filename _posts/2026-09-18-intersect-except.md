---
title: INTERSECT · EXCEPT
date: 2026-09-18 22:30:00 +0900
slug: intersect-except
permalink: /posts/intersect-except/
categories: [CS, 데이터베이스]
tags: [INTERSECT, EXCEPT, SetOperator, SQL, 교집합, 차집합, SQLite, 정보처리기사, NCS]
math: true
---

INTERSECT는 두 SELECT 결과에 공통으로 존재하는 Row를 반환하고, EXCEPT는 첫 번째 SELECT에만 존재하는 Row를 반환합니다.

복잡한 SQL도 괄호 안쪽 결과부터 작게 나누어 보면 이해하기 쉽습니다.

<blockquote class="prompt-info">
<p>한 줄: INTERSECT는 교집합, EXCEPT는 첫 번째 결과에서 두 번째 결과를 뺀 차집합입니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

INTERSECT = 교집합 / EXCEPT = 왼쪽 차집합

</details>

## 실습 데이터 전체 보기

아래 실습 데이터베이스를 기준으로 예시를 설명합니다.

<div style="width:100%; overflow:hidden; border:1px solid var(--main-border-color,#ddd); border-radius:12px; margin:1rem 0;">
<iframe
  src="https://docs.google.com/spreadsheets/d/1mtu6pFcGyOfwpFizaJskfFD87GxyjAmB/preview"
  width="100%"
  height="500"
  style="border:0;"
  loading="lazy">
</iframe>
</div>

주요 Table은 다음과 같습니다.

| Table | 핵심 Column | 역할 |
| --- | --- | --- |
| DEPARTMENT | DEPT_ID, DEPT_NAME, REGION | 부서 |
| EMPLOYEE | EMP_ID, EMP_NAME, DEPT_ID, SALARY | 직원 |
| CUSTOMER | CUSTOMER_ID, NAME, REGION, GRADE | 고객 |
| PRODUCT | PRODUCT_ID, PRODUCT_NAME, CATEGORY, PRICE | 상품 |
| ORDERS | ORDER_ID, CUSTOMER_ID, ORDER_DATE, STATUS | 주문 |
| ORDER_ITEM | ORDER_ID, PRODUCT_ID, QTY | 주문 상세 |

대표 관계는 다음과 같습니다.

```text
EMPLOYEE.DEPT_ID
↓
DEPARTMENT.DEPT_ID
```

```text
ORDERS.CUSTOMER_ID
↓
CUSTOMER.CUSTOMER_ID
```

```text
ORDER_ITEM.ORDER_ID
↓
ORDERS.ORDER_ID
```

```text
ORDER_ITEM.PRODUCT_ID
↓
PRODUCT.PRODUCT_ID
```

## 핵심 예시

대표 SQL은 다음과 같습니다.

```sql
SELECT REGION
FROM DEPARTMENT
INTERSECT
SELECT REGION
FROM CUSTOMER;
```

먼저 안쪽 SELECT 또는 각 SELECT가 어떤 결과를 만드는지 확인합니다.

<mark>INTERSECT는 교집합, EXCEPT는 첫 번째 결과에서 두 번째 결과를 뺀 차집합입니다.</mark>

### 규칙 1. INTERSECT는 양쪽 결과에 모두 존재하는 Row를 반환한다.

이 문장은 `INTERSECT · EXCEPT` 문제를 풀 때 핵심 기준입니다.

```text
질문 1 → Subquery 또는 집합 결과가 무엇인가
질문 2 → 바깥 Query가 그 결과를 어떻게 사용하는가
질문 3 → Row 수와 Column 수가 연산자에 맞는가
질문 4 → NULL과 중복은 결과에 어떤 영향을 주는가
```

문법을 바로 계산하기보다 안쪽 결과를 작은 표로 먼저 적으면 실수가 줄어듭니다.

시험에서는 반환 형태와 연산자를 짝지어 보는 것이 가장 빠릅니다.

### 규칙 2. EXCEPT는 첫 번째 SELECT 결과에만 존재하는 Row를 반환한다.

이 문장은 `INTERSECT · EXCEPT` 문제를 풀 때 핵심 기준입니다.

```text
질문 1 → Subquery 또는 집합 결과가 무엇인가
질문 2 → 바깥 Query가 그 결과를 어떻게 사용하는가
질문 3 → Row 수와 Column 수가 연산자에 맞는가
질문 4 → NULL과 중복은 결과에 어떤 영향을 주는가
```

문법을 바로 계산하기보다 안쪽 결과를 작은 표로 먼저 적으면 실수가 줄어듭니다.

시험에서는 반환 형태와 연산자를 짝지어 보는 것이 가장 빠릅니다.

### 규칙 3. EXCEPT는 순서가 중요하다.

이 문장은 `INTERSECT · EXCEPT` 문제를 풀 때 핵심 기준입니다.

```text
질문 1 → Subquery 또는 집합 결과가 무엇인가
질문 2 → 바깥 Query가 그 결과를 어떻게 사용하는가
질문 3 → Row 수와 Column 수가 연산자에 맞는가
질문 4 → NULL과 중복은 결과에 어떤 영향을 주는가
```

문법을 바로 계산하기보다 안쪽 결과를 작은 표로 먼저 적으면 실수가 줄어듭니다.

시험에서는 반환 형태와 연산자를 짝지어 보는 것이 가장 빠릅니다.

### 규칙 4. 양쪽 SELECT의 Column 개수와 대응 자료형이 호환되어야 한다.

이 문장은 `INTERSECT · EXCEPT` 문제를 풀 때 핵심 기준입니다.

```text
질문 1 → Subquery 또는 집합 결과가 무엇인가
질문 2 → 바깥 Query가 그 결과를 어떻게 사용하는가
질문 3 → Row 수와 Column 수가 연산자에 맞는가
질문 4 → NULL과 중복은 결과에 어떤 영향을 주는가
```

문법을 바로 계산하기보다 안쪽 결과를 작은 표로 먼저 적으면 실수가 줄어듭니다.

시험에서는 반환 형태와 연산자를 짝지어 보는 것이 가장 빠릅니다.

### 규칙 5. SQLite의 INTERSECT와 EXCEPT는 기본적으로 중복을 제거한 결과를 반환한다.

이 문장은 `INTERSECT · EXCEPT` 문제를 풀 때 핵심 기준입니다.

```text
질문 1 → Subquery 또는 집합 결과가 무엇인가
질문 2 → 바깥 Query가 그 결과를 어떻게 사용하는가
질문 3 → Row 수와 Column 수가 연산자에 맞는가
질문 4 → NULL과 중복은 결과에 어떤 영향을 주는가
```

문법을 바로 계산하기보다 안쪽 결과를 작은 표로 먼저 적으면 실수가 줄어듭니다.

시험에서는 반환 형태와 연산자를 짝지어 보는 것이 가장 빠릅니다.

### 규칙 6. DBMS에 따라 EXCEPT 대신 MINUS라는 이름을 사용하는 경우가 있다.

이 문장은 `INTERSECT · EXCEPT` 문제를 풀 때 핵심 기준입니다.

```text
질문 1 → Subquery 또는 집합 결과가 무엇인가
질문 2 → 바깥 Query가 그 결과를 어떻게 사용하는가
질문 3 → Row 수와 Column 수가 연산자에 맞는가
질문 4 → NULL과 중복은 결과에 어떤 영향을 주는가
```

문법을 바로 계산하기보다 안쪽 결과를 작은 표로 먼저 적으면 실수가 줄어듭니다.

시험에서는 반환 형태와 연산자를 짝지어 보는 것이 가장 빠릅니다.

## INTERSECT 기본

부서 지역과 고객 지역에 모두 등장하는 지역만 찾습니다.

```sql
SELECT REGION
FROM DEPARTMENT
INTERSECT
SELECT REGION
FROM CUSTOMER;
```

양쪽 SELECT 결과의 공통 Row만 남습니다.

집합으로 보면 교집합입니다.

## EXCEPT 기본

부서 지역에는 있지만 고객 지역 목록에는 없는 지역을 찾습니다.

```sql
SELECT REGION
FROM DEPARTMENT
EXCEPT
SELECT REGION
FROM CUSTOMER;
```

첫 번째 결과에서 두 번째 결과를 뺍니다.

## EXCEPT 순서

차집합은 방향이 중요합니다.

```text
A EXCEPT B
≠
B EXCEPT A
```

A에만 있는 값과 B에만 있는 값은 서로 다를 수 있습니다.

시험에서는 SELECT 순서를 반드시 확인합니다.

## Column 구조

INTERSECT와 EXCEPT도 UNION처럼 양쪽 SELECT의 Column 구조를 맞춰야 합니다.

```text
Column 개수
→ 같아야 함

대응 Column
→ 호환 가능한 자료형과 의미
```

위치별로 비교된다는 점도 기억합니다.

## 중복 처리

SQLite에서 INTERSECT와 EXCEPT는 중복을 제거한 결과를 반환합니다.

예를 들어 A에 서울이 여러 번 있어도 집합 결과에서는 하나로 나타날 수 있습니다.

다른 DBMS의 ALL 변형 지원 여부는 별도로 확인해야 합니다.

## ORDER BY

전체 집합 연산 결과를 정렬할 때는 마지막에 ORDER BY를 사용합니다.

```sql
SELECT REGION
FROM DEPARTMENT
INTERSECT
SELECT REGION
FROM CUSTOMER
ORDER BY REGION;
```

## EXCEPT와 NOT EXISTS

차집합 목적은 NOT EXISTS로도 표현할 수 있는 경우가 있습니다.

```sql
SELECT D.REGION
FROM DEPARTMENT D
WHERE NOT EXISTS (
    SELECT 1
    FROM CUSTOMER C
    WHERE C.REGION = D.REGION
);
```

중복 처리와 NULL 의미까지 포함하면 완전히 같은 결과인지 확인해야 합니다.

## DBMS 이름 차이

일부 DBMS에서는 차집합 연산을 `MINUS`라고 부르기도 합니다.

```text
EXCEPT
→ 표준 SQL 계열에서 널리 사용

MINUS
→ 일부 DBMS에서 사용
```

시험이나 실무에서는 사용하는 DBMS 문법을 확인합니다.

## 다른 개념과 비교

### 비교 1. INTERSECT

```text
INTERSECT
→ 교집합
```

`INTERSECT · EXCEPT`과 비교할 때는 결과의 **Row 수**, **Column 수**, **NULL 처리**, **중복 처리**를 따로 봅니다.

비슷해 보이는 문법이라도 어떤 값을 만들고 어떤 기준으로 필터링하는지가 다를 수 있습니다.

### 비교 2. EXCEPT

```text
EXCEPT
→ 왼쪽 차집합
```

`INTERSECT · EXCEPT`과 비교할 때는 결과의 **Row 수**, **Column 수**, **NULL 처리**, **중복 처리**를 따로 봅니다.

비슷해 보이는 문법이라도 어떤 값을 만들고 어떤 기준으로 필터링하는지가 다를 수 있습니다.

### 비교 3. UNION

```text
UNION
→ 합집합
```

`INTERSECT · EXCEPT`과 비교할 때는 결과의 **Row 수**, **Column 수**, **NULL 처리**, **중복 처리**를 따로 봅니다.

비슷해 보이는 문법이라도 어떤 값을 만들고 어떤 기준으로 필터링하는지가 다를 수 있습니다.

### 비교 4. EXCEPT 순서

```text
EXCEPT 순서
→ 결과에 영향
```

`INTERSECT · EXCEPT`과 비교할 때는 결과의 **Row 수**, **Column 수**, **NULL 처리**, **중복 처리**를 따로 봅니다.

비슷해 보이는 문법이라도 어떤 값을 만들고 어떤 기준으로 필터링하는지가 다를 수 있습니다.

### 비교 5. SQLite

```text
SQLite
→ INTERSECT·EXCEPT 지원
```

`INTERSECT · EXCEPT`과 비교할 때는 결과의 **Row 수**, **Column 수**, **NULL 처리**, **중복 처리**를 따로 봅니다.

비슷해 보이는 문법이라도 어떤 값을 만들고 어떤 기준으로 필터링하는지가 다를 수 있습니다.

### 비교 6. MINUS

```text
MINUS
→ 일부 DBMS의 차집합 명칭
```

`INTERSECT · EXCEPT`과 비교할 때는 결과의 **Row 수**, **Column 수**, **NULL 처리**, **중복 처리**를 따로 봅니다.

비슷해 보이는 문법이라도 어떤 값을 만들고 어떤 기준으로 필터링하는지가 다를 수 있습니다.

## 실전 SQL 패턴

### 실전 패턴 1. 공통 지역

SQL은 다음과 같습니다.

```sql
SELECT REGION FROM DEPARTMENT
INTERSECT
SELECT REGION FROM CUSTOMER;
```

이 예시는 `INTERSECT · EXCEPT`에서 **안쪽 결과의 형태**와 **바깥 연산자의 역할**을 함께 확인하는 연습입니다.

먼저 서브쿼리 또는 첫 번째 SELECT 결과를 따로 적고, 그다음 바깥 조건이나 집합 연산을 적용합니다.

```text
1. 안쪽 결과 확인
2. Row 수 확인
3. Column 수 확인
4. 연산자 적용
5. NULL과 중복 확인
```

### 실전 패턴 2. 부서에만 있는 지역

SQL은 다음과 같습니다.

```sql
SELECT REGION FROM DEPARTMENT
EXCEPT
SELECT REGION FROM CUSTOMER;
```

이 예시는 `INTERSECT · EXCEPT`에서 **안쪽 결과의 형태**와 **바깥 연산자의 역할**을 함께 확인하는 연습입니다.

먼저 서브쿼리 또는 첫 번째 SELECT 결과를 따로 적고, 그다음 바깥 조건이나 집합 연산을 적용합니다.

```text
1. 안쪽 결과 확인
2. Row 수 확인
3. Column 수 확인
4. 연산자 적용
5. NULL과 중복 확인
```

### 실전 패턴 3. 고객에만 있는 지역

SQL은 다음과 같습니다.

```sql
SELECT REGION FROM CUSTOMER
EXCEPT
SELECT REGION FROM DEPARTMENT;
```

이 예시는 `INTERSECT · EXCEPT`에서 **안쪽 결과의 형태**와 **바깥 연산자의 역할**을 함께 확인하는 연습입니다.

먼저 서브쿼리 또는 첫 번째 SELECT 결과를 따로 적고, 그다음 바깥 조건이나 집합 연산을 적용합니다.

```text
1. 안쪽 결과 확인
2. Row 수 확인
3. Column 수 확인
4. 연산자 적용
5. NULL과 중복 확인
```

### 실전 패턴 4. 공통 ID 구조 예시

SQL은 다음과 같습니다.

```sql
SELECT CUSTOMER_ID FROM CUSTOMER
INTERSECT
SELECT CUSTOMER_ID FROM ORDERS;
```

이 예시는 `INTERSECT · EXCEPT`에서 **안쪽 결과의 형태**와 **바깥 연산자의 역할**을 함께 확인하는 연습입니다.

먼저 서브쿼리 또는 첫 번째 SELECT 결과를 따로 적고, 그다음 바깥 조건이나 집합 연산을 적용합니다.

```text
1. 안쪽 결과 확인
2. Row 수 확인
3. Column 수 확인
4. 연산자 적용
5. NULL과 중복 확인
```

### 실전 패턴 5. 주문 없는 고객 ID

SQL은 다음과 같습니다.

```sql
SELECT CUSTOMER_ID FROM CUSTOMER
EXCEPT
SELECT CUSTOMER_ID FROM ORDERS;
```

이 예시는 `INTERSECT · EXCEPT`에서 **안쪽 결과의 형태**와 **바깥 연산자의 역할**을 함께 확인하는 연습입니다.

먼저 서브쿼리 또는 첫 번째 SELECT 결과를 따로 적고, 그다음 바깥 조건이나 집합 연산을 적용합니다.

```text
1. 안쪽 결과 확인
2. Row 수 확인
3. Column 수 확인
4. 연산자 적용
5. NULL과 중복 확인
```

### 실전 패턴 6. 판매되지 않은 상품 ID

SQL은 다음과 같습니다.

```sql
SELECT PRODUCT_ID FROM PRODUCT
EXCEPT
SELECT PRODUCT_ID FROM ORDER_ITEM;
```

이 예시는 `INTERSECT · EXCEPT`에서 **안쪽 결과의 형태**와 **바깥 연산자의 역할**을 함께 확인하는 연습입니다.

먼저 서브쿼리 또는 첫 번째 SELECT 결과를 따로 적고, 그다음 바깥 조건이나 집합 연산을 적용합니다.

```text
1. 안쪽 결과 확인
2. Row 수 확인
3. Column 수 확인
4. 연산자 적용
5. NULL과 중복 확인
```

### 실전 패턴 7. 정렬

SQL은 다음과 같습니다.

```sql
SELECT REGION FROM DEPARTMENT
INTERSECT
SELECT REGION FROM CUSTOMER
ORDER BY REGION;
```

이 예시는 `INTERSECT · EXCEPT`에서 **안쪽 결과의 형태**와 **바깥 연산자의 역할**을 함께 확인하는 연습입니다.

먼저 서브쿼리 또는 첫 번째 SELECT 결과를 따로 적고, 그다음 바깥 조건이나 집합 연산을 적용합니다.

```text
1. 안쪽 결과 확인
2. Row 수 확인
3. Column 수 확인
4. 연산자 적용
5. NULL과 중복 확인
```

### 실전 패턴 8. NOT EXISTS 대체

SQL은 다음과 같습니다.

```sql
SELECT D.REGION FROM DEPARTMENT D
WHERE NOT EXISTS (SELECT 1 FROM CUSTOMER C WHERE C.REGION=D.REGION);
```

이 예시는 `INTERSECT · EXCEPT`에서 **안쪽 결과의 형태**와 **바깥 연산자의 역할**을 함께 확인하는 연습입니다.

먼저 서브쿼리 또는 첫 번째 SELECT 결과를 따로 적고, 그다음 바깥 조건이나 집합 연산을 적용합니다.

```text
1. 안쪽 결과 확인
2. Row 수 확인
3. Column 수 확인
4. 연산자 적용
5. NULL과 중복 확인
```

## 자주 하는 실수

### 실수 1. 서브쿼리 결과 Row 수를 확인하지 않고 연산자를 선택한다.

이 실수를 피하려면 먼저 다음을 적습니다.

```text
안쪽 결과
→ Row 수
→ Column 수
→ NULL 포함 여부
→ 중복 여부
```

그다음 `INTERSECT는 양쪽 결과에 모두 존재하는 Row를 반환한다.`를 적용합니다.

시험에서는 SQL 전체를 한 번에 읽기보다 괄호 안쪽부터 작은 결과로 바꾸어 보는 것이 안전합니다.

### 실수 2. NULL을 일반 값처럼 등호로 비교한다.

이 실수를 피하려면 먼저 다음을 적습니다.

```text
안쪽 결과
→ Row 수
→ Column 수
→ NULL 포함 여부
→ 중복 여부
```

그다음 `EXCEPT는 첫 번째 SELECT 결과에만 존재하는 Row를 반환한다.`를 적용합니다.

시험에서는 SQL 전체를 한 번에 읽기보다 괄호 안쪽부터 작은 결과로 바꾸어 보는 것이 안전합니다.

### 실수 3. 중복 제거 여부를 확인하지 않는다.

이 실수를 피하려면 먼저 다음을 적습니다.

```text
안쪽 결과
→ Row 수
→ Column 수
→ NULL 포함 여부
→ 중복 여부
```

그다음 `EXCEPT는 순서가 중요하다.`를 적용합니다.

시험에서는 SQL 전체를 한 번에 읽기보다 괄호 안쪽부터 작은 결과로 바꾸어 보는 것이 안전합니다.

### 실수 4. 안쪽 Query와 바깥 Query의 별칭을 혼동한다.

이 실수를 피하려면 먼저 다음을 적습니다.

```text
안쪽 결과
→ Row 수
→ Column 수
→ NULL 포함 여부
→ 중복 여부
```

그다음 `양쪽 SELECT의 Column 개수와 대응 자료형이 호환되어야 한다.`를 적용합니다.

시험에서는 SQL 전체를 한 번에 읽기보다 괄호 안쪽부터 작은 결과로 바꾸어 보는 것이 안전합니다.

### 실수 5. DBMS별 지원 문법 차이를 무시한다.

이 실수를 피하려면 먼저 다음을 적습니다.

```text
안쪽 결과
→ Row 수
→ Column 수
→ NULL 포함 여부
→ 중복 여부
```

그다음 `SQLite의 INTERSECT와 EXCEPT는 기본적으로 중복을 제거한 결과를 반환한다.`를 적용합니다.

시험에서는 SQL 전체를 한 번에 읽기보다 괄호 안쪽부터 작은 결과로 바꾸어 보는 것이 안전합니다.

### 실수 6. 집합 연산에서 SELECT Column 개수를 맞추지 않는다.

이 실수를 피하려면 먼저 다음을 적습니다.

```text
안쪽 결과
→ Row 수
→ Column 수
→ NULL 포함 여부
→ 중복 여부
```

그다음 `DBMS에 따라 EXCEPT 대신 MINUS라는 이름을 사용하는 경우가 있다.`를 적용합니다.

시험에서는 SQL 전체를 한 번에 읽기보다 괄호 안쪽부터 작은 결과로 바꾸어 보는 것이 안전합니다.

### 실수 7. ORDER BY가 어느 결과에 적용되는지 확인하지 않는다.

이 실수를 피하려면 먼저 다음을 적습니다.

```text
안쪽 결과
→ Row 수
→ Column 수
→ NULL 포함 여부
→ 중복 여부
```

그다음 `INTERSECT는 양쪽 결과에 모두 존재하는 Row를 반환한다.`를 적용합니다.

시험에서는 SQL 전체를 한 번에 읽기보다 괄호 안쪽부터 작은 결과로 바꾸어 보는 것이 안전합니다.

### 실수 8. NOT IN과 NULL의 결합을 단순하게 생각한다.

이 실수를 피하려면 먼저 다음을 적습니다.

```text
안쪽 결과
→ Row 수
→ Column 수
→ NULL 포함 여부
→ 중복 여부
```

그다음 `EXCEPT는 첫 번째 SELECT 결과에만 존재하는 Row를 반환한다.`를 적용합니다.

시험에서는 SQL 전체를 한 번에 읽기보다 괄호 안쪽부터 작은 결과로 바꾸어 보는 것이 안전합니다.

### 실수 9. 성능을 문법 이름만으로 단정한다.

이 실수를 피하려면 먼저 다음을 적습니다.

```text
안쪽 결과
→ Row 수
→ Column 수
→ NULL 포함 여부
→ 중복 여부
```

그다음 `EXCEPT는 순서가 중요하다.`를 적용합니다.

시험에서는 SQL 전체를 한 번에 읽기보다 괄호 안쪽부터 작은 결과로 바꾸어 보는 것이 안전합니다.

### 실수 10. JOIN과 Subquery를 완전히 같은 개념으로 본다.

이 실수를 피하려면 먼저 다음을 적습니다.

```text
안쪽 결과
→ Row 수
→ Column 수
→ NULL 포함 여부
→ 중복 여부
```

그다음 `양쪽 SELECT의 Column 개수와 대응 자료형이 호환되어야 한다.`를 적용합니다.

시험에서는 SQL 전체를 한 번에 읽기보다 괄호 안쪽부터 작은 결과로 바꾸어 보는 것이 안전합니다.

## 잘 놓치는 핵심

### 1. INTERSECT는 양쪽 결과에 모두 존재하는 Row를 반환한다.

```text
INTERSECT는 양쪽 결과에 모두 존재하는 Row를 반환한다.
```

이 문장은 시험에서 표현을 조금 바꾸어 출제될 수 있습니다.

반드시 실제 예시 값을 대입해서 참인지 확인합니다.

### 2. EXCEPT는 첫 번째 SELECT 결과에만 존재하는 Row를 반환한다.

```text
EXCEPT는 첫 번째 SELECT 결과에만 존재하는 Row를 반환한다.
```

이 문장은 시험에서 표현을 조금 바꾸어 출제될 수 있습니다.

반드시 실제 예시 값을 대입해서 참인지 확인합니다.

### 3. EXCEPT는 순서가 중요하다.

```text
EXCEPT는 순서가 중요하다.
```

이 문장은 시험에서 표현을 조금 바꾸어 출제될 수 있습니다.

반드시 실제 예시 값을 대입해서 참인지 확인합니다.

### 4. 양쪽 SELECT의 Column 개수와 대응 자료형이 호환되어야 한다.

```text
양쪽 SELECT의 Column 개수와 대응 자료형이 호환되어야 한다.
```

이 문장은 시험에서 표현을 조금 바꾸어 출제될 수 있습니다.

반드시 실제 예시 값을 대입해서 참인지 확인합니다.

### 5. SQLite의 INTERSECT와 EXCEPT는 기본적으로 중복을 제거한 결과를 반환한다.

```text
SQLite의 INTERSECT와 EXCEPT는 기본적으로 중복을 제거한 결과를 반환한다.
```

이 문장은 시험에서 표현을 조금 바꾸어 출제될 수 있습니다.

반드시 실제 예시 값을 대입해서 참인지 확인합니다.

### 6. DBMS에 따라 EXCEPT 대신 MINUS라는 이름을 사용하는 경우가 있다.

```text
DBMS에 따라 EXCEPT 대신 MINUS라는 이름을 사용하는 경우가 있다.
```

이 문장은 시험에서 표현을 조금 바꾸어 출제될 수 있습니다.

반드시 실제 예시 값을 대입해서 참인지 확인합니다.

## 시험·면접

### 핵심 암기

```text
INTERSECT = 교집합 / EXCEPT = 왼쪽 차집합
```

### 시험 접근 순서

```text
1. 안쪽 Query 결과 확인
2. Row 수 확인
3. Column 수 확인
4. 연산자 의미 확인
5. NULL 확인
6. 중복 처리 확인
7. 바깥 Query 결과 판단
```

### 시험 함정

`SQLite의 INTERSECT와 EXCEPT는 기본적으로 중복을 제거한 결과를 반환한다.`와 관련된 문장은 특히 조건을 정확히 확인해야 합니다.

### 면접에서 짧게 답한다면

INTERSECT는 두 SELECT 결과에 공통으로 존재하는 Row를 반환하고, EXCEPT는 첫 번째 SELECT에만 존재하는 Row를 반환합니다.

핵심은 반환 결과의 형태와 바깥 Query가 그 결과를 어떤 연산자로 사용하는지를 구분하는 것입니다.

## 예시로 한 바퀴

다음 SQL을 다시 봅니다.

```sql
SELECT REGION
FROM DEPARTMENT
INTERSECT
SELECT REGION
FROM CUSTOMER;
```

먼저 괄호 안쪽 또는 먼저 실행되는 SELECT의 결과를 작은 표처럼 적습니다.

```text
Step 1
→ 안쪽 결과

Step 2
→ 바깥 조건과 비교

Step 3
→ NULL과 중복 확인

Step 4
→ 최종 Row 결정
```

이 흐름을 한 번 손으로 따라가면 비슷한 문제에서도 같은 순서를 사용할 수 있습니다.

## 객관식 문제

### 1. INTERSECT는?

① 교집합  
② 합집합  
③ 왼쪽 차집합  
④ 모든 조합

<details>
<summary>정답</summary>

①

</details>

해설: `INTERSECT · EXCEPT`에서는 결과의 형태와 연산자 의미를 먼저 확인하면 정답을 빠르게 판단할 수 있습니다.

### 2. EXCEPT는?

① 첫 결과에서 둘째 결과를 뺀 차집합  
② 교집합  
③ 합집합  
④ JOIN

<details>
<summary>정답</summary>

①

</details>

해설: `INTERSECT · EXCEPT`에서는 결과의 형태와 연산자 의미를 먼저 확인하면 정답을 빠르게 판단할 수 있습니다.

### 3. EXCEPT에서 중요한 것은?

① SELECT 순서  
② 별칭 길이  
③ Table 크기만  
④ Index 이름

<details>
<summary>정답</summary>

①

</details>

해설: `INTERSECT · EXCEPT`에서는 결과의 형태와 연산자 의미를 먼저 확인하면 정답을 빠르게 판단할 수 있습니다.

### 4. SQL을 풀 때 가장 먼저 확인할 것은?

① 안쪽 Query 또는 각 SELECT가 만드는 결과  
② 글자 수  
③ 파일명  
④ 정렬 색상

<details>
<summary>정답</summary>

①

</details>

해설: `INTERSECT · EXCEPT`에서는 결과의 형태와 연산자 의미를 먼저 확인하면 정답을 빠르게 판단할 수 있습니다.

### 5. NULL 비교에 대한 설명으로 옳은 것은?

① 일반 값과 같은 방식으로 단정하면 안 된다  
② 항상 0과 같다  
③ 항상 빈 문자열  
④ 항상 거짓만

<details>
<summary>정답</summary>

①

</details>

해설: `INTERSECT · EXCEPT`에서는 결과의 형태와 연산자 의미를 먼저 확인하면 정답을 빠르게 판단할 수 있습니다.

### 6. Subquery의 결과 형태를 보는 이유는?

① 연산자 선택과 결과 해석에 필요  
② 글자 수 계산  
③ Index 삭제  
④ Table 이름 변경

<details>
<summary>정답</summary>

①

</details>

해설: `INTERSECT · EXCEPT`에서는 결과의 형태와 연산자 의미를 먼저 확인하면 정답을 빠르게 판단할 수 있습니다.

### 7. 집합 연산에서 대응 Column은?

① 위치별로 대응  
② 이름만 보고 자동  
③ Row 수로 대응  
④ Primary Key만 대응

<details>
<summary>정답</summary>

①

</details>

해설: `INTERSECT · EXCEPT`에서는 결과의 형태와 연산자 의미를 먼저 확인하면 정답을 빠르게 판단할 수 있습니다.

### 8. 성능 판단은 어떻게 하는 것이 좋은가?

① 실행 계획과 Index를 확인  
② 문법 이름만 보고 단정  
③ 항상 Subquery가 느림  
④ 항상 JOIN이 느림

<details>
<summary>정답</summary>

①

</details>

해설: `INTERSECT · EXCEPT`에서는 결과의 형태와 연산자 의미를 먼저 확인하면 정답을 빠르게 판단할 수 있습니다.

### 9. 별칭의 장점은?

① Column 출처와 Query 역할을 명확히 함  
② NULL 제거  
③ 중복 자동 제거  
④ Row 수 고정

<details>
<summary>정답</summary>

①

</details>

해설: `INTERSECT · EXCEPT`에서는 결과의 형태와 연산자 의미를 먼저 확인하면 정답을 빠르게 판단할 수 있습니다.

### 10. 중복 처리 여부를 확인해야 하는 이유는?

① 결과 Row가 달라질 수 있기 때문  
② 문법 색상이 달라져서  
③ 파일명이 바뀌어서  
④ JOIN이 삭제돼서

<details>
<summary>정답</summary>

①

</details>

해설: `INTERSECT · EXCEPT`에서는 결과의 형태와 연산자 의미를 먼저 확인하면 정답을 빠르게 판단할 수 있습니다.

### 11. WHERE는 일반적으로 무엇을 하는가?

① 조건을 만족하는 Row를 필터링  
② Table 생성만  
③ Index 삭제  
④ Column 이름 변경

<details>
<summary>정답</summary>

①

</details>

해설: `INTERSECT · EXCEPT`에서는 결과의 형태와 연산자 의미를 먼저 확인하면 정답을 빠르게 판단할 수 있습니다.

### 12. 서브쿼리를 읽는 실용적인 순서는?

① 안쪽부터 결과를 구해 바깥으로  
② 무조건 바깥만  
③ ORDER BY부터  
④ SELECT를 무시

<details>
<summary>정답</summary>

①

</details>

해설: `INTERSECT · EXCEPT`에서는 결과의 형태와 연산자 의미를 먼저 확인하면 정답을 빠르게 판단할 수 있습니다.

## 추가 반복 연습

### 반복 연습 1. INTERSECT는 양쪽 결과에 모두 존재하는 Row를 반환한다.

다음 순서로 `INTERSECT · EXCEPT`를 다시 확인합니다.

```text
1. 안쪽 SELECT 또는 첫 번째 SELECT 결과를 적는다.
2. Row 수와 Column 수를 확인한다.
3. NULL이 포함되는지 본다.
4. 중복을 유지하는지 제거하는지 본다.
5. 바깥 연산자 또는 집합 연산을 적용한다.
```

이번 연습의 핵심 문장은 다음입니다.

```text
INTERSECT는 양쪽 결과에 모두 존재하는 Row를 반환한다.
```

이 과정을 반복하면 긴 SQL도 작은 결과 집합 여러 개로 나누어 읽을 수 있습니다.

객관식에서는 실제 값을 두세 개만 넣어도 `항상`, `모두`, `하나 이상`, `존재` 같은 표현의 차이를 빠르게 확인할 수 있습니다.

### 반복 연습 2. EXCEPT는 첫 번째 SELECT 결과에만 존재하는 Row를 반환한다.

다음 순서로 `INTERSECT · EXCEPT`를 다시 확인합니다.

```text
1. 안쪽 SELECT 또는 첫 번째 SELECT 결과를 적는다.
2. Row 수와 Column 수를 확인한다.
3. NULL이 포함되는지 본다.
4. 중복을 유지하는지 제거하는지 본다.
5. 바깥 연산자 또는 집합 연산을 적용한다.
```

이번 연습의 핵심 문장은 다음입니다.

```text
EXCEPT는 첫 번째 SELECT 결과에만 존재하는 Row를 반환한다.
```

이 과정을 반복하면 긴 SQL도 작은 결과 집합 여러 개로 나누어 읽을 수 있습니다.

객관식에서는 실제 값을 두세 개만 넣어도 `항상`, `모두`, `하나 이상`, `존재` 같은 표현의 차이를 빠르게 확인할 수 있습니다.

### 반복 연습 3. EXCEPT는 순서가 중요하다.

다음 순서로 `INTERSECT · EXCEPT`를 다시 확인합니다.

```text
1. 안쪽 SELECT 또는 첫 번째 SELECT 결과를 적는다.
2. Row 수와 Column 수를 확인한다.
3. NULL이 포함되는지 본다.
4. 중복을 유지하는지 제거하는지 본다.
5. 바깥 연산자 또는 집합 연산을 적용한다.
```

이번 연습의 핵심 문장은 다음입니다.

```text
EXCEPT는 순서가 중요하다.
```

이 과정을 반복하면 긴 SQL도 작은 결과 집합 여러 개로 나누어 읽을 수 있습니다.

객관식에서는 실제 값을 두세 개만 넣어도 `항상`, `모두`, `하나 이상`, `존재` 같은 표현의 차이를 빠르게 확인할 수 있습니다.

### 반복 연습 4. 양쪽 SELECT의 Column 개수와 대응 자료형이 호환되어야 한다.

다음 순서로 `INTERSECT · EXCEPT`를 다시 확인합니다.

```text
1. 안쪽 SELECT 또는 첫 번째 SELECT 결과를 적는다.
2. Row 수와 Column 수를 확인한다.
3. NULL이 포함되는지 본다.
4. 중복을 유지하는지 제거하는지 본다.
5. 바깥 연산자 또는 집합 연산을 적용한다.
```

이번 연습의 핵심 문장은 다음입니다.

```text
양쪽 SELECT의 Column 개수와 대응 자료형이 호환되어야 한다.
```

이 과정을 반복하면 긴 SQL도 작은 결과 집합 여러 개로 나누어 읽을 수 있습니다.

객관식에서는 실제 값을 두세 개만 넣어도 `항상`, `모두`, `하나 이상`, `존재` 같은 표현의 차이를 빠르게 확인할 수 있습니다.

### 반복 연습 5. SQLite의 INTERSECT와 EXCEPT는 기본적으로 중복을 제거한 결과를 반환한다.

다음 순서로 `INTERSECT · EXCEPT`를 다시 확인합니다.

```text
1. 안쪽 SELECT 또는 첫 번째 SELECT 결과를 적는다.
2. Row 수와 Column 수를 확인한다.
3. NULL이 포함되는지 본다.
4. 중복을 유지하는지 제거하는지 본다.
5. 바깥 연산자 또는 집합 연산을 적용한다.
```

이번 연습의 핵심 문장은 다음입니다.

```text
SQLite의 INTERSECT와 EXCEPT는 기본적으로 중복을 제거한 결과를 반환한다.
```

이 과정을 반복하면 긴 SQL도 작은 결과 집합 여러 개로 나누어 읽을 수 있습니다.

객관식에서는 실제 값을 두세 개만 넣어도 `항상`, `모두`, `하나 이상`, `존재` 같은 표현의 차이를 빠르게 확인할 수 있습니다.

### 반복 연습 6. DBMS에 따라 EXCEPT 대신 MINUS라는 이름을 사용하는 경우가 있다.

다음 순서로 `INTERSECT · EXCEPT`를 다시 확인합니다.

```text
1. 안쪽 SELECT 또는 첫 번째 SELECT 결과를 적는다.
2. Row 수와 Column 수를 확인한다.
3. NULL이 포함되는지 본다.
4. 중복을 유지하는지 제거하는지 본다.
5. 바깥 연산자 또는 집합 연산을 적용한다.
```

이번 연습의 핵심 문장은 다음입니다.

```text
DBMS에 따라 EXCEPT 대신 MINUS라는 이름을 사용하는 경우가 있다.
```

이 과정을 반복하면 긴 SQL도 작은 결과 집합 여러 개로 나누어 읽을 수 있습니다.

객관식에서는 실제 값을 두세 개만 넣어도 `항상`, `모두`, `하나 이상`, `존재` 같은 표현의 차이를 빠르게 확인할 수 있습니다.

### 반복 연습 7. INTERSECT는 양쪽 결과에 모두 존재하는 Row를 반환한다.

다음 순서로 `INTERSECT · EXCEPT`를 다시 확인합니다.

```text
1. 안쪽 SELECT 또는 첫 번째 SELECT 결과를 적는다.
2. Row 수와 Column 수를 확인한다.
3. NULL이 포함되는지 본다.
4. 중복을 유지하는지 제거하는지 본다.
5. 바깥 연산자 또는 집합 연산을 적용한다.
```

이번 연습의 핵심 문장은 다음입니다.

```text
INTERSECT는 양쪽 결과에 모두 존재하는 Row를 반환한다.
```

이 과정을 반복하면 긴 SQL도 작은 결과 집합 여러 개로 나누어 읽을 수 있습니다.

객관식에서는 실제 값을 두세 개만 넣어도 `항상`, `모두`, `하나 이상`, `존재` 같은 표현의 차이를 빠르게 확인할 수 있습니다.

### 반복 연습 8. EXCEPT는 첫 번째 SELECT 결과에만 존재하는 Row를 반환한다.

다음 순서로 `INTERSECT · EXCEPT`를 다시 확인합니다.

```text
1. 안쪽 SELECT 또는 첫 번째 SELECT 결과를 적는다.
2. Row 수와 Column 수를 확인한다.
3. NULL이 포함되는지 본다.
4. 중복을 유지하는지 제거하는지 본다.
5. 바깥 연산자 또는 집합 연산을 적용한다.
```

이번 연습의 핵심 문장은 다음입니다.

```text
EXCEPT는 첫 번째 SELECT 결과에만 존재하는 Row를 반환한다.
```

이 과정을 반복하면 긴 SQL도 작은 결과 집합 여러 개로 나누어 읽을 수 있습니다.

객관식에서는 실제 값을 두세 개만 넣어도 `항상`, `모두`, `하나 이상`, `존재` 같은 표현의 차이를 빠르게 확인할 수 있습니다.

### 반복 연습 9. EXCEPT는 순서가 중요하다.

다음 순서로 `INTERSECT · EXCEPT`를 다시 확인합니다.

```text
1. 안쪽 SELECT 또는 첫 번째 SELECT 결과를 적는다.
2. Row 수와 Column 수를 확인한다.
3. NULL이 포함되는지 본다.
4. 중복을 유지하는지 제거하는지 본다.
5. 바깥 연산자 또는 집합 연산을 적용한다.
```

이번 연습의 핵심 문장은 다음입니다.

```text
EXCEPT는 순서가 중요하다.
```

이 과정을 반복하면 긴 SQL도 작은 결과 집합 여러 개로 나누어 읽을 수 있습니다.

객관식에서는 실제 값을 두세 개만 넣어도 `항상`, `모두`, `하나 이상`, `존재` 같은 표현의 차이를 빠르게 확인할 수 있습니다.

### 반복 연습 10. 양쪽 SELECT의 Column 개수와 대응 자료형이 호환되어야 한다.

다음 순서로 `INTERSECT · EXCEPT`를 다시 확인합니다.

```text
1. 안쪽 SELECT 또는 첫 번째 SELECT 결과를 적는다.
2. Row 수와 Column 수를 확인한다.
3. NULL이 포함되는지 본다.
4. 중복을 유지하는지 제거하는지 본다.
5. 바깥 연산자 또는 집합 연산을 적용한다.
```

이번 연습의 핵심 문장은 다음입니다.

```text
양쪽 SELECT의 Column 개수와 대응 자료형이 호환되어야 한다.
```

이 과정을 반복하면 긴 SQL도 작은 결과 집합 여러 개로 나누어 읽을 수 있습니다.

객관식에서는 실제 값을 두세 개만 넣어도 `항상`, `모두`, `하나 이상`, `존재` 같은 표현의 차이를 빠르게 확인할 수 있습니다.

### 반복 연습 11. SQLite의 INTERSECT와 EXCEPT는 기본적으로 중복을 제거한 결과를 반환한다.

다음 순서로 `INTERSECT · EXCEPT`를 다시 확인합니다.

```text
1. 안쪽 SELECT 또는 첫 번째 SELECT 결과를 적는다.
2. Row 수와 Column 수를 확인한다.
3. NULL이 포함되는지 본다.
4. 중복을 유지하는지 제거하는지 본다.
5. 바깥 연산자 또는 집합 연산을 적용한다.
```

이번 연습의 핵심 문장은 다음입니다.

```text
SQLite의 INTERSECT와 EXCEPT는 기본적으로 중복을 제거한 결과를 반환한다.
```

이 과정을 반복하면 긴 SQL도 작은 결과 집합 여러 개로 나누어 읽을 수 있습니다.

객관식에서는 실제 값을 두세 개만 넣어도 `항상`, `모두`, `하나 이상`, `존재` 같은 표현의 차이를 빠르게 확인할 수 있습니다.

### 반복 연습 12. DBMS에 따라 EXCEPT 대신 MINUS라는 이름을 사용하는 경우가 있다.

다음 순서로 `INTERSECT · EXCEPT`를 다시 확인합니다.

```text
1. 안쪽 SELECT 또는 첫 번째 SELECT 결과를 적는다.
2. Row 수와 Column 수를 확인한다.
3. NULL이 포함되는지 본다.
4. 중복을 유지하는지 제거하는지 본다.
5. 바깥 연산자 또는 집합 연산을 적용한다.
```

이번 연습의 핵심 문장은 다음입니다.

```text
DBMS에 따라 EXCEPT 대신 MINUS라는 이름을 사용하는 경우가 있다.
```

이 과정을 반복하면 긴 SQL도 작은 결과 집합 여러 개로 나누어 읽을 수 있습니다.

객관식에서는 실제 값을 두세 개만 넣어도 `항상`, `모두`, `하나 이상`, `존재` 같은 표현의 차이를 빠르게 확인할 수 있습니다.

### 반복 연습 13. INTERSECT는 양쪽 결과에 모두 존재하는 Row를 반환한다.

다음 순서로 `INTERSECT · EXCEPT`를 다시 확인합니다.

```text
1. 안쪽 SELECT 또는 첫 번째 SELECT 결과를 적는다.
2. Row 수와 Column 수를 확인한다.
3. NULL이 포함되는지 본다.
4. 중복을 유지하는지 제거하는지 본다.
5. 바깥 연산자 또는 집합 연산을 적용한다.
```

이번 연습의 핵심 문장은 다음입니다.

```text
INTERSECT는 양쪽 결과에 모두 존재하는 Row를 반환한다.
```

이 과정을 반복하면 긴 SQL도 작은 결과 집합 여러 개로 나누어 읽을 수 있습니다.

객관식에서는 실제 값을 두세 개만 넣어도 `항상`, `모두`, `하나 이상`, `존재` 같은 표현의 차이를 빠르게 확인할 수 있습니다.

### 반복 연습 14. EXCEPT는 첫 번째 SELECT 결과에만 존재하는 Row를 반환한다.

다음 순서로 `INTERSECT · EXCEPT`를 다시 확인합니다.

```text
1. 안쪽 SELECT 또는 첫 번째 SELECT 결과를 적는다.
2. Row 수와 Column 수를 확인한다.
3. NULL이 포함되는지 본다.
4. 중복을 유지하는지 제거하는지 본다.
5. 바깥 연산자 또는 집합 연산을 적용한다.
```

이번 연습의 핵심 문장은 다음입니다.

```text
EXCEPT는 첫 번째 SELECT 결과에만 존재하는 Row를 반환한다.
```

이 과정을 반복하면 긴 SQL도 작은 결과 집합 여러 개로 나누어 읽을 수 있습니다.

객관식에서는 실제 값을 두세 개만 넣어도 `항상`, `모두`, `하나 이상`, `존재` 같은 표현의 차이를 빠르게 확인할 수 있습니다.

### 반복 연습 15. EXCEPT는 순서가 중요하다.

다음 순서로 `INTERSECT · EXCEPT`를 다시 확인합니다.

```text
1. 안쪽 SELECT 또는 첫 번째 SELECT 결과를 적는다.
2. Row 수와 Column 수를 확인한다.
3. NULL이 포함되는지 본다.
4. 중복을 유지하는지 제거하는지 본다.
5. 바깥 연산자 또는 집합 연산을 적용한다.
```

이번 연습의 핵심 문장은 다음입니다.

```text
EXCEPT는 순서가 중요하다.
```

이 과정을 반복하면 긴 SQL도 작은 결과 집합 여러 개로 나누어 읽을 수 있습니다.

객관식에서는 실제 값을 두세 개만 넣어도 `항상`, `모두`, `하나 이상`, `존재` 같은 표현의 차이를 빠르게 확인할 수 있습니다.

### 반복 연습 16. 양쪽 SELECT의 Column 개수와 대응 자료형이 호환되어야 한다.

다음 순서로 `INTERSECT · EXCEPT`를 다시 확인합니다.

```text
1. 안쪽 SELECT 또는 첫 번째 SELECT 결과를 적는다.
2. Row 수와 Column 수를 확인한다.
3. NULL이 포함되는지 본다.
4. 중복을 유지하는지 제거하는지 본다.
5. 바깥 연산자 또는 집합 연산을 적용한다.
```

이번 연습의 핵심 문장은 다음입니다.

```text
양쪽 SELECT의 Column 개수와 대응 자료형이 호환되어야 한다.
```

이 과정을 반복하면 긴 SQL도 작은 결과 집합 여러 개로 나누어 읽을 수 있습니다.

객관식에서는 실제 값을 두세 개만 넣어도 `항상`, `모두`, `하나 이상`, `존재` 같은 표현의 차이를 빠르게 확인할 수 있습니다.

### 반복 연습 17. SQLite의 INTERSECT와 EXCEPT는 기본적으로 중복을 제거한 결과를 반환한다.

다음 순서로 `INTERSECT · EXCEPT`를 다시 확인합니다.

```text
1. 안쪽 SELECT 또는 첫 번째 SELECT 결과를 적는다.
2. Row 수와 Column 수를 확인한다.
3. NULL이 포함되는지 본다.
4. 중복을 유지하는지 제거하는지 본다.
5. 바깥 연산자 또는 집합 연산을 적용한다.
```

이번 연습의 핵심 문장은 다음입니다.

```text
SQLite의 INTERSECT와 EXCEPT는 기본적으로 중복을 제거한 결과를 반환한다.
```

이 과정을 반복하면 긴 SQL도 작은 결과 집합 여러 개로 나누어 읽을 수 있습니다.

객관식에서는 실제 값을 두세 개만 넣어도 `항상`, `모두`, `하나 이상`, `존재` 같은 표현의 차이를 빠르게 확인할 수 있습니다.

### 반복 연습 18. DBMS에 따라 EXCEPT 대신 MINUS라는 이름을 사용하는 경우가 있다.

다음 순서로 `INTERSECT · EXCEPT`를 다시 확인합니다.

```text
1. 안쪽 SELECT 또는 첫 번째 SELECT 결과를 적는다.
2. Row 수와 Column 수를 확인한다.
3. NULL이 포함되는지 본다.
4. 중복을 유지하는지 제거하는지 본다.
5. 바깥 연산자 또는 집합 연산을 적용한다.
```

이번 연습의 핵심 문장은 다음입니다.

```text
DBMS에 따라 EXCEPT 대신 MINUS라는 이름을 사용하는 경우가 있다.
```

이 과정을 반복하면 긴 SQL도 작은 결과 집합 여러 개로 나누어 읽을 수 있습니다.

객관식에서는 실제 값을 두세 개만 넣어도 `항상`, `모두`, `하나 이상`, `존재` 같은 표현의 차이를 빠르게 확인할 수 있습니다.

### 반복 연습 19. INTERSECT는 양쪽 결과에 모두 존재하는 Row를 반환한다.

다음 순서로 `INTERSECT · EXCEPT`를 다시 확인합니다.

```text
1. 안쪽 SELECT 또는 첫 번째 SELECT 결과를 적는다.
2. Row 수와 Column 수를 확인한다.
3. NULL이 포함되는지 본다.
4. 중복을 유지하는지 제거하는지 본다.
5. 바깥 연산자 또는 집합 연산을 적용한다.
```

이번 연습의 핵심 문장은 다음입니다.

```text
INTERSECT는 양쪽 결과에 모두 존재하는 Row를 반환한다.
```

이 과정을 반복하면 긴 SQL도 작은 결과 집합 여러 개로 나누어 읽을 수 있습니다.

객관식에서는 실제 값을 두세 개만 넣어도 `항상`, `모두`, `하나 이상`, `존재` 같은 표현의 차이를 빠르게 확인할 수 있습니다.

### 반복 연습 20. EXCEPT는 첫 번째 SELECT 결과에만 존재하는 Row를 반환한다.

다음 순서로 `INTERSECT · EXCEPT`를 다시 확인합니다.

```text
1. 안쪽 SELECT 또는 첫 번째 SELECT 결과를 적는다.
2. Row 수와 Column 수를 확인한다.
3. NULL이 포함되는지 본다.
4. 중복을 유지하는지 제거하는지 본다.
5. 바깥 연산자 또는 집합 연산을 적용한다.
```

이번 연습의 핵심 문장은 다음입니다.

```text
EXCEPT는 첫 번째 SELECT 결과에만 존재하는 Row를 반환한다.
```

이 과정을 반복하면 긴 SQL도 작은 결과 집합 여러 개로 나누어 읽을 수 있습니다.

객관식에서는 실제 값을 두세 개만 넣어도 `항상`, `모두`, `하나 이상`, `존재` 같은 표현의 차이를 빠르게 확인할 수 있습니다.

### 반복 연습 21. EXCEPT는 순서가 중요하다.

다음 순서로 `INTERSECT · EXCEPT`를 다시 확인합니다.

```text
1. 안쪽 SELECT 또는 첫 번째 SELECT 결과를 적는다.
2. Row 수와 Column 수를 확인한다.
3. NULL이 포함되는지 본다.
4. 중복을 유지하는지 제거하는지 본다.
5. 바깥 연산자 또는 집합 연산을 적용한다.
```

이번 연습의 핵심 문장은 다음입니다.

```text
EXCEPT는 순서가 중요하다.
```

이 과정을 반복하면 긴 SQL도 작은 결과 집합 여러 개로 나누어 읽을 수 있습니다.

객관식에서는 실제 값을 두세 개만 넣어도 `항상`, `모두`, `하나 이상`, `존재` 같은 표현의 차이를 빠르게 확인할 수 있습니다.

### 반복 연습 22. 양쪽 SELECT의 Column 개수와 대응 자료형이 호환되어야 한다.

다음 순서로 `INTERSECT · EXCEPT`를 다시 확인합니다.

```text
1. 안쪽 SELECT 또는 첫 번째 SELECT 결과를 적는다.
2. Row 수와 Column 수를 확인한다.
3. NULL이 포함되는지 본다.
4. 중복을 유지하는지 제거하는지 본다.
5. 바깥 연산자 또는 집합 연산을 적용한다.
```

이번 연습의 핵심 문장은 다음입니다.

```text
양쪽 SELECT의 Column 개수와 대응 자료형이 호환되어야 한다.
```

이 과정을 반복하면 긴 SQL도 작은 결과 집합 여러 개로 나누어 읽을 수 있습니다.

객관식에서는 실제 값을 두세 개만 넣어도 `항상`, `모두`, `하나 이상`, `존재` 같은 표현의 차이를 빠르게 확인할 수 있습니다.

### 반복 연습 23. SQLite의 INTERSECT와 EXCEPT는 기본적으로 중복을 제거한 결과를 반환한다.

다음 순서로 `INTERSECT · EXCEPT`를 다시 확인합니다.

```text
1. 안쪽 SELECT 또는 첫 번째 SELECT 결과를 적는다.
2. Row 수와 Column 수를 확인한다.
3. NULL이 포함되는지 본다.
4. 중복을 유지하는지 제거하는지 본다.
5. 바깥 연산자 또는 집합 연산을 적용한다.
```

이번 연습의 핵심 문장은 다음입니다.

```text
SQLite의 INTERSECT와 EXCEPT는 기본적으로 중복을 제거한 결과를 반환한다.
```

이 과정을 반복하면 긴 SQL도 작은 결과 집합 여러 개로 나누어 읽을 수 있습니다.

객관식에서는 실제 값을 두세 개만 넣어도 `항상`, `모두`, `하나 이상`, `존재` 같은 표현의 차이를 빠르게 확인할 수 있습니다.

### 반복 연습 24. DBMS에 따라 EXCEPT 대신 MINUS라는 이름을 사용하는 경우가 있다.

다음 순서로 `INTERSECT · EXCEPT`를 다시 확인합니다.

```text
1. 안쪽 SELECT 또는 첫 번째 SELECT 결과를 적는다.
2. Row 수와 Column 수를 확인한다.
3. NULL이 포함되는지 본다.
4. 중복을 유지하는지 제거하는지 본다.
5. 바깥 연산자 또는 집합 연산을 적용한다.
```

이번 연습의 핵심 문장은 다음입니다.

```text
DBMS에 따라 EXCEPT 대신 MINUS라는 이름을 사용하는 경우가 있다.
```

이 과정을 반복하면 긴 SQL도 작은 결과 집합 여러 개로 나누어 읽을 수 있습니다.

객관식에서는 실제 값을 두세 개만 넣어도 `항상`, `모두`, `하나 이상`, `존재` 같은 표현의 차이를 빠르게 확인할 수 있습니다.

### 반복 연습 25. INTERSECT는 양쪽 결과에 모두 존재하는 Row를 반환한다.

다음 순서로 `INTERSECT · EXCEPT`를 다시 확인합니다.

```text
1. 안쪽 SELECT 또는 첫 번째 SELECT 결과를 적는다.
2. Row 수와 Column 수를 확인한다.
3. NULL이 포함되는지 본다.
4. 중복을 유지하는지 제거하는지 본다.
5. 바깥 연산자 또는 집합 연산을 적용한다.
```

이번 연습의 핵심 문장은 다음입니다.

```text
INTERSECT는 양쪽 결과에 모두 존재하는 Row를 반환한다.
```

이 과정을 반복하면 긴 SQL도 작은 결과 집합 여러 개로 나누어 읽을 수 있습니다.

객관식에서는 실제 값을 두세 개만 넣어도 `항상`, `모두`, `하나 이상`, `존재` 같은 표현의 차이를 빠르게 확인할 수 있습니다.

### 반복 연습 26. EXCEPT는 첫 번째 SELECT 결과에만 존재하는 Row를 반환한다.

다음 순서로 `INTERSECT · EXCEPT`를 다시 확인합니다.

```text
1. 안쪽 SELECT 또는 첫 번째 SELECT 결과를 적는다.
2. Row 수와 Column 수를 확인한다.
3. NULL이 포함되는지 본다.
4. 중복을 유지하는지 제거하는지 본다.
5. 바깥 연산자 또는 집합 연산을 적용한다.
```

이번 연습의 핵심 문장은 다음입니다.

```text
EXCEPT는 첫 번째 SELECT 결과에만 존재하는 Row를 반환한다.
```

이 과정을 반복하면 긴 SQL도 작은 결과 집합 여러 개로 나누어 읽을 수 있습니다.

객관식에서는 실제 값을 두세 개만 넣어도 `항상`, `모두`, `하나 이상`, `존재` 같은 표현의 차이를 빠르게 확인할 수 있습니다.

### 반복 연습 27. EXCEPT는 순서가 중요하다.

다음 순서로 `INTERSECT · EXCEPT`를 다시 확인합니다.

```text
1. 안쪽 SELECT 또는 첫 번째 SELECT 결과를 적는다.
2. Row 수와 Column 수를 확인한다.
3. NULL이 포함되는지 본다.
4. 중복을 유지하는지 제거하는지 본다.
5. 바깥 연산자 또는 집합 연산을 적용한다.
```

이번 연습의 핵심 문장은 다음입니다.

```text
EXCEPT는 순서가 중요하다.
```

이 과정을 반복하면 긴 SQL도 작은 결과 집합 여러 개로 나누어 읽을 수 있습니다.

객관식에서는 실제 값을 두세 개만 넣어도 `항상`, `모두`, `하나 이상`, `존재` 같은 표현의 차이를 빠르게 확인할 수 있습니다.

### 반복 연습 28. 양쪽 SELECT의 Column 개수와 대응 자료형이 호환되어야 한다.

다음 순서로 `INTERSECT · EXCEPT`를 다시 확인합니다.

```text
1. 안쪽 SELECT 또는 첫 번째 SELECT 결과를 적는다.
2. Row 수와 Column 수를 확인한다.
3. NULL이 포함되는지 본다.
4. 중복을 유지하는지 제거하는지 본다.
5. 바깥 연산자 또는 집합 연산을 적용한다.
```

이번 연습의 핵심 문장은 다음입니다.

```text
양쪽 SELECT의 Column 개수와 대응 자료형이 호환되어야 한다.
```

이 과정을 반복하면 긴 SQL도 작은 결과 집합 여러 개로 나누어 읽을 수 있습니다.

객관식에서는 실제 값을 두세 개만 넣어도 `항상`, `모두`, `하나 이상`, `존재` 같은 표현의 차이를 빠르게 확인할 수 있습니다.

### 반복 연습 29. SQLite의 INTERSECT와 EXCEPT는 기본적으로 중복을 제거한 결과를 반환한다.

다음 순서로 `INTERSECT · EXCEPT`를 다시 확인합니다.

```text
1. 안쪽 SELECT 또는 첫 번째 SELECT 결과를 적는다.
2. Row 수와 Column 수를 확인한다.
3. NULL이 포함되는지 본다.
4. 중복을 유지하는지 제거하는지 본다.
5. 바깥 연산자 또는 집합 연산을 적용한다.
```

이번 연습의 핵심 문장은 다음입니다.

```text
SQLite의 INTERSECT와 EXCEPT는 기본적으로 중복을 제거한 결과를 반환한다.
```

이 과정을 반복하면 긴 SQL도 작은 결과 집합 여러 개로 나누어 읽을 수 있습니다.

객관식에서는 실제 값을 두세 개만 넣어도 `항상`, `모두`, `하나 이상`, `존재` 같은 표현의 차이를 빠르게 확인할 수 있습니다.

### 반복 연습 30. DBMS에 따라 EXCEPT 대신 MINUS라는 이름을 사용하는 경우가 있다.

다음 순서로 `INTERSECT · EXCEPT`를 다시 확인합니다.

```text
1. 안쪽 SELECT 또는 첫 번째 SELECT 결과를 적는다.
2. Row 수와 Column 수를 확인한다.
3. NULL이 포함되는지 본다.
4. 중복을 유지하는지 제거하는지 본다.
5. 바깥 연산자 또는 집합 연산을 적용한다.
```

이번 연습의 핵심 문장은 다음입니다.

```text
DBMS에 따라 EXCEPT 대신 MINUS라는 이름을 사용하는 경우가 있다.
```

이 과정을 반복하면 긴 SQL도 작은 결과 집합 여러 개로 나누어 읽을 수 있습니다.

객관식에서는 실제 값을 두세 개만 넣어도 `항상`, `모두`, `하나 이상`, `존재` 같은 표현의 차이를 빠르게 확인할 수 있습니다.

## 다음에 이을 글

**집계 함수 · GROUP BY**입니다.

집합 연산 뒤에 이어서 Row를 그룹화하고 COUNT, SUM, AVG 같은 집계 함수를 사용하는 방법을 알아봅니다.
