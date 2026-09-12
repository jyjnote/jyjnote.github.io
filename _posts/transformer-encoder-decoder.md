---
title: Transformer Encoder-Decoder
date: 2026-09-12 15:10:00 +0900
slug: transformer-encoder-decoder
permalink: /posts/transformer-encoder-decoder/
categories: [AI, 딥러닝]
tags: [Transformer, Encoder, Decoder, CrossAttention, Seq2Seq, T5]
math: true
---

Transformer Encoder-Decoder는 **입력 Sequence를 Encoder가 이해하고, Decoder가 그 정보를 참고해 출력 Sequence를 생성하는 구조**입니다.  
번역, 요약처럼 입력과 출력이 모두 Sequence인 문제에 적합합니다.

<blockquote class="prompt-info">
<p>한 줄: Encoder는 입력을 문맥 벡터로 만들고, Decoder는 그 벡터를 참고해 출력을 하나씩 생성합니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

Transformer Encoder-Decoder는 Encoder의 양방향 Self-Attention과 Decoder의 Causal Self-Attention, 그리고 두 구조를 연결하는 Cross-Attention으로 이루어진 Seq2Seq 구조입니다.

</details>

## 전체 구조

Transformer의 기본 Encoder-Decoder 구조는 다음과 같습니다.

```text
입력 문장
↓
Embedding + Positional Encoding
↓
Encoder
↓
Encoder Output
↓
Cross-Attention
↓
Decoder
↓
Linear
↓
Softmax
↓
출력 Token
```

조금 더 자세히 보면

```text
Input
↓
Encoder Layer × N
↓
Encoder Output
        ↓
        └──────────────┐
                       ↓
Decoder Input → Masked Self-Attention
                       ↓
                Cross-Attention
                       ↓
                      FFN
                       ↓
                  Output Token
```

<mark>Encoder와 Decoder를 연결하는 핵심이 Cross-Attention입니다.</mark>

## Seq2Seq 구조

Encoder-Decoder는 대표적인 **Sequence-to-Sequence** 구조입니다.

```text
Sequence
→ Sequence
```

예:

```text
영어 문장
→ 한국어 문장
```

또는

```text
긴 문서
→ 요약문
```

즉 입력과 출력이 모두 Sequence입니다.

## Encoder의 역할

Encoder는 입력 Sequence 전체를 봅니다.

```text
I love AI
```

각 Token이 다른 모든 Token을 참고할 수 있습니다.

```text
I    ↔ love ↔ AI
```

Encoder는 입력을 다음처럼 **문맥이 반영된 표현**으로 바꿉니다.

```text
Input Token
→ Contextual Representation
```

출력은 각 Token마다 하나의 벡터입니다.

```text
h1
h2
h3
...
```

이를 Encoder Output이라고 합니다.

## Decoder의 역할

Decoder는 출력 Sequence를 생성합니다.

예를 들어 번역이라면

```text
입력:
I love AI

출력:
나는 AI를 좋아한다
```

Decoder는 이전에 생성된 Token과 Encoder Output을 참고합니다.

```text
이전 출력 Token
+
Encoder Output
→ 다음 Token
```

## Encoder와 Decoder의 가장 큰 차이

| 구분 | Encoder | Decoder |
| --- | --- | --- |
| 미래 Token | 볼 수 있음 | 볼 수 없음 |
| Self-Attention | 양방향 | Causal |
| 입력 | Source Sequence | 이전 Target Token |
| Cross-Attention | 없음 | 있음 |
| 역할 | 입력 이해 | 출력 생성 |

## Encoder Self-Attention

Encoder에서는 모든 입력 Token이 서로를 참고할 수 있습니다.

```text
Token 1 → 1, 2, 3, 4
Token 2 → 1, 2, 3, 4
Token 3 → 1, 2, 3, 4
Token 4 → 1, 2, 3, 4
```

이를 통해 입력 전체의 관계를 학습합니다.

<blockquote class="prompt-info">
<p>Encoder는 입력 전체를 볼 수 있기 때문에 일반적으로 Causal Mask가 필요하지 않습니다.</p>
</blockquote>

## Decoder Self-Attention

