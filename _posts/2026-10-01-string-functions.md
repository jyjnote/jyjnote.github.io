---
title: 문자열 함수
date: 2026-10-01 12:20:00 +0900
slug: string-functions
permalink: /posts/string-functions/
categories: [CS, 데이터베이스]
tags: [문자열함수, SQL, LENGTH, UPPER, LOWER, SUBSTR, TRIM, REPLACE, 정보처리기사, NCS]
math: true
---

문자열 함수는 **문자열의 길이를 구하거나, 일부를 자르거나, 대소문자를 바꾸고, 공백이나 특정 문자열을 처리하는 함수**입니다.

문자형 Column을 가공해서 원하는 형태로 조회할 때 사용합니다.

<blockquote class="prompt-info">
<p>한 줄: 문자열 함수는 TEXT 값을 원하는 형태로 가공합니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

문자열 함수 = 문자열 길이·변환·추출·치환입니다.

</details>

## 실습 데이터 전체 보기

<div style="width:100%; overflow:hidden; border:1px solid var(--main-border-color,#ddd); border-radius:12px; margin:1rem 0;">
<iframe
  src="https://docs.google.com/spreadsheets/d/1mtu6pFcGyOfwpFizaJskfFD87GxyjAmB/preview"
  width="100%"
  height="500"
  style="border:0;"
  loading="lazy">
</iframe>
</div>

이 글에서는 `EMPLOYEE.EMP_NAME`, `DEPARTMENT.DEPT_NAME`, `CUSTOMER.NAME`을 중심으로 봅니다.

## 가장 먼저 핵심

대표적인 문자열 함수는 다음과 같습니다.

| 함수 | 역할 |
| --- | --- |
| LENGTH | 문자열 길이 |
| UPPER | 영문 대문자 변환 |
| LOWER | 영문 소문자 변환 |
| SUBSTR | 문자열 일부 추출 |
| TRIM | 양쪽 공백 제거 |
| REPLACE | 문자열 치환 |

<mark>문자열 함수는 원본 값을 바꾸는 것이 아니라 SELECT 결과에서 가공된 값을 만들 수 있습니다.</mark>

## LENGTH

문자열 길이를 구합니다.

```sql
SELECT EMP_NAME, LENGTH(EMP_NAME)
FROM EMPLOYEE;
```

개념적으로 다음과 같습니다.

```text
'직원1'
→ 문자열 길이 계산
```

## UPPER · LOWER

영문 문자열의 대소문자를 바꿉니다.

```sql
SELECT UPPER('sql');
```

```text
SQL
```

```sql
SELECT LOWER('SQL');
```

```text
sql
```

한글처럼 대소문자 개념이 없는 문자열에는 의미가 제한적입니다.

## SUBSTR

문자열의 일부를 추출합니다.

SQLite에서는 다음 형태를 사용할 수 있습니다.

```sql
SELECT SUBSTR('DATABASE', 1, 4);
```

결과는 다음과 같습니다.

```text
DATA
```

기본 형태는 다음과 같습니다.

```text
SUBSTR(문자열, 시작위치, 길이)
```

SQLite의 문자열 위치는 기본적으로 1부터 생각합니다.

## TRIM

문자열 양쪽의 불필요한 공백을 제거합니다.

```sql
SELECT TRIM('  SQL  ');
```

결과는 다음과 같습니다.

```text
SQL
```

사용자 입력이나 외부 데이터의 앞뒤 공백을 정리할 때 유용합니다.

## REPLACE

문자열의 특정 부분을 다른 문자열로 바꿉니다.

```sql
SELECT REPLACE('SQL BASIC', 'BASIC', 'ADVANCED');
```

결과는 다음과 같습니다.

```text
SQL ADVANCED
```

기본 형태는 다음과 같습니다.

```text
REPLACE(원본문자열, 찾을문자열, 바꿀문자열)
```

## 문자열 연결

SQLite에서는 `||` 연산자로 문자열을 연결할 수 있습니다.

```sql
SELECT EMP_NAME || ' / 직원'
FROM EMPLOYEE;
```

개념적으로 다음과 같습니다.

```text
직원1
+
' / 직원'
→ 직원1 / 직원
```

문자열 연결 문법은 DBMS마다 차이가 있을 수 있습니다.

