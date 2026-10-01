---
title: 개념 · 논리 · 물리 모델링
date: 2026-09-18 23:20:00 +0900
slug: conceptual-logical-physical-modeling
permalink: /posts/conceptual-logical-physical-modeling/
categories: [CS, 데이터베이스]
tags: [데이터모델링, 개념모델링, 논리모델링, 물리모델링, ERD, Schema, 정보처리기사, NCS]
math: true
---

데이터 모델링은 현실 세계의 업무와 데이터를 단계적으로 구조화하여 데이터베이스 설계로 변환하는 과정입니다.

이 글에서는 정의만 외우지 않고 실제 Table을 어떻게 보고 판단하는지까지 연결합니다.

<blockquote class="prompt-info">
<p>한 줄: 개념 모델링은 무엇을 저장할지, 논리 모델링은 어떻게 구조화할지, 물리 모델링은 실제 DBMS에 어떻게 구현할지를 정합니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

개념 → 업무 개체와 관계 / 논리 → Attribute·Key·정규화 / 물리 → Data Type·Index·제약조건

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


## 전체 흐름

세 단계는 보통 다음 흐름으로 이어집니다.

```text
현실 업무
↓
개념 모델링
↓
논리 모델링
↓
물리 모델링
↓
실제 Database
```

단계가 내려갈수록 추상적인 업무 개념이 구체적인 Table과 Column으로 바뀝니다.

## 개념 모델링

개념 모델링은 업무에서 어떤 개체가 존재하고 서로 어떤 관계가 있는지를 찾는 단계입니다.

예를 들어 쇼핑몰이라면 다음을 찾습니다.

```text
고객
주문
상품
```

그리고 관계를 생각합니다.

```text
고객 → 주문한다 → 주문
주문 → 포함한다 → 상품
```

이 단계에서는 DBMS별 Data Type이나 Index보다 업무 구조 자체가 중요합니다.

## 논리 모델링

논리 모델링은 개념 모델을 관계형 구조로 구체화합니다.

```text
고객
→ CUSTOMER

주문
→ ORDERS

상품
→ PRODUCT
```

그리고 Attribute와 Key를 정합니다.

```text
CUSTOMER
→ CUSTOMER_ID
→ NAME
→ REGION
→ GRADE
```

정규화와 함수 종속성도 이 단계에서 중요합니다.

## 물리 모델링

물리 모델링은 실제 DBMS에 맞춰 구현 세부사항을 정합니다.

예를 들어 SQLite에서는 다음처럼 작성할 수 있습니다.

```sql
CREATE TABLE CUSTOMER(
    CUSTOMER_ID TEXT PRIMARY KEY,
    NAME TEXT NOT NULL,
    REGION TEXT,
    GRADE TEXT
);
```

Data Type, Index, 제약조건, 저장 구조 같은 구현 요소를 결정합니다.

## 세 단계 비교

| 구분 | 핵심 질문 | 대표 결과 |
| --- | --- | --- |
| 개념 | 무엇이 존재하고 어떻게 관계되는가 | Entity, Relationship |
| 논리 | 어떤 Attribute와 Key로 구조화할까 | Relation, PK, FK, 정규화 |
| 물리 | 실제 DBMS에 어떻게 구현할까 | Data Type, Index, DDL |

시험에서는 이 세 단계의 추상화 수준을 구분하는 문제가 자주 나옵니다.

## 실습 DB에 적용

실습 DB를 세 단계로 보면 다음과 같습니다.

```text
개념
→ 직원은 부서에 소속된다.

논리
→ EMPLOYEE.DEPT_ID가 DEPARTMENT.DEPT_ID를 참조한다.

물리
→ FOREIGN KEY(DEPT_ID) REFERENCES DEPARTMENT(DEPT_ID)
```

같은 사실을 단계마다 다른 수준으로 표현합니다.

## 정규화와 논리 모델링

정규화는 보통 논리 모델링에서 중요한 역할을 합니다.

중복과 이상 현상을 줄이기 위해 Relation을 분해합니다.

```text
하나의 큰 Table
↓
함수 종속성 분석
↓
여러 Relation으로 분해
```

