---
title: Transformer Encoder
date: 2026-09-12 14:40:00 +0900
slug: transformer-encoder
permalink: /posts/transformer-encoder/
categories: [AI, 딥러닝]
tags: [Transformer, Encoder, SelfAttention, MultiHeadAttention, BERT, LLM]
math: true
---

Transformer Encoder는 **입력 Sequence 전체를 서로 비교하면서 각 Token의 문맥 표현을 만드는 구조**입니다.  
핵심은 Self-Attention과 Feed Forward Network를 반복해서 적용하는 것입니다.

<blockquote class="prompt-info">
<p>한 줄: Encoder는 모든 입력 Token이 서로를 참고하게 만들어, 각 Token을 문맥이 반영된 벡터로 바꿉니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

Transformer Encoder는 Multi-Head Self-Attention과 Feed Forward Network를 Residual Connection과 Layer Normalization으로 감싼 블록을 여러 층 쌓은 구조입니다.

</details>

## 전체 구조

Transformer Encoder의 한 층은 크게 두 부분으로 나뉩니다.

```text
입력
↓
Multi-Head Self-Attention
↓
Add & Norm
↓
Feed Forward Network
↓
Add & Norm
↓
출력
```

이 Encoder Layer를 여러 번 반복합니다.

```text
Input
↓
Encoder Layer 1
↓
Encoder Layer 2
↓
Encoder Layer 3
↓
...
↓
Encoder Layer N
```

<mark>Encoder는 입력 Token 각각을 독립적으로 보는 것이 아니라, Sequence 전체의 관계를 반영해 새로운 표현으로 바꿉니다.</mark>

## Encoder의 입력

문장이 들어오면 먼저 Tokenizer를 거칩니다.

```text
I love AI
↓
["I", "love", "AI"]
↓
Token ID
```

Token ID는 Embedding Vector로 변환됩니다.

```text
Token ID
→ Embedding
```

각 Token은 보통 다음과 같은 벡터가 됩니다.

```text
I     → [ ... ]
love  → [ ... ]
AI    → [ ... ]
```

하지만 Embedding만 사용하면 Token의 순서를 알 수 없습니다.

그래서 위치 정보를 추가합니다.

```text
Input Embedding
+
Positional Encoding
```

최종 Encoder 입력은 다음처럼 생각할 수 있습니다.

$$X=E+P$$

- `E`: Token Embedding
- `P`: Positional Encoding
- `X`: Encoder에 들어가는 입력 표현

## 왜 위치 정보가 필요한가

Self-Attention 자체는 순서 개념을 자동으로 알지 못합니다.

예를 들어

```text
I love AI
```

와

```text
AI love I
```

는 Token 구성은 같지만 순서는 다릅니다.

그래서 위치 정보를 Embedding에 더합니다.

<blockquote class="prompt-info">
<p>Transformer에는 RNN처럼 순차적으로 정보를 전달하는 구조가 없기 때문에 위치 정보를 별도로 넣어야 합니다.</p>
</blockquote>

## Encoder Layer의 핵심

Encoder Layer는 다음 구조를 가집니다.

```text
X
↓
Multi-Head Self-Attention
↓
Residual Connection
↓
Layer Normalization
↓
Feed Forward Network
↓
Residual Connection
↓
Layer Normalization
↓
Output
```

구형 Transformer 설명에서는 흔히 이를 다음처럼 표현합니다.

```text
Attention
→ Add & Norm
→ FFN
→ Add & Norm
```

## Self-Attention

Self-Attention은 **같은 Sequence 안의 Token들이 서로를 참고하는 과정**입니다.

문장:

```text
The animal didn't cross the street because it was tired.
```

`it`이라는 Token을 처리할 때 다른 Token들과의 관계를 계산합니다.

```text
it ↔ animal
it ↔ street
it ↔ tired
...
```

Attention을 통해 `it`이 어떤 단어와 더 관련 있는지 반영할 수 있습니다.

<mark>Self-Attention의 Self는 Query, Key, Value가 모두 같은 입력 Sequence에서 만들어진다는 뜻입니다.</mark>

## Q, K, V

Self-Attention에서는 입력 벡터를 세 가지 벡터로 변환합니다.

```text
Query
Key
Value
```

입력 행렬을 `X`라고 하면

$$Q=XW_Q$$

$$K=XW_K$$

$$V=XW_V$$

