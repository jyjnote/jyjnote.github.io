---
title: 토큰화 Tokenization
date: 2026-09-10 09:20:00 +0900
slug: tokenization
permalink: /posts/tokenization/
categories: [AI, 자연어처리]
tags: [자연어처리, Tokenization, Token, Tokenizer, NLP]
math: false
---
텍스트를 모델이 처리할 수 있는 **작은 단위 Token으로 나누는 과정**입니다.  
단어, 형태소, 문자, Subword 등이 Token이 될 수 있습니다.
<blockquote class="prompt-info">
  <p>Tokenization = 문자열을 모델이 다룰 처리 단위로 나누는 과정입니다.</p>
</blockquote>
```text
나는 사과를 좋아한다
→ 나는 / 사과를 / 좋아한다
```
<mark>Token은 항상 단어가 아닙니다. 같은 문장도 Tokenizer에 따라 다르게 나뉩니다.</mark>
<details>
<summary>한 줄로</summary>
긴 문자열을 모델이 계산할 작은 조각들로 자르는 단계입니다.
</details>

## 전처리에서의 위치
```text
Corpus
  ↓
Normalization
  ↓
Tokenization
  ↓
Token
  ↓
Vocabulary
```
현대 LLM에서는 Tokenizer가 일부 정규화까지 같이 수행하기도 합니다.

## Token이란
Token은 모델이 하나의 단위로 처리하는 조각입니다.
```text
I love NLP
```
단어 기준:
```text
I / love / NLP
```
문자 기준:
```text
I / l / o / v / e / N / L / P
```
Subword 기준:
```text
I / love / NL / P
```
즉,
```text
Token = 처리 단위
```
이지 `Token = 항상 단어`는 아닙니다.

## 단어 단위 Tokenization
가장 직관적인 방식입니다.
```text
I love machine learning
→ I / love / machine / learning
```
Python:
```python
text = "I love machine learning"
tokens = text.split()
```
하지만 공백만으로는 부족합니다.
```text
Hello, world!
don't
machine-learning
```
같은 표현에서 쉼표, 축약형, 하이픈을 어떻게 처리할지 규칙이 필요합니다.
<blockquote class="prompt-warning">
  <p>공백 분리는 Tokenization의 가장 단순한 예일 뿐, 실제 Tokenizer와 같다고 보면 안 됩니다.</p>
</blockquote>

## 단어 단위의 문제
단어 기준으로만 자르면 Vocabulary가 커집니다.
```text
play
plays
played
playing
player
```
를 모두 다른 Token으로 볼 수 있기 때문입니다.
또 학습 때 보지 못한 단어가 들어오면 **OOV** 문제가 생깁니다.
```text
OOV = Out Of Vocabulary
```
예:
```text
Vocabulary:
apple
banana
orange
입력:
pineapple
```
과거에는 이런 단어를
```text
<UNK>
```
로 바꾸기도 했습니다.
하지만 여러 다른 단어가 전부 `<UNK>`가 되면 원래 차이가 사라집니다.

## 문자 단위 Tokenization
```text
cat
→ c / a / t
```
장점:
- Vocabulary가 작음
- OOV에 강함
- 모든 문자열 표현 가능
단점:
- 문장이 매우 길어짐
- 의미 단위가 너무 잘게 깨짐
단어와 문자 방식의 중간이 **Subword**입니다.

## Subword Tokenization
단어보다 작고 문자보다 큰 조각을 사용합니다.
```text
unbelievable
→ un / believe / able
```
정확한 분할은 Tokenizer마다 다릅니다.
핵심:
```text
자주 나오는 문자열 → 크게 유지
드문 문자열 → 작은 조각으로 분리
```
장점:
- Vocabulary 크기 제한
- OOV 문제 완화
- 단어 일부를 재사용 가능
<mark>현대 Transformer와 LLM에서는 Subword Tokenization이 핵심입니다.</mark>

## BPE
**Byte Pair Encoding**입니다.
작은 단위에서 시작해 **자주 같이 나오는 쌍을 반복해서 합칩니다.**
```text
l o w
l o w e r
```
에서 `l + o`가 자주 나오면
```text
lo
```
로 합치고, 다시 `lo + w`가 자주 나오면
```text
low
```
로 합치는 식입니다.
핵심:
```text
빈번한 Pair를 반복적으로 Merge
```

