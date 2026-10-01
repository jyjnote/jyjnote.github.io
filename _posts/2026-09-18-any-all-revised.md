---
title: ANY · ALL
date: 2026-09-18 22:35:00 +0900
slug: any-all
permalink: /posts/any-all/
categories: [CS, 데이터베이스]
tags: [ANY, ALL, Subquery, 다중행서브쿼리, SQL, 정보처리기사, NCS]
math: true
---

`ANY`와 `ALL`은 <mark>다중행 서브쿼리가 반환한 여러 값과 비교할 때 사용하는 연산자</mark>입니다.

`ANY`는 여러 값 중 하나라도 조건을 만족하면 참이고, `ALL`은 모든 값에 대해 조건을 만족해야 참입니다.

<blockquote class="prompt-info">
<p>한 줄: ANY는 하나라도 만족, ALL은 모두 만족입니다.</p>
</blockquote>

<details markdown="1">
<summary>한 줄로</summary>

`ANY`는 여러 값 중 하나만 만족해도 되고, `ALL`은 모든 값을 만족해야 합니다.

</details>

## 대표 예시

비교 대상 급여가 `3000`, `4000`이라고 가정합니다.

### 입력 Table · EMPLOYEE

| EMP_NAME | SALARY |
| --- | ---: |
| 직원1 | 2500 |
| 직원2 | 3500 |
| 직원3 | 4500 |

### 비교 대상

| SALARY |
| ---: |
| 3000 |
| 4000 |

```sql
SELECT
    EMP_NAME,
    SALARY
FROM EMPLOYEE
WHERE SALARY > ANY (
    SELECT SALARY
    FROM EMPLOYEE
    WHERE DEPT_ID = 10
);
```

### 결과 Table

| EMP_NAME | SALARY |
| --- | ---: |
| 직원2 | 3500 |
| 직원3 | 4500 |

`> ANY (3000, 4000)`은 둘 중 하나보다만 커도 참입니다.

```text
3500 > 3000
→ 참

따라서 3500은 조건 만족
```

## ALL

같은 비교값에 `ALL`을 적용해 봅니다.

```sql
SELECT
    EMP_NAME,
    SALARY
FROM EMPLOYEE
WHERE SALARY > ALL (
    SELECT SALARY
    FROM EMPLOYEE
    WHERE DEPT_ID = 10
);
```

### 결과 Table

| EMP_NAME | SALARY |
| --- | ---: |
| 직원3 | 4500 |

`> ALL (3000, 4000)`은 모든 값보다 커야 합니다.

```text
3500 > 3000
→ 참

3500 > 4000
→ 거짓

→ 전체는 거짓
```

```text
4500 > 3000
→ 참

4500 > 4000
→ 참

→ 전체는 참
```

## ANY의 핵심

`ANY`는 여러 비교값 중 하나라도 조건을 만족하면 참입니다.

```text
> ANY
→ 하나보다만 커도 됨

< ANY
→ 하나보다만 작아도 됨
```

예를 들어 다음 값이 있다고 가정합니다.

```text
3000, 4000, 5000
```

### `> ANY`

```text
3500 > ANY (3000, 4000, 5000)

3500 > 3000
→ 참

→ 전체 참
```

결국 `> ANY`는 가장 작은 값보다 크면 참이 될 수 있습니다.

## ALL의 핵심

`ALL`은 모든 비교값에 대해 조건을 만족해야 합니다.

```text
> ALL
→ 모든 값보다 커야 함

< ALL
→ 모든 값보다 작아야 함
```

비교값이 다음과 같다면,

```text
3000, 4000, 5000
```

### `> ALL`

```text
5500 > ALL (3000, 4000, 5000)

→ 모든 값보다 큼
→ 참
```

결국 `> ALL`은 가장 큰 값보다 커야 참이 됩니다.

## 빠른 변환 관계

시험에서는 다음 관계를 기억하면 빠릅니다.

| 표현 | 의미 |
| --- | --- |
| `> ANY` | 최솟값보다 크면 참 |
| `< ANY` | 최댓값보다 작으면 참 |
| `> ALL` | 최댓값보다 커야 참 |
| `< ALL` | 최솟값보다 작아야 참 |

### 예시

비교값이 `10`, `20`, `30`이라면,

```text
25 > ANY (10, 20, 30)
→ 참
```

```text
25 > ALL (10, 20, 30)
→ 거짓
```

```text
25 < ANY (10, 20, 30)
→ 참
```

```text
25 < ALL (10, 20, 30)
→ 거짓
```

## = ANY

`= ANY`는 여러 값 중 하나와 같으면 참입니다.

```sql
SELECT
    EMP_NAME
FROM EMPLOYEE
WHERE DEPT_ID = ANY (
    SELECT DEPT_ID
    FROM DEPARTMENT
    WHERE REGION = '서울'
);
```

