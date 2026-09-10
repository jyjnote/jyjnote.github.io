---
title: IDF Inverse Document Frequency
date: 2026-09-10 10:50:00 +0900
slug: inverse-document-frequency
permalink: /posts/inverse-document-frequency/
categories: [AI, 자연어처리]
tags: [자연어처리, IDF, InverseDocumentFrequency, DF, TFIDF, NLP]
math: true
---
전체 문서에서 **흔하게 등장하는 Term의 가중치는 낮추고**, 드물게 등장하는 Term의 가중치는 높이는 방법입니다.  
DF를 그대로 쓰지 않고 역수와 로그를 이용해 중요도로 변환합니다.

<blockquote class="prompt-info">
<p>IDF = 전체 Corpus에서 드문 Term일수록 더 큰 값을 주는 가중치입니다.</p>
</blockquote>

예:

```text
D1: AI is useful
D2: AI is powerful
D3: NLP is useful

```
`is`는 여러 문서에 등장합니다.
`powerful`은 한 문서에만 등장합니다.
따라서 일반적으로

```text
IDF(is)
<
IDF(powerful)

```
가 됩니다.

<mark>DF가 높을수록 IDF는 낮고, DF가 낮을수록 IDF는 높습니다.</mark>

<details>
<summary>한 줄로</summary>

전체 문서에서 흔한 단어는 덜 중요하게, 드문 단어는 더 중요하게 보는 가중치입니다.

</details>

## 왜 필요한가
TF는 한 문서 안에서 단어가 얼마나 자주 등장하는지를 봅니다.
하지만 다음 Corpus를 보겠습니다.

```text
D1: the cat is cute
D2: the dog is fast
D3: the car is new

```
`the`, `is`는 여러 문서에 반복됩니다.
한 문서 안에서는 자주 나올 수 있지만 문서를 구분하는 정보는 적습니다.
반면

```text
cat
dog
car

```
는 특정 문서에만 등장합니다.
그래서 전체 Corpus 기준으로 흔한 단어의 가중치를 낮출 필요가 있습니다.

## DF와 연결
DF는 특정 Term이 등장한 문서의 개수입니다.
예:

```text
전체 문서 수 N = 4

```
Corpus:

```text
D1: AI model
D2: AI system
D3: NLP model
D4: vision model

```
DF:

```text
DF(AI) = 2
DF(model) = 3
DF(NLP) = 1
DF(vision) = 1

```
DF가 큰 `model`은 많은 문서에 등장합니다.
DF가 작은 `NLP`, `vision`은 상대적으로 희귀합니다.
IDF는 이 DF를 반대 방향의 가중치로 바꿉니다.

```text
DF 높음 → IDF 낮음
DF 낮음 → IDF 높음

```

## 기본 공식
가장 대표적인 IDF 공식은 다음과 같습니다.
$$IDF(t)=\log\frac{N}{DF(t)}$$
여기서

```text
N     → 전체 문서 수
DF(t) → Term t가 등장한 문서 수

```
입니다.
예를 들어 전체 문서 수가 $$N=100$$이고 특정 Term의 DF가 10이라면
$$IDF(t)=\log\frac{100}{10}=\log 10$$
입니다.

<blockquote class="prompt-info">
<p>IDF는 전체 문서 수를 해당 Term의 DF로 나눈 뒤 로그를 취하는 방식이 가장 대표적입니다.</p>
</blockquote>

## 모든 문서에 등장하면
전체 문서 수가 $$N$$이고 특정 Term이 모든 문서에 등장하면
$$DF(t)=N$$
입니다.
따라서
$$IDF(t)=\log\frac{N}{N}=\log 1=0$$
입니다.
즉 모든 문서에 공통으로 등장하는 Term은 문서를 구분하는 정보가 거의 없다고 보는 것입니다.
예:

```text
D1: the cat
D2: the dog
D3: the car

```
`the`가 모든 문서에 등장한다면 기본 IDF 공식에서는 0이 됩니다.

