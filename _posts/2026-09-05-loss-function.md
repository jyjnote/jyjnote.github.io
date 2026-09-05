---
title: 손실 함수
date: 2026-09-05 14:00:00 +0900
slug: loss-function
permalink: /posts/loss-function/
categories: [AI, 딥러닝]
tags: [손실함수, MSE, 교차엔트로피, Softmax, 빅분기, NCS]
math: true
---

모델 출력 $$\hat{y}$$와 정답 $$y$$가 얼마나 다른지를 **하나의 수**로 만든 함수입니다.  
학습은 이 수를 줄이는 방향으로 $$w$$와 $$b$$를 움직입니다.  
<span style="color:#c0392b"><strong>무엇을 줄일지</strong></span>가 정해져야 역전파가 출발합니다.

<blockquote class="prompt-info">
  <p>Loss / cost. 한 표본의 손실을 보통 $$L$$, 표본 평균을 비용 $$J$$로 씁니다. 회귀는 MSE, 이진 분류는 이진 교차엔트로피, 다중 분류는 소프트맥스 + 교차엔트로피. 차트는 <code>https://jyjnote.github.io/assets/plotly/loss-function-charts.html</code> 입니다.</p>
</blockquote>

## 한 줄 식

회귀의 평균제곱오차:

$$
J = \frac{1}{N}\sum_{i=1}^{N}(y_i-\hat{y}_i)^2
$$

이진 교차엔트로피:

$$
J = -\frac{1}{N}\sum_{i=1}^{N}\Big[y_i\log\hat{y}_i+(1-y_i)\log(1-\hat{y}_i)\Big]
$$

- $$N$$: 표본 수. 학생 5명이면 $$N=5$$
- $$y_i$$: $$i$$번째 정답. 회귀면 점수, 분류면 0 또는 1
- $$\hat{y}_i$$: 모델이 낸 값. 회귀면 예측 점수, 이진 분류면 확률
- $$J$$: 줄이려는 값. 작을수록 정답에 가까움
- $$\log$$: 보통 자연로그. 밑이 바뀌면 상수배만 달라져 최솟값의 위치는 같음

한 표본만 보면 $$L_i$$이고, $$J=\frac{1}{N}\sum L_i$$입니다.  
시험에 loss와 cost를 구별하면, 전자는 표본, 후자는 평균인 책이 많습니다. 기호는 교재마다 섞입니다.

맞힌 개수(0-1 손실)는 미분할 곳이 거의 없습니다.  
경계 하나만 넘기면 0에서 1로 뛰므로, 경사하강의 출발점으로 못 씁니다.  
그래서 **매끈한** $$L$$을 씁니다.

