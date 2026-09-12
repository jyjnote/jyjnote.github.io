---
title: Transformer Encoder-Decoder
date: 2026-09-12 15:10:00 +0900
slug: transformer-encoder-decoder
permalink: /posts/transformer-encoder-decoder/
categories: [AI, 딥러닝]
tags: [Transformer, Encoder, Decoder, CrossAttention, Seq2Seq, T5]
math: true
---

Transformer Encoder-Decoder는 **Encoder가 입력 Sequence를 이해하고, Decoder가 그 정보를 참고해 출력 Sequence를 생성하는 구조**입니다.  
번역과 요약처럼 입력과 출력이 모두 Sequence인 문제에서 대표적으로 사용됩니다.

<blockquote class="prompt-info">
<p>한 줄: Encoder는 Source를 문맥 벡터로 만들고, Decoder는 Cross-Attention으로 그 벡터를 참고하면서 Target을 생성합니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

Encoder의 양방향 Self-Attention → Decoder의 Causal Self-Attention → Encoder와 Decoder를 연결하는 Cross-Attention → FFN → 다음 Token 예측 순서입니다.

</details>

## 전체 구조

```text
Source Sequence
↓
Encoder Self-Attention
↓
Encoder Output
          ↓
          └──────────────┐
                         ↓
Target Input → Causal Self-Attention
                         ↓
                  Cross-Attention
                         ↓
                        FFN
                         ↓
                  Vocabulary Logit
                         ↓
                      Softmax
                         ↓
                    Target Token
```

<mark>Encoder-Decoder 구조에서 가장 중요한 연결 지점은 Cross-Attention입니다.</mark>

## 이번 글에서 실제로 계산할 예시

번역 예시를 사용하겠습니다.

```text
Source
I love AI

Target
나는 AI를 좋아한다
```

학습 시 Decoder 입력과 정답을 한 칸씩 Shift하면 다음과 같습니다.

```text
Decoder Input
<BOS> 나는 AI를

Target
나는 AI를 좋아한다
```

즉 각 위치의 목표는

```text
<BOS>          → 나는
<BOS> 나는     → AI를
<BOS> 나는 AI를 → 좋아한다
```

입니다.

설명을 위해 아주 작은 Transformer를 사용합니다.

```text
Source Token 수 = 3
Target Token 수 = 3
Hidden Dimension = 4
Attention Head 수 = 2
Head Dimension = 2
```

실제 모델은 훨씬 크지만 계산 원리는 같습니다.

---

## 1. Encoder 입력

Source는 다음 문장입니다.

```text
I love AI
```

임의의 Embedding을 사용합니다.

```python
import numpy as np

np.set_printoptions(precision=4, suppress=True)

source_tokens = ["I", "love", "AI"]

E_src = np.array([
    [1.0, 0.0, 1.0, 0.0],  # I
    [0.0, 1.0, 0.0, 1.0],  # love
    [1.0, 1.0, 0.0, 0.0],  # AI
])

print(E_src)

# 결과
# [[1. 0. 1. 0.]
#  [0. 1. 0. 1.]
#  [1. 1. 0. 0.]]
```

위치 정보도 임의로 넣겠습니다.

```python
P_src = np.array([
    [0.1, 0.0, 0.1, 0.0],
    [0.0, 0.1, 0.0, 0.1],
    [0.1, 0.1, 0.0, 0.0],
])

X_src = E_src + P_src

print(X_src)

# 결과
# [[1.1 0.  1.1 0. ]
#  [0.  1.1 0.  1.1]
#  [1.1 1.1 0.  0. ]]
```

$$X=E+P$$

입니다.

---

## 2. Encoder의 Q, K, V

Self-Attention에서는 같은 입력 `X_src`에서 Q, K, V를 만듭니다.

$$Q=XW_Q$$

$$K=XW_K$$

$$V=XW_V$$

설명을 위해 다음 가중치를 사용합니다.

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

Q_src = X_src @ W_Q
K_src = X_src @ W_K
V_src = X_src @ W_V

print("Q")
print(Q_src)

# 결과
# [[1.1  0.   0.55 0.  ]
#  [0.   1.1  0.   0.55]
#  [1.1  1.1  0.   0.  ]]

print("K")
print(K_src)

# 결과
# [[0.55 0.   1.1  0.  ]
#  [0.   0.55 0.   1.1 ]
#  [0.55 0.55 0.   0.  ]]

print("V")
print(V_src)

# 결과
# [[1.65 0.   0.55 0.  ]
#  [0.   1.65 0.   0.55]
#  [1.1  1.1  0.   0.  ]]
```

---

## 3. Encoder Self-Attention

두 개의 Head로 나눕니다.

```python
num_heads = 2
head_dim = 2

Qh_src = Q_src.reshape(3, 2, 2).transpose(1, 0, 2)
Kh_src = K_src.reshape(3, 2, 2).transpose(1, 0, 2)
Vh_src = V_src.reshape(3, 2, 2).transpose(1, 0, 2)
```

Scaled Dot-Product Attention Score:

$$S=\frac{QK^T}{\sqrt{d_k}}$$

```python
src_scores = Qh_src @ Kh_src.transpose(0, 2, 1)
src_scores = src_scores / np.sqrt(head_dim)

