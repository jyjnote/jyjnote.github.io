---
title: NOT NULL · UNIQUE · CHECK · DEFAULT
date: 2026-09-18 23:10:00 +0900
slug: not-null-unique-check-default
permalink: /posts/not-null-unique-check-default/
categories: [CS, 데이터베이스]
tags: [NOTNULL, UNIQUE, CHECK, DEFAULT, Constraint, SQL, DomainIntegrity, SQLite, 정보처리기사, NCS]
math: true
---

NOT NULL, UNIQUE, CHECK, DEFAULT는 Column에 저장되는 값의 규칙을 정의하는 대표적인 SQL 제약조건입니다.

SQL 명령은 비슷해 보여도 **구조를 바꾸는지, 데이터를 바꾸는지, 권한을 바꾸는지**를 구분하면 이해하기 쉽습니다.

<blockquote class="prompt-info">
<p>한 줄: 네 제약조건은 NULL, 중복, 값의 조건, 기본값을 각각 제어합니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

NOT NULL = NULL 금지 / UNIQUE = 중복 금지 / CHECK = 조건 검사 / DEFAULT = 기본값

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
CREATE TABLE SAMPLE(
    ID INTEGER PRIMARY KEY,
    NAME TEXT NOT NULL,
    EMAIL TEXT UNIQUE,
    AGE INTEGER CHECK(AGE >= 0),
    STATUS TEXT DEFAULT 'ACTIVE'
);
```

<mark>네 제약조건은 NULL, 중복, 값의 조건, 기본값을 각각 제어합니다.</mark>

## NOT NULL

NULL을 허용하지 않습니다.

```sql
NAME TEXT NOT NULL
```

반드시 값이 있어야 하는 Column에 사용합니다.

Primary Key의 NULL 금지와 연결되지만 NOT NULL 자체는 일반 Column에도 사용할 수 있습니다.

## UNIQUE

같은 값의 중복을 허용하지 않습니다.

```sql
EMAIL TEXT UNIQUE
```

회원 이메일처럼 중복되면 안 되는 Column에 사용할 수 있습니다.

NULL 처리 세부는 DBMS마다 차이가 있을 수 있습니다.

## CHECK

저장할 값이 조건을 만족하는지 검사합니다.

```sql
AGE INTEGER CHECK(AGE >= 0)
```

음수 나이가 들어가는 것을 막을 수 있습니다.

## DEFAULT

값을 생략했을 때 사용할 기본값을 지정합니다.

```sql
STATUS TEXT DEFAULT 'ACTIVE'
```

직접 값을 넣으면 입력한 값이 사용됩니다.

## NOT NULL과 DEFAULT

두 제약은 목적이 다릅니다.

```text
NOT NULL
→ NULL 금지

DEFAULT
→ 값을 생략했을 때 기본값 제공
```

DEFAULT가 있다고 해서 모든 형태의 NULL 입력이 자동으로 기본값으로 바뀌는 것은 아닙니다.

## UNIQUE와 PRIMARY KEY

둘 다 유일성을 보장하지만 역할이 다릅니다.

```text
PRIMARY KEY
→ 대표 식별자

