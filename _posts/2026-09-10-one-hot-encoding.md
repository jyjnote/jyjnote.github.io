---
title: 원-핫 인코딩 One-Hot Encoding
date: 2026-09-10 10:00:00 +0900
slug: one-hot-encoding
permalink: /posts/one-hot-encoding/
categories: [AI, 자연어처리]
tags: [자연어처리, OneHotEncoding, Vocabulary, 벡터표현, NLP]
math: true
---
단어를 **하나만 1이고 나머지는 0인 벡터**로 바꾸는 표현 방법입니다.  
Vocabulary에서 각 Token이 차지하는 위치를 그대로 벡터 위치로 사용합니다.

<blockquote class="prompt-info">
<p>One-Hot Encoding = Token마다 고유한 위치를 하나 정하고, 그 위치만 1로 표시합니다.</p>
</blockquote>

예:

```text
Vocabulary
apple
banana
orange

```
One-Hot Vector:

```text
apple  → [1, 0, 0]
banana → [0, 1, 0]
orange → [0, 0, 1]

```

<mark>벡터 길이는 Vocabulary 크기와 같고, 하나의 Token을 표현할 때 1은 하나뿐입니다.</mark>

<details>
<summary>한 줄로</summary>

단어의 번호를 벡터의 위치로 바꾼 가장 단순한 표현입니다.

</details>

## 왜 필요한가
컴퓨터는 문자열보다 숫자를 계산하기 쉽습니다.

```text
apple
banana
orange

```
를 그대로 넣는 대신

```text
apple  → [1, 0, 0]
banana → [0, 1, 0]
orange → [0, 0, 1]

```
처럼 숫자 벡터로 바꿉니다.

```text
Token
  ↓
Vocabulary
  ↓
Index
  ↓
One-Hot Vector

```

## Vocabulary가 먼저 필요하다
One-Hot Encoding을 하려면 먼저 Vocabulary를 정합니다.

```text
apple
banana
orange
grape

```
Index:

```text
apple  → 0
banana → 1
orange → 2
grape  → 3

```
Vocabulary 크기가 $$|V|=4$$이면 One-Hot Vector의 차원도 4입니다.

```text
apple  → [1, 0, 0, 0]
banana → [0, 1, 0, 0]
orange → [0, 0, 1, 0]
grape  → [0, 0, 0, 1]

```

<blockquote class="prompt-info">
<p>Vocabulary의 순서가 One-Hot Vector에서 1이 들어갈 위치를 결정합니다.</p>
</blockquote>

## 벡터 만드는 법
Vocabulary가 다음과 같다고 하겠습니다.

```text
0 → apple
1 → banana
2 → orange
3 → grape

```
`orange`의 Index는 2입니다.
따라서 One-Hot Vector는

```text
[0, 0, 1, 0]

```
입니다.
일반적으로 단어 $$w_i$$의 One-Hot Vector는 $$\mathbf{x}_i=[0,\ldots,0,1,0,\ldots,0]$$처럼 표현할 수 있습니다.
1의 위치가 해당 Token의 Index입니다.

## 차원
Vocabulary 크기가 $$|V|$$라면 One-Hot Vector의 차원도 $$|V|$$입니다.

```text
Vocabulary = 5
→ Vector Dimension = 5

Vocabulary = 10,000
→ Vector Dimension = 10,000

Vocabulary = 100,000
→ Vector Dimension = 100,000

```

<blockquote class="prompt-warning">
<p>Vocabulary가 커지면 One-Hot Vector의 차원도 그대로 커집니다.</p>
</blockquote>

## Sparse Vector
One-Hot Vector는 거의 모든 값이 0입니다.
Vocabulary가 10,000개라면

```text
[0, 0, 0, ..., 1, ..., 0]

```
처럼 됩니다.

```text
1의 개수 = 1
0의 개수 = 9,999

```
대부분의 값이 0인 벡터를 **희소 벡터 Sparse Vector**라고 합니다.

<mark>One-Hot Encoding은 대표적인 고차원 희소 표현입니다.</mark>

## 의미 관계를 표현하지 못한다
다음 단어를 보겠습니다.

```text
cat
dog
car

```
One-Hot:

