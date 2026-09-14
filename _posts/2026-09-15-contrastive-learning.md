---
title: 대조학습
date: 2026-09-15 00:20:00 +0900
slug: contrastive-learning
permalink: /posts/contrastive-learning/
categories: [AI, 딥러닝, 학습 패러다임]
tags: [대조학습, Contrastive Learning, InfoNCE, Positive Pair, Negative Pair, SimCLR]
math: true
---

대조학습(Contrastive Learning)은 **비슷한 데이터의 표현은 가깝게, 다른 데이터의 표현은 멀어지게 학습하는 방법**입니다.  
라벨이 없는 데이터에서도 좋은 Representation을 학습할 수 있어 자기지도학습에서 자주 사용됩니다.

<blockquote class="prompt-info">
<p>한 줄: 같은 의미는 가깝게, 다른 의미는 멀게 표현하도록 학습합니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>
Positive Pair의 임베딩은 가깝게 만들고, Negative Pair의 임베딩은 멀게 만드는 Representation Learning 방법입니다.

</details>

## 왜 필요한가
분류 모델은 보통 정답 라벨을 이용해

```text
이미지 → 고양이
```

처럼 직접 클래스를 학습합니다.
하지만 라벨이 없는 이미지가 매우 많다면 이런 방식으로 학습하기 어렵습니다.
대조학습은 클래스 이름을 직접 알려주지 않아도

```text
이 둘은 같은 의미
이 둘은 다른 의미
```

라는 관계를 이용해 특징을 학습합니다.
<mark>핵심은 정답 클래스보다 데이터 사이의 상대적인 유사성을 학습하는 것입니다.</mark>
## 기본 아이디어
같은 이미지에 서로 다른 변형을 적용했다고 하겠습니다.

```text
원본 이미지 A
├─ Crop
└─ Color Jitter
```

두 이미지는 픽셀 값은 달라도 같은 원본에서 나왔습니다.
따라서 두 표현은 가깝게 만듭니다.
반대로 다른 이미지 B의 표현은 멀게 만듭니다.

```text
A의 View 1 ── 가까이 ── A의 View 2
A의 View 1 ───────── 멀리 ───────── B
```

## Positive Pair
Positive Pair는 **서로 같은 의미라고 간주하는 데이터 쌍**입니다.
예를 들어 같은 이미지에 서로 다른 데이터 증강을 적용하면 Positive Pair를 만들 수 있습니다.

```text
자동차 이미지
├─ Crop
└─ Flip
```

두 결과는 모양이 조금 달라도 같은 자동차입니다.
따라서 모델은 두 표현을 가깝게 학습합니다.
## Negative Pair
Negative Pair는 **서로 다른 의미라고 간주하는 데이터 쌍**입니다.
예를 들어

```text
자동차 이미지
강아지 이미지
```

는 서로 다른 데이터이므로 Negative Pair로 사용할 수 있습니다.
모델은 두 데이터의 Representation이 멀어지도록 학습합니다.
## Positive와 Negative 비교

| 구분 | 의미 | 학습 방향 |
| --- | --- | --- |
| Positive Pair | 같은 의미라고 보는 데이터 쌍 | 표현을 가깝게 |
| Negative Pair | 다른 의미라고 보는 데이터 쌍 | 표현을 멀게 |

## Representation
대조학습은 입력 데이터를 직접 비교하기보다 Encoder를 통해 벡터로 바꾼 뒤 비교합니다.
$$\mathbf{h}=f_{\theta}(\mathbf{x})$$
- $$\mathbf{x}$$: 입력 데이터
- $$f_{\theta}$$: Encoder
- $$\mathbf{h}$$: Representation
좋은 Representation이라면 의미가 비슷한 데이터가 벡터 공간에서도 가까이 위치해야 합니다.
## Similarity
두 벡터가 얼마나 비슷한지 계산하기 위해 Similarity 함수를 사용합니다.
대표적으로 Cosine Similarity가 사용됩니다.
$$\mathrm{sim}(\mathbf{u},\mathbf{v})=\frac{\mathbf{u}^{T}\mathbf{v}}{\|\mathbf{u}\|\|\mathbf{v}\|}$$
값이 클수록 두 벡터의 방향이 비슷합니다.
대조학습에서는 Positive Pair의 Similarity는 높이고, Negative Pair의 Similarity는 낮추도록 학습합니다.
## 전체 학습 흐름

