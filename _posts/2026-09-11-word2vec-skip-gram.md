---
title: Word2Vec · Skip-gram
date: 2026-09-11 23:40:00 +0900
slug: word2vec-skip-gram
permalink: /posts/word2vec-skip-gram/
categories: [AI, 자연어처리]
tags: [자연어처리, Word2Vec, SkipGram, WordEmbedding, Embedding, NegativeSampling, NLP]
math: true
---

Skip-gram은 Word2Vec의 학습 방식 중 하나로, **가운데 단어 Target을 보고 주변 단어 Context를 예측**합니다.  
CBOW와 정확히 반대 방향의 예측 문제를 이용해 Word Embedding을 학습합니다.

<blockquote class="prompt-info">
<p>Skip-gram = 하나의 Target Word를 입력으로 받아 주변 Context Words를 예측하는 Word2Vec 학습 방식입니다.</p>
</blockquote>

예를 들어 문장이 다음과 같다고 하겠습니다.

```text
I love natural language processing
```

Target을 `natural`로 정하면

```text
love      natural      language
 ↑           ↑            ↑
Context     Target       Context
```

Skip-gram은

```text
        natural
       ↙       ↘
    love      language
```

처럼 Target 하나로 주변 Context를 예측합니다.

<mark>Skip-gram은 Target → Context 방향으로 학습합니다.</mark>

<details>
<summary>한 줄로</summary>

가운데 단어 하나를 보고 주변에 어떤 단어가 나타날지 예측하면서 Word Embedding을 학습합니다.

</details>

## CBOW와 가장 큰 차이

CBOW:

```text
love + language
      ↓
   natural
```

Skip-gram:

```text
   natural
   ↙     ↘
love   language
```

따라서 방향은

```text
CBOW      Context → Target
Skip-gram Target  → Context
```

입니다.

| 방식 | 입력 | 예측 |
| --- | --- | --- |
| CBOW | Context Words | Target Word |
| Skip-gram | Target Word | Context Words |

## Window Size

Skip-gram에서도 Window Size가 주변 Context 범위를 결정합니다.

문장:

```text
I really love natural language processing
```

Target:

```text
natural
```

Window Size가 1이면

```text
love [natural] language
```

Context는

```text
love
language
```

입니다.

Window Size가 2이면

```text
really love [natural] language processing
```

Context는

```text
really
love
language
processing
```

입니다.

<mark>Window Size가 커질수록 하나의 Target에서 더 많은 Context 학습 Pair가 만들어질 수 있습니다.</mark>

## 학습 Pair 만들기

문장이 다음과 같다고 하겠습니다.

```text
I love deep learning
```

Window Size가 1이고 Target이 `love`라면

```text
(love, I)
(love, deep)
```

이라는 Pair를 만들 수 있습니다.

Target이 `deep`이라면

```text
(deep, love)
(deep, learning)
```

이 됩니다.

즉 Skip-gram은 학습 데이터를

```text
(Target, Context)
```

형태로 만듭니다.

CBOW처럼 여러 Context를 한 번에 입력하는 것이 아니라 하나의 Target에서 여러 Pair를 생성하는 방식으로 이해하면 쉽습니다.

## 입력과 Embedding Matrix

Vocabulary Size를 $$V$$, Embedding Dimension을 $$N$$이라고 하겠습니다.

Embedding Matrix는

$$W\in\mathbb{R}^{V\times N}$$

으로 볼 수 있습니다.

Target Word를 One-Hot Vector $$\mathbf{x}$$로 표현하면

$$\mathbf{h}=\mathbf{x}W$$

를 통해 해당 단어의 Dense Vector를 얻을 수 있습니다.

One-Hot Vector에서 값이 1인 위치에 해당하는 Matrix의 행을 선택하는 것과 같습니다.

```text
Target Word
 ↓
One-Hot
 ↓
Embedding Matrix
 ↓
Dense Vector
```

학습 과정에서 이 Weight가 수정되며 Word Embedding이 만들어집니다.

