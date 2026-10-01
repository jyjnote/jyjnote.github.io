---
title: DROP · TRUNCATE
date: 2026-09-18 22:45:00 +0900
slug: drop-truncate
permalink: /posts/drop-truncate/
categories: [CS, 데이터베이스]
tags: [DROP, TRUNCATE, DDL, SQL, TABLE, DELETE, SQLite, 정보처리기사, NCS]
math: true
---

DROP은 데이터베이스 객체 자체를 제거하고, TRUNCATE는 일반적으로 Table 구조는 남긴 채 모든 Row를 빠르게 제거하는 DDL 명령입니다.

SQL 명령은 비슷해 보여도 **구조를 바꾸는지, 데이터를 바꾸는지, 권한을 바꾸는지**를 구분하면 이해하기 쉽습니다.

<blockquote class="prompt-info">
<p>한 줄: DROP은 구조까지 제거하고 TRUNCATE는 구조를 남긴 채 전체 데이터를 비웁니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

DROP = 객체 제거 / TRUNCATE = 전체 Row 제거

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
DROP TABLE TEST;
```

<mark>DROP은 구조까지 제거하고 TRUNCATE는 구조를 남긴 채 전체 데이터를 비웁니다.</mark>

## DROP TABLE

Table 자체를 제거합니다.

```sql
DROP TABLE TEST;
```

Table의 Schema와 데이터가 함께 사라집니다.

관련 객체와 참조 관계에도 영향을 줄 수 있습니다.

## IF EXISTS

객체가 없을 때 오류를 피하기 위해 다음 형태를 많이 사용합니다.

```sql
DROP TABLE IF EXISTS TEST;
```

SQLite에서도 사용할 수 있습니다.

## DROP VIEW

View를 제거할 수 있습니다.

```sql
DROP VIEW IF EXISTS HIGH_SALARY_EMP;
```

View 정의가 제거되며 원본 Table 데이터는 그대로 남습니다.

## DROP INDEX

Index를 제거합니다.

```sql
DROP INDEX IF EXISTS IDX_EMP_DEPT;
```

Index 삭제는 Table Row 자체를 삭제하지 않습니다.

## TRUNCATE 기본 개념

표준적인 관계형 DBMS에서 TRUNCATE는 Table의 모든 Row를 제거할 때 사용합니다.

```sql
TRUNCATE TABLE EMPLOYEE;
```

구조는 남고 데이터만 비워진다는 점이 DROP과 다릅니다.

## SQLite에는 TRUNCATE가 없다

SQLite는 `TRUNCATE TABLE` 문법을 지원하지 않습니다.

전체 Row를 지우려면 다음처럼 사용합니다.

```sql
DELETE FROM EMPLOYEE;
```

따라서 현재 실습 환경에서는 TRUNCATE 예제를 그대로 실행하면 안 됩니다.

<blockquote class="prompt-warning">
<p>SQLite에서는 TRUNCATE TABLE을 사용할 수 없으며 전체 삭제는 DELETE FROM Table 형태로 처리합니다.</p>
</blockquote>

## DROP과 DELETE

DROP은 Table 자체를 제거합니다.

DELETE는 Row를 제거합니다.

```text
DROP
→ 구조 + 데이터 제거

DELETE
→ Row 제거
→ Table 구조 유지
```

## TRUNCATE와 DELETE

일반적인 DBMS 기준으로 차이를 보면 다음과 같습니다.

| 구분 | TRUNCATE | DELETE |
| --- | --- | --- |
| 범위 | 전체 Row | 조건에 따라 일부 또는 전체 |
| WHERE | 사용하지 않음 | 사용 가능 |
| 구조 | 유지 | 유지 |
| SQLite | 미지원 | 지원 |

세부 Transaction, Trigger, Identity 동작은 DBMS마다 차이가 있습니다.

## TRUNCATE의 DBMS 차이

TRUNCATE는 DBMS마다 Transaction 처리, Trigger 실행 여부, 자동 증가 값 초기화 방식 등이 다를 수 있습니다.

따라서 다음처럼 단정하면 안 됩니다.

```text
TRUNCATE는 모든 DBMS에서 무조건 Rollback 불가
```

정확한 동작은 사용하는 DBMS 문서를 확인해야 합니다.

## DROP의 참조 관계

다른 Table이 Foreign Key로 참조하고 있으면 DROP이 제한되거나 관련 처리가 필요할 수 있습니다.

```text
부모 Table DROP
→ 자식 참조 관계 확인
```

Schema 의존성을 먼저 확인하는 습관이 중요합니다.

## 시험 비교

시험에서는 세 명령을 다음처럼 빠르게 구분합니다.

```text
DROP
→ 객체 자체 제거

TRUNCATE
→ 전체 Row 제거, 구조 유지

