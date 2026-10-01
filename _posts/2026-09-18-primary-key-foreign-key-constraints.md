---
title: PRIMARY KEY · FOREIGN KEY
date: 2026-09-18 23:05:00 +0900
slug: primary-key-foreign-key-constraints
permalink: /posts/primary-key-foreign-key-constraints/
categories: [CS, 데이터베이스]
tags: [PRIMARYKEY, FOREIGNKEY, Constraint, SQL, EntityIntegrity, ReferentialIntegrity, SQLite, 정보처리기사, NCS]
math: true
---

PRIMARY KEY는 각 Row를 유일하게 식별하고, FOREIGN KEY는 다른 Table의 Key를 참조하여 관계를 정의하는 제약조건입니다.

SQL 명령은 비슷해 보여도 **구조를 바꾸는지, 데이터를 바꾸는지, 권한을 바꾸는지**를 구분하면 이해하기 쉽습니다.

<blockquote class="prompt-info">
<p>한 줄: PRIMARY KEY는 자신의 Row를 식별하고 FOREIGN KEY는 다른 Table과의 관계를 연결합니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

PRIMARY KEY = Row 식별 / FOREIGN KEY = Table 관계

</details>

## 실습 데이터 전체 보기

아래 실습 데이터베이스를 기준으로 예시를 설명합니다.

<div style="width:100%; overflow:hidden; border:1px solid var(--main-border-color,#ddd); border-radius:12px; margin:1rem 0;">
<iframe
  src="https://docs.google.com/spreadsheets/d/1mtu6pFcGyOfwpFizaJskfFD87GxyjAmB/preview"
  width="100%"
  height="500"
  style="border:0;"
  loading="lazy">
</iframe>
</div>

주요 Table은 다음과 같습니다.

| Table | 핵심 Column | 역할 |
| --- | --- | --- |
| DEPARTMENT | DEPT_ID, DEPT_NAME, REGION | 부서 |
| EMPLOYEE | EMP_ID, EMP_NAME, DEPT_ID, SALARY | 직원 |
| CUSTOMER | CUSTOMER_ID, NAME, GENDER, REGION, GRADE | 고객 |
| PRODUCT | PRODUCT_ID, PRODUCT_NAME, CATEGORY, PRICE, STOCK | 상품 |
| ORDERS | ORDER_ID, CUSTOMER_ID, ORDER_DATE, STATUS | 주문 |
| ORDER_ITEM | ORDER_ID, PRODUCT_ID, QTY | 주문 상세 |


## 핵심 예시

대표 문법은 다음과 같습니다.

```sql
CREATE TABLE EMPLOYEE(
    EMP_ID INTEGER PRIMARY KEY,
    EMP_NAME TEXT NOT NULL,
    DEPT_ID INTEGER,
    FOREIGN KEY(DEPT_ID)
        REFERENCES DEPARTMENT(DEPT_ID)
);
```

<mark>PRIMARY KEY는 자신의 Row를 식별하고 FOREIGN KEY는 다른 Table과의 관계를 연결합니다.</mark>

## PRIMARY KEY 기본

Primary Key는 각 Row를 유일하게 식별합니다.

```sql
EMP_ID INTEGER PRIMARY KEY
```

중복될 수 없고 NULL을 허용하지 않는 식별 기준입니다.

## 복합 PRIMARY KEY

두 개 이상의 Column을 함께 Primary Key로 사용할 수 있습니다.

```sql
PRIMARY KEY(ORDER_ID, PRODUCT_ID)
```

ORDER_ITEM처럼 한 Column만으로 Row를 식별하기 어려운 경우 사용합니다.

## FOREIGN KEY 기본

다른 Table을 참조합니다.

```sql
FOREIGN KEY(DEPT_ID)
REFERENCES DEPARTMENT(DEPT_ID)
```

EMPLOYEE와 DEPARTMENT 사이 관계를 Schema에 명시합니다.

## 참조 무결성

