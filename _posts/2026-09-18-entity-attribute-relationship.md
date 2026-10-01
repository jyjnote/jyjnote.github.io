---
title: Entity · Attribute · Relationship
date: 2026-09-18 23:30:00 +0900
slug: entity-attribute-relationship
permalink: /posts/entity-attribute-relationship/
categories: [CS, 데이터베이스]
tags: [Entity, Attribute, Relationship, ERD, 데이터모델링, KeyAttribute, 정보처리기사, NCS]
math: true
---

Entity는 관리 대상, Attribute는 그 대상의 특성, Relationship은 Entity 사이의 연관성을 의미합니다.

이 글에서는 정의만 외우지 않고 실제 Table을 어떻게 보고 판단하는지까지 연결합니다.

<blockquote class="prompt-info">
<p>한 줄: Entity는 대상, Attribute는 속성, Relationship은 대상 사이의 관계입니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

Entity = 대상 / Attribute = 특성 / Relationship = 연결

</details>

## 실습 데이터 전체 보기

아래 실습 데이터베이스를 기준으로 예시를 연결합니다.

<div style="width:100%; overflow:hidden; border:1px solid var(--main-border-color,#ddd); border-radius:12px; margin:1rem 0;">
<iframe
  src="https://docs.google.com/spreadsheets/d/1mtu6pFcGyOfwpFizaJskfFD87GxyjAmB/preview"
  width="100%"
  height="500"
  style="border:0;"
  loading="lazy">
</iframe>
</div>

실습 DB의 대표 구조는 다음과 같습니다.

| Table | 핵심 Column | 역할 |
| --- | --- | --- |
| DEPARTMENT | DEPT_ID, DEPT_NAME, REGION | 부서 |
| EMPLOYEE | EMP_ID, EMP_NAME, DEPT_ID, SALARY | 직원 |
| CUSTOMER | CUSTOMER_ID, NAME, REGION, GRADE | 고객 |
| PRODUCT | PRODUCT_ID, PRODUCT_NAME, CATEGORY, PRICE | 상품 |
| ORDERS | ORDER_ID, CUSTOMER_ID, ORDER_DATE, STATUS | 주문 |
| ORDER_ITEM | ORDER_ID, PRODUCT_ID, QTY | 주문 상세 |

정규화 설명에서는 이해를 위해 별도의 작은 예시 Table도 함께 사용합니다.


## Entity

Entity는 업무에서 독립적으로 관리할 필요가 있는 대상입니다.

예를 들어 다음과 같습니다.

```text
직원
부서
고객
상품
주문
```

관계형 모델로 변환되면 보통 Table이 됩니다.

## Entity 조건

일반적으로 Entity로 볼 수 있으려면 다음과 같은 특징을 생각합니다.

- 업무에서 의미가 있다.
- 여러 Instance가 존재할 수 있다.
- 다른 Entity와 구분할 수 있다.
- Attribute를 가진다.

단순한 값 하나를 모두 Entity로 만드는 것은 아닙니다.

## Attribute

Attribute는 Entity가 가지는 특성입니다.

```text
EMPLOYEE
├─ EMP_ID
├─ EMP_NAME
├─ SALARY
└─ HIRE_DATE
```

관계형 Table에서는 Column에 대응되는 경우가 많습니다.

## Key Attribute

Entity를 식별하는 Attribute는 Key 역할을 할 수 있습니다.

```text
EMPLOYEE
→ EMP_ID

DEPARTMENT
→ DEPT_ID
```

Candidate Key 중 하나를 Primary Key로 선택합니다.

## 단순·복합 Attribute

하나의 더 작은 의미 단위로 나누기 어려운 Attribute를 단순 Attribute로 볼 수 있습니다.

반면 주소처럼 여러 요소로 나눌 수 있는 속성은 복합 Attribute로 모델링할 수 있습니다.

실제 관계형 DB 설계에서는 필요한 검색과 제약을 고려해 적절히 분해합니다.

## 다중값 Attribute

한 Entity에 여러 값을 가질 수 있는 속성은 관계형 모델에서 별도 Table로 분리하는 경우가 많습니다.

예를 들어 한 고객이 여러 전화번호를 가진다면

```text
CUSTOMER
CUSTOMER_PHONE
```

처럼 분리할 수 있습니다.