## Softmax

Vocabulary 전체를 대상으로 Context Word의 확률을 계산한다면 Softmax를 생각할 수 있습니다.

$$P(w_o\mid w_i)=\frac{e^{u_{w_o}^{T}v_{w_i}}}{\sum_{w=1}^{V}e^{u_w^{T}v_{w_i}}}$$

여기서 핵심만 보면

```text
w_i → Input Target Word
w_o → 실제 Context Word
```

입니다.

정답 Context의 확률을 높이는 방향으로 학습합니다.

하지만 Vocabulary가 매우 크면 분모에서 많은 단어를 계산해야 합니다.

## 큰 Vocabulary의 문제

Vocabulary가 100,000개라고 하겠습니다.

하나의 `(Target, Context)` Pair를 학습할 때마다 Vocabulary 전체에 대한 Softmax를 계산하면 비용이 큽니다.

```text
정답 Context 1개
+
나머지 수많은 Word Score
```

를 반복해서 계산해야 하기 때문입니다.

이를 줄이기 위한 대표적인 방법 중 하나가 **Negative Sampling**입니다.

## Negative Sampling

Negative Sampling에서는 모든 Vocabulary Word를 매번 비교하지 않습니다.

실제 Context Pair를 Positive Sample로 두고 일부 잘못된 단어를 Negative Sample로 뽑습니다.

예:

```text
Target: natural

Positive
(natural, language)

Negative
(natural, banana)
(natural, car)
(natural, table)
```

모델은

```text
natural - language
→ 실제 Context일 가능성을 높임

natural - banana
→ 실제 Context일 가능성을 낮춤
```

처럼 학습합니다.

<blockquote class="prompt-info">
<p>Negative Sampling = 실제 Target-Context Pair와 일부 가짜 Pair만 비교하여 학습 비용을 줄이는 방법입니다.</p>
</blockquote>

## 왜 의미가 학습되나

Corpus에서 비슷한 단어가 비슷한 Context를 반복해서 가진다면, Skip-gram은 이 단어들로 비슷한 주변 단어를 예측해야 합니다.

```text
drink coffee morning
drink tea morning
```

따라서 학습 과정에서 `coffee`와 `tea`처럼 비슷한 Context를 가진 단어가 비슷한 Vector 관계를 가질 수 있습니다. 이것이 분포 가설과 연결되는 지점입니다.

## CBOW와 다시 비교

| 구분 | CBOW | Skip-gram |
| --- | --- | --- |
| 입력 | 주변 Context | Target |
| 출력 | Target | 주변 Context |
| Pair 관점 | 여러 Context → 하나 | 하나 → 여러 Context |
| 학습 속도 | 상대적으로 빠른 편 | 상대적으로 느릴 수 있음 |
| 희귀 단어 | 상대적으로 불리할 수 있음 | 강점을 보일 수 있음 |

```text
CBOW
주변 → 중심

Skip-gram
중심 → 주변
```

## 잘 놓치는 핵심

### 1. Skip-gram은 Target이 입력이다

```text
Target → Context
```

입니다.

CBOW와 반대로 외우지 않도록 합니다.

### 2. 하나의 Target에서 여러 Pair가 만들어진다

Window Size가 커지면 더 많은 주변 Context가 학습 대상이 될 수 있습니다.

### 3. Window Size는 Context 범위를 결정한다

Embedding Dimension과는 다른 Hyperparameter입니다.

### 4. Negative Sampling은 검색 방법이 아니다

Word2Vec의 학습 계산량을 줄이기 위한 학습 기법입니다.

### 5. Negative Sample은 실제 Context가 아닌 단어다

Positive Pair와 구별되도록 학습합니다.

### 6. Embedding Matrix가 학습된다

One-Hot 자체에 의미가 생기는 것이 아니라 Weight가 학습되어 Dense Word Vector를 얻습니다.

### 7. 기본 Word2Vec은 Contextual Embedding이 아니다

