---
title: DF Document Frequency
date: 2026-09-10 10:40:00 +0900
slug: document-frequency
permalink: /posts/document-frequency/
categories: [AI, 자연어처리]
tags: [자연어처리, DF, DocumentFrequency, TFIDF, IDF, NLP]
math: true
---
특정 Term이 **전체 문서 중 몇 개의 문서에 등장했는지**를 나타내는 값입니다.  
한 문서 안에서 몇 번 나왔는지가 아니라, **몇 개의 문서에 걸쳐 나타났는지**를 봅니다.

<blockquote class="prompt-info">
<p>DF = 특정 Term이 등장한 문서의 개수입니다.</p>
</blockquote>

예:

```text
D1: AI is useful
D2: AI is powerful
D3: NLP is useful

```
`AI`가 등장한 문서:

```text
D1
D2

```
따라서
$$DF(AI)=2$$
입니다.

<mark>DF는 단어의 총 등장 횟수가 아니라, 그 단어가 등장한 문서의 수를 셉니다.</mark>

<details>
<summary>한 줄로</summary>

전체 문서 중 특정 Term을 포함한 문서가 몇 개인지를 세는 값입니다.

</details>

## 기본 개념
Corpus:

```text
D1: cat is cute
D2: dog is cute
D3: cat is fast

```
Vocabulary:

```text
cat
dog
is
cute
fast

```
각 Term의 DF:

```text
cat  → D1, D3 → 2
dog  → D2     → 1
is   → D1, D2, D3 → 3
cute → D1, D2 → 2
fast → D3     → 1

```
즉,

```text
DF(cat) = 2
DF(dog) = 1
DF(is) = 3
DF(cute) = 2
DF(fast) = 1

```
입니다.

## 공식
Corpus의 전체 문서 수를 $$N$$이라고 하겠습니다.
특정 Term $$t$$가 등장한 문서 수를 $$DF(t)$$라고 합니다.
개념적으로는 다음처럼 생각할 수 있습니다.
$$DF(t)=|\{d:t\in d\}|$$
즉,

```text
t가 들어 있는 문서들을 찾고
그 문서의 개수를 센다

```
입니다.

## TF와 가장 큰 차이
TF와 DF는 매우 자주 헷갈립니다.
TF:

```text
한 문서 안에서
Term이 몇 번 등장했는가

```
DF:

```text
전체 문서 중
Term이 몇 개 문서에 등장했는가

```
예:

```text
D1: AI AI AI
D2: AI NLP
D3: NLP

```
`AI`의 TF:

```text
TF(AI, D1) = 3
TF(AI, D2) = 1
TF(AI, D3) = 0

```
`AI`의 DF:

```text
AI가 등장한 문서
D1, D2

DF(AI) = 2

```

<blockquote class="prompt-info">
<p>TF는 문서 하나 내부의 빈도이고, DF는 Corpus 전체에서 등장한 문서의 개수입니다.</p>
</blockquote>

## 한 문서에 여러 번 나와도 1
문서:

```text
D1: cat cat cat cat
D2: dog

```
`cat`은 D1에서 4번 등장합니다.
하지만 `cat`이 등장한 문서는 D1 하나뿐입니다.
따라서
$$DF(cat)=1$$
입니다.
반대로 `cat`이 여러 문서에 한 번씩 나오면 DF는 커집니다.

```text
D1: cat
D2: cat
D3: cat

```
이 경우
$$DF(cat)=3$$
입니다.

## DTM에서 DF 계산
DTM이 있으면 DF를 쉽게 구할 수 있습니다.

```text
        AI  NLP  useful
D1       2    0     1
D2       1    1     0
D3       0    1     1

```
`AI` 열:

```text
2
1
0

```
0이 아닌 문서가 D1, D2이므로
$$DF(AI)=2$$
입니다.
`NLP` 열:

```text
0
1
1

```
0이 아닌 문서가 D2, D3이므로
$$DF(NLP)=2$$
입니다.
`useful` 열도 D1, D3에서 등장하므로
$$DF(useful)=2$$
입니다.

## 핵심은 0이 아닌 행 개수
Count DTM에서 어떤 Term의 열을 본다고 하겠습니다.

```text
Term X
D1 → 3
D2 → 0
D3 → 5
D4 → 0
D5 → 1

```
등장한 문서는

```text
D1
D3
D5

```
입니다.
따라서
$$DF(X)=3$$
입니다.
빈도가

```text
3
5
1

```
인지 자체는 DF 계산에서 중요하지 않습니다.
중요한 것은

```text
0인가?
0이 아닌가?

```
입니다.

## 왜 DF가 필요한가
TF만 보면 문서 안에서 자주 나오는 Term에 높은 값이 생깁니다.
하지만 다음처럼 모든 문서에 흔한 단어도 있습니다.

```text
D1: the cat is good
D2: the dog is good
D3: the car is good

```
`the`, `is`, `good`은 여러 문서에서 반복됩니다.
이런 단어의 DF는 높습니다.
반면

```text
cat
dog
car

```
는 상대적으로 적은 문서에서만 등장합니다.
DF를 이용하면

```text
Corpus 전체에서 흔한 Term
vs
Corpus 전체에서 드문 Term

```
을 구분할 수 있습니다.

