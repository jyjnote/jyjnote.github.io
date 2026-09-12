---
title: Attention Mechanism
date: 2026-09-12 15:35:00 +0900
slug: attention-mechanism
permalink: /posts/attention-mechanism/
categories: [AI, 자연어처리]
tags: [Attention, Seq2Seq, BahdanauAttention, LuongAttention, EncoderDecoder, NLP]
math: true
---

Attention은 **출력 Token을 만들 때 입력 Sequence의 모든 위치를 똑같이 보지 않고, 필요한 위치에 더 큰 가중치를 주는 방법**입니다.  
Seq2Seq의 고정 Context Vector 병목을 해결하기 위해 등장했습니다.

<blockquote class="prompt-info">
<p>한 줄: Decoder가 출력할 때마다 Encoder의 어떤 Token을 얼마나 볼지 다시 계산합니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

Attention은 Decoder State와 Encoder Hidden State의 관련도를 계산하고, Softmax Weight로 Encoder 정보를 가중합해 현재 시점의 Context Vector를 만듭니다.

</details>

## 왜 Attention이 필요했을까

초기 Seq2Seq는 Encoder의 마지막 Hidden State 하나에 입력 전체를 압축했습니다.

```text
I
↓
love
↓
AI
↓
마지막 Hidden State
↓
Context Vector
↓
Decoder
```

즉

```text
I love AI
```

전체 정보를 하나의 Vector에 넣어야 했습니다.

짧은 문장에서는 괜찮을 수 있지만 입력이 길어지면 문제가 생깁니다.

```text
Token 1
Token 2
Token 3
...
Token 100
↓
Vector 하나
```

앞쪽 정보가 약해지거나 중요한 정보를 충분히 보존하지 못할 수 있습니다.

<blockquote class="prompt-warning">
<p>초기 Seq2Seq의 대표적인 문제는 입력 Sequence 전체를 하나의 고정 길이 Context Vector로 압축해야 한다는 점입니다.</p>
</blockquote>

## Attention의 핵심 아이디어

Encoder의 마지막 Hidden State 하나만 쓰지 않습니다.

Encoder의 **모든 Hidden State**를 보관합니다.

```text
I
→ h1

love
→ h2

AI
→ h3
```

Decoder가 Token을 하나 만들 때마다

```text
h1
h2
h3
```

중 어디를 얼마나 참고할지 계산합니다.

```text
Decoder State
↓
Attention Score
↓
Softmax
↓
Attention Weight
↓
Encoder Hidden State 가중합
↓
현재 Context Vector
```

<mark>Context Vector가 고정된 하나의 값이 아니라 Decoder 시점마다 새로 만들어진다는 것이 핵심입니다.</mark>

## 전체 흐름

Attention 기반 Seq2Seq를 단순화하면 다음과 같습니다.

```text
Source
I love AI
↓
Encoder
↓
h1, h2, h3
       ↑
       │
Decoder State
       ↓
Attention Score
       ↓
Softmax
       ↓
α1, α2, α3
       ↓
α1h1 + α2h2 + α3h3
       ↓
Context Vector
       ↓
Decoder
       ↓
Target Token
```

## Attention의 세 단계

Attention은 크게 세 단계로 보면 쉽습니다.

```text
1. Score 계산
2. Softmax로 Weight 변환
3. Encoder Hidden State 가중합
```

수식으로는 다음과 같습니다.

### 1. Score

$$e_{t,i}=\mathrm{score}(s_{t-1},h_i)$$

- `s_(t-1)`: Decoder State
- `h_i`: i번째 Encoder Hidden State
- `e_(t,i)`: 관련도 Score

### 2. Softmax

$$lpha_{t,i}=rac{\exp(e_{t,i})}{\sum_j\exp(e_{t,j})}$$

`α`가 Attention Weight입니다.

### 3. Context Vector

$$c_t=\sum_ilpha_{t,i}h_i$$

각 Encoder Hidden State에 Weight를 곱해서 더합니다.

## 이번 글의 실제 예시

Seq2Seq 글에서 사용했던 Encoder Hidden State를 그대로 사용하겠습니다.

Source:

```text
I love AI
```

Encoder 출력:

```text
I
→ [0.6640, 0.1974]

love
→ [0.4070, 0.6633]

AI
→ [0.8018, 0.8431]
```

Python:

