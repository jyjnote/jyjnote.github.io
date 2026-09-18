---
title: Entity Integrity · 개체 무결성
date: 2026-09-18 21:00:00 +0900
slug: entity-integrity
permalink: /posts/entity-integrity/
categories: [CS, 데이터베이스]
tags: [EntityIntegrity, 개체무결성, PrimaryKey, NULL, 무결성, RDB, 정보처리기사, NCS]
math: true
---

개체 무결성(Entity Integrity)은 **Primary Key를 구성하는 Attribute는 NULL 값을 가질 수 없다는 규칙**입니다.

각 Row는 반드시 식별할 수 있어야 하므로 Primary Key 값이 비어 있으면 안 됩니다.

<blockquote class="prompt-info">
<p>한 줄: 개체 무결성은 Primary Key가 NULL이 될 수 없도록 하는 규칙입니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

Entity Integrity = Primary Key의 NULL을 금지하여 모든 Row를 식별 가능하게 유지하는 규칙입니다.

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

여기서 `EMP_ID`는 Primary Key입니다.

```text
EMP_ID = 1001
→ 직원1

EMP_ID = 1002
→ 직원2
```

각 Row를 구별하려면 `EMP_ID` 값이 반드시 존재해야 합니다.

다음과 같은 Row가 있다고 해봅시다.

```text
NULL | 직원4 | 10 | 3100
```

Primary Key인 `EMP_ID`가 NULL이므로 이 Row를 확실하게 식별할 수 없습니다.

따라서 허용하면 안 됩니다.

<mark>개체 무결성의 핵심은 모든 Row가 Primary Key를 통해 반드시 식별 가능해야 한다는 것입니다.</mark>


## 개체 무결성의 핵심 규칙

시험에서는 다음 한 문장을 기억하면 됩니다.

```text
Primary Key
→ NULL 불가
```

조금 더 정확히 말하면 Primary Key가 여러 Attribute로 구성되어 있다면 각 구성 Attribute가 NULL이면 안 됩니다.

## 실제 EMPLOYEE Schema

실습 DB의 EMPLOYEE 구조입니다.

```sql
CREATE TABLE EMPLOYEE(
    EMP_ID INTEGER PRIMARY KEY,
    EMP_NAME TEXT NOT NULL,
    DEPT_ID INTEGER,
    SALARY INTEGER,
    HIRE_DATE TEXT,
    MANAGER_ID INTEGER,
    BONUS INTEGER,
    FOREIGN KEY(DEPT_ID)
        REFERENCES DEPARTMENT(DEPT_ID)
);
```

여기서

```text
EMP_ID
→ Primary Key
→ NULL 불가
```

입니다.

`EMP_NAME`도 `NOT NULL`이지만 이유가 다릅니다.

```text
EMP_NAME
→ NOT NULL 제약조건

EMP_ID
→ Primary Key
→ 개체 무결성
```

둘을 구분해야 합니다.

## Primary Key와 NOT NULL

Primary Key는 기본적으로 NULL을 허용하지 않습니다.

따라서 다음과 같은 의미를 가집니다.

```text
PRIMARY KEY
→ Row 식별
→ NULL 불가
→ 중복 불가
```

하지만 개체 무결성이라는 개념에서 특히 강조하는 것은 **NULL 금지**입니다.

<blockquote class="prompt-warning">
<p>Primary Key의 중복 금지와 NULL 금지는 모두 중요하지만, 개체 무결성의 핵심 표현은 Primary Key는 NULL이 될 수 없다는 것입니다.</p>
</blockquote>

## 유일성과 개체 무결성

Primary Key는 Row를 유일하게 식별해야 합니다.

따라서 실제 DBMS에서는 다음 두 성질을 함께 가집니다.

```text
중복 불가
NULL 불가
```

하지만 시험에서 다음을 구분하면 좋습니다.

```text
유일성
→ 같은 Primary Key 값의 중복 방지

개체 무결성
→ Primary Key의 NULL 방지
```

둘 모두 Row 식별을 위한 규칙이지만 초점이 다릅니다.


## 복합 Primary Key와 개체 무결성

실습 DB의 ORDER_ITEM은 복합 Primary Key를 사용합니다.

```sql
PRIMARY KEY(ORDER_ID, PRODUCT_ID)
```

두 Attribute를 함께 사용해 하나의 Row를 식별합니다.

```text
ORDER_ID + PRODUCT_ID
```

따라서 Primary Key를 구성하는 값이 모두 식별에 필요합니다.

예를 들어 다음은 문제가 됩니다.

```text
NULL + P002
```

또는

```text
O0001 + NULL
```

Primary Key의 일부가 NULL이기 때문입니다.

<mark>복합 Primary Key에서도 구성 Attribute는 NULL이 될 수 없습니다.</mark>

## 개체 무결성과 참조 무결성

두 개념은 시험에서 자주 비교됩니다.

| 구분 | 개체 무결성 | 참조 무결성 |
| --- | --- | --- |
| 중심 Key | Primary Key | Foreign Key |
| 핵심 규칙 | Primary Key는 NULL 불가 | Foreign Key는 참조 가능한 값이어야 함 |
| 목적 | Row 식별 보장 | Table 관계 보장 |
| 예시 | EMP_ID는 NULL 불가 | DEPT_ID는 존재하는 부서를 참조 |

간단하게 외우면 다음과 같습니다.

```text
개체 무결성
→ Primary Key

참조 무결성
→ Foreign Key
```

## 개체 무결성과 도메인 무결성

도메인 무결성은 Column에 들어갈 수 있는 값의 범위를 지키는 규칙입니다.