Foreign Key 값이 존재한다면 참조 대상에도 대응하는 Key가 있어야 합니다.

```text
EMPLOYEE.DEPT_ID = 10
→ DEPARTMENT.DEPT_ID = 10 존재
```

존재하지 않는 부모 Row를 참조하면 참조 무결성 문제가 발생합니다.

## PRIMARY KEY와 개체 무결성

개체 무결성은 Primary Key가 NULL이 될 수 없도록 하여 모든 Row를 식별 가능하게 유지하는 원칙입니다.

```text
Primary Key
→ NULL 불가
```

## FOREIGN KEY의 중복

Foreign Key는 중복될 수 있습니다.

여러 직원이 같은 부서에 속할 수 있기 때문입니다.

```text
1001 | DEPT_ID 10
1006 | DEPT_ID 10
1011 | DEPT_ID 10
```

## FOREIGN KEY의 NULL

Schema가 허용한다면 Foreign Key는 NULL일 수 있습니다.

```text
DEPT_ID = NULL
```

아직 부서가 정해지지 않은 직원 같은 상황을 표현할 수 있습니다.

## ON DELETE

부모 Row 삭제 시 동작을 정할 수 있습니다.

대표적인 방식은 다음과 같습니다.

- RESTRICT 또는 NO ACTION
- CASCADE
- SET NULL

지원 세부는 DBMS에 따라 확인합니다.

## ON UPDATE

부모 Key 수정 시 자식 Foreign Key 처리도 정의할 수 있습니다.

```sql
ON UPDATE CASCADE
```

Key 값을 자주 변경하는 설계 자체가 적절한지도 함께 판단해야 합니다.

## SQLite Foreign Key

SQLite에서는 Foreign Key 검사를 사용하려면 연결마다 다음 설정이 중요합니다.

```sql
PRAGMA foreign_keys = ON;
```

실습 DB에서도 이 설정을 사용합니다.

Foreign Key 제약을 정의해도 설정이 꺼져 있으면 기대한 검사가 이루어지지 않을 수 있습니다.

## PRIMARY KEY와 UNIQUE

둘 다 유일성을 보장할 수 있지만 역할은 다릅니다.

```text
PRIMARY KEY
→ 대표 식별자
→ Table당 하나의 Primary Key 제약

UNIQUE
→ 추가적인 유일성 보장
→ 여러 개 가능
```

복합 Primary Key는 여러 Column으로 구성될 수 있습니다.

## 시험 비교

| 구분 | PRIMARY KEY | FOREIGN KEY |
| --- | --- | --- |
| 목적 | 자신의 Row 식별 | 다른 Table 참조 |
| 중복 | 불가 | 가능 |
| NULL | 불가 | 가능할 수 있음 |
| 무결성 | 개체 무결성 | 참조 무결성 |

이 표는 시험에서 바로 기억하기 좋습니다.

## 다른 개념과 비교

### 비교 1. PRIMARY KEY

```text
PRIMARY KEY
→ 자기 Row 식별
```

`PRIMARY KEY · FOREIGN KEY`과 비교할 때는 **Schema를 바꾸는지**, **Row를 바꾸는지**, **권한을 바꾸는지**를 먼저 확인합니다.

### 비교 2. FOREIGN KEY

```text
FOREIGN KEY
→ 다른 Table 참조
```

`PRIMARY KEY · FOREIGN KEY`과 비교할 때는 **Schema를 바꾸는지**, **Row를 바꾸는지**, **권한을 바꾸는지**를 먼저 확인합니다.

### 비교 3. UNIQUE

```text
UNIQUE
→ 추가 유일성
```

`PRIMARY KEY · FOREIGN KEY`과 비교할 때는 **Schema를 바꾸는지**, **Row를 바꾸는지**, **권한을 바꾸는지**를 먼저 확인합니다.

### 비교 4. NOT NULL

```text
NOT NULL
→ NULL 금지
```

