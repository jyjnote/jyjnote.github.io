---
title: WordPiece 토크나이저
date: 2026-09-12 14:10:00 +0900
slug: wordpiece-tokenizer
permalink: /posts/wordpiece-tokenizer/
categories: [AI, 자연어처리]
tags: [LLM, 토크나이저, WordPiece, BERT, Subword, NLP]
math: true
---

WordPiece는 **단어를 자주 재사용되는 Subword 조각으로 나누는 토큰화 방식**입니다.  
특히 BERT 계열 모델에서 널리 알려진 Tokenizer 방식입니다.

<blockquote class="prompt-info">
<p>한 줄: Vocabulary에 있는 조각 중 현재 위치에서 가장 길게 맞는 Subword를 선택하며 단어를 나눕니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

WordPiece는 Subword Vocabulary를 사용하고, 실제 Tokenization에서는 보통 현재 위치에서 가장 긴 Token을 우선 선택하는 방식으로 단어를 분해합니다.

</details>

## 왜 WordPiece가 필요한가

단어 단위 Tokenization은 처음 보는 단어에 약합니다.

```text
playing
played
player
players
```

이 모든 단어를 Vocabulary에 각각 넣으면 Vocabulary가 커집니다.

반대로 문자 단위로 나누면

```text
p l a y e r s
```

Sequence가 너무 길어집니다.

WordPiece는 그 중간인 **Subword**를 사용합니다.

```text
players
→ play + ##ers
```

작은 조각을 조합해서 새로운 단어를 표현합니다.

<mark>WordPiece의 목적은 제한된 Vocabulary로 다양한 단어를 표현하는 것입니다.</mark>

## Subword란

Subword는 단어보다 작고 문자보다 클 수 있는 문자열 조각입니다.

예를 들어

```text
unbelievable
```

다음과 같이 나뉠 수 있습니다.

```text
un
##believ
##able
```

실제 결과는 Vocabulary에 따라 달라집니다.

여기서 `##`는 중요한 의미를 가집니다.

## ##는 무엇인가

BERT 계열 WordPiece Tokenizer에서는 단어 중간에 이어지는 Subword 앞에 `##`가 붙는 경우가 많습니다.

```text
playing
→ play
→ ##ing
```

즉

```text
play
```

는 단어 시작에서 사용할 수 있는 Token이고

```text
##ing
```

은 앞의 문자열 뒤에 이어지는 Token이라는 뜻입니다.

<blockquote class="prompt-info">
<p>##는 실제 문자 두 개를 의미하는 것이 아니라, 이 Subword가 단어의 중간이나 뒤에 이어진다는 것을 표시합니다.</p>
</blockquote>

예:

```text
player
→ play + ##er
```

```text
players
→ play + ##ers
```

## 단어 시작과 단어 중간 Token

다음 두 Token은 서로 다른 Vocabulary 항목일 수 있습니다.

```text
play
##play
```

`play`는 단어의 시작에서 사용할 수 있습니다.

```text
playground
```

반면 `##play`는 다른 문자열 뒤에 이어지는 형태를 나타냅니다.

WordPiece에서는 **Token의 위치 정보도 Vocabulary 표현에 반영될 수 있습니다.**

## WordPiece의 핵심

WordPiece를 이해할 때 두 과정을 나누는 것이 중요합니다.

```text
1. Vocabulary를 만드는 과정
2. 이미 만들어진 Vocabulary로 문장을 Tokenize하는 과정
```

이 둘은 같은 과정이 아닙니다.

<blockquote class="prompt-warning">
<p>WordPiece의 Vocabulary 학습 방법과 실제 문장을 분리하는 Tokenization 방법을 혼동하면 안 됩니다.</p>
</blockquote>

## WordPiece Vocabulary 학습

WordPiece도 처음에는 작은 문자열 단위에서 시작해 Subword Vocabulary를 만듭니다.

다만 BPE처럼 단순히 **가장 많이 등장한 Pair의 빈도만 보는 방식**으로 설명하지 않습니다.

