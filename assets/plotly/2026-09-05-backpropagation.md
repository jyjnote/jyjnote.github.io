---
title: 역전파
date: 2026-09-05 16:00:00 +0900
slug: backpropagation
permalink: /posts/backpropagation/
categories: [AI, 딥러닝]
tags: [역전파, 연쇄법칙, 기울기, MLP, 빅분기, NCS]
math: true
---

손실 $$L$$을 각 가중치·편향으로 미분하는 계산입니다.  
순전파가 앞에서 뒤로 $$\hat{y}$$를 만들었다면, 역전파는 <span style="color:#c0392b"><strong>뒤에서 앞으로 기울기를 보냅니다.</strong></span>

<blockquote class="prompt-info">
  <p>Backpropagation. 연쇄법칙으로 $$\partial L/\partial W$$, $$\partial L/\partial b$$를 구합니다. 이 글은 앞 글 순전파의 숫자 그대로입니다. 가중치를 빼는 단계는 다음 글 경사하강법입니다.</p>
</blockquote>

## 한 줄 식

합성함수의 미분입니다.

$$
\frac{\partial L}{\partial w}
=
\frac{\partial L}{\partial \hat{y}}
\cdot
\frac{\partial \hat{y}}{\partial z}
\cdot
\frac{\partial z}{\partial w}
$$

- $$L$$: 한 표본 손실
- $$\hat{y}$$: 예측
- $$z$$: 그 가중치가 들어간 가중합
- $$w$$: 지금 미분하는 가중치
- 각 조각은 “바로 옆 변수에 대한 미분”
- 전체를 곱하면 “손실이 그 가중치에 얼마나 민감한지”

층이 두 개면 은닉 쪽은 조각이 더 깁니다.

$$
\frac{\partial L}{\partial W^{(1)}}
=
\frac{\partial L}{\partial z^{(2)}}
\cdot
\frac{\partial z^{(2)}}{\partial h}
\cdot
\frac{\partial h}{\partial z^{(1)}}
\cdot
\frac{\partial z^{(1)}}{\partial W^{(1)}}
$$

시험에 나오는 역전파는 이 곱을 층마다 나눠 계산하는 방법입니다.

## 앞 글에서 가져오는 값

$$
\mathbf{x}=\begin{pmatrix}1\\ 0.5\end{pmatrix},\qquad y=1
$$

$$
z^{(1)}_1=0.65,\quad z^{(1)}_2=-0.1
$$

$$
h_1=0.65,\quad h_2=0
$$

$$
z^{(2)}=0.36,\qquad \hat{y}=0.589,\qquad L\approx 0.529
$$

$$
W^{(2)}=(0.4,\ 1.2),\qquad b^{(2)}=0.1
$$

은닉은 ReLU, 출력은 시그모이드, 손실은 이진 교차엔트로피입니다.

## 출력층 기울기

$$y=1$$이면

$$
L=-\log\hat{y}=-\log\sigma(z^{(2)})
$$

조각 두 개:

$$
\frac{\partial L}{\partial\hat{y}}=-\frac{1}{\hat{y}}
$$

$$
\frac{\partial\hat{y}}{\partial z^{(2)}}=\hat{y}(1-\hat{y})
$$

곱하면

$$
\frac{\partial L}{\partial z^{(2)}}
=
\left(-\frac{1}{\hat{y}}\right)\cdot\hat{y}(1-\hat{y})
=
-(1-\hat{y})
=
\hat{y}-1
$$

숫자:

$$
\frac{\partial L}{\partial z^{(2)}}=0.589-1=-0.411
$$

<span style="color:#c0392b"><strong>시그모이드 + 이진 교차엔트로피의 로짓 기울기는 $$\hat{y}-y$$</strong></span>입니다.  
$$y=1$$이면 $$\hat{y}-1$$, $$y=0$$이면 $$\hat{y}-0=\hat{y}$$입니다.

이 값이 뒤에서 오는 오차 신호입니다. 기호로

$$
\delta^{(2)}=\frac{\partial L}{\partial z^{(2)}}=-0.411
$$

이라고 두겠습니다.

출력 가중치:

$$
z^{(2)}=w^{(2)}_1 h_1 + w^{(2)}_2 h_2 + b^{(2)}
$$

$$
\frac{\partial z^{(2)}}{\partial w^{(2)}_1}=h_1=0.65
$$

