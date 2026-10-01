---
title: DDL · DML · DCL · TCL
date: 2026-10-01 11:00:00 +0900
slug: ddl-dml-dcl-tcl
permalink: /posts/ddl-dml-dcl-tcl/
categories: [CS, 데이터베이스]
tags: [DDL, DML, DCL, TCL, SQL, CREATE, SELECT, GRANT, COMMIT, 정보처리기사, NCS]
math: true
---

SQL 명령은 역할에 따라 **DDL, DML, DCL, TCL**로 구분할 수 있습니다.

각 분류가 무엇을 대상으로 하는지 구분하면 SQL 전체 구조가 훨씬 쉽게 보입니다.

<blockquote class="prompt-info">
<p>한 줄: DDL은 구조, DML은 데이터, DCL은 권한, TCL은 Transaction을 다룹니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

DDL = 구조, DML = 데이터, DCL = 권한, TCL = Transaction 제어입니다.

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

## 가장 먼저 큰 그림

네 분류를 먼저 한 번에 봅시다.

| 구분 | 역할 | 대표 명령 |
| --- | --- | --- |
| DDL | 구조 정의 | CREATE, ALTER, DROP |
| DML | 데이터 조작 | SELECT, INSERT, UPDATE, DELETE |
| DCL | 권한 제어 | GRANT, REVOKE |
| TCL | Transaction 제어 | COMMIT, ROLLBACK |

핵심은 대상입니다.

```text
DDL
→ Schema

DML
→ Row 데이터

DCL
→ 사용자 권한

TCL
→ Transaction
```

## DDL

DDL은 Data Definition Language입니다.

Database의 구조를 정의하거나 변경합니다.

```text
CREATE → 구조 생성
ALTER → 구조 변경
DROP → 구조 삭제
```

예를 들어 Table을 만듭니다.

```sql
CREATE TABLE TEST(
    ID INTEGER PRIMARY KEY,
    NAME TEXT
);
```

Column을 추가할 수도 있습니다.

```sql
ALTER TABLE TEST
ADD COLUMN EMAIL TEXT;
```

Table 자체를 삭제하려면 DROP을 사용합니다.

```sql
DROP TABLE TEST;
```

<blockquote class="prompt-warning">
<p>DROP은 Row 몇 개가 아니라 Table 같은 객체 자체를 삭제합니다.</p>
</blockquote>

## DML

DML은 Data Manipulation Language입니다.

Table 안의 데이터를 조회하거나 변경합니다.

```text
SELECT → 조회
INSERT → 추가
UPDATE → 수정
DELETE → 삭제
```

조회 예시입니다.

```sql
SELECT EMP_NAME, SALARY
FROM EMPLOYEE
WHERE DEPT_ID = 10;
```

추가 예시입니다.

```sql
INSERT INTO EMPLOYEE(
    EMP_ID,
    EMP_NAME,
    DEPT_ID
)
VALUES (1051, '직원51', 10);
```

수정 예시입니다.

```sql
UPDATE EMPLOYEE
SET SALARY = 3500
WHERE EMP_ID = 1001;
```

삭제 예시입니다.

```sql
DELETE FROM EMPLOYEE
WHERE EMP_ID = 1051;
```

## DELETE와 DROP

둘은 시험에서 자주 비교됩니다.

| 구분 | DELETE | DROP |
| --- | --- | --- |
| 분류 | DML | DDL |
| 대상 | Row 데이터 | Table 같은 객체 |
| 구조 | 남음 | 삭제 |
| 대표 의미 | 데이터 삭제 | 구조 삭제 |

간단하게 외우면 다음과 같습니다.

```text
DELETE
→ 내용 삭제

DROP
→ 통째로 삭제
```

## DCL

DCL은 Data Control Language입니다.

사용자의 데이터베이스 권한을 제어합니다.

```text
GRANT → 권한 부여
REVOKE → 권한 회수
```

예시는 다음과 같습니다.

```sql
GRANT SELECT
ON EMPLOYEE
TO USER1;
```

```sql
REVOKE SELECT
ON EMPLOYEE
FROM USER1;
```

<mark>DCL은 데이터 값보다 누가 무엇을 할 수 있는지를 제어합니다.</mark>

실제 권한 문법은 DBMS에 따라 차이가 있을 수 있습니다.

## TCL

TCL은 Transaction Control Language입니다.

Transaction의 결과를 확정하거나 취소합니다.

```text
COMMIT → 작업 확정
ROLLBACK → 작업 취소
```

```sql
COMMIT;
```

```sql
ROLLBACK;
```

