---
title: 준지도학습
date: 2026-09-15 00:10:00 +0900
slug: semi-supervised-learning
permalink: /posts/semi-supervised-learning/
categories: [AI, 머신러닝, 학습 패러다임]
tags: [준지도학습, SemiSupervisedLearning, PseudoLabeling, SelfTraining, ConsistencyRegularization, 머신러닝, 빅분기]
math: true
---

준지도학습(Semi-Supervised Learning)은 **라벨이 있는 데이터와 라벨이 없는 데이터를 함께 사용하는 학습 방법**입니다.  
라벨 데이터가 적고 비라벨 데이터가 많을 때 유용합니다.

<blockquote class="prompt-info">
<p>한 줄: 소량의 라벨 데이터와 대량의 비라벨 데이터를 함께 활용합니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

준지도학습 = Labeled Data + Unlabeled Data

</details>

## 왜 필요한가
지도학습은 정답 라벨이 필요합니다.  
하지만 실제 데이터에서는 라벨을 만드는 비용이 큽니다.

```text
전체 이미지: 100,000장
라벨 이미지: 1,000장
비라벨 이미지: 99,000장
```

지도학습만 사용하면 1,000장만 학습에 사용합니다.  
준지도학습은 나머지 99,000장의 데이터 구조도 활용합니다.
<mark>비라벨 데이터에도 데이터의 분포와 구조에 대한 정보가 들어 있습니다.</mark>
## 기본 구조
라벨 데이터:

$$D_L=\{(x_i,y_i)\}_{i=1}^{n}$$

비라벨 데이터:

$$D_U=\{x_j\}_{j=1}^{m}$$

보통 다음과 같은 상황을 생각합니다.

$$m \gg n$$

즉, **비라벨 데이터가 라벨 데이터보다 훨씬 많습니다.**
## 핵심 예시
고양이와 강아지를 분류한다고 해보겠습니다.

```text
라벨 데이터
고양이 50장
강아지 50장
비라벨 데이터
동물 사진 10,000장
```

먼저 100장의 라벨 데이터로 모델을 학습합니다.  
그다음 비라벨 데이터를 예측합니다.

```text
사진 A → 고양이 99%
사진 B → 강아지 98%
사진 C → 고양이 54%
```

신뢰도가 높은 A와 B에 임시 정답을 붙여 다시 학습할 수 있습니다.  
이 방식이 대표적인 **Pseudo-Labeling**입니다.
## Pseudo-Labeling
Pseudo-Labeling은 모델이 비라벨 데이터에 **임시 정답**을 붙이는 방법입니다.  
한국어로는 의사 라벨링이라고 합니다.

```text
1. 라벨 데이터로 모델 학습
2. 비라벨 데이터 예측
3. 신뢰도 높은 예측 선택
4. 예측값을 Pseudo Label로 사용
5. 기존 라벨 데이터와 함께 다시 학습
```

<blockquote class="prompt-warning">
<p>Pseudo Label은 사람이 만든 실제 정답이 아니라 모델이 만든 임시 정답입니다.</p>
</blockquote>

## Confidence Threshold
모든 예측을 Pseudo Label로 사용하면 위험합니다.  
틀린 예측까지 다시 학습할 수 있기 때문입니다.
그래서 신뢰도 임계값을 둡니다.

$$\max_k P(y=k\mid x) \ge \tau$$

예를 들어 $$\tau=0.95$$라면 다음과 같습니다.

```text
0.99 → 사용
0.96 → 사용
0.81 → 제외
0.53 → 제외
```

임계값이 높으면 품질은 좋아지지만 사용할 데이터가 줄어듭니다.  
임계값이 낮으면 데이터는 늘지만 잘못된 라벨도 증가할 수 있습니다.
## Self-Training
Self-Training은 모델이 **자신의 예측을 이용해 다시 자신을 학습**하는 방식입니다.

```text
라벨 데이터로 학습
        ↓
비라벨 데이터 예측
        ↓
Pseudo Label 생성
        ↓
학습 데이터에 추가
        ↓
모델 재학습
```

<mark>Self-Training은 Pseudo Label을 이용해 반복적으로 다시 학습하는 전체 과정에 가깝습니다.</mark>
## Consistency Regularization
같은 데이터에 작은 변형을 주더라도 예측은 비슷해야 한다는 아이디어입니다.