## IDF로 이어지는 이유
DF 자체는 단순히 문서 수를 셉니다.
그런데 TF-IDF에서는 **DF가 낮을수록 더 높은 중요도**를 주고 싶습니다.
그래서 DF의 역수 개념을 사용합니다.
대표적인 IDF:
$$IDF(t)=\log\frac{N}{DF(t)}$$
전체 문서 수가 $$N=100$$이라고 하겠습니다.
어떤 Term의 DF가 100이면
$$IDF(t)=\log\frac{100}{100}=\log 1=0$$
입니다.
모든 문서에서 등장하므로 구분력이 낮다고 보는 것입니다.
반대로 DF가 1이면
$$IDF(t)=\log\frac{100}{1}=\log 100$$
으로 더 큰 값을 가집니다.

<mark>DF는 많이 등장한 문서 수이고, IDF는 DF가 낮은 희귀 Term에 더 큰 가중치를 주는 방향으로 변환한 값입니다.</mark>

## DF와 IDF 관계
핵심 관계:

```text
DF 증가
→ 더 많은 문서에 등장
→ 흔한 Term
→ IDF 감소

```
반대로

```text
DF 감소
→ 적은 문서에 등장
→ 희귀한 Term
→ IDF 증가

```
즉 DF와 IDF는 반대 방향으로 움직입니다.

<blockquote class="prompt-info">
<p>DF가 높을수록 IDF는 낮아지고, DF가 낮을수록 IDF는 높아집니다.</p>
</blockquote>

## 잘 놓치는 핵심

### 1. DF는 등장 횟수가 아니다
한 문서에서 여러 번 등장해도 그 문서는 1개로 셉니다.

### 2. DF는 Corpus 전체를 본다
TF와 가장 큰 차이입니다.

### 3. DF 최대값은 문서 수
전체 문서 수가 N이면 DF는 N보다 클 수 없습니다.

### 4. DTM에서 0이 아닌 값의 개수를 센다
해당 Term 열에서 0이 아닌 행 수가 DF입니다.

### 5. DF와 IDF는 반대 방향
DF가 높으면 IDF가 낮아집니다.

### 6. Corpus가 바뀌면 DF도 바뀐다
DF는 Term 자체에 고정된 값이 아닙니다.

## 시험·면접

<blockquote class="prompt-info">
<p>단골: TF와 DF 차이, 한 문서에서 여러 번 등장할 때 DF 계산, DTM에서 DF 구하기, DF와 IDF의 반대 관계.</p>
</blockquote>

자주 나오는 문장:
- DF는 특정 Term이 등장한 문서의 개수다
- 한 문서에서 여러 번 등장해도 DF에서는 1로 센다
- TF는 문서 내부 빈도, DF는 Corpus 전체의 문서 빈도다
- DTM에서 해당 열의 0이 아닌 행 개수가 DF다
- DF가 높을수록 IDF는 낮아진다
- DF는 Corpus가 바뀌면 달라질 수 있다

## 예시로 한 바퀴
Corpus:

```text
D1: cat cat dog
D2: cat fish
D3: dog fish
D4: cat dog fish

```
`cat`이 등장한 문서:

```text
D1
D2
D4

```
따라서
$$DF(cat)=3$$
입니다.
`dog`가 등장한 문서:

```text
D1
D3
D4

```
따라서
$$DF(dog)=3$$
입니다.
`fish`가 등장한 문서:

```text
D2
D3
D4

```
따라서
$$DF(fish)=3$$
입니다.
D1에서 `cat`이 두 번 등장하지만 DF에서는 D1을 한 번만 셉니다.

## 객관식 6문제
**1.** DF가 의미하는 것은?
- ① 한 문서에서 Term이 등장한 횟수
- ② 특정 Term이 등장한 문서의 개수
- ③ 전체 Token의 개수
- ④ Vocabulary의 차원

<details>
<summary>정답</summary>

②

</details>

**2.** D1에서 `AI`가 5번, D2에서 1번, D3에서 0번 등장했다면 DF(AI)는?
- ① 1
- ② 2
- ③ 5
- ④ 6

<details>
<summary>정답</summary>

②

</details>

**3.** 전체 문서가 20개라면 가능한 DF의 최대값은?
- ① 1
- ② 10
- ③ 20
- ④ 제한 없음

<details>
<summary>정답</summary>

③

</details>

**4.** TF와 DF의 차이로 맞는 것은?
- ① TF는 문서 내부 빈도, DF는 등장한 문서 수
- ② TF와 DF는 항상 같다
- ③ TF는 Corpus 전체만 본다
- ④ DF는 단어 순서를 계산한다

<details>
<summary>정답</summary>

①

</details>

**5.** DF가 증가할 때 일반적으로 IDF는 어떻게 되는가?
- ① 증가
- ② 감소
- ③ 항상 1
- ④ 무조건 음수

<details>
<summary>정답</summary>

②

</details>

**6.** Count DTM에서 특정 Term의 DF를 구하는 방법은?
- ① 해당 열의 모든 값을 곱한다
- ② 해당 열에서 0이 아닌 행의 개수를 센다
- ③ 해당 행의 최대값을 구한다
- ④ 모든 열의 평균을 구한다

<details>
<summary>정답</summary>

②

</details>

## 다음에 이을 글
IDF Inverse Document Frequency입니다.  
전체 문서에서 흔한 Term의 가중치는 낮추고, 드문 Term의 가중치는 높이는 방법입니다.
