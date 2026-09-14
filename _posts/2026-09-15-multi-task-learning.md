---
title: 멀티태스크 학습
date: 2026-09-15 00:30:00 +0900
slug: multi-task-learning
permalink: /posts/multi-task-learning/
categories: [AI, 머신러닝]
tags: [멀티태스크학습, Multi-Task Learning, MTL, Hard Parameter Sharing, Soft Parameter Sharing]
math: true
---

멀티태스크 학습(Multi-Task Learning, MTL)은 **여러 개의 관련된 Task를 하나의 모델이 함께 학습하는 방법**입니다.  

<blockquote class="prompt-info">
<p>한 줄: 관련된 여러 문제를 동시에 학습하면서 공통 특징을 공유하는 방법입니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

하나의 모델이 여러 Task를 동시에 학습하고, 공통 Representation을 공유해 일반화 성능을 높입니다.

</details>

## 왜 필요한가
예를 들어

```text
모델 A → 감정 분류
모델 B → 주제 분류
모델 C → 스팸 분류
```

처럼 Task마다 별도의 모델을 만들 수 있습니다.

```text
입력
↓
공통 특징 추출
├─ 감정 분류
├─ 주제 분류
└─ 스팸 분류
```

<mark>관련된 Task끼리 지식을 공유하면 적은 데이터에서도 더 좋은 Representation을 학습할 수 있습니다.</mark>
## 기본 아이디어
예를 들어 하나의 문장에서

```text
This movie was amazing.
```

다음 두 Task를 동시에 수행한다고 하겠습니다.

```text
Task 1: 감정 분류
Task 2: 주제 분류
```

## 기본 구조

```text
입력
↓
Shared Backbone
↓
공통 Representation
├─ Task A Head
├─ Task B Head
└─ Task C Head
```

## Shared Backbone
Shared Backbone은 여러 Task가 함께 사용하는 공통 모델 부분입니다.
예:
- CNN Feature Extractor
- Transformer Encoder
- MLP Hidden Layers
입력 $$\mathbf{x}$$를 공통 Representation으로 변환합니다.
$$\mathbf{h}=f_{\theta}(\mathbf{x})$$
- $$\mathbf{x}$$: 입력
- $$f_{\theta}$$: Shared Backbone
- $$\mathbf{h}$$: 공통 Representation
## Task-Specific Head
$$\hat{\mathbf{y}}_t=g_t(\mathbf{h})$$
- $$t$$: Task 번호
- $$g_t$$: Task-Specific Head
- $$\hat{\mathbf{y}}_t$$: Task의 예측값
예를 들어

```text
Shared Encoder
├─ 감정 분류 Head
└─ 주제 분류 Head
```

처럼 구성할 수 있습니다.
## 전체 학습 흐름

```text
입력 데이터
↓
Shared Backbone
↓
공통 Representation
├─ Task A Head → Loss A
└─ Task B Head → Loss B
↓
전체 Loss 계산
↓
공통 파라미터 업데이트
```

## Multi-Task Loss
$$L=L_1+L_2+\cdots+L_T$$
$$L=\sum_{t=1}^{T}\lambda_t L_t$$
- $$L_t$$: Task $$t$$의 Loss
- $$\lambda_t$$: Task별 가중치
- $$T$$: Task 수
## Loss Weight
Task마다 Loss의 크기와 중요도가 다를 수 있습니다.
예를 들어

```text
Task A Loss = 0.1
Task B Loss = 10.0
```

이라면 단순 합을 사용할 경우 Task B가 학습을 지나치게 지배할 수 있습니다.
이때 가중치를 조절합니다.

```text
전체 Loss
= 0.8 × Task A Loss
+ 0.2 × Task B Loss
```

<blockquote class="prompt-warning">
<p>멀티태스크 학습에서는 Task별 Loss의 크기와 중요도가 달라 Loss Balance가 중요합니다.</p>
</blockquote>

## Hard Parameter Sharing

