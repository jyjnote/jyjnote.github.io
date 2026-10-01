---
title: Log · Checkpoint · Recovery
date: 2026-09-18 23:59:00 +0900
slug: log-checkpoint-recovery
permalink: /posts/log-checkpoint-recovery/
categories: [CS, 데이터베이스]
tags: [Log, Checkpoint, Recovery, WAL, Undo, Redo, Transaction, Durability, 정보처리기사, NCS]
math: true
---

Log, Checkpoint, Recovery는 Transaction 실행 중 기록을 남기고 장애 발생 후 데이터베이스를 일관된 상태로 되돌리기 위한 회복 기법입니다.

이 글에서는 용어를 외우는 데서 끝내지 않고 Transaction의 시간 순서와 실제 결과를 연결해서 봅니다.

<blockquote class="prompt-info">
<p>한 줄: Log는 변경 기록, Checkpoint는 복구 기준점, Recovery는 Undo와 Redo를 이용한 장애 복구 과정입니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

Log = 기록 / Checkpoint = 기준점 / Recovery = Undo + Redo

</details>

## 실습 데이터 전체 보기

아래 실습 데이터베이스를 기준으로 예시를 설명합니다.

<div style="width:100%; overflow:hidden; border:1px solid var(--main-border-color,#ddd); border-radius:12px; margin:1rem 0;">
<iframe
  src="https://docs.google.com/spreadsheets/d/1mtu6pFcGyOfwpFizaJskfFD87GxyjAmB/preview"
  width="100%"
  height="500"
  style="border:0;"
  loading="lazy">
</iframe>
</div>

트랜잭션 예시에서는 다음 Table을 자주 사용합니다.

| Table | 핵심 Column | 역할 |
| --- | --- | --- |
| EMPLOYEE | EMP_ID, EMP_NAME, DEPT_ID, SALARY | 직원 |
| PRODUCT | PRODUCT_ID, PRODUCT_NAME, PRICE, STOCK | 상품 |
| ORDERS | ORDER_ID, CUSTOMER_ID, ORDER_DATE, STATUS | 주문 |
| ORDER_ITEM | ORDER_ID, PRODUCT_ID, QTY | 주문 상세 |

특히 재고 변경과 주문 상태 변경을 하나의 작업 단위로 묶는 예시를 자주 사용합니다.


## 왜 Recovery가 필요한가

Transaction 실행 중 시스템이 갑자기 중단될 수 있습니다.

```text
UPDATE 실행
↓
일부 Page 변경
↓
전원 장애
```

이때 COMMIT된 Transaction은 유지하고 미완료 Transaction은 정리해야 합니다.

## Log

DBMS는 데이터 변경에 대한 기록을 Log에 남깁니다.

개념적으로 다음 정보를 기록할 수 있습니다.

```text
Transaction ID
변경 대상
이전 값
새 값
COMMIT 여부
```

실제 Log 형식은 DBMS마다 다릅니다.

## Undo

COMMIT되지 않은 Transaction의 변경을 되돌리는 과정입니다.

```text
T1 UPDATE
→ 장애
→ T1 미확정
→ Undo
```

Atomicity와 연결됩니다.

## Redo

COMMIT은 되었지만 Data Page에 완전히 반영되지 않은 변경을 다시 적용할 수 있습니다.

```text
T2 COMMIT
→ 장애
→ Log에는 확정 기록
→ 필요한 변경 Redo
```

Durability와 연결됩니다.

## WAL

Write-Ahead Logging은 실제 Data Page를 디스크에 쓰기 전에 관련 Log를 먼저 안정적으로 기록하는 원칙입니다.

```text
Log 먼저
↓
Data Page 나중
```

이 원칙 덕분에 장애 후 Undo·Redo 판단이 가능합니다.

## Checkpoint

Checkpoint는 Recovery 시 확인해야 할 Log 범위를 줄이기 위한 기준점입니다.