```python
import numpy as np

np.set_printoptions(precision=4, suppress=True)

encoder_states = np.array([
    [0.6640, 0.1974],  # I
    [0.4070, 0.6633],  # love
    [0.8018, 0.8431],  # AI
])

print(encoder_states)

# 결과
# [[0.6640 0.1974]
#  [0.4070 0.6633]
#  [0.8018 0.8431]]
```

Shape:

```python
print(encoder_states.shape)

# 결과
# (3, 2)
```

즉

```text
3 → Source Token 수
2 → Hidden Dimension
```

입니다.

## Decoder State 준비

Decoder가 현재 다음 Token을 만들려고 한다고 하겠습니다.

현재 Decoder State를

```python
decoder_state = np.array([0.7755, 0.8721])

print(decoder_state)

# 결과
# [0.7755 0.8721]
```

로 두겠습니다.

이제 이 Decoder State가

```text
I
love
AI
```

중 어떤 Encoder State와 관련이 큰지 계산합니다.

## 1. Dot-Product Attention Score

가장 단순한 Score 방법은 내적입니다.

$$e_i=s^Th_i$$

Python:

```python
scores = encoder_states @ decoder_state

print(scores)

# 결과
# [0.6871 0.8941 1.3571]
```

직접 보면

```text
I
→ 0.6871

love
→ 0.8941

AI
→ 1.3571
```

입니다.

Score가 클수록 현재 Decoder State와 더 관련 있다고 봅니다.

이 예시에서는

```text
AI
```

가 가장 높은 Score를 얻습니다.

## Score를 직접 하나 계산해보기

`I`의 Hidden State:

```text
[0.6640, 0.1974]
```

Decoder State:

```text
[0.7755, 0.8721]
```

내적:

$$e_I=(0.6640)(0.7755)+(0.1974)(0.8721)$$

Python:

```python
score_I = (
    0.6640 * 0.7755
    + 0.1974 * 0.8721
)

print(score_I)

# 결과
# 0.6871
```

같은 방식으로 모든 Source 위치의 Score를 구합니다.

## 2. Softmax로 Attention Weight 만들기

Score는 아직 확률이 아닙니다.

Softmax를 적용합니다.

```python
def softmax(x):
    x = x - np.max(x)
    exp_x = np.exp(x)
    return exp_x / np.sum(exp_x)

weights = softmax(scores)

print(weights)

# 결과
# [0.239 0.294 0.467]
```

각 Token의 Attention Weight:

```text
I
→ 0.2390

love
→ 0.2940

AI
→ 0.4670
```

합은 1입니다.

```python
print(weights.sum())

# 결과
# 1.0
```

<mark>Attention Weight는 현재 Decoder가 각 Source Token을 얼마나 참고할지를 나타냅니다.</mark>

## Attention Weight 해석

현재 Weight는

```text
I     → 0.2390
love  → 0.2940
AI    → 0.4670
```

입니다.

즉 Decoder는 세 Encoder State를 모두 보지만

```text
AI
```

에 가장 큰 비중을 둡니다.

Attention은

```text
하나만 선택
```

하는 Hard Selection이 아니라

```text
모든 위치를 Weight만 다르게 사용
```

하는 방식으로 이해하면 됩니다.

## 3. Context Vector 만들기

Attention Weight를 Encoder Hidden State에 곱합니다.

$$c=\sum_ilpha_i h_i$$

Python:

```python
context = weights @ encoder_states

print(context)

# 결과
# [0.6528 0.6359]
```

직접 풀면

```text
Context
=
I Vector × 0.2390
+
love Vector × 0.2940
+
AI Vector × 0.4670
```

입니다.

각 항을 계산해보겠습니다.

```python
weighted_I = weights[0] * encoder_states[0]
weighted_love = weights[1] * encoder_states[1]
weighted_AI = weights[2] * encoder_states[2]

print("I")
print(weighted_I)

# 결과
# [0.1587 0.0472]

print("love")
print(weighted_love)

# 결과
# [0.1196 0.195 ]

print("AI")
print(weighted_AI)

# 결과
# [0.3745 0.3938]

print("합")
print(weighted_I + weighted_love + weighted_AI)

# 결과
# [0.6528 0.6359]
```

이렇게 만들어진

```text
[0.6528 0.6359]
```

가 **현재 Decoder 시점의 Context Vector**입니다.

## 고정 Context와 Attention Context 차이

초기 Seq2Seq:

```text
Source 전체
↓
고정 Context Vector 하나
↓
모든 Decoder 시점에서 사용
```

Attention Seq2Seq:

```text
Decoder Step 1
→ Context 1

Decoder Step 2
→ Context 2

Decoder Step 3
→ Context 3
```

