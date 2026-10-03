---
title: 부스팅 계열 모의고사
date: 2026-10-03 16:45:00 +0900
slug: boosting-mock-exam
permalink: /posts/boosting-mock-exam/
categories: [AI, 머신러닝]
tags: [Boosting, AdaBoost, GBM, XGBoost, LightGBM, CatBoost, 모의고사]
math: true
---

AdaBoost, GBM, XGBoost, LightGBM, CatBoost를 한 번에 점검하는 종합 모의고사입니다.

<blockquote class="prompt-info">
<p>범위: 표본 가중치 · 잔차 · 기울기 · 2차 미분 · 규제 · 잎 중심 성장 · 범주형 누수 방지</p>
</blockquote>

<details>
<summary>풀이 방법</summary>

먼저 정답을 가리고 풀고, 각 문항 아래의 정답과 해설을 펼쳐 확인합니다.

</details>

## 문제 1

다음 중 부스팅에 대한 설명으로 가장 적절한 것은?

① 여러 모델을 독립적으로 학습한 뒤 평균한다.  
② 앞 모델이 부족했던 부분을 다음 모델이 순차적으로 보완한다.  
③ 모든 모델이 동일한 부트스트랩 표본을 사용한다.  
④ 각 모델은 서로 다른 손실함수를 반드시 사용한다.

<details>
<summary>정답 및 해설</summary>

②

부스팅은 앞 단계의 부족한 부분을 다음 단계가 이어받는 순차 앙상블입니다.

</details>

## 문제 2

AdaBoost에서 t번째 약한 학습기의 가중 오류율은 다음 중 무엇인가?

① 틀린 데이터 개수 ÷ 전체 데이터 수  
② 틀린 데이터들의 가중치 합  
③ 맞힌 데이터들의 가중치 합  
④ 모든 데이터 가중치의 평균

<details>
<summary>정답 및 해설</summary>

②

단순 오답 개수가 아니라 가중 오류율입니다.

$$\epsilon_t=\sum_{i:y_i\neq h_t(x_i)}w_i$$

</details>

## 문제 3

AdaBoost에서 오류율이 0.5라면 학습기 가중치 α는 어떻게 되는가?

① 양수가 된다.  
② 음수가 된다.  
③ 0이 된다.  
④ 무한대가 된다.

<details>
<summary>정답 및 해설</summary>

③

$$\alpha_t=\frac{1}{2}\ln\frac{1-\epsilon_t}{\epsilon_t}$$

ε=0.5이면 분자가 0.5, 분모도 0.5이므로 로그값이 0입니다.

</details>

## 문제 4

다음 식에서 sign의 역할은?

$$H(x)=sign\left(\sum_t\alpha_t h_t(x)\right)$$

① 틀린 데이터의 가중치를 키운다.  
② 약한 학습기의 깊이를 정한다.  
③ 최종 가중합의 부호를 기준으로 클래스를 정한다.  
④ OOB 표본을 선택한다.

<details>
<summary>정답 및 해설</summary>

③

sign은 가중치를 갱신하지 않고 최종 합의 부호로 클래스를 정합니다.

</details>

## 문제 5

GBM의 다음 나무가 학습하는 대상에 가장 가까운 것은?

① 새로운 부트스트랩 표본  
② 이전 모델의 손실을 줄이는 방향  
③ 원래 정답 y만 그대로 다시 학습  
④ 무작위 특징 집합

<details>
<summary>정답 및 해설</summary>

②

GBM은 손실의 음의 기울기를 학습하며 제곱오차에서는 잔차와 같은 방향입니다.

</details>

## 문제 6

실제값이 80이고 현재 예측값이 65라면 제곱오차 기반 GBM에서 다음 나무가 보완해야 할 방향은?

① -15  
② 0  
③ +15  
④ +145

<details>
<summary>정답 및 해설</summary>

③

잔차는 다음과 같습니다.

$$80-65=15$$

따라서 다음 나무는 현재 예측을 위쪽으로 보완하는 방향을 학습합니다.

</details>

## 문제 7

GBM에서 학습률 ν를 작게 설정했을 때 일반적으로 나타날 수 있는 현상은?

