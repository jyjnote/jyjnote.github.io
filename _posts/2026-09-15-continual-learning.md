---
title: 지속학습
date: 2026-09-15 01:00:00 +0900
slug: continual-learning
permalink: /posts/continual-learning/
categories: [AI, 딥러닝, 학습 패러다임]
tags: [지속학습, Continual Learning, Catastrophic Forgetting, Replay, EWC, Incremental Learning]
math: true
---

지속학습(Continual Learning)은 **시간에 따라 새로운 데이터나 Task를 계속 학습하면서 기존에 배운 지식을 최대한 유지하는 학습 방식**입니다.  

<blockquote class="prompt-info">
<p>한 줄: 새로운 것을 계속 배우면서 예전에 배운 것을 잊지 않도록 학습하는 방법입니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

순차적으로 들어오는 새로운 Task나 데이터를 학습하면서 기존 지식의 성능 저하를 최소화합니다.

</details>

## 왜 필요한가
일반적인 머신러닝은 학습 데이터를 한 번에 모아 학습하는 경우가 많습니다.

```text
전체 데이터
↓
한 번에 학습
↓
완성된 모델
```

하지만 실제 환경에서는 새로운 데이터가 계속 들어옵니다.
예를 들면
- 새로운 사용자 행동
- 새로운 상품
- 새로운 문서
- 새로운 클래스
- 시간에 따라 변하는 데이터 분포
등이 있습니다.
<mark>지속학습의 핵심은 새로운 지식을 배우는 동시에 기존 지식을 유지하는 것입니다.</mark>
## 기본 아이디어
모델이 먼저 Task A를 학습했다고 하겠습니다.

```text
Task A
↓
모델 학습
```

이후 Task B가 들어옵니다.

```text
Task A 학습 완료
↓
Task B 학습
```

문제는 Task B를 학습하면서 Task A의 성능이 크게 떨어질 수 있다는 점입니다.
## Catastrophic Forgetting
Catastrophic Forgetting은 **새로운 데이터를 학습하면서 이전에 학습한 지식이 급격히 사라지는 현상**입니다.
예를 들어 모델이 먼저 고양이와 강아지를 학습했다고 하겠습니다.

```text
Task 1
고양이
강아지
```

그다음 자동차와 자전거를 학습합니다.

```text
Task 2
자동차
자전거
```

Task 2만 계속 학습하면 기존 고양이와 강아지 분류 성능이 크게 떨어질 수 있습니다.

<blockquote class="prompt-warning">
<p>지속학습의 가장 대표적인 문제는 새로운 지식을 배우면서 기존 지식을 잊는 Catastrophic Forgetting입니다.</p>
</blockquote>

## Stability-Plasticity Dilemma
지속학습에서 매우 중요한 개념입니다.
모델은 두 가지 능력을 동시에 가져야 합니다.
- Stability: 기존 지식을 유지하는 능력
- Plasticity: 새로운 지식을 학습하는 능력
<mark>지속학습은 Stability와 Plasticity 사이의 균형을 찾는 문제입니다.</mark>
## 기본 학습 흐름

```text
Task 1 학습
↓
기존 지식 유지
↓
Task 2 학습
↓
기존 지식 유지
↓
Task 3 학습
↓
...
```

새로운 Task가 들어올 때마다 이전 지식을 최대한 보존하면서 모델을 업데이트합니다.
## Incremental Learning
지속학습은 Incremental Learning과 함께 자주 언급됩니다.
- Task-Incremental Learning
- Domain-Incremental Learning
- Class-Incremental Learning
## Task-Incremental Learning
Task-Incremental Learning에서는 학습 단계마다 서로 다른 Task가 순차적으로 등장합니다.
예:

```text
Task 1 → 숫자 분류
Task 2 → 문자 분류
Task 3 → 동물 분류
```

즉, Task ID를 사용할 수 있습니다.
## Domain-Incremental Learning
Domain-Incremental Learning에서는 Task는 같지만 데이터 분포가 달라집니다.
예를 들어 같은 숫자 분류 문제라도

```text
Domain 1 → 일반 숫자 이미지
Domain 2 → 밝기가 어두운 숫자 이미지
Domain 3 → 회전된 숫자 이미지
```

처럼 입력 Domain이 변할 수 있습니다.
## Class-Incremental Learning
Class-Incremental Learning에서는 새로운 클래스가 계속 추가됩니다.
예:

