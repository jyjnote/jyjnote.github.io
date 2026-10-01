---
title: Cardinality · 관계의 수
date: 2026-09-18 23:50:00 +0900
slug: cardinality
permalink: /posts/cardinality/
categories: [CS, 데이터베이스]
tags: [Cardinality, ERD, ERModel, 데이터모델링, 일대일, 일대다, 다대다, 정보처리기사, NCS]
math: true
---

`Cardinality`는 <mark>Entity 사이의 Relationship에서 한 Entity가 다른 Entity와 몇 개까지 연결될 수 있는지를 나타내는 개념</mark>입니다.

대표적으로 **1:1, 1:N, N:M** 관계로 구분합니다.

<blockquote class="prompt-info">
<p>한 줄: Cardinality는 Entity 사이에서 하나의 Instance가 상대 Entity의 몇 개 Instance와 연결되는지를 나타냅니다.</p>
</blockquote>

<details markdown="1">
<summary>한 줄로</summary>

1:1은 하나와 하나, 1:N은 하나와 여러 개, N:M은 여러 개와 여러 개의 관계입니다.

</details>

## Cardinality란

두 Entity가 Relationship을 가질 때 단순히 연결되어 있다는 사실만으로는 관계를 정확히 설명하기 어렵습니다.

예를 들어 고객과 주문은 연결되어 있지만 한 고객이 주문을 하나만 할 수도 있고 여러 개 할 수도 있습니다.

```text
고객
↓
주문
```

이때 관계의 수를 표현하는 것이 Cardinality입니다.

```text
1:1
1:N
N:M
```

## 1:1 관계

`1:1`은 한 Entity의 Instance 하나가 상대 Entity의 Instance 하나와 연결되는 관계입니다.

### 예시 · 사람과 개인 사물함

```text
사람
1
↔
1
개인 사물함
```

한 사람이 하나의 개인 사물함만 사용하고, 하나의 사물함도 한 사람에게만 배정된다고 가정합니다.

### 관계

| 사람 | 사물함 |
| --- | --- |
| 사람1 | 사물함1 |
| 사람2 | 사물함2 |

```text
사람1
→ 사물함1

사람2
→ 사물함2
```

하나의 사람이 여러 사물함과 연결되지 않는다는 것이 핵심입니다.

## 1:N 관계

`1:N`은 한쪽의 Instance 하나가 다른 쪽의 여러 Instance와 연결되는 관계입니다.

가장 자주 등장하는 형태입니다.

### 예시 · 부서와 직원

```text
부서
1
↓
N
직원
```

한 부서에는 여러 직원이 속할 수 있고, 한 직원은 하나의 부서에 속한다고 가정합니다.

### DEPARTMENT

| DEPT_ID | DEPT_NAME |
| --- | --- |
| 10 | 개발 |
| 20 | 인사 |

### EMPLOYEE

| EMP_ID | EMP_NAME | DEPT_ID |
| --- | --- | --- |
| 1001 | 직원1 | 10 |
| 1002 | 직원2 | 10 |
| 1003 | 직원3 | 20 |

관계를 보면 다음과 같습니다.

```text
개발 부서
→ 직원1
→ 직원2

인사 부서
→ 직원3
```

즉, 하나의 부서가 여러 직원과 연결됩니다.

## 1:N에서 Foreign Key

관계형 데이터베이스에서 1:N 관계를 구현할 때는 일반적으로 `N` 쪽에 Foreign Key를 둡니다.

```text
DEPARTMENT
DEPT_ID
↓
EMPLOYEE
DEPT_ID
```

### 구조

| Table | Key |
| --- | --- |
| DEPARTMENT | DEPT_ID · Primary Key |
| EMPLOYEE | DEPT_ID · Foreign Key |

```text
1 쪽
DEPARTMENT

N 쪽
EMPLOYEE
→ Foreign Key 보유
```

<blockquote class="prompt-info">
<p>1:N 관계에서는 보통 N 쪽 Table이 1 쪽의 Primary Key를 Foreign Key로 가집니다.</p>
</blockquote>

## N:M 관계

`N:M`은 양쪽 모두 여러 Instance와 연결될 수 있는 관계입니다.

### 예시 · 학생과 강의

```text
학생
N
↔
M
강의
```

한 학생은 여러 강의를 들을 수 있고, 한 강의에도 여러 학생이 참여할 수 있습니다.

