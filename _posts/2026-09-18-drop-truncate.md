---
title: DROP · TRUNCATE
date: 2026-09-18 23:00:00 +0900
slug: drop-truncate
permalink: /posts/drop-truncate/
categories: [CS, 데이터베이스]
tags: [DROP, TRUNCATE, DDL, SQL, Table, Schema, 데이터삭제, 정보처리기사, NCS]
math: true
---

`DROP`과 `TRUNCATE`는 <mark>데이터베이스 객체나 Table의 전체 데이터를 제거할 때 사용하는 DDL 명령어</mark>입니다.

가장 큰 차이는 `DROP`은 Table 구조까지 제거하고, `TRUNCATE`는 Table 구조를 남긴다는 점입니다.

<blockquote class="prompt-info">
<p>한 줄: DROP은 Table 자체를 삭제하고, TRUNCATE는 Table은 남긴 채 모든 Row를 제거합니다.</p>
</blockquote>

<details markdown="1">
<summary>한 줄로</summary>

`DROP`은 구조까지 삭제하고, `TRUNCATE`는 구조는 유지한 채 전체 데이터를 비웁니다.

</details>

## DROP

`DROP`은 데이터베이스 객체 자체를 삭제합니다.

### 입력 상태

#### DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |

```sql
DROP TABLE DEPARTMENT;
```

### 결과 상태

| 객체 | 상태 |
| --- | --- |
| DEPARTMENT | 삭제됨 |

Table 안의 Row뿐 아니라 Table의 구조 자체도 사라집니다.

```text
DROP TABLE
→ Row 삭제
→ Table 구조 삭제
→ Table 자체 제거
```

## TRUNCATE

`TRUNCATE`는 Table의 모든 Row를 제거하지만 Table 구조는 유지합니다.

### 입력 Table · EMPLOYEE

| EMP_ID | EMP_NAME |
| --- | --- |
| 1001 | 직원1 |
| 1002 | 직원2 |

```sql
TRUNCATE TABLE EMPLOYEE;
```

### 결과 Table

| EMP_ID | EMP_NAME |
| --- | --- |
| 데이터 없음 | 데이터 없음 |

Column 구조는 그대로 남아 있고 Row만 모두 제거됩니다.

```text
TRUNCATE
→ 전체 Row 제거
→ Table 구조 유지
```

## DROP과 TRUNCATE 비교

| 구분 | DROP | TRUNCATE |
| --- | --- | --- |
| Table 구조 | 삭제 | 유지 |
| 전체 Row | 삭제 | 삭제 |
| 실행 후 Table | 존재하지 않음 | 빈 Table로 존재 |
| 대표 목적 | 객체 자체 제거 | 전체 데이터 초기화 |

### DROP

```sql
DROP TABLE EMPLOYEE;
```

```text
EMPLOYEE 자체가 사라짐
```

### TRUNCATE

```sql
TRUNCATE TABLE EMPLOYEE;
```

```text
EMPLOYEE는 남음
Row만 0개
```

## DELETE와 차이

`DELETE`도 Row를 삭제하지만 목적과 동작이 다릅니다.

### 특정 Row 삭제

### 입력 Table · EMPLOYEE

| EMP_ID | EMP_NAME | DEPT_ID |
| --- | --- | --- |
| 1001 | 직원1 | 10 |
| 1002 | 직원2 | 20 |
| 1003 | 직원3 | 10 |

```sql
DELETE FROM EMPLOYEE
WHERE DEPT_ID = 10;
```

### 결과 Table

| EMP_ID | EMP_NAME | DEPT_ID |
| --- | --- | --- |
| 1002 | 직원2 | 20 |

`DELETE`는 `WHERE` 조건을 이용해 일부 Row만 삭제할 수 있습니다.

반면 `TRUNCATE`는 Table 전체 Row를 한꺼번에 제거하는 용도로 사용합니다.

| 명령 | 구조 삭제 | 일부 Row 삭제 | 전체 Row 삭제 |
| --- | --- | --- | --- |
| DROP | O | X | O |
| TRUNCATE | X | X | O |
| DELETE | X | O | O |

## WHERE 사용 여부

`TRUNCATE`에는 일반적으로 `WHERE` 조건을 붙이지 않습니다.

```sql
TRUNCATE TABLE EMPLOYEE;
```

Table 전체 Row가 제거됩니다.

특정 Row만 삭제하려면 `DELETE`를 사용합니다.

```sql
DELETE FROM EMPLOYEE
WHERE DEPT_ID = 10;
```

## SQLite에서는 TRUNCATE를 지원하지 않는다

현재 실습 데이터베이스처럼 SQLite를 사용하는 경우 `TRUNCATE TABLE` 문법을 직접 지원하지 않습니다.

전체 Row를 지우려면 다음처럼 사용합니다.

```sql
DELETE FROM EMPLOYEE;
```

Table 구조는 남고 Row만 모두 삭제됩니다.

<blockquote class="prompt-warning">
<p>TRUNCATE 지원 여부와 세부 동작은 사용하는 데이터베이스 시스템에 따라 다를 수 있습니다.</p>
</blockquote>

## 잘 놓치는 핵심