```text
Step 1
고양이 / 강아지
Step 2
고양이 / 강아지 / 자동차 / 자전거
Step 3
고양이 / 강아지 / 자동차 / 자전거 / 새 / 말
```

## 세 가지 Incremental Learning 비교

| 구분 | 변하는 것 | Task ID | 핵심 |
| --- | --- | --- | --- |
| Task-Incremental | Task | 보통 사용 가능 | Task별 문제를 순차 학습 |
| Domain-Incremental | 입력 분포 | 보통 불필요 | 같은 Task, 다른 Domain |
| Class-Incremental | 클래스 집합 | 보통 없음 | 새로운 클래스 계속 추가 |

## 지속학습의 대표적인 접근
- Replay-Based
- Regularization-Based
- Parameter Isolation
- Dynamic Architecture
## Replay-Based 방법
Replay는 과거 데이터를 일부 저장했다가 새로운 Task를 학습할 때 다시 사용하는 방법입니다.

```text
과거 데이터 일부
+
새로운 데이터
↓
함께 학습
```

이렇게 하면 모델이 새로운 데이터만 보면서 기존 지식을 잊는 것을 줄일 수 있습니다.
## Experience Replay
과거 Sample 일부를 Memory Buffer에 저장합니다.

```text
Memory Buffer
├─ 과거 Sample A
├─ 과거 Sample B
└─ 과거 Sample C
```

새로운 Task를 학습할 때 Buffer의 Sample도 함께 사용합니다.
## Replay Buffer
Buffer 크기가 제한되어 있기 때문에 어떤 Sample을 남길지도 중요합니다.
예:
- Random Sampling
- Reservoir Sampling
- 대표 Sample 선택
## Regularization-Based 방법
Regularization 기반 방법은 과거 Task에서 중요한 파라미터가 너무 많이 바뀌지 않도록 제한합니다.
핵심은

```text
중요한 파라미터
→ 크게 변경하지 않기
```

입니다.
## EWC
과거 Task에 중요한 파라미터를 많이 바꾸면 큰 Penalty를 줍니다.
간단한 형태는 다음과 같습니다.
$$L=L_{\mathrm{new}}+\frac{\lambda}{2}\sum_iF_i(\theta_i-\theta_i^*)^2$$
- $$L_{\mathrm{new}}$$: 새로운 Task Loss
- $$\theta_i^*$$: 과거 Task에서 학습된 파라미터
- $$F_i$$: 파라미터 중요도
- $$\lambda$$: 기존 지식 보호 강도
## EWC의 직관
과거 Task에서 매우 중요한 파라미터가 있다고 하겠습니다.

```text
중요도 높음
→ 변경을 강하게 제한
```

반대로 중요도가 낮은 파라미터는

```text
중요도 낮음
→ 비교적 자유롭게 변경
```

할 수 있습니다.
즉, ## Knowledge Distillation 활용
이전 모델의 출력을 Teacher처럼 사용해 새로운 모델이 과거 예측을 유지하도록 할 수도 있습니다.

```text
Old Model
↓
과거 출력
New Model
↓
새로운 Task 학습
+
과거 출력 유지
```

이 방식도 Forgetting을 줄이는 데 활용됩니다.
## Parameter Isolation
Parameter Isolation은 Task마다 사용하는 파라미터 일부를 분리하는 방식입니다.

```text
공통 파라미터
+
Task A 전용 파라미터
+
Task B 전용 파라미터
```

## Replay와 Regularization 비교

| 구분 | Replay | Regularization |
| --- | --- | --- |
| 핵심 | 과거 데이터를 다시 보여줌 | 중요 파라미터 변경 제한 |
| 과거 데이터 저장 | 필요할 수 있음 | 필수 아님 |
| 대표 예 | Experience Replay | EWC |
| 장점 | 직관적이고 효과적 | 데이터 저장 부담 감소 가능 |
| 단점 | Memory 필요 | 중요도 추정이 어려울 수 있음 |

## 지속학습과 전이학습

| 구분 | 지속학습 | 전이학습 |
| --- | --- | --- |
| 핵심 | 새 지식 학습 + 기존 지식 유지 | 기존 지식 재사용 |
| 과거 Task 성능 | 유지가 중요 | 반드시 유지할 필요 없음 |
| 학습 흐름 | 연속적 | Source → Target |
| 대표 문제 | Catastrophic Forgetting | Domain Gap |

