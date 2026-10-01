---
title: Entity · Attribute · Relationship
date: 2026-09-18 23:45:00 +0900
slug: entity-attribute-relationship
permalink: /posts/entity-attribute-relationship/
categories: [CS, 데이터베이스]
tags: [Entity, Attribute, Relationship, ERModel, ERD, 데이터모델링, 정보처리기사, NCS]
math: true
---

`Entity`, `Attribute`, `Relationship`은 <mark>ER Model을 구성하는 가장 기본적인 세 요소</mark>입니다.

각각 **관리할 대상**, **대상이 가진 정보**, **대상 사이의 관계**를 의미합니다.

<blockquote class="prompt-info">
<p>한 줄: Entity는 대상, Attribute는 속성, Relationship은 대상 사이의 연결입니다.</p>
</blockquote>

<details markdown="1">
<summary>한 줄로</summary>

Entity = 대상, Attribute = 속성, Relationship = 관계입니다.

</details>

## Entity

`Entity`는 데이터베이스에서 관리하려는 현실 세계의 대상입니다.

예를 들어 쇼핑몰에서는 다음과 같은 대상이 Entity가 될 수 있습니다.

```text
고객
상품
주문
```

각각 독립적으로 관리할 가치가 있는 대상입니다.

### 예시

#### CUSTOMER

| CUSTOMER_ID | NAME | REGION |
| --- | --- | --- |
| C001 | 고객1 | 서울 |
| C002 | 고객2 | 부산 |

여기서 `CUSTOMER`라는 대상 자체가 Entity입니다.

```text
Entity
→ 관리 대상
→ 고객
```

## Entity의 특징

Entity는 일반적으로 다음 특징을 가집니다.

```text
업무에서 관리할 필요가 있음
식별 가능해야 함
여러 개의 Instance를 가질 수 있음
Attribute를 가짐
다른 Entity와 Relationship을 가질 수 있음
```

예를 들어 CUSTOMER라는 Entity 안에는 여러 고객이 존재할 수 있습니다.

```text
CUSTOMER
├─ 고객1
├─ 고객2
└─ 고객3
```

## Instance

Entity가 대상의 종류라면, 실제 하나하나의 데이터는 Instance라고 볼 수 있습니다.

### CUSTOMER Entity

| CUSTOMER_ID | NAME |
| --- | --- |
| C001 | 고객1 |
| C002 | 고객2 |

```text
CUSTOMER
→ Entity

C001 고객1
→ 하나의 Instance

C002 고객2
→ 하나의 Instance
```

## Attribute

`Attribute`는 Entity가 가지는 구체적인 정보나 특징입니다.

예를 들어 고객 Entity에는 다음 Attribute가 있을 수 있습니다.

```text
고객번호
이름
지역
등급
```

### 예시

| Attribute | 의미 |
| --- | --- |
| CUSTOMER_ID | 고객번호 |
| NAME | 이름 |
| REGION | 지역 |
| GRADE | 등급 |

즉, Table 관점에서는 보통 Column과 연결해서 이해할 수 있습니다.

```text
Entity
→ Table

Attribute
→ Column
```

## Attribute와 값

Attribute는 정보의 항목이고, 실제 저장된 내용은 그 Attribute의 값입니다.

### 예시

| Attribute | 값 |
| --- | --- |
| CUSTOMER_ID | C001 |
| NAME | 고객1 |
| REGION | 서울 |
| GRADE | VIP |

```text
REGION
→ Attribute

서울
→ Attribute의 값
```

이 둘을 구분해야 합니다.

## 식별 Attribute

Entity의 각 Instance를 구분할 수 있는 Attribute가 필요합니다.

예를 들어 고객번호가 각 고객을 고유하게 구분한다고 가정합니다.

| CUSTOMER_ID | NAME |
| --- | --- |
| C001 | 고객1 |
| C002 | 고객2 |

```text
CUSTOMER_ID
→ 각 고객을 식별
```

실제 관계형 데이터베이스에서는 이러한 식별 Attribute가 Primary Key로 구현될 수 있습니다.

## Relationship

`Relationship`은 둘 이상의 Entity 사이에 존재하는 연관관계입니다.

예를 들어 다음과 같은 업무 관계가 있습니다.

```text
고객
↓ 주문한다
주문
```

여기서 `주문한다`가 Relationship입니다.

## Relationship 예시

### CUSTOMER

| CUSTOMER_ID | NAME |
| --- | --- |
| C001 | 고객1 |
| C002 | 고객2 |

### ORDERS

| ORDER_ID | CUSTOMER_ID |
| --- | --- |
| O001 | C001 |
| O002 | C001 |
| O003 | C002 |

관계는 다음처럼 표현할 수 있습니다.

```text
고객
1
↓ 주문한다
N
주문
```

한 고객이 여러 주문을 가질 수 있는 관계입니다.

## Entity · Attribute · Relationship 비교

| 구분 | 의미 | 예시 |
| --- | --- | --- |
| Entity | 관리 대상 | 고객 |
| Attribute | Entity의 정보 | 고객번호, 이름 |
| Relationship | Entity 사이의 관계 | 고객이 주문한다 |

```text
고객
→ Entity

고객번호, 이름
→ Attribute

고객이 주문한다
→ Relationship
```

## 하나의 예시로 보기

대학교 시스템을 생각해보겠습니다.

### Entity

```text
학생
강의
```

### Attribute

#### 학생

```text
학생번호
이름
학과
```

#### 강의

```text
강의번호
강의명
```

### Relationship

```text
학생
↓ 수강한다
강의
```

이를 한 번에 보면 다음과 같습니다.

