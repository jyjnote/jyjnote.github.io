---
title: LIMIT · OFFSET
date: 2026-10-01 12:10:00 +0900
slug: limit-offset
permalink: /posts/limit-offset/
categories: [CS, 데이터베이스]
tags: [LIMIT, OFFSET, SQL, 페이징, ORDERBY, SELECT, 조회제한, 정보처리기사, NCS]
math: true
---

`LIMIT`은 **조회할 Row 개수를 제한**하고, `OFFSET`은 **앞에서 몇 개의 Row를 건너뛸지 지정**합니다.

주로 `ORDER BY`와 함께 사용하여 상위 N개 조회나 페이지 나누기를 구현합니다.

<blockquote class="prompt-info">
<p>한 줄: LIMIT은 개수 제한, OFFSET은 시작 위치 이동입니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

LIMIT = 몇 개 볼지, OFFSET = 몇 개 건너뛸지 정합니다.

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

이 글에서는 `EMPLOYEE`를 중심으로 봅니다.

## 가장 먼저 기본 구조

LIMIT의 기본 형태는 다음과 같습니다.

```sql
SELECT Column
FROM Table
LIMIT 개수;
```

예를 들어 직원 5명만 조회합니다.

```sql
SELECT EMP_ID, EMP_NAME
FROM EMPLOYEE
LIMIT 5;
```

의미는 다음과 같습니다.

```text
LIMIT 5
→ 최대 5개의 Row만 반환
```

<mark>LIMIT은 결과에서 몇 개의 Row를 보여줄지 제한합니다.</mark>


## ORDER BY와 LIMIT

급여가 높은 직원 3명을 보고 싶다고 해봅시다.

```sql
SELECT EMP_NAME, SALARY
FROM EMPLOYEE
ORDER BY SALARY DESC
LIMIT 3;
```

처리 흐름은 다음처럼 이해하면 됩니다.

```text
ORDER BY SALARY DESC
→ 급여 높은 순서로 정렬

LIMIT 3
→ 위에서 3개만 선택
```

이렇게 하면 상위 3명을 조회할 수 있습니다.


## OFFSET

OFFSET은 앞에서 몇 개의 Row를 건너뛸지 지정합니다.

기본 형태는 다음과 같습니다.

```sql
SELECT Column
FROM Table
LIMIT 개수
OFFSET 건너뛸개수;
```

예를 들어 앞의 5개를 건너뛰고 다음 5개를 조회합니다.

```sql
SELECT EMP_ID, EMP_NAME
FROM EMPLOYEE
ORDER BY EMP_ID
LIMIT 5
OFFSET 5;
```

핵심은 다음과 같습니다.

```text
OFFSET 5
→ 앞의 5개 건너뜀

LIMIT 5
→ 그다음 5개 반환
```


## LIMIT과 OFFSET 함께 보기

```text
LIMIT 3 OFFSET 0
→ 1~3번째 Row

LIMIT 3 OFFSET 3
→ 앞의 3개를 건너뛰고 다음 3개

LIMIT 3 OFFSET 6
→ 앞의 6개를 건너뛰고 다음 3개
```

`OFFSET 0`은 아무 Row도 건너뛰지 않는다는 뜻입니다.

## 페이지 나누기

한 페이지에 10개씩 보여준다면 OFFSET은 다음처럼 이동합니다.

```text
1페이지 → OFFSET 0
2페이지 → OFFSET 10
3페이지 → OFFSET 20
```

예를 들어 3페이지는 다음과 같습니다.

```sql
SELECT *
FROM EMPLOYEE
ORDER BY EMP_ID
LIMIT 10
OFFSET 20;
```

## OFFSET 계산

한 페이지에 `n`개씩 보여준다고 할 때 페이지 번호가 `p`라면 시작 위치는 다음처럼 생각할 수 있습니다.

$$OFFSET=(p-1)	imes n$$

예를 들어 한 페이지에 10개씩, 4페이지라면

$$OFFSET=(4-1)	imes10=30$$

입니다.

따라서

```sql
LIMIT 10
OFFSET 30;
```

을 사용합니다.


## OFFSET만 생각하면 안 되는 이유

OFFSET은 순서를 기준으로 앞의 Row를 건너뜁니다.

따라서 정렬 기준이 없다면 어떤 Row를 건너뛰는지 의미가 불명확해질 수 있습니다.

페이지 나누기에서도 다음처럼 기준을 정하는 것이 좋습니다.

```sql
SELECT EMP_ID, EMP_NAME
FROM EMPLOYEE
ORDER BY EMP_ID
LIMIT 10
OFFSET 10;
```

<mark>페이지 나누기에서는 ORDER BY로 안정적인 순서를 먼저 정하는 것이 중요합니다.</mark>

## WHERE와 LIMIT

WHERE와 함께 사용할 수 있습니다.

```sql
SELECT EMP_NAME, SALARY
FROM EMPLOYEE
WHERE SALARY >= 3000
ORDER BY SALARY DESC
LIMIT 3;
```

의미는 다음과 같습니다.

```text
SALARY >= 3000
→ 조건에 맞는 Row 선택

SALARY DESC
→ 높은 급여부터 정렬

LIMIT 3
→ 상위 3개 반환
```


## 작성 순서와 논리적 처리

작성은 다음과 같습니다.

```sql
SELECT DISTINCT Column
FROM Table
WHERE 조건
ORDER BY Column
LIMIT 개수
OFFSET 건너뛸개수;
```

