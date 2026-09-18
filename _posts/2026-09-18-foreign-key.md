---
title: Foreign Key · 외래키
date: 2026-09-18 20:55:00 +0900
slug: foreign-key
permalink: /posts/foreign-key/
categories: [CS, 데이터베이스]
tags: [ForeignKey, 외래키, PrimaryKey, 참조무결성, Key, RDB, JOIN, 정보처리기사, NCS]
math: true
---

Foreign Key(외래키)는 **다른 Table의 Key를 참조하여 Table 사이의 관계를 만드는 Attribute 또는 Attribute의 집합**입니다.

쉽게 말하면 다른 Table의 Row를 가리키는 연결 값입니다.

<blockquote class="prompt-info">
<p>한 줄: Foreign Key는 다른 Table의 Key를 참조하여 Table 사이의 관계를 만드는 Key입니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

Foreign Key = 다른 Table의 Key를 참조하는 연결 Key입니다.

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

이 글에서는 `EMPLOYEE`, `DEPARTMENT`, `ORDERS`, `CUSTOMER`를 중심으로 봅니다.

## 핵심 예시

DEPARTMENT 일부입니다.

| DEPT_ID | DEPT_NAME | REGION |
| ---: | --- | --- |
| 10 | 개발 | 서울 |
| 20 | 인사 | 부산 |
| 30 | 영업 | 대전 |

EMPLOYEE 일부입니다.

| EMP_ID | EMP_NAME | DEPT_ID | SALARY |
| ---: | --- | ---: | ---: |
| 1001 | 직원1 | 10 | 2890 |
| 1002 | 직원2 | 20 | 2980 |
| 1003 | 직원3 | 30 | 3070 |

EMPLOYEE의 `DEPT_ID`는 DEPARTMENT의 `DEPT_ID`를 참조합니다.

```text
EMPLOYEE.DEPT_ID
↓
DEPARTMENT.DEPT_ID
```

예를 들어 직원1의 `DEPT_ID`가 10이면

```text
EMPLOYEE.DEPT_ID = 10
```

DEPARTMENT에서 10을 찾아

```text
10 → 개발
```

이라는 관계를 알 수 있습니다.

<mark>Foreign Key는 다른 Table의 Row를 연결하기 위한 참조 값입니다.</mark>


## Foreign Key의 기본 구조

관계를 단순하게 보면 다음과 같습니다.

```text
참조하는 Table
EMPLOYEE

Foreign Key
DEPT_ID
↓
참조되는 Table
DEPARTMENT

Key
DEPT_ID
```

EMPLOYEE의 `DEPT_ID`가 DEPARTMENT의 `DEPT_ID`를 참조합니다.

SQL에서는 다음처럼 정의합니다.

```sql
FOREIGN KEY(DEPT_ID)
REFERENCES DEPARTMENT(DEPT_ID)
```

## 실제 EMPLOYEE Schema

실습 DB에서는 다음처럼 정의되어 있습니다.

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

DEPT_ID
→ Foreign Key
```

입니다.

## Foreign Key는 중복될 수 있다

여러 직원이 같은 부서에 속할 수 있습니다.

```text
EMP_ID | DEPT_ID

1001   | 10
1006   | 10
1011   | 10
```

`DEPT_ID = 10`이 여러 번 나타날 수 있습니다.

Foreign Key는 다른 Table을 참조하는 역할이므로 중복될 수 있습니다.

```text
Foreign Key
→ 중복 가능
```

Primary Key와 가장 큰 차이 중 하나입니다.

## Foreign Key는 NULL일 수도 있다

설계에 따라 Foreign Key는 NULL을 허용할 수 있습니다.

예를 들어 아직 부서가 배정되지 않은 직원이라면

```text
DEPT_ID = NULL
```

로 둘 수도 있습니다.

즉 일반적으로

```text
Foreign Key
→ NULL 가능
```

입니다.

단, Column에 `NOT NULL` 제약을 함께 설정하면 NULL을 허용하지 않을 수 있습니다.

<blockquote class="prompt-warning">
<p>Foreign Key는 중복과 NULL이 가능할 수 있지만, 실제 허용 여부는 Schema의 제약조건에 따라 달라집니다.</p>
</blockquote>

## Primary Key와 Foreign Key

둘의 역할은 명확히 다릅니다.

| 구분 | Primary Key | Foreign Key |
| --- | --- | --- |
| 목적 | 자신의 Row 식별 | 다른 Table 참조 |
| 중복 | 불가 | 가능 |
| NULL | 불가 | 가능할 수 있음 |
| 관계 | 참조 기준 | 기준을 참조 |
| 대표 예 | DEPARTMENT.DEPT_ID | EMPLOYEE.DEPT_ID |

관계를 보면 더 쉽습니다.

```text
EMPLOYEE.DEPT_ID
→ Foreign Key
↓ 참조
DEPARTMENT.DEPT_ID
→ Primary Key
```


## 참조 무결성

Foreign Key에서 가장 중요한 개념 중 하나가 **참조 무결성**입니다.

참조 무결성은 Foreign Key 값이 존재한다면 참조 대상 Table에도 대응하는 값이 있어야 한다는 원칙입니다.

예를 들어 DEPARTMENT에 다음 값만 있다고 해봅시다.

```text
10
20
30
```

그런데 EMPLOYEE에

```text
DEPT_ID = 99
```

를 넣으려고 하면 문제가 됩니다.

DEPARTMENT에 99가 없기 때문입니다.

```text
EMPLOYEE.DEPT_ID = 99
↓
DEPARTMENT.DEPT_ID = 99
없음
```

이런 잘못된 참조를 막는 것이 참조 무결성입니다.

<mark>Foreign Key는 존재하지 않는 부모 Row를 함부로 참조하지 못하게 합니다.</mark>


## 부모 Row 삭제 문제

자식 Row가 참조 중인 부모 Row를 삭제하면 참조 무결성이 깨질 수 있습니다.

대표 처리 방식은 다음과 같습니다.

- 삭제 제한
- 함께 삭제
- Foreign Key를 NULL로 변경

세부 옵션은 `ON DELETE`에서 다룹니다.

## ORDERS와 CUSTOMER 예시

실습 DB에서는 ORDERS도 Foreign Key를 사용합니다.

```text
ORDERS.CUSTOMER_ID
↓
CUSTOMER.CUSTOMER_ID
```

Schema는 다음과 같은 형태입니다.

```sql
CREATE TABLE ORDERS(
    ORDER_ID TEXT PRIMARY KEY,
    CUSTOMER_ID TEXT,
    ORDER_DATE TEXT,
    STATUS TEXT,
    FOREIGN KEY(CUSTOMER_ID)
        REFERENCES CUSTOMER(CUSTOMER_ID)
);
```

여기서

```text
ORDER_ID
→ Primary Key

