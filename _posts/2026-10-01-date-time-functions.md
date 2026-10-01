---
title: 날짜 · 시간 함수
date: 2026-10-01 12:30:00 +0900
slug: date-time-functions
permalink: /posts/date-time-functions/
categories: [CS, 데이터베이스]
tags: [날짜함수, 시간함수, SQL, DATE, TIME, DATETIME, STRFTIME, SQLite, 정보처리기사, NCS]
math: true
---

날짜·시간 함수는 **날짜와 시간을 생성하거나 원하는 형식으로 변환하고 필요한 부분을 추출하는 함수**입니다.

날짜 비교와 기간 분석에서 자주 사용됩니다.

<blockquote class="prompt-info">
<p>한 줄: 날짜·시간 함수는 날짜와 시간을 생성·변환·추출합니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

날짜·시간 함수 = 시간 데이터 가공입니다.

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

이 글에서는 `EMPLOYEE.HIRE_DATE`, `CUSTOMER.JOIN_DATE`, `ORDERS.ORDER_DATE`를 중심으로 봅니다.

## 가장 먼저 핵심

SQLite에서 자주 사용하는 날짜·시간 함수는 다음과 같습니다.

| 함수 | 역할 |
| --- | --- |
| date | 날짜 |
| time | 시간 |
| datetime | 날짜 + 시간 |
| strftime | 원하는 형식으로 추출·표현 |

<mark>날짜 함수는 저장 형식과 DBMS에 따라 동작이 달라질 수 있으므로 실제 자료형과 문자열 형식을 함께 확인해야 합니다.</mark>

## 현재 날짜

SQLite에서는 다음처럼 현재 날짜를 확인할 수 있습니다.

```sql
SELECT date('now');
```

결과는 `YYYY-MM-DD` 형태의 날짜로 볼 수 있습니다.

## 현재 시간

```sql
SELECT time('now');
```

현재 시간 값을 확인할 수 있습니다.

시간대 처리 방식은 DBMS와 함수 옵션에 따라 달라질 수 있습니다.

## 현재 날짜와 시간

```sql
SELECT datetime('now');
```

날짜와 시간을 함께 반환합니다.

## 저장된 날짜 조회

입사일을 조회합니다.

```sql
SELECT EMP_NAME, HIRE_DATE
FROM EMPLOYEE;
```

날짜가 `YYYY-MM-DD` 형태의 문자열로 저장되어 있다면 정렬과 비교가 비교적 직관적입니다.

## 연도 추출

`strftime`으로 연도를 추출할 수 있습니다.

```sql
SELECT
    EMP_NAME,
    strftime('%Y', HIRE_DATE) AS HIRE_YEAR
FROM EMPLOYEE;
```

개념적으로 다음과 같습니다.

```text
2024-05-15
→ 2024
```

## 월 추출

```sql
SELECT
    EMP_NAME,
    strftime('%m', HIRE_DATE) AS HIRE_MONTH
FROM EMPLOYEE;
```

월만 따로 확인할 수 있습니다.

## 날짜 조건

특정 날짜 이후 입사자를 조회할 수 있습니다.

```sql
SELECT EMP_NAME, HIRE_DATE
FROM EMPLOYEE
WHERE HIRE_DATE >= '2023-01-01';
```

ISO 형태의 날짜 문자열은 비교에 활용하기 편리합니다.

## 날짜 정렬

```sql
SELECT EMP_NAME, HIRE_DATE
FROM EMPLOYEE
ORDER BY HIRE_DATE DESC;
```

최근 날짜부터 정렬할 수 있습니다.

단, 날짜가 일관된 형식으로 저장되어 있다는 전제가 중요합니다.

## 날짜 변경자

SQLite의 날짜 함수는 날짜에 일정 기간을 더하거나 뺄 때 수정자를 사용할 수 있습니다.

```sql
SELECT date('2026-10-01', '+7 day');
```

개념적으로 7일 뒤 날짜를 구합니다.

```sql
SELECT date('2026-10-01', '-1 month');
```

한 달 전 날짜를 구하는 형태입니다.

## 날짜 형식이 중요한 이유

다음처럼 날짜 문자열 형식이 제각각이면 비교와 정렬이 어려워질 수 있습니다.

```text
2026-10-01
2026/10/01
10-01-2026
```

가능하면 일관된 형식으로 저장하는 것이 좋습니다.

## 날짜 자료형과 문자열

DBMS에 따라 전용 DATE, DATETIME 자료형을 제공하기도 하고 SQLite처럼 저장 방식이 더 유연한 경우도 있습니다.

따라서 SQL 문법뿐 아니라 DBMS의 날짜 저장 방식도 함께 확인해야 합니다.

<blockquote class="prompt-warning">
<p>날짜·시간 처리는 DBMS별 차이가 크므로 함수 이름, 시간대, 저장 형식을 반드시 확인해야 합니다.</p>
</blockquote>

## 잘 놓치는 핵심

### 1. 날짜는 형식이 중요하다

일관된 날짜 형식은 비교와 정렬을 쉽게 만듭니다.

### 2. strftime으로 일부를 추출할 수 있다

연도와 월 같은 부분을 따로 얻을 수 있습니다.

### 3. 날짜도 WHERE 조건에 사용할 수 있다

```sql
WHERE HIRE_DATE >= '2023-01-01'
```

### 4. 날짜도 ORDER BY로 정렬할 수 있다

저장 형식이 올바른지 함께 확인합니다.

### 5. DBMS마다 날짜 처리 방식이 다르다

함수와 시간대 규칙을 확인합니다.

## 시험·면접

### 핵심 암기

```text
date → 날짜
time → 시간
datetime → 날짜 + 시간
strftime → 형식 지정·부분 추출
```

### 시험 함정

문자열로 저장된 날짜는 형식이 일정하지 않으면 정상적인 날짜 순서 비교가 어려울 수 있습니다.

### 면접에서 짧게 답한다면

날짜·시간 함수는 날짜와 시간을 생성하거나 형식을 변환하고 연도·월 같은 일부 정보를 추출할 때 사용합니다.

DBMS별로 함수와 저장 방식, 시간대 처리 차이가 크므로 실제 환경의 날짜 규칙을 확인해야 합니다.

## 객관식 문제

### 1. SQLite에서 날짜를 다루는 대표 함수는?

① date  
② LENGTH  
③ ABS  
④ SUM

<details>
<summary>정답</summary>

①

</details>

### 2. 연도만 추출할 때 활용할 수 있는 함수는?

① strftime  
② ROUND  
③ TRIM  
④ COUNT

<details>
<summary>정답</summary>

①

</details>

### 3. 날짜 정렬에 사용하는 절은?

① GRANT  
② ORDER BY  
③ COMMIT  
④ DROP

<details>
<summary>정답</summary>

②

</details>

### 4. 날짜 처리에서 특히 중요한 것은?

① 항상 같은 DBMS 문법이라고 가정한다.  
② 저장 형식과 DBMS 차이를 확인한다.  
③ NULL만 사용한다.  
④ Primary Key로만 저장한다.

<details>
<summary>정답</summary>

②

</details>

### 5. 날짜 조건으로 적절한 형태는?

① WHERE HIRE_DATE >= '2023-01-01'  
② DROP HIRE_DATE 2023  
③ GRANT DATE  
④ COMMIT HIRE_DATE

<details>
<summary>정답</summary>

①

</details>

## 다음에 이을 글

**NULL 처리 함수**입니다.  
NULL을 기본값으로 바꾸거나 조건에 따라 다른 값으로 처리하는 방법을 알아봅니다.
