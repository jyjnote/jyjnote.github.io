---
title: 비교 · 논리 연산자
date: 2026-10-01 11:30:00 +0900
slug: comparison-logical-operators
permalink: /posts/comparison-logical-operators/
categories: [CS, 데이터베이스]
tags: [비교연산자, 논리연산자, WHERE, AND, OR, NOT, SQL, 정보처리기사, NCS]
math: true
---

비교 연산자는 **값을 비교하여 조건을 만들고**, 논리 연산자는 **여러 조건을 연결하거나 반대로 뒤집는 역할**을 합니다.

WHERE에서 원하는 Row를 정확하게 고르려면 두 종류의 연산자를 함께 이해해야 합니다.

<blockquote class="prompt-info">
<p>한 줄: 비교 연산자로 조건을 만들고, 논리 연산자로 여러 조건을 연결합니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

비교 연산자 = 값 비교, 논리 연산자 = 조건 결합입니다.

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

## 가장 먼저 큰 그림

WHERE 조건은 보통 비교 연산자로 만듭니다.

```sql
SELECT EMP_NAME
FROM EMPLOYEE
WHERE SALARY >= 3000;
```

여러 조건을 함께 쓰려면 논리 연산자를 사용합니다.

```sql
SELECT EMP_NAME
FROM EMPLOYEE
WHERE DEPT_ID = 10
  AND SALARY >= 3000;
```

핵심은 다음과 같습니다.

```text
비교 연산자
→ 하나의 조건 생성

논리 연산자
→ 여러 조건 연결
```

## 비교 연산자

SQL에서 자주 사용하는 비교 연산자는 다음과 같습니다.

| 연산자 | 의미 |
| --- | --- |
| = | 같다 |
| <> | 같지 않다 |
| > | 크다 |
| < | 작다 |
| >= | 크거나 같다 |
| <= | 작거나 같다 |

<mark>비교 연산자는 두 값을 비교하여 TRUE 또는 FALSE에 해당하는 조건 결과를 만듭니다.</mark>

## 비교 연산자 사용

같은 값을 찾습니다.

```sql
SELECT EMP_NAME
FROM EMPLOYEE
WHERE DEPT_ID = 10;
```

같지 않은 값을 찾습니다.

```sql
SELECT EMP_NAME
FROM EMPLOYEE
WHERE DEPT_ID <> 10;
```

크기 비교도 가능합니다.

```sql
SELECT EMP_NAME, SALARY
FROM EMPLOYEE
WHERE SALARY >= 3000;
```

기준값 포함 여부는 다음처럼 구분합니다.

```text
> 3000
→ 3000 제외

>= 3000
→ 3000 포함

< 3000
→ 3000 제외

<= 3000
→ 3000 포함
```

문자열은 일반적으로 작은따옴표로 감쌉니다.

```sql
SELECT DEPT_NAME
FROM DEPARTMENT
WHERE REGION = '서울';
```

## 논리 연산자

여러 조건을 연결할 때 논리 연산자를 사용합니다.

대표적인 연산자는 다음과 같습니다.

| 연산자 | 의미 |
| --- | --- |
| AND | 모든 조건 만족 |
| OR | 하나 이상 조건 만족 |
| NOT | 조건 반전 |

## AND · OR · NOT

AND는 모든 조건을 만족해야 합니다.

```sql
SELECT EMP_NAME
FROM EMPLOYEE
WHERE DEPT_ID = 10
  AND SALARY >= 3000;
```

OR는 하나 이상의 조건만 만족해도 됩니다.

```sql
SELECT EMP_NAME
FROM EMPLOYEE
WHERE DEPT_ID = 10
   OR DEPT_ID = 20;
```

NOT은 조건을 반대로 만듭니다.

```sql
SELECT EMP_NAME
FROM EMPLOYEE
WHERE NOT DEPT_ID = 10;
```

핵심은 다음과 같습니다.

```text
AND → 모두 만족
OR → 하나 이상 만족
NOT → 조건 반전
```



## 괄호 사용

의도를 명확하게 표현하려면 괄호를 사용합니다.

```sql
SELECT EMP_NAME
FROM EMPLOYEE
WHERE (DEPT_ID = 10 OR DEPT_ID = 20)
  AND SALARY >= 3000;
```

의미는 다음과 같습니다.

```text
부서가 10 또는 20
그리고
급여가 3000 이상
```

