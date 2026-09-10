---
title: TF Term Frequency
date: 2026-09-10 10:30:00 +0900
slug: term-frequency
permalink: /posts/term-frequency/
categories: [AI, 자연어처리]
tags: [자연어처리, TF, TermFrequency, DTM, TFIDF, NLP]
math: true
---
한 문서 안에서 특정 Token이 **얼마나 자주 등장하는지**를 나타내는 값입니다.  
단어가 많이 등장할수록 그 문서에서 중요할 가능성이 높다는 직관을 사용합니다.

<blockquote class="prompt-info">
<p>TF = 하나의 문서 안에서 특정 Term이 얼마나 자주 등장하는지를 나타내는 값입니다.</p>
</blockquote>

예:

```text
D1: AI is useful AI

```
단어 빈도:

```text
AI     → 2
is     → 1
useful → 1

```
가장 단순한 TF에서는 `AI`의 TF가 2입니다.

<mark>TF는 문서 하나 내부만 봅니다. 다른 문서에 그 단어가 얼마나 나오는지는 아직 고려하지 않습니다.</mark>

<details>
<summary>한 줄로</summary>

한 문서에서 특정 단어가 얼마나 자주 나왔는지를 수치로 표현한 값입니다.

</details>

## 기본 개념
문서:

```text
AI is useful AI

```
Token 수:

```text
AI
is
useful
AI

```
등장 횟수:

```text
AI     → 2
is     → 1
useful → 1

```
가장 단순한 Term Frequency는 등장 횟수를 그대로 사용합니다.
$$TF(t,d)=Count(t,d)$$
여기서

```text
t → Term
d → Document

```
입니다.

## Raw Count TF
가장 단순한 방식은 단어가 나온 횟수를 그대로 사용하는 것입니다.
문서:

```text
machine learning is useful
machine learning is powerful

```
빈도:

```text
machine  → 2
learning → 2
is       → 2
useful   → 1
powerful → 1

```
Raw Count TF:

```text
machine  → 2
learning → 2
is       → 2
useful   → 1
powerful → 1

```
공식은 $$TF(t,d)=f_{t,d}$$처럼 쓸 수 있습니다.
$$f_{t,d}$$는 문서 $$d$$에서 Term $$t$$가 등장한 횟수입니다.

## DTM과 TF
DTM의 각 칸에는 기본적으로 단어 등장 횟수가 들어갈 수 있습니다.
예:

```text
        AI  NLP  useful
D1       2    0     1
D2       1    1     0

```
이 Count 값을 그대로 TF로 사용한다면

```text
D1의 AI TF = 2
D2의 NLP TF = 1

```
입니다.
즉 Count 기반 DTM의 한 행을 보면 해당 문서의 Raw TF를 확인할 수 있습니다.

<blockquote class="prompt-info">
<p>Raw Count를 사용하는 경우 DTM의 각 값과 TF 값이 동일할 수 있습니다.</p>
</blockquote>

## 왜 정규화가 필요한가
문서 길이가 다르면 단순 Count만 비교하기 어렵습니다.
예:

```text
D1: AI AI useful
D2: AI AI AI AI AI is very useful for many people

```
`AI` 등장 횟수:

```text
D1 → 2
D2 → 5

```
Raw Count만 보면 D2에서 `AI`가 훨씬 중요해 보입니다.
하지만 문서 길이도 다릅니다.

```text
D1 → 3 Tokens
D2 → 더 많은 Tokens

```
그래서 문서 길이를 고려한 TF를 사용할 수 있습니다.

## 정규화 TF
대표적인 방법은 특정 Term의 빈도를 문서 전체 Token 수로 나누는 것입니다.
$$TF(t,d)=\frac{f_{t,d}}{\sum_k f_{k,d}}$$
쉽게 쓰면

```text
Term 등장 횟수
─────────────
문서 전체 Token 수

```
입니다.
예:

```text
D1: AI AI useful

```
전체 Token 수는 3입니다.
`AI`는 2번 등장합니다.
따라서 $$TF(AI,D1)=\frac{2}{3}$$입니다.
`useful`은 1번이므로 $$TF(useful,D1)=\frac{1}{3}$$입니다.

