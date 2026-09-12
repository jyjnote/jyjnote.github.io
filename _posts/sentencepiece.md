---
title: SentencePiece
date: 2026-09-12 14:25:00 +0900
slug: sentencepiece
permalink: /posts/sentencepiece/
categories: [AI, 자연어처리]
tags: [LLM, 토크나이저, SentencePiece, Unigram, BPE, NLP]
math: true
---

SentencePiece는 **Raw Text에서 직접 Subword Vocabulary를 학습하고 Tokenize할 수 있는 토크나이저 도구**입니다.  
BPE나 Unigram 같은 알고리즘을 사용할 수 있으며, 공백도 하나의 문자처럼 다룹니다.

<blockquote class="prompt-info">
<p>한 줄: SentencePiece는 문장을 미리 단어로 나누지 않고, Raw Text 자체에서 Subword를 학습하는 토크나이저 프레임워크입니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

SentencePiece는 Raw Text를 입력으로 받아 BPE 또는 Unigram 방식으로 Subword Vocabulary를 학습하고 Tokenize합니다.

</details>

## SentencePiece는 하나의 알고리즘인가

아닙니다.

SentencePiece를 처음 배울 때 가장 헷갈리는 부분입니다.

```text
BPE
WordPiece
Unigram
SentencePiece
```

이 네 가지가 모두 같은 종류처럼 보이지만 SentencePiece는 조금 다릅니다.

BPE와 Unigram은 **Subword Vocabulary를 만드는 알고리즘**입니다.

SentencePiece는 이런 알고리즘을 이용해

```text
Vocabulary 학습
Tokenization
Detokenization
```

을 수행하는 **Tokenizer Framework**에 가깝습니다.

<blockquote class="prompt-warning">
<p>SentencePiece 자체를 BPE와 같은 하나의 병합 알고리즘으로 보면 안 됩니다. SentencePiece는 BPE나 Unigram을 사용할 수 있습니다.</p>
</blockquote>

## SentencePiece가 등장한 이유

기존 Tokenizer는 먼저 문장을 단어 단위로 나누는 경우가 많았습니다.

```text
I love AI
↓
I
love
AI
```

이 과정을 Pre-tokenization이라고 볼 수 있습니다.

문제는 언어마다 단어 경계를 표현하는 방식이 다르다는 점입니다.

영어는 공백이 비교적 명확합니다.

```text
I love AI
```

하지만 모든 언어가 공백만으로 단어 경계를 표현하지는 않습니다.

SentencePiece는 문장을 미리 단어로 나누지 않고 **Raw Text 자체를 입력으로 사용**합니다.

```text
Raw Text
→ SentencePiece
→ Subword Token
```

<mark>SentencePiece의 핵심 특징 중 하나는 언어별 단어 분리기에 의존하지 않고 Raw Text를 직접 학습한다는 점입니다.</mark>

## 공백도 하나의 문자처럼 다룬다

SentencePiece에서 매우 중요한 특징입니다.

SentencePiece는 공백을 특별한 기호로 바꿔 다룹니다.

대표적으로 다음 기호를 사용합니다.

```text
▁
```

이는 일반적인 밑줄 `_`이 아니라 Unicode 문자입니다.

문장:

```text
I love AI
```

개념적으로 다음과 같이 표현할 수 있습니다.

```text
▁I▁love▁AI
```

Tokenization 결과는 Vocabulary에 따라 예를 들어 다음처럼 나올 수 있습니다.

```text
["▁I", "▁love", "▁AI"]
```

또는

```text
["▁I", "▁lo", "ve", "▁AI"]
```

<blockquote class="prompt-info">
<p>SentencePiece의 ▁ 기호는 원래 문자열의 공백 위치를 표현합니다.</p>
</blockquote>

## 왜 공백을 Token에 포함할까

공백을 Tokenization 과정에서 버리지 않기 위해서입니다.

예를 들어

```text
hello world
```

를 단순히

```text
hello
world
```

