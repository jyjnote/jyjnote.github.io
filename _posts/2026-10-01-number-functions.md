---
title: 숫자 함수
date: 2026-10-01 12:25:00 +0900
slug: number-functions
permalink: /posts/number-functions/
categories: [CS, 데이터베이스]
tags: [숫자함수, SQL, ABS, ROUND, RANDOM, 산술연산, 정보처리기사, NCS]
math: true
---

숫자 함수는 **숫자 값을 계산하거나 원하는 형태로 변환하는 함수**입니다.

절댓값, 반올림 같은 처리를 SELECT 결과에서 바로 수행할 수 있습니다.

<blockquote class="prompt-info">
<p>한 줄: 숫자 함수는 숫자 값을 계산하고 가공합니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

숫자 함수 = 숫자 계산과 변환입니다.

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

이 글에서는 `EMPLOYEE.SALARY`, `EMPLOYEE.BONUS`, `PRODUCT.PRICE`를 중심으로 봅니다.

## 가장 먼저 핵심

SQLite에서 입문 단계에 자주 확인할 숫자 처리는 다음과 같습니다.

| 표현 | 역할 |
| --- | --- |
| ABS | 절댓값 |
| ROUND | 반올림 |
| + - * / | 기본 산술 연산 |
| % | 나머지 |

<mark>숫자 함수는 원본 숫자를 자동 수정하는 것이 아니라 계산된 결과를 반환합니다.</mark>

## ABS

ABS는 절댓값을 구합니다.

```sql
SELECT ABS(-100);
```

결과:

```text
100
```

개념적으로 다음과 같습니다.

```text
ABS(-100)
→ 100
```

## ROUND

ROUND는 숫자를 반올림합니다.

```sql
SELECT ROUND(12.345, 2);
```

결과는 개념적으로 다음과 같습니다.

```text
12.35
```

두 번째 인자는 소수점 아래 자릿수를 지정합니다.

## 기본 산술 연산

Column끼리 계산할 수도 있습니다.

```sql
SELECT SALARY, BONUS, SALARY + BONUS
FROM EMPLOYEE;
```

BONUS가 값으로 존재한다면 급여와 보너스의 합을 계산할 수 있습니다.

## Alias와 함께 사용

계산 결과에는 Alias를 붙이는 것이 좋습니다.

```sql
SELECT
    SALARY,
    SALARY * 12 AS ANNUAL_SALARY
FROM EMPLOYEE;
```

`ANNUAL_SALARY`는 조회 결과에서만 사용하는 이름입니다.

## 나머지 연산

SQLite에서는 `%` 연산자를 사용할 수 있습니다.

```sql
SELECT 10 % 3;
```

결과:

```text
1
```

짝수·홀수 같은 조건을 만들 때 활용할 수 있습니다.

```sql
SELECT EMP_ID
FROM EMPLOYEE
WHERE EMP_ID % 2 = 0;
```

## WHERE에서 숫자 계산

계산식을 조건으로 사용할 수도 있습니다.

```sql
SELECT EMP_NAME, SALARY
FROM EMPLOYEE
WHERE SALARY * 12 >= 36000;
```

각 Row의 계산 결과를 기준으로 조건을 판단합니다.

## NULL과 숫자 연산

NULL이 포함된 산술 연산은 일반적으로 결과도 NULL이 됩니다.

```text
100 + NULL
→ NULL
```

따라서 `SALARY + BONUS`에서 BONUS가 NULL이면 주의해야 합니다.

NULL 처리 함수는 별도 글에서 다룹니다.

## 정수와 실수

나눗셈이나 반올림 결과는 DBMS와 자료형 처리 방식에 영향을 받을 수 있습니다.

특히 정수끼리 나누는 경우 기대한 소수 결과와 다를 수 있으므로 실제 DBMS의 형 변환 규칙을 확인해야 합니다.

<blockquote class="prompt-warning">
<p>숫자 계산은 값의 자료형과 DBMS의 형 변환 규칙에 따라 결과가 달라질 수 있습니다.</p>
</blockquote>

## DBMS별 차이

숫자 함수의 종류와 세부 문법은 DBMS마다 다를 수 있습니다.

예를 들어 올림·내림·나머지 처리 함수의 이름과 지원 여부가 다를 수 있습니다.

입문 단계에서는 함수의 목적을 먼저 이해하고 사용하는 DBMS 문법을 확인하면 됩니다.

## 잘 놓치는 핵심

### 1. ABS는 절댓값이다

```text
ABS(-5)
→ 5
```

### 2. ROUND는 반올림이다

두 번째 인자로 자릿수를 지정할 수 있습니다.

### 3. 산술식도 SELECT에서 사용할 수 있다

```sql
SELECT SALARY * 12
FROM EMPLOYEE;
```

### 4. 계산 결과에 Alias를 붙일 수 있다

원본 Column 이름이 바뀌는 것은 아닙니다.

### 5. NULL이 포함되면 계산 결과에 영향을 준다

NULL 처리 함수와 함께 생각해야 합니다.

## 시험·면접

### 핵심 암기

```text
ABS → 절댓값
ROUND → 반올림
% → 나머지
```

### 시험 함정

숫자 함수를 SELECT에서 사용했다고 원본 데이터가 자동으로 변경되는 것은 아닙니다.

### 면접에서 짧게 답한다면

숫자 함수는 숫자형 데이터를 계산하거나 변환할 때 사용하며, 대표적으로 ABS로 절댓값을 구하고 ROUND로 반올림할 수 있습니다.

또 SELECT와 WHERE에서 산술식을 직접 사용할 수 있으며 자료형과 NULL 처리에 주의해야 합니다.

## 객관식 문제

### 1. 절댓값 함수는?

① ABS  
② ROUND  
③ LENGTH  
④ COUNT

<details>
<summary>정답</summary>

①

</details>

### 2. 반올림 함수는?

① TRIM  
② ROUND  
③ SUM  
④ MAX

<details>
<summary>정답</summary>

②

</details>

### 3. `10 % 3`의 결과는?

① 0  
② 1  
③ 2  
④ 3

<details>
<summary>정답</summary>

②

</details>

### 4. 계산 결과에 이름을 붙일 때 사용하는 것은?

① Alias  
② DROP  
③ ROLLBACK  
④ GRANT

<details>
<summary>정답</summary>

①

</details>

### 5. 숫자 함수에 대한 설명으로 옳은 것은?

① DBMS마다 세부 기능이 다를 수 있다.  
② 문자열에만 사용한다.  
③ SELECT에서 사용할 수 없다.  
④ 사용하면 원본 값이 항상 수정된다.

<details>
<summary>정답</summary>

①

</details>

## 다음에 이을 글

**날짜 · 시간 함수**입니다.  
날짜와 시간을 생성·변환·추출하는 방법을 알아봅니다.