print(src_scores[0])

# Head 1
# [[0.4278 0.     0.4278]
#  [0.     0.4278 0.4278]
#  [0.4278 0.4278 0.8556]]
```

Encoder에는 Causal Mask가 없습니다.

따라서 `I`도 `love`, `AI`를 모두 참고할 수 있습니다.

Softmax:

```python
def softmax(x):
    x = x - np.max(x, axis=-1, keepdims=True)
    exp_x = np.exp(x)
    return exp_x / np.sum(exp_x, axis=-1, keepdims=True)

src_weights = np.stack([
    softmax(src_scores[0]),
    softmax(src_scores[1]),
])

print("Head 1")
print(src_weights[0])

# 결과
# [[0.3771 0.2458 0.3771]
#  [0.2458 0.3771 0.3771]
#  [0.2830 0.2830 0.4340]]

print("Head 2")
print(src_weights[1])

# 결과
# [[0.4340 0.2830 0.2830]
#  [0.2830 0.4340 0.2830]
#  [0.3333 0.3333 0.3333]]
```

예를 들어 Head 1에서 `love`는

```text
I     → 0.2458
love  → 0.3771
AI    → 0.3771
```

만큼 참고합니다.

## 4. Encoder Attention Output

```python
src_head_output = src_weights @ Vh_src

src_mha = (
    src_head_output
    .transpose(1, 0, 2)
    .reshape(3, 4)
)

print(src_mha)

# 결과
# [[1.0370 0.8204 0.2387 0.1556]
#  [0.8204 1.0370 0.1556 0.2387]
#  [0.9444 0.9444 0.1833 0.1833]]
```

이 값에는 다른 Source Token들의 정보가 섞여 있습니다.

---

## 5. Encoder Add & Norm

Residual Connection을 적용합니다.

```python
def layer_norm(x, eps=1e-5):
    mean = x.mean(axis=-1, keepdims=True)
    var = ((x - mean) ** 2).mean(axis=-1, keepdims=True)
    return (x - mean) / np.sqrt(var + eps)

src_residual1 = X_src + src_mha
src_norm1 = layer_norm(src_residual1)

print(src_norm1)

# 결과
# [[ 1.4127 -0.4036  0.3115 -1.3207]
#  [-0.4036  1.4127 -1.3207  0.3115]
#  [ 1.0000  1.0000 -1.0000 -1.0000]]
```

---

## 6. Encoder FFN

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

src_hidden = src_norm1 @ W1 + b1
src_relu = np.maximum(src_hidden, 0)
src_ffn = src_relu @ W2 + b2

print(src_ffn)

# 결과
# [[ 0.7527  0.0246  0.1894 -0.0801]
#  [ 0.1661  0.5027 -0.2579  0.3239]
#  [ 0.5500  0.3200 -0.1200  0.2400]]
```

두 번째 Add & Norm:

```python
encoder_output = layer_norm(src_norm1 + src_ffn)

print(encoder_output)

# 결과
# [[ 1.4854 -0.4590  0.2134 -1.2399]
#  [-0.3307  1.3600 -1.3839  0.3547]
#  [ 1.0881  0.8959 -1.1424 -0.8416]]
```

Source Token별로 보면

```text
I
→ [ 1.4854, -0.4590,  0.2134, -1.2399]

love
→ [-0.3307,  1.3600, -1.3839,  0.3547]

AI
→ [ 1.0881,  0.8959, -1.1424, -0.8416]
```

입니다.

<mark>이 3개의 Vector 전체가 Decoder Cross-Attention의 Key와 Value가 됩니다.</mark>

---

# Decoder

## 7. Decoder 입력

학습할 Target은

```text
나는 AI를 좋아한다
```

입니다.

Decoder에는 정답을 한 칸 오른쪽으로 Shift해서 넣습니다.

```text
Decoder Input
<BOS> 나는 AI를

정답
나는 AI를 좋아한다
```

임의 Embedding:

```python
target_tokens = ["<BOS>", "나는", "AI를"]

E_tgt = np.array([
    [1.0, 0.0, 0.0, 1.0],  # <BOS>
    [0.0, 1.0, 1.0, 0.0],  # 나는
    [1.0, 1.0, 0.0, 0.0],  # AI를
])

P_tgt = np.array([
    [0.1, 0.0, 0.1, 0.0],
    [0.0, 0.1, 0.0, 0.1],
    [0.1, 0.1, 0.0, 0.0],
])

X_tgt = E_tgt + P_tgt

print(X_tgt)

# 결과
# [[1.1 0.  0.1 1. ]
#  [0.  1.1 1.  0.1]
#  [1.1 1.1 0.  0. ]]
```

---

## 8. Decoder Q, K, V

Decoder Self-Attention도 같은 입력에서 Q, K, V를 만듭니다.

