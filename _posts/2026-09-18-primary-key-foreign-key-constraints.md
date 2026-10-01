---
title: PRIMARY KEY · FOREIGN KEY
date: 2026-09-18 23:20:00 +0900
slug: primary-key-foreign-key-constraints
permalink: /posts/primary-key-foreign-key-constraints/
categories: [CS, 데이터베이스]
tags: [PRIMARYKEY, FOREIGNKEY, 기본키, 외래키, Constraint, SQL, 참조무결성, 정보처리기사, NCS]
math: true
---

`PRIMARY KEY`와 `FOREIGN KEY`는 <mark>Table의 Row를 식별하고 Table 사이의 관계를 유지하는 핵심 제약조건</mark>입니다.

`PRIMARY KEY`는 하나의 Row를 고유하게 식별하고, `FOREIGN KEY`는 다른 Table의 Key를 참조합니다.

<blockquote class="prompt-info">
<p>한 줄: PRIMARY KEY는 자기 Table의 Row를 식별하고, FOREIGN KEY는 다른 Table과의 관계를 연결합니다.</p>
</blockquote>

<details markdown="1">
<summary>한 줄로</summary>

`PRIMARY KEY`는 고유 식별자, `FOREIGN KEY`는 다른 Table을 참조하는 Key입니다.

</details>

## PRIMARY KEY

PRIMARY KEY는 Table의 각 Row를 고유하게 구분하는 Key입니다.

### 입력 상태

아직 DEPARTMENT Table이 없다고 가정합니다.

| 객체 | 상태 |
| --- | --- |
| DEPARTMENT | 없음 |

```sql
CREATE TABLE DEPARTMENT(
    DEPT_ID INTEGER PRIMARY KEY,
    DEPT_NAME TEXT NOT NULL,
    REGION TEXT
);
```

### 결과 Table 구조

| Column | 자료형 | 제약조건 |
| --- | --- | --- |
| DEPT_ID | INTEGER | PRIMARY KEY |
| DEPT_NAME | TEXT | NOT NULL |
| REGION | TEXT | 없음 |

`DEPT_ID`가 각 부서 Row를 구분하는 기준이 됩니다.

```text
DEPT_ID = 10
→ 개발 부서

DEPT_ID = 20
→ 인사 부서
```

## PRIMARY KEY의 핵심 특징

PRIMARY KEY는 기본적으로 다음 성질을 가집니다.

```text
중복 불가
+
NULL 불가
```

### 입력 Table · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |

```sql
INSERT INTO DEPARTMENT
VALUES (10, '영업', '서울');
```

### 결과 Table

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |

`DEPT_ID = 10`이 이미 존재하므로 새로운 Row는 정상적으로 추가될 수 없습니다.

<blockquote class="prompt-warning">
<p>PRIMARY KEY는 같은 값이 중복될 수 없고 NULL도 허용하지 않습니다.</p>
</blockquote>

## FOREIGN KEY

FOREIGN KEY는 한 Table의 Column이 다른 Table의 Key를 참조하도록 만드는 제약조건입니다.

### 입력 상태

DEPARTMENT Table이 먼저 존재한다고 가정합니다.

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |

```sql
CREATE TABLE EMPLOYEE(
    EMP_ID INTEGER PRIMARY KEY,
    EMP_NAME TEXT NOT NULL,
    DEPT_ID INTEGER,
    FOREIGN KEY(DEPT_ID) REFERENCES DEPARTMENT(DEPT_ID)
);
```

### 결과 Table 구조

| Column | 역할 |
| --- | --- |
| EMP_ID | EMPLOYEE의 PRIMARY KEY |
| EMP_NAME | 직원 이름 |
| DEPT_ID | DEPARTMENT.DEPT_ID 참조 |

관계는 다음처럼 볼 수 있습니다.

```text
EMPLOYEE.DEPT_ID
→ DEPARTMENT.DEPT_ID
```

## 정상적인 FOREIGN KEY 입력

참조 대상 값이 존재하면 정상적으로 관계를 만들 수 있습니다.

### 입력 Table 1 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |

### 입력 Table 2 · EMPLOYEE

| EMP_ID | EMP_NAME | DEPT_ID |
| --- | --- | --- |
| 1001 | 직원1 | 10 |

```sql
INSERT INTO EMPLOYEE(
    EMP_ID,
    EMP_NAME,
    DEPT_ID
)
VALUES (
    1002,
    '직원2',
    20
);
```

### 결과 Table · EMPLOYEE

| EMP_ID | EMP_NAME | DEPT_ID |
| --- | --- | --- |
| 1001 | 직원1 | 10 |
| 1002 | 직원2 | 20 |

`DEPT_ID = 20`이 DEPARTMENT에 존재하므로 참조 관계가 성립합니다.

## 존재하지 않는 값을 참조하면

