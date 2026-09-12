---
title: Transformer Decoder
date: 2026-09-12 14:55:00 +0900
slug: transformer-decoder
permalink: /posts/transformer-decoder/
categories: [AI, 딥러닝]
tags: [Transformer, Decoder, CausalAttention, CrossAttention, KVCache, GPT, LLM]
math: true
---

Transformer Decoder는 **이전 Token들을 참고해 다음 Token을 생성하는 구조**입니다.  
생성형 LLM에서 가장 중요한 차이는 미래 Token을 보지 못하게 하는 **Causal Mask**입니다.

<blockquote class="prompt-info">
<p>한 줄: Decoder는 현재까지 나온 Token만 보고 다음 Token의 확률을 계산합니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

Decoder는 Causal Self-Attention으로 미래 정보를 차단하고, FFN을 거쳐 문맥 표현을 만든 뒤 Vocabulary 확률로 변환해 다음 Token을 예측합니다.

</details>

## 먼저 두 Decoder를 구분

`Transformer Decoder`라는 말은 문맥에 따라 두 구조를 가리킬 수 있습니다.

### 원래 Transformer의 Decoder

```text
Masked Self-Attention
↓
Add & Norm
↓
Cross-Attention
↓
Add & Norm
↓
FFN
↓
Add & Norm
```

Encoder의 출력까지 참고하는 **Encoder-Decoder 구조**입니다.

### GPT 계열의 Decoder-only Block

```text
Causal Self-Attention
↓
Add & Norm
↓
FFN
↓
Add & Norm
```

Encoder가 없으므로 일반적인 GPT 계열에는 Cross-Attention이 없습니다.

<blockquote class="prompt-warning">
<p>원래 Transformer Decoder와 GPT의 Decoder-only Block을 완전히 같은 구조로 보면 안 됩니다. Cross-Attention의 존재 여부가 대표적인 차이입니다.</p>
</blockquote>

이번 글에서는 먼저 **GPT식 Decoder-only Block을 실제 숫자로 계산**합니다.  
그다음 원래 Transformer Decoder의 **Cross-Attention**을 따로 계산합니다.

## 이번 글에서 계산할 문장

다음 입력을 사용하겠습니다.

```text
I love AI
```

설명을 위해 매우 작은 모델을 가정합니다.

```text
Token 수 = 3
Hidden Dimension = 4
Attention Head 수 = 2
Head Dimension = 2
```

실제 LLM은 훨씬 큰 Dimension과 많은 Head를 사용하지만 계산 원리는 같습니다.

## 1. Token Embedding

각 Token에 임의의 Embedding을 넣습니다.

```python
import numpy as np

np.set_printoptions(precision=4, suppress=True)

tokens = ["I", "love", "AI"]

E = np.array([
    [1.0, 0.0, 1.0, 0.0],  # I
    [0.0, 1.0, 0.0, 1.0],  # love
    [1.0, 1.0, 0.0, 0.0],  # AI
])

print(E)

# 결과
# [[1. 0. 1. 0.]
#  [0. 1. 0. 1.]
#  [1. 1. 0. 0.]]
```

행 하나가 Token 하나입니다.

```text
1행 → I
2행 → love
3행 → AI
```

Shape:

```python
print(E.shape)

# 결과
# (3, 4)
```

## 2. 위치 정보 추가

Transformer는 순서를 별도로 알려줘야 합니다.

설명을 위해 다음 위치 벡터를 사용합니다.

```python
P = np.array([
    [0.1, 0.0, 0.1, 0.0],  # position 1
    [0.0, 0.1, 0.0, 0.1],  # position 2
    [0.1, 0.1, 0.0, 0.0],  # position 3
])

X = E + P

print(X)

# 결과
# [[1.1 0.  1.1 0. ]
#  [0.  1.1 0.  1.1]
#  [1.1 1.1 0.  0. ]]
```

수식으로는

$$X=E+P$$

입니다.

## 3. Q, K, V 만들기

Decoder Self-Attention에서도 같은 입력 `X`에서 Q, K, V를 만듭니다.

$$Q=XW_Q$$

$$K=XW_K$$

$$V=XW_V$$

설명을 위해 임의의 Projection Matrix를 사용합니다.

```python
W_Q = np.array([
    [1.0, 0.0, 0.0, 0.0],
    [0.0, 1.0, 0.0, 0.0],
    [0.0, 0.0, 0.5, 0.0],
    [0.0, 0.0, 0.0, 0.5],
])

W_K = np.array([
    [0.5, 0.0, 0.0, 0.0],
    [0.0, 0.5, 0.0, 0.0],
    [0.0, 0.0, 1.0, 0.0],
    [0.0, 0.0, 0.0, 1.0],
])

W_V = np.array([
    [1.0, 0.0, 0.0, 0.0],
    [0.0, 1.0, 0.0, 0.0],
    [0.5, 0.0, 0.5, 0.0],
    [0.0, 0.5, 0.0, 0.5],
])

Q = X @ W_Q
K = X @ W_K
V = X @ W_V

print("Q")
print(Q)

# 결과
# [[1.1  0.   0.55 0.  ]
#  [0.   1.1  0.   0.55]
#  [1.1  1.1  0.   0.  ]]

print("K")
print(K)

# 결과
# [[0.55 0.   1.1  0.  ]
#  [0.   0.55 0.   1.1 ]
#  [0.55 0.55 0.   0.  ]]

print("V")
print(V)

# 결과
# [[1.65 0.   0.55 0.  ]
#  [0.   1.65 0.   0.55]
#  [1.1  1.1  0.   0.  ]]
```

