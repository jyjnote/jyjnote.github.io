---
title: SELF JOIN · 셀프 조인
date: 2026-09-18 22:00:00 +0900
slug: self-join
permalink: /posts/self-join/
categories: [CS, 데이터베이스]
tags: [SELFJOIN, 셀프조인, JOIN, SQL, Alias, 관계형데이터베이스, 정보처리기사, NCS]
math: true
---

SELF JOIN은 <mark>하나의 Table을 서로 다른 두 Table처럼 취급하여 같은 Table 내부의 Row끼리 연결하는 JOIN</mark>입니다.

직원과 관리자처럼 하나의 Table 안에서 서로 관계를 가지는 데이터를 조회할 때 자주 사용합니다.

<blockquote class="prompt-info">
<p>한 줄: 같은 Table에 서로 다른 별칭을 붙여 자기 자신과 JOIN합니다.</p>
</blockquote>

<details markdown="1">
<summary>한 줄로</summary>

같은 Table을 두 번 사용하되, 별칭으로 역할을 나누어 Row끼리 연결합니다.

</details>

## 대표 예시

직원과 관리자가 같은 EMPLOYEE Table에 저장되어 있다고 가정합니다.

### 입력 Table · EMPLOYEE

| EMP_ID | EMP_NAME | MANAGER_ID |
| --- | --- | --- |
| 1001 | 팀장 | NULL |
| 1002 | 직원1 | 1001 |
| 1003 | 직원2 | 1001 |
| 1004 | 직원3 | 1002 |

직원 이름과 관리자 이름을 함께 조회합니다.

```sql
SELECT
    E.EMP_NAME AS 직원,
    M.EMP_NAME AS 관리자
FROM EMPLOYEE E
INNER JOIN EMPLOYEE M
    ON E.MANAGER_ID = M.EMP_ID;
```

### 결과 Table

| 직원 | 관리자 |
| --- | --- |
| 직원1 | 팀장 |
| 직원2 | 팀장 |
| 직원3 | 직원1 |

직원1의 `MANAGER_ID = 1001`이고, `EMP_ID = 1001`인 Row의 이름이 팀장입니다.

```text
직원1.MANAGER_ID = 1001
팀장.EMP_ID = 1001

→ 연결
```

## 별칭이 중요한 이유

SELF JOIN은 같은 Table을 두 번 사용하므로 역할을 구분해야 합니다.

```sql
FROM EMPLOYEE E
INNER JOIN EMPLOYEE M
    ON E.MANAGER_ID = M.EMP_ID
```

```text
E
→ 직원 역할

M
→ 관리자 역할
```

실제 Table은 하나지만 SQL 안에서는 서로 다른 두 Table처럼 사용합니다.

## 관리자 없는 직원까지 조회

INNER JOIN을 사용하면 연결되는 관리자가 없는 Row는 제외됩니다.

최상위 관리자는 보통 `MANAGER_ID`가 `NULL`이므로 결과에서 빠질 수 있습니다.

### 입력 Table · EMPLOYEE

| EMP_ID | EMP_NAME | MANAGER_ID |
| --- | --- | --- |
| 1001 | 대표 | NULL |
| 1002 | 팀장 | 1001 |
| 1003 | 사원 | 1002 |

모든 직원을 유지하려면 LEFT JOIN을 사용할 수 있습니다.

```sql
SELECT
    E.EMP_NAME AS 직원,
    M.EMP_NAME AS 관리자
FROM EMPLOYEE E
LEFT JOIN EMPLOYEE M
    ON E.MANAGER_ID = M.EMP_ID;
```

### 결과 Table

| 직원 | 관리자 |
| --- | --- |
| 대표 | NULL |
| 팀장 | 대표 |
| 사원 | 팀장 |

대표는 관리자가 없지만 왼쪽 EMPLOYEE의 Row이므로 결과에 남습니다.

## 두 단계 위 관리자 조회

같은 Table에 별칭을 하나 더 붙이면 상위 관계를 한 단계 더 따라갈 수 있습니다.

### 입력 Table · EMPLOYEE

| EMP_ID | EMP_NAME | MANAGER_ID |
| --- | --- | --- |
| 1001 | 대표 | NULL |
| 1002 | 팀장 | 1001 |
| 1003 | 사원 | 1002 |