## WordPiece
BERT 계열에서 유명한 Subword 방식입니다.
예:
```text
playing
→ play / ##ing
```
`##`는 앞 Token 뒤에 이어지는 Subword라는 표시입니다.
BPE와 비슷하지만 조각을 선택하는 기준은 같지 않습니다.
<blockquote class="prompt-warning">
  <p>BPE와 WordPiece는 둘 다 Subword 방식이지만 병합 기준이 동일한 알고리즘은 아닙니다.</p>
</blockquote>

## SentencePiece
공백으로 단어를 먼저 자르지 않고 **원문 전체에서 Subword를 학습**할 수 있습니다.
대표적으로
```text
BPE
Unigram
```
방식을 사용할 수 있습니다.
영어처럼 공백이 명확한 언어만 가정하지 않아 다국어 모델에서도 자주 사용됩니다.

## 한국어 Tokenization
한국어는 공백만 기준으로 자르기 어렵습니다.
```text
나는 사과를 먹었다
```
공백 기준:
```text
나는 / 사과를 / 먹었다
```
형태소 기준:
```text
나 / 는
사과 / 를
먹 / 었 / 다
```
따라서
```text
나는
나를
나도
```
가 공백 기준에서는 다른 Token이지만 형태소 분석에서는 공통 부분을 찾을 수 있습니다.
한국어에서는 주로
- 형태소 기반
- Subword 기반
Tokenization을 많이 봅니다.

## 형태소 Tokenization
형태소는 의미나 문법 기능을 가지는 작은 단위입니다.
```text
먹었다
→ 먹 / 었 / 다
```
장점:
- 조사·어미 변화 처리
- 한국어 구조 반영
단점:
- 형태소 분석기 필요
- 분석 오류 가능
<mark>형태소 분석과 Tokenization은 같은 말은 아니지만, 형태소를 Token 단위로 사용할 수 있습니다.</mark>

## Token ID
모델은 문자열 Token 자체를 계산하지 않습니다.
Vocabulary의 각 Token에 숫자 ID를 붙입니다.
```text
0: <PAD>
1: <UNK>
2: I
3: love
4: AI
```
문장:
```text
I love AI
```
Token:
```text
I / love / AI
```
Token ID:
```text
2 / 3 / 4
```
전체 흐름:
```text
Text
 ↓
Token
 ↓
Token ID
 ↓
Embedding
 ↓
Model
```

## Special Token
일반 단어가 아닌 특별한 Token입니다.
| Token | 역할 |
| --- | --- |
| `<PAD>` | 길이 맞추기 |
| `<UNK>` | 모르는 Token |
| `<BOS>` | 문장 시작 |
| `<EOS>` | 문장 끝 |
| `<CLS>` | 분류용 대표 Token |
| `<SEP>` | 문장 구분 |
| `<MASK>` | Masked LM |
모든 모델이 같은 Special Token을 쓰는 것은 아닙니다.

## Padding과 Truncation
배치 학습에서는 문장 길이를 맞출 때 `<PAD>`를 붙일 수 있습니다.
```text
I / love / AI / <PAD>
I / like / machine / learning
```
반대로 모델 최대 길이보다 긴 입력은 잘라야 할 수 있습니다.
```text
700 Tokens
→ 512 Tokens
```
이것이 **Truncation**입니다.
<blockquote class="prompt-danger">
  <p>Truncation은 실제 정보를 버립니다. 중요한 내용이 뒤에 있다면 그대로 잘릴 수 있습니다.</p>
</blockquote>

## Token 수가 중요한 이유
LLM에서는 글자 수보다 **Token 수**가 중요합니다.
Token 수는
- Context Length
- 메모리 사용량
- 처리 시간
- 추론 비용
에 영향을 줍니다.
같은 문장도 Tokenizer가 다르면 Token 수가 달라질 수 있습니다.

## 모델과 Tokenizer는 짝
사전학습 모델은 학습 때 사용한 Vocabulary와 Tokenizer를 기준으로 Token ID를 해석합니다.
```text
Tokenizer A:
AI → 105
Tokenizer B:
AI → 731
```
같은 Token도 ID가 다를 수 있습니다.
<blockquote class="prompt-danger">
  <p>사전학습 모델은 일반적으로 그 모델과 함께 제공된 Tokenizer를 사용해야 합니다.</p>
