---
title: 전이학습 Transfer Learning
date: 2026-09-15 00:04:00 +0900
slug: transfer-learning
permalink: /posts/transfer-learning/
categories: [AI, 딥러닝, 학습 패러다임]
tags: [전이학습, TransferLearning, Pretraining, FineTuning, FeatureExtraction, 머신러닝]
math: true
---

전이학습(Transfer Learning)은 **한 문제에서 학습한 지식을 다른 문제에 재사용하는 학습 방법**입니다.  
처음부터 모든 것을 다시 학습하지 않고, 이미 학습된 모델의 표현과 가중치를 새로운 작업에 활용합니다.

<blockquote class="prompt-info">
<p>한 줄: 이미 배운 모델을 가져와 새로운 문제에 맞게 재사용하는 방법입니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

사전학습된 모델의 지식을 새로운 데이터와 작업에 재사용하는 학습 패러다임입니다.

</details>

## 핵심 예시

고양이와 개를 구분하는 이미지 모델을 만든다고 생각해봅시다. 처음부터 수백만 장을 학습하는 대신, 이미 대규모 이미지로 학습된 모델을 가져올 수 있습니다.

```text
대규모 이미지로 사전학습
        ↓
선, 모양, 질감 등의 특징 학습
        ↓
고양이/개 데이터에 맞게 추가 학습
        ↓
고양이/개 분류 모델
```

<mark>전이학습의 핵심은 이미 학습된 가중치와 표현을 처음부터 버리지 않는 것입니다.</mark>

## 왜 필요한가

딥러닝 모델을 처음부터 학습하려면 많은 데이터와 연산량이 필요합니다. 실제 문제에서는 충분한 데이터를 확보하기 어려운 경우도 많습니다.

전이학습을 사용하면 다음과 같은 이점이 있습니다.

- 적은 데이터로도 좋은 성능을 얻기 쉬움
- 학습 시간을 줄일 수 있음
- 필요한 연산 자원을 줄일 수 있음
- 대규모 사전학습 모델의 표현을 활용할 수 있음

## 작동 방식

전이학습은 크게 두 단계로 생각하면 쉽습니다.

```text
1. Pretraining
2. Transfer to Target Task
```

### 1. Pretraining

대규모 데이터셋으로 먼저 모델을 학습합니다.

이미지 모델은 선, 모서리, 색상, 질감, 형태 등을 학습할 수 있습니다. 자연어 모델은 단어 관계, 문장 구조, 문맥, 의미 관계 등을 학습할 수 있습니다.

### 2. 새로운 작업에 적용

사전학습된 모델을 새로운 데이터와 작업에 적용합니다.

```text
대규모 텍스트로 사전학습
        ↓
언어 표현 학습
        ↓
영화 리뷰 데이터로 추가 학습
        ↓
긍정 / 부정 분류
```

## 대표적인 방법

전이학습에서는 주로 **Feature Extraction**과 **Fine-tuning**을 구분합니다.

### 1. Feature Extraction

사전학습된 모델의 대부분을 그대로 사용하고, 마지막 출력 계층 등을 새 작업에 맞게 학습합니다.

```text
[고정][고정][고정][고정]
                  ↓
            새 분류기 학습
```

<mark>Feature Extraction은 사전학습된 모델을 특징 추출기로 사용하는 방식입니다.</mark>

- 기존 가중치를 대부분 변경하지 않음
- 학습이 빠름
- 연산량이 적음
- 작은 데이터셋에서 사용하기 좋음

### 2. Fine-tuning

사전학습된 모델의 일부 또는 전체 가중치를 새로운 데이터에 맞게 다시 학습합니다.

```text
[고정][고정][학습][학습]
```

또는 전체 계층을 학습할 수도 있습니다.

```text
[학습][학습][학습][학습]
```

<mark>Fine-tuning은 기존 가중치를 출발점으로 사용하지만 새로운 작업에 맞게 값을 수정합니다.</mark>

## Feature Extraction vs Fine-tuning

| 구분 | Feature Extraction | Fine-tuning |
| --- | --- | --- |
| 기존 가중치 | 대부분 고정 | 일부 또는 전체 수정 |
| 학습 대상 | 주로 새 출력 계층 | 일부 또는 전체 계층 |
| 필요한 데이터 | 상대적으로 적음 | 상대적으로 더 필요 |
| 연산량 | 적음 | 더 큼 |
| 새 작업 적응 | 제한적 | 더 강함 |

