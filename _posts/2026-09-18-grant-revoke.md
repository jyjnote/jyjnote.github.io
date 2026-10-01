---
title: GRANT · REVOKE
date: 2026-09-18 23:15:00 +0900
slug: grant-revoke
permalink: /posts/grant-revoke/
categories: [CS, 데이터베이스]
tags: [GRANT, REVOKE, DCL, SQL, 권한, SELECT권한, SQLite, 정보처리기사, NCS]
math: true
---

GRANT는 사용자나 역할에 권한을 부여하고 REVOKE는 이미 부여한 권한을 회수하는 DCL 명령어입니다.

SQL 명령은 비슷해 보여도 **구조를 바꾸는지, 데이터를 바꾸는지, 권한을 바꾸는지**를 구분하면 이해하기 쉽습니다.

<blockquote class="prompt-info">
<p>한 줄: GRANT는 권한 부여, REVOKE는 권한 회수입니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

GRANT = 권한 부여 / REVOKE = 권한 회수

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
GRANT SELECT
ON EMPLOYEE
TO user1;
```

<mark>GRANT는 권한 부여, REVOKE는 권한 회수입니다.</mark>

## GRANT 기본

사용자에게 객체 접근 권한을 부여합니다.

```sql
GRANT SELECT
ON EMPLOYEE
TO user1;
```

`user1`이 EMPLOYEE를 조회할 수 있도록 하는 전형적인 예시입니다.

## 여러 권한

여러 권한을 함께 부여할 수 있는 DBMS가 많습니다.

```sql
GRANT SELECT, INSERT, UPDATE
ON EMPLOYEE
TO user1;
```

지원 가능한 권한 종류는 DBMS마다 다릅니다.

## REVOKE 기본

이미 부여한 권한을 회수합니다.

```sql
REVOKE SELECT
ON EMPLOYEE
FROM user1;
```

사용자의 EMPLOYEE 조회 권한을 제거하는 의미입니다.

## 대표 권한

대표적으로 다음 권한을 볼 수 있습니다.

```text
SELECT
INSERT
UPDATE
DELETE
REFERENCES
EXECUTE
```

객체 종류와 DBMS에 따라 가능한 권한은 달라집니다.

## 최소 권한 원칙

사용자에게 필요한 권한만 주는 것이 중요합니다.

```text
필요한 작업
→ 필요한 권한만
```

모든 사용자에게 광범위한 변경 권한을 주면 사고 위험이 커집니다.

## WITH GRANT OPTION

일부 DBMS에서는 받은 권한을 다른 사용자에게 다시 부여할 수 있게 할 수 있습니다.

```sql
GRANT SELECT
ON EMPLOYEE
TO user1
WITH GRANT OPTION;
```

이 권한은 전파될 수 있으므로 매우 신중하게 사용해야 합니다.

## REVOKE와 권한 전파

권한을 회수할 때 다른 사용자에게 전파된 권한까지 어떤 방식으로 처리되는지는 DBMS의 권한 모델에 따라 다릅니다.

CASCADE, RESTRICT 같은 개념이 관련될 수 있습니다.

정확한 문법은 사용하는 DBMS 문서를 확인해야 합니다.

## Role

실무에서는 사용자 하나하나보다 Role에 권한을 부여하고 사용자를 Role에 연결하는 방식이 많이 사용됩니다.

```text
Role
→ 권한 묶음

User
→ Role 할당
```

권한 관리가 단순해집니다.

## SQLite에는 GRANT · REVOKE가 없다

SQLite는 서버형 DBMS의 사용자 계정·권한 모델을 제공하지 않습니다.

따라서 일반적인 다음 문법을 지원하지 않습니다.

```sql
GRANT SELECT ON EMPLOYEE TO user1;
```

```sql
REVOKE SELECT ON EMPLOYEE FROM user1;
```

SQLite 접근 권한은 주로 운영체제 파일 권한이나 애플리케이션 계층에서 관리합니다.

<blockquote class="prompt-warning">
<p>현재 SQLite 실습 DB에서는 GRANT와 REVOKE를 직접 실행할 수 없습니다.</p>
</blockquote>

## DCL 개념

GRANT와 REVOKE는 전통적으로 DCL로 분류합니다.

```text
DDL
→ 구조 정의

DML
→ 데이터 조회·변경

DCL
→ 권한 제어
```

교재나 DBMS에 따라 Transaction 명령을 TCL로 별도 분류하기도 합니다.

## 시험 포인트

시험에서는 다음 두 줄이 핵심입니다.

```text
GRANT
→ 권한 부여

