---
title: Dense Retrieval · 밀집 검색
date: 2026-09-11 23:00:00 +0900
slug: dense-retrieval
permalink: /posts/dense-retrieval/
categories: [AI, 자연어처리]
tags: [자연어처리, DenseRetrieval, 정보검색, Embedding, VectorSearch, SemanticSearch, NLP]
math: true
---

Dense Retrieval은 **Query와 Document를 Dense Vector로 변환하고 Vector 사이의 유사도를 이용해 관련 문서를 찾는 검색 방식**입니다.  
Sparse Retrieval이 실제 Term의 일치를 중요하게 봤다면 Dense Retrieval은 **의미적 유사성 Semantic Similarity**을 중심으로 검색합니다.

<blockquote class="prompt-info">
<p>Dense Retrieval = Query와 Document를 Embedding Vector로 바꾸고 Vector 공간에서 의미적으로 가까운 문서를 찾는 검색 방식입니다.</p>
</blockquote>

예를 들어 다음 두 표현을 생각해봅시다.

```text
car
automobile
```

단어 자체는 다릅니다.

Sparse Retrieval에서는 직접적인 Term Matching이 없습니다.

하지만 Embedding Model이 두 표현의 의미가 비슷하다고 학습했다면

```text
car        → [0.21, -0.14, 0.82, ...]
automobile → [0.19, -0.10, 0.79, ...]
```

처럼 가까운 Vector로 표현될 수 있습니다.

<mark>Dense Retrieval의 핵심은 단어가 정확히 같은지가 아니라 Vector 공간에서 의미가 얼마나 가까운지를 보는 것입니다.</mark>

<details>
<summary>한 줄로</summary>

문장을 Embedding으로 바꾼 뒤 의미적으로 가까운 Vector를 검색하는 방식입니다.

</details>

## Dense란 무엇인가

Dense는 **밀집되어 있다**는 뜻입니다.

Sparse Vector:

```text
[0, 0, 0, 1.2, 0, 0, ..., 2.1, 0]
```

Dense Vector:

```text
[0.12, -0.37, 0.81, 0.24, -0.16, ...]
```

Dense Vector는 대부분의 차원에 값이 존재합니다.

```text
Sparse
→ 대부분 0

Dense
→ 대부분 값이 존재
```

Embedding Model은 문장이나 문서를 수백 차원 정도의 Dense Vector로 표현할 수 있습니다.

## Semantic Matching

Dense Retrieval의 핵심은 **Semantic Matching**입니다.

Query:

```text
How can I fix my car?
```

Document:

```text
Automobile repair guide
```

`car`와 `automobile`, `fix`와 `repair`는 표면적인 단어가 다릅니다.

하지만 의미는 유사합니다.

Dense Retrieval에서는 Embedding Vector가 가까우면 관련 문서로 검색할 수 있습니다.

<blockquote class="prompt-info">
<p>Semantic Matching = 실제 단어가 완전히 같지 않아도 의미가 비슷하면 관련성이 높다고 판단하는 방식입니다.</p>
</blockquote>

## 기본 구조

Dense Retrieval은 크게 다음 과정으로 볼 수 있습니다.

```text
Documents
 ↓
Embedding Model
 ↓
Document Vectors
 ↓
Vector Index
```

검색할 때는

```text
Query
 ↓
같은 Embedding Model
 ↓
Query Vector
 ↓
Vector Search
 ↓
Top-k Documents
```

의 흐름을 가집니다.

Query와 Document를 **같은 Vector 공간에서 비교할 수 있도록 표현하는 것**이 중요합니다.

## Embedding

Embedding은 텍스트를 의미 정보를 가진 Vector로 표현하는 방법입니다.

예:

```text
"machine learning"
        ↓
Embedding Model
        ↓
[0.14, -0.32, 0.77, ...]
```

문서도 같은 방식으로 변환합니다.

```text
Document
 ↓
Embedding Model
 ↓
Dense Vector
```

의미가 비슷한 텍스트가 Vector 공간에서도 가까워지도록 학습하는 것이 핵심입니다.

## Query와 Document

Dense Retrieval에서는 Query Vector를 $$\mathbf{q}$$, Document Vector를 $$\mathbf{d}$$라고 표현할 수 있습니다.

```text
Query    → q
Document → d
```

이제 두 Vector 사이의 Similarity를 계산합니다.