## 한 문서에만 등장하면
전체 문서 수가 $$N=100$$이고 Term이 한 문서에만 등장하면
$$DF(t)=1$$
입니다.
따라서
$$IDF(t)=\log\frac{100}{1}=\log 100$$
입니다.
DF가 매우 낮기 때문에 높은 IDF를 가집니다.

```text
한 문서에만 등장
→ 희귀함
→ 높은 IDF

```

## 숫자로 비교
전체 문서 수:

```text
N = 100

```
세 Term의 DF:

```text
Term A → DF = 100
Term B → DF = 10
Term C → DF = 1

```
기본 IDF:

```text
A → log(100 / 100) = log(1)
B → log(100 / 10)  = log(10)
C → log(100 / 1)   = log(100)

```
따라서

```text
IDF(A) < IDF(B) < IDF(C)

```
입니다.

<blockquote class="prompt-info">
<p>전체 문서에서 드물게 등장할수록 IDF 값은 커집니다.</p>
</blockquote>

## Smooth IDF
대표적인 형태 중 하나는 다음과 같습니다.
$$IDF(t)=\log\frac{N+1}{DF(t)+1}+1$$
분자와 분모에 1을 더해 0으로 나누는 문제를 피합니다.
마지막에 1을 더하는 방식도 자주 사용됩니다.
예:

```text
N = 100
DF = 0

```
이면
$$IDF(t)=\log\frac{101}{1}+1$$
처럼 계산할 수 있습니다.

<blockquote class="prompt-warning">
<p>IDF 공식은 하나로 완전히 고정되어 있지 않습니다. 라이브러리와 교재에 따라 Smoothing과 +1 사용 여부가 다를 수 있습니다.</p>
</blockquote>

## TF와 IDF의 차이
TF:

```text
한 문서 내부를 봄

```
IDF:

```text
Corpus 전체를 봄

```
TF는 한 문서에서 Term이 얼마나 자주 등장하는지를 나타냅니다.
IDF는 그 Term이 전체 문서에서 얼마나 희귀한지를 나타냅니다.

```text
TF
→ Local

IDF
→ Global

```
이라고 기억해도 좋습니다.

## Corpus가 바뀌면
IDF는 Corpus에 따라 달라집니다.
Corpus A:

```text
D1: AI model
D2: AI system

```
`AI`는 모든 문서에 등장합니다.

```text
N = 2
DF(AI) = 2

```
기본 공식에서는
$$IDF(AI)=\log\frac{2}{2}=0$$
입니다.
Corpus B:

```text
D1: AI model
D2: NLP system
D3: vision model
D4: database system

```
여기서는

```text
N = 4
DF(AI) = 1

```
이므로
$$IDF(AI)=\log\frac{4}{1}$$
입니다.
같은 `AI`라도 Corpus가 달라지면 IDF도 달라집니다.

## TF-IDF로 연결
TF와 IDF를 곱하면 TF-IDF입니다.
$$TFIDF(t,d)=TF(t,d)\times IDF(t)$$
의미는 간단합니다.

```text
TF 높음
→ 현재 문서에서 자주 등장

IDF 높음
→ 전체 문서에서는 드물게 등장

```
둘 다 높으면

```text
현재 문서에서는 자주 나오고
다른 문서에서는 흔하지 않은 Term

```
입니다.
이런 Term은 해당 문서를 잘 대표할 가능성이 높습니다.

<mark>TF-IDF는 문서 내부 빈도와 Corpus 전체 희소성을 동시에 반영합니다.</mark>

## IDF의 한계
IDF도 완벽한 의미 표현은 아닙니다.
예:

```text
car
automobile

```
두 단어가 비슷한 의미라는 것을 IDF 자체는 알지 못합니다.
또 희귀한 단어라고 해서 항상 중요한 것도 아닙니다.
오타나 잡음도 DF가 낮을 수 있습니다.

```text
희귀함
≠
항상 중요함

```
입니다.

<blockquote class="prompt-danger">
<p>IDF는 희귀성을 이용한 통계적 가중치이지 단어의 의미 자체를 이해하는 방법은 아닙니다.</p>
</blockquote>

## 잘 놓치는 핵심