```text
오래된 Log 전체 검사
↓
Checkpoint 이후 중심으로 복구
```

실제 Checkpoint 알고리즘은 DBMS마다 다릅니다.

## Checkpoint가 하는 일

Checkpoint 시점에는 DBMS가 현재 활성 Transaction과 Buffer 상태 등을 기록할 수 있습니다.

단순히 모든 Data Page를 무조건 디스크에 쓰는 것만을 의미하지는 않습니다.

현대 DBMS의 Fuzzy Checkpoint는 더 복잡한 방식으로 동작할 수 있습니다.

## Crash Recovery 흐름

개념적으로는 다음처럼 이해할 수 있습니다.

```text
1. 마지막 Checkpoint 확인
2. Log 분석
3. COMMIT Transaction 확인
4. 미완료 Transaction 확인
5. 필요한 Redo
6. 필요한 Undo
```

구체적인 순서는 Recovery 알고리즘에 따라 달라질 수 있습니다.

## Immediate Update

COMMIT 전에 변경된 Data Page가 디스크에 기록될 수 있는 방식에서는 Undo와 Redo가 모두 필요할 수 있습니다.

```text
미확정 변경
→ Undo

확정 변경 누락
→ Redo
```

## Deferred Update

변경을 COMMIT 이후에 실제 Database에 반영하는 개념적 방식에서는 미확정 변경이 Database에 없으므로 Undo 필요성이 줄 수 있습니다.

교재에서는 Immediate Update와 비교해서 자주 설명합니다.

## SQLite WAL

SQLite의 WAL 모드에서는 변경 내용이 WAL 파일에 먼저 기록되고 Checkpoint를 통해 메인 Database 파일로 반영됩니다.

```text
Database
+
WAL
+
Checkpoint
```

SQLite의 WAL은 일반적인 서버형 DBMS의 WAL과 목적은 비슷하지만 구현 세부는 다릅니다.

## Recovery와 ACID

Recovery는 ACID 중 특히 다음과 연결됩니다.

```text
Atomicity
→ 미완료 변경 Undo

Durability
→ 확정 변경 Redo
```

Consistency는 Recovery 이후 무결성 있는 상태로 돌아가는 결과와도 연결됩니다.

## 다른 개념과 비교

### 비교 1. Log

```text
Log
→ 변경 기록
```

`Log · Checkpoint · Recovery`과 비교할 때는 **언제 발생하는지**, **무엇을 보호하는지**, **실패 시 어떻게 처리하는지**를 함께 봅니다.

### 비교 2. Checkpoint

```text
Checkpoint
→ 복구 기준점
```

`Log · Checkpoint · Recovery`과 비교할 때는 **언제 발생하는지**, **무엇을 보호하는지**, **실패 시 어떻게 처리하는지**를 함께 봅니다.

### 비교 3. Undo

```text
Undo
→ 미완료 취소
```

`Log · Checkpoint · Recovery`과 비교할 때는 **언제 발생하는지**, **무엇을 보호하는지**, **실패 시 어떻게 처리하는지**를 함께 봅니다.

### 비교 4. Redo

```text
Redo
→ 확정 변경 재적용
```

`Log · Checkpoint · Recovery`과 비교할 때는 **언제 발생하는지**, **무엇을 보호하는지**, **실패 시 어떻게 처리하는지**를 함께 봅니다.

## 구체적인 예시 연습

### 예시 1. Log

상황은 다음과 같습니다.

```text
변경 전후 값
```

핵심 판단:

```text
복구 기록
```

`Log · Checkpoint · Recovery`에서는 시간 순서를 직접 적어보면 문제를 훨씬 쉽게 풀 수 있습니다.

특히 두 Transaction이 등장하면 `T1`, `T2`의 Read·Write·COMMIT 순서를 세로로 나누어 확인합니다.

### 예시 2. Undo

