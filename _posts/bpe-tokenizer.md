---
title: BPE(Byte Pair Encoding) 토크나이저
date: 2026-09-12 13:55:00 +0900
slug: bpe-tokenizer
permalink: /posts/bpe-tokenizer/
categories: [AI, 자연어처리]
tags: [LLM, 토크나이저, BPE, BytePairEncoding, Subword, 생성형AI]
math: true
---

BPE(Byte Pair Encoding)는 **자주 같이 등장하는 토큰 쌍을 반복해서 합치는 방법**입니다.  
LLM에서는 단어보다 작은 **Subword Token**을 만드는 데 사용됩니다.

<blockquote class="prompt-info">
<p>한 줄: 자주 붙어 나오는 문자열은 크게 묶고, 드문 문자열은 작은 조각의 조합으로 남깁니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

BPE는 가장 자주 등장하는 인접 Token Pair를 반복 병합해 Subword Vocabulary를 만드는 방식입니다.

</details>

## 토크나이저가 필요한 이유

LLM은 문자열을 그대로 처리하지 않습니다.

```text
I love AI
→ ["I", " love", " AI"]
→ [40, 3021, 15592]
```

위 Token ID는 설명용 예시입니다. 실제 값은 토크나이저마다 다릅니다.

<mark>LLM이 실제로 처리하는 것은 문자열 자체가 아니라 Token ID의 연속입니다.</mark>

```text
문장
→ Tokenizer
→ Token
→ Token ID
→ Embedding
→ Transformer
```

## 왜 단어 단위로만 자르지 않을까

단어 단위 Tokenization은 직관적입니다.

```text
I love artificial intelligence
→ ["I", "love", "artificial", "intelligence"]
```

하지만 모든 단어를 Vocabulary에 넣을 수는 없습니다.  
학습 때 없던 단어가 들어오면 **OOV(Out Of Vocabulary)** 문제가 생길 수 있습니다.

반대로 문자 단위로 자르면 새로운 단어도 표현할 수 있습니다.

```text
unbelievable
→ u n b e l i e v a b l e
```

하지만 Sequence가 너무 길어집니다.

| 방식 | 장점 | 단점 |
| --- | --- | --- |
| 단어 단위 | Token 수가 적음 | Vocabulary가 커지고 OOV 발생 |
| 문자 단위 | 새로운 단어 표현 가능 | Sequence가 길어짐 |
| Subword | 두 방식의 절충 | Token 경계가 사람 기준과 다를 수 있음 |

BPE는 **Subword**를 사용합니다.

```text
unbelievable
→ ["un", "believ", "able"]
```

실제 결과는 학습된 Vocabulary에 따라 달라집니다.

## BPE의 핵심 아이디어

처음에는 문자열을 작은 단위로 나눕니다.  
그다음 가장 자주 등장하는 **인접 Token Pair**를 찾습니다.

```text
가장 자주 등장하는 Pair
→ 하나의 새로운 Token으로 병합
→ 다시 빈도 계산
→ 반복
```

<blockquote class="prompt-info">
<p>많이 반복되는 패턴은 하나의 큰 Token이 되고, 드문 표현은 작은 Token 여러 개로 남습니다.</p>
</blockquote>

## 가장 간단한 예시

```text
abababab
```

처음에는 문자 단위입니다.

```text
a b a b a b a b
```

가장 자주 등장하는 Pair는 `a b`입니다.

```text
a + b → ab
```

병합하면

```text
ab ab ab ab
```

이제 `ab ab`가 반복됩니다.

```text
ab + ab → abab
```

다시 병합하면

```text
abab abab
```

자주 등장하는 문자열이 점점 하나의 Token으로 커집니다.

## BPE 학습 과정

다음 Corpus가 있다고 하겠습니다.

```text
low
lower
lowest
```

### 1. 작은 단위로 시작

```text
l o w
l o w e r
l o w e s t
```

### 2. 인접 Pair의 빈도 계산

```text
(l, o)
(o, w)
...
```

### 3. 가장 자주 등장하는 Pair 병합

$$p^*=\arg\max_{(a,b)}C(a,b)$$