한 Cell에 여러 값을 넣는 방식은 1NF와 충돌할 수 있습니다.

## Relationship

Relationship은 Entity 사이의 의미 있는 연결입니다.

```text
EMPLOYEE
→ 소속
→ DEPARTMENT

CUSTOMER
→ 주문
→ ORDERS
```

Cardinality를 통해 1:1, 1:N, N:M 같은 구조를 표현합니다.

## Relationship의 Attribute

Relationship 자체에도 Attribute가 필요한 경우가 있습니다.

예를 들어 주문과 상품의 N:M 관계에는 수량이 필요합니다.

```text
ORDERS
↕
ORDER_ITEM
↕
PRODUCT

QTY
→ 관계에 붙는 값
```

그래서 중간 Entity를 만들어 관리합니다.

## 다른 개념과 비교

### 비교 1. Entity

```text
Entity
→ 관리 대상
```

비교할 때는 **무엇을 결정하는가**, **어떤 중복을 줄이는가**, **어떤 성능 비용이 생기는가**를 구분합니다.

### 비교 2. Attribute

```text
Attribute
→ 대상의 특성
```

비교할 때는 **무엇을 결정하는가**, **어떤 중복을 줄이는가**, **어떤 성능 비용이 생기는가**를 구분합니다.

### 비교 3. Relationship

```text
Relationship
→ 대상 사이 연결
```

비교할 때는 **무엇을 결정하는가**, **어떤 중복을 줄이는가**, **어떤 성능 비용이 생기는가**를 구분합니다.

## 구체적인 예시 연습

### 예시 1. 업무 구조

먼저 구조를 봅니다.

```text
고객 → 주문 → 상품
```

핵심 해석은 다음과 같습니다.

```text
개념 모델
```

`Entity · Attribute · Relationship` 문제에서는 결과를 외우기보다 **왜 이 구조가 필요한지**를 설명할 수 있어야 합니다.

시험에서는 작은 Relation을 직접 그리고 Key와 함수 종속을 표시하면 판단이 빨라집니다.

### 예시 2. Table 변환

먼저 구조를 봅니다.

```text
CUSTOMER / ORDERS / PRODUCT
```

핵심 해석은 다음과 같습니다.

```text
논리 모델
```

`Entity · Attribute · Relationship` 문제에서는 결과를 외우기보다 **왜 이 구조가 필요한지**를 설명할 수 있어야 합니다.

시험에서는 작은 Relation을 직접 그리고 Key와 함수 종속을 표시하면 판단이 빨라집니다.

### 예시 3. FK

먼저 구조를 봅니다.

```text
ORDERS.CUSTOMER_ID
```

핵심 해석은 다음과 같습니다.

```text
관계 구현
```

`Entity · Attribute · Relationship` 문제에서는 결과를 외우기보다 **왜 이 구조가 필요한지**를 설명할 수 있어야 합니다.

시험에서는 작은 Relation을 직접 그리고 Key와 함수 종속을 표시하면 판단이 빨라집니다.

### 예시 4. 1:N

먼저 구조를 봅니다.

```text
DEPARTMENT 1:N EMPLOYEE
```

핵심 해석은 다음과 같습니다.

```text
Cardinality
```

`Entity · Attribute · Relationship` 문제에서는 결과를 외우기보다 **왜 이 구조가 필요한지**를 설명할 수 있어야 합니다.

시험에서는 작은 Relation을 직접 그리고 Key와 함수 종속을 표시하면 판단이 빨라집니다.

### 예시 5. N:M

먼저 구조를 봅니다.

```text
ORDERS N:M PRODUCT
```

핵심 해석은 다음과 같습니다.

```text
ORDER_ITEM으로 분해
```

`Entity · Attribute · Relationship` 문제에서는 결과를 외우기보다 **왜 이 구조가 필요한지**를 설명할 수 있어야 합니다.

시험에서는 작은 Relation을 직접 그리고 Key와 함수 종속을 표시하면 판단이 빨라집니다.

### 예시 6. 물리 구현

먼저 구조를 봅니다.

```text
CREATE TABLE
```

핵심 해석은 다음과 같습니다.

```text
DBMS Schema
```

`Entity · Attribute · Relationship` 문제에서는 결과를 외우기보다 **왜 이 구조가 필요한지**를 설명할 수 있어야 합니다.

