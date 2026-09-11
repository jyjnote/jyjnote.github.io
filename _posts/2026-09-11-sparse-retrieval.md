---
title: Sparse Retrieval · 희소 검색
date: 2026-09-11 22:40:00 +0900
slug: sparse-retrieval
permalink: /posts/sparse-retrieval/
categories: [AI, 자연어처리]
tags: [자연어처리, SparseRetrieval, 정보검색, BM25, TFIDF, InvertedIndex, NLP]
math: true
---

Sparse Retrieval은 **문서와 Query를 대부분의 값이 0인 Sparse Vector로 표현하고, 단어의 일치를 중심으로 관련 문서를 찾는 검색 방식**입니다.  
TF-IDF와 BM25가 대표적인 전통적 Sparse Retrieval 방법입니다.

<blockquote class="prompt-info">
<p>Sparse Retrieval = Vocabulary의 Term을 기준으로 Query와 Document의 단어 일치를 이용해 관련 문서를 찾는 검색 방식입니다.</p>
</blockquote>

예를 들어 Vocabulary가 다음과 같다고 하겠습니다.

```text
[AI, NLP, search, model, data]
```

문서가

```text
AI search model
```

이라면 단순한 Vector는

```text
[1, 0, 1, 1, 0]
```

처럼 표현할 수 있습니다.

Vocabulary가 수십만 개라면 대부분의 값은 0이 됩니다.

```text
[0, 0, 0, 2.1, 0, 0, 0, ..., 1.4, 0]
```

이처럼 0이 대부분인 Vector를 Sparse Vector라고 합니다.

<mark>Sparse Retrieval의 핵심은 높은 차원의 희소한 Term Vector와 Lexical Matching입니다.</mark>

<details>
<summary>한 줄로</summary>

검색어와 문서에서 실제로 겹치는 단어를 중심으로 관련 문서를 찾는 검색입니다.

</details>

## Sparse란 무엇인가

Sparse는 **희소하다**는 뜻입니다.

Vocabulary가 100,000개인데 한 문서에서 실제로 사용하는 Term이 100개라면 대부분의 차원은 0입니다.

```text
Vocabulary Size = 100,000
Non-zero Terms  = 100
```

Vector를 단순화하면

```text
[0, 0, 0, 0.8, 0, ..., 1.2, 0]
```

처럼 됩니다.

반대로 대부분의 차원에 값이 들어 있는 Vector는 Dense Vector라고 합니다.

## Lexical Matching

Sparse Retrieval은 기본적으로 **Lexical Matching**, 즉 실제 Term의 일치를 중요하게 봅니다.

Query:

```text
AI search
```

Document:

```text
AI search system
```

은 `AI`, `search`가 직접 겹칩니다.

따라서 높은 관련성을 얻기 쉽습니다.

반면

```text
Query: automobile
Document: car
```

처럼 의미는 비슷하지만 Term이 다르면 기본적인 Sparse Retrieval에서는 직접적인 일치를 찾기 어렵습니다.

<blockquote class="prompt-info">
<p>Lexical Matching = 의미가 비슷한지만 보는 것이 아니라 실제 단어 또는 Token의 일치를 중심으로 검색하는 방식입니다.</p>
</blockquote>

## BM25 기반 Sparse Retrieval

BM25는 대표적인 Sparse Retrieval Ranking 함수입니다.

핵심은

```text
IDF
TF Saturation
Document Length Normalization
```

입니다.

대표적인 형태는

$$BM25(D,Q)=\sum_{t\in Q}IDF(t)\frac{TF(t,D)(k_1+1)}{TF(t,D)+k_1\left(1-b+b\frac{|D|}{avgdl}\right)}$$

입니다.

Query Term과 Document Term의 일치를 기반으로 각 Term의 Score를 계산하고 합산합니다.

<mark>실전 검색에서 Sparse Retrieval을 설명할 때 BM25는 가장 대표적인 기준점 중 하나입니다.</mark>

## 역색인과의 관계

Vocabulary 전체를 매번 비교하면 비효율적입니다.

그래서 Inverted Index를 사용할 수 있습니다.

```text
AI     → D1, D4, D8
search → D1, D3, D8
model  → D2, D4
```

