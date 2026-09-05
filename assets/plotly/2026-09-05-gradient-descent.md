---
title: 경사하강법
date: 2026-09-05 17:00:00 +0900
slug: gradient-descent
permalink: /posts/gradient-descent/
categories: [AI, 딥러닝]
tags: [경사하강법, 학습률, SGD, 역전파, 빅분기, NCS]
math: true
---

역전파가 준 기울기의 **반대 방향**으로 파라미터를 옮깁니다.  
기울기는 “지금 자리에서 손실이 가장 빨리 커지는 방향”입니다. 그래서 그 반대로 가야 손실이 줄어듭니다.

<blockquote class="prompt-info">
  <p>Gradient descent. $$w \leftarrow w-\eta\,\partial L/\partial w$$. 배치·미니배치·SGD는 한 번에 몇 표본의 기울기를 쓰느냐의 차이입니다. 차트는 <code>https://jyjnote.github.io/assets/plotly/gradient-descent-charts.html</code> 입니다.</p>
</blockquote>

## 한 줄 식

$$
w \leftarrow w - \eta \frac{\partial L}{\partial w}
$$

$$
b \leftarrow b - \eta \frac{\partial L}{\partial b}
$$

- $$w$$: 지금 가중치
- $$\partial L/\partial w$$: 손실이 $$w$$에 대해 얼마나 민감한지. 앞 글 역전파의 결과
- $$\eta$$: 학습률. 한 걸음의 길이. 예: $$0.1$$, $$0.01$$
- 빼는 이유: 기울기 부호 쪽이 오르막
- $$b$$: 편향. 같은 규칙

벡터로 쓰면

$$
\mathbf{w} \leftarrow \mathbf{w} - \eta\,\nabla_{\mathbf{w}} L
$$

$$\nabla_{\mathbf{w}} L$$은 각 파라미터 기울기를 모아 둔 벡터입니다.

