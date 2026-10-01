---
title: 동시성 제어 · Concurrency Control
date: 2026-10-02 08:15:00 +0900
slug: concurrency-control
permalink: /posts/concurrency-control/
categories: [CS, 데이터베이스]
tags: [ConcurrencyControl, 동시성제어, Transaction, Lock, Isolation, Deadlock, 정보처리기사, NCS]
math: true
---

`동시성 제어`는 <mark>여러 Transaction이 동시에 같은 데이터에 접근할 때 충돌을 막고 데이터의 일관성을 유지하는 기법</mark>입니다.

동시에 실행되는 Transaction의 처리 순서를 적절히 제어해 잘못된 결과가 발생하지 않도록 합니다.

<blockquote class="prompt-info">
<p>한 줄: 동시성 제어는 여러 Transaction이 동시에 실행되어도 데이터가 꼬이지 않도록 제어하는 것입니다.</p>
</blockquote>

<details markdown="1">
<summary>한 줄로</summary>

동시 실행의 성능은 살리면서 데이터의 정확성과 일관성을 유지하는 것이 동시성 제어의 목적입니다.

</details>

## 왜 필요한가

여러 사용자가 동시에 데이터베이스를 사용한다고 가정합니다.

같은 계좌 잔액을 두 Transaction이 동시에 변경하면 문제가 발생할 수 있습니다.

### 입력 Table · ACCOUNT

| ACCOUNT_ID | BALANCE |
| --- | ---: |
| A | 10000 |

두 Transaction이 거의 동시에 실행됩니다.

```text
Transaction 1
→ A 계좌에서 3000원 출금

Transaction 2
→ A 계좌에서 2000원 출금
```

정상적인 최종 잔액은 다음과 같아야 합니다.

```text
10000
- 3000
- 2000
=
5000
```

하지만 두 Transaction이 모두 처음 잔액인 10000을 읽고 각각 계산하면 잘못된 결과가 저장될 수 있습니다.

## 갱신 손실

대표적인 동시성 문제 중 하나는 `갱신 손실`입니다.

### 처리 과정

```text
Transaction 1
→ BALANCE = 10000 읽음
→ 3000원 차감
→ 7000 계산
```

```text
Transaction 2
→ BALANCE = 10000 읽음
→ 2000원 차감
→ 8000 계산
```

이후 Transaction 1이 7000을 저장하고 Transaction 2가 8000을 저장하면

```text
최종 BALANCE
→ 8000
```

이 되어 Transaction 1의 변경 내용이 사라집니다.

### 잘못된 결과

| ACCOUNT_ID | BALANCE |
| --- | ---: |
| A | 8000 |

실제로는 5000이 되어야 하므로 데이터가 잘못되었습니다.

```text
한 Transaction의 수정 결과가
다른 Transaction에 의해 덮어쓰기
→ 갱신 손실
```

## 동시성 제어의 목적

동시성 제어는 크게 두 가지를 함께 만족시키는 것이 목표입니다.

```text
동시 실행
→ 성능 향상
```

```text
정확한 결과
→ 데이터 일관성 유지
```

즉, 모든 Transaction을 무조건 한 줄로 세워 순차 처리하는 것이 아니라 가능한 범위에서는 동시에 실행하면서 충돌이 발생하는 부분만 제어합니다.

## 직렬 실행

Transaction을 하나씩 순서대로 실행하는 방식입니다.

```text
Transaction 1
↓
완료
↓
Transaction 2
↓
완료
```

충돌 문제는 줄어들지만 동시에 처리할 수 없으므로 성능이 떨어질 수 있습니다.

## 병행 실행

여러 Transaction을 동시에 진행합니다.

```text
Transaction 1
→ 실행 중

Transaction 2
→ 실행 중
```

처리량은 높일 수 있지만 같은 데이터에 접근하면 충돌이 발생할 수 있습니다.

```text
성능
↑

충돌 가능성
↑
```

따라서 병행 실행에서는 동시성 제어가 중요합니다.

## 직렬 가능성

동시에 실행된 Transaction의 결과가 어떤 직렬 실행 순서와 동일하다면 안전한 실행으로 볼 수 있습니다.

예를 들어

```text
Transaction 1
→ Transaction 2
```

순서대로 실행한 결과와 병행 실행의 결과가 같다면 데이터의 논리적 일관성을 유지한 것으로 볼 수 있습니다.

