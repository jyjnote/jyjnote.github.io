---
title: Actor-Critic
date: 2026-09-30 21:00:00 +0900
slug: actor-critic
permalink: /posts/actor-critic/
categories: [AI, 강화학습]
tags: [강화학습, ActorCritic, 액터크리틱, PolicyGradient, 가치함수, Advantage, TD오차]
math: true
---

Actor-Critic은 **정책을 학습하는 Actor와 가치함수를 학습하는 Critic을 함께 사용하는 강화학습 구조**입니다.

Policy Gradient의 직접적인 정책 학습과 가치 기반 방법의 안정적인 평가를 결합한 방식입니다.

<blockquote class="prompt-info">
<p>한 줄: Actor는 행동을 선택하고, Critic은 그 행동이 얼마나 좋았는지 평가하여 Actor의 학습을 돕습니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

정책을 학습하는 Actor와 가치함수로 정책을 평가하는 Critic을 동시에 학습하는 구조입니다.

</details>

## 1. 왜 Actor-Critic이 필요한가

Policy Gradient는 정책을 직접 학습합니다.

하지만 기본 REINFORCE는 한 에피소드가 끝난 뒤 수익을 계산하여 정책을 갱신하므로 분산이 클 수 있습니다.

반대로 가치 기반 방법은 상태나 행동의 가치를 학습하여 행동을 평가합니다.

Actor-Critic은 두 방식을 결합합니다.

```text
Actor
→ 행동 선택

Critic
→ 행동 평가
```

<mark>Actor-Critic은 정책을 직접 학습하면서 가치함수의 평가를 이용해 학습을 안정화합니다.</mark>

## 2. Actor란

Actor는 정책을 담당합니다.

현재 상태가 주어졌을 때 어떤 행동을 선택할지 결정합니다.

$$\pi_\theta(a\mid s)$$

여기서 θ는 Actor의 매개변수입니다.

Actor가 신경망이라면 θ는 신경망의 가중치입니다.

예를 들어 현재 상태에서 다음과 같은 행동 확률을 출력할 수 있습니다.

| 행동 | 선택 확률 |
| --- | ---: |
| 왼쪽 | 0.2 |
| 오른쪽 | 0.6 |
| 점프 | 0.2 |

Actor는 이 확률분포에 따라 행동을 선택합니다.

## 3. Critic이란

Critic은 Actor가 선택한 행동이나 현재 상태를 평가합니다.

대표적으로 상태가치 함수를 사용할 수 있습니다.

$$V_w(s)$$

여기서 w는 Critic의 매개변수입니다.

Critic은 다음 질문에 답하는 역할을 합니다.

```text
현재 상태는 얼마나 좋은가?
```

또는 행동가치를 사용한다면 다음 질문을 평가할 수도 있습니다.

```text
현재 상태에서 이 행동은 얼마나 좋은가?
```

<mark>Actor는 행동을 선택하고, Critic은 그 선택을 평가합니다.</mark>

## 4. Actor와 Critic의 관계

Critic의 평가 결과는 Actor의 정책 갱신에 사용됩니다.

전체 흐름은 다음과 같습니다.

```text
현재 상태
↓
Actor가 행동 선택
↓
환경에서 보상과 다음 상태 획득
↓
Critic이 행동 결과 평가
↓
Actor 정책 갱신
↓
Critic 가치함수 갱신
```

## 5. Critic의 핵심 평가

Critic은 현재 상태의 가치와 다음 상태의 가치를 비교합니다.

대표적으로 시간차 오차를 사용합니다.

$$\delta_t=r_{t+1}+\gamma V(s_{t+1})-V(s_t)$$

각 항의 의미는 다음과 같습니다.

| 요소 | 의미 |
| --- | --- |
| 현재 보상 | 행동 직후 받은 보상 |
| 다음 상태가치 | 미래 상태의 예상 가치 |
| 현재 상태가치 | 현재 상태의 예상 가치 |
| 시간차 오차 | 실제 결과와 기존 기대의 차이 |