## Alias와 함께 사용

함수 결과에 별칭을 붙이면 읽기 쉽습니다.

```sql
SELECT
    EMP_NAME,
    LENGTH(EMP_NAME) AS NAME_LENGTH
FROM EMPLOYEE;
```

원본 Column은 그대로이고 결과 Column 이름만 `NAME_LENGTH`로 보입니다.

## WHERE와 문자열 함수

WHERE 조건에서도 함수를 사용할 수 있습니다.

```sql
SELECT EMP_NAME
FROM EMPLOYEE
WHERE LENGTH(EMP_NAME) >= 3;
```

문자열 길이를 계산한 뒤 조건을 검사합니다.

## 여러 함수 함께 사용

함수를 중첩해서 사용할 수도 있습니다.

```sql
SELECT UPPER(TRIM('  sql  '));
```

처리 흐름은 안쪽부터 생각합니다.

```text
TRIM
→ 공백 제거

UPPER
→ 대문자 변환
```

결과는 `SQL`입니다.

## DBMS별 차이

문자열 함수 이름과 세부 문법은 DBMS마다 조금씩 다를 수 있습니다.

예를 들어 문자열 추출 함수가 `SUBSTR`, `SUBSTRING` 등으로 다르게 제공될 수 있습니다.

<blockquote class="prompt-warning">
<p>문자열 함수의 목적은 비슷하지만 함수 이름과 인자 순서는 DBMS별로 확인해야 합니다.</p>
</blockquote>

## 잘 놓치는 핵심

### 1. 함수는 원본 값을 자동 변경하지 않는다

SELECT에서 가공된 결과를 보여주는 것입니다.

### 2. SUBSTR 위치 기준을 확인한다

SQLite에서는 일반적으로 시작 위치를 1부터 생각합니다.

### 3. TRIM은 기본적으로 양쪽 공백을 다룬다

문자열 정리에 자주 사용합니다.

### 4. 여러 함수는 중첩할 수 있다

안쪽 함수부터 처리한다고 생각하면 쉽습니다.

### 5. DBMS마다 함수명이 다를 수 있다

표준 개념과 실제 DBMS 문법을 구분합니다.

## 시험·면접

### 핵심 암기

```text
LENGTH → 길이
UPPER → 대문자
LOWER → 소문자
SUBSTR → 일부 추출
TRIM → 공백 제거
REPLACE → 치환
```

### 시험 함정

문자열 함수를 SELECT에서 사용했다고 원본 Table의 문자열이 수정되는 것은 아닙니다.

### 면접에서 짧게 답한다면

문자열 함수는 문자형 데이터를 조회할 때 길이 계산, 대소문자 변환, 부분 추출, 공백 제거, 문자열 치환 같은 가공을 수행하는 함수입니다.

DBMS마다 함수 이름과 세부 문법이 다를 수 있으므로 사용하는 DBMS 기준으로 확인해야 합니다.

## 객관식 문제

### 1. 문자열 길이를 구하는 함수는?

① LENGTH  
② ROUND  
③ SUM  
④ AVG

<details>
<summary>정답</summary>

①

</details>

### 2. 문자열 일부를 추출하는 함수는?

① TRIM  
② SUBSTR  
③ COUNT  
④ ABS

<details>
<summary>정답</summary>

②

</details>

### 3. 앞뒤 공백 제거와 관련된 함수는?

① REPLACE  
② UPPER  
③ TRIM  
④ MIN

<details>
<summary>정답</summary>

③

</details>

### 4. 특정 문자열을 다른 문자열로 바꾸는 함수는?

① REPLACE  
② LENGTH  
③ MAX  
④ ROUND

<details>
<summary>정답</summary>

①

</details>

### 5. 문자열 함수에 대한 설명으로 옳은 것은?

① SELECT에서 사용하면 항상 원본 데이터가 수정된다.  
② DBMS마다 세부 함수명이 다를 수 있다.  
③ 숫자에만 사용할 수 있다.  
④ GROUP BY에서만 사용할 수 있다.

<details>
<summary>정답</summary>

②

</details>

## 다음에 이을 글

**숫자 함수**입니다.  
숫자의 절댓값, 반올림 등 자주 사용하는 숫자 처리 함수를 알아봅니다.