Query가

```text
AI search
```

라면 `AI`, `search`의 Posting List를 조회합니다.

```text
AI     → D1, D4, D8
search → D1, D3, D8
```

여기서 후보 Document를 빠르게 얻을 수 있습니다.

```text
Query
 ↓
Inverted Index
 ↓
Posting List
 ↓
Candidate Documents
 ↓
BM25 등의 Score
 ↓
Ranking
```

## 검색 흐름

사용자가 다음 Query를 입력했다고 하겠습니다.

```text
machine learning
```

전통적인 Sparse Retrieval 흐름을 단순화하면

```text
Query
 ↓
Normalization · Tokenization
 ↓
Query Terms
 ↓
Inverted Index Lookup
 ↓
Candidate Documents
 ↓
TF-IDF 또는 BM25 Score
 ↓
Ranking
 ↓
Top-k Documents
```

가 됩니다.

여기서 `Top-k`는 Score가 높은 상위 k개의 결과를 의미합니다.

## Sparse와 Dense의 차이

Dense Retrieval은 문장이나 문서를 비교적 작은 Dense Vector로 변환하여 의미적 유사성을 비교합니다.

예:

```text
Sparse Vector
[0, 0, 1.4, 0, ..., 2.1, 0]

Dense Vector
[0.12, -0.37, 0.81, 0.24, ...]
```

| 구분 | Sparse Retrieval | Dense Retrieval |
| --- | --- | --- |
| 표현 | 고차원 Sparse Vector | 저차원 Dense Vector |
| 기준 | Term 일치 중심 | 의미 유사성 중심 |
| 대표 | TF-IDF, BM25 | Embedding Retrieval |
| 색인 | Inverted Index | Vector Index |
| 장점 | 정확한 키워드에 강함 | 의미가 비슷한 표현에 강함 |

## 예시로 차이 보기

Query:

```text
car repair
```

Document A:

```text
car repair service
```

Document B:

```text
automobile maintenance service
```

Sparse Retrieval에서는 A가 유리합니다.

```text
car    → 일치
repair → 일치
```

B는 의미는 비슷하지만 표면 Term이 다릅니다.

```text
car        ≠ automobile
repair     ≠ maintenance
```

Dense Retrieval은 Embedding이 의미 관계를 잘 학습했다면 B도 관련 문서로 찾을 가능성이 있습니다.

## 약점

가장 큰 약점은 **Vocabulary Mismatch**입니다.

Query와 Document가 같은 의미를 표현해도 서로 다른 단어를 사용하면 일치가 약해질 수 있습니다.

```text
Query: car
Document: automobile
```

또한 기본적인 Term 기반 표현은 깊은 문맥이나 단어 순서를 충분히 반영하기 어렵습니다.

```text
dog bites man
man bites dog
```

BoW 관점에서는 같은 Term을 포함합니다.

하지만 의미는 다릅니다.

<blockquote class="prompt-warning">
<p>Sparse Retrieval은 단어 일치에는 강하지만 동의어, 문맥, 의미적 유사성을 직접 처리하는 데 한계가 있습니다.</p>
</blockquote>

## Hybrid Retrieval

Sparse와 Dense는 서로 장단점이 다릅니다.

그래서 두 방식을 결합할 수 있습니다.

```text
Sparse Retrieval
+
Dense Retrieval
=
Hybrid Retrieval
```

예를 들어

```text
BM25 Score
+
Embedding Similarity
```

를 함께 활용할 수 있습니다.

Sparse는 정확한 키워드를 잡고 Dense는 의미적으로 비슷한 표현을 찾는 식입니다.

<mark>Hybrid Retrieval은 Lexical Matching과 Semantic Matching의 장점을 함께 활용하려는 접근입니다.</mark>

## 잘 놓치는 핵심

### 1. Sparse는 검색 결과가 적다는 뜻이 아니다

Vector의 대부분의 값이 0이라는 뜻입니다.

### 2. Sparse Retrieval은 Lexical Matching과 밀접하다

실제 Term의 일치를 중심으로 관련성을 계산합니다.

### 3. BM25는 대표적인 Sparse Retrieval 방법이다