대표적으로 Cosine Similarity를 사용할 수 있습니다.

$$\cos(\theta)=\frac{\mathbf{q}\cdot\mathbf{d}}{\|\mathbf{q}\|\|\mathbf{d}\|}$$

유사도가 높을수록 Query와 의미적으로 가까운 Document라고 판단할 수 있습니다.

## Vector Index

Document가 몇 개뿐이라면 Query Vector와 모든 Document Vector를 비교해도 됩니다.

하지만 Document가 수백만 개라면 매 Query마다 전체 Vector를 비교하는 것은 비용이 큽니다.

그래서 Vector Search를 위한 Index를 사용합니다.

```text
Document Embeddings
 ↓
Vector Index
 ↓
Nearest Neighbor Search
```

Query Vector와 가까운 Document Vector를 빠르게 찾는 것이 목적입니다.

## ANN

ANN은 **Approximate Nearest Neighbor**의 약자입니다.

모든 Vector를 완전히 비교하는 대신 가까운 후보를 효율적으로 찾습니다.

```text
Exact Search
→ 정확한 전체 비교
→ 대규모에서 비용 증가

ANN
→ 근사적으로 가까운 Vector 탐색
→ 검색 속도 향상
```

약간의 정확도 손실 가능성을 허용하면서 검색 속도와 메모리 효율을 높이는 방식입니다.

<mark>대규모 Dense Retrieval에서는 ANN Index가 중요한 역할을 합니다.</mark>

## Sparse Retrieval과 차이

Sparse Retrieval과 Dense Retrieval의 가장 중요한 차이는 **무엇을 기준으로 Matching하는가**입니다.

| 구분 | Sparse Retrieval | Dense Retrieval |
| --- | --- | --- |
| 표현 | Sparse Term Vector | Dense Embedding Vector |
| Matching | Lexical | Semantic |
| 대표 방식 | BM25, TF-IDF | Embedding Search |
| 색인 | Inverted Index | Vector Index |
| 강점 | 정확한 키워드 | 의미적 유사성 |
| 약점 | Vocabulary Mismatch | 정확한 키워드를 놓칠 수 있음 |

Sparse Retrieval:

```text
car
↕
car
```

Dense Retrieval:

```text
car
↕ 의미적으로 가까움
automobile
```

으로 기억하면 쉽습니다.

## Bi-Encoder

Dense Retrieval에서 자주 사용하는 구조가 Bi-Encoder입니다.

Query와 Document를 각각 Encoder에 넣어 Vector를 만듭니다.

```text
Query
 ↓
Encoder
 ↓
Query Vector

Document
 ↓
Encoder
 ↓
Document Vector
```

Document Vector는 미리 계산해 저장할 수 있습니다.

검색 시에는 Query Vector만 새로 계산하고 저장된 Document Vector와 비교합니다.

이 때문에 대규모 Retrieval에 적합합니다.

## Cross-Encoder와 차이

Cross-Encoder는 Query와 Document를 함께 입력해 관련도를 계산하므로 더 많은 계산이 필요합니다.

```text
Dense Retriever → 후보 검색
Cross-Encoder   → 후보 재정렬
```

## Hybrid Retrieval

Sparse와 Dense는 서로 다른 장점을 가집니다.

```text
Sparse
→ 정확한 Term Matching

Dense
→ Semantic Matching
```

따라서 두 검색 결과를 결합할 수 있습니다.

```text
BM25
+
Dense Embedding Search
=
Hybrid Retrieval
```

Hybrid Retrieval은 정확한 키워드와 의미적 유사성을 함께 활용하려는 방식입니다.

<mark>Sparse와 Dense는 반드시 경쟁 관계가 아니라 서로 보완할 수 있습니다.</mark>

## 잘 놓치는 핵심

### 1. Dense는 차원이 적다는 뜻만은 아니다

핵심은 Vector의 대부분 차원에 값이 존재하는 밀집 표현이라는 점입니다.

### 2. Dense Retrieval은 Semantic Matching을 중심으로 한다

표면 Term이 달라도 의미가 비슷하면 검색할 수 있습니다.

### 3. Embedding Model이 핵심이다

좋은 Dense Retrieval은 Query와 관련 Document를 Vector 공간에서 가깝게 표현해야 합니다.

### 4. Vector Index는 Inverted Index와 다르다