UNIQUE
→ 추가 유일성 규칙
```

Table에는 여러 UNIQUE 제약을 둘 수 있습니다.

## CHECK와 도메인 무결성

CHECK는 도메인 무결성을 구현하는 대표 수단입니다.

```sql
PRICE INTEGER CHECK(PRICE >= 0)
```

업무 규칙에 맞지 않는 값을 DBMS가 차단할 수 있습니다.

## Table 수준 UNIQUE

여러 Column 조합이 유일해야 할 수도 있습니다.

```sql
UNIQUE(CUSTOMER_ID, ORDER_DATE)
```

각 Column 단독이 아니라 조합의 중복을 막습니다.

## Table 수준 CHECK

여러 Column 사이 관계를 검사할 수도 있습니다.

```sql
CHECK(END_DATE >= START_DATE)
```

DBMS가 해당 표현을 지원하는 범위에서 사용합니다.

## SQLite와 CHECK

SQLite는 CHECK 제약을 지원합니다.

```sql
CHECK(STOCK >= 0)
```

다만 기존 데이터를 변경하거나 Schema를 바꾸는 과정에서는 제약조건 추가 방식에 제한이 있을 수 있습니다.

## DEFAULT 표현식

DEFAULT에 사용할 수 있는 값과 표현식 범위는 DBMS마다 차이가 있습니다.

SQLite에서는 `CURRENT_DATE`, `CURRENT_TIME`, `CURRENT_TIMESTAMP` 같은 특별한 기본값을 사용할 수 있습니다.

```sql
CREATED_AT TEXT DEFAULT CURRENT_TIMESTAMP
```

## 제약조건 이름

일부 DBMS에서는 제약조건에 이름을 붙일 수 있습니다.

```text
CONSTRAINT constraint_name ...
```

SQLite에서도 일부 Table Constraint 문맥에서 이름을 둘 수 있지만 관리 방식은 다른 DBMS와 차이가 있습니다.

## 시험 비교

| 제약조건 | 핵심 |
| --- | --- |
| NOT NULL | NULL 금지 |
| UNIQUE | 중복 금지 |
| CHECK | 조건 검사 |
| DEFAULT | 기본값 제공 |

한 줄씩 정확히 구분하면 객관식에서 대부분 해결할 수 있습니다.

## 다른 개념과 비교

### 비교 1. NOT NULL

```text
NOT NULL
→ NULL 금지
```

`NOT NULL · UNIQUE · CHECK · DEFAULT`과 비교할 때는 **Schema를 바꾸는지**, **Row를 바꾸는지**, **권한을 바꾸는지**를 먼저 확인합니다.

### 비교 2. UNIQUE

```text
UNIQUE
→ 중복 금지
```

`NOT NULL · UNIQUE · CHECK · DEFAULT`과 비교할 때는 **Schema를 바꾸는지**, **Row를 바꾸는지**, **권한을 바꾸는지**를 먼저 확인합니다.

### 비교 3. CHECK

```text
CHECK
→ 조건 검사
```

`NOT NULL · UNIQUE · CHECK · DEFAULT`과 비교할 때는 **Schema를 바꾸는지**, **Row를 바꾸는지**, **권한을 바꾸는지**를 먼저 확인합니다.

### 비교 4. DEFAULT

```text
DEFAULT
→ 기본값
```

`NOT NULL · UNIQUE · CHECK · DEFAULT`과 비교할 때는 **Schema를 바꾸는지**, **Row를 바꾸는지**, **권한을 바꾸는지**를 먼저 확인합니다.

## 실전 SQL 패턴

### 실전 패턴 1. NOT NULL

```sql
NAME TEXT NOT NULL
```

이 예시는 `NOT NULL · UNIQUE · CHECK · DEFAULT`에서 자주 보는 형태입니다.

문법을 외우기보다 **어떤 객체 또는 Row가 바뀌는지** 먼저 확인합니다.

```text
대상
→ 변경 내용
→ 제약조건 영향
→ 실행 후 결과
```

### 실전 패턴 2. UNIQUE

```sql
EMAIL TEXT UNIQUE
```

이 예시는 `NOT NULL · UNIQUE · CHECK · DEFAULT`에서 자주 보는 형태입니다.

문법을 외우기보다 **어떤 객체 또는 Row가 바뀌는지** 먼저 확인합니다.

```text
대상
→ 변경 내용
→ 제약조건 영향
→ 실행 후 결과
```

### 실전 패턴 3. CHECK

```sql
AGE INTEGER CHECK(AGE >= 0)
```

이 예시는 `NOT NULL · UNIQUE · CHECK · DEFAULT`에서 자주 보는 형태입니다.

문법을 외우기보다 **어떤 객체 또는 Row가 바뀌는지** 먼저 확인합니다.

```text
대상
→ 변경 내용
→ 제약조건 영향
→ 실행 후 결과
```

### 실전 패턴 4. DEFAULT

```sql
STATUS TEXT DEFAULT 'ACTIVE'
```

이 예시는 `NOT NULL · UNIQUE · CHECK · DEFAULT`에서 자주 보는 형태입니다.

문법을 외우기보다 **어떤 객체 또는 Row가 바뀌는지** 먼저 확인합니다.

```text
대상
→ 변경 내용
→ 제약조건 영향
→ 실행 후 결과
```

### 실전 패턴 5. 복합 UNIQUE

```sql
UNIQUE(CUSTOMER_ID, ORDER_DATE)
```

이 예시는 `NOT NULL · UNIQUE · CHECK · DEFAULT`에서 자주 보는 형태입니다.

문법을 외우기보다 **어떤 객체 또는 Row가 바뀌는지** 먼저 확인합니다.

```text
대상
→ 변경 내용
→ 제약조건 영향
→ 실행 후 결과
```

### 실전 패턴 6. 현재 시각 기본값

```sql
CREATED_AT TEXT DEFAULT CURRENT_TIMESTAMP
```

이 예시는 `NOT NULL · UNIQUE · CHECK · DEFAULT`에서 자주 보는 형태입니다.

문법을 외우기보다 **어떤 객체 또는 Row가 바뀌는지** 먼저 확인합니다.

```text
대상
→ 변경 내용
→ 제약조건 영향
→ 실행 후 결과
```

## 자주 하는 실수

### 실수 1. 실행 대상 Table을 확인하지 않는다.

`NOT NULL · UNIQUE · CHECK · DEFAULT`를 실행하기 전에는 다음을 확인합니다.

```text
1. 대상 객체
2. 변경 범위
3. Constraint
4. 참조 관계
5. DBMS 지원 여부
```

운영 환경에서는 특히 데이터 손실 가능성이 있는 명령을 바로 실행하지 않는 습관이 중요합니다.

### 실수 2. WHERE가 필요한 명령에서 조건을 빠뜨린다.

`NOT NULL · UNIQUE · CHECK · DEFAULT`를 실행하기 전에는 다음을 확인합니다.

```text
1. 대상 객체
2. 변경 범위
3. Constraint
4. 참조 관계
5. DBMS 지원 여부
```

운영 환경에서는 특히 데이터 손실 가능성이 있는 명령을 바로 실행하지 않는 습관이 중요합니다.

### 실수 3. Constraint 영향을 확인하지 않는다.

`NOT NULL · UNIQUE · CHECK · DEFAULT`를 실행하기 전에는 다음을 확인합니다.

```text
1. 대상 객체
2. 변경 범위
3. Constraint
4. 참조 관계
5. DBMS 지원 여부
```

운영 환경에서는 특히 데이터 손실 가능성이 있는 명령을 바로 실행하지 않는 습관이 중요합니다.

### 실수 4. SQLite와 다른 DBMS의 문법 차이를 무시한다.

`NOT NULL · UNIQUE · CHECK · DEFAULT`를 실행하기 전에는 다음을 확인합니다.

```text
1. 대상 객체
2. 변경 범위
3. Constraint
4. 참조 관계
5. DBMS 지원 여부
```

운영 환경에서는 특히 데이터 손실 가능성이 있는 명령을 바로 실행하지 않는 습관이 중요합니다.

### 실수 5. 실행 전 SELECT나 Schema 확인을 하지 않는다.

`NOT NULL · UNIQUE · CHECK · DEFAULT`를 실행하기 전에는 다음을 확인합니다.

```text
1. 대상 객체
2. 변경 범위
3. Constraint
4. 참조 관계
5. DBMS 지원 여부
```

운영 환경에서는 특히 데이터 손실 가능성이 있는 명령을 바로 실행하지 않는 습관이 중요합니다.

### 실수 6. DDL과 DML을 같은 종류로 생각한다.

`NOT NULL · UNIQUE · CHECK · DEFAULT`를 실행하기 전에는 다음을 확인합니다.

```text
1. 대상 객체
2. 변경 범위
3. Constraint
4. 참조 관계
5. DBMS 지원 여부
```

운영 환경에서는 특히 데이터 손실 가능성이 있는 명령을 바로 실행하지 않는 습관이 중요합니다.

## 잘 놓치는 핵심

### 1. NOT NULL

NULL을 허용하지 않습니다.

시험에서는 명령어 이름만 외우지 말고 **대상·범위·제약조건·DBMS 차이**를 함께 봅니다.

### 2. UNIQUE

같은 값의 중복을 허용하지 않습니다.

시험에서는 명령어 이름만 외우지 말고 **대상·범위·제약조건·DBMS 차이**를 함께 봅니다.

### 3. CHECK

저장할 값이 조건을 만족하는지 검사합니다.

시험에서는 명령어 이름만 외우지 말고 **대상·범위·제약조건·DBMS 차이**를 함께 봅니다.

### 4. DEFAULT

값을 생략했을 때 사용할 기본값을 지정합니다.

시험에서는 명령어 이름만 외우지 말고 **대상·범위·제약조건·DBMS 차이**를 함께 봅니다.

### 5. NOT NULL과 DEFAULT

두 제약은 목적이 다릅니다.

시험에서는 명령어 이름만 외우지 말고 **대상·범위·제약조건·DBMS 차이**를 함께 봅니다.

### 6. UNIQUE와 PRIMARY KEY

둘 다 유일성을 보장하지만 역할이 다릅니다.

시험에서는 명령어 이름만 외우지 말고 **대상·범위·제약조건·DBMS 차이**를 함께 봅니다.

## 시험·면접

### 핵심 암기

```text
NOT NULL = NULL 금지 / UNIQUE = 중복 금지 / CHECK = 조건 검사 / DEFAULT = 기본값
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

