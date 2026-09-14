---
title: 메타학습
date: 2026-09-15 00:40:00 +0900
slug: meta-learning
permalink: /posts/meta-learning/
categories: [AI, 딥러닝, 학습 패러다임]
tags: [메타학습, Meta-Learning, Few-Shot Learning, MAML, Support Set, Query Set]
math: true
---

메타학습(Meta-Learning)은 **여러 Task를 경험하면서 새로운 Task를 더 빠르게 학습하는 방법을 배우는 학습 방식**입니다.  

<blockquote class="prompt-info">
<p>한 줄: 여러 문제를 학습한 경험으로 처음 보는 문제를 적은 데이터만으로 빠르게 배우는 방법입니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

여러 Task에서 학습 경험을 쌓아 새로운 Task에 빠르게 적응할 수 있는 초기 상태나 학습 전략을 학습합니다.

</details>

## 왜 필요한가
일반적인 딥러닝 모델은 새로운 문제를 만나면 많은 데이터와 반복 학습이 필요할 수 있습니다.
하지만 사람은 몇 개의 예시만 보고도 새로운 개념을 빠르게 배울 수 있습니다.
메타학습은 이런 **빠른 적응 능력**을 모델에 만들려고 합니다.
<mark>핵심은 하나의 Task 성능만 높이는 것이 아니라, 새로운 Task를 잘 배우는 능력 자체를 학습하는 것입니다.</mark>
## 기본 아이디어
일반적인 학습은 하나의 Task를 학습합니다.

```text
Task A
↓
모델 학습
↓
Task A 성능 향상
```

메타학습은 여러 Task를 반복해서 경험합니다.

```text
Task A
Task B
Task C
Task D
↓
공통 학습 경험
↓
새로운 Task E에 빠르게 적응
```

## Task Distribution
메타학습에서는 하나의 고정된 Task보다 여러 Task가 생성되는 분포를 생각합니다.
$$\mathcal{T}\sim p(\mathcal{T})$$
- $$\mathcal{T}$$: 하나의 Task
- $$p(\mathcal{T})$$: Task Distribution
목표는 학습에 없던 새로운 Task가 나와도 빠르게 적응할 수 있도록 만드는 것입니다.
## Episode
메타학습에서는 하나의 Task 단위 학습을 Episode라고 부르는 경우가 많습니다.
- Support Set
- Query Set
으로 구성됩니다.

```text
Episode
├─ Support Set
└─ Query Set
```

## Support Set
Support Set은 새로운 Task를 학습하거나 적응할 때 사용하는 데이터입니다.
예를 들어 고양이와 강아지를 구분하는 새로운 Task가 있다면 몇 장의 이미지가 Support Set으로 주어질 수 있습니다.

```text
고양이 2장
강아지 2장
```

모델은 이 작은 데이터로 Task에 적응합니다.
## Query Set
Query Set은 Support Set으로 적응한 뒤 성능을 평가하거나 Meta-Loss를 계산할 때 사용하는 데이터입니다.

```text
Support Set → 적응
Query Set → 성능 평가
```

<mark>Support Set으로 배우고, Query Set으로 얼마나 잘 적응했는지 평가합니다.</mark>
## Support Set과 Query Set 비교

| 구분 | 역할 |
| --- | --- |
| Support Set | Task 적응에 사용하는 데이터 |
| Query Set | 적응 후 성능 평가에 사용하는 데이터 |

## N-way K-shot
- N-way: 클래스 수
- K-shot: 클래스당 제공되는 예시 수
예를 들어 5-way 1-shot은

```text
5개 클래스
각 클래스당 예시 1개
```

를 의미합니다.
5-way 5-shot은

```text
5개 클래스
각 클래스당 예시 5개
```

를 의미합니다.
## Few-Shot Learning과의 관계
Few-Shot Learning은 적은 수의 예시만으로 새로운 Task를 해결하는 문제 설정입니다.

| 구분 | 의미 |
| --- | --- |
| Few-Shot Learning | 적은 예시로 새로운 문제를 푸는 문제 설정 |
| Meta-Learning | 새로운 문제를 빠르게 배우는 능력을 학습하는 방법 |

