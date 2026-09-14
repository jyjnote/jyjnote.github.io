---
title: 능동학습
date: 2026-09-15 01:10:00 +0900
slug: active-learning
permalink: /posts/active-learning/
categories: [AI, 딥러닝, 학습 패러다임]
tags: [능동학습, Active Learning, Uncertainty Sampling, Query by Committee, Oracle, 레이블링]
math: true
---

능동학습(Active Learning)은 **모델이 학습에 가장 도움이 될 데이터를 직접 선택하고, 그 데이터의 레이블만 사람이나 Oracle에게 요청하는 학습 방식**입니다.  

<blockquote class="prompt-info">
<p>한 줄: 모델이 가장 궁금한 데이터만 골라 레이블을 요청합니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

전체 데이터를 모두 레이블링하지 않고, 모델이 정보가치가 높은 Sample을 선택해 반복적으로 레이블을 얻습니다.

</details>

## 왜 필요한가
지도학습은 많은 레이블 데이터가 필요합니다.
하지만 실제로는 데이터보다 레이블을 만드는 일이 더 비쌀 수 있습니다.
예를 들어
- 의료 영상 판독
- 법률 문서 분류
- 금융 이상거래 검토
- 전문 연구 데이터 판정
같은 문제는 전문가가 직접 레이블을 붙여야 할 수 있습니다.
모든 Sample에 레이블을 붙이면 많은 시간과 비용이 필요합니다.
능동학습은 모델에게 중요한 Sample만 선택하게 합니다.
<mark>핵심은 데이터 수를 줄이는 것이 아니라 레이블링해야 할 데이터 수를 줄이는 것입니다.</mark>
## 기본 아이디어
레이블이 없는 데이터가 많이 있다고 하겠습니다.

```text
Unlabeled Pool
A B C D E F G H
```

현재 모델이 가장 확신하지 못하는 Sample이 D라고 하겠습니다.

```text
모델
↓
D가 가장 불확실
↓
D의 레이블 요청
```

Oracle이 정답을 알려줍니다.

```text
D → 고양이
```

이 Sample을 학습 데이터에 추가해 모델을 다시 학습합니다.
## 전체 흐름

```text
소량의 레이블 데이터
↓
초기 모델 학습
↓
비레이블 데이터 평가
↓
가장 유용한 Sample 선택
↓
Oracle에게 레이블 요청
↓
학습 데이터에 추가
↓
모델 재학습
↓
반복
```

이 과정은 Labeling Budget을 모두 사용할 때까지 반복할 수 있습니다.
## Oracle
Oracle은 선택된 Sample에 정답 레이블을 제공하는 주체입니다.
예를 들어
- 사람
- 전문가
- 의사
- 분석가
- 외부 판정 시스템
등이 Oracle이 될 수 있습니다.

<blockquote class="prompt-info">
<p>Oracle은 모델이 선택한 Sample에 실제 레이블을 제공하는 역할을 합니다.</p>
</blockquote>

## Labeling Budget
예를 들어

```text
전체 데이터: 100,000개
레이블링 가능 수: 1,000개
```

라면 1,000개의 Budget 안에서 가장 가치 있는 Sample을 선택해야 합니다.
능동학습의 목표는 같은 Budget으로 최대한 높은 성능을 얻는 것입니다.
## Query Strategy
어떤 Sample의 레이블을 요청할지 결정하는 규칙을 Query Strategy라고 합니다.
즉,

```text
비레이블 데이터
↓
Query Strategy
↓
다음에 레이블링할 Sample
```

을 결정합니다.
대표적인 방법은 다음과 같습니다.
- Uncertainty Sampling
- Query by Committee
- Expected Model Change
- Expected Error Reduction
- Diversity-Based Sampling
## Uncertainty Sampling
Uncertainty Sampling은 **모델이 가장 확신하지 못하는 Sample**을 선택합니다.
예를 들어 분류 확률이

```text
Sample A
고양이 0.99
강아지 0.01
```

이라면 모델은 매우 확신하고 있습니다.
반면

```text
Sample B
고양이 0.51
강아지 0.49
```

는 매우 불확실합니다.
이 경우 Sample B를 우선적으로 레이블링합니다.
## Least Confidence
가장 높은 클래스 확률이 낮은 Sample을 선택합니다.
$$x^*=\arg\min_x\max_yP(y\mid x)$$
예를 들어

