---
title: 코사인 유사도 · Cosine Similarity
date: 2026-09-11 22:00:00 +0900
slug: cosine-similarity
permalink: /posts/cosine-similarity/
categories: [AI, 자연어처리]
tags: [자연어처리, CosineSimilarity, 코사인유사도, Vector, TFIDF, InformationRetrieval, NLP]
math: true
---

코사인 유사도 Cosine Similarity는 **두 Vector가 얼마나 같은 방향을 바라보는지** 측정하는 방법입니다.  
문서 길이 자체보다 단어 분포의 방향이 얼마나 비슷한지를 비교할 때 자주 사용합니다.

<blockquote class="prompt-info">
<p>코사인 유사도 = 두 Vector 사이 각도의 Cosine 값을 이용해 방향의 유사성을 측정합니다.</p>
</blockquote>

공식은 다음과 같습니다.

$$\cos(\theta)=\frac{\mathbf{A}\cdot\mathbf{B}}{\|\mathbf{A}\|\|\mathbf{B}\|}$$

여기서

```text
A · B       → Dot Product
||A||       → A의 크기
||B||       → B의 크기
θ           → 두 Vector 사이의 각도
```

입니다.

<mark>코사인 유사도는 Vector의 절대적인 크기보다 방향이 얼마나 비슷한지를 봅니다.</mark>

<details>
<summary>한 줄로</summary>

두 Vector가 같은 방향을 볼수록 Cosine Similarity가 커집니다.

</details>

## 가장 먼저 직관

두 Vector가 있다고 하겠습니다.

```text
A → ↗
B → ↗
```

방향이 거의 같습니다.

```text
θ ≈ 0°
cos(θ) ≈ 1
```

따라서 매우 유사합니다.

반대로

```text
A → ↑
B → →
```

서로 직각입니다.

```text
θ = 90°
cos(θ) = 0
```

방향상 유사성이 없습니다.

반대 방향이라면

```text
A → →
B → ←
```

```text
θ = 180°
cos(θ) = -1
```

이 됩니다.

## 값의 범위

일반적인 실수 Vector에서 코사인 유사도의 범위는

$$-1\leq\cos(\theta)\leq1$$

입니다.

```text
1   → 같은 방향
0   → 직각
-1  → 완전히 반대 방향
```

<blockquote class="prompt-warning">
<p>코사인 유사도의 일반적인 범위는 -1부터 1입니다. 항상 0부터 1인 것은 아닙니다.</p>
</blockquote>

다만 BoW나 TF-IDF처럼 모든 성분이 음수가 아닌 Vector에서는 Dot Product가 음수가 될 수 없습니다.

따라서 이런 표현에서는 보통

```text
0 ~ 1
```

범위에서 관찰됩니다.

## Dot Product

공식의 분자를 먼저 봅시다.

$$\mathbf{A}\cdot\mathbf{B}=\sum_{i=1}^{n}A_iB_i$$

예:

```text
A = [1, 2]
B = [2, 1]
```

그러면

$$\mathbf{A}\cdot\mathbf{B}=1\times2+2\times1=4$$

입니다.

같은 위치의 값을 곱하고 모두 더합니다.

## Vector의 크기

Vector A의 크기는 다음과 같습니다.

$$\|\mathbf{A}\|=\sqrt{\sum_{i=1}^{n}A_i^2}$$

예:

```text
A = [3, 4]
```

이면

$$\|\mathbf{A}\|=\sqrt{3^2+4^2}=5$$

입니다.

코사인 유사도에서는 Dot Product를 두 Vector 크기의 곱으로 나눕니다.

## 직접 계산

두 Vector가 다음과 같다고 하겠습니다.

```text
A = [1, 1]
B = [2, 2]
```

Dot Product:

$$\mathbf{A}\cdot\mathbf{B}=1\times2+1\times2=4$$

Vector 크기:

$$\|\mathbf{A}\|=\sqrt{1^2+1^2}=\sqrt{2}$$

$$\|\mathbf{B}\|=\sqrt{2^2+2^2}=\sqrt{8}$$

따라서

