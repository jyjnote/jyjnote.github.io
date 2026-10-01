---
title: Cardinality
date: 2026-09-18 23:35:00 +0900
slug: cardinality
permalink: /posts/cardinality/
categories: [CS, 데이터베이스]
tags: [Cardinality, ERD, 1to1, 1toN, NtoM, Relationship, 데이터모델링, 정보처리기사, NCS]
math: true
---

Cardinality는 하나의 Entity Instance가 다른 Entity의 몇 개 Instance와 관계를 맺을 수 있는지를 나타냅니다.

이 글에서는 정의만 외우지 않고 실제 Table을 어떻게 보고 판단하는지까지 연결합니다.

<blockquote class="prompt-info">
<p>한 줄: Cardinality는 관계의 개수를 1:1, 1:N, N:M 같은 형태로 표현합니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

Cardinality = Entity 사이 관계의 개수

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


## 1:1

한쪽 한 Row가 다른 쪽 한 Row와 대응합니다.

```text
A 1
│
│
1 B
```

예를 들어 특정 업무에서는 사용자와 사용자 상세 정보를 1:1로 분리할 수 있습니다.

## 1:N

가장 흔한 관계입니다.

```text
DEPARTMENT 1
↓
EMPLOYEE N
```

부서 하나에는 여러 직원이 있을 수 있습니다.

Foreign Key는 일반적으로 N 쪽인 EMPLOYEE에 둡니다.

## N:M

양쪽 모두 여러 개와 연결될 수 있습니다.

```text
ORDERS N
↕
M PRODUCT
```

주문 하나에 여러 상품이 있고, 상품 하나가 여러 주문에 포함될 수 있습니다.

관계형 DB에서는 중간 Table로 풀어냅니다.

## N:M 해소

실습 DB에서는 ORDER_ITEM이 중간 Table 역할을 합니다.

```text
ORDERS 1:N ORDER_ITEM
ORDER_ITEM N:1 PRODUCT
```

결과적으로 N:M을 두 개의 1:N 관계로 분해합니다.

## 최소 Cardinality

관계가 필수인지 선택인지도 중요합니다.

```text
0
→ 관계가 없어도 됨

1
→ 최소 하나 필요
```

예를 들어 직원이 반드시 부서에 속해야 하는지 여부는 업무 규칙에 따라 달라집니다.

## Foreign Key 위치

1:N 관계에서는 일반적으로 N 쪽에 Foreign Key를 둡니다.

```text
DEPARTMENT 1
EMPLOYEE N

EMPLOYEE.DEPT_ID
→ Foreign Key
```

이 구조를 기억하면 ERD를 관계형 Schema로 변환하기 쉽습니다.

## Cardinality와 NULL

관계가 선택적이라면 Foreign Key가 NULL을 허용할 수 있습니다.

```text
직원
→ 아직 부서 미배정
→ DEPT_ID = NULL 가능
```

실제 허용 여부는 업무 규칙과 NOT NULL 제약에 따라 정합니다.

## 시험 해석

문제에서 다음 문장을 보면 Cardinality를 바로 그려봅니다.

```text
한 부서에는 여러 직원이 있다.
각 직원은 하나의 부서에 속한다.
```

결론:

```text
DEPARTMENT 1:N EMPLOYEE
```

## 다른 개념과 비교

### 비교 1. 1:1

```text
1:1
→ 한 개 대 한 개
```

비교할 때는 **무엇을 결정하는가**, **어떤 중복을 줄이는가**, **어떤 성능 비용이 생기는가**를 구분합니다.

### 비교 2. 1:N

```text
1:N
→ 한 개 대 여러 개
```

비교할 때는 **무엇을 결정하는가**, **어떤 중복을 줄이는가**, **어떤 성능 비용이 생기는가**를 구분합니다.

### 비교 3. N:M

