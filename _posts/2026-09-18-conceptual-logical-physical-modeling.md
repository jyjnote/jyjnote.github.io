---
title: 개념 · 논리 · 물리 모델링
date: 2026-09-18 23:35:00 +0900
slug: conceptual-logical-physical-modeling
permalink: /posts/conceptual-logical-physical-modeling/
categories: [CS, 데이터베이스]
tags: [데이터모델링, 개념모델링, 논리모델링, 물리모델링, ERD, Schema, 정보처리기사, NCS]
math: true
---

데이터 모델링은 <mark>현실 세계의 업무와 데이터를 데이터베이스 구조로 표현하는 과정</mark>입니다.

일반적으로 **개념 모델링 → 논리 모델링 → 물리 모델링** 순서로 구체화합니다.

<blockquote class="prompt-info">
<p>한 줄: 개념은 무엇을 관리할지, 논리는 어떻게 연결할지, 물리는 실제 DB에 어떻게 만들지를 정합니다.</p>
</blockquote>

<details markdown="1">
<summary>한 줄로</summary>

개념 → 업무 중심, 논리 → 구조 중심, 물리 → 실제 구현 중심입니다.

</details>

## 전체 흐름

```text
현실의 업무
↓
개념 모델링
↓
논리 모델링
↓
물리 모델링
↓
실제 데이터베이스
```

같은 대상을 점점 더 구체적으로 표현한다고 보면 됩니다.

| 단계 | 핵심 질문 | 중심 내용 |
| --- | --- | --- |
| 개념 모델링 | 무엇을 관리하는가? | 주요 Entity와 관계 |
| 논리 모델링 | 데이터를 어떻게 구조화하는가? | Attribute, Key, 관계, 정규화 |
| 물리 모델링 | 실제 DB에 어떻게 구현하는가? | Table, 자료형, Index, 저장 구조 |

## 개념 모델링

개념 모델링은 업무 전체를 크게 바라보는 단계입니다.

세부 Column이나 자료형보다는 <mark>어떤 데이터가 존재하고 서로 어떤 관계를 가지는지</mark>를 파악합니다.

### 예시 · 쇼핑몰

쇼핑몰에서 다음 정보를 관리한다고 가정합니다.

```text
고객
주문
상품
```

개념 모델링에서는 다음처럼 큰 관계를 먼저 파악합니다.

```text
고객
↓ 주문한다
주문
↓ 상품을 포함한다
상품
```

이 단계에서는 `VARCHAR`, `INTEGER` 같은 실제 자료형까지 정하지 않습니다.

### 핵심

```text
업무 중심
큰 구조 파악
주요 Entity 도출
Entity 간 관계 파악
```

## 논리 모델링

논리 모델링은 개념 모델을 더 구체적인 데이터 구조로 바꾸는 단계입니다.

Entity의 Attribute와 Key를 정하고, 관계를 구체화하며 정규화를 수행합니다.

### 개념 모델

```text
고객
주문
상품
```

### 논리 모델

#### 고객

| Attribute | 역할 |
| --- | --- |
| 고객번호 | 식별자 |
| 이름 | 고객 정보 |
| 지역 | 고객 정보 |

#### 주문

| Attribute | 역할 |
| --- | --- |
| 주문번호 | 식별자 |
| 고객번호 | 고객 참조 |
| 주문일자 | 주문 정보 |

#### 상품

| Attribute | 역할 |
| --- | --- |
| 상품번호 | 식별자 |
| 상품명 | 상품 정보 |
| 가격 | 상품 정보 |

관계도 더 구체적으로 표현합니다.

```text
고객
1
↓
N
주문
```

한 고객이 여러 주문을 할 수 있다는 구조입니다.

### 핵심

```text
Attribute 정의
Primary Key 정의
Foreign Key 관계 정의
Cardinality 구체화
정규화
```

<blockquote class="prompt-info">
<p>논리 모델링은 특정 DBMS의 저장 방식보다 데이터 구조와 관계를 정확하게 표현하는 데 집중합니다.</p>
</blockquote>

## 물리 모델링

물리 모델링은 논리 모델을 <mark>실제 데이터베이스에서 구현할 수 있는 형태</mark>로 변환하는 단계입니다.

