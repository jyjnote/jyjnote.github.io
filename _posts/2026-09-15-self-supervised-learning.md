---
title: 자기지도학습
date: 2026-09-15 00:10:00 +0900
slug: self-supervised-learning
permalink: /posts/self-supervised-learning/
categories: [AI, 딥러닝, 학습 패러다임]
tags: [자기지도학습, Self-Supervised Learning, SSL, Contrastive Learning, Masked Modeling]
math: true
---

자기지도학습(Self-Supervised Learning)은 **사람이 정답 라벨을 직접 만들지 않고, 데이터 자체에서 학습할 문제와 정답을 만들어 학습하는 방법**입니다.  
대량의 비라벨 데이터에서 유용한 특징 표현을 학습할 때 사용합니다.

<blockquote class="prompt-info">
<p>한 줄: 데이터 자체에서 문제와 정답을 만들어 Representation을 학습합니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

라벨 없이도 데이터 일부를 가리거나 변형해 원래 정보를 맞히게 하면서 특징을 학습합니다.

</details>

## 왜 필요한가
지도학습은 성능이 좋지만 라벨을 만드는 비용이 큽니다.
반면 인터넷에는 라벨이 없는 이미지, 문장, 음성 데이터가 훨씬 많습니다.
자기지도학습은 이 비라벨 데이터를 그대로 활용합니다.

<mark>핵심은 사람이 라벨을 만들지 않아도 데이터 자체에서 학습 신호를 얻는다는 점입니다.</mark>

## 기본 아이디어
다음 문장이 있다고 하겠습니다.

```text
I love AI
```

일부 단어를 가립니다.

```text
I [MASK] AI
```

모델은 가려진 단어를 예측합니다.

```text
love
```

사람이 `love`라는 라벨을 따로 붙이지 않았습니다.
원래 문장 자체가 정답을 제공합니다.

## 전체 흐름
```text
대량의 비라벨 데이터
        ↓
학습 문제 자동 생성
        ↓
자기지도 사전학습
        ↓
Representation 학습
        ↓
Downstream Task에 활용
```

Downstream Task는 실제로 해결하려는 최종 문제입니다.
예:

- 이미지 분류
- 객체 탐지
- 감정 분석
- 문서 분류
- 음성 인식

## Representation Learning
자기지도학습의 중요한 목적은 자동 생성된 문제 자체를 잘 푸는 것이 아닙니다.
**다른 문제에도 사용할 수 있는 좋은 Representation을 학습하는 것**이 중요합니다.
이미지라면 모양, 경계, 질감, 객체 구조 같은 특징을 학습할 수 있습니다.

<blockquote class="prompt-info">
<p>자기지도학습의 핵심 목적은 재사용 가능한 좋은 특징 표현을 학습하는 것입니다.</p>
</blockquote>

## Pretext Task
자기지도학습을 위해 자동으로 만든 사전학습 문제를 **Pretext Task**라고 합니다.
예:

```text
I [MASK] AI
```

가려진 단어를 맞히게 하거나,

```text
이미지 일부 가리기
↓
가려진 부분 복원
```

같은 문제를 만들 수 있습니다.
Pretext Task는 최종 목적이 아니라 좋은 Representation을 학습하기 위한 수단입니다.

## Pretext Task와 Downstream Task
| 구분 | 의미 |
| --- | --- |
| Pretext Task | 자기지도학습을 위한 자동 생성 문제 |
| Downstream Task | 실제로 해결하려는 최종 문제 |

예를 들어 `가려진 단어 예측`은 Pretext Task이고, `영화 리뷰 감정 분류`는 Downstream Task가 될 수 있습니다.

## 대표적인 방식
대표적인 방식은 다음과 같습니다.

- Predictive Learning
- Masked Modeling
- Contrastive Learning

## Predictive Learning
데이터 일부를 보고 다른 부분을 예측합니다.

예:

```text
I love
```

다음 단어:

```text
AI
```

데이터 안에 존재하는 관계를 이용해 학습 문제를 만드는 방식입니다.