로 나눈 뒤 처리하면 원래 공백 정보가 별도 규칙으로 필요합니다.

SentencePiece는 공백도 입력의 일부로 다룹니다.

```text
hello world
→ ▁hello▁world
```

이를 통해 Token을 다시 문자열로 복원하는 과정도 단순해집니다.

```text
▁hello
▁world
→ hello world
```

## Lossless Tokenization

SentencePiece는 원래 문자열을 Token으로 바꿨다가 다시 복원할 수 있도록 설계되었습니다.

단순화하면

```text
Text
→ Encode
→ Tokens
→ Decode
→ Text
```

흐름입니다.

예:

```text
I love AI
↓
["▁I", "▁love", "▁AI"]
↓
I love AI
```

정규화 설정에 따라 세부 문자열 표현은 달라질 수 있습니다.

## SentencePiece 전체 흐름

기본 흐름은 다음과 같습니다.

```text
Raw Text
→ Normalization
→ SentencePiece Model
→ Subword Token
→ Token ID
```

SentencePiece는 별도의 언어별 Tokenizer 없이 Raw Text에서 직접 학습할 수 있습니다.

## SentencePiece에서 사용할 수 있는 알고리즘

대표적으로 다음 두 가지가 중요합니다.

```text
BPE
Unigram
```

### BPE 방식

자주 등장하는 Pair를 반복해서 병합합니다.

```text
a + b → ab
ab + c → abc
```

### Unigram 방식

여러 Subword 후보를 만든 뒤 각 Token의 확률을 학습하고 불필요한 Token을 제거합니다.

```text
큰 후보 Vocabulary
→ 각 Token 확률 계산
→ 중요하지 않은 Token 제거
→ 최종 Vocabulary
```

<mark>SentencePiece는 BPE와 Unigram 중 하나를 선택해서 사용할 수 있습니다.</mark>

## SentencePiece + BPE

SentencePiece에 BPE를 사용하면 기본적인 BPE 원리는 같습니다.

```text
Raw Text
→ 공백도 Symbol로 포함
→ Pair 빈도 계산
→ 자주 등장하는 Pair 병합
```

예:

```text
I love AI
```

공백을 포함해 보면

```text
▁I▁love▁AI
```

이 문자열 위에서 BPE가 적용됩니다.

따라서 다음과 같은 Token이 만들어질 수 있습니다.

```text
▁I
▁love
▁AI
```

## SentencePiece + Unigram

SentencePiece에서는 Unigram 모델도 많이 사용합니다.

Unigram은 BPE처럼 작은 Token에서 계속 합쳐 가는 방식과 다릅니다.

처음에는 큰 후보 Vocabulary를 준비합니다.

```text
a
b
ab
abc
▁hello
hello
...
```

각 Token에 확률을 부여합니다.

문장을 설명하는 데 덜 중요한 Token을 반복적으로 제거합니다.

```text
큰 후보 Vocabulary
→ 확률 학습
→ 제거
→ 다시 학습
→ 목표 Vocabulary 크기
```

최종적으로 가장 적절한 Subword Vocabulary를 남깁니다.

## BPE와 Unigram의 차이

| 구분 | BPE | Unigram |
| --- | --- | --- |
| 시작 | 작은 단위 | 큰 후보 Vocabulary |
| 핵심 | Pair 병합 | Token 제거 |
| 방향 | 작은 것 → 큰 것 | 큰 후보 → 축소 |
| Tokenization | Merge 규칙 중심 | 확률 기반 분해 |
| SentencePiece 지원 | O | O |

BPE는 **합쳐 가는 방식**입니다.

Unigram은 **후보를 줄여 가는 방식**입니다.

## Unigram Tokenization

Unigram은 각 Token이 독립적으로 등장한다고 가정하고 문장의 분해 확률을 계산합니다.

한 Token Sequence가 다음과 같다고 하면

$$P(x)=\prod_{i=1}^{n}P(x_i)$$

로그를 사용하면

$$\log P(x)=\sum_{i=1}^{n}\log P(x_i)$$