시간차 오차는 
## 6. 시간차 오차의 직관

시간차 오차가 양수이면 결과가 기대보다 좋았다는 뜻입니다.

```text
실제 결과 > 기존 기대
→ 시간차 오차 양수
→ 해당 행동을 더 선호
```

시간차 오차가 음수이면 결과가 기대보다 나빴다는 뜻입니다.

```text
실제 결과 < 기존 기대
→ 시간차 오차 음수
→ 해당 행동을 덜 선호
```

<mark>시간차 오차는 Actor에게 현재 행동이 기대보다 얼마나 좋았는지를 알려주는 신호입니다.</mark>

## 7. Critic의 학습

Critic은 시간차 오차를 줄이는 방향으로 가치함수를 학습합니다.

목표값은 다음과 같이 볼 수 있습니다.

$$y_t=r_{t+1}+\gamma V(s_{t+1})$$

Critic의 현재 예측값은 다음과 같습니다.

$$V(s_t)$$

둘의 차이가 시간차 오차입니다.

$$\delta_t=y_t-V(s_t)$$

Critic은 이 차이가 작아지도록 매개변수를 갱신합니다.

## 8. Actor의 학습

Actor는 Critic의 평가를 이용해 정책을 갱신합니다.

대표적인 갱신 방향은 다음과 같습니다.

$$\nabla_\theta J(\theta)\approx\mathbb{E}\left[\nabla_\theta\log\pi_\theta(a_t\mid s_t)\delta_t\right]$$

시간차 오차가 양수이면 선택한 행동의 확률을 높이는 방향으로 학습합니다.

시간차 오차가 음수이면 선택한 행동의 확률을 낮추는 방향으로 학습합니다.

```text
좋은 평가
→ 행동 확률 증가

나쁜 평가
→ 행동 확률 감소
```

## 9. Advantage와의 관계

Actor-Critic에서는 Advantage를 사용할 수도 있습니다.

$$A(s,a)=Q(s,a)-V(s)$$

Advantage는 특정 행동이 현재 상태의 평균적인 기대보다 얼마나 좋은지를 나타냅니다.

실제 Actor-Critic에서는 시간차 오차를 Advantage의 근사값처럼 사용할 수 있습니다.

$$A(s_t,a_t)\approx\delta_t$$

즉, Critic의 평가를 이용해 Actor가 선택한 행동이 평균보다 얼마나 좋았는지를 판단합니다.

<blockquote class="prompt-info">
<p>시간차 오차가 양수이면 기대보다 좋은 행동, 음수이면 기대보다 좋지 않은 행동으로 해석할 수 있습니다.</p>
</blockquote>

## 10. Policy Gradient와의 차이

기본 Policy Gradient는 에피소드의 수익을 이용해 정책을 직접 갱신합니다.

Actor-Critic은 Critic이 제공하는 가치 평가를 이용합니다.

| 구분 | Policy Gradient | Actor-Critic |
| --- | --- | --- |
| 정책 학습 | 직접 수행 | Actor가 수행 |
| 가치함수 | 없어도 가능 | Critic이 학습 |
| 평가 기준 | 수익 | 가치함수 기반 평가 |
| 갱신 시점 | 에피소드 단위 가능 | 매 단계 갱신 가능 |
| 분산 | 클 수 있음 | 줄일 수 있음 |

<mark>Actor-Critic은 Critic의 평가를 이용해 Policy Gradient의 높은 분산 문제를 줄이는 방향으로 발전한 구조입니다.</mark>

## 11. 가치 기반 방법과의 차이

DQN은 행동가치를 학습하고 가장 큰 Q값의 행동을 선택합니다.

Actor-Critic은 정책을 별도로 학습합니다.

