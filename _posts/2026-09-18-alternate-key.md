---
title: Alternate Key · 대체키
date: 2026-09-18 20:50:00 +0900
slug: alternate-key
permalink: /posts/alternate-key/
categories: [CS, 데이터베이스]
tags: [AlternateKey, 대체키, CandidateKey, PrimaryKey, Key, RDB, 정보처리기사, NCS]
math: true
---

Alternate Key(대체키)는 **Candidate Key 중에서 Primary Key로 선택되지 않은 나머지 Key**입니다.

즉 후보키의 자격은 있지만 대표 Key로 선택되지 않은 Key입니다.

<blockquote class="prompt-info">
<p>한 줄: Alternate Key는 Candidate Key 중 Primary Key가 되지 않은 나머지 후보키입니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

Alternate Key = Candidate Key - Primary Key입니다.

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

실습 DB에서는 `EMPLOYEE`, `CUSTOMER` 같은 Table을 참고하고, Alternate Key 설명에는 별도의 단순 회원 예시도 사용합니다.

## 핵심 예시

다음 MEMBER Table을 생각해봅시다.

| MEMBER_ID | EMAIL | NAME |
| ---: | --- | --- |
| 1 | a@test.com | 김철수 |
| 2 | b@test.com | 이영희 |
| 3 | c@test.com | 박민수 |

설계상 `MEMBER_ID`와 `EMAIL`이 모두 중복되지 않는다고 가정합니다.

그러면 두 Attribute 모두 Candidate Key가 될 수 있습니다.

```text
{MEMBER_ID}
→ 유일성 O
→ 최소성 O
→ Candidate Key

{EMAIL}
→ 유일성 O
→ 최소성 O
→ Candidate Key
```

여기서 `MEMBER_ID`를 Primary Key로 선택하면

```text
MEMBER_ID
→ Primary Key

EMAIL
→ Alternate Key
```

가 됩니다.

<mark>Alternate Key는 Candidate Key의 자격을 잃은 것이 아니라 대표로 선택되지 않았을 뿐입니다.</mark>

## Candidate Key와의 관계

대체키는 Candidate Key에서 출발합니다.

```text
Candidate Key
├─ Primary Key
└─ Alternate Key
```

Candidate Key가 여러 개 있을 때 그중 하나를 Primary Key로 선택합니다.

남은 Candidate Key들이 Alternate Key가 됩니다.

## Primary Key와 Alternate Key

둘은 모두 원래 Candidate Key입니다.

| 구분 | Primary Key | Alternate Key |
| --- | --- | --- |
| 출발 | Candidate Key | Candidate Key |
| 역할 | 대표 식별자 | 대체 가능한 식별자 |
| 개수 | 하나의 대표 Key | 여러 개 가능 |
| 유일성 | O | O |
| 최소성 | O | O |

둘 다 유일성과 최소성을 만족합니다.

차이는 **대표로 선택되었는가**입니다.

## Alternate Key도 유일성을 만족한다

Alternate Key도 Candidate Key이므로 Row를 유일하게 식별할 수 있습니다.

예를 들어 `EMAIL`이 Alternate Key라면

```text
a@test.com
→ 회원 1

b@test.com
→ 회원 2
```

처럼 하나의 Row를 찾을 수 있어야 합니다.

즉 Alternate Key도 중복되지 않도록 관리해야 합니다.

## Alternate Key도 최소성을 만족한다

Alternate Key는 Candidate Key이므로 최소성도 만족합니다.

예를 들어

```text
{EMAIL, NAME}
```

에서 `EMAIL` 하나만으로 회원을 구별할 수 있다면 `NAME`은 불필요합니다.

따라서 이 조합은 Candidate Key가 아닐 수 있습니다.

```text
{EMAIL}
→ Candidate Key

{EMAIL, NAME}
→ Super Key
→ Candidate Key X
```

Alternate Key는 최소성을 만족하는 Candidate Key 중 하나입니다.

## Candidate Key가 하나뿐이면?

Candidate Key가 하나뿐이라면 그 하나를 Primary Key로 선택합니다.

```text
Candidate Key 1개
↓
Primary Key
```

남는 Candidate Key가 없습니다.

따라서 Alternate Key도 없습니다.

<blockquote class="prompt-warning">
<p>Alternate Key는 Candidate Key가 여러 개 있을 때만 존재할 수 있습니다.</p>
</blockquote>

## Alternate Key는 여러 개일 수 있다

Candidate Key가 `MEMBER_ID`, `EMAIL`, `PHONE`이라면 하나를 Primary Key로 고르고 나머지는 Alternate Key가 됩니다.

```text
MEMBER_ID → Primary Key
EMAIL → Alternate Key
PHONE → Alternate Key
```


## 실무에서는 UNIQUE와 연결해서 생각할 수 있다

Alternate Key는 보통 중복되면 안 되는 값입니다.

예를 들어 이메일을 Alternate Key처럼 관리한다면 SQL에서 UNIQUE 제약조건을 사용할 수 있습니다.

```sql
CREATE TABLE MEMBER(
    MEMBER_ID INTEGER PRIMARY KEY,
    EMAIL TEXT UNIQUE,
    NAME TEXT
);
```

여기서

```text
MEMBER_ID
→ Primary Key

EMAIL
→ 유일성이 보장되는 대체 식별자
```

로 볼 수 있습니다.

다만 `UNIQUE` 제약조건과 Alternate Key는 개념적으로 완전히 같은 말은 아닙니다.

