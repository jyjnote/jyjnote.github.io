---
title: 역색인 · Inverted Index
date: 2026-09-11 21:42:00 +0900
slug: inverted-index
permalink: /posts/inverted-index/
categories: [AI, 자연어처리]
tags: [자연어처리, 정보검색, InvertedIndex, 역색인, PostingList, IR, NLP]
math: true
---

역색인 Inverted Index는 **단어를 기준으로 그 단어가 등장한 문서를 찾아가는 자료구조**입니다.  
검색엔진이 모든 문서를 처음부터 읽지 않고 필요한 문서를 빠르게 찾기 위해 사용합니다.

<blockquote class="prompt-info">
<p>역색인 = Term → 그 Term이 등장한 Document 목록을 저장하는 색인 구조입니다.</p>
</blockquote>

예를 들어 문서가 다음과 같다고 하겠습니다.

```text
D1: I love AI
D2: I love NLP
D3: AI and NLP
```

역색인을 만들면 다음처럼 표현할 수 있습니다.

```text
I    → D1, D2
love → D1, D2
AI   → D1, D3
NLP  → D2, D3
and  → D3
```

`AI`를 검색하면 전체 문장을 다시 읽을 필요 없이 바로 `D1`, `D3`를 찾을 수 있습니다.

<mark>일반적인 문서는 Document → Term 구조지만, 역색인은 Term → Document 방향으로 뒤집어 저장합니다.</mark>

<details>
<summary>한 줄로</summary>

검색어를 넣으면 그 검색어가 등장한 문서 목록을 바로 꺼내는 구조입니다.

</details>

## 왜 필요한가

문서가 적다면 모든 문서를 읽어도 되지만, 수백만 개의 문서를 검색할 때마다 Full Scan하는 것은 비효율적입니다.

역색인을 미리 만들어 두면 검색 과정이 달라집니다.

```text
AI → D7, D21, D105, ...
```

검색어를 Key처럼 사용하여 관련 문서 목록에 접근합니다.

```text
전체 문서 순회
        ↓
Term으로 바로 접근
```

검색해야 할 범위를 크게 줄일 수 있습니다.

## 핵심 구성

역색인은 크게 두 부분으로 생각하면 쉽습니다.

```text
Dictionary
Posting List
```

예:

```text
Dictionary       Posting List

AI        →      D1, D3
love      →      D1, D2
NLP       →      D2, D3
```

왼쪽에는 Term, 오른쪽에는 관련 Document 정보가 있습니다.

## Dictionary

Dictionary는 색인에 등록된 Term 목록입니다.

예:

```text
I
love
AI
NLP
and
```

검색어가 들어오면 Dictionary에서 해당 Term을 찾습니다.

```text
Query: AI
   ↓
Dictionary에서 AI 탐색
   ↓
AI의 Posting List 접근
```

즉 Dictionary는 **Term을 찾기 위한 영역**입니다.

## Posting List

Posting List는 특정 Term이 등장한 문서들의 목록입니다.

예:

```text
AI → [D1, D3, D8, D15]
```

여기서

```text
[D1, D3, D8, D15]
```

가 `AI`의 Posting List입니다.

목록 안의 각 항목을 Posting이라고 합니다.

<blockquote class="prompt-info">
<p>Dictionary는 Term을 찾고, Posting List는 그 Term이 등장한 Document를 찾습니다.</p>
</blockquote>

## Posting에는 무엇을 저장하나

가장 단순한 역색인은 Document ID만 저장합니다.

```text
AI → D1, D3
```

하지만 실제 검색 시스템에서는 더 많은 정보를 저장할 수 있습니다.

```text
Document ID
Term Frequency
Term Position
기타 검색용 정보
```

예:

```text
AI → (D1, TF=2), (D3, TF=1)
```

이렇게 하면 `AI`가 어느 문서에 있는지뿐 아니라 몇 번 등장했는지도 알 수 있습니다.

## 역색인을 만드는 과정

문서:

```text
D1: I love AI
D2: AI is useful
```

### 1. Tokenization

```text
D1 → I, love, AI
D2 → AI, is, useful
```

### 2. Term과 Document 연결

```text
I      → D1
love   → D1
AI     → D1
AI     → D2
is     → D2
useful → D2
```

### 3. 같은 Term을 묶음

```text
I      → D1
love   → D1
AI     → D1, D2
is     → D2
useful → D2
```

이 결과가 기본적인 역색인입니다.

## DF와의 관계

Posting List의 문서 수를 이용하면 DF를 구할 수 있습니다.

예:

```text
AI → D1, D3, D7
```

`AI`가 3개의 문서에 등장하므로

$$DF(AI)=3$$

입니다.

즉 역색인은 검색뿐 아니라 TF-IDF 계산에 필요한 통계 정보를 관리하는 데도 활용할 수 있습니다.

## Boolean Retrieval

역색인은 AND, OR 같은 Boolean Search와 잘 연결됩니다.

예:

```text
AI  → D1, D2, D4
NLP → D2, D3, D4
```

`AI AND NLP`를 검색하면 두 Posting List의 교집합을 구합니다.

```text
AI  : D1, D2, D4
NLP : D2, D3, D4

교집합 → D2, D4
```

따라서 결과는

```text
D2, D4
```

입니다.

`AI OR NLP`라면 합집합을 사용합니다.

```text
합집합 → D1, D2, D3, D4
```

<mark>Boolean Retrieval에서는 Posting List의 교집합과 합집합으로 여러 검색어를 처리할 수 있습니다.</mark>

## 검색 과정

사용자가 다음을 검색한다고 하겠습니다.

```text
AI NLP
```

검색 시스템의 기본 흐름을 단순화하면 다음과 같습니다.