REVOKE
→ 권한 회수
```

그리고 SQLite에서는 직접 지원하지 않는다는 점은 실습 환경 차이로 따로 기억합니다.

## 다른 개념과 비교

### 비교 1. GRANT

```text
GRANT
→ 권한 부여
```

`GRANT · REVOKE`과 비교할 때는 **Schema를 바꾸는지**, **Row를 바꾸는지**, **권한을 바꾸는지**를 먼저 확인합니다.

### 비교 2. REVOKE

```text
REVOKE
→ 권한 회수
```

`GRANT · REVOKE`과 비교할 때는 **Schema를 바꾸는지**, **Row를 바꾸는지**, **권한을 바꾸는지**를 먼저 확인합니다.

### 비교 3. Role

```text
Role
→ 권한 묶음
```

`GRANT · REVOKE`과 비교할 때는 **Schema를 바꾸는지**, **Row를 바꾸는지**, **권한을 바꾸는지**를 먼저 확인합니다.

### 비교 4. SQLite

```text
SQLite
→ 서버형 권한 문법 미지원
```

`GRANT · REVOKE`과 비교할 때는 **Schema를 바꾸는지**, **Row를 바꾸는지**, **권한을 바꾸는지**를 먼저 확인합니다.

## 실전 SQL 패턴

### 실전 패턴 1. SELECT 권한

```sql
GRANT SELECT ON EMPLOYEE TO user1;
```

이 예시는 `GRANT · REVOKE`에서 자주 보는 형태입니다.

문법을 외우기보다 **어떤 객체 또는 Row가 바뀌는지** 먼저 확인합니다.

```text
대상
→ 변경 내용
→ 제약조건 영향
→ 실행 후 결과
```

### 실전 패턴 2. 여러 권한

```sql
GRANT SELECT, INSERT, UPDATE ON EMPLOYEE TO user1;
```

이 예시는 `GRANT · REVOKE`에서 자주 보는 형태입니다.

문법을 외우기보다 **어떤 객체 또는 Row가 바뀌는지** 먼저 확인합니다.

```text
대상
→ 변경 내용
→ 제약조건 영향
→ 실행 후 결과
```

### 실전 패턴 3. 권한 회수

```sql
REVOKE SELECT ON EMPLOYEE FROM user1;
```

이 예시는 `GRANT · REVOKE`에서 자주 보는 형태입니다.

문법을 외우기보다 **어떤 객체 또는 Row가 바뀌는지** 먼저 확인합니다.

```text
대상
→ 변경 내용
→ 제약조건 영향
→ 실행 후 결과
```

### 실전 패턴 4. GRANT OPTION

```sql
GRANT SELECT ON EMPLOYEE TO user1 WITH GRANT OPTION;
```

이 예시는 `GRANT · REVOKE`에서 자주 보는 형태입니다.

문법을 외우기보다 **어떤 객체 또는 Row가 바뀌는지** 먼저 확인합니다.

```text
대상
→ 변경 내용
→ 제약조건 영향
→ 실행 후 결과
```

### 실전 패턴 5. SQLite 주의

```sql
-- SQLite에서는 GRANT/REVOKE를 지원하지 않음
```

이 예시는 `GRANT · REVOKE`에서 자주 보는 형태입니다.

문법을 외우기보다 **어떤 객체 또는 Row가 바뀌는지** 먼저 확인합니다.

```text
대상
→ 변경 내용
→ 제약조건 영향
→ 실행 후 결과
```

### 실전 패턴 6. 최소 권한

```sql
-- 필요한 객체와 작업에 필요한 권한만 부여
```

이 예시는 `GRANT · REVOKE`에서 자주 보는 형태입니다.

문법을 외우기보다 **어떤 객체 또는 Row가 바뀌는지** 먼저 확인합니다.

```text
대상
→ 변경 내용
→ 제약조건 영향
→ 실행 후 결과
```

## 자주 하는 실수

### 실수 1. 실행 대상 Table을 확인하지 않는다.

`GRANT · REVOKE`를 실행하기 전에는 다음을 확인합니다.

```text
1. 대상 객체
2. 변경 범위
3. Constraint
4. 참조 관계
5. DBMS 지원 여부
```

운영 환경에서는 특히 데이터 손실 가능성이 있는 명령을 바로 실행하지 않는 습관이 중요합니다.

### 실수 2. WHERE가 필요한 명령에서 조건을 빠뜨린다.

`GRANT · REVOKE`를 실행하기 전에는 다음을 확인합니다.

```text
1. 대상 객체
2. 변경 범위
3. Constraint
4. 참조 관계
5. DBMS 지원 여부
```

운영 환경에서는 특히 데이터 손실 가능성이 있는 명령을 바로 실행하지 않는 습관이 중요합니다.

### 실수 3. Constraint 영향을 확인하지 않는다.

`GRANT · REVOKE`를 실행하기 전에는 다음을 확인합니다.

```text
1. 대상 객체
2. 변경 범위
3. Constraint
4. 참조 관계
5. DBMS 지원 여부
```

운영 환경에서는 특히 데이터 손실 가능성이 있는 명령을 바로 실행하지 않는 습관이 중요합니다.

### 실수 4. SQLite와 다른 DBMS의 문법 차이를 무시한다.

`GRANT · REVOKE`를 실행하기 전에는 다음을 확인합니다.

```text
1. 대상 객체
2. 변경 범위
3. Constraint
4. 참조 관계
5. DBMS 지원 여부
```

운영 환경에서는 특히 데이터 손실 가능성이 있는 명령을 바로 실행하지 않는 습관이 중요합니다.

### 실수 5. 실행 전 SELECT나 Schema 확인을 하지 않는다.

`GRANT · REVOKE`를 실행하기 전에는 다음을 확인합니다.

```text
1. 대상 객체
2. 변경 범위
3. Constraint
4. 참조 관계
5. DBMS 지원 여부
```

운영 환경에서는 특히 데이터 손실 가능성이 있는 명령을 바로 실행하지 않는 습관이 중요합니다.

### 실수 6. DDL과 DML을 같은 종류로 생각한다.

`GRANT · REVOKE`를 실행하기 전에는 다음을 확인합니다.

```text
1. 대상 객체
2. 변경 범위
3. Constraint
4. 참조 관계
5. DBMS 지원 여부
```

운영 환경에서는 특히 데이터 손실 가능성이 있는 명령을 바로 실행하지 않는 습관이 중요합니다.

## 잘 놓치는 핵심

### 1. GRANT 기본

사용자에게 객체 접근 권한을 부여합니다.

시험에서는 명령어 이름만 외우지 말고 **대상·범위·제약조건·DBMS 차이**를 함께 봅니다.

### 2. 여러 권한

여러 권한을 함께 부여할 수 있는 DBMS가 많습니다.

시험에서는 명령어 이름만 외우지 말고 **대상·범위·제약조건·DBMS 차이**를 함께 봅니다.

### 3. REVOKE 기본

이미 부여한 권한을 회수합니다.

시험에서는 명령어 이름만 외우지 말고 **대상·범위·제약조건·DBMS 차이**를 함께 봅니다.

### 4. 대표 권한

대표적으로 다음 권한을 볼 수 있습니다.

시험에서는 명령어 이름만 외우지 말고 **대상·범위·제약조건·DBMS 차이**를 함께 봅니다.

### 5. 최소 권한 원칙

사용자에게 필요한 권한만 주는 것이 중요합니다.

시험에서는 명령어 이름만 외우지 말고 **대상·범위·제약조건·DBMS 차이**를 함께 봅니다.

### 6. WITH GRANT OPTION

일부 DBMS에서는 받은 권한을 다른 사용자에게 다시 부여할 수 있게 할 수 있습니다.

시험에서는 명령어 이름만 외우지 말고 **대상·범위·제약조건·DBMS 차이**를 함께 봅니다.

## 시험·면접

### 핵심 암기

```text
GRANT = 권한 부여 / REVOKE = 권한 회수
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

