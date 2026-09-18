---
title: Domain Integrity · 도메인 무결성
date: 2026-09-18 21:10:00 +0900
slug: domain-integrity
permalink: /posts/domain-integrity/
categories: [CS, 데이터베이스]
tags: [DomainIntegrity, 도메인무결성, Constraint, DataType, CHECK, NOTNULL, DEFAULT, 정보처리기사, NCS]
math: true
---

도메인 무결성(Domain Integrity)은 **각 Column에 허용되는 값의 형식과 범위를 지키도록 하는 규칙**입니다.

쉽게 말하면 Column에 아무 값이나 들어가지 못하게 하는 것입니다.

<blockquote class="prompt-info">
<p>한 줄: 도메인 무결성은 각 Column에 정해진 형식과 범위의 값만 저장되도록 하는 규칙입니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

Domain Integrity = Column에 허용된 값만 저장하도록 하는 규칙입니다.

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

이 글에서는 `EMPLOYEE`, `CUSTOMER`, `PRODUCT`를 중심으로 봅니다.

## 핵심 예시

EMPLOYEE 일부입니다.

| EMP_ID | EMP_NAME | SALARY |
| ---: | --- | ---: |
| 1001 | 직원1 | 2890 |
| 1002 | 직원2 | 2980 |
| 1003 | 직원3 | 3070 |

`SALARY`는 급여를 저장하는 Column입니다.

따라서 일반적으로 숫자 값이 들어가야 합니다.

```text
SALARY = 3000
→ 정상
```

반면 다음 값은 적절하지 않습니다.

```text
SALARY = '서울'
```

급여 Column의 의미와 값의 범위에 맞지 않기 때문입니다.

<mark>도메인 무결성은 각 Column이 자신에게 허용된 값만 가지도록 제한합니다.</mark>

## Domain이란

Domain은 하나의 Attribute가 가질 수 있는 값의 집합입니다.

예를 들어 `SALARY`의 Domain을 단순하게 표현하면 다음과 같습니다.

```text
정수
0 이상
```

`GENDER`라면 다음처럼 허용값을 정할 수도 있습니다.

```text
M
F
```

`GRADE`라면 다음처럼 정할 수 있습니다.

```text
VIP
GOLD
SILVER
BRONZE
```

이 허용 가능한 값의 범위가 Domain입니다.


## Data Type

도메인 무결성을 지키는 가장 기본적인 방법은 Data Type입니다.

예를 들어

```text
EMP_ID → INTEGER
EMP_NAME → TEXT
SALARY → INTEGER
```

처럼 Column마다 값의 종류를 정합니다.

SQL에서는 다음처럼 정의할 수 있습니다.

```sql
CREATE TABLE EMPLOYEE(
    EMP_ID INTEGER,
    EMP_NAME TEXT,
    SALARY INTEGER
);
```

Data Type은 허용 가능한 값의 형태를 제한합니다.

## NOT NULL

`NOT NULL`은 반드시 값이 있어야 하는 Column에 사용합니다.

예를 들어 직원 이름은 반드시 있어야 한다고 해봅시다.

```sql
EMP_NAME TEXT NOT NULL
```

그러면 다음 값은 허용하지 않습니다.

```text
EMP_NAME = NULL
```

즉 NULL 허용 여부도 Column의 Domain 규칙과 연결됩니다.

## CHECK

`CHECK`는 값의 조건을 직접 지정할 수 있습니다.

예를 들어 급여가 0 이상이어야 한다면 다음처럼 정의할 수 있습니다.

```sql
SALARY INTEGER CHECK(SALARY >= 0)
```

그러면

```text
SALARY = 3000
→ 허용
```

하지만

```text
SALARY = -100
→ 허용 안 함
```

입니다.

## 허용값 제한

특정 값만 허용할 수도 있습니다.

예를 들어 고객 등급을 제한한다고 해봅시다.

```sql
GRADE TEXT CHECK(
    GRADE IN ('VIP', 'GOLD', 'SILVER', 'BRONZE')
)
```

이 경우

```text
VIP
GOLD
SILVER
BRONZE
```

만 허용됩니다.

다음 값은 허용되지 않습니다.

```text
DIAMOND
```

## DEFAULT

값이 입력되지 않았을 때 사용할 기본값을 지정합니다.

```sql
STATUS TEXT DEFAULT 'READY'
```

DEFAULT도 Column 값의 규칙을 정하는 요소 중 하나입니다.


## PRODUCT와 가격

PRODUCT의 `PRICE`는 가격을 저장합니다.

가격은 일반적으로 음수가 되면 안 됩니다.

예를 들어 다음과 같은 제약을 둘 수 있습니다.

```sql
PRICE INTEGER CHECK(PRICE >= 0)
```

정상:

```text
PRICE = 10000
```

비정상:

```text
PRICE = -5000
```

이런 값 범위 제한이 도메인 무결성입니다.

## 도메인 무결성과 개체 무결성

두 개념은 중심이 다릅니다.