의미상 다음과 비슷하게 볼 수 있습니다.

```sql
SELECT
    EMP_NAME
FROM EMPLOYEE
WHERE DEPT_ID IN (
    SELECT DEPT_ID
    FROM DEPARTMENT
    WHERE REGION = '서울'
);
```

```text
= ANY
→ 여러 값 중 하나와 같음

IN
→ 여러 값 중 하나에 포함
```

## 잘 놓치는 핵심

### 1. ANY는 하나라도 만족하면 된다

```text
조건 3개 중
1개만 참이어도
→ ANY는 참
```

### 2. ALL은 모두 만족해야 한다

```text
조건 3개 중
1개라도 거짓이면
→ ALL은 거짓
```

### 3. 부등호 방향에 따라 기준값이 달라진다

```text
> ANY
→ 최솟값

> ALL
→ 최댓값

< ANY
→ 최댓값

< ALL
→ 최솟값
```

### 4. = ANY는 IN과 비슷하게 해석할 수 있다

여러 값 중 하나와 같다는 의미입니다.

## 시험·면접

### 핵심 암기

```text
ANY
→ 하나라도 만족
```

```text
ALL
→ 모두 만족
```

```text
> ANY
→ 최솟값보다 큼
```

```text
> ALL
→ 최댓값보다 큼
```

```text
< ANY
→ 최댓값보다 작음
```

```text
< ALL
→ 최솟값보다 작음
```

### 시험 함정

`> ANY`를 모든 값보다 커야 한다고 해석하면 안 됩니다.

반대로 `> ALL`은 모든 값보다 커야 하므로 가장 큰 값보다 커야 합니다.

### 면접 짧은 답변

`ANY`는 다중행 서브쿼리가 반환한 여러 값 중 하나라도 비교 조건을 만족하면 참이고, `ALL`은 모든 값에 대해 조건을 만족해야 참입니다. 예를 들어 `> ANY`는 최솟값보다 크면 참이 될 수 있고, `> ALL`은 최댓값보다 커야 참입니다.

## 객관식 문제

### 문제 1 · ANY

다음 조건을 만족하는 값은?

```text
값 > ANY (10, 20, 30)
```

① 5  
② 10  
③ 15  
④ 반드시 31 이상

<details markdown="1">
<summary>정답</summary>

③

15는 10보다 크므로 여러 값 중 하나에 대해 조건을 만족합니다.

</details>

### 문제 2 · ALL

다음 조건을 만족하는 값은?

```text
값 > ALL (10, 20, 30)
```

① 15  
② 20  
③ 30  
④ 31

<details markdown="1">
<summary>정답</summary>

④

모든 값보다 커야 하므로 최댓값 30보다 큰 값이어야 합니다.

</details>

### 문제 3 · < ANY

다음 중 참인 것은?

```text
25 < ANY (10, 20, 30)
```

① 참  
② 거짓  
③ NULL  
④ 비교 불가

<details markdown="1">
<summary>정답</summary>

①

25는 30보다 작으므로 여러 값 중 하나에 대해 조건을 만족합니다.

</details>

### 문제 4 · < ALL

다음 조건을 만족하는 값은?

```text
값 < ALL (10, 20, 30)
```

① 5  
② 15  
③ 25  
④ 30

<details markdown="1">
<summary>정답</summary>

①

모든 값보다 작아야 하므로 최솟값 10보다 작은 값이어야 합니다.

</details>

### 문제 5 · = ANY

다음과 의미가 가장 가까운 것은?

```sql
DEPT_ID = ANY (
    SELECT DEPT_ID
    FROM DEPARTMENT
)
```

① `DEPT_ID IN (...)`  
② `DEPT_ID > ALL (...)`  
③ `DEPT_ID IS NULL`  
④ `CROSS JOIN`

<details markdown="1">
<summary>정답</summary>

①

`= ANY`는 여러 값 중 하나와 같다는 의미이므로 `IN`과 비슷하게 해석할 수 있습니다.

</details>

## ANY · ALL 전체 요약

| 표현 | 기억할 기준 |
| --- | --- |
| `> ANY` | 최솟값보다 큼 |
| `< ANY` | 최댓값보다 작음 |
| `> ALL` | 최댓값보다 큼 |
| `< ALL` | 최솟값보다 작음 |
| `= ANY` | 여러 값 중 하나와 같음 |

```text
ANY
→ 하나라도 만족

ALL
→ 모두 만족
```

<blockquote class="prompt-danger">
<p>ANY와 ALL 문제에서는 먼저 부등호 방향을 보고, 최솟값과 최댓값 중 어느 값을 기준으로 비교할지 판단합니다.</p>
</blockquote>

## 다음에 이을 글

**UNION · UNION ALL**입니다.

두 SELECT 결과를 세로 방향으로 합치는 집합 연산을 살펴봅니다.
