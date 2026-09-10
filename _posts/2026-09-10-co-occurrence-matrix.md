---
title: 동시출현 행렬 Co-occurrence Matrix
date: 2026-09-10 11:10:00 +0900
slug: co-occurrence-matrix
permalink: /posts/co-occurrence-matrix/
categories: [AI, 자연어처리]
tags: [자연어처리, CoOccurrenceMatrix, 동시출현행렬, DistributionalSemantics, PMI, NLP]
math: true
---
단어들이 **주변 문맥에서 얼마나 자주 함께 등장하는지**를 행렬로 표현하는 방법입니다.  
단순히 한 문서에 같이 있었는지가 아니라, 보통 일정한 **Window 안에서 함께 나타난 횟수**를 셉니다.

<blockquote class="prompt-info">
<p>동시출현 행렬 = 어떤 단어 주변에 다른 단어가 얼마나 자주 등장했는지를 세어 만든 행렬입니다.</p>
</blockquote>

예:

```text
I like deep learning

```
Window 크기를 1로 두면 `deep`의 주변 단어는

```text
like
learning

```
입니다.
따라서 `deep`과 `like`, `deep`과 `learning`의 동시출현 횟수를 증가시킵니다.

<mark>동시출현 행렬은 “비슷한 문맥에서 등장하는 단어는 비슷한 의미를 가질 수 있다”는 직관에서 출발합니다.</mark>

<details>
<summary>한 줄로</summary>

각 단어 주변에 어떤 단어가 얼마나 자주 나타나는지를 행렬로 정리한 것입니다.

</details>

## 분포 가설
동시출현 행렬의 핵심 배경은 **분포 가설 Distributional Hypothesis**입니다.
직관은 다음과 같습니다.

```text
비슷한 문맥에서 등장하는 단어
→ 비슷한 의미를 가질 가능성이 높음

```
예:

```text
I drink coffee
I drink tea
hot coffee
hot tea

```
`coffee`와 `tea`는

```text
drink
hot

```
같은 문맥을 공유합니다.
따라서 두 단어의 문맥 벡터가 비슷해질 수 있습니다.

<blockquote class="prompt-info">
<p>단어 자체보다 그 단어 주변에 어떤 단어가 등장하는지를 이용해 의미 관계를 추정합니다.</p>
</blockquote>

## Window
동시출현을 계산할 때는 보통 기준 단어 주변의 일정 범위를 봅니다.
이 범위를 **Window**라고 합니다.
문장:

```text
I like deep learning very much

```
기준 단어:

```text
deep

```
Window 크기 1:

```text
like [deep] learning

```
Context:

```text
like
learning

```
Window 크기 2:

```text
I like [deep] learning very

```
Context:

```text
I
like
learning
very

```
Window가 커질수록 더 넓은 문맥을 봅니다.

## Window Size
Window 크기를 $$k$$라고 하면 기준 단어의 왼쪽과 오른쪽에서 최대 $$k$$개씩 Context를 볼 수 있습니다.
예:

```text
a b c d e

```
기준 단어가 `c`일 때 Window Size가 1이면

```text
b [c] d

```
입니다.
Window Size가 2이면

```text
a b [c] d e

```
입니다.

<blockquote class="prompt-warning">
<p>Window가 너무 작으면 문맥 정보가 부족하고, 너무 크면 관련이 약한 단어까지 함께 셀 수 있습니다.</p>
</blockquote>

## 행렬 만들기
Vocabulary:

```text
I
like
NLP
AI

```
동시출현 횟수를 행렬로 만들면 다음처럼 표현할 수 있습니다.

| Target | I | like | NLP | AI |
| --- | ---: | ---: | ---: | ---: |
| I | 0 | 2 | 0 | 0 |
| like | 2 | 0 | 1 | 1 |
| NLP | 0 | 1 | 0 | 0 |
| AI | 0 | 1 | 0 | 0 |

여기서 행은 **Target Word**, 열은 **Context Word**입니다.
예를 들어

```text
row = like
column = AI
value = 1

```
은 `like` 주변에 `AI`가 1번 등장했다는 뜻입니다.

## 행과 열
동시출현 행렬을 $$C$$라고 하겠습니다.
$$C_{ij}$$는 Target Word $$w_i$$ 주변에 Context Word $$w_j$$가 등장한 횟수를 의미합니다.
즉,