## Masked Modeling
데이터 일부를 가리고 원래 값을 맞힙니다.

```text
I [MASK] AI
```

정답:

```text
love
```

이미지에서도 일부 Patch를 가리고 원래 정보를 복원하게 할 수 있습니다.

<mark>가려진 원래 데이터가 자동으로 정답 역할을 합니다.</mark>

## Contrastive Learning
Contrastive Learning은 **비슷한 데이터 표현은 가깝게, 다른 데이터 표현은 멀게** 만드는 방식입니다.

같은 이미지에 서로 다른 변형을 적용합니다.

```text
원본 이미지
├─ Crop
└─ Color Jitter
```

두 이미지는 겉모습은 달라도 같은 원본에서 나왔습니다.

모델은 두 이미지의 Representation을 비슷하게 학습합니다.

## Positive Pair와 Negative Pair
| 구분 | 의미 |
| --- | --- |
| Positive Pair | 같은 의미라고 보는 데이터 쌍 |
| Negative Pair | 서로 다른 의미라고 보는 데이터 쌍 |

같은 이미지에서 만든 두 변형은 Positive Pair가 될 수 있습니다.

서로 다른 이미지는 Negative Pair가 될 수 있습니다.

## 데이터 증강
Contrastive Learning에서는 Data Augmentation이 중요합니다.

예:

- Crop
- Flip
- Rotation
- Color Jitter
- Noise

<blockquote class="prompt-warning">
<p>데이터 증강이 원래 의미까지 바꾸면 잘못된 Positive Pair가 만들어질 수 있습니다.</p>
</blockquote>

## Encoder
Encoder는 입력을 특징 벡터로 변환합니다.

$$\mathbf{z}=f_{\theta}(\mathbf{x})$$

- $$\mathbf{x}$$: 입력 데이터
- $$f_{\theta}$$: Encoder
- $$\mathbf{z}$$: Representation

자기지도학습이 끝난 뒤 Encoder를 다른 작업에 재사용할 수 있습니다.

## 사전학습과 Fine-tuning
자기지도학습은 보통 사전학습 단계에서 많이 사용됩니다.

```text
비라벨 데이터
↓
자기지도 사전학습
↓
Pretrained Model
↓
소량의 라벨 데이터
↓
Fine-tuning
↓
최종 모델
```

## 자기지도학습과 전이학습
두 개념은 같지 않습니다.

| 구분 | 자기지도학습 | 전이학습 |
| --- | --- | --- |
| 핵심 | 데이터 자체에서 학습 신호 생성 | 기존 지식을 다른 문제에 활용 |
| 목적 | Representation 학습 | 지식 재사용 |
| 라벨 | 사람이 만든 라벨이 필수 아님 | 사전학습 방식에 따라 다름 |
| 관계 | 사전학습 방법으로 자주 사용 | 자기지도 모델을 활용할 수 있음 |

<mark>자기지도학습은 학습 방법이고, 전이학습은 학습한 지식을 새로운 문제에 활용하는 전략입니다.</mark>

## 자기지도학습과 준지도학습
가장 자주 헷갈리는 부분입니다.

| 구분 | 자기지도학습 | 준지도학습 |
| --- | --- | --- |
| 실제 라벨 | 필수 아님 | 일부 존재 |
| 비라벨 데이터 | 사용 | 사용 |
| 학습 신호 | 데이터 자체에서 생성 | 실제 라벨 + 비라벨 데이터 |
| 대표 방식 | Masked Modeling, Contrastive Learning | Pseudo-Labeling, Consistency Regularization |

준지도학습은 일부 실제 라벨을 사용하지만, 자기지도학습은 사람이 만든 라벨 없이 학습 신호를 만듭니다.

## 비지도학습과 차이
| 구분 | 비지도학습 | 자기지도학습 |
| --- | --- | --- |
| 핵심 | 데이터 구조 탐색 | 예측 문제 자동 생성 |
| 예시 | K-Means, PCA | Masked Modeling, Contrastive Learning |
| 정답 | 명시적 정답이 없는 경우 많음 | 데이터 자체에서 정답 생성 |