① 한 나무의 영향이 커진다.  
② 더 많은 나무가 필요할 수 있다.  
③ 반드시 과적합이 심해진다.  
④ 잔차를 사용하지 않게 된다.

<details>
<summary>정답 및 해설</summary>

②

학습률이 작으면 한 단계 수정량이 작아 더 많은 나무가 필요할 수 있습니다.

</details>

## 문제 8

다음 중 AdaBoost와 GBM의 차이를 가장 잘 설명한 것은?

① AdaBoost는 표본 가중치, GBM은 손실의 기울기를 갱신의 중심으로 본다.  
② AdaBoost는 병렬, GBM은 병렬이다.  
③ 둘 다 OOB를 핵심 검증으로 사용한다.  
④ 둘 다 임계값을 무작위로만 선택한다.

<details>
<summary>정답 및 해설</summary>

①

AdaBoost는 표본 가중치, GBM은 손실의 기울기가 핵심입니다.

</details>

## 문제 9

XGBoost가 일반 GBM보다 추가로 강조하는 핵심은?

① OOB 표본  
② 2차 미분과 규제  
③ 깊이 1 트리 강제  
④ 범주형 순서 통계

<details>
<summary>정답 및 해설</summary>

②

XGBoost는 1차·2차 미분과 복잡도 규제를 명시적으로 사용합니다.

</details>

## 문제 10

XGBoost에서 다음 값들의 의미 연결이 옳은 것은?

① g = 2차 미분, h = 1차 미분  
② g = 1차 미분, h = 2차 미분  
③ g = 표본 가중치, h = OOB 비율  
④ g = 깊이, h = 잎 수

<details>
<summary>정답 및 해설</summary>

②

$$g_i=\frac{\partial L}{\partial \hat{y}_i}$$

$$h_i=\frac{\partial^2 L}{\partial \hat{y}_i^2}$$

g는 1차 미분, h는 2차 미분입니다.

</details>

## 문제 11

XGBoost에서 다음 식의 λ가 커질수록 나타나는 방향은?

$$w^*=-\frac{G}{H+\lambda}$$

① 잎의 절댓값이 더 커지기 쉽다.  
② 잎의 절댓값이 작아지는 방향으로 규제된다.  
③ 무조건 새로운 가지를 만든다.  
④ 학습률이 자동으로 1이 된다.

<details>
<summary>정답 및 해설</summary>

②

분모가 커져 잎의 절댓값을 줄이는 방향으로 규제합니다.

</details>

## 문제 12

XGBoost에서 γ의 역할과 가장 가까운 것은?

① 학습률  
② 최소 분할 이득 기준  
③ 표본 가중치 초기값  
④ 범주형 평균값

<details>
<summary>정답 및 해설</summary>

②

γ가 커질수록 더 큰 분할 이득이 필요하며, 학습률 η와는 다릅니다.

</details>

## 문제 13

LightGBM이 먼저 분할하는 잎은?

① 데이터 수가 가장 많은 잎  
② 가장 먼저 만들어진 잎  
③ 분할 이득이 가장 큰 잎  
④ 깊이가 가장 얕은 잎

<details>
<summary>정답 및 해설</summary>

③

LightGBM은 현재 잎 중 분할 이득이 가장 큰 잎을 먼저 자릅니다.

</details>

## 문제 14

LightGBM의 히스토그램 기반 분할의 목적과 가장 가까운 것은?

① 모든 값을 문자열로 바꾸기 위해  
② 연속값을 구간화해 탐색 비용과 메모리를 줄이기 위해  
③ OOB 비율을 높이기 위해  
④ 깊이를 1로 고정하기 위해

<details>
<summary>정답 및 해설</summary>

②

많은 연속값을 일정한 구간으로 묶어 분할 후보 탐색 비용을 줄입니다.

</details>

## 문제 15

CatBoost의 범주형 처리에서 가장 중요하게 막으려는 문제는?

① 타깃 누수  
② 부트스트랩 비율 감소  
③ 표준화 실패  
④ 거리 계산 오류

<details>
<summary>정답 및 해설</summary>