```text
원본 이미지 → 고양이
밝기 변경   → 고양이
약간 회전   → 고양이
노이즈 추가 → 고양이
```

개념적으로 다음과 같이 표현할 수 있습니다.

$$f(x) \approx f(T(x))$$

전체 손실은 다음처럼 구성할 수 있습니다.

$$L=L_{sup}+\lambda L_{cons}$$

- $$L_{sup}$$: 라벨 데이터 손실
- $$L_{cons}$$: 예측 일관성 손실
- $$\lambda$$: 가중치
## Loss 관점
준지도학습에서는 라벨 데이터와 비라벨 데이터의 손실을 함께 사용합니다.

$$L=L_{labeled}+\lambda L_{unlabeled}$$

라벨 데이터에서는 실제 정답을 사용합니다.

$$L_{labeled}=CE(y,f(x))$$

Pseudo Label을 사용한다면 다음처럼 생각할 수 있습니다.

$$L_{unlabeled}=CE(\hat{y},f(x))$$

여기서 $$\hat{y}$$는 모델이 만든 임시 정답입니다.
## 핵심 가정
준지도학습은 비라벨 데이터를 넣는다고 무조건 좋아지는 것은 아닙니다.
### 1. Smoothness Assumption
서로 가까운 데이터는 비슷한 라벨을 가질 가능성이 높다고 가정합니다.
### 2. Cluster Assumption
같은 클래스의 데이터는 하나의 군집을 형성한다고 가정합니다.  
결정 경계는 데이터가 밀집된 곳보다 군집 사이를 지나는 것이 좋습니다.
### 3. Manifold Assumption
고차원 데이터가 실제로는 더 낮은 차원의 구조를 따라 분포한다고 가정합니다.
## 대표 방법

| 방법 | 핵심 아이디어 |
| --- | --- |
| Pseudo-Labeling | 모델 예측을 임시 정답으로 사용 |
| Self-Training | 자신의 예측으로 반복 학습 |
| Consistency Regularization | 입력이 변해도 예측을 비슷하게 유지 |
| Entropy Minimization | 비라벨 데이터 예측을 더 확신 있게 만듦 |
| Graph-Based Learning | 데이터 간 연결 관계를 이용 |

## Teacher-Student와 FixMatch
Teacher-Student 구조에서는 Teacher가 비라벨 데이터의 학습 신호를 만들고 Student가 이를 학습합니다.

```text
Teacher
   ↓ Pseudo Label
Student
   ↓ 학습
```

FixMatch는 **Pseudo-Labeling + Consistency Regularization**을 결합한 대표적인 방법입니다.

```text
Weak Augmentation
→ Pseudo Label 생성
Strong Augmentation
→ 같은 라벨이 나오도록 학습
```

## 지도학습과 비교

| 구분 | 지도학습 | 준지도학습 |
| --- | --- | --- |
| 라벨 데이터 | 필요 | 일부 필요 |
| 비라벨 데이터 | 보통 사용하지 않음 | 적극 활용 |
| 라벨링 비용 | 큼 | 상대적으로 작음 |
| 핵심 | 정답 기반 학습 | 적은 라벨 + 많은 비라벨 |

## 비지도학습과 비교

| 구분 | 비지도학습 | 준지도학습 |
| --- | --- | --- |
| 라벨 사용 | 없음 | 일부 있음 |
| 주요 목적 | 데이터 구조 발견 | 예측 성능 향상 |
| 대표 예 | Clustering, PCA | Pseudo-Labeling |

<mark>준지도학습에는 일부 실제 라벨이 존재합니다.</mark>
## 자기지도학습과 비교

| 구분 | 준지도학습 | 자기지도학습 |
| --- | --- | --- |
| 사람이 만든 라벨 | 일부 필요 | 사전학습에서는 불필요 |
| 학습 신호 | 실제 라벨 + 비라벨 | 데이터 자체에서 생성 |
| 대표 방법 | Pseudo-Labeling | Masking, Contrastive Learning |
| 주요 목적 | 적은 라벨로 성능 향상 | 표현 학습 |

BERT의 Masked Language Modeling은 자기지도학습의 대표적인 예입니다.

```text
나는 [MASK]를 먹었다
```

준지도학습은 이와 달리 일부 실제 라벨을 사용합니다.
## 전이학습과 비교