Decoder State가 달라지면 Score도 달라지고 Attention Weight도 달라집니다.

따라서 Context Vector도 매번 달라집니다.

## 다른 Decoder State를 넣어보자

Decoder State를 바꾸면 Attention도 달라집니다.

```python
decoder_state_2 = np.array([0.2, 1.2])

scores_2 = encoder_states @ decoder_state_2
weights_2 = softmax(scores_2)
context_2 = weights_2 @ encoder_states

print("scores")
print(scores_2)

print("weights")
print(weights_2)

print("context")
print(context_2)
```

Decoder가 어떤 상태인지에 따라

```text
I
love
AI
```

를 보는 비율이 변합니다.

<blockquote class="prompt-info">
<p>Attention은 Source Token마다 고정된 중요도를 만드는 것이 아니라 Decoder의 현재 상태에 따라 중요도를 다시 계산합니다.</p>
</blockquote>

## Context와 Decoder State를 합치기

Attention으로 만든 Context만 사용하는 것은 아닙니다.

일반적으로 Decoder State와 Context를 같이 사용해 다음 Token을 예측할 수 있습니다.

```text
Decoder State
+
Context Vector
↓
Linear
↓
Softmax
↓
다음 Token
```

이번 예시에서는 두 Vector를 이어 붙이겠습니다.

```python
combined = np.concatenate([
    decoder_state,
    context
])

print(combined)

# 결과
# [0.7755 0.8721 0.6528 0.6359]
```

구조:

```text
Decoder State
[0.7755, 0.8721]

Context
[0.6528 0.6359]

↓

Combined
[0.7755 0.8721 0.6528 0.6359]
```

## 다음 Token 확률 계산

설명용 Vocabulary:

```text
나는
AI를
좋아한다
<EOS>
```

임의 Projection Matrix를 사용합니다.

```python
vocab = ["나는", "AI를", "좋아한다", "<EOS>"]

W_out = np.array([
    [0.2, 0.1, 0.2, 0.0],
    [0.1, 0.4, 0.2, 0.0],
    [0.0, 0.3, 0.1, 0.0],
    [0.0, 0.5, 0.2, 0.0],
])

b_out = np.array([
    0.0,
    0.8,
    0.1,
    -0.4
])

logits = combined @ W_out + b_out

print(logits)

# 결과
# [ 0.2423  1.7402  0.622  -0.4   ]
```

Softmax:

```python
probs = softmax(logits)

for token, prob in zip(vocab, probs):
    print(f"{token:8s} {prob:.4f}")

# 결과
# 나는      0.1340
# AI를      0.5995
# 좋아한다  0.1960
# <EOS>     0.0705
```

이 예시에서는

```text
AI를
```

의 확률이 가장 높습니다.

즉 현재 Decoder State가

```text
Source에서 AI 정보를 비교적 크게 참고
↓
Context Vector 생성
↓
다음 Token으로 AI를 선택
```

하는 흐름입니다.

<mark>Attention은 Encoder 정보를 직접 출력하는 것이 아니라 Context Vector를 만들고, 그 Context를 Decoder State와 함께 다음 Token 예측에 사용합니다.</mark>

## Attention Score는 꼭 내적이어야 하나

아닙니다.

Score 함수에는 여러 방식이 있습니다.

대표적으로

```text
Dot Product
General
Additive
```

가 있습니다.

## Dot-Product Attention

가장 단순합니다.

$$e_{t,i}=s_t^Th_i$$

Vector끼리 바로 내적합니다.

장점:

```text
계산 단순
빠름
```

## General Attention

Decoder State에 Weight Matrix를 적용합니다.

$$e_{t,i}=s_t^TW h_i$$

학습 가능한 `W`가 추가됩니다.

## Additive Attention

Bahdanau Attention에서 유명합니다.

$$e_{t,i}=v^T	anh(W_hh_i+W_ss_{t-1})$$

Encoder Hidden State와 Decoder State를 각각 변환한 뒤 합치고 `tanh`를 적용합니다.

그 결과를 `v`와 내적해서 Score를 만듭니다.

## Additive Attention도 숫자로 계산

같은 Encoder State와 Decoder State를 사용하겠습니다.

```python
W_h = np.array([
    [0.6, 0.1],
    [0.2, 0.7],
])

W_s = np.array([
    [0.5, 0.2],
    [0.1, 0.6],
])

v = np.array([0.8, 0.4])
```

각 Source Token에 대해 Score를 계산합니다.