$$\cos(\theta)=\frac{4}{\sqrt{2}\sqrt{8}}=1$$

입니다.

A와 B의 크기는 다르지만 방향은 같습니다.

```text
A = [1, 1]
B = [2, 2]
```

B가 A보다 두 배 크더라도 Cosine Similarity는 1입니다.

<mark>Vector의 배수가 달라도 방향이 같다면 코사인 유사도는 1이 될 수 있습니다.</mark>

## 왜 문서 비교에 좋은가

문서 A:

```text
AI AI NLP
```

문서 B:

```text
AI AI AI AI NLP NLP
```

단어 빈도 Vector를 단순화하면

```text
A = [2, 1]
B = [4, 2]
```

입니다.

B는 A보다 길지만 단어의 비율은 같습니다.

따라서 두 Vector는 같은 방향을 가리킵니다.

```text
Cosine Similarity = 1
```

즉 문서 길이가 달라도 **단어 구성 비율이 비슷하면 높은 유사도**를 얻을 수 있습니다.

## Euclidean Distance와 차이

Euclidean Distance는 두 점 사이의 실제 거리를 봅니다.

$$d(\mathbf{A},\mathbf{B})=\sqrt{\sum_{i=1}^{n}(A_i-B_i)^2}$$

반면 Cosine Similarity는 방향을 봅니다.

예:

```text
A = [1, 1]
B = [10, 10]
```

두 점의 Euclidean Distance는 큽니다.

하지만 두 Vector는 같은 방향이므로

```text
Cosine Similarity = 1
```

입니다.

| 방법 | 주로 보는 것 |
| --- | --- |
| Euclidean Distance | 두 점 사이 거리 |
| Cosine Similarity | 두 Vector의 방향 |
| Dot Product | 방향과 크기의 영향을 함께 받음 |

## TF-IDF와 코사인 유사도

정보 검색에서는 문서를 TF-IDF Vector로 표현한 뒤 코사인 유사도를 사용할 수 있습니다.

```text
Query
 ↓
TF-IDF Vector Q

Document
 ↓
TF-IDF Vector D
```

그리고

$$score(Q,D)=\frac{\mathbf{Q}\cdot\mathbf{D}}{\|\mathbf{Q}\|\|\mathbf{D}\|}$$

를 계산합니다.

Score가 클수록 Query와 Document의 방향이 비슷하다고 볼 수 있습니다.

```text
Query
 ↓
후보 Document
 ↓
Cosine Similarity 계산
 ↓
Score가 높은 순으로 정렬
```

## 정규화 관점

Vector를 길이 1로 정규화한다고 하겠습니다.

$$\hat{\mathbf{A}}=\frac{\mathbf{A}}{\|\mathbf{A}\|}$$

$$\hat{\mathbf{B}}=\frac{\mathbf{B}}{\|\mathbf{B}\|}$$

그러면 두 정규화 Vector의 Dot Product는

$$\hat{\mathbf{A}}\cdot\hat{\mathbf{B}}=\cos(\theta)$$

가 됩니다.

즉 코사인 유사도는 **L2 Normalization 후 Dot Product**로도 이해할 수 있습니다.

<blockquote class="prompt-info">
<p>L2 정규화된 두 Vector에서는 Dot Product가 곧 Cosine Similarity입니다.</p>
</blockquote>

## 0 Vector 문제

다음 Vector를 생각해봅시다.

```text
A = [0, 0, 0]
```

크기는

$$\|\mathbf{A}\|=0$$

입니다.

코사인 유사도 공식의 분모에 Vector 크기가 들어가므로 0으로 나누게 됩니다.

따라서 Zero Vector와의 Cosine Similarity는 그대로 계산할 수 없습니다.

<blockquote class="prompt-danger">
<p>Zero Vector는 크기가 0이므로 일반적인 코사인 유사도 공식이 정의되지 않습니다.</p>
</blockquote>

실제 구현에서는 Zero Vector 여부를 확인해야 합니다.

## 잘 놓치는 핵심

### 1. Similarity이지 Distance가 아니다

값이 클수록 더 비슷합니다.

Euclidean Distance처럼 값이 작을수록 가깝다는 개념과 구분해야 합니다.

