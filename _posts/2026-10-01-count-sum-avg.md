---
title: COUNT · SUM · AVG
date: 2026-10-01 12:40:00 +0900
slug: count-sum-avg
permalink: /posts/count-sum-avg/
categories: [CS, 데이터베이스]
tags: [COUNT, SUM, AVG, 집계함수, SQL, NULL, GROUPBY, 정보처리기사, NCS]
math: true
---

`COUNT`, `SUM`, `AVG`는 **여러 Row를 하나의 값으로 요약하는 대표적인 집계 함수**입니다.

개수, 합계, 평균을 계산할 때 사용합니다.

<blockquote class="prompt-info">
<p>한 줄: COUNT는 개수, SUM은 합계, AVG는 평균입니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

COUNT = 개수, SUM = 합계, AVG = 평균입니다.

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

이 글에서는 `EMPLOYEE.SALARY`, `EMPLOYEE.BONUS`를 중심으로 봅니다.

## 가장 먼저 핵심

| 함수 | 역할 |
| --- | --- |
| COUNT | 개수 |
| SUM | 합계 |
| AVG | 평균 |

<mark>집계 함수는 여러 Row의 값을 하나의 요약 결과로 계산합니다.</mark>

## COUNT

전체 Row 개수를 셉니다.

```sql
SELECT COUNT(*)
FROM EMPLOYEE;
```

`COUNT(*)`는 Row 자체를 기준으로 셉니다.

## COUNT(Column)

특정 Column의 값 개수를 셀 수도 있습니다.

```sql
SELECT COUNT(BONUS)
FROM EMPLOYEE;
```

이 경우 일반적으로 BONUS가 NULL인 Row는 제외됩니다.

정리하면 다음과 같습니다.

```text
COUNT(*)
→ 전체 Row 수

COUNT(Column)
→ 해당 Column의 NULL 제외 개수
```

## COUNT와 DISTINCT

서로 다른 값의 개수를 셀 수 있습니다.

```sql
SELECT COUNT(DISTINCT DEPT_ID)
FROM EMPLOYEE;
```

의미는 다음과 같습니다.

```text
서로 다른 DEPT_ID가 몇 개인가
```

## SUM

숫자 Column의 합계를 구합니다.

```sql
SELECT SUM(SALARY)
FROM EMPLOYEE;
```

모든 직원 급여의 합계를 계산합니다.

WHERE와 함께 사용할 수도 있습니다.

```sql
SELECT SUM(SALARY)
FROM EMPLOYEE
WHERE DEPT_ID = 10;
```

10번 부서 직원들의 급여 합계입니다.

## AVG

숫자 Column의 평균을 구합니다.

```sql
SELECT AVG(SALARY)
FROM EMPLOYEE;
```

급여 평균을 계산합니다.

```sql
SELECT AVG(SALARY)
FROM EMPLOYEE
WHERE DEPT_ID = 10;
```

10번 부서 직원의 평균 급여입니다.

## NULL과 집계 함수

SUM과 AVG는 일반적으로 NULL 값을 제외하고 계산합니다.

COUNT(Column)도 NULL을 제외합니다.

```text
COUNT(*)
→ Row 전체

COUNT(Column)
→ NULL 제외

SUM(Column)
→ NULL 제외 후 합계

AVG(Column)
→ NULL 제외 후 평균
```

이 차이는 시험에서 자주 나옵니다.

## BONUS 예시

BONUS 값이 다음과 같다고 해봅시다.

```text
200
300
NULL
100
```

개념적으로 다음과 같습니다.

```text
COUNT(*)
→ 4

COUNT(BONUS)
→ 3

SUM(BONUS)
→ 600

AVG(BONUS)
→ 200
```

AVG에서 NULL을 0으로 포함한 평균과는 다릅니다.

## COALESCE와 AVG

NULL을 0으로 간주하고 평균을 내고 싶다면 명시적으로 처리할 수 있습니다.

```sql
SELECT AVG(COALESCE(BONUS, 0))
FROM EMPLOYEE;
```

