---
title: Transformer Encoder
date: 2026-09-12 14:40:00 +0900
slug: transformer-encoder
permalink: /posts/transformer-encoder/
categories: [AI, 딥러닝]
tags: [Transformer, Encoder, SelfAttention, MultiHeadAttention, BERT, LLM]
math: true
---

Transformer Encoder는 **입력 Sequence 전체를 서로 참고하게 만들어 각 Token을 문맥이 반영된 벡터로 바꾸는 구조**입니다.  
핵심은 Multi-Head Self-Attention과 Feed Forward Network입니다.

<blockquote class="prompt-info">
<p>한 줄: Encoder는 입력 Token 전체의 관계를 계산하고, 각 Token을 Contextual Vector로 바꿉니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

Embedding과 위치 정보를 입력받아 Multi-Head Self-Attention → Add & Norm → FFN → Add & Norm을 거칩니다.

</details>

## Encoder 한 층 전체

```text
Token
↓
Embedding + Position
↓
Multi-Head Self-Attention
↓
Add & Norm
↓
Feed Forward Network
↓
Add & Norm
↓
Contextual Representation
```

Encoder Layer를 여러 층 쌓으면 다음과 같습니다.

```text
Input
↓
Encoder Layer 1
↓
Encoder Layer 2
↓
...
↓
Encoder Layer N
```

<mark>Encoder의 출력은 Token을 없애는 것이 아니라 각 Token의 표현을 문맥에 맞게 바꾸는 것입니다.</mark>

## 이번 글에서 직접 계산할 문장

수식만 보면 흐름이 잘 안 보이므로 다음 문장을 실제 숫자로 계산해보겠습니다.

```text
I love AI
```

설명을 위해

```text
Token 수 = 3
Embedding Dimension = 4
Attention Head 수 = 2
Head Dimension = 2
```

로 아주 작게 설정합니다.

실제 Transformer는 훨씬 큰 차원을 사용하지만 계산 원리는 같습니다.

## 1. Token Embedding

각 Token에 임의의 Embedding Vector를 넣겠습니다.

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

따라서 Shape은

```text
3 × 4
```

입니다.

```python
print(E.shape)

# 결과
# (3, 4)
```

## 2. 위치 정보 추가

Self-Attention만으로는 Token 순서를 알 수 없습니다.

설명을 위해 다음 위치 벡터를 사용하겠습니다.

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

즉 Encoder에 실제로 들어가는 입력을 단순화하면

$$X=E+P$$

입니다.

```text
I     → [1.1, 0.0, 1.1, 0.0]
love  → [0.0, 1.1, 0.0, 1.1]
AI    → [1.1, 1.1, 0.0, 0.0]
```

## 3. Q, K, V 만들기

Self-Attention에서는 같은 입력 `X`에서 Query, Key, Value를 만듭니다.

$$Q=XW_Q$$

$$K=XW_K$$

$$V=XW_V$$

실제 모델에서는 `W_Q`, `W_K`, `W_V`가 학습됩니다.

여기서는 계산을 직접 보기 위해 임의의 값을 사용합니다.

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

직관은 다음과 같습니다.

```text
Query → 내가 무엇을 찾는가
Key   → 내가 어떤 특징을 가지고 있는가
Value → 실제로 전달할 정보
```

<mark>Q와 K는 누구를 얼마나 참고할지 정하고, V는 실제로 가져올 정보입니다.</mark>

## 4. Multi-Head로 나누기

현재 Hidden Dimension은 4이고 Head는 2개입니다.

따라서 한 Head가 담당하는 Dimension은

$$d_k=\frac{4}{2}=2$$

입니다.

```python
num_heads = 2
head_dim = 2

Q_heads = Q.reshape(3, num_heads, head_dim).transpose(1, 0, 2)
K_heads = K.reshape(3, num_heads, head_dim).transpose(1, 0, 2)
V_heads = V.reshape(3, num_heads, head_dim).transpose(1, 0, 2)

print(Q_heads.shape)

# 결과
# (2, 3, 2)
#
# 2     → Head 수
# 3     → Token 수
# 2     → Head Dimension
```