```text
[학생]
- 학생번호
- 이름
- 학과

   수강한다

[강의]
- 강의번호
- 강의명
```

## ERD에서는 어떻게 보이는가

ERD에서는 Entity, Attribute, Relationship을 시각적으로 표현합니다.

표기법마다 모양은 다르지만 의미는 같습니다.

```text
Entity
→ 무엇을 관리하는가

Attribute
→ 어떤 정보를 가지는가

Relationship
→ 무엇과 연결되는가
```

<blockquote class="prompt-warning">
<p>ERD 표기법마다 기호는 다를 수 있으므로 그림 모양보다 각 요소의 의미를 먼저 이해합니다.</p>
</blockquote>

## Table과 연결해서 이해

ER Model의 요소는 관계형 데이터베이스에서는 다음처럼 연결해서 이해할 수 있습니다.

| ER Model | 관계형 데이터베이스 |
| --- | --- |
| Entity | Table |
| Attribute | Column |
| Instance | Row |
| 식별 Attribute | Primary Key |
| Relationship | Foreign Key 관계 등으로 구현 가능 |

다만 ER Model의 개념과 실제 관계형 데이터베이스 구현은 완전히 같은 것은 아닙니다.

## 잘 놓치는 핵심

### 1. Entity는 하나의 값이 아니다

Entity는 관리 대상의 종류입니다.

```text
CUSTOMER
→ Entity

C001 고객1
→ Instance
```

### 2. Attribute와 값은 다르다

```text
NAME
→ Attribute

고객1
→ 값
```

### 3. Relationship은 Entity 사이의 관계다

단순한 Column 하나를 의미하는 것이 아닙니다.

### 4. Entity는 식별 가능해야 한다

각 Instance를 서로 구분할 수 있는 기준이 필요합니다.

## 시험·면접

### 핵심 암기

```text
Entity
→ 관리 대상
```

```text
Attribute
→ Entity의 속성
```

```text
Relationship
→ Entity 사이의 관계
```

```text
Instance
→ Entity의 실제 하나의 데이터
```

### 시험 함정

`CUSTOMER`는 Entity이고, `고객1`은 하나의 Instance입니다.

또한 `NAME`은 Attribute이고 `고객1`은 그 Attribute에 들어가는 값입니다.

### 면접 짧은 답변

`Entity`는 데이터베이스에서 관리하려는 대상이고, `Attribute`는 그 Entity가 가지는 속성입니다. `Relationship`은 Entity 사이의 연관관계를 의미합니다. 예를 들어 고객은 Entity, 고객번호와 이름은 Attribute, 고객이 주문한다는 것은 Relationship으로 볼 수 있습니다.

## 객관식 문제

### 문제 1 · Entity

다음 중 Entity에 해당하는 것은?

① 고객  
② 고객1이라는 이름 값  
③ 서울이라는 지역 값  
④ 3000이라는 급여 값

<details markdown="1">
<summary>정답</summary>

①

고객은 데이터베이스에서 관리할 대상이므로 Entity에 해당합니다.

</details>

### 문제 2 · Attribute

CUSTOMER Entity에서 Attribute로 가장 적절한 것은?

① 고객번호  
② 주문한다  
③ 고객1이라는 하나의 Row  
④ CUSTOMER와 ORDERS의 연결선

<details markdown="1">
<summary>정답</summary>

①

고객번호는 CUSTOMER Entity가 가지는 정보이므로 Attribute입니다.

</details>

### 문제 3 · Relationship

다음 중 Relationship으로 가장 적절한 것은?

① 고객번호  
② 상품가격  
③ 고객이 주문한다  
④ 고객1

<details markdown="1">
<summary>정답</summary>

③

두 Entity 사이의 연관관계를 표현하므로 Relationship입니다.

</details>

### 문제 4 · Instance

다음 Table에서 하나의 Instance에 해당하는 것은?

| CUSTOMER_ID | NAME |
| --- | --- |
| C001 | 고객1 |
| C002 | 고객2 |

① CUSTOMER 전체  
② CUSTOMER_ID Column 전체  
③ C001 고객1 Row  
④ NAME이라는 Attribute

<details markdown="1">
<summary>정답</summary>

③

Entity 안의 실제 하나의 데이터가 Instance입니다.

</details>

### 문제 5 · 연결 관계

다음 연결로 옳은 것은?

① Entity → Column  
② Attribute → Table  
③ Instance → 실제 하나의 Row  
④ Relationship → 하나의 값

<details markdown="1">
<summary>정답</summary>

③

관계형 데이터베이스 관점에서 하나의 Instance는 하나의 Row와 연결해서 이해할 수 있습니다.

</details>

## Entity · Attribute · Relationship 전체 요약

```text
Entity
→ 관리 대상
→ 고객

Attribute
→ 대상의 정보
→ 고객번호, 이름

Relationship
→ 대상 사이의 관계
→ 고객이 주문한다
```

| 개념 | 핵심 |
| --- | --- |
| Entity | 무엇을 관리하는가 |
| Attribute | 어떤 정보를 가지는가 |
| Relationship | 무엇과 어떻게 연결되는가 |
| Instance | Entity의 실제 데이터 하나 |

<blockquote class="prompt-danger">
<p>시험에서는 대상인지, 대상의 속성인지, 대상 사이의 관계인지 먼저 구분하면 빠르게 판단할 수 있습니다.</p>
</blockquote>

## 다음에 이을 글

**Cardinality**입니다.

Entity 사이의 관계가 1:1, 1:N, N:M 중 어떤 형태인지 표현하는 방법을 살펴봅니다.
