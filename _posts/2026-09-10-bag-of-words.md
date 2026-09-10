---
title: Bag of Words
date: 2026-09-10 10:10:00 +0900
slug: bag-of-words
permalink: /posts/bag-of-words/
categories: [AI, 자연어처리]
tags: [자연어처리, BagOfWords, BoW, DTM, Vocabulary, NLP]
math: true
---
문서에 어떤 Token이 **몇 번 등장했는지**를 Vocabulary 기준의 벡터로 표현하는 방법입니다.  
단어의 순서는 버리고, 등장 여부나 빈도만 봅니다.

<blockquote class="prompt-info">
<p>Bag of Words = 문서를 단어의 순서가 아닌 단어의 출현 빈도로 표현합니다.</p>
</blockquote>

예:

```text
D1: I love AI
D2: I love NLP

```
Vocabulary:

```text
I
love
AI
NLP

```
BoW:

```text
D1 → [1, 1, 1, 0]
D2 → [1, 1, 0, 1]

```

<mark>Bag of Words는 문장을 단어의 가방처럼 보고, 어떤 단어가 몇 번 들어 있는지만 셉니다.</mark>

<details>
<summary>한 줄로</summary>

문서의 단어 순서는 버리고 Vocabulary별 등장 횟수만 벡터로 만드는 방식입니다.

</details>

## 왜 필요한가
머신러닝 모델은 텍스트를 그대로 계산하기 어렵습니다.

```text
I love AI

```
를 Vocabulary 기준 숫자로 바꾸면

```text
[1, 1, 1, 0]

```
처럼 표현할 수 있습니다.
즉,

```text
Document
  ↓
Tokenization
  ↓
Vocabulary
  ↓
Count
  ↓
BoW Vector

```
의 흐름입니다.

## Vocabulary가 기준이다
다음 두 문서가 있다고 하겠습니다.

```text
D1: I like apple
D2: I like banana

```
Vocabulary:

```text
I
like
apple
banana

```
각 단어에 Index를 붙이면

```text
I      → 0
like   → 1
apple  → 2
banana → 3

```
입니다.
BoW Vector는 이 순서를 그대로 사용합니다.

```text
D1 → [1, 1, 1, 0]
D2 → [1, 1, 0, 1]

```

<blockquote class="prompt-info">
<p>BoW Vector의 각 위치가 무엇을 의미하는지는 Vocabulary 순서가 결정합니다.</p>
</blockquote>

## 단어가 여러 번 나오면
문장:

```text
I love AI AI

```
Vocabulary:

```text
I
love
AI

```
등장 횟수:

```text
I    → 1
love → 1
AI   → 2

```
따라서

```text
[1, 1, 2]

```
입니다.
BoW는 기본적으로 단어의 **Count**를 저장합니다.

## One-Hot과의 차이
One-Hot은 **Token 하나**를 표현합니다.

```text
Vocabulary:
I
love
AI
NLP

```
One-Hot:

```text
I    → [1, 0, 0, 0]
love → [0, 1, 0, 0]
AI   → [0, 0, 1, 0]
NLP  → [0, 0, 0, 1]

```
BoW는 **문서 전체**를 표현합니다.

```text
I love AI
→ [1, 1, 1, 0]

```
즉,

```text
One-Hot
→ Token 하나

BoW
→ Document 하나

```
입니다.

<mark>One-Hot을 여러 개 더해 문서 단위로 만든다고 생각하면 BoW의 직관을 잡기 쉽습니다.</mark>

## 순서 정보가 사라진다
BoW의 가장 큰 특징입니다.
다음 두 문장:

```text
dog bites man
man bites dog

```
Vocabulary:

```text
dog
bites
man

```
두 문서의 BoW는 모두

```text
[1, 1, 1]

```
입니다.
문장의 뜻은 다르지만 등장한 단어와 횟수는 같습니다.

<blockquote class="prompt-danger">
<p>BoW는 단어 순서를 버리기 때문에 같은 단어를 같은 횟수로 사용한 문장을 구분하지 못할 수 있습니다.</p>
</blockquote>

## 벡터 차원
Vocabulary 크기가 $$|V|$$라면 BoW Vector의 차원도 $$|V|$$입니다.
예:

```text
Vocabulary = 4
→ BoW Dimension = 4

Vocabulary = 10,000
→ BoW Dimension = 10,000

```
Vocabulary가 커질수록 벡터 차원도 커집니다.

<blockquote class="prompt-warning">
<p>BoW도 One-Hot과 마찬가지로 Vocabulary가 크면 고차원 벡터가 됩니다.</p>
</blockquote>

## 문서가 여러 개면
문서마다 BoW Vector를 하나씩 만들 수 있습니다.

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
벡터:

```text
D1 → [1, 1, 1, 0, 0, 0]
D2 → [1, 1, 0, 1, 0, 0]
D3 → [0, 0, 0, 1, 1, 1]

```
이 벡터들을 행으로 쌓으면 **Document-Term Matrix**로 이어집니다.

