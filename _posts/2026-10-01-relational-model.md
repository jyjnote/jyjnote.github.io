---
title: 관계 모델 · Relation
date: 2026-10-01 12:25:00 +0900
slug: relational-model
permalink: /posts/relational-model/
categories: [CS, 데이터베이스]
tags: [관계모델, Relation, Tuple, Attribute, Domain, Degree, Cardinality, 데이터베이스, 정보처리기사, NCS]
math: true
---

관계 모델은 데이터를 **Relation이라는 구조로 표현하는 데이터 모델**입니다.

Relation은 Tuple과 Attribute로 구성되며, 각 Attribute가 가질 수 있는 값의 범위를 Domain이라고 합니다.

<blockquote class="prompt-info">
<p>한 줄: Relation은 Tuple의 집합이고, Tuple은 Attribute 값들의 묶음입니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

Relation = Tuple의 집합, Tuple = 한 행, Attribute = 속성, Domain = 허용 값의 범위입니다.

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

이 글에서는 `EMPLOYEE`와 `DEPARTMENT`를 관계 모델 관점에서 봅니다.

## 가장 먼저 큰 그림

관계 모델의 핵심 용어를 먼저 연결하면 다음과 같습니다.

| 관계 모델 | SQL에서 익숙한 표현 |
| --- | --- |
| Relation | Table |
| Tuple | Row |
| Attribute | Column |
| Domain | Column이 가질 수 있는 값의 범위 |

<mark>시험에서는 Table · Row · Column보다 Relation · Tuple · Attribute라는 용어가 자주 등장합니다.</mark>

## Relation

Relation은 같은 Attribute 구조를 가진 Tuple들의 집합입니다.

EMPLOYEE를 관계 모델 관점에서 보면 하나의 Relation으로 생각할 수 있습니다.

```text
EMPLOYEE Relation
→ 직원 Tuple들의 집합
```

예를 들어 다음과 같은 구조입니다.

| EMP_ID | EMP_NAME | DEPT_ID | SALARY |
| ---: | --- | ---: | ---: |
| 1001 | 직원1 | 10 | 2890 |
| 1002 | 직원2 | 20 | 2980 |
| 1003 | 직원3 | 30 | 3070 |

## Tuple

Tuple은 Relation을 구성하는 하나의 데이터 항목입니다.

다음 한 줄이 하나의 Tuple입니다.

```text
1001 | 직원1 | 10 | 2890
```

SQL의 Row와 연결해서 생각하면 쉽습니다.

```text
Tuple
→ Row
→ 데이터 한 건
```

## Attribute

Attribute는 Relation을 구성하는 속성입니다.

EMPLOYEE의 Attribute는 다음과 같습니다.

```text
EMP_ID
EMP_NAME
DEPT_ID
SALARY
```

SQL의 Column과 연결됩니다.

```text
Attribute
→ Column
→ 데이터 속성
```

## Domain

Domain은 하나의 Attribute가 가질 수 있는 값의 범위입니다.

예를 들어 `SALARY`가 정수형 급여를 저장한다고 해봅시다.

```text
SALARY의 Domain
→ 허용되는 급여 값의 범위
```

`REGION`이라면 개념적으로 지역 이름들의 집합이 Domain이 될 수 있습니다.

```text
REGION
→ 서울, 부산, 대전, 광주 ...
```

Domain은 자료형보다 넓은 개념입니다.

자료형뿐 아니라 실제 허용 가능한 값의 범위까지 포함해서 생각할 수 있습니다.

## Relation Schema

Relation의 구조를 정의한 것을 Relation Schema라고 합니다.

예를 들어 다음처럼 표현할 수 있습니다.

```text
EMPLOYEE(
    EMP_ID,
    EMP_NAME,
    DEPT_ID,
    SALARY
)
```

이것은 어떤 Attribute들로 Relation이 구성되는지를 나타냅니다.

실제 Tuple 값 자체와는 구분합니다.

## Relation Instance

특정 시점에 Relation 안에 실제로 들어 있는 Tuple들의 집합을 Relation Instance라고 볼 수 있습니다.

```text
Relation Schema
→ 구조

Relation Instance
→ 현재 저장된 실제 Tuple들
```

Schema는 상대적으로 구조를 나타내고, Instance는 현재 데이터 상태를 나타냅니다.

## Degree · 차수

Relation이 가진 Attribute의 개수를 `Degree` 또는 차수라고 합니다.

예를 들어

```text
EMPLOYEE(
    EMP_ID,
    EMP_NAME,
    DEPT_ID,
    SALARY
)
```

라면 Attribute가 4개입니다.

```text
Degree
→ 4
```

<mark>Degree는 Column 개수라고 연결해서 기억하면 쉽습니다.</mark>

## Cardinality · 카디널리티

Relation에 포함된 Tuple의 개수를 `Cardinality`라고 합니다.

예를 들어 EMPLOYEE에 직원 데이터가 50건 있다면

```text
Cardinality
→ 50
```

입니다.

즉 다음처럼 연결합니다.

```text
Degree
→ Attribute 수
→ Column 수

Cardinality
→ Tuple 수
→ Row 수
```

## Degree와 Cardinality 비교

| 구분 | 의미 | SQL식 연결 |
| --- | --- | --- |
| Degree | Attribute 개수 | Column 수 |
| Cardinality | Tuple 개수 | Row 수 |

시험에서 자주 뒤바뀌므로 반드시 구분해야 합니다.

