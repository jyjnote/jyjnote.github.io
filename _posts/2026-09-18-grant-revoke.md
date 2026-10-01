---
title: GRANT · REVOKE
date: 2026-09-18 23:30:00 +0900
slug: grant-revoke
permalink: /posts/grant-revoke/
categories: [CS, 데이터베이스]
tags: [GRANT, REVOKE, DCL, SQL, 권한, 사용자권한, 정보처리기사, NCS]
math: true
---

`GRANT`와 `REVOKE`는 <mark>사용자에게 데이터베이스 권한을 부여하거나 회수하는 명령어</mark>입니다.

`GRANT`는 권한을 주고, `REVOKE`는 이미 부여한 권한을 제거합니다.

<blockquote class="prompt-info">
<p>한 줄: GRANT는 권한 부여, REVOKE는 권한 회수입니다.</p>
</blockquote>

<details markdown="1">
<summary>한 줄로</summary>

사용자가 어떤 데이터베이스 작업을 할 수 있는지 제어하는 명령어입니다.

</details>

## GRANT

`GRANT`는 사용자에게 특정 객체에 대한 권한을 부여합니다.

### 입력 권한 상태

| 사용자 | EMPLOYEE 조회 권한 |
| --- | --- |
| USER1 | 없음 |

```sql
GRANT SELECT
ON EMPLOYEE
TO USER1;
```

### 결과 권한 상태

| 사용자 | EMPLOYEE 조회 권한 |
| --- | --- |
| USER1 | 있음 |

USER1은 이제 EMPLOYEE Table을 조회할 수 있습니다.

```text
GRANT
→ 권한 부여
```

## REVOKE

`REVOKE`는 사용자에게 부여한 권한을 회수합니다.

### 입력 권한 상태

| 사용자 | EMPLOYEE 조회 권한 |
| --- | --- |
| USER1 | 있음 |

```sql
REVOKE SELECT
ON EMPLOYEE
FROM USER1;
```

### 결과 권한 상태

| 사용자 | EMPLOYEE 조회 권한 |
| --- | --- |
| USER1 | 없음 |

USER1의 EMPLOYEE 조회 권한이 제거됩니다.

```text
REVOKE
→ 권한 회수
```

## 기본 문법

### GRANT

```sql
GRANT 권한
ON 객체
TO 사용자;
```

### REVOKE

```sql
REVOKE 권한
ON 객체
FROM 사용자;
```

핵심은 `TO`와 `FROM`의 차이입니다.

```text
GRANT
→ TO 사용자

REVOKE
→ FROM 사용자
```

## 대표 권한

Table에 대해 자주 등장하는 권한은 다음과 같습니다.

| 권한 | 의미 |
| --- | --- |
| SELECT | 조회 |
| INSERT | Row 추가 |
| UPDATE | Row 수정 |
| DELETE | Row 삭제 |

예를 들어 USER1에게 조회와 데이터 추가 권한을 함께 줄 수 있습니다.

### 입력 권한 상태

| 권한 | 상태 |
| --- | --- |
| SELECT | 없음 |
| INSERT | 없음 |

```sql
GRANT SELECT, INSERT
ON EMPLOYEE
TO USER1;
```

### 결과 권한 상태

| 권한 | 상태 |
| --- | --- |
| SELECT | 있음 |
| INSERT | 있음 |

여러 권한을 쉼표로 구분하여 한 번에 부여할 수 있습니다.

## 여러 권한 중 하나만 회수

부여한 권한 전체가 아니라 특정 권한만 회수할 수도 있습니다.

### 입력 권한 상태

| 권한 | 상태 |
| --- | --- |
| SELECT | 있음 |
| INSERT | 있음 |

```sql
REVOKE INSERT
ON EMPLOYEE
FROM USER1;
```

### 결과 권한 상태

| 권한 | 상태 |
| --- | --- |
| SELECT | 있음 |
| INSERT | 없음 |

`INSERT`만 회수되므로 `SELECT` 권한은 그대로 남습니다.

## WITH GRANT OPTION

일부 데이터베이스에서는 권한을 받은 사용자가 다른 사용자에게 그 권한을 다시 부여할 수 있도록 설정할 수 있습니다.

### 입력 권한 상태

| 사용자 | SELECT 권한 | 다른 사용자에게 재부여 |
| --- | --- | --- |
| USER1 | 없음 | 불가 |

```sql
GRANT SELECT
ON EMPLOYEE
TO USER1
WITH GRANT OPTION;
```

### 결과 권한 상태

| 사용자 | SELECT 권한 | 다른 사용자에게 재부여 |
| --- | --- | --- |
| USER1 | 있음 | 가능 |

`WITH GRANT OPTION`이 있으면 USER1이 받은 권한을 다른 사용자에게 다시 부여할 수 있습니다.

<blockquote class="prompt-warning">
<p>권한 문법과 지원 범위는 사용하는 데이터베이스 시스템에 따라 차이가 있을 수 있습니다.</p>
</blockquote>

## DCL

`GRANT`와 `REVOKE`는 일반적으로 DCL로 분류합니다.