$$
\frac{\partial L}{\partial w^{(2)}_1}=\delta^{(2)}\,h_1=(-0.411)\cdot 0.65\approx -0.267
$$

$$
\frac{\partial L}{\partial w^{(2)}_2}=\delta^{(2)}\,h_2=(-0.411)\cdot 0=0
$$

$$
\frac{\partial L}{\partial b^{(2)}}=\delta^{(2)}=-0.411
$$

$$h_2=0$$이라 $$w^{(2)}_2$$의 기울기는 0입니다.  
이번 표본에서는 그 가중치를 움직일 신호가 없습니다.

벡터로 쓰면

$$
\frac{\partial L}{\partial W^{(2)}}=\delta^{(2)}\,\mathbf{h}^\top
$$

$$
\frac{\partial L}{\partial b^{(2)}}=\delta^{(2)}
$$

## 은닉층으로 오차를 보냄

$$z^{(2)}$$는 은닉 출력 $$h$$의 가중합입니다.

$$
\frac{\partial z^{(2)}}{\partial h_1}=w^{(2)}_1=0.4
$$

$$
\frac{\partial z^{(2)}}{\partial h_2}=w^{(2)}_2=1.2
$$

$$
\frac{\partial L}{\partial h_1}=\delta^{(2)}\cdot 0.4=(-0.411)\cdot 0.4\approx -0.164
$$

$$
\frac{\partial L}{\partial h_2}=\delta^{(2)}\cdot 1.2=(-0.411)\cdot 1.2\approx -0.493
$$

아직 $$z^{(1)}$$에 대한 기울기가 아닙니다.  
ReLU 미분을 한 번 더 곱합니다.

$$
\mathrm{ReLU}'(z)=
\begin{cases}
1 & z>0 \\
0 & z<0
\end{cases}
$$

$$
\frac{\partial L}{\partial z^{(1)}_1}
=
\frac{\partial L}{\partial h_1}\cdot 1
\approx -0.164
$$

$$
\frac{\partial L}{\partial z^{(1)}_2}
=
\frac{\partial L}{\partial h_2}\cdot 0
=0
$$

$$z^{(1)}_2=-0.1<0$$이라 미분이 0입니다.  
은닉 뉴런 2로 들어온 오차 $$-0.493$$은 여기서 끊깁니다.

<mark>dying ReLU는 순전파에서 $$h=0$$일 뿐 아니라, 역전파에서도 기울기가 0입니다.</mark>

$$
\delta^{(1)}_1\approx -0.164,\qquad \delta^{(1)}_2=0
$$

## 은닉 가중치

$$
z^{(1)}_1=w^{(1)}_{11}x_1+w^{(1)}_{12}x_2+b^{(1)}_1
$$

$$
\frac{\partial L}{\partial w^{(1)}_{11}}=\delta^{(1)}_1 x_1\approx(-0.164)\cdot 1=-0.164
$$

$$
\frac{\partial L}{\partial w^{(1)}_{12}}=\delta^{(1)}_1 x_2\approx(-0.164)\cdot 0.5=-0.082
$$

$$
\frac{\partial L}{\partial b^{(1)}_1}=\delta^{(1)}_1\approx -0.164
$$

뉴런 2는 $$\delta^{(1)}_2=0$$이라

$$
\frac{\partial L}{\partial w^{(1)}_{21}}=0,\quad
\frac{\partial L}{\partial w^{(1)}_{22}}=0,\quad
\frac{\partial L}{\partial b^{(1)}_2}=0
$$

행렬로:

$$
\frac{\partial L}{\partial W^{(1)}}=\delta^{(1)}\,\mathbf{x}^\top
$$

$$
\frac{\partial L}{\partial\mathbf{b}^{(1)}}=\delta^{(1)}
$$

검산 표입니다.

| 파라미터 | 기울기 | 의미 |
|---|---|---|
| $$w^{(2)}_1$$ | $$-0.267$$ | $$h_1=0.65$$가 출력에 기여 |
| $$w^{(2)}_2$$ | $$0$$ | $$h_2=0$$이라 신호 없음 |
| $$b^{(2)}$$ | $$-0.411$$ | $$\delta^{(2)}$$ 그 자체 |
| $$w^{(1)}_{11}$$ | $$-0.164$$ | 은닉 1, 입력 $$x_1=1$$ |
| $$w^{(1)}_{12}$$ | $$-0.082$$ | 은닉 1, 입력 $$x_2=0.5$$ |
| $$b^{(1)}_1$$ | $$-0.164$$ | 은닉 1 편향 |
| 뉴런 2 전부 | $$0$$ | ReLU가 닫힘 |