```text
cat → [1, 0, 0]
dog → [0, 1, 0]
car → [0, 0, 1]

```
사람이 보면 `cat`과 `dog`가 `cat`과 `car`보다 의미적으로 가깝습니다.
하지만 One-Hot은 그 차이를 표현하지 못합니다.
`cat`과 `dog`의 유클리드 거리는 $$\sqrt{2}$$입니다.
`cat`과 `car`의 거리도 $$\sqrt{2}$$입니다.

<blockquote class="prompt-danger">
<p>One-Hot Encoding은 Token의 정체는 구분하지만 Token 사이의 의미 유사도는 표현하지 못합니다.</p>
</blockquote>

## NLP에서의 위치
지금까지 흐름:

```text
Corpus
  ↓
Normalization
  ↓
Tokenization
  ↓
Vocabulary
  ↓
One-Hot Encoding
  ↓
BoW · DTM
  ↓
TF-IDF

```
One-Hot은 **Token 하나를 숫자 벡터로 바꾸는 가장 기본적인 표현**입니다.
이후 BoW와 DTM은 Vocabulary를 이용해 문서 전체를 표현합니다.

## One-Hot과 BoW
Vocabulary:

```text
I
love
AI
NLP

```
각 Token:

```text
I    → [1, 0, 0, 0]
love → [0, 1, 0, 0]
AI   → [0, 0, 1, 0]
NLP  → [0, 0, 0, 1]

```
문장:

```text
I love AI

```
각 One-Hot을 더하면

```text
[1, 1, 1, 0]

```
입니다.

```text
One-Hot → Token 하나
BoW     → 문서 전체의 Token 출현

```
같은 단어가 여러 번 나오면 횟수도 누적됩니다.

```text
I love AI AI
→ [1, 1, 2]

```

<mark>One-Hot은 Token 하나의 표현이고, BoW는 문서 전체의 단어 출현을 표현합니다.</mark>

## One-Hot과 Embedding
One-Hot:

```text
cat → [1, 0, 0, 0, ...]

```
Embedding:

```text
cat → [0.21, -0.48, 0.77, ...]

```

| 구분 | One-Hot | Embedding |
| --- | --- | --- |
| 차원 | Vocabulary 크기 | 보통 더 작음 |
| 값 | 0 또는 1 | 실수 |
| 형태 | Sparse | Dense |
| 의미 관계 | 표현 어려움 | 학습 가능 |
| 학습 | 필요 없음 | 학습 가능 |

Embedding은 One-Hot의 고차원성과 의미 표현 문제를 보완합니다.

## Embedding과 연결
Vocabulary 크기가 $$|V|$$이고 Embedding 차원이 $$d$$라면 Embedding Matrix는 $$E\in\mathbb{R}^{|V|\times d}$$입니다.
One-Hot Vector를 $$\mathbf{x}$$라고 하면 $$\mathbf{x}E$$는 Embedding Matrix에서 해당 Token의 행을 고르는 것과 같습니다.

```text
One-Hot
[0, 1, 0]

→ 두 번째 Token의 Embedding 선택

```

<blockquote class="prompt-info">
<p>Embedding Lookup은 개념적으로 One-Hot Vector로 Embedding Matrix의 한 행을 고르는 과정입니다.</p>
</blockquote>

## OOV 문제
Vocabulary에 없는 단어는 One-Hot 위치가 없습니다.

```text
Vocabulary
apple
banana
orange

새 단어
grape

```
`grape`에 대응하는 Index가 없으므로 바로 표현할 수 없습니다.
전통적으로는 `<UNK>` Token을 추가해 처리하기도 합니다.
하지만 서로 다른 모르는 단어가 모두 `<UNK>`로 합쳐지는 문제가 있습니다.
이 문제는 Subword Tokenization에서 더 유연하게 처리합니다.

## 단점
대표적인 약점:
1. Vocabulary가 커지면 차원도 커짐
2. 대부분 값이 0인 Sparse Vector
3. Token 사이 의미 관계를 표현하지 못함
4. OOV 처리 어려움
5. 메모리 사용이 비효율적일 수 있음
이 문제들이 이후 Word2Vec, GloVe, FastText 같은 Embedding으로 이어지는 이유입니다.