```text
행
→ 기준이 되는 Target Word

열
→ 주변의 Context Word

값
→ 함께 등장한 횟수

```
입니다.

<mark>동시출현 행렬의 한 행은 하나의 단어를 주변 문맥 빈도로 표현한 Context Vector입니다.</mark>

## 단어 유사도
두 단어가 비슷한 Context Vector를 가진다면 비슷한 문맥에서 사용되었다고 볼 수 있습니다.
예:

```text
coffee → [3, 0, 2, 1]
tea    → [2, 0, 2, 1]
car    → [0, 4, 0, 0]

```
`coffee`와 `tea`는 벡터가 비슷합니다.
`car`는 다른 패턴을 가집니다.
이 벡터들 사이의 Cosine Similarity를 계산할 수 있습니다.
$$\cos(\theta)=\frac{\mathbf{x}\cdot\mathbf{y}}{\|\mathbf{x}\|\|\mathbf{y}\|}$$

```text
Context Vector
+
Cosine Similarity
→ 단어 유사도 추정

```
입니다.

## 대칭 행렬인가
왼쪽과 오른쪽 Context를 같은 방식으로 세는 **대칭 Window**를 사용하면 동시출현 행렬도 대칭이 될 수 있습니다.
예:

```text
A B

```
에서

```text
A 주변에 B
B 주변에 A

```
를 모두 세면
$$C_{AB}=C_{BA}$$
가 됩니다.
하지만 항상 대칭인 것은 아닙니다.
예를 들어

```text
오른쪽 Context만 계산
앞 단어와 뒤 단어를 다른 Feature로 구분
거리별 가중치 사용

```
같은 방법을 사용하면 비대칭 행렬이 될 수 있습니다.

<blockquote class="prompt-warning">
<p>동시출현 행렬이 항상 대칭이라고 외우면 안 됩니다. Context를 어떻게 정의했는지에 따라 달라집니다.</p>
</blockquote>

## Sparse Matrix
실제로 모든 단어가 모든 단어와 함께 등장하지는 않습니다.
그래서 대부분의 값은 0입니다.

```text
[0, 0, 3, 0, 0, ..., 1, ..., 0]

```
대규모 Vocabulary에서는 동시출현 행렬도 **Sparse Matrix**가 되기 쉽습니다.

```text
큰 Vocabulary
→ 매우 큰 행렬
→ 대부분 0
→ Sparse Matrix

```
입니다.

<blockquote class="prompt-danger">
<p>Vocabulary가 커지면 행렬 크기가 제곱 수준으로 증가할 수 있어 메모리와 계산 비용이 커집니다.</p>
</blockquote>

## 단순 Count의 문제
단순 동시출현 횟수만 사용하면 매우 흔한 단어가 큰 값을 가질 수 있습니다.
예:

```text
the
is
of
a

```
이런 단어는 많은 단어 주변에 자주 등장할 수 있습니다.
그러면 의미적으로 특별한 관계가 없어도 Co-occurrence Count가 크게 나올 수 있습니다.

```text
많이 함께 등장
≠
항상 강한 의미 관계

```
입니다.

## PMI가 필요한 이유
두 단어가 실제로 특별히 강하게 연결되어 있는지를 알고 싶다면 **기대되는 동시출현과 실제 동시출현을 비교**할 수 있습니다.
이 아이디어가 PMI입니다.
$$PMI(x,y)=\log\frac{P(x,y)}{P(x)P(y)}$$
직관:

```text
실제 함께 등장 확률
──────────────
독립이라고 가정했을 때 기대 확률

```
입니다.
두 단어가 우연히 기대되는 수준보다 훨씬 자주 함께 나오면 PMI가 커집니다.

<mark>동시출현 Count를 그대로 쓰는 한계를 보완하기 위해 PMI와 PPMI를 사용할 수 있습니다.</mark>

## 단점
대표적인 약점:
1. Vocabulary가 크면 행렬이 매우 커짐
2. 대부분 값이 0인 Sparse Matrix
3. Window Size 선택에 영향을 받음
4. 단순 Count는 흔한 단어의 영향을 크게 받음
5. 희귀 단어는 통계가 불안정할 수 있음
6. Corpus가 바뀌면 행렬도 달라짐
이 문제를 줄이기 위해 PMI, PPMI, 차원 축소 등을 사용할 수 있습니다.

## 잘 놓치는 핵심

### 1. 행은 Target, 열은 Context
문서가 행이었던 DTM과 다릅니다.