<mark>전이학습은 새로운 Task에 잘 적응하는 것이 중심이고, 지속학습은 과거와 새로운 Task를 함께 잘 유지하는 것이 중심입니다.</mark>
## 지속학습과 멀티태스크 학습

```text
Multi-Task
Task A + Task B + Task C
→ 동시에 학습
Continual Learning
Task A → Task B → Task C
→ 순차 학습
```

## 데이터 레이블 관점
지속학습은 지도학습, 자기지도학습 등 다양한 설정에서 적용할 수 있습니다.

```text
레이블이 있는가?
레이블이 없는가?
```

를 정의하는 학습 패러다임은 아닙니다.
## Evaluation
예를 들어

```text
Task 1 학습 후 정확도: 90%
Task 2 학습 후 Task 1 정확도: 70%
Task 3 학습 후 Task 1 정확도: 55%
```

라면 Forgetting이 크게 발생했다고 볼 수 있습니다.
## Average Accuracy
여러 Task의 최종 성능 평균을 볼 수 있습니다.
$$A=\frac{1}{T}\sum_{i=1}^{T}a_i$$
- $$T$$: 학습한 Task 수
- $$a_i$$: 최종 시점에서 Task $$i$$의 성능
## Forgetting
과거 Task에서 가장 좋았던 성능과 이후 성능의 차이를 이용해 Forgetting을 측정할 수 있습니다.
직관적으로

```text
과거 최고 성능
-
현재 성능
```

이 크면 많이 잊었다는 의미입니다.
## 장점
### 1. 지속적인 업데이트
새로운 데이터가 들어올 때마다 전체 모델을 처음부터 다시 학습할 필요를 줄일 수 있습니다.
### 2. 과거 지식 활용
기존에 배운 Representation을 새로운 Task 학습에 활용할 수 있습니다.
### 3. 변화하는 환경 대응
사용자 행동이나 데이터 분포가 시간에 따라 변하는 환경에 적합합니다.
## 단점
### 1. Catastrophic Forgetting
가장 대표적인 문제입니다.
### 2. Memory Cost
Replay 방식을 사용하면 과거 데이터를 저장해야 할 수 있습니다.
### 3. Plasticity 감소
기존 파라미터를 너무 강하게 보호하면 새로운 Task 학습이 어려워질 수 있습니다.
### 4. Task 순서 영향
어떤 순서로 Task가 들어오는지에 따라 학습 결과가 달라질 수 있습니다.
## 잘 놓치는 핵심
### 1. 지속학습은 단순 Fine-tuning이 아니다
새로운 데이터로 계속 Fine-tuning만 하면 과거 지식을 크게 잊을 수 있습니다.
지속학습은 과거 지식을 유지하는 것이 핵심입니다.
### 2. Catastrophic Forgetting이 핵심 문제다
새로운 Task 성능만 높다고 좋은 지속학습 모델은 아닙니다.
과거 Task 성능도 유지해야 합니다.
### 3. Stability와 Plasticity를 동시에 봐야 한다
기존 지식을 너무 보호하면 새로운 것을 못 배우고, 새로운 것을 너무 빠르게 배우면 과거를 잊습니다.
### 4. Class-Incremental Learning은 Task ID가 없는 경우가 많다
지금까지 배운 전체 클래스 중 하나를 예측해야 하므로 어려운 설정입니다.
### 5. Replay는 과거 데이터를 다시 보여준다
Experience Replay는 가장 직관적인 망각 방지 방법입니다.
### 6. EWC는 중요한 파라미터를 보호한다
모든 파라미터를 고정하는 것이 아니라 과거 Task에 중요한 파라미터의 변화를 더 강하게 제한합니다.
## 시험·면접
### 핵심 암기 포인트
- 지속학습은 순차적으로 들어오는 Task나 데이터를 학습한다.
- 기존 지식을 유지하는 것이 중요하다.
- Catastrophic Forgetting이 대표적인 문제다.
- Stability-Plasticity Dilemma를 이해해야 한다.
- Task-, Domain-, Class-Incremental Learning을 구분한다.
- Replay는 과거 Sample을 다시 학습한다.
- EWC는 중요한 파라미터 변경을 제한한다.
- Parameter Isolation은 Task별 파라미터를 분리한다.
- 지속학습과 전이학습은 같은 개념이 아니다.
- 멀티태스크는 동시 학습, 지속학습은 순차 학습이 핵심이다.
### 자주 나오는 문장
**Q. 지속학습이란 무엇인가?**
시간에 따라 새로운 데이터나 Task를 계속 학습하면서 기존에 학습한 지식을 최대한 유지하는 방법입니다.
**Q. Catastrophic Forgetting이란 무엇인가?**
새로운 Task를 학습하는 과정에서 기존 Task에 대한 성능이 급격히 떨어지는 현상입니다.
**Q. EWC의 핵심은 무엇인가?**
과거 Task에 중요한 파라미터가 크게 변하지 않도록 Penalty를 주어 기존 지식을 보호하는 것입니다.
**Q. 지속학습과 전이학습의 차이는 무엇인가?**
전이학습은 기존 지식을 새로운 Task에 활용하는 것이 중심이고, 지속학습은 새로운 Task를 배우면서 과거 Task 성능도 유지하는 것이 중심입니다.

