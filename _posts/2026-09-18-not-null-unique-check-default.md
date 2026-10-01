---
title: NOT NULL · UNIQUE · CHECK · DEFAULT
date: 2026-09-18 23:25:00 +0900
slug: not-null-unique-check-default
permalink: /posts/not-null-unique-check-default/
categories: [CS, 데이터베이스]
tags: [NOTNULL, UNIQUE, CHECK, DEFAULT, Constraint, SQL, 제약조건, 정보처리기사, NCS]
math: true
---

`NOT NULL`, `UNIQUE`, `CHECK`, `DEFAULT`는 <mark>Column에 저장될 값의 규칙을 정하는 대표적인 제약조건</mark>입니다.

각 제약조건은 NULL 허용 여부, 중복 여부, 값의 범위, 기본값을 제어합니다.

<blockquote class="prompt-info">
<p>한 줄: NOT NULL은 NULL 금지, UNIQUE는 중복 금지, CHECK는 조건 검사, DEFAULT는 기본값 지정입니다.</p>
</blockquote>

<details markdown="1">
<summary>한 줄로</summary>

Column에 들어갈 값의 규칙을 정하는 제약조건들입니다.

</details>

## NOT NULL

`NOT NULL`은 해당 Column에 NULL을 저장하지 못하게 합니다.

### 입력 상태

CUSTOMER Table이 없다고 가정합니다.

| 객체 | 상태 |
| --- | --- |
| CUSTOMER | 없음 |

```sql
CREATE TABLE CUSTOMER(
    CUSTOMER_ID TEXT PRIMARY KEY,
    NAME TEXT NOT NULL
);
```

### 결과 Table 구조

| Column | 제약조건 |
| --- | --- |
| CUSTOMER_ID | PRIMARY KEY |
| NAME | NOT NULL |

이후 NAME 없이 Row를 추가하면 제약조건을 위반할 수 있습니다.

```sql
INSERT INTO CUSTOMER(
    CUSTOMER_ID,
    NAME
)
VALUES (
    'C001',
    NULL
);
```

### 결과

| CUSTOMER_ID | NAME |
| --- | --- |
| 추가 실패 가능 | NOT NULL 위반 |

```text
NOT NULL
→ NULL 저장 금지
```

## UNIQUE

`UNIQUE`는 같은 Column에 중복된 값을 저장하지 못하게 합니다.

### 입력 상태

USER_ACCOUNT Table이 없다고 가정합니다.

| 객체 | 상태 |
| --- | --- |
| USER_ACCOUNT | 없음 |

```sql
CREATE TABLE USER_ACCOUNT(
    USER_ID INTEGER PRIMARY KEY,
    EMAIL TEXT UNIQUE
);
```

### 입력 데이터

| USER_ID | EMAIL |
| --- | --- |
| 1 | a@test.com |

```sql
INSERT INTO USER_ACCOUNT
VALUES (
    2,
    'a@test.com'
);
```

### 결과

| USER_ID | EMAIL |
| --- | --- |
| 1 | a@test.com |

같은 이메일이 이미 있으므로 중복 저장이 제한됩니다.

```text
UNIQUE
→ 중복 금지
```

## CHECK

`CHECK`는 입력값이 지정한 조건을 만족하는지 검사합니다.

### 입력 상태

EMPLOYEE Table이 없다고 가정합니다.

| 객체 | 상태 |
| --- | --- |
| EMPLOYEE | 없음 |

```sql
CREATE TABLE EMPLOYEE(
    EMP_ID INTEGER PRIMARY KEY,
    EMP_NAME TEXT NOT NULL,
    SALARY INTEGER CHECK (SALARY >= 0)
);
```

### 입력 데이터

| EMP_ID | EMP_NAME | SALARY |
| --- | --- | ---: |
| 1001 | 직원1 | 3000 |

```sql
INSERT INTO EMPLOYEE
VALUES (
    1002,
    '직원2',
    -500
);
```

### 결과

| EMP_ID | EMP_NAME | SALARY |
| --- | --- | ---: |
| 1001 | 직원1 | 3000 |

`SALARY >= 0` 조건을 만족하지 않으므로 추가가 제한됩니다.

```text
CHECK
→ 지정 조건 검사
```