```text
Query
 ↓
Tokenization
 ↓
Dictionary Lookup
 ↓
Posting List 조회
 ↓
후보 Document 생성
 ↓
Score 계산
 ↓
Ranking
```

역색인은 이 과정에서 **후보 문서를 빠르게 찾는 역할**을 합니다.

그 후 TF-IDF, BM25 등의 점수를 이용해 문서 순위를 정할 수 있습니다.

## 역색인과 TF-IDF의 차이

둘은 역할이 다릅니다.

| 개념 | 핵심 역할 |
| --- | --- |
| 역색인 | 어떤 문서에 Term이 있는지 빠르게 찾음 |
| TF | 한 문서에서 Term의 빈도 |
| DF | Term이 등장한 문서 수 |
| IDF | 흔한 Term의 중요도를 낮춤 |
| TF-IDF | Document에서 Term의 중요도를 수치화 |

즉 역색인은 **검색을 위한 구조**이고 TF-IDF는 **가중치를 계산하는 방법**입니다.

둘을 함께 사용할 수 있습니다.

## 잘 놓치는 핵심

### 1. 역색인은 문서 자체를 뒤집는 것이 아니다

`Document → Term`의 검색 방향을 `Term → Document`로 바꾼 색인 구조라는 의미입니다.

### 2. Posting List가 핵심이다

특정 Term이 등장한 Document 목록을 저장합니다.

### 3. Posting에는 Document ID만 있는 것은 아니다

TF나 Position 같은 추가 정보를 저장할 수 있습니다.

### 4. Posting List 길이와 DF는 연결된다

중복 없는 Document ID를 저장한다면 Posting List에 포함된 문서 수가 해당 Term의 DF가 됩니다.

### 5. 역색인과 Ranking은 같은 개념이 아니다

역색인은 후보 문서를 찾는 구조입니다.

검색 결과의 순위를 정하려면 TF-IDF, BM25 등의 별도 Score가 사용될 수 있습니다.

### 6. AND 검색은 Posting List의 교집합으로 볼 수 있다

OR 검색은 합집합으로 이해할 수 있습니다.

## 시험·면접

<blockquote class="prompt-info">
<p>단골: 역색인의 방향, Dictionary와 Posting List, 정색인과 차이, Boolean Retrieval, TF·DF와의 관계.</p>
</blockquote>

핵심 암기:

- Inverted Index는 Term → Document 구조다
- Dictionary에는 Term이 저장된다
- Posting List에는 Term이 등장한 Document 정보가 저장된다
- Posting에는 TF와 Position을 추가로 저장할 수 있다
- AND Query는 Posting List의 교집합으로 처리할 수 있다
- 역색인은 후보 검색 구조이고 TF-IDF는 가중치 계산 방법이다

<blockquote class="prompt-warning">
<p>역색인을 TF-IDF 자체라고 생각하면 안 됩니다. 역색인은 자료구조이고 TF-IDF는 Term의 가중치를 계산하는 방법입니다.</p>
</blockquote>

## 예시로 한 바퀴

문서가 세 개 있다고 하겠습니다.

```text
D1: AI is useful
D2: I study AI
D3: I study NLP
```

Tokenization 후 Term을 모읍니다.

```text
AI     → D1, D2
is     → D1
useful → D1
I      → D2, D3
study  → D2, D3
NLP    → D3
```

사용자가 `AI`를 검색합니다.

```text
AI
 ↓
Dictionary Lookup
 ↓
Posting List
 ↓
D1, D2
```

따라서 전체 문서 D1~D3를 하나씩 읽지 않고 `AI`의 Posting List에서 후보 문서를 바로 얻습니다.

이번에는 `AI AND study`를 검색합니다.

```text
AI    → D1, D2
study → D2, D3
```

교집합은

```text
D2
```

이므로 D2가 검색 결과가 됩니다.

## 객관식 6문제

**1.** 역색인의 기본 구조로 가장 적절한 것은?

- ① Document → Term
- ② Term → Document
- ③ Document → Image
- ④ Query → Model

<details>
<summary>정답</summary>

②

</details>

**2.** Posting List의 역할은?

- ① 모델의 학습률 저장
- ② 특정 Term이 등장한 Document 정보 저장
- ③ 문장의 품사만 저장
- ④ Vocabulary를 삭제

<details>
<summary>정답</summary>

②

</details>

**3.** 다음 역색인에서 `AI`의 DF는?

```text
AI → D1, D4, D7, D9
```

- ① 1
- ② 2
- ③ 4
- ④ 9

<details>
<summary>정답</summary>

③

</details>

**4.** `AI AND NLP` 검색에 가장 직접적으로 사용되는 연산은?

- ① 두 Posting List의 교집합
- ② 두 Posting List의 평균
- ③ 모든 Document 삭제
- ④ Vocabulary의 제곱

<details>
<summary>정답</summary>

①

</details>

**5.** Posting에 추가로 저장할 수 있는 정보로 적절한 것은?

- ① Term Frequency와 Position
- ② GPU 온도만
- ③ 학습 Epoch만
- ④ 이미지 해상도만

<details>
<summary>정답</summary>

①

</details>

**6.** 역색인과 TF-IDF의 관계에 대한 설명으로 맞는 것은?

- ① 둘은 완전히 같은 개념이다
- ② 역색인은 검색 구조이고 TF-IDF는 Term 가중치 계산 방법이다
- ③ TF-IDF가 역색인을 항상 삭제한다
- ④ 역색인은 Neural Network의 Activation Function이다

<details>
<summary>정답</summary>

②

</details>

## 다음에 이을 글

정보 검색 · Information Retrieval입니다.  
역색인으로 후보 문서를 찾은 뒤 Query와 Document의 관련도를 계산하고 검색 결과의 순위를 정하는 전체 과정을 살펴봅니다.