직관은 Encoder와 같습니다.

```text
Query → 내가 무엇을 찾는가
Key   → 내가 어떤 특징을 가지고 있는가
Value → 실제로 전달할 정보
```

## 4. 두 개의 Head로 나누기

Hidden Dimension은 4이고 Head가 2개이므로

$$d_k=\frac{4}{2}=2$$

입니다.

```python
num_heads = 2
head_dim = 2

Qh = Q.reshape(3, num_heads, head_dim).transpose(1, 0, 2)
Kh = K.reshape(3, num_heads, head_dim).transpose(1, 0, 2)
Vh = V.reshape(3, num_heads, head_dim).transpose(1, 0, 2)

print(Qh.shape)

# 결과
# (2, 3, 2)
#
# 2 → Attention Head
# 3 → Token
# 2 → Head Dimension
```

Head 1의 Query:

```python
print(Qh[0])

# 결과
# [[1.1 0. ]
#  [0.  1.1]
#  [1.1 1.1]]
```

Head 2의 Query:

```python
print(Qh[1])

# 결과
# [[0.55 0.  ]
#  [0.   0.55]
#  [0.   0.  ]]
```

## 5. Mask 적용 전 Attention Score

먼저 Encoder와 똑같이 Scaled Dot-Product Score를 계산합니다.

$$S=\frac{QK^T}{\sqrt{d_k}}$$

```python
scores = Qh @ Kh.transpose(0, 2, 1)
scores = scores / np.sqrt(head_dim)

print("Head 1")
print(scores[0])

# 결과
# [[0.4278 0.     0.4278]
#  [0.     0.4278 0.4278]
#  [0.4278 0.4278 0.8556]]

print("Head 2")
print(scores[1])

# 결과
# [[0.4278 0.     0.    ]
#  [0.     0.4278 0.    ]
#  [0.     0.     0.    ]]
```

여기까지만 보면 첫 번째 Token인 `I`도 미래의 `love`, `AI`를 볼 수 있습니다.

예를 들어 Head 1의 첫 번째 행은

```text
I → I
I → love
I → AI
```

세 위치 모두 점수가 존재합니다.

생성 모델에서는 이것을 그대로 사용하면 안 됩니다.

## 6. Causal Mask 만들기

미래 Token 위치를 `-∞`로 만듭니다.

```python
causal_mask = np.array([
    [0.0,   -np.inf, -np.inf],
    [0.0,    0.0,    -np.inf],
    [0.0,    0.0,     0.0],
])

print(causal_mask)

# 결과
# [[  0. -inf -inf]
#  [  0.   0. -inf]
#  [  0.   0.   0.]]
```

의미는 다음과 같습니다.

```text
I
→ I만 가능

love
→ I, love 가능
→ AI 금지

AI
→ I, love, AI 가능
```

표로 보면

```text
        I    love    AI
I       O      X      X
love    O      O      X
AI      O      O      O
```

<mark>Causal Mask의 핵심은 현재 위치보다 오른쪽에 있는 미래 Token을 볼 수 없게 만드는 것입니다.</mark>

## 7. Score에 Causal Mask 적용

Score에 Mask를 더합니다.

$$S'=\frac{QK^T}{\sqrt{d_k}}+M$$

```python
masked_scores = scores + causal_mask

print("Head 1")
print(masked_scores[0])

# 결과
# [[0.4278   -inf   -inf]
#  [0.     0.4278   -inf]
#  [0.4278 0.4278 0.8556]]

print("Head 2")
print(masked_scores[1])

# 결과
# [[0.4278   -inf   -inf]
#  [0.     0.4278   -inf]
#  [0.     0.     0.    ]]
```

첫 번째 행의 미래 위치가 모두 `-inf`가 됐습니다.

## 8. Softmax를 적용하면 미래 확률이 0이 된다

```python
def softmax(x):
    x = x - np.max(x, axis=-1, keepdims=True)
    exp_x = np.exp(x)
    return exp_x / np.sum(exp_x, axis=-1, keepdims=True)

attention_weights = np.stack([
    softmax(masked_scores[0]),
    softmax(masked_scores[1]),
])

print("Head 1")
print(attention_weights[0])

# 결과
# [[1.     0.     0.    ]
#  [0.3947 0.6053 0.    ]
#  [0.2830 0.2830 0.4340]]

print("Head 2")
print(attention_weights[1])

# 결과
# [[1.     0.     0.    ]
#  [0.3947 0.6053 0.    ]
#  [0.3333 0.3333 0.3333]]
```