- `C(a,b)`: 인접 Pair `(a,b)`의 등장 횟수
- `p*`: 가장 자주 등장한 Pair

예를 들어 `l + o`가 선택되면

```text
l + o → lo
```

결과:

```text
lo w
lo w e r
lo w e s t
```

### 4. 다시 계산하고 병합

```text
lo + w → low
```

결과:

```text
low
low e r
low e s t
```

### 5. 원하는 Vocabulary 크기까지 반복

```text
l + o → lo
lo + w → low
e + r → er
...
```

이 과정을 반복하면 Subword Vocabulary가 만들어집니다.

## Vocabulary와 Merge 규칙

### Vocabulary

사용 가능한 Token의 목록입니다.

```text
l
o
w
lo
low
er
...
```

각 Token에는 Token ID가 붙습니다.

### Merge 규칙

어떤 Pair를 어떤 순서로 합칠지 나타냅니다.

```text
l o
lo w
e r
...
```

<mark>Vocabulary는 Token 목록이고, Merge 규칙은 Token을 만드는 병합 순서입니다.</mark>

## 새로운 단어는 어떻게 자를까

새로운 문자열에 학습된 Merge 규칙을 적용합니다.

```text
lower
```

처음:

```text
l o w e r
```

Merge 규칙:

```text
1. l + o → lo
2. lo + w → low
3. e + r → er
```

적용:

```text
l o w e r
→ lo w e r
→ low e r
→ low er
```

최종:

```text
["low", "er"]
```

## BPE는 의미를 보고 합칠까

아닙니다.

BPE는 기본적으로 **빈도**를 기준으로 병합합니다.

```text
자주 같이 등장
→ 병합될 가능성이 높음
```

사람이 보는 형태소 경계와 일치할 필요가 없습니다.

```text
un + happy + ness
```

사람은 이렇게 생각할 수 있지만 BPE는 다음처럼 나눌 수도 있습니다.

```text
["un", "happ", "iness"]
```

<blockquote class="prompt-warning">
<p>BPE Token은 형태소가 아닙니다. 자주 같이 등장해서 병합된 문자열 조각입니다.</p>
</blockquote>

## Vocabulary 크기가 중요한 이유

Vocabulary가 작으면 문자열이 더 잘게 나뉩니다.

```text
artificial
→ ["art", "ific", "ial"]
```

Vocabulary가 커지면 더 긴 문자열이 하나의 Token이 될 수 있습니다.

```text
artificial
→ ["artificial"]
```

| Vocabulary | Sequence | 특징 |
| --- | --- | --- |
| 작음 | 길어짐 | 작은 조각을 많이 조합 |
| 큼 | 짧아질 수 있음 | 긴 문자열 Token이 늘어남 |

하지만 Vocabulary가 커지면 Embedding과 출력층에서 관리할 Token 종류도 많아집니다.

<mark>Vocabulary 크기는 Sequence Length와 Vocabulary 비용 사이의 Trade-off입니다.</mark>

## Byte-level BPE

LLM에서는 **Byte-level BPE**도 중요합니다.

BPE의 병합 원리는 같습니다.

```text
자주 등장하는 Pair
→ 병합
```

다만 문자열을 UTF-8 Byte 수준에서 표현할 수 있는 작은 기본 단위에서 시작합니다.

```text
문자열
→ UTF-8 Byte 표현
→ 기본 Symbol
→ BPE Merge
→ Token
```

이 방식은 한글, 이모지, 특수문자처럼 다양한 문자열도 Byte 조합으로 표현할 수 있습니다.

<blockquote class="prompt-info">
<p>Byte-level BPE는 문자열을 Byte 조합으로 표현할 수 있게 한 뒤, 자주 등장하는 패턴을 BPE로 병합합니다.</p>
</blockquote>

## Byte-level BPE와 OOV

Byte-level 방식에서는 임의의 UTF-8 문자열을 Byte 조합으로 표현할 수 있습니다.

```text
처음 보는 문자열
→ Byte/Subword 조각
→ Tokenize 가능
```

따라서 일반적인 단어 Vocabulary보다 OOV 문제에 강합니다.

<mark>처음 보는 단어라고 해서 반드시 UNK가 되는 것은 아닙니다.</mark>