DELETE
→ 조건에 맞는 Row 제거
```

## 다른 개념과 비교

### 비교 1. DROP

```text
DROP
→ 구조+데이터 제거
```

`DROP · TRUNCATE`과 비교할 때는 **Schema를 바꾸는지**, **Row를 바꾸는지**, **권한을 바꾸는지**를 먼저 확인합니다.

### 비교 2. TRUNCATE

```text
TRUNCATE
→ 전체 Row 제거, 구조 유지
```

`DROP · TRUNCATE`과 비교할 때는 **Schema를 바꾸는지**, **Row를 바꾸는지**, **권한을 바꾸는지**를 먼저 확인합니다.

### 비교 3. DELETE

```text
DELETE
→ 조건 Row 제거
```

`DROP · TRUNCATE`과 비교할 때는 **Schema를 바꾸는지**, **Row를 바꾸는지**, **권한을 바꾸는지**를 먼저 확인합니다.

### 비교 4. SQLite

```text
SQLite
→ TRUNCATE 미지원
```

`DROP · TRUNCATE`과 비교할 때는 **Schema를 바꾸는지**, **Row를 바꾸는지**, **권한을 바꾸는지**를 먼저 확인합니다.

## 실전 SQL 패턴

### 실전 패턴 1. Table 삭제

```sql
DROP TABLE IF EXISTS TEMP_TABLE;
```

이 예시는 `DROP · TRUNCATE`에서 자주 보는 형태입니다.

문법을 외우기보다 **어떤 객체 또는 Row가 바뀌는지** 먼저 확인합니다.

```text
대상
→ 변경 내용
→ 제약조건 영향
→ 실행 후 결과
```

### 실전 패턴 2. View 삭제

```sql
DROP VIEW IF EXISTS VIP_ONLY;
```

이 예시는 `DROP · TRUNCATE`에서 자주 보는 형태입니다.

문법을 외우기보다 **어떤 객체 또는 Row가 바뀌는지** 먼저 확인합니다.

```text
대상
→ 변경 내용
→ 제약조건 영향
→ 실행 후 결과
```

### 실전 패턴 3. Index 삭제

```sql
DROP INDEX IF EXISTS IDX_PRODUCT_CATEGORY;
```

이 예시는 `DROP · TRUNCATE`에서 자주 보는 형태입니다.

문법을 외우기보다 **어떤 객체 또는 Row가 바뀌는지** 먼저 확인합니다.

```text
대상
→ 변경 내용
→ 제약조건 영향
→ 실행 후 결과
```

### 실전 패턴 4. SQLite 전체 Row 삭제

```sql
DELETE FROM EMPLOYEE;
```

이 예시는 `DROP · TRUNCATE`에서 자주 보는 형태입니다.

문법을 외우기보다 **어떤 객체 또는 Row가 바뀌는지** 먼저 확인합니다.

```text
대상
→ 변경 내용
→ 제약조건 영향
→ 실행 후 결과
```

### 실전 패턴 5. 표준 TRUNCATE 예시

```sql
TRUNCATE TABLE EMPLOYEE;
```

이 예시는 `DROP · TRUNCATE`에서 자주 보는 형태입니다.

문법을 외우기보다 **어떤 객체 또는 Row가 바뀌는지** 먼저 확인합니다.

```text
대상
→ 변경 내용
→ 제약조건 영향
→ 실행 후 결과
```

### 실전 패턴 6. 삭제 전 확인

```sql
SELECT COUNT(*) FROM EMPLOYEE;
```

이 예시는 `DROP · TRUNCATE`에서 자주 보는 형태입니다.

문법을 외우기보다 **어떤 객체 또는 Row가 바뀌는지** 먼저 확인합니다.

```text
대상
→ 변경 내용
→ 제약조건 영향
→ 실행 후 결과
```

## 자주 하는 실수

### 실수 1. 실행 대상 Table을 확인하지 않는다.

`DROP · TRUNCATE`를 실행하기 전에는 다음을 확인합니다.

```text
1. 대상 객체
2. 변경 범위
3. Constraint
4. 참조 관계
5. DBMS 지원 여부
```

운영 환경에서는 특히 데이터 손실 가능성이 있는 명령을 바로 실행하지 않는 습관이 중요합니다.

### 실수 2. WHERE가 필요한 명령에서 조건을 빠뜨린다.

`DROP · TRUNCATE`를 실행하기 전에는 다음을 확인합니다.

```text
1. 대상 객체
2. 변경 범위
3. Constraint
4. 참조 관계
5. DBMS 지원 여부
```

운영 환경에서는 특히 데이터 손실 가능성이 있는 명령을 바로 실행하지 않는 습관이 중요합니다.

### 실수 3. Constraint 영향을 확인하지 않는다.

`DROP · TRUNCATE`를 실행하기 전에는 다음을 확인합니다.

```text
1. 대상 객체
2. 변경 범위
3. Constraint
4. 참조 관계
5. DBMS 지원 여부
```

운영 환경에서는 특히 데이터 손실 가능성이 있는 명령을 바로 실행하지 않는 습관이 중요합니다.

### 실수 4. SQLite와 다른 DBMS의 문법 차이를 무시한다.

`DROP · TRUNCATE`를 실행하기 전에는 다음을 확인합니다.

```text
1. 대상 객체
2. 변경 범위
3. Constraint
4. 참조 관계
5. DBMS 지원 여부
```

운영 환경에서는 특히 데이터 손실 가능성이 있는 명령을 바로 실행하지 않는 습관이 중요합니다.

### 실수 5. 실행 전 SELECT나 Schema 확인을 하지 않는다.

`DROP · TRUNCATE`를 실행하기 전에는 다음을 확인합니다.

```text
1. 대상 객체
2. 변경 범위
3. Constraint
4. 참조 관계
5. DBMS 지원 여부
```

운영 환경에서는 특히 데이터 손실 가능성이 있는 명령을 바로 실행하지 않는 습관이 중요합니다.

### 실수 6. DDL과 DML을 같은 종류로 생각한다.

`DROP · TRUNCATE`를 실행하기 전에는 다음을 확인합니다.

```text
1. 대상 객체
2. 변경 범위
3. Constraint
4. 참조 관계
5. DBMS 지원 여부
```

운영 환경에서는 특히 데이터 손실 가능성이 있는 명령을 바로 실행하지 않는 습관이 중요합니다.

## 잘 놓치는 핵심

### 1. DROP TABLE

Table 자체를 제거합니다.

시험에서는 명령어 이름만 외우지 말고 **대상·범위·제약조건·DBMS 차이**를 함께 봅니다.

### 2. IF EXISTS

객체가 없을 때 오류를 피하기 위해 다음 형태를 많이 사용합니다.

시험에서는 명령어 이름만 외우지 말고 **대상·범위·제약조건·DBMS 차이**를 함께 봅니다.

### 3. DROP VIEW

View를 제거할 수 있습니다.

시험에서는 명령어 이름만 외우지 말고 **대상·범위·제약조건·DBMS 차이**를 함께 봅니다.

### 4. DROP INDEX

Index를 제거합니다.

시험에서는 명령어 이름만 외우지 말고 **대상·범위·제약조건·DBMS 차이**를 함께 봅니다.

### 5. TRUNCATE 기본 개념

표준적인 관계형 DBMS에서 TRUNCATE는 Table의 모든 Row를 제거할 때 사용합니다.

시험에서는 명령어 이름만 외우지 말고 **대상·범위·제약조건·DBMS 차이**를 함께 봅니다.

### 6. SQLite에는 TRUNCATE가 없다

SQLite는 `TRUNCATE TABLE` 문법을 지원하지 않습니다.

시험에서는 명령어 이름만 외우지 말고 **대상·범위·제약조건·DBMS 차이**를 함께 봅니다.

## 시험·면접

### 핵심 암기

```text
DROP = 객체 제거 / TRUNCATE = 전체 Row 제거
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