Decoder는 미래 Token을 볼 수 없습니다.

```text
Token 1 → 1
Token 2 → 1, 2
Token 3 → 1, 2, 3
Token 4 → 1, 2, 3, 4
```

이를 위해 Causal Mask를 사용합니다.

```text
현재 위치보다 뒤
→ Attention 차단
```

## 왜 Decoder는 미래를 보면 안 될까

다음 Token을 예측할 때 정답을 미리 보면 안 되기 때문입니다.

예:

```text
나는 AI를 좋아한다
```

`AI를` 다음에 `좋아한다`를 예측하는 위치에서

```text
좋아한다
```

를 미리 보면 학습이 성립하지 않습니다.

그래서 미래 Token을 Mask합니다.

## Cross-Attention

Encoder-Decoder 구조의 핵심입니다.

Cross-Attention에서는

```text
Query
→ Decoder

Key
→ Encoder

Value
→ Encoder
```

입니다.

수식으로 보면

$$Q=YW_Q$$

$$K=HW_K$$

$$V=HW_V$$

- `Y`: Decoder Hidden State
- `H`: Encoder Output

그리고

$$\operatorname{CrossAttention}(Q,K,V)=\operatorname{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

를 계산합니다.

<mark>Decoder가 Encoder Output에서 어떤 정보를 가져올지 결정하는 부분이 Cross-Attention입니다.</mark>

## Cross-Attention 직관

번역 예시:

```text
Source:
I love AI

Target:
나는 AI를 좋아한다
```

Decoder가

```text
AI를
```

생성하려고 할 때 Encoder Output 중

```text
AI
```

와 관련된 정보를 강하게 참고할 수 있습니다.

즉

```text
Decoder Query
→ Encoder Key와 비교
→ 관련 Encoder Value 가져오기
```

과정입니다.

## Encoder Layer

Encoder Layer의 기본 구조는 다음과 같습니다.

```text
Input
↓
Multi-Head Self-Attention
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

$$Y=\operatorname{LayerNorm}(X+\operatorname{MHA}(X))$$

$$Z=\operatorname{LayerNorm}(Y+\operatorname{FFN}(Y))$$

## Decoder Layer

원래 Transformer Decoder Layer는 다음과 같습니다.

```text
Input
↓
Masked Multi-Head Self-Attention
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

즉 Encoder보다 Attention Layer가 하나 더 있습니다.

## Encoder-Decoder 전체 흐름

예:

```text
I love AI
```

를 한국어로 번역한다고 하겠습니다.

### 1. Encoder 입력

```text
I
love
AI
```

Tokenize 후 Embedding과 위치 정보를 더합니다.

```text
Embedding + Position
```

### 2. Encoder 처리

입력 Token들이 서로를 참고합니다.

```text
I    ↔ love ↔ AI
```

Encoder Output:

```text
h1
h2
h3
```

### 3. Decoder 시작

Decoder에는 시작 Token이 들어갑니다.

```text
<BOS>
```

또는 모델에 따라 다른 시작 방식이 사용됩니다.

### 4. Masked Self-Attention

현재까지 생성된 Target Token만 봅니다.

```text
<BOS>
```

### 5. Cross-Attention

Decoder가 Encoder Output을 참고합니다.

```text
h1
h2
h3
```

### 6. 첫 Token 생성

예:

```text
나는
```

### 7. 다시 Decoder 입력

```text
<BOS> 나는
```

이제 다음 Token을 생성합니다.

```text
AI를
```

### 8. 반복

```text
<BOS>
→ 나는
→ AI를
→ 좋아한다
→ <EOS>
```

출력 Sequence가 완성됩니다.

## Autoregressive Generation

Decoder는 이전 출력 Token을 조건으로 다음 Token을 생성합니다.

$$P(y_1,\dots,y_T\mid x)=\prod_{t=1}^{T}P(y_t\mid y_{<t},x)$$

- `x`: Encoder 입력
- `y`: Decoder 출력

즉

```text
Source
+
이전 Target Token
→ 다음 Target Token
```

구조입니다.

## Training

학습할 때는 정답 Target Sequence가 이미 존재합니다.

예:

```text
Source:
I love AI

Target:
나는 AI를 좋아한다
```

Decoder 입력은 보통 한 칸 Shift된 Target을 사용합니다.

```text
Decoder Input:
<BOS> 나는 AI를 좋아한다

Target:
나는 AI를 좋아한다 <EOS>
```

각 위치에서 다음 Token을 예측합니다.

```text
<BOS>   → 나는
나는    → AI를
AI를    → 좋아한다
좋아한다 → <EOS>
```

## Teacher Forcing

학습에서는 이전에 모델이 생성한 Token 대신 실제 정답 Token을 입력으로 사용할 수 있습니다.

이를 Teacher Forcing이라고 합니다.

```text
정답 Token
→ 다음 위치 입력
```

덕분에 학습을 병렬화하기 쉽습니다.

## Training에서 병렬 계산

Decoder는 미래 Token을 Mask하지만 학습 시 Target 전체 Sequence는 알고 있습니다.

Causal Mask를 사용하면

```text
Position 1
Position 2
Position 3
...
```

의 예측을 한 번에 계산할 수 있습니다.

즉 학습은 병렬화가 가능합니다.

## Inference

추론에서는 정답이 없습니다.

따라서 실제로 하나씩 생성해야 합니다.

```text
<BOS>
↓
나는
↓
AI를
↓
좋아한다
↓
<EOS>
```

<blockquote class="prompt-warning">
<p>Training에서는 Causal Mask로 여러 위치를 병렬 계산할 수 있지만, Inference에서는 이전에 생성한 Token이 필요하므로 순차적으로 생성합니다.</p>
</blockquote>

## Encoder-Decoder Attention 흐름

Decoder 한 위치를 기준으로 보면

```text
이전 Target Token
↓
Masked Self-Attention
↓
Decoder 표현
↓
Cross-Attention
↙          ↘
Encoder K   Encoder V
↓
Source 정보 결합
↓
FFN
↓
다음 Token
```

## Q, K, V 출처 정리

| Attention | Q | K | V |
| --- | --- | --- | --- |
| Encoder Self-Attention | Encoder | Encoder | Encoder |
| Decoder Self-Attention | Decoder | Decoder | Decoder |
| Cross-Attention | Decoder | Encoder | Encoder |

시험에서 매우 자주 헷갈리는 부분입니다.

<mark>Cross-Attention만 Q의 출처와 K·V의 출처가 다릅니다.</mark>

## Encoder Output은 한 개의 벡터인가

아닙니다.

일반적인 Transformer Encoder는 각 입력 Token에 대해 하나의 출력 벡터를 만듭니다.

```text
Token 1 → h1
Token 2 → h2
Token 3 → h3
```

즉

```text
Sequence Length × Hidden Dimension
```

형태의 행렬입니다.

Decoder Cross-Attention은 이 전체 Encoder Output을 참고합니다.

## RNN Seq2Seq와 차이

초기 Seq2Seq 모델은 RNN Encoder가 입력 전체를 하나의 고정 길이 Context Vector에 압축하는 방식이 많았습니다.

```text
Input Sequence
→ RNN Encoder
→ Context Vector
→ RNN Decoder
```

긴 문장에서 정보 손실 문제가 생길 수 있었습니다.

Transformer는

```text
Encoder Output 전체
→ Cross-Attention
```

을 통해 Decoder가 필요한 위치를 직접 참고할 수 있습니다.

## Attention의 장점

Cross-Attention 덕분에 Decoder가 매번 Encoder Output의 다른 부분을 볼 수 있습니다.

예:

```text
출력 "나는"
→ Source "I" 참고

출력 "AI를"
→ Source "AI" 참고

출력 "좋아한다"
→ Source "love" 참고
```

실제 Attention은 이렇게 일대일로만 대응되는 것은 아니지만 직관적으로 이해하기 좋습니다.

## 대표적인 Encoder-Decoder 모델

Transformer Encoder-Decoder 구조를 사용하는 대표적인 계열은 다음과 같습니다.

```text
T5
BART
원래 Transformer 번역 모델
```

이 모델들은 입력 Sequence를 Encoder에 넣고 Decoder가 출력을 생성합니다.

## BERT와 비교

BERT는 **Encoder-only** 구조입니다.

```text
Input
↓
Encoder
↓
Contextual Representation
```

주로 문장 이해 계열 문제에 사용됩니다.

```text
분류
NER
문장 표현
```

## GPT와 비교

GPT는 **Decoder-only** 구조입니다.

```text
Prompt
↓
Causal Decoder
↓
Next Token
```

일반적인 GPT에는 Encoder가 없으므로 Cross-Attention도 없습니다.

## T5와 비교

T5는 대표적인 **Encoder-Decoder** 모델입니다.

```text
Text Input
↓
Encoder
↓
Decoder
↓
Text Output
```

다양한 NLP Task를 Text-to-Text 형태로 처리합니다.

## 세 구조 비교

| 구조 | 대표 모델 | 핵심 역할 |
| --- | --- | --- |
| Encoder-only | BERT | 입력 이해 |
| Decoder-only | GPT | 다음 Token 생성 |
| Encoder-Decoder | T5 | 입력 이해 + 출력 생성 |

## 어떤 문제에 적합할까

### Encoder-only

```text
문장 분류
감성 분석
NER
Embedding
```

### Decoder-only

```text
텍스트 생성
대화
코드 생성
Autoregressive LLM
```

### Encoder-Decoder

```text
번역
요약
질문 → 답변
Text-to-Text 변환
```

## Padding Mask

Encoder와 Decoder 모두 Padding Mask를 사용할 수 있습니다.

```text
I love AI [PAD] [PAD]
```

`[PAD]`는 실제 정보가 아니므로 Attention에서 무시합니다.

## Causal Mask와 Padding Mask

| Mask | 목적 |
| --- | --- |
| Padding Mask | PAD Token 무시 |
| Causal Mask | 미래 Token 차단 |

Decoder에서는 두 Mask가 동시에 사용될 수도 있습니다.

## Output Projection

Decoder 마지막 Hidden State는 Vocabulary 크기로 Projection됩니다.

```text
Hidden State
↓
Linear
↓
Vocabulary Logits
↓
Softmax
```

수식:

$$z_t=h_tW+b$$

$$P(y_t)=\operatorname{softmax}(z_t)$$

Vocabulary 전체에 대한 다음 Token 확률을 얻습니다.

## Cross-Attention이 없는 경우

Encoder-Decoder 구조가 아니라 Decoder-only 모델이라면 Cross-Attention이 필요 없습니다.

```text
GPT

Causal Self-Attention
↓
FFN
↓
Next Token
```

<blockquote class="prompt-warning">
<p>Transformer Decoder라는 말이 항상 Cross-Attention을 포함한다는 뜻은 아닙니다. 원래 Encoder-Decoder Transformer의 Decoder와 GPT식 Decoder-only Block을 구분해야 합니다.</p>
</blockquote>

## 잘 놓치는 핵심

### 1. Encoder Output은 Decoder의 K와 V가 된다

Cross-Attention에서

```text
Q → Decoder
K → Encoder
V → Encoder
```

입니다.

### 2. Decoder에는 두 종류의 Attention이 있다

원래 Transformer Decoder에는

```text
Masked Self-Attention
Cross-Attention
```

이 있습니다.

### 3. Encoder는 미래 Mask가 필요 없다

입력 전체를 동시에 이해하는 구조이기 때문입니다.

### 4. Decoder는 Autoregressive하다

이전 출력 Token을 조건으로 다음 Token을 생성합니다.

### 5. Training과 Inference는 다르다

Training은 병렬 계산이 가능하지만 Inference는 순차 생성입니다.

### 6. Encoder-Decoder와 Decoder-only는 다르다

```text
T5
→ Encoder + Decoder

GPT
→ Decoder only
```

## 시험·면접

### 핵심 암기

```text
Encoder
→ 입력 이해

Decoder
→ 출력 생성

Cross-Attention
→ Decoder가 Encoder Output 참고
```

### 자주 나오는 질문 1

**Encoder-Decoder Transformer의 전체 흐름은?**

Encoder가 입력 Sequence를 문맥 표현으로 변환하고, Decoder가 Masked Self-Attention과 Cross-Attention을 이용해 출력 Sequence를 Autoregressive하게 생성합니다.

### 자주 나오는 질문 2

**Cross-Attention의 Q, K, V는 어디서 오는가?**

Q는 Decoder, K와 V는 Encoder Output에서 옵니다.

### 자주 나오는 질문 3

**Decoder에 Causal Mask가 필요한 이유는?**

미래 Target Token을 미리 보지 못하게 해서 올바른 다음 Token 예측을 수행하기 위해서입니다.

### 자주 나오는 질문 4

**BERT, GPT, T5의 구조 차이는?**

```text
BERT
→ Encoder-only

GPT
→ Decoder-only

T5
→ Encoder-Decoder
```

### 자주 나오는 질문 5

**Training과 Inference 차이는?**

Training은 정답 Sequence를 이용해 여러 위치의 Loss를 병렬 계산할 수 있지만, Inference는 이전 생성 Token이 필요하므로 순차적으로 생성합니다.

<blockquote class="prompt-danger">
<p>시험 함정: Cross-Attention에서 Q, K, V가 모두 Encoder에서 오는 것이 아닙니다. Q는 Decoder, K와 V는 Encoder에서 옵니다.</p>
</blockquote>

## 예시로 한 바퀴

입력:

```text
I love AI
```

출력 목표:

```text
나는 AI를 좋아한다
```

### 1. Encoder

```text
I
love
AI
↓
Self-Attention
↓
h1, h2, h3
```

### 2. Decoder 시작

```text
<BOS>
```

### 3. Masked Self-Attention

현재까지의 Target Token만 봅니다.

### 4. Cross-Attention

```text
Query
→ Decoder

Key, Value
→ h1, h2, h3
```

### 5. 첫 Token

```text
나는
```

### 6. 반복

```text
<BOS> 나는
→ AI를

<BOS> 나는 AI를
→ 좋아한다

<BOS> 나는 AI를 좋아한다
→ <EOS>
```

최종 출력:

```text
나는 AI를 좋아한다
```

## 객관식 문제

### 1. Encoder-Decoder 구조에서 Encoder의 역할은?

① 미래 Token 생성  
② 입력 Sequence의 문맥 표현 생성  
③ Vocabulary 제거  
④ Causal Mask 생성

<details>
<summary>정답</summary>

②

</details>

### 2. Cross-Attention의 Query는 어디서 오는가?

① Encoder  
② Decoder  
③ Tokenizer  
④ Embedding Layer만

<details>
<summary>정답</summary>

②

</details>

### 3. Cross-Attention의 Key와 Value는 어디서 오는가?

① Decoder  
② Encoder Output  
③ Vocabulary  
④ Softmax

<details>
<summary>정답</summary>

②

</details>

### 4. 대표적인 Encoder-Decoder 모델은?

① BERT  
② GPT  
③ T5  
④ Word2Vec

<details>
<summary>정답</summary>

③

</details>

### 5. Decoder의 Causal Mask 목적은?

① PAD Token 추가  
② 미래 Target Token 차단  
③ Encoder Output 제거  
④ Vocabulary 축소

<details>
<summary>정답</summary>

②

</details>

### 6. 다음 중 올바른 구조 연결은?

① BERT → Decoder-only  
② GPT → Encoder-only  
③ T5 → Encoder-Decoder  
④ Word2Vec → Transformer Decoder

<details>
<summary>정답</summary>

③

</details>

## 마지막 정리

```text
Source Sequence
↓
Encoder
↓
Contextual Representation
↓
Cross-Attention
↓
Decoder
↓
Next Token
↓
반복
↓
Target Sequence
```

핵심은 다음 한 문장입니다.

<mark>Transformer Encoder-Decoder는 Encoder가 입력 전체를 이해하고, Decoder가 Cross-Attention으로 그 정보를 참고하면서 출력 Token을 Autoregressive하게 생성하는 구조입니다.</mark>

## 다음에 이을 글

**Cross-Attention**입니다.  
Self-Attention과 무엇이 다른지, Q는 Decoder에서 오고 K·V는 Encoder에서 오는 이유를 행렬 Shape까지 포함해 자세히 봅니다.