## 잘 놓치는 핵심

### 1. 벡터 길이 = Vocabulary 크기
Vocabulary가 10,000개면 One-Hot Vector도 10,000차원입니다.

### 2. 1은 하나뿐
한 Token을 표현할 때 하나의 위치만 1입니다.

### 3. One-Hot은 의미를 모른다
`cat`과 `dog`의 의미적 유사성을 표현하지 못합니다.

### 4. One-Hot과 BoW는 다르다
One-Hot은 Token 하나, BoW는 문서 전체를 표현합니다.

### 5. 고차원 Sparse Vector다
Vocabulary가 커질수록 비효율적입니다.

### 6. Embedding의 기초가 된다
Embedding Lookup의 직관을 이해하는 데 One-Hot이 도움이 됩니다.

## 시험·면접

<blockquote class="prompt-info">
<p>단골: Vocabulary 크기와 벡터 차원, Sparse Vector, 의미 유사도 표현 불가, Label Encoding과 차이, Embedding과 비교.</p>
</blockquote>

자주 나오는 문장:
- One-Hot Vector의 차원은 Vocabulary 크기와 같다
- 한 위치만 1이고 나머지는 0이다
- 고차원 희소 벡터다
- Token 사이 의미적 유사도를 표현하지 못한다
- OOV Token은 별도 처리가 필요하다
- Embedding은 저차원 Dense Vector로 의미 관계를 학습할 수 있다

## 예시로 한 바퀴
Vocabulary:

```text
cat
dog
car
apple

```
Index:

```text
cat   → 0
dog   → 1
car   → 2
apple → 3

```
One-Hot:

```text
cat   → [1, 0, 0, 0]
dog   → [0, 1, 0, 0]
car   → [0, 0, 1, 0]
apple → [0, 0, 0, 1]

```
`dog`의 벡터 차원은 $$4$$입니다.
1의 개수는 $$1$$이고 0의 개수는 $$3$$입니다.
`cat`과 `dog`의 내적은 $$[1,0,0,0]\cdot[0,1,0,0]=0$$입니다.
서로 다른 Token이라는 것은 알지만 의미가 비슷한지는 알 수 없습니다.

## 객관식 6문제
**1.** One-Hot Encoding의 특징은?
- ① 모든 값이 1
- ② 하나만 1이고 나머지는 0
- ③ 모든 값이 실수
- ④ 항상 2차원

<details>
<summary>정답</summary>

②

</details>

**2.** Vocabulary 크기가 5,000이면 One-Hot Vector의 차원은?
- ① 1
- ② 5
- ③ 500
- ④ 5,000

<details>
<summary>정답</summary>

④

</details>

**3.** One-Hot Vector의 대표적인 특징은?
- ① 저차원 Dense Vector
- ② 고차원 Sparse Vector
- ③ 의미 유사도를 직접 학습
- ④ OOV가 없음

<details>
<summary>정답</summary>

②

</details>

**4.** 서로 다른 두 One-Hot Vector의 내적은 일반적으로?
- ① 0
- ② 1
- ③ 항상 -1
- ④ Vocabulary 크기

<details>
<summary>정답</summary>

①

</details>

**5.** One-Hot과 Embedding의 차이로 맞는 것은?
- ① One-Hot이 의미 유사도를 더 잘 표현
- ② Embedding은 보통 저차원 Dense Vector
- ③ Embedding은 항상 0과 1만 사용
- ④ 둘은 완전히 같은 표현

<details>
<summary>정답</summary>

②

</details>

**6.** One-Hot과 BoW의 관계로 맞는 것은?
- ① One-Hot은 문서 전체, BoW는 Token 하나
- ② One-Hot은 Token 하나, BoW는 문서의 Token 출현을 표현
- ③ 둘 다 순서를 완벽히 표현
- ④ 둘 다 의미 Embedding

<details>
<summary>정답</summary>

②

</details>

## 다음에 이을 글
Bag of Words입니다.  
문서 안에서 각 Token이 얼마나 등장했는지를 Vocabulary 기준 벡터로 표현합니다.
