---
title: Log · Checkpoint · Recovery
date: 2026-10-02 08:40:00 +0900
slug: log-checkpoint-recovery
permalink: /posts/log-checkpoint-recovery/
categories: [CS, 데이터베이스]
tags: [Log, Checkpoint, Recovery, UNDO, REDO, WAL, 트랜잭션, 회복, 정보처리기사, NCS]
math: true
---

`Log`, `Checkpoint`, `Recovery`는 <mark>장애가 발생했을 때 Transaction의 처리 내역을 바탕으로 데이터베이스를 정상 상태로 복구하기 위한 핵심 개념</mark>입니다.

가장 간단하게 **Log는 기록, Checkpoint는 기준점, Recovery는 복구**로 기억하면 됩니다.

<blockquote class="prompt-info">
<p>한 줄: Log에 변경 내역을 남기고, Checkpoint를 기준으로 필요한 부분만 확인해 UNDO와 REDO로 복구합니다.</p>
</blockquote>

<details markdown="1">
<summary>한 줄로</summary>

Log = 변경 기록, Checkpoint = 복구 기준점, Recovery = UNDO·REDO를 이용한 복원입니다.

</details>

## 전체 구조

| 개념 | 핵심 |
| --- | --- |
| Log | Transaction의 변경 내역 기록 |
| Checkpoint | 복구 시 확인 범위를 줄이는 기준점 |
| Recovery | 장애 후 데이터베이스를 일관된 상태로 복구 |
| UNDO | 완료되지 않은 변경을 취소 |
| REDO | 완료된 변경을 다시 반영 |

```text
Transaction 실행
↓
Log 기록
↓
Checkpoint
↓
장애 발생
↓
Recovery
↓
UNDO / REDO
```

## Log

`Log`는 Transaction이 데이터베이스를 어떻게 변경했는지를 기록한 정보입니다.

예를 들어 직원의 급여가 3000에서 4000으로 변경되었다고 가정합니다.

```text
Transaction T1

EMP_ID = 1001
이전 값 = 3000
새 값 = 4000
```

Log에는 일반적으로 다음과 같은 정보가 기록될 수 있습니다.

```text
Transaction 식별자
변경 대상
이전 값
새 값
Transaction 시작
COMMIT
ROLLBACK
```

이 기록을 이용하면 장애가 발생했을 때 어떤 작업을 취소하고 어떤 작업을 다시 수행해야 하는지 판단할 수 있습니다.

## Log가 필요한 이유

Transaction이 실행되는 도중 시스템이 갑자기 종료되었다고 가정합니다.

```text
데이터 변경 중
↓
시스템 장애
↓
메모리의 일부 정보 손실
```

이때 변경 내역이 아무것도 남아 있지 않다면 정상 상태로 되돌리기 어렵습니다.

Log가 있다면

```text
누가
무엇을
어떻게 변경했는지
```

확인할 수 있습니다.

```text
Log
→ 복구의 근거
```

## WAL

`WAL`은 `Write-Ahead Logging`의 약자입니다.

핵심 원칙은 <mark>데이터베이스의 실제 데이터를 변경하기 전에 관련 Log를 먼저 안전하게 기록하는 것</mark>입니다.

```text
Log 먼저 기록
↓
실제 데이터 변경
```

만약 데이터만 먼저 바꾸고 Log를 남기기 전에 장애가 발생하면 복구에 필요한 정보가 사라질 수 있습니다.

따라서

```text
Log
→ 먼저

Data
→ 나중
```

순서를 지키는 것이 중요합니다.

## UNDO

`UNDO`는 <mark>완료되지 않은 Transaction의 변경 내용을 이전 상태로 되돌리는 작업</mark>입니다.

예를 들어 다음 Transaction이 있다고 가정합니다.

```text
T1 시작
↓
SALARY
3000 → 4000
↓
장애 발생
↓
COMMIT 없음
```

T1은 정상적으로 완료되지 않았습니다.

