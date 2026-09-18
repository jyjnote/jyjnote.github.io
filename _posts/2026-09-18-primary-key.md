---
title: Primary Key · 기본키
date: 2026-09-18 20:45:00 +0900
slug: primary-key
permalink: /posts/primary-key/
categories: [CS, 데이터베이스]
tags: [PrimaryKey, 기본키, CandidateKey, ForeignKey, Key, RDB, 무결성, 정보처리기사, NCS]
math: true
---

Primary Key(기본키)는 **Candidate Key 중에서 Table의 각 Row를 대표로 식별하도록 선택한 Key**입니다.

각 Row를 확실하게 구별해야 하므로 중복과 NULL을 허용하지 않습니다.

<blockquote class="prompt-info">
<p>한 줄: Primary Key는 Candidate Key 중 대표로 선택된 Row 식별자입니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

Primary Key = Candidate Key 중 대표 하나이며, 중복과 NULL을 허용하지 않습니다.

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

이 글에서는 `EMPLOYEE`, `DEPARTMENT`, `ORDER_ITEM`을 중심으로 봅니다.

## 핵심 예시

EMPLOYEE 일부입니다.

| EMP_ID | EMP_NAME | DEPT_ID | SALARY |
| ---: | --- | ---: | ---: |
| 1001 | 직원1 | 10 | 2890 |
| 1002 | 직원2 | 20 | 2980 |
| 1003 | 직원3 | 30 | 3070 |

여기서 `EMP_ID`는 각 직원 Row를 고유하게 구별합니다.

```text
1001 → 직원1
1002 → 직원2
1003 → 직원3
```

따라서 `EMP_ID`는 Row 식별 기준으로 적합합니다.

실제 Schema에서는 다음처럼 정의되어 있습니다.

```sql
EMP_ID INTEGER PRIMARY KEY
```

<mark>Primary Key는 Table의 각 Row를 대표로 식별하는 Key입니다.</mark>

## Candidate Key와 Primary Key

먼저 후보키와의 관계를 봐야 합니다.

```text
Super Key
↓ 최소성 만족
Candidate Key
↓ 대표 하나 선택
Primary Key
```

Candidate Key가 여러 개 있을 수 있습니다.

그중 실제 Table에서 대표 식별자로 사용할 하나를 선택합니다.

그 Key가 Primary Key입니다.

## Primary Key의 핵심 조건

Primary Key는 다음 특징을 가집니다.

- Row를 유일하게 식별해야 합니다.
- 중복 값을 허용하지 않습니다.
- NULL을 허용하지 않습니다.
- 하나의 Table에는 하나의 Primary Key만 정의합니다.

마지막 항목에서 주의할 점이 있습니다.

Primary Key 자체는 하나지만 여러 Column을 묶은 복합 Primary Key는 가능합니다.

## 중복을 허용하지 않는다

Primary Key 값은 각 Row마다 달라야 합니다.

다음은 올바른 형태입니다.

```text
EMP_ID

1001
1002
1003
```

다음처럼 중복되면 안 됩니다.

```text
EMP_ID

1001
1001
1003
```

두 Row가 같은 Primary Key를 가지면 어떤 Row인지 구별할 수 없기 때문입니다.

<blockquote class="prompt-warning">
<p>Primary Key의 값은 각 Row에서 유일해야 합니다.</p>
</blockquote>

## NULL을 허용하지 않는다

Primary Key는 Row를 반드시 식별해야 합니다.

그런데 값이 NULL이면 식별 기준 자체가 없습니다.

```text
EMP_ID = NULL
```

이 상태로는 어떤 직원인지 확실하게 구별할 수 없습니다.

따라서 Primary Key는 NULL을 허용하지 않습니다.

```text
Primary Key
→ UNIQUE 성질
→ NOT NULL 성질
```

## 하나의 Table에는 Primary Key가 하나다

Table에는 대표 Primary Key를 하나만 정합니다.

다만 여러 Column을 묶어 하나의 복합 Primary Key를 만들 수 있습니다.

## 단일 Primary Key

하나의 Column만 사용하는 경우입니다.

```sql
CREATE TABLE EMPLOYEE(
    EMP_ID INTEGER PRIMARY KEY,
    EMP_NAME TEXT NOT NULL
);
```

여기서는 `EMP_ID` 하나가 Primary Key입니다.

## 복합 Primary Key

여러 Column을 묶어 하나의 Primary Key를 만들 수도 있습니다.

실습 DB의 ORDER_ITEM을 봅시다.

| ORDER_ID | PRODUCT_ID | QTY |
| --- | --- | ---: |
| O0001 | P002 | 2 |
| O0001 | P009 | 1 |
| O0002 | P003 | 3 |

`ORDER_ID`만으로는 Row를 구별할 수 없습니다.

```text
O0001
O0001
```

`PRODUCT_ID`도 다른 주문에서 반복될 수 있습니다.

따라서 두 Column을 함께 사용합니다.

```text
ORDER_ID + PRODUCT_ID
```

실제 Schema는 다음과 같습니다.

```sql
PRIMARY KEY(ORDER_ID, PRODUCT_ID)
```

이 두 Column을 합친 전체가 하나의 Primary Key입니다.

<mark>Primary Key는 하나만 존재하지만 여러 Column으로 구성될 수 있습니다.</mark>



## Primary Key와 Foreign Key

둘은 역할이 다릅니다.

