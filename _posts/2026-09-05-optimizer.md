---
title: 최적화기
date: 2026-09-05 18:00:00 +0900
slug: optimizer
permalink: /posts/optimizer/
categories: [AI, 딥러닝]
tags: [최적화기, Adam, 모멘텀, RMSProp, AdaGrad, 빅분기, NCS]
math: true
---

경사하강은 $$w\leftarrow w-\eta\,g$$ 한 줄입니다.  
같은 빼기라도 이전 걸음을 기억하거나, 파라미터마다 걸음 길이를 나누면 좁은 골짜기에서 덜 흔들립니다.  
그 변형이 <span style="color:#c0392b"><strong>최적화기</strong></span>입니다.

<blockquote class="prompt-info">
  <p>Optimizer. 기본은 SGD. 위에 모멘텀, AdaGrad, RMSProp, Adam. 차트는 같은 출발·같은 $$\eta$$에서 궤적만 바꿉니다. 파일은 <code>https://jyjnote.github.io/assets/plotly/optimizer-charts.html</code> 입니다.</p>
</blockquote>

## 한 줄로 보면

$$g_t=\partial L/\partial w$$ 는 시각 $$t$$의 기울기입니다.

| 방법 | 갱신 | 핵심 |
|---|---|---|
| SGD | $$w\leftarrow w-\eta g_t$$ | 지금 기울기만 |
| 모멘텀 | $$v\leftarrow \beta v+g$$, $$w\leftarrow w-\eta v$$ | 같은 방향은 가속 |
| AdaGrad | $$\eta/\sqrt{\sum g^2}$$ | 많이 움직인 축은 걸음을 줄임 |
| RMSProp | 제곱 기울기의 지수평균 | AdaGrad가 멈추는 문제를 완화 |
| Adam | 모멘텀 + RMSProp + 보정 | 실무 기본값 |

차트 곡면은 앞 글과 같은 좁은 골짜기입니다.

$$
L=(w_1-1)^2+8(w_2-1)^2
$$

출발 $$(-1.0,\ 2.0)$$, 최솟값 $$(1,1)$$, $$\eta=0.08$$, 28걸음입니다.