[차트 새 탭]({{ '/assets/plotly/gradient-descent-charts.html' | relative_url }}#bowl)

<iframe src="{{ '/assets/plotly/gradient-descent-charts.html' | relative_url }}#bowl" title="경사하강 3D" width="100%" height="760" style="border:0;border-radius:12px;background:#f7f9fb" loading="lazy"></iframe>

탭 **1. 적당한 η**에서 재생을 누르세요.  
빨간 점이 곡면을 따라 초록 최솟값 $$(1,1)$$로 내려갑니다.

## 왜 빼는가

한 변수만 보겠습니다. $$L(w)=w^2$$이면 최솟값은 $$w=0$$입니다.

$$
\frac{dL}{dw}=2w
$$

지금 $$w=3$$이면 기울기 $$6>0$$입니다. $$w$$를 키우면 손실이 커집니다.  
빼면

$$
w\leftarrow 3-\eta\cdot 6
$$

$$w$$가 작아져 $$0$$ 쪽으로 갑니다.

$$w=-2$$이면 기울기 $$-4<0$$입니다. 빼면

$$
w\leftarrow -2-\eta\cdot(-4)=-2+4\eta
$$

$$w$$가 커져 역시 $$0$$ 쪽으로 갑니다.

<mark>부호를 직접 외울 필요 없이, 항상 기울기를 뺍니다.</mark>

## 앞 글 숫자로 한 걸음

역전파에서 출력층 일부만 가져옵니다.

$$
w^{(2)}_1=0.4,\qquad
\frac{\partial L}{\partial w^{(2)}_1}\approx -0.267
$$

$$
b^{(2)}=0.1,\qquad
\frac{\partial L}{\partial b^{(2)}}=-0.411
$$

학습률 $$\eta=0.1$$.

$$
w^{(2)}_1
\leftarrow
0.4-0.1\cdot(-0.267)
=0.4+0.0267
=0.4267
$$

$$
b^{(2)}
\leftarrow
0.1-0.1\cdot(-0.411)
=0.1+0.0411
=0.1411
$$

기울기가 음수면 빼기가 더하기가 됩니다.  
앞 글에서 $$\hat{y}=0.589<1$$이라 합격 쪽 점수를 올려야 했고, 가중치가 실제로 커집니다.

은닉 뉴런 2는 기울기가 전부 0이었습니다.  
한 걸음을 옮겨도 그 파라미터는 그대로입니다.

$$
w^{(1)}_{21}\leftarrow w^{(1)}_{21}- \eta\cdot 0=w^{(1)}_{21}
$$

## 학습률

$$\eta$$가 작으면 한 걸음이 짧습니다. 오래 걸리지만 바닥 근처에서 덜 흔들립니다.  
$$\eta$$가 크면 바닥을 지나칩니다. 심하면 손실이 커집니다.

같은 그릇 $$L=(w_1-1)^2+(w_2-1)^2$$에서

- $$\eta=0.15$$: 최솟값으로 붙음
- $$\eta=1.05$$: 반대편으로 튕김

[차트 새 탭]({{ '/assets/plotly/gradient-descent-charts.html' | relative_url }}#large)

<iframe src="{{ '/assets/plotly/gradient-descent-charts.html' | relative_url }}#large" title="학습률이 클 때" width="100%" height="760" style="border:0;border-radius:12px;background:#f7f9fb" loading="lazy"></iframe>

탭 **2. 큰 η**를 재생해 보세요.  
출발점은 탭 1과 같습니다. 걸음 길이만 바꿨습니다.

고정 $$\eta$$만 쓰는 방법이 기본 경사하강입니다.  
나중에 나오는 Adam·모멘텀은 걸음 길이를 파라미터마다, 시각마다 바꿉니다.

## 방향마다 가파르기가 다르면

$$
L=(w_1-1)^2+8(w_2-1)^2
$$

$$w_2$$ 쪽으로 곡면이 8배 급합니다. 기울기도

$$
\frac{\partial L}{\partial w_1}=2(w_1-1),\qquad
\frac{\partial L}{\partial w_2}=16(w_2-1)
$$

같은 $$\eta$$를 쓰면 $$w_2$$는 과하게 움직이고 $$w_1$$은 더딥니다.  
골짜기를 가로질러 진동하는 그림이 나옵니다.

[차트 새 탭]({{ '/assets/plotly/gradient-descent-charts.html' | relative_url }}#valley)

<iframe src="{{ '/assets/plotly/gradient-descent-charts.html' | relative_url }}#valley" title="좁은 골짜기" width="100%" height="760" style="border:0;border-radius:12px;background:#f7f9fb" loading="lazy"></iframe>

스케일을 맞추거나(입력 표준화), 적응 학습률을 쓰는 이유가 여기 있습니다.

## 배치 · 미니배치 · SGD

표본이 $$N$$개일 때 평균 손실

$$
J=\frac{1}{N}\sum_{i=1}^{N} L_i
$$

**배치 경사하강**은 매 걸음에 전체 $$N$$개의 기울기를 평균합니다.  
방향이 안정적이지만, $$N$$이 크면 한 걸음이 비쌉니다.

**SGD**는 표본 하나를 무작위로 뽑아

$$
w\leftarrow w-\eta\,\frac{\partial L_i}{\partial w}
$$

한 걸음이 싸지만 방향이 흔들립니다.  
그 흔들림이 얕은 바닥을 빠져나가는 데 도움이 되기도 합니다.

**미니배치**는 $$B$$개만 평균합니다. $$B=32$$, $$64$$가 흔합니다.

$$
w\leftarrow w-\eta\cdot\frac{1}{B}\sum_{i\in\mathcal{B}}\frac{\partial L_i}{\partial w}
$$

- $$B$$: 배치 크기
- $$\mathcal{B}$$: 이번에 뽑힌 표본 집합

실무 기본값은 미니배치입니다.  
에폭 한 번은 학습 데이터를 한 바퀴 도는 것입니다.

## 지역 최소와 안장점

딥러닝 손실은 $$w^2$$처럼 그릇 하나가 아닙니다.  
움푹한 곳이 여러 개이면 가까운 웅덩이에 멈출 수 있습니다. 지역 최소입니다.

안장점은 한 방향으로는 골짜기, 다른 방향으로는 마루인 지점입니다. 기울기는 0에 가깝지만 바닥이 아닙니다.

시험 포인트:

- 볼록(convex)이면 지역 최소 = 전역 최소. 선형회귀 MSE가 이쪽
- 신경망은 비볼록. 전역 최소 보장이 없음
- 그래도 경사하강은 실무에서 잘 동작하는 경우가 많음. 보장이 아니라 경험

## 잘 놓치는 핵심

### 1. 기울기 방향으로 가면 오르막

플러스가 아닙니다. 반드시 뺍니다.

### 2. $$\eta$$의 단위는 “얼마만큼”

기울기가 $$-0.267$$이어도 $$\eta=0.001$$이면 한 걸음은 $$0.000267$$입니다.  
기울기 크기와 학습률을 따로 봅니다.

### 3. 기울기 0 = 학습 끝은 아님

평지·안장·죽은 ReLU에서도 기울기가 0입니다.  
손실이 큰데 기울기만 0이면 학습이 멈춘 것이지 성공이 아닙니다.

### 4. 순전파 → 역전파 → 갱신

한 스텝의 순서입니다.  
갱신 후 다시 순전파를 해야 새 $$L$$이 나옵니다.

### 5. 손실이 항상 단조 감소하지는 않음

SGD는 표본마다 방향이 달라 손실이 들쭉날쭉합니다.  
추세가 내려가면 됩니다.

## 시험·면접

<blockquote class="prompt-info">
  <p>단골: $$w\leftarrow w-\eta\nabla L$$, 왜 빼는지, η가 크면 발산, 배치/SGD/미니배치, 에폭, 볼록과 비볼록, 기울기 0이 항상 최솟값은 아님.</p>
</blockquote>

전공자 체크:

- 배치 평균을 쓰면 $$J$$의 스케일이 $$N$$에 덜 묶임
- 좁은 골짜기는 같은 η로도 축마다 걸음이 다름
- 다음 단계가 모멘텀·Adam 같은 최적화기

## 객관식 10문제

**1.** 경사하강 갱신식은?

- ① $$w\leftarrow w+\eta\,\partial L/\partial w$$
- ② $$w\leftarrow w-\eta\,\partial L/\partial w$$
- ③ $$w\leftarrow \eta$$
- ④ $$w\leftarrow \partial L/\partial w$$

<details>
<summary>정답</summary>

②  
오르막의 반대.

</details>

**2.** 이 글에서 $$w^{(2)}_1=0.4$$, 기울기 $$-0.267$$, $$\eta=0.1$$이면 새 값은?

- ① $$0.373$$
- ② $$0.4267$$
- ③ $$0.4$$
- ④ $$-0.0267$$

<details>
<summary>정답</summary>

②  
$$0.4-0.1\cdot(-0.267)=0.4267$$.

</details>

**3.** 학습률이 너무 크면?

- ① 항상 더 정확
- ② 최솟값을 지나쳐 진동·발산할 수 있음
- ③ 파라미터가 사라짐
- ④ 순전파가 필요 없음

<details>
<summary>정답</summary>

②  
차트 탭 2.

</details>

**4.** SGD가 배치 경사하강과 다른 점은?

- ① 활성화가 ReLU로 고정
- ② 한 걸음에 표본 하나의 기울기를 씀
- ③ 편향을 안 씀
- ④ 손실이 항상 0

<details>
<summary>정답</summary>

②  
미니배치는 그 중간.

</details>

**5.** 에폭의 의미는?

- ① 학습률
- ② 은닉 뉴런 수
- ③ 학습 데이터를 한 바퀴 돈 것
- ④ 클래스 수

<details>
<summary>정답</summary>

③  
배치 수 ≈ $$N/B$$ 스텝이 에폭 하나.

</details>

**6.** 기울기가 0이면?

- ① 반드시 전역 최소
- ② 평지·안장·지역 최소일 수 있음
- ③ 학습률이 1
- ④ 데이터가 없음

<details>
<summary>정답</summary>

②  
정지 조건이지 성공 조건이 아님.

</details>

**7.** 선형회귀 MSE가 다루기 쉬운 이유에 가까운 것은?

- ① 비볼록이라서
- ② 볼록이라 지역 최소가 전역 최소
- ③ ReLU가 필요해서
- ④ SGD를 못 써서

<details>
<summary>정답</summary>

②  
신경망 손실은 비볼록.

</details>

**8.** 좁은 골짜기에서 같은 $$\eta$$가 문제인 이유?

- ① 입력이 두 개라서
- ② 축마다 곡률이 달라 한쪽은 진동, 한쪽은 서행
- ③ 편향이 음수라서
- ④ 소프트맥스가 필요해서

<details>
<summary>정답</summary>

②  
차트 탭 3.

</details>

**9.** 한 학습 스텝의 순서는?

- ① 갱신 → 순전파 → 역전파
- ② 순전파 → 역전파 → 갱신
- ③ 역전파만
- ④ 갱신만

<details>
<summary>정답</summary>

②  
$$L$$을 구한 뒤 기울기를 구하고 빼는 순서.

</details>

**10.** 기울기가 음수이면 그 파라미터는?

- ① 반드시 감소
- ② $$w\leftarrow w-\eta\cdot(\text{음수})$$라 증가
- ③ 0이 됨
- ④ 학습률이 음수

<details>
<summary>정답</summary>

②  
이 글의 $$w^{(2)}_1$$이 그 경우.

</details>

## 다음

같은 빼기라도, 이전 걸음의 속도를 남기거나 파라미터마다 $$\eta$$를 바꾸면 골짜기에서 덜 흔들립니다.

다음 글은 **최적화기**입니다. 모멘텀, AdaGrad, RMSProp, Adam을 숫자로 비교합니다.