시험에서는 작은 Relation을 직접 그리고 Key와 함수 종속을 표시하면 판단이 빨라집니다.

## 자주 하는 실수

### 실수 1. Table 이름만 보고 Entity와 Relation을 같은 수준으로 생각한다.

이 실수를 피하려면 다음 순서를 지킵니다.

```text
업무 규칙
→ Key
→ 함수 종속
→ 이상 현상
→ 필요한 분해
```

`Entity · Attribute · Relationship`에서도 데이터 몇 Row만 보고 판단하지 말고 **Schema의 의미와 업무 규칙**을 기준으로 봅니다.

### 실수 2. Key를 찾기 전에 정규형부터 판단한다.

이 실수를 피하려면 다음 순서를 지킵니다.

```text
업무 규칙
→ Key
→ 함수 종속
→ 이상 현상
→ 필요한 분해
```

`Entity · Attribute · Relationship`에서도 데이터 몇 Row만 보고 판단하지 말고 **Schema의 의미와 업무 규칙**을 기준으로 봅니다.

### 실수 3. 함수 종속을 현재 데이터 값의 우연한 중복 여부로만 판단한다.

이 실수를 피하려면 다음 순서를 지킵니다.

```text
업무 규칙
→ Key
→ 함수 종속
→ 이상 현상
→ 필요한 분해
```

`Entity · Attribute · Relationship`에서도 데이터 몇 Row만 보고 판단하지 말고 **Schema의 의미와 업무 규칙**을 기준으로 봅니다.

### 실수 4. 정규화 단계를 건너뛰고 바로 3NF나 BCNF라고 판단한다.

이 실수를 피하려면 다음 순서를 지킵니다.

```text
업무 규칙
→ Key
→ 함수 종속
→ 이상 현상
→ 필요한 분해
```

`Entity · Attribute · Relationship`에서도 데이터 몇 Row만 보고 판단하지 말고 **Schema의 의미와 업무 규칙**을 기준으로 봅니다.

### 실수 5. 분해 후 어떤 Attribute가 어느 Relation으로 가야 하는지 확인하지 않는다.

이 실수를 피하려면 다음 순서를 지킵니다.

```text
업무 규칙
→ Key
→ 함수 종속
→ 이상 현상
→ 필요한 분해
```

`Entity · Attribute · Relationship`에서도 데이터 몇 Row만 보고 판단하지 말고 **Schema의 의미와 업무 규칙**을 기준으로 봅니다.

### 실수 6. 정규화와 반정규화를 무조건 좋은 것과 나쁜 것으로 나눈다.

이 실수를 피하려면 다음 순서를 지킵니다.

```text
업무 규칙
→ Key
→ 함수 종속
→ 이상 현상
→ 필요한 분해
```

`Entity · Attribute · Relationship`에서도 데이터 몇 Row만 보고 판단하지 말고 **Schema의 의미와 업무 규칙**을 기준으로 봅니다.

## 잘 놓치는 핵심

### 1. Entity

Entity는 업무에서 독립적으로 관리할 필요가 있는 대상입니다.

핵심은 결과를 외우는 것이 아니라 **왜 이 구조가 필요한지**를 설명할 수 있는 것입니다.

### 2. Entity 조건

일반적으로 Entity로 볼 수 있으려면 다음과 같은 특징을 생각합니다.

핵심은 결과를 외우는 것이 아니라 **왜 이 구조가 필요한지**를 설명할 수 있는 것입니다.

### 3. Attribute

Attribute는 Entity가 가지는 특성입니다.

핵심은 결과를 외우는 것이 아니라 **왜 이 구조가 필요한지**를 설명할 수 있는 것입니다.

### 4. Key Attribute

Entity를 식별하는 Attribute는 Key 역할을 할 수 있습니다.

핵심은 결과를 외우는 것이 아니라 **왜 이 구조가 필요한지**를 설명할 수 있는 것입니다.

### 5. 단순·복합 Attribute

하나의 더 작은 의미 단위로 나누기 어려운 Attribute를 단순 Attribute로 볼 수 있습니다.

핵심은 결과를 외우는 것이 아니라 **왜 이 구조가 필요한지**를 설명할 수 있는 것입니다.

### 6. 다중값 Attribute