이 숫자가 Causal Mask의 핵심을 그대로 보여줍니다.

### `I` 위치

```text
I    → 1.0000
love → 0.0000
AI   → 0.0000
```

미래를 전혀 볼 수 없습니다.

### `love` 위치

Head 1 기준:

```text
I    → 0.3947
love → 0.6053
AI   → 0.0000
```

아직 생성되지 않은 `AI`의 Weight가 정확히 0입니다.

### `AI` 위치

```text
I
love
AI
```

모두 이미 현재 또는 과거이므로 전부 볼 수 있습니다.

<blockquote class="prompt-info">
<p>Causal Mask의 -∞는 Softmax 이후 정확히 0에 해당하는 Weight가 되도록 만들기 위한 장치입니다.</p>
</blockquote>

## 9. Attention Weight와 V 결합

이제 허용된 Token의 Value만 가중합합니다.

$$\mathrm{Attention}(Q,K,V)=\mathrm{softmax}\left(\frac{QK^T}{\sqrt{d_k}}+M\right)V$$

```python
head_output = attention_weights @ Vh

print("Head 1 Output")
print(head_output[0])

# 결과
# [[1.6500 0.0000]
#  [0.6512 0.9988]
#  [0.9444 0.9444]]

print("Head 2 Output")
print(head_output[1])

# 결과
# [[0.5500 0.0000]
#  [0.2171 0.3329]
#  [0.1833 0.1833]]
```

특히 첫 번째 Token `I`는 자기 자신밖에 볼 수 없기 때문에

```text
Attention Weight
[1, 0, 0]
```

이 되고, 출력도 사실상 자신의 Value만 가져옵니다.

## 10. 두 Head를 다시 합치기

```python
multi_head_output = (
    head_output
    .transpose(1, 0, 2)
    .reshape(3, 4)
)

print(multi_head_output)

# 결과
# [[1.6500 0.0000 0.5500 0.0000]
#  [0.6512 0.9988 0.2171 0.3329]
#  [0.9444 0.9444 0.1833 0.1833]]
```

실제 Multi-Head Attention은 여기에 Output Projection `W_O`도 적용합니다.

여기서는 흐름을 단순하게 보기 위해 `W_O`를 단위행렬로 가정합니다.

## 11. 첫 번째 Residual Connection

원래 Decoder 입력을 다시 더합니다.

$$R_1=X+\mathrm{MHA}(X)$$

```python
residual1 = X + multi_head_output

print(residual1)

# 결과
# [[2.7500 0.0000 1.6500 0.0000]
#  [0.6512 2.0988 0.2171 1.4329]
#  [2.0444 2.0444 0.1833 0.1833]]
```

`love`를 보면

```text
원래 입력
[0.0000, 1.1000, 0.0000, 1.1000]

Causal Attention Output
[0.6512, 0.9988, 0.2171, 0.3329]
```

두 값을 더해

```text
[0.6512, 2.0988, 0.2171, 1.4329]
```

가 됩니다.

## 12. Layer Normalization

설명을 위해 `gamma=1`, `beta=0`인 단순 LayerNorm을 사용합니다.

```python
def layer_norm(x, eps=1e-5):
    mean = x.mean(axis=-1, keepdims=True)
    var = ((x - mean) ** 2).mean(axis=-1, keepdims=True)
    return (x - mean) / np.sqrt(var + eps)

norm1 = layer_norm(residual1)

print(norm1)

# 결과
# [[ 1.4142 -0.9428  0.4714 -0.9428]
#  [-0.6210  1.3819 -1.2216  0.4606]
#  [ 1.0000  1.0000 -1.0000 -1.0000]]
```

원래 Transformer 논문의 대표 그림은 이런 **Post-Norm 형태**로 이해할 수 있습니다.

현대 LLM에는 Pre-Norm이나 RMSNorm 등 다른 구성이 많이 사용되므로 실제 모델 구조는 확인해야 합니다.

## 13. Feed Forward Network

이제 각 Token에 동일한 FFN을 독립적으로 적용합니다.

$$\mathrm{FFN}(x)=W_2\mathrm{ReLU}(W_1x+b_1)+b_2$$

설명을 위해

```text
4차원
→ 6차원
→ 4차원
```

으로 변환합니다.

```python
W1 = np.array([
    [ 0.5,  0.2, -0.3,  0.1,  0.4,  0.0],
    [ 0.1,  0.6,  0.2, -0.2,  0.0,  0.3],
    [ 0.4, -0.1,  0.5,  0.2, -0.3,  0.1],
    [-0.2,  0.3,  0.1,  0.5,  0.2, -0.4],
])

b1 = np.array([0.1, 0.0, 0.05, 0.0, 0.0, 0.0])

W2 = np.array([
    [ 0.5,  0.0,  0.2, -0.1],
    [ 0.1,  0.4, -0.2,  0.3],
    [-0.3,  0.2,  0.5,  0.0],
    [ 0.2, -0.1,  0.1,  0.4],
    [ 0.0,  0.3, -0.2,  0.2],
    [ 0.4, -0.2,  0.0,  0.1],
])

b2 = np.array([0.0, 0.05, 0.0, -0.05])

hidden = norm1 @ W1 + b1
relu = np.maximum(hidden, 0)
ffn_output = relu @ W2 + b2

print(ffn_output)

# 결과
# [[ 0.6015  0.0924  0.1708 -0.0977]
#  [ 0.1398  0.4776 -0.2351  0.2925]
#  [ 0.5500  0.3200 -0.1200  0.2400]]
```