## DTM과의 관계
BoW는 문서 하나의 표현입니다.
여러 문서의 BoW를 행으로 쌓으면 DTM입니다.

```text
            I  love  AI  NLP  is  useful
D1          1   1    1    0   0     0
D2          1   1    0    1   0     0
D3          0   0    0    1   1     1

```
즉,

```text
BoW
→ 문서 하나의 벡터

DTM
→ 여러 문서의 BoW를 모은 행렬

```
입니다.

<mark>BoW를 문서 여러 개에 적용해 행렬로 만들면 DTM이 됩니다.</mark>

## BoW의 단점
대표적인 약점:
1. 단어 순서를 잃음
2. 문맥을 직접 표현하지 못함
3. Vocabulary가 크면 차원이 커짐
4. Sparse Vector가 됨
5. 단어 의미 유사도를 표현하지 못함
6. 자주 나오는 흔한 단어가 과도한 영향을 줄 수 있음
마지막 문제를 보완하는 대표적인 방식이 **TF-IDF**입니다.

## BoW와 TF-IDF
BoW는 단순 빈도입니다.

```text
단어가 많이 등장
→ 큰 값

```
하지만 모든 문서에서 매우 자주 등장하는 단어는 구분력이 낮을 수 있습니다.
TF-IDF는

```text
한 문서에서 자주 등장
+
전체 문서에서는 드물게 등장

```
하는 단어에 더 높은 중요도를 줍니다.

```text
BoW
→ Count 중심

TF-IDF
→ 중요도 가중

```
입니다.

## 잘 놓치는 핵심

### 1. BoW는 문서 단위 표현
One-Hot은 Token 하나, BoW는 Document 하나입니다.

### 2. 순서 정보가 없음
같은 단어와 같은 빈도면 문장 순서가 달라도 같은 벡터가 될 수 있습니다.

### 3. 벡터 차원은 Vocabulary 크기
Vocabulary가 커질수록 차원도 커집니다.

### 4. Sparse Vector가 되기 쉬움
문서는 전체 Vocabulary 중 일부만 사용합니다.

### 5. Count와 Binary 둘 다 가능
등장 횟수 또는 등장 여부로 표현할 수 있습니다.

### 6. DTM으로 이어짐
문서별 BoW를 행으로 쌓으면 DTM입니다.

## 시험·면접

<blockquote class="prompt-info">
<p>단골: BoW의 순서 정보 손실, One-Hot과 차이, DTM과 관계, Sparse Vector, TF-IDF와 차이.</p>
</blockquote>

자주 나오는 문장:
- Bag of Words는 단어 순서를 고려하지 않는다
- Vocabulary 기준으로 문서를 벡터화한다
- 기본적으로 단어 등장 빈도를 사용한다
- 고차원 Sparse Vector가 될 수 있다
- 여러 문서의 BoW를 모으면 DTM이 된다
- TF-IDF는 단순 빈도에 중요도 가중을 추가한다

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
BoW:

```text
D1 → [1, 0, 1, 1, 0]
D2 → [0, 1, 1, 1, 0]
D3 → [1, 0, 1, 0, 1]

```
첫 번째 위치는 `cat`, 두 번째는 `dog`, 세 번째는 `eats`의 빈도입니다.
문서의 단어 순서는 저장되지 않습니다.

## 객관식 6문제
**1.** Bag of Words가 주로 사용하는 정보는?
- ① 단어의 위치 좌표
- ② 단어의 출현 여부나 빈도
- ③ 문장의 음성 높이
- ④ 이미지 픽셀

<details>
<summary>정답</summary>

②

</details>

**2.** BoW의 대표적인 약점은?
- ① 단어 순서를 잃음
- ② 숫자로 변환할 수 없음
- ③ Vocabulary를 사용할 수 없음
- ④ 항상 Dense Vector

<details>
<summary>정답</summary>

①

</details>

**3.** Vocabulary가 1,000개라면 BoW Vector의 차원은?
- ① 1
- ② 10
- ③ 100
- ④ 1,000

<details>
<summary>정답</summary>

④

</details>

**4.** 여러 문서의 BoW Vector를 행으로 쌓은 것은?
- ① DTM
- ② CNN
- ③ PCA
- ④ KNN

<details>
<summary>정답</summary>

①

</details>

**5.** Binary BoW가 저장하는 것은?
- ① 단어 등장 여부
- ② 단어의 정확한 위치
- ③ 문장 길이만
- ④ 단어 의미 유사도

<details>
<summary>정답</summary>

①

</details>

**6.** BoW와 TF-IDF의 차이로 맞는 것은?
- ① BoW는 빈도 중심, TF-IDF는 중요도 가중
- ② 둘은 완전히 같은 방식
- ③ TF-IDF는 단어 순서를 완벽히 보존
- ④ BoW는 Vocabulary를 사용하지 않음

<details>
<summary>정답</summary>

①

</details>

## 다음에 이을 글
문서-단어 행렬 DTM입니다.  
여러 문서의 Bag of Words Vector를 하나의 행렬로 정리합니다.