한 Entity에 여러 값을 가질 수 있는 속성은 관계형 모델에서 별도 Table로 분리하는 경우가 많습니다.

핵심은 결과를 외우는 것이 아니라 **왜 이 구조가 필요한지**를 설명할 수 있는 것입니다.

## 시험·면접

### 핵심 암기

```text
Entity = 대상 / Attribute = 특성 / Relationship = 연결
```

### 시험 접근 순서

```text
1. Entity 또는 Relation 확인
2. Candidate Key 확인
3. 함수 종속 확인
4. 이상 현상 확인
5. 정규형 조건 확인
6. 필요한 분해 확인
```

### 시험 함정

현재 예시 데이터에서 값이 우연히 유일하다고 해서 함수 종속이나 Key가 자동으로 성립하는 것은 아닙니다.

Schema와 업무 규칙을 기준으로 판단해야 합니다.

### 면접에서 짧게 답한다면

Entity는 관리 대상, Attribute는 그 대상의 특성, Relationship은 Entity 사이의 연관성을 의미합니다.

정규화와 모델링에서는 Key와 함수 종속을 기준으로 중복과 이상 현상을 줄이는 방향으로 구조를 설계합니다.

## 예시로 한 바퀴

`Entity · Attribute · Relationship` 문제를 만나면 작은 Relation부터 그립니다.

```text
Key
→ 결정되는 Attribute
→ 반복되는 사실
→ 발생 가능한 이상 현상
```

그다음 어떤 Attribute가 어떤 Key에 종속되는지 화살표로 표시합니다.

마지막으로 분해가 필요하다면 **같은 사실을 한 곳에서만 관리할 수 있도록** Relation을 나눕니다.

## 객관식 문제

### 1. Entity는?

① 관리 대상  
② 항상 모든 Row 삭제  
③ Index만 생성  
④ Foreign Key는 항상 불필요

<details>
<summary>정답</summary>

①

</details>

해설: `관리 대상`가 이 문제의 핵심입니다.

### 2. Attribute는?

① Entity의 특성  
② 항상 모든 Row 삭제  
③ Index만 생성  
④ Foreign Key는 항상 불필요

<details>
<summary>정답</summary>

①

</details>

해설: `Entity의 특성`가 이 문제의 핵심입니다.

### 3. Relationship은?

① Entity 사이의 연관  
② 항상 모든 Row 삭제  
③ Index만 생성  
④ Foreign Key는 항상 불필요

<details>
<summary>정답</summary>

①

</details>

해설: `Entity 사이의 연관`가 이 문제의 핵심입니다.

### 4. 정규화 판단 전에 먼저 찾을 것은?

① Candidate Key와 함수 종속  
② 항상 모든 Row 삭제  
③ Index만 생성  
④ Foreign Key는 항상 불필요

<details>
<summary>정답</summary>

①

</details>

해설: `Candidate Key와 함수 종속`가 이 문제의 핵심입니다.

### 5. 정규화의 주요 목적은?

① 중복과 이상 현상 감소  
② 항상 모든 Row 삭제  
③ Index만 생성  
④ Foreign Key는 항상 불필요

<details>
<summary>정답</summary>

①

</details>

해설: `중복과 이상 현상 감소`가 이 문제의 핵심입니다.

### 6. 현재 Row 값만 보고 함수 종속을 결정해도 되는가?

① 아니며 업무 규칙을 봐야 한다  
② 항상 모든 Row 삭제  
③ Index만 생성  
④ Foreign Key는 항상 불필요

<details>
<summary>정답</summary>

①

</details>

해설: `아니며 업무 규칙을 봐야 한다`가 이 문제의 핵심입니다.

### 7. Relation 분해 후 확인할 것은?

① Key와 참조 관계  
② 항상 모든 Row 삭제  
③ Index만 생성  
④ Foreign Key는 항상 불필요

<details>
<summary>정답</summary>

①

</details>

해설: `Key와 참조 관계`가 이 문제의 핵심입니다.

### 8. 정규화가 높을수록 무조건 성능이 좋은가?

① 아니다  
② 항상 모든 Row 삭제  
③ Index만 생성  
④ Foreign Key는 항상 불필요

<details>
<summary>정답</summary>

①

</details>

해설: `아니다`가 이 문제의 핵심입니다.