## 한글과 Token 수

한글 한 글자가 항상 Token 하나가 되는 것은 아닙니다.

```text
인공지능
```

가능한 결과:

```text
["인공", "지능"]
```

또는

```text
["인", "공지", "능"]
```

정확한 결과는 사용하는 토크나이저의 Vocabulary에 따라 달라집니다.

<blockquote class="prompt-warning">
<p>글자 수와 Token 수는 같지 않습니다. 같은 문장도 토크나이저가 다르면 Token 수가 달라집니다.</p>
</blockquote>

## 공백도 중요하다

다음 두 문자열은 다릅니다.

```text
hello
 hello
```

두 번째 문자열에는 앞에 공백이 있습니다.

일부 토크나이저는 공백이 포함된 문자열 패턴 자체를 Token으로 학습합니다.

```text
"hello"
" hello"
```

따라서 서로 다른 Token ID 조합이 나올 수 있습니다.

<mark>Tokenizer에게 공백도 입력 문자열의 일부입니다.</mark>

## Token 수가 중요한 이유

같은 의미의 문장도 토크나이저에 따라 Token 수가 달라질 수 있습니다.

```text
Tokenizer A: 10 Tokens
Tokenizer B: 16 Tokens
```

Token 수는 다음에 영향을 줍니다.

- Context Window 사용량
- Sequence Length
- 추론 시간
- 메모리 사용량
- Token 기준 API 과금

그래서 LLM에서는 글자 수보다 **Token 수**를 확인하는 것이 중요합니다.

## BPE의 장점과 단점

| 구분 | 내용 |
| --- | --- |
| 장점 | OOV 문제 완화 |
| 장점 | 모든 단어를 Vocabulary에 넣을 필요 없음 |
| 장점 | 자주 등장하는 문자열을 적은 Token으로 표현 |
| 단점 | 형태소나 단어 경계와 다를 수 있음 |
| 단점 | 언어별 Token 효율 차이가 생길 수 있음 |
| 단점 | Vocabulary 크기 선택이 필요함 |

## 다른 Subword 방식과 비교

| 방식 | 핵심 |
| --- | --- |
| BPE | 자주 등장하는 Pair를 반복 병합 |
| WordPiece | 다른 기준으로 Subword Vocabulary 구성 |
| Unigram | 큰 후보 Vocabulary에서 불필요한 Token 제거 |

지금은 BPE만 기억하면 됩니다.

```text
BPE
= 가장 자주 등장하는 인접 Pair를 반복 병합
```

## 간단한 의사코드

```text
vocabulary = initial_symbols

repeat:
    인접 token pair의 빈도를 센다
    가장 자주 등장하는 pair를 찾는다
    해당 pair를 새로운 token으로 합친다
    vocabulary에 추가한다

until 원하는 vocabulary 크기에 도달
```

Python 형태로 단순화하면

```python
while len(vocab) < target_vocab_size:
    pair_counts = count_pairs(corpus)
    best_pair = max(pair_counts, key=pair_counts.get)
    corpus = merge_pair(corpus, best_pair)
    vocab.add("".join(best_pair))
```

실제 구현에는 정규화, Pre-tokenization, Special Token 처리 등이 추가될 수 있습니다.

## Tokenizer 전체에서 BPE의 위치

```text
Raw Text
→ Normalization
→ Pre-tokenization
→ BPE
→ Token
→ Token ID
```

토크나이저에 따라 세부 단계는 달라질 수 있습니다.

<blockquote class="prompt-warning">
<p>BPE와 Tokenizer 전체는 같은 말이 아닙니다. BPE는 Subword를 만드는 핵심 알고리즘 중 하나입니다.</p>
</blockquote>

## 잘 놓치는 핵심

### 1. BPE는 의미를 이해하지 않는다

빈도 기준으로 Pair를 합칩니다.

### 2. Token과 단어는 다르다

한 단어가 여러 Token으로 나뉠 수 있습니다.

### 3. 글자 수와 Token 수는 다르다

```text
문자 수 ≠ Token 수
```

### 4. Vocabulary가 크다고 무조건 좋은 것은 아니다

Sequence는 줄어들 수 있지만 Vocabulary 비용은 커집니다.

