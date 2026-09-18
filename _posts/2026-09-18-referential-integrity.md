---
title: Referential Integrity · 참조 무결성
date: 2026-09-18 21:05:00 +0900
slug: referential-integrity
permalink: /posts/referential-integrity/
categories: [CS, 데이터베이스]
tags: [ReferentialIntegrity, 참조무결성, ForeignKey, PrimaryKey, 무결성, RDB, 정보처리기사, NCS]
math: true
---

참조 무결성(Referential Integrity)은 **Foreign Key가 참조하는 값이 부모 Table에 실제로 존재하도록 보장하는 규칙**입니다.

즉 존재하지 않는 Row를 잘못 참조하지 못하게 합니다.

<blockquote class="prompt-info">
<p>한 줄: 참조 무결성은 Foreign Key가 존재하는 부모 Row만 참조하도록 보장하는 규칙입니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

Referential Integrity = Foreign Key의 참조 대상이 실제로 존재하도록 유지하는 규칙입니다.

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

| DEPT_ID | DEPT_NAME |
| ---: | --- |
| 10 | 개발 |
| 20 | 인사 |
| 30 | 영업 |

EMPLOYEE 일부입니다.

| EMP_ID | EMP_NAME | DEPT_ID |
| ---: | --- | ---: |
| 1001 | 직원1 | 10 |
| 1002 | 직원2 | 20 |
| 1003 | 직원3 | 30 |

EMPLOYEE의 `DEPT_ID`는 DEPARTMENT의 `DEPT_ID`를 참조합니다.

```text
EMPLOYEE.DEPT_ID
↓
DEPARTMENT.DEPT_ID
```

직원1의 `DEPT_ID = 10`은 DEPARTMENT에 실제로 존재합니다.

```text
10 → 개발
```

따라서 올바른 참조입니다.

<mark>참조 무결성은 Foreign Key 값이 부모 Table의 실제 Key와 연결되도록 유지합니다.</mark>

## 잘못된 참조

DEPARTMENT에 다음 값만 있다고 해봅시다.

```text
10
20
30
```

그런데 EMPLOYEE에 다음 값을 넣으려고 합니다.

```text
EMP_ID = 1004
DEPT_ID = 99
```

문제는 DEPARTMENT에 99가 없다는 점입니다.

```text
EMPLOYEE.DEPT_ID = 99
↓
DEPARTMENT.DEPT_ID = 99
없음
```

이 상태를 허용하면 존재하지 않는 부서를 참조하게 됩니다.

따라서 참조 무결성에 위배됩니다.

## Foreign Key와 참조 무결성

참조 무결성의 중심은 Foreign Key입니다.

```text
자식 Table.Foreign Key
↓
부모 Table.Key
```

실습 DB에서는 다음과 같습니다.

```text
EMPLOYEE.DEPT_ID
↓
DEPARTMENT.DEPT_ID
```

Foreign Key 값이 존재한다면 부모 Table에도 대응하는 값이 있어야 합니다.

## 실제 SQL 구조

EMPLOYEE Schema 일부입니다.

```sql
CREATE TABLE EMPLOYEE(
    EMP_ID INTEGER PRIMARY KEY,
    EMP_NAME TEXT NOT NULL,
    DEPT_ID INTEGER,
    FOREIGN KEY(DEPT_ID)
        REFERENCES DEPARTMENT(DEPT_ID)
);
```

여기서

```text
EMPLOYEE.DEPT_ID
→ Foreign Key

DEPARTMENT.DEPT_ID
→ 참조 대상
```

입니다.

## NULL은 어떻게 되는가

Foreign Key는 설계에 따라 NULL을 가질 수 있습니다.

예를 들어 아직 부서가 정해지지 않은 직원이라면

```text
DEPT_ID = NULL
```

일 수 있습니다.

NULL은 특정 부모 Row를 참조하는 값이 아닙니다.

따라서 Foreign Key Column이 NULL을 허용하도록 설계되어 있다면 참조 무결성을 위반하지 않을 수 있습니다.

<blockquote class="prompt-warning">
<p>Foreign Key의 NULL 허용 여부는 Column의 NOT NULL 제약조건 등 Schema 설정에 따라 달라집니다.</p>
</blockquote>

## 중복 Foreign Key도 가능하다

여러 직원이 같은 부서에 속할 수 있습니다.

```text
EMP_ID | DEPT_ID

1001   | 10
1006   | 10
1011   | 10
```

`DEPT_ID = 10`이 반복되어도 문제없습니다.

모두 실제로 존재하는 DEPARTMENT 10번 Row를 참조하기 때문입니다.

따라서 참조 무결성은 Foreign Key의 중복을 금지하는 규칙이 아닙니다.

## 부모 Table과 자식 Table

Foreign Key 관계에서는 다음 표현을 자주 사용합니다.

```text
부모 Table
→ 참조되는 Table

자식 Table
→ Foreign Key를 가진 Table
```

현재 예에서는

```text
DEPARTMENT
→ 부모 Table

EMPLOYEE
→ 자식 Table
```

입니다.

## 부모 Row 삭제 문제

다음 관계를 생각해봅시다.

```text
DEPARTMENT.DEPT_ID = 10
↑
EMPLOYEE.DEPT_ID = 10
```

EMPLOYEE가 10번 부서를 참조하고 있습니다.

이때 DEPARTMENT의 10번 Row를 그냥 삭제하면 자식 Row가 존재하지 않는 값을 참조하게 됩니다.

따라서 DBMS는 이런 삭제를 제한하거나 별도 동작을 정의할 수 있습니다.

대표적으로 다음 방식이 있습니다.

