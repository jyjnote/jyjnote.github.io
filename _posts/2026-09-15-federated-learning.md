---
title: 연합학습
date: 2026-09-15 00:50:00 +0900
slug: federated-learning
permalink: /posts/federated-learning/
categories: [AI, 딥러닝, 학습 패러다임]
tags: [연합학습, Federated Learning, FedAvg, Non-IID, 분산학습, 프라이버시]
math: true
---

연합학습(Federated Learning)은 **여러 Client가 자신의 데이터를 서버로 보내지 않고 로컬에서 학습한 뒤, 모델 업데이트만 공유하는 학습 방식**입니다.  
데이터를 한곳에 모으기 어려운 환경에서 여러 참여자의 정보를 함께 활용할 수 있습니다.

<blockquote class="prompt-info">
<p>한 줄: 데이터는 각 장치에 남겨 두고, 모델 업데이트만 모아 하나의 Global Model을 학습합니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

Client가 각자 로컬 학습을 수행하고 Server가 그 결과를 집계해 Global Model을 반복적으로 개선합니다.

</details>

## 왜 필요한가
일반적인 중앙집중식 학습은 데이터를 서버에 모은 뒤 모델을 학습합니다.

```text
Client A 데이터
Client B 데이터
Client C 데이터
        ↓
중앙 서버에 수집
        ↓
모델 학습
```

하지만 실제 환경에서는 데이터를 한곳에 모으기 어려울 수 있습니다.
예를 들면
- 스마트폰 사용자 데이터
- 병원 환자 데이터
- 금융기관 고객 데이터
- 기업 내부 데이터
처럼 개인정보나 보안 문제 때문에 원본 데이터를 외부로 전송하기 어려운 경우가 있습니다.
<mark>연합학습은 원본 데이터를 이동시키지 않고 여러 Client의 학습 정보를 활용하는 것이 핵심입니다.</mark>
## 기본 구조
연합학습은 보통 Server와 여러 Client로 구성됩니다.

```text
        Server
          ↓
   Global Model 배포
   ↓      ↓      ↓
Client A Client B Client C
   ↓      ↓      ↓
Local Training
   ↓      ↓      ↓
Model Update 전송
          ↓
        Server
          ↓
      Aggregation
```

Server는 Global Model을 관리합니다.
Client는 자신의 로컬 데이터로 모델을 학습합니다.
## Client
Client는 학습에 참여하는 장치나 기관입니다.
예:
- 스마트폰
- 병원
- 은행
- IoT 장치
- 기업 서버
각 Client는 자신의 데이터만 사용해 Local Model을 업데이트합니다.
## Server
Server는 여러 Client가 보낸 Model Update를 모아 Global Model을 갱신합니다.
Server가 반드시 원본 데이터를 직접 볼 필요는 없습니다.
일반적인 역할은 다음과 같습니다.
- Global Model 초기화
- Client에게 모델 배포
- Client Update 수집
- Update 집계
- 새로운 Global Model 생성
## 전체 학습 흐름
연합학습은 보통 다음 과정을 반복합니다.

```text
1. Server가 Global Model 배포
2. Client가 로컬 데이터로 학습
3. Client가 Model Update 전송
4. Server가 Update 집계
5. Global Model 갱신
6. 다음 Round 반복
```

