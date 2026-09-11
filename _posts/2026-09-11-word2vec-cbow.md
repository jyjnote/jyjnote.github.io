---
title: Word2Vec · CBOW
date: 2026-09-11 23:20:00 +0900
slug: word2vec-cbow
permalink: /posts/word2vec-cbow/
categories: [AI, 자연어처리]
tags: [자연어처리, Word2Vec, CBOW, WordEmbedding, Embedding, NLP]
math: true
---

CBOW는 Word2Vec의 학습 방식 중 하나로, **주변 단어 Context를 보고 가운데 단어 Target을 예측**합니다.  
이 과정을 반복하면서 단어를 의미 관계가 반영된 Dense Vector로 학습합니다.

<blockquote class="prompt-info">
<p>CBOW = 주변 Context Words를 입력으로 받아 가운데 Target Word를 예측하는 Word2Vec 학습 방식입니다.</p>
</blockquote>

예를 들어 문장이 다음과 같다고 하겠습니다.

```text
I love natural language processing
```

Target Word를 `natural`로 정하면 주변 단어를 이용합니다.

```text
love      natural      language
 ↑           ↑            ↑
Context     Target       Context
```

CBOW는

```text
love + language
       ↓
   natural 예측
```

을 학습합니다.

<mark>CBOW는 Context → Target 방향으로 학습합니다.</mark>

<details>
<summary>한 줄로</summary>

주변 단어들을 보고 가운데 단어를 맞히면서 Word Embedding을 학습합니다.

</details>

## Word2Vec이란

Word2Vec은 단어를 Dense Vector로 표현하기 위한 대표적인 Word Embedding 방법입니다.

기존 One-Hot Encoding을 생각해봅시다.

```text
cat = [1, 0, 0, 0, 0]
dog = [0, 1, 0, 0, 0]
```

서로 다른 단어는 완전히 다른 축에 위치합니다.

이 표현만으로는 `cat`과 `dog`가 의미적으로 비슷하다는 정보를 알기 어렵습니다.

Word2Vec은 학습을 통해

```text
cat → [0.21, -0.31, 0.72, ...]
dog → [0.18, -0.27, 0.69, ...]
```

처럼 Dense Vector를 얻습니다.

의미나 사용 맥락이 비슷한 단어는 Vector 공간에서도 가까워질 수 있습니다.

## 분포 가설

Word2Vec의 핵심 직관은 **비슷한 문맥에서 등장하는 단어는 비슷한 의미를 가진다**는 분포 가설과 연결됩니다.

예:

```text
I drink coffee every morning
I drink tea every morning
```

`coffee`와 `tea`는 비슷한 Context에서 등장합니다.

```text
I drink ___ every morning
```

이런 패턴이 Corpus에서 반복되면 두 단어의 Vector도 비슷한 방향으로 학습될 수 있습니다.

<blockquote class="prompt-info">
<p>비슷한 Context에서 자주 등장하는 단어는 비슷한 Embedding을 가질 가능성이 높습니다.</p>
</blockquote>

## Word2Vec의 두 방식

Word2Vec에는 대표적으로 두 가지 학습 방식이 있습니다.

```text
CBOW
Skip-gram
```

차이는 예측 방향입니다.

| 방식 | 입력 | 예측 |
| --- | --- | --- |
| CBOW | Context Words | Target Word |
| Skip-gram | Target Word | Context Words |

즉

```text
CBOW
Context → Target

Skip-gram
Target → Context
```

입니다.

이 방향은 시험에서 자주 묻습니다.

## Window Size

어떤 단어를 Context로 사용할지는 Window Size에 따라 달라집니다.

문장:

```text
I really love natural language processing
```

Target:

```text
natural
```

Window Size가 1이라면 가까운 단어를 사용합니다.

```text
love [natural] language
```

Context:

```text
love
language
```

Window Size가 2라면 더 넓게 봅니다.

```text
really love [natural] language processing
```

Context:

```text
really
love
language
processing
```

<mark>Window Size가 커질수록 더 넓은 주변 문맥을 학습에 사용합니다.</mark>

## CBOW 학습 데이터 만들기

문장이 다음과 같다고 하겠습니다.

```text
I love deep learning
```

Window Size가 1이라면 다음과 같은 학습 Pair를 만들 수 있습니다.

```text
Context             Target

[I, deep]           love
[love, learning]    deep
```

문장의 경계에서는 사용할 수 있는 Context 수가 달라질 수 있습니다.

핵심은 항상 같습니다.

```text
주변 단어들
    ↓
가운데 단어 예측
```

## Embedding Matrix

Vocabulary Size를 $$V$$, Embedding Dimension을 $$N$$이라고 하겠습니다.

입력층에서 Hidden Layer로 가는 Weight Matrix를 단순화하면

$$W\in\mathbb{R}^{V\times N}$$

으로 볼 수 있습니다.

One-Hot Vector $$\mathbf{x}$$와 곱하면

$$\mathbf{h}=\mathbf{x}W$$

가 됩니다.

One-Hot Vector에는 하나의 위치만 1이므로 사실상 Matrix의 특정 행을 선택하는 것과 같습니다.

```text
One-Hot
   ↓
Embedding Matrix W
   ↓
Dense Word Vector
```

## 여러 Context는 어떻게 합치나

CBOW는 여러 Context Word의 Vector를 하나로 결합해야 합니다.

대표적으로 평균을 사용할 수 있습니다.

Context Vector가

$$\mathbf{v}_1,\mathbf{v}_2,\ldots,\mathbf{v}_C$$

라면 Hidden Representation을

$$\mathbf{h}=\frac{1}{C}\sum_{i=1}^{C}\mathbf{v}_i$$