```python
Q_tgt = X_tgt @ W_Q
K_tgt = X_tgt @ W_K
V_tgt = X_tgt @ W_V

print("Q")
print(Q_tgt)

# 결과
# [[1.1  0.   0.05 0.5 ]
#  [0.   1.1  0.5  0.05]
#  [1.1  1.1  0.   0.  ]]

print("K")
print(K_tgt)

# 결과
# [[0.55 0.   0.1  1.  ]
#  [0.   0.55 1.   0.1 ]
#  [0.55 0.55 0.   0.  ]]

print("V")
print(V_tgt)

# 결과
# [[1.15 0.5  0.05 0.5 ]
#  [0.5  1.15 0.5  0.05]
#  [1.1  1.1  0.   0.  ]]
```

---

## 9. Causal Self-Attention

두 Head로 나눕니다.

```python
Qh_tgt = Q_tgt.reshape(3, 2, 2).transpose(1, 0, 2)
Kh_tgt = K_tgt.reshape(3, 2, 2).transpose(1, 0, 2)
Vh_tgt = V_tgt.reshape(3, 2, 2).transpose(1, 0, 2)

tgt_scores = Qh_tgt @ Kh_tgt.transpose(0, 2, 1)
tgt_scores = tgt_scores / np.sqrt(2)
```

Mask 적용 전 Head 1:

```python
print(tgt_scores[0])

# 결과
# [[0.4278 0.     0.4278]
#  [0.     0.4278 0.4278]
#  [0.4278 0.4278 0.8556]]
```

이 상태에서는 `<BOS>`도 미래 `나는`, `AI를`을 볼 수 있습니다.

그래서 Causal Mask를 넣습니다.

```python
causal_mask = np.array([
    [0.0,   -np.inf, -np.inf],
    [0.0,    0.0,    -np.inf],
    [0.0,    0.0,     0.0],
])

masked_scores = tgt_scores + causal_mask

print(masked_scores[0])

# Head 1
# [[0.4278   -inf   -inf]
#  [0.     0.4278   -inf]
#  [0.4278 0.4278 0.8556]]
```

Softmax:

```python
tgt_weights = np.stack([
    softmax(masked_scores[0]),
    softmax(masked_scores[1]),
])

print("Head 1")
print(tgt_weights[0])

# 결과
# [[1.0000 0.0000 0.0000]
#  [0.3947 0.6053 0.0000]
#  [0.2830 0.2830 0.4340]]

print("Head 2")
print(tgt_weights[1])

# 결과
# [[1.0000 0.0000 0.0000]
#  [0.4289 0.5711 0.0000]
#  [0.3333 0.3333 0.3333]]
```

두 번째 위치인 `나는`을 보면

```text
<BOS> → 0.3947
나는  → 0.6053
AI를  → 0.0000
```

입니다.

아직 미래인 `AI를`을 전혀 보지 못합니다.

<mark>Decoder Self-Attention에서 미래 Token은 Softmax 이후 Weight가 0이 됩니다.</mark>

---

## 10. Decoder Self-Attention Output

```python
tgt_head_output = tgt_weights @ Vh_tgt

tgt_mha = (
    tgt_head_output
    .transpose(1, 0, 2)
    .reshape(3, 4)
)

print(tgt_mha)

# 결과
# [[1.1500 0.5000 0.0500 0.5000]
#  [0.7565 0.8935 0.3070 0.2430]
#  [0.9444 0.9444 0.1833 0.1833]]
```

Add & Norm:

```python
tgt_residual1 = X_tgt + tgt_mha
tgt_norm1 = layer_norm(tgt_residual1)

print(tgt_norm1)

# 결과
# [[ 1.3882 -0.7243 -1.1468  0.4829]
#  [-0.5550  1.4436  0.3345 -1.2231]
#  [ 1.0000  1.0000 -1.0000 -1.0000]]
```

여기까지는 Target 문장 내부에서 **과거 Token끼리만** 정보를 섞은 상태입니다.

아직 `I love AI`의 Encoder 정보는 들어오지 않았습니다.

---

# Cross-Attention

## 11. Q는 Decoder, K와 V는 Encoder

Cross-Attention에서 가장 중요한 부분입니다.

```text
Q → Decoder
K → Encoder
V → Encoder
```

수식으로는

$$Q=D W_Q$$

$$K=H W_K$$

$$V=H W_V$$

입니다.

- `D`: Decoder의 현재 표현
- `H`: Encoder Output

Python:

```python
Q_cross = tgt_norm1 @ W_Q
K_cross = encoder_output @ W_K
V_cross = encoder_output @ W_V

print("Q from Decoder")
print(Q_cross)

# 결과
# [[ 1.3882 -0.7243 -0.5734  0.2414]
#  [-0.5550  1.4436  0.1672 -0.6116]
#  [ 1.0000  1.0000 -0.5000 -0.5000]]

print("K from Encoder")
print(K_cross)

# 결과
# [[ 0.7427 -0.2295  0.2134 -1.2399]
#  [-0.1653  0.6800 -1.3839  0.3547]
#  [ 0.5441  0.4480 -1.1424 -0.8416]]
```