WordPiece 학습은 흔히 Pair가 각각 얼마나 자주 등장하는지까지 고려하는 점수로 설명됩니다.

대표적인 직관은 다음과 같습니다.

$$score(a,b)=\frac{C(a,b)}{C(a)C(b)}$$

- `C(a,b)`: 두 Token이 붙어서 등장한 횟수
- `C(a)`: Token `a`의 등장 횟수
- `C(b)`: Token `b`의 등장 횟수

점수가 높다는 것은

```text
a와 b가 각각 흔한 정도에 비해
둘이 함께 등장하는 관계가 강하다
```

라고 이해하면 됩니다.

<blockquote class="prompt-warning">
<p>WordPiece의 원래 학습 알고리즘 세부 구현은 공개 설명마다 표현이 조금 다를 수 있습니다. 시험에서는 BPE처럼 단순 Pair 빈도만 보는 방식과 구분하는 정도가 핵심입니다.</p>
</blockquote>

## BPE와 학습 기준 차이

BPE의 대표적인 핵심은

```text
가장 자주 등장하는 Pair
→ Merge
```

입니다.

WordPiece는 흔히 다음과 같이 설명합니다.

```text
Pair가 얼마나 자주 등장하는가
+
각 Token 자체의 빈도
→ Pair의 결합 정도를 평가
```

예를 들어 두 Pair가 있다고 하겠습니다.

```text
(a, b): 20회
(x, y): 10회
```

BPE라면 단순 빈도 기준에서는 `(a, b)`가 먼저 선택될 수 있습니다.

하지만 WordPiece식 점수에서는

```text
a와 b가 각각 너무 흔한 Token인지
x와 y가 서로 특별히 강하게 결합하는지
```

까지 고려할 수 있습니다.

## WordPiece의 실제 Tokenization

Vocabulary가 완성된 뒤 새로운 단어를 Tokenize할 때는 보통 **Longest Match First**를 사용합니다.

한국어로는

**가장 긴 일치 우선**

정도로 이해하면 됩니다.

<blockquote class="prompt-info">
<p>현재 위치에서 Vocabulary에 존재하는 가장 긴 문자열을 먼저 선택합니다.</p>
</blockquote>

## Longest Match First

Vocabulary가 다음과 같다고 하겠습니다.

```text
play
player
##s
##er
##ers
p
##l
##a
##y
```

입력:

```text
players
```

단어 처음부터 Vocabulary에서 가장 긴 일치를 찾습니다.

```text
players
```

전체가 Vocabulary에 없다고 하겠습니다.

다음 후보를 봅니다.

```text
player
```

Vocabulary에 있습니다.

따라서 먼저 선택합니다.

```text
player
```

남은 문자열:

```text
s
```

단어 중간이므로 `##s`를 찾습니다.

최종 결과:

```text
["player", "##s"]
```

## 다른 예시

Vocabulary:

```text
un
##believable
##believ
##able
```

입력:

```text
unbelievable
```

처음 위치에서 가장 긴 Token을 찾습니다.

```text
un
```

남은 부분:

```text
believable
```

단어 중간이므로 `##`가 붙은 후보를 찾습니다.

만약

```text
##believable
```

가 Vocabulary에 있으면

```text
["un", "##believable"]
```

이 됩니다.

만약 없다면 더 짧은 Token을 찾습니다.

```text
["un", "##believ", "##able"]
```

## Greedy 방식

Longest Match First는 **Greedy Algorithm**입니다.

현재 위치에서 가능한 가장 긴 Token을 먼저 선택합니다.

```text
현재 위치
→ 가장 긴 Token 탐색
→ 선택
→ 남은 문자열에서 반복
```

뒤의 전체 조합을 모두 탐색해서 최적해를 구하는 방식이 아닙니다.

<mark>WordPiece Tokenization은 보통 현재 위치에서 가능한 가장 긴 Subword를 먼저 고르는 Greedy 방식으로 이해합니다.</mark>

## Tokenization 의사코드

단순화하면 다음과 같습니다.