처럼 만들 수 있습니다.

예:

```text
Context
love
language
```

각 Embedding을 가져와 평균을 낸 뒤 Target Word를 예측합니다.

<blockquote class="prompt-info">
<p>CBOW의 이름에서 Bag of Words가 들어가는 이유처럼 Context의 순서를 직접 구분하지 않고 주변 단어 표현을 합쳐 Target을 예측합니다.</p>
</blockquote>

## 학습의 목적

CBOW는 Context로 Target Word를 맞히도록 Weight를 수정합니다.

```text
love [natural] language

입력  → love, language
정답  → natural
```

정답의 예측 확률을 높이는 과정에서 Embedding Matrix도 함께 학습됩니다.

## CBOW와 Skip-gram

같은 문장을 보겠습니다.

```text
I love natural language
```

Target이 `natural`일 때 CBOW는

```text
love + language
      ↓
   natural
```

입니다.

Skip-gram은 반대입니다.

```text
natural
   ↓
love, language
```

<mark>CBOW는 주변에서 중심을, Skip-gram은 중심에서 주변을 예측합니다.</mark>

## 잘 놓치는 핵심

### 1. CBOW의 입력은 Context다

Target Word가 입력이라고 반대로 기억하면 안 됩니다.

```text
Context → Target
```

입니다.

### 2. CBOW의 출력은 가운데 Target Word다

주변 단어들을 이용해 중심 단어를 예측합니다.

### 3. Window Size가 Context 범위를 결정한다

Window가 커지면 더 멀리 있는 주변 단어까지 사용합니다.

### 4. One-Hot이 최종 Embedding은 아니다

One-Hot은 입력 표현으로 사용할 수 있고 학습된 Weight Matrix에서 Dense Embedding을 얻습니다.

### 5. Context Vector를 합쳐 사용한다

CBOW에서는 주변 Word Vector를 평균하는 방식 등을 사용할 수 있습니다.

### 6. Word2Vec은 분포 가설과 연결된다

비슷한 Context에서 등장하는 단어가 비슷한 Vector를 갖도록 학습될 수 있습니다.

### 7. 기본 Word2Vec은 문맥별 Vector를 만들지 않는다

하나의 Word Type에 하나의 고정된 Embedding을 사용합니다.

## 시험·면접

<blockquote class="prompt-info">
<p>단골: CBOW와 Skip-gram의 방향, Window Size, One-Hot과 Embedding Matrix, Context 평균, Word2Vec의 한계.</p>
</blockquote>

핵심 암기:

- Word2Vec은 Dense Word Embedding을 학습한다
- CBOW는 Context로 Target을 예측한다
- Skip-gram은 Target으로 Context를 예측한다
- Window Size는 주변 Context 범위를 결정한다
- Embedding Matrix의 Weight가 학습된다
- 비슷한 Context의 단어는 비슷한 Vector를 가질 수 있다
- 기본 Word2Vec은 OOV와 다의어 표현에 한계가 있다

## 예시로 한 바퀴

문장:

```text
I enjoy machine learning models
```

Target:

```text
machine
```

Window Size가 1이라면 Context는

```text
enjoy
learning
```

입니다.

CBOW 입력:

```text
[enjoy, learning]
```

각 단어의 Embedding을 가져옵니다.

```text
enjoy    → v1
learning → v2
```

평균 Context Vector:

$$\mathbf{h}=\frac{\mathbf{v}_1+\mathbf{v}_2}{2}$$

이 Vector로 Vocabulary의 단어를 예측합니다.

```text
Context Vector
      ↓
Output Layer
      ↓
P(machine | enjoy, learning)
```

정답 `machine`의 확률이 높아지도록 학습하면서 Embedding Matrix가 수정됩니다.

이 과정을 Corpus 전체에서 반복해 Word Vector를 얻습니다.

## 객관식 6문제

**1.** CBOW의 학습 방향은?

- ① Context → Target
- ② Target → Context
- ③ Document → Image
- ④ Label → Corpus

<details>
<summary>정답</summary>

①

</details>

**2.** Skip-gram의 학습 방향은?

- ① Context → Target
- ② Target → Context
- ③ Vector → Tokenization
- ④ Corpus → Label만

<details>
<summary>정답</summary>

②

</details>

**3.** Window Size가 결정하는 것은?

- ① Embedding 파일 이름
- ② Target 주변에서 사용할 Context 범위
- ③ Vocabulary의 언어
- ④ Optimizer를 반드시 Adam으로 설정

<details>
<summary>정답</summary>

②

</details>

**4.** Word2Vec의 최종적인 단어 표현은?

- ① Dense Vector
- ② HTML
- ③ Raw Text만
- ④ Image Pixel

<details>
<summary>정답</summary>

①

</details>

**5.** 기본 Word2Vec의 한계로 적절한 것은?

- ① 모든 OOV 단어를 자동으로 완벽히 표현
- ② 같은 단어의 문맥별 의미를 하나의 고정 Vector로 표현
- ③ Dense Vector를 만들 수 없음
- ④ Corpus를 사용할 수 없음

<details>
<summary>정답</summary>

②

</details>

**6.** CBOW에서 여러 Context Word Vector를 처리하는 대표적인 방법은?

- ① 평균하여 Hidden Representation 구성
- ② 모든 Vector를 삭제
- ③ 반드시 이미지로 변환
- ④ Vocabulary를 1개로 축소

<details>
<summary>정답</summary>

①

</details>

## 다음에 이을 글

Word2Vec · Skip-gram입니다.  
CBOW가 주변 Context로 가운데 Target을 예측했다면, Skip-gram은 Target Word 하나를 보고 주변 Context Words를 예측합니다.