[차트 새 탭]({{ '/assets/plotly/loss-function-charts.html' | relative_url }}#mse)

<iframe src="{{ '/assets/plotly/loss-function-charts.html' | relative_url }}#mse" title="MSE와 MAE" width="100%" height="720" style="border:0;border-radius:12px;background:#f7f9fb" loading="lazy"></iframe>

탭 **1. MSE·MAE**는 정답 $$y=80$$을 고정하고 예측을 움직입니다.  
제곱은 멀리 틀릴수록 더 가파르게 올라갑니다.

## 회귀: MSE

시험 점수 예측. 정답 $$y=80$$, 예측 $$\hat{y}=70$$.

$$
L=(80-70)^2=100
$$

예측 $$90$$이어도

$$
L=(80-90)^2=100
$$

방향은 달라도 제곱이라 양수입니다.  
두 표본 $$y=(80,60)$$, $$\hat{y}=(70,66)$$이면

$$
J=\frac{1}{2}\Big[(80-70)^2+(60-66)^2\Big]=\frac{100+36}{2}=68
$$

MAE는 절댓값입니다.

$$
L=|y-\hat{y}|
$$

$$|80-70|=10$$, $$|80-90|=10$$.  
제곱은 큰 오차를 더 세게 벌하고, 절댓값은 균등합니다.  
미분은 $$y=\hat{y}$$에서 MAE가 꺾입니다. MSE는 거기가 0입니다.

출력층은 보통 항등입니다. $$\hat{y}=z=w^\top x+b$$.

## 이진 분류: 교차엔트로피

합격 $$y=1$$, 불합격 $$y=0$$.  
출력은 시그모이드라 $$0<\hat{y}<1$$.

$$
L=-\big[y\log\hat{y}+(1-y)\log(1-\hat{y})\big]
$$

$$y=1$$이면 둘째 항이 0이라

$$
L=-\log\hat{y}
$$

$$\hat{y}=0.9$$이면 $$-\log 0.9\approx 0.105$$  
$$\hat{y}=0.1$$이면 $$-\log 0.1\approx 2.303$$

정답이 합격인데 확률을 0.1로 주면 손실이 커집니다.

$$y=0$$이면

$$
L=-\log(1-\hat{y})
$$

$$\hat{y}=0.1$$이면 $$-\log 0.9\approx 0.105$$  
$$\hat{y}=0.9$$이면 $$-\log 0.1\approx 2.303$$

<mark>틀린 쪽에 자신 있게 확률을 몰면 손실이 급증합니다.</mark>

[차트 새 탭]({{ '/assets/plotly/loss-function-charts.html' | relative_url }}#bce)

<iframe src="{{ '/assets/plotly/loss-function-charts.html' | relative_url }}#bce" title="이진 교차엔트로피" width="100%" height="720" style="border:0;border-radius:12px;background:#f7f9fb" loading="lazy"></iframe>

파란 선은 $$y=1$$일 때 $$-\log\hat{y}$$입니다. $$\hat{y}\to 0$$이면 손실이 무한대로 갑니다.  
금색 선은 $$y=0$$일 때 $$-\log(1-\hat{y})$$입니다.

MSE로 분류해도 숫자는 나옵니다.  
$$y=1$$, $$\hat{y}=0.1$$이면 $$(1-0.1)^2=0.81$$.  
다만 시그모이드를 통과한 뒤 MSE를 쓰면, 틀려도 포화된 구간에서 기울기가 작아집니다.  
교차엔트로피는 같은 시그모이드와 미분을 곱했을 때 식이 단순해지고, 틀린 확률을 더 크게 밉니다.

그래서 이진 분류의 짝은

> 출력 시그모이드 + 이진 교차엔트로피

입니다.

[차트 새 탭]({{ '/assets/plotly/loss-function-charts.html' | relative_url }}#compare)

<iframe src="{{ '/assets/plotly/loss-function-charts.html' | relative_url }}#compare" title="BCE와 MSE 비교" width="100%" height="720" style="border:0;border-radius:12px;background:#f7f9fb" loading="lazy"></iframe>

탭 **3. BCE vs MSE**는 정답 $$y=1$$입니다.  
$$\hat{y}=0.1$$에서 BCE는 약 $$2.30$$, MSE는 $$0.81$$입니다. 틀린 확신을 BCE가 더 세게 벌합니다.

## 다중 분류: 소프트맥스 + 교차엔트로피

클래스가 3개. 정답이 2번이면 원-핫

$$
\mathbf{y}=(0,1,0)
$$

모델 로짓이 $$z=(2,1,0)$$이면 앞 글에서

$$
\hat{y}\approx(0.665,\,0.245,\,0.090)
$$

교차엔트로피

$$
L=-\sum_{c=1}^{K} y_c\log\hat{y}_c
$$

- $$K$$: 클래스 수
- $$y_c$$: 클래스 $$c$$가 정답이면 1, 아니면 0
- $$\hat{y}_c$$: 소프트맥스 확률

원-핫이면 정답 클래스만 남습니다.

$$
L=-\log\hat{y}_{\text{정답}}=-\log 0.245\approx 1.406
$$

정답 확률이 $$0.9$$면 $$-\log 0.9\approx 0.105$$.  
정답 확률이 $$0.01$$이면 $$-\log 0.01\approx 4.605$$.

[차트 새 탭]({{ '/assets/plotly/loss-function-charts.html' | relative_url }}#ce)

<iframe src="{{ '/assets/plotly/loss-function-charts.html' | relative_url }}#ce" title="다중 교차엔트로피" width="100%" height="720" style="border:0;border-radius:12px;background:#f7f9fb" loading="lazy"></iframe>

가로축은 정답 클래스 확률입니다. 식이 이진 $$y=1$$과 같습니다.  
점 $$0.245$$가 위 예시의 손실 $$\approx 1.406$$입니다.

합이 1인 확률 벡터와 원-핫을 비교하는 식입니다.  
시그모이드 $$K$$개를 따로 쓰는 멀티라벨과 다릅니다. 그쪽은 클래스마다 이진 교차엔트로피를 더합니다.

## 왜 $$\log 0$$이 문제인가

$$\hat{y}=0$$인데 $$y=1$$이면 $$-\log 0=+\infty$$입니다.  
구현은 $$\hat{y}$$을 $$\varepsilon$$과 $$1-\varepsilon$$ 사이로 자릅니다.

$$
\hat{y}\leftarrow \min\big(\max(\hat{y},\varepsilon),\,1-\varepsilon\big)
$$

소프트맥스는 지수가 양수라 이론상 0이 아니지만, 밑이 너무 작으면 수치가 0으로 내려갑니다.  
로짓에서 $$z_i-\max z$$를 빼는 이유와 같이, 손실 계산도 안정화가 필요합니다.

## 출력 활성화와 짝

| 문제 | 출력 | 손실 |
|---|---|---|
| 회귀 | 항등 | MSE 또는 MAE |
| 이진 분류 | 시그모이드 | 이진 교차엔트로피 |
| 단일 라벨 다중 분류 | 소프트맥스 | 교차엔트로피 |
| 멀티라벨 | 시그모이드 $$K$$개 | 이진 교차엔트로피 합 |

짝이 깨지면 기울기 식이 지저분해지거나, 포화된 출력에서 학습이 멈춥니다.  
라이브러리가 `from_logits=True`를 제공하는 이유입니다. 소프트맥스와 로그를 한 번에 계산해 $$\log 0$$을 피합니다.

## 평균이냐 합이냐

$$
J_{\text{mean}}=\frac{1}{N}\sum_i L_i,\qquad
J_{\text{sum}}=\sum_i L_i
$$

최솟값의 **위치**는 같습니다. $$N$$배 차이만 납니다.  
학습률 체감이 달라집니다. 배치 크기를 바꿀 때 평균을 쓰면 $$J$$ 스케일이 비교적 유지됩니다.

정규화 항을 붙이면

$$
J = \frac{1}{N}\sum_i L_i + \lambda\,\lVert w\rVert_2^2
$$

- $$\lambda$$: 규제의 세기
- $$\lVert w\rVert_2^2$$: 가중치 제곱합. 큰 $$w$$에 벌점

이 항은 “학습 기술”의 정규화 글에서 이어집니다.

## 잘 놓치는 핵심

### 1. 손실이 작다 = 분류 정확도가 높다 는 아님

확률 $$0.51$$로 맞춰도 정확도는 1, 손실은 $$-\log 0.51\approx 0.673$$입니다.  
확률 $$0.99$$로 맞춰야 손실이 더 작습니다.  
정확도는 경계만 보고, 손실은 확신까지 봅니다.

### 2. MSE를 분류에 못 쓰는 것은 아님

쓸 수는 있습니다. 기본값이 아닐 뿐입니다.  
시그모이드 + MSE는 틀려도 끝단에서 기울기가 작아지기 쉽습니다.

### 3. 교차엔트로피의 앞의 마이너스

$$\log\hat{y}$$는 $$\hat{y}<1$$이라 음수입니다.  
앞에 마이너스가 있어야 손실이 양수가 됩니다.

### 4. $$y$$가 원-핫이 아니면

정답이 부드러운 확률이면 같은 식 $$-\sum y_c\log\hat{y}_c$$를 그대로 씁니다. 라벨 스무딩입니다.  
식 자체는 “정답 분포와 예측 분포의 교차엔트로피”입니다.

### 5. 손실을 줄인다고 일반화가 보장되지 않음

학습 손실만 0에 가까우면 과적합일 수 있습니다.  
검증 손실을 같이 봅니다.

## 시험·면접

<blockquote class="prompt-info">
  <p>단골: MSE 식, 이진 교차엔트로피 식, 원-핫이면 $$L=-\log\hat{y}_{\text{정답}}$$, 시그모이드+BCE / 소프트맥스+CE 짝, 0-1 손실은 미분 불가, 정확도와 손실은 다름.</p>
</blockquote>

전공자 체크:

- 교차엔트로피를 소프트맥스에 합성하면 $$\partial L/\partial z_i=\hat{y}_i-y_i$$
- 시그모이드+BCE도 $$\partial L/\partial z=\hat{y}-y$$
- 이 단순한 기울기 때문에 짝을 맞춥니다. 역전파 글에서 계산합니다.

## 객관식 10문제

**1.** 손실 함수가 하는 일은?

- ① 은닉 뉴런 개수를 정함
- ② $$\hat{y}$$와 $$y$$의 차이를 학습 가능한 수로 만듦
- ③ 입력 변수를 표준화
- ④ 클래스 수를 줄임

<details>
<summary>정답</summary>

②  
그 수를 줄이는 방향이 경사하강입니다.

</details>

**2.** $$y=80$$, $$\hat{y}=70$$일 때 MSE 한 표본 손실은?

- ① 10
- ② 100
- ③ $$-10$$
- ④ 0

<details>
<summary>정답</summary>

②  
$$(80-70)^2=100$$.

</details>

**3.** 이진에서 $$y=1$$, $$\hat{y}=0.1$$일 때 교차엔트로피는?

- ① $$-\log 0.1$$
- ② $$-\log 0.9$$
- ③ $$(1-0.1)^2$$
- ④ 0.1

<details>
<summary>정답</summary>

①  
$$y=1$$이면 $$L=-\log\hat{y}$$.

</details>

**4.** 0-1 손실을 경사하강에 잘 안 쓰는 이유는?

- ① 항상 음수라서
- ② 거의 모든 곳에서 미분이 0이고 경계에서 불연속
- ③ 클래스 수가 2로 고정
- ④ 로그가 필요

<details>
<summary>정답</summary>

②  
맞음/틀림만 있어 기울기가 사라짐.

</details>

**5.** 단일 라벨 다중 분류의 기본 짝은?

- ① 항등 + MSE
- ② 소프트맥스 + 교차엔트로피
- ③ ReLU + MAE
- ④ 계단 함수 + 정확도

<details>
<summary>정답</summary>

②  
확률 합 1과 원-핫을 비교.

</details>

**6.** 원-핫 정답이 클래스 2, $$\hat{y}_2=0.25$$이면 $$L$$은?

- ① $$-\log 0.25$$
- ② $$0.25$$
- ③ $$1-0.25$$
- ④ 모든 클래스 로그의 합

<details>
<summary>정답</summary>

①  
$$L=-\sum y_c\log\hat{y}_c=-\log\hat{y}_2$$.

</details>

**7.** 학습 손실이 0에 가까운데 테스트만 틀리면?

- ① 과소적합
- ② 과적합 가능
- ③ 편향이 없는 것
- ④ 소프트맥스 오류

<details>
<summary>정답</summary>

②  
학습 손실과 일반화는 별개.

</details>

**8.** 이진 교차엔트로피 앞의 마이너스는?

- ① 학습률
- ② $$\log\hat{y}<0$$이라 손실을 양수로 만들기 위함
- ③ 클래스 수
- ④ 정규화 계수

<details>
<summary>정답</summary>

②  
없으면 손실이 음수가 되어 “작을수록 좋다”가 뒤집힘.

</details>

**9.** 시그모이드 + MSE가 분류에서 기본이 아닌 이유에 가까운 것은?

- ① 확률을 못 냄
- ② 포화 구간에서 기울기가 작아지기 쉽습니다
- ③ 편향을 못 씀
- ④ XOR 전용

<details>
<summary>정답</summary>

②  
교차엔트로피+시그모이드는 $$\partial L/\partial z=\hat{y}-y$$로 단순하고, 틀린 확신을 더 세게 밉니다.

</details>

**10.** 배치 평균 손실을 쓰는 이유로 가장 가까운 것은?

- ① 최솟값의 위치가 합과 달라서
- ② $$N$$이 바뀌어도 손실 스케일을 비교적 유지
- ③ 파라미터가 줄어들어서
- ④ 소프트맥스가 필요해서

<details>
<summary>정답</summary>

①은 거짓. 위치는 같고 스케일만 $$N$$배. 평균은 배치 크기 변화에 손실 크기를 맞춰 학습률을 다루기 쉽습니다.

</details>

## 다음

손실 식을 정했습니다.  
한 표본이 네트워크를 통과해 $$\hat{y}$$가 나오기까지의 계산이 순전파입니다.

다음 글은 **순전파**입니다.