```text
word의 시작 위치 = 0

while 아직 문자가 남아 있음:
    현재 위치에서 끝까지 가장 긴 문자열을 확인

    Vocabulary에 있으면:
        해당 Token 선택
        현재 위치 이동

    없으면:
        문자열 끝을 한 칸씩 줄여 더 짧은 후보 확인

    어떤 후보도 없으면:
        [UNK]
```

Python 형태로 단순화하면 다음과 같습니다.

```python
tokens = []
start = 0

while start < len(word):
    end = len(word)
    found = None

    while start < end:
        piece = word[start:end]

        if start > 0:
            piece = "##" + piece

        if piece in vocab:
            found = piece
            break

        end -= 1

    if found is None:
        return ["[UNK]"]

    tokens.append(found)
    start = end
```

실제 구현에는 길이 제한, Unicode 처리 등 추가 로직이 들어갑니다.

## [UNK] Token

WordPiece에서 단어를 Vocabulary의 Subword로 끝까지 분해하지 못하면 `[UNK]`가 사용될 수 있습니다.

```text
unknown_word
→ [UNK]
```

즉 WordPiece는 Subword를 사용해 OOV를 크게 줄이지만

```text
모든 문자열을 무조건 표현할 수 있다
```

고 생각하면 안 됩니다.

<blockquote class="prompt-warning">
<p>WordPiece는 OOV를 완화하지만, Vocabulary 조각으로 단어를 완전히 분해할 수 없으면 [UNK]가 나올 수 있습니다.</p>
</blockquote>

이 점은 Byte-level BPE와 비교할 때 중요합니다.

## Byte-level BPE와 차이

Byte-level BPE는 문자열을 Byte 조합으로 표현할 수 있습니다.

따라서 거의 임의의 UTF-8 문자열을 작은 Byte 단위로 표현할 수 있습니다.

WordPiece는 Vocabulary에 필요한 문자열 조각이 없으면 `[UNK]`가 발생할 수 있습니다.

| 구분 | WordPiece | Byte-level BPE |
| --- | --- | --- |
| 기본 방식 | Subword Vocabulary | Byte 기반 BPE |
| 미등록 문자열 | `[UNK]` 가능 | Byte 조합으로 표현 가능 |
| 대표적 활용 | BERT | GPT 계열 일부 |
| 핵심 | Longest Match First | BPE Merge |

## BERT에서 WordPiece

WordPiece는 특히 **BERT Tokenizer**와 함께 많이 등장합니다.

대표적인 흐름을 단순화하면 다음과 같습니다.

```text
문장
→ Basic Tokenization
→ WordPiece Tokenization
→ Token ID
```

예:

```text
Playing football
```

개념적으로

```text
Playing
football
```

처럼 기본 분리한 뒤 WordPiece를 적용합니다.

결과는 Vocabulary에 따라 예를 들어

```text
["play", "##ing", "football"]
```

과 같은 형태가 될 수 있습니다.

실제 결과는 모델과 Vocabulary에 따라 다릅니다.

## BERT의 Special Token

BERT에서는 WordPiece Token과 함께 Special Token도 자주 등장합니다.

```text
[CLS]
[SEP]
[MASK]
[PAD]
[UNK]
```

### [CLS]

입력 Sequence의 시작에 사용됩니다.

```text
[CLS] I love AI [SEP]
```

### [SEP]

문장 또는 Segment의 끝이나 구분에 사용됩니다.

### [MASK]

Masked Language Modeling에서 가려진 Token을 나타냅니다.

```text
I love [MASK]
```

### [PAD]

Batch에서 Sequence 길이를 맞추기 위해 사용합니다.

### [UNK]

Vocabulary로 표현할 수 없는 Token을 나타냅니다.

## WordPiece의 장점

### 1. OOV를 줄인다

새로운 단어를 여러 Subword로 나눌 수 있습니다.

```text
playing
→ play + ##ing
```

### 2. Vocabulary를 효율적으로 사용할 수 있다