</blockquote>

## Python으로 보면
공백 기준:
```python
text = "나는 AI를 공부한다"
tokens = text.split()
print(tokens)
```
결과:
```text
['나는', 'AI를', '공부한다']
```
문자 기준:
```python
text = "AI"
tokens = list(text)
```
결과:
```text
['A', 'I']
```
실제 Transformer에서는 해당 모델 전용 Tokenizer를 사용합니다.

## 방식 비교
| 방식 | 장점 | 단점 |
| --- | --- | --- |
| 단어 | 의미 단위가 큼 | 큰 Vocabulary, OOV |
| 문자 | OOV 거의 없음 | Sequence가 김 |
| Subword | 둘의 절충 | Tokenizer 학습 필요 |
| 형태소 | 한국어 구조 반영 | 분석기·오류 문제 |
현대 NLP에서는 Subword가 가장 중요한 연결점입니다.

## 잘 놓치는 핵심
### 1. Token ≠ 단어
문자, 형태소, Subword도 가능합니다.
### 2. 공백 분리 ≠ 실제 Tokenizer
가장 단순한 예입니다.
### 3. 단어 방식은 OOV 문제가 있음
처음 보는 단어를 처리하기 어렵습니다.
### 4. Subword는 OOV를 완화
드문 단어를 더 작은 조각으로 나눕니다.
### 5. Vocabulary가 너무 커도 문제
Embedding 파라미터와 메모리가 늘어납니다.
### 6. 모델과 Tokenizer는 짝
Token ID 의미가 맞아야 합니다.

## 시험·면접
<blockquote class="prompt-info">
  <p>단골: Token과 단어 차이, OOV, Subword, BPE, WordPiece, SentencePiece, Special Token, Padding.</p>
</blockquote>
자주 나오는 문장:
- Tokenization은 텍스트를 처리 단위로 나눈다
- Token은 반드시 단어가 아니다
- 단어 기반 Tokenization은 OOV 문제가 있다
- Subword는 Vocabulary와 OOV 문제를 완화한다
- BPE, WordPiece, SentencePiece는 대표적인 Subword 방식이다
- Token은 Token ID로 변환되어 모델에 입력된다

## 예시로 한 바퀴
문장:
```text
I love playing football
```
단어 기준:
```text
I / love / playing / football
```
Subword의 예:
```text
I / love / play / ing / foot / ball
```
Token ID가
```text
I     → 10
love  → 25
play  → 31
ing   → 44
foot  → 52
ball  → 73
```
이면 모델 입력은
```text
10 / 25 / 31 / 44 / 52 / 73
```
입니다.

## 객관식 6문제
**1.** Tokenization의 의미는?
- ① 가중치 초기화
- ② 텍스트를 처리 단위로 나눔
- ③ 문서를 삭제
- ④ 손실을 미분
<details>
<summary>정답</summary>
②
</details>
**2.** Token에 대한 설명으로 맞는 것은?
- ① 항상 단어
- ② 항상 한 글자
- ③ 모델이 처리하는 단위
- ④ 항상 문장 하나
<details>
<summary>정답</summary>
③
</details>
**3.** 단어 기반 Tokenization의 대표 문제는?
- ① OOV
- ② Gradient Vanishing
- ③ PCA
- ④ 다중공선성
<details>
<summary>정답</summary>
①
</details>
**4.** 다음 중 대표적인 Subword 방식은?
- ① BPE
- ② KNN
- ③ PCA
- ④ DBSCAN
<details>
<summary>정답</summary>
①
</details>
**5.** `<PAD>`의 역할은?
- ① 문장 길이를 맞춤
- ② 모르는 단어 표현
- ③ 손실 계산
- ④ 차원축소
<details>
<summary>정답</summary>
①
</details>
**6.** 사전학습 모델의 Tokenizer에 대한 설명으로 맞는 것은?
- ① 아무 Tokenizer나 사용
- ② 일반적으로 모델과 함께 제공된 Tokenizer 사용
- ③ Tokenizer는 추론에 필요 없음
- ④ Token ID는 모든 모델에서 동일
<details>
<summary>정답</summary>
②
</details>

## 다음에 이을 글
형태소 분석 Morphological Analysis입니다.  
한국어 문장을 의미와 문법 기능을 가진 작은 단위로 분석합니다.
