---
title: NULL 처리 함수
date: 2026-10-01 12:35:00 +0900
slug: null-functions
permalink: /posts/null-functions/
categories: [CS, 데이터베이스]
tags: [NULL처리, COALESCE, IFNULL, NULLIF, SQL, SQLite, 정보처리기사, NCS]
math: true
---

NULL 처리 함수는 **NULL을 다른 값으로 바꾸거나, 조건에 따라 NULL을 만들어 계산과 출력에 활용하는 함수**입니다.

NULL이 포함된 계산이나 조회 결과를 다룰 때 매우 유용합니다.

<blockquote class="prompt-info">
<p>한 줄: NULL 처리 함수는 NULL을 원하는 기본값이나 다른 표현으로 처리합니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

NULL 처리 함수 = NULL 대체·변환입니다.

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

이 글에서는 `EMPLOYEE.BONUS`를 중심으로 봅니다.

## 가장 먼저 핵심

대표적인 NULL 처리 함수는 다음과 같습니다.

| 함수 | 역할 |
| --- | --- |
| COALESCE | 처음 만나는 NULL이 아닌 값 반환 |
| IFNULL | NULL이면 대체값 반환 |
| NULLIF | 두 값이 같으면 NULL 반환 |

<mark>NULL 처리 함수는 NULL 때문에 계산이나 표시가 어려운 상황을 다루는 데 사용합니다.</mark>

## COALESCE

COALESCE는 여러 값 중에서 처음으로 NULL이 아닌 값을 반환합니다.

```sql
SELECT COALESCE(NULL, NULL, 100);
```

결과:

```text
100
```

기본 구조는 다음과 같습니다.

```text
COALESCE(A, B, C ...)
→ 왼쪽부터 확인
→ 처음 NULL이 아닌 값 반환
```

## BONUS의 NULL을 0으로 처리

```sql
SELECT
    EMP_NAME,
    COALESCE(BONUS, 0) AS BONUS
FROM EMPLOYEE;
```

BONUS가 값이 있으면 그대로 사용합니다.

BONUS가 NULL이면 0을 반환합니다.

```text
BONUS = 200
→ 200

BONUS = NULL
→ 0
```

## NULL이 포함된 계산 보완

NULL이 있는 계산은 결과도 NULL이 될 수 있습니다.

```text
SALARY + NULL
→ NULL
```

COALESCE를 사용하면 다음처럼 처리할 수 있습니다.

```sql
SELECT
    EMP_NAME,
    SALARY + COALESCE(BONUS, 0) AS TOTAL_PAY
FROM EMPLOYEE;
```

BONUS가 NULL이면 0으로 바꿔 계산합니다.

## IFNULL

SQLite에서는 `IFNULL`도 사용할 수 있습니다.

```sql
SELECT IFNULL(NULL, 0);
```

결과:

```text
0
```

두 인자를 기준으로 보면 다음과 같습니다.

```text
첫 번째 값이 NULL
→ 두 번째 값

첫 번째 값이 NULL 아님
→ 첫 번째 값
```

## COALESCE와 IFNULL

| 구분 | COALESCE | IFNULL |
| --- | --- | --- |
| 인자 | 여러 개 가능 | 주로 2개 |
| 목적 | 첫 NULL 아닌 값 | NULL이면 대체 |
| 범용성 | 표준 SQL에서 널리 사용 | DBMS별 지원 차이 |

초기 학습에서는 `COALESCE`를 우선 기억하면 좋습니다.

## NULLIF

NULLIF는 두 값이 같으면 NULL을 반환합니다.

```sql
SELECT NULLIF(10, 10);
```

결과:

```text
NULL
```

두 값이 다르면 첫 번째 값을 반환합니다.

```sql
SELECT NULLIF(10, 20);
```

결과:

```text
10
```

## NULLIF 활용 개념

특정 값을 NULL로 바꾸고 싶을 때 사용할 수 있습니다.

예를 들어 0을 NULL로 바꿔 구분하고 싶다면 다음처럼 생각할 수 있습니다.

```sql
SELECT NULLIF(0, 0);
```

결과는 NULL입니다.

