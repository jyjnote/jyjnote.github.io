---
title: ER Model · ERD
date: 2026-09-18 23:25:00 +0900
slug: er-model-erd
permalink: /posts/er-model-erd/
categories: [CS, 데이터베이스]
tags: [ERModel, ERD, 데이터모델링, Entity, Attribute, Relationship, Cardinality, 정보처리기사, NCS]
math: true
---

ER Model은 현실 세계의 데이터 구조를 Entity, Attribute, Relationship으로 표현하는 개념적 데이터 모델입니다.

이 글에서는 정의만 외우지 않고 실제 Table을 어떻게 보고 판단하는지까지 연결합니다.

<blockquote class="prompt-info">
<p>한 줄: ERD는 Entity와 Relationship을 그림으로 표현해 데이터 구조를 한눈에 보여줍니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

ER Model = Entity + Attribute + Relationship / ERD = 이를 그림으로 표현

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


## ER Model

ER은 Entity-Relationship의 약자입니다.

핵심 요소는 세 가지입니다.

```text
Entity
Attribute
Relationship
```

예를 들어 쇼핑몰에서는 고객, 주문, 상품을 Entity로 볼 수 있습니다.

## ERD

ERD는 ER Model을 Diagram으로 표현한 것입니다.

```text
CUSTOMER
   │ 1
   │
   │ N
 ORDERS
```

고객 한 명이 여러 주문을 만들 수 있다는 관계를 시각적으로 표현합니다.

## Entity 표시

Entity는 독립적으로 관리할 필요가 있는 대상을 뜻합니다.

```text
CUSTOMER
EMPLOYEE
PRODUCT
ORDERS
```

실제 관계형 데이터베이스에서는 Entity가 Table로 변환되는 경우가 많습니다.

## Attribute 표시

Attribute는 Entity의 특성을 나타냅니다.

```text
CUSTOMER
├─ CUSTOMER_ID
├─ NAME
├─ REGION
└─ GRADE
```

논리 모델링 단계에서는 Key Attribute와 일반 Attribute를 구분합니다.

## Relationship 표시

Relationship은 Entity 사이의 연결입니다.

```text
CUSTOMER
→ 주문한다
→ ORDERS
```

```text
EMPLOYEE
→ 소속된다
→ DEPARTMENT
```

관계에는 Cardinality와 선택성도 함께 고려합니다.

## 식별 관계와 비식별 관계

모델링 도구에서는 부모 Key가 자식 Primary Key에 포함되는지에 따라 식별 관계와 비식별 관계를 구분하기도 합니다.

예를 들어 ORDER_ITEM의 복합 Primary Key가 ORDER_ID를 포함한다면 주문과 주문 상세는 식별 관계로 모델링할 수 있습니다.

세부 표기법은 사용하는 ERD 표기 방식에 따라 달라질 수 있습니다.

## Crow's Foot

실무 ERD에서는 Crow's Foot 표기법을 많이 사용합니다.

```text
1
→ 하나

N
→ 여러 개
```

까마귀발 모양이 다수 쪽을 나타냅니다.

시험에서는 기호 자체보다 1:1, 1:N, N:M 의미를 정확히 이해하는 것이 중요합니다.

## ERD에서 Relation으로

ERD는 이후 관계형 Schema로 변환됩니다.

```text
CUSTOMER 1:N ORDERS
↓
ORDERS.CUSTOMER_ID
→ Foreign Key
```

Cardinality와 Relationship이 실제 PK·FK 구조로 변환됩니다.

## 다른 개념과 비교

### 비교 1. ER Model

```text
ER Model
→ 개념 구조
```

비교할 때는 **무엇을 결정하는가**, **어떤 중복을 줄이는가**, **어떤 성능 비용이 생기는가**를 구분합니다.

### 비교 2. ERD

```text
ERD
→ 시각적 Diagram
```

