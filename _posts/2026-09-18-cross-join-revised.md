---
title: CROSS JOIN · 크로스 조인
date: 2026-09-18 21:55:00 +0900
slug: cross-join
permalink: /posts/cross-join/
categories: [CS, 데이터베이스]
tags: [CROSSJOIN, 크로스조인, JOIN, SQL, CartesianProduct, 카테시안곱, 정보처리기사, NCS]
math: true
---

CROSS JOIN은 <mark>두 Table의 모든 Row 조합을 만드는 JOIN</mark>입니다.

별도의 연결 조건 없이 왼쪽 Table의 각 Row를 오른쪽 Table의 모든 Row와 조합합니다.

<blockquote class="prompt-info">
<p>한 줄: CROSS JOIN은 두 Table의 가능한 모든 Row 조합을 만듭니다.</p>
</blockquote>

<details markdown="1">
<summary>한 줄로</summary>

결과 Row 수는 일반적으로 두 Table의 Row 수를 곱한 값입니다.

</details>

## 대표 예시

색상과 크기의 모든 조합을 만든다고 가정합니다.

### 입력 Table 1 · COLOR

| COLOR |
| --- |
| 검정 |
| 흰색 |

### 입력 Table 2 · SIZE

| SIZE |
| --- |
| S |
| M |
| L |

```sql
SELECT
    C.COLOR,
    S.SIZE
FROM COLOR C
CROSS JOIN SIZE S;
```

### 결과 Table

| COLOR | SIZE |
| --- | --- |
| 검정 | S |
| 검정 | M |
| 검정 | L |
| 흰색 | S |
| 흰색 | M |
| 흰색 | L |

색상 2개와 크기 3개가 모두 조합됩니다.

```text
2 × 3
= 6 Row
```

## CROSS JOIN의 핵심

CROSS JOIN에서는 일반적인 JOIN처럼 `ON` 조건으로 연결할 Row를 고르지 않습니다.

### 입력 Table 1 · A

| ID |
| --- |
| 1 |
| 2 |

### 입력 Table 2 · B

| CODE |
| --- |
| 가 |
| 나 |

```sql
SELECT
    A.ID,
    B.CODE
FROM A
CROSS JOIN B;
```

### 결과 Table

| ID | CODE |
| --- | --- |
| 1 | 가 |
| 1 | 나 |
| 2 | 가 |
| 2 | 나 |

왼쪽의 각 Row가 오른쪽의 모든 Row와 한 번씩 조합됩니다.

## 결과 Row 수

CROSS JOIN의 결과 Row 수는 다음처럼 계산합니다.

$$m\times n$$

왼쪽 Table이 `m` Row, 오른쪽 Table이 `n` Row라면 결과는 `m × n` Row입니다.

### 입력 Row 수

| Table | Row 수 |
| --- | ---: |
| A | 3 |
| B | 4 |

```sql
SELECT *
FROM A
CROSS JOIN B;
```

### 결과 Row 수

```text
3 × 4
= 12 Row
```

<blockquote class="prompt-warning">
<p>큰 Table끼리 CROSS JOIN하면 결과 Row 수가 매우 빠르게 증가할 수 있습니다.</p>
</blockquote>

## INNER JOIN과 비교

INNER JOIN은 조건에 맞는 Row만 연결합니다.

CROSS JOIN은 조건 없이 모든 조합을 만듭니다.

### 입력 Table 1 · A

| ID | NAME |
| --- | --- |
| 1 | 가 |
| 2 | 나 |

### 입력 Table 2 · B

| ID | VALUE |
| --- | --- |
| 1 | 하나 |
| 2 | 둘 |

### INNER JOIN

```sql
SELECT
    A.NAME,
    B.VALUE
FROM A
INNER JOIN B
    ON A.ID = B.ID;
```

### 결과 Table

| NAME | VALUE |
| --- | --- |
| 가 | 하나 |
| 나 | 둘 |

### CROSS JOIN

```sql
SELECT
    A.NAME,
    B.VALUE
FROM A
CROSS JOIN B;
```

### 결과 Table

| NAME | VALUE |
| --- | --- |
| 가 | 하나 |
| 가 | 둘 |
| 나 | 하나 |
| 나 | 둘 |

```text
INNER JOIN
→ 조건에 맞는 Row만

CROSS JOIN
→ 모든 Row 조합
```

## WHERE와 함께 사용

CROSS JOIN으로 모든 조합을 만든 뒤 WHERE로 필요한 Row만 남길 수도 있습니다.

### 입력 Table 1 · A

| ID |
| --- |
| 1 |
| 2 |

### 입력 Table 2 · B

| ID |
| --- |
| 1 |
| 2 |

```sql
SELECT
    A.ID AS A_ID,
    B.ID AS B_ID
FROM A
CROSS JOIN B
WHERE A.ID = B.ID;
```

### 결과 Table

| A_ID | B_ID |
| --- | --- |
| 1 | 1 |
| 2 | 2 |

CROSS JOIN 단계에서는 4개의 조합이 만들어지지만 WHERE에서 2개만 남습니다.

처음부터 같은 ID끼리 연결하려는 목적이라면 보통 INNER JOIN이 더 명확합니다.

## 세 Table을 CROSS JOIN하면

Table이 세 개라면 세 Table의 Row 수를 모두 곱합니다.