이 반복 단위를 Communication Round라고 부릅니다.
## Local Training
각 Client는 자신의 데이터로 여러 번 Gradient Update를 수행합니다.
예를 들어 Client $$k$$의 로컬 데이터에 대한 Loss를 $$L_k$$라고 하면,
$$\theta_k\leftarrow\theta-\eta\nabla_{\theta}L_k(\theta)$$
처럼 로컬 파라미터를 업데이트할 수 있습니다.
- $$\theta$$: 전달받은 Global Parameter
- $$\theta_k$$: Client $$k$$의 Local Parameter
- $$\eta$$: Learning Rate
## Aggregation
여러 Client가 학습한 결과를 Server에서 하나로 합칩니다.
가장 대표적인 방식이 FedAvg입니다.
## FedAvg
FedAvg는 Federated Averaging의 약자입니다.
각 Client의 모델 파라미터를 데이터 수에 비례해 가중 평균합니다.
$$\theta^{t+1}=\sum_{k=1}^{K}\frac{n_k}{n}\theta_k^{t+1}$$
- $$K$$: Client 수
- $$n_k$$: Client $$k$$의 데이터 수
- $$n$$: 전체 참여 데이터 수
- $$\theta_k$$: Client $$k$$의 Local Model
- $$\theta^{t+1}$$: 새로운 Global Model
데이터가 많은 Client의 업데이트가 더 크게 반영됩니다.
## FedAvg의 직관
예를 들어

```text
Client A 데이터: 100개
Client B 데이터: 300개
```

라면 단순히 1:1로 평균하기보다 데이터 수를 고려해

```text
A : B = 1 : 3
```

비율로 반영할 수 있습니다.

<blockquote class="prompt-info">
<p>FedAvg는 여러 Local Model을 단순 평균하는 것이 아니라 보통 각 Client의 데이터 수를 고려해 가중 평균합니다.</p>
</blockquote>

## Communication Round
연합학습에서는 Server와 Client 사이의 통신이 반복됩니다.

```text
Round 1
Global Model → Local Training → Aggregation
Round 2
Global Model → Local Training → Aggregation
```

이 과정이 여러 번 반복되면서 Global Model이 개선됩니다.
## Local Epoch
Client는 매 Round마다 로컬 데이터를 한 번만 학습할 필요는 없습니다.
여러 Epoch 동안 Local Training을 수행한 뒤 Update를 보낼 수도 있습니다.
Local Epoch를 늘리면 통신 횟수를 줄일 수 있지만 Client 모델이 자신의 데이터에 너무 치우칠 수도 있습니다.
## Non-IID 데이터
연합학습에서 매우 중요한 문제입니다.
IID는 Independent and Identically Distributed를 의미합니다.
현실의 Client 데이터는 동일한 분포를 따르지 않는 경우가 많습니다.
예를 들어

```text
Client A → 주로 고양이 사진
Client B → 주로 강아지 사진
Client C → 주로 자동차 사진
```

처럼 데이터 분포가 서로 다를 수 있습니다.
이를 Non-IID 데이터라고 합니다.
<mark>연합학습에서는 Client별 데이터 분포가 다르기 때문에 Non-IID 문제가 매우 중요합니다.</mark>
## Non-IID가 왜 문제인가
각 Client가 서로 다른 방향으로 모델을 업데이트할 수 있습니다.

```text
Client A Gradient → 방향 1
Client B Gradient → 방향 2
Client C Gradient → 방향 3
```

이 차이가 크면 Aggregation 후 학습이 불안정해지거나 수렴이 느려질 수 있습니다.
## Client Drift
Client가 자신의 로컬 데이터에 여러 번 학습하면서 Global Model 방향에서 크게 벗어나는 현상을 Client Drift라고 합니다.
Non-IID 환경에서 특히 문제가 될 수 있습니다.
Local Epoch가 너무 많으면 Client Drift가 더 커질 수 있습니다.
## Communication Cost
연합학습의 또 다른 핵심 문제는 통신 비용입니다.
모든 Round마다

```text
Server → Model 전송
Client → Update 전송
```

을 반복해야 합니다.
모델이 크거나 Client 수가 많으면 네트워크 비용이 커질 수 있습니다.
## 통신 비용을 줄이는 방법
대표적으로 다음과 같은 방향을 생각할 수 있습니다.
- Local Epoch 증가
- 일부 Client만 참여
- Update Compression
- Quantization
- Sparse Update
핵심은 학습 성능과 통신량 사이의 균형입니다.
## Client Sampling
모든 Client가 매 Round에 참여할 필요는 없습니다.
전체 Client 중 일부만 선택할 수 있습니다.

