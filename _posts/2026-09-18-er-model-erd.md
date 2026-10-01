---
title: ER Model · ERD
date: 2026-09-18 23:40:00 +0900
slug: er-model-erd
permalink: /posts/er-model-erd/
categories: [CS, 데이터베이스]
tags: [ERModel, ERD, 데이터모델링, Entity, Relationship, Attribute, 정보처리기사, NCS]
math: true
---

`ER Model`은 <mark>현실 세계의 대상을 Entity와 Relationship으로 표현하는 데이터 모델</mark>입니다.

`ERD`는 이 구조를 그림으로 나타내어 데이터 사이의 관계를 한눈에 볼 수 있게 합니다.

<blockquote class="prompt-info">
<p>한 줄: ER Model은 개체와 관계로 데이터를 표현하고, ERD는 그 구조를 그림으로 나타낸 것입니다.</p>
</blockquote>

<details markdown="1">
<summary>한 줄로</summary>

ER Model은 데이터 구조의 개념이고, ERD는 그 구조를 시각적으로 표현한 도식입니다.

</details>

## ER Model

ER Model은 현실 세계의 데이터를 크게 다음 요소로 표현합니다.

```text
Entity
→ 관리할 대상

Attribute
→ 대상이 가진 정보

Relationship
→ 대상 사이의 관계
```

예를 들어 학교 시스템을 생각해보면 다음과 같습니다.

```text
학생
↓ 수강한다
강의
```

여기서 학생과 강의는 관리 대상이고, 수강한다는 두 대상 사이의 관계입니다.

## ERD

`ERD`는 ER Model을 그림으로 표현한 것입니다.

데이터베이스를 만들기 전에 어떤 Entity가 존재하고 서로 어떻게 연결되는지 확인할 수 있습니다.

### 예시

```text
[학생]
- 학생번호
- 이름

    수강

[강의]
- 강의번호
- 강의명
```

단순하게 보면 다음 구조입니다.

```text
학생
↓
수강
↓
강의
```

ERD에서는 이러한 관계를 선과 기호를 이용해 표현합니다.

## ER Model과 ERD 차이

| 구분 | ER Model | ERD |
| --- | --- | --- |
| 의미 | 데이터 모델링 개념 | ER Model을 표현한 그림 |
| 목적 | Entity와 관계 정의 | 구조를 시각적으로 확인 |
| 형태 | 개념적 구조 | 다이어그램 |
| 사용 시점 | 데이터 모델링 | 모델 설계·검토 |

```text
ER Model
→ 구조를 정의하는 개념

ERD
→ 구조를 그림으로 표현
```

## ERD의 기본 구성

ERD에서는 주로 다음 요소를 확인합니다.

| 요소 | 의미 |
| --- | --- |
| Entity | 관리 대상 |
| Attribute | Entity의 속성 |
| Relationship | Entity 사이의 관계 |
| Key | Row를 식별하는 Attribute |
| Cardinality | 관계의 수 |

다만 Entity, Attribute, Relationship과 Cardinality는 각각 별도 글에서 더 자세히 다룹니다.

## 간단한 ERD 예시

쇼핑몰의 고객과 주문을 생각해보겠습니다.

### 업무 관계

```text
고객은 주문을 한다.
```

### ERD 구조

```text
[고객]
- 고객번호
- 이름
- 지역

      1
      │
      │ 주문한다
      │
      N

[주문]
- 주문번호
- 고객번호
- 주문일자
```

의미는 다음과 같습니다.

```text
고객 1명
→ 여러 주문 가능

주문 1개
→ 한 고객과 연결
```

## ERD에서 Key 확인

ERD에서는 Entity를 식별하는 Key도 중요합니다.

### 고객

| Attribute | 역할 |
| --- | --- |
| 고객번호 | Primary Key |
| 이름 | 일반 Attribute |
| 지역 | 일반 Attribute |

### 주문