상황은 다음과 같습니다.

```text
미COMMIT
```

핵심 판단:

```text
되돌림
```

`Log · Checkpoint · Recovery`에서는 시간 순서를 직접 적어보면 문제를 훨씬 쉽게 풀 수 있습니다.

특히 두 Transaction이 등장하면 `T1`, `T2`의 Read·Write·COMMIT 순서를 세로로 나누어 확인합니다.

### 예시 3. Redo

상황은 다음과 같습니다.

```text
COMMIT 완료
```

핵심 판단:

```text
재적용
```

`Log · Checkpoint · Recovery`에서는 시간 순서를 직접 적어보면 문제를 훨씬 쉽게 풀 수 있습니다.

특히 두 Transaction이 등장하면 `T1`, `T2`의 Read·Write·COMMIT 순서를 세로로 나누어 확인합니다.

### 예시 4. WAL

상황은 다음과 같습니다.

```text
Log 먼저
```

핵심 판단:

```text
Data Page 나중
```

`Log · Checkpoint · Recovery`에서는 시간 순서를 직접 적어보면 문제를 훨씬 쉽게 풀 수 있습니다.

특히 두 Transaction이 등장하면 `T1`, `T2`의 Read·Write·COMMIT 순서를 세로로 나누어 확인합니다.

### 예시 5. Checkpoint

상황은 다음과 같습니다.

```text
복구 기준점
```

핵심 판단:

```text
탐색 범위 축소
```

`Log · Checkpoint · Recovery`에서는 시간 순서를 직접 적어보면 문제를 훨씬 쉽게 풀 수 있습니다.

특히 두 Transaction이 등장하면 `T1`, `T2`의 Read·Write·COMMIT 순서를 세로로 나누어 확인합니다.

### 예시 6. Crash

상황은 다음과 같습니다.

```text
시스템 중단
```

핵심 판단:

```text
Analysis/Undo/Redo
```

`Log · Checkpoint · Recovery`에서는 시간 순서를 직접 적어보면 문제를 훨씬 쉽게 풀 수 있습니다.

특히 두 Transaction이 등장하면 `T1`, `T2`의 Read·Write·COMMIT 순서를 세로로 나누어 확인합니다.

## 시간 순서 판별 연습

### 판별 1

상황:

```text
Log 기록 → 변경 → COMMIT 여부 → Crash → Undo/Redo 판단
```

판단 순서:

```text
1. 누가 먼저 읽거나 쓰는가
2. COMMIT 여부는 무엇인가
3. 다른 Transaction이 어떤 값을 보는가
4. 최종 상태가 무엇인가
```

시간 순서를 적으면 용어 암기보다 훨씬 정확하게 판단할 수 있습니다.

### 판별 2

상황:

```text
Log 기록 → 변경 → COMMIT 여부 → Crash → Undo/Redo 판단
```

판단 순서:

```text
1. 누가 먼저 읽거나 쓰는가
2. COMMIT 여부는 무엇인가
3. 다른 Transaction이 어떤 값을 보는가
4. 최종 상태가 무엇인가
```

시간 순서를 적으면 용어 암기보다 훨씬 정확하게 판단할 수 있습니다.

### 판별 3

상황:

```text
Log 기록 → 변경 → COMMIT 여부 → Crash → Undo/Redo 판단
```

판단 순서:

```text
1. 누가 먼저 읽거나 쓰는가
2. COMMIT 여부는 무엇인가
3. 다른 Transaction이 어떤 값을 보는가
4. 최종 상태가 무엇인가
```

시간 순서를 적으면 용어 암기보다 훨씬 정확하게 판단할 수 있습니다.

### 판별 4

상황:

```text
Log 기록 → 변경 → COMMIT 여부 → Crash → Undo/Redo 판단
```

판단 순서:

```text
1. 누가 먼저 읽거나 쓰는가
2. COMMIT 여부는 무엇인가
3. 다른 Transaction이 어떤 값을 보는가
4. 최종 상태가 무엇인가
```