Head 1의 Query는 다음과 같습니다.

```python
print(Q_heads[0])

# 결과
# [[1.1 0. ]
#  [0.  1.1]
#  [1.1 1.1]]
```

Head 2의 Query는 다음과 같습니다.

```python
print(Q_heads[1])

# 결과
# [[0.55 0.  ]
#  [0.   0.55]
#  [0.   0.  ]]
```

각 Head가 서로 다른 Feature 공간을 보고 Attention을 계산한다고 이해하면 됩니다.

## 5. Attention Score 계산

한 Head의 기본 Attention Score는 다음과 같습니다.

$$QK^T$$

Head Dimension이 커질수록 값이 커질 수 있으므로 Scale합니다.

$$\frac{QK^T}{\sqrt{d_k}}$$

Python으로 두 Head를 동시에 계산하면

```python
scores = Q_heads @ K_heads.transpose(0, 2, 1)
scaled_scores = scores / np.sqrt(head_dim)

print("Head 1")
print(scaled_scores[0])

# 결과
# [[0.4278 0.     0.4278]
#  [0.     0.4278 0.4278]
#  [0.4278 0.4278 0.8556]]

print("Head 2")
print(scaled_scores[1])

# 결과
# [[0.4278 0.     0.    ]
#  [0.     0.4278 0.    ]
#  [0.     0.     0.    ]]
```

Attention Matrix의

```text
행 → Query Token
열 → Key Token
```

입니다.

Head 1의 첫 번째 행

```text
[0.4278, 0.0000, 0.4278]
```

은 `I`가

```text
I
love
AI
```

각 Token과 얼마나 관련 있는지 나타내는 Softmax 이전 점수입니다.

## 6. Softmax로 Attention Weight 만들기

Score를 확률처럼 사용할 수 있도록 Softmax를 적용합니다.

$$A=\mathrm{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)$$

```python
def softmax(x):
    x = x - np.max(x, axis=-1, keepdims=True)
    exp_x = np.exp(x)
    return exp_x / np.sum(exp_x, axis=-1, keepdims=True)

attention_weights = np.stack([
    softmax(scaled_scores[0]),
    softmax(scaled_scores[1]),
])

print("Head 1")
print(attention_weights[0])

# 결과
# [[0.3771 0.2458 0.3771]
#  [0.2458 0.3771 0.3771]
#  [0.2830 0.2830 0.4340]]

print("Head 2")
print(attention_weights[1])

# 결과
# [[0.4340 0.2830 0.2830]
#  [0.2830 0.4340 0.2830]
#  [0.3333 0.3333 0.3333]]
```

각 행의 합은 1입니다.

```python
print(attention_weights[0].sum(axis=-1))

# 결과
# [1. 1. 1.]
```

예를 들어 Head 1에서 `love`의 Attention Weight는

```text
I     → 0.2458
love  → 0.3771
AI    → 0.3771
```

입니다.

즉 이 Head에서는 `love`가 자신의 정보와 `AI`의 정보를 같은 정도로 강하게 참고합니다.

## 7. Attention Weight와 V 결합

이제 Attention Weight만큼 Value를 가져옵니다.