| Attribute | 역할 |
| --- | --- |
| 주문번호 | Primary Key |
| 고객번호 | Foreign Key |
| 주문일자 | 일반 Attribute |

관계를 단순하게 표현하면 다음과 같습니다.

```text
CUSTOMER.CUSTOMER_ID
↓
ORDERS.CUSTOMER_ID
```

고객의 Primary Key를 주문의 Foreign Key가 참조합니다.

## ERD를 Table로 변환

ERD에서 설계한 구조는 이후 실제 Table로 구현할 수 있습니다.

### ERD 구조

```text
고객
1
↓
N
주문
```

### Table 구조

#### CUSTOMER

| Column | 역할 |
| --- | --- |
| CUSTOMER_ID | Primary Key |
| NAME | 고객 이름 |
| REGION | 지역 |

#### ORDERS

| Column | 역할 |
| --- | --- |
| ORDER_ID | Primary Key |
| CUSTOMER_ID | Foreign Key |
| ORDER_DATE | 주문일자 |

실제로 구현하면 다음처럼 표현할 수 있습니다.

```sql
CREATE TABLE CUSTOMER(
    CUSTOMER_ID TEXT PRIMARY KEY,
    NAME TEXT,
    REGION TEXT
);
```

```sql
CREATE TABLE ORDERS(
    ORDER_ID TEXT PRIMARY KEY,
    CUSTOMER_ID TEXT,
    ORDER_DATE TEXT,
    FOREIGN KEY(CUSTOMER_ID)
        REFERENCES CUSTOMER(CUSTOMER_ID)
);
```

## ERD 표기법은 하나가 아니다

ERD는 사용하는 표기법에 따라 모양이 달라질 수 있습니다.

대표적으로 다음과 같은 방식이 있습니다.

```text
Chen 표기법
Crow's Foot 표기법
IDEF1X 표기법
```

같은 데이터 구조라도 Entity, Attribute, Cardinality를 표현하는 기호는 달라질 수 있습니다.

<blockquote class="prompt-warning">
<p>ERD 문제에서는 그림 모양 자체보다 Entity가 무엇이고 어떤 관계와 Cardinality를 가지는지를 먼저 확인합니다.</p>
</blockquote>

## ERD 읽는 순서

복잡한 ERD는 다음 순서로 보면 이해하기 쉽습니다.

### 1. Entity 확인

```text
어떤 데이터 대상을 관리하는가?
```

### 2. Primary Key 확인

```text
각 Entity를 무엇으로 구분하는가?
```

### 3. Relationship 확인

```text
어떤 Entity끼리 연결되어 있는가?
```

### 4. Cardinality 확인

```text
1:1
1:N
N:M
```

### 5. Foreign Key 확인

```text
어떤 Key가 다른 Entity를 참조하는가?
```

## ERD와 실제 데이터베이스

ERD는 데이터 자체가 아니라 <mark>데이터베이스 구조를 설계하기 위한 도식</mark>입니다.

```text
ERD
→ 설계도

Table
→ 실제 구현 결과
```

건물의 설계도와 실제 건물의 관계처럼 생각하면 이해하기 쉽습니다.

## 잘 놓치는 핵심

### 1. ER Model과 ERD는 같은 말이 아니다

ER Model은 모델링 개념이고 ERD는 그 모델을 그림으로 표현한 것입니다.

### 2. ERD는 실제 데이터가 아니다

Row 값 자체가 아니라 데이터 구조와 관계를 표현합니다.

### 3. 관계의 수를 확인해야 한다

Entity가 연결되어 있다는 사실만 보는 것이 아니라 `1:1`, `1:N`, `N:M` 같은 관계 수를 함께 확인해야 합니다.

### 4. 표기법마다 기호가 다를 수 있다

그림 모양만 외우기보다 의미를 이해해야 합니다.

## 시험·면접

### 핵심 암기

```text
ER Model
→ Entity
→ Attribute
→ Relationship
```

```text
ERD
→ ER Model을 그림으로 표현
```