| 구분 | 전이학습 | 준지도학습 |
| --- | --- | --- |
| 핵심 | 기존 지식 재사용 | 라벨 + 비라벨 데이터 활용 |
| 대표 방법 | Fine-tuning | Pseudo-Labeling |
| 핵심 질문 | 어떤 지식을 가져올까? | 비라벨 데이터를 어떻게 쓸까? |

두 방법은 동시에 사용할 수도 있습니다.
## 장점
### 1. 라벨링 비용 감소
모든 데이터에 사람이 정답을 붙일 필요가 없습니다.
### 2. 비라벨 데이터 활용
현실에서 쉽게 얻을 수 있는 대량의 비라벨 데이터를 사용할 수 있습니다.
### 3. 적은 라벨로 성능 향상
특히 라벨 획득이 비싼 분야에서 유용합니다.

```text
의료 이미지
음성 데이터
대규모 문서
산업 이미지
```

## 단점
### 1. 잘못된 Pseudo Label
초기 모델의 틀린 예측이 다시 학습될 수 있습니다.
### 2. 데이터 분포 문제
라벨 데이터와 비라벨 데이터의 분포가 크게 다르면 성능이 떨어질 수 있습니다.
### 3. 설정이 복잡함

```text
Confidence Threshold
Unlabeled Loss Weight
Data Augmentation 강도
```

등을 조정해야 합니다.
## Confirmation Bias
Pseudo-Labeling에서 특히 주의해야 할 문제입니다.

```text
실제: 강아지
모델 예측: 고양이 0.97
```

이 예측을 Pseudo Label로 사용하면 모델은 자신의 틀린 예측을 다시 학습합니다.  
반복되면 잘못된 판단이 더 강해질 수 있습니다.

<blockquote class="prompt-danger">
<p>모델이 만든 라벨을 무조건 정답처럼 사용하면 초기 오류가 반복적으로 강화될 수 있습니다.</p>
</blockquote>

이를 줄이기 위해 높은 Threshold, Data Augmentation, Teacher-Student 구조 등을 사용할 수 있습니다.
## 잘 놓치는 핵심
### 1. 준지도학습은 비지도학습이 아니다

```text
지도학습: 라벨 있음
준지도학습: 일부 라벨 있음
비지도학습: 라벨 없음
```

### 2. Pseudo Label은 실제 정답이 아니다
모델이 만든 임시 정답이므로 틀릴 수 있습니다.
### 3. 비라벨 데이터가 많다고 항상 좋은 것은 아니다
라벨 데이터와 비슷한 분포를 가지는지가 중요합니다.
### 4. Confidence Threshold가 중요하다
너무 낮으면 오류가 늘고, 너무 높으면 사용할 데이터가 줄어듭니다.
### 5. Pseudo-Labeling과 Self-Training은 구분한다
Pseudo-Labeling은 **임시 라벨 생성**, Self-Training은 **그 라벨을 이용한 반복 학습 과정**에 초점을 둡니다.
### 6. 자기지도학습과 구분한다
자기지도학습은 데이터 자체에서 학습 신호를 만듭니다.  
준지도학습은 일부 실제 라벨을 사용합니다.
## 시험·면접
### 핵심 암기

```text
Semi-Supervised Learning
= Labeled Data + Unlabeled Data
```

```text
Pseudo Label
= 모델이 만든 임시 라벨
```

```text
Self-Training
= 자신의 예측으로 다시 학습
```

```text
Consistency Regularization
= 입력이 조금 변해도 예측은 비슷하게
```

### 자주 나오는 질문
**Q. 준지도학습이란?**  
소량의 라벨 데이터와 대량의 비라벨 데이터를 함께 활용하는 학습 방법입니다.
**Q. Pseudo Label이란?**  
모델이 비라벨 데이터에 대해 예측한 값을 임시 정답으로 사용하는 것입니다.
**Q. 장점은?**  
라벨링 비용을 줄이면서 비라벨 데이터를 활용할 수 있습니다.
**Q. 주요 위험은?**  
잘못된 Pseudo Label이 반복 학습되면서 오류가 강화될 수 있습니다.
### 시험 함정