CUSTOMER_ID
→ Foreign Key
```

입니다.

하나의 고객이 여러 주문을 할 수 있으므로 `CUSTOMER_ID`는 ORDERS에서 반복될 수 있습니다.


## JOIN과 Foreign Key

Foreign Key 관계는 JOIN 기준으로 자주 사용됩니다.

```sql
SELECT E.EMP_NAME, D.DEPT_NAME
FROM EMPLOYEE E
JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

연결 기준은 `EMPLOYEE.DEPT_ID = DEPARTMENT.DEPT_ID`입니다.


## 잘 놓치는 핵심

### 1. Foreign Key는 다른 Table을 참조한다

```text
EMPLOYEE.DEPT_ID
↓
DEPARTMENT.DEPT_ID
```

Table 사이의 관계를 만드는 역할입니다.

### 2. Foreign Key는 중복될 수 있다

여러 직원이 같은 부서를 참조할 수 있습니다.

### 3. Foreign Key는 NULL이 가능할 수 있다

단, `NOT NULL` 제약이 있으면 허용되지 않습니다.

### 4. Primary Key와 역할이 다르다

```text
Primary Key
→ 자신의 Row 식별

Foreign Key
→ 다른 Table 참조
```

### 5. 참조 무결성을 기억한다

Foreign Key 값이 존재한다면 참조 대상에도 대응하는 값이 있어야 합니다.

## 시험·면접

### 핵심 암기

```text
Foreign Key
= 다른 Table의 Key를 참조하는 Key
```

### 대표 구조

```text
자식 Table.Foreign Key
↓
부모 Table.Key
```

### Primary Key와 비교

```text
Primary Key
→ 중복 X
→ NULL X

Foreign Key
→ 중복 가능
→ NULL 가능할 수 있음
```

### 참조 무결성

```text
Foreign Key 값
→ 참조 대상 Table에 존재해야 함
```

### 시험 함정

다음 문장은 틀렸습니다.

```text
Foreign Key는 항상 중복될 수 없다.
```

여러 Row가 같은 부모 Row를 참조할 수 있으므로 중복될 수 있습니다.

### 면접에서 짧게 답한다면

Foreign Key는 다른 Table의 Key를 참조하여 Table 사이의 관계를 만드는 Attribute 또는 Attribute의 집합입니다.

중복이나 NULL이 가능할 수 있으며, 참조 무결성을 통해 존재하지 않는 Row를 잘못 참조하는 것을 방지합니다.


## 객관식 문제

### 1. Foreign Key의 가장 중요한 역할은?

① 자신의 Row를 대표로 식별  
② 다른 Table을 참조하여 관계 형성  
③ 데이터를 정렬  
④ Index 삭제

<details>
<summary>정답</summary>

②

</details>

### 2. Foreign Key에 대한 설명으로 옳은 것은?

① 항상 중복 불가  
② 항상 NULL 불가  
③ 여러 Row에서 같은 값을 가질 수 있다.  
④ 반드시 Primary Key와 같은 Table에 있어야 한다.

<details>
<summary>정답</summary>

③

</details>

### 3. EMPLOYEE.DEPT_ID가 DEPARTMENT.DEPT_ID를 참조한다면 EMPLOYEE.DEPT_ID는?

① Primary Key  
② Foreign Key  
③ Alternate Key  
④ Super Key만 가능

<details>
<summary>정답</summary>

②

</details>

### 4. 참조 무결성에 대한 설명으로 옳은 것은?

① Foreign Key 값은 아무 값이나 가능하다.  
② Foreign Key가 참조하는 값은 참조 대상에 존재해야 한다.  
③ Primary Key는 중복되어야 한다.  
④ NULL만 참조할 수 있다.

<details>
<summary>정답</summary>

②

</details>

### 5. Primary Key와 Foreign Key의 차이로 옳은 것은?

① 둘 다 항상 중복 가능  
② Primary Key는 자신의 Row를 식별하고 Foreign Key는 다른 Table을 참조한다.  
③ Foreign Key만 NULL을 절대 허용하지 않는다.  
④ 두 개념은 같다.

<details>
<summary>정답</summary>

②

</details>

### 6. 1:N 관계에서 Foreign Key는 일반적으로 어느 쪽에 위치하는가?

① 1 쪽  
② N 쪽  
③ 양쪽 모두 반드시  
④ 어느 쪽에도 둘 수 없다.

<details>
<summary>정답</summary>

②

</details>

## 다음에 이을 글

**개체 무결성 · Entity Integrity**입니다.  
Primary Key가 NULL을 가질 수 없는 이유와 Row 식별 규칙을 알아봅니다.