비슷한 단어들이 일부 Subword를 공유할 수 있습니다.

```text
play
played
playing
player
```

### 3. 단어보다 작은 패턴을 재사용한다

접두사, 어간, 접미사와 비슷한 문자열 패턴을 재사용할 수 있습니다.

단, 실제 Token이 반드시 언어학적 형태소와 일치하는 것은 아닙니다.

## WordPiece의 단점

### 1. [UNK]가 발생할 수 있다

필요한 Subword가 Vocabulary에 없으면 단어 전체를 처리하지 못할 수 있습니다.

### 2. Token 경계가 형태소와 다를 수 있다

통계적으로 학습된 Vocabulary이므로 사람이 생각하는 의미 단위와 다를 수 있습니다.

### 3. Greedy 선택이다

현재 위치에서 가장 긴 Token을 선택하므로 모든 가능한 분해를 비교하는 방식은 아닙니다.

## BPE와 WordPiece 비교

| 구분 | BPE | WordPiece |
| --- | --- | --- |
| 공통점 | Subword | Subword |
| Vocabulary 학습 직관 | 가장 빈번한 Pair 병합 | Pair의 결합 정도를 고려 |
| 실제 분할 | Merge 규칙 적용 | Longest Match First |
| 대표 모델 | GPT 계열 일부 | BERT 계열 |
| OOV | 구현에 따라 다름 | `[UNK]` 가능 |

가장 중요한 차이는 다음입니다.

```text
BPE
→ Merge 규칙 중심

WordPiece
→ Vocabulary에서 가장 긴 Subword 탐색
```

## WordPiece와 Unigram 비교

| 구분 | WordPiece | Unigram |
| --- | --- | --- |
| Tokenization | Greedy Longest Match | 확률 기반 후보 선택 |
| Vocabulary | Subword | Subword |
| 대표 활용 | BERT | SentencePiece 계열 일부 |

Unigram은 각 Token에 확률을 두고 문장의 가능한 분해를 평가합니다.

WordPiece는 실제 Tokenization에서 가장 긴 일치를 우선하는 것이 핵심입니다.

## 잘 놓치는 핵심

### 1. WordPiece와 BPE는 같은 것이 아니다

둘 다 Subword Tokenization이지만 동작 방식이 같습니다라고 하면 틀립니다.

```text
BPE ≠ WordPiece
```

### 2. Vocabulary 학습과 Tokenization은 다르다

WordPiece Vocabulary를 만드는 기준과

```text
이미 만들어진 Vocabulary로 단어를 자르는 방법
```

은 별개의 과정입니다.

### 3. Longest Match First가 핵심이다

```text
현재 위치에서
Vocabulary에 존재하는
가장 긴 Token 선택
```

### 4. ##는 단어 중간 표시다

```text
play
##ing
```

`##` 자체가 원래 단어에 들어 있던 문자는 아닙니다.

### 5. 형태소 분석이 아니다

```text
play + ##ing
```

이 형태소처럼 보여도 WordPiece의 목적은 언어학적 형태소 분석이 아닙니다.

### 6. [UNK]가 나올 수 있다

Byte-level 방식과 달리 Vocabulary로 완전히 분해하지 못하면 `[UNK]`가 발생할 수 있습니다.

## 시험·면접

### 핵심 암기

```text
WordPiece
= Subword Tokenization
= BERT 계열
= Longest Match First
= ##는 단어 중간 Subword 표시
= 분해 실패 시 [UNK] 가능
```

### 자주 나오는 질문 1

**WordPiece란 무엇인가?**

단어를 Subword 단위로 분리해 제한된 Vocabulary로 다양한 단어를 표현하는 Tokenization 방식입니다.

### 자주 나오는 질문 2

**BPE와 WordPiece의 차이는?**

BPE는 자주 등장하는 Pair를 반복적으로 Merge하는 방식이 핵심이고, WordPiece는 학습된 Vocabulary를 이용할 때 가장 긴 Subword를 우선 선택하는 Longest Match 방식이 핵심입니다.

### 자주 나오는 질문 3