Attention과 FFN의 역할을 구분해야 합니다.

```text
Causal Self-Attention
→ 이전 Token들의 정보를 섞음

FFN
→ 각 Token Vector 자체를 변환
```

## 14. 두 번째 Add & Norm

FFN 결과에 이전 표현을 다시 더합니다.

```python
residual2 = norm1 + ffn_output

encoder_like_decoder_output = layer_norm(residual2)

print(encoder_like_decoder_output)

# 결과
# [[ 1.4729 -0.8415  0.3638 -0.9951]
#  [-0.5193  1.3511 -1.2988  0.4670]
#  [ 1.0881  0.8959 -1.1424 -0.8416]]
```

이 값이 지금 계산한 **Decoder-only Block 한 층의 출력**입니다.

Token별로 보면

```text
I
→ [ 1.4729, -0.8415,  0.3638, -0.9951]

love
→ [-0.5193,  1.3511, -1.2988,  0.4670]

AI
→ [ 1.0881,  0.8959, -1.1424, -0.8416]
```

입니다.

## `love` 하나만 따라가 보기

`love`가 한 Decoder Block에서 어떻게 변했는지 보면 더 쉽습니다.

```text
초기 Embedding
[0.0000, 1.0000, 0.0000, 1.0000]

위치 정보 추가
[0.0000, 1.1000, 0.0000, 1.1000]

Causal Attention Weight - Head 1
[0.3947, 0.6053, 0.0000]
                     ↑
               미래 AI는 0

Multi-Head Attention
[0.6512, 0.9988, 0.2171, 0.3329]

Residual + LayerNorm
[-0.6210, 1.3819, -1.2216, 0.4606]

FFN
[0.1398, 0.4776, -0.2351, 0.2925]

최종 Decoder Block
[-0.5193, 1.3511, -1.2988, 0.4670]
```

<mark>Encoder와 가장 큰 차이는 Attention Weight를 계산할 때 미래 Token의 Weight가 0이 되도록 Causal Mask가 들어간다는 점입니다.</mark>

## 15. Hidden State를 Vocabulary Logit으로 변환

Decoder Block 출력 자체가 단어는 아닙니다.

마지막 Hidden State를 Vocabulary 크기로 Projection해야 합니다.

현재 마지막 Token은 `AI`입니다.

```python
decoder_output = encoder_like_decoder_output

last_hidden = decoder_output[-1]

print(last_hidden)

# 결과
# [ 1.0881  0.8959 -1.1424 -0.8416]
```

설명을 위해 Vocabulary를 5개로 작게 만들겠습니다.

```text
0 → I
1 → love
2 → AI
3 → because
4 → <EOS>
```

Vocabulary Projection Matrix를 임의로 지정합니다.

```python
vocab = ["I", "love", "AI", "because", "<EOS>"]

W_vocab = np.array([
    [ 0.2,  0.1,  0.3,  0.8, -0.2],
    [ 0.1,  0.4,  0.2,  0.6,  0.0],
    [-0.3,  0.2, -0.1, -0.2,  0.5],
    [ 0.0, -0.1,  0.3,  0.4,  0.2],
])

b_vocab = np.array([0.0, 0.0, 0.0, 0.1, 0.0])

logits = last_hidden @ W_vocab + b_vocab

print(logits)

# 결과
# [ 0.6499  0.3229  0.3674  1.3998 -0.9571]
```

이 값이 **Logit**입니다.

아직 확률은 아닙니다.

## 16. Softmax로 다음 Token 확률 계산

```python
probs = softmax(logits)

for token, prob in zip(vocab, probs):
    print(f"{token:8s} {prob:.4f}")

# 결과
# I        0.2087
# love     0.1505
# AI       0.1573
# because  0.4417
# <EOS>    0.0418
```

이 예시에서는

```text
because → 44.17%
```

가 가장 높습니다.

Greedy Decoding이라면 다음 Token으로 `because`를 선택합니다.

```text
기존 입력
I love AI

다음 입력
I love AI because
```

그리고 다시 같은 과정을 반복합니다.

## Decoder가 문장을 생성하는 전체 흐름

```text
I
↓
다음 Token 예측
↓
love
↓
I love
↓
다음 Token 예측
↓
AI
↓
I love AI
↓
다음 Token 예측
↓
because
↓
...
```

이를 **Autoregressive Generation**이라고 합니다.

$$P(x_1,\dots,x_n)=\prod_{t=1}^{n}P(x_t\mid x_{<t})$$

즉 다음 Token은 이전 Token들에 조건부로 결정됩니다.

