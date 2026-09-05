---
title: 가중치 초기화
date: 2026-09-05 21:00:00 +0900
slug: weight-initialization
permalink: /posts/weight-initialization/
categories: [AI, 딥러닝]
tags: [가중치초기화, Xavier, He, Kaiming, 대칭붕괴, 빅분기, NCS]
math: true
---

학습이 시작되기 전 $$w$$를 어디에 두느냐입니다.  
전부 0이면 뉴런이 같은 신호를 받고, 너무 크면 활성화가 포화합니다.  
층 너비에 맞춰 <span style="color:#c0392b"><strong>분산을 정하는 것</strong></span>이 Xavier와 He입니다.

<blockquote class="prompt-info">
  <p>Weight initialization. 편향은 보통 0. 시그모이드·tanh는 Xavier/Glorot, ReLU는 He/Kaiming. BN이 있어도 초기값이 극단이면 첫 순전파부터 무너집니다.</p>
</blockquote>

## 한 줄 식

한 뉴런의 가중합입니다.

$$
z=\sum_{j=1}^{n_{\mathrm{in}}} w_j x_j + b
$$

- $$n_{\mathrm{in}}$$: 이 뉴런으로 들어오는 입력 수. 앞 층 너비
- $$n_{\mathrm{out}}$$: 이 층에서 나가는 뉴런 수. 다음 층이 받는 폭
- $$w_j$$: 초기화할 가중치
- $$x_j$$: 앞 층 출력. 분산을 $$\mathrm{Var}(x)$$로 둠
- $$b$$: 편향. 보통 $$0$$으로 시작

$$w$$가 서로 독립이고 $$x$$와 독립이면

$$
\mathrm{Var}(z)=n_{\mathrm{in}}\cdot\mathrm{Var}(w)\cdot\mathrm{Var}(x)
$$

층이 깊어져도 $$\mathrm{Var}(z)\approx\mathrm{Var}(x)$$이길 바랍니다.  
그러면

$$
\mathrm{Var}(w)=\frac{1}{n_{\mathrm{in}}}
$$

이 한 줄이 Xavier의 출발점입니다.

## 전부 0이면

$$
w=0,\quad b=0 \Rightarrow z=0 \Rightarrow h=f(0)
$$

모든 뉴런의 출력이 같습니다.  
역전파에서 기울기도 같아, 같은 층 뉴런이 영원히 같은 값으로 움직입니다.

이를 **대칭 붕괴**라고 합니다.  
무작위 초기값은 이 대칭을 깨려고 있습니다. “작은 난수”의 이유가 그것입니다.

편향만 0이고 $$w$$는 난수면 대칭은 깨집니다.  
그래서 $$b=0$$은 괜찮고 $$w=0$$은 안 됩니다.

## 너무 크면

시그모이드를 다시 보면 $$|z|$$가 클 때 미분은 거의 0입니다.

$$
\sigma'(5)\approx 0.007
$$

$$w$$를 $$N(0,1)$$로 두고 $$n_{\mathrm{in}}=100$$이면

$$
\mathrm{Var}(z)=100\cdot 1\cdot\mathrm{Var}(x)
$$

$$x$$ 분산이 1이어도 $$z$$ 분산이 100입니다. 표준편차 10.  
대부분의 $$z$$가 포화 구간입니다. 기울기 소실입니다.

반대로 $$\mathrm{Var}(w)$$가 너무 작으면 $$z\approx 0$$이고, 깊은 층은 신호가 사라집니다.

## Xavier (Glorot)

앞 층·뒤 층 너비를 같이 씁니다.

$$
\mathrm{Var}(w)=\frac{2}{n_{\mathrm{in}}+n_{\mathrm{out}}}
$$

정규분포면

$$
w\sim\mathcal{N}\left(0,\ \frac{2}{n_{\mathrm{in}}+n_{\mathrm{out}}}\right)
$$

균등이면

$$
w\sim U\left(-\sqrt{\frac{6}{n_{\mathrm{in}}+n_{\mathrm{out}}}},\ \sqrt{\frac{6}{n_{\mathrm{in}}+n_{\mathrm{out}}}}\right)
$$

균등 구간은 “분산이 위 식과 같게” 맞춘 값입니다.  
$$U(-a,a)$$의 분산은 $$a^2/3$$이라

$$
\frac{a^2}{3}=\frac{2}{n_{\mathrm{in}}+n_{\mathrm{out}}}
\Rightarrow
a=\sqrt{\frac{6}{n_{\mathrm{in}}+n_{\mathrm{out}}}}
$$

입니다.