<blockquote class="prompt-info">
<p>Self-Attention은 Q·K·V가 같은 Sequence에서 오지만, Cross-Attention은 Q와 K·V의 출처가 다릅니다.</p>
</blockquote>

---

## 12. Cross-Attention Score

Cross-Attention도 2개의 Head로 계산합니다.

```python
Qh_cross = Q_cross.reshape(3, 2, 2).transpose(1, 0, 2)
Kh_cross = K_cross.reshape(3, 2, 2).transpose(1, 0, 2)
Vh_cross = V_cross.reshape(3, 2, 2).transpose(1, 0, 2)

cross_scores = Qh_cross @ Kh_cross.transpose(0, 2, 1)
cross_scores = cross_scores / np.sqrt(2)

print("Head 1")
print(cross_scores[0])

# 결과
# [[ 0.8466 -0.5106  0.3046]
#  [-0.5257  0.7590  0.2438]
#  [ 0.3629  0.3639  0.7014]]

print("Head 2")
print(cross_scores[1])

# 결과
# [[-0.2982  0.6217  0.3195]
#  [ 0.5614 -0.3170  0.2289]
#  [ 0.3629  0.3639  0.7014]]
```

Cross-Attention에는 미래 Source라는 개념이 없습니다.

Decoder가 Source 전체를 참고해도 됩니다.

따라서 여기서는 Causal Mask를 적용하지 않습니다.

---

## 13. Cross-Attention Weight

```python
cross_weights = np.stack([
    softmax(cross_scores[0]),
    softmax(cross_scores[1]),
])

print("Head 1")
print(cross_weights[0])

# 결과
# [[0.5438 0.1400 0.3163]
#  [0.1477 0.5336 0.3188]
#  [0.2938 0.2941 0.4121]]

print("Head 2")
print(cross_weights[1])

# 결과
# [[0.1864 0.4678 0.3458]
#  [0.4689 0.1948 0.3363]
#  [0.2938 0.2941 0.4121]]
```

행은 Target Token이고 열은 Source Token입니다.

```text
열 1 → I
열 2 → love
열 3 → AI
```

Head 1의 두 번째 Target 위치를 보면

```text
I     → 0.1477
love  → 0.5336
AI    → 0.3188
```

입니다.

즉 현재 Decoder 표현이 Source의 `love` 정보를 가장 많이 가져옵니다.

세 번째 Target 위치는

```text
I     → 0.2938
love  → 0.2941
AI    → 0.4121
```

로 이 예시에서는 `AI`를 가장 많이 참고합니다.

<mark>Cross-Attention Weight는 Decoder의 각 위치가 Source의 어떤 Token을 얼마나 참고할지 나타냅니다.</mark>

---

## 14. Cross-Attention Output

```python
cross_head_output = cross_weights @ Vh_cross

cross_mha = (
    cross_head_output
    .transpose(1, 0, 2)
    .reshape(3, 4)
)

print(cross_mha)

# 결과
# [[ 0.8861 -0.2213 -0.5013 -0.1781]
#  [-0.1459  0.8124 -0.2768 -0.3977]
#  [ 0.3800  0.3309 -0.4076 -0.3034]]
```

Decoder 표현에 Encoder 정보를 더합니다.

```python
cross_residual = tgt_norm1 + cross_mha
cross_norm = layer_norm(cross_residual)

print(cross_norm)

# 결과
# [[ 1.5292 -0.6323 -1.1039  0.2070]
#  [-0.4878  1.5760  0.0416 -1.1298]
#  [ 1.0176  0.9814 -1.0379 -0.9611]]
```

이제 Decoder Vector에는

```text
Target의 과거 문맥
+
Source 문장의 정보
```

가 모두 들어 있습니다.

---

## 15. Decoder FFN

```python
dec_hidden = cross_norm @ W1 + b1
dec_relu = np.maximum(dec_hidden, 0)
dec_ffn = dec_relu @ W2 + b2

print(dec_ffn)

# 결과
# [[ 0.2015  0.3687 -0.1368  0.2095]
#  [ 0.4244  0.1501  0.1600  0.1687]
#  [ 0.5328  0.3360 -0.1300  0.2467]]
```

마지막 Add & Norm:

```python
decoder_output = layer_norm(cross_norm + dec_ffn)

print(decoder_output)

# 결과
# [[ 1.4523 -0.3926 -1.2964  0.2366]
#  [-0.2989  1.5508 -0.0251 -1.2268]
#  [ 1.0857  0.8917 -1.1774 -0.7999]]
```

각 Decoder 위치의 최종 Hidden State입니다.

```text
<BOS>
→ [ 1.4523, -0.3926, -1.2964,  0.2366]

나는
→ [-0.2989,  1.5508, -0.0251, -1.2268]

AI를
→ [ 1.0857,  0.8917, -1.1774, -0.7999]
```

---

# 다음 Token 예측

## 16. Vocabulary Projection

Hidden State는 아직 단어가 아닙니다.

Vocabulary 크기로 Projection합니다.