기울기가 음수면, 다음 글에서 $$w\leftarrow w-\eta\cdot(\text{기울기})$$를 할 때 가중치는 **커집니다**.  
지금은 $$\hat{y}=0.589<1$$이라 합격 쪽 점수를 올려야 하므로 방향이 맞습니다.

## 일반 패턴

층 $$\ell$$에서

$$
\delta^{(\ell)}=\frac{\partial L}{\partial z^{(\ell)}}
$$

한 층 앞의 오차는

$$
\delta^{(\ell)}
=
\big(W^{(\ell+1)}\big)^\top\delta^{(\ell+1)}
\ \odot\
f'\big(z^{(\ell)}\big)
$$

- $$(W^{(\ell+1)})^\top\delta^{(\ell+1)}$$: 뒤 층이 보내는 오차를 이 층 뉴런에 배분
- $$\odot$$: 원소별 곱
- $$f'(z^{(\ell)})$$: 이 층 활성화의 미분. ReLU면 0 또는 1

가중치:

$$
\frac{\partial L}{\partial W^{(\ell)}}=\delta^{(\ell)}\,(a^{(\ell-1)})^\top
$$

$$a^{(0)}=\mathbf{x}$$입니다.  
“오차 × 이 층으로 들어온 입력”이 가중치 기울기입니다.

단층 퍼셉트론 규칙 $$w\leftarrow w+\eta(y-\hat{y})x$$와 모양이 닮았습니다.  
다른 점은 은닉에 정답이 없어서, $$\delta$$를 출력에서 내려 준다는 것입니다.

## 소프트맥스 + 교차엔트로피

다중 분류면 출력 로짓에 대해

$$
\frac{\partial L}{\partial z_i}=\hat{y}_i-y_i
$$

이진의 $$\hat{y}-y$$와 같은 형태입니다.  
그래서 출력 활성화와 손실을 짝 맞춥니다. 앞 글에서 말한 이유입니다.

MSE + 시그모이드는

$$
\frac{\partial L}{\partial z}=(\hat{y}-y)\cdot\hat{y}(1-\hat{y})
$$

끝단에 $$\hat{y}\approx 0$$ 또는 $$1$$이면 뒤의 곱이 0에 가깝습니다.  
틀려도 기울기가 사라질 수 있습니다.

## 잘 놓치는 핵심

### 1. 역전파는 가중치를 빼지 않는다

여기서 구하는 것은 $$\partial L/\partial w$$입니다.  
빼는 식 $$w\leftarrow w-\eta\,\partial L/\partial w$$는 경사하강입니다.

### 2. $$\delta$$는 “정답 − 예측”이 아니다

출력에서만 $$\hat{y}-y$$이고, 은닉 $$\delta$$는 뒤 가중치와 활성 미분을 곱한 값입니다.

### 3. 0을 곱하면 그 아래가 전부 0

ReLU가 닫히거나 시그모이드가 포화되면 앞 층 기울기가 끊깁니다.  
기울기 소실·dying ReLU의 정체입니다.

### 4. 편향 기울기에는 $$x$$를 곱하지 않는다

$$z=\cdots+b$$라 $$\partial z/\partial b=1$$입니다.  
$$\partial L/\partial b=\delta$$입니다.

### 5. 배치면 표본 기울기를 더하거나 평균

표본마다 순전파·역전파를 하고, $$\partial L/\partial W$$를 평균한 뒤 한 번 갱신합니다.  
그 평균이 미니배치 경사하강입니다.

## 시험·면접

<blockquote class="prompt-info">
  <p>단골: 연쇄법칙, 시그모이드+BCE에서 $$\partial L/\partial z=\hat{y}-y$$, $$\partial L/\partial W=\delta a^{\top}$$, 은닉은 $$W^\top\delta \odot f'(z)$$, ReLU 음수면 기울기 0, 역전파≠파라미터 갱신.</p>
</blockquote>

전공자 체크:

- 계산 그래프를 순방향으로 평가하고, 역방향으로 지역 미분을 곱함
- 시간 복잡도는 순전파와 같은 급. 층을 한 번 더 지나가는 수준
- 수치 미분으로 기울기를 검사할 수 있음(gradient check). 구현 검증용