DROP은 데이터베이스 객체 자체를 제거하고, TRUNCATE는 일반적으로 Table 구조는 남긴 채 모든 Row를 빠르게 제거하는 DDL 명령입니다.

실무에서는 실행 전 영향 범위와 제약조건, Transaction 가능 여부를 함께 확인하는 것이 중요합니다.

## 예시로 한 바퀴

다음 대표 문법을 다시 봅니다.

```sql
DROP TABLE TEST;
```

먼저 이 명령이 **Schema**, **Row**, **권한** 중 무엇을 바꾸는지 판단합니다.

그다음 변경 범위와 제약조건을 확인합니다.

마지막으로 현재 실습 환경인 SQLite에서 같은 문법을 그대로 사용할 수 있는지 확인합니다.

## 객관식 문제

### 1. DROP TABLE은?

① Table 자체 제거  
② 항상 Index 삭제  
③ 항상 모든 Row 유지  
④ 항상 Schema 제거

<details>
<summary>정답</summary>

①

</details>

해설: `Table 자체 제거`가 핵심입니다.

### 2. TRUNCATE는 일반적으로?

① 전체 Row 제거, 구조 유지  
② 항상 Index 삭제  
③ 항상 모든 Row 유지  
④ 항상 Schema 제거

<details>
<summary>정답</summary>

①

</details>

해설: `전체 Row 제거, 구조 유지`가 핵심입니다.

### 3. SQLite에서 TRUNCATE는?

① 지원하지 않음  
② 항상 Index 삭제  
③ 항상 모든 Row 유지  
④ 항상 Schema 제거

<details>
<summary>정답</summary>

①

</details>

해설: `지원하지 않음`가 핵심입니다.

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

**INSERT**입니다.

새로운 Row를 Table에 추가하는 INSERT를 알아봅니다.