```text
입력
↓
Shared Layers
├─ Task A Head
└─ Task B Head
```

공통 Layer의 파라미터는 모든 Task가 함께 업데이트합니다.
## Hard Parameter Sharing의 특징
장점은 구조가 단순하고 파라미터 수를 줄일 수 있다는 점입니다.
또한 공통 Layer가 여러 Task에서 동시에 학습되기 때문에 과적합을 줄이는 효과도 기대할 수 있습니다.
하지만 Task 사이의 관련성이 낮으면 서로 방해할 수 있습니다.
## Soft Parameter Sharing
Soft Parameter Sharing에서는 Task마다 별도의 모델을 유지합니다.

```text
Task A Network
Task B Network
```

대신 두 모델의 파라미터가 너무 달라지지 않도록 제약을 줄 수 있습니다.
예를 들어 두 Task의 파라미터 차이를 줄이는 항을 Loss에 추가할 수 있습니다.
$$L=L_A+L_B+\lambda\|\theta_A-\theta_B\|^2$$
각 Task가 독립적인 파라미터를 가지면서도 서로 정보를 공유하도록 유도합니다.
## Hard와 Soft Parameter Sharing 비교

| 구분 | Hard Sharing | Soft Sharing |
| --- | --- | --- |
| 공통 Layer | 직접 공유 | 별도 모델 |
| 파라미터 | 일부 동일 | 서로 다름 |
| 지식 공유 | 강함 | 비교적 유연 |
| 구조 | 단순 | 상대적으로 복잡 |
| Task 차이 대응 | 제한적 | 유연함 |

## 왜 일반화 성능이 좋아질 수 있는가
하나의 Task만 학습하면 그 Task 데이터에만 과적합할 수 있습니다.
멀티태스크 학습에서는 여러 Task의 정보를 동시에 사용합니다.
따라서 공통 Backbone은 특정 Task에만 맞는 특징보다 여러 Task에서 유용한 특징을 학습하게 됩니다.
이것이 일종의 Regularization 효과를 만들 수 있습니다.
## Auxiliary Task
멀티태스크 학습에서는 주된 Task 외에 보조 Task를 추가하기도 합니다.
이를 Auxiliary Task라고 합니다.
예를 들어 주된 목표가 감정 분류라면

```text
Main Task: 감정 분류
Auxiliary Task: 문장 길이 예측
```

같은 보조 문제를 둘 수 있습니다.
보조 Task는 Main Task에 유용한 Representation을 학습하도록 도와주는 역할을 합니다.
## Main Task와 Auxiliary Task

| 구분 | 의미 |
| --- | --- |
| Main Task | 실제로 중요하게 해결하려는 주된 문제 |
| Auxiliary Task | Main Task 학습을 돕기 위한 보조 문제 |

Auxiliary Task 자체의 성능보다 Main Task에 도움이 되는지가 더 중요합니다.
## Negative Transfer
서로 관련이 없는 Task를 함께 학습하면 성능이 오히려 떨어질 수 있습니다.
이를 Negative Transfer라고 합니다.
예를 들어

```text
Task A가 원하는 특징
Task B가 원하는 특징
```

이 서로 크게 다르면 공통 Backbone의 업데이트 방향이 충돌할 수 있습니다.

<blockquote class="prompt-warning">
<p>관련성이 낮은 Task를 무조건 함께 학습하면 Negative Transfer가 발생할 수 있습니다.</p>
</blockquote>

## Gradient Conflict
여러 Task는 같은 Shared Parameter를 서로 다른 방향으로 업데이트하려고 할 수 있습니다.
예를 들어

```text
Task A Gradient → 오른쪽
Task B Gradient → 왼쪽
```