## DEFAULT

`DEFAULT`는 INSERT할 때 값을 생략한 경우 자동으로 사용할 기본값을 지정합니다.

### 입력 상태

ORDERS Table이 없다고 가정합니다.

| 객체 | 상태 |
| --- | --- |
| ORDERS | 없음 |

```sql
CREATE TABLE ORDERS(
    ORDER_ID TEXT PRIMARY KEY,
    STATUS TEXT DEFAULT '결제대기'
);
```

### 값 생략

```sql
INSERT INTO ORDERS(
    ORDER_ID
)
VALUES (
    'O0001'
);
```

### 결과 Table

| ORDER_ID | STATUS |
| --- | --- |
| O0001 | 결제대기 |

STATUS 값을 직접 넣지 않았기 때문에 DEFAULT 값이 사용됩니다.

```text
DEFAULT
→ 값 생략 시 기본값 사용
```

## 네 제약조건 비교

| 제약조건 | 핵심 역할 |
| --- | --- |
| NOT NULL | NULL 금지 |
| UNIQUE | 중복 금지 |
| CHECK | 조건 만족 여부 검사 |
| DEFAULT | 값 생략 시 기본값 지정 |

```text
NULL을 막는다
→ NOT NULL

중복을 막는다
→ UNIQUE

값의 범위를 제한한다
→ CHECK

값을 생략했을 때 자동 입력한다
→ DEFAULT
```

## PRIMARY KEY와 UNIQUE 차이

둘 다 중복을 막는다는 점에서 헷갈리기 쉽습니다.

| 구분 | PRIMARY KEY | UNIQUE |
| --- | --- | --- |
| 중복 | 불가 | 불가 |
| NULL | 불가 | DBMS 규칙에 따라 처리 차이 가능 |
| 목적 | Row 식별 | 값 중복 방지 |
| Table 내 사용 | 하나의 기본키 정의 | 여러 UNIQUE 가능 |

예를 들어 회원 ID는 PRIMARY KEY, 이메일은 UNIQUE로 둘 수 있습니다.

```sql
CREATE TABLE USER_ACCOUNT(
    USER_ID INTEGER PRIMARY KEY,
    EMAIL TEXT UNIQUE
);
```

## DEFAULT와 NULL 차이

DEFAULT가 있다고 해서 명시적으로 NULL을 넣었을 때 항상 기본값으로 바뀌는 것은 아닙니다.

### Table 구조

```sql
CREATE TABLE PRODUCT(
    PRODUCT_ID TEXT PRIMARY KEY,
    STOCK INTEGER DEFAULT 0
);
```

### 값을 생략

```sql
INSERT INTO PRODUCT(
    PRODUCT_ID
)
VALUES (
    'P001'
);
```

### 결과

| PRODUCT_ID | STOCK |
| --- | ---: |
| P001 | 0 |

반면 다음처럼 NULL을 직접 넣으면 NULL이 저장될 수 있습니다.

```sql
INSERT INTO PRODUCT(
    PRODUCT_ID,
    STOCK
)
VALUES (
    'P002',
    NULL
);
```

### 결과

| PRODUCT_ID | STOCK |
| --- | --- |
| P002 | NULL |

<blockquote class="prompt-warning">
<p>DEFAULT는 보통 값을 생략했을 때 사용되며, NULL을 직접 입력하는 것과는 다릅니다.</p>
</blockquote>

## 잘 놓치는 핵심

### 1. NOT NULL은 NULL만 막는다

중복값 자체를 막는 제약조건은 아닙니다.

### 2. UNIQUE는 중복값을 막는다

Row 전체가 아니라 지정한 Column의 중복 여부를 검사합니다.

### 3. CHECK는 조건식을 검사한다

```text
SALARY >= 0
AGE >= 18
STOCK >= 0
```

같은 규칙을 만들 수 있습니다.

### 4. DEFAULT는 값 생략 시 사용한다

사용자가 직접 값을 넣으면 입력한 값이 우선됩니다.

## 시험·면접

### 핵심 암기

```text
NOT NULL
→ NULL 금지
```

```text
UNIQUE
→ 중복 금지
```

```text
CHECK
→ 조건 검사
```

```text
DEFAULT
→ 기본값
```