비교할 때는 **무엇을 결정하는가**, **어떤 중복을 줄이는가**, **어떤 성능 비용이 생기는가**를 구분합니다.

### 비교 3. Relation

```text
Relation
→ 관계형 Table 구조
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

`ER Model · ERD` 문제에서는 결과를 외우기보다 **왜 이 구조가 필요한지**를 설명할 수 있어야 합니다.

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

`ER Model · ERD` 문제에서는 결과를 외우기보다 **왜 이 구조가 필요한지**를 설명할 수 있어야 합니다.

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

`ER Model · ERD` 문제에서는 결과를 외우기보다 **왜 이 구조가 필요한지**를 설명할 수 있어야 합니다.

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

`ER Model · ERD` 문제에서는 결과를 외우기보다 **왜 이 구조가 필요한지**를 설명할 수 있어야 합니다.

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

`ER Model · ERD` 문제에서는 결과를 외우기보다 **왜 이 구조가 필요한지**를 설명할 수 있어야 합니다.

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

`ER Model · ERD` 문제에서는 결과를 외우기보다 **왜 이 구조가 필요한지**를 설명할 수 있어야 합니다.

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

`ER Model · ERD`에서도 데이터 몇 Row만 보고 판단하지 말고 **Schema의 의미와 업무 규칙**을 기준으로 봅니다.

### 실수 2. Key를 찾기 전에 정규형부터 판단한다.

이 실수를 피하려면 다음 순서를 지킵니다.

```text
업무 규칙
→ Key
→ 함수 종속
→ 이상 현상
→ 필요한 분해
```

`ER Model · ERD`에서도 데이터 몇 Row만 보고 판단하지 말고 **Schema의 의미와 업무 규칙**을 기준으로 봅니다.

### 실수 3. 함수 종속을 현재 데이터 값의 우연한 중복 여부로만 판단한다.

이 실수를 피하려면 다음 순서를 지킵니다.

```text
업무 규칙
→ Key
→ 함수 종속
→ 이상 현상
→ 필요한 분해
```

`ER Model · ERD`에서도 데이터 몇 Row만 보고 판단하지 말고 **Schema의 의미와 업무 규칙**을 기준으로 봅니다.

### 실수 4. 정규화 단계를 건너뛰고 바로 3NF나 BCNF라고 판단한다.

이 실수를 피하려면 다음 순서를 지킵니다.

```text
업무 규칙
→ Key
→ 함수 종속
→ 이상 현상
→ 필요한 분해
```

`ER Model · ERD`에서도 데이터 몇 Row만 보고 판단하지 말고 **Schema의 의미와 업무 규칙**을 기준으로 봅니다.

### 실수 5. 분해 후 어떤 Attribute가 어느 Relation으로 가야 하는지 확인하지 않는다.

이 실수를 피하려면 다음 순서를 지킵니다.

```text
업무 규칙
→ Key
→ 함수 종속
→ 이상 현상
→ 필요한 분해
```

`ER Model · ERD`에서도 데이터 몇 Row만 보고 판단하지 말고 **Schema의 의미와 업무 규칙**을 기준으로 봅니다.

### 실수 6. 정규화와 반정규화를 무조건 좋은 것과 나쁜 것으로 나눈다.

이 실수를 피하려면 다음 순서를 지킵니다.

```text
업무 규칙
→ Key
→ 함수 종속
→ 이상 현상
→ 필요한 분해
```

`ER Model · ERD`에서도 데이터 몇 Row만 보고 판단하지 말고 **Schema의 의미와 업무 규칙**을 기준으로 봅니다.

## 잘 놓치는 핵심

### 1. ER Model

ER은 Entity-Relationship의 약자입니다.

핵심은 결과를 외우는 것이 아니라 **왜 이 구조가 필요한지**를 설명할 수 있는 것입니다.

### 2. ERD

ERD는 ER Model을 Diagram으로 표현한 것입니다.

핵심은 결과를 외우는 것이 아니라 **왜 이 구조가 필요한지**를 설명할 수 있는 것입니다.

### 3. Entity 표시

Entity는 독립적으로 관리할 필요가 있는 대상을 뜻합니다.

핵심은 결과를 외우는 것이 아니라 **왜 이 구조가 필요한지**를 설명할 수 있는 것입니다.

### 4. Attribute 표시

Attribute는 Entity의 특성을 나타냅니다.

핵심은 결과를 외우는 것이 아니라 **왜 이 구조가 필요한지**를 설명할 수 있는 것입니다.

### 5. Relationship 표시

Relationship은 Entity 사이의 연결입니다.

핵심은 결과를 외우는 것이 아니라 **왜 이 구조가 필요한지**를 설명할 수 있는 것입니다.

### 6. 식별 관계와 비식별 관계

모델링 도구에서는 부모 Key가 자식 Primary Key에 포함되는지에 따라 식별 관계와 비식별 관계를 구분하기도 합니다.

핵심은 결과를 외우는 것이 아니라 **왜 이 구조가 필요한지**를 설명할 수 있는 것입니다.

## 시험·면접

### 핵심 암기

```text
ER Model = Entity + Attribute + Relationship / ERD = 이를 그림으로 표현
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