예를 들어 급여는 숫자만 허용한다고 해봅시다.

```text
SALARY
→ INTEGER
```

이런 값의 형식과 범위를 관리하는 것이 도메인 무결성과 연결됩니다.

반면 개체 무결성은 Primary Key의 식별 가능성에 집중합니다.

```text
개체 무결성
→ Row 식별

도메인 무결성
→ Column 값의 범위
```

## SQL에서 확인하기

다음처럼 Primary Key를 정의합니다.

```sql
CREATE TABLE TEST(
    ID INTEGER PRIMARY KEY,
    NAME TEXT
);
```

이후 다음 INSERT는 정상입니다.

```sql
INSERT INTO TEST
VALUES (1, 'A');
```

반면 Primary Key에 NULL을 넣는 것은 개체 무결성 원칙에 맞지 않습니다.

```sql
INSERT INTO TEST
VALUES (NULL, 'B');
```

DBMS별 자동 생성 동작 등 세부 구현 차이는 있을 수 있으므로 실제 동작은 사용하는 DBMS의 규칙도 확인해야 합니다.

## 잘 놓치는 핵심

### 1. 개체 무결성의 중심은 Primary Key다

```text
Entity Integrity
→ Primary Key
```

### 2. 핵심 규칙은 NULL 금지다

```text
Primary Key
→ NULL X
```

### 3. 복합 Primary Key도 동일하다

Primary Key를 구성하는 Attribute가 NULL이면 안 됩니다.

### 4. NOT NULL과 완전히 같은 개념은 아니다

`NOT NULL`은 일반 Column에도 설정할 수 있습니다.

개체 무결성은 Primary Key를 통한 Row 식별이라는 관계형 모델의 규칙입니다.

### 5. 참조 무결성과 구분한다

```text
개체 무결성
→ Primary Key

참조 무결성
→ Foreign Key
```

## 시험·면접

### 핵심 암기

```text
개체 무결성
= Primary Key는 NULL이 될 수 없다.
```

### 함께 기억할 것

Primary Key는 실제로 다음 성질을 가집니다.

```text
중복 X
NULL X
```

### 시험 함정

다음 문장은 틀렸습니다.

```text
개체 무결성은 Foreign Key가 NULL이 될 수 없다는 규칙이다.
```

개체 무결성의 중심은 Primary Key입니다.

### 자주 나오는 비교

```text
개체 무결성
→ Primary Key

참조 무결성
→ Foreign Key

도메인 무결성
→ Column 값의 범위
```

### 면접에서 짧게 답한다면

개체 무결성은 관계형 데이터베이스에서 모든 Row가 식별 가능하도록 Primary Key가 NULL 값을 가지지 못하게 하는 규칙입니다.

복합 Primary Key인 경우에도 Key를 구성하는 Attribute는 NULL이 될 수 없습니다.

## 예시로 한 바퀴

EMPLOYEE의 Primary Key는 `EMP_ID`입니다.

```text
1001 | 직원1
1002 | 직원2
```

각 Row를 식별할 수 있습니다.

하지만 다음 Row는 문제가 됩니다.

```text
NULL | 직원3
```

Primary Key가 없기 때문입니다.

따라서

```text
EMP_ID = NULL
→ 개체 무결성 위반
```

입니다.

ORDER_ITEM처럼 복합 Primary Key라면

```text
ORDER_ID + PRODUCT_ID
```

둘 다 Row 식별에 필요한 값이어야 합니다.

## 객관식 문제

### 1. 개체 무결성의 핵심 규칙은?

① Foreign Key는 반드시 중복되어야 한다.  
② Primary Key는 NULL이 될 수 없다.  
③ 모든 Column은 문자열이어야 한다.  
④ Table에는 Primary Key가 없어야 한다.

<details>
<summary>정답</summary>

②

</details>

### 2. 개체 무결성과 가장 직접적으로 관련된 Key는?

① Foreign Key  
② Primary Key  
③ Alternate Key만  
④ Index

<details>
<summary>정답</summary>

②

</details>

### 3. 다음 중 개체 무결성 위반에 해당하는 것은?

① SALARY = 3000  
② DEPT_ID = 10  
③ Primary Key = NULL  
④ NAME = 'Kim'

<details>
<summary>정답</summary>

③

</details>

### 4. 복합 Primary Key에 대한 설명으로 옳은 것은?

① 구성 Attribute 중 하나는 반드시 NULL이어야 한다.  
② 구성 Attribute가 Row 식별에 필요하다면 NULL이 될 수 없다.  
③ 복합 Key에는 개체 무결성이 적용되지 않는다.  
④ Foreign Key에서만 사용한다.

<details>
<summary>정답</summary>

②

</details>

### 5. 개체 무결성과 참조 무결성의 연결로 옳은 것은?

① 개체 무결성 - Foreign Key  
② 참조 무결성 - Primary Key만  
③ 개체 무결성 - Primary Key, 참조 무결성 - Foreign Key  
④ 둘 다 Index만 관련

<details>
<summary>정답</summary>

③

</details>

### 6. `NOT NULL`과 개체 무결성에 대한 설명으로 옳은 것은?

① 둘은 항상 완전히 같은 개념이다.  
② NOT NULL은 일반 Column에도 적용할 수 있다.  
③ 개체 무결성은 모든 일반 Column의 NULL을 금지한다.  
④ Primary Key는 NULL을 허용해야 한다.

<details>
<summary>정답</summary>

②

</details>

## 다음에 이을 글

**Referential Integrity · 참조 무결성**입니다.  
Foreign Key가 존재하지 않는 Row를 잘못 참조하지 못하도록 하는 규칙을 알아봅니다.
