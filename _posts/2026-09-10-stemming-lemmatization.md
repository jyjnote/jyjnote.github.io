---
title: 어간 추출과 표제어 추출 Stemming · Lemmatization
date: 2026-09-10 09:40:00 +0900
slug: stemming-lemmatization
permalink: /posts/stemming-lemmatization/
categories: [AI, 자연어처리]
tags: [자연어처리, Stemming, Lemmatization, 어간추출, 표제어추출, NLP]
math: false
---
형태가 조금씩 다른 단어를 **하나의 기본 형태로 통일하는 전처리**입니다.  
대표적으로 어간 추출(Stemming)과 표제어 추출(Lemmatization)이 있습니다.
<blockquote class="prompt-info">
  <p>Stemming은 규칙으로 잘라 어간에 가깝게 만들고, Lemmatization은 사전·품사를 이용해 올바른 기본형을 찾습니다.</p>
</blockquote>
예:
```text
playing
played
plays
```
어간 추출:
```text
play
```
표제어 추출:
```text
play
```
겉보기 결과는 같을 수 있지만 **방법과 정확도는 다릅니다.**
<mark>둘의 목적은 단어 형태의 변형을 줄여 Vocabulary를 단순하게 만드는 것입니다.</mark>
<details>
<summary>한 줄로</summary>
Stemming은 빠르게 잘라내고, Lemmatization은 문법에 맞는 기본형을 찾습니다.
</details>

## 왜 필요한가
다음 단어를 보겠습니다.
```text
play
plays
played
playing
```
사람은 모두 `play`라는 공통 의미를 쉽게 찾습니다.
하지만 문자열 기준으로는 전부 다른 Token입니다.
```text
play
plays
played
playing
```
Vocabulary에 네 개가 따로 들어갈 수 있습니다.
이를 기본형으로 통일하면
```text
play
```
하나로 묶을 수 있습니다.
```text
표현 변형 감소
→ Vocabulary 감소
→ 같은 의미의 빈도 통합
```
이것이 Stemming과 Lemmatization의 기본 목적입니다.

## Stemming
**어간 추출(Stemming)**은 단어의 앞이나 뒤를 규칙적으로 잘라 **어간에 가까운 형태**를 만드는 방식입니다.
예:
```text
connected
connecting
connection
```
Stemmer가 규칙에 따라
```text
connect
```
에 가까운 형태로 줄일 수 있습니다.
하지만 결과가 실제 사전에 존재하는 단어일 필요는 없습니다.
예를 들어 Stemmer에 따라
```text
studies
→ studi
```
처럼 나올 수 있습니다.
<blockquote class="prompt-warning">
  <p>Stemming 결과는 반드시 실제 단어일 필요가 없습니다. 규칙적으로 잘라낸 결과이기 때문입니다.</p>
</blockquote>

## Lemmatization
**표제어 추출(Lemmatization)**은 단어의 품사와 문법 정보를 이용해 **사전에 있는 기본형 Lemma**를 찾습니다.
예:
```text
am
is
are
was
were
```
표제어:
```text
be
```
또
```text
better
```
의 표제어는 문맥에 따라
```text
good
```
이 될 수 있습니다.
단순히 글자를 잘라서는 얻기 어려운 결과입니다.
<mark>Lemmatization은 형태만 보는 것이 아니라 품사와 사전 정보를 활용합니다.</mark>

## 둘의 차이
| 구분 | Stemming | Lemmatization |
| --- | --- | --- |
| 기준 | 규칙·접사 제거 | 사전·품사·문법 |
| 속도 | 빠름 | 상대적으로 느림 |
| 결과 | 실제 단어 아닐 수 있음 | 실제 기본형 |
| 정확도 | 비교적 낮음 | 비교적 높음 |
| 구현 | 단순 | 복잡 |
예:
```text
studies
```
Stemming:
```text
studi
```
Lemmatization:
```text
study
```
차이는 여기서 가장 잘 보입니다.

## 품사가 중요한 이유
같은 단어도 품사에 따라 표제어가 달라질 수 있습니다.
예:
```text
better
```
형용사라면
```text
good
```
의 비교급입니다.
또
```text
meeting
```
은 문맥에 따라
```text
meet
```
라는 동사의 활용형일 수도 있고,
```text
meeting
```
이라는 명사 자체일 수도 있습니다.
따라서 Lemmatization은 POS Tagging과 연결됩니다.
```text
Token
  ↓
POS Tagging
  ↓
Lemmatization
```