## 추가 확인

### 체크 1

`Entity · Attribute · Relationship`를 다시 볼 때 다음 순서로 확인합니다.

```text
1. 업무에서 어떤 사실을 저장하는가
2. Candidate Key는 무엇인가
3. 어떤 함수 종속이 있는가
4. 중복과 이상 현상은 무엇인가
5. 분해 또는 결합이 필요한가
```

정규화 문제는 **Table 모양**보다 **함수 종속과 Key**를 중심으로 판단해야 합니다.

분해 후에는 각 Relation이 어떤 사실 하나를 표현하는지도 확인합니다.

### 체크 2

`Entity · Attribute · Relationship`를 다시 볼 때 다음 순서로 확인합니다.

```text
1. 업무에서 어떤 사실을 저장하는가
2. Candidate Key는 무엇인가
3. 어떤 함수 종속이 있는가
4. 중복과 이상 현상은 무엇인가
5. 분해 또는 결합이 필요한가
```

정규화 문제는 **Table 모양**보다 **함수 종속과 Key**를 중심으로 판단해야 합니다.

분해 후에는 각 Relation이 어떤 사실 하나를 표현하는지도 확인합니다.

### 체크 3

`Entity · Attribute · Relationship`를 다시 볼 때 다음 순서로 확인합니다.

```text
1. 업무에서 어떤 사실을 저장하는가
2. Candidate Key는 무엇인가
3. 어떤 함수 종속이 있는가
4. 중복과 이상 현상은 무엇인가
5. 분해 또는 결합이 필요한가
```

정규화 문제는 **Table 모양**보다 **함수 종속과 Key**를 중심으로 판단해야 합니다.

분해 후에는 각 Relation이 어떤 사실 하나를 표현하는지도 확인합니다.

### 체크 4

`Entity · Attribute · Relationship`를 다시 볼 때 다음 순서로 확인합니다.

```text
1. 업무에서 어떤 사실을 저장하는가
2. Candidate Key는 무엇인가
3. 어떤 함수 종속이 있는가
4. 중복과 이상 현상은 무엇인가
5. 분해 또는 결합이 필요한가
```

정규화 문제는 **Table 모양**보다 **함수 종속과 Key**를 중심으로 판단해야 합니다.

분해 후에는 각 Relation이 어떤 사실 하나를 표현하는지도 확인합니다.

### 체크 5

`Entity · Attribute · Relationship`를 다시 볼 때 다음 순서로 확인합니다.

```text
1. 업무에서 어떤 사실을 저장하는가
2. Candidate Key는 무엇인가
3. 어떤 함수 종속이 있는가
4. 중복과 이상 현상은 무엇인가
5. 분해 또는 결합이 필요한가
```

정규화 문제는 **Table 모양**보다 **함수 종속과 Key**를 중심으로 판단해야 합니다.

분해 후에는 각 Relation이 어떤 사실 하나를 표현하는지도 확인합니다.

### 체크 6

`Entity · Attribute · Relationship`를 다시 볼 때 다음 순서로 확인합니다.

```text
1. 업무에서 어떤 사실을 저장하는가
2. Candidate Key는 무엇인가
3. 어떤 함수 종속이 있는가
4. 중복과 이상 현상은 무엇인가
5. 분해 또는 결합이 필요한가
```

정규화 문제는 **Table 모양**보다 **함수 종속과 Key**를 중심으로 판단해야 합니다.

분해 후에는 각 Relation이 어떤 사실 하나를 표현하는지도 확인합니다.

### 체크 7

`Entity · Attribute · Relationship`를 다시 볼 때 다음 순서로 확인합니다.

```text
1. 업무에서 어떤 사실을 저장하는가
2. Candidate Key는 무엇인가
3. 어떤 함수 종속이 있는가
4. 중복과 이상 현상은 무엇인가
5. 분해 또는 결합이 필요한가
```

정규화 문제는 **Table 모양**보다 **함수 종속과 Key**를 중심으로 판단해야 합니다.

분해 후에는 각 Relation이 어떤 사실 하나를 표현하는지도 확인합니다.

## 다음에 이을 글

**Cardinality**입니다.

Entity 사이 관계가 1:1, 1:N, N:M 중 어떤 형태인지 나타내는 Cardinality를 알아봅니다.