### 관계

| 학생 | 강의 |
| --- | --- |
| 학생1 | 데이터베이스 |
| 학생1 | 운영체제 |
| 학생2 | 데이터베이스 |
| 학생2 | 네트워크 |

```text
학생1
→ 데이터베이스
→ 운영체제

데이터베이스
→ 학생1
→ 학생2
```

양쪽 모두 여러 개와 연결됩니다.

## N:M 관계는 중간 Table로 변환

관계형 데이터베이스에서는 N:M 관계를 그대로 하나의 Foreign Key만으로 표현하기 어렵습니다.

따라서 보통 중간 Table을 만들어 두 개의 1:N 관계로 분해합니다.

### 기존 관계

```text
학생
N
↔
M
강의
```

### 변환

```text
학생
1
↓
N
수강
N
↑
1
강의
```

### STUDENT

| STUDENT_ID | NAME |
| --- | --- |
| S001 | 학생1 |
| S002 | 학생2 |

### COURSE

| COURSE_ID | COURSE_NAME |
| --- | --- |
| C001 | 데이터베이스 |
| C002 | 운영체제 |

### ENROLLMENT

| STUDENT_ID | COURSE_ID |
| --- | --- |
| S001 | C001 |
| S001 | C002 |
| S002 | C001 |

`ENROLLMENT`가 학생과 강의의 N:M 관계를 연결합니다.

## 세 관계 비교

| 관계 | 의미 | 대표 예시 |
| --- | --- | --- |
| 1:1 | 하나 ↔ 하나 | 사람 ↔ 개인 사물함 |
| 1:N | 하나 ↔ 여러 개 | 부서 ↔ 직원 |
| N:M | 여러 개 ↔ 여러 개 | 학생 ↔ 강의 |

```text
1:1
→ 하나와 하나

1:N
→ 하나와 여러 개

N:M
→ 여러 개와 여러 개
```

## 방향을 바꾸어 읽기

`1:N` 관계는 어느 방향에서 읽느냐에 따라 표현이 달라집니다.

```text
부서
1
↓
N
직원
```

부서 기준으로 보면 다음과 같습니다.

```text
부서 하나
→ 직원 여러 명
```

직원 기준으로 보면 다음과 같습니다.

```text
직원 여러 명
→ 하나의 부서
```

따라서 관계를 읽을 때 어느 Entity를 기준으로 보고 있는지 확인해야 합니다.

## 최소 참여와 최대 참여

ERD 표기법에 따라 최소 참여 수와 최대 참여 수를 함께 표현하기도 합니다.

예를 들어 다음과 같은 의미가 가능합니다.

```text
0..1
→ 0개 또는 1개

1..1
→ 반드시 1개

0..N
→ 0개 이상 여러 개

1..N
→ 최소 1개 이상 여러 개
```

`1:N`은 주로 최대 연결 수를 나타내는 표현이고, 실제 ERD에서는 선택 참여 여부까지 함께 표시할 수 있습니다.

<blockquote class="prompt-warning">
<p>ERD 표기법에 따라 Cardinality 기호가 다를 수 있으므로 숫자와 기호의 의미를 함께 확인합니다.</p>
</blockquote>

## Crow's Foot에서 읽기

Crow's Foot 표기법에서는 여러 개를 나타내는 쪽이 갈라진 모양으로 표현됩니다.

핵심 의미만 기억하면 됩니다.

```text
한 개
→ 1

여러 개
→ N
```

예를 들어 부서와 직원이 다음 관계라면

```text
부서
1
↓
N
직원
```

한 부서에 여러 직원이 속할 수 있다는 의미입니다.

## 잘 놓치는 핵심

### 1. Cardinality는 관계의 개수다

Entity의 Column 개수를 의미하는 것이 아닙니다.

### 2. 1:N에서는 보통 N 쪽에 Foreign Key가 있다

```text
부서 1
↓
직원 N

직원 Table
→ DEPT_ID Foreign Key
```

### 3. N:M은 중간 Table로 분해한다

```text
N:M
→ 중간 Table
→ 1:N + 1:N
```

### 4. 관계는 양쪽 방향에서 읽어야 한다

한쪽에서는 `1:N`으로 보이지만 반대쪽에서는 여러 개가 하나를 참조하는 관계로 읽을 수 있습니다.

## 시험·면접

### 핵심 암기

```text
1:1
→ 하나 : 하나
```

