---
title: SVM 파이널 모의고사
date: 2026-10-03 18:20:00 +0900
slug: svm-final-mock-exam
permalink: /posts/svm-final-mock-exam/
categories: [AI, 머신러닝]
tags: [SVM, LinearSVM, SoftMargin, Kernel, RBF, SVR, OneClassSVM, 모의고사]
math: true
---

선형 SVM부터 커널, SVR, One-Class SVM까지 전체 범위를 한 번에 점검하는 파이널 모의고사입니다.

<blockquote class="prompt-info">
<p>범위: 결정경계 · 마진 · C · 슬랙 · 힌지 손실 · 서포트 벡터 · 커널 · γ · ε · ν</p>
</blockquote>

<details>
<summary>풀이 방법</summary>

먼저 정답을 가리고 풀고, 각 문제 아래의 정답 및 해설을 펼쳐 확인합니다.

</details>

## 문제 1

선형 SVM의 결정함수로 옳은 것은?

① \(f(x)=w^\top x+b\)  
② \(f(x)=x^\top x\)  
③ \(f(x)=\|w\|+b\)  
④ \(f(x)=K(x,x)\)

<details>
<summary>정답 및 해설</summary>

①

결정경계는 다음을 만족하는 x들의 집합입니다.

$$w^\top x+b=0$$

</details>

## 문제 2

하드 마진에서 전체 마진 폭은?

① \(\|w\|\)  
② \(1/\|w\|\)  
③ \(2/\|w\|\)  
④ \(2\|w\|\)

<details>
<summary>정답 및 해설</summary>

③

전체 마진 폭은 다음과 같습니다.

$$\frac{2}{\|w\|}$$

따라서 \(\|w\|\)가 작을수록 마진은 넓어집니다.

</details>

## 문제 3

하드 마진 조건에 등장하는 1의 의미로 가장 적절한 것은?

$$y_i(w^\top x_i+b)\ge1$$

① 실제 거리 1  
② 확률 1  
③ 함수값의 스케일을 고정하기 위한 기준  
④ 특징 수

<details>
<summary>정답 및 해설</summary>

③

w와 b를 함께 비례 확대해도 같은 결정경계를 만들 수 있으므로 함수값의 기준을 1로 둡니다.

</details>

## 문제 4

소프트 마진에서 \(\xi_i=0.4\)의 의미는?

① 완전히 오분류됨  
② 분류는 맞지만 마진 안쪽에 들어옴  
③ 결정경계 위에 있음  
④ 마진 바깥에서 안전하게 맞음

<details>
<summary>정답 및 해설</summary>

②

$$0<\xi_i<1$$

이면 클래스는 맞지만 마진 영역을 침범한 상태입니다.

</details>

## 문제 5

다음 목적함수에서 C의 역할은?

$$\frac{1}{2}\|w\|^2+C\sum_i\xi_i$$

① 학습률  
② 커널 차수  
③ 슬랙 위반의 벌점 크기  
④ 특징 수

<details>
<summary>정답 및 해설</summary>

③

C는 마진 침범·오분류 벌점의 크기입니다.

</details>

## 문제 6

C가 매우 커질 때 나타날 수 있는 현상으로 가장 적절한 것은?

① 오분류를 더 많이 허용  
② 넓은 마진을 최우선  
③ 학습 데이터를 더 정확히 맞추려 함  
④ 규제가 더 강해짐

<details>
<summary>정답 및 해설</summary>

③

큰 C는 좁은 마진을 감수해서라도 학습 데이터를 맞추므로 모델 규제는 약해집니다.

</details>

## 문제 7

다음 중 힌지 손실이 0이 되는 조건은?

$$\ell=\max(0,1-yf(x))$$

① \(yf(x)>0\)  
② \(yf(x)\ge1\)  
③ \(f(x)=0\)  
④ \(y=1\)

<details>
<summary>정답 및 해설</summary>

②

마진 밖까지 충분히 떨어져 맞혀야 손실이 0이 됩니다.

</details>

## 문제 8

어떤 데이터에서 \(yf(x)=0.3\)입니다.

힌지 손실은?

① 0  
② 0.3  
③ 0.7  
④ 1.3

<details>
<summary>정답 및 해설</summary>

③

$$\max(0,1-0.3)=0.7$$

분류는 맞았지만 마진 안쪽이므로 손실이 남습니다.

</details>

## 문제 9

커널 트릭에 대한 설명으로 옳은 것은?

① 고차원 좌표를 반드시 직접 생성한다.  
② 데이터 분포를 정규분포로 가정한다.  
③ 고차원에서의 내적값을 원래 공간에서 직접 계산한다.  
④ 모든 데이터를 한 차원으로 줄인다.

<details>
<summary>정답 및 해설</summary>

③

$$K(x,z)=\phi(x)^\top\phi(z)$$

고차원 좌표 대신 필요한 내적값만 계산합니다.

</details>

## 문제 10

RBF 커널은 다음과 같습니다.

$$K(x,z)=\exp(-\gamma\|x-z\|^2)$$

γ가 커질 때 가장 적절한 설명은?

① 먼 점도 비슷하다고 봄  
② 가까운 점만 비슷하다고 봄  
③ C가 자동으로 작아짐  
④ 선형 경계만 가능해짐