```python
add_scores = []

for h in encoder_states:
    z = np.tanh(
        h @ W_h
        + decoder_state @ W_s
    )

    score = z @ v
    add_scores.append(score)

add_scores = np.array(add_scores)

print(add_scores)

# 결과
# [0.8611 0.885  0.9968]
```

Softmax:

```python
add_weights = softmax(add_scores)

print(add_weights)

# 결과
# [0.3155 0.3231 0.3614]
```

Context Vector:

```python
add_context = add_weights @ encoder_states

print(add_context)

# 결과
# [0.6308 0.5813]
```

Dot Product와 결과 숫자는 다르지만 구조는 같습니다.

```text
Score
→ Softmax
→ Weight
→ Weighted Sum
→ Context
```

## Bahdanau Attention

Bahdanau Attention은 초기 Attention 기반 Seq2Seq에서 대표적인 방법입니다.

특징:

```text
Additive Score
Decoder가 현재 Token을 생성할 때
Encoder 모든 Hidden State 비교
```

공식:

$$e_{t,i}=v^T	anh(W_hh_i+W_ss_{t-1})$$

$$lpha_{t,i}=\mathrm{softmax}(e_{t,i})$$

$$c_t=\sum_ilpha_{t,i}h_i$$

## Luong Attention

Luong Attention은 Dot Product 계열 Score로 많이 설명됩니다.

예:

$$e_{t,i}=s_t^Th_i$$

또는

$$e_{t,i}=s_t^TWh_i$$

Bahdanau와 세부 계산 시점이나 Score 방식에 차이가 있습니다.

시험 수준에서는 다음처럼 기억하면 충분합니다.

| 방식 | 대표 Score |
| --- | --- |
| Bahdanau | Additive |
| Luong | Dot Product / General |

## Alignment란

Attention Weight는 Source와 Target 사이의 **정렬 관계**로도 볼 수 있습니다.

예:

```text
Source
I      love      AI

Target
나는   좋아한다   AI를
```

Target `AI를`을 생성할 때

```text
Source AI
```

에 높은 Attention Weight가 나타날 수 있습니다.

이를 Alignment라고 부를 수 있습니다.

## Attention Matrix

Target Token이 여러 개라면 각 Decoder Step마다 Attention Weight가 만들어집니다.

예를 들어 Source 길이 3, Target 길이 3이라면

```text
3 × 3
```

Attention Matrix가 만들어질 수 있습니다.

개념적으로:

| Target \ Source | I | love | AI |
| --- | ---: | ---: | ---: |
| 나는 | 0.70 | 0.20 | 0.10 |
| AI를 | 0.10 | 0.15 | 0.75 |
| 좋아한다 | 0.10 | 0.80 | 0.10 |

각 행의 합은 1입니다.

```text
한 Target 위치
→ Source 전체에 대한 Weight
```

입니다.

## Attention과 Self-Attention 차이

초기 Seq2Seq의 Attention과 Transformer의 Self-Attention은 같지 않습니다.

### Seq2Seq Attention

```text
Decoder State
↕
Encoder Hidden States
```

서로 다른 두 Sequence 사이 관계를 계산합니다.

### Self-Attention

```text
같은 Sequence 내부

Token
↔ Token
```

같은 Sequence 안의 Token끼리 관계를 계산합니다.

| 구분 | Seq2Seq Attention | Self-Attention |
| --- | --- | --- |
| Query 성격 | Decoder State | 같은 Sequence의 Token |
| 비교 대상 | Encoder Hidden States | 같은 Sequence |
| 대표 구조 | RNN Encoder-Decoder | Transformer |
| 목적 | Source 정보 선택 | Sequence 내부 관계 |

## Cross-Attention과의 관계

Transformer Encoder-Decoder의 Cross-Attention은 기존 Seq2Seq Attention의 아이디어를 Transformer 방식으로 확장했다고 이해할 수 있습니다.

```text
Decoder
→ Query

Encoder
→ Key
→ Value
```

즉

```text
Decoder가 Source의 어느 정보를 볼 것인가
```

라는 핵심 아이디어는 같습니다.

## Attention이 해결한 것

초기 Seq2Seq:

```text
모든 Source 정보
→ 마지막 Hidden State 하나
```

Attention:

```text
Encoder Hidden State 전체 보존
↓
Decoder가 필요한 위치 선택
```

따라서 긴 Sequence에서 중요한 정보를 직접 참고할 수 있습니다.

<mark>Attention은 Encoder의 모든 정보를 하나의 Vector에 미리 압축하지 않고, 필요한 순간에 필요한 위치를 찾아보게 합니다.</mark>