1NF, 2NF, 3NF, BCNF가 이 흐름에 연결됩니다.

## 물리 모델링의 성능 고려

논리적으로 잘 분해된 구조라도 실제 조회 성능을 위해 Index나 반정규화를 고려할 수 있습니다.

```text
논리 모델
→ 정합성과 중복 최소화

물리 모델
→ 실제 성능과 운영 환경 고려
```

즉 논리 모델과 물리 모델의 목표는 완전히 같지 않습니다.

## 다른 개념과 비교

### 비교 1. 개념

```text
개념
→ 업무 Entity와 Relationship
```

비교할 때는 **무엇을 결정하는가**, **어떤 중복을 줄이는가**, **어떤 성능 비용이 생기는가**를 구분합니다.

### 비교 2. 논리

```text
논리
→ Attribute·Key·정규화
```

비교할 때는 **무엇을 결정하는가**, **어떤 중복을 줄이는가**, **어떤 성능 비용이 생기는가**를 구분합니다.

### 비교 3. 물리

```text
물리
→ Data Type·Index·DDL
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

`개념 · 논리 · 물리 모델링` 문제에서는 결과를 외우기보다 **왜 이 구조가 필요한지**를 설명할 수 있어야 합니다.

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

`개념 · 논리 · 물리 모델링` 문제에서는 결과를 외우기보다 **왜 이 구조가 필요한지**를 설명할 수 있어야 합니다.

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

`개념 · 논리 · 물리 모델링` 문제에서는 결과를 외우기보다 **왜 이 구조가 필요한지**를 설명할 수 있어야 합니다.

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

`개념 · 논리 · 물리 모델링` 문제에서는 결과를 외우기보다 **왜 이 구조가 필요한지**를 설명할 수 있어야 합니다.

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

`개념 · 논리 · 물리 모델링` 문제에서는 결과를 외우기보다 **왜 이 구조가 필요한지**를 설명할 수 있어야 합니다.

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

`개념 · 논리 · 물리 모델링` 문제에서는 결과를 외우기보다 **왜 이 구조가 필요한지**를 설명할 수 있어야 합니다.

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

`개념 · 논리 · 물리 모델링`에서도 데이터 몇 Row만 보고 판단하지 말고 **Schema의 의미와 업무 규칙**을 기준으로 봅니다.

### 실수 2. Key를 찾기 전에 정규형부터 판단한다.

이 실수를 피하려면 다음 순서를 지킵니다.

```text
업무 규칙
→ Key
→ 함수 종속
→ 이상 현상
→ 필요한 분해
```

`개념 · 논리 · 물리 모델링`에서도 데이터 몇 Row만 보고 판단하지 말고 **Schema의 의미와 업무 규칙**을 기준으로 봅니다.

### 실수 3. 함수 종속을 현재 데이터 값의 우연한 중복 여부로만 판단한다.

이 실수를 피하려면 다음 순서를 지킵니다.

```text
업무 규칙
→ Key
→ 함수 종속
→ 이상 현상
→ 필요한 분해
```

`개념 · 논리 · 물리 모델링`에서도 데이터 몇 Row만 보고 판단하지 말고 **Schema의 의미와 업무 규칙**을 기준으로 봅니다.

### 실수 4. 정규화 단계를 건너뛰고 바로 3NF나 BCNF라고 판단한다.

이 실수를 피하려면 다음 순서를 지킵니다.

```text
업무 규칙
→ Key
→ 함수 종속
→ 이상 현상
→ 필요한 분해
```

`개념 · 논리 · 물리 모델링`에서도 데이터 몇 Row만 보고 판단하지 말고 **Schema의 의미와 업무 규칙**을 기준으로 봅니다.

### 실수 5. 분해 후 어떤 Attribute가 어느 Relation으로 가야 하는지 확인하지 않는다.

이 실수를 피하려면 다음 순서를 지킵니다.

```text
업무 규칙
→ Key
→ 함수 종속
→ 이상 현상
→ 필요한 분해
```

`개념 · 논리 · 물리 모델링`에서도 데이터 몇 Row만 보고 판단하지 말고 **Schema의 의미와 업무 규칙**을 기준으로 봅니다.

### 실수 6. 정규화와 반정규화를 무조건 좋은 것과 나쁜 것으로 나눈다.

이 실수를 피하려면 다음 순서를 지킵니다.

```text
업무 규칙
→ Key
→ 함수 종속
→ 이상 현상
→ 필요한 분해
```

`개념 · 논리 · 물리 모델링`에서도 데이터 몇 Row만 보고 판단하지 말고 **Schema의 의미와 업무 규칙**을 기준으로 봅니다.

## 잘 놓치는 핵심

### 1. 전체 흐름

세 단계는 보통 다음 흐름으로 이어집니다.

핵심은 결과를 외우는 것이 아니라 **왜 이 구조가 필요한지**를 설명할 수 있는 것입니다.

### 2. 개념 모델링

개념 모델링은 업무에서 어떤 개체가 존재하고 서로 어떤 관계가 있는지를 찾는 단계입니다.

핵심은 결과를 외우는 것이 아니라 **왜 이 구조가 필요한지**를 설명할 수 있는 것입니다.

### 3. 논리 모델링

논리 모델링은 개념 모델을 관계형 구조로 구체화합니다.

핵심은 결과를 외우는 것이 아니라 **왜 이 구조가 필요한지**를 설명할 수 있는 것입니다.

### 4. 물리 모델링

물리 모델링은 실제 DBMS에 맞춰 구현 세부사항을 정합니다.

핵심은 결과를 외우는 것이 아니라 **왜 이 구조가 필요한지**를 설명할 수 있는 것입니다.

### 5. 세 단계 비교

| 구분 | 핵심 질문 | 대표 결과 |

핵심은 결과를 외우는 것이 아니라 **왜 이 구조가 필요한지**를 설명할 수 있는 것입니다.

### 6. 실습 DB에 적용

실습 DB를 세 단계로 보면 다음과 같습니다.

핵심은 결과를 외우는 것이 아니라 **왜 이 구조가 필요한지**를 설명할 수 있는 것입니다.

## 시험·면접

### 핵심 암기

```text
개념 → 업무 개체와 관계 / 논리 → Attribute·Key·정규화 / 물리 → Data Type·Index·제약조건
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