<mark>정규화 TF는 문서 길이가 다른 경우 단순 Count의 영향을 줄여줍니다.</mark>

## 값의 범위
문서 길이로 나눈 정규화 TF는 보통 0과 1 사이입니다.
예:

```text
D: AI AI NLP useful

```
전체 Token 수는 4입니다.

```text
AI     → 2/4 = 0.5
NLP    → 1/4 = 0.25
useful → 1/4 = 0.25

```
즉 한 문서에서 모든 Term의 정규화 TF를 더하면 1이 됩니다.
$$\sum_t TF(t,d)=1$$
단, **TF 정의는 하나로 고정되어 있지 않기 때문에** 모든 TF가 반드시 0과 1 사이인 것은 아닙니다.

## TF 정의는 하나가 아니다
Term Frequency라는 이름 때문에 공식이 하나뿐이라고 생각하기 쉽습니다.
실제로는 여러 방식이 있습니다.

```text
Raw Count
Normalized Frequency
Binary
Log-scaled Frequency

```
목적과 구현에 따라 다른 TF 정의를 사용할 수 있습니다.

<blockquote class="prompt-warning">
<p>TF는 반드시 하나의 공식만 의미하지 않습니다. 어떤 TF 정의를 사용했는지 확인해야 합니다.</p>
</blockquote>

## Log-scaled TF
단어가 많이 나올수록 중요도가 계속 같은 비율로 증가한다고 보기 어려울 수 있습니다.
예:

```text
1번 등장
10번 등장
100번 등장

```
Raw Count는

```text
1
10
100

```
입니다.
하지만 100번 등장한 단어가 10번 등장한 단어보다 정확히 10배 중요하다고 말하기는 어렵습니다.
그래서 로그를 사용할 수 있습니다.
$$TF(t,d)=1+\log f_{t,d}$$
단, $$f_{t,d}>0$$일 때 사용합니다.
등장하지 않은 경우에는 0으로 둡니다.

<blockquote class="prompt-info">
<p>Log-scaled TF는 매우 큰 단어 빈도의 영향이 지나치게 커지는 것을 완화합니다.</p>
</blockquote>

## TF만의 문제
다음 문서들을 생각해 보겠습니다.

```text
D1: the cat is good
D2: the dog is good
D3: the car is good

```
`the`, `is`, `good` 같은 단어는 여러 문서에 반복됩니다.
각 문서 안에서는 TF가 높을 수 있습니다.
하지만 문서를 서로 구분하는 데는

```text
cat
dog
car

```
가 더 중요할 수 있습니다.

<blockquote class="prompt-danger">
<p>TF는 문서 내부 빈도만 보기 때문에 모든 문서에서 흔한 단어도 높은 값을 받을 수 있습니다.</p>
</blockquote>

## 그래서 IDF가 필요하다
TF의 한계를 보완하기 위해 전체 Corpus를 봅니다.

```text
TF
→ 한 문서 안에서 자주 나오는가?

IDF
→ 전체 문서에서는 얼마나 드문가?

```
둘을 결합하면 TF-IDF가 됩니다.
$$TFIDF(t,d)=TF(t,d)\times IDF(t)$$
즉,

```text
한 문서에서는 자주 등장
+
전체 문서에서는 드물게 등장

```
하는 단어가 높은 값을 받습니다.

<mark>TF는 문서 내부 중요도, IDF는 Corpus 전체에서의 희소성을 반영합니다.</mark>

## TF와 DF의 차이
TF와 DF는 자주 헷갈립니다.
TF:

```text
하나의 문서 안에서
특정 Term이 몇 번 등장했는가

```
DF:

```text
전체 문서 중
특정 Term이 몇 개 문서에 등장했는가

```
예:

```text
D1: AI AI useful
D2: AI model
D3: NLP useful

```
`AI`의 TF:

```text
D1 → 2
D2 → 1
D3 → 0

```
`AI`의 DF:

```text
AI가 등장한 문서
D1, D2

DF(AI) = 2

```