### 1. IDF는 Corpus 전체를 본다
개별 문서 하나만으로 계산하지 않습니다.

### 2. DF가 높으면 IDF는 낮다
둘은 반대 방향으로 움직입니다.

### 3. 모든 문서에 나오면 기본 IDF는 0
$$DF(t)=N$$이면 $$IDF(t)=0$$입니다.

### 4. 같은 Corpus에서 같은 Term의 IDF는 동일
문서마다 달라지는 것은 TF입니다.

### 5. 공식이 하나만 있는 것은 아니다
Smooth IDF 등 구현마다 조금씩 다를 수 있습니다.

### 6. TF와 곱하면 TF-IDF
문서 내부 빈도와 Corpus 전체 희소성을 동시에 반영합니다.

## 시험·면접

<blockquote class="prompt-info">
<p>단골: IDF 공식, DF와 반대 관계, 모든 문서에 등장할 때 값, Smooth IDF, TF와 차이, TF-IDF와 연결.</p>
</blockquote>

자주 나오는 문장:
- IDF는 전체 Corpus에서 희귀한 Term에 높은 값을 준다
- DF가 높을수록 IDF는 낮아진다
- 기본 공식은 log(N/DF) 형태다
- 모든 문서에 등장하면 기본 IDF는 0이다
- 같은 Corpus에서 특정 Term의 IDF는 문서마다 같다
- TF와 IDF를 곱하면 TF-IDF가 된다

## 예시로 한 바퀴
Corpus:

```text
D1: AI model
D2: AI system
D3: NLP model
D4: vision model

```
전체 문서 수:

```text
N = 4

```
DF:

```text
DF(AI) = 2
DF(model) = 3
DF(NLP) = 1
DF(vision) = 1
DF(system) = 1

```
기본 IDF:
$$IDF(AI)=\log\frac{4}{2}=\log 2$$
$$IDF(model)=\log\frac{4}{3}$$
$$IDF(NLP)=\log\frac{4}{1}=\log 4$$
따라서

```text
IDF(model)
<
IDF(AI)
<
IDF(NLP)

```
입니다.
`model`은 여러 문서에 등장하므로 가장 낮고, `NLP`는 한 문서에만 등장하므로 높습니다.

## 객관식 6문제
**1.** IDF가 높은 Term의 특징은?
- ① 대부분의 문서에 등장
- ② 상대적으로 적은 문서에 등장
- ③ 반드시 가장 긴 단어
- ④ 항상 TF가 0

<details>
<summary>정답</summary>

②

</details>

**2.** 기본 IDF 공식으로 맞는 것은?
- ① log(DF/N)
- ② log(N/DF)
- ③ TF+DF
- ④ N×DF

<details>
<summary>정답</summary>

②

</details>

**3.** 전체 문서가 10개이고 어떤 Term이 모든 문서에 등장한다면 기본 IDF는?
- ① 0
- ② 1
- ③ 10
- ④ 무한대

<details>
<summary>정답</summary>

①

</details>

**4.** DF가 증가하면 일반적으로 IDF는?
- ① 증가
- ② 감소
- ③ 항상 일정
- ④ 반드시 음수

<details>
<summary>정답</summary>

②

</details>

**5.** 같은 Corpus에서 같은 Term의 IDF에 대한 설명으로 맞는 것은?
- ① 문서마다 항상 다른 값
- ② 같은 값이 사용됨
- ③ TF와 항상 동일
- ④ 계산할 수 없음

<details>
<summary>정답</summary>

②

</details>

**6.** TF-IDF의 의미로 가장 적절한 것은?
- ① 문서 내부 빈도와 Corpus 전체 희소성을 함께 반영
- ② 단어 순서를 완벽히 저장
- ③ 단어의 의미를 직접 이해
- ④ 이미지 Feature를 추출

<details>
<summary>정답</summary>

①

</details>

## 다음에 이을 글
TF-IDF입니다.  
TF와 IDF를 곱해 문서 내부에서는 자주 등장하고 전체 Corpus에서는 드문 Term에 높은 가중치를 부여합니다.