```sql
SELECT
    E.EMP_NAME AS 직원,
    M.EMP_NAME AS 관리자,
    G.EMP_NAME AS 상위관리자
FROM EMPLOYEE E
LEFT JOIN EMPLOYEE M
    ON E.MANAGER_ID = M.EMP_ID
LEFT JOIN EMPLOYEE G
    ON M.MANAGER_ID = G.EMP_ID;
```

### 결과 Table

| 직원 | 관리자 | 상위관리자 |
| --- | --- | --- |
| 대표 | NULL | NULL |
| 팀장 | 대표 | NULL |
| 사원 | 팀장 | 대표 |

```text
E
→ 직원

M
→ 관리자

G
→ 관리자의 관리자
```

## SELF JOIN은 별도 JOIN 키워드가 아니다

SELF JOIN은 `SELF JOIN`이라는 전용 SQL 문법이 있는 것이 아닙니다.

같은 Table을 두 번 사용한다는 방식 자체를 SELF JOIN이라고 부릅니다.

예를 들어 다음은 INNER 방식의 SELF JOIN입니다.

```sql
FROM EMPLOYEE E
INNER JOIN EMPLOYEE M
    ON E.MANAGER_ID = M.EMP_ID
```

다음은 LEFT 방식의 SELF JOIN입니다.

```sql
FROM EMPLOYEE E
LEFT JOIN EMPLOYEE M
    ON E.MANAGER_ID = M.EMP_ID
```

즉 핵심은 <mark>같은 Table을 서로 다른 역할로 사용한다는 점</mark>입니다.

## 잘 놓치는 핵심

### 1. 같은 Table이라고 같은 Row끼리만 연결되는 것은 아니다

직원 Row와 관리자 Row처럼 같은 Table 안의 서로 다른 Row가 연결됩니다.

### 2. 별칭의 역할을 먼저 정한다

```text
E
→ 직원

M
→ 관리자
```

처럼 역할을 먼저 적고 `ON` 조건을 읽으면 헷갈리지 않습니다.

### 3. 관리자 없는 Row까지 보려면 LEFT JOIN을 확인한다

INNER JOIN은 연결 실패 Row를 제외하고, LEFT JOIN은 왼쪽 Row를 유지합니다.

### 4. 계층이 깊어지면 별칭을 추가할 수 있다

관리자, 상위 관리자처럼 단계를 더 따라가려면 같은 Table을 별칭을 바꾸어 다시 JOIN할 수 있습니다.

## 시험·면접

### 핵심 암기

```text
SELF JOIN
→ 같은 Table을 자기 자신과 JOIN
```

```text
별칭
→ 각 역할 구분
```

```text
직원.MANAGER_ID
=
관리자.EMP_ID
```

```text
관리자 없는 직원까지
→ LEFT SELF JOIN
```

### 시험 함정

SELF JOIN은 `SELF JOIN`이라는 별도의 SQL 키워드를 사용하는 것이 아닙니다.

같은 Table을 여러 번 적고 서로 다른 별칭을 부여합니다.

### 면접 짧은 답변

SELF JOIN은 하나의 Table에 서로 다른 별칭을 부여하여 같은 Table 내부의 Row끼리 연결하는 방식입니다. 직원과 관리자처럼 하나의 Table 안에 계층 관계가 있을 때 자주 사용하며, 필요에 따라 INNER JOIN이나 LEFT JOIN을 사용할 수 있습니다.

## 객관식 문제

### 문제 1 · 기본 SELF JOIN

#### EMPLOYEE

| EMP_ID | EMP_NAME | MANAGER_ID |
| --- | --- | --- |
| 1 | 대표 | NULL |
| 2 | 직원A | 1 |

다음 Query의 결과는?

```sql
SELECT
    E.EMP_NAME,
    M.EMP_NAME
FROM EMPLOYEE E
INNER JOIN EMPLOYEE M
    ON E.MANAGER_ID = M.EMP_ID;
```

① 대표·직원A  
② 직원A·대표  
③ 대표·대표  
④ 결과 없음

<details markdown="1">
<summary>정답</summary>

②