가능한 여러 분해 중 확률이 높은 경로를 선택합니다.

예:

```text
unbelievable
```

후보 1:

```text
un + believable
```

후보 2:

```text
un + believ + able
```

후보 3:

```text
u + n + bel + iev + able
```

각 Token의 확률을 이용해 더 적절한 분해를 선택합니다.

<blockquote class="prompt-info">
<p>Unigram은 가능한 Subword 조합 가운데 확률이 높은 Token Sequence를 선택합니다.</p>
</blockquote>

## WordPiece와 SentencePiece의 차이

WordPiece와 SentencePiece도 자주 헷갈립니다.

| 구분 | WordPiece | SentencePiece |
| --- | --- | --- |
| 성격 | Subword 방식 | Tokenizer Framework |
| 대표 모델 | BERT | T5, ALBERT 등 |
| 공백 처리 | Pre-tokenization 영향 | 공백 자체를 Symbol로 취급 |
| 대표 표기 | `##ing` | `▁hello` |
| 알고리즘 | WordPiece | BPE 또는 Unigram 가능 |

WordPiece:

```text
playing
→ play
→ ##ing
```

SentencePiece:

```text
playing football
→ ▁playing
→ ▁football
```

실제 결과는 Vocabulary에 따라 달라집니다.

## ##와 ▁의 차이

둘은 역할이 다릅니다.

### WordPiece

```text
##ing
```

앞 Token 뒤에 이어지는 Subword임을 나타냅니다.

### SentencePiece

```text
▁hello
```

Token 앞에 공백이 있었다는 것을 표현합니다.

| 표기 | 의미 |
| --- | --- |
| `##` | 앞 Token에 이어지는 WordPiece |
| `▁` | 원래 문자열에서 앞에 공백이 존재 |

<mark>##는 WordPiece의 연결 표기이고, ▁는 SentencePiece의 공백 표기입니다.</mark>

## SentencePiece와 Pre-tokenization

기존 방식:

```text
문장
→ 공백이나 언어별 규칙으로 단어 분리
→ Subword Tokenization
```

SentencePiece:

```text
Raw Text
→ 바로 Subword 학습
```

이 때문에 SentencePiece는 언어별 Tokenizer 의존성을 줄일 수 있습니다.

## 한국어에서 SentencePiece

한국어에서도 SentencePiece를 사용할 수 있습니다.

예:

```text
나는 인공지능을 공부한다
```

공백을 포함해 개념적으로 보면

```text
▁나는▁인공지능을▁공부한다
```

Vocabulary에 따라 다음처럼 나뉠 수 있습니다.

```text
["▁나는", "▁인공지능", "을", "▁공부", "한다"]
```

또는

```text
["▁나", "는", "▁인공", "지능", "을", "▁공부", "한다"]
```

정확한 결과는 학습된 SentencePiece Model에 따라 달라집니다.

<blockquote class="prompt-warning">
<p>SentencePiece Token은 한국어 형태소와 반드시 일치하지 않습니다. 통계적으로 학습된 Subword입니다.</p>
</blockquote>

## SentencePiece Model 파일

SentencePiece를 학습하면 보통 Model과 Vocabulary 정보가 만들어집니다.

대표적으로

```text
tokenizer.model
tokenizer.vocab
```

같은 형태를 볼 수 있습니다.

Model에는 Tokenization에 필요한 Vocabulary와 확률 또는 Merge 관련 정보 등이 저장됩니다.

사용 시에는 학습된 Model을 불러옵니다.

```text
Text
→ tokenizer.model
→ Token
→ Token ID
```

## Vocabulary 크기

SentencePiece를 학습할 때 Vocabulary 크기를 지정합니다.

예:

```text
8,000
16,000
32,000
50,000
```

Vocabulary가 작으면

```text
한 문자열
→ 더 많은 작은 Token
```

Vocabulary가 크면

```text
자주 등장하는 긴 문자열
→ 하나의 Token
```

이 될 가능성이 높습니다.