```text
전체 Client 1000개
↓
이번 Round 참여 Client 100개
```

이렇게 하면 통신과 계산 비용을 줄일 수 있습니다.
## Cross-Device Federated Learning
Cross-Device 방식은 스마트폰이나 IoT 장치처럼 많은 수의 장치가 참여하는 환경입니다.
특징은 다음과 같습니다.
- Client 수가 매우 많음
- 각 Client 데이터는 비교적 적음
- Client가 항상 온라인이 아닐 수 있음
- 일부 Client만 Round에 참여
## Cross-Silo Federated Learning
Cross-Silo 방식은 병원, 은행, 기업처럼 비교적 적은 수의 기관이 참여하는 환경입니다.
특징은 다음과 같습니다.
- Client 수가 적음
- 각 Client 데이터가 큼
- 기관별 서버 성능이 비교적 안정적
- 참여자가 비교적 고정적
## Cross-Device와 Cross-Silo 비교

| 구분 | Cross-Device | Cross-Silo |
| --- | --- | --- |
| Client 수 | 매우 많음 | 비교적 적음 |
| Client 예시 | 스마트폰, IoT | 병원, 은행, 기업 |
| 데이터 양 | Client당 적은 편 | Client당 많은 편 |
| 참여 안정성 | 낮을 수 있음 | 비교적 높음 |

## Privacy
연합학습은 원본 데이터를 중앙 서버에 직접 보내지 않는다는 장점이 있습니다.
하지만 이것만으로 완전한 Privacy가 보장되는 것은 아닙니다.
Model Update에서도 일부 정보가 추론될 가능성이 있습니다.

<blockquote class="prompt-warning">
<p>연합학습은 원본 데이터를 공유하지 않지만, 연합학습 자체만으로 개인정보 보호가 완전히 해결되는 것은 아닙니다.</p>
</blockquote>

## Secure Aggregation
Secure Aggregation은 Server가 개별 Client의 Update를 직접 보지 않고 여러 Update의 집계 결과만 얻도록 하는 방식입니다.
목표는 개별 Client의 학습 정보 노출을 줄이는 것입니다.
## Differential Privacy와 결합
연합학습에 Differential Privacy를 추가할 수도 있습니다.
예를 들어 Update에 Noise를 추가해 특정 개인 데이터의 영향을 숨길 수 있습니다.
하지만 Noise가 너무 크면 모델 성능이 떨어질 수 있습니다.
즉, Privacy와 Utility 사이에 Trade-off가 존재합니다.
## 중앙집중 학습과 비교

| 구분 | 중앙집중 학습 | 연합학습 |
| --- | --- | --- |
| 원본 데이터 | 중앙 서버에 수집 | Client에 유지 |
| 학습 위치 | 주로 중앙 서버 | 각 Client + Server |
| 통신 | 데이터 전송 중심 | 모델 Update 전송 중심 |
| 주요 문제 | 데이터 수집/보안 | Non-IID, 통신 비용 |

## 연합학습과 분산학습
두 개념은 비슷하지만 목적과 환경이 다릅니다.
분산학습은 주로 하나의 큰 학습 작업을 여러 GPU나 서버에 나누어 빠르게 계산하는 것이 목적입니다.
연합학습은 데이터가 여러 Client에 분산된 상태에서 원본 데이터를 모으지 않고 공동 학습하는 것이 핵심입니다.

| 구분 | 연합학습 | 분산학습 |
| --- | --- | --- |
| 핵심 목적 | 데이터 이동 없이 공동 학습 | 계산 병렬화 |
| 데이터 위치 | Client별 분리 | 보통 중앙 관리 가능 |
| 데이터 분포 | Non-IID 가능 | IID로 나누는 경우 많음 |
| 주요 문제 | Privacy, 통신, Non-IID | 속도, 동기화 |

