---
title: 텍스트 정규화 Text Normalization
date: 2026-09-10 09:10:00 +0900
slug: text-normalization
permalink: /posts/text-normalization/
categories: [AI, 자연어처리]
tags: [자연어처리, TextNormalization, 정규화, 전처리, NLP]
math: false
---

같은 의미의 텍스트가 **불필요하게 다른 형태로 남지 않도록 통일하는 전처리**입니다.  
대소문자, 공백, 특수문자, 숫자 표현 등을 일정한 규칙으로 맞춥니다.

<blockquote class="prompt-info">
  <p>Text Normalization = 의미는 최대한 유지하면서 표현 형식을 일정하게 만드는 과정입니다.</p>
</blockquote>

```text
AI
Ai
ai
```

소문자로 통일하면 모두 `ai`가 됩니다.

<mark>정규화의 목적은 텍스트를 예쁘게 만드는 것이 아니라, 같은 정보를 같은 형태로 보이게 하는 것입니다.</mark>

<details>
<summary>한 줄로</summary>
표현 차이 때문에 같은 단어가 서로 다른 Token처럼 처리되는 일을 줄입니다.
</details>

## 왜 필요한가
```text
I like AI.
i like ai.
I like AI.
```

사람은 거의 같은 뜻으로 읽지만 문자열 기준으로는 다릅니다.  
그대로 Vocabulary를 만들면 `AI`, `Ai`, `ai`가 따로 남을 수 있습니다.

정규화 후:

```text
ai
```

하나로 합칠 수 있습니다.
## 전처리에서의 위치
```text
Raw Corpus
   ↓
Cleaning
   ↓
Normalization
   ↓
Tokenization
   ↓
Vocabulary
```

- Cleaning: 필요 없는 데이터 제거
- Normalization: 표현 형식 통일

<blockquote class="prompt-warning">
  <p>정제와 정규화의 경계는 구현마다 다릅니다. 둘을 완전히 분리된 단계로 외울 필요는 없습니다.</p>
</blockquote>
## 대소문자 통일
```text
Apple
APPLE
apple
```

소문자로 바꾸면 전부 `apple`입니다.

```python
text = "I Like Machine Learning"
text = text.lower()
print(text)
```

결과:

```text
i like machine learning
```

하지만

```text
US
us
```

처럼 의미가 달라지는 경우도 있습니다.

<mark>정규화 규칙은 데이터와 목적에 따라 선택합니다.</mark>
## 공백 정규화
```text
나는   AI를    공부한다.
```

을

```text
나는 AI를 공부한다.
```

로 바꿉니다.

```python
text = "나는   AI를    공부한다."
text = " ".join(text.split())
```

`\n`, `\t`, `\r` 같은 줄바꿈·탭도 필요에 따라 정리합니다.  
문단 구조가 중요하면 줄바꿈을 무조건 없애면 안 됩니다.
## 특수문자 처리
```text
AI!!! 정말 좋다!!!
```

를

```text
AI 정말 좋다
```

처럼 만들 수 있습니다.

하지만 감성 분석에서는

```text
좋다.
좋다!!!
```

의 강도가 다를 수 있습니다.

또

```text
C++
C#
.NET
```

에서 기호를 지우면 원래 의미가 깨집니다.

<blockquote class="prompt-danger">
  <p>특수문자는 무조건 삭제하지 않습니다. 의미 있는 기호까지 없애면 정보 손실이 생깁니다.</p>
</blockquote>
## 숫자 · URL 정규화
숫자가 지나치게 다양하면 목적에 따라 묶을 수 있습니다.

```text
나는 17살이다
나는 18살이다
나는 19살이다
```

을

```text
나는 <NUM>살이다
```

처럼 바꿀 수 있습니다.

URL도

```text
https://a.com
https://b.com
```

을

```text
<URL>
```

로 통일할 수 있습니다.

하지만 `1만원`, `100만원`, `1억원`처럼 숫자 자체가 중요한 문제에서는 남겨야 합니다.
## 반복 문자 정규화
SNS와 리뷰에서는

```text
좋아
좋아아
좋아아아아
```

또는

```text
ㅋㅋ
ㅋㅋㅋㅋㅋㅋ
```

같은 표현이 많습니다.

필요하면

```text
좋아아아아 → 좋아아
ㅋㅋㅋㅋㅋㅋ → ㅋㅋ
```

처럼 반복 횟수를 제한합니다.

반복 횟수가 감정 강도라면 그대로 두는 편이 나을 수 있습니다.
## Unicode 정규화
눈으로 같아 보여도 내부 코드 표현이 다른 문자가 있습니다.

```python
import unicodedata
text = unicodedata.normalize("NFC", text)
```

| 형식 | 핵심 |
| --- | --- |
| NFC | 가능한 문자를 결합 |
| NFD | 문자를 분해 |
| NFKC | 호환 문자까지 통일 |
| NFKD | 호환 문자까지 분해 |

<blockquote class="prompt-info">
  <p>Unicode 정규화는 눈에 보이는 모양보다 내부 문자 표현을 통일하는 작업입니다.</p>
</blockquote>
## 한국어에서는
```text
사과는
사과를
사과가
```

를 단순 정규화만으로 전부 `사과`로 만드는 것은 아닙니다.  
이 문제는 형태소 분석과 연결됩니다.