```text
원본 데이터
↓
서로 다른 데이터 증강
↓
두 개의 View 생성
↓
Encoder
↓
Representation
↓
Similarity 계산
↓
Contrastive Loss
↓
파라미터 업데이트
```

## Data Augmentation
자기지도 대조학습에서는 Positive Pair를 만들기 위해 데이터 증강을 많이 사용합니다.
이미지에서는
- Random Crop
- Flip
- Rotation
- Color Jitter
- Gaussian Blur
등이 사용될 수 있습니다.
같은 이미지에 서로 다른 증강을 적용하면 두 개의 View를 얻을 수 있습니다.

```text
이미지 A
├─ View 1
└─ View 2
```

두 View를 Positive Pair로 봅니다.

<blockquote class="prompt-warning">
<p>증강이 너무 강해 원래 의미가 달라지면 잘못된 Positive Pair가 만들어질 수 있습니다.</p>
</blockquote>

## 왜 데이터 증강이 중요한가
대조학습은 모델에게 다음과 같은 성질을 학습시킬 수 있습니다.

```text
색이 조금 달라도 같은 객체
일부가 잘려도 같은 객체
밝기가 달라도 같은 객체
```

즉, 중요하지 않은 변화에는 둔감하고 의미 있는 특징에는 민감한 Representation을 만들 수 있습니다.
이러한 성질을 Invariance라고 합니다.
## Invariance
Invariance는 입력이 조금 변해도 Representation이 크게 변하지 않는 성질입니다.
예를 들어 고양이 사진을 조금 자르거나 밝기를 바꿔도 여전히 고양이입니다.
대조학습은 이런 변형에 대해 Representation을 비슷하게 유지하도록 학습할 수 있습니다.
## Encoder와 Projection Head
대표적인 대조학습 구조에서는 Encoder 뒤에 Projection Head를 붙이기도 합니다.

```text
입력
↓
Encoder
↓
Representation h
↓
Projection Head
↓
Projection z
↓
Contrastive Loss
```

Encoder는 실제 Downstream Task에서 사용할 특징을 학습합니다.
Projection Head는 대조학습 Loss를 계산하기 위한 공간으로 변환합니다.
## Projection Head
Projection Head는 보통 작은 MLP로 구성할 수 있습니다.
$$\mathbf{z}=g(\mathbf{h})$$
- $$\mathbf{h}$$: Encoder 출력
- $$g$$: Projection Head
- $$\mathbf{z}$$: Contrastive Loss에 사용하는 벡터
학습이 끝난 뒤에는 Projection Head를 제거하고 Encoder의 Representation만 사용하는 경우도 많습니다.
## Contrastive Loss
대조학습의 Loss는
- Positive Pair는 가깝게
- Negative Pair는 멀게
만드는 방향으로 설계됩니다.
대표적인 Loss가 InfoNCE입니다.
## InfoNCE
InfoNCE는 Positive Pair와 여러 Negative Pair를 비교하는 대표적인 Contrastive Loss입니다.
간단한 형태는 다음과 같습니다.
$$L_i=-\log\frac{\exp(\mathrm{sim}(\mathbf{z}_i,\mathbf{z}_j)/\tau)}{\sum_{k}\exp(\mathrm{sim}(\mathbf{z}_i,\mathbf{z}_k)/\tau)}$$
여기서
- $$\mathbf{z}_i$$: 기준 Sample
- $$\mathbf{z}_j$$: Positive Sample
- $$\mathbf{z}_k$$: 비교 대상
- $$\tau$$: Temperature
분자는 Positive Pair의 유사도를 나타냅니다.
분모에는 Positive와 Negative 후보들이 함께 들어갑니다.
결국 Positive Pair의 상대적 유사도가 높아지도록 학습합니다.
## Temperature
Temperature는 Similarity의 분포를 얼마나 날카롭게 만들지 조절하는 값입니다.
$$\frac{\mathrm{sim}(\mathbf{u},\mathbf{v})}{\tau}$$
$$\tau$$가 작아지면 유사도 차이가 더 크게 강조됩니다.
$$\tau$$가 커지면 분포가 더 완만해집니다.
<mark>Temperature는 Positive와 Negative 사이의 상대적 구분 강도에 영향을 줍니다.</mark>
## 배치와 Negative Sample
일부 대조학습 방식에서는 같은 Mini-batch 안의 다른 Sample들을 Negative로 사용합니다.
예를 들어 배치에