<mark>Few-Shot은 문제 설정이고, Meta-Learning은 이를 해결하기 위한 학습 전략으로 자주 사용됩니다.</mark>
## One-Shot Learning
One-Shot Learning은 클래스당 예시가 하나만 주어지는 경우입니다.

```text
K = 1
```

예를 들어

```text
고양이 1장
강아지 1장
새 1장
```

만 보고 새로운 이미지를 분류해야 할 수 있습니다.
## Zero-Shot Learning
Zero-Shot Learning은 목표 클래스의 직접적인 학습 예시 없이 새로운 클래스를 예측하는 문제입니다.
메타학습과 함께 언급되기도 하지만 같은 개념은 아닙니다.
Zero-Shot은 예시가 없는 문제 설정이고, Meta-Learning은 빠른 적응 능력을 학습하는 방식입니다.
## 메타학습의 대표적인 접근
대표적인 접근은 크게 다음처럼 나눌 수 있습니다.
- Optimization-Based
- Metric-Based
- Model-Based
## Optimization-Based Meta-Learning
Optimization-Based 방식은 **새로운 Task에 빠르게 적응할 수 있는 좋은 초기 파라미터나 업데이트 방법**을 학습합니다.
핵심 질문은 다음과 같습니다.

```text
어떤 초기값에서 시작해야
몇 번의 Gradient Update만으로
새로운 Task를 잘 학습할 수 있을까?
```

## MAML
MAML은 Model-Agnostic Meta-Learning의 약자입니다.
핵심은 **여러 Task에 빠르게 적응하기 좋은 초기 파라미터**를 찾는 것입니다.
## MAML의 기본 구조
먼저 초기 파라미터를 $$\theta$$라고 하겠습니다.
하나의 Task에서 Support Set을 이용해 몇 번 Gradient Update를 수행합니다.
$$\theta'_i=\theta-\alpha\nabla_{\theta}L_{\mathcal{T}_i}^{support}(\theta)$$
- $$\theta$$: 공통 초기 파라미터
- $$\theta'_i$$: Task $$i$$에 적응한 파라미터
- $$\alpha$$: Inner Learning Rate
## Inner Loop
Inner Loop는 하나의 Task에 적응하는 과정입니다.

```text
초기 파라미터 θ
↓
Support Set
↓
몇 번의 Gradient Update
↓
Task-Specific Parameter θ'
```