## 형태소 분석과의 관계
한국어에서는 형태소 분석이 먼저 사용되는 경우가 많습니다.
예:
```text
먹었다
```
형태소 분석:
```text
먹 / 었 / 다
```
여기서 동사 기본형을 찾으면
```text
먹다
```
로 볼 수 있습니다.
즉,
```text
형태소 분석
→ 어간 확인
→ 기본형 복원
```
의 흐름입니다.
<blockquote class="prompt-info">
  <p>한국어에서 표제어 추출은 형태소 분석과 매우 밀접합니다. 조사와 어미를 먼저 분리해야 기본형을 찾기 쉽습니다.</p>
</blockquote>

## 한국어의 어간
용언에서 변하지 않는 중심 부분입니다.
```text
먹는다
먹었다
먹으면
먹고
```
공통 부분:
```text
먹
```
이 어간입니다.
```text
먹었다
→ 먹 / 었 / 다
```
- `먹`: 어간
- `었`: 선어말어미
- `다`: 종결어미
어간 추출은 이런 공통 부분을 찾는 데 초점을 둡니다.

## 한국어 표제어
표제어는 사전에서 찾을 수 있는 기본형으로 생각하면 쉽습니다.
```text
먹었다 → 먹다
갔다 → 가다
좋았다 → 좋다
했다 → 하다
```
어간만 남기면
```text
먹
가
좋
하
```
이지만 표제어는
```text
먹다
가다
좋다
하다
```
처럼 사전형으로 복원합니다.
<mark>어간과 표제어는 같은 것이 아닙니다. 어간은 활용의 중심 부분, 표제어는 사전 기본형입니다.</mark>

## 불규칙 활용
한국어에서는 단순히 어미만 자르면 안 되는 경우가 있습니다.
예:
```text
들었다
```
문맥에 따라 기본형은
```text
듣다
```
일 수 있습니다.
또
```text
도왔다
→ 돕다
```
처럼 형태가 바뀌기도 합니다.
이런 불규칙 활용 때문에 단순 Stemming보다 형태소 분석과 사전 기반 처리가 중요합니다.
<blockquote class="prompt-warning">
  <p>한국어는 불규칙 활용이 있어 단순 접미사 제거만으로 정확한 기본형을 찾기 어렵습니다.</p>
</blockquote>

## 과도한 Stemming
Stemming을 너무 강하게 적용하면 다른 단어까지 같은 형태로 합쳐질 수 있습니다.
이를 **Over-stemming**이라고 합니다.
예를 들어 의미가 다른 두 단어가 지나치게 짧은 Stem으로 합쳐지면 정보가 사라집니다.
```text
서로 다른 단어
→ 같은 Stem
```
결과:
```text
구분 정보 손실
```

## 너무 약한 Stemming
반대로 변형된 단어가 충분히 합쳐지지 않을 수도 있습니다.
이를 **Under-stemming**이라고 합니다.
```text
connect
connected
connection
```
이 서로 다른 Stem으로 남는다면 통일 효과가 약합니다.
즉,
```text
Over-stemming → 너무 많이 합침
Under-stemming → 충분히 못 합침
```
입니다.

## 전처리에서의 위치
전체 흐름으로 보면
```text
Corpus
  ↓
Normalization
  ↓
Tokenization
  ↓
Morphological Analysis
  ↓
Stopword
  ↓
Stemming · Lemmatization
  ↓
BoW · TF-IDF
```
처럼 연결할 수 있습니다.
다만 실제 파이프라인 순서는 목적에 따라 달라집니다.
예를 들어 형태소 분석 결과에서 먼저 품사를 고르고 표제어를 만드는 방식도 가능합니다.

## 검색에서의 효과
검색어:
```text
connect
```
문서에는
```text
connected
connecting
connection
```
만 있을 수 있습니다.
형태를 통일하면 관련 문서를 더 쉽게 찾을 수 있습니다.
```text
connect
connected
connecting
→ connect
```
검색에서 **Recall을 높이는 데 도움**이 될 수 있습니다.
하지만 서로 다른 의미까지 합치면 Precision이 떨어질 수도 있습니다.

## 현대 LLM에서는
현대 Transformer와 LLM에서는 Stemming이나 Lemmatization을 반드시 먼저 하지 않습니다.
Subword Tokenizer가
```text
playing
played
player
```
를 내부적으로 공통 조각과 다른 조각으로 나눌 수 있기 때문입니다.
예:
```text
play / ing
play / ed
play / er
```
따라서 원문을 보존한 채 모델이 문맥을 학습하도록 두는 경우가 많습니다.
<blockquote class="prompt-info">
  <p>Stemming과 Lemmatization은 전통 NLP에서 특히 중요하고, 현대 LLM에서는 항상 필수 전처리는 아닙니다.</p>