## Attention의 한계

Attention이 모든 문제를 해결한 것은 아닙니다.

RNN 기반 Attention Seq2Seq에서는 여전히 Encoder와 Decoder가 순차적으로 계산됩니다.

```text
h1
→ h2
→ h3
→ h4
```

병렬화에 한계가 있습니다.

이후 Transformer는 RNN을 없애고 **Self-Attention 자체를 모델의 핵심 연산**으로 사용합니다.

```text
RNN Seq2Seq + Attention
↓
Transformer
```

## Seq2Seq에서 Transformer까지

발전 흐름을 보면 이해하기 쉽습니다.

```text
RNN Seq2Seq
↓
고정 Context Vector 병목

RNN Seq2Seq + Attention
↓
Encoder Hidden State 전체 참고

Transformer
↓
RNN 제거
Self-Attention
Cross-Attention
```

## 전체 Python 코드

지금까지 계산한 핵심 Attention을 한 번에 실행하면 다음과 같습니다.

```python
import numpy as np

np.set_printoptions(precision=4, suppress=True)

encoder_states = np.array([
    [0.6640, 0.1974],  # I
    [0.4070, 0.6633],  # love
    [0.8018, 0.8431],  # AI
])

decoder_state = np.array([
    0.7755,
    0.8721
])

# --------------------------------------------------
# 1. Attention Score
# --------------------------------------------------

scores = encoder_states @ decoder_state

print(scores)

# 결과
# [0.6871 0.8941 1.3571]

# --------------------------------------------------
# 2. Softmax
# --------------------------------------------------

def softmax(x):
    x = x - np.max(x)
    exp_x = np.exp(x)
    return exp_x / np.sum(exp_x)

weights = softmax(scores)

print(weights)

# 결과
# [0.239 0.294 0.467]

# --------------------------------------------------
# 3. Weighted Sum
# --------------------------------------------------

context = weights @ encoder_states

print(context)

# 결과
# [0.6528 0.6359]

# --------------------------------------------------
# 4. Decoder State + Context
# --------------------------------------------------

combined = np.concatenate([
    decoder_state,
    context
])

print(combined)

# 결과
# [0.7755 0.8721 0.6528 0.6359]

# --------------------------------------------------
# 5. Vocabulary Projection
# --------------------------------------------------

vocab = [
    "나는",
    "AI를",
    "좋아한다",
    "<EOS>"
]

W_out = np.array([
    [0.2, 0.1, 0.2, 0.0],
    [0.1, 0.4, 0.2, 0.0],
    [0.0, 0.3, 0.1, 0.0],
    [0.0, 0.5, 0.2, 0.0],
])

b_out = np.array([
    0.0,
    0.8,
    0.1,
    -0.4
])

logits = combined @ W_out + b_out

probs = softmax(logits)

for token, prob in zip(vocab, probs):
    print(f"{token:8s} {prob:.4f}")

# 결과
# 나는      0.1340
# AI를      0.5995
# 좋아한다  0.1960
# <EOS>     0.0705
```

## 숫자로 한 바퀴

현재 Decoder State:

```text
[0.7755 0.8721]
```

Encoder Hidden States:

```text
I
→ [0.6640, 0.1974]

love
→ [0.4070, 0.6633]

AI
→ [0.8018, 0.8431]
```

Dot-Product Score:

```text
I     → 0.6871
love  → 0.8941
AI    → 1.3571
```

Softmax Weight:

```text
I     → 0.2390
love  → 0.2940
AI    → 0.4670
```

Context Vector:

```text
[0.6528 0.6359]
```

Decoder State와 Context 결합:

```text
[0.7755 0.8721 0.6528 0.6359]
```

다음 Token 확률:

```text
나는      0.1340
AI를      0.5995
좋아한다  0.1960
<EOS>     0.0705
```

이 예시에서는 `AI를`의 확률이 가장 높습니다.

## 잘 놓치는 핵심

### 1. Attention Weight와 Score는 다르다

```text
Score
→ 관련도 원점수

Softmax

Weight
→ 합이 1인 비율
```

### 2. Context Vector는 Encoder State 하나가 아니다

모든 Encoder Hidden State의 **가중합**입니다.

### 3. Context Vector는 Decoder Step마다 달라질 수 있다

Decoder State가 바뀌면 Score가 바뀝니다.

따라서 Attention Weight와 Context도 달라집니다.

### 4. Attention은 하나의 Source Token만 고르는 것이 아니다

