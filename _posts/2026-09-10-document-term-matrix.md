---
title: 문서-단어 행렬 DTM
date: 2026-09-10 10:20:00 +0900
slug: document-term-matrix
permalink: /posts/document-term-matrix/
categories: [AI, 자연어처리]
tags: [자연어처리, DTM, DocumentTermMatrix, BagOfWords, Vocabulary, NLP]
math: true
---
여러 문서의 Bag of Words Vector를 **하나의 행렬로 모은 표현**입니다.  
행은 문서, 열은 Vocabulary의 Token, 값은 보통 해당 Token의 등장 횟수입니다.

<blockquote class="prompt-info">
<p>DTM = 여러 문서의 BoW Vector를 행 단위로 쌓은 문서-단어 행렬입니다.</p>
</blockquote>

예:

```text
D1: I love AI
D2: I love NLP
D3: NLP is useful

```
Vocabulary:

```text
I
love
AI
NLP
is
useful

```
DTM:

```text
        I  love  AI  NLP  is  useful
D1      1   1    1    0   0     0
D2      1   1    0    1   0     0
D3      0   0    0    1   1     1

```

<mark>행은 문서, 열은 Token, 값은 그 문서에서 Token이 등장한 횟수입니다.</mark>

<details>
<summary>한 줄로</summary>

문서별 BoW Vector를 여러 줄로 쌓아 만든 행렬입니다.

</details>

## BoW와의 관계
Bag of Words는 문서 하나를 벡터로 표현합니다.

```text
D1: I love AI
→ [1, 1, 1, 0, 0, 0]

```
D2:

```text
D2: I love NLP
→ [1, 1, 0, 1, 0, 0]

```
D3:

```text
D3: NLP is useful
→ [0, 0, 0, 1, 1, 1]

```
이 벡터들을 행으로 쌓으면 DTM입니다.

```text
D1 → [1, 1, 1, 0, 0, 0]
D2 → [1, 1, 0, 1, 0, 0]
D3 → [0, 0, 0, 1, 1, 1]

```
즉,

```text
BoW
→ 문서 하나의 벡터

DTM
→ 여러 문서의 BoW Vector를 모은 행렬

```
입니다.

<blockquote class="prompt-info">
<p>BoW와 DTM은 완전히 다른 개념이라기보다 문서 하나와 여러 문서의 차이라고 보면 쉽습니다.</p>
</blockquote>

## 행과 열
DTM의 구조는 중요합니다.

```text
        I  love  AI  NLP  is  useful
D1      1   1    1    0   0     0
D2      1   1    0    1   0     0
D3      0   0    0    1   1     1

```
행:

```text
D1
D2
D3

```
은 Document입니다.
열:

```text
I
love
AI
NLP
is
useful

```
은 Vocabulary의 Token입니다.
행렬의 각 값은

```text
해당 문서에서 해당 Token이 몇 번 등장했는가

```
를 나타냅니다.

## 행렬 크기
문서 수가 $$N$$개이고 Vocabulary 크기가 $$|V|$$라면 DTM의 크기는 $$N\times |V|$$입니다.
예:

```text
문서 수 = 3
Vocabulary 크기 = 6

```
이면 DTM 크기는 $$3\times 6$$입니다.

```text
3 rows
6 columns

```
입니다.

<mark>DTM의 행 개수는 문서 수, 열 개수는 Vocabulary 크기입니다.</mark>

## Count DTM
가장 기본적인 DTM은 등장 횟수를 사용합니다.
문서:

```text
D1: AI is good
D2: AI AI is useful

```
Vocabulary:

```text
AI
is
good
useful

```
Count DTM:

```text
        AI  is  good  useful
D1      1   1    1      0
D2      2   1    0      1

```
D2에서 `AI`가 2번 나왔기 때문에 값이 2입니다.

## Binary DTM
등장 횟수 대신 **등장 여부만** 저장할 수도 있습니다.
같은 문서:

```text
D1: AI is good
D2: AI AI is useful

```
Binary DTM:

```text
        AI  is  good  useful
D1      1   1    1      0
D2      1   1    0      1

```
D2에서 `AI`가 2번 나와도 값은 1입니다.

```text
Count DTM
→ 등장 횟수

Binary DTM
→ 등장 여부

```

<blockquote class="prompt-warning">
<p>DTM의 값이 항상 단순 Count만 되는 것은 아닙니다. Binary나 TF-IDF 같은 값으로 바꿀 수도 있습니다.</p>
</blockquote>

## 순서 정보는 없다
DTM은 BoW 기반이므로 단어 순서를 저장하지 않습니다.

```text
D1: dog bites man
D2: man bites dog

```
Vocabulary:

```text
dog
bites
man

```
DTM:

```text
        dog  bites  man
D1       1     1     1
D2       1     1     1

```
두 문장의 의미는 다르지만 DTM은 같습니다.

<blockquote class="prompt-danger">
<p>DTM은 어떤 Token이 몇 번 나왔는지는 알지만 문장에서 어디에 나왔는지는 알 수 없습니다.</p>
</blockquote>

## Sparse Matrix
Vocabulary가 커지면 대부분의 값이 0이 됩니다.
예를 들어

```text
문서 수 = 100,000
Vocabulary = 50,000

```
이면 행렬 크기는 $$100000\times 50000$$입니다.
하지만 하나의 문서는 50,000개 Token을 전부 사용하지 않습니다.
따라서 대부분의 값은 0입니다.

```text
[0, 0, 0, 2, 0, 0, ..., 1, ..., 0]

```
이런 행렬을 **희소 행렬 Sparse Matrix**라고 합니다.

<mark>DTM은 대규모 Corpus에서 대표적인 고차원 희소 행렬이 됩니다.</mark>