Table명, Column명, 자료형, 길이, Index 같은 실제 구현 요소를 결정합니다.

### 논리 모델

| Attribute | 역할 |
| --- | --- |
| 고객번호 | 식별자 |
| 이름 | 고객 정보 |
| 지역 | 고객 정보 |

### 물리 모델

| Column | 자료형 | 제약조건 |
| --- | --- | --- |
| CUSTOMER_ID | TEXT | PRIMARY KEY |
| NAME | TEXT | NOT NULL |
| REGION | TEXT | 없음 |

실제 Table은 다음과 같이 구현할 수 있습니다.

```sql
CREATE TABLE CUSTOMER(
    CUSTOMER_ID TEXT PRIMARY KEY,
    NAME TEXT NOT NULL,
    REGION TEXT
);
```

### 핵심

```text
Table명 결정
Column명 결정
자료형 결정
길이 결정
제약조건 반영
Index 설계
DBMS 특성 반영
```

## 하나의 예시로 비교

### 1. 개념 모델링

```text
학생
↓ 수강한다
강의
```

업무에서 어떤 대상과 관계가 필요한지 파악합니다.

### 2. 논리 모델링

#### 학생

| Attribute | 역할 |
| --- | --- |
| 학생번호 | Primary Key |
| 이름 | 일반 Attribute |

#### 강의

| Attribute | 역할 |
| --- | --- |
| 강의번호 | Primary Key |
| 강의명 | 일반 Attribute |

#### 수강

| Attribute | 역할 |
| --- | --- |
| 학생번호 | 학생 참조 |
| 강의번호 | 강의 참조 |

다대다 관계를 수강이라는 별도 구조로 표현할 수 있습니다.

### 3. 물리 모델링

| Table | 주요 Column |
| --- | --- |
| STUDENT | STUDENT_ID, NAME |
| COURSE | COURSE_ID, COURSE_NAME |
| ENROLLMENT | STUDENT_ID, COURSE_ID |

실제 데이터베이스에서 사용할 Table명과 Column명, 자료형 등을 결정합니다.

## 세 단계 비교

| 구분 | 개념 모델링 | 논리 모델링 | 물리 모델링 |
| --- | --- | --- | --- |
| 관점 | 업무 | 데이터 구조 | 실제 구현 |
| 추상화 수준 | 높음 | 중간 | 낮음 |
| 주요 대상 | Entity, Relationship | Attribute, Key, 관계 | Table, Column, 자료형 |
| 정규화 | 보통 세부 수행 전 | 중요 | 결과 반영 |
| DBMS 의존성 | 낮음 | 낮음 | 높음 |
| 사용자 관점 | 업무 담당자 이해 중심 | 설계자 중심 | 개발·DB 구현 중심 |

## DBMS 의존성

세 단계 중 특히 물리 모델링에서 DBMS 특성이 중요해집니다.

```text
개념 모델링
→ DBMS 영향 거의 없음

논리 모델링
→ DBMS 독립적인 구조 설계 중심

물리 모델링
→ 실제 DBMS 기능과 특성 반영
```

예를 들어 자료형이나 Index 구성 방식은 사용하는 DBMS에 따라 달라질 수 있습니다.

## 왜 단계를 나누는가

처음부터 Table과 Column부터 만들면 업무 요구사항을 놓치기 쉽습니다.

먼저 업무 구조를 파악한 뒤 점점 구체화하면 설계 과정이 명확해집니다.

```text
업무 이해
→ 구조 설계
→ 구현 설계
```

즉, 큰 그림에서 시작해 실제 데이터베이스 구조로 내려가는 방식입니다.

## 잘 놓치는 핵심

### 1. 개념 모델링은 가장 추상적이다

세부 자료형보다 업무에 어떤 Entity와 관계가 존재하는지를 파악합니다.

### 2. 논리 모델링에서는 Key와 정규화가 중요하다

Attribute, Primary Key, Foreign Key, 관계 등을 구체화합니다.

### 3. 물리 모델링은 실제 구현 단계다

자료형, Index, Table명처럼 DBMS에 실제로 적용할 요소를 결정합니다.