<blockquote class="prompt-warning">
<p>지속학습에서는 마지막에 배운 Task만 잘하는 것이 아니라, 이전 Task까지 얼마나 유지하는지가 중요합니다.</p>
</blockquote>

## 예시로 한 바퀴
이미지 분류 모델이 있다고 하겠습니다.
처음에는 다음 두 클래스를 학습합니다.

```text
Task 1
고양이
강아지
```

이후 새로운 클래스가 들어옵니다.

```text
Task 2
자동차
자전거
```

새 데이터만 사용해 Fine-tuning하면 고양이와 강아지 성능이 떨어질 수 있습니다.
Replay를 사용한다면

```text
새로운 자동차/자전거 데이터
+
과거 고양이/강아지 일부
↓
함께 학습
```

합니다.
EWC를 사용한다면 과거 Task에 중요한 파라미터가 크게 변하지 않도록 제한합니다.
목표는 다음과 같습니다.

```text
새로운 클래스 학습
+
기존 클래스 유지
↓
지속학습
```

## 객관식 문제
### 1. 지속학습의 핵심 목표는?
① 마지막 Task만 최대한 잘 학습한다.  
② 새로운 Task를 배우면서 기존 지식을 유지한다.  
③ 모든 과거 데이터를 반드시 삭제한다.  
④ 모델을 한 번만 학습한다.

<details>
<summary>정답</summary>

②

</details>

### 2. Catastrophic Forgetting의 의미는?
① 새로운 Task를 전혀 배우지 못하는 현상  
② 새로운 Task 학습으로 기존 Task 성능이 크게 감소하는 현상  
③ 학습 속도가 증가하는 현상  
④ 데이터 수가 증가하는 현상

<details>
<summary>정답</summary>

②

</details>

### 3. Replay-Based 방법의 설명으로 옳은 것은?
① 과거 데이터를 일부 다시 학습에 사용한다.  
② 모든 파라미터를 완전히 고정한다.  
③ Task를 동시에 학습하지 않는다.  
④ 레이블을 자동 생성하는 방법이다.

<details>
<summary>정답</summary>

①

</details>

### 4. EWC의 핵심은?
① 새로운 Task의 모든 파라미터를 제거한다.  
② 과거 Task에 중요한 파라미터의 변경을 제한한다.  
③ 과거 데이터를 반드시 모두 저장한다.  
④ 모델 구조를 항상 두 배로 늘린다.

<details>
<summary>정답</summary>

②

</details>

### 5. Class-Incremental Learning의 특징은?
① 입력 Domain만 변하고 클래스는 항상 같다.  
② 새로운 클래스가 순차적으로 추가된다.  
③ Task가 하나뿐이다.  
④ 과거 클래스를 예측하지 않는다.

<details>
<summary>정답</summary>

②

</details>

### 6. 지속학습과 멀티태스크 학습의 차이로 옳은 것은?
① 완전히 같은 개념이다.  
② 지속학습은 Task가 순차적으로 등장하고, 멀티태스크는 여러 Task를 함께 학습하는 경우가 많다.  
③ 지속학습에서는 과거 지식을 유지하지 않는다.  
④ 멀티태스크 학습은 여러 Task를 사용할 수 없다.

<details>
<summary>정답</summary>

②

</details>

## 다음에 이을 글
온라인 학습(Online Learning)입니다.  
데이터가 순차적으로 들어올 때 모델을 지속적으로 업데이트하는 학습 방식입니다.