가정은 활성화가 **선형에 가깝다**는 것입니다.  
tanh는 0 근처가 거의 직선이라 Xavier와 잘 맞습니다. 시그모이드도 같은 계열로 시험에 묶입니다.

숫자: $$n_{\mathrm{in}}=100$$, $$n_{\mathrm{out}}=100$$.

$$
\mathrm{Var}(w)=\frac{2}{200}=0.01,\qquad
\mathrm{std}(w)=0.1
$$

$$n_{\mathrm{in}}$$만 쓰는 단순판은 $$\mathrm{Var}(w)=1/n_{\mathrm{in}}$$, std 역시 $$0.1$$입니다.

## He (Kaiming)

ReLU는 음수를 0으로 잘라 **대략 절반의 분산을 버립니다.**  
그래서 Xavier보다 분산을 두 배로 둡니다.

$$
\mathrm{Var}(w)=\frac{2}{n_{\mathrm{in}}}
$$

$$
w\sim\mathcal{N}\left(0,\ \frac{2}{n_{\mathrm{in}}}\right)
$$

같은 너비 100이면

$$
\mathrm{std}(w)=\sqrt{\frac{2}{100}}=\sqrt{0.02}\approx 0.141
$$

Xavier의 $$0.1$$보다 큽니다.

검산: $$\mathrm{Var}(x)=1$$, ReLU 전

$$
\mathrm{Var}(z)=n_{\mathrm{in}}\cdot\frac{2}{n_{\mathrm{in}}}\cdot 1=2
$$

ReLU가 절반을 죽이면 출력 분산이 약 1로 돌아옵니다.  
다음 층 입력 스케일이 유지됩니다.

Leaky ReLU는 음수를 완전히 안 죽이므로 계수가 $$2/(1+\alpha^2)$$로 조금 달라집니다.  
기본 시험은 ReLU → He입니다.

## 숫자로 한 층

앞 층 출력 100개가 평균 0, 분산 1이라고 합시다.  
이 층 뉴런 하나의 $$z=\sum w_j x_j$$.

**Xavier** $$\mathrm{std}=0.1$$

$$
\mathrm{Var}(z)=100\times 0.01\times 1=1
$$

$$z$$의 표준편차가 1입니다. tanh가 쓰는 구간에 들어옵니다.

**He** $$\mathrm{std}\approx 0.141$$

$$
\mathrm{Var}(z)=100\times 0.02\times 1=2
$$

ReLU 이후 약 1로 줄어들게 설계한 값입니다.

**나쁜 예** $$\mathrm{std}=1$$

$$
\mathrm{Var}(z)=100
$$

표준편차 10. 시그모이드는 거의 0 또는 1, ReLU는 양수 폭주입니다.

## 표로 정리

| 초기화 | 분산 | 잘 맞는 활성화 |
|---|---|---|
| 전부 0 | 0 | 없음. 대칭 붕괴 |
| 너무 큰 난수 | $$1$$ 등 | 포화·폭주 |
| Xavier | $$2/(n_{\mathrm{in}}+n_{\mathrm{out}})$$ | tanh, 시그모이드 |
| He | $$2/n_{\mathrm{in}}$$ | ReLU, Leaky ReLU |

편향은 0.  
출력층도 같은 규칙을 쓰되, 소프트맥스 앞은 값이 크지 않게 He/Xavier를 그대로 두는 편이 보통입니다.

## BN과의 관계

배치 정규화는 층 입력 스케일을 학습 중에 다시 맞춥니다.  
그래도 첫 순전파의 $$z$$가 이미 $$10^6$$이면 초반이 망가집니다.

BN이 있어도 He/Xavier를 씁니다.  
BN이 초기값을 **덜 민감하게** 만들 뿐, 대체하지는 않습니다.

## 잘 놓치는 핵심

### 1. 작은 난수 ≠ 아무 분산

$$N(0,0.01)$$을 층 너비와 무관하게 쓰면, $$n_{\mathrm{in}}=10$$일 때와 $$1000$$일 때 $$z$$ 분산이 100배 다릅니다.  
핵심은 분산을 $$n_{\mathrm{in}}$$에 묶는 것입니다.

### 2. Xavier를 ReLU에 그대로 쓰면 신호가 약해질 수 있다

ReLU가 분산을 반으로 줄이는데 Xavier는 그 반을 안 보정합니다.  
깊은 ReLU 망은 He가 기본입니다.

### 3. 균등과 정규는 분산만 맞으면 같은 가족

시험에 “Xavier = 정규분포만”이라고 단정하면 틀립니다. 균등 Xavier도 있습니다.

### 4. $$n_{\mathrm{in}}$$은 지금 층으로 들어오는 연결 수