괄호를 사용하면 조건 구조가 훨씬 명확해집니다.

<blockquote class="prompt-warning">
<p>AND와 OR를 함께 사용할 때는 연산 우선순위에만 의존하지 말고 괄호로 의도를 명확하게 표현하는 것이 좋습니다.</p>
</blockquote>

## 논리 연산자 우선순위

기본적으로 다음 순서로 이해하면 됩니다.

```text
NOT
→ AND
→ OR
```

즉 AND가 OR보다 먼저 평가됩니다.

하지만 복잡한 조건에서는 괄호를 직접 사용하는 편이 안전합니다.




## NULL 비교는 주의한다

NULL은 `= NULL`로 비교하지 않습니다.

```sql
WHERE BONUS IS NULL
```

NULL은 다음 글에서 자세히 다룹니다.

## 잘 놓치는 핵심

### 1. =는 같다는 뜻이다

SQL에서 같은 값을 비교할 때 `=`를 사용합니다.

```sql
WHERE DEPT_ID = 10;
```

### 2. <>는 같지 않다는 뜻이다

```sql
WHERE DEPT_ID <> 10;
```

### 3. >=와 >는 다르다

```text
> 3000
→ 3000 제외

>= 3000
→ 3000 포함
```

### 4. AND는 모두 만족이다

조건을 여러 개 붙일수록 결과 범위가 좁아질 수 있습니다.

### 5. OR는 하나 이상 만족이다

여러 조건 중 하나만 TRUE여도 결과에 포함될 수 있습니다.

### 6. AND와 OR를 함께 쓰면 괄호를 사용한다

조건의 의도를 명확하게 표현할 수 있습니다.

## 시험·면접

### 핵심 암기

```text
=  → 같다
<> → 같지 않다
>  → 크다
<  → 작다
>= → 크거나 같다
<= → 작거나 같다
```

### 논리 연산자

```text
AND
→ 모두 만족

OR
→ 하나 이상 만족

NOT
→ 조건 반전
```

### 우선순위

```text
NOT
→ AND
→ OR
```

### 시험 함정 1

```text
SALARY > 3000
```

에서는 3000이 포함되지 않습니다.

### 시험 함정 2

AND와 OR는 역할이 반대입니다.

```text
AND
→ 모두 만족

OR
→ 하나 이상 만족
```

### 시험 함정 3

NULL은 `= NULL`로 비교하는 것이 아니라 `IS NULL` 같은 별도 표현을 사용합니다.

### 면접에서 짧게 답한다면

비교 연산자는 두 값을 비교해 조건을 만들고, 논리 연산자는 여러 조건을 결합하거나 반전합니다.

대표적으로 `=`, `<>`, `>`, `<`, `>=`, `<=`와 `AND`, `OR`, `NOT`을 사용하며, AND와 OR를 함께 사용할 때는 괄호로 조건 의도를 명확히 표현하는 것이 좋습니다.


## 객관식 문제

### 1. 같지 않음을 의미하는 연산자는?

① =  
② <>  
③ >=  
④ AND

<details>
<summary>정답</summary>

②

</details>

### 2. `SALARY >= 3000`의 의미는?

① 3000보다 큰 값만  
② 3000보다 작은 값만  
③ 3000 이상  
④ 3000 이하

<details>
<summary>정답</summary>

③

</details>

### 3. 두 조건을 모두 만족해야 하는 연산자는?

① OR  
② NOT  
③ AND  
④ <>

<details>
<summary>정답</summary>

③

</details>

### 4. 두 조건 중 하나 이상만 만족하면 되는 연산자는?

① AND  
② OR  
③ NOT  
④ <=

<details>
<summary>정답</summary>

②

</details>

### 5. 기본적인 논리 연산자 우선순위로 적절한 것은?

① OR → AND → NOT  
② AND → OR → NOT  
③ NOT → AND → OR  
④ NOT → OR → AND

<details>
<summary>정답</summary>

③

</details>

### 6. NULL 여부를 확인하는 올바른 표현은?

① BONUS = NULL  
② BONUS <> NULL  
③ BONUS IS NULL  
④ BONUS == NULL

<details>
<summary>정답</summary>

③

</details>

## 다음에 이을 글

**NULL**입니다.  
값이 없거나 알 수 없는 상태를 SQL에서 어떻게 표현하고 비교하는지 알아봅니다.