### 입력 Table

| Table | Row 수 |
| --- | ---: |
| A | 2 |
| B | 3 |
| C | 4 |

```sql
SELECT *
FROM A
CROSS JOIN B
CROSS JOIN C;
```

### 결과 Row 수

```text
2 × 3 × 4
= 24 Row
```

## 잘 놓치는 핵심

### 1. ON 조건이 없다

CROSS JOIN은 연결 기준을 지정하지 않고 모든 조합을 만듭니다.

### 2. 결과 Row 수는 곱셈이다

```text
왼쪽 Row 수
×
오른쪽 Row 수
```

### 3. 한쪽 Table이 0 Row면 결과도 0 Row다

```text
10 × 0
= 0 Row
```

### 4. 중복값도 각각 하나의 Row로 조합된다

값이 같더라도 실제 Row가 여러 개라면 각각 따로 조합됩니다.

## 시험·면접

### 핵심 암기

```text
CROSS JOIN
→ 모든 조합
```

```text
ON 조건 없음
```

```text
결과 Row 수
→ 왼쪽 Row 수 × 오른쪽 Row 수
```

```text
Table 3개
→ 세 Row 수를 모두 곱함
```

### 시험 함정

CROSS JOIN 문제에서는 값이 같은지 비교하지 않습니다.

두 Table의 실제 Row 수를 먼저 세고 곱하는 것이 가장 빠릅니다.

### 면접 짧은 답변

CROSS JOIN은 두 Table의 모든 Row를 서로 조합하여 카테시안 곱을 만드는 JOIN입니다. 별도의 연결 조건 없이 각 Row를 모두 조합하며, 결과 Row 수는 일반적으로 두 Table의 Row 수를 곱한 값입니다.

## 객관식 문제

### 문제 1 · 기본 CROSS JOIN

#### A

| A |
| --- |
| 1 |
| 2 |

#### B

| B |
| --- |
| 가 |
| 나 |
| 다 |

다음 Query의 결과 Row 수는?

```sql
SELECT *
FROM A
CROSS JOIN B;
```

① 2개  
② 3개  
③ 5개  
④ 6개

<details markdown="1">
<summary>정답</summary>

④

```text
2 × 3
= 6 Row
```

</details>

### 문제 2 · 연결 조건

CROSS JOIN에 대한 설명으로 옳은 것은?

① 같은 Key를 가진 Row만 연결한다.  
② 왼쪽 Row만 모두 유지한다.  
③ 별도의 연결 조건 없이 모든 Row 조합을 만든다.  
④ 오른쪽 Row만 모두 유지한다.

<details markdown="1">
<summary>정답</summary>

③

CROSS JOIN은 모든 가능한 Row 조합을 만듭니다.

</details>

### 문제 3 · 세 Table

A가 2 Row, B가 3 Row, C가 5 Row일 때 결과 Row 수는?

```sql
SELECT *
FROM A
CROSS JOIN B
CROSS JOIN C;
```

① 10개  
② 15개  
③ 30개  
④ 60개

<details markdown="1">
<summary>정답</summary>

③

```text
2 × 3 × 5
= 30 Row
```

</details>

### 문제 4 · 빈 Table

A가 10 Row이고 B가 0 Row일 때 CROSS JOIN 결과 Row 수는?

① 0개  
② 10개  
③ 100개  
④ NULL Row 10개

<details markdown="1">
<summary>정답</summary>

①

```text
10 × 0
= 0 Row
```

조합할 오른쪽 Row가 하나도 없으므로 결과도 없습니다.

</details>

### 문제 5 · WHERE 사용

#### A

| ID |
| --- |
| 1 |
| 2 |

#### B

| ID |
| --- |
| 1 |
| 2 |

다음 Query의 결과 Row 수는?

```sql
SELECT *
FROM A
CROSS JOIN B
WHERE A.ID = B.ID;
```

① 1개  
② 2개  
③ 3개  
④ 4개

<details markdown="1">
<summary>정답</summary>

②

CROSS JOIN 직후에는 4 Row가 만들어집니다.

WHERE 조건을 적용하면 다음 두 Row만 남습니다.

| A.ID | B.ID |
| --- | --- |
| 1 | 1 |
| 2 | 2 |

</details>

## CROSS JOIN 전체 요약

### 입력 Table 1 · COLOR

| COLOR |
| --- |
| 검정 |
| 흰색 |

### 입력 Table 2 · SIZE

| SIZE |
| --- |
| S |
| M |

```sql
SELECT
    C.COLOR,
    S.SIZE
FROM COLOR C
CROSS JOIN SIZE S;
```

### 결과 Table

| COLOR | SIZE |
| --- | --- |
| 검정 | S |
| 검정 | M |
| 흰색 | S |
| 흰색 | M |

```text
CROSS JOIN
→ 모든 Row 조합
→ 결과 Row 수는 곱셈
```

<blockquote class="prompt-danger">
<p>CROSS JOIN 문제는 연결 조건을 찾기보다 각 Table의 Row 수를 먼저 세고 모든 조합을 생각합니다.</p>
</blockquote>

## 다음에 이을 글

**SELF JOIN**입니다.

같은 Table을 서로 다른 역할로 나누어 자기 자신과 연결하는 방법을 살펴봅니다.