$$\mathrm{Attention}(Q,K,V)=\mathrm{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

```python
head_outputs = attention_weights @ V_heads

print("Head 1 Output")
print(head_outputs[0])

# 결과
# [[1.0370 0.8204]
#  [0.8204 1.0370]
#  [0.9444 0.9444]]

print("Head 2 Output")
print(head_outputs[1])

# 결과
# [[0.2387 0.1556]
#  [0.1556 0.2387]
#  [0.1833 0.1833]]
```

예를 들어 Head 1의 `love` 결과는

```text
[0.8204, 1.0370]
```

입니다.

이 값은 `love` 자신의 Value만 사용한 값이 아닙니다.

```text
I의 Value
love의 Value
AI의 Value
```

를 Attention Weight에 따라 섞은 결과입니다.

## 8. Head 결과 합치기

두 Head 결과를 다시 이어 붙입니다.

```python
multi_head_output = (
    head_outputs
    .transpose(1, 0, 2)
    .reshape(3, 4)
)

print(multi_head_output)

# 결과
# [[1.0370 0.8204 0.2387 0.1556]
#  [0.8204 1.0370 0.1556 0.2387]
#  [0.9444 0.9444 0.1833 0.1833]]
```

원래 Multi-Head Attention에서는 Concat 뒤에 `W_O` Projection도 적용합니다.

여기서는 계산 흐름을 단순하게 보기 위해 `W_O`를 단위행렬이라고 가정합니다.

따라서

```text
MHA Output Shape
= 3 × 4
```

가 되어 원래 입력 `X`와 같은 Shape으로 돌아옵니다.

## 9. Residual Connection

Attention 결과에 원래 입력을 더합니다.

$$R_1=X+\mathrm{MHA}(X)$$

```python
residual1 = X + multi_head_output

print(residual1)

# 결과
# [[2.1370 0.8204 1.3387 0.1556]
#  [0.8204 2.1370 0.1556 1.3387]
#  [2.0444 2.0444 0.1833 0.1833]]
```

예를 들어 `love`는

```text
원래 love 입력
[0.0000, 1.1000, 0.0000, 1.1000]

Attention 결과
[0.8204, 1.0370, 0.1556, 0.2387]
```

를 더해

```text
[0.8204, 2.1370, 0.1556, 1.3387]
```

이 됩니다.

<mark>Residual Connection은 기존 Token 정보에 Attention으로 얻은 문맥 정보를 더합니다.</mark>

## 10. Layer Normalization

설명을 위해 `gamma=1`, `beta=0`인 단순한 LayerNorm을 직접 구현하겠습니다.

```python
def layer_norm(x, eps=1e-5):
    mean = x.mean(axis=-1, keepdims=True)
    var = ((x - mean) ** 2).mean(axis=-1, keepdims=True)
    return (x - mean) / np.sqrt(var + eps)

norm1 = layer_norm(residual1)

print(norm1)

# 결과
# [[ 1.4127 -0.4036  0.3115 -1.3207]
#  [-0.4036  1.4127 -1.3207  0.3115]
#  [ 1.0000  1.0000 -1.0000 -1.0000]]
```

실제 LayerNorm에는 학습 가능한 Scale과 Bias도 존재합니다.

여기서는 정규화 자체가 어떻게 동작하는지만 보는 예시입니다.

## 11. Feed Forward Network

Attention은 Token 사이의 정보를 섞었습니다.

이제 FFN은 **각 Token Vector를 독립적으로 변환**합니다.

$$\mathrm{FFN}(x)=W_2\mathrm{ReLU}(W_1x+b_1)+b_2$$

설명을 위해

```text
4차원
→ 6차원
→ 4차원
```

FFN을 사용하겠습니다.

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

print(hidden)

# 결과
# [[ 1.1547 -0.3869 -0.4309 -0.3761  0.2075  0.4384]
#  [-0.5511  0.9925 -0.1756 -0.4313  0.2971  0.1672]
#  [ 0.5000  0.6000 -0.6500 -0.8000  0.5000  0.6000]]
```

ReLU를 적용합니다.

```python
relu = np.maximum(hidden, 0)

print(relu)

# 결과
# [[1.1547 0.     0.     0.     0.2075 0.4384]
#  [0.     0.9925 0.     0.     0.2971 0.1672]
#  [0.5000 0.6000 0.     0.     0.5000 0.6000]]
```

다시 4차원으로 줄입니다.

```python
ffn_output = relu @ W2 + b2

print(ffn_output)

# 결과
# [[ 0.7527  0.0246  0.1894 -0.0801]
#  [ 0.1661  0.5027 -0.2579  0.3239]
#  [ 0.5500  0.3200 -0.1200  0.2400]]
```

FFN은 Token끼리 섞는 연산이 아닙니다.

```text
I의 Vector
→ 같은 FFN

love의 Vector
→ 같은 FFN

AI의 Vector
→ 같은 FFN
```

각 Token에 동일한 Network를 따로 적용합니다.

## 12. 두 번째 Add & Norm

FFN 출력에도 Residual Connection을 적용합니다.

$$R_2=Y+\mathrm{FFN}(Y)$$

```python
residual2 = norm1 + ffn_output

print(residual2)

# 결과
# [[ 2.1655 -0.3790  0.5009 -1.4008]
#  [-0.2374  1.9154 -1.5786  0.6354]
#  [ 1.5500  1.3200 -1.1200 -0.7600]]
```

다시 LayerNorm을 적용합니다.

```python
encoder_output = layer_norm(residual2)

print(encoder_output)

# 결과
# [[ 1.4854 -0.4590  0.2134 -1.2399]
#  [-0.3307  1.3600 -1.3839  0.3547]
#  [ 1.0881  0.8959 -1.1424 -0.8416]]
```

이 값이 Encoder 한 층의 최종 출력입니다.

```text
I
→ [ 1.4854, -0.4590,  0.2134, -1.2399]

love
→ [-0.3307,  1.3600, -1.3839,  0.3547]

AI
→ [ 1.0881,  0.8959, -1.1424, -0.8416]
```

처음 Embedding과 비교해보면 값이 완전히 달라졌습니다.

```text
처음 love
[0.0, 1.0, 0.0, 1.0]

Encoder 이후 love
[-0.3307, 1.3600, -1.3839, 0.3547]
```

`love`의 출력에는 이제 `I`, `love`, `AI` 사이의 Attention 관계가 반영되어 있습니다.

<mark>이렇게 만들어진 문맥 반영 벡터가 다음 Encoder Layer의 입력이 됩니다.</mark>

## 전체 계산 코드

위 계산을 한 번에 실행하면 다음과 같습니다.

```python
import numpy as np

np.set_printoptions(precision=4, suppress=True)

# --------------------------------------------------
# 1. I love AI의 임의 Embedding
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

# Q
# [[1.1  0.   0.55 0.  ]
#  [0.   1.1  0.   0.55]
#  [1.1  1.1  0.   0.  ]]

# K
# [[0.55 0.   1.1  0.  ]
#  [0.   0.55 0.   1.1 ]
#  [0.55 0.55 0.   0.  ]]

# V
# [[1.65 0.   0.55 0.  ]
#  [0.   1.65 0.   0.55]
#  [1.1  1.1  0.   0.  ]]

# --------------------------------------------------
# 3. 2개의 Attention Head
# --------------------------------------------------

num_heads = 2
head_dim = 2

Qh = Q.reshape(3, num_heads, head_dim).transpose(1, 0, 2)
Kh = K.reshape(3, num_heads, head_dim).transpose(1, 0, 2)
Vh = V.reshape(3, num_heads, head_dim).transpose(1, 0, 2)

scores = Qh @ Kh.transpose(0, 2, 1)
scores = scores / np.sqrt(head_dim)

# Head 1 Scaled Score
# [[0.4278 0.     0.4278]
#  [0.     0.4278 0.4278]
#  [0.4278 0.4278 0.8556]]

# Head 2 Scaled Score
# [[0.4278 0.     0.    ]
#  [0.     0.4278 0.    ]
#  [0.     0.     0.    ]]

def softmax(x):
    x = x - np.max(x, axis=-1, keepdims=True)
    exp_x = np.exp(x)
    return exp_x / np.sum(exp_x, axis=-1, keepdims=True)

weights = np.stack([
    softmax(scores[0]),
    softmax(scores[1]),
])

# Head 1 Attention Weight
# [[0.3771 0.2458 0.3771]
#  [0.2458 0.3771 0.3771]
#  [0.2830 0.2830 0.4340]]

# Head 2 Attention Weight
# [[0.4340 0.2830 0.2830]
#  [0.2830 0.4340 0.2830]
#  [0.3333 0.3333 0.3333]]

head_output = weights @ Vh

multi_head_output = (
    head_output
    .transpose(1, 0, 2)
    .reshape(3, 4)
)

# Multi-Head Output
# [[1.0370 0.8204 0.2387 0.1556]
#  [0.8204 1.0370 0.1556 0.2387]
#  [0.9444 0.9444 0.1833 0.1833]]

# --------------------------------------------------
# 4. Add & Norm
# --------------------------------------------------

def layer_norm(x, eps=1e-5):
    mean = x.mean(axis=-1, keepdims=True)
    var = ((x - mean) ** 2).mean(axis=-1, keepdims=True)
    return (x - mean) / np.sqrt(var + eps)

residual1 = X + multi_head_output
norm1 = layer_norm(residual1)

# norm1
# [[ 1.4127 -0.4036  0.3115 -1.3207]
#  [-0.4036  1.4127 -1.3207  0.3115]
#  [ 1.0000  1.0000 -1.0000 -1.0000]]

# --------------------------------------------------
# 5. FFN
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
# [[ 0.7527  0.0246  0.1894 -0.0801]
#  [ 0.1661  0.5027 -0.2579  0.3239]
#  [ 0.5500  0.3200 -0.1200  0.2400]]

# --------------------------------------------------
# 6. 두 번째 Add & Norm
# --------------------------------------------------

residual2 = norm1 + ffn_output
encoder_output = layer_norm(residual2)

print(encoder_output)

# 최종 Encoder Output
# [[ 1.4854 -0.4590  0.2134 -1.2399]
#  [-0.3307  1.3600 -1.3839  0.3547]
#  [ 1.0881  0.8959 -1.1424 -0.8416]]
```

## 숫자로 다시 보는 Encoder 한 층

`love` 하나만 따라가면 다음과 같습니다.

```text
초기 Embedding
[0.0000, 1.0000, 0.0000, 1.0000]

위치 정보 추가
[0.0000, 1.1000, 0.0000, 1.1000]

Multi-Head Attention
[0.8204, 1.0370, 0.1556, 0.2387]

Residual + LayerNorm
[-0.4036, 1.4127, -1.3207, 0.3115]

FFN
[0.1661, 0.5027, -0.2579, 0.3239]

두 번째 Residual + LayerNorm
[-0.3307, 1.3600, -1.3839, 0.3547]
```

처음에는 단순히 `love`라는 Token의 Embedding이었습니다.

Encoder 한 층을 지난 뒤에는 `I`, `love`, `AI`의 관계가 Attention을 통해 섞인 **문맥 벡터**가 됩니다.

## 왜 Multi-Head를 사용할까

Head 하나만 있으면 하나의 Attention 공간에서 관계를 계산합니다.

여러 Head를 사용하면 서로 다른 Projection 공간에서 관계를 계산할 수 있습니다.

```text
Head 1
→ Q1, K1, V1

Head 2
→ Q2, K2, V2

...
```

각 결과를 합칩니다.

$$H=\mathrm{Concat}(head_1,\dots,head_h)W_O$$

Head마다 사람이 미리

```text
문법 담당
의미 담당
```

처럼 역할을 정하는 것은 아닙니다.

학습 과정에서 서로 다른 관계를 포착할 수 있다는 뜻입니다.

## Attention과 FFN의 차이

두 연산의 역할을 구분해야 합니다.

```text
Self-Attention
→ Token과 Token 사이의 정보 교환

FFN
→ 각 Token 내부 Feature 변환
```

예를 들어 Attention은

```text
love가 AI를 얼마나 참고할까?
```

를 계산합니다.

FFN은 Attention이 끝난 `love` Vector 자체를 다시 변환합니다.

<mark>Attention은 Token 사이를 섞고, FFN은 각 Token을 따로 변환합니다.</mark>

## Add & Norm

Transformer 그림의 `Add & Norm`은 하나의 연산 이름이 아닙니다.

```text
Add
→ Residual Connection

Norm
→ Layer Normalization
```

Encoder 한 층에서는 두 번 등장합니다.

```text
Attention
↓
Add & Norm
↓
FFN
↓
Add & Norm
```

## Encoder의 Mask

Encoder에서도 Padding Mask를 사용할 수 있습니다.

```text
I love AI [PAD] [PAD]
```

`[PAD]`는 실제 문장 정보가 아니므로 Attention에서 무시합니다.

```text
실제 Token → Attention 가능
PAD Token  → 차단
```

반면 일반적인 Encoder는 **Causal Mask를 사용하지 않습니다.**

```text
I
love
AI
```

각 Token은 입력 전체를 볼 수 있습니다.

```text
I    → I, love, AI
love → I, love, AI
AI   → I, love, AI
```

## Encoder와 Decoder 비교

| 구분 | Encoder | Decoder |
| --- | --- | --- |
| Self-Attention | 양방향 | Causal |
| 미래 Token | 볼 수 있음 | 볼 수 없음 |
| 대표 Mask | Padding Mask | Causal Mask + Padding Mask |
| 대표 역할 | 입력 이해 | 다음 Token 생성 |
| 대표 모델 | BERT | GPT |

Encoder-Decoder Transformer에서는 Decoder가 Encoder Output을 참고하는 Cross-Attention도 사용합니다.

## BERT와 Encoder

BERT는 Transformer Encoder를 여러 층 쌓은 대표적인 Encoder-only 모델입니다.

```text
Input
↓
Encoder
↓
Encoder
↓
...
↓
Contextual Representation
```

BERT는 입력의 왼쪽과 오른쪽 문맥을 모두 참고할 수 있습니다.

예를 들어

```text
I went to the bank to deposit money.
```

와

```text
I sat on the river bank.
```

에서 같은 `bank` Token도 Encoder를 통과한 최종 Vector는 달라질 수 있습니다.

주변 문맥이 다르기 때문입니다.

## Encoder 출력 Shape

입력이

```text
Batch Size = B
Sequence Length = L
Hidden Dimension = d_model
```

이면 일반적으로 Encoder 출력도

```text
B × L × d_model
```

형태입니다.

Token 개수를 줄이는 구조가 아닙니다.

```text
Token 1 → Context Vector 1
Token 2 → Context Vector 2
Token 3 → Context Vector 3
```

## Self-Attention 계산 복잡도

Sequence Length가 `n`이면 Attention Score Matrix는

$$n\times n$$

입니다.

따라서 Sequence Length 기준 대표적인 계산 복잡도는

$$O(n^2)$$

입니다.

Sequence가 길어질수록 모든 Token Pair를 비교해야 하기 때문에 계산량과 메모리 사용량이 빠르게 증가합니다.

## 잘 놓치는 핵심

### 1. Q, K, V는 같은 입력에서 출발한다

Encoder Self-Attention에서는

```text
X → Q
X → K
X → V
```

입니다.

가중치 행렬만 서로 다릅니다.

### 2. Attention Weight와 Attention Output은 다르다

```text
Attention Weight
→ 누구를 얼마나 볼지

Attention Output
→ 그 비율로 Value를 섞은 결과
```

### 3. Multi-Head는 차원을 단순 복제하는 것이 아니다

각 Head가 서로 다른 Projection을 사용합니다.

### 4. Encoder는 일반적으로 미래 Token을 볼 수 있다

Decoder의 Causal Self-Attention과 혼동하면 안 됩니다.

### 5. FFN은 Token끼리 섞지 않는다

각 Token에 동일한 FFN을 독립적으로 적용합니다.

### 6. Encoder 출력은 Contextual Embedding이다

처음 Embedding보다 주변 Token의 정보가 반영된 표현입니다.

## 시험·면접

### 핵심 암기

```text
Embedding + Position
↓
Q, K, V
↓
Multi-Head Self-Attention
↓
Add & Norm
↓
FFN
↓
Add & Norm
```

### Q. Self-Attention의 핵심 수식은?

$$\mathrm{Attention}(Q,K,V)=\mathrm{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

### Q. 왜 루트 d_k로 나누는가?

Dimension이 커질수록 Dot Product 값이 커질 수 있습니다.

값이 너무 커지면 Softmax가 한쪽으로 지나치게 치우칠 수 있기 때문에 Scale합니다.

### Q. Multi-Head Attention을 사용하는 이유는?

여러 Projection 공간에서 Token 관계를 동시에 학습하기 위해서입니다.

### Q. Residual Connection의 목적은?

기존 표현을 유지하면서 Sublayer가 계산한 정보를 더하고, 깊은 Network의 학습을 안정화하는 데 도움을 줍니다.

### Q. Encoder에서 Causal Mask를 사용하는가?

일반적인 Transformer Encoder는 사용하지 않습니다.

입력 전체를 양방향으로 참고할 수 있습니다.

<blockquote class="prompt-danger">
<p>시험 함정: Attention Weight가 최종 Token Vector인 것은 아닙니다. Attention Weight를 Value에 곱해 가중합한 결과가 Attention Output입니다.</p>
</blockquote>

## 객관식 문제

### 1. Encoder Self-Attention에서 Q, K, V는 어디서 만들어지는가?

① 서로 다른 세 문장  
② 같은 입력 X  
③ Decoder Output  
④ Vocabulary

<details>
<summary>정답</summary>

②

</details>

### 2. Attention Weight를 얻기 직전에 적용하는 함수는?

① ReLU  
② Sigmoid  
③ Softmax  
④ Max Pooling

<details>
<summary>정답</summary>

③

</details>

### 3. FFN의 역할로 가장 적절한 것은?

① Token 사이 Attention 계산  
② 각 Token Feature의 비선형 변환  
③ Tokenization  
④ Padding 생성

<details>
<summary>정답</summary>

②

</details>

### 4. Add & Norm의 Add는 무엇인가?

① Token 추가  
② Residual Connection  
③ Vocabulary 추가  
④ Head 추가

<details>
<summary>정답</summary>

②

</details>

### 5. 일반적인 Encoder의 Self-Attention에 대한 설명으로 옳은 것은?

① 미래 Token을 반드시 가린다.  
② 현재 Token 하나만 본다.  
③ 입력 전체 Token을 참고할 수 있다.  
④ Attention을 사용하지 않는다.

<details>
<summary>정답</summary>

③

</details>

### 6. Self-Attention의 Sequence Length 기준 대표적 복잡도는?

① O(1)  
② O(log n)  
③ O(n)  
④ O(n²)

<details>
<summary>정답</summary>

④

</details>

## 마지막 정리

```text
I love AI
↓
Embedding + Position
↓
Q, K, V
↓
2개의 Attention Head
↓
Attention Weight × V
↓
Concat
↓
Residual + LayerNorm
↓
FFN
↓
Residual + LayerNorm
↓
문맥이 반영된 Token Vector
```

<mark>Transformer Encoder는 Self-Attention으로 Token 사이의 정보를 섞고, FFN으로 각 Token 표현을 변환하여 문맥이 반영된 Vector를 만듭니다.</mark>

## 다음에 이을 글

**Transformer Decoder**입니다.  
같은 방식으로 예시 Token과 임의의 Vector를 넣어 Causal Mask가 적용되기 전과 후의 Attention Matrix가 실제로 어떻게 달라지는지 Python으로 계산합니다.