`PRIMARY KEY · FOREIGN KEY`과 비교할 때는 **Schema를 바꾸는지**, **Row를 바꾸는지**, **권한을 바꾸는지**를 먼저 확인합니다.

## 실전 SQL 패턴

### 실전 패턴 1. 단일 PK

```sql
CREATE TABLE T1(ID INTEGER PRIMARY KEY, NAME TEXT);
```

이 예시는 `PRIMARY KEY · FOREIGN KEY`에서 자주 보는 형태입니다.

문법을 외우기보다 **어떤 객체 또는 Row가 바뀌는지** 먼저 확인합니다.

```text
대상
→ 변경 내용
→ 제약조건 영향
→ 실행 후 결과
```

### 실전 패턴 2. 복합 PK

```sql
CREATE TABLE T2(A INTEGER, B INTEGER, PRIMARY KEY(A,B));
```

이 예시는 `PRIMARY KEY · FOREIGN KEY`에서 자주 보는 형태입니다.

문법을 외우기보다 **어떤 객체 또는 Row가 바뀌는지** 먼저 확인합니다.

```text
대상
→ 변경 내용
→ 제약조건 영향
→ 실행 후 결과
```

### 실전 패턴 3. FK

```sql
CREATE TABLE CHILD(ID INTEGER PRIMARY KEY, PARENT_ID INTEGER, FOREIGN KEY(PARENT_ID) REFERENCES PARENT(ID));
```

이 예시는 `PRIMARY KEY · FOREIGN KEY`에서 자주 보는 형태입니다.

문법을 외우기보다 **어떤 객체 또는 Row가 바뀌는지** 먼저 확인합니다.

```text
대상
→ 변경 내용
→ 제약조건 영향
→ 실행 후 결과
```

### 실전 패턴 4. CASCADE

```sql
FOREIGN KEY(PARENT_ID) REFERENCES PARENT(ID) ON DELETE CASCADE
```

이 예시는 `PRIMARY KEY · FOREIGN KEY`에서 자주 보는 형태입니다.

문법을 외우기보다 **어떤 객체 또는 Row가 바뀌는지** 먼저 확인합니다.

```text
대상
→ 변경 내용
→ 제약조건 영향
→ 실행 후 결과
```

### 실전 패턴 5. SET NULL

```sql
FOREIGN KEY(PARENT_ID) REFERENCES PARENT(ID) ON DELETE SET NULL
```

이 예시는 `PRIMARY KEY · FOREIGN KEY`에서 자주 보는 형태입니다.

문법을 외우기보다 **어떤 객체 또는 Row가 바뀌는지** 먼저 확인합니다.

```text
대상
→ 변경 내용
→ 제약조건 영향
→ 실행 후 결과
```

### 실전 패턴 6. SQLite FK 활성화

```sql
PRAGMA foreign_keys = ON;
```

이 예시는 `PRIMARY KEY · FOREIGN KEY`에서 자주 보는 형태입니다.

문법을 외우기보다 **어떤 객체 또는 Row가 바뀌는지** 먼저 확인합니다.

```text
대상
→ 변경 내용
→ 제약조건 영향
→ 실행 후 결과
```

## 자주 하는 실수

### 실수 1. 실행 대상 Table을 확인하지 않는다.

`PRIMARY KEY · FOREIGN KEY`를 실행하기 전에는 다음을 확인합니다.

```text
1. 대상 객체
2. 변경 범위
3. Constraint
4. 참조 관계
5. DBMS 지원 여부
```

운영 환경에서는 특히 데이터 손실 가능성이 있는 명령을 바로 실행하지 않는 습관이 중요합니다.

### 실수 2. WHERE가 필요한 명령에서 조건을 빠뜨린다.

`PRIMARY KEY · FOREIGN KEY`를 실행하기 전에는 다음을 확인합니다.

```text
1. 대상 객체
2. 변경 범위
3. Constraint
4. 참조 관계
5. DBMS 지원 여부
```