시간 순서를 적으면 용어 암기보다 훨씬 정확하게 판단할 수 있습니다.

### 판별 5

상황:

```text
Log 기록 → 변경 → COMMIT 여부 → Crash → Undo/Redo 판단
```

판단 순서:

```text
1. 누가 먼저 읽거나 쓰는가
2. COMMIT 여부는 무엇인가
3. 다른 Transaction이 어떤 값을 보는가
4. 최종 상태가 무엇인가
```

시간 순서를 적으면 용어 암기보다 훨씬 정확하게 판단할 수 있습니다.

### 판별 6

상황:

```text
Log 기록 → 변경 → COMMIT 여부 → Crash → Undo/Redo 판단
```

판단 순서:

```text
1. 누가 먼저 읽거나 쓰는가
2. COMMIT 여부는 무엇인가
3. 다른 Transaction이 어떤 값을 보는가
4. 최종 상태가 무엇인가
```

시간 순서를 적으면 용어 암기보다 훨씬 정확하게 판단할 수 있습니다.

### 판별 7

상황:

```text
Log 기록 → 변경 → COMMIT 여부 → Crash → Undo/Redo 판단
```

판단 순서:

```text
1. 누가 먼저 읽거나 쓰는가
2. COMMIT 여부는 무엇인가
3. 다른 Transaction이 어떤 값을 보는가
4. 최종 상태가 무엇인가
```

시간 순서를 적으면 용어 암기보다 훨씬 정확하게 판단할 수 있습니다.

### 판별 8

상황:

```text
Log 기록 → 변경 → COMMIT 여부 → Crash → Undo/Redo 판단
```

판단 순서:

```text
1. 누가 먼저 읽거나 쓰는가
2. COMMIT 여부는 무엇인가
3. 다른 Transaction이 어떤 값을 보는가
4. 최종 상태가 무엇인가
```

시간 순서를 적으면 용어 암기보다 훨씬 정확하게 판단할 수 있습니다.

### 판별 9

상황:

```text
Log 기록 → 변경 → COMMIT 여부 → Crash → Undo/Redo 판단
```

판단 순서:

```text
1. 누가 먼저 읽거나 쓰는가
2. COMMIT 여부는 무엇인가
3. 다른 Transaction이 어떤 값을 보는가
4. 최종 상태가 무엇인가
```

시간 순서를 적으면 용어 암기보다 훨씬 정확하게 판단할 수 있습니다.

### 판별 10

상황:

```text
Log 기록 → 변경 → COMMIT 여부 → Crash → Undo/Redo 판단
```

판단 순서:

```text
1. 누가 먼저 읽거나 쓰는가
2. COMMIT 여부는 무엇인가
3. 다른 Transaction이 어떤 값을 보는가
4. 최종 상태가 무엇인가
```

시간 순서를 적으면 용어 암기보다 훨씬 정확하게 판단할 수 있습니다.

## 자주 하는 실수

### 실수 1. COMMIT되지 않은 상태와 COMMIT된 상태를 구분하지 않는다.

이 실수를 피하려면 다음 순서로 봅니다.

```text
Transaction 상태
→ Read / Write
→ COMMIT 여부
→ Lock 보유·대기
→ 최종 결과
```

`Log · Checkpoint · Recovery` 문제에서는 시간 순서를 생략하지 않는 것이 가장 중요합니다.

### 실수 2. Lock 대기와 Deadlock을 같은 것으로 본다.

이 실수를 피하려면 다음 순서로 봅니다.

```text
Transaction 상태
→ Read / Write
→ COMMIT 여부
→ Lock 보유·대기
→ 최종 결과
```

`Log · Checkpoint · Recovery` 문제에서는 시간 순서를 생략하지 않는 것이 가장 중요합니다.