## TF-IDF와 연결
DTM의 Count 값을 그대로 쓰지 않고 가중치를 줄 수 있습니다.
대표적인 방법이 TF-IDF입니다.

```text
Count DTM
→ 모든 등장 횟수를 그대로 사용

TF-IDF Matrix
→ 문서 내부 빈도와 전체 문서 빈도를 함께 반영

```
전체 문서에서 흔한 Token의 가중치는 낮추고, 특정 문서에서 상대적으로 중요한 Token의 가중치는 높입니다.

<blockquote class="prompt-info">
<p>TF-IDF는 DTM의 구조를 유지하면서 각 칸의 값을 단순 Count가 아닌 중요도 가중치로 바꾼다고 보면 쉽습니다.</p>
</blockquote>

## Python으로 보면
`CountVectorizer`로 DTM을 만들 수 있습니다.

```python
from sklearn.feature_extraction.text import CountVectorizer

corpus = [
    "AI is good",
    "AI is useful",
    "NLP is useful"
]

vectorizer = CountVectorizer()

X = vectorizer.fit_transform(corpus)

print(vectorizer.get_feature_names_out())
print(X.toarray())

```
개념적으로 결과는 다음과 같습니다.

```text
Vocabulary:
ai
good
is
nlp
useful

```

```text
D1 → [1, 1, 1, 0, 0]
D2 → [1, 0, 1, 0, 1]
D3 → [0, 0, 1, 1, 1]

```
`X` 자체는 보통 Sparse Matrix 형태로 반환됩니다.

## 단점
대표적인 약점:
1. Vocabulary가 크면 열 수가 매우 커짐
2. 대부분 값이 0인 Sparse Matrix
3. 단어 순서를 잃음
4. 문맥을 직접 표현하지 못함
5. 단어 의미 유사도를 모름
6. 단순 Count는 흔한 단어의 중요도를 과대평가할 수 있음
이 중 마지막 문제는 TF-IDF로 보완할 수 있습니다.

## 잘 놓치는 핵심

### 1. 행 = Document
각 행이 하나의 문서를 의미합니다.

### 2. 열 = Term
각 열은 Vocabulary의 하나의 Token입니다.

### 3. 값 = Count가 기본
해당 문서에서 해당 Token이 몇 번 등장했는지를 나타냅니다.

### 4. BoW를 여러 개 모은 것
문서별 BoW Vector를 행으로 쌓으면 DTM입니다.

### 5. Sparse Matrix가 되기 쉬움
Vocabulary가 커질수록 0이 매우 많아집니다.

### 6. 순서 정보가 없음
BoW 기반이므로 문장 구조와 단어 순서를 잃습니다.

## 시험·면접

<blockquote class="prompt-info">
<p>단골: DTM의 행과 열, BoW와의 관계, 행렬 크기, Sparse Matrix, 단어 순서 손실, TF-IDF와 연결.</p>
</blockquote>

자주 나오는 문장:
- DTM의 행은 Document, 열은 Term이다
- 문서 수가 N이고 Vocabulary 크기가 V이면 N×V 행렬이다
- 기본 값은 단어 등장 횟수다
- 여러 BoW Vector를 행으로 쌓은 구조다
- Vocabulary가 크면 고차원 Sparse Matrix가 된다
- TF-IDF는 DTM의 Count에 중요도 가중치를 준 표현이다

## 예시로 한 바퀴
문서:

```text
D1: cat eats fish
D2: dog eats fish
D3: cat eats meat

```
Vocabulary:

```text
cat
dog
eats
fish
meat

```
DTM:

```text
        cat  dog  eats  fish  meat
D1       1    0    1     1     0
D2       0    1    1     1     0
D3       1    0    1     0     1

```
문서 수는 $$N=3$$입니다.
Vocabulary 크기는 $$|V|=5$$입니다.
따라서 DTM의 크기는 $$3\times 5$$입니다.
`D1`에서 `fish`는 1번 등장하므로 해당 값은 1입니다.
`D3`에서 `dog`는 등장하지 않으므로 해당 값은 0입니다.

## 객관식 6문제
**1.** DTM에서 행이 의미하는 것은?
- ① Token
- ② Document
- ③ 품사
- ④ Embedding 차원

<details>
<summary>정답</summary>

②

</details>

**2.** DTM에서 열이 의미하는 것은?
- ① Document
- ② Vocabulary의 Token
- ③ 모델의 Layer
- ④ Label만

<details>
<summary>정답</summary>

②

</details>

**3.** 문서가 100개이고 Vocabulary가 2,000개라면 DTM 크기는?
- ① 100×2,000
- ② 2,000×2,000
- ③ 100×100
- ④ 2,100×1

<details>
<summary>정답</summary>

①

</details>

**4.** DTM이 대규모 Corpus에서 주로 가지는 특징은?
- ① 모든 값이 1
- ② Sparse Matrix
- ③ 항상 정방행렬
- ④ 단어 순서를 완벽히 보존

<details>
<summary>정답</summary>

②

</details>

**5.** BoW와 DTM의 관계로 맞는 것은?
- ① BoW는 문서 하나, DTM은 여러 문서의 BoW를 모은 행렬
- ② DTM은 Token 하나만 표현
- ③ BoW는 순서를 완벽히 저장
- ④ 서로 전혀 관련 없음

<details>
<summary>정답</summary>

①

</details>

**6.** 단순 Count DTM의 한계를 보완하는 대표적인 가중 방식은?
- ① TF-IDF
- ② PCA
- ③ Dropout
- ④ Max Pooling

<details>
<summary>정답</summary>

①

</details>

## 다음에 이을 글
TF Term Frequency입니다.  
하나의 문서 안에서 특정 Token이 얼마나 자주 등장하는지를 수치로 표현합니다.
