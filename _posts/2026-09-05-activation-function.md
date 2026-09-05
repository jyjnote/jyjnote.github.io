---
title: 활성화 함수
date: 2026-09-05 13:00:00 +0900
slug: activation-function
permalink: /posts/activation-function/
categories: [AI, 딥러닝]
tags: [활성화함수, Sigmoid, ReLU, Softmax, 기울기소실, 빅분기, NCS]
math: true
---

가중합 $$z$$를 뉴런의 출력으로 바꾸는 함수입니다.  
선형인 채로 두면 층을 쌓아도 한 줄입니다. <span style="color:#c0392b"><strong>비선형</strong></span>이어야 MLP가 의미를 갖습니다.

<blockquote class="prompt-info">
  <p>Activation function. 은닉층에 ReLU·시그모이드·tanh, 출력층에 시그모이드·소프트맥스·항등. 시험 단골은 치역, 미분, 기울기 소실, dying ReLU입니다. 차트는 <code>https://jyjnote.github.io/assets/plotly/activation-function-charts.html</code> 입니다.</p>
</blockquote>

## 한 줄 식

한 뉴런은 두 단계입니다.

$$
z = \mathbf{w}^\top \mathbf{x} + b
$$

$$
a = f(z)
$$

- $$\mathbf{x}$$: 입력 벡터. 예: (공부시간, 출석)
- $$\mathbf{w}, b$$: 가중치와 편향
- $$z$$: 가중합. 활성화 이전 점수
- $$f$$: 활성화 함수
- $$a$$: 활성화된 출력. 다음 층의 입력이 됨

$$f(z)=z$$이면 항등입니다. 회귀 출력에서만 씁니다.  
은닉층에 항등을 쓰면

$$
W^{(2)}(W^{(1)}x+b^{(1)})+b^{(2)}
$$

가 다시 $$W'x+b'$$가 됩니다.  
앞 글 MLP에서 본 그대로입니다.