```text
N:M
→ 여러 개 대 여러 개
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

`Cardinality` 문제에서는 결과를 외우기보다 **왜 이 구조가 필요한지**를 설명할 수 있어야 합니다.

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

`Cardinality` 문제에서는 결과를 외우기보다 **왜 이 구조가 필요한지**를 설명할 수 있어야 합니다.

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

`Cardinality` 문제에서는 결과를 외우기보다 **왜 이 구조가 필요한지**를 설명할 수 있어야 합니다.

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

`Cardinality` 문제에서는 결과를 외우기보다 **왜 이 구조가 필요한지**를 설명할 수 있어야 합니다.

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

`Cardinality` 문제에서는 결과를 외우기보다 **왜 이 구조가 필요한지**를 설명할 수 있어야 합니다.

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

`Cardinality` 문제에서는 결과를 외우기보다 **왜 이 구조가 필요한지**를 설명할 수 있어야 합니다.

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

`Cardinality`에서도 데이터 몇 Row만 보고 판단하지 말고 **Schema의 의미와 업무 규칙**을 기준으로 봅니다.

### 실수 2. Key를 찾기 전에 정규형부터 판단한다.

이 실수를 피하려면 다음 순서를 지킵니다.

```text
업무 규칙
→ Key
→ 함수 종속
→ 이상 현상
→ 필요한 분해
```

`Cardinality`에서도 데이터 몇 Row만 보고 판단하지 말고 **Schema의 의미와 업무 규칙**을 기준으로 봅니다.

### 실수 3. 함수 종속을 현재 데이터 값의 우연한 중복 여부로만 판단한다.

이 실수를 피하려면 다음 순서를 지킵니다.

```text
업무 규칙
→ Key
→ 함수 종속
→ 이상 현상
→ 필요한 분해
```

`Cardinality`에서도 데이터 몇 Row만 보고 판단하지 말고 **Schema의 의미와 업무 규칙**을 기준으로 봅니다.

### 실수 4. 정규화 단계를 건너뛰고 바로 3NF나 BCNF라고 판단한다.

이 실수를 피하려면 다음 순서를 지킵니다.

```text
업무 규칙
→ Key
→ 함수 종속
→ 이상 현상
→ 필요한 분해
```

`Cardinality`에서도 데이터 몇 Row만 보고 판단하지 말고 **Schema의 의미와 업무 규칙**을 기준으로 봅니다.

### 실수 5. 분해 후 어떤 Attribute가 어느 Relation으로 가야 하는지 확인하지 않는다.

이 실수를 피하려면 다음 순서를 지킵니다.

```text
업무 규칙
→ Key
→ 함수 종속
→ 이상 현상
→ 필요한 분해
```

`Cardinality`에서도 데이터 몇 Row만 보고 판단하지 말고 **Schema의 의미와 업무 규칙**을 기준으로 봅니다.

### 실수 6. 정규화와 반정규화를 무조건 좋은 것과 나쁜 것으로 나눈다.

이 실수를 피하려면 다음 순서를 지킵니다.

```text
업무 규칙
→ Key
→ 함수 종속
→ 이상 현상
→ 필요한 분해
```

`Cardinality`에서도 데이터 몇 Row만 보고 판단하지 말고 **Schema의 의미와 업무 규칙**을 기준으로 봅니다.

## 잘 놓치는 핵심

### 1. 1:1

한쪽 한 Row가 다른 쪽 한 Row와 대응합니다.

핵심은 결과를 외우는 것이 아니라 **왜 이 구조가 필요한지**를 설명할 수 있는 것입니다.

### 2. 1:N

가장 흔한 관계입니다.

핵심은 결과를 외우는 것이 아니라 **왜 이 구조가 필요한지**를 설명할 수 있는 것입니다.

### 3. N:M

양쪽 모두 여러 개와 연결될 수 있습니다.

핵심은 결과를 외우는 것이 아니라 **왜 이 구조가 필요한지**를 설명할 수 있는 것입니다.

### 4. N:M 해소

실습 DB에서는 ORDER_ITEM이 중간 Table 역할을 합니다.

핵심은 결과를 외우는 것이 아니라 **왜 이 구조가 필요한지**를 설명할 수 있는 것입니다.

### 5. 최소 Cardinality

관계가 필수인지 선택인지도 중요합니다.

핵심은 결과를 외우는 것이 아니라 **왜 이 구조가 필요한지**를 설명할 수 있는 것입니다.

### 6. Foreign Key 위치

1:N 관계에서는 일반적으로 N 쪽에 Foreign Key를 둡니다.

핵심은 결과를 외우는 것이 아니라 **왜 이 구조가 필요한지**를 설명할 수 있는 것입니다.

## 시험·면접

### 핵심 암기

```text
Cardinality = Entity 사이 관계의 개수
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

Cardinality는 하나의 Entity Instance가 다른 Entity의 몇 개 Instance와 관계를 맺을 수 있는지를 나타냅니다.

정규화와 모델링에서는 Key와 함수 종속을 기준으로 중복과 이상 현상을 줄이는 방향으로 구조를 설계합니다.

## 예시로 한 바퀴

`Cardinality` 문제를 만나면 작은 Relation부터 그립니다.

```text
Key
→ 결정되는 Attribute
→ 반복되는 사실
→ 발생 가능한 이상 현상
```

그다음 어떤 Attribute가 어떤 Key에 종속되는지 화살표로 표시합니다.

마지막으로 분해가 필요하다면 **같은 사실을 한 곳에서만 관리할 수 있도록** Relation을 나눕니다.

## 객관식 문제

### 1. 1:N에서 FK는 보통 어느 쪽에 두는가?

① N 쪽  
② 항상 모든 Row 삭제  
③ Index만 생성  
④ Foreign Key는 항상 불필요

<details>
<summary>정답</summary>

①

</details>

해설: `N 쪽`가 이 문제의 핵심입니다.

### 2. N:M은 관계형 DB에서 어떻게 푸는가?

① 중간 Table  
② 항상 모든 Row 삭제  
③ Index만 생성  
④ Foreign Key는 항상 불필요

<details>
<summary>정답</summary>

①

</details>

해설: `중간 Table`가 이 문제의 핵심입니다.

### 3. 0..1의 의미는?

① 선택적으로 하나  
② 항상 모든 Row 삭제  
③ Index만 생성  
④ Foreign Key는 항상 불필요

<details>
<summary>정답</summary>

①

</details>

해설: `선택적으로 하나`가 이 문제의 핵심입니다.

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

`Cardinality`를 다시 볼 때 다음 순서로 확인합니다.

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

`Cardinality`를 다시 볼 때 다음 순서로 확인합니다.

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

`Cardinality`를 다시 볼 때 다음 순서로 확인합니다.

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

`Cardinality`를 다시 볼 때 다음 순서로 확인합니다.

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

`Cardinality`를 다시 볼 때 다음 순서로 확인합니다.

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

`Cardinality`를 다시 볼 때 다음 순서로 확인합니다.

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

`Cardinality`를 다시 볼 때 다음 순서로 확인합니다.

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

**Functional Dependency**입니다.

정규화의 출발점이 되는 함수 종속성을 구체적인 예시로 알아봅니다.