| 구분 | DQN | Actor-Critic |
| --- | --- | --- |
| 정책 네트워크 | 없음 | Actor |
| 가치 네트워크 | Q 네트워크 | Critic |
| 행동 선택 | 최대 Q값 | 정책분포 |
| 대표 기반 | 가치 기반 | 정책 + 가치 기반 |
| 연속 행동 | 어려움 | 확장 가능 |

Actor-Critic은 정책과 가치를 동시에 학습한다는 점이 핵심입니다.

## 12. 전체 학습 과정

Actor-Critic의 기본 흐름은 다음과 같습니다.

1. 현재 상태를 확인한다.
2. Actor가 정책에 따라 행동을 선택한다.
3. 환경에서 보상과 다음 상태를 얻는다.
4. Critic이 현재 상태와 다음 상태를 평가한다.
5. 시간차 오차를 계산한다.
6. Critic의 가치함수를 갱신한다.
7. 시간차 오차를 이용해 Actor를 갱신한다.
8. 다음 상태로 이동한다.
9. 종료 상태까지 반복한다.

핵심은 다음 구조입니다.

```text
Actor
→ 행동

환경
→ 보상 + 다음 상태

Critic
→ 평가

평가 결과
→ Actor와 Critic 갱신
```

## 13. 종료 상태 처리

다음 상태가 종료 상태라면 미래 상태가치는 사용하지 않습니다.

일반 상태에서는 다음과 같습니다.

$$\delta_t=r_{t+1}+\gamma V(s_{t+1})-V(s_t)$$

종료 상태에서는 다음과 같습니다.

$$\delta_t=r_{t+1}-V(s_t)$$

에피소드가 끝났기 때문에 이후의 상태가치가 존재하지 않습니다.

## 14. A2C와 A3C로 확장

Actor-Critic 구조는 여러 알고리즘으로 확장됩니다.

대표적인 예가 A2C와 A3C입니다.

A2C는 Advantage를 사용하는 Actor-Critic 방식입니다.

A3C는 여러 환경을 병렬로 실행하면서 학습하는 구조입니다.

| 방법 | 핵심 |
| --- | --- |
| Actor-Critic | 정책과 가치함수 동시 학습 |
| A2C | Advantage 기반 학습 |
| A3C | 여러 환경에서 비동기 학습 |

이후 PPO도 Actor-Critic 구조를 바탕으로 이해할 수 있습니다.

## 잘 놓치는 핵심

### 1. Actor와 Critic은 역할이 다르다

Actor는 행동을 선택합니다.

Critic은 행동 결과를 평가합니다.

### 2. Critic은 정책이 아니다

Critic이 직접 행동을 선택하는 것이 아닙니다.

Critic은 Actor가 정책을 개선할 수 있도록 평가 신호를 제공합니다.

### 3. 시간차 오차는 평가 신호이다

시간차 오차가 양수이면 기대보다 좋은 결과입니다.

음수이면 기대보다 나쁜 결과입니다.

### 4. Critic은 가치함수를 학습한다

대표적으로 상태가치 함수를 학습합니다.

Actor는 이 평가를 이용해 정책을 수정합니다.

### 5. Actor-Critic은 정책 기반과 가치 기반을 결합한다

Actor는 정책 기반입니다.

Critic은 가치 기반입니다.

### 6. 종료 상태에서는 다음 상태가치를 사용하지 않는다

에피소드가 끝났다면 미래 상태가치는 0으로 처리합니다.

## 시험·면접

시험이나 면접에서는 다음 내용을 먼저 기억하면 됩니다.

- Actor의 역할
- Critic의 역할
- 시간차 오차
- Advantage와의 관계
- Policy Gradient와의 차이
- DQN과의 차이
- 종료 상태 처리
- A2C와 A3C로의 확장

가장 중요한 시간차 오차는 다음과 같습니다.

$$\delta_t=r_{t+1}+\gamma V(s_{t+1})-V(s_t)$$

Actor의 정책 갱신은 다음 형태로 볼 수 있습니다.