<mark>Vocabulary 크기가 커진다고 무조건 좋은 것은 아닙니다.</mark>

Vocabulary가 커지면 Embedding Matrix도 커질 수 있습니다.

## SentencePiece의 장점

### 1. Raw Text에서 직접 학습 가능

별도의 언어별 단어 분리기가 필요하지 않습니다.

### 2. 언어 독립적

영어처럼 공백이 명확한 언어뿐 아니라 다양한 언어에 적용할 수 있습니다.

### 3. 공백 정보를 보존

`▁` 기호를 사용해 공백 위치를 Token에 포함할 수 있습니다.

### 4. BPE와 Unigram을 지원

하나의 Framework에서 여러 Subword 알고리즘을 사용할 수 있습니다.

### 5. Detokenization이 단순

Token에서 원래 문장 형태로 복원하기 쉽습니다.

## SentencePiece의 단점

### 1. Token 결과가 직관적이지 않을 수 있다

```text
▁
```

같은 특수한 표기가 처음에는 낯설 수 있습니다.

### 2. 형태소와 일치하지 않는다

통계적 Subword이므로 언어학적 분석 결과와 다를 수 있습니다.

### 3. Vocabulary 설정의 영향을 많이 받는다

Vocabulary 크기와 학습 데이터에 따라 Tokenization 결과가 달라집니다.

## SentencePiece와 Byte-level BPE

둘 다 다양한 문자열 처리에 강하지만 접근 방식은 다릅니다.

| 구분 | SentencePiece | Byte-level BPE |
| --- | --- | --- |
| 입력 관점 | Raw Text | Byte 기반 |
| 공백 | `▁`로 표현 | Byte 또는 Token 패턴에 포함 |
| 알고리즘 | BPE/Unigram | BPE |
| 언어 의존성 | 낮음 | 낮음 |
| OOV | 설정과 모델에 따라 가능 | Byte 조합으로 매우 강함 |

## 잘 놓치는 핵심

### 1. SentencePiece는 알고리즘 하나가 아니다

```text
SentencePiece
≠ BPE
≠ Unigram
```

SentencePiece 안에서 BPE 또는 Unigram을 사용할 수 있습니다.

### 2. ▁는 공백이다

```text
▁hello
```

는

```text
 hello
```

처럼 앞에 공백이 있다는 뜻으로 이해하면 됩니다.

### 3. ##와 ▁는 다르다

```text
##ing
```

은 WordPiece의 연결 표시입니다.

```text
▁hello
```

는 SentencePiece의 공백 표시입니다.

### 4. Raw Text에서 바로 학습한다

별도의 단어 단위 Pre-tokenization이 필수적이지 않습니다.

### 5. 형태소 분석기가 아니다

SentencePiece Token은 통계적으로 만들어진 Subword입니다.

### 6. BPE와 Unigram 모두 가능하다

SentencePiece를 봤다고 항상 Unigram이라고 생각하면 안 됩니다.

## 시험·면접

### 핵심 암기

```text
SentencePiece
= Raw Text 기반
= 언어 독립적
= 공백을 ▁로 표현
= BPE 또는 Unigram 사용 가능
```

### 자주 나오는 질문 1

**SentencePiece란 무엇인가?**

Raw Text에서 직접 Subword Vocabulary를 학습하고 Tokenization할 수 있는 Tokenizer Framework입니다.

### 자주 나오는 질문 2

**SentencePiece와 BPE의 관계는?**

SentencePiece는 BPE를 사용할 수 있습니다. 하지만 SentencePiece 자체가 BPE와 같은 하나의 병합 알고리즘은 아닙니다.

### 자주 나오는 질문 3

**▁ 기호는 무엇인가?**

원래 입력 문자열에서 공백이 존재했던 위치를 나타냅니다.

### 자주 나오는 질문 4

**WordPiece의 ##와 SentencePiece의 ▁는 같은가?**

아닙니다.

`##`는 앞 Token에 이어지는 Subword를 표시하고, `▁`는 공백 위치를 나타냅니다.