```text
A → 최고 확률 0.95
B → 최고 확률 0.55
C → 최고 확률 0.80
```

라면 B를 선택합니다.
## Margin Sampling
가장 높은 두 클래스 확률의 차이가 작은 Sample을 선택합니다.
$$x^*=\arg\min_x(P(y_1\mid x)-P(y_2\mid x))$$
예:

```text
A → 0.90 / 0.05
B → 0.51 / 0.47
```

B는 1위와 2위의 차이가 매우 작기 때문에 모델이 헷갈리고 있다고 볼 수 있습니다.
## Entropy Sampling
예측 확률 분포의 Entropy가 높은 Sample을 선택합니다.
$$H(y\mid x)=-\sum_yP(y\mid x)\log P(y\mid x)$$
예측 확률이 여러 클래스에 고르게 퍼져 있을수록 Entropy가 높습니다.
즉, 모델이 확신하지 못하는 Sample입니다.
## Uncertainty Sampling 비교

| 방법 | 기준 |
| --- | --- |
| Least Confidence | 최고 예측 확률이 낮음 |
| Margin Sampling | 상위 두 클래스 확률 차이가 작음 |
| Entropy Sampling | 예측 분포의 Entropy가 큼 |

## Query by Committee
Query by Committee는 여러 모델을 Committee로 구성합니다.

```text
Model A
Model B
Model C
```

예:

```text
Model A → 고양이
Model B → 강아지
Model C → 고양이
```

처럼 의견이 갈리는 Sample을 Oracle에게 요청합니다.
<mark>Query by Committee의 핵심은 모델들의 불일치가 큰 Sample을 선택하는 것입니다.</mark>
## Diversity-Based Sampling
불확실한 Sample만 계속 고르면 비슷한 데이터가 반복해서 선택될 수 있습니다.
예를 들어 경계 근처의 거의 같은 이미지가 여러 장 있다면 모두 선택하는 것은 비효율적입니다.
Diversity-Based Sampling은 서로 다양한 Sample을 선택하려고 합니다.

```text
불확실성
+
다양성
↓
효율적인 Query
```

## Pool-Based Active Learning
Pool-Based 방식에서는 큰 비레이블 데이터 Pool이 미리 존재합니다.

```text
Unlabeled Pool
↓
모델 평가
↓
가장 유용한 Sample 선택
↓
레이블 요청
```

가장 일반적으로 설명되는 능동학습 구조입니다.
## Stream-Based Active Learning
Stream-Based 방식에서는 데이터가 하나씩 순차적으로 들어옵니다.

```text
Sample 도착
↓
레이블을 요청할까?
↓
Yes / No
```

모델은 각 Sample이 도착할 때 레이블 요청 여부를 결정합니다.
데이터를 모두 저장하기 어려운 환경에서도 사용할 수 있습니다.
## Pool-Based와 Stream-Based 비교

| 구분 | Pool-Based | Stream-Based |
| --- | --- | --- |
| 데이터 | 전체 Pool 존재 | 순차적으로 도착 |
| 선택 | Pool에서 가장 좋은 Sample 선택 | 현재 Sample의 Query 여부 결정 |
| 활용 | 정적 데이터셋 | 실시간 데이터 스트림 |

## Batch Active Learning
한 번에 Sample 하나가 아니라 여러 개를 선택할 수도 있습니다.
이를 Batch Active Learning이라고 합니다.

```text
한 Round
↓
10개 Sample 선택
↓
한꺼번에 레이블 요청
```

## Cold Start 문제
능동학습은 초기 모델의 판단을 이용해 Sample을 선택합니다.
하지만 시작 시점에는 레이블 데이터가 너무 적어 모델 자체가 부정확할 수 있습니다.
이때 좋은 Query를 선택하기 어려운 문제가 발생합니다.
이를 Cold Start 문제라고 볼 수 있습니다.
초기에는 Random Sampling이나 대표성이 높은 Sample을 먼저 사용할 수도 있습니다.
## Sampling Bias
능동학습은 데이터를 무작위로 선택하지 않습니다.
모델이 중요하다고 생각한 Sample을 집중적으로 선택합니다.
따라서 레이블 데이터가 전체 데이터 분포와 달라질 수 있습니다.
이를 Sampling Bias 문제로 볼 수 있습니다.

<blockquote class="prompt-warning">
<p>능동학습 데이터는 모델이 선택한 Sample에 집중되므로 전체 데이터 분포를 그대로 대표하지 않을 수 있습니다.</p>
</blockquote>