## Freeze와 Unfreeze

Freeze는 특정 계층의 가중치를 학습 중 변경하지 않도록 고정하는 것입니다. 반대로 다시 학습 가능하게 만드는 것을 Unfreeze라고 합니다.

```text
Layer 1 → Freeze
Layer 2 → Freeze
Layer 3 → Train
Layer 4 → Train
```

<blockquote class="prompt-info">
<p>Freeze = 가중치 업데이트 중지, Unfreeze = 다시 학습 가능하게 설정</p>
</blockquote>

## 왜 앞쪽 계층을 자주 고정하는가

딥러닝 모델의 앞쪽 계층은 비교적 일반적인 특징을 학습하는 경우가 많습니다.

```text
초기 계층 → 선, 모서리, 색상
중간 계층 → 질감, 형태, 부분 구조
후반 계층 → 특정 객체와 작업에 가까운 특징
```

따라서 재사용 가능한 초기 특징은 그대로 두고, 후반 계층을 새 작업에 맞게 조정할 수 있습니다.

## 기본 흐름

```text
사전학습 모델 선택
        ↓
기존 출력 계층 변경
        ↓
일부 계층 Freeze
        ↓
새 데이터로 학습
        ↓
필요하면 일부 계층 Unfreeze
        ↓
낮은 학습률로 Fine-tuning
```

## Fine-tuning에서 학습률을 작게 쓰는 이유

Fine-tuning은 이미 학습된 좋은 가중치에서 시작합니다. 학습률이 너무 크면 기존에 학습된 유용한 표현이 크게 무너질 수 있습니다.

따라서 처음부터 학습할 때보다 작은 학습률을 사용하는 경우가 많습니다.

<blockquote class="prompt-warning">
<p>Fine-tuning은 랜덤 가중치에서 처음부터 학습하는 것이 아닙니다.</p>
</blockquote>

## 데이터 양에 따른 단순 전략

| 상황 | 대표 전략 |
| --- | --- |
| 새 데이터가 매우 적음 | 대부분 Freeze + Feature Extraction |
| 데이터가 어느 정도 있음 | 후반 계층 Fine-tuning |
| 데이터가 충분히 많음 | 더 많은 계층 Fine-tuning 가능 |

단, 데이터 양만 보는 것은 아닙니다. 사전학습 데이터와 새로운 데이터가 얼마나 비슷한지도 중요합니다.

## Source와 Target

전이학습에서는 기존 학습 영역과 새롭게 적용할 영역을 구분합니다.

```text
Source Domain = 기존 모델이 학습한 데이터 영역
Target Domain = 새롭게 적용하려는 데이터 영역

Source Task = 기존 모델이 학습한 문제
Target Task = 새롭게 해결하려는 문제
```

예를 들어 일반 이미지 분류 모델을 불량 제품 이미지 분류에 적용한다면, 기존 데이터와 새 데이터 그리고 기존 작업과 새 작업의 관계를 함께 봅니다.

## 분야별 적용 예시

전이학습은 이미지와 자연어처리 모두에서 널리 사용됩니다.

```text
이미지: 사전학습 CNN/ViT → 새 이미지 분류
NLP: 사전학습 언어 모델 → 감성분석/분류/질의응답
```

예를 들어 BERT 계열 모델은 대규모 텍스트로 사전학습한 뒤 특정 자연어처리 작업에 Fine-tuning할 수 있습니다.

## 장점과 단점

| 구분 | 내용 |
| --- | --- |
| 장점 | 적은 데이터 활용, 학습 시간 감소, 사전학습 표현 재사용 |
| 장점 | 처음부터 학습하는 것보다 좋은 성능을 얻을 가능성 |
| 단점 | Source와 Target이 너무 다르면 성능 저하 가능 |
| 단점 | 전체 Fine-tuning은 GPU 메모리와 연산량이 많이 필요 |
| 단점 | 작은 데이터로 많은 계층을 학습하면 과적합 가능 |

## Negative Transfer

Negative Transfer는 기존에 학습한 지식이 새로운 작업의 성능을 오히려 떨어뜨리는 현상입니다.

```text
기존 지식
   ↓
새 문제와 잘 맞음 → Positive Transfer
새 문제와 충돌함 → Negative Transfer
```