### 실수 3. Isolation Level 이름만 보고 모든 DBMS가 동일하게 동작한다고 생각한다.

이 실수를 피하려면 다음 순서로 봅니다.

```text
Transaction 상태
→ Read / Write
→ COMMIT 여부
→ Lock 보유·대기
→ 최종 결과
```

`Log · Checkpoint · Recovery` 문제에서는 시간 순서를 생략하지 않는 것이 가장 중요합니다.

### 실수 4. Dirty Read와 Non-repeatable Read를 같은 현상으로 본다.

이 실수를 피하려면 다음 순서로 봅니다.

```text
Transaction 상태
→ Read / Write
→ COMMIT 여부
→ Lock 보유·대기
→ 최종 결과
```

`Log · Checkpoint · Recovery` 문제에서는 시간 순서를 생략하지 않는 것이 가장 중요합니다.

### 실수 5. 2PL이 Deadlock까지 제거한다고 생각한다.

이 실수를 피하려면 다음 순서로 봅니다.

```text
Transaction 상태
→ Read / Write
→ COMMIT 여부
→ Lock 보유·대기
→ 최종 결과
```

`Log · Checkpoint · Recovery` 문제에서는 시간 순서를 생략하지 않는 것이 가장 중요합니다.

### 실수 6. Checkpoint가 모든 Log를 없애는 기능이라고 생각한다.

이 실수를 피하려면 다음 순서로 봅니다.

```text
Transaction 상태
→ Read / Write
→ COMMIT 여부
→ Lock 보유·대기
→ 최종 결과
```

`Log · Checkpoint · Recovery` 문제에서는 시간 순서를 생략하지 않는 것이 가장 중요합니다.

## 잘 놓치는 핵심

### 1. 왜 Recovery가 필요한가

Transaction 실행 중 시스템이 갑자기 중단될 수 있습니다.

이 항목은 시험에서 비슷한 용어와 바꾸어 출제될 수 있으므로 시간 순서와 상태 변화를 함께 확인합니다.

### 2. Log

DBMS는 데이터 변경에 대한 기록을 Log에 남깁니다.

이 항목은 시험에서 비슷한 용어와 바꾸어 출제될 수 있으므로 시간 순서와 상태 변화를 함께 확인합니다.

### 3. Undo

COMMIT되지 않은 Transaction의 변경을 되돌리는 과정입니다.

이 항목은 시험에서 비슷한 용어와 바꾸어 출제될 수 있으므로 시간 순서와 상태 변화를 함께 확인합니다.

### 4. Redo

COMMIT은 되었지만 Data Page에 완전히 반영되지 않은 변경을 다시 적용할 수 있습니다.

이 항목은 시험에서 비슷한 용어와 바꾸어 출제될 수 있으므로 시간 순서와 상태 변화를 함께 확인합니다.

### 5. WAL

Write-Ahead Logging은 실제 Data Page를 디스크에 쓰기 전에 관련 Log를 먼저 안정적으로 기록하는 원칙입니다.

이 항목은 시험에서 비슷한 용어와 바꾸어 출제될 수 있으므로 시간 순서와 상태 변화를 함께 확인합니다.

### 6. Checkpoint

Checkpoint는 Recovery 시 확인해야 할 Log 범위를 줄이기 위한 기준점입니다.

이 항목은 시험에서 비슷한 용어와 바꾸어 출제될 수 있으므로 시간 순서와 상태 변화를 함께 확인합니다.

## 시험·면접

### 핵심 암기

```text
Log = 기록 / Checkpoint = 기준점 / Recovery = Undo + Redo
```

### 시험 접근 순서

```text
1. Transaction 시작점 확인
2. Read와 Write 순서 확인
3. COMMIT 여부 확인
4. Lock 또는 Isolation 확인
5. 다른 Transaction이 보는 값 확인
6. 최종 상태 확인
```

### 시험 함정