## 전체 Decoder-only 계산 코드

지금까지의 계산을 한 번에 실행하면 다음과 같습니다.

```python
import numpy as np

np.set_printoptions(precision=4, suppress=True)

# --------------------------------------------------
# 1. Embedding + Position
# --------------------------------------------------

E = np.array([
    [1.0, 0.0, 1.0, 0.0],  # I
    [0.0, 1.0, 0.0, 1.0],  # love
    [1.0, 1.0, 0.0, 0.0],  # AI
])

P = np.array([
    [0.1, 0.0, 0.1, 0.0],
    [0.0, 0.1, 0.0, 0.1],
    [0.1, 0.1, 0.0, 0.0],
])

X = E + P

# X
# [[1.1 0.  1.1 0. ]
#  [0.  1.1 0.  1.1]
#  [1.1 1.1 0.  0. ]]

# --------------------------------------------------
# 2. Q, K, V
# --------------------------------------------------

W_Q = np.array([
    [1.0, 0.0, 0.0, 0.0],
    [0.0, 1.0, 0.0, 0.0],
    [0.0, 0.0, 0.5, 0.0],
    [0.0, 0.0, 0.0, 0.5],
])

W_K = np.array([
    [0.5, 0.0, 0.0, 0.0],
    [0.0, 0.5, 0.0, 0.0],
    [0.0, 0.0, 1.0, 0.0],
    [0.0, 0.0, 0.0, 1.0],
])

W_V = np.array([
    [1.0, 0.0, 0.0, 0.0],
    [0.0, 1.0, 0.0, 0.0],
    [0.5, 0.0, 0.5, 0.0],
    [0.0, 0.5, 0.0, 0.5],
])

Q = X @ W_Q
K = X @ W_K
V = X @ W_V

# --------------------------------------------------
# 3. Multi-Head
# --------------------------------------------------

num_heads = 2
head_dim = 2

Qh = Q.reshape(3, num_heads, head_dim).transpose(1, 0, 2)
Kh = K.reshape(3, num_heads, head_dim).transpose(1, 0, 2)
Vh = V.reshape(3, num_heads, head_dim).transpose(1, 0, 2)

scores = Qh @ Kh.transpose(0, 2, 1)
scores = scores / np.sqrt(head_dim)

# Mask 적용 전 Head 1
# [[0.4278 0.     0.4278]
#  [0.     0.4278 0.4278]
#  [0.4278 0.4278 0.8556]]

# --------------------------------------------------
# 4. Causal Mask
# --------------------------------------------------

mask = np.array([
    [0.0,   -np.inf, -np.inf],
    [0.0,    0.0,    -np.inf],
    [0.0,    0.0,     0.0],
])

masked_scores = scores + mask

# Mask 적용 후 Head 1
# [[0.4278   -inf   -inf]
#  [0.     0.4278   -inf]
#  [0.4278 0.4278 0.8556]]

def softmax(x):
    x = x - np.max(x, axis=-1, keepdims=True)
    exp_x = np.exp(x)
    return exp_x / np.sum(exp_x, axis=-1, keepdims=True)

weights = np.stack([
    softmax(masked_scores[0]),
    softmax(masked_scores[1]),
])

# Head 1 Attention Weight
# [[1.     0.     0.    ]
#  [0.3947 0.6053 0.    ]
#  [0.2830 0.2830 0.4340]]

# Head 2 Attention Weight
# [[1.     0.     0.    ]
#  [0.3947 0.6053 0.    ]
#  [0.3333 0.3333 0.3333]]

head_output = weights @ Vh

mha_output = (
    head_output
    .transpose(1, 0, 2)
    .reshape(3, 4)
)

# MHA Output
# [[1.6500 0.0000 0.5500 0.0000]
#  [0.6512 0.9988 0.2171 0.3329]
#  [0.9444 0.9444 0.1833 0.1833]]

# --------------------------------------------------
# 5. Add & Norm
# --------------------------------------------------

def layer_norm(x, eps=1e-5):
    mean = x.mean(axis=-1, keepdims=True)
    var = ((x - mean) ** 2).mean(axis=-1, keepdims=True)
    return (x - mean) / np.sqrt(var + eps)

residual1 = X + mha_output
norm1 = layer_norm(residual1)

# norm1
# [[ 1.4142 -0.9428  0.4714 -0.9428]
#  [-0.6210  1.3819 -1.2216  0.4606]
#  [ 1.0000  1.0000 -1.0000 -1.0000]]

# --------------------------------------------------
# 6. FFN
# --------------------------------------------------

W1 = np.array([
    [ 0.5,  0.2, -0.3,  0.1,  0.4,  0.0],
    [ 0.1,  0.6,  0.2, -0.2,  0.0,  0.3],
    [ 0.4, -0.1,  0.5,  0.2, -0.3,  0.1],
    [-0.2,  0.3,  0.1,  0.5,  0.2, -0.4],
])

b1 = np.array([0.1, 0.0, 0.05, 0.0, 0.0, 0.0])

W2 = np.array([
    [ 0.5,  0.0,  0.2, -0.1],
    [ 0.1,  0.4, -0.2,  0.3],
    [-0.3,  0.2,  0.5,  0.0],
    [ 0.2, -0.1,  0.1,  0.4],
    [ 0.0,  0.3, -0.2,  0.2],
    [ 0.4, -0.2,  0.0,  0.1],
])

b2 = np.array([0.0, 0.05, 0.0, -0.05])

hidden = norm1 @ W1 + b1
relu = np.maximum(hidden, 0)
ffn_output = relu @ W2 + b2

# FFN Output
# [[ 0.6015  0.0924  0.1708 -0.0977]
#  [ 0.1398  0.4776 -0.2351  0.2925]
#  [ 0.5500  0.3200 -0.1200  0.2400]]

residual2 = norm1 + ffn_output
decoder_output = layer_norm(residual2)

# Decoder Output
# [[ 1.4729 -0.8415  0.3638 -0.9951]
#  [-0.5193  1.3511 -1.2988  0.4670]
#  [ 1.0881  0.8959 -1.1424 -0.8416]]

# --------------------------------------------------
# 7. Vocabulary Projection
# --------------------------------------------------

last_hidden = decoder_output[-1]

vocab = ["I", "love", "AI", "because", "<EOS>"]

W_vocab = np.array([
    [ 0.2,  0.1,  0.3,  0.8, -0.2],
    [ 0.1,  0.4,  0.2,  0.6,  0.0],
    [-0.3,  0.2, -0.1, -0.2,  0.5],
    [ 0.0, -0.1,  0.3,  0.4,  0.2],
])

b_vocab = np.array([0.0, 0.0, 0.0, 0.1, 0.0])

logits = last_hidden @ W_vocab + b_vocab
probs = softmax(logits)

# logits
# [ 0.6499  0.3229  0.3674  1.3998 -0.9571]

for token, prob in zip(vocab, probs):
    print(f"{token:8s} {prob:.4f}")

# 결과
# I        0.2087
# love     0.1505
# AI       0.1573
# because  0.4417
# <EOS>    0.0418
```