모든 Encoder State를 사용하되 Weight가 다릅니다.

### 5. 초기 Attention과 Self-Attention은 구분해야 한다

초기 Seq2Seq Attention은 Decoder와 Encoder 사이 관계입니다.

Self-Attention은 같은 Sequence 내부 관계입니다.

### 6. Cross-Attention과 아이디어가 이어진다

Transformer Cross-Attention도 Decoder가 Encoder 정보를 선택해서 가져오는 구조입니다.

## 시험·면접

### 핵심 암기

```text
Attention

Decoder State
+
Encoder Hidden States
↓
Score
↓
Softmax
↓
Attention Weight
↓
Weighted Sum
↓
Context Vector
```

### Q. Attention이 등장한 이유는?

초기 Seq2Seq가 입력 전체를 하나의 고정 길이 Context Vector에 압축하면서 발생한 정보 병목을 줄이기 위해 등장했습니다.

### Q. Attention Weight는 어떻게 구하는가?

Decoder State와 각 Encoder Hidden State의 Score를 계산하고 Softmax를 적용합니다.

### Q. Context Vector는 어떻게 만드는가?

Encoder Hidden State에 Attention Weight를 곱한 뒤 모두 더합니다.

### Q. Attention Weight의 합은?

Softmax를 사용하므로 한 Decoder Step에서 Source 방향 Weight 합은 1입니다.

### Q. Bahdanau Attention은 어떤 방식인가?

대표적인 Additive Attention입니다.

### Q. Luong Attention은?

Dot Product 또는 General 방식으로 많이 설명됩니다.

<blockquote class="prompt-danger">
<p>시험 함정: Attention은 Encoder Hidden State 중 하나를 그대로 고르는 것이 아닙니다. Weight를 이용해 여러 Hidden State를 가중합합니다.</p>
</blockquote>

## 객관식 문제

### 1. Attention의 주된 목적은?

① 모든 Encoder 정보를 마지막 Hidden State 하나에만 압축  
② Decoder가 필요한 Encoder 위치에 다른 Weight를 주어 참고  
③ Tokenizer Vocabulary 생성  
④ Sequence Length를 항상 1로 변경

<details>
<summary>정답</summary>

②

</details>

### 2. Attention Weight를 만들 때 일반적으로 사용하는 함수는?

① ReLU  
② Softmax  
③ Max Pooling  
④ Sigmoid만 사용

<details>
<summary>정답</summary>

②

</details>

### 3. Context Vector는 무엇인가?

① 마지막 Encoder Hidden State만 복사한 값  
② Encoder Hidden State들의 Attention Weight 기반 가중합  
③ Token ID  
④ Loss 값

<details>
<summary>정답</summary>

②

</details>

### 4. Bahdanau Attention과 가장 관련이 깊은 것은?

① Additive Attention  
② Convolution  
③ K-Means  
④ PCA

<details>
<summary>정답</summary>

①

</details>

### 5. Decoder State가 바뀌면 일반적으로 무엇이 달라질 수 있는가?

① Attention Score  
② Attention Weight  
③ Context Vector  
④ 모두

<details>
<summary>정답</summary>

④

</details>

### 6. Self-Attention에 대한 설명으로 옳은 것은?

① 반드시 Encoder와 Decoder 사이에서만 계산한다.  
② 같은 Sequence 내부 Token 관계를 계산할 수 있다.  
③ Context Vector를 사용할 수 없다.  
④ RNN에서만 사용할 수 있다.

<details>
<summary>정답</summary>

②

</details>

## 마지막 정리

```text
초기 Seq2Seq

Source
↓
Encoder
↓
고정 Context 하나
↓
Decoder
```

Attention 이후:

```text
Source
↓
Encoder
↓
h1, h2, h3, ...
        ↑
        │
Decoder State
        ↓
Attention Score
        ↓
Softmax
        ↓
Weight
        ↓
Weighted Sum
        ↓
현재 Context
        ↓
다음 Token
```

핵심은 다음 한 문장입니다.

<mark>Attention은 Decoder가 매 시점마다 Encoder의 모든 Hidden State 중 어떤 정보를 얼마나 참고할지 계산해 새로운 Context Vector를 만드는 방법입니다.</mark>

## 다음에 이을 글

**Self-Attention**입니다.  
Encoder와 Decoder 사이가 아니라 같은 Sequence 안의 Token끼리 관계를 계산하는 방식으로 넘어가며, Q·K·V를 실제 2차원 Vector로 직접 계산합니다.