## Relation의 Tuple 순서

수학적인 Relation에서 Tuple의 순서는 의미가 없습니다.

```text
Tuple A
Tuple B
Tuple C
```

와

```text
Tuple C
Tuple A
Tuple B
```

는 같은 Tuple 집합이라면 Relation 관점에서 순서 때문에 다른 Relation이 되는 것은 아닙니다.

SQL 조회 결과의 정렬이 필요하면 `ORDER BY`를 사용합니다.


## Relation에는 중복 Tuple이 없다

수학적인 관계 모델에서 Relation은 집합이므로 동일한 Tuple이 중복되지 않습니다.

```text
Relation
→ Tuple의 집합
→ 동일 Tuple 중복 없음
```

하지만 실제 SQL Table은 제약조건이 없다면 완전히 같은 값 조합의 Row가 존재할 수 있습니다.

이 때문에 **수학적 Relation과 SQL Table은 완전히 같은 개념은 아닙니다.**

<blockquote class="prompt-warning">
<p>관계 모델의 Relation은 집합이므로 중복 Tuple이 없지만, 실제 SQL Table은 제약조건에 따라 중복 Row가 존재할 수 있습니다.</p>
</blockquote>


## Key와 Relation

Relation에서 Tuple을 유일하게 식별하기 위해 Key 개념이 중요합니다.

예를 들어 EMPLOYEE의 `EMP_ID`가 각 Tuple을 유일하게 구별할 수 있습니다.

```text
EMP_ID
→ Tuple 식별
```

이후 배우는 Super Key, Candidate Key, Primary Key가 Relation과 직접 연결됩니다.

## Foreign Key와 Relation 사이 관계

Relation은 서로 독립적으로만 존재하지 않습니다.

EMPLOYEE와 DEPARTMENT를 예로 들면

```text
EMPLOYEE.DEPT_ID
→ DEPARTMENT.DEPT_ID 참조
```

처럼 한 Relation의 Attribute가 다른 Relation의 Key를 참조할 수 있습니다.

이것이 관계형 데이터베이스에서 Table 사이의 관계를 표현하는 기본 방법입니다.


## 관계 모델 핵심 구조

전체를 한 번에 정리하면 다음과 같습니다.

```text
Relation
├─ Attribute
├─ Attribute
└─ Attribute

Relation 내부
├─ Tuple
├─ Tuple
└─ Tuple

Attribute마다
→ Domain 존재
```

## 잘 놓치는 핵심

### 1. Relation은 Tuple의 집합이다

SQL의 Table과 연결해서 이해합니다.

### 2. Tuple은 Row다

하나의 데이터 항목입니다.

### 3. Attribute는 Column이다

데이터의 속성입니다.

### 4. Domain은 허용 값의 범위다

단순 자료형보다 넓게 생각할 수 있습니다.

### 5. Degree는 Attribute 수다

```text
Degree
→ Column 수
```

### 6. Cardinality는 Tuple 수다

```text
Cardinality
→ Row 수
```

## 시험·면접

### 핵심 암기

```text
Relation → Table
Tuple → Row
Attribute → Column
Domain → 허용 값의 범위
```

### Degree · Cardinality

```text
Degree
→ Attribute 수

Cardinality
→ Tuple 수
```

### 시험 함정 1

Degree와 Cardinality를 반대로 외우면 안 됩니다.

### 시험 함정 2

수학적 Relation에서는 동일한 Tuple의 중복을 허용하지 않습니다.

### 시험 함정 3

Relation과 SQL Table은 매우 밀접하지만 완전히 동일한 개념이라고 단정하면 안 됩니다.

### 면접에서 짧게 답한다면

관계 모델은 데이터를 Relation으로 표현하며, Relation은 Tuple의 집합으로 구성됩니다.

Tuple은 Row, Attribute는 Column에 대응하고, Domain은 각 Attribute가 가질 수 있는 값의 범위를 의미합니다. 또한 Degree는 Attribute 수, Cardinality는 Tuple 수입니다.

## 객관식 문제

### 1. Relation과 가장 가까운 SQL 개념은?

① Row  
② Table  
③ Column  
④ NULL

<details>
<summary>정답</summary>

②

</details>

### 2. Tuple과 가장 가까운 SQL 개념은?

① Table  
② Row  
③ Column  
④ Schema

<details>
<summary>정답</summary>

②

</details>

### 3. Attribute와 가장 가까운 SQL 개념은?

① Column  
② Row  
③ Transaction  
④ Index

<details>
<summary>정답</summary>

①

</details>

### 4. Degree의 의미는?

① Tuple 수  
② Attribute 수  
③ Table 수  
④ Database 수

<details>
<summary>정답</summary>

②

</details>

### 5. Cardinality의 의미는?

① Tuple 수  
② Attribute 수  
③ Domain 수  
④ Index 수

<details>
<summary>정답</summary>

①

</details>

### 6. 관계 모델의 Relation에 대한 설명으로 옳은 것은?

① Tuple 순서가 핵심이다.  
② 동일 Tuple의 중복을 기본적으로 허용하는 집합이다.  
③ Tuple의 집합으로 볼 수 있다.  
④ Attribute가 존재할 수 없다.

<details>
<summary>정답</summary>

③

</details>

## 다음에 이을 글

**데이터베이스 기초 실전 문제**입니다.  
데이터베이스 개념, DBMS, RDB, Table · Row · Column, Schema, Relation을 한 번에 연습합니다.
