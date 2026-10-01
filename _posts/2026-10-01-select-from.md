---
title: SELECT · FROM
date: 2026-10-01 11:10:00 +0900
slug: select-from
permalink: /posts/select-from/
categories: [CS, 데이터베이스]
tags: [SELECT, FROM, SQL, 조회, Column, Table, Alias, 정보처리기사, NCS]
math: true
---

`SELECT`와 `FROM`은 **SQL 조회문의 가장 기본적인 구조**입니다.

`SELECT`는 어떤 Column을 볼지 정하고, `FROM`은 어느 Table에서 가져올지 정합니다.

<blockquote class="prompt-info">
<p>한 줄: SELECT는 Column 선택, FROM은 Table 선택입니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

SELECT = 무엇을 볼지, FROM = 어디에서 가져올지 지정합니다.

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

이 글에서는 `EMPLOYEE`와 `DEPARTMENT`를 중심으로 봅니다.

## 가장 먼저 기본 구조

가장 기본적인 SELECT 문은 다음 형태입니다.

```sql
SELECT Column
FROM Table;
```

예를 들어 직원 이름을 조회합니다.

```sql
SELECT EMP_NAME
FROM EMPLOYEE;
```

구조를 그대로 읽으면 됩니다.

```text
SELECT EMP_NAME
→ EMP_NAME Column을 본다.

FROM EMPLOYEE
→ EMPLOYEE Table에서 가져온다.
```

<mark>SELECT는 Column, FROM은 Table과 연결해서 기억하면 됩니다.</mark>


## SELECT

SELECT는 **조회할 Column이나 표현식**을 지정합니다.

```sql
SELECT EMP_NAME
FROM EMPLOYEE;
```

여기서는

```text
EMP_NAME
```

하나만 선택합니다.

즉 SELECT는 결과 화면에 어떤 정보를 보여줄지 결정합니다.

## FROM

FROM은 데이터를 가져올 Table을 지정합니다.

```sql
SELECT EMP_NAME
FROM EMPLOYEE;
```

여기서

```text
EMPLOYEE
```

가 대상 Table입니다.

즉 FROM은 조회의 출발점이 되는 데이터 집합을 정합니다.

## 여러 Column 선택

Column은 하나만 선택할 필요가 없습니다.

쉼표로 여러 개를 나열할 수 있습니다.

```sql
SELECT EMP_ID, EMP_NAME, SALARY
FROM EMPLOYEE;
```

결과는 다음과 같은 형태입니다.

| EMP_ID | EMP_NAME | SALARY |
| ---: | --- | ---: |
| 1001 | 직원1 | 2890 |
| 1002 | 직원2 | 2980 |
| 1003 | 직원3 | 3070 |

<mark>여러 Column을 선택할 때는 SELECT 뒤에 쉼표로 나열합니다.</mark>

## 모든 Column 조회

모든 Column을 조회할 때는 `*`를 사용할 수 있습니다.

```sql
SELECT *
FROM EMPLOYEE;
```

`*`는 현재 Table의 모든 Column을 의미합니다.

```text
*
→ 모든 Column
```

빠르게 전체 구조를 확인할 때 유용합니다.

## SELECT *의 주의점

`SELECT *`는 편하지만 필요하지 않은 Column까지 가져올 수 있습니다.

```sql
SELECT EMP_NAME, SALARY
FROM EMPLOYEE;
```

처럼 필요한 Column만 지정하면 결과가 더 명확합니다.

<blockquote class="prompt-warning">
<p>전체 확인이 아니라면 필요한 Column만 명시하는 습관이 좋습니다.</p>
</blockquote>

## Column 순서는 SELECT가 결정한다

결과 Column의 순서는 SELECT에 적은 순서를 따릅니다.

```sql
SELECT EMP_NAME, EMP_ID
FROM EMPLOYEE;
```

Table의 원래 Column 순서와 같을 필요는 없습니다.

## Alias · 별칭

조회 결과의 Column 이름에 별칭을 줄 수 있습니다.

대표적으로 `AS`를 사용합니다.

```sql
SELECT EMP_NAME AS NAME
FROM EMPLOYEE;
```

개념적으로 다음과 같습니다.

```text
EMP_NAME
→ 실제 Column 이름

NAME
→ 조회 결과에서 사용할 별칭
```

원본 Table의 Column 이름 자체가 바뀌는 것은 아닙니다.


## Table Alias

Table에도 별칭을 줄 수 있습니다.

```sql
SELECT E.EMP_NAME, E.SALARY
FROM EMPLOYEE E;
```

`E`는 EMPLOYEE의 별칭이며 JOIN에서 특히 자주 사용합니다.


## 작성 순서와 처리 관점

SQL은 다음처럼 작성합니다.

```text
SELECT
FROM
```

하지만 논리적으로 생각할 때는 먼저 대상 Table을 정해야 결과 Column을 가져올 수 있습니다.

```text
FROM
→ 데이터를 가져올 Table 결정

SELECT
→ 결과에 보여줄 Column 결정
```