<mark>분산학습은 계산을 나누는 것이 핵심이고, 연합학습은 데이터를 나누어 보유한 상태에서 공동 학습하는 것이 핵심입니다.</mark>
## 연합학습과 멀티태스크 학습
멀티태스크 학습은 여러 Task를 함께 학습합니다.
연합학습은 여러 Client가 하나의 Global Model을 함께 학습하는 것이 일반적입니다.
즉,

```text
Multi-Task → 여러 Task
Federated → 여러 Client
```

가 핵심 구분입니다.
## 장점
### 1. 원본 데이터 이동 감소
민감한 데이터를 중앙 서버로 직접 보내지 않아도 됩니다.
### 2. 여러 기관의 데이터 활용
데이터를 직접 공유하기 어려운 기관들이 공동 모델을 학습할 수 있습니다.
### 3. 데이터 소유권 유지
각 Client가 자신의 데이터를 로컬에 보관할 수 있습니다.
## 단점
### 1. Non-IID 문제
Client마다 데이터 분포가 달라 학습이 불안정할 수 있습니다.
### 2. Communication Cost
Server와 Client 사이에 모델을 반복적으로 전송해야 합니다.
### 3. Client 성능 차이
장치마다 CPU, GPU, 네트워크 속도가 다를 수 있습니다.
### 4. Client Dropout
일부 Client가 학습 중 연결이 끊길 수 있습니다.
### 5. Privacy가 자동으로 완성되는 것은 아님
Model Update에서도 정보가 노출될 가능성이 있으므로 추가 보호 기법이 필요할 수 있습니다.
## 잘 놓치는 핵심
### 1. 데이터를 전혀 공유하지 않는다는 말과 Update를 공유하지 않는다는 말은 다르다
연합학습에서는 원본 데이터는 보통 로컬에 남지만 Model Update는 Server로 전송합니다.
### 2. 연합학습만으로 완벽한 Privacy가 보장되지는 않는다
Update에서도 정보가 유출될 가능성이 있습니다.
Secure Aggregation이나 Differential Privacy를 함께 사용할 수 있습니다.

### 3. FedAvg는 대표적인 Aggregation 방법이다

Client의 Local Model을 데이터 수에 따라 가중 평균하는 방식이 대표적입니다.

### 4. Non-IID가 핵심 문제다

실제 Client의 데이터 분포는 서로 다른 경우가 많습니다.

### 5. 분산학습과 같은 개념이 아니다

분산학습은 계산 효율이 중심이고, 연합학습은 데이터 분산 환경에서의 공동 학습이 중심입니다.

### 6. 모든 Client가 매 Round에 참여할 필요는 없다

Client Sampling을 사용해 일부 Client만 참여시킬 수 있습니다.

## 시험·면접

### 핵심 암기 포인트

- 원본 데이터는 Client에 유지한다.
- Client는 Local Training을 수행한다.
- Server는 Client Update를 Aggregation한다.
- FedAvg가 대표적인 Aggregation 방법이다.
- Communication Round 단위로 반복 학습한다.
- Non-IID 데이터가 중요한 문제다.
- Client Drift가 발생할 수 있다.
- Communication Cost가 크다.
- Cross-Device와 Cross-Silo를 구분해야 한다.
- 연합학습 자체만으로 완벽한 Privacy가 보장되지는 않는다.
- 분산학습과 같은 개념이 아니다.

### 자주 나오는 문장

**Q. 연합학습이란 무엇인가?**

여러 Client가 원본 데이터를 외부로 보내지 않고 로컬에서 모델을 학습한 뒤, Model Update만 Server와 공유하여 Global Model을 학습하는 방법입니다.

**Q. FedAvg란 무엇인가?**

각 Client에서 학습된 Local Model을 일반적으로 데이터 수에 비례해 가중 평균하여 Global Model을 갱신하는 방법입니다.

**Q. Non-IID 문제란 무엇인가?**