```text
"준지도학습은 라벨을 사용하지 않는다."
→ 틀림
"Pseudo Label은 사람이 만든 실제 정답이다."
→ 틀림
"비라벨 데이터가 많으면 항상 성능이 좋아진다."
→ 틀림
```

## 한 번에 비교

| 학습 패러다임 | 라벨 | 핵심 |
| --- | --- | --- |
| 지도학습 | 있음 | 정답으로 학습 |
| 준지도학습 | 일부 있음 | 라벨 + 비라벨 |
| 비지도학습 | 없음 | 데이터 구조 발견 |
| 자기지도학습 | 사람이 만든 라벨 없음 | 데이터 자체에서 학습 신호 생성 |
| 강화학습 | 보상 사용 | 행동과 보상으로 학습 |

## 예시로 한 바퀴
10,000개의 이메일이 있다고 해보겠습니다.

```text
스팸/정상 라벨 있음: 500개
라벨 없음: 9,500개
```

먼저 500개로 스팸 분류기를 학습합니다.  
그다음 비라벨 이메일을 예측합니다.

```text
메일 A → 스팸 0.99
메일 B → 정상 0.98
메일 C → 스팸 0.55
```

Threshold를 0.95로 설정하면 A와 B만 사용합니다.

```text
메일 A → Pseudo Label: 스팸
메일 B → Pseudo Label: 정상
```

기존 데이터와 합쳐 다시 학습합니다.  
이것이 가장 기본적인 준지도학습 흐름입니다.

## 객관식 문제

### 1. 준지도학습에 대한 설명으로 가장 적절한 것은?

① 라벨 데이터만 사용한다.  
② 비라벨 데이터만 사용한다.  
③ 라벨 데이터와 비라벨 데이터를 함께 사용한다.  
④ 보상 함수만 사용한다.

<details>
<summary>정답</summary>

③

</details>

### 2. Pseudo Label에 대한 설명으로 옳은 것은?

① 사람이 만든 실제 정답이다.  
② 모델이 생성한 임시 라벨이다.  
③ 데이터 차원을 줄이는 방법이다.  
④ 입력 데이터를 삭제하는 방법이다.

<details>
<summary>정답</summary>

②

</details>

### 3. Confidence Threshold의 주된 목적은?

① 모델 크기를 줄이기 위해  
② 신뢰도가 낮은 Pseudo Label을 제외하기 위해  
③ 라벨을 모두 제거하기 위해  
④ 비라벨 데이터를 삭제하기 위해

<details>
<summary>정답</summary>

②

</details>

### 4. Consistency Regularization의 핵심은?

① 모든 입력을 같은 클래스로 분류한다.  
② 입력이 조금 변해도 예측을 비슷하게 유지한다.  
③ 라벨 데이터를 사용하지 않는다.  
④ 모델 파라미터를 모두 고정한다.

<details>
<summary>정답</summary>

②

</details>

### 5. 준지도학습에서 발생할 수 있는 문제는?

① 잘못된 Pseudo Label이 강화될 수 있다.  
② 비라벨 데이터를 사용할 수 없다.  
③ 지도학습 손실을 사용할 수 없다.  
④ 항상 라벨링 비용이 증가한다.

<details>
<summary>정답</summary>

①

</details>

### 6. 자기지도학습과 준지도학습의 차이로 적절한 것은?

① 둘은 완전히 같은 개념이다.  
② 준지도학습은 일부 실제 라벨을 사용할 수 있다.  
③ 자기지도학습은 반드시 사람이 만든 라벨이 필요하다.  
④ 준지도학습은 비라벨 데이터를 사용할 수 없다.

<details>
<summary>정답</summary>

②

</details>

## 최종 정리

준지도학습은 **적은 라벨 데이터와 많은 비라벨 데이터를 함께 사용하는 학습 방법**입니다.

```text
Pseudo-Labeling
Self-Training
Consistency Regularization
Confidence Threshold
```

시험에서는 **지도학습 / 준지도학습 / 비지도학습 / 자기지도학습**을 구분하는 것이 중요합니다.

<mark>비라벨 데이터가 많더라도 잘못된 Pseudo Label을 사용하면 오히려 성능이 떨어질 수 있습니다.</mark>

## 다음에 이을 글

자기지도학습(Self-Supervised Learning)입니다.  
사람이 직접 라벨을 만들지 않고 데이터 자체에서 학습 신호를 만드는 방법을 다룹니다.