따라서 시험이나 SQL 실행 순서를 공부할 때는 작성 순서와 논리적 처리 순서를 구분해야 합니다.

<blockquote class="prompt-info">
<p>작성은 SELECT → FROM이지만, 논리적으로는 FROM에서 대상을 정한 뒤 SELECT 결과를 만든다고 이해하면 쉽습니다.</p>
</blockquote>

## SELECT와 FROM을 Table · Column과 연결

| SQL | 데이터베이스 개념 | 역할 |
| --- | --- | --- |
| SELECT | Column | 무엇을 볼지 선택 |
| FROM | Table | 어디에서 가져올지 선택 |

한 줄로 정리하면 다음과 같습니다.

```text
SELECT → Column
FROM → Table
```



## SELECT와 FROM의 한계

SELECT와 FROM만 사용하면 아직 원하는 Row를 세밀하게 골라내지는 못합니다.

예를 들어

```text
개발 부서 직원만
급여 3000 이상만
특정 직원만
```

같은 조건을 넣으려면 `WHERE`가 필요합니다.

그래서 다음 단계가 WHERE입니다.

## 잘 놓치는 핵심

### 1. SELECT는 Column 선택이다

```text
SELECT EMP_NAME
```

결과에 보여줄 Column을 정합니다.

### 2. FROM은 Table 선택이다

```text
FROM EMPLOYEE
```

데이터를 가져올 Table을 정합니다.

### 3. *는 모든 Column이다

```sql
SELECT *
FROM EMPLOYEE;
```

모든 Column을 조회합니다.

### 4. Alias는 원본 이름을 바꾸지 않는다

```sql
SELECT EMP_NAME AS NAME
FROM EMPLOYEE;
```

조회 결과에서만 이름을 다르게 보여줍니다.

### 5. 작성 순서와 논리적 처리 관점을 구분한다

```text
작성
→ SELECT → FROM

논리적 이해
→ FROM → SELECT
```

## 시험·면접

### 핵심 암기

```text
SELECT
→ Column

FROM
→ Table
```

### 기본 문법

```sql
SELECT Column
FROM Table;
```

### 모든 Column

```sql
SELECT *
FROM Table;
```

### 여러 Column

```sql
SELECT A, B, C
FROM Table;
```

### 시험 함정

다음 문장은 틀렸습니다.

```text
FROM은 조회할 Column을 선택한다.
```

FROM은 Table을 지정합니다.

Column은 SELECT에서 선택합니다.

### 면접에서 짧게 답한다면

SELECT는 조회 결과에 포함할 Column이나 표현식을 지정하고, FROM은 데이터를 가져올 Table을 지정합니다.

가장 기본적인 조회문은 `SELECT Column FROM Table` 형태이며, 여러 Column을 쉼표로 선택하거나 `*`로 전체 Column을 조회할 수 있습니다.

## 예시로 한 바퀴

모든 직원 정보를 조회합니다.

```sql
SELECT *
FROM EMPLOYEE;
```

직원 이름만 조회합니다.

```sql
SELECT EMP_NAME
FROM EMPLOYEE;
```

직원 번호와 이름을 조회합니다.

```sql
SELECT EMP_ID, EMP_NAME
FROM EMPLOYEE;
```

결과 이름을 바꿔서 보여줍니다.

```sql
SELECT EMP_NAME AS NAME
FROM EMPLOYEE;
```

핵심은 다음과 같습니다.

```text
SELECT
→ 결과에 무엇을 보여줄지

FROM
→ 데이터를 어디에서 가져올지
```

## 객관식 문제

### 1. SELECT의 역할은?

① Table 삭제  
② 조회할 Column 지정  
③ 권한 회수  
④ Transaction 취소

<details>
<summary>정답</summary>

②

</details>

### 2. FROM의 역할은?

① 조회 대상 Table 지정  
② Column 삭제  
③ 권한 부여  
④ Row 수정

<details>
<summary>정답</summary>

①

</details>

### 3. 모든 Column을 조회하는 표현은?

① %  
② #  
③ *  
④ &

<details>
<summary>정답</summary>

③

</details>

### 4. EMP_NAME과 SALARY를 조회하는 SQL로 옳은 것은?

① SELECT EMP_NAME, SALARY FROM EMPLOYEE;  
② FROM EMP_NAME SELECT SALARY;  
③ SELECT EMPLOYEE FROM EMP_NAME;  
④ UPDATE EMP_NAME, SALARY;

<details>
<summary>정답</summary>

①

</details>

### 5. `AS`의 대표적인 역할은?

① Row 삭제  
② 별칭 지정  
③ Table 삭제  
④ Transaction 확정

<details>
<summary>정답</summary>

②

</details>

### 6. 다음 중 올바른 설명은?

① SELECT는 Table을 삭제한다.  
② FROM은 Column의 별칭을 만든다.  
③ SELECT *는 모든 Column을 조회한다.  
④ FROM은 Transaction을 확정한다.

<details>
<summary>정답</summary>

③

</details>

## 다음에 이을 글

**WHERE**입니다.  
Table에서 원하는 조건을 만족하는 Row만 선택하는 방법을 알아봅니다.