NOT NULL, UNIQUE, CHECK, DEFAULT는 Column에 저장되는 값의 규칙을 정의하는 대표적인 SQL 제약조건입니다.

실무에서는 실행 전 영향 범위와 제약조건, Transaction 가능 여부를 함께 확인하는 것이 중요합니다.

## 예시로 한 바퀴

다음 대표 문법을 다시 봅니다.

```sql
CREATE TABLE SAMPLE(
    ID INTEGER PRIMARY KEY,
    NAME TEXT NOT NULL,
    EMAIL TEXT UNIQUE,
    AGE INTEGER CHECK(AGE >= 0),
    STATUS TEXT DEFAULT 'ACTIVE'
);
```

먼저 이 명령이 **Schema**, **Row**, **권한** 중 무엇을 바꾸는지 판단합니다.

그다음 변경 범위와 제약조건을 확인합니다.

마지막으로 현재 실습 환경인 SQLite에서 같은 문법을 그대로 사용할 수 있는지 확인합니다.

## 객관식 문제

### 1. NOT NULL은?

① NULL 금지  
② 항상 Index 삭제  
③ 항상 모든 Row 유지  
④ 항상 Schema 제거

<details>
<summary>정답</summary>

①

</details>

해설: `NULL 금지`가 핵심입니다.

### 2. UNIQUE는?

① 중복 금지  
② 항상 Index 삭제  
③ 항상 모든 Row 유지  
④ 항상 Schema 제거

<details>
<summary>정답</summary>

①

</details>

해설: `중복 금지`가 핵심입니다.

### 3. CHECK는?

① 조건 검사  
② 항상 Index 삭제  
③ 항상 모든 Row 유지  
④ 항상 Schema 제거

<details>
<summary>정답</summary>

①

</details>

해설: `조건 검사`가 핵심입니다.

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

**GRANT · REVOKE**입니다.

사용자와 권한을 관리하는 GRANT와 REVOKE를 알아보고 SQLite와의 차이도 정리합니다.