<mark>전이학습이라고 항상 성능이 좋아지는 것은 아닙니다.</mark>

## 전이학습과 처음부터 학습 비교

| 구분 | 전이학습 | 처음부터 학습 |
| --- | --- | --- |
| 초기 가중치 | 사전학습 가중치 | 랜덤 초기화가 일반적 |
| 필요한 데이터 | 상대적으로 적음 | 많이 필요할 수 있음 |
| 학습 시간 | 상대적으로 짧음 | 길 수 있음 |
| 기존 지식 사용 | 사용 | 사용하지 않음 |

## Transfer Learning vs Domain Adaptation

두 개념은 관련 있지만 완전히 같지는 않습니다.

| 구분 | Transfer Learning | Domain Adaptation |
| --- | --- | --- |
| 핵심 | 기존 지식을 새 문제에 재사용 | 데이터 분포 차이에 적응 |
| 차이 | Task 또는 Domain이 달라질 수 있음 | 주로 Domain 차이에 집중 |
| 범위 | 더 넓은 개념 | 전이학습의 관련 분야 |

예를 들어 밝은 도로 이미지에서 학습한 객체 탐지 모델을 야간 도로 이미지에 적용한다면 Task는 같지만 Domain이 달라집니다.

## Transfer Learning vs Fine-tuning

같은 말이 아닙니다.

<mark>Transfer Learning은 더 큰 개념이고, Fine-tuning은 전이학습을 수행하는 대표적인 방법 중 하나입니다.</mark>

```text
Transfer Learning
├─ Feature Extraction
└─ Fine-tuning
```

## 잘 놓치는 핵심

### 1. 전이학습은 기존 가중치를 재사용한다

처음부터 랜덤하게 학습하는 것이 아니라 사전학습된 가중치를 출발점으로 활용합니다.

### 2. Feature Extraction과 Fine-tuning은 다르다

Feature Extraction은 기존 가중치를 대부분 고정합니다. Fine-tuning은 일부 또는 전체 가중치를 다시 학습합니다.

### 3. Freeze는 삭제가 아니다

계층은 그대로 사용하지만 가중치 업데이트만 막습니다.

### 4. Fine-tuning에서는 작은 학습률을 자주 사용한다

기존에 잘 학습된 표현을 크게 망가뜨리지 않기 위해서입니다.

### 5. 항상 성능이 좋아지는 것은 아니다

Source와 Target이 너무 다르면 Negative Transfer가 발생할 수 있습니다.

### 6. Transfer Learning과 Fine-tuning은 동의어가 아니다

전이학습이 상위 개념입니다.

## 시험·면접

### 핵심 암기 포인트

```text
Transfer Learning
= 기존에 학습한 지식을 새로운 문제에 재사용

Feature Extraction
= 기존 모델 대부분 Freeze

Fine-tuning
= 기존 가중치를 새 데이터에 맞게 다시 학습

Freeze
= 가중치 업데이트 중지

Negative Transfer
= 기존 지식이 새 문제의 성능을 방해
```

### 자주 나오는 문장

**Q. 전이학습이란 무엇인가?**  
사전학습된 모델이 학습한 표현과 가중치를 새로운 작업에 재사용하는 학습 방법입니다.

**Q. Fine-tuning이란 무엇인가?**  
사전학습된 모델의 일부 또는 전체 가중치를 새로운 데이터에 맞게 추가 학습하는 방법입니다.

**Q. Feature Extraction과 Fine-tuning의 차이는?**  
Feature Extraction은 기존 가중치를 대부분 고정하고, Fine-tuning은 기존 계층의 가중치까지 일부 또는 전체 수정합니다.

**Q. 왜 작은 학습률을 사용하는가?**  
이미 학습된 유용한 가중치가 크게 변하는 것을 줄이기 위해서입니다.

**Q. Negative Transfer란 무엇인가?**  
기존 지식이 새로운 문제와 맞지 않아 성능을 오히려 떨어뜨리는 현상입니다.

## 시험 함정 정리

<blockquote class="prompt-danger">
<p>전이학습은 반드시 모든 계층을 다시 학습하는 것이 아닙니다.</p>
</blockquote>

<blockquote class="prompt-warning">
<p>Feature Extraction에서는 기존 모델의 가중치를 대부분 고정할 수 있습니다.</p>
</blockquote>