①

CatBoost는 순서 기반 범주 통계로 자기 정답이 직접 들어가는 타깃 누수를 줄입니다.

</details>

## 문제 16

다음 연결 중 틀린 것은?

① AdaBoost → 틀린 표본의 가중치 증가  
② GBM → 손실의 음의 기울기  
③ LightGBM → 이득 큰 잎 우선 분할  
④ CatBoost → OOB 기반 범주 통계

<details>
<summary>정답 및 해설</summary>

④

CatBoost의 핵심은 OOB가 아니라 순서 기반 범주 통계와 순서 부스팅입니다.

</details>

## 문제 17

다음 상황에 가장 적절한 모델을 고르면?

```text
범주형 열이 매우 많다.
원핫 인코딩으로 열 수가 크게 늘어난다.
타깃 평균 인코딩의 누수가 걱정된다.
```

① AdaBoost  
② GBM  
③ CatBoost  
④ Bagging

<details>
<summary>정답 및 해설</summary>

③ CatBoost

CatBoost는 범주형 처리와 순서 기반 누수 완화에 강점이 있습니다.

</details>

## 문제 18

다음 상황에 가장 가까운 모델은?

```text
현재 여러 잎이 있다.
각 잎을 한 번 더 분할했을 때의 이득을 계산한다.
그중 가장 큰 이득을 주는 잎부터 계속 깊게 분할한다.
```

① Random Forest  
② AdaBoost  
③ LightGBM  
④ CatBoost

<details>
<summary>정답 및 해설</summary>

③ LightGBM

이것이 LightGBM의 대표적인 잎 중심 성장 방식입니다.

</details>

## 문제 19

다음 중 부스팅 계열 전체에 대한 설명으로 가장 적절한 것은?

① 모델 수를 늘리면 항상 과적합이 줄어든다.  
② 앞 단계의 결과가 다음 단계 학습에 영향을 준다.  
③ 모든 모델이 독립적으로 학습된다.  
④ OOB가 반드시 필요하다.

<details>
<summary>정답 및 해설</summary>

②

부스팅은 순차 학습입니다.

앞 단계에서 남은 오류나 기울기 정보가 다음 단계에 영향을 줍니다.

</details>

## 문제 20

다음 보기의 연결로 옳은 것을 모두 고르면?

ㄱ. AdaBoost → 표본 가중치  
ㄴ. GBM → 음의 기울기  
ㄷ. XGBoost → 1차·2차 미분과 규제  
ㄹ. LightGBM → 분할 이득이 큰 잎 우선  
ㅁ. CatBoost → 순서 기반 범주 통계

① ㄱ, ㄴ  
② ㄱ, ㄴ, ㄷ  
③ ㄱ, ㄴ, ㄷ, ㄹ  
④ ㄱ, ㄴ, ㄷ, ㄹ, ㅁ

<details>
<summary>정답 및 해설</summary>

④

모두 옳습니다.

이 다섯 연결이 부스팅 계열을 구분하는 가장 중요한 축입니다.

</details>

## 잘 놓치는 핵심

- AdaBoost 오류율 = 틀린 데이터의 가중치 합
- `sign` = 최종 클래스 결정
- GBM = 손실의 음의 기울기
- XGBoost = 2차 미분 + 규제
- λ = 잎 값 규제, γ = 최소 분할 이득
- LightGBM = 이득 큰 잎 우선
- CatBoost = 순서 기반 범주 통계
- 부스팅 = 순차 학습
- 트리 기반 부스팅은 표준화가 보통 필수 아님

## 마지막 정리

```text
AdaBoost
→ 틀린 데이터의 무게

GBM
→ 손실의 기울기

XGBoost
→ 기울기 + 곡률 + 규제

LightGBM
→ 이득 큰 잎 우선

CatBoost
→ 범주형 + 순서 기반 누수 완화
```

<blockquote class="prompt-info">
<p>시험 직전에는 “Ada-무게 / GBM-기울기 / XGB-2차·규제 / LGBM-잎 / Cat-범주형”만 먼저 떠올리면 됩니다.</p>
</blockquote>