Client마다 데이터 분포가 서로 달라 Local Update 방향이 크게 달라지고, Global Model의 수렴이 어려워질 수 있는 문제입니다.

**Q. 연합학습과 분산학습의 차이는 무엇인가?**

분산학습은 계산을 여러 장치에 나눠 학습 속도를 높이는 것이 중심이고, 연합학습은 분산된 원본 데이터를 한곳에 모으지 않고 공동 모델을 학습하는 것이 중심입니다.

<blockquote class="prompt-warning">
<p>연합학습의 핵심은 데이터가 절대 노출되지 않는다는 것이 아니라, 원본 데이터를 중앙 서버로 직접 수집하지 않고 학습한다는 점입니다.</p>
</blockquote>

## 예시로 한 바퀴

세 병원이 공동으로 질병 예측 모델을 학습한다고 하겠습니다.

```text
병원 A 데이터
병원 B 데이터
병원 C 데이터
```

환자 원본 데이터는 각 병원 서버에 그대로 둡니다.

Server가 같은 Global Model을 배포합니다.

```text
Global Model
├─ 병원 A
├─ 병원 B
└─ 병원 C
```

각 병원은 자신의 데이터로 Local Training을 수행합니다.

```text
병원 A → Local Model A
병원 B → Local Model B
병원 C → Local Model C
```

Server는 세 Update를 FedAvg 방식으로 집계합니다.

```text
Local Models
↓
FedAvg
↓
새로운 Global Model
```

이 과정을 여러 Round 반복해 공동 모델을 개선합니다.

## 객관식 문제

### 1. 연합학습의 핵심 특징은?

① 모든 원본 데이터를 중앙 서버에 모은다.  
② 각 Client가 로컬 학습 후 Model Update를 공유한다.  
③ 하나의 Client만 학습한다.  
④ 반드시 비지도학습만 사용한다.

<details>
<summary>정답</summary>

②

</details>

### 2. FedAvg의 설명으로 옳은 것은?

① Client 데이터를 모두 합친다.  
② 여러 Local Model을 일반적으로 데이터 수를 고려해 평균한다.  
③ 모든 Client의 Loss를 0으로 만든다.  
④ Client 수를 줄이는 알고리즘이다.

<details>
<summary>정답</summary>

②

</details>

### 3. Non-IID 데이터의 의미는?

① 모든 Client 데이터 분포가 동일하다.  
② Client마다 데이터 분포가 서로 다를 수 있다.  
③ 데이터가 항상 정규분포를 따른다.  
④ Client가 하나뿐이다.

<details>
<summary>정답</summary>

②

</details>

### 4. Cross-Device Federated Learning의 예시는?

① 스마트폰 여러 대  
② 하나의 GPU 서버  
③ 하나의 데이터베이스  
④ 한 개의 학습 Sample

<details>
<summary>정답</summary>

①

</details>

### 5. 연합학습의 Privacy에 대한 설명으로 옳은 것은?

① 연합학습만 사용하면 모든 정보 유출이 불가능하다.  
② 원본 데이터는 로컬에 둘 수 있지만 Update에서 정보가 노출될 가능성은 있다.  
③ Server는 반드시 모든 원본 데이터를 저장한다.  
④ Differential Privacy와 함께 사용할 수 없다.

<details>
<summary>정답</summary>

②

</details>

### 6. 연합학습과 분산학습의 차이로 옳은 것은?

① 완전히 같은 개념이다.  
② 연합학습은 분산된 데이터의 공동 학습이 핵심이고, 분산학습은 계산 병렬화가 핵심이다.  
③ 연합학습에서는 여러 Client를 사용할 수 없다.  
④ 분산학습에서는 여러 장치를 사용할 수 없다.

<details>
<summary>정답</summary>

②

</details>

## 다음에 이을 글

지속학습(Continual Learning)입니다.  
시간에 따라 새로운 Task나 데이터를 계속 학습하면서 기존 지식을 유지하는 방법입니다.