DML로 데이터를 변경한 뒤 COMMIT으로 확정하거나 ROLLBACK으로 취소하는 흐름을 생각하면 됩니다.

Transaction은 뒤에서 별도 주제로 자세히 다룹니다.


## 네 분류 비교

| 구분 | 무엇을 다루나 | 핵심 명령 |
| --- | --- | --- |
| DDL | Schema | CREATE, ALTER, DROP |
| DML | 데이터 | SELECT, INSERT, UPDATE, DELETE |
| DCL | 권한 | GRANT, REVOKE |
| TCL | Transaction | COMMIT, ROLLBACK |

가장 먼저 대상부터 기억하면 됩니다.

```text
DDL → 구조
DML → 데이터
DCL → 권한
TCL → Transaction
```


## 잘 놓치는 핵심

### 1. DDL은 구조를 다룬다

```text
CREATE
ALTER
DROP
```

Schema가 바뀝니다.

### 2. DML은 Row 데이터를 다룬다

```text
SELECT
INSERT
UPDATE
DELETE
```

Table 내부의 데이터를 조회하거나 변경합니다.

### 3. DELETE와 DROP은 다르다

```text
DELETE
→ Row 삭제

DROP
→ Table 객체 삭제
```

### 4. DCL은 권한이다

```text
GRANT
REVOKE
```

사용자가 할 수 있는 작업을 제어합니다.

### 5. SELECT 분류는 교재마다 다를 수 있다

SELECT를 DML에 포함하기도 하고 DQL로 따로 구분하기도 합니다.

### 6. TCL은 Transaction이다

```text
COMMIT
ROLLBACK
```

변경 내용을 확정하거나 취소합니다.

## 시험·면접

### 핵심 암기

```text
DDL → 구조
DML → 데이터
DCL → 권한
TCL → Transaction
```

### 대표 명령

```text
DDL
→ CREATE, ALTER, DROP

DML
→ SELECT, INSERT, UPDATE, DELETE

DCL
→ GRANT, REVOKE

TCL
→ COMMIT, ROLLBACK
```

### 시험 함정 1

```text
DELETE
```

는 DML입니다.

```text
DROP
```

은 DDL입니다.

둘 다 삭제와 관련되지만 삭제 대상이 다릅니다.

### 시험 함정 2

SELECT는 문제 기준에 따라 DML 또는 DQL로 분류될 수 있습니다.

### 면접에서 짧게 답한다면

DDL은 Database Schema를 정의·변경하는 명령이고, DML은 데이터를 조회·추가·수정·삭제하는 명령입니다.

DCL은 사용자 권한을 제어하고, TCL은 Transaction을 확정하거나 취소하는 데 사용합니다.

## 예시로 한 바퀴

Table을 만듭니다.

```sql
CREATE TABLE TEST(
    ID INTEGER PRIMARY KEY,
    NAME TEXT
);
```

```text
→ DDL
```

데이터를 추가합니다.

```sql
INSERT INTO TEST
VALUES (1, 'A');
```

```text
→ DML
```

작업을 확정합니다.

```sql
COMMIT;
```

```text
→ TCL
```

사용자에게 조회 권한을 줍니다.

```sql
GRANT SELECT
ON TEST
TO USER1;
```

```text
→ DCL
```

## 객관식 문제

### 1. CREATE가 속하는 분류는?

① DDL  
② DML  
③ DCL  
④ TCL

<details>
<summary>정답</summary>

①

</details>

### 2. UPDATE가 속하는 분류는?

① DDL  
② DML  
③ DCL  
④ TCL

<details>
<summary>정답</summary>

②

</details>

### 3. GRANT가 속하는 분류는?

① DDL  
② DML  
③ DCL  
④ TCL

<details>
<summary>정답</summary>

③

</details>

### 4. ROLLBACK이 속하는 분류는?

① DDL  
② DML  
③ DCL  
④ TCL

<details>
<summary>정답</summary>

④

</details>

### 5. DELETE와 DROP의 차이로 옳은 것은?

① DELETE는 구조를 삭제하고 DROP은 Row만 삭제한다.  
② DELETE는 DML이고 DROP은 DDL이다.  
③ 둘 다 TCL이다.  
④ 둘은 항상 같은 역할이다.

<details>
<summary>정답</summary>

②

</details>

### 6. 권한 회수에 사용하는 명령은?

① ALTER  
② UPDATE  
③ REVOKE  
④ COMMIT

<details>
<summary>정답</summary>

③

</details>

## 다음에 이을 글

**SELECT · FROM**입니다.  
SQL 조회문의 가장 기본 구조와 Column·Table 선택 방법을 알아봅니다.