- 삭제 제한
- 자식 Row도 함께 삭제
- Foreign Key를 NULL로 변경

세부 옵션은 `ON DELETE`에서 다룹니다.


## ORDERS와 CUSTOMER 예시

실습 DB에는 다음 관계도 있습니다.

```text
ORDERS.CUSTOMER_ID
↓
CUSTOMER.CUSTOMER_ID
```

Schema는 다음과 같습니다.

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

`ORDERS.CUSTOMER_ID` 값이 존재한다면 참조하는 CUSTOMER Row가 실제로 있어야 합니다.

## 참조 무결성과 JOIN

Foreign Key 관계는 JOIN 기준으로 자주 사용됩니다.

```sql
SELECT
    E.EMP_NAME,
    D.DEPT_NAME
FROM EMPLOYEE E
JOIN DEPARTMENT D
    ON E.DEPT_ID = D.DEPT_ID;
```

연결 기준은 다음입니다.

```text
EMPLOYEE.DEPT_ID
=
DEPARTMENT.DEPT_ID
```

참조 무결성이 유지되면 이런 관계를 신뢰하고 사용할 수 있습니다.

## 개체 무결성과 참조 무결성

두 개념은 시험에서 매우 자주 비교됩니다.

| 구분 | 개체 무결성 | 참조 무결성 |
| --- | --- | --- |
| 중심 Key | Primary Key | Foreign Key |
| 핵심 규칙 | Primary Key는 NULL 불가 | Foreign Key는 존재하는 값을 참조 |
| 목적 | Row 식별 보장 | Table 관계 보장 |
| 예시 | EMP_ID는 NULL 불가 | DEPT_ID는 존재하는 부서를 참조 |

간단하게 외우면 다음과 같습니다.

```text
개체 무결성
→ Primary Key

참조 무결성
→ Foreign Key
```


## 잘 놓치는 핵심

### 1. 참조 무결성의 중심은 Foreign Key다

```text
Referential Integrity
→ Foreign Key
```

### 2. Foreign Key 값은 부모 Table에 존재해야 한다

```text
자식 Foreign Key
↓
부모 Key
```

존재하지 않는 값을 참조하면 안 됩니다.

### 3. 중복은 가능하다

여러 자식 Row가 같은 부모 Row를 참조할 수 있습니다.

### 4. NULL은 설계에 따라 가능하다

Foreign Key Column이 NULL을 허용한다면 NULL일 수 있습니다.

### 5. 부모 Row 삭제·수정도 주의해야 한다

자식 Row가 참조 중인 값을 함부로 삭제하거나 바꾸면 관계가 깨질 수 있습니다.

## 시험·면접

### 핵심 암기

```text
참조 무결성
= Foreign Key는 존재하는 부모 Key를 참조해야 한다.
```

### 대표 구조

```text
자식 Table.Foreign Key
↓
부모 Table.Key
```

### 개체 무결성과 비교

```text
개체 무결성
→ Primary Key
→ NULL 불가

참조 무결성
→ Foreign Key
→ 존재하는 부모 값 참조
```

### 시험 함정

다음 문장은 틀렸습니다.

```text
참조 무결성은 Foreign Key의 중복을 금지한다.
```

여러 Row가 같은 부모 Row를 참조할 수 있으므로 Foreign Key는 중복될 수 있습니다.

### 자주 나오는 문장

```text
Foreign Key 값은 참조 대상 Table의 Key 값과 일치하거나 NULL이어야 한다.
```

단, NULL 허용 여부는 Schema에 따라 달라질 수 있습니다.

### 면접에서 짧게 답한다면

참조 무결성은 Foreign Key가 존재하는 부모 Table의 Key만 참조하도록 보장하는 규칙입니다.

이를 통해 존재하지 않는 Row를 잘못 참조하는 것을 방지하며, 부모 Row의 삭제나 수정 시에도 관계가 깨지지 않도록 관리합니다.


## 객관식 문제

### 1. 참조 무결성의 중심이 되는 Key는?

① Primary Key만  
② Foreign Key  
③ Alternate Key만  
④ Index

<details>
<summary>정답</summary>

②

</details>

### 2. Foreign Key 값에 대한 설명으로 가장 적절한 것은?

① 항상 아무 값이나 가능하다.  
② 참조 대상에 존재하는 값을 사용해야 한다.  
③ 반드시 중복되어야 한다.  
④ 항상 문자열이어야 한다.

<details>
<summary>정답</summary>

②

</details>

### 3. DEPARTMENT에 DEPT_ID 99가 없는데 EMPLOYEE.DEPT_ID에 99를 저장하면?

① 개체 무결성만 강화된다.  
② 참조 무결성 위반이 될 수 있다.  
③ 반드시 정상이다.  
④ Primary Key가 자동 생성된다.

<details>
<summary>정답</summary>

②

</details>

### 4. Foreign Key의 중복에 대한 설명으로 옳은 것은?

① 절대 중복될 수 없다.  
② 여러 Row가 같은 부모 Row를 참조할 수 있어 중복 가능하다.  
③ Primary Key보다 항상 유일하다.  
④ 중복되면 Candidate Key가 된다.

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

### 6. 부모 Row를 삭제할 때 참조 무결성과 관련해 고려할 사항은?

① 자식 Row가 해당 값을 참조하는지 확인한다.  
② 모든 Foreign Key를 Primary Key로 바꾼다.  
③ Column 이름을 삭제한다.  
④ Index를 반드시 제거한다.

<details>
<summary>정답</summary>

①

</details>

## 다음에 이을 글

**Domain Integrity · 도메인 무결성**입니다.  
각 Column에 허용되는 값의 형식과 범위를 지키는 규칙을 알아봅니다.