[차트 새 탭]({{ '/assets/plotly/activation-function-charts.html' | relative_url }}#all)

<iframe src="{{ '/assets/plotly/activation-function-charts.html' | relative_url }}#all" title="활성화 함수 비교" width="100%" height="720" style="border:0;border-radius:12px;background:#f7f9fb" loading="lazy"></iframe>

탭 **1. 한눈에**에서 같은 $$z$$에 대한 출력을 겹쳐 보세요.  
계단은 0/1, 시그모이드는 (0,1), tanh는 (-1,1), ReLU는 음수에서 0입니다.

## 계단 함수

퍼셉트론이 쓰는 함수입니다.

$$
f(z)=
\begin{cases}
1 & z \ge 0 \\
0 & z < 0
\end{cases}
$$

예: $$z=2$$이면 $$1$$, $$z=-0.3$$이면 $$0$$, $$z=0$$이면 $$1$$(이 글의 약속).

- 치역: $$\{0,1\}$$
- 미분: $$z=0$$에서 없음, 나머지에서 $$0$$
- 역전파에 부적합. 기울기를 뒤로 못 보냄

시험에 step / Heaviside로 나옵니다.

## 시그모이드

$$
\sigma(z)=\frac{1}{1+e^{-z}}
$$

- $$z$$: 가중합
- $$e^{-z}$$: $$z$$가 커지면 0에 가까워짐. 분모가 1에 가까워져 $$\sigma \to 1$$
- $$z$$가 작으면 $$e^{-z}$$가 커져 $$\sigma \to 0$$

계산:

$$
\sigma(0)=\frac{1}{1+e^{0}}=\frac{1}{1+1}=\frac{1}{2}
$$

$$
\sigma(2)=\frac{1}{1+e^{-2}}=\frac{1}{1+0.1353}\approx 0.881
$$

$$
\sigma(-2)=\frac{1}{1+e^{2}}=\frac{1}{1+7.389}\approx 0.119
$$

치역은 $$(0,1)$$입니다. 0과 1에 **닿지 않습니다**.

미분은

$$
\sigma'(z)=\sigma(z)\big(1-\sigma(z)\big)
$$

$$z=0$$이면 $$\sigma=0.5$$이므로

$$
\sigma'(0)=0.5\times 0.5=0.25
$$

이 값이 **최댓값**입니다.  
$$z=2$$이면 $$0.881\times(1-0.881)\approx 0.881\times 0.119\approx 0.105$$  
$$z=5$$이면 $$\sigma\approx 0.993$$, 미분은 $$\approx 0.007$$

층을 세 개 지나며 미분을 곱하면

$$
0.25\times 0.25\times 0.25=0.015625
$$

이미 작습니다. $$z$$가 크거나 작으면 $$0.105$$, $$0.007$$을 곱하니 더 작아집니다.

<mark>시그모이드를 은닉에 깊게 쌓으면 기울기 소실이 납니다.</mark>  
출력이 0 또는 1 근처에 포화되면 기울기가 거의 0입니다.

이진 분류의 **출력층**에서는 여전히 씁니다. 한 값을 확률처럼 보기 좋습니다.

[차트 새 탭]({{ '/assets/plotly/activation-function-charts.html' | relative_url }}#sigmoid)

<iframe src="{{ '/assets/plotly/activation-function-charts.html' | relative_url }}#sigmoid" title="시그모이드와 미분" width="100%" height="720" style="border:0;border-radius:12px;background:#f7f9fb" loading="lazy"></iframe>

파란 곡선이 $$\sigma(z)$$, 빨간 곡선이 $$\sigma'(z)$$입니다.  
$$z=0$$에서 빨간 점의 높이가 $$0.25$$입니다.

## tanh

$$
\tanh(z)=\frac{e^{z}-e^{-z}}{e^{z}+e^{-z}}
$$

시그모이드를 늘리고 옮긴 것과 같습니다.

$$
\tanh(z)=2\sigma(2z)-1
$$

- $$\tanh(0)=0$$
- 치역 $$(-1,1)$$
- 평균이 0 근처에 오기 쉬워, 시그모이드보다 은닉에 조금 낫다는 설명이 많음

$$
\tanh(0)=0,\qquad \tanh(2)\approx 0.964,\qquad \tanh(-2)\approx -0.964
$$

미분 최댓값은 $$z=0$$에서 $$1$$입니다. 시그모이드의 $$0.25$$보다 큽니다.  
그래도 $$|z|$$가 커지면 다시 포화하고, 기울기는 0에 가까워집니다.  
깊게 쌓으면 소실 문제는 남습니다.

[차트 새 탭]({{ '/assets/plotly/activation-function-charts.html' | relative_url }}#tanh)

<iframe src="{{ '/assets/plotly/activation-function-charts.html' | relative_url }}#tanh" title="tanh와 미분" width="100%" height="720" style="border:0;border-radius:12px;background:#f7f9fb" loading="lazy"></iframe>

## ReLU

$$
\mathrm{ReLU}(z)=\max(0,z)
$$

$$
z=3 \Rightarrow 3,\qquad z=0 \Rightarrow 0,\qquad z=-2 \Rightarrow 0
$$

- 치역: $$[0,\infty)$$
- $$z>0$$이면 미분 $$1$$
- $$z<0$$이면 미분 $$0$$
- $$z=0$$은 보통 0 또는 1로 구현이 갈림. 실무에선 거의 문제 안 됨

양수 구간 미분이 1이라, 시그모이드처럼 $$0.25$$씩 줄어들지 않습니다.  
계산도 $$\max$$ 한 번입니다.

단점 하나:

$$
z<0 \Rightarrow f(z)=0,\quad f'(z)=0
$$

그 뉴런은 앞뒤 모두 0입니다. 가중치가 안 움직입니다.  
**dying ReLU**입니다.

예: 편향이 $$-10$$이고 입력이 작으면 $$z$$가 항상 음수입니다.  
그 뉴런은 죽은 채로 남습니다.

## Leaky ReLU

$$
\mathrm{LeakyReLU}(z)=
\begin{cases}
z & z \ge 0 \\
\alpha z & z < 0
\end{cases}
$$

- $$\alpha$$: 보통 $$0.01$$
- $$z=-2$$, $$\alpha=0.01$$이면 출력 $$-0.02$$, 미분 $$0.01$$

음수 구간을 완전히 0으로 안 막아서 dying을 줄입니다.  
PReLU는 $$\alpha$$까지 학습합니다.

[차트 새 탭]({{ '/assets/plotly/activation-function-charts.html' | relative_url }}#relu)

<iframe src="{{ '/assets/plotly/activation-function-charts.html' | relative_url }}#relu" title="ReLU와 Leaky ReLU" width="100%" height="720" style="border:0;border-radius:12px;background:#f7f9fb" loading="lazy"></iframe>

파란 선이 ReLU, 금색이 Leaky ReLU입니다.  
점선은 미분입니다. $$z<0$$에서 ReLU 미분만 0입니다.

## Softmax

출력이 여러 개일 때 씁니다. 클래스 확률로 바꿉니다.

$$
\mathrm{softmax}(z)_i=\frac{e^{z_i}}{\sum_{j=1}^{K}e^{z_j}}
$$

- $$z_i$$: 클래스 $$i$$의 가중합(로짓)
- $$K$$: 클래스 수
- 분자: 클래스 $$i$$를 지수로 키운 값
- 분모: 모든 클래스를 같은 방식으로 키운 뒤 더한 값
- 결과는 $$0$$과 $$1$$ 사이, **합이 1**

예: 세 클래스 점수 $$z=(2,1,0)$$

$$
e^{2}\approx 7.389,\quad e^{1}\approx 2.718,\quad e^{0}=1
$$

합 $$7.389+2.718+1=11.107$$

$$
p_1=\frac{7.389}{11.107}\approx 0.665
$$

$$
p_2=\frac{2.718}{11.107}\approx 0.245
$$

$$
p_3=\frac{1}{11.107}\approx 0.090
$$

$$0.665+0.245+0.090=1.000$$

$$z$$에 상수를 더해도 결과는 같습니다.

$$
\frac{e^{z_i+c}}{\sum_j e^{z_j+c}}=\frac{e^{c}e^{z_i}}{e^{c}\sum_j e^{z_j}}=\mathrm{softmax}(z)_i
$$

구현은 수치 안정을 위해 $$z_i-\max z$$를 넣습니다.  
시험에 “왜 max를 빼나”가 나오면 <mark>지수 오버플로 방지</mark>입니다. 값은 그대로입니다.

시그모이드는 클래스마다 따로 0~1입니다. 합이 1이 아닙니다.  
상호 배타 다중 분류는 소프트맥스입니다.

[차트 새 탭]({{ '/assets/plotly/activation-function-charts.html' | relative_url }}#softmax)

<iframe src="{{ '/assets/plotly/activation-function-charts.html' | relative_url }}#softmax" title="소프트맥스" width="100%" height="720" style="border:0;border-radius:12px;background:#f7f9fb" loading="lazy"></iframe>

막대 세 개의 합이 1입니다. $$z=2$$인 클래스가 약 $$0.665$$로 가장 큽니다.

## 한눈에 비교

| 함수 | 식 | 치역 | 은닉 | 출력 | 주의 |
|---|---|---|---|---|---|
| 계단 | $$z\ge 0$$이면 1 | $$\{0,1\}$$ | 거의 안 씀 | 퍼셉트론 | 미분 0 |
| 시그모이드 | $$1/(1+e^{-z})$$ | $$(0,1)$$ | 깊은 망에 비추 | 이진 분류 | 기울기 소실 |
| tanh | $$(e^{z}-e^{-z})/(e^{z}+e^{-z})$$ | $$(-1,1)$$ | 시그모이드보다 나음 | 드묾 | 역시 포화 |
| ReLU | $$\max(0,z)$$ | $$[0,\infty)$$ | 기본 | 회귀에 그대로 안 씀 | dying ReLU |
| Leaky ReLU | 음수는 $$\alpha z$$ | $$(-\infty,\infty)$$ | ReLU 대체 | — | $$\alpha$$ 선택 |
| 소프트맥스 | $$e^{z_i}/\sum e^{z_j}$$ | 합이 1인 확률 | 안 씀 | 다중 분류 | 합 1 |

GELU·Swish는 Transformer 쪽에 자주 나옵니다.  
기본 시험 범위는 위 표면 됩니다.

## 기울기 소실을 숫자로

은닉 3층, 각 층 시그모이드, 모두 $$z=0$$인 낙관적인 경우에도

$$
0.25^{3}=0.015625
$$

앞쪽 $$W^{(1)}$$이 받는 기울기는 이미 $$1/64$$ 수준입니다.  
$$z=4$$인 층이 끼면

$$
\sigma(4)\approx 0.982,\quad \sigma'(4)\approx 0.018
$$

$$0.25\times 0.25\times 0.018=0.001125$$

학습이 사실상 멈춥니다.

ReLU면 양수 구간 미분이 1이라, 죽은 뉴런만 아니면 이 곱이 1로 유지됩니다.  
그래서 깊은 망의 은닉 기본값이 ReLU입니다.

## 잘 놓치는 핵심

### 1. 활성화는 “확률 함수”가 아니다

시그모이드·소프트맥스 **출력**만 확률처럼 읽습니다.  
은닉 ReLU의 $$3.2$$는 확률이 아닙니다.

### 2. 시그모이드 미분 최댓값은 1이 아니다

$$
\sigma'(z)=\sigma(1-\sigma)\le 0.25
$$

“시그모이드 미분이 최대 1”은 오답입니다. 그건 tanh 쪽입니다.

### 3. Softmax ≠ 여러 시그모이드

시그모이드 $$K$$개는 합이 1이 아닙니다.  
멀티라벨(동시 합격 가능)은 시그모이드, 단일 라벨은 소프트맥스입니다.

### 4. ReLU는 비선형이다

양수에서 직선이라고 선형 함수로 적으면 틀립니다.  
$$z=0$$에서 꺾이므로 비선형입니다. 그래서 층을 쌓을 가치가 있습니다.

### 5. 출력에 ReLU를 기본으로 두지 않는다

이진 확률을 원하면 시그모이드, 다중 분류면 소프트맥스, 실수 회귀면 항등입니다.  
양수 회귀(가격)에 ReLU 출력을 쓰는 경우는 따로 있습니다.

## 시험·면접

<blockquote class="prompt-info">
  <p>단골: 비선형이어야 하는 이유, $$\sigma(z)=1/(1+e^{-z})$$, $$\sigma'=\sigma(1-\sigma)$$, 최댓값 0.25, 기울기 소실, ReLU $$\max(0,z)$$, dying ReLU, 소프트맥스 합 1, 시그모이드와 소프트맥스 구분.</p>
</blockquote>

전공자 체크:

- 포화(saturation) = 출력이 끝단에 붙어 미분이 0에 가까움
- 소프트맥스 이동 불변: $$z+c$$와 $$z$$의 확률이 같음
- 은닉 기본은 ReLU, 출력은 손실과 짝을 맞춰 고름

## 객관식 10문제

**1.** 은닉 활성화가 선형이면?

- ① 층 수만큼 표현력이 늘어남
- ② 다층이 단층 선형과 같음
- ③ 기울기 소실이 사라짐
- ④ 소프트맥스가 필요

<details>
<summary>정답</summary>

②  
행렬 곱이 하나의 행렬로 합쳐짐.

</details>

**2.** $$\sigma(0)$$의 값은?

- ① 0
- ② 0.25
- ③ 0.5
- ④ 1

<details>
<summary>정답</summary>

③  
$$1/(1+e^{0})=1/2$$.

</details>

**3.** 시그모이드 미분의 최댓값은?

- ① 1
- ② 0.5
- ③ 0.25
- ④ 0

<details>
<summary>정답</summary>

③  
$$\sigma(1-\sigma)$$는 $$\sigma=0.5$$일 때 0.25.

</details>

**4.** 기울기 소실이 특히 심한 은닉 활성화는?

- ① ReLU
- ② 시그모이드
- ③ Leaky ReLU
- ④ 항등

<details>
<summary>정답</summary>

②  
포화가 빠르고 미분 상한이 0.25.

</details>

**5.** $$\mathrm{ReLU}(-3)$$은?

- ① $$-3$$
- ② $$0$$
- ③ $$3$$
- ④ $$0.01$$

<details>
<summary>정답</summary>

②  
$$\max(0,-3)=0$$.

</details>

**6.** dying ReLU란?

- ① 학습률이 0
- ② $$z$$가 계속 음수여서 뉴런 출력과 미분이 0
- ③ 소프트맥스 합이 1이 아님
- ④ 편향이 없는 것

<details>
<summary>정답</summary>

②  
그 뉴런으로 기울기가 통과하지 않음. Leaky ReLU가 완화.

</details>

**7.** $$z=(2,1,0)$$일 때 소프트맥스에서 가장 큰 성분은?

- ① 클래스 0
- ② 클래스 1(점수 2)
- ③ 모두 1/3
- ④ 음수

<details>
<summary>정답</summary>

②  
지수는 단조증가. 가장 큰 로짓이 가장 큰 확률. 값은 약 0.665.

</details>

**8.** 소프트맥스 확률의 합은?

- ① 0
- ② 클래스 수
- ③ 1
- ④ $$z$$의 합

<details>
<summary>정답</summary>

③  
분모가 모든 분자의 합.

</details>

**9.** 상호 배타적인 세 반으로 나누는 출력층은?

- ① 시그모이드 3개만이 정석
- ② 소프트맥스
- ③ 계단 함수 하나
- ④ ReLU 3개

<details>
<summary>정답</summary>

②  
한 표본이 한 반. 멀티라벨이면 시그모이드.

</details>

**10.** ReLU가 비선형인 이유는?

- ① 치역이 확률이라서
- ② $$z=0$$에서 꺾여 전체 함수가 선형이 아니라서
- ③ 미분이 항상 1이라서
- ④ 소프트맥스와 같아서

<details>
<summary>정답</summary>

②  
양수 구간만 보면 직선이지만, 원점에서의 꺾임이 비선형. 그래서 층을 쌓을 수 있음.

</details>

## 다음

출력을 냈으면 정답과 얼마나 다른지 재야 합니다.  
그 척도가 손실이고, 손실의 미분이 역전파의 출발점입니다.

다음 글은 **손실 함수**입니다.