GRANT는 사용자나 역할에 권한을 부여하고 REVOKE는 이미 부여한 권한을 회수하는 DCL 명령어입니다.

실무에서는 실행 전 영향 범위와 제약조건, Transaction 가능 여부를 함께 확인하는 것이 중요합니다.

## 예시로 한 바퀴

다음 대표 문법을 다시 봅니다.

```sql
GRANT SELECT
ON EMPLOYEE
TO user1;
```

먼저 이 명령이 **Schema**, **Row**, **권한** 중 무엇을 바꾸는지 판단합니다.

그다음 변경 범위와 제약조건을 확인합니다.

마지막으로 현재 실습 환경인 SQLite에서 같은 문법을 그대로 사용할 수 있는지 확인합니다.

## 객관식 문제

### 1. GRANT는?

① 권한 부여  
② 항상 Index 삭제  
③ 항상 모든 Row 유지  
④ 항상 Schema 제거

<details>
<summary>정답</summary>

①

</details>

해설: `권한 부여`가 핵심입니다.

### 2. REVOKE는?

① 권한 회수  
② 항상 Index 삭제  
③ 항상 모든 Row 유지  
④ 항상 Schema 제거

<details>
<summary>정답</summary>

①

</details>

해설: `권한 회수`가 핵심입니다.

### 3. SQLite의 GRANT/REVOKE는?

① 일반적인 문법 미지원  
② 항상 Index 삭제  
③ 항상 모든 Row 유지  
④ 항상 Schema 제거

<details>
<summary>정답</summary>

①

</details>

해설: `일반적인 문법 미지원`가 핵심입니다.

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

**집계 함수 · GROUP BY**입니다.

데이터 정의·변경·권한 파트를 마치고 집계 함수와 GROUP BY로 이어갑니다.