설명을 위해 Vocabulary를 5개만 사용합니다.

```text
0 → 나는
1 → AI를
2 → 좋아한다
3 → <EOS>
4 → 기타
```

설명용 Projection Matrix를 사용합니다.

```python
vocab = ["나는", "AI를", "좋아한다", "<EOS>", "기타"]

W_vocab = np.array([
    [ 1.4523, -0.2989,  1.0857,  0.0, -0.5],
    [-0.3926,  1.5508,  0.8917,  0.0, -0.5],
    [-1.2964, -0.0251, -1.1774,  0.0, -0.5],
    [ 0.2366, -1.2268, -0.7999,  0.0, -0.5],
])

logits = decoder_output @ W_vocab

print(logits)

# 결과
# [[ 4.0000 -1.3007  2.5638  0.0000  0.0000]
#  [-1.3007  4.0000  2.0691  0.0000  0.0000]
#  [ 2.5638  2.0691  4.0000  0.0000 -0.0000]]
```

이 값은 Softmax 전 **Logit**입니다.

실제 모델에서는 `W_vocab`도 학습되는 Parameter입니다.

---

## 17. 각 위치의 Token 확률

```python
probs = np.stack([
    softmax(logits[0]),
    softmax(logits[1]),
    softmax(logits[2]),
])

print(probs)

# 결과
# [[0.7816 0.0039 0.1859 0.0143 0.0143]
#  [0.0042 0.8427 0.1222 0.0154 0.0154]
#  [0.1676 0.1022 0.7045 0.0129 0.0129]]
```

### 위치 1

Decoder 입력:

```text
<BOS>
```

예측:

```text
나는      0.7816
AI를      0.0039
좋아한다  0.1859
<EOS>     0.0143
기타      0.0143
```

가장 높은 Token:

```text
나는
```

### 위치 2

Decoder 입력:

```text
<BOS> 나는
```

예측:

```text
나는      0.0042
AI를      0.8427
좋아한다  0.1222
<EOS>     0.0154
기타      0.0154
```

가장 높은 Token:

```text
AI를
```

### 위치 3

Decoder 입력:

```text
<BOS> 나는 AI를
```

예측:

```text
나는      0.1676
AI를      0.1022
좋아한다  0.7045
<EOS>     0.0129
기타      0.0129
```

가장 높은 Token:

```text
좋아한다
```

따라서 이번 예시는

```text
<BOS>
→ 나는
→ AI를
→ 좋아한다
```

순서로 이어집니다.

---

## 숫자로 전체 흐름 한 번에 보기

두 번째 Target 위치인 `나는`을 따라가겠습니다.

목표는 다음 Token `AI를`을 예측하는 것입니다.

```text
Decoder Input Embedding
나는
[0.0000, 1.0000, 1.0000, 0.0000]

위치 정보 추가
[0.0000, 1.1000, 1.0000, 0.1000]
```

Causal Self-Attention Head 1:

```text
<BOS> → 0.3947
나는  → 0.6053
AI를  → 0.0000
```

아직 미래인 `AI를`은 볼 수 없습니다.

Self-Attention 이후:

```text
[-0.5550, 1.4436, 0.3345, -1.2231]
```

Cross-Attention Head 1:

```text
Source I     → 0.1477
Source love  → 0.5336
Source AI    → 0.3188
```

Encoder 정보를 결합한 뒤:

```text
[-0.4878, 1.5760, 0.0416, -1.1298]
```

FFN까지 지난 최종 Hidden State:

```text
[-0.2989, 1.5508, -0.0251, -1.2268]
```

Vocabulary Softmax:

```text
나는      0.0042
AI를      0.8427
좋아한다  0.1222
<EOS>     0.0154
기타      0.0154
```

따라서 다음 Token:

```text
AI를
```

<mark>Decoder는 Target의 과거 Token을 Causal Self-Attention으로 보고, Source 정보는 Cross-Attention으로 따로 가져옵니다.</mark>

---

## 전체 실행 코드

아래 코드 하나로 위 계산을 전부 재현할 수 있습니다.