데이터 모델링은 현실 세계의 업무와 데이터를 단계적으로 구조화하여 데이터베이스 설계로 변환하는 과정입니다.

정규화와 모델링에서는 Key와 함수 종속을 기준으로 중복과 이상 현상을 줄이는 방향으로 구조를 설계합니다.

## 예시로 한 바퀴

`개념 · 논리 · 물리 모델링` 문제를 만나면 작은 Relation부터 그립니다.

```text
Key
→ 결정되는 Attribute
→ 반복되는 사실
→ 발생 가능한 이상 현상
```

그다음 어떤 Attribute가 어떤 Key에 종속되는지 화살표로 표시합니다.

마지막으로 분해가 필요하다면 **같은 사실을 한 곳에서만 관리할 수 있도록** Relation을 나눕니다.

## 객관식 문제

### 1. 정규화는 주로 어느 단계와 관련이 깊은가?

① 논리 모델링  
② 항상 모든 Row 삭제  
③ Index만 생성  
④ Foreign Key는 항상 불필요

<details>
<summary>정답</summary>

①

</details>

해설: `논리 모델링`가 이 문제의 핵심입니다.

### 2. Index 설계는 주로?

① 물리 모델링  
② 항상 모든 Row 삭제  
③ Index만 생성  
④ Foreign Key는 항상 불필요

<details>
<summary>정답</summary>

①

</details>

해설: `물리 모델링`가 이 문제의 핵심입니다.

### 3. Entity와 관계를 찾는 단계는?

① 개념 모델링  
② 항상 모든 Row 삭제  
③ Index만 생성  
④ Foreign Key는 항상 불필요

<details>
<summary>정답</summary>

①

</details>

해설: `개념 모델링`가 이 문제의 핵심입니다.

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


## 다음에 이을 글

**ER Model · ERD**입니다.

개념 모델링에서 사용하는 Entity, Attribute, Relationship을 그림으로 표현하는 ER Model과 ERD를 알아봅니다.