Foreign Key 제약조건이 활성화되어 있다면 참조 대상이 없는 값을 넣을 수 없습니다.

### 입력 Table 1 · DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |

### 입력 Table 2 · EMPLOYEE

| EMP_ID | EMP_NAME | DEPT_ID |
| --- | --- | --- |
| 1001 | 직원1 | 10 |

```sql
INSERT INTO EMPLOYEE(
    EMP_ID,
    EMP_NAME,
    DEPT_ID
)
VALUES (
    1002,
    '직원2',
    99
);
```

### 결과 Table · EMPLOYEE

| EMP_ID | EMP_NAME | DEPT_ID |
| --- | --- | --- |
| 1001 | 직원1 | 10 |

DEPARTMENT에 `DEPT_ID = 99`가 없으므로 참조 무결성을 위반합니다.

```text
EMPLOYEE.DEPT_ID = 99

DEPARTMENT.DEPT_ID에 99 없음

→ 참조 불가
```

## 참조 무결성

Foreign Key는 Table 사이의 관계가 깨지지 않도록 도와줍니다.

```text
부모 Table
DEPARTMENT

자식 Table
EMPLOYEE
```

EMPLOYEE의 `DEPT_ID`가 DEPARTMENT의 `DEPT_ID`를 참조한다면, 존재하지 않는 부서를 직원에게 지정하는 것을 막을 수 있습니다.

## PRIMARY KEY와 FOREIGN KEY 비교

| 구분 | PRIMARY KEY | FOREIGN KEY |
| --- | --- | --- |
| 목적 | Row 식별 | 다른 Table 참조 |
| 중복 | 불가 | 가능 |
| NULL | 불가 | 설정에 따라 가능 |
| Table 내 개수 | 하나의 기본키 정의 | 여러 개 가능 |
| 핵심 | 고유성 | 참조 무결성 |

예를 들어 여러 직원이 같은 부서에 속할 수 있으므로 FOREIGN KEY 값은 중복될 수 있습니다.

### 입력 Table · EMPLOYEE

| EMP_ID | EMP_NAME | DEPT_ID |
| --- | --- | --- |
| 1001 | 직원1 | 10 |
| 1002 | 직원2 | 10 |
| 1003 | 직원3 | 20 |

`DEPT_ID = 10`이 여러 번 나타나도 문제가 없습니다.

## 복합 PRIMARY KEY

여러 Column의 조합을 하나의 PRIMARY KEY로 사용할 수도 있습니다.

### 입력 상태

ORDER_ITEM Table이 없다고 가정합니다.

| 객체 | 상태 |
| --- | --- |
| ORDER_ITEM | 없음 |

```sql
CREATE TABLE ORDER_ITEM(
    ORDER_ID TEXT,
    PRODUCT_ID TEXT,
    QTY INTEGER,
    PRIMARY KEY(ORDER_ID, PRODUCT_ID)
);
```

### 결과 Table 구조

| Column | 역할 |
| --- | --- |
| ORDER_ID | 복합 Key 구성 |
| PRODUCT_ID | 복합 Key 구성 |
| QTY | 수량 |
| ORDER_ID + PRODUCT_ID | PRIMARY KEY |

```text
ORDER_ID 하나
→ 중복 가능

PRODUCT_ID 하나
→ 중복 가능

ORDER_ID + PRODUCT_ID 조합
→ 중복 불가
```

## JOIN과 FOREIGN KEY는 다르다

FOREIGN KEY와 JOIN은 자주 함께 등장하지만 같은 개념은 아닙니다.

```text
FOREIGN KEY
→ 관계의 무결성을 관리하는 제약조건

JOIN
→ 조회할 때 Row를 연결하는 연산
```

Foreign Key가 없어도 조건이 맞으면 JOIN할 수 있습니다.

반대로 Foreign Key가 있다고 자동으로 JOIN 결과가 만들어지는 것도 아닙니다.

## 잘 놓치는 핵심

### 1. PRIMARY KEY는 Row 식별용이다

```text
중복 불가
NULL 불가
```

### 2. FOREIGN KEY 값은 중복될 수 있다

여러 직원이 같은 부서를 참조할 수 있습니다.

### 3. FOREIGN KEY는 존재하는 값을 참조해야 한다

참조 대상 Key가 없으면 참조 무결성을 위반할 수 있습니다.

### 4. PRIMARY KEY와 FOREIGN KEY는 JOIN 자체가 아니다

Key는 제약조건이고 JOIN은 조회 연산입니다.

## 시험·면접

### 핵심 암기

```text
PRIMARY KEY
→ Row 고유 식별
→ 중복 X
→ NULL X
```

```text
FOREIGN KEY
→ 다른 Table의 Key 참조
→ 중복 가능
→ 참조 무결성
```