## 객관식 10문제

**1.** 역전파가 구하는 것은?

- ① 새 입력 $$x$$
- ② $$\partial L/\partial W$$, $$\partial L/\partial b$$
- ③ 은닉 뉴런 수
- ④ 학습률 $$\eta$$

<details>
<summary>정답</summary>

②  
갱신 식에 넣을 기울기입니다.

</details>

**2.** 시그모이드 + 이진 교차엔트로피에서 $$\partial L/\partial z^{(2)}$$는?

- ① $$\hat{y}(1-\hat{y})$$
- ② $$\hat{y}-y$$
- ③ $$-\log\hat{y}$$
- ④ $$x$$

<details>
<summary>정답</summary>

②  
이 글 숫자로는 $$0.589-1=-0.411$$.

</details>

**3.** $$\partial L/\partial w^{(2)}_1=\delta^{(2)}h_1$$에서 $$h_1$$이 필요한 이유?

- ① 정규화
- ② $$z^{(2)}$$가 $$w^{(2)}_1 h_1$$을 포함해서
- ③ 학습률
- ④ 클래스 수

<details>
<summary>정답</summary>

②  
$$\partial z/\partial w=h$$. 들어온 입력을 곱함.

</details>

**4.** 이 글에서 $$\partial L/\partial w^{(2)}_2=0$$인 이유는?

- ① 학습률이 0
- ② $$h_2=0$$
- ③ $$y=0$$
- ④ 편향이 없음

<details>
<summary>정답</summary>

②  
$$(-0.411)\times 0=0$$.

</details>

**5.** 은닉 뉴런 2의 $$\delta^{(1)}_2=0$$인 이유는?

- ① $$W^{(2)}$$가 0
- ② ReLU 미분 $$f'(z^{(1)}_2)=0$$
- ③ $$x_2=0$$
- ④ 손실이 0

<details>
<summary>정답</summary>

②  
$$z^{(1)}_2=-0.1<0$$.

</details>

**6.** 편향 기울기 $$\partial L/\partial b$$는?

- ① $$\delta\cdot x$$
- ② $$\delta$$
- ③ $$0$$
- ④ $$\eta$$

<details>
<summary>정답</summary>

②  
$$\partial z/\partial b=1$$.

</details>

**7.** 역전파와 경사하강의 관계는?

- ① 같은 계산
- ② 역전파가 기울기, 경사하강이 $$w\leftarrow w-\eta\,\partial L/\partial w$$
- ③ 경사하강이 먼저 $$w$$를 바꾸고 역전파함
- ④ 둘 다 순전파

<details>
<summary>정답</summary>

②  
역할을 섞어 적으면 감점.

</details>

**8.** 은닉으로 오차를 보낼 때 $$W^{(2)}$$를 곱하는 이유는?

- ① 입력 크기를 맞춤
- ② 출력 오차가 은닉 출력을 통과한 가중치 경로를 따라감
- ③ 소프트맥스가 필요
- ④ 편향을 제거

<details>
<summary>정답</summary>

②  
$$z^{(2)}=W^{(2)}h+b^{(2)}$$이므로 $$\partial z^{(2)}/\partial h=W^{(2)}$$.

</details>

**9.** MSE + 시그모이드가 끝단에서 약한 이유?

- ① 클래스 수가 2라서
- ② $$(\hat{y}-y)\hat{y}(1-\hat{y})$$에서 $$\hat{y}(1-\hat{y})\approx 0$$
- ③ 편향이 없어서
- ④ ReLU가 없어서

<details>
<summary>정답</summary>

②  
교차엔트로피 짝은 이 인자가 약분됩니다.

</details>

**10.** 연쇄법칙이 필요한 이유?

- ① $$L$$이 $$w$$의 직접 식이 아니라 $$\hat{y}$$, $$z$$, $$h$$를 거쳐서
- ② 입력이 두 개라서
- ③ 학습률이 분수라서
- ④ 배치 크기가 1이라서

<details>
<summary>정답</summary>

①  
중간 변수를 하나씩 미분한 뒤 곱합니다.

</details>

## 다음

기울기 부호와 크기가 나왔습니다.  
이제 얼마만큼, 어느 규칙으로 $$w$$에서 뺄지가 남았습니다.

다음 글은 **경사하강법**입니다.  
이 글의 $$-0.267,\ -0.411,\ -0.164$$를 학습률과 곱해 한 걸음 옮깁니다.