### 2. Window가 중요하다
어디까지를 함께 등장했다고 볼지 결정합니다.

### 3. 한 행이 하나의 Context Vector
주변 단어 빈도로 하나의 단어를 표현합니다.

### 4. 항상 대칭인 것은 아니다
대칭 Window를 양방향으로 세면 대칭이 될 수 있지만 정의에 따라 달라집니다.

### 5. Vocabulary가 크면 행렬도 매우 커진다
기본 Word-Word 행렬은 Vocabulary 크기의 제곱 수준입니다.

### 6. 단순 Count는 흔한 단어의 영향을 받는다
PMI와 PPMI가 이를 보완하는 데 사용됩니다.

## 시험·면접

<blockquote class="prompt-info">
<p>단골: Target과 Context, Window Size, DTM과 차이, Sparse Matrix, 대칭 여부, PMI·PPMI로 이어지는 이유.</p>
</blockquote>

자주 나오는 문장:
- 동시출현 행렬은 주변 Context에 함께 등장한 횟수를 기록한다
- 행은 Target Word, 열은 Context Word로 볼 수 있다
- Window Size가 커지면 더 넓은 문맥을 본다
- 대칭 Window를 사용하면 대칭 행렬이 될 수 있다
- Vocabulary가 크면 고차원 Sparse Matrix가 된다
- 단순 Count의 한계를 보완하기 위해 PMI와 PPMI를 사용할 수 있다

## 예시로 한 바퀴
Corpus:

```text
I like AI
I like NLP

```
Window Size:

```text
1

```
Vocabulary:

```text
I
like
AI
NLP

```
첫 번째 문장:

```text
I ↔ like
like ↔ AI

```
두 번째 문장:

```text
I ↔ like
like ↔ NLP

```
따라서

```text
I와 like  → 2
like와 AI → 1
like와 NLP → 1

```
입니다.
행렬:

| Target | I | like | AI | NLP |
| --- | ---: | ---: | ---: | ---: |
| I | 0 | 2 | 0 | 0 |
| like | 2 | 0 | 1 | 1 |
| AI | 0 | 1 | 0 | 0 |
| NLP | 0 | 1 | 0 | 0 |

`AI`와 `NLP`는 모두 `like`라는 Context를 공유합니다.
따라서 두 단어의 Context Vector도 비슷해질 수 있습니다.

## 객관식 6문제
**1.** 동시출현 행렬의 기본 목적은?
- ① 단어 주변에 함께 등장한 단어의 빈도를 표현
- ② 이미지 크기를 계산
- ③ 문서 날짜를 저장
- ④ 문장의 음성을 합성

<details>
<summary>정답</summary>

①

</details>

**2.** Window Size가 의미하는 것은?
- ① Vocabulary의 전체 크기
- ② 기준 단어 주변에서 Context로 볼 범위
- ③ 문서의 개수
- ④ Embedding 차원만

<details>
<summary>정답</summary>

②

</details>

**3.** DTM과 동시출현 행렬의 차이로 맞는 것은?
- ① DTM은 문서-단어, 동시출현 행렬은 단어-문맥 관계
- ② 둘은 항상 완전히 동일
- ③ DTM은 이미지 전용
- ④ 동시출현 행렬에는 Vocabulary가 필요 없음

<details>
<summary>정답</summary>

①

</details>

**4.** 동시출현 행렬은 항상 대칭인가?
- ① 항상 대칭
- ② 항상 비대칭
- ③ Context 정의와 계산 방식에 따라 달라짐
- ④ 행렬이 될 수 없음

<details>
<summary>정답</summary>

③

</details>

**5.** Vocabulary 크기가 커질 때 나타나는 대표 문제는?
- ① 행렬 크기와 희소성 증가
- ② 모든 값이 자동으로 1
- ③ 문서 수가 0이 됨
- ④ Tokenization이 불가능

<details>
<summary>정답</summary>

①

</details>

**6.** 단순 Co-occurrence Count의 한계를 보완하는 대표적인 방법은?
- ① PMI·PPMI
- ② Dropout
- ③ Max Pooling
- ④ Batch Normalization

<details>
<summary>정답</summary>

①

</details>

## 다음에 이을 글
PMI · PPMI입니다.  
두 단어가 우연히 기대되는 수준보다 얼마나 더 자주 함께 등장하는지를 계산해 동시출현 관계의 강도를 보정합니다.
