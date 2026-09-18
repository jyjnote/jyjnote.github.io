---
title: Candidate Key · 후보키
date: 2026-09-18 20:40:00 +0900
slug: candidate-key
permalink: /posts/candidate-key/
categories: [CS, 데이터베이스]
tags: [CandidateKey, 후보키, Key, SuperKey, PrimaryKey, AlternateKey, 유일성, 최소성, 정보처리기사, NCS]
math: true
---

Candidate Key(후보키)는 **Table의 Row를 유일하게 식별하면서, 불필요한 Attribute가 없는 최소한의 Key**입니다.

즉 Super Key 중에서 **유일성과 최소성을 모두 만족하는 Key**입니다.

<blockquote class="prompt-info">
<p>한 줄: Candidate Key는 Row를 유일하게 구별하는 최소한의 Key입니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

Candidate Key = 유일성 + 최소성을 만족하는 Super Key입니다.

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

이 글에서는 `EMPLOYEE`와 `ORDER_ITEM`을 중심으로 봅니다.

## 핵심 예시

EMPLOYEE 일부입니다.

| EMP_ID | EMP_NAME | DEPT_ID | SALARY |
| ---: | --- | ---: | ---: |
| 1001 | 직원1 | 10 | 2890 |
| 1002 | 직원2 | 20 | 2980 |
| 1003 | 직원3 | 30 | 3070 |

`EMP_ID`는 각 Row를 고유하게 구별합니다.

```text
1001 → 직원1
1002 → 직원2
1003 → 직원3
```

따라서 유일성을 만족합니다.

또한 `EMP_ID` 하나에서 더 제거할 Attribute가 없습니다.

따라서 최소성도 만족합니다.

```text
{EMP_ID}
→ 유일성 O
→ 최소성 O
→ Candidate Key
```

<mark>Candidate Key는 Row를 구별할 수 있을 뿐 아니라 불필요한 Attribute가 없어야 합니다.</mark>


## Candidate Key의 두 조건

Candidate Key는 다음 두 조건을 모두 만족해야 합니다.

```text
유일성
+
최소성
```

둘 중 하나라도 만족하지 않으면 Candidate Key가 아닙니다.

## 유일성

유일성은 Key 값으로 하나의 Row만 식별할 수 있는 성질입니다.

다음 Table을 봅시다.

| EMP_ID | EMP_NAME | DEPT_ID |
| ---: | --- | ---: |
| 1001 | 김민수 | 10 |
| 1002 | 김민수 | 20 |
| 1003 | 이영희 | 10 |

`EMP_ID`는 모두 다릅니다.

```text
{EMP_ID}
→ 유일성 O
```

반면 `EMP_NAME`은 김민수가 반복됩니다.

```text
{EMP_NAME}
→ 유일성 X
```

따라서 이 데이터 구조에서 `EMP_NAME`만으로는 Candidate Key가 될 수 없습니다.

## 최소성

최소성은 **Key에서 Attribute 하나라도 제거하면 더 이상 Row를 유일하게 식별할 수 없어야 한다**는 뜻입니다.

예를 들어

```text
{EMP_ID, EMP_NAME}
```

을 봅시다.

`EMP_NAME`을 제거해도

```text
{EMP_ID}
```

만으로 Row를 식별할 수 있습니다.

따라서 원래 조합은 최소성을 만족하지 않습니다.

```text
{EMP_ID, EMP_NAME}
→ 유일성 O
→ 최소성 X
→ Candidate Key X
```

<blockquote class="prompt-warning">
<p>최소성은 Attribute 수가 무조건 1개여야 한다는 뜻이 아닙니다. 불필요한 Attribute가 없어야 한다는 뜻입니다.</p>
</blockquote>

## 최소성은 Column 수가 적다는 뜻이 아니다

다음 Table을 생각해봅시다.