같은 용어라도 실제 DBMS의 구현에 따라 세부 동작이 달라질 수 있습니다.

시험에서는 문제에서 제시한 표준 정의를 우선하고, 실무에서는 사용하는 DBMS의 실제 구현을 확인합니다.

### 면접에서 짧게 답한다면

Log, Checkpoint, Recovery는 Transaction 실행 중 기록을 남기고 장애 발생 후 데이터베이스를 일관된 상태로 되돌리기 위한 회복 기법입니다.

핵심은 데이터 일관성을 유지하면서 동시에 여러 작업을 안전하게 처리하고, 장애가 발생해도 정상 상태로 복구하는 것입니다.

## 예시로 한 바퀴

`Log · Checkpoint · Recovery` 문제를 만나면 다음처럼 시간을 세로로 적습니다.

```text
시간 ↓

T1                T2
Read
                  Read
Write
                  Write
COMMIT
                  COMMIT
```

그다음 미확정 값, Lock 대기, 반복 조회 결과, 최종 반영 여부를 하나씩 확인합니다.

이 방식은 Isolation Level, Deadlock, Recovery 문제에도 그대로 사용할 수 있습니다.

## 객관식 문제

### 1. Undo 대상은?

① 미완료 Transaction  
② 항상 Table 삭제  
③ 항상 Index 생성  
④ 모든 Lock 해제 금지

<details>
<summary>정답</summary>

①

</details>

해설: `미완료 Transaction`가 핵심입니다.

### 2. Redo 대상은?

① 확정됐지만 반영이 필요한 변경  
② 항상 Table 삭제  
③ 항상 Index 생성  
④ 모든 Lock 해제 금지

<details>
<summary>정답</summary>

①

</details>

해설: `확정됐지만 반영이 필요한 변경`가 핵심입니다.

### 3. Checkpoint 목적은?

① 복구 범위 축소  
② 항상 Table 삭제  
③ 항상 Index 생성  
④ 모든 Lock 해제 금지

<details>
<summary>정답</summary>

①

</details>

해설: `복구 범위 축소`가 핵심입니다.

### 4. DBMS별 차이를 확인해야 하는 이유는?

① 동일 용어라도 구현이 다를 수 있어서  
② 항상 Table 삭제  
③ 항상 Index 생성  
④ 모든 Lock 해제 금지

<details>
<summary>정답</summary>

①

</details>

해설: `동일 용어라도 구현이 다를 수 있어서`가 핵심입니다.

### 5. 동시성 문제를 풀 때 가장 먼저 볼 것은?

① Transaction 실행 순서  
② 항상 Table 삭제  
③ 항상 Index 생성  
④ 모든 Lock 해제 금지

<details>
<summary>정답</summary>

①

</details>

해설: `Transaction 실행 순서`가 핵심입니다.

### 6. 장애 복구와 밀접한 ACID 속성은?

① Atomicity와 Durability  
② 항상 Table 삭제  
③ 항상 Index 생성  
④ 모든 Lock 해제 금지

<details>
<summary>정답</summary>

①

</details>

해설: `Atomicity와 Durability`가 핵심입니다.

### 7. 동시성 제어와 밀접한 ACID 속성은?

① Isolation  
② 항상 Table 삭제  
③ 항상 Index 생성  
④ 모든 Lock 해제 금지

<details>
<summary>정답</summary>

①

</details>

해설: `Isolation`가 핵심입니다.

### 8. COMMIT 전 변경은?

① 아직 확정되지 않은 상태  
② 항상 Table 삭제  
③ 항상 Index 생성  
④ 모든 Lock 해제 금지

<details>
<summary>정답</summary>

①

</details>

해설: `아직 확정되지 않은 상태`가 핵심입니다.

## 다음에 이을 글

**Index · Query Optimization**입니다.

트랜잭션과 회복 파트를 마치고 Index와 Query 최적화 영역으로 이어갑니다.