따라서 복구 과정에서는 이전 값인 3000으로 되돌려야 합니다.

```text
4000
→ 3000
```

이것이 UNDO입니다.

```text
미완료 Transaction
→ UNDO
```

## REDO

`REDO`는 <mark>정상적으로 COMMIT된 Transaction의 변경 내용을 다시 반영하는 작업</mark>입니다.

예를 들어

```text
T2 시작
↓
SALARY
3000 → 4000
↓
COMMIT
↓
장애 발생
```

COMMIT까지 완료되었다면 결과는 유지되어야 합니다.

하지만 실제 데이터 파일에 변경 내용이 완전히 반영되기 전에 장애가 발생할 수도 있습니다.

이 경우 Log를 이용해 변경 내용을 다시 적용합니다.

```text
3000
→ 4000
```

이것이 REDO입니다.

```text
COMMIT 완료
→ REDO 필요 가능
```

## UNDO와 REDO 비교

| 구분 | UNDO | REDO |
| --- | --- | --- |
| 의미 | 변경 취소 | 변경 재반영 |
| 대상 | 미완료 Transaction | 완료된 Transaction |
| 사용 값 | 이전 값 | 새 값 |
| 목적 | 잘못 남은 변경 제거 | 확정된 변경 보존 |

```text
COMMIT 안 됨
→ UNDO
```

```text
COMMIT 됨
→ REDO
```

시험에서는 이 구분이 매우 중요합니다.

## Checkpoint

Log는 시간이 지날수록 계속 쌓입니다.

장애가 발생할 때마다 처음부터 모든 Log를 검사하면 복구 시간이 너무 길어질 수 있습니다.

그래서 일정 시점에 `Checkpoint`를 둡니다.

```text
Log
Log
Log
Checkpoint
Log
Log
장애
```

복구 시 Checkpoint를 기준으로 필요한 Transaction과 Log를 중심으로 확인할 수 있습니다.

```text
전체 Log 처음부터 검사
→ 비효율적

Checkpoint 기준으로 검사
→ 복구 시간 감소
```

## Checkpoint의 목적

Checkpoint의 핵심 목적은 <mark>복구 시 확인해야 하는 범위를 줄이는 것</mark>입니다.

```text
Checkpoint
→ 복구 시작 범위 축소
→ Recovery 시간 감소
```

Checkpoint 자체가 장애를 막는 것은 아닙니다.

또한 Checkpoint를 만든다고 Log가 필요 없어지는 것도 아닙니다.

```text
Checkpoint
≠ 복구 자체

Checkpoint
→ 복구를 빠르게 돕는 기준점
```

## 장애 상황 예시

다음과 같은 실행 흐름을 생각해보겠습니다.

```text
Checkpoint
↓
T1 시작
↓
T1 변경
↓
T1 COMMIT
↓
T2 시작
↓
T2 변경
↓
장애 발생
```

장애 시점에서 상태는 다음과 같습니다.

| Transaction | 상태 | 복구 방향 |
| --- | --- | --- |
| T1 | COMMIT 완료 | REDO 대상이 될 수 있음 |
| T2 | COMMIT 미완료 | UNDO 대상 |

```text
T1
→ 완료
→ REDO

T2
→ 미완료
→ UNDO
```

## 왜 COMMIT된 Transaction도 REDO하는가

COMMIT은 논리적으로 Transaction이 성공했다는 의미입니다.

하지만 데이터베이스 시스템에서는 변경 내용이 메모리에 먼저 반영되고 실제 저장장치에는 나중에 기록될 수 있습니다.

```text
Transaction COMMIT
↓
변경 내용 일부가 메모리에 존재
↓
저장장치 반영 전 장애
```

이 경우 Durability를 지키기 위해 Log를 이용해 다시 반영할 수 있습니다.

```text
COMMIT된 결과
→ 장애 후에도 유지
→ REDO
```

## Recovery와 ACID

Recovery는 ACID 중 특히 `Atomicity`와 `Durability`와 밀접합니다.