처럼 Gradient 방향이 충돌할 수 있습니다.
이러한 현상을 Gradient Conflict라고 합니다.
Gradient Conflict가 심하면 한 Task의 성능을 높이는 업데이트가 다른 Task의 성능을 낮출 수 있습니다.
## Task Relatedness
멀티태스크 학습에서 가장 중요한 전제 중 하나는 Task가 어느 정도 관련되어 있어야 한다는 점입니다.
예를 들어

```text
감정 분류
문장 주제 분류
문장 의도 분류
```

는 모두 언어 의미 Representation을 공유할 수 있습니다.
반면 완전히 관계없는 문제를 하나의 모델에 무리하게 묶으면 효과가 작거나 성능이 떨어질 수 있습니다.
## 데이터가 모두 같은 입력일 필요는 없다
멀티태스크 학습에서는 동일한 입력에서 여러 정답을 예측하는 경우가 많습니다.
하지만 반드시 모든 Task가 완전히 같은 데이터 구조를 가져야 하는 것은 아닙니다.
핵심은 일부 Representation이나 파라미터를 공유하면서 여러 Task를 함께 최적화한다는 점입니다.
## Computer Vision 예시
하나의 자동차 이미지에서 여러 정보를 예측할 수 있습니다.

```text
자동차 이미지
↓
Shared CNN
├─ 자동차 종류 분류
├─ 색상 분류
└─ 위치 예측
```

Shared CNN이 이미지의 공통 특징을 추출하고 각 Head가 다른 Task를 수행합니다.
## NLP 예시
하나의 문장에서 여러 Task를 수행할 수 있습니다.

```text
문장
↓
Shared Transformer
├─ 감정 분류
├─ 의도 분류
└─ 주제 분류
```

모든 Task가 문장의 의미를 이해해야 하기 때문에 Shared Encoder를 사용할 수 있습니다.
## 자율주행 예시
하나의 도로 이미지에서
- 객체 탐지
- 차선 인식
- Depth Estimation
- Semantic Segmentation
등을 동시에 수행할 수 있습니다.
여러 Task가 공통적인 시각 특징을 공유할 수 있기 때문에 멀티태스크 학습을 적용할 수 있습니다.
## 멀티태스크 학습과 전이학습
두 개념은 비슷해 보이지만 다릅니다.

| 구분 | 멀티태스크 학습 | 전이학습 |
| --- | --- | --- |
| 학습 방식 | 여러 Task를 동시에 학습 | 기존 지식을 새로운 Task에 활용 |
| 시점 | 동시에 | 보통 순차적 |
| 목적 | Task 간 지식 공유 | 사전학습 지식 재사용 |
| 공통점 | 다른 Task의 정보를 활용 |

<mark>멀티태스크 학습은 동시에 여러 Task를 학습하고, 전이학습은 한 Task에서 배운 지식을 다른 Task로 옮깁니다.</mark>
## 멀티태스크 학습과 단일태스크 학습

| 구분 | Single-Task | Multi-Task |
| --- | --- | --- |
| Task 수 | 하나 | 여러 개 |
| Representation | Task별 독립 | 일부 공유 가능 |
| 모델 구조 | 단순 | Shared + Task Head |
| 지식 공유 | 없음 | 가능 |
| Negative Transfer | 없음 | 발생 가능 |

## 멀티태스크 학습과 멀티라벨 분류
두 개념을 헷갈리기 쉽습니다.
멀티라벨 분류는 하나의 Task에서 여러 Label이 동시에 정답이 될 수 있는 문제입니다.
예:

```text
사진
→ 사람
→ 자동차
→ 도로
```

하나의 분류 문제에서 여러 Label을 예측합니다.
멀티태스크 학습은 서로 다른 목적의 Task를 동시에 학습합니다.

```text
이미지
├─ 객체 분류
├─ 위치 예측
└─ 깊이 추정
```

## Multi-Label과 Multi-Task 비교

| 구분 | Multi-Label | Multi-Task |
| --- | --- | --- |
| 의미 | 하나의 Task에서 여러 Label 예측 | 여러 Task를 함께 학습 |
| 출력 | 같은 의미 체계의 여러 Label | Task마다 다른 출력 가능 |
| 예시 | 사진의 여러 객체 태그 | 분류 + 회귀 + 탐지 |

