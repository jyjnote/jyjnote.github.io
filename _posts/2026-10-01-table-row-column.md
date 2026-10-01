---
title: Table · Row · Column
date: 2026-10-01 12:20:00 +0900
slug: table-row-column
permalink: /posts/table-row-column/
categories: [CS, 데이터베이스]
tags: [Table, Row, Column, Relation, Tuple, Attribute, 데이터베이스, 정보처리기사, NCS]
math: true
---

`Table`, `Row`, `Column`은 관계형 데이터베이스를 이해할 때 가장 먼저 잡아야 하는 기본 구조입니다.

Table은 데이터를 모아 둔 구조이고, Row는 하나의 데이터 항목, Column은 각 데이터의 속성을 나타냅니다.

<blockquote class="prompt-info">
<p>한 줄: Table은 전체 구조, Row는 한 건의 데이터, Column은 데이터의 속성입니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

Table = 데이터 집합, Row = 한 건, Column = 속성입니다.

</details>

## 실습 데이터 전체 보기

아래 실습 데이터베이스를 기준으로 설명합니다.

<div style="width:100%; overflow:hidden; border:1px solid var(--main-border-color,#ddd); border-radius:12px; margin:1rem 0;">
<iframe
  src="https://docs.google.com/spreadsheets/d/1mtu6pFcGyOfwpFizaJskfFD87GxyjAmB/preview"
  width="100%"
  height="500"
  style="border:0;"
  loading="lazy">
</iframe>
</div>

이 글에서는 `EMPLOYEE` Table을 중심으로 봅니다.

## 가장 먼저 구조 보기

EMPLOYEE 일부를 단순화하면 다음과 같습니다.

| EMP_ID | EMP_NAME | DEPT_ID | SALARY |
| ---: | --- | ---: | ---: |
| 1001 | 직원1 | 10 | 2890 |
| 1002 | 직원2 | 20 | 2980 |
| 1003 | 직원3 | 30 | 3070 |

이 표 전체가 하나의 `Table`입니다.

가로 한 줄은 `Row`, 세로 한 칸의 종류는 `Column`입니다.

```text
Table
├─ Row
├─ Row
└─ Row

각 Row는
→ 여러 Column 값으로 구성
```

<mark>Table 안에서 Row는 데이터 한 건을, Column은 그 데이터가 가진 속성을 나타냅니다.</mark>

## Table

예를 들어 `EMPLOYEE` Table에는 직원 정보가 저장됩니다.

```text
EMPLOYEE
→ 직원 데이터 집합
```

다른 예시는 다음과 같습니다.

```text
DEPARTMENT
→ 부서 데이터

CUSTOMER
→ 고객 데이터

PRODUCT
→ 상품 데이터

ORDERS
→ 주문 데이터
```

## Row

Row는 Table 안의 **하나의 데이터 항목**입니다.

EMPLOYEE에서 다음 한 줄을 봅시다.

```text
1001 | 직원1 | 10 | 2890
```

이 한 줄이 하나의 Row입니다.

```text
Row 1개
→ 직원 한 명의 정보
```

CUSTOMER Table이라면 Row 하나는 고객 한 명을 나타낼 수 있습니다.

ORDERS Table이라면 Row 하나는 주문 한 건을 나타낼 수 있습니다.

## Column

Column은 각 Row가 어떤 종류의 값을 가지는지 정의합니다.

EMPLOYEE의 예를 보면 다음과 같습니다.

| Column | 의미 |
| --- | --- |
| EMP_ID | 직원 번호 |
| EMP_NAME | 직원 이름 |
| DEPT_ID | 부서 번호 |
| SALARY | 급여 |

즉 Column은 데이터의 속성을 표현합니다.

```text
EMP_ID
→ 직원 번호라는 속성

SALARY
→ 급여라는 속성
```

## Row와 Column을 같이 보기

다음 Row가 있다고 해봅시다.

```text
1001 | 직원1 | 10 | 2890
```

각 값은 Column과 연결됩니다.

```text
EMP_ID
→ 1001

EMP_NAME
→ 직원1

DEPT_ID
→ 10

SALARY
→ 2890
```

따라서 Row 하나는 여러 Column 값의 묶음입니다.

## Table의 구조

Table은 크게 두 관점으로 볼 수 있습니다.

```text
Column
→ 어떤 속성을 저장할 것인가

Row
→ 실제 데이터가 몇 건 있는가
```

Column은 구조를 만들고, Row는 실제 데이터를 채웁니다.

## Column 이름

Column에는 이름이 있습니다.

예를 들어

```text
EMP_ID
EMP_NAME
DEPT_ID
SALARY
```

입니다.

SQL에서는 Column 이름을 이용해 원하는 데이터만 조회할 수 있습니다.

```sql
SELECT EMP_NAME, SALARY
FROM EMPLOYEE;
```

이 SQL은 EMPLOYEE Table에서 `EMP_NAME`, `SALARY` Column만 선택합니다.

## Row 선택

Row는 WHERE 조건을 이용해 선택할 수 있습니다.

```sql
SELECT EMP_ID, EMP_NAME
FROM EMPLOYEE
WHERE DEPT_ID = 10;
```

이 SQL은 `DEPT_ID = 10`인 Row만 결과에 남깁니다.

기본 연결은 다음과 같습니다.

```text
SELECT
→ Column 선택

FROM
→ Table 선택

WHERE
→ Row 선택
```

## Column의 자료형

Column은 어떤 종류의 값을 저장할지도 정할 수 있습니다.

예를 들어 다음과 같습니다.

```sql
CREATE TABLE DEPARTMENT(
    DEPT_ID INTEGER PRIMARY KEY,
    DEPT_NAME TEXT NOT NULL,
    REGION TEXT
);
```