## 원래 Transformer Decoder의 Cross-Attention

지금까지 계산한 것은 GPT처럼 **Decoder-only** 구조였습니다.

원래 Transformer의 Encoder-Decoder 구조에서는 Causal Self-Attention 뒤에 Cross-Attention이 하나 더 있습니다.

```text
Decoder Hidden State
↓
Cross-Attention
↑
Encoder Output
```

Cross-Attention에서는 Q, K, V의 출처가 다릅니다.

```text
Q → Decoder
K → Encoder
V → Encoder
```

## Cross-Attention도 실제 숫자로 계산

앞의 Encoder 글에서 `I love AI`가 Encoder를 통과해 다음 벡터가 나왔다고 하겠습니다.

```python
encoder_output = np.array([
    [ 1.4854, -0.4590,  0.2134, -1.2399],  # I
    [-0.3307,  1.3600, -1.3839,  0.3547],  # love
    [ 1.0881,  0.8959, -1.1424, -0.8416],  # AI
])
```

Decoder의 Causal Self-Attention 직후 표현은 앞에서 계산한 `norm1`을 사용하겠습니다.

```python
decoder_state = norm1

print(decoder_state)

# 결과
# [[ 1.4142 -0.9428  0.4714 -0.9428]
#  [-0.6210  1.3819 -1.2216  0.4606]
#  [ 1.0000  1.0000 -1.0000 -1.0000]]
```

설명을 단순하게 하기 위해 Cross-Attention Projection은 단위행렬이라고 가정합니다.

```python
Q_cross = decoder_state
K_cross = encoder_output
V_cross = encoder_output
```

Cross-Attention Score:

```python
cross_scores = Q_cross @ K_cross.T / np.sqrt(4)

print(cross_scores)

# 결과
# [[ 1.9015 -1.3683  0.4745]
#  [-1.1943  1.9694  0.7851]
#  [ 1.0264  1.0292  1.9840]]
```

여기에는 Causal Mask가 없습니다.

Decoder의 각 위치가 **Encoder 입력 전체**를 참고할 수 있기 때문입니다.

Softmax:

```python
cross_weights = np.stack([
    softmax(row)
    for row in cross_scores
])

print(cross_weights)

# 결과
# [[0.7824 0.0297 0.1878]
#  [0.0314 0.7417 0.2269]
#  [0.2170 0.2176 0.5654]]
```

행은 Decoder Token, 열은 Encoder Token입니다.

예를 들어 첫 번째 Decoder 위치는 Encoder의

```text
I     → 0.7824
love  → 0.0297
AI    → 0.1878
```

를 참고합니다.

세 번째 Decoder 위치는

```text
I     → 0.2170
love  → 0.2176
AI    → 0.5654
```

이므로 이 예시에서는 Encoder의 `AI` Vector를 가장 강하게 참고합니다.

## Cross-Attention Output