| 구분 | 도메인 무결성 | 개체 무결성 |
| --- | --- | --- |
| 중심 | Column 값 | Primary Key |
| 핵심 | 허용된 형식과 범위 | Primary Key는 NULL 불가 |
| 목적 | 올바른 값 저장 | Row 식별 보장 |
| 예시 | SALARY는 0 이상 | EMP_ID는 NULL 불가 |

핵심은 다음처럼 구분합니다.

```text
도메인 무결성 → Column 값
개체 무결성 → Primary Key
```

## 도메인 무결성과 참조 무결성

참조 무결성은 Table 사이 관계를 다룹니다.

도메인 무결성은 하나의 Column에 들어가는 값 자체를 다룹니다.

| 구분 | 도메인 무결성 | 참조 무결성 |
| --- | --- | --- |
| 중심 | Column | Foreign Key |
| 핵심 | 값의 형식·범위 | 존재하는 부모 Key 참조 |
| 목적 | 값의 적합성 | 관계의 적합성 |

정리하면 다음과 같습니다.

```text
도메인 무결성
→ 값 자체가 올바른가

참조 무결성
→ 참조 관계가 올바른가
```

## 대표적인 도메인 제약 방법

도메인 무결성과 관련된 대표적인 방법은 다음과 같습니다.

- Data Type
- NOT NULL
- CHECK
- DEFAULT
- 허용값 목록
- 값의 범위 제한

DBMS에 따라 세부 기능은 다를 수 있지만 핵심 목적은 같습니다.

Column에 잘못된 값이 들어오는 것을 막는 것입니다.

## 잘 놓치는 핵심

### 1. Domain은 허용 가능한 값의 집합이다

```text
Domain
= Attribute가 가질 수 있는 값의 범위
```

### 2. Data Type만 의미하는 것은 아니다

자료형뿐 아니라 값의 범위와 조건도 포함할 수 있습니다.

### 3. CHECK가 대표적인 도메인 제약이다

```sql
CHECK(SALARY >= 0)
```

처럼 값의 조건을 직접 정의할 수 있습니다.

### 4. NOT NULL도 값의 허용 범위를 제한한다

NULL을 허용할지 여부도 Column 규칙입니다.

### 5. 다른 무결성과 구분한다

```text
개체 무결성
→ Primary Key

참조 무결성
→ Foreign Key

도메인 무결성
→ Column 값
```

## 시험·면접

### 핵심 암기

```text
도메인 무결성
= Column에 허용된 값만 저장
```

### 대표 수단

```text
Data Type
NOT NULL
CHECK
DEFAULT
```

### 시험 함정

다음 문장은 틀렸습니다.

```text
도메인 무결성은 Foreign Key가 부모 Table을 참조하는 규칙이다.
```

이것은 참조 무결성입니다.

### 자주 나오는 비교

```text
개체 무결성
→ Primary Key

참조 무결성
→ Foreign Key

도메인 무결성
→ Attribute 값의 범위
```

### 면접에서 짧게 답한다면

도메인 무결성은 각 Column에 미리 정의된 형식과 범위의 값만 저장되도록 보장하는 규칙입니다.

Data Type, NOT NULL, CHECK, DEFAULT 같은 제약조건을 이용해 잘못된 값이 들어오는 것을 제한할 수 있습니다.


## 객관식 문제

### 1. 도메인 무결성의 핵심은?

① Table 사이 JOIN  
② Column에 허용된 값만 저장  
③ Primary Key 삭제  
④ Index 생성

<details>
<summary>정답</summary>

②

</details>

### 2. Domain의 의미로 가장 적절한 것은?

① Table의 개수  
② Attribute가 가질 수 있는 값의 범위  
③ Primary Key 개수  
④ JOIN 결과

<details>
<summary>정답</summary>

②

</details>

### 3. 다음 중 도메인 무결성과 가장 관련이 깊은 것은?

① CHECK  
② JOIN  
③ FOREIGN KEY만  
④ ORDER BY

<details>
<summary>정답</summary>

①

</details>

### 4. SALARY가 0 이상이어야 할 때 적절한 제약은?

① CHECK(SALARY >= 0)  
② ORDER BY SALARY  
③ DROP SALARY  
④ JOIN SALARY

<details>
<summary>정답</summary>

①

</details>

### 5. 개체 무결성과 도메인 무결성의 연결로 옳은 것은?

① 개체 무결성 - Primary Key, 도메인 무결성 - Column 값  
② 개체 무결성 - Foreign Key, 도메인 무결성 - JOIN  
③ 둘 다 Index만 관련  
④ 둘은 완전히 같은 개념

<details>
<summary>정답</summary>

①

</details>

### 6. 다음 중 도메인 무결성을 지키는 방법으로 보기 어려운 것은?

① Data Type  
② NOT NULL  
③ CHECK  
④ INNER JOIN

<details>
<summary>정답</summary>

④

</details>

## 다음에 이을 글

**SQL 개념**입니다.  
데이터베이스의 구조와 데이터를 정의·조회·수정·제어하는 SQL의 전체 구조를 알아봅니다.