| 구분 | Primary Key | Foreign Key |
| --- | --- | --- |
| 목적 | 자신의 Row 식별 | 다른 Table 참조 |
| 중복 | 허용 안 함 | 허용 가능 |
| NULL | 허용 안 함 | 허용 가능 |
| Table 관계 | 기준이 됨 | 기준을 참조 |

EMPLOYEE와 DEPARTMENT를 보면 다음과 같습니다.

```text
DEPARTMENT.DEPT_ID
→ Primary Key

EMPLOYEE.DEPT_ID
→ Foreign Key
```

관계는 다음과 같습니다.

```text
EMPLOYEE.DEPT_ID
↓ 참조
DEPARTMENT.DEPT_ID
```

Primary Key는 식별 기준이고 Foreign Key는 그 기준을 참조합니다.

## Foreign Key에는 중복이 가능하다

여러 직원이 같은 부서에 속할 수 있습니다.

EMPLOYEE의 DEPT_ID를 보면 다음처럼 같은 값이 반복될 수 있습니다.

```text
10
20
30
10
20
```

Foreign Key에서는 이런 중복이 가능합니다.

반면 DEPARTMENT의 Primary Key인 DEPT_ID는 중복되면 안 됩니다.

```text
10
20
30
40
50
```




## 잘 놓치는 핵심

### 1. Primary Key는 Candidate Key 중 하나다

```text
Candidate Key
↓ 대표 선택
Primary Key
```

처음부터 별개의 Key 종류가 아닙니다.

### 2. 중복과 NULL을 허용하지 않는다

```text
중복 X
NULL X
```

Row를 확실하게 식별해야 하기 때문입니다.

### 3. Primary Key는 하나지만 Column은 여러 개일 수 있다

```text
PRIMARY KEY(ORDER_ID, PRODUCT_ID)
```

복합 Primary Key가 가능합니다.

### 4. Foreign Key와 역할이 다르다

```text
Primary Key
→ 자신의 Row 식별

Foreign Key
→ 다른 Table 참조
```

### 5. Candidate Key가 여러 개여도 Primary Key는 대표 하나를 고른다

선택되지 않은 Candidate Key는 Alternate Key가 됩니다.

## 시험·면접

### 핵심 암기

```text
Primary Key
= Candidate Key 중 대표 하나
```

### 핵심 특징

```text
유일성 O
최소성 O
중복 X
NULL X
```

### 복합 Primary Key

```text
PRIMARY KEY(A, B)
```

여러 Column을 묶어서 하나의 Primary Key를 만들 수 있습니다.

### Primary Key와 Foreign Key

```text
Primary Key
→ 식별 기준

Foreign Key
→ 다른 Table의 Key 참조
```

### 시험 함정

다음 문장은 틀렸습니다.

```text
Primary Key는 반드시 Column 하나로만 구성된다.
```

복합 Primary Key가 존재할 수 있기 때문입니다.

### 면접에서 짧게 답한다면

Primary Key는 Candidate Key 중에서 Table의 각 Row를 대표로 식별하도록 선택한 Key입니다.

중복과 NULL을 허용하지 않으며, 여러 Column을 묶은 복합 Primary Key도 사용할 수 있습니다.


## 객관식 문제

### 1. Primary Key에 대한 설명으로 옳은 것은?

① 모든 Super Key 중 아무 조합이나 선택한다.  
② Candidate Key 중 대표 하나를 선택한다.  
③ Foreign Key 중 하나를 선택한다.  
④ 반드시 문자열이어야 한다.

<details>
<summary>정답</summary>

②

</details>

### 2. Primary Key가 허용하지 않는 것은?

① 정수 값  
② 문자 값  
③ 중복과 NULL  
④ 복합 Column

<details>
<summary>정답</summary>

③

</details>

### 3. 다음 중 복합 Primary Key의 올바른 예는?

① PRIMARY KEY(A, B)  
② FOREIGN KEY(A, B)  
③ SELECT KEY(A, B)  
④ UNIQUE NULL(A, B)

<details>
<summary>정답</summary>

①

</details>

### 4. Primary Key와 Foreign Key의 차이로 옳은 것은?

① 둘 다 반드시 중복 가능하다.  
② Primary Key는 자신의 Row를 식별하고 Foreign Key는 다른 Table을 참조한다.  
③ Foreign Key만 Row를 식별한다.  
④ 두 개념은 완전히 같다.

<details>
<summary>정답</summary>

②

</details>

### 5. 다음 설명 중 틀린 것은?

① Primary Key는 NULL을 허용하지 않는다.  
② Primary Key는 중복을 허용하지 않는다.  
③ Primary Key는 여러 Column으로 구성될 수 있다.  
④ 하나의 Table에 서로 독립된 Primary Key를 여러 개 둘 수 있다.

<details>
<summary>정답</summary>

④

</details>

### 6. ORDER_ITEM에서 `ORDER_ID`와 `PRODUCT_ID`를 함께 Primary Key로 사용하는 이유는?

① 둘 다 삭제하기 위해  
② 하나의 Column만으로 Row를 충분히 구별할 수 없기 때문에  
③ SQL을 짧게 만들기 위해  
④ NULL을 허용하기 위해

<details>
<summary>정답</summary>

②

</details>

## 다음에 이을 글

**Alternate Key · 대체키**입니다.  
Candidate Key 중 Primary Key로 선택되지 않은 나머지 Key를 알아봅니다.