TF Saturation과 문서 길이 보정을 포함하는 Ranking 함수입니다.

### 4. 역색인과 잘 연결된다

Query Term의 Posting List를 이용해 후보 Document를 빠르게 찾을 수 있습니다.

### 5. Sparse와 Dense는 반대되는 장점이 있다

Sparse는 정확한 Term, Dense는 의미적 유사성에 상대적으로 강합니다.

### 6. Hybrid Retrieval로 결합할 수 있다

두 방식 중 하나만 반드시 선택해야 하는 것은 아닙니다.

### 7. Sparse Retrieval과 Sparse Vector는 구분해서 이해한다

Sparse Vector는 표현 형태이고, Sparse Retrieval은 이런 희소한 Term 표현을 활용하는 검색 방식입니다.

## 시험·면접

<blockquote class="prompt-info">
<p>단골: Sparse의 의미, Lexical Matching, BM25와 역색인의 관계, Dense Retrieval과 차이, Vocabulary Mismatch, Hybrid Retrieval.</p>
</blockquote>

핵심 암기:

- Sparse Vector는 대부분의 성분이 0인 Vector다
- Sparse Retrieval은 Term Matching을 중심으로 검색한다
- TF-IDF와 BM25가 대표적으로 연결된다
- Inverted Index를 이용해 효율적인 검색이 가능하다
- 정확한 키워드와 고유명사 검색에 강하다
- 동의어와 의미적 유사성에는 한계가 있다
- Dense Retrieval과 결합하면 Hybrid Retrieval이 된다

## 예시로 한 바퀴

문서가 다음과 같다고 하겠습니다.

```text
D1: AI search system
D2: machine learning retrieval
D3: AI retrieval model
```

Query:

```text
AI retrieval
```

역색인은

```text
AI        → D1, D3
retrieval → D2, D3
```

처럼 구성될 수 있습니다.

두 Query Term을 모두 포함하는 D3는 높은 관련성을 얻을 가능성이 큽니다.

```text
Query Terms
 ↓
Posting Lists
 ↓
D1, D2, D3 후보
 ↓
BM25 Score
 ↓
Ranking
```

이것이 Sparse Retrieval의 기본적인 검색 흐름입니다.

## 객관식 6문제

**1.** Sparse Vector의 가장 적절한 설명은?

- ① 모든 값이 반드시 1인 Vector
- ② 대부분의 값이 0인 Vector
- ③ 차원이 반드시 2인 Vector
- ④ 이미지에만 사용하는 Vector

<details>
<summary>정답</summary>

②

</details>

**2.** Sparse Retrieval이 주로 사용하는 Matching 방식은?

- ① Lexical Matching
- ② Pixel Matching
- ③ Audio Matching
- ④ Random Matching

<details>
<summary>정답</summary>

①

</details>

**3.** 대표적인 Sparse Retrieval Ranking 함수는?

- ① ReLU
- ② BM25
- ③ Softmax
- ④ Dropout

<details>
<summary>정답</summary>

②

</details>

**4.** Sparse Retrieval과 잘 연결되는 색인 구조는?

- ① Inverted Index
- ② Stack Frame
- ③ Heap Sort
- ④ Activation Map

<details>
<summary>정답</summary>

①

</details>

**5.** Sparse Retrieval의 대표적인 약점은?

- ① 정확한 키워드를 전혀 찾지 못함
- ② 서로 다른 단어로 표현된 의미적 유사성을 놓칠 수 있음
- ③ Document를 저장할 수 없음
- ④ TF를 계산할 수 없음

<details>
<summary>정답</summary>

②

</details>

**6.** Sparse Retrieval과 Dense Retrieval을 결합한 방식은?

- ① Binary Retrieval
- ② Hybrid Retrieval
- ③ Linear Regression
- ④ Token Pruning

<details>
<summary>정답</summary>

②

</details>

## 다음에 이을 글

Dense Retrieval입니다.  
Sparse Retrieval이 실제 Term의 일치를 중심으로 검색했다면, Dense Retrieval은 Embedding Vector를 이용해 Query와 Document의 의미적 유사성을 중심으로 검색합니다.