```text
DCL
→ Data Control Language
→ 데이터베이스 권한 제어
```

```text
GRANT
→ 권한 부여

REVOKE
→ 권한 회수
```

## SQLite에서는

현재 실습 환경인 SQLite는 일반적인 사용자 계정 기반의 `GRANT`, `REVOKE` 권한 관리 문법을 직접 제공하지 않습니다.

따라서 이 문법은 정보처리기사와 SQL 개념 학습 기준으로 이해하면 됩니다.

## 잘 놓치는 핵심

### 1. GRANT는 권한을 준다

```text
GRANT
→ TO 사용자
```

### 2. REVOKE는 권한을 회수한다

```text
REVOKE
→ FROM 사용자
```

### 3. 권한은 작업 종류별로 구분한다

`SELECT`, `INSERT`, `UPDATE`, `DELETE`처럼 어떤 작업을 허용할지 지정합니다.

### 4. WITH GRANT OPTION은 재부여 권한이다

단순히 SELECT 권한을 주는 것과 다른 사용자에게 그 권한을 다시 줄 수 있게 하는 것은 다릅니다.

## 시험·면접

### 핵심 암기

```text
GRANT
→ 권한 부여
→ TO
```

```text
REVOKE
→ 권한 회수
→ FROM
```

```text
SELECT
→ 조회

INSERT
→ 추가

UPDATE
→ 수정

DELETE
→ 삭제
```

```text
WITH GRANT OPTION
→ 받은 권한을 다른 사용자에게 재부여 가능
```

### 시험 함정

`GRANT`와 `REVOKE`는 데이터를 직접 조회하거나 수정하는 명령이 아닙니다.

사용자가 해당 작업을 수행할 수 있는 권한을 제어하는 명령입니다.

### 면접 짧은 답변

`GRANT`는 사용자에게 데이터베이스 객체에 대한 권한을 부여하고, `REVOKE`는 그 권한을 회수하는 명령어입니다. 대표적으로 SELECT, INSERT, UPDATE, DELETE 권한을 제어할 수 있으며 일반적으로 DCL로 분류합니다.

## 객관식 문제

### 문제 1 · GRANT

다음 중 `GRANT`의 역할은?

① Row 삭제  
② 권한 부여  
③ Table 생성  
④ 권한 회수

<details markdown="1">
<summary>정답</summary>

②

`GRANT`는 사용자에게 데이터베이스 권한을 부여합니다.

</details>

### 문제 2 · REVOKE

다음 SQL의 의미는?

```sql
REVOKE SELECT
ON EMPLOYEE
FROM USER1;
```

① USER1에게 EMPLOYEE 조회 권한 부여  
② USER1의 EMPLOYEE 조회 권한 회수  
③ EMPLOYEE Table 삭제  
④ USER1 계정 삭제

<details markdown="1">
<summary>정답</summary>

②

`REVOKE`는 기존 권한을 회수합니다.

</details>

### 문제 3 · UPDATE 권한

다음 중 기존 Row의 값을 수정할 수 있는 권한은?

① SELECT  
② INSERT  
③ UPDATE  
④ DELETE

<details markdown="1">
<summary>정답</summary>

③

`UPDATE` 권한은 기존 Row의 값을 수정할 수 있는 권한입니다.

</details>

### 문제 4 · WITH GRANT OPTION

`WITH GRANT OPTION`의 의미로 옳은 것은?

① Table을 자동 생성한다.  
② 사용자가 받은 권한을 다른 사용자에게 다시 부여할 수 있다.  
③ 모든 권한을 자동 회수한다.  
④ 사용자 계정을 삭제한다.

<details markdown="1">
<summary>정답</summary>

②

권한을 받은 사용자가 그 권한을 다른 사용자에게 다시 부여할 수 있게 합니다.

</details>

### 문제 5 · DCL

다음 중 일반적으로 DCL로 분류되는 것은?

① SELECT  
② INSERT  
③ GRANT  
④ CREATE

<details markdown="1">
<summary>정답</summary>

③

`GRANT`와 `REVOKE`는 데이터베이스 권한을 제어하는 DCL로 분류합니다.

</details>

## GRANT · REVOKE 전체 요약

### 권한 부여

```sql
GRANT SELECT, INSERT
ON EMPLOYEE
TO USER1;
```

### 권한 회수

```sql
REVOKE INSERT
ON EMPLOYEE
FROM USER1;
```

### 결과 권한 상태

| 권한 | 상태 |
| --- | --- |
| SELECT | 있음 |
| INSERT | 없음 |

```text
GRANT
→ 권한 부여

REVOKE
→ 권한 회수

DCL
→ 권한 제어
```

<blockquote class="prompt-danger">
<p>GRANT · REVOKE 문제에서는 어떤 작업의 권한을 누구에게 주거나 회수하는지 먼저 확인합니다.</p>
</blockquote>

## 다음에 이을 글

다음 글에서는 데이터베이스의 Transaction과 COMMIT · ROLLBACK 같은 제어 명령을 살펴볼 수 있습니다.