| STUDENT_ID | SUBJECT_ID | SCORE |
| --- | --- | ---: |
| S01 | DB | 90 |
| S01 | OS | 85 |
| S02 | DB | 80 |

`STUDENT_ID`만으로는 Row를 구별할 수 없습니다.

`SUBJECT_ID`만으로도 Row를 구별할 수 없습니다.

하지만 두 값을 함께 사용하면 가능합니다.

```text
{STUDENT_ID, SUBJECT_ID}
```

여기서 둘 중 하나라도 제거하면 유일성이 깨집니다.

따라서 두 Attribute가 모두 필요합니다.

```text
{STUDENT_ID, SUBJECT_ID}
→ 유일성 O
→ 최소성 O
→ Candidate Key
```

즉 복합 Key도 Candidate Key가 될 수 있습니다.

## Super Key와 Candidate Key

두 개념의 차이는 최소성입니다.

| 구분 | 유일성 | 최소성 |
| --- | --- | --- |
| Super Key | O | 필요 없음 |
| Candidate Key | O | O |

예를 들어 `EMP_ID`가 유일하다고 해봅시다.

```text
{EMP_ID}
→ Super Key O
→ Candidate Key O
```

다음 조합도 Row를 구별할 수 있습니다.

```text
{EMP_ID, EMP_NAME}
```

하지만 `EMP_NAME`은 불필요합니다.

```text
{EMP_ID, EMP_NAME}
→ Super Key O
→ Candidate Key X
```

<mark>모든 Candidate Key는 Super Key지만, 모든 Super Key가 Candidate Key는 아닙니다.</mark>


## Candidate Key와 Primary Key

Candidate Key는 **Primary Key가 될 수 있는 후보들**입니다.

```text
Candidate Key
├─ 후보 1
├─ 후보 2
└─ 후보 3
```

이 중 대표 하나를 선택합니다.

```text
Candidate Key
↓ 하나 선택
Primary Key
```

따라서 Primary Key는 Candidate Key 중 하나입니다.


## ORDER_ITEM으로 보기

실습 DB의 ORDER_ITEM 일부입니다.

| ORDER_ID | PRODUCT_ID | QTY |
| --- | --- | ---: |
| O0001 | P002 | 2 |
| O0001 | P009 | 1 |
| O0002 | P003 | 3 |

`ORDER_ID` 하나만으로는 Row를 구별할 수 없습니다.

```text
O0001
O0001
```

`PRODUCT_ID`도 여러 주문에서 반복될 수 있습니다.

하지만 두 Column을 함께 사용하면 주문 상세 Row를 구별할 수 있습니다.

```text
{ORDER_ID, PRODUCT_ID}
```

실제 Schema에서는 다음처럼 정의되어 있습니다.

```sql
PRIMARY KEY(ORDER_ID, PRODUCT_ID)
```

이 조합은 Primary Key이므로 Candidate Key이기도 합니다.


## 현재 값만 보고 후보키를 정하면 안 된다

현재 값이 우연히 모두 달라도 앞으로 중복될 수 있습니다.

Candidate Key는 현재 데이터뿐 아니라 Schema와 제약조건에서 유일성이 보장되는지 봐야 합니다.

<blockquote class="prompt-danger">
<p>현재 값이 중복되지 않는다는 사실과 Candidate Key로 유일성이 보장된다는 것은 다릅니다.</p>
</blockquote>

## 잘 놓치는 핵심

### 1. Candidate Key는 유일성과 최소성을 모두 본다

```text
유일성
+
최소성
```

둘 다 필요합니다.

### 2. 최소성은 Column이 하나라는 뜻이 아니다

복합 Candidate Key도 가능합니다.

```text
{ORDER_ID, PRODUCT_ID}
```

둘 다 꼭 필요하다면 최소성을 만족합니다.

### 3. Candidate Key는 여러 개일 수 있다

하나의 Table에서 여러 후보가 존재할 수 있습니다.

### 4. Primary Key는 Candidate Key 중 하나다