- `W_Q`: Query 가중치
- `W_K`: Key 가중치
- `W_V`: Value 가중치

세 행렬은 학습되는 Parameter입니다.

## Query, Key, Value 직관

쉽게 보면 다음과 같습니다.

```text
Query
→ 내가 무엇을 찾고 있는가

Key
→ 내가 어떤 정보를 가지고 있는가

Value
→ 실제로 전달할 정보
```

Query와 Key를 비교해서 관련도를 구합니다.

관련도가 높으면 해당 Value를 더 많이 가져옵니다.

## Attention Score

Query와 Key의 내적을 계산합니다.

$$QK^T$$

내적값이 크면 두 Token이 더 관련 있다고 볼 수 있습니다.

하지만 차원이 커지면 내적값도 너무 커질 수 있습니다.

그래서 다음과 같이 나눕니다.

$$\frac{QK^T}{\sqrt{d_k}}$$

- `d_k`: Key Vector의 차원

이를 **Scaled Dot-Product Attention**이라고 합니다.

## Softmax

Attention Score를 그대로 사용하지 않고 Softmax를 적용합니다.

$$A=\operatorname{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)$$

`A`는 Attention Weight입니다.

각 Token이 다른 Token을 얼마나 참고할지 나타냅니다.

예를 들어

```text
Token A → Token B : 0.7
Token A → Token C : 0.2
Token A → Token D : 0.1
```

처럼 생각할 수 있습니다.

## Value와 결합

Attention Weight를 Value에 곱합니다.