직원A의 `MANAGER_ID = 1`이고 대표의 `EMP_ID = 1`입니다.

| E.EMP_NAME | M.EMP_NAME |
| --- | --- |
| 직원A | 대표 |

</details>

### 문제 2 · LEFT SELF JOIN

#### EMPLOYEE

| EMP_ID | EMP_NAME | MANAGER_ID |
| --- | --- | --- |
| 1 | 대표 | NULL |
| 2 | 직원A | 1 |

다음 Query의 결과는?

```sql
SELECT
    E.EMP_NAME,
    M.EMP_NAME
FROM EMPLOYEE E
LEFT JOIN EMPLOYEE M
    ON E.MANAGER_ID = M.EMP_ID;
```

① 직원A·대표만 나온다.  
② 대표·NULL만 나온다.  
③ 대표·NULL, 직원A·대표가 나온다.  
④ 결과가 없다.

<details markdown="1">
<summary>정답</summary>

③

LEFT JOIN이므로 대표도 결과에 남습니다.

| 직원 | 관리자 |
| --- | --- |
| 대표 | NULL |
| 직원A | 대표 |

</details>

### 문제 3 · 별칭의 의미

다음 SQL에서 `M`의 역할은?

```sql
SELECT
    E.EMP_NAME,
    M.EMP_NAME
FROM EMPLOYEE E
INNER JOIN EMPLOYEE M
    ON E.MANAGER_ID = M.EMP_ID;
```

① 부서  
② 관리자  
③ 상품  
④ 주문

<details markdown="1">
<summary>정답</summary>

②

`E.MANAGER_ID`가 `M.EMP_ID`를 가리키므로 M은 관리자 역할입니다.

</details>

### 문제 4 · SELF JOIN 설명

SELF JOIN에 대한 설명으로 옳은 것은?

① 반드시 서로 다른 두 Table을 사용한다.  
② `SELF JOIN`이라는 전용 키워드가 있다.  
③ 같은 Table에 서로 다른 별칭을 주어 연결할 수 있다.  
④ CROSS JOIN에서만 사용할 수 있다.

<details markdown="1">
<summary>정답</summary>

③

SELF JOIN은 같은 Table을 서로 다른 역할로 두 번 사용하는 방식입니다.

</details>

### 문제 5 · 두 단계 관리자

#### EMPLOYEE

| EMP_ID | EMP_NAME | MANAGER_ID |
| --- | --- | --- |
| 1 | 대표 | NULL |
| 2 | 팀장 | 1 |
| 3 | 사원 | 2 |

사원의 관리자와 상위관리자는?

① 관리자 팀장, 상위관리자 대표  
② 관리자 대표, 상위관리자 팀장  
③ 관리자 없음  
④ 관리자 사원

<details markdown="1">
<summary>정답</summary>

①

| 직원 | 관리자 | 상위관리자 |
| --- | --- | --- |
| 사원 | 팀장 | 대표 |

사원 → 팀장 → 대표 순서입니다.

</details>

## SELF JOIN 전체 요약

### 입력 Table · EMPLOYEE

| EMP_ID | EMP_NAME | MANAGER_ID |
| --- | --- | --- |
| 1001 | 대표 | NULL |
| 1002 | 팀장 | 1001 |
| 1003 | 사원 | 1002 |

```sql
SELECT
    E.EMP_NAME AS 직원,
    M.EMP_NAME AS 관리자
FROM EMPLOYEE E
LEFT JOIN EMPLOYEE M
    ON E.MANAGER_ID = M.EMP_ID;
```

### 결과 Table

| 직원 | 관리자 |
| --- | --- |
| 대표 | NULL |
| 팀장 | 대표 |
| 사원 | 팀장 |

```text
같은 EMPLOYEE Table

E
→ 직원

M
→ 관리자
```

<blockquote class="prompt-danger">
<p>SELF JOIN 문제는 같은 Table을 두 번 본다고 생각하고, 별칭마다 역할을 먼저 정한 뒤 ON 조건을 해석합니다.</p>
</blockquote>

## 다음에 이을 글

**Natural Join · USING**입니다.

같은 이름의 Column을 기준으로 JOIN 조건을 간단하게 표현하는 방법을 살펴봅니다.