<details>
<summary>정답 및 해설</summary>

②

γ가 크면 영향 범위가 좁아져 경계가 더 복잡해질 수 있습니다.

</details>

## 문제 11

C와 γ의 연결로 옳은 것은?

① C = RBF 영향 범위, γ = 오분류 벌점  
② C = 오분류 벌점, γ = RBF 영향 범위  
③ 둘 다 학습률  
④ 둘 다 슬랙 변수

<details>
<summary>정답 및 해설</summary>

②

C는 슬랙 가격, γ는 RBF 영향 범위입니다.

</details>

## 문제 12

SVR에서 ε의 의미는?

① 커널 차수  
② 무시하는 오차의 폭  
③ 슬랙 가격  
④ 이상치 비율

<details>
<summary>정답 및 해설</summary>

②

ε 안의 오차는 손실 0입니다.

</details>

## 문제 13

SVR에서 ε=2, 실제값 80, 예측값 86입니다.

튜브 바깥으로 벗어난 양은?

① 2  
② 4  
③ 6  
④ 8

<details>
<summary>정답 및 해설</summary>

②

전체 오차 6에서 허용 오차 2를 빼면 다음과 같습니다.

$$6-2=4$$

</details>

## 문제 14

SVR의 ε-insensitive 손실은?

① \(\max(0,1-yf)\)  
② \(\max(0,|y-f|-\epsilon)\)  
③ \((y-f)^2\)  
④ \(|y-f|\)

<details>
<summary>정답 및 해설</summary>

②

ε를 넘어선 부분만 손실로 계산합니다.

</details>

## 문제 15

SVR에서 슬랙 변수의 의미로 가장 적절한 것은?

① 예측선의 위치 자체  
② ε-튜브를 얼마나 초과했는지  
③ RBF 폭  
④ 회귀계수의 개수

<details>
<summary>정답 및 해설</summary>

②

슬랙은 각 점의 허용 범위 초과량입니다.

</details>

## 문제 16

One-Class SVM에 대한 설명으로 옳은 것은?

① 정상과 이상 라벨이 모두 반드시 필요하다.  
② 정상 데이터만으로 정상 영역을 학습할 수 있다.  
③ 회귀 전용이다.  
④ C만 사용하고 커널은 사용할 수 없다.

<details>
<summary>정답 및 해설</summary>

②

정상 영역을 학습하고 그 바깥을 이상치로 판단합니다.

</details>

## 문제 17

One-Class SVM의 ν에 대한 설명으로 가장 적절한 것은?

① RBF 폭  
② 정상 영역의 엄격함과 경계 밖 허용 정도를 조절  
③ 회귀 허용 오차  
④ 학습률

<details>
<summary>정답 및 해설</summary>

②

ν는 경계 밖 허용 정도와 관련되며, ν=0.05가 정확히 5% 이상치를 뜻하지는 않습니다.

</details>

## 문제 18

다음 연결 중 틀린 것은?

① C → 슬랙 가격  
② γ → RBF 영향 범위  
③ ε → SVR 허용 오차 폭  
④ ν → 힌지 손실의 기울기

<details>
<summary>정답 및 해설</summary>

④

ν는 One-Class SVM의 정상 영역 엄격함과 관련된 매개변수입니다.

</details>

## 문제 19

다음 상황에 가장 적절한 모델은?

```text
정상 로그는 매우 많다.
이상 로그는 거의 없다.
정상 패턴에서 크게 벗어난 새로운 점을 찾고 싶다.
```

① Linear SVM  
② SVR  
③ One-Class SVM  
④ Hard Voting

<details>
<summary>정답 및 해설</summary>

③ One-Class SVM

정상 데이터만으로 정상 영역을 학습하는 상황에 적합합니다.

</details>

## 문제 20

다음 중 전체 연결이 옳은 것은?

① Linear SVM → ε-튜브  
② SVR → 클래스 마진  
③ Kernel SVM → 고차원 내적  
④ One-Class SVM → 두 클래스 라벨 필수

<details>
<summary>정답 및 해설</summary>

③

커널 SVM은 고차원 특징공간의 내적을 커널 함수로 직접 계산합니다.

</details>

## 잘 놓치는 핵심

- \(w\): 결정경계 법선
- 전체 마진: \(2/\|w\|\)
- 큰 C: 오분류 벌점 큼, 규제 약함
- 힌지 손실: 충분히 멀리 맞히면 0
- 커널: 고차원 내적을 직접 계산
- γ: RBF 영향 범위
- SVR ε: 무시할 오차 폭
- SVR 슬랙: ε-튜브 초과량
- One-Class ν: 정상 영역 엄격함과 관련

## 시험 직전 암기

```text
w → 경계 방향
b → 경계 위치
C → 슬랙 가격
γ → RBF 폭
ε → SVR 허용 오차
ν → One-Class 경계 엄격함

Hard Margin → 완전 분리
Soft Margin → 일부 위반 허용
Kernel → 고차원 내적 직접 계산
SVR → 튜브 안 오차 무시
One-Class → 정상 영역 학습
```

<blockquote class="prompt-info">
<p>핵심: 분류 SVM은 마진, 커널 SVM은 고차원 내적, SVR은 ε-튜브, One-Class SVM은 정상 영역을 본다.</p>
</blockquote>