<blockquote class="prompt-info">
<p>TF는 한 문서 내부의 빈도이고, DF는 전체 문서 중 등장한 문서의 개수입니다.</p>
</blockquote>

## 잘 놓치는 핵심

### 1. TF는 문서 하나 내부를 본다
Corpus 전체 빈도가 아닙니다.

### 2. TF 공식은 하나가 아니다
Raw Count, 정규화, Binary, Log-scaled 등 여러 방식이 있습니다.

### 3. 문서 길이가 영향을 줄 수 있다
Raw Count는 긴 문서에서 값이 커지기 쉽습니다.

### 4. TF가 높다고 항상 중요한 것은 아니다
모든 문서에 흔한 단어도 높은 TF를 가질 수 있습니다.

### 5. DF와 다르다
TF는 등장 횟수, DF는 등장한 문서 수입니다.

### 6. TF-IDF의 한 축이다
TF와 IDF를 곱해 단어 중요도를 조정합니다.

## 시험·면접

<blockquote class="prompt-info">
<p>단골: TF 정의, Raw Count와 정규화 TF, 문서 길이 영향, DF와 차이, TF-IDF와 관계.</p>
</blockquote>

자주 나오는 문장:
- TF는 한 문서에서 특정 Term이 등장하는 빈도다
- Raw TF는 단순 등장 횟수다
- 정규화 TF는 문서 길이의 영향을 줄일 수 있다
- TF 정의는 하나로 고정되지 않는다
- TF는 문서 내부만 보기 때문에 흔한 단어 문제를 해결하지 못한다
- TF와 IDF를 결합하면 TF-IDF가 된다

## 예시로 한 바퀴
문서:

```text
D1: AI AI NLP model

```
전체 Token 수는 4입니다.
Raw TF:

```text
AI    → 2
NLP   → 1
model → 1

```
정규화 TF:

```text
AI    → 2/4
NLP   → 1/4
model → 1/4

```
따라서 $$TF(AI,D1)=\frac{2}{4}=0.5$$입니다.
$$TF(NLP,D1)=\frac{1}{4}=0.25$$입니다.
$$TF(model,D1)=\frac{1}{4}=0.25$$입니다.
세 값을 더하면 $$0.5+0.25+0.25=1$$입니다.

## 객관식 6문제
**1.** TF가 의미하는 것은?
- ① 전체 문서 수
- ② 한 문서에서 특정 Term의 빈도
- ③ Vocabulary 크기
- ④ Embedding 차원

<details>
<summary>정답</summary>

②

</details>

**2.** 문서 `AI AI NLP`에서 Raw TF 기준 `AI`의 값은?
- ① 0
- ② 1
- ③ 2
- ④ 3

<details>
<summary>정답</summary>

③

</details>

**3.** 문서 `AI AI NLP`에서 문서 길이로 정규화한 `AI`의 TF는?
- ① 1/3
- ② 2/3
- ③ 1
- ④ 2

<details>
<summary>정답</summary>

②

</details>

**4.** TF에 대한 설명으로 맞는 것은?
- ① 공식이 반드시 하나뿐이다
- ② 항상 Corpus 전체만 본다
- ③ Raw, Normalized, Binary 등 여러 정의가 가능하다
- ④ 단어 순서를 저장한다

<details>
<summary>정답</summary>

③

</details>

**5.** TF와 DF의 차이로 맞는 것은?
- ① TF는 문서 내부 빈도, DF는 Term이 등장한 문서 수
- ② TF와 DF는 항상 같은 값
- ③ TF는 문서 수, DF는 Token 순서
- ④ 둘 다 Embedding 기법

<details>
<summary>정답</summary>

①

</details>

**6.** TF만 사용할 때 생길 수 있는 문제는?
- ① 모든 문서에서 흔한 단어도 높은 값을 받을 수 있음
- ② 숫자로 표현할 수 없음
- ③ Vocabulary를 만들 수 없음
- ④ 모든 값이 항상 0이 됨

<details>
<summary>정답</summary>

①

</details>

## 다음에 이을 글
DF Document Frequency입니다.  
특정 Term이 전체 문서 중 몇 개의 문서에 등장했는지를 계산합니다.