논리적으로는 다음처럼 이해하면 쉽습니다.

```text
FROM → 대상 Table
WHERE → Row 필터링
SELECT → 결과 생성
DISTINCT → 중복 제거
ORDER BY → 정렬
LIMIT · OFFSET → 반환 범위 제한
```

## LIMIT과 OFFSET의 차이

| 구분 | LIMIT | OFFSET |
| --- | --- | --- |
| 역할 | 반환 개수 제한 | 앞 Row 건너뛰기 |
| 질문 | 몇 개 볼까 | 어디서 시작할까 |
| 예 | LIMIT 10 | OFFSET 20 |

가장 간단하게는 다음과 같습니다.

```text
LIMIT
→ 개수

OFFSET
→ 시작 위치
```

## DBMS별 문법과 성능 주의

LIMIT과 OFFSET의 실제 문법은 DBMS마다 다를 수 있습니다.

또 OFFSET이 매우 커지면 앞의 많은 Row를 건너뛰어야 하므로 성능이 나빠질 수 있습니다.

<blockquote class="prompt-warning">
<p>개념은 같아도 LIMIT · OFFSET 문법과 큰 OFFSET 처리 방식은 DBMS별로 확인해야 합니다.</p>
</blockquote>

## 잘 놓치는 핵심

### 1. LIMIT은 Row 개수 제한이다

```text
LIMIT 5
→ 최대 5개 반환
```

### 2. OFFSET은 건너뛸 개수다

```text
OFFSET 5
→ 앞의 5개 건너뜀
```

### 3. OFFSET 0은 처음부터 시작한다

아무 Row도 건너뛰지 않습니다.

### 4. 상위 N개는 ORDER BY와 함께 사용한다

```text
ORDER BY
→ 순서 결정

LIMIT
→ 개수 제한
```

### 5. 페이지 나누기는 LIMIT + OFFSET이다

```text
LIMIT
→ 페이지 크기

OFFSET
→ 페이지 시작 위치
```

### 6. DBMS마다 문법 차이가 있을 수 있다

개념과 실제 문법을 구분합니다.

## 시험·면접

### 핵심 암기

```text
LIMIT
→ 반환 Row 개수

OFFSET
→ 건너뛸 Row 개수
```

### 기본 문법

```sql
SELECT *
FROM Table
ORDER BY Column
LIMIT 10
OFFSET 20;
```

### 페이지 계산

$$OFFSET=(페이지번호-1)	imes페이지크기$$

### 시험 함정 1

```text
OFFSET 10
```

은 10번째 Row부터라는 뜻보다 **앞의 10개 Row를 건너뛴다**고 이해하는 것이 정확합니다.

### 시험 함정 2

LIMIT만 사용한다고 결과가 자동으로 특정 기준의 상위 N개가 되는 것은 아닙니다.

상위 N개라면 ORDER BY가 필요합니다.

### 시험 함정 3

LIMIT과 OFFSET 문법은 DBMS마다 차이가 있을 수 있습니다.

### 면접에서 짧게 답한다면

LIMIT은 SELECT 결과에서 반환할 Row 개수를 제한하고, OFFSET은 앞에서 건너뛸 Row 개수를 지정합니다.

주로 ORDER BY와 함께 상위 N개 조회나 페이지 나누기에 사용하며, 페이지 나누기에서는 페이지 크기를 LIMIT으로, 시작 위치를 OFFSET으로 지정합니다.


## 객관식 문제

### 1. LIMIT의 역할은?

① 정렬  
② 반환 Row 개수 제한  
③ 권한 부여  
④ 중복 제거

<details>
<summary>정답</summary>

②

</details>

### 2. OFFSET의 역할은?

① 앞의 Row를 일정 개수 건너뛴다.  
② Table을 삭제한다.  
③ Column을 정렬한다.  
④ 중복을 제거한다.

<details>
<summary>정답</summary>

①

</details>

### 3. `LIMIT 5 OFFSET 10`의 의미로 가장 적절한 것은?

① 10개를 보고 5개를 삭제한다.  
② 앞의 10개를 건너뛰고 최대 5개를 반환한다.  
③ 앞의 5개를 건너뛰고 10개를 반환한다.  
④ 15개를 무조건 반환한다.

<details>
<summary>정답</summary>

②

</details>

### 4. 급여가 높은 직원 3명을 조회하려면 가장 적절한 것은?

① LIMIT 3만 사용  
② ORDER BY SALARY DESC 후 LIMIT 3  
③ OFFSET 3만 사용  
④ DISTINCT SALARY만 사용

<details>
<summary>정답</summary>

②

</details>

### 5. 한 페이지에 10개씩 보여줄 때 3페이지의 OFFSET은?

① 0  
② 10  
③ 20  
④ 30

<details>
<summary>정답</summary>

③

</details>

### 6. LIMIT · OFFSET에 대한 설명으로 옳은 것은?

① 모든 DBMS가 완전히 같은 문법을 사용한다.  
② OFFSET은 결과를 정렬한다.  
③ LIMIT은 개수, OFFSET은 시작 위치와 관련 있다.  
④ LIMIT은 중복을 제거한다.

<details>
<summary>정답</summary>

③

</details>

## 다음에 이을 글

**SQL 기초 실전 문제**입니다.  
SELECT, FROM, WHERE, 비교·논리 연산자, NULL, DISTINCT, ORDER BY, LIMIT · OFFSET을 한 번에 연습합니다.