```python
cross_output = cross_weights @ V_cross

print(cross_output)

# 결과
# [[ 1.3568 -0.1504 -0.0887 -1.1177]
#  [ 0.0482  1.1976 -1.2790  0.0332]
#  [ 0.8656  0.7029 -0.9007 -0.6677]]
```

Residual과 LayerNorm까지 적용하면

```python
cross_residual = decoder_state + cross_output
cross_norm = layer_norm(cross_residual)

print(cross_norm)

# 결과
# [[ 1.5216 -0.6003  0.2101 -1.1314]
#  [-0.3120  1.4052 -1.3622  0.2690]
#  [ 1.0439  0.9529 -1.0636 -0.9332]]
```

가 됩니다.

<mark>Cross-Attention은 Decoder가 지금까지 만든 표현을 Query로 사용해 Encoder의 입력 표현 중 필요한 정보를 꺼내오는 과정입니다.</mark>

## Self-Attention과 Cross-Attention 비교

| 구분 | Decoder Self-Attention | Cross-Attention |
| --- | --- | --- |
| Q | Decoder | Decoder |
| K | Decoder | Encoder |
| V | Decoder | Encoder |
| Causal Mask | 사용 | 보통 사용하지 않음 |
| 목적 | 이전 출력 문맥 참고 | 입력 Sequence 참고 |

## Training에서는 왜 병렬 계산이 가능한가

추론할 때는 다음 Token을 하나씩 생성합니다.

하지만 학습할 때는 정답 문장이 이미 있습니다.

예:

```text
I love AI because
```

다음 Token 예측 문제로 바꾸면

```text
I
→ love

I love
→ AI

I love AI
→ because
```

입니다.

Causal Mask가 있으므로 전체 Sequence를 한 번에 넣어도 각 위치는 미래 정답을 볼 수 없습니다.

```text
Position 1 → Position 1만
Position 2 → Position 1, 2
Position 3 → Position 1, 2, 3
```

따라서 여러 위치의 Loss를 병렬로 계산할 수 있습니다.

## Training과 Inference 차이

### Training

```text
전체 정답 Sequence
+
Causal Mask
↓
여러 위치를 동시에 계산
```

### Inference

```text
Prompt
↓
다음 Token 생성
↓
그 Token을 다시 입력
↓
다음 Token 생성
↓
반복
```

Inference는 다음 Token을 알아야 그다음 계산을 진행할 수 있기 때문에 기본적으로 순차적입니다.

## KV Cache

Autoregressive 추론에서 이전 Token의 K와 V를 매번 다시 계산하면 낭비가 큽니다.

예:

```text
1단계
I

2단계
I love

3단계
I love AI
```

세 번째 단계에서 `I`, `love`의 K와 V는 이미 앞 단계에서 계산했습니다.

그래서 저장해둡니다.

```text
K Cache
V Cache
```

이를 **KV Cache**라고 합니다.

간단한 Shape 예시는 다음과 같습니다.

```python
# Head 수 2, 기존 Token 3개, Head Dimension 2라고 가정

K_cache = np.zeros((2, 3, 2))
V_cache = np.zeros((2, 3, 2))

print(K_cache.shape)
print(V_cache.shape)

# 결과
# (2, 3, 2)
# (2, 3, 2)

# 다음 Token 1개가 생성되면
new_K = np.zeros((2, 1, 2))
new_V = np.zeros((2, 1, 2))

K_cache = np.concatenate([K_cache, new_K], axis=1)
V_cache = np.concatenate([V_cache, new_V], axis=1)

print(K_cache.shape)
print(V_cache.shape)

# 결과
# (2, 4, 2)
# (2, 4, 2)
```

Sequence가 길어질수록 Cache도 커집니다.

<blockquote class="prompt-info">
<p>KV Cache는 이전 Token의 Key와 Value를 저장해 다음 Token 생성 때 다시 계산하지 않도록 하는 추론 최적화입니다.</p>
</blockquote>

## Decoder와 Encoder의 차이

| 구분 | Encoder | Decoder |
| --- | --- | --- |
| Self-Attention | 양방향 | Causal |
| 미래 Token | 볼 수 있음 | 볼 수 없음 |
| 대표 Mask | Padding | Causal |
| 출력 목적 | Contextual Representation | 다음 Token 생성 |
| 대표 모델 | BERT | GPT |

가장 중요한 차이를 숫자로 보면 이것입니다.

Encoder의 `love` Attention:

```text
I     0.2458
love  0.3771
AI    0.3771
```

Decoder의 `love` Attention:

```text
I     0.3947
love  0.6053
AI    0.0000
```

Decoder에서는 미래 `AI`가 **0**입니다.

## 잘 놓치는 핵심

### 1. Causal Mask는 Softmax 전에 적용한다

```text
Attention Score
→ 미래 위치에 -∞
→ Softmax
→ 미래 Weight = 0
```

### 2. Padding Mask와 Causal Mask는 다르다

```text
Padding Mask
→ PAD 무시

Causal Mask
→ 미래 Token 차단
```

### 3. GPT에는 일반적으로 Cross-Attention이 없다