자기지도학습은 사람이 만든 라벨은 없지만, 데이터 자체에서 예측 목표를 만듭니다.

## 네 가지 학습 방식 비교
| 구분 | 라벨 | 핵심 |
| --- | --- | --- |
| 지도학습 | 있음 | 정답 라벨로 학습 |
| 비지도학습 | 없음 | 데이터 구조 탐색 |
| 준지도학습 | 일부 있음 | 라벨 + 비라벨 데이터 활용 |
| 자기지도학습 | 사람이 만든 라벨 없음 | 데이터 자체에서 학습 신호 생성 |

## 장점
### 1. 라벨링 비용 감소
사람이 직접 모든 데이터에 정답을 붙일 필요가 없습니다.

### 2. 대규모 데이터 활용
웹 문서, 이미지, 음성처럼 라벨이 없는 데이터를 사용할 수 있습니다.

### 3. 좋은 Representation 학습
여러 Downstream Task에 재사용할 수 있는 특징을 학습할 수 있습니다.

### 4. 적은 라벨 데이터 활용
자기지도 사전학습 후 소량의 라벨 데이터로 Fine-tuning할 수 있습니다.

## 단점
### 1. 높은 계산 비용
대규모 비라벨 데이터를 학습하면 많은 연산량이 필요할 수 있습니다.

### 2. Pretext Task 설계
잘못된 학습 문제를 만들면 실제 문제에 유용하지 않은 특징을 배울 수 있습니다.

### 3. 데이터 품질 의존
편향되거나 품질이 낮은 데이터는 학습 결과에 영향을 줄 수 있습니다.

## NLP에서의 자기지도학습
대표적으로 다음 방식이 있습니다.

- Masked Language Modeling
- Next Token Prediction

### Masked Language Modeling
```text
I [MASK] AI
```

정답:

```text
love
```

주변 문맥으로 가려진 Token을 예측합니다.

### Next Token Prediction
앞의 Token으로 다음 Token을 예측합니다.

$$P(w_t\mid w_1,\ldots,w_{t-1})$$

예:

```text
I love → AI
```

## Computer Vision에서의 자기지도학습
대표적으로

- 같은 이미지의 서로 다른 View 비교
- 이미지 Patch Masking
- 가려진 영역 복원
- Contrastive Learning

등을 사용합니다.

### Masked Image Modeling
```text
이미지
↓
Patch 분할
↓
일부 Patch Masking
↓
가려진 정보 예측
```

주변 정보를 이용해 가려진 이미지 정보를 추론합니다.

## 잘 놓치는 핵심
### 1. 자기지도학습은 비지도학습과 완전히 같지 않다
둘 다 사람이 만든 라벨 없이 학습할 수 있지만, 자기지도학습은 데이터에서 예측 문제와 정답을 자동 생성합니다.

### 2. 자기지도학습에도 정답은 존재할 수 있다
사람이 만든 정답 라벨이 없다는 뜻이지, 학습 목표에 정답이 없다는 뜻은 아닙니다.

Masked Modeling에서는 가려진 원래 값이 정답입니다.

### 3. 자기지도학습과 전이학습은 다르다
자기지도학습으로 사전학습한 모델을 전이학습에 활용할 수 있습니다.

### 4. 준지도학습과 구분해야 한다
준지도학습은 일부 실제 라벨을 사용합니다.

자기지도학습은 데이터 자체에서 학습 신호를 만듭니다.

### 5. Pretext Task는 최종 목적이 아니다
Pretext Task는 좋은 Representation을 학습하기 위한 수단입니다.

## 시험·면접
### 핵심 암기 포인트
- 사람이 만든 라벨 없이 학습할 수 있다.
- 데이터 자체에서 학습 신호를 생성한다.
- Pretext Task를 사용한다.
- 핵심 목적은 좋은 Representation 학습이다.
- Masked Modeling과 Contrastive Learning이 대표적이다.
- 준지도학습, 비지도학습, 전이학습과 구분해야 한다.
- 자기지도 사전학습 후 Fine-tuning할 수 있다.

