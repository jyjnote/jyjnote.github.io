---
title: 관계형 데이터베이스 · RDB
date: 2026-09-16 02:30:00 +0900
slug: relational-database
permalink: /posts/relational-database/
categories: [CS, 데이터베이스]
tags: [관계형데이터베이스, RDB, RDBMS, Relation, Table, Key, SQL, 정보처리기사, NCS]
math: true
---
관계형 데이터베이스(Relational Database, RDB)는 **데이터를 행과 열로 이루어진 테이블 형태로 저장하고, 테이블 사이의 관계를 이용해 관리하는 데이터베이스**입니다.  
각 테이블은 하나의 주제를 표현하고, Key를 이용해 다른 테이블과 연결됩니다.
<blockquote class="prompt-info">
<p>한 줄: RDB는 데이터를 테이블로 저장하고, Key를 이용해 테이블끼리 관계를 맺는 데이터베이스입니다.</p>
</blockquote>
<details>
<summary>한 줄로</summary>
RDB는 데이터를 테이블로 표현하고 관계를 통해 연결하는 데이터베이스입니다.
</details>
## 가장 먼저 큰 그림
대학교 데이터를 생각해봅시다.

```text
STUDENT
student_id | name
1001       | 김철수
1002       | 이영희
```

```text
COURSE
course_id | course_name
101       | 데이터베이스
102       | 운영체제
```

```text
ENROLLMENT
student_id | course_id
1001       | 101
1001       | 102
1002       | 101
```

학생과 강의를 한 테이블에 모두 넣지 않고 여러 테이블로 나눕니다.

```text
STUDENT
COURSE
ENROLLMENT
```

그리고 `student_id`, `course_id` 같은 Key를 이용해 연결합니다.
<mark>관계형 데이터베이스의 핵심은 테이블과 테이블 사이의 관계입니다.</mark>
---
## 관계형 데이터베이스의 기본 구조
```text
STUDENT

student_id | name   | department
1001       | 김철수 | 컴퓨터공학
1002       | 이영희 | 통계학
1003       | 박민수 | 경영학
```

관계형 데이터베이스에서는 다음 용어가 자주 나옵니다.

| 일반 표현 | 관계형 모델 용어 | 의미 |
| --- | --- | --- |
| Table | Relation | 데이터 집합 |
| Row | Tuple | 하나의 데이터 |
| Column | Attribute | 데이터의 속성 |
---
## Relation
Relation은 관계형 데이터 모델에서 하나의 테이블에 대응하는 개념입니다.

```text
Relation ≈ Table
```

예를 들어 `STUDENT` 전체가 하나의 Relation입니다.
---
## Tuple
Tuple은 하나의 행에 대응합니다.

```text
1001 | 김철수 | 컴퓨터공학
```

```text
Tuple ≈ Row
```

한 명의 학생 정보 전체가 하나의 Tuple입니다.
---
## Attribute
Attribute는 하나의 열에 대응합니다.

```text
student_id
name
department
```

```text
Attribute ≈ Column
```

각 Attribute는 데이터의 속성을 나타냅니다.
---
## Domain
Domain은 Attribute가 가질 수 있는 값의 범위입니다.

예를 들어 학년 값이 다음과 같다면

```text
1
2
3
4
```

이 값들의 범위가 Domain입니다.

```text
Domain
= Attribute가 가질 수 있는 값의 범위
```
---
## Schema와 Instance
Schema는 데이터베이스의 구조입니다.

```text
STUDENT(
    student_id,
    name,
    department
)
```

Instance는 특정 시점에 실제로 저장된 데이터입니다.

```text
1001 | 김철수 | 컴퓨터공학
1002 | 이영희 | 통계학
```

정리하면 다음과 같습니다.

```text
Schema = 구조
Instance = 실제 데이터
```
---
## 왜 테이블을 여러 개로 나누는가
모든 정보를 하나의 테이블에 넣으면 데이터가 반복될 수 있습니다.

```text
student_id | student_name | course_id | course_name
1001       | 김철수       | 101       | 데이터베이스
1001       | 김철수       | 102       | 운영체제
```

`김철수`라는 정보가 반복됩니다.