## 장점
### 1. 지식 공유
관련 Task가 공통 Representation을 함께 학습할 수 있습니다.
### 2. 일반화 성능 향상
다른 Task가 Regularization 역할을 하여 특정 Task의 과적합을 줄일 수 있습니다.
### 3. 데이터 효율
한 Task의 데이터에서 학습한 특징이 다른 Task에도 도움이 될 수 있습니다.
### 4. 모델 효율
Hard Parameter Sharing을 사용하면 여러 독립 모델보다 파라미터 수를 줄일 수 있습니다.
## 단점
### 1. Negative Transfer
관련성이 낮은 Task끼리 학습하면 성능이 떨어질 수 있습니다.
### 2. Loss Balance 문제
Task별 Loss 크기나 학습 난이도가 다르면 특정 Task가 학습을 지배할 수 있습니다.
### 3. Gradient Conflict
Task가 Shared Parameter를 서로 다른 방향으로 업데이트할 수 있습니다.
### 4. 구조 설계가 복잡함
어디까지 공유하고 어디부터 Task별로 분리할지 결정해야 합니다.
## 잘 놓치는 핵심
### 1. 여러 출력이 있다고 무조건 멀티태스크는 아니다
Multi-Label Classification처럼 하나의 Task에서 여러 Label을 예측하는 경우도 있습니다.
멀티태스크는 서로 다른 Task를 함께 학습합니다.
### 2. 모든 Layer를 공유할 필요는 없다
Shared Backbone만 공유하고 Task-Specific Head는 따로 둘 수 있습니다.
### 3. Task는 관련성이 있어야 한다
Task Relatedness가 낮으면 Negative Transfer가 발생할 수 있습니다.
### 4. Loss를 단순히 더하는 것이 항상 최선은 아니다
Task별 Loss Scale과 중요도가 다르면 가중치를 조절해야 합니다.
### 5. Hard Sharing과 Soft Sharing을 구분해야 한다
Hard Sharing은 실제 파라미터를 공유합니다.
Soft Sharing은 별도의 파라미터를 가지면서 서로 비슷하게 유지하도록 제약합니다.
### 6. 전이학습과 다르다
멀티태스크는 여러 Task를 동시에 학습하는 것이 핵심입니다.
전이학습은 기존 Task에서 얻은 지식을 새로운 Task에 활용하는 것이 핵심입니다.
## 시험·면접
### 핵심 암기 포인트
- 여러 관련 Task를 동시에 학습한다.
- Shared Backbone과 Task-Specific Head 구조가 대표적이다.
- Hard Parameter Sharing은 실제 Layer를 공유한다.
- Soft Parameter Sharing은 별도 모델 간 파라미터 유사성을 유도한다.
- 전체 Loss는 Task별 Loss의 가중합으로 표현할 수 있다.
- Task 간 관련성이 낮으면 Negative Transfer가 발생할 수 있다.
- Gradient Conflict가 발생할 수 있다.
- Multi-Label Classification과 구분해야 한다.
- 전이학습과도 같은 개념이 아니다.
### 자주 나오는 문장
**Q. 멀티태스크 학습이란 무엇인가?**
서로 관련된 여러 Task를 하나의 모델에서 함께 학습하면서 공통 Representation을 공유하는 방법입니다.
**Q. Hard Parameter Sharing이란 무엇인가?**
여러 Task가 모델의 일부 Layer와 파라미터를 직접 공유하고, 마지막 Task-Specific Head만 따로 사용하는 방식입니다.
**Q. Negative Transfer란 무엇인가?**
서로 관련성이 낮은 Task를 함께 학습하면서 한 Task의 학습이 다른 Task의 성능을 떨어뜨리는 현상입니다.
**Q. 멀티태스크 학습과 전이학습의 차이는 무엇인가?**
멀티태스크 학습은 여러 Task를 동시에 학습하지만, 전이학습은 한 문제에서 학습한 지식을 다른 문제에 재사용합니다.