### 자주 나오는 질문 5

**SentencePiece가 언어 독립적이라고 하는 이유는?**

미리 언어별 단어 분리기를 적용하지 않고 Raw Text에서 직접 Subword Vocabulary를 학습할 수 있기 때문입니다.

<blockquote class="prompt-danger">
<p>시험 함정: SentencePiece는 Unigram과 동의어가 아닙니다. SentencePiece는 BPE와 Unigram 모두 사용할 수 있습니다.</p>
</blockquote>

## 예시로 한 바퀴

입력:

```text
I love AI
```

### 1. 공백을 표시

```text
▁I▁love▁AI
```

### 2. Subword Vocabulary 적용

예를 들어 Vocabulary에 다음 Token이 있다고 하겠습니다.

```text
▁I
▁love
▁AI
```

결과:

```text
["▁I", "▁love", "▁AI"]
```

다른 Vocabulary라면

```text
["▁I", "▁lo", "ve", "▁AI"]
```

처럼 나뉠 수도 있습니다.

### 3. Decode

```text
["▁I", "▁love", "▁AI"]
→ I love AI
```

<mark>SentencePiece는 공백까지 포함한 Raw Text를 Subword Token으로 표현합니다.</mark>

## 객관식 문제

### 1. SentencePiece에 대한 설명으로 가장 적절한 것은?

① 형태소 분석기  
② Raw Text 기반 Subword Tokenizer Framework  
③ CNN 구조  
④ 단어 사전만 사용하는 Tokenizer

<details>
<summary>정답</summary>

②

</details>

### 2. SentencePiece의 `▁` 기호는 무엇을 의미하는가?

① Mask Token  
② Unknown Token  
③ 공백  
④ 문장 종료

<details>
<summary>정답</summary>

③

</details>

### 3. SentencePiece에서 사용할 수 있는 대표 알고리즘은?

① BPE와 Unigram  
② CNN과 RNN  
③ PCA와 SVD  
④ K-Means와 DBSCAN

<details>
<summary>정답</summary>

①

</details>

### 4. 다음 중 틀린 설명은?

① SentencePiece는 Raw Text에서 학습할 수 있다.  
② SentencePiece는 공백을 Symbol로 다룰 수 있다.  
③ SentencePiece는 반드시 Unigram만 사용한다.  
④ SentencePiece는 BPE를 사용할 수 있다.

<details>
<summary>정답</summary>

③

</details>

### 5. WordPiece의 `##`와 SentencePiece의 `▁`에 대한 설명으로 옳은 것은?

① 둘 다 완전히 같은 의미다.  
② `##`는 공백이고 `▁`는 Unknown이다.  
③ `##`는 연결 Subword, `▁`는 공백을 나타낸다.  
④ 둘 다 Mask Token이다.

<details>
<summary>정답</summary>

③

</details>

### 6. SentencePiece의 장점으로 적절하지 않은 것은?

① 언어별 단어 분리기 의존성을 줄일 수 있다.  
② 공백 정보를 보존할 수 있다.  
③ BPE와 Unigram을 사용할 수 있다.  
④ Token이 항상 형태소와 정확히 일치한다.

<details>
<summary>정답</summary>

④

</details>

## 마지막 정리

```text
SentencePiece
→ Raw Text 입력
→ 공백도 Symbol로 처리
→ BPE 또는 Unigram 적용
→ Subword Token
→ Token ID
```

핵심은 다음 한 문장입니다.

<mark>SentencePiece는 문장을 미리 단어로 나누지 않고 Raw Text 자체에서 Subword Vocabulary를 학습하며, BPE나 Unigram을 사용할 수 있는 Tokenizer Framework입니다.</mark>

## 다음에 이을 글

**Unigram Tokenizer**입니다.  
SentencePiece에서 자주 사용되는 Unigram이 어떤 확률 모델로 Vocabulary를 만들고 Token Sequence를 선택하는지 자세히 봅니다.