이를 줄이기 위해 데이터를 여러 테이블로 분리합니다.

```text
STUDENT
COURSE
ENROLLMENT
```

그리고 관계를 이용해 다시 연결합니다.
---
## Key
Key는 데이터를 식별하거나 테이블 사이의 관계를 만들 때 사용하는 속성입니다.

관계형 데이터베이스에서 특히 중요한 것은 다음 두 가지입니다.

```text
Primary Key
Foreign Key
```
---
## Primary Key
Primary Key는 각 Row를 고유하게 식별합니다.

```text
STUDENT

student_id | name
1001       | 김철수
1002       | 이영희
```

여기에서는 `student_id`가 각 학생을 구별할 수 있습니다.

```text
PRIMARY KEY
→ 각 Row를 고유하게 식별
```

Primary Key는 중복될 수 없고 NULL을 가질 수 없습니다.
---
## Foreign Key
Foreign Key는 다른 테이블의 Key를 참조합니다.

```text
STUDENT
student_id | name
1001       | 김철수
```

```text
ENROLLMENT
student_id | course_id
1001       | 101
```

ENROLLMENT의 `student_id`가 STUDENT의 `student_id`를 참조할 수 있습니다.

```text
ENROLLMENT.student_id
↓
STUDENT.student_id
```

이렇게 테이블 사이의 관계를 만듭니다.
---
## 테이블 사이의 관계
대표적인 관계는 다음과 같습니다.

```text
1 : 1
1 : N
N : M
```
### 1 : 1
하나의 데이터가 다른 테이블의 하나의 데이터와 연결됩니다.

```text
사람 ↔ 여권
```
### 1 : N
하나의 데이터가 여러 데이터와 연결됩니다.

```text
학과
↓
학생 여러 명
```
### N : M
여러 데이터가 서로 여러 개씩 연결됩니다.

```text
학생 여러 명
↔
과목 여러 개
```
---
## N : M 관계와 연결 테이블
학생 한 명은 여러 과목을 수강할 수 있고, 과목 하나도 여러 학생이 수강할 수 있습니다.

```text
STUDENT
↔
COURSE
```

이런 N : M 관계는 보통 중간 테이블로 표현합니다.

```text
STUDENT
↓
ENROLLMENT
↓
COURSE
```

ENROLLMENT가 학생과 과목을 연결합니다.
---
## 관계형 데이터베이스와 SQL
관계형 데이터베이스의 데이터는 SQL로 조회하거나 변경할 수 있습니다.

```sql
SELECT *
FROM student;
```

두 테이블을 연결할 수도 있습니다.

```sql
SELECT student.name, enrollment.course_id
FROM student
JOIN enrollment
ON student.student_id = enrollment.student_id;
```

SQL은 관계형 데이터베이스에서 데이터를 다루는 대표적인 언어입니다.
---
## RDB와 RDBMS
둘은 같은 개념이 아닙니다.

```text
RDB
= 관계형 데이터베이스

RDBMS
= 관계형 데이터베이스를 관리하는 시스템
```

대표적인 RDBMS는 다음과 같습니다.

```text
MySQL
PostgreSQL
Oracle Database
Microsoft SQL Server
SQLite
```
<mark>RDB는 데이터 구조이고, RDBMS는 이를 관리하는 소프트웨어입니다.</mark>
---
## 관계형 데이터베이스의 장점
### 구조가 명확하다
행과 열로 표현되기 때문에 데이터 구조를 이해하기 쉽습니다.
### 관계를 표현하기 쉽다
Primary Key와 Foreign Key를 이용해 테이블을 연결할 수 있습니다.
### 중복을 줄일 수 있다
테이블을 적절히 분리하면 같은 데이터의 반복 저장을 줄일 수 있습니다.
### 무결성을 유지하기 쉽다
Key와 제약조건을 이용해 잘못된 데이터 입력을 제한할 수 있습니다.
### SQL을 사용할 수 있다
표준화된 SQL을 이용해 데이터를 조회하고 변경할 수 있습니다.
---
## 관계형 데이터베이스의 단점
### 구조가 복잡해질 수 있다
테이블과 관계가 많아지면 설계가 복잡해집니다.
### JOIN 비용이 발생할 수 있다
여러 테이블을 연결하면 처리 비용이 증가할 수 있습니다.
### 비정형 데이터에는 불편할 수 있다
데이터 구조가 일정하지 않거나 자주 변하면 관계형 모델에 맞추기 어려울 수 있습니다.
---
## RDB와 NoSQL
| 구분 | RDB | NoSQL |
| --- | --- | --- |
| 기본 구조 | 테이블 | 다양한 구조 |
| Schema | 비교적 명확 | 유연한 경우가 많음 |
| 관계 표현 | Key와 JOIN | 제품마다 다름 |
| 질의 | SQL 중심 | 제품마다 다름 |
| 대표 예 | MySQL, PostgreSQL | MongoDB, Redis |