```python
import numpy as np

np.set_printoptions(precision=4, suppress=True)

def softmax(x):
    x = x - np.max(x, axis=-1, keepdims=True)
    exp_x = np.exp(x)
    return exp_x / np.sum(exp_x, axis=-1, keepdims=True)

def layer_norm(x, eps=1e-5):
    mean = x.mean(axis=-1, keepdims=True)
    var = ((x - mean) ** 2).mean(axis=-1, keepdims=True)
    return (x - mean) / np.sqrt(var + eps)

# --------------------------------------------------
# 공통 Projection
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

# ==================================================
# ENCODER
# ==================================================

E_src = np.array([
    [1.0, 0.0, 1.0, 0.0],  # I
    [0.0, 1.0, 0.0, 1.0],  # love
    [1.0, 1.0, 0.0, 0.0],  # AI
])

P_src = np.array([
    [0.1, 0.0, 0.1, 0.0],
    [0.0, 0.1, 0.0, 0.1],
    [0.1, 0.1, 0.0, 0.0],
])

X_src = E_src + P_src

Q_src = X_src @ W_Q
K_src = X_src @ W_K
V_src = X_src @ W_V

Qh_src = Q_src.reshape(3, 2, 2).transpose(1, 0, 2)
Kh_src = K_src.reshape(3, 2, 2).transpose(1, 0, 2)
Vh_src = V_src.reshape(3, 2, 2).transpose(1, 0, 2)

src_scores = Qh_src @ Kh_src.transpose(0, 2, 1)
src_scores = src_scores / np.sqrt(2)

src_weights = np.stack([
    softmax(src_scores[0]),
    softmax(src_scores[1]),
])

src_head_output = src_weights @ Vh_src

src_mha = (
    src_head_output
    .transpose(1, 0, 2)
    .reshape(3, 4)
)

src_norm1 = layer_norm(X_src + src_mha)

src_hidden = src_norm1 @ W1 + b1
src_relu = np.maximum(src_hidden, 0)
src_ffn = src_relu @ W2 + b2

encoder_output = layer_norm(src_norm1 + src_ffn)

print("Encoder Output")
print(encoder_output)

# [[ 1.4854 -0.4590  0.2134 -1.2399]
#  [-0.3307  1.3600 -1.3839  0.3547]
#  [ 1.0881  0.8959 -1.1424 -0.8416]]

# ==================================================
# DECODER CAUSAL SELF-ATTENTION
# ==================================================

E_tgt = np.array([
    [1.0, 0.0, 0.0, 1.0],  # <BOS>
    [0.0, 1.0, 1.0, 0.0],  # 나는
    [1.0, 1.0, 0.0, 0.0],  # AI를
])

P_tgt = np.array([
    [0.1, 0.0, 0.1, 0.0],
    [0.0, 0.1, 0.0, 0.1],
    [0.1, 0.1, 0.0, 0.0],
])

X_tgt = E_tgt + P_tgt

Q_tgt = X_tgt @ W_Q
K_tgt = X_tgt @ W_K
V_tgt = X_tgt @ W_V

Qh_tgt = Q_tgt.reshape(3, 2, 2).transpose(1, 0, 2)
Kh_tgt = K_tgt.reshape(3, 2, 2).transpose(1, 0, 2)
Vh_tgt = V_tgt.reshape(3, 2, 2).transpose(1, 0, 2)

tgt_scores = Qh_tgt @ Kh_tgt.transpose(0, 2, 1)
tgt_scores = tgt_scores / np.sqrt(2)

causal_mask = np.array([
    [0.0,   -np.inf, -np.inf],
    [0.0,    0.0,    -np.inf],
    [0.0,    0.0,     0.0],
])

masked_scores = tgt_scores + causal_mask

tgt_weights = np.stack([
    softmax(masked_scores[0]),
    softmax(masked_scores[1]),
])

# Head 1
# [[1.0000 0.0000 0.0000]
#  [0.3947 0.6053 0.0000]
#  [0.2830 0.2830 0.4340]]

tgt_head_output = tgt_weights @ Vh_tgt

tgt_mha = (
    tgt_head_output
    .transpose(1, 0, 2)
    .reshape(3, 4)
)

tgt_norm1 = layer_norm(X_tgt + tgt_mha)

# ==================================================
# CROSS-ATTENTION
# ==================================================

Q_cross = tgt_norm1 @ W_Q
K_cross = encoder_output @ W_K
V_cross = encoder_output @ W_V

Qh_cross = Q_cross.reshape(3, 2, 2).transpose(1, 0, 2)
Kh_cross = K_cross.reshape(3, 2, 2).transpose(1, 0, 2)
Vh_cross = V_cross.reshape(3, 2, 2).transpose(1, 0, 2)

cross_scores = Qh_cross @ Kh_cross.transpose(0, 2, 1)
cross_scores = cross_scores / np.sqrt(2)

cross_weights = np.stack([
    softmax(cross_scores[0]),
    softmax(cross_scores[1]),
])

# Head 1
# [[0.5438 0.1400 0.3163]
#  [0.1477 0.5336 0.3188]
#  [0.2938 0.2941 0.4121]]

cross_head_output = cross_weights @ Vh_cross

cross_mha = (
    cross_head_output
    .transpose(1, 0, 2)
    .reshape(3, 4)
)

cross_norm = layer_norm(tgt_norm1 + cross_mha)

# ==================================================
# DECODER FFN
# ==================================================

dec_hidden = cross_norm @ W1 + b1
dec_relu = np.maximum(dec_hidden, 0)
dec_ffn = dec_relu @ W2 + b2

decoder_output = layer_norm(cross_norm + dec_ffn)

print("Decoder Output")
print(decoder_output)

# [[ 1.4523 -0.3926 -1.2964  0.2366]
#  [-0.2989  1.5508 -0.0251 -1.2268]
#  [ 1.0857  0.8917 -1.1774 -0.7999]]

# ==================================================
# VOCABULARY PROJECTION
# ==================================================

vocab = ["나는", "AI를", "좋아한다", "<EOS>", "기타"]

W_vocab = np.array([
    [ 1.4523, -0.2989,  1.0857,  0.0, -0.5],
    [-0.3926,  1.5508,  0.8917,  0.0, -0.5],
    [-1.2964, -0.0251, -1.1774,  0.0, -0.5],
    [ 0.2366, -1.2268, -0.7999,  0.0, -0.5],
])

logits = decoder_output @ W_vocab

probs = np.stack([
    softmax(logits[0]),
    softmax(logits[1]),
    softmax(logits[2]),
])

print("Probability")
print(probs)

# [[0.7816 0.0039 0.1859 0.0143 0.0143]
#  [0.0042 0.8427 0.1222 0.0154 0.0154]
#  [0.1676 0.1022 0.7045 0.0129 0.0129]]
```