## 능동학습과 지도학습
지도학습은 일반적으로 주어진 레이블 데이터 전체를 이용합니다.
능동학습은 어떤 데이터에 레이블을 붙일지 모델이 선택합니다.

| 구분 | 지도학습 | 능동학습 |
| --- | --- | --- |
| 레이블 데이터 | 미리 주어짐 | 필요한 Sample에 요청 |
| Sample 선택 | 보통 없음 | 모델이 선택 |
| 핵심 목적 | 예측 성능 | 레이블링 효율 향상 |

## 능동학습과 준지도학습
준지도학습은 비레이블 데이터 자체를 학습에 직접 활용합니다.
능동학습은 비레이블 데이터 중 일부를 골라 실제 레이블을 요청합니다.

| 구분 | 능동학습 | 준지도학습 |
| --- | --- | --- |
| 핵심 | 어떤 Sample을 레이블링할지 선택 | 비레이블 데이터를 학습에 활용 |
| Oracle | 필요 | 필수 아님 |
| 대표 방식 | Uncertainty Sampling | Pseudo-Labeling |
| 목적 | 레이블링 비용 절감 | 적은 레이블로 학습 성능 향상 |

<mark>능동학습은 레이블을 어디에 쓸지 결정하고, 준지도학습은 비레이블 데이터를 어떻게 학습에 활용할지 결정합니다.</mark>
## 능동학습과 자기지도학습

```text
Self-Supervised
→ 데이터 자체가 학습 신호 생성
Active Learning
→ Oracle이 선택된 Sample의 레이블 제공
```

## 장점
### 1. 레이블링 비용 감소
모든 데이터에 레이블을 붙일 필요가 없습니다.
### 2. 전문가 시간 절약
전문가가 정보가치가 높은 Sample만 검토할 수 있습니다.
### 3. 적은 레이블로 높은 성능 가능
Random Sampling보다 좋은 Sample을 선택하면 같은 수의 레이블로 더 높은 성능을 얻을 수 있습니다.
## 단점
### 1. Query 계산 비용
매 Round마다 비레이블 데이터의 정보가치를 계산해야 할 수 있습니다.
### 2. Oracle 비용
선택된 Sample은 여전히 사람이 직접 레이블링해야 할 수 있습니다.
### 3. Sampling Bias
선택된 레이블 데이터가 전체 분포를 대표하지 못할 수 있습니다.
### 4. Cold Start
초기 모델이 나쁘면 Query Strategy도 나쁜 Sample을 선택할 수 있습니다.
### 5. Outlier 선택
Uncertainty만 사용하면 이상치가 지나치게 선택될 수 있습니다.
## 잘 놓치는 핵심
### 1. 능동학습은 레이블을 자동 생성하는 방법이 아니다
모델은 레이블이 필요한 Sample을 선택합니다.
실제 정답은 Oracle이 제공합니다.
### 2. 가장 불확실한 Sample이 항상 가장 좋은 Sample은 아니다
Outlier일 수도 있고 서로 비슷한 Sample이 반복 선택될 수도 있습니다.
다양성과 대표성을 함께 고려할 수 있습니다.
### 3. 준지도학습과 다르다
준지도학습은 비레이블 Sample 자체를 학습에 활용합니다.
능동학습은 일부 Sample의 실제 레이블을 추가로 얻습니다.
### 4. Labeling Budget이 중요하다
정해진 비용 안에서 어떤 Sample을 선택할지가 핵심입니다.
### 5. Query by Committee는 모델 불일치를 이용한다
Committee의 예측이 크게 다를수록 정보가치가 높다고 봅니다.
### 6. Pool-Based와 Stream-Based를 구분해야 한다
Pool-Based는 전체 후보 중 선택하고, Stream-Based는 Sample이 도착할 때마다 레이블 요청 여부를 결정합니다.
## 시험·면접
### 핵심 암기 포인트
- 모델이 정보가치가 높은 Sample을 선택한다.
- Oracle이 실제 레이블을 제공한다.
- Labeling Budget을 효율적으로 사용하는 것이 목적이다.
- Uncertainty Sampling이 대표적이다.
- Least Confidence, Margin, Entropy를 구분한다.
- Query by Committee는 모델 간 불일치를 이용한다.
- Pool-Based와 Stream-Based가 있다.
- Sampling Bias와 Cold Start 문제가 있다.
- 준지도학습과 같은 개념이 아니다.
- Human-in-the-Loop 환경과 잘 맞는다.
### 자주 나오는 문장
**Q. 능동학습이란 무엇인가?**
모델이 학습에 가장 유용하다고 판단한 비레이블 Sample을 선택하고, Oracle에게 해당 Sample의 레이블을 요청하여 효율적으로 학습하는 방법입니다.
**Q. Uncertainty Sampling이란 무엇인가?**
현재 모델이 가장 확신하지 못하는 Sample을 우선적으로 선택해 레이블을 요청하는 방법입니다.
**Q. Query by Committee란 무엇인가?**
여러 모델의 예측이 가장 크게 불일치하는 Sample을 정보가치가 높은 데이터로 보고 선택하는 방법입니다.
**Q. 능동학습과 준지도학습의 차이는 무엇인가?**
능동학습은 어떤 비레이블 Sample에 실제 레이블을 붙일지 선택하고, 준지도학습은 비레이블 데이터 자체를 학습에 활용합니다.