Decoder-only 구조이기 때문입니다.

### 4. 원래 Transformer Decoder에는 Cross-Attention이 있다

Encoder Output을 참고해야 하기 때문입니다.

### 5. Cross-Attention의 출처

```text
Q → Decoder
K → Encoder
V → Encoder
```

### 6. Hidden State는 아직 Token이 아니다

```text
Hidden State
→ Linear Projection
→ Vocabulary Logit
→ Softmax
→ Token 확률
```

### 7. Training과 Inference는 다르다

Training은 Causal Mask 덕분에 병렬 계산할 수 있지만, Inference는 다음 Token을 순차적으로 생성합니다.

## 시험·면접

### 핵심 암기

```text
Decoder-only

Embedding + Position
↓
Causal Self-Attention
↓
Add & Norm
↓
FFN
↓
Add & Norm
↓
Vocabulary Projection
↓
Softmax
↓
Next Token
```

원래 Transformer Decoder:

```text
Masked Self-Attention
↓
Cross-Attention
↓
FFN
```

### Q. Causal Mask를 사용하는 이유는?

현재 위치에서 미래 정답 Token을 미리 보지 못하게 하기 위해서입니다.

### Q. Causal Mask는 어떻게 미래 Attention을 0으로 만드는가?

미래 위치의 Attention Score에 `-∞`를 더한 뒤 Softmax를 적용하면 해당 위치의 Weight가 0이 됩니다.

### Q. Cross-Attention에서 Q, K, V는 어디서 오는가?

Q는 Decoder, K와 V는 Encoder Output에서 옵니다.

### Q. GPT에는 왜 Cross-Attention이 없는가?

일반적인 GPT는 Encoder가 없는 Decoder-only 모델이기 때문입니다.

### Q. KV Cache란?

이미 계산한 이전 Token의 Key와 Value를 저장해 Autoregressive 추론에서 중복 계산을 줄이는 방법입니다.

<blockquote class="prompt-danger">
<p>시험 함정: Decoder의 Causal Mask는 미래 Token 자체를 입력에서 삭제하는 것이 아닙니다. Attention Score에서 미래 위치를 보지 못하도록 막습니다.</p>
</blockquote>

## 객관식 문제

### 1. Causal Mask의 목적은?

① PAD Token 생성  
② 미래 Token 차단  
③ Vocabulary 축소  
④ Embedding 제거

<details>
<summary>정답</summary>

②

</details>

### 2. 미래 위치에 `-∞`를 넣는 이유는?

① ReLU 결과를 키우기 위해  
② Softmax 이후 해당 위치의 Weight를 0으로 만들기 위해  
③ Embedding Dimension을 줄이기 위해  
④ Token ID를 만들기 위해

<details>
<summary>정답</summary>

②

</details>

### 3. Cross-Attention의 Key와 Value는 어디서 오는가?

① Decoder  
② Encoder Output  
③ Tokenizer  
④ Vocabulary Logit

<details>
<summary>정답</summary>

②

</details>

### 4. Decoder-only GPT에 대한 설명으로 옳은 것은?

① 미래 Token 전체를 볼 수 있다.  
② 반드시 Encoder가 필요하다.  
③ Causal Self-Attention을 사용한다.  
④ Cross-Attention만 사용한다.

<details>
<summary>정답</summary>

③

</details>

### 5. Vocabulary Logit에 Softmax를 적용하는 이유는?

① 다음 Token에 대한 확률 분포로 바꾸기 위해  
② Token 수를 줄이기 위해  
③ Causal Mask를 제거하기 위해  
④ Positional Encoding을 만들기 위해

<details>
<summary>정답</summary>

①

</details>

### 6. KV Cache의 주된 목적은?

① Training Data 저장  
② 이전 K와 V 재사용으로 추론 중복 계산 감소  
③ Vocabulary 학습  
④ Encoder Output 삭제

<details>
<summary>정답</summary>

②

</details>

## 마지막 정리

```text
I love AI
↓
Embedding + Position
↓
Q, K, V
↓
Attention Score
↓
Causal Mask
↓
Softmax
↓
미래 Token Weight = 0
↓
Attention × V
↓
Multi-Head 결합
↓
Residual + LayerNorm
↓
FFN
↓
Residual + LayerNorm
↓
Hidden State
↓
Vocabulary Logit
↓
Softmax
↓
Next Token
```

이번 예시에서는

```text
I love AI
```

뒤의 다음 Token 확률이

```text
because  0.4417
I        0.2087
AI       0.1573
love     0.1505
<EOS>    0.0418
```

로 계산되었습니다.

<mark>Transformer Decoder의 핵심은 Causal Mask로 미래 정보의 Attention Weight를 0으로 만든 상태에서 이전 Token들을 이용해 다음 Token의 확률을 계산하는 것입니다.</mark>

## 다음에 이을 글

**Self-Attention과 Scaled Dot-Product Attention**입니다.  
`QK^T`, Scaling, Softmax, Value 가중합을 더 작은 2차원 Vector 예제로 하나씩 손계산합니다.