```text
1:N
→ 하나 : 여러 개
→ N 쪽에 Foreign Key
```

```text
N:M
→ 여러 개 : 여러 개
→ 중간 Table 필요
```

### 시험 함정

N:M 관계를 관계형 데이터베이스에서 그대로 하나의 Foreign Key로 처리한다고 생각하면 안 됩니다.

일반적으로 연결 Entity 또는 중간 Table을 만들어 두 개의 1:N 관계로 변환합니다.

### 면접 짧은 답변

Cardinality는 Entity 사이의 Relationship에서 한 Instance가 상대 Entity의 몇 개 Instance와 연결될 수 있는지를 나타냅니다. 대표적으로 1:1, 1:N, N:M 관계가 있으며, 1:N 관계에서는 보통 N 쪽에 Foreign Key를 두고 N:M 관계는 중간 Table을 이용해 두 개의 1:N 관계로 변환합니다.

## 객관식 문제

### 문제 1 · 1:1

다음 중 1:1 관계에 가장 가까운 것은?

① 한 부서와 여러 직원  
② 여러 학생과 여러 강의  
③ 한 사람과 한 개인 사물함  
④ 한 고객과 여러 주문

<details markdown="1">
<summary>정답</summary>

③

각 사람이 하나의 개인 사물함과만 연결된다고 가정하면 1:1 관계입니다.

</details>

### 문제 2 · 1:N

다음 관계의 의미로 옳은 것은?

```text
부서
1
↓
N
직원
```

① 한 부서에 여러 직원이 속할 수 있다.  
② 한 직원이 반드시 여러 부서에 속한다.  
③ 부서와 직원은 관계가 없다.  
④ 하나의 직원이 여러 개의 부서 Table을 생성한다.

<details markdown="1">
<summary>정답</summary>

①

하나의 부서가 여러 직원 Instance와 연결될 수 있는 1:N 관계입니다.

</details>

### 문제 3 · Foreign Key

1:N 관계를 관계형 데이터베이스로 구현할 때 일반적으로 Foreign Key를 두는 위치는?

① 항상 1 쪽  
② 보통 N 쪽  
③ 두 Table 어디에도 두지 않음  
④ 새로운 데이터베이스에만 둠

<details markdown="1">
<summary>정답</summary>

②

일반적으로 N 쪽 Table이 1 쪽의 Primary Key를 Foreign Key로 참조합니다.

</details>

### 문제 4 · N:M

학생과 강의가 N:M 관계일 때 일반적인 구현 방법은?

① 두 Entity를 모두 삭제한다.  
② 두 Entity를 하나의 Column으로 합친다.  
③ 중간 Table을 만들어 관계를 분해한다.  
④ Primary Key를 사용하지 않는다.

<details markdown="1">
<summary>정답</summary>

③

N:M 관계는 보통 연결 Table을 만들어 두 개의 1:N 관계로 변환합니다.

```text
학생 1:N 수강
강의 1:N 수강
```

</details>

### 문제 5 · Cardinality

Cardinality가 나타내는 것으로 가장 적절한 것은?

① Table의 Column 개수  
② Entity 사이의 관계 수  
③ 데이터베이스 파일 크기  
④ SQL문의 실행 횟수

<details markdown="1">
<summary>정답</summary>

②

Cardinality는 Relationship에서 각 Entity가 상대 Entity의 몇 개 Instance와 연결되는지를 나타냅니다.

</details>

## Cardinality 전체 요약

| 형태 | 의미 | 구현 핵심 |
| --- | --- | --- |
| 1:1 | 하나와 하나 | 양쪽 하나씩 연결 |
| 1:N | 하나와 여러 개 | N 쪽에 Foreign Key |
| N:M | 여러 개와 여러 개 | 중간 Table로 분해 |

```text
1:1
→ 하나 : 하나

1:N
→ 하나 : 여러 개

N:M
→ 여러 개 : 여러 개
→ 중간 Table
```

<blockquote class="prompt-danger">
<p>시험에서는 먼저 한쪽 Instance 하나가 상대쪽 몇 개와 연결되는지를 확인하고 1:1, 1:N, N:M을 판단합니다.</p>
</blockquote>

## 다음에 이을 글

**Functional Dependency**입니다.

하나의 Attribute 값이 다른 Attribute 값을 결정하는 관계와 정규화의 출발점을 살펴봅니다.