<blockquote class="prompt-warning">
<p>Fine-tuning은 사전학습 모델을 랜덤 초기화하는 과정이 아닙니다.</p>
</blockquote>

<blockquote class="prompt-warning">
<p>전이학습이 항상 성능을 향상시키는 것은 아닙니다.</p>
</blockquote>

## 예시로 한 바퀴

강아지와 고양이를 구분하는 모델을 만든다고 가정합니다.

```text
새 데이터: 강아지/고양이 이미지 2,000장
```

### 1단계. 사전학습 모델 가져오기

ImageNet 등으로 사전학습된 모델을 가져옵니다.

### 2단계. 출력 계층 변경

```text
기존 모델
    ↓
새 출력
강아지 / 고양이
```

### 3단계. Feature Extraction

```text
기존 계층: Freeze
새 분류기: Train
```

### 4단계. Fine-tuning

필요하면 후반 계층 일부를 Unfreeze하고 작은 학습률로 추가 학습합니다.

```text
초기 계층: Freeze
후반 계층: Train
새 분류기: Train
```

결과적으로 처음부터 전체 모델을 학습하는 것보다 적은 데이터와 시간으로 좋은 성능을 얻을 가능성이 높아집니다.

## 객관식 문제

### 1. 전이학습에 대한 설명으로 가장 적절한 것은?

① 모든 모델의 가중치를 항상 랜덤하게 초기화한다.  
② 기존 모델이 학습한 지식을 새로운 문제에 재사용한다.  
③ 학습 데이터를 반드시 두 배로 증가시킨다.  
④ 지도학습에서는 사용할 수 없다.

<details>
<summary>정답</summary>

②

기존 모델의 지식과 가중치를 새로운 문제에 재사용합니다.

</details>

### 2. Feature Extraction에 대한 설명으로 가장 적절한 것은?

① 기존 모델의 모든 가중치를 반드시 다시 학습한다.  
② 기존 모델을 삭제하고 새로운 모델을 만든다.  
③ 기존 모델 대부분을 고정하고 특징 추출기로 활용한다.  
④ 학습률을 반드시 크게 설정한다.

<details>
<summary>정답</summary>

③

기존 모델 대부분의 가중치를 고정하고 새로운 분류기 등을 학습합니다.

</details>

### 3. Fine-tuning에 대한 설명으로 옳은 것은?

① 기존 가중치를 일부 또는 전체 다시 학습할 수 있다.  
② 기존 모델을 사용할 수 없다.  
③ 학습 데이터가 없어도 항상 가능하다.  
④ 가중치 업데이트를 완전히 금지한다.

<details>
<summary>정답</summary>

①

사전학습된 가중치를 새로운 작업에 맞게 일부 또는 전체 조정합니다.

</details>

### 4. Freeze의 의미로 가장 적절한 것은?

① 계층을 삭제한다.  
② 가중치 업데이트를 중지한다.  
③ 데이터를 삭제한다.  
④ 학습률을 증가시킨다.

<details>
<summary>정답</summary>

②

계층을 제거하는 것이 아니라 해당 계층의 가중치를 고정합니다.

</details>

### 5. Negative Transfer에 대한 설명으로 옳은 것은?

① 기존 지식이 새로운 작업의 성능을 방해한다.  
② 학습 데이터가 자동으로 증가한다.  
③ 가중치가 모두 0이 된다.  
④ Fine-tuning 시간이 줄어든다.

<details>
<summary>정답</summary>

①

Source에서 배운 지식이 Target 문제와 맞지 않으면 성능이 오히려 낮아질 수 있습니다.

</details>

### 6. 전이학습과 Fine-tuning의 관계로 가장 적절한 것은?

① 완전히 같은 개념이다.  
② Fine-tuning이 더 큰 개념이다.  
③ Fine-tuning은 전이학습의 대표적인 방법 중 하나이다.  
④ 두 개념은 관련이 없다.

<details>
<summary>정답</summary>

③

전이학습이 더 넓은 개념이고 Fine-tuning은 대표적인 방법 중 하나입니다.

</details>

## 다음에 이을 글

Domain Adaptation입니다.  
Source Domain과 Target Domain의 데이터 분포가 다를 때 모델을 어떻게 적응시키는지 다룹니다.
