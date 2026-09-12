---
title: Transformer Decoder
date: 2026-09-12 14:55:00 +0900
slug: transformer-decoder
permalink: /posts/transformer-decoder/
categories: [AI, 딥러닝]
tags: [Transformer, Decoder, SelfAttention, CausalMask, CrossAttention, GPT, LLM]
math: true
---

Transformer Decoder는 **이전 Token들을 참고해 다음 Token을 생성하는 구조**입니다.  
핵심은 미래 Token을 보지 못하게 막는 **Causal Mask**입니다.

<blockquote class="prompt-info">
<p>한 줄: Decoder는 과거 Token만 보면서 다음 Token을 하나씩 예측합니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

Transformer Decoder는 Masked Self-Attention으로 미래 정보를 차단하고, 필요하면 Encoder 출력에 Cross-Attention한 뒤 FFN을 거쳐 다음 Token 확률을 만듭니다.

</details>

## 전체 구조

원래 Transformer의 Decoder Layer는 크게 세 부분으로 구성됩니다.

```text
입력
↓
Masked Multi-Head Self-Attention
↓
Add & Norm
↓
Cross-Attention
↓
Add & Norm
↓
Feed Forward Network
↓
Add & Norm
↓
출력
```

이 Decoder Layer를 여러 층 쌓습니다.

```text
Input
↓
Decoder Layer 1
↓
Decoder Layer 2
↓
...
↓
Decoder Layer N
```

<mark>Decoder의 가장 큰 특징은 미래 Token을 볼 수 없다는 점입니다.</mark>

## Decoder의 입력

문장이 Tokenizer를 거쳐 Token ID로 바뀝니다.

```text
I love AI
↓
["I", "love", "AI"]
↓
Token ID
```

Token ID는 Embedding Vector로 바뀝니다.

```text
Token ID
→ Embedding
```

여기에 위치 정보를 더합니다.

$$X=E+P$$

- `E`: Token Embedding
- `P`: Positional Encoding
- `X`: Decoder 입력

## 왜 위치 정보가 필요한가

Self-Attention 자체는 Token 순서를 자동으로 알지 못합니다.

```text
I love AI
```

와

```text
AI love I
```

는 Token 집합은 같지만 순서는 다릅니다.

그래서 Decoder도 위치 정보를 필요로 합니다.

## Masked Self-Attention

Decoder의 핵심은 **Masked Self-Attention**입니다.

일반적인 Encoder Self-Attention은 모든 Token을 볼 수 있습니다.

```text
Token 1 → 1, 2, 3, 4
Token 2 → 1, 2, 3, 4
Token 3 → 1, 2, 3, 4
```

Decoder는 미래 Token을 볼 수 없습니다.

```text
Token 1 → 1
Token 2 → 1, 2
Token 3 → 1, 2, 3
Token 4 → 1, 2, 3, 4
```

이를 위해 **Causal Mask**를 사용합니다.

<blockquote class="prompt-info">
<p>Causal Mask는 현재 위치보다 뒤에 있는 미래 Token의 Attention을 차단합니다.</p>
</blockquote>

## 왜 미래 Token을 가릴까

다음 Token을 예측하는 모델이 정답을 미리 보면 안 되기 때문입니다.

예를 들어

```text
I love
```

다음 Token으로

```text
AI
```

를 예측한다고 하겠습니다.

학습할 때 입력 전체 문장이 존재하더라도

```text
I love AI
```

`love` 위치에서 `AI`를 직접 보면 정답을 미리 본 것이 됩니다.

그래서 미래 위치를 Mask합니다.

## Causal Mask

Attention Score는 기본적으로 다음과 같습니다.

$$S=\frac{QK^T}{\sqrt{d_k}}$$

여기에 Mask를 더합니다.

$$S'=\frac{QK^T}{\sqrt{d_k}}+M$$

미래 위치에는 매우 작은 값을 넣습니다.

개념적으로

```text
0     -∞    -∞    -∞
0      0    -∞    -∞
0      0     0    -∞
0      0     0     0
```

Softmax를 적용하면 `-∞` 위치의 확률은 0이 됩니다.

