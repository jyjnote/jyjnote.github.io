---
title: Key · 키의 개념
date: 2026-09-18 20:29:00 +0900
slug: database-key
permalink: /posts/database-key/
categories: [CS, 데이터베이스]
tags: [Key, 키, PrimaryKey, ForeignKey, CandidateKey, SuperKey, RDB, 정보처리기사, NCS]
math: true
---

Key는 **Table의 Row를 식별하거나 Table 사이의 관계를 연결하기 위해 사용하는 Attribute 또는 Attribute의 집합**입니다.

쉽게 말하면 특정 Row를 구별하는 기준입니다.

<blockquote class="prompt-info">
<p>한 줄: Key는 Row를 구별하고, 필요하면 다른 Table과 연결하는 기준입니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

Key = Row 식별 + Table 관계 연결의 기준입니다.

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

이 글에서는 `EMPLOYEE`, `DEPARTMENT`, `ORDER_ITEM`을 사용합니다.

## 핵심 예시

EMPLOYEE 일부를 봅시다.

| EMP_ID | EMP_NAME | DEPT_ID | SALARY |
| ---: | --- | ---: | ---: |
| 1001 | 직원1 | 10 | 2890 |
| 1002 | 직원2 | 20 | 2980 |
| 1003 | 직원3 | 30 | 3070 |

`EMP_NAME`은 같은 이름이 생길 수 있습니다.

반면 `EMP_ID`는 각 직원을 구별하도록 만든 값입니다.

```text
EMP_ID = 1001
→ 직원1

EMP_ID = 1002
→ 직원2
```

따라서 `EMP_ID`는 Row를 식별하는 Key가 될 수 있습니다.

<mark>Key의 가장 기본적인 역할은 Row를 다른 Row와 구별하는 것입니다.</mark>

## 왜 Key가 필요한가

다음처럼 이름이 같은 직원이 있을 수 있습니다.

```text
1001 | 김민수
1002 | 김민수
```

이름만으로는 어떤 Row인지 알 수 없습니다.

하지만

```text
EMP_ID = 1001
```

처럼 고유한 값을 사용하면 정확하게 하나의 Row를 찾을 수 있습니다.

Key의 핵심 역할은 두 가지입니다.

- Row 식별
- Table 관계 연결

## Key는 하나의 Column일 수 있다

EMPLOYEE에서는 `EMP_ID` 하나만으로 직원 한 명을 구별할 수 있습니다.

```text
EMP_ID
→ 하나의 Column
→ 하나의 Key
```

이처럼 하나의 Attribute로 이루어진 Key를 만들 수 있습니다.

## 여러 Column을 합쳐 Key를 만들 수도 있다

ORDER_ITEM 일부를 봅시다.

| ORDER_ID | PRODUCT_ID | QTY |
| --- | --- | ---: |
| O0001 | P002 | 2 |
| O0001 | P009 | 1 |
| O0002 | P003 | 3 |

`ORDER_ID`만 보면 값이 반복됩니다.

`PRODUCT_ID`도 다른 주문에서 반복될 수 있습니다.

따라서 두 Column을 함께 사용합니다.

```text
ORDER_ID + PRODUCT_ID
```

예를 들어

```text
O0001 + P002
```

라는 조합은 하나의 주문 상세 Row를 구별할 수 있습니다.

<mark>Key는 하나의 Attribute일 수도 있고 여러 Attribute의 조합일 수도 있습니다.</mark>

## 단일 Key와 복합 Key

| 구분 | 의미 | 예시 |
| --- | --- | --- |
| 단일 Key | 하나의 Column으로 식별 | EMP_ID |
| 복합 Key | 여러 Column을 조합하여 식별 | ORDER_ID + PRODUCT_ID |

ORDER_ITEM에서는 실제로 두 Column이 함께 Primary Key를 구성합니다.

```sql
PRIMARY KEY(ORDER_ID, PRODUCT_ID)
```

이런 형태를 복합 Key 또는 Composite Key라고 합니다.

## Key는 Table 관계도 만든다

DEPARTMENT 일부를 봅시다.

| DEPT_ID | DEPT_NAME | REGION |
| ---: | --- | --- |
| 10 | 개발 | 서울 |
| 20 | 인사 | 부산 |
| 30 | 영업 | 대전 |

EMPLOYEE의 `DEPT_ID`는 DEPARTMENT의 `DEPT_ID`와 연결됩니다.

```text
EMPLOYEE.DEPT_ID
↓
DEPARTMENT.DEPT_ID
```

직원1의 `DEPT_ID`가 10이라면 DEPARTMENT에서 10을 찾아 개발 부서임을 알 수 있습니다.

```text
EMPLOYEE.DEPT_ID = 10
↓
DEPARTMENT.DEPT_ID = 10
↓
개발
```


## Key의 대표 종류

대표적인 Key는 다음과 같습니다.

- Super Key
- Candidate Key
- Primary Key
- Alternate Key
- Foreign Key

큰 관계를 먼저 보면 다음과 같습니다.

```text
Super Key
↓ 최소성 만족
Candidate Key
↓ 대표 하나 선택
Primary Key

Candidate Key 중 선택되지 않은 것
→ Alternate Key

다른 Table의 Key 참조
→ Foreign Key
```

## Super Key

Super Key는 **Row를 유일하게 식별할 수 있는 Attribute 또는 Attribute 집합**입니다.

예를 들어 `EMP_ID` 하나로 직원이 구별된다면 다음도 Row를 유일하게 구별할 수 있습니다.

```text
EMP_ID

EMP_ID + EMP_NAME

EMP_ID + SALARY
```