같은 단어는 문장마다 별도 Vector를 갖는 것이 아니라 기본적으로 하나의 고정 Vector를 사용합니다.

## 시험·면접

<blockquote class="prompt-info">
<p>단골: Skip-gram의 방향, CBOW와 차이, Window Size, Target-Context Pair, Negative Sampling, Embedding Matrix.</p>
</blockquote>

핵심 암기:

- Skip-gram은 Target으로 Context를 예측한다
- CBOW는 Context로 Target을 예측한다
- Window Size는 주변 단어 범위를 결정한다
- 하나의 Target에서 여러 Context Pair를 만들 수 있다
- Negative Sampling은 전체 Softmax 계산 비용을 줄인다
- Positive는 실제 Context Pair, Negative는 Sampling한 가짜 Pair다
- 학습된 Weight에서 Dense Word Embedding을 얻는다

## 예시로 한 바퀴

문장:

```text
I enjoy machine learning models
```

Target:

```text
machine
```

Window Size가 1이면 Context는

```text
enjoy
learning
```

입니다.

따라서 Skip-gram Pair는

```text
(machine, enjoy)
(machine, learning)
```

입니다.

Target `machine`을 Embedding으로 바꿉니다.

```text
machine
   ↓
Embedding Matrix
   ↓
Target Vector
```

그리고 실제 Context의 Score를 높입니다.

```text
machine → enjoy
machine → learning
```

Negative Sampling을 사용한다면 일부 잘못된 Pair도 만듭니다.

```text
machine → banana
machine → table
```

학습은 실제 Context와의 관계는 높이고 Negative Sample과는 구별되도록 Weight를 수정합니다.

이 과정을 Corpus 전체에 반복하면 Word Embedding을 얻습니다.

## 객관식 6문제

**1.** Skip-gram의 학습 방향은?

- ① Context → Target
- ② Target → Context
- ③ Document → Label
- ④ Vector → Token

<details>
<summary>정답</summary>

②

</details>

**2.** Window Size가 커질 때 일반적으로 발생하는 것은?

- ① 사용할 Context 범위가 넓어진다
- ② Vocabulary가 반드시 1개가 된다
- ③ Embedding Dimension이 자동으로 0이 된다
- ④ Target Word가 사라진다

<details>
<summary>정답</summary>

①

</details>

**3.** Skip-gram 학습 Pair의 형태로 적절한 것은?

- ① (Target, Context)
- ② (Image, Pixel)
- ③ (Document, GPU)
- ④ (Label, Epoch)

<details>
<summary>정답</summary>

①

</details>

**4.** Negative Sampling을 사용하는 주요 이유는?

- ① Vocabulary 전체에 대한 계산 비용을 줄이기 위해
- ② 모든 단어를 삭제하기 위해
- ③ Window Size를 항상 0으로 만들기 위해
- ④ 문서를 이미지로 변환하기 위해

<details>
<summary>정답</summary>

①

</details>

**5.** CBOW와 Skip-gram의 관계로 맞는 것은?

- ① 두 방식의 예측 방향은 반대다
- ② 둘은 Word Embedding과 관계가 없다
- ③ 둘 다 Context만 입력하고 아무것도 예측하지 않는다
- ④ Skip-gram은 Dense Vector를 만들 수 없다

<details>
<summary>정답</summary>

①

</details>

**6.** 기본 Word2Vec에 대한 설명으로 맞는 것은?

- ① 같은 Word Type은 기본적으로 하나의 고정 Embedding을 가진다
- ② 모든 문맥에서 새로운 Vocabulary를 자동 생성한다
- ③ OOV 문제는 절대 발생하지 않는다
- ④ Word Vector 사이의 유사성을 계산할 수 없다

<details>
<summary>정답</summary>

①

</details>

## 다음에 이을 글

Negative Sampling입니다.  
Skip-gram에서 Vocabulary 전체를 Softmax로 계산하는 비용을 줄이기 위해 Positive Pair와 일부 Negative Pair만 학습하는 원리를 더 자세히 살펴봅니다.