---

## Training에서는 세 위치를 동시에 계산한다

지금 계산에서는 Decoder 입력을 한 번에 넣었습니다.

```text
<BOS> 나는 AI를
```

그런데 각 위치는 Causal Mask 때문에 볼 수 있는 범위가 다릅니다.

```text
위치 1
<BOS>
→ 나는 예측

위치 2
<BOS> 나는
→ AI를 예측

위치 3
<BOS> 나는 AI를
→ 좋아한다 예측
```

따라서 Training에서는 세 위치의 Loss를 한 번에 계산할 수 있습니다.

이것이 **Teacher Forcing + Causal Mask**의 핵심입니다.

---

## Inference에서는 하나씩 생성한다

실제 번역 시 정답은 없습니다.

따라서 다음처럼 진행합니다.

```text
Encoder:
I love AI
→ Encoder Output 저장
```

Decoder:

```text
<BOS>
→ 나는
```

다시 입력:

```text
<BOS> 나는
→ AI를
```

다시 입력:

```text
<BOS> 나는 AI를
→ 좋아한다
```

다음:

```text
<BOS> 나는 AI를 좋아한다
→ <EOS>
```

Encoder Output은 Source 문장이 바뀌지 않는 한 계속 재사용할 수 있습니다.

---

## Encoder Self-Attention과 Decoder Self-Attention 차이

Encoder:

```text
I
→ I, love, AI 모두 볼 수 있음
```

Decoder:

```text
<BOS>
→ <BOS>만

나는
→ <BOS>, 나는

AI를
→ <BOS>, 나는, AI를
```

| 구분 | Encoder | Decoder |
| --- | --- | --- |
| Self-Attention | 양방향 | Causal |
| 미래 위치 | 참고 가능 | 참고 불가 |
| 대표 Mask | Padding Mask | Causal Mask |
| 역할 | Source 이해 | Target 생성 |

---

## Self-Attention과 Cross-Attention 차이

### Decoder Self-Attention

```text
Q → Decoder
K → Decoder
V → Decoder
```

목적:

```text
이전 Target Token 참고
```

### Cross-Attention

```text
Q → Decoder
K → Encoder
V → Encoder
```

목적:

```text
Source 문장 참고
```

| Attention | Q | K | V | Causal Mask |
| --- | --- | --- | --- | --- |
| Encoder Self-Attention | Encoder | Encoder | Encoder | X |
| Decoder Self-Attention | Decoder | Decoder | Decoder | O |
| Cross-Attention | Decoder | Encoder | Encoder | X |

<mark>Cross-Attention만 Q의 출처와 K·V의 출처가 다릅니다.</mark>

---

## BERT, GPT, T5 비교

### BERT

```text
Encoder-only
```

입력 전체를 이해하는 데 강합니다.

```text
분류
NER
Embedding
```

### GPT

```text
Decoder-only
```

Causal Self-Attention으로 다음 Token을 생성합니다.

일반적인 GPT에는 Encoder가 없으므로 Cross-Attention도 없습니다.

### T5

```text
Encoder
+
Decoder
```

Encoder가 입력을 이해하고 Decoder가 Cross-Attention으로 입력을 참고하면서 결과를 생성합니다.

| 구조 | 대표 모델 | 핵심 |
| --- | --- | --- |
| Encoder-only | BERT | 입력 이해 |
| Decoder-only | GPT | Autoregressive 생성 |
| Encoder-Decoder | T5 | 입력 이해 + 출력 생성 |

---

## 잘 놓치는 핵심

### 1. Encoder Output은 하나의 Vector가 아니다

Source Token마다 하나씩 나옵니다.

```text
I     → h1
love  → h2
AI    → h3
```

Decoder는 Cross-Attention으로 이 전체를 봅니다.

### 2. Cross-Attention에서 Q는 Decoder다

```text
Q → Decoder
K → Encoder
V → Encoder
```

이것을 가장 많이 헷갈립니다.

### 3. Decoder는 Source 전체를 볼 수 있다

Decoder가 Target의 미래를 볼 수 없는 것이지, Encoder의 Source 미래를 가리는 것은 아닙니다.

```text
Target 미래
→ Causal Mask

Source 전체
→ Cross-Attention 가능
```