Sparse Retrieval은 주로 Inverted Index, Dense Retrieval은 Vector Index를 사용합니다.

### 5. ANN은 대규모 Vector 검색을 빠르게 한다

정확한 전체 비교 대신 근사적으로 가까운 Vector를 효율적으로 찾습니다.

### 6. Dense가 Sparse를 항상 이기는 것은 아니다

정확한 Keyword, Code, 고유명사에서는 Sparse가 강할 수 있습니다.

### 7. Retrieval과 Reranking은 다르다

Retriever는 후보를 찾고 Reranker는 후보의 순위를 더 정교하게 다시 계산합니다.

## 시험·면접

<blockquote class="prompt-info">
<p>단골: Dense Vector, Semantic Matching, Embedding, Vector Index, ANN, Sparse Retrieval과 차이, Bi-Encoder와 Reranking.</p>
</blockquote>

핵심 암기:

- Dense Retrieval은 Embedding 기반 의미 검색이다
- Query와 Document를 Dense Vector로 표현한다
- Cosine Similarity나 Dot Product 등을 사용할 수 있다
- 대규모 검색에서는 ANN Vector Index를 사용할 수 있다
- Bi-Encoder는 Document Embedding을 미리 계산할 수 있다
- Dense는 의미 검색에 강하고 Sparse는 정확한 Term Matching에 강하다
- 두 방식을 결합하면 Hybrid Retrieval이 된다

## 예시로 한 바퀴

Query:

```text
How do I repair my automobile?
```

Document A:

```text
Car repair guide
```

Document B:

```text
How to cook pasta
```

Embedding Model을 사용하면

```text
Query      → q
Document A → d1
Document B → d2
```

로 변환됩니다.

의미적으로 Query와 Document A가 비슷하다면

$$Similarity(\mathbf{q},\mathbf{d_1})>Similarity(\mathbf{q},\mathbf{d_2})$$

가 될 수 있습니다.

따라서 Vector Search 결과에서 Document A가 더 높은 순위를 얻습니다.

```text
Natural Language Query
 ↓
Embedding
 ↓
Vector Search
 ↓
Semantic Similarity
 ↓
Top-k Documents
```

이것이 Dense Retrieval의 기본 흐름입니다.

## 객관식 6문제

**1.** Dense Retrieval의 핵심 Matching 방식은?

- ① Semantic Matching
- ② Pixel Matching
- ③ Random Matching
- ④ File Size Matching

<details>
<summary>정답</summary>

①

</details>

**2.** Dense Retrieval에서 Query와 Document를 주로 무엇으로 변환하는가?

- ① Dense Embedding Vector
- ② HTML Table
- ③ Binary Tree만
- ④ Image Pixel만

<details>
<summary>정답</summary>

①

</details>

**3.** 대규모 Dense Vector 검색에 자주 사용되는 개념은?

- ① ANN
- ② DFS만
- ③ Bubble Sort만
- ④ One-Hot Label만

<details>
<summary>정답</summary>

①

</details>

**4.** Sparse Retrieval과 비교한 Dense Retrieval의 강점은?

- ① 의미가 비슷하지만 표현이 다른 문서를 찾는 것
- ② 모든 오류 코드를 반드시 완벽히 찾는 것
- ③ Vector를 사용하지 않는 것
- ④ Term Matching만 수행하는 것

<details>
<summary>정답</summary>

①

</details>

**5.** Bi-Encoder의 특징으로 적절한 것은?

- ① Query와 Document를 각각 Vector로 Encoding할 수 있음
- ② Document를 절대 미리 Encoding할 수 없음
- ③ 반드시 모든 문서를 Query와 함께 입력해야 함
- ④ Embedding을 만들 수 없음

<details>
<summary>정답</summary>

①

</details>

**6.** Sparse와 Dense Retrieval을 함께 사용하는 방식은?

- ① Hybrid Retrieval
- ② Token Deletion
- ③ Gradient Clipping
- ④ Image Segmentation

<details>
<summary>정답</summary>

①

</details>

## 다음에 이을 글

Hybrid Retrieval입니다.  
BM25 같은 Sparse Retrieval의 정확한 Keyword Matching과 Dense Retrieval의 Semantic Matching을 결합해 두 검색 방식의 장점을 함께 활용하는 방법을 살펴봅니다.