완전연결이면 앞 층 뉴런 수입니다.  
합성곱이면 커널 높이×너비×입력 채널입니다.

### 5. 초기화는 한 번

학습이 시작된 뒤의 $$w$$는 경사하강이 바꿉니다.  
에폭마다 He로 리셋하지 않습니다.

## 시험·면접

<blockquote class="prompt-info">
  <p>단골: 0 초기화는 대칭 붕괴, Xavier $$2/(n_{\mathrm{in}}+n_{\mathrm{out}})$$, He $$2/n_{\mathrm{in}}$$, ReLU→He, tanh→Xavier, 편향 0, $$\mathrm{Var}(z)=n_{\mathrm{in}}\mathrm{Var}(w)\mathrm{Var}(x)$$.</p>
</blockquote>

전공자 체크:

- 균등 Xavier 구간 $$\sqrt{6/(n_{\mathrm{in}}+n_{\mathrm{out}})}$$
- 합성곱 fan-in = $$k_h k_w c_{\mathrm{in}}$$
- BN은 초기화를 대체하지 않음

## 객관식 10문제

**1.** 가중치를 모두 0으로 두면?

- ① 최적해
- ② 같은 층 뉴런이 같은 기울기를 받아 대칭 붕괴
- ③ 드롭아웃과 같음
- ④ 학습률이 1

<details>
<summary>정답</summary>

②

</details>

**2.** 편향 초기값의 기본은?

- ① $$1$$
- ② $$n_{\mathrm{in}}$$
- ③ $$0$$
- ④ $$\gamma$$

<details>
<summary>정답</summary>

③

</details>

**3.** Xavier 분산은?

- ① $$2/n_{\mathrm{in}}$$
- ② $$2/(n_{\mathrm{in}}+n_{\mathrm{out}})$$
- ③ $$n_{\mathrm{in}}$$
- ④ $$0$$

<details>
<summary>정답</summary>

②  
단순판 $$1/n_{\mathrm{in}}$$도 같은 가족.

</details>

**4.** He 초기화가 ReLU에 맞는 이유는?

- ① 소프트맥스가 필요해서
- ② 음수를 버려 분산이 줄어, 보정으로 분산을 두 배로 둠
- ③ 편향을 크게 하려고
- ④ 학습률을 0으로

<details>
<summary>정답</summary>

②

</details>

**5.** $$n_{\mathrm{in}}=100$$일 때 He의 표준편차는?

- ① $$0.1$$
- ② $$\sqrt{0.02}\approx 0.141$$
- ③ $$2$$
- ④ $$100$$

<details>
<summary>정답</summary>

②  
$$\sqrt{2/100}$$.

</details>

**6.** $$n_{\mathrm{in}}=100$$, $$\mathrm{Var}(w)=\mathrm{Var}(x)=1$$이면 $$\mathrm{Var}(z)$$는?

- ① $$1$$
- ② $$10$$
- ③ $$100$$
- ④ $$0$$

<details>
<summary>정답</summary>

③  
$$n_{\mathrm{in}}\cdot 1\cdot 1=100$$. 포화 위험.

</details>

**7.** tanh 은닉의 기본 초기화는?

- ① He만
- ② Xavier
- ③ 전부 1
- ④ 드롭아웃

<details>
<summary>정답</summary>

②

</details>

**8.** Xavier 균등 구간이 $$\sqrt{6/(n_{\mathrm{in}}+n_{\mathrm{out}})}$$인 이유는?

- ① 학습률 공식
- ② $$U(-a,a)$$ 분산 $$a^2/3$$을 Xavier 분산과 맞추려고
- ③ ReLU 미분
- ④ 배치 크기

<details>
<summary>정답</summary>

②

</details>

**9.** BN이 있으면 초기화가 필요 없나?

- ① 필요 없다
- ② 초반 순전파를 위해 여전히 He/Xavier를 씀
- ③ 가중치를 매일 0으로
- ④ 편향만 100

<details>
<summary>정답</summary>

②

</details>

**10.** 합성곱에서 $$n_{\mathrm{in}}$$에 해당하는 것은?

- ① 이미지 장 수
- ② 커널 높이×너비×입력 채널
- ③ 에폭
- ④ 클래스 수

<details>
<summary>정답</summary>

②  
fan-in.

</details>

## 다음

기본 뼈대는 여기까지입니다.  
가중합·활성화·손실·순전파·역전파·걸음·정규화·초기값입니다.

다음부터는 아키텍처입니다. 첫 글은 **CNN**입니다. 가중치를 모든 위치에 공유하는 필터가 왜 이미지에 맞는지부터 갑니다.