### 4. Causal Mask는 Decoder Self-Attention에 적용한다

Cross-Attention에 똑같은 삼각형 Mask를 적용하는 것이 아닙니다.

### 5. Training과 Inference는 다르다

Training:

```text
정답 Target 전체
+
Causal Mask
→ 병렬 계산
```

Inference:

```text
하나 생성
→ 다시 입력
→ 하나 생성
```

### 6. Encoder-Decoder와 GPT는 구조가 다르다

GPT는 Decoder-only이므로 일반적으로 Cross-Attention이 없습니다.

---

## 시험·면접

### 핵심 암기

```text
Encoder
→ Source 전체 이해

Decoder Self-Attention
→ 이전 Target만 참고

Cross-Attention
→ Decoder가 Encoder 정보 참고

FFN
→ 각 Token Feature 변환

Vocabulary Projection
→ 다음 Token 확률
```

### Q. Cross-Attention에서 Q, K, V는 어디서 오는가?

```text
Q → Decoder
K → Encoder
V → Encoder
```

### Q. Decoder Self-Attention에서 Causal Mask를 사용하는 이유는?

미래 Target Token을 미리 보지 못하게 하기 위해서입니다.

### Q. Cross-Attention에도 Causal Mask를 사용하는가?

일반적인 Encoder-Decoder 구조에서는 Source 전체를 참고할 수 있으므로 Decoder Self-Attention과 같은 Causal Mask를 사용하지 않습니다.

### Q. Encoder Output은 무엇인가?

Source의 각 Token에 대해 문맥이 반영된 Contextual Vector가 나온 행렬입니다.

### Q. Training에서 Decoder 계산을 병렬화할 수 있는 이유는?

정답 Target 전체를 입력하되 Causal Mask로 미래 정보를 차단할 수 있기 때문입니다.

<blockquote class="prompt-danger">
<p>시험 함정: Decoder가 미래 Target을 볼 수 없다는 말과 Encoder Source 전체를 볼 수 없다는 말을 혼동하면 안 됩니다. Cross-Attention에서는 Source 전체를 참고할 수 있습니다.</p>
</blockquote>

---

## 객관식 문제

### 1. Cross-Attention의 Query는 어디에서 오는가?

① Encoder  
② Decoder  
③ Tokenizer  
④ Vocabulary

<details>
<summary>정답</summary>

②

</details>

### 2. Cross-Attention의 Key와 Value는 어디에서 오는가?

① Decoder  
② Encoder Output  
③ Positional Encoding  
④ Softmax

<details>
<summary>정답</summary>

②

</details>

### 3. Decoder Self-Attention에서 Causal Mask의 목적은?

① Source Token 삭제  
② 미래 Target Token 차단  
③ Encoder Output 정규화  
④ Vocabulary 축소

<details>
<summary>정답</summary>

②

</details>

### 4. 다음 중 Encoder-Decoder 모델은?

① BERT  
② GPT  
③ T5  
④ Word2Vec

<details>
<summary>정답</summary>

③

</details>

### 5. Training에서 Decoder Input과 Target의 관계는?

① 완전히 동일한 위치에서 같은 Token을 예측한다.  
② Target을 한 칸 Shift해서 다음 Token을 예측한다.  
③ Target을 역순으로 입력한다.  
④ Encoder Input을 그대로 사용한다.

<details>
<summary>정답</summary>

②

</details>

### 6. 다음 중 옳은 것은?

① Cross-Attention의 Q, K, V는 모두 Encoder에서 온다.  
② Decoder Self-Attention은 미래 Token을 볼 수 있다.  
③ Encoder Self-Attention은 일반적으로 입력 전체를 볼 수 있다.  
④ GPT는 반드시 Encoder를 사용한다.

<details>
<summary>정답</summary>

③

</details>

---

## 마지막 정리

이번 계산을 한 줄로 연결하면 다음과 같습니다.

```text
I love AI
↓
Encoder Self-Attention
↓
Encoder Output
↓
K, V
↓
────────────────────────────
                  ↑
<BOS> 나는 AI를
↓
Causal Self-Attention
↓
Decoder Query
↓
Cross-Attention
↓
Source 정보 결합
↓
FFN
↓
Vocabulary Logit
↓
Softmax
↓
나는 / AI를 / 좋아한다
```

핵심은 다음 세 문장입니다.

```text
Encoder
→ Source 전체를 이해한다.

Decoder Self-Attention
→ Target의 과거만 본다.

Cross-Attention
→ Decoder가 Encoder의 Source 정보를 가져온다.
```

<mark>Transformer Encoder-Decoder는 Encoder가 만든 Source 문맥 표현을 Decoder가 Cross-Attention으로 가져오면서 Target Token을 순차적으로 생성하는 구조입니다.</mark>

## 다음에 이을 글

**Cross-Attention**입니다.  
Q가 Decoder에서 오고 K·V가 Encoder에서 오는 이유와 `Target Length × Source Length` Attention Matrix가 어떻게 만들어지는지 더 작은 숫자로 손계산합니다.