### 2. 일반적인 범위는 -1부터 1이다

다만 TF-IDF처럼 Non-negative Vector에서는 보통 0부터 1 범위가 됩니다.

### 3. Vector 크기가 아니라 방향을 본다

한 Vector가 다른 Vector의 양의 배수라면 유사도는 1입니다.

### 4. Dot Product와 완전히 같지 않다

일반 Dot Product는 Vector 크기의 영향도 받습니다.

Cosine Similarity는 크기로 나누어 방향을 비교합니다.

### 5. L2 Normalization과 연결된다

길이가 1인 Vector끼리는 Dot Product가 Cosine Similarity와 같습니다.

### 6. 역색인과 역할이 다르다

역색인은 후보 Document 검색, 코사인 유사도는 Vector 간 유사성 측정에 사용됩니다.

## 시험·면접

<blockquote class="prompt-info">
<p>단골: 공식, 값의 범위, Dot Product와 차이, Euclidean Distance와 차이, TF-IDF와 관계, Zero Vector 문제.</p>
</blockquote>

핵심 암기:

- Cosine Similarity는 Vector 사이의 방향을 비교한다
- 일반적인 값의 범위는 -1부터 1이다
- 같은 방향이면 1, 직각이면 0, 반대 방향이면 -1이다
- Non-negative Vector에서는 보통 0부터 1 범위다
- L2 정규화된 Vector에서는 Dot Product가 Cosine Similarity다
- Zero Vector에서는 일반적인 공식이 정의되지 않는다

## 예시로 한 바퀴

다음 두 문서를 Vector로 표현했다고 하겠습니다.

```text
D1 = [1, 2]
D2 = [2, 1]
```

Dot Product:

$$\mathbf{D_1}\cdot\mathbf{D_2}=1\times2+2\times1=4$$

각 Vector의 크기:

$$\|\mathbf{D_1}\|=\sqrt{1^2+2^2}=\sqrt{5}$$

$$\|\mathbf{D_2}\|=\sqrt{2^2+1^2}=\sqrt{5}$$

따라서

$$\cos(\theta)=\frac{4}{\sqrt{5}\sqrt{5}}=\frac{4}{5}=0.8$$

입니다.

두 Vector가 완전히 같은 방향은 아니지만 상당히 비슷한 방향을 가진다고 볼 수 있습니다.

## 객관식 6문제

**1.** 코사인 유사도가 주로 비교하는 것은?

- ① Vector의 방향
- ② 문서 파일 크기
- ③ Token 개수만
- ④ Vocabulary 이름

<details>
<summary>정답</summary>

①

</details>

**2.** 두 Vector가 같은 방향이면 코사인 유사도는?

- ① -1
- ② 0
- ③ 0.5
- ④ 1

<details>
<summary>정답</summary>

④

</details>

**3.** 두 Vector가 직각일 때 코사인 유사도는?

- ① -1
- ② 0
- ③ 1
- ④ 무조건 2

<details>
<summary>정답</summary>

②

</details>

**4.** `A=[1,1]`, `B=[10,10]`일 때 코사인 유사도는?

- ① 0
- ② 0.1
- ③ 1
- ④ 10

<details>
<summary>정답</summary>

③

</details>

**5.** L2 정규화된 두 Vector에서 Cosine Similarity와 같은 것은?

- ① Dot Product
- ② DF
- ③ IDF
- ④ Euclidean Norm의 합

<details>
<summary>정답</summary>

①

</details>

**6.** Zero Vector에서 문제가 발생하는 이유는?

- ① Dot Product가 항상 1이라서
- ② Vector의 크기가 0이라 분모가 0이 되어서
- ③ Vocabulary가 반드시 0개라서
- ④ Cosine 값이 반드시 -1이라서

<details>
<summary>정답</summary>

②

</details>

## 다음에 이을 글

정보 검색 · Information Retrieval입니다.  
역색인으로 후보 문서를 찾고, TF-IDF와 코사인 유사도 같은 방법으로 Query와 Document의 관련도를 계산하는 전체 검색 과정을 살펴봅니다.