### 자주 나오는 문장
**Q. 자기지도학습이란 무엇인가?**

데이터 자체에서 학습에 사용할 문제와 정답을 자동 생성하여 Representation을 학습하는 방법입니다.

**Q. 준지도학습과 차이는 무엇인가?**

준지도학습은 일부 실제 라벨을 사용하지만, 자기지도학습은 사람이 만든 라벨 없이 데이터 자체에서 학습 신호를 생성합니다.

**Q. 전이학습과 차이는 무엇인가?**

자기지도학습은 Representation을 학습하는 방법이고, 전이학습은 기존에 학습한 지식을 새로운 문제에 활용하는 전략입니다.

<blockquote class="prompt-warning">
<p>자기지도학습은 정답이 없는 학습이 아니라, 사람이 만든 정답 라벨 없이 데이터 자체에서 정답을 만드는 학습입니다.</p>
</blockquote>

또한 Self-Supervised Learning과 Semi-Supervised Learning 모두 문맥에 따라 SSL이라고 줄여 쓰는 경우가 있어 문맥을 확인해야 합니다.

## 예시로 한 바퀴
대량의 이미지에 사람이 라벨을 붙이지 않고 같은 이미지에 서로 다른 변형을 적용합니다.

```text
이미지 A
├─ Crop
└─ Color Jitter
```

두 이미지를 Positive Pair로 보고 Representation을 비슷하게 학습합니다.

이후 소량의 라벨 데이터로 Fine-tuning합니다.

```text
비라벨 이미지
↓
자기지도학습
↓
Representation 학습
↓
소량의 라벨 데이터
↓
Fine-tuning
↓
이미지 분류
```

## 객관식 문제
### 1. 자기지도학습의 가장 적절한 설명은?
① 사람이 모든 데이터에 정답을 붙인다.  
② 데이터 자체에서 학습 신호를 생성한다.  
③ 일부 라벨 데이터만 제거한다.  
④ 군집 개수만 자동으로 결정한다.

<details>
<summary>정답</summary>

②

</details>

### 2. 자기지도학습의 대표적인 방법은?
① K-Means  
② Linear Regression  
③ Masked Modeling  
④ Decision Tree

<details>
<summary>정답</summary>

③

</details>

### 3. 준지도학습과 자기지도학습의 차이로 옳은 것은?
① 준지도학습은 비라벨 데이터만 사용한다.  
② 자기지도학습은 반드시 사람이 만든 라벨을 사용한다.  
③ 준지도학습은 일부 실제 라벨을 사용한다.  
④ 두 방법은 완전히 같다.

<details>
<summary>정답</summary>

③

</details>

### 4. Contrastive Learning의 Positive Pair는?
① 반드시 서로 다른 클래스의 데이터  
② 같은 의미라고 보는 데이터 쌍  
③ 항상 잘못 분류된 데이터  
④ 라벨이 없는 모든 데이터

<details>
<summary>정답</summary>

②

</details>

### 5. Pretext Task의 주된 목적은?
① 최종 결과를 바로 출력하기 위해  
② 저장 공간을 줄이기 위해  
③ 유용한 Representation을 학습하기 위해  
④ 라벨 수를 증가시키기 위해

<details>
<summary>정답</summary>

③

</details>

### 6. 자기지도학습과 전이학습의 관계로 옳은 것은?
① 두 개념은 항상 동일하다.  
② 자기지도학습으로 사전학습한 모델을 전이학습에 활용할 수 있다.  
③ 전이학습에서는 사전학습 모델을 사용할 수 없다.  
④ 자기지도학습은 반드시 라벨 데이터로 시작한다.

<details>
<summary>정답</summary>

②

</details>

## 다음에 이을 글
강화학습(Reinforcement Learning)입니다.  
환경과 상호작용하면서 보상을 최대화하는 행동을 학습합니다.