```text
텍스트 정규화 ≠ 형태소 분석
```

- 정규화: 표현 통일
- 형태소 분석: 언어 구조 분석
## 정규화와 Tokenization
```text
AI     is GOOD!!!
```

정규화:

```text
ai is good
```

Tokenization:

```text
ai / is / good
```

보통 `Normalization → Tokenization` 순서로 이해하면 됩니다.  
실제 Tokenizer가 일부 정규화를 내부에서 수행하기도 합니다.
## 과도한 정규화
```text
I LOVE this!!!
I love this.
```

를 모두

```text
i love this
```

로 만들면

- 대문자 강조
- 느낌표
- 감정 강도

가 사라집니다.

<blockquote class="prompt-warning">
  <p>정규화는 많이 할수록 좋은 것이 아닙니다. 예측에 필요한 정보까지 지우면 성능이 떨어질 수 있습니다.</p>
</blockquote>
## 전통 NLP와 LLM
전통 NLP에서는 Vocabulary를 줄이기 위해 정규화를 강하게 하는 경우가 많았습니다.

```text
소문자화
특수문자 처리
어간 통일
불필요 표현 제거
```

현대 Transformer와 LLM은 원문을 더 많이 보존하는 경우가 많습니다.  
Tokenizer가 Subword, 특수문자, 대소문자를 직접 처리할 수 있기 때문입니다.

<mark>모델이 발전했다고 정규화가 사라진 것이 아니라, 필요한 정규화의 강도가 달라진 것입니다.</mark>
## Python 예시
```python
import re
import unicodedata

def normalize_text(text):
    text = unicodedata.normalize("NFC", text)
    text = text.lower()
    text = re.sub(r"\s+", " ", text)
    return text.strip()
```

입력:

```text
  I   LOVE   AI
```

출력:

```text
i love ai
```

즉,

```text
Unicode 통일
→ 소문자화
→ 연속 공백 제거
→ 앞뒤 공백 제거
```

입니다.
## 잘 놓치는 핵심
### 1. 정규화 ≠ 무조건 삭제
핵심은 표현 통일입니다.
### 2. 소문자화는 항상 정답이 아님
`US`와 `us`처럼 의미가 달라질 수 있습니다.
### 3. 특수문자도 정보가 될 수 있음
감성, 프로그래밍 언어, 수식에서는 중요합니다.
### 4. 숫자는 문제에 따라 유지
금액·날짜·수량에서는 지우면 안 될 수 있습니다.
### 5. 정규화 ≠ 형태소 분석
표현 통일과 언어 구조 분석은 다른 작업입니다.
## 시험·면접
<blockquote class="prompt-info">
  <p>단골: 대소문자 통일, 공백 처리, 특수문자 처리, Unicode 정규화, 과도한 정규화의 정보 손실.</p>
</blockquote>

자주 나오는 문장:

- Text Normalization은 표현 형식을 통일한다
- 같은 의미의 표현이 다른 Token이 되는 문제를 줄인다
- 정규화 규칙은 목적에 따라 달라진다
- 특수문자와 숫자를 항상 삭제하는 것은 아니다
- 과도한 정규화는 정보 손실을 만든다
## 예시로 한 바퀴
원문:

```text
  AI!!!   Is   GREAT!!!
```

소문자화:

```text
  ai!!!   is   great!!!
```

공백 정리:

```text
ai!!! is great!!!
```

특수문자 제거까지 한다면:

```text
ai is great
```

Tokenization:

```text
ai / is / great
```

감성 분석이라면 `!!!`를 남기는 선택도 가능합니다.
## 객관식 6문제
**1.** Text Normalization의 주요 목적은?

- ① 모델 층 증가
- ② 텍스트 표현 통일
- ③ 모든 단어 삭제
- ④ 손실함수 변경

<details>
<summary>정답</summary>
②
</details>

**2.** 대표적인 정규화는?

- ① 대소문자 통일
- ② 역전파
- ③ 경사하강법
- ④ PCA

<details>
<summary>정답</summary>
①
</details>

**3.** 특수문자를 무조건 삭제하면 안 되는 이유는?

- ① 파일 크기가 늘어서
- ② 의미 있는 정보가 사라질 수 있어서
- ③ Token 수가 항상 늘어서
- ④ 모델이 선형이 되어서

<details>
<summary>정답</summary>
②
</details>

**4.** 과도한 정규화의 대표 문제는?

- ① 정보 손실
- ② 항상 과적합
- ③ 역행렬 불가능
- ④ Vocabulary가 항상 증가

<details>
<summary>정답</summary>
①
</details>

**5.** Unicode 정규화의 목적은?

- ① 내부 문자 표현 통일
- ② 가중치 초기화
- ③ 문서 분류
- ④ 거리 계산

<details>
<summary>정답</summary>
①
</details>

**6.** 정규화와 형태소 분석의 관계로 맞는 것은?

- ① 완전히 같은 작업
- ② 정규화는 표현 통일, 형태소 분석은 언어 구조 분석
- ③ 둘 다 평가 지표
- ④ 둘 다 차원축소

<details>
<summary>정답</summary>
②
</details>
## 다음에 이을 글
토큰화 Tokenization입니다.  
정규화한 텍스트를 모델이 처리할 작은 단위로 나눕니다.