여기서

```text
DEPT_ID
→ INTEGER

DEPT_NAME
→ TEXT

REGION
→ TEXT
```

처럼 Column마다 자료형이 지정됩니다.


## Primary Key와 Row

Table의 각 Row를 구별하기 위해 Primary Key를 사용할 수 있습니다.

EMPLOYEE에서는 `EMP_ID`가 Primary Key입니다.

```text
EMP_ID
→ 각 직원 Row 식별
```

따라서 서로 다른 직원 Row가 같은 EMP_ID를 가질 수 없습니다.

Primary Key는 뒤의 Key 파트에서 자세히 다룹니다.

## Foreign Key와 Column

Column은 다른 Table과의 관계를 나타내기도 합니다.

EMPLOYEE의 `DEPT_ID`는 DEPARTMENT의 `DEPT_ID`를 참조합니다.

```text
EMPLOYEE.DEPT_ID
→ DEPARTMENT.DEPT_ID 참조
```

이처럼 Column은 단순한 값 저장뿐 아니라 Table 사이의 관계도 표현할 수 있습니다.

## Table과 Relation

관계형 데이터베이스에서 Table은 관계 모델의 `Relation`을 구현한 형태로 이해할 수 있습니다.

개념적으로 다음처럼 연결합니다.

```text
Table
→ Relation

Row
→ Tuple

Column
→ Attribute
```

다만 실제 SQL Table과 수학적인 Relation은 완전히 동일한 개념은 아닙니다.

이 차이는 다음 글에서 자세히 다룹니다.

## Row 순서는 의미가 있는가

관계형 모델에서는 Row의 물리적인 순서 자체에 의미를 두지 않습니다.

따라서 조회 결과의 순서가 필요하다면 `ORDER BY`를 사용해야 합니다.

```sql
SELECT *
FROM EMPLOYEE
ORDER BY EMP_ID;
```

<blockquote class="prompt-warning">
<p>Table에 현재 보이는 Row 순서가 항상 유지된다고 생각하면 안 됩니다. 순서가 필요하면 ORDER BY를 명시합니다.</p>
</blockquote>


## Table · Row · Column 비교

| 구분 | 의미 | 예 |
| --- | --- | --- |
| Table | 데이터 집합 | EMPLOYEE |
| Row | 데이터 한 건 | 직원1 정보 |
| Column | 데이터 속성 | SALARY |

가장 단순하게 기억하면 다음과 같습니다.

```text
Table
→ 무엇의 데이터인가

Row
→ 한 건은 무엇인가

Column
→ 어떤 속성을 가지는가
```

## 잘 놓치는 핵심

### 1. Row는 한 건의 데이터다

직원 Table에서는 직원 한 명이 한 Row가 될 수 있습니다.

### 2. Column은 속성이다

직원 번호, 이름, 부서 번호, 급여처럼 데이터의 항목을 정의합니다.

### 3. Table은 Row와 Column으로 구성된다

구조와 실제 데이터가 함께 존재합니다.

### 4. Row 순서를 믿으면 안 된다

정렬이 필요하면 ORDER BY를 사용합니다.

### 5. Table · Row · Column은 Relation · Tuple · Attribute와 연결된다

다음 글의 핵심 연결입니다.

## 시험·면접

### 핵심 암기

```text
Table
→ 데이터 집합

Row
→ 데이터 한 건

Column
→ 데이터 속성
```

### 관계 모델 용어 연결

```text
Table → Relation
Row → Tuple
Column → Attribute
```

### 시험 함정 1

Row는 Column의 이름을 의미하지 않습니다.

Row는 실제 데이터 한 건입니다.

### 시험 함정 2

Column은 Row 개수를 의미하지 않습니다.

데이터의 속성을 의미합니다.

### 시험 함정 3

Table의 물리적인 Row 순서가 항상 보장되는 것은 아닙니다.

### 면접에서 짧게 답한다면

Table은 같은 구조를 가진 데이터를 모아 놓은 단위이고, Row는 하나의 데이터 항목, Column은 각 데이터가 가진 속성을 의미합니다.

관계 모델에서는 각각 Relation, Tuple, Attribute에 대응해서 이해할 수 있습니다.

## 객관식 문제

### 1. Row의 의미로 가장 적절한 것은?

① 데이터의 속성 이름  
② 데이터 한 건  
③ 전체 데이터베이스  
④ 권한 정보

<details>
<summary>정답</summary>

②

</details>

### 2. Column의 의미로 가장 적절한 것은?

① 데이터의 속성  
② Table 전체  
③ Transaction  
④ 사용자 권한

<details>
<summary>정답</summary>

①

</details>

### 3. EMPLOYEE 전체 구조는 무엇에 해당하는가?

① Row  
② Column  
③ Table  
④ NULL

<details>
<summary>정답</summary>

③

</details>

### 4. 관계 모델의 Tuple과 가장 가까운 것은?

① Table  
② Row  
③ Column  
④ Schema 전체

<details>
<summary>정답</summary>

②

</details>

### 5. Row 순서가 필요할 때 사용하는 SQL 절은?

① ORDER BY  
② DROP  
③ GRANT  
④ COMMIT

<details>
<summary>정답</summary>

①

</details>

### 6. Table · Row · Column의 연결로 옳은 것은?

① Table-속성, Row-전체 구조, Column-한 건  
② Table-데이터 집합, Row-한 건, Column-속성  
③ Table-권한, Row-Transaction, Column-Index  
④ 모두 같은 의미

<details>
<summary>정답</summary>

②

</details>

## 다음에 이을 글

**Schema**입니다.  
Table의 Column, 자료형, 제약조건 등 데이터베이스 구조를 정의하는 Schema를 알아봅니다.