```text
A1, A2
B1, B2
C1, C2
```

가 있다고 하겠습니다.
A1과 A2는 Positive Pair입니다.
A1을 기준으로 B1, B2, C1, C2는 Negative 후보가 될 수 있습니다.
## Hard Negative
Hard Negative는 서로 다른 데이터인데 Representation이 매우 비슷한 Sample입니다.
예를 들어

```text
고양이 A
고양이와 매우 비슷하게 생긴 다른 동물 B
```

처럼 모델이 쉽게 구분하기 어려운 경우입니다.
Hard Negative는 학습에 도움이 될 수 있지만 잘못 선택하면 오히려 문제가 생길 수 있습니다.
## False Negative
실제로는 의미가 비슷하지만 Negative로 잘못 취급된 Sample을 False Negative라고 합니다.
예를 들어 서로 다른 사진이지만 둘 다 같은 고양이 클래스일 수 있습니다.
자기지도 대조학습에서는 실제 라벨을 모르기 때문에 이런 문제가 발생할 수 있습니다.

<blockquote class="prompt-warning">
<p>서로 다른 Sample이라고 해서 항상 의미까지 다른 것은 아닙니다. False Negative가 생길 수 있습니다.</p>
</blockquote>

## 대표적인 대조학습 구조
대표적인 방법으로 다음이 자주 언급됩니다.
- SimCLR
- MoCo
- Supervised Contrastive Learning
## SimCLR
SimCLR은 같은 이미지에 두 가지 데이터 증강을 적용해 Positive Pair를 만듭니다.

```text
이미지
├─ Augmentation 1 → Encoder → z1
└─ Augmentation 2 → Encoder → z2
```

z1과 z2는 가깝게 만들고 다른 이미지의 Representation은 멀게 만듭니다.
특히 데이터 증강과 충분한 Negative Sample이 중요합니다.
## MoCo
MoCo는 Momentum Encoder와 Queue를 이용해 많은 Negative Sample을 유지하는 방식으로 알려져 있습니다.
핵심 구조는 다음과 같습니다.

```text
Query Encoder
Key Encoder
Queue
```

Key Encoder는 Momentum 방식으로 업데이트됩니다.
대규모 Negative Dictionary를 효율적으로 유지하는 것이 핵심 아이디어입니다.
## Supervised Contrastive Learning
대조학습은 반드시 자기지도학습에서만 사용하는 것은 아닙니다.
라벨이 있다면 같은 클래스의 여러 Sample을 Positive로 묶을 수 있습니다.
예를 들어

```text
고양이 A
고양이 B
고양이 C
```

를 서로 Positive로 사용할 수 있습니다.
이를 Supervised Contrastive Learning이라고 합니다.
## 자기지도학습과 대조학습
두 개념은 같지 않습니다.

| 구분 | 자기지도학습 | 대조학습 |
| --- | --- | --- |
| 의미 | 데이터 자체에서 학습 신호 생성 | 유사한 표현은 가깝게, 다른 표현은 멀게 학습 |
| 범위 | 더 넓음 | 하나의 학습 방식 |
| 대표 방식 | Masked Modeling, Contrastive Learning | SimCLR, MoCo 등 |