### Atomicity

완료되지 않은 Transaction은 일부 변경만 남아서는 안 됩니다.

```text
미완료
→ UNDO
→ Atomicity 지원
```

### Durability

COMMIT된 Transaction의 결과는 장애 후에도 유지되어야 합니다.

```text
완료
→ REDO
→ Durability 지원
```

| ACID 성질 | Recovery와 연결 |
| --- | --- |
| Atomicity | 미완료 작업 UNDO |
| Durability | 완료 작업 REDO |

## 즉시 갱신과 지연 갱신

회복 문제에서는 데이터가 실제 데이터베이스에 언제 반영되는지도 중요합니다.

### 즉시 갱신

Transaction이 COMMIT되기 전에도 실제 데이터베이스에 변경 내용이 반영될 수 있습니다.

따라서 미완료 Transaction의 변경이 남을 수 있으므로 UNDO가 필요할 수 있습니다.

```text
즉시 갱신
→ UNDO 필요 가능
→ REDO 필요 가능
```

### 지연 갱신

Transaction이 COMMIT되기 전에는 실제 데이터베이스에 변경 내용을 반영하지 않는 방식입니다.

미완료 Transaction의 변경이 데이터베이스에 반영되지 않았으므로 일반적으로 UNDO가 필요하지 않습니다.

```text
지연 갱신
→ REDO 중심
```

## 즉시 갱신과 지연 갱신 비교

| 구분 | 즉시 갱신 | 지연 갱신 |
| --- | --- | --- |
| COMMIT 전 DB 반영 | 가능 | 하지 않음 |
| UNDO | 필요 가능 | 일반적으로 불필요 |
| REDO | 필요 가능 | 필요 가능 |

시험에서는 다음처럼 간단히 연결해 기억하면 됩니다.

```text
즉시 갱신
→ UNDO / REDO
```

```text
지연 갱신
→ REDO
```

## 장애 종류

데이터베이스 장애는 여러 형태로 발생할 수 있습니다.

### Transaction 장애

```text
잘못된 입력
연산 오류
제약조건 위반
```

특정 Transaction만 실패하는 경우입니다.

### 시스템 장애

```text
운영체제 오류
전원 장애
DBMS 비정상 종료
```

메모리의 내용이 손실될 수 있지만 저장장치 자체는 정상일 수 있습니다.

### 저장장치 장애

```text
디스크 손상
저장장치 오류
```

이 경우에는 Log뿐 아니라 Backup을 이용한 복구가 필요할 수 있습니다.

## Backup과 Recovery

Log와 Checkpoint만으로 모든 장애를 해결할 수 있는 것은 아닙니다.

저장장치 자체가 손상되었다면 Backup이 필요합니다.

```text
Backup
→ 과거 정상 데이터 복원
```

그 후 필요한 Log를 다시 적용할 수 있습니다.

```text
Backup 복원
↓
Log 적용
↓
Recovery
```

## 잘 놓치는 핵심

### 1. Log는 복구의 근거다

이전 값과 새 값, Transaction 상태 등을 기록해 UNDO와 REDO에 사용합니다.

### 2. Checkpoint는 복구 범위를 줄인다

장애를 방지하는 기능이 아니라 복구 시간을 줄이는 데 도움을 줍니다.

### 3. 미완료 Transaction은 UNDO

```text
COMMIT 없음
→ UNDO
```

### 4. 완료 Transaction은 REDO

```text
COMMIT 완료
→ REDO
```

### 5. WAL은 Log가 먼저다

```text
Log 기록
↓
Data 변경
```

순서를 기억합니다.

## 시험·면접

### 핵심 암기

```text
Log
→ 변경 기록
```

```text
Checkpoint
→ 복구 범위 축소
```

```text
UNDO
→ 미완료 Transaction 취소
```

```text
REDO
→ 완료 Transaction 재반영
```

```text
WAL
→ Log 먼저
→ Data 나중
```

### 시험 함정