운영 환경에서는 특히 데이터 손실 가능성이 있는 명령을 바로 실행하지 않는 습관이 중요합니다.

### 실수 3. Constraint 영향을 확인하지 않는다.

`PRIMARY KEY · FOREIGN KEY`를 실행하기 전에는 다음을 확인합니다.

```text
1. 대상 객체
2. 변경 범위
3. Constraint
4. 참조 관계
5. DBMS 지원 여부
```

운영 환경에서는 특히 데이터 손실 가능성이 있는 명령을 바로 실행하지 않는 습관이 중요합니다.

### 실수 4. SQLite와 다른 DBMS의 문법 차이를 무시한다.

`PRIMARY KEY · FOREIGN KEY`를 실행하기 전에는 다음을 확인합니다.

```text
1. 대상 객체
2. 변경 범위
3. Constraint
4. 참조 관계
5. DBMS 지원 여부
```

운영 환경에서는 특히 데이터 손실 가능성이 있는 명령을 바로 실행하지 않는 습관이 중요합니다.

### 실수 5. 실행 전 SELECT나 Schema 확인을 하지 않는다.

`PRIMARY KEY · FOREIGN KEY`를 실행하기 전에는 다음을 확인합니다.

```text
1. 대상 객체
2. 변경 범위
3. Constraint
4. 참조 관계
5. DBMS 지원 여부
```

운영 환경에서는 특히 데이터 손실 가능성이 있는 명령을 바로 실행하지 않는 습관이 중요합니다.

### 실수 6. DDL과 DML을 같은 종류로 생각한다.

`PRIMARY KEY · FOREIGN KEY`를 실행하기 전에는 다음을 확인합니다.

```text
1. 대상 객체
2. 변경 범위
3. Constraint
4. 참조 관계
5. DBMS 지원 여부
```

운영 환경에서는 특히 데이터 손실 가능성이 있는 명령을 바로 실행하지 않는 습관이 중요합니다.

## 잘 놓치는 핵심

### 1. PRIMARY KEY 기본

Primary Key는 각 Row를 유일하게 식별합니다.

시험에서는 명령어 이름만 외우지 말고 **대상·범위·제약조건·DBMS 차이**를 함께 봅니다.

### 2. 복합 PRIMARY KEY

두 개 이상의 Column을 함께 Primary Key로 사용할 수 있습니다.

시험에서는 명령어 이름만 외우지 말고 **대상·범위·제약조건·DBMS 차이**를 함께 봅니다.

### 3. FOREIGN KEY 기본

다른 Table을 참조합니다.

시험에서는 명령어 이름만 외우지 말고 **대상·범위·제약조건·DBMS 차이**를 함께 봅니다.

### 4. 참조 무결성

Foreign Key 값이 존재한다면 참조 대상에도 대응하는 Key가 있어야 합니다.

시험에서는 명령어 이름만 외우지 말고 **대상·범위·제약조건·DBMS 차이**를 함께 봅니다.

### 5. PRIMARY KEY와 개체 무결성

개체 무결성은 Primary Key가 NULL이 될 수 없도록 하여 모든 Row를 식별 가능하게 유지하는 원칙입니다.

시험에서는 명령어 이름만 외우지 말고 **대상·범위·제약조건·DBMS 차이**를 함께 봅니다.

### 6. FOREIGN KEY의 중복

Foreign Key는 중복될 수 있습니다.

시험에서는 명령어 이름만 외우지 말고 **대상·범위·제약조건·DBMS 차이**를 함께 봅니다.

## 시험·면접

### 핵심 암기

```text
PRIMARY KEY = Row 식별 / FOREIGN KEY = Table 관계
```

### 시험 접근 순서

```text
1. 명령어 종류 확인
2. 대상 객체 또는 Row 확인
3. WHERE 또는 Column 목록 확인
4. Constraint 영향 확인
5. SQLite 지원 여부 확인
```