## IS NULL과 함수의 차이

`IS NULL`은 NULL인지 검사합니다.

```sql
WHERE BONUS IS NULL
```

반면 COALESCE 같은 함수는 NULL을 다른 값으로 처리합니다.

```sql
COALESCE(BONUS, 0)
```

정리하면 다음과 같습니다.

```text
IS NULL
→ NULL 여부 검사

COALESCE
→ NULL 값 처리
```

## 원본 데이터는 바뀌지 않는다

SELECT에서 NULL 처리 함수를 사용해도 원본 Table의 값이 자동 수정되는 것은 아닙니다.

```sql
SELECT COALESCE(BONUS, 0)
FROM EMPLOYEE;
```

조회 결과에서만 NULL을 0처럼 표시합니다.

원본 BONUS는 여전히 NULL일 수 있습니다.

## DBMS별 차이

COALESCE는 널리 사용되지만 IFNULL, NVL 같은 함수는 DBMS별로 지원 여부와 이름이 다릅니다.

<blockquote class="prompt-warning">
<p>NULL 처리 함수는 DBMS마다 이름이 다를 수 있으므로 COALESCE를 기본으로 익히고 실제 DBMS 함수를 확인합니다.</p>
</blockquote>

## 잘 놓치는 핵심

### 1. COALESCE는 첫 NULL 아닌 값을 반환한다

왼쪽부터 확인합니다.

### 2. NULL을 0으로 바꿔 계산할 수 있다

```sql
COALESCE(BONUS, 0)
```

### 3. IFNULL은 SQLite에서 자주 볼 수 있다

두 값 중 NULL 대체에 사용합니다.

### 4. NULLIF는 두 값이 같으면 NULL이다

이름이 비슷하지만 역할이 다릅니다.

### 5. SELECT에서 사용해도 원본 NULL은 자동 변경되지 않는다

조회 결과만 가공합니다.

## 시험·면접

### 핵심 암기

```text
COALESCE → 첫 NULL 아닌 값
IFNULL → NULL이면 대체값
NULLIF → 두 값이 같으면 NULL
```

### 시험 함정

`IS NULL`은 검사이고 `COALESCE`는 값을 처리하는 함수입니다.

### 면접에서 짧게 답한다면

NULL 처리 함수는 NULL 때문에 계산이나 출력이 어려운 경우 대체값을 사용하거나 NULL 상태를 변환할 때 사용합니다.

대표적으로 COALESCE는 여러 값 중 첫 NULL이 아닌 값을 반환하고, SQLite의 IFNULL은 NULL을 특정 값으로 대체하며, NULLIF는 두 값이 같으면 NULL을 반환합니다.

## 객관식 문제

### 1. 첫 NULL이 아닌 값을 반환하는 함수는?

① COALESCE  
② LENGTH  
③ ROUND  
④ COUNT

<details>
<summary>정답</summary>

①

</details>

### 2. `COALESCE(NULL, 0)`의 결과는?

① NULL  
② 0  
③ 1  
④ 오류만 발생

<details>
<summary>정답</summary>

②

</details>

### 3. 두 값이 같으면 NULL을 반환하는 함수는?

① IFNULL  
② NULLIF  
③ SUM  
④ ABS

<details>
<summary>정답</summary>

②

</details>

### 4. IS NULL과 COALESCE의 차이로 옳은 것은?

① 둘은 완전히 같은 기능이다.  
② IS NULL은 검사, COALESCE는 NULL 값 처리다.  
③ COALESCE는 Table 삭제 함수다.  
④ IS NULL은 집계 함수다.

<details>
<summary>정답</summary>

②

</details>

### 5. NULL 처리 함수를 SELECT에서 사용하면?

① 원본 데이터가 반드시 바뀐다.  
② 조회 결과만 가공할 수 있다.  
③ Table이 삭제된다.  
④ Primary Key가 바뀐다.

<details>
<summary>정답</summary>

②

</details>

## 다음에 이을 글

**COUNT · SUM · AVG**입니다.  
여러 Row를 대상으로 개수·합계·평균을 계산하는 집계 함수를 알아봅니다.