$$\operatorname{Attention}(Q,K,V)=\operatorname{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

결과적으로 각 Token은 다른 Token들의 정보를 가중합해서 새로운 표현을 얻습니다.

```text
현재 Token
+
관련 Token들의 정보
→ 문맥이 반영된 표현
```

## Self-Attention 예시

입력:

```text
I love AI
```

`love` Token을 처리한다고 하겠습니다.

```text
Query(love)
```

는 다음 Key들과 비교됩니다.

```text
Key(I)
Key(love)
Key(AI)
```

그 결과

```text
I     : 0.2
love  : 0.2
AI    : 0.6
```

이라고 나오면

```text
Value(I) × 0.2
+
Value(love) × 0.2
+
Value(AI) × 0.6
```

형태로 정보를 합칩니다.

즉 `love`의 새로운 벡터에 `AI` 정보가 크게 반영됩니다.

## Multi-Head Attention

Transformer는 Attention을 한 번만 하지 않습니다.

여러 개의 Attention Head를 동시에 사용합니다.

```text
Head 1
Head 2
Head 3
...
Head h
```

각 Head는 서로 다른 `W_Q`, `W_K`, `W_V`를 사용합니다.

$$head_i=\operatorname{Attention}(Q_i,K_i,V_i)$$

각 Head의 결과를 이어 붙입니다.

$$H=\operatorname{Concat}(head_1,\dots,head_h)W_O$$

- `W_O`: 최종 출력 Projection 행렬

## 왜 여러 Head를 사용할까

하나의 Attention만 사용하면 하나의 관계 표현에 집중할 수 있습니다.

Multi-Head Attention은 서로 다른 관계를 동시에 볼 수 있습니다.

예를 들어 개념적으로

```text
Head 1 → 문법 관계
Head 2 → 멀리 떨어진 Token 관계
Head 3 → 의미적 유사성
Head 4 → 특정 위치 패턴
```

처럼 서로 다른 특징을 학습할 수 있습니다.

실제로 Head마다 반드시 이런 역할이 고정되는 것은 아닙니다.

<blockquote class="prompt-warning">
<p>Attention Head마다 문법, 의미처럼 사람이 미리 역할을 지정하는 것은 아닙니다. 학습 과정에서 서로 다른 관계 표현을 학습할 수 있다는 뜻입니다.</p>
</blockquote>

## Residual Connection

Attention의 출력을 바로 다음 층으로 넘기지 않습니다.

원래 입력을 다시 더합니다.

$$Y=X+\operatorname{MHA}(X)$$

이를 **Residual Connection** 또는 **Skip Connection**이라고 합니다.

```text
X ───────────────┐
↓                │
Attention        │
↓                │
Output ──────────+
```

원래 입력 정보를 유지하면서 새로운 정보를 추가할 수 있습니다.

## 왜 Residual Connection을 사용할까

깊은 Network에서는 Layer가 많아질수록 학습이 어려워질 수 있습니다.

Residual Connection은

```text
기존 정보
+
새롭게 계산한 정보
```

를 함께 전달합니다.

장점:

- Gradient 전달에 도움
- 깊은 Network 학습 안정화
- 원래 표현 보존

## Layer Normalization

Residual Connection 이후에는 Layer Normalization을 적용합니다.

개념적으로

$$Y=\operatorname{LayerNorm}(X+\operatorname{MHA}(X))$$

LayerNorm은 각 Token의 Feature 값 분포를 정규화합니다.

이를 통해 학습을 더 안정적으로 만들 수 있습니다.

## Add & Norm

Transformer 그림에서 자주 보는

```text
Add & Norm
```

은 다음 두 작업을 뜻합니다.

```text
Add
→ Residual Connection

Norm
→ Layer Normalization
```

즉

```text
SubLayer Output
+
Original Input
→ LayerNorm
```

입니다.

## Feed Forward Network

Attention 다음에는 Feed Forward Network가 있습니다.

각 Token마다 **독립적으로 같은 MLP**를 적용합니다.

기본적인 형태는 다음과 같습니다.

$$\operatorname{FFN}(x)=W_2\sigma(W_1x+b_1)+b_2$$

- `W_1`: 첫 번째 Linear Layer
- `W_2`: 두 번째 Linear Layer
- `σ`: Activation Function

원래 Transformer에서는 ReLU를 사용했습니다.

최근 모델에서는 GELU, SwiGLU 등 다른 Activation도 많이 사용합니다.

## FFN의 역할

Self-Attention은 Token 사이의 정보를 섞습니다.

```text
Token ↔ Token
```

FFN은 각 Token의 내부 Feature를 변환합니다.

```text
Token Vector
→ Feature 변환
```

즉 역할을 단순하게 나누면

```text
Self-Attention
→ Token 사이 관계 학습

FFN
→ 각 Token 표현을 비선형 변환
```

입니다.

<mark>Attention은 Token 간 정보를 섞고, FFN은 각 Token의 Feature를 변환합니다.</mark>

## FFN도 Add & Norm을 거친다

FFN 출력에도 Residual Connection과 LayerNorm을 적용합니다.

$$Z=\operatorname{LayerNorm}(Y+\operatorname{FFN}(Y))$$

따라서 Encoder Layer 전체는 다음과 같습니다.

```text
X
↓
Multi-Head Self-Attention
↓
Add & Norm
↓
FFN
↓
Add & Norm
↓
Z
```

## Encoder 한 층 전체

수식으로 단순화하면

$$Y=\operatorname{LayerNorm}(X+\operatorname{MHA}(X))$$

$$Z=\operatorname{LayerNorm}(Y+\operatorname{FFN}(Y))$$

`Z`가 다음 Encoder Layer의 입력이 됩니다.

```text
Encoder Layer 1 Output
→ Encoder Layer 2 Input
```

## 여러 Encoder Layer를 쌓는 이유

한 층만 사용하면 제한적인 관계만 학습할 수 있습니다.

Layer를 여러 층 쌓으면 표현이 점점 변합니다.

```text
초기 Layer
→ 비교적 단순한 Token 관계

중간 Layer
→ 문맥 관계

깊은 Layer
→ 더 추상적인 표현
```

정확한 역할은 모델과 학습에 따라 달라집니다.

## Encoder의 Mask

Encoder에서도 Attention Mask를 사용할 수 있습니다.

대표적으로 **Padding Mask**입니다.

Batch 처리를 위해 문장 길이를 맞추면 `[PAD]`가 들어갈 수 있습니다.

```text
I love AI [PAD] [PAD]
```

Padding Token은 실제 의미가 없습니다.

따라서 Attention 계산에서 무시하도록 Mask를 적용합니다.

```text
실제 Token → Attention 가능
PAD Token  → Attention 차단
```

## Encoder에는 Causal Mask가 필요한가

일반적인 Transformer Encoder는 **Causal Mask를 사용하지 않습니다.**

Encoder는 입력 전체를 동시에 봅니다.

예:

```text
Token 1 → Token 1, 2, 3, 4 모두 참고 가능
Token 2 → Token 1, 2, 3, 4 모두 참고 가능
```

반면 Autoregressive Decoder는 미래 Token을 볼 수 없습니다.

```text
Token 2
→ Token 1, 2만 참고
→ Token 3, 4는 차단
```

<blockquote class="prompt-warning">
<p>Encoder의 Self-Attention은 일반적으로 양방향이며, Decoder의 Causal Self-Attention처럼 미래 Token을 가리지 않습니다.</p>
</blockquote>

## Encoder와 Decoder 비교

| 구분 | Encoder | Decoder |
| --- | --- | --- |
| 입력 전체 참고 | 가능 | Causal Mask 사용 시 미래 Token 불가 |
| 핵심 Attention | Self-Attention | Masked Self-Attention |
| 대표 용도 | 문맥 이해 | 다음 Token 생성 |
| 대표 모델 | BERT | GPT |

Encoder-Decoder Transformer에서는 Decoder에 Cross-Attention도 추가됩니다.

## BERT와 Encoder

BERT는 Transformer의 **Encoder 구조를 여러 층 쌓은 대표적인 모델**입니다.

```text
Input
↓
Transformer Encoder
↓
Transformer Encoder
↓
...
↓
Contextual Representation
```

BERT는 좌우 문맥을 모두 볼 수 있습니다.

```text
왼쪽 Token
← 현재 Token →
오른쪽 Token
```

그래서 문장 이해, 분류, 개체명 인식 등에 강점을 보였습니다.

## GPT와 차이

GPT 계열은 기본적으로 Transformer **Decoder 구조**를 사용합니다.

BERT:

```text
Encoder
→ 양방향 문맥
```

GPT:

```text
Decoder
→ 이전 Token만 보고 다음 Token 예측
```

이 차이가 중요한 이유는 학습 목적이 다르기 때문입니다.

## Encoder의 출력

Encoder의 출력 Shape은 일반적으로 입력 Token 수를 유지합니다.

입력이

```text
Sequence Length = L
Hidden Dimension = d_model
```

이라면 출력도 보통

```text
L × d_model
```

형태입니다.

즉 각 Token마다 하나의 Contextual Vector가 나옵니다.

```text
Token 1 → Context Vector 1
Token 2 → Context Vector 2
Token 3 → Context Vector 3
```

## 입력과 출력의 차이

처음 Embedding은 단순히 Token 자체의 표현에 가깝습니다.

Encoder를 통과하면 같은 Token도 주변 문맥에 따라 다른 벡터가 됩니다.

예:

```text
bank
```

문장 1:

```text
I went to the bank to deposit money.
```

문장 2:

```text
I sat on the river bank.
```

입력 Token은 `bank`지만 Encoder 출력 표현은 문맥에 따라 달라질 수 있습니다.

<mark>Encoder의 핵심 결과는 문맥이 반영된 Contextual Embedding입니다.</mark>

## 계산 복잡도

Self-Attention은 모든 Token 쌍의 관계를 계산합니다.

Sequence Length를 `n`이라고 하면 Attention Matrix는

$$n\times n$$

크기가 됩니다.

Self-Attention의 대표적인 Sequence Length 기준 계산 복잡도는

$$O(n^2)$$

입니다.

Sequence가 길어지면 Attention 계산량과 메모리 사용량이 크게 증가합니다.

## 잘 놓치는 핵심

### 1. Encoder는 입력 전체를 볼 수 있다

일반적인 Encoder Self-Attention은 양방향입니다.

### 2. Q, K, V는 입력에서 만들어진다

Self-Attention에서는 같은 입력 `X`를 각각 다른 가중치 행렬에 통과시킵니다.

```text
X → Q
X → K
X → V
```

### 3. Attention과 FFN의 역할은 다르다

```text
Attention
→ Token 간 관계

FFN
→ Token 내부 Feature 변환
```

### 4. Add & Norm은 하나의 연산이 아니다

```text
Add
→ Residual Connection

Norm
→ Layer Normalization
```

### 5. Encoder는 미래 Token을 가리지 않는다

Decoder의 Causal Mask와 혼동하면 안 됩니다.

### 6. Encoder 출력은 Token별 Contextual Vector다

입력 Sequence Length가 유지되며 각 Token 표현이 문맥화됩니다.

## 시험·면접

### 핵심 암기

```text
Transformer Encoder

Embedding
+
Positional Encoding
↓
Multi-Head Self-Attention
↓
Add & Norm
↓
Feed Forward Network
↓
Add & Norm
```

### 자주 나오는 질문 1

**Transformer Encoder의 핵심 구성 요소는?**

Multi-Head Self-Attention, Feed Forward Network, Residual Connection, Layer Normalization입니다.

### 자주 나오는 질문 2

**Self-Attention에서 Q, K, V는 어디서 만들어지는가?**

Encoder Self-Attention에서는 같은 입력 Sequence에서 각각 다른 Linear Projection을 통해 만들어집니다.

### 자주 나오는 질문 3

**왜 QK를 루트 d_k로 나누는가?**

Vector 차원이 커질수록 Dot Product 값이 커져 Softmax가 지나치게 뾰족해질 수 있기 때문에 값을 Scale합니다.

### 자주 나오는 질문 4

**Encoder의 Attention은 미래 Token을 볼 수 있는가?**

일반적인 Encoder는 가능합니다. Causal Mask를 사용하는 Decoder와 다릅니다.

### 자주 나오는 질문 5

**FFN의 역할은?**

각 Token에 동일한 Feed Forward Network를 독립적으로 적용해 Feature를 비선형 변환합니다.

<blockquote class="prompt-danger">
<p>시험 함정: Encoder의 Self-Attention과 Decoder의 Masked Self-Attention을 같은 것으로 보면 안 됩니다. 일반적인 Encoder는 입력 전체를 참고할 수 있습니다.</p>
</blockquote>

## 예시로 한 바퀴

입력:

```text
I love AI
```

### 1. Embedding

```text
I     → x1
love  → x2
AI    → x3
```

### 2. 위치 정보 추가

```text
x1 + p1
x2 + p2
x3 + p3
```

### 3. Q, K, V 생성

```text
X → Q
X → K
X → V
```

### 4. Self-Attention

각 Token이 다른 모든 Token과 관계를 계산합니다.

```text
I    ↔ I, love, AI
love ↔ I, love, AI
AI   ↔ I, love, AI
```

### 5. Multi-Head Attention

여러 Attention Head가 서로 다른 관계를 학습합니다.

### 6. Add & Norm

```text
Attention Output
+
Original Input
→ LayerNorm
```

### 7. FFN

각 Token Vector를 독립적으로 변환합니다.

### 8. 다시 Add & Norm

```text
FFN Output
+
Previous Representation
→ LayerNorm
```

최종적으로

```text
I     → 문맥 반영 Vector
love  → 문맥 반영 Vector
AI    → 문맥 반영 Vector
```

가 만들어집니다.

## 객관식 문제

### 1. Transformer Encoder의 핵심 구성 요소로 가장 적절한 것은?

① CNN과 Pooling  
② Self-Attention과 FFN  
③ RNN과 LSTM  
④ K-Means와 PCA

<details>
<summary>정답</summary>

②

</details>

### 2. Self-Attention의 Q, K, V에 대한 설명으로 옳은 것은?

① 모두 다른 문장에서 가져온다.  
② 같은 입력에서 서로 다른 Projection으로 만든다.  
③ Q만 학습된다.  
④ K와 V는 항상 동일하다.

<details>
<summary>정답</summary>

②

</details>

### 3. Add & Norm의 Add는 무엇을 의미하는가?

① Token을 추가한다.  
② Residual Connection을 적용한다.  
③ Vocabulary를 추가한다.  
④ Head를 추가한다.

<details>
<summary>정답</summary>

②

</details>

### 4. 일반적인 Transformer Encoder에 대한 설명으로 옳은 것은?

① 미래 Token을 항상 Mask한다.  
② 입력 전체 Token을 참고할 수 있다.  
③ 이전 Token 하나만 본다.  
④ Self-Attention을 사용하지 않는다.

<details>
<summary>정답</summary>

②

</details>

### 5. FFN의 역할로 가장 적절한 것은?

① Token 간 Attention Score만 계산한다.  
② 각 Token의 Feature를 비선형 변환한다.  
③ Tokenizer Vocabulary를 만든다.  
④ Positional Encoding을 제거한다.

<details>
<summary>정답</summary>

②

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
Token
↓
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
↓
Contextual Representation
```

핵심은 다음 한 문장입니다.

<mark>Transformer Encoder는 Self-Attention으로 Token 사이의 관계를 계산하고, FFN으로 각 Token 표현을 변환해 문맥이 반영된 벡터를 만듭니다.</mark>

## 다음에 이을 글

**Transformer Decoder**입니다.  
Encoder와 달리 Causal Mask를 사용하는 이유, Masked Self-Attention, Cross-Attention, 다음 Token 생성 과정을 이어서 봅니다.