<mark>대조학습은 자기지도학습의 대표적인 방법 중 하나지만, 대조학습 자체가 항상 자기지도학습인 것은 아닙니다.</mark>
## Metric Learning과의 관계
Metric Learning 역시

```text
같은 의미 → 가깝게
다른 의미 → 멀게
```

만드는 것을 목표로 합니다.
## Triplet Loss와 비교
Triplet Loss는 세 개의 Sample을 사용합니다.

```text
Anchor
Positive
Negative
```

목표는

```text
Anchor와 Positive는 가깝게
Anchor와 Negative는 멀게
```

만드는 것입니다.
간단한 형태는 다음과 같습니다.
$$L=\max(0,d(a,p)-d(a,n)+m)$$
- $$a$$: Anchor
- $$p$$: Positive
- $$n$$: Negative
- $$m$$: Margin
## Contrastive Learning과 Triplet Loss

| 구분 | Contrastive Learning | Triplet Loss |
| --- | --- | --- |
| 기본 관계 | Positive와 Negative 비교 | Anchor, Positive, Negative |
| 주요 목적 | Representation 학습 | 거리 구조 학습 |
| 대표 Loss | InfoNCE | Triplet Loss |
| 공통점 | 같은 것은 가깝게, 다른 것은 멀게 |

## 장점
### 1. 비라벨 데이터 활용
사람이 클래스 라벨을 붙이지 않아도 학습할 수 있습니다.
### 2. 좋은 Representation 학습
다양한 Downstream Task에서 재사용할 수 있는 특징을 학습할 수 있습니다.
### 3. 데이터 변형에 강한 표현
적절한 Data Augmentation을 사용하면 중요하지 않은 변화에 강한 Representation을 만들 수 있습니다.
## 단점
### 1. Pair 설계가 중요함
Positive와 Negative를 잘못 정의하면 잘못된 특징을 학습할 수 있습니다.
### 2. 계산 비용
많은 Sample과 비교해야 하므로 연산량이 커질 수 있습니다.
### 3. False Negative 문제
실제로 비슷한 Sample을 Negative로 처리할 수 있습니다.
### 4. 데이터 증강 의존
어떤 Augmentation을 사용하는지에 따라 학습 품질이 크게 달라질 수 있습니다.
## 잘 놓치는 핵심
### 1. Positive Pair는 반드시 완전히 같은 데이터일 필요가 없다
같은 이미지에 서로 다른 Augmentation을 적용한 결과도 Positive Pair가 될 수 있습니다.
### 2. Negative Pair는 반드시 다른 클래스라는 보장이 없다
라벨이 없는 자기지도학습에서는 서로 다른 Sample을 Negative로 두더라도 실제 의미가 같을 수 있습니다.
이것이 False Negative 문제입니다.
### 3. 대조학습은 자기지도학습과 같은 말이 아니다
자기지도학습은 더 넓은 개념입니다.
대조학습은 그 안에서 사용할 수 있는 대표적인 학습 방식입니다.
### 4. Projection Head와 Encoder를 구분해야 한다
Projection Head는 Contrastive Loss를 계산할 공간을 만드는 역할을 합니다.
Downstream Task에서는 Encoder Representation을 주로 사용합니다.
### 5. Temperature는 학습 강도에 영향을 준다
Temperature가 작으면 유사도 차이가 더 강하게 강조됩니다.
### 6. 데이터 증강이 핵심이다
자기지도 대조학습에서 Positive Pair를 어떻게 만들지 결정하기 때문에 Augmentation 설계가 매우 중요합니다.
## 시험·면접
### 핵심 암기 포인트
- Positive Pair는 가깝게 만든다.
- Negative Pair는 멀게 만든다.
- Cosine Similarity가 자주 사용된다.
- InfoNCE가 대표적인 Contrastive Loss다.
- Temperature는 유사도 분포의 날카로움을 조절한다.
- Data Augmentation으로 Positive Pair를 만들 수 있다.
- SimCLR과 MoCo가 대표적인 방법이다.
- False Negative 문제가 발생할 수 있다.
- 대조학습과 자기지도학습은 같은 개념이 아니다.
### 자주 나오는 문장
**Q. 대조학습이란 무엇인가?**
비슷한 데이터의 Representation은 가깝게 만들고, 다른 데이터의 Representation은 멀어지게 학습하는 방법입니다.
**Q. Positive Pair는 무엇인가?**
같은 의미라고 간주하여 Representation을 가깝게 학습하는 데이터 쌍입니다.
**Q. InfoNCE의 역할은 무엇인가?**
Positive Pair의 상대적 유사도를 높이고 Negative Pair와 구분되도록 학습하는 대표적인 Contrastive Loss입니다.
**Q. Temperature는 무엇인가?**
Similarity 값의 상대적인 차이를 얼마나 강하게 반영할지 조절하는 값입니다.