<blockquote class="prompt-warning">
<p>멀티태스크 학습은 Task를 많이 붙이는 것이 목적이 아니라, 관련된 Task 사이에서 유용한 Representation을 공유하는 것이 핵심입니다.</p>
</blockquote>

## 예시로 한 바퀴
하나의 얼굴 이미지에서 두 가지 Task를 수행한다고 하겠습니다.

```text
얼굴 이미지
↓
Shared CNN
├─ 표정 분류 Head
└─ 얼굴 방향 예측 Head
```

Shared CNN은 눈, 코, 입, 얼굴 형태 같은 공통 특징을 학습합니다.
각 Head는 다른 목적을 수행합니다.

```text
Task A: 표정 → 분류 Loss
Task B: 얼굴 방향 → 회귀 Loss
```

전체 Loss는 다음처럼 구성할 수 있습니다.
$$L=\lambda_1L_{\mathrm{emotion}}+\lambda_2L_{\mathrm{pose}}$$
두 Loss의 Gradient가 Shared CNN을 함께 업데이트합니다.
이 과정에서 두 Task가 서로 관련된 특징을 공유하면 각각 따로 학습하는 것보다 좋은 Representation을 얻을 수 있습니다.
## 객관식 문제
### 1. 멀티태스크 학습의 핵심은?
① 하나의 Task만 반복 학습한다.  
② 여러 관련 Task를 함께 학습하며 정보를 공유한다.  
③ 모든 Task를 서로 다른 모델로만 학습한다.  
④ 반드시 라벨이 없어야 한다.

<details>
<summary>정답</summary>

②

</details>

### 2. Hard Parameter Sharing의 설명으로 옳은 것은?
① Task마다 모든 파라미터가 완전히 다르다.  
② 여러 Task가 일부 Layer의 파라미터를 직접 공유한다.  
③ Loss를 계산하지 않는다.  
④ 하나의 Task만 학습한다.

<details>
<summary>정답</summary>

②

</details>

### 3. 다음 중 Negative Transfer의 설명은?
① Task를 함께 학습해 모든 성능이 상승하는 현상  
② 관련성이 낮은 Task의 학습이 다른 Task의 성능을 떨어뜨리는 현상  
③ Loss가 항상 0이 되는 현상  
④ 모델 파라미터가 감소하는 현상

<details>
<summary>정답</summary>

②

</details>

### 4. 전체 Multi-Task Loss의 일반적인 형태는?
① Task 하나의 Loss만 사용  
② Task별 Loss의 가중합  
③ Loss를 사용하지 않음  
④ 입력 데이터의 평균만 사용

<details>
<summary>정답</summary>

②

</details>

### 5. Multi-Label Classification과 Multi-Task Learning의 차이로 옳은 것은?
① 완전히 같은 개념이다.  
② Multi-Label은 하나의 Task에서 여러 Label을 예측할 수 있다.  
③ Multi-Task는 반드시 출력이 하나다.  
④ Multi-Label은 여러 모델을 동시에 학습하는 방법이다.

<details>
<summary>정답</summary>

②

</details>

### 6. 멀티태스크 학습과 전이학습의 관계로 옳은 것은?
① 항상 같은 개념이다.  
② 멀티태스크는 여러 Task를 동시에 학습하고, 전이학습은 기존 지식을 다른 Task에 재사용한다.  
③ 전이학습에서는 사전학습을 사용할 수 없다.  
④ 멀티태스크 학습에서는 Representation을 공유할 수 없다.

<details>
<summary>정답</summary>

②

</details>

## 다음에 이을 글
메타학습(Meta-Learning)입니다.  
여러 Task의 경험을 이용해 새로운 Task를 더 빠르게 학습하는 방법입니다.