<blockquote class="prompt-warning">
<p>능동학습의 핵심은 모델이 정답을 만드는 것이 아니라, 사람에게 물어볼 가치가 높은 Sample을 고르는 것입니다.</p>
</blockquote>

## 예시로 한 바퀴
의료 영상이 10,000장 있다고 하겠습니다.
의사가 모든 영상에 레이블을 붙이기는 어렵습니다.
먼저 일부 데이터만 레이블링합니다.

```text
100개 의료 영상
↓
초기 모델 학습
```

모델이 나머지 9,900개를 평가합니다.
가장 불확실한 영상 50개를 선택합니다.

```text
비레이블 데이터
↓
Uncertainty Sampling
↓
50개 선택
```

의사가 50개에 실제 레이블을 붙입니다.

```text
50개 레이블 데이터
↓
학습 데이터에 추가
↓
모델 재학습
```

이 과정을 반복합니다.

```text
모델 학습
↓
유용한 Sample 선택
↓
전문가 레이블링
↓
모델 개선
```

목표는 모든 10,000개를 레이블링하지 않고도 충분한 성능을 얻는 것입니다.
## 객관식 문제
### 1. 능동학습의 핵심 목표는?
① 모든 데이터를 자동으로 레이블링한다.  
② 정보가치가 높은 Sample에 우선적으로 레이블을 요청한다.  
③ 비레이블 데이터를 모두 제거한다.  
④ 반드시 모든 데이터를 한 번에 학습한다.

<details>
<summary>정답</summary>

②

</details>

### 2. Oracle의 역할은?
① 모델 구조를 자동 생성한다.  
② 선택된 Sample의 실제 레이블을 제공한다.  
③ 데이터를 모두 삭제한다.  
④ Learning Rate를 자동 조절한다.

<details>
<summary>정답</summary>

②

</details>

### 3. Uncertainty Sampling에서 우선 선택할 Sample은?
① 모델이 가장 확신하는 Sample  
② 모델이 가장 불확실해하는 Sample  
③ 항상 가장 오래된 Sample  
④ 데이터 크기가 가장 큰 Sample

<details>
<summary>정답</summary>

②

</details>

### 4. Query by Committee의 핵심은?
① 하나의 모델만 사용한다.  
② 여러 모델의 예측 불일치가 큰 Sample을 선택한다.  
③ 모든 Sample에 같은 레이블을 부여한다.  
④ 레이블을 사용하지 않는다.

<details>
<summary>정답</summary>

②

</details>

### 5. 능동학습과 준지도학습의 차이로 옳은 것은?
① 완전히 같은 개념이다.  
② 능동학습은 실제 레이블을 요청할 Sample을 선택한다.  
③ 준지도학습은 항상 Oracle이 필요하다.  
④ 능동학습은 비레이블 데이터를 사용할 수 없다.

<details>
<summary>정답</summary>

②

</details>

### 6. 능동학습에서 발생할 수 있는 문제는?
① Sampling Bias  
② 레이블 데이터가 항상 무한함  
③ Query Strategy가 필요 없음  
④ 모든 Sample이 동일한 정보가치를 가짐

<details>
<summary>정답</summary>

①

</details>

## 다음에 이을 글
온라인 학습(Online Learning)입니다.  
데이터가 순차적으로 들어오는 환경에서 모델을 계속 업데이트하는 학습 방식입니다.