Alternate Key는 **후보키 중 Primary Key로 선택되지 않은 Key**라는 논리적 개념입니다.


## EMPLOYEE 예시와 연결

실습 DB의 EMPLOYEE에서는 `EMP_ID`가 Primary Key입니다.

```sql
EMP_ID INTEGER PRIMARY KEY
```

다른 Candidate Key가 Schema에서 보장되지 않았으므로 현재 데이터만 보고 `EMP_NAME` 등을 Alternate Key라고 판단하면 안 됩니다.


## Super Key · Candidate Key · Primary Key · Alternate Key

한 번에 정리하면 다음과 같습니다.

```text
Super Key
↓ 최소성 만족
Candidate Key
├─ Primary Key
└─ Alternate Key
```

각 역할은 다음과 같습니다.

| Key | 핵심 |
| --- | --- |
| Super Key | Row를 유일하게 식별 |
| Candidate Key | 유일성 + 최소성 |
| Primary Key | Candidate Key 중 대표 |
| Alternate Key | Candidate Key 중 대표로 선택되지 않음 |

이 구조를 기억하면 Key 종류 문제를 쉽게 구분할 수 있습니다.

## 잘 놓치는 핵심

### 1. Alternate Key도 Candidate Key다

```text
Alternate Key
→ 유일성 O
→ 최소성 O
```

후보키의 성질을 그대로 가집니다.

### 2. Primary Key와 차이는 선택 여부다

```text
Primary Key
→ 대표로 선택

Alternate Key
→ 선택되지 않음
```

### 3. Candidate Key가 하나라면 Alternate Key는 없다

남는 Candidate Key가 없기 때문입니다.

### 4. Alternate Key는 여러 개일 수 있다

Candidate Key가 여러 개라면 Primary Key를 제외한 나머지가 모두 Alternate Key가 될 수 있습니다.

### 5. 현재 값만 보고 결정하지 않는다

Schema와 제약조건에서 Candidate Key임이 보장되어야 합니다.

## 시험·면접

### 핵심 암기

```text
Alternate Key
= Candidate Key 중 Primary Key로 선택되지 않은 Key
```

### 핵심 관계

```text
Candidate Key
├─ Primary Key
└─ Alternate Key
```

### 시험 함정

다음 설명은 틀렸습니다.

```text
Alternate Key는 Candidate Key가 아니다.
```

Alternate Key는 원래 Candidate Key입니다.

단지 Primary Key로 선택되지 않았을 뿐입니다.

### 자주 나오는 문장

```text
Candidate Key 중 Primary Key로 선택되지 않은 Key
→ Alternate Key
```

### 면접에서 짧게 답한다면

Alternate Key는 여러 Candidate Key 중에서 Primary Key로 선택되지 않은 나머지 Key입니다.

Candidate Key이므로 유일성과 최소성을 만족하며, 대표 식별자가 아니더라도 Row를 유일하게 식별할 수 있습니다.

## 예시로 한 바퀴

다음 두 Attribute가 Candidate Key라고 해봅시다.

```text
MEMBER_ID
EMAIL
```

둘 다 Row를 유일하게 식별합니다.

그리고 최소성도 만족합니다.

```text
MEMBER_ID
→ Candidate Key

EMAIL
→ Candidate Key
```

`MEMBER_ID`를 Primary Key로 선택합니다.

```text
MEMBER_ID
→ Primary Key
```

그러면 남은 `EMAIL`은

```text
EMAIL
→ Alternate Key
```

가 됩니다.

핵심은 단순합니다.

```text
후보키 중 선택
→ Primary Key

후보키 중 미선택
→ Alternate Key
```

## 객관식 문제

### 1. Alternate Key에 대한 설명으로 옳은 것은?

① 모든 Super Key  
② Candidate Key 중 Primary Key로 선택되지 않은 Key  
③ Foreign Key의 다른 이름  
④ 중복 가능한 일반 Column

<details>
<summary>정답</summary>

②

</details>

### 2. Alternate Key가 만족하는 조건은?

① 유일성만  
② 최소성만  
③ 유일성과 최소성  
④ 정렬성과 참조성

<details>
<summary>정답</summary>

③

</details>

### 3. Candidate Key가 하나뿐이라면 Alternate Key는?

① 반드시 하나 존재한다.  
② 존재하지 않는다.  
③ 두 개 존재한다.  
④ Foreign Key가 대신한다.

<details>
<summary>정답</summary>

②

</details>

### 4. MEMBER_ID와 EMAIL이 Candidate Key이고 MEMBER_ID를 Primary Key로 선택했다면 EMAIL은?

① Super Key가 아니다.  
② Foreign Key  
③ Alternate Key  
④ 일반 Attribute

<details>
<summary>정답</summary>

③

</details>

### 5. Primary Key와 Alternate Key의 가장 큰 차이는?

① 유일성 여부  
② 최소성 여부  
③ Candidate Key 중 대표로 선택되었는지 여부  
④ Column 개수

<details>
<summary>정답</summary>

③

</details>

### 6. 다음 중 옳은 설명은?

① Alternate Key는 중복되어도 된다.  
② Alternate Key는 Candidate Key가 아니다.  
③ Alternate Key는 여러 개 존재할 수 있다.  
④ Primary Key는 Alternate Key 중 하나다.

<details>
<summary>정답</summary>

③

</details>

## 다음에 이을 글

**Foreign Key · 외래키**입니다.  
다른 Table의 Key를 참조하여 Table 사이의 관계를 만드는 Key를 알아봅니다.