불필요한 Attribute가 있어도 유일하게 구별되면 Super Key가 될 수 있습니다.

## Candidate Key

Candidate Key는 Super Key 중 **불필요한 Attribute를 제거한 최소 Key**입니다.

핵심 조건은 다음과 같습니다.

```text
유일성
+
최소성
```

시험에서 매우 자주 나오는 기준입니다.

## Primary Key

Candidate Key가 여러 개라면 그중 대표 하나를 선택합니다.

```text
Candidate Key
↓ 하나 선택
Primary Key
```

EMPLOYEE에서는 `EMP_ID`가 Primary Key입니다.

## Alternate Key

Candidate Key 중 Primary Key로 선택되지 않은 나머지 Key입니다.

```text
Candidate Key
├─ Primary Key
└─ Alternate Key
```

## Foreign Key

Foreign Key는 다른 Table의 Key를 참조합니다.

```text
EMPLOYEE.DEPT_ID
↓
DEPARTMENT.DEPT_ID
```

Table 사이의 관계를 표현하는 데 사용됩니다.

## 유일성과 최소성

Key 문제에서는 두 개념을 구분해야 합니다.

### 유일성

Key 값으로 하나의 Row만 찾을 수 있어야 합니다.

```text
EMP_ID = 1001
→ 하나의 직원
```

### 최소성

Row 식별에 불필요한 Attribute가 없어야 합니다.

`EMP_ID` 하나만으로 충분하다면

```text
EMP_ID + EMP_NAME
```

은 `EMP_NAME`이 불필요합니다.

따라서 유일성은 만족하지만 최소성은 만족하지 않을 수 있습니다.

<blockquote class="prompt-warning">
<p>Super Key는 유일성이 핵심이고, Candidate Key는 유일성과 최소성을 모두 만족해야 합니다.</p>
</blockquote>



## Key와 Index는 다르다

둘은 자주 혼동합니다.

| 구분 | Key | Index |
| --- | --- | --- |
| 목적 | 식별·관계·무결성 | 검색 속도 향상 |
| 성격 | 논리적 규칙 | 검색 구조 |
| 예시 | Primary Key, Foreign Key | B-Tree Index |

Primary Key 생성 시 Index가 함께 만들어질 수 있지만 두 개념은 다릅니다.

## 잘 놓치는 핵심

### 1. Key는 하나의 Column만 의미하지 않는다

```text
ORDER_ID + PRODUCT_ID
```

처럼 여러 Column의 조합도 Key가 될 수 있습니다.

### 2. Super Key와 Candidate Key는 다르다

```text
Super Key
→ 유일성

Candidate Key
→ 유일성 + 최소성
```

### 3. Primary Key는 Candidate Key 중 하나다

```text
Candidate Key
↓ 대표 선택
Primary Key
```

### 4. Foreign Key는 관계를 만든다

다른 Table의 Key를 참조합니다.

### 5. Key와 Index는 같은 개념이 아니다

Key는 식별과 관계의 개념이고, Index는 검색 성능을 위한 구조입니다.

## 시험·면접

### 핵심 암기

```text
Key
= Row 식별 또는 Table 관계 연결 기준
```

### 가장 중요한 관계

```text
Super Key
↓ 최소성
Candidate Key
↓ 하나 선택
Primary Key
```

### Candidate Key 조건

```text
유일성
+
최소성
```

### Primary Key

```text
중복 불가
NULL 불가
```

### Foreign Key

```text
다른 Table의 Key 참조
→ Table 관계 형성
```

### 시험 함정

`EMP_ID` 하나만으로 Row를 식별할 수 있는데

```text
EMP_ID + EMP_NAME
```

을 사용했다면 유일성은 만족해도 최소성은 만족하지 않을 수 있습니다.

### 면접에서 짧게 답한다면

Key는 Table의 Row를 고유하게 식별하거나 다른 Table과의 관계를 만들기 위해 사용하는 Attribute 또는 Attribute의 집합입니다.

대표적으로 Super Key, Candidate Key, Primary Key, Alternate Key, Foreign Key가 있습니다.


## 객관식 문제

### 1. Key의 가장 기본적인 역할은?

① Table 색상 지정  
② Row 식별  
③ SQL 문법 변경  
④ 파일 압축

<details>
<summary>정답</summary>

②

</details>

### 2. Candidate Key가 만족해야 하는 조건은?

① 유일성만  
② 최소성만  
③ 유일성과 최소성  
④ 정렬성과 최소성

<details>
<summary>정답</summary>

③

</details>

### 3. Candidate Key 중 대표로 선택된 Key는?

① Foreign Key  
② Primary Key  
③ Super Key  
④ Index

<details>
<summary>정답</summary>

②

</details>

### 4. 다른 Table의 Key를 참조하는 것은?

① Primary Key  
② Candidate Key  
③ Foreign Key  
④ Super Key

<details>
<summary>정답</summary>

③

</details>

### 5. 복합 Key의 예로 가장 적절한 것은?

① EMP_ID  
② EMP_NAME  
③ ORDER_ID + PRODUCT_ID  
④ SALARY

<details>
<summary>정답</summary>

③

</details>

### 6. Super Key와 Candidate Key의 차이로 옳은 것은?

① Candidate Key는 유일성을 만족하지 않는다.  
② Super Key는 반드시 최소성을 만족한다.  
③ Candidate Key는 유일성과 최소성을 모두 만족한다.  
④ 둘은 항상 같은 개념이다.

<details>
<summary>정답</summary>

③

</details>

## 다음에 이을 글

**Super Key · 슈퍼키**입니다.  
Row를 유일하게 식별할 수 있는 모든 Key 조합을 알아봅니다.