$$\nabla_\theta J(\theta)\approx\mathbb{E}\left[\nabla_\theta\log\pi_\theta(a_t\mid s_t)\delta_t\right]$$

자주 나오는 설명은 다음과 같습니다.

<blockquote class="prompt-info">
<p>Actor-Critic은 Actor가 정책을 학습하고 Critic이 가치함수로 행동을 평가하여 정책 학습을 돕는 강화학습 구조입니다.</p>
</blockquote>

### 시험 함정

- Actor가 가치함수를 학습하는 것이 아닙니다.
- Critic이 직접 정책을 출력하는 것이 아닙니다.
- 시간차 오차는 현재 보상만 의미하지 않습니다.
- Actor-Critic은 가치 기반만 사용하는 구조가 아닙니다.
- 종료 상태에서는 다음 상태가치를 더하지 않습니다.
- Critic의 평가가 정확하지 않으면 Actor도 영향을 받을 수 있습니다.

## 객관식 문제

### 문제 1

Actor-Critic에서 Actor의 역할은 무엇일까요?

① 가치함수만 계산한다.  
② 정책을 이용해 행동을 선택하고 학습한다.  
③ 환경의 전이확률을 계산한다.  
④ 보상을 직접 만든다.

<details>
<summary>정답</summary>

②

Actor는 정책을 담당하며 상태에서 어떤 행동을 선택할지 결정합니다.

</details>

### 문제 2

Critic의 역할로 가장 적절한 것은 무엇일까요?

① Actor의 행동을 가치함수로 평가한다.  
② 무조건 무작위 행동을 선택한다.  
③ 상태를 제거한다.  
④ 할인율을 결정한다.

<details>
<summary>정답</summary>

①

Critic은 가치함수를 이용해 Actor의 행동 결과를 평가합니다.

</details>

### 문제 3

시간차 오차가 양수라는 의미로 가장 적절한 것은 무엇일까요?

① 실제 결과가 기존 기대보다 좋았다.  
② Actor의 학습을 중단해야 한다.  
③ 다음 상태가 존재하지 않는다.  
④ 보상이 항상 음수이다.

<details>
<summary>정답</summary>

①

양의 시간차 오차는 실제 결과가 기존 가치 예측보다 좋았다는 의미입니다.

</details>

### 문제 4

Actor-Critic의 특징으로 올바른 것은 무엇일까요?

① 정책만 학습하고 가치함수는 사용하지 않는다.  
② 가치함수만 학습하고 정책은 사용하지 않는다.  
③ 정책과 가치함수를 함께 학습한다.  
④ 항상 Q-Table만 사용한다.

<details>
<summary>정답</summary>

③

Actor는 정책을, Critic은 가치함수를 학습합니다.

</details>

### 문제 5

다음 중 Actor-Critic 계열의 확장으로 볼 수 있는 것은 무엇일까요?

① A2C  
② K-Means  
③ PCA  
④ 선형회귀

<details>
<summary>정답</summary>

①

A2C와 A3C는 Actor-Critic 구조를 확장한 대표적인 강화학습 알고리즘입니다.

</details>

## 핵심 정리

Actor-Critic은 정책과 가치함수를 함께 학습합니다.

핵심 구조는 다음과 같습니다.

```text
상태
↓
Actor
↓
행동
↓
환경
↓
보상 + 다음 상태
↓
Critic 평가
↓
시간차 오차
↓
Actor 정책 갱신
+
Critic 가치함수 갱신
```

Actor는 행동을 선택합니다.

Critic은 그 행동이 기대보다 얼마나 좋았는지를 평가합니다.

<mark>Actor-Critic의 핵심은 Critic의 가치 평가를 이용해 Actor의 정책을 더 안정적으로 학습하는 것입니다.</mark>

## 다음에 이을 글

다음 글은 **A2C와 A3C**입니다.

Actor-Critic 구조에서 Advantage를 사용하고 여러 환경의 경험을 활용하는 방식으로 확장합니다.