목표는 적은 업데이트만으로 새로운 Task에 잘 맞도록 만드는 것입니다.
## Outer Loop
Task에 적응한 뒤 Query Set에서 Loss를 계산합니다.
여러 Task의 Query Loss를 이용해 공통 초기 파라미터 $$\theta$$를 업데이트합니다.
간단히 표현하면
$$\theta\leftarrow\theta-\beta\nabla_{\theta}\sum_iL_{\mathcal{T}_i}^{query}(\theta'_i)$$
- $$\beta$$: Meta Learning Rate
- $$L^{query}$$: 적응 후 Query Set Loss
## Inner Loop와 Outer Loop

| 구분 | 역할 |
| --- | --- |
| Inner Loop | 개별 Task에 빠르게 적응 |
| Outer Loop | 여러 Task를 잘 배우는 초기 상태 학습 |

<blockquote class="prompt-info">
<p>MAML은 새로운 Task를 직접 외우는 것이 아니라, 새로운 Task에 빠르게 적응하기 좋은 시작점을 학습합니다.</p>
</blockquote>

## MAML의 직관
좋지 않은 초기값에서 시작하면 새로운 Task를 학습할 때 많은 업데이트가 필요합니다.

```text
나쁜 초기값
↓
많은 업데이트
↓
Task 적응
```

좋은 초기값에서는 몇 번만 업데이트해도 됩니다.

```text
좋은 초기값
↓
1~몇 번 업데이트
↓
Task 적응
```

MAML은 이 좋은 초기값을 여러 Task를 통해 학습합니다.
## Metric-Based Meta-Learning
Metric-Based 방식은 새로운 Sample을 기존 Support Sample과 비교해 분류합니다.
핵심은

```text
비슷한 것은 가깝게
다른 것은 멀게
```

표현하는 임베딩 공간을 학습하는 것입니다.
- Siamese Network
- Matching Networks
- Prototypical Networks
등이 있습니다.
## Prototypical Networks
Prototypical Networks는 각 클래스의 Support Sample Representation 평균을 Prototype으로 사용합니다.
클래스 $$k$$의 Prototype은 다음처럼 표현할 수 있습니다.
$$\mathbf{c}_k=\frac{1}{|S_k|}\sum_{\mathbf{x}_i\in S_k}f_{\theta}(\mathbf{x}_i)$$
- $$S_k$$: 클래스 $$k$$의 Support Set
- $$f_{\theta}$$: Encoder
- $$\mathbf{c}_k$$: 클래스 Prototype
Query Sample은 가장 가까운 Prototype의 클래스로 분류합니다.
## Prototype의 직관
예를 들어 Support Set에 고양이 이미지가 3장 있다고 하겠습니다.

```text
고양이 1 → 임베딩
고양이 2 → 임베딩
고양이 3 → 임베딩
```

이 세 벡터의 평균을 고양이 Prototype으로 사용할 수 있습니다.
새로운 Query 이미지가 어떤 Prototype에 가장 가까운지 비교합니다.
## Metric-Based와 대조학습
두 방식 모두 임베딩 공간에서 거리나 유사도를 중요하게 사용합니다.
하지만 목적은 다를 수 있습니다.

| 구분 | Metric-Based Meta-Learning | Contrastive Learning |
| --- | --- | --- |
| 핵심 | 새로운 Task를 적은 예시로 해결 | 좋은 Representation 학습 |
| 데이터 구성 | Episode, Support/Query | Positive/Negative Pair |
| 대표 방법 | Prototypical Networks | SimCLR, MoCo |

## Model-Based Meta-Learning
Model-Based 방식은 모델 내부에 빠르게 적응할 수 있는 구조나 메모리 메커니즘을 포함합니다.
새로운 정보가 들어왔을 때 내부 상태를 빠르게 바꾸도록 학습할 수 있습니다.
핵심은 파라미터 전체를 오래 업데이트하지 않고도 새로운 Task 정보를 빠르게 반영하는 것입니다.
## 메타학습과 멀티태스크 학습
두 방법 모두 여러 Task를 사용하기 때문에 헷갈리기 쉽습니다.

| 구분 | 메타학습 | 멀티태스크 학습 |
| --- | --- | --- |
| 목적 | 새로운 Task에 빠른 적응 | 여러 현재 Task의 성능 향상 |
| Task 사용 | 여러 Task에서 학습 방법 학습 | 여러 Task를 동시에 학습 |
| 새로운 Task | 중요 | 필수 아님 |
| 핵심 | Learning to Learn | Shared Representation |

<mark>멀티태스크 학습은 현재 여러 Task를 잘 푸는 것이 목적이고, 메타학습은 앞으로 만날 새로운 Task를 빨리 배우는 것이 목적입니다.</mark>
## 메타학습과 전이학습
전이학습은 기존에 학습한 지식을 새로운 Task에 재사용합니다.
메타학습도 새로운 Task에 적응한다는 점에서 비슷합니다.
하지만 목표가 다릅니다.

| 구분 | 메타학습 | 전이학습 |
| --- | --- | --- |
| 핵심 | 빠르게 학습하는 능력 학습 | 기존 지식 재사용 |
| 학습 단계 | 여러 Task를 반복 경험 | 보통 Source → Target |
| 새로운 Task 적응 | 처음부터 핵심 목표 | Fine-tuning으로 수행 가능 |
| 대표 방법 | MAML, ProtoNet | Pretraining + Fine-tuning |

## 메타학습과 자기지도학습
자기지도학습은 데이터 자체에서 학습 신호를 생성합니다.
메타학습은 여러 Task를 통해 빠른 적응 능력을 학습합니다.
두 개념은 서로 독립적이며 필요하면 함께 사용할 수도 있습니다.
## Meta-Train과 Meta-Test
메타학습에서는 학습과 평가 단계에서 Task 자체를 분리합니다.

```text
Meta-Train Tasks
↓
학습 방법 학습
↓
Meta-Test의 새로운 Task
↓
빠르게 적응
```

Meta-Test에서는 Meta-Train에서 보지 못한 새로운 Task에 얼마나 잘 적응하는지 평가합니다.
## Meta-Validation
하이퍼파라미터 선택이나 모델 선택을 위해 Meta-Validation Task를 둘 수도 있습니다.
즉, 일반 머신러닝의

```text
Train
Validation
Test
```

분할이 Sample 수준이 아니라 Task 수준에서도 존재할 수 있습니다.
## 장점
### 1. 빠른 적응
새로운 Task를 적은 데이터와 적은 업데이트로 학습할 수 있습니다.
### 2. Few-Shot 문제에 유리
라벨 데이터가 매우 적은 환경에 활용할 수 있습니다.
### 3. 여러 Task 경험 활용
Task마다 공통적으로 필요한 학습 전략을 얻을 수 있습니다.
## 단점
### 1. 학습 비용
여러 Task와 Episode를 반복해서 학습해야 하므로 계산 비용이 클 수 있습니다.
### 2. Task Distribution 의존
Meta-Train Task와 실제 새로운 Task가 너무 다르면 성능이 떨어질 수 있습니다.
### 3. 구현 복잡성
특히 MAML은 Inner Loop와 Outer Loop를 함께 계산해야 해 일반 학습보다 복잡합니다.
### 4. Task 구성 중요
어떤 Task들을 Meta-Train에 사용할지에 따라 일반화 성능이 크게 달라질 수 있습니다.
## 잘 놓치는 핵심
### 1. 메타학습은 단순히 여러 Task를 학습하는 것이 아니다
여러 Task를 사용하는 목적은 **새로운 Task를 더 빨리 배우는 능력**을 얻기 위해서입니다.
### 2. 멀티태스크 학습과 다르다
멀티태스크는 여러 현재 Task의 성능 향상이 목적입니다.
메타학습은 처음 보는 Task에 대한 빠른 적응이 핵심입니다.
### 3. Few-Shot Learning과 같은 개념이 아니다
Few-Shot은 적은 데이터로 학습하는 문제 설정입니다.
Meta-Learning은 이를 해결하는 대표적인 방법입니다.
### 4. Support와 Query 역할을 구분해야 한다
Support Set은 적응에 사용합니다.
Query Set은 적응 결과를 평가하고 Meta-Loss를 계산하는 데 사용합니다.
### 5. MAML의 핵심은 최종 파라미터를 외우는 것이 아니다
새로운 Task에서 몇 번의 Gradient Update만으로 좋은 성능을 내는 초기 파라미터를 학습합니다.
### 6. Task Distribution이 중요하다
Meta-Train과 Meta-Test Task가 어느 정도 관련되어 있어야 학습한 적응 전략을 잘 활용할 수 있습니다.
## 시험·면접
### 핵심 암기 포인트
- Learning to Learn이라고 부른다.
- 여러 Task를 경험해 새로운 Task에 빠르게 적응한다.
- Support Set은 Task 적응용이다.
- Query Set은 적응 후 평가용이다.
- N-way K-shot 표현을 이해해야 한다.
- Few-Shot Learning과 같은 개념은 아니다.
- MAML은 좋은 초기 파라미터를 학습한다.
- Inner Loop는 Task 적응이다.
- Outer Loop는 Meta-Parameter 업데이트다.
- Prototypical Networks는 클래스 Prototype을 이용한다.
- 멀티태스크 학습과 전이학습과 구분해야 한다.
### 자주 나오는 문장
**Q. 메타학습이란 무엇인가?**
여러 Task의 학습 경험을 이용해 새로운 Task를 적은 데이터와 적은 업데이트만으로 빠르게 학습하도록 하는 방법입니다.
**Q. Support Set과 Query Set의 차이는 무엇인가?**
Support Set은 새로운 Task에 적응할 때 사용하고, Query Set은 적응 후 성능을 평가하거나 Meta-Loss를 계산할 때 사용합니다.
**Q. MAML의 핵심은 무엇인가?**
여러 새로운 Task에 몇 번의 Gradient Update만으로 빠르게 적응할 수 있는 좋은 초기 파라미터를 학습하는 것입니다.
**Q. 멀티태스크 학습과 차이는 무엇인가?**
멀티태스크 학습은 여러 Task를 동시에 잘 수행하는 것이 목적이고, 메타학습은 새로운 Task를 빠르게 배우는 능력을 학습하는 것이 목적입니다.

<blockquote class="prompt-warning">
<p>메타학습에서 중요한 것은 학습했던 Task를 잘 외우는 것이 아니라, 처음 보는 Task에 얼마나 빠르게 적응하는가입니다.</p>
</blockquote>

## 예시로 한 바퀴
동물 이미지를 분류하는 메타학습 문제를 생각해보겠습니다.
Meta-Train에서는 여러 Episode를 만듭니다.

```text
Episode 1: 고양이 / 강아지 / 새
Episode 2: 말 / 소 / 양
Episode 3: 사자 / 호랑이 / 곰
```

각 Episode에는 Support Set과 Query Set이 있습니다.

```text
Support Set
↓
Task 적응
↓
Query Set
↓
적응 성능 평가
```

여러 Episode를 반복하면서 모델은 새로운 동물 분류 문제를 빠르게 학습하는 방법을 익힙니다.
Meta-Test에서 처음 보는 클래스가 나옵니다.

```text
여우
늑대
사슴
```

각 클래스의 사진이 몇 장만 주어져도 빠르게 적응하는 것이 목표입니다.
## 객관식 문제
### 1. 메타학습의 핵심 목표는?
① 하나의 Task를 최대한 오래 학습한다.  
② 새로운 Task를 빠르게 학습하는 능력을 얻는다.  
③ 모든 데이터의 라벨을 제거한다.  
④ 하나의 클래스만 분류한다.

<details>
<summary>정답</summary>

②

</details>

### 2. Support Set의 역할은?
① 새로운 Task에 적응하기 위한 데이터  
② 최종 Meta-Test 결과만 저장하는 데이터  
③ 모델을 사용하지 않는 데이터  
④ 반드시 비라벨 데이터

<details>
<summary>정답</summary>

①

</details>

### 3. 5-way 1-shot의 의미는?
① 1개 클래스에 5개 예시  
② 5개 클래스에 각 1개 예시  
③ 5개 Task를 1번 학습  
④ 1개 Task에 5개 모델

<details>
<summary>정답</summary>

②

</details>

### 4. MAML의 핵심으로 가장 적절한 것은?
① 새로운 Task마다 모델 구조를 새로 만든다.  
② 빠르게 적응하기 좋은 초기 파라미터를 학습한다.  
③ 라벨을 자동 생성한다.  
④ 모든 Task를 하나의 클래스라고 가정한다.

<details>
<summary>정답</summary>

②

</details>

### 5. Prototypical Networks의 핵심은?
① 각 클래스의 대표 Prototype을 만들고 거리를 비교한다.  
② 모든 클래스의 파라미터를 완전히 공유하지 않는다.  
③ 다음 Token만 예측한다.  
④ Negative Pair만 사용한다.

<details>
<summary>정답</summary>

①

</details>

### 6. 메타학습과 멀티태스크 학습의 차이로 옳은 것은?
① 완전히 같은 개념이다.  
② 메타학습은 새로운 Task에 대한 빠른 적응을 목표로 한다.  
③ 멀티태스크 학습은 새로운 Task 적응만을 목표로 한다.  
④ 메타학습은 여러 Task를 사용할 수 없다.

<details>
<summary>정답</summary>

②

</details>

## 다음에 이을 글
Few-Shot Learning입니다.  
적은 수의 예시만으로 새로운 클래스나 Task를 학습하는 방법입니다.