**##의 의미는?**

해당 Token이 단어 시작이 아니라 앞 Token 뒤에 이어지는 Subword임을 나타냅니다.

### 자주 나오는 질문 4

**WordPiece에서 OOV가 완전히 없어지는가?**

아닙니다. 단어를 Vocabulary의 Subword로 끝까지 분리할 수 없으면 `[UNK]`가 사용될 수 있습니다.

<blockquote class="prompt-danger">
<p>시험 함정: WordPiece는 단순히 가장 빈번한 Pair만 반복 병합하는 BPE와 동일한 알고리즘이 아닙니다.</p>
</blockquote>

## 예시로 한 바퀴

Vocabulary:

```text
play
player
##ing
##er
##s
```

입력:

```text
players
```

### 1. 가장 긴 시작 Token 탐색

```text
players
```

전체는 Vocabulary에 없습니다.

```text
player
```

는 Vocabulary에 있습니다.

선택:

```text
player
```

### 2. 남은 문자열 처리

남은 문자열:

```text
s
```

단어 중간이므로

```text
##s
```

를 찾습니다.

### 3. 최종 결과

```text
["player", "##s"]
```

<mark>WordPiece는 현재 위치에서 Vocabulary에 존재하는 가장 긴 Token을 먼저 선택합니다.</mark>

## 객관식 문제

### 1. WordPiece의 실제 Tokenization 방식으로 가장 적절한 것은?

① 무조건 문자 하나씩 분리  
② 가장 긴 일치 Token을 우선 선택  
③ 가장 짧은 Token을 우선 선택  
④ 형태소 분석기로만 분리

<details>
<summary>정답</summary>

②

</details>

### 2. WordPiece에서 `##ing`의 의미는?

① Special Token  
② 숫자 Token  
③ 단어 중간 또는 뒤에 이어지는 Subword  
④ 문장 끝 표시

<details>
<summary>정답</summary>

③

</details>

### 3. WordPiece와 가장 관련이 깊은 대표 모델은?

① BERT  
② K-Means  
③ ResNet  
④ ARIMA

<details>
<summary>정답</summary>

①

</details>

### 4. WordPiece에서 단어를 Vocabulary Subword로 완전히 분해할 수 없으면?

① 항상 Byte 단위로 분해한다.  
② `[UNK]`가 사용될 수 있다.  
③ 문장을 삭제한다.  
④ 자동으로 Vocabulary를 다시 학습한다.

<details>
<summary>정답</summary>

②

</details>

### 5. 다음 중 틀린 설명은?

① WordPiece는 Subword Tokenization이다.  
② `##`는 단어 내부에 이어지는 Token을 나타낼 수 있다.  
③ WordPiece와 BPE는 완전히 동일한 알고리즘이다.  
④ WordPiece는 BERT 계열에서 유명하다.

<details>
<summary>정답</summary>

③

</details>

### 6. Longest Match First의 설명으로 가장 적절한 것은?

① 전체 가능한 분해를 모두 계산한다.  
② 현재 위치에서 가장 긴 Vocabulary Token을 먼저 선택한다.  
③ 항상 가장 빈도가 높은 단어를 선택한다.  
④ 모든 Token을 같은 길이로 만든다.

<details>
<summary>정답</summary>

②

</details>

## 마지막 정리

```text
WordPiece
→ Subword Vocabulary 사용
→ 현재 위치에서 가장 긴 Token 탐색
→ Longest Match First
→ 남은 문자열에서 반복
→ 실패하면 [UNK] 가능
```

핵심은 다음 한 문장입니다.

<mark>WordPiece는 학습된 Vocabulary 안에서 현재 위치에 가장 길게 일치하는 Subword를 우선 선택해 단어를 분해합니다.</mark>

## 다음에 이을 글

**Unigram Tokenizer**입니다.  
BPE와 WordPiece가 문자열을 병합하거나 Greedy하게 선택하는 방식이었다면, Unigram은 각 Subword의 확률을 이용해 Tokenization을 결정합니다.