Checkpoint 이후의 Transaction이라고 해서 모두 REDO하는 것은 아닙니다.

장애 시점에 COMMIT이 완료되었는지 여부를 확인해야 합니다.

또한 Checkpoint는 Backup과 같은 의미가 아닙니다.

### 면접 짧은 답변

Log는 Transaction의 변경 내역과 상태를 기록해 장애 발생 시 복구에 사용하는 정보입니다. Checkpoint는 복구할 때 확인해야 하는 Log 범위를 줄이기 위한 기준점입니다. 장애가 발생하면 COMMIT되지 않은 Transaction은 UNDO하고, COMMIT된 Transaction은 필요한 경우 REDO하여 Atomicity와 Durability를 보장합니다.

## 객관식 문제

### 문제 1 · Log

Log의 가장 중요한 역할은?

① Table 이름 변경  
② Transaction 변경 내역 기록  
③ 모든 Lock 제거  
④ Index 생성

<details markdown="1">
<summary>정답</summary>

②

Log는 Transaction의 변경 내역과 상태를 기록하여 장애 발생 시 복구에 사용합니다.

</details>

### 문제 2 · UNDO

장애 발생 시 COMMIT되지 않은 Transaction에 일반적으로 필요한 작업은?

① UNDO  
② GRANT  
③ CREATE  
④ SELECT

<details markdown="1">
<summary>정답</summary>

①

미완료 Transaction의 변경 내용은 UNDO하여 이전 상태로 되돌립니다.

</details>

### 문제 3 · REDO

COMMIT된 Transaction의 변경 내용이 저장장치에 완전히 반영되지 않은 상태에서 장애가 발생했다면?

① REDO  
② DROP  
③ REVOKE  
④ SAVEPOINT만 수행

<details markdown="1">
<summary>정답</summary>

①

COMMIT된 결과는 유지되어야 하므로 필요한 변경을 REDO합니다.

</details>

### 문제 4 · Checkpoint

Checkpoint의 대표적인 목적은?

① 모든 Transaction 삭제  
② 복구 시 확인해야 할 범위 감소  
③ 데이터베이스 정규화  
④ Deadlock 완전 제거

<details markdown="1">
<summary>정답</summary>

②

Checkpoint는 복구 시 처음부터 모든 Log를 조사하는 부담을 줄이는 기준점 역할을 합니다.

</details>

### 문제 5 · WAL

WAL의 기본 원칙으로 옳은 것은?

① 데이터를 먼저 바꾸고 Log는 기록하지 않는다.  
② Log를 먼저 기록한 뒤 실제 데이터를 변경한다.  
③ COMMIT 전에 Log를 삭제한다.  
④ Checkpoint를 만들면 Log가 필요 없다.

<details markdown="1">
<summary>정답</summary>

②

Write-Ahead Logging은 실제 데이터 변경보다 관련 Log를 먼저 안전하게 기록하는 원칙입니다.

</details>

## Log · Checkpoint · Recovery 전체 요약

| 개념 | 핵심 |
| --- | --- |
| Log | 변경 내역 기록 |
| WAL | Log 먼저, Data 나중 |
| Checkpoint | 복구 범위 축소 |
| UNDO | 미완료 Transaction 취소 |
| REDO | 완료 Transaction 재반영 |
| Recovery | 장애 후 정상 상태 복원 |

```text
장애 발생
↓
Log 확인
↓
Checkpoint 기준 확인
↓
미완료
→ UNDO
↓
완료
→ REDO
```

<blockquote class="prompt-danger">
<p>회복 문제에서는 장애 시점에 각 Transaction이 COMMIT되었는지를 먼저 확인한 뒤 UNDO와 REDO 대상을 구분합니다.</p>
</blockquote>

## 다음에 이을 글

**Index 개념**입니다.

데이터를 빠르게 찾기 위해 사용하는 Index의 구조와 장단점, 그리고 어떤 상황에서 성능 향상에 도움이 되는지 살펴봅니다.