### 면접에서 짧게 답한다면

PRIMARY KEY는 각 Row를 유일하게 식별하고, FOREIGN KEY는 다른 Table의 Key를 참조하여 관계를 정의하는 제약조건입니다.

실무에서는 실행 전 영향 범위와 제약조건, Transaction 가능 여부를 함께 확인하는 것이 중요합니다.

## 예시로 한 바퀴

다음 대표 문법을 다시 봅니다.

```sql
CREATE TABLE EMPLOYEE(
    EMP_ID INTEGER PRIMARY KEY,
    EMP_NAME TEXT NOT NULL,
    DEPT_ID INTEGER,
    FOREIGN KEY(DEPT_ID)
        REFERENCES DEPARTMENT(DEPT_ID)
);
```

먼저 이 명령이 **Schema**, **Row**, **권한** 중 무엇을 바꾸는지 판단합니다.

그다음 변경 범위와 제약조건을 확인합니다.

마지막으로 현재 실습 환경인 SQLite에서 같은 문법을 그대로 사용할 수 있는지 확인합니다.

## 객관식 문제

### 1. PRIMARY KEY는?

① 자신의 Row 식별  
② 항상 Index 삭제  
③ 항상 모든 Row 유지  
④ 항상 Schema 제거

<details>
<summary>정답</summary>

①

</details>

해설: `자신의 Row 식별`가 핵심입니다.

### 2. FOREIGN KEY는?

① 다른 Table 참조  
② 항상 Index 삭제  
③ 항상 모든 Row 유지  
④ 항상 Schema 제거

<details>
<summary>정답</summary>

①

</details>

해설: `다른 Table 참조`가 핵심입니다.

### 3. SQLite Foreign Key 검사를 켜는 명령은?

① PRAGMA foreign_keys = ON  
② 항상 Index 삭제  
③ 항상 모든 Row 유지  
④ 항상 Schema 제거

<details>
<summary>정답</summary>

①

</details>

해설: `PRAGMA foreign_keys = ON`가 핵심입니다.

### 4. DDL의 대표 목적은?

① Schema 정의 및 변경  
② 항상 Index 삭제  
③ 항상 모든 Row 유지  
④ 항상 Schema 제거

<details>
<summary>정답</summary>

①

</details>

해설: `Schema 정의 및 변경`가 핵심입니다.

### 5. DML의 대표 목적은?

① 데이터 조회 및 변경  
② 항상 Index 삭제  
③ 항상 모든 Row 유지  
④ 항상 Schema 제거

<details>
<summary>정답</summary>

①

</details>

해설: `데이터 조회 및 변경`가 핵심입니다.

### 6. 실행 전 가장 먼저 확인할 것은?

① 대상과 변경 범위  
② 항상 Index 삭제  
③ 항상 모든 Row 유지  
④ 항상 Schema 제거

<details>
<summary>정답</summary>

①

</details>

해설: `대상과 변경 범위`가 핵심입니다.

### 7. Constraint를 확인하는 이유는?

① 명령이 무결성 규칙을 위반할 수 있기 때문  
② 항상 Index 삭제  
③ 항상 모든 Row 유지  
④ 항상 Schema 제거

<details>
<summary>정답</summary>

①

</details>

해설: `명령이 무결성 규칙을 위반할 수 있기 때문`가 핵심입니다.

### 8. SQLite 차이를 확인해야 하는 이유는?

① 지원 문법과 동작이 DBMS마다 다를 수 있기 때문  
② 항상 Index 삭제  
③ 항상 모든 Row 유지  
④ 항상 Schema 제거

<details>
<summary>정답</summary>

①

</details>

해설: `지원 문법과 동작이 DBMS마다 다를 수 있기 때문`가 핵심입니다.


## 다음에 이을 글

**NOT NULL · UNIQUE · CHECK · DEFAULT**입니다.

Column 값의 품질을 지키는 대표 제약조건 네 가지를 정리합니다.