ER Model은 현실 세계의 데이터 구조를 Entity, Attribute, Relationship으로 표현하는 개념적 데이터 모델입니다.

정규화와 모델링에서는 Key와 함수 종속을 기준으로 중복과 이상 현상을 줄이는 방향으로 구조를 설계합니다.

## 예시로 한 바퀴

`ER Model · ERD` 문제를 만나면 작은 Relation부터 그립니다.

```text
Key
→ 결정되는 Attribute
→ 반복되는 사실
→ 발생 가능한 이상 현상
```

그다음 어떤 Attribute가 어떤 Key에 종속되는지 화살표로 표시합니다.

마지막으로 분해가 필요하다면 **같은 사실을 한 곳에서만 관리할 수 있도록** Relation을 나눕니다.

## 객관식 문제

### 1. ER의 세 요소는?

① Entity, Attribute, Relationship  
② 항상 모든 Row 삭제  
③ Index만 생성  
④ Foreign Key는 항상 불필요

<details>
<summary>정답</summary>

①

</details>

해설: `Entity, Attribute, Relationship`가 이 문제의 핵심입니다.

### 2. ERD의 목적은?

① 데이터 구조를 시각적으로 표현  
② 항상 모든 Row 삭제  
③ Index만 생성  
④ Foreign Key는 항상 불필요

<details>
<summary>정답</summary>

①

</details>

해설: `데이터 구조를 시각적으로 표현`가 이 문제의 핵심입니다.

### 3. 1:N 관계는 무엇을 나타내는가?

① 한 Entity가 여러 상대와 연결  
② 항상 모든 Row 삭제  
③ Index만 생성  
④ Foreign Key는 항상 불필요

<details>
<summary>정답</summary>

①

</details>

해설: `한 Entity가 여러 상대와 연결`가 이 문제의 핵심입니다.

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

`ER Model · ERD`를 다시 볼 때 다음 순서로 확인합니다.

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

`ER Model · ERD`를 다시 볼 때 다음 순서로 확인합니다.

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

`ER Model · ERD`를 다시 볼 때 다음 순서로 확인합니다.

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

`ER Model · ERD`를 다시 볼 때 다음 순서로 확인합니다.

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

`ER Model · ERD`를 다시 볼 때 다음 순서로 확인합니다.

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

`ER Model · ERD`를 다시 볼 때 다음 순서로 확인합니다.

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

`ER Model · ERD`를 다시 볼 때 다음 순서로 확인합니다.

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

**Entity · Attribute · Relationship**입니다.

ER Model의 세 핵심 구성 요소를 각각 구체적으로 정리합니다.