NoSQL은 하나의 특정 구조가 아니라 Document, Key-Value, Graph 등 여러 유형을 포함합니다.
---
## 잘 놓치는 핵심
### 1. Relation은 테이블에 대응한다
```text
Relation ≈ Table
```
### 2. Tuple은 Row에 대응한다
```text
Tuple ≈ Row
```
### 3. Attribute는 Column에 대응한다
```text
Attribute ≈ Column
```
### 4. Schema와 Instance는 다르다
```text
Schema = 구조
Instance = 실제 데이터
```
### 5. RDB와 RDBMS는 다르다
```text
RDB = 관계형 데이터베이스
RDBMS = RDB를 관리하는 시스템
```
### 6. N : M 관계는 중간 테이블로 표현한다
```text
STUDENT
↓
ENROLLMENT
↓
COURSE
```
---
## 시험·면접
### 핵심 암기
```text
Relation = Table
Tuple = Row
Attribute = Column
Domain = Attribute가 가질 수 있는 값의 범위
Schema = 데이터 구조
Instance = 실제 데이터
```
### Key 핵심
```text
Primary Key
→ Row를 고유하게 식별

Foreign Key
→ 다른 테이블의 Key를 참조
```
### 관계 유형
```text
1 : 1
1 : N
N : M
```
### 면접에서 짧게 답한다면
> 관계형 데이터베이스는 데이터를 행과 열로 구성된 테이블 형태로 저장하고, Primary Key와 Foreign Key 같은 Key를 이용해 테이블 사이의 관계를 표현하는 데이터베이스입니다.
---
# 실전 문제
설명이 끝났다면 이론과 코드를 나누어 확인합니다.
---
## 실전 문제 - 이론
### 1. 관계형 데이터 모델에서 Row에 대응하는 용어는?
① Relation  
② Tuple  
③ Attribute  
④ Domain
<details>
<summary>정답</summary>
②
</details>
### 2. 관계형 데이터 모델에서 Column에 대응하는 용어는?
① Attribute  
② Tuple  
③ Instance  
④ Relation
<details>
<summary>정답</summary>
①
</details>
### 3. 각 Row를 고유하게 식별하는 Key는?
① Foreign Key  
② Primary Key  
③ Domain  
④ Instance
<details>
<summary>정답</summary>
②
</details>
### 4. 다른 테이블의 Key를 참조하는 것은?
① Primary Key  
② Candidate Key  
③ Foreign Key  
④ Domain
<details>
<summary>정답</summary>
③
</details>
---
## 실전 문제 - 코드
### 5. 다음 테이블에서 Primary Key로 가장 적절한 것은?
```text
STUDENT

student_id | name   | department
1001       | 김철수 | 컴퓨터공학
1002       | 이영희 | 통계학
```

① name  
② department  
③ student_id  
④ 모든 Column
<details>
<summary>정답</summary>
③
</details>
### 6. 다음 SQL의 목적은?
```sql
SELECT student.name, enrollment.course_id
FROM student
JOIN enrollment
ON student.student_id = enrollment.student_id;
```

① student 테이블 삭제  
② 두 테이블을 student_id 기준으로 연결  
③ 새로운 Database 생성  
④ student_id 값을 삭제
<details>
<summary>정답</summary>
②
</details>
---
## 다음에 이을 글
**Table · Row · Column**입니다.  
관계형 데이터베이스를 구성하는 가장 기본적인 세 요소를 더 자세히 알아봅니다.