### 1. DROP은 구조까지 삭제한다

```text
DROP TABLE
→ Table 자체 제거
```

### 2. TRUNCATE는 구조를 유지한다

```text
TRUNCATE TABLE
→ 모든 Row 제거
→ Table은 유지
```

### 3. 특정 Row 삭제는 DELETE

```text
조건부 삭제
→ DELETE + WHERE
```

### 4. TRUNCATE에는 WHERE를 사용하지 않는다

일부 Row만 선택해서 제거하는 용도가 아닙니다.

## 시험·면접

### 핵심 암기

```text
DROP
→ 객체 자체 삭제
→ 구조 삭제
```

```text
TRUNCATE
→ 전체 Row 삭제
→ 구조 유지
```

```text
DELETE
→ Row 삭제
→ WHERE 사용 가능
```

### 시험 함정

`TRUNCATE TABLE`을 실행했다고 Table 자체가 삭제되는 것은 아닙니다.

Table 구조까지 제거하는 것은 `DROP TABLE`입니다.

또한 특정 Row만 삭제하려면 `TRUNCATE`가 아니라 `DELETE`를 사용해야 합니다.

### 면접 짧은 답변

`DROP`은 Table 같은 데이터베이스 객체 자체를 삭제하므로 구조와 데이터가 모두 제거됩니다. `TRUNCATE`는 Table 구조는 유지하면서 전체 Row를 제거합니다. 특정 조건의 Row만 삭제하려면 `DELETE`를 사용합니다.

## 객관식 문제

### 문제 1 · DROP

다음 SQL의 결과로 옳은 것은?

```sql
DROP TABLE EMPLOYEE;
```

① EMPLOYEE의 Row만 삭제된다.  
② EMPLOYEE의 구조와 데이터가 모두 삭제된다.  
③ EMPLOYEE의 Column 하나만 삭제된다.  
④ EMPLOYEE의 이름만 변경된다.

<details markdown="1">
<summary>정답</summary>

②

`DROP TABLE`은 Table 자체를 제거하므로 구조와 데이터가 모두 삭제됩니다.

</details>

### 문제 2 · TRUNCATE

다음 중 `TRUNCATE TABLE`에 대한 설명으로 옳은 것은?

① Table 구조까지 삭제한다.  
② 특정 조건의 Row만 삭제한다.  
③ 모든 Row를 제거하고 Table 구조는 유지한다.  
④ 새로운 Table을 만든다.

<details markdown="1">
<summary>정답</summary>

③

`TRUNCATE`는 Table의 전체 Row를 제거하지만 구조는 유지합니다.

</details>

### 문제 3 · DELETE

특정 부서 직원만 삭제하려고 할 때 가장 적절한 명령은?

```text
DEPT_ID = 10인 Row만 삭제
```

① DROP  
② TRUNCATE  
③ DELETE  
④ CREATE

<details markdown="1">
<summary>정답</summary>

③

특정 조건의 Row를 삭제할 때는 `DELETE`와 `WHERE`를 사용합니다.

```sql
DELETE FROM EMPLOYEE
WHERE DEPT_ID = 10;
```

</details>

### 문제 4 · 비교

다음 중 Table 구조가 남는 명령은?

① `DROP TABLE`만  
② `TRUNCATE TABLE`만  
③ DROP과 TRUNCATE 모두 구조 삭제  
④ CREATE만

<details markdown="1">
<summary>정답</summary>

②

`TRUNCATE`는 모든 Row를 제거하지만 Table 구조는 유지합니다.

</details>

### 문제 5 · SQLite

SQLite에서 Table의 모든 Row를 제거하고 구조를 유지하려고 할 때 사용할 수 있는 문장은?

① `TRUNCATE TABLE EMPLOYEE;`만 가능  
② `DELETE FROM EMPLOYEE;`  
③ `DROP TABLE EMPLOYEE;`  
④ `CREATE TABLE EMPLOYEE;`

<details markdown="1">
<summary>정답</summary>

②

SQLite는 `TRUNCATE TABLE`을 직접 지원하지 않으므로 전체 Row 삭제에는 다음과 같이 사용할 수 있습니다.

```sql
DELETE FROM EMPLOYEE;
```

</details>

## DROP · TRUNCATE 전체 요약

### DROP

```sql
DROP TABLE EMPLOYEE;
```

```text
데이터 삭제
+
구조 삭제
+
Table 자체 삭제
```

### TRUNCATE

```sql
TRUNCATE TABLE EMPLOYEE;
```

```text
전체 Row 삭제
+
Table 구조 유지
```

| 명령 | 핵심 |
| --- | --- |
| DROP | 구조까지 삭제 |
| TRUNCATE | 전체 Row 삭제, 구조 유지 |
| DELETE | Row 삭제, WHERE 사용 가능 |

<blockquote class="prompt-danger">
<p>DROP · TRUNCATE 문제에서는 Table 구조가 남는지 사라지는지를 먼저 확인합니다.</p>
</blockquote>

## 다음에 이을 글

**INSERT**입니다.

새로운 Row를 Table에 추가하는 방법과 Column 지정 방식의 차이를 살펴봅니다.