<blockquote class="prompt-warning">
<p>대조학습의 핵심은 단순히 거리를 줄이는 것이 아니라 Positive와 Negative의 상대적인 관계를 학습하는 것입니다.</p>
</blockquote>

## 예시로 한 바퀴
고양이 이미지 A가 있다고 하겠습니다.
두 가지 증강을 적용합니다.

```text
A
├─ Crop → A1
└─ Color Jitter → A2
```

A1과 A2는 Positive Pair입니다.
다른 강아지 이미지 B가 있다면 B는 Negative 후보가 될 수 있습니다.
각 이미지를 Encoder에 넣습니다.

```text
A1 → Encoder → z1
A2 → Encoder → z2
B  → Encoder → z3
```

학습 목표는 다음과 같습니다.

```text
z1 ↔ z2 : 가깝게
z1 ↔ z3 : 멀게
```

이 과정을 반복하면 Encoder는 픽셀의 작은 차이보다 객체의 의미를 반영하는 Representation을 학습할 수 있습니다.
## 객관식 문제
### 1. 대조학습의 핵심 목표는?
① 모든 Sample의 표현을 같게 만든다.  
② Positive Pair는 가깝게, Negative Pair는 멀게 만든다.  
③ 라벨 수를 증가시킨다.  
④ 입력 데이터 크기를 줄인다.

<details>
<summary>정답</summary>
②

</details>

### 2. Positive Pair의 가장 적절한 설명은?
① 반드시 서로 다른 클래스의 데이터  
② 같은 의미라고 간주하는 데이터 쌍  
③ 학습에서 제거할 데이터  
④ Loss가 가장 큰 데이터

<details>
<summary>정답</summary>
②

</details>

### 3. 대표적인 Contrastive Loss는?
① MSE  
② Cross Entropy만 가능  
③ InfoNCE  
④ Hinge Loss만 가능

<details>
<summary>정답</summary>
③

</details>

### 4. Temperature의 역할로 가장 적절한 것은?
① 데이터 수를 증가시킨다.  
② Similarity 분포의 날카로움을 조절한다.  
③ Encoder의 층 수를 결정한다.  
④ 라벨을 자동 생성한다.

<details>
<summary>정답</summary>
②

</details>

### 5. False Negative는 무엇인가?
① 실제로는 비슷한 Sample을 Negative로 취급한 경우  
② Positive Pair가 완전히 같은 이미지인 경우  
③ Loss가 0이 된 경우  
④ Encoder가 없는 경우

<details>
<summary>정답</summary>
①

</details>

### 6. 자기지도학습과 대조학습의 관계로 옳은 것은?
① 항상 완전히 같은 개념이다.  
② 대조학습은 자기지도학습에서 사용할 수 있는 대표적인 방법이다.  
③ 자기지도학습에서는 대조학습을 사용할 수 없다.  
④ 대조학습은 반드시 사람이 만든 라벨이 필요하다.

<details>
<summary>정답</summary>
②

</details>

## 다음에 이을 글
SimCLR입니다.  
데이터 증강과 InfoNCE를 이용한 대표적인 자기지도 대조학습 방법입니다.