[차트 새 탭]({{ '/assets/plotly/optimizer-charts.html' | relative_url }}#all)

<iframe src="{{ '/assets/plotly/optimizer-charts.html' | relative_url }}#all" title="최적화기 비교" width="100%" height="720" style="border:0;border-radius:12px;background:#f7f9fb" loading="lazy"></iframe>

탭 **1. 네 방법**에서 다섯 궤적을 겹쳐 보세요.  
이제 방법마다 재생 탭이 있습니다.

## SGD

$$
w_t = w_{t-1}-\eta g_t
$$

지금 기울기만 봅니다. 이전 걸음은 남기지 않습니다.

$$w_2$$ 쪽 기울기는 $$16(w_2-1)$$이라 $$w_1$$보다 훨씬 큽니다.  
같은 $$\eta$$면 세로로 크게 진동합니다.

[차트 새 탭]({{ '/assets/plotly/optimizer-charts.html' | relative_url }}#sgd)

<iframe src="{{ '/assets/plotly/optimizer-charts.html' | relative_url }}#sgd" title="SGD 움직임" width="100%" height="720" style="border:0;border-radius:12px;background:#f7f9fb" loading="lazy"></iframe>

탭 **2. SGD**에서 재생을 누르세요.  
점이 골짜기를 가로질러 위아래로  hops 합니다. 최솟값에 잘 못 붙습니다.

## 모멘텀

$$
v_t = \beta v_{t-1}+g_t
$$

$$
w_t = w_{t-1}-\eta v_t
$$

- $$v_t$$: 쌓인 속도
- $$\beta$$: 보통 $$0.9$$. 이전 속도를 얼마나 남길지
- $$v_0=0$$

같은 부호가 반복되면 $$|v|$$가 커집니다.  
부호가 바뀌면 이전 속도가 이번 기울기를 상쇄합니다.

숫자: $$w=0.4$$, $$g=-0.267$$이 두 번 같다고 가정.

$$
v_1=-0.267,\qquad w_1=0.4-0.1\cdot(-0.267)=0.4267
$$

첫 걸음은 SGD와 같습니다.

$$
v_2=0.9\cdot(-0.267)+(-0.267)=-0.5073
$$

$$
w_2=0.4267-0.1\cdot(-0.5073)=0.4774
$$

SGD 두 걸음은 $$0.4534$$입니다. 모멘텀이 더 멀리 갑니다.

[차트 새 탭]({{ '/assets/plotly/optimizer-charts.html' | relative_url }}#mom)

<iframe src="{{ '/assets/plotly/optimizer-charts.html' | relative_url }}#mom" title="모멘텀 움직임" width="100%" height="720" style="border:0;border-radius:12px;background:#f7f9fb" loading="lazy"></iframe>

탭 **3. 모멘텀**을 재생하세요.  
SGD보다 진동 폭이 줄고, 골짜기 안으로 더 들어갑니다.

## AdaGrad

$$
G_t=G_{t-1}+g_t^2
$$

$$
w_t=w_{t-1}-\frac{\eta}{\sqrt{G_t}+\varepsilon}\,g_t
$$

- $$G_t$$: 기울기 제곱의 **합**. 파라미터마다 따로
- $$\varepsilon$$: $$10^{-8}$$. 나누기 0 방지
- 많이 움직인 축은 분모가 커져 걸음이 작아짐

같은 숫자 $$w=0.4$$, $$g=-0.267$$, $$\eta=0.1$$.

$$
G_1=0.071289,\quad \sqrt{G_1}\approx 0.267
$$

$$
w_1=0.4-\frac{0.1}{0.267}\cdot(-0.267)=0.5
$$

첫 걸음은 $$\eta\cdot\mathrm{sign}(g)$$입니다.

둘째 걸음:

$$
G_2=0.142578,\quad \sqrt{G_2}\approx 0.378
$$

$$
w_2=0.5-\frac{0.1}{0.378}\cdot(-0.267)=0.5706
$$

둘째가 첫째보다 짧습니다.  
<mark>$$G$$는 줄어들지 않습니다.</mark> 오래 가면 걸음이 거의 0입니다.

[차트 새 탭]({{ '/assets/plotly/optimizer-charts.html' | relative_url }}#adagrad)

<iframe src="{{ '/assets/plotly/optimizer-charts.html' | relative_url }}#adagrad" title="AdaGrad 움직임" width="100%" height="720" style="border:0;border-radius:12px;background:#f7f9fb" loading="lazy"></iframe>

탭 **4. AdaGrad**. 초반은 잘 움직이다가 점이 점점 짧아집니다. $$w_2$$ 쪽 $$G$$가 빨리 쌓이기 때문입니다.

## RMSProp

$$
E_t=\rho E_{t-1}+(1-\rho)g_t^2
$$

$$
w_t=w_{t-1}-\frac{\eta}{\sqrt{E_t}+\varepsilon}\,g_t
$$

- $$\rho$$: 보통 $$0.9$$
- 오래된 $$g^2$$는 잊힘
- 그래서 걸음이 0으로 굳지 않음

$$E_0=0$$, $$\rho=0.9$$, $$g=-0.267$$.

$$
E_1=0.1\cdot 0.071289=0.007129,\quad \sqrt{E_1}\approx 0.0844
$$

$$
w_1=0.4-\frac{0.1}{0.0844}\cdot(-0.267)=0.716
$$

AdaGrad 첫 걸음 $$0.5$$보다 큽니다. 초반 보정가 없기 때문입니다.

[차트 새 탭]({{ '/assets/plotly/optimizer-charts.html' | relative_url }}#rms)

<iframe src="{{ '/assets/plotly/optimizer-charts.html' | relative_url }}#rms" title="RMSProp 움직임" width="100%" height="720" style="border:0;border-radius:12px;background:#f7f9fb" loading="lazy"></iframe>

탭 **5. RMSProp**. AdaGrad처럼 초반에 멈추지 않고 골짜기를 따라갑니다.

## Adam

$$
m_t=\beta_1 m_{t-1}+(1-\beta_1)g_t
$$

$$
v_t=\beta_2 v_{t-1}+(1-\beta_2)g_t^2
$$

$$
\hat{m}_t=\frac{m_t}{1-\beta_1^t},\qquad
\hat{v}_t=\frac{v_t}{1-\beta_2^t}
$$

$$
w_t=w_{t-1}-\frac{\eta\,\hat{m}_t}{\sqrt{\hat{v}_t}+\varepsilon}
$$

- $$m_t$$: 기울기 지수평균 (방향)
- $$v_t$$: 기울기 제곱 지수평균 (축별 스케일). 모멘텀의 속도와 **다른 기호**
- $$\beta_1=0.9$$, $$\beta_2=0.999$$
- $$t$$는 1부터
- $$\hat{m},\hat{v}$$: 초반 0 치우침 보정

$$t=1$$, $$g=-0.267$$, $$\eta=0.1$$:

$$
m_1=-0.0267,\quad v_1=0.000071289
$$

$$
\hat{m}_1=-0.267,\quad \hat{v}_1=0.071289,\quad \sqrt{\hat{v}_1}=0.267
$$

$$
w_1=0.4-\frac{0.1\cdot(-0.267)}{0.267}=0.5
$$

첫 걸음은 $$\eta\cdot\mathrm{sign}(g)$$입니다.  
보정을 빼면 $$m_1=-0.0267$$을 그대로 써서 걸음이 약 10배 작아집니다.

[차트 새 탭]({{ '/assets/plotly/optimizer-charts.html' | relative_url }}#adam)

<iframe src="{{ '/assets/plotly/optimizer-charts.html' | relative_url }}#adam" title="Adam 움직임" width="100%" height="720" style="border:0;border-radius:12px;background:#f7f9fb" loading="lazy"></iframe>

탭 **6. Adam**을 재생하세요.  
가파른 $$w_2$$는 짧게, 완만한 $$w_1$$은 꾸준히 가서 $$(1,1)$$ 근처로 붙습니다.

Adam이어도 $$\eta$$는 직접 고릅니다. 기본 실험은 $$10^{-3}$$부터입니다.

## 무엇을 고르나

- 기본 실험: Adam
- 이미지·긴 학습: SGD + 모멘텀이 더 나은 경우가 있음
- 희소 특징: AdaGrad 계열
- 가중치 감쇠를 분리: AdamW

## 잘 놓치는 핵심

### 1. 최적화기는 손실 함수가 아니다

줄이는 대상은 $$L$$ 그대로입니다.

### 2. Adam의 $$v$$는 속도가 아니다

모멘텀 $$v$$는 속도, Adam $$v$$는 제곱평균입니다.

### 3. 적응 학습률 ≠ $$\eta$$ 생략

분모가 스케일을 나눌 뿐입니다.

### 4. 기울기 0이면 어떤 최적화기도 안 움직인다

죽은 ReLU·포화는 최적화기 문제가 아닙니다.

### 5. 궤적의 차이는 식의 차이

차트에서 SGD가 흔들리고 Adam이 붙는 이유는 축마다 걸음을 나누기 때문입니다.

## 시험·면접

<blockquote class="prompt-info">
  <p>단골: SGD vs 모멘텀, AdaGrad 분모가 커지는 이유, RMSProp 지수평균, Adam 편향 보정, $$\beta_1=0.9,\beta_2=0.999$$, Adam $$v$$ ≠ 모멘텀 $$v$$.</p>
</blockquote>

## 객관식 10문제

**1.** 최적화기가 바꾸는 것은?

- ① 정답 라벨
- ② $$w$$를 기울기로 빼는 규칙
- ③ 은닉 뉴런 수
- ④ 손실의 정의

<details>
<summary>정답</summary>

②

</details>

**2.** 모멘텀 $$\beta=0.9$$의 의미는?

- ① 학습률
- ② 이전 속도의 90%를 남김
- ③ 배치 크기
- ④ 클래스 수

<details>
<summary>정답</summary>

②

</details>

**3.** 차트에서 SGD가 세로로 흔들리는 이유는?

- ① 출발점이 달라서
- ② $$w_2$$ 곡률이 커 기울기가 큼
- ③ 편향이 없어서
- ④ Adam만 애니메이션이라서

<details>
<summary>정답</summary>

②  
$$16(w_2-1)$$.

</details>

**4.** AdaGrad가 오래 가면 느려지는 이유는?

- ① $$\eta$$가 음수
- ② $$G=\sum g^2$$가 줄어들지 않음
- ③ ReLU
- ④ 배치 크기

<details>
<summary>정답</summary>

②

</details>

**5.** RMSProp의 $$E_t$$는?

- ① 속도
- ② 기울기 제곱의 지수평균
- ③ 손실
- ④ $$\eta$$

<details>
<summary>정답</summary>

②

</details>

**6.** Adam 편향 보정이 필요한 이유?

- ① $$m,v$$가 0에서 시작해 초반이 과소
- ② 소프트맥스
- ③ 배치 고정
- ④ $$g>0$$만

<details>
<summary>정답</summary>

①  
$$t=1,\beta_1=0.9$$면 10배.

</details>

**7.** Adam의 $$v_t$$는?

- ① 모멘텀 속도와 동일
- ② 기울기 제곱의 지수평균
- ③ 가중치 복사
- ④ 학습률

<details>
<summary>정답</summary>

②

</details>

**8.** 이 글 Adam 첫 걸음에서 $$w$$는?

- ① $$0.4$$
- ② $$0.4267$$
- ③ $$0.5$$
- ④ $$0$$

<details>
<summary>정답</summary>

③  
$$\eta\cdot\mathrm{sign}(g)$$.

</details>

**9.** 좁은 골짜기에서 Adam이 SGD보다 나은 이유는?

- ① 손실을 바꿈
- ② $$\sqrt{v}$$로 가파른 축의 걸음을 줄임
- ③ 은닉층을 지움
- ④ 기울기를 안 씀

<details>
<summary>정답</summary>

②

</details>

**10.** 기울기가 0이면 Adam은?

- ① 임의 점프
- ② $$w$$가 그대로
- ③ $$\eta=1$$
- ④ 편향만 증가

<details>
<summary>정답</summary>

②

</details>

## 다음

걸음 규칙을 정해도 가중치가 커지면 학습 표본만 외웁니다.

다음 글은 **정규화**입니다.