```text
병행 실행 결과
=
어떤 직렬 실행 결과
```

이런 성질을 `직렬 가능성`이라고 합니다.

## 대표적인 동시성 문제

동시성 제어가 제대로 되지 않으면 여러 문제가 발생할 수 있습니다.

| 문제 | 핵심 |
| --- | --- |
| 갱신 손실 | 한 Transaction의 변경이 다른 Transaction에 의해 사라짐 |
| Dirty Read | 확정되지 않은 데이터를 읽음 |
| Non-repeatable Read | 같은 Row를 다시 읽었는데 값이 달라짐 |
| Phantom Read | 같은 조건으로 다시 조회했는데 Row 집합이 달라짐 |

`Dirty Read`, `Non-repeatable Read`, `Phantom Read`는 별도 글에서 자세히 다룹니다.

## 동시성 제어 방법

대표적인 방법은 다음과 같습니다.

```text
Lock
2PL
Isolation Level
Timestamp
MVCC
```

이 중 시험에서 자주 등장하는 것은 Lock과 2PL입니다.

## Lock

`Lock`은 특정 데이터에 접근할 수 있는 권한을 잠시 제한하는 방식입니다.

```text
Transaction 1
→ 데이터 Lock 획득
→ 수정
→ Lock 해제
```

그동안 충돌하는 다른 Transaction은 기다리게 할 수 있습니다.

```text
같은 데이터에 대한 충돌
→ Lock으로 제어
```

Lock의 종류와 동작은 다음 글에서 자세히 다룹니다.

## 2PL

`2PL`은 Lock을 획득하는 단계와 해제하는 단계를 나누는 방식입니다.

```text
Lock 획득 단계
↓
Lock 해제 단계
```

Transaction의 직렬 가능성을 보장하기 위해 사용되는 대표적인 동시성 제어 방법입니다.

세부 규칙은 `Lock · 2PL` 글에서 다룹니다.

## Isolation Level

Isolation Level은 Transaction 사이를 어느 정도까지 격리할지 정하는 기준입니다.

```text
격리 강함
→ 동시성 낮아질 수 있음

격리 약함
→ 동시성 높음
→ 이상 현상 가능성 증가
```

즉, 정확성과 성능 사이의 균형을 조절합니다.

## Deadlock과의 관계

Lock을 사용하면 두 Transaction이 서로 상대방의 Lock 해제를 기다리는 상황이 발생할 수 있습니다.

```text
Transaction 1
→ Transaction 2가 가진 Lock 기다림

Transaction 2
→ Transaction 1이 가진 Lock 기다림
```

서로 계속 기다리면 `Deadlock`이 발생합니다.

따라서 동시성 제어는 단순히 Lock을 거는 것뿐 아니라 Deadlock 처리까지 함께 고려해야 합니다.

<blockquote class="prompt-warning">
<p>동시성 제어는 충돌을 막는 대신 대기 시간이나 Deadlock 같은 비용이 발생할 수 있습니다.</p>
</blockquote>

## 동시성 제어와 Isolation

ACID의 `Isolation`과 동시성 제어는 밀접하게 연결됩니다.

```text
Isolation
→ 동시에 실행되는 Transaction의 간섭 최소화
```

```text
동시성 제어
→ Isolation을 실제로 구현하기 위한 여러 기법
```

즉, Isolation은 지켜야 할 성질이고 Lock, 2PL 같은 것은 이를 달성하기 위한 방법이라고 볼 수 있습니다.

## 동시성 제어와 무조건 순차 실행의 차이

모든 Transaction을 하나씩만 실행하면 충돌은 줄어듭니다.

하지만 시스템 처리량이 크게 떨어질 수 있습니다.

```text
완전 순차 실행
→ 안전성 높음
→ 성능 낮음
```

```text
적절한 병행 실행
→ 성능 높음
→ 동시성 제어 필요
```

동시성 제어의 핵심은 병행 처리의 장점을 살리면서 데이터 오류를 막는 것입니다.

## 잘 놓치는 핵심

### 1. 동시성 제어의 목적은 병행 실행 자체를 막는 것이 아니다

가능한 한 동시에 처리하면서 충돌을 제어하는 것이 목적입니다.

### 2. 갱신 손실은 덮어쓰기 문제다

한 Transaction의 수정 결과가 다른 Transaction에 의해 사라지는 상황입니다.