### 시험 함정

`DEFAULT`는 값이 NULL이면 무조건 기본값으로 바꿔주는 제약조건이라고 생각하면 안 됩니다.

또한 `NOT NULL`은 중복값을 막지 않고, `UNIQUE`는 NULL 처리 방식이 데이터베이스 시스템에 따라 차이가 있을 수 있습니다.

### 면접 짧은 답변

`NOT NULL`은 NULL 입력을 금지하고, `UNIQUE`는 중복값을 제한합니다. `CHECK`는 입력값이 지정한 조건을 만족하는지 검사하며, `DEFAULT`는 값을 생략했을 때 사용할 기본값을 지정합니다.

## 객관식 문제

### 문제 1 · NOT NULL

다음 중 `NOT NULL`의 역할은?

① 중복 금지  
② NULL 금지  
③ 기본값 지정  
④ 범위 검사

<details markdown="1">
<summary>정답</summary>

②

`NOT NULL`은 해당 Column에 NULL이 저장되는 것을 막습니다.

</details>

### 문제 2 · UNIQUE

다음 중 이메일 중복을 막을 때 가장 적절한 제약조건은?

① DEFAULT  
② CHECK  
③ UNIQUE  
④ NOT NULL만 사용

<details markdown="1">
<summary>정답</summary>

③

`UNIQUE`는 같은 값의 중복 저장을 제한합니다.

</details>

### 문제 3 · CHECK

다음 SQL에서 `CHECK`의 역할은?

```sql
SALARY INTEGER CHECK (SALARY >= 0)
```

① SALARY를 자동으로 0으로 만든다.  
② SALARY의 중복을 막는다.  
③ SALARY가 0 이상인지 검사한다.  
④ SALARY를 PRIMARY KEY로 만든다.

<details markdown="1">
<summary>정답</summary>

③

입력되는 SALARY 값이 `0 이상`이라는 조건을 만족하는지 검사합니다.

</details>

### 문제 4 · DEFAULT

다음 Table에서 STATUS 값을 생략하고 INSERT하면 기본적으로 사용되는 값은?

```sql
CREATE TABLE ORDERS(
    ORDER_ID TEXT PRIMARY KEY,
    STATUS TEXT DEFAULT '결제대기'
);
```

① NULL만 가능  
② 결제대기  
③ ORDER_ID  
④ 0

<details markdown="1">
<summary>정답</summary>

②

STATUS 값을 생략하면 `결제대기`가 기본값으로 사용됩니다.

</details>

### 문제 5 · PRIMARY KEY와 UNIQUE

다음 설명으로 옳은 것은?

① PRIMARY KEY와 UNIQUE는 항상 완전히 같은 제약조건이다.  
② UNIQUE는 중복값 제한에 사용한다.  
③ NOT NULL은 중복값까지 자동으로 막는다.  
④ DEFAULT는 Row를 삭제한다.

<details markdown="1">
<summary>정답</summary>

②

`UNIQUE`는 지정한 Column의 중복값을 제한하는 데 사용합니다.

</details>

## NOT NULL · UNIQUE · CHECK · DEFAULT 전체 요약

| 제약조건 | 핵심 |
| --- | --- |
| NOT NULL | NULL 금지 |
| UNIQUE | 중복 금지 |
| CHECK | 조건 검사 |
| DEFAULT | 기본값 지정 |

```sql
CREATE TABLE PRODUCT(
    PRODUCT_ID TEXT PRIMARY KEY,
    PRODUCT_NAME TEXT NOT NULL,
    CATEGORY TEXT UNIQUE,
    PRICE INTEGER CHECK (PRICE >= 0),
    STOCK INTEGER DEFAULT 0
);
```

```text
NOT NULL
→ 반드시 값 필요

UNIQUE
→ 중복 불가

CHECK
→ 조건 만족 필요

DEFAULT
→ 생략 시 기본값
```

<blockquote class="prompt-danger">
<p>제약조건 문제에서는 NULL, 중복, 조건 검사, 기본값 중 무엇을 제어하는지 먼저 구분합니다.</p>
</blockquote>

## 다음에 이을 글

**GRANT · REVOKE**입니다.

사용자에게 권한을 부여하고 회수하는 명령을 살펴봅니다.