이 경우 NULL을 0으로 바꾼 뒤 평균을 계산합니다.

따라서 단순 `AVG(BONUS)`와 결과가 달라질 수 있습니다.

## Alias 사용

집계 결과에 이름을 붙이면 읽기 쉽습니다.

```sql
SELECT
    COUNT(*) AS EMP_COUNT,
    SUM(SALARY) AS TOTAL_SALARY,
    AVG(SALARY) AS AVG_SALARY
FROM EMPLOYEE;
```

## WHERE와 집계

WHERE는 집계 전에 Row를 선택합니다.

```sql
SELECT AVG(SALARY)
FROM EMPLOYEE
WHERE SALARY >= 3000;
```

급여가 3000 이상인 Row만 남긴 뒤 평균을 계산합니다.

## 집계 함수와 일반 Column

다음처럼 집계 결과와 일반 Column을 함께 SELECT하면 어떤 기준으로 묶을지 문제가 생길 수 있습니다.

```sql
SELECT DEPT_ID, AVG(SALARY)
FROM EMPLOYEE;
```

부서별 평균을 구하려면 `GROUP BY`가 필요합니다.

```sql
SELECT DEPT_ID, AVG(SALARY)
FROM EMPLOYEE
GROUP BY DEPT_ID;
```

GROUP BY는 뒤에서 자세히 다룹니다.

## 잘 놓치는 핵심

### 1. COUNT(*)와 COUNT(Column)은 다르다

NULL 처리에서 차이가 있습니다.

### 2. SUM은 합계다

숫자 Column에 사용합니다.

### 3. AVG는 평균이다

일반적으로 NULL은 제외하고 계산합니다.

### 4. DISTINCT와 COUNT를 함께 사용할 수 있다

```sql
COUNT(DISTINCT DEPT_ID)
```

### 5. WHERE는 집계 전에 Row를 거른다

조건에 맞는 Row만 집계합니다.

## 시험·면접

### 핵심 암기

```text
COUNT → 개수
SUM → 합계
AVG → 평균
```

### NULL 처리

```text
COUNT(*) → 전체 Row
COUNT(Column) → NULL 제외
SUM · AVG → 일반적으로 NULL 제외
```

### 시험 함정

`AVG(BONUS)`와 `AVG(COALESCE(BONUS, 0))`는 결과가 다를 수 있습니다.

### 면접에서 짧게 답한다면

COUNT, SUM, AVG는 여러 Row를 하나의 요약 값으로 만드는 대표적인 집계 함수입니다.

COUNT는 개수, SUM은 합계, AVG는 평균을 계산하며, COUNT(Column), SUM, AVG는 일반적으로 NULL을 제외한다는 점을 주의해야 합니다.

## 객관식 문제

### 1. Row 전체 개수를 세는 함수 표현은?

① COUNT(*)  
② SUM(*)  
③ AVG(*)  
④ ROUND(*)

<details>
<summary>정답</summary>

①

</details>

### 2. 합계를 구하는 함수는?

① COUNT  
② SUM  
③ AVG  
④ LENGTH

<details>
<summary>정답</summary>

②

</details>

### 3. 평균을 구하는 함수는?

① AVG  
② ABS  
③ TRIM  
④ REPLACE

<details>
<summary>정답</summary>

①

</details>

### 4. COUNT(Column)의 일반적인 NULL 처리는?

① NULL을 포함해 센다.  
② NULL을 제외한다.  
③ Table을 삭제한다.  
④ NULL을 0으로 자동 변경한다.

<details>
<summary>정답</summary>

②

</details>

### 5. 서로 다른 부서 수를 구하는 표현은?

① COUNT(DISTINCT DEPT_ID)  
② SUM(DEPT_ID)  
③ AVG(DEPT_ID)  
④ ORDER BY DEPT_ID

<details>
<summary>정답</summary>

①

</details>

## 다음에 이을 글

**MIN · MAX**입니다.  
여러 값 중 최솟값과 최댓값을 찾는 집계 함수를 알아봅니다.