### 3. Isolation과 연결된다

ACID의 격리성을 실제로 보장하기 위한 여러 제어 방법이 사용됩니다.

### 4. Lock은 장점만 있는 것이 아니다

대기와 Deadlock이 발생할 수 있습니다.

## 시험·면접

### 핵심 암기

```text
동시성 제어
→ 병행 실행 시 데이터 일관성 유지
```

```text
대표 문제
→ 갱신 손실
→ Dirty Read
→ Non-repeatable Read
→ Phantom Read
```

```text
대표 방법
→ Lock
→ 2PL
→ Isolation Level
```

### 시험 함정

동시성 제어는 Transaction을 무조건 순차 실행시키는 기술이라고 보면 안 됩니다.

병행 실행의 성능을 유지하면서 충돌로 인한 데이터 오류를 막는 것이 핵심입니다.

### 면접 짧은 답변

동시성 제어는 여러 Transaction이 동시에 같은 데이터에 접근할 때 갱신 손실이나 잘못된 읽기 같은 문제가 발생하지 않도록 실행 순서와 접근을 제어하는 기법입니다. 대표적으로 Lock, 2PL, Isolation Level 등이 있으며, 병행 처리의 성능을 유지하면서 데이터 일관성과 격리성을 보장하는 것이 목적입니다.

## 객관식 문제

### 문제 1 · 목적

동시성 제어의 가장 중요한 목적은?

① 모든 Transaction을 삭제  
② 병행 실행 중 데이터 일관성 유지  
③ 모든 Table을 하나로 통합  
④ Index를 제거

<details markdown="1">
<summary>정답</summary>

②

여러 Transaction이 동시에 실행될 때 충돌을 제어하여 데이터 일관성을 유지하는 것이 목적입니다.

</details>

### 문제 2 · 갱신 손실

한 Transaction의 수정 결과가 다른 Transaction에 의해 덮어써져 사라지는 문제는?

① 갱신 손실  
② 삽입 이상  
③ 삭제 이상  
④ 반정규화

<details markdown="1">
<summary>정답</summary>

①

한 Transaction의 갱신 결과가 다른 갱신에 의해 사라지는 현상을 갱신 손실이라고 합니다.

</details>

### 문제 3 · Lock

Lock의 역할로 가장 적절한 것은?

① 데이터를 영구 삭제  
② 충돌하는 데이터 접근을 제한  
③ 모든 Transaction을 COMMIT  
④ Table 구조 변경

<details markdown="1">
<summary>정답</summary>

②

Lock은 특정 데이터에 대한 접근을 제한하여 Transaction 간 충돌을 제어합니다.

</details>

### 문제 4 · Isolation

동시성 제어와 가장 밀접한 ACID 성질은?

① Atomicity  
② Consistency  
③ Isolation  
④ Durability

<details markdown="1">
<summary>정답</summary>

③

여러 Transaction이 서로 간섭하지 않도록 하는 Isolation과 동시성 제어가 밀접하게 연결됩니다.

</details>

### 문제 5 · Deadlock

Lock을 사용하는 과정에서 두 Transaction이 서로 상대방의 Lock을 기다리는 상태는?

① Commit  
② Savepoint  
③ Deadlock  
④ Normalization

<details markdown="1">
<summary>정답</summary>

③

서로 상대방이 가진 자원을 기다리며 진행하지 못하는 상태를 Deadlock이라고 합니다.

</details>

## 동시성 제어 전체 요약

### 충돌 상황

```text
Transaction 1
→ 같은 데이터 수정

Transaction 2
→ 같은 데이터 수정
```

### 제어하지 않으면

```text
갱신 손실
Dirty Read
Non-repeatable Read
Phantom Read
```

### 제어 방법

```text
Lock
2PL
Isolation Level
```

```text
병행 실행
+
충돌 제어
=
동시성 제어
```

<blockquote class="prompt-danger">
<p>동시성 제어 문제에서는 여러 Transaction이 같은 데이터에 동시에 접근하는지와 그 결과가 일관성을 깨뜨리는지를 먼저 확인합니다.</p>
</blockquote>

## 다음에 이을 글

**Lock · 2PL**입니다.

공유 Lock과 배타 Lock, 그리고 Lock 획득과 해제 단계를 나누는 2단계 Locking Protocol을 살펴봅니다.