### 4. 개념 → 논리 → 물리 순으로 구체화된다

```text
추상적
개념
↓
논리
↓
물리
구체적
```

## 시험·면접

### 핵심 암기

```text
개념
→ 업무
→ Entity와 관계
```

```text
논리
→ Attribute
→ Key
→ 관계
→ 정규화
```

```text
물리
→ Table
→ Column
→ 자료형
→ Index
→ DBMS
```

### 시험 함정

자료형이나 Index를 결정하는 단계는 일반적으로 개념 모델링이 아니라 물리 모델링입니다.

정규화와 Key 구조를 구체화하는 단계는 논리 모델링에서 중요합니다.

### 면접 짧은 답변

데이터 모델링은 개념, 논리, 물리 모델링으로 구분할 수 있습니다. 개념 모델링에서는 업무의 주요 Entity와 관계를 파악하고, 논리 모델링에서는 Attribute와 Key, 관계와 정규화를 구체화합니다. 물리 모델링에서는 이를 실제 DBMS에 구현할 수 있도록 Table, Column, 자료형, Index 등을 결정합니다.

## 객관식 문제

### 문제 1 · 개념 모델링

다음 중 개념 모델링에서 가장 중점적으로 파악하는 것은?

① Index 저장 위치  
② 주요 Entity와 관계  
③ Column 자료형  
④ 실제 Table 생성문

<details markdown="1">
<summary>정답</summary>

②

개념 모델링은 업무의 주요 Entity와 관계를 파악하는 단계입니다.

</details>

### 문제 2 · 논리 모델링

다음 중 논리 모델링에서 주로 다루는 것은?

① 서버 디스크 위치  
② Attribute와 Key 구조  
③ DBMS 설치 경로  
④ 실제 저장 블록 크기

<details markdown="1">
<summary>정답</summary>

②

논리 모델링에서는 Attribute, Key, 관계, 정규화 등을 구체화합니다.

</details>

### 문제 3 · 물리 모델링

다음 중 물리 모델링에 가장 가까운 작업은?

① 업무에서 고객과 주문의 관계 파악  
② 주요 Entity 도출  
③ Column 자료형과 Index 결정  
④ 업무 용어 정리

<details markdown="1">
<summary>정답</summary>

③

실제 DBMS에서 사용할 자료형과 Index 등을 결정하는 것은 물리 모델링에 해당합니다.

</details>

### 문제 4 · 순서

일반적인 데이터 모델링의 순서로 옳은 것은?

① 물리 → 논리 → 개념  
② 논리 → 개념 → 물리  
③ 개념 → 논리 → 물리  
④ 논리 → 물리 → 개념

<details markdown="1">
<summary>정답</summary>

③

업무를 추상적으로 파악한 뒤 점차 실제 구현 구조로 구체화합니다.

```text
개념
→ 논리
→ 물리
```

</details>

### 문제 5 · DBMS 의존성

다음 중 DBMS의 실제 특성을 가장 많이 반영하는 단계는?

① 개념 모델링  
② 논리 모델링  
③ 물리 모델링  
④ 요구사항 수집

<details markdown="1">
<summary>정답</summary>

③

물리 모델링에서는 자료형, Index 등 실제 DBMS 구현 요소를 결정합니다.

</details>

## 개념 · 논리 · 물리 모델링 전체 요약

| 단계 | 한 줄 핵심 |
| --- | --- |
| 개념 | 무엇을 관리할지 결정 |
| 논리 | 데이터를 어떻게 구조화할지 결정 |
| 물리 | 실제 DB에 어떻게 구현할지 결정 |

```text
개념 모델링
→ Entity · Relationship

논리 모델링
→ Attribute · Key · 정규화

물리 모델링
→ Table · Column · 자료형 · Index
```

<blockquote class="prompt-danger">
<p>시험에서는 업무 중심인지, 데이터 구조 중심인지, 실제 DBMS 구현 중심인지 먼저 구분하면 세 단계를 빠르게 판단할 수 있습니다.</p>
</blockquote>

## 다음에 이을 글

**ER Model · ERD**입니다.

Entity와 Relationship을 그림으로 표현하는 데이터 모델링 방법을 살펴봅니다.