```text
ERD 읽기
→ Entity
→ Key
→ Relationship
→ Cardinality
```

### 시험 함정

ERD 자체를 실제 Table이나 실제 데이터라고 생각하면 안 됩니다.

ERD는 데이터베이스를 구현하기 전에 구조와 관계를 표현하는 설계 도구입니다.

### 면접 짧은 답변

ER Model은 현실 세계의 데이터를 Entity, Attribute, Relationship으로 표현하는 데이터 모델입니다. ERD는 이 ER Model을 시각적으로 나타낸 다이어그램으로, Entity 사이의 관계와 Cardinality, Key 구조 등을 확인하는 데 사용합니다.

## 객관식 문제

### 문제 1 · ER Model

다음 중 ER Model의 핵심 구성 요소로 가장 적절한 것은?

① Entity와 Relationship  
② CPU와 Memory  
③ File과 Folder  
④ Process와 Thread

<details markdown="1">
<summary>정답</summary>

①

ER Model은 Entity와 Attribute, Relationship을 이용해 데이터 구조를 표현합니다.

</details>

### 문제 2 · ERD

ERD에 대한 설명으로 옳은 것은?

① 실제 Row 데이터를 저장하는 파일이다.  
② ER Model을 그림으로 표현한 것이다.  
③ SQL 명령어의 한 종류다.  
④ Index를 자동 생성하는 기능이다.

<details markdown="1">
<summary>정답</summary>

②

ERD는 Entity와 Relationship 등의 구조를 시각적으로 표현한 다이어그램입니다.

</details>

### 문제 3 · 관계 읽기

다음 구조의 의미로 가장 적절한 것은?

```text
고객
1
↓
N
주문
```

① 고객 하나가 여러 주문과 연결될 수 있다.  
② 주문 하나가 반드시 여러 고객을 가진다.  
③ 고객과 주문은 관계가 없다.  
④ 고객과 주문은 항상 같은 개수다.

<details markdown="1">
<summary>정답</summary>

①

`1:N` 관계이므로 한 고객이 여러 주문과 연결될 수 있습니다.

</details>

### 문제 4 · ERD 읽기

복잡한 ERD를 볼 때 먼저 확인할 대상으로 가장 적절한 것은?

① CPU 사용률  
② Entity  
③ 파일 크기  
④ SQL 실행 시간

<details markdown="1">
<summary>정답</summary>

②

먼저 어떤 Entity가 존재하는지 확인한 뒤 Key와 Relationship을 확인하는 것이 좋습니다.

</details>

### 문제 5 · ERD와 Table

다음 설명으로 옳은 것은?

① ERD는 실제 데이터 Row 그 자체다.  
② ERD와 Table은 항상 완전히 같은 개념이다.  
③ ERD는 구조 설계에 사용하고 Table은 실제 구현 결과가 될 수 있다.  
④ ERD에서는 Entity 관계를 표현할 수 없다.

<details markdown="1">
<summary>정답</summary>

③

ERD는 데이터 구조를 설계하는 도식이고, 이를 바탕으로 실제 Table을 구현할 수 있습니다.

</details>

## ER Model · ERD 전체 요약

```text
현실 세계
↓
ER Model
↓
Entity · Attribute · Relationship
↓
ERD
↓
시각적인 데이터 구조
↓
실제 Table 설계
```

| 구분 | 핵심 |
| --- | --- |
| ER Model | 데이터 구조를 개체와 관계로 표현 |
| ERD | ER Model을 그림으로 표현 |
| Entity | 관리 대상 |
| Relationship | Entity 사이 연결 |
| Cardinality | 관계의 수 |

<blockquote class="prompt-danger">
<p>ERD 문제에서는 먼저 Entity와 Relationship을 찾고, 그다음 Key와 Cardinality를 확인합니다.</p>
</blockquote>

## 다음에 이을 글

**Entity · Attribute · Relationship**입니다.

ER Model을 구성하는 세 핵심 요소를 각각 구분해서 살펴봅니다.