### 5. BPE는 형태소 분석기가 아니다

형태소가 아니라 빈도 기반 문자열 조각을 만듭니다.

## 시험·면접

### 핵심 암기

```text
BPE
= Byte Pair Encoding
= 가장 자주 등장하는 인접 Token Pair를 반복 병합
= Subword Tokenization
```

### 자주 나오는 질문

**Q. BPE를 사용하는 이유는?**

단어 단위 Tokenization의 OOV 문제와 문자 단위 Tokenization의 긴 Sequence 문제를 절충하기 위해 사용합니다.

**Q. BPE는 형태소 분석인가?**

아닙니다. 형태소 분석은 언어학적 구조를 보지만 BPE는 빈도 기반으로 Pair를 병합합니다.

**Q. Byte-level BPE의 장점은?**

UTF-8 문자열을 Byte 조합으로 표현할 수 있어 다양한 문자와 처음 보는 문자열을 처리하기 쉽습니다.

<blockquote class="prompt-danger">
<p>시험 함정: BPE는 의미가 비슷한 단어를 합치는 알고리즘이 아닙니다. 가장 자주 등장하는 인접 Pair를 병합합니다.</p>
</blockquote>

## 예시로 한 바퀴

```text
low
lower
lowest
```

시작:

```text
l o w
l o w e r
l o w e s t
```

첫 병합:

```text
l + o → lo
```

두 번째 병합:

```text
lo + w → low
```

결과:

```text
low
low e r
low e s t
```

새로운 단어에서도 재사용할 수 있습니다.

```text
lower
→ low + er
```

<mark>자주 등장하는 문자열은 크게 묶고, 드문 문자열은 작은 Token 조합으로 표현합니다.</mark>

## 객관식 문제

### 1. BPE의 기본 동작은?

① 의미가 비슷한 단어 병합  
② 가장 자주 등장하는 인접 Pair 병합  
③ 모든 단어를 한 글자씩 유지  
④ 문법 규칙으로 형태소 분석

<details>
<summary>정답</summary>

②

</details>

### 2. BPE를 사용하는 이유로 가장 적절한 것은?

① 모든 문장을 같은 길이로 만들기 위해  
② Attention을 제거하기 위해  
③ 단어 단위와 문자 단위 Tokenization의 단점을 절충하기 위해  
④ Embedding을 없애기 위해

<details>
<summary>정답</summary>

③

</details>

### 3. BPE Token에 대한 설명으로 옳은 것은?

① 항상 형태소와 일치한다.  
② 항상 단어 하나와 일치한다.  
③ 빈도 기반 병합으로 만들어진 Subword일 수 있다.  
④ 반드시 한 글자다.

<details>
<summary>정답</summary>

③

</details>

### 4. Byte-level BPE에 대한 설명으로 가장 적절한 것은?

① 숫자만 처리한다.  
② Byte 수준의 기본 표현에서 시작해 빈번한 패턴을 병합할 수 있다.  
③ 모든 문자를 하나의 Token으로 고정한다.  
④ 새로운 문자열을 처리할 수 없다.

<details>
<summary>정답</summary>

②

</details>

### 5. 다음 중 틀린 설명은?

① BPE는 Subword Tokenization에 사용된다.  
② 공백도 Tokenization 결과에 영향을 줄 수 있다.  
③ 글자 수와 Token 수는 항상 같다.  
④ BPE는 자주 등장하는 문자열을 큰 Token으로 만들 수 있다.

<details>
<summary>정답</summary>

③

</details>

## 마지막 정리

```text
작은 단위에서 시작
→ 인접 Pair 빈도 계산
→ 가장 자주 등장하는 Pair 병합
→ 반복
→ Subword Vocabulary 생성
```

<mark>BPE의 핵심은 자주 등장하는 문자열은 큰 Token으로 만들고, 드문 문자열은 작은 Token의 조합으로 표현하는 것입니다.</mark>

## 다음에 이을 글

**Tokenizer의 전체 구조와 Byte-level Tokenization**입니다.  
문장이 `Normalization → Pre-tokenization → BPE → Token ID`로 바뀌는 전체 흐름을 연결해서 봅니다.