```text
복합 PRIMARY KEY
→ 여러 Column 조합으로 식별
```

### 시험 함정

FOREIGN KEY는 반드시 고유한 값만 가져야 하는 것이 아닙니다.

여러 Row가 같은 부모 Row를 참조할 수 있으므로 중복될 수 있습니다.

또한 FOREIGN KEY와 JOIN은 서로 다른 개념입니다.

### 면접 짧은 답변

`PRIMARY KEY`는 Table의 각 Row를 고유하게 식별하는 제약조건으로 중복과 NULL을 허용하지 않습니다. `FOREIGN KEY`는 다른 Table의 Key를 참조하여 Table 사이의 관계와 참조 무결성을 유지하며, 여러 Row가 같은 값을 참조할 수 있으므로 중복은 가능합니다.

## 객관식 문제

### 문제 1 · PRIMARY KEY

PRIMARY KEY에 대한 설명으로 옳은 것은?

① 중복을 허용한다.  
② NULL을 반드시 허용한다.  
③ Row를 고유하게 식별한다.  
④ 다른 Table만 참조한다.

<details markdown="1">
<summary>정답</summary>

③

PRIMARY KEY는 각 Row를 고유하게 구분하는 Key입니다.

</details>

### 문제 2 · 중복 PRIMARY KEY

#### DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |

다음 SQL에 대한 설명으로 옳은 것은?

```sql
INSERT INTO DEPARTMENT
VALUES (10, '인사', '부산');
```

① 정상적으로 중복 Row가 추가된다.  
② PRIMARY KEY 중복으로 실패할 수 있다.  
③ 기존 개발 Row가 자동 삭제된다.  
④ DEPT_ID가 자동으로 11이 된다.

<details markdown="1">
<summary>정답</summary>

②

`DEPT_ID = 10`이 이미 PRIMARY KEY 값으로 존재하므로 중복될 수 없습니다.

</details>

### 문제 3 · FOREIGN KEY

다음 관계의 의미로 옳은 것은?

```text
EMPLOYEE.DEPT_ID
→ DEPARTMENT.DEPT_ID
```

① EMPLOYEE의 DEPT_ID가 DEPARTMENT의 DEPT_ID를 참조한다.  
② 두 Column 모두 반드시 PRIMARY KEY다.  
③ DEPARTMENT가 EMPLOYEE를 삭제한다.  
④ 두 Table이 자동으로 JOIN된다.

<details markdown="1">
<summary>정답</summary>

①

EMPLOYEE의 `DEPT_ID`가 DEPARTMENT의 Key를 참조하는 관계입니다.

</details>

### 문제 4 · FOREIGN KEY 중복

다음 중 FOREIGN KEY 값에 대한 설명으로 옳은 것은?

① 항상 중복 불가  
② 여러 Row가 같은 부모 Key를 참조할 수 있다.  
③ 반드시 PRIMARY KEY와 같은 Table에 있어야 한다.  
④ JOIN에서만 사용할 수 있다.

<details markdown="1">
<summary>정답</summary>

②

여러 직원이 같은 부서에 속할 수 있으므로 Foreign Key 값은 중복될 수 있습니다.

</details>

### 문제 5 · 복합 PRIMARY KEY

다음 SQL의 PRIMARY KEY는?

```sql
CREATE TABLE ORDER_ITEM(
    ORDER_ID TEXT,
    PRODUCT_ID TEXT,
    QTY INTEGER,
    PRIMARY KEY(ORDER_ID, PRODUCT_ID)
);
```

① ORDER_ID만  
② PRODUCT_ID만  
③ QTY만  
④ ORDER_ID와 PRODUCT_ID의 조합

<details markdown="1">
<summary>정답</summary>

④

두 Column의 조합이 하나의 복합 PRIMARY KEY입니다.

</details>

## PRIMARY KEY · FOREIGN KEY 전체 요약

### DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |

### EMPLOYEE

| EMP_ID | EMP_NAME | DEPT_ID |
| --- | --- | --- |
| 1001 | 직원1 | 10 |
| 1002 | 직원2 | 20 |
| 1003 | 직원3 | 10 |

```text
DEPARTMENT.DEPT_ID
→ PRIMARY KEY

EMPLOYEE.EMP_ID
→ PRIMARY KEY

EMPLOYEE.DEPT_ID
→ FOREIGN KEY
→ DEPARTMENT.DEPT_ID 참조
```

<blockquote class="prompt-danger">
<p>Key 문제에서는 먼저 Row를 식별하는 Key인지, 다른 Table을 참조하는 Key인지 구분합니다.</p>
</blockquote>

## 다음에 이을 글

**NOT NULL · UNIQUE · CHECK · DEFAULT**입니다.

Column에 적용할 수 있는 대표적인 제약조건과 각각의 역할을 살펴봅니다.