$$A=\operatorname{softmax}(S')$$

따라서 미래 Token은 Attention 결과에 영향을 주지 못합니다.

## Causal Mask 모양

Token이 4개라면

```text
        K1  K2  K3  K4
Q1      O   X   X   X
Q2      O   O   X   X
Q3      O   O   O   X
Q4      O   O   O   O
```

- `O`: 볼 수 있음
- `X`: 볼 수 없음

<mark>Causal Mask는 Attention Matrix의 위쪽 삼각 영역을 막는 형태로 이해하면 쉽습니다.</mark>

## Q, K, V

Decoder Self-Attention에서도 Q, K, V를 만듭니다.

$$Q=XW_Q$$

$$K=XW_K$$

$$V=XW_V$$

- Query: 무엇을 찾는가
- Key: 어떤 정보를 가지고 있는가
- Value: 실제 전달할 정보

Self-Attention에서는 Q, K, V 모두 같은 Decoder 입력에서 만들어집니다.

## Masked Self-Attention 계산

기본 형태는 다음과 같습니다.

$$\operatorname{Attention}(Q,K,V)=\operatorname{softmax}\left(\frac{QK^T}{\sqrt{d_k}}+M\right)V$$

`M`이 Causal Mask입니다.

일반 Self-Attention 공식에 Mask가 추가된 형태입니다.

## Multi-Head Attention

Decoder도 여러 Attention Head를 사용합니다.

$$head_i=\operatorname{Attention}(Q_i,K_i,V_i)$$

각 Head의 결과를 합칩니다.

$$H=\operatorname{Concat}(head_1,\dots,head_h)W_O$$

여러 Head가 서로 다른 관계를 학습할 수 있습니다.

```text
Head 1
Head 2
Head 3
...
```

다만 Head별 역할이 사람이 미리 정해져 있는 것은 아닙니다.

## Add & Norm

Masked Self-Attention 뒤에는 Add & Norm이 있습니다.

```text
Masked Self-Attention
↓
Residual Connection
↓
Layer Normalization
```

수식으로 단순화하면

$$Y=\operatorname{LayerNorm}(X+\operatorname{MaskedMHA}(X))$$

여기서 `Add`는 Residual Connection입니다.

## Cross-Attention

원래 Transformer Encoder-Decoder 구조에서는 Decoder에 **Cross-Attention**이 있습니다.

Decoder가 Encoder의 출력 정보를 참고하는 부분입니다.

예를 들어 번역에서는

```text
영어 문장
→ Encoder
→ Encoder Output
```

Decoder가 이 정보를 보면서 한국어 문장을 생성합니다.

```text
Decoder
→ Encoder Output 참고
→ 다음 Token 생성
```

## Cross-Attention의 Q, K, V

Cross-Attention에서는 Q, K, V의 출처가 다릅니다.

```text
Query
→ Decoder에서 옴

Key
→ Encoder Output에서 옴

Value
→ Encoder Output에서 옴
```

즉

$$Q=YW_Q$$

$$K=HW_K$$

$$V=HW_V$$

- `Y`: Decoder의 현재 표현
- `H`: Encoder Output

<mark>Cross-Attention에서는 Q는 Decoder, K와 V는 Encoder에서 옵니다.</mark>

## 왜 Cross-Attention을 사용할까

Decoder가 입력 문장의 정보를 참고해야 하기 때문입니다.

번역 예:

```text
Encoder 입력:
I love AI

Decoder 출력:
나는 AI를 좋아한다
```

Decoder가 단순히 이전 한국어 Token만 보는 것이 아니라 Encoder가 만든 영어 문장 표현도 참고해야 합니다.

## Encoder Self-Attention과 Cross-Attention 차이

| 구분 | Self-Attention | Cross-Attention |
| --- | --- | --- |
| Q | 현재 Sequence | Decoder |
| K | 현재 Sequence | Encoder |
| V | 현재 Sequence | Encoder |
| 목적 | 같은 Sequence 내부 관계 | Encoder 정보 참조 |

## GPT에는 Cross-Attention이 있는가

일반적인 GPT 계열의 **Decoder-only Transformer**에는 Encoder가 없습니다.

따라서 일반적인 구조에서는 Cross-Attention도 없습니다.

```text
GPT 계열

Masked Self-Attention
↓
FFN
↓
다음 Token 예측
```

즉 원래 Transformer Decoder와 GPT의 Decoder Block은 완전히 같은 구조가 아닙니다.

<blockquote class="prompt-warning">
<p>GPT는 Decoder 구조를 기반으로 하지만, 일반적인 GPT Decoder-only Block에는 Encoder가 없으므로 Cross-Attention도 없습니다.</p>
</blockquote>

## Feed Forward Network

Attention 뒤에는 FFN이 있습니다.

$$\operatorname{FFN}(x)=W_2\sigma(W_1x+b_1)+b_2$$

각 Token에 동일한 MLP를 독립적으로 적용합니다.

```text
Attention
→ Token 사이 정보 교환

FFN
→ 각 Token Feature 변환
```

## Decoder Layer 전체

원래 Transformer Decoder를 단순화하면

```text
Input
↓
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
↓
Output
```

수식으로 단순화하면

$$Y=\operatorname{LayerNorm}(X+\operatorname{MaskedMHA}(X))$$

$$Z=\operatorname{LayerNorm}(Y+\operatorname{CrossAttention}(Y,H))$$

$$O=\operatorname{LayerNorm}(Z+\operatorname{FFN}(Z))$$

`H`는 Encoder Output입니다.

## Decoder-only 구조

GPT 계열처럼 Encoder가 없는 구조는 더 단순합니다.

```text
Input
↓
Masked Self-Attention
↓
Add & Norm
↓
FFN
↓
Add & Norm
↓
Output
```

여러 Block을 반복합니다.

```text
Decoder Block 1
↓
Decoder Block 2
↓
...
↓
Decoder Block N
```

## 다음 Token 예측

마지막 Decoder 출력은 Vocabulary 크기로 Projection됩니다.

```text
Hidden State
↓
Linear Layer
↓
Vocabulary Logits
↓
Softmax
↓
다음 Token 확률
```

수식으로 보면

$$z_t=h_tW+b$$

$$P(x_{t+1}\mid x_{\le t})=\operatorname{softmax}(z_t)$$

현재까지의 Token을 보고 다음 Token의 확률을 계산합니다.

## 예시

입력:

```text
I love
```

모델이 다음 Token 확률을 계산합니다.

```text
AI       0.45
music    0.20
you      0.15
coding   0.10
...
```

Sampling 방식에 따라 다음 Token을 선택합니다.

예를 들어

```text
AI
```

가 선택되면 다음 입력은

```text
I love AI
```

가 됩니다.

그리고 다시 다음 Token을 예측합니다.

## Autoregressive Generation

이 과정을 반복하는 것을 **Autoregressive Generation**이라고 합니다.

```text
I
↓
I love
↓
I love AI
↓
I love AI because
↓
...
```

항상 이전까지 생성한 Token을 조건으로 다음 Token을 예측합니다.

$$P(x_1,\dots,x_n)=\prod_{t=1}^{n}P(x_t\mid x_{<t})$$

<mark>Decoder-only LLM의 생성은 이전 Token을 조건으로 다음 Token을 하나씩 예측하는 Autoregressive 방식입니다.</mark>

## 학습할 때도 하나씩 생성할까

학습에서는 반드시 Token을 하나씩 순차 실행할 필요는 없습니다.

Causal Mask를 사용하면 여러 위치의 다음 Token 예측을 **병렬로 계산**할 수 있습니다.

예:

```text
입력:
I love AI

예측:
I     → love
love  → AI
AI    → 다음 Token
```

미래 정보는 Mask로 차단하면서 여러 위치의 Loss를 동시에 계산할 수 있습니다.

## Teacher Forcing

학습할 때는 이전 위치에 모델이 생성한 Token 대신 실제 정답 Token을 입력으로 사용할 수 있습니다.

예:

```text
정답 문장:
I love AI
```

모델은

```text
I
→ love 예측

I love
→ AI 예측
```

과 같은 학습을 합니다.

실제 정답 Sequence를 입력으로 활용하므로 학습을 효율적으로 할 수 있습니다.

## Inference와 Training 차이

### Training

```text
전체 정답 Sequence 존재
+
Causal Mask
→ 여러 위치 병렬 계산
```

### Inference

```text
이전 Token
→ 다음 Token 생성
→ 생성 Token 다시 입력
→ 반복
```

Inference에서는 다음 Token을 알아야 그다음 Token을 만들 수 있으므로 순차적입니다.

## KV Cache

Decoder-only LLM 추론에서는 **KV Cache**가 중요합니다.

예를 들어

```text
I love AI
```

까지 이미 계산했다고 하겠습니다.

다음 Token을 만들 때 이전 Token의 Key와 Value를 매번 처음부터 다시 계산하면 비효율적입니다.

그래서 이전 Attention의 K와 V를 저장합니다.

```text
이전 K, V
→ Cache
→ 다음 Token 계산 때 재사용
```

이를 KV Cache라고 합니다.

<blockquote class="prompt-info">
<p>KV Cache는 이전 Token의 Key와 Value를 저장해서 Autoregressive 추론 시 중복 계산을 줄입니다.</p>
</blockquote>

## Decoder의 Mask 종류

Decoder에서는 대표적으로 두 종류의 Mask를 볼 수 있습니다.

### 1. Causal Mask

미래 Token을 차단합니다.

```text
현재보다 뒤
→ Attention 금지
```

### 2. Padding Mask

`[PAD]` Token을 무시합니다.

```text
실제 Token → 사용
PAD Token → 무시
```

두 Mask의 목적은 다릅니다.

## Encoder와 Decoder 비교

| 구분 | Encoder | Decoder |
| --- | --- | --- |
| 미래 Token | 볼 수 있음 | Causal Mask로 차단 |
| Self-Attention | 양방향 | Causal |
| Cross-Attention | 없음 | Encoder-Decoder 구조에서 사용 |
| 대표 역할 | 문맥 이해 | Token 생성 |
| 대표 모델 | BERT | GPT |

## Decoder의 출력

Decoder는 각 위치마다 Hidden State를 만듭니다.

```text
Token 1 → h1
Token 2 → h2
Token 3 → h3
```

다음 Token 생성에서는 보통 마지막 위치의 Hidden State를 사용합니다.

```text
h_t
↓
Linear
↓
Vocabulary Logits
↓
Softmax
```

## Logit이란

Logit은 Softmax를 적용하기 전의 점수입니다.

예:

```text
AI      4.2
music   3.1
coding  2.8
```

Softmax를 적용하면 확률 형태가 됩니다.

```text
AI      0.55
music   0.20
coding  0.15
...
```

## Decoder와 생성형 AI

GPT 같은 생성형 AI에서는 Decoder 구조가 핵심입니다.

```text
Prompt
↓
Tokenizer
↓
Decoder Blocks
↓
Next Token Probability
↓
Token 선택
↓
다시 Decoder
```

이 과정을 반복하면서 문장을 생성합니다.

## 잘 놓치는 핵심

### 1. Decoder는 미래 Token을 보지 못한다

Causal Mask를 사용합니다.

### 2. Causal Mask와 Padding Mask는 다르다

```text
Causal Mask
→ 미래 차단

Padding Mask
→ PAD 차단
```

### 3. Cross-Attention은 항상 있는 것이 아니다

원래 Encoder-Decoder Transformer에는 있습니다.

GPT 같은 Decoder-only 모델에는 일반적으로 없습니다.

### 4. Cross-Attention의 Q, K, V 출처가 다르다

```text
Q → Decoder
K → Encoder
V → Encoder
```

### 5. Training과 Inference는 다르다

Training은 Causal Mask를 사용해 여러 위치를 병렬 계산할 수 있습니다.

Inference는 Token을 하나씩 생성합니다.

### 6. KV Cache는 추론 최적화다

이전 Token의 K, V를 저장해 중복 계산을 줄입니다.

## 시험·면접

### 핵심 암기

```text
Transformer Decoder

Embedding + Position
↓
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

GPT 계열:

```text
Masked Self-Attention
↓
FFN
↓
Next Token Prediction
```

### 자주 나오는 질문 1

**Decoder에서 Causal Mask를 사용하는 이유는?**

현재 Token이 미래 Token을 미리 보지 못하게 해서 올바른 Autoregressive 학습을 하기 위해 사용합니다.

### 자주 나오는 질문 2

**Encoder와 Decoder Self-Attention의 차이는?**

Encoder는 일반적으로 입력 전체를 볼 수 있지만 Decoder는 Causal Mask를 사용해 미래 Token을 보지 못합니다.

### 자주 나오는 질문 3

**Cross-Attention에서 Q, K, V는 어디서 오는가?**

Q는 Decoder, K와 V는 Encoder Output에서 옵니다.

### 자주 나오는 질문 4

**GPT에는 Cross-Attention이 있는가?**

일반적인 GPT Decoder-only 구조에는 Encoder가 없기 때문에 Cross-Attention도 없습니다.

### 자주 나오는 질문 5

**KV Cache란?**

이전 Token에서 계산한 Key와 Value를 저장해 다음 Token 생성 시 재사용하는 추론 최적화 기법입니다.

<blockquote class="prompt-danger">
<p>시험 함정: Transformer Decoder와 GPT Block을 완전히 동일하게 보면 안 됩니다. 원래 Decoder에는 Cross-Attention이 있지만 일반적인 GPT Decoder-only 구조에는 없습니다.</p>
</blockquote>

## 예시로 한 바퀴

Prompt:

```text
I love
```

### 1. Embedding과 위치 정보

```text
I
love
→ Embedding + Position
```

### 2. Masked Self-Attention

```text
I
→ I만 참고

love
→ I, love 참고
```

미래 Token은 볼 수 없습니다.

### 3. FFN

각 Token의 Feature를 변환합니다.

### 4. 마지막 Hidden State

```text
h_love
```

를 Vocabulary 크기로 Projection합니다.

### 5. 다음 Token 확률

```text
AI       0.45
music    0.20
coding   0.10
...
```

### 6. Token 선택

```text
AI
```

를 선택했다고 하겠습니다.

새 입력:

```text
I love AI
```

다시 같은 과정을 반복합니다.

<mark>Decoder는 이전까지의 Token을 계속 입력으로 사용하면서 다음 Token을 하나씩 생성합니다.</mark>

## 객관식 문제

### 1. Decoder에서 Causal Mask를 사용하는 이유는?

① Padding을 늘리기 위해  
② 미래 Token을 보지 못하게 하기 위해  
③ Vocabulary를 줄이기 위해  
④ Embedding을 제거하기 위해

<details>
<summary>정답</summary>

②

</details>

### 2. Cross-Attention에서 Key와 Value의 출처는?

① Decoder만 사용  
② Encoder Output  
③ Tokenizer Vocabulary  
④ Positional Encoding

<details>
<summary>정답</summary>

②

</details>

### 3. 일반적인 GPT Decoder-only 구조에 대한 설명으로 옳은 것은?

① Encoder가 반드시 존재한다.  
② Cross-Attention이 반드시 존재한다.  
③ Causal Self-Attention을 사용한다.  
④ 미래 Token을 자유롭게 본다.

<details>
<summary>정답</summary>

③

</details>

### 4. KV Cache의 주요 목적은?

① Vocabulary 생성  
② 이전 K, V를 재사용해 추론 중복 계산 감소  
③ Tokenizer 학습  
④ Causal Mask 제거

<details>
<summary>정답</summary>

②

</details>

### 5. 다음 중 Encoder와 Decoder의 차이로 옳은 것은?

① Encoder만 Attention을 사용한다.  
② Decoder는 일반적으로 미래 Token을 Mask한다.  
③ Encoder는 항상 Cross-Attention을 사용한다.  
④ Decoder는 Embedding을 사용하지 않는다.

<details>
<summary>정답</summary>

②

</details>

### 6. Autoregressive Generation의 의미는?

① 모든 Token을 무작위로 동시에 생성  
② 이전 Token들을 조건으로 다음 Token을 순차적으로 생성  
③ Encoder Output을 제거  
④ Attention 없이 문장 생성

<details>
<summary>정답</summary>

②

</details>

## 마지막 정리

```text
Prompt
↓
Embedding + Position
↓
Causal Self-Attention
↓
FFN
↓
Vocabulary Logits
↓
Softmax
↓
다음 Token
↓
다시 입력
```

Encoder-Decoder 구조라면 중간에 Cross-Attention이 추가됩니다.

<mark>Transformer Decoder의 핵심은 Causal Mask로 미래 정보를 차단한 상태에서 이전 Token들을 이용해 다음 Token을 예측하는 것입니다.</mark>

## 다음에 이을 글

**Self-Attention과 Scaled Dot-Product Attention**입니다.  
Q, K, V가 실제로 어떤 행렬 연산을 거쳐 Attention Weight를 만드는지 계산 예시와 함께 봅니다.