</blockquote>

## 언제 무엇을 쓰나
Stemming이 맞는 경우:
- 빠른 전처리 필요
- 검색·색인
- 정확한 원형보다 통합이 중요
- 큰 데이터에서 단순 규칙 사용
Lemmatization이 맞는 경우:
- 자연스러운 기본형 필요
- 단어 해석이 중요
- 품사 정보를 활용
- 언어학적 정확성이 중요
```text
속도 우선 → Stemming
정확한 기본형 → Lemmatization
```
로 기억하면 쉽습니다.

## 잘 놓치는 핵심
### 1. Stem ≠ 항상 실제 단어
`studi`처럼 사전에 없는 형태도 나올 수 있습니다.
### 2. Lemma는 사전 기본형
`was → be`처럼 형태가 크게 달라질 수도 있습니다.
### 3. 어간 ≠ 표제어
`먹`은 어간, `먹다`는 표제어입니다.
### 4. Lemmatization은 품사가 중요
문맥과 품사를 알아야 정확한 기본형을 찾을 수 있습니다.
### 5. Stemming은 빠르지만 거칠다
Over-stemming과 Under-stemming 문제가 있습니다.
### 6. 현대 LLM에서는 필수가 아님
Subword Tokenizer와 문맥 모델이 원문을 직접 처리할 수 있습니다.

## 시험·면접
<blockquote class="prompt-info">
  <p>단골: Stemming과 Lemmatization 차이, 어간과 표제어 차이, Over-stemming, 품사 정보 필요 여부.</p>
</blockquote>
자주 나오는 문장:
- Stemming은 규칙적으로 접사를 제거한다
- Stem은 실제 단어가 아닐 수 있다
- Lemmatization은 사전과 품사를 이용한다
- Lemma는 사전의 기본형이다
- 한국어 표제어 추출은 형태소 분석과 밀접하다
- 현대 LLM에서는 반드시 필요한 전처리가 아니다

## 예시로 한 바퀴
영어:
```text
studies
studying
studied
```
Stemming의 예:
```text
studi
studi
studi
```
Lemmatization:
```text
study
study
study
```
한국어:
```text
먹었다
먹으면
먹는다
```
어간:
```text
먹
```
표제어:
```text
먹다
```
핵심은
```text
Stem = 잘라낸 공통 형태
Lemma = 사전에서 찾는 기본형
```
입니다.

## 객관식 6문제
**1.** Stemming의 특징으로 맞는 것은?
- ① 항상 사전의 올바른 단어를 출력
- ② 규칙적으로 접사를 제거해 어간에 가깝게 만듦
- ③ 반드시 품사 태깅이 필요
- ④ 문서를 벡터로 변환
<details>
<summary>정답</summary>
②
</details>
**2.** Lemmatization의 특징은?
- ① 사전과 문법 정보를 이용해 기본형을 찾음
- ② 무조건 마지막 두 글자를 삭제
- ③ 문장 길이를 맞춤
- ④ 숫자만 처리
<details>
<summary>정답</summary>
①
</details>
**3.** `먹었다`에서 어간에 해당하는 것은?
- ① 먹
- ② 었
- ③ 다
- ④ 먹었다 전체만 가능
<details>
<summary>정답</summary>
①
</details>
**4.** `먹었다`의 표제어로 가장 적절한 것은?
- ① 먹
- ② 먹다
- ③ 었다
- ④ 먹었
<details>
<summary>정답</summary>
②
</details>
**5.** Over-stemming은?
- ① 서로 다른 단어를 지나치게 같은 Stem으로 합치는 문제
- ② 아무 단어도 줄이지 못하는 문제
- ③ Token ID가 사라지는 문제
- ④ Padding이 늘어나는 문제
<details>
<summary>정답</summary>
①
</details>
**6.** 현대 LLM에 대한 설명으로 맞는 것은?
- ① Stemming을 반드시 먼저 수행
- ② Lemmatization 없이는 동작 불가
- ③ Subword Tokenizer 때문에 둘이 항상 필수는 아님
- ④ Vocabulary가 필요 없음
<details>
<summary>정답</summary>
③
</details>

## 다음에 이을 글
N-gram입니다.  
연속된 여러 Token을 하나의 단위로 묶어 주변 문맥을 표현합니다.