```text
Candidate Key
↓ 대표 하나 선택
Primary Key
```

### 5. 선택되지 않은 Candidate Key는 Alternate Key가 된다

Candidate Key가 여러 개 있을 때 적용됩니다.

## 시험·면접

### 핵심 암기

```text
Candidate Key
= 유일성 + 최소성
```

### 핵심 관계

```text
Super Key
→ 유일성

Candidate Key
→ 유일성 + 최소성

Candidate Key 중 하나
→ Primary Key
```

### 시험 함정

다음 조합이 있다고 해봅시다.

```text
{EMP_ID, EMP_NAME}
```

`EMP_ID` 하나만으로 Row를 식별할 수 있다면 이 조합은 Candidate Key가 아닙니다.

최소성을 만족하지 않기 때문입니다.

### 면접에서 짧게 답한다면

Candidate Key는 Table의 Row를 유일하게 식별할 수 있는 Super Key 중에서 불필요한 Attribute가 없는 최소 Key입니다.

따라서 유일성과 최소성을 모두 만족하며, 여러 Candidate Key 중 하나를 Primary Key로 선택합니다.

## 예시로 한 바퀴

다음 Table을 봅시다.

| ID | EMAIL | NAME |
| ---: | --- | --- |
| 1 | a@test.com | 김철수 |
| 2 | b@test.com | 이영희 |
| 3 | c@test.com | 박민수 |

설계상 `ID`와 `EMAIL`이 각각 중복되지 않는다고 가정합니다.

첫 번째 후보입니다.

```text
{ID}
→ 유일성 O
→ 최소성 O
→ Candidate Key
```

두 번째 후보입니다.

```text
{EMAIL}
→ 유일성 O
→ 최소성 O
→ Candidate Key
```

세 번째 조합입니다.

```text
{ID, EMAIL}
→ 유일성 O
→ 최소성 X
→ Super Key
→ Candidate Key X
```

이 차이를 기억하면 후보키 문제를 쉽게 구분할 수 있습니다.

## 객관식 문제

### 1. Candidate Key의 조건은?

① 유일성만  
② 최소성만  
③ 유일성과 최소성  
④ 참조성과 정렬성

<details>
<summary>정답</summary>

③

</details>

### 2. `EMP_ID` 하나만으로 Row를 식별할 수 있을 때 `EMP_ID + EMP_NAME`이 Candidate Key가 아닌 이유는?

① 유일성이 없어서  
② 최소성이 없어서  
③ Foreign Key라서  
④ NULL이 있어서

<details>
<summary>정답</summary>

②

</details>

### 3. 모든 Candidate Key에 대한 설명으로 옳은 것은?

① 모두 Super Key이다.  
② 모두 Primary Key이다.  
③ 모두 Foreign Key이다.  
④ 최소성을 만족하지 않는다.

<details>
<summary>정답</summary>

①

</details>

### 4. Candidate Key가 여러 개 있을 때 대표로 선택하는 Key는?

① Super Key  
② Primary Key  
③ Foreign Key  
④ Composite Key

<details>
<summary>정답</summary>

②

</details>

### 5. Primary Key로 선택되지 않은 Candidate Key는?

① Alternate Key  
② Foreign Key  
③ Index  
④ Domain

<details>
<summary>정답</summary>

①

</details>

### 6. 복합 Candidate Key에 대한 설명으로 옳은 것은?

① Candidate Key는 반드시 Column 하나이다.  
② 여러 Column 모두가 식별에 필요하면 Candidate Key가 될 수 있다.  
③ 복합 Key는 유일성을 만족할 수 없다.  
④ 복합 Key는 항상 Super Key가 아니다.

<details>
<summary>정답</summary>

②

</details>

## 다음에 이을 글

**Primary Key · 기본키**입니다.  
여러 Candidate Key 중 대표로 선택되는 Key의 특징과 제약을 알아봅니다.
