---
title: 앙상블 파이널 모의고사
date: 2026-10-03 17:20:00 +0900
slug: ensemble-final-mock-exam
permalink: /posts/ensemble-final-mock-exam/
categories: [AI, 머신러닝]
tags: [앙상블, Bagging, RandomForest, ExtraTrees, AdaBoost, GBM, XGBoost, LightGBM, CatBoost, Voting, Stacking, 모의고사]
math: true
---

Bagging부터 Stacking까지 앙상블 전체 범위를 한 번에 점검하는 파이널 모의고사입니다.

<blockquote class="prompt-info">
<p>범위: Bagging · Random Forest · Extra Trees · AdaBoost · GBM · XGBoost · LightGBM · CatBoost · Voting · Stacking · Blending</p>
</blockquote>

<details>
<summary>풀이 방법</summary>

먼저 정답을 가리고 풀고, 각 문제 아래의 정답 및 해설을 펼쳐 확인합니다.

</details>

## 문제 1

다음 중 Bagging의 핵심 설명으로 가장 적절한 것은?

① 앞 모델의 오차를 다음 모델이 순차적으로 보완한다.  
② 같은 종류의 모델을 서로 다른 부트스트랩 표본에 학습한다.  
③ 서로 다른 모델의 확률을 메타 모델이 학습한다.  
④ 범주형 변수의 누수를 줄인다.

<details>
<summary>정답 및 해설</summary>

②

Bagging은 같은 종류의 모델을 서로 다른 부트스트랩 표본에 학습한 뒤 평균·투표합니다.

</details>

## 문제 2

크기 n인 데이터에서 특정 데이터가 부트스트랩 표본에 한 번도 포함되지 않을 확률은 n이 충분히 클 때 약 얼마인가?

① 13.2%  
② 36.8%  
③ 50.0%  
④ 63.2%

<details>
<summary>정답 및 해설</summary>

②

$$\left(1-\frac{1}{n}\right)^n\approx\frac{1}{e}\approx0.368$$

약 36.8%가 OOB가 됩니다.

</details>

## 문제 3

Random Forest에서 전체 특징 수가 p이고 각 노드에서 m=p라면?

① Extra Trees가 된다.  
② 특징 무작위성이 거의 사라져 Bagging과 가까워진다.  
③ AdaBoost가 된다.  
④ OOB가 사라진다.

<details>
<summary>정답 및 해설</summary>

②

모든 특징을 보므로 특징 무작위성이 거의 사라집니다.

</details>

## 문제 4

기본 Extra Trees에서 OOB 평가를 바로 사용할 수 없는 가장 직접적인 이유는?

① 특징을 사용하지 않아서  
② 기본적으로 부트스트랩을 사용하지 않아서  
③ 분류만 가능해서  
④ 깊이가 항상 1이라서

<details>
<summary>정답 및 해설</summary>

②

부트스트랩이 없으면 빠지는 표본도 없어 OOB가 없습니다.

</details>

## 문제 5

AdaBoost에서 t번째 학습기의 가중 오류율은?

① 틀린 데이터 개수 ÷ 전체 데이터 수  
② 틀린 데이터들의 가중치 합  
③ 맞힌 데이터들의 가중치 합  
④ 모든 데이터의 평균 가중치

<details>
<summary>정답 및 해설</summary>

②

$$\epsilon_t=\sum_{i:y_i\neq h_t(x_i)}w_i$$

단순 오답 개수가 아니라 틀린 점의 현재 가중치를 합합니다.

</details>

## 문제 6

AdaBoost에서 ε=0.5라면 α의 값은?

$$\alpha=\frac{1}{2}\ln\frac{1-\epsilon}{\epsilon}$$

① 음수  
② 0  
③ 0.5  
④ 무한대

<details>
<summary>정답 및 해설</summary>

②

$$\frac{1-0.5}{0.5}=1$$

따라서 ln(1)=0입니다.

</details>

## 문제 7

GBM의 다음 나무가 일반적으로 학습하는 대상은?

① 새 부트스트랩 표본  
② 손실함수의 음의 기울기  
③ OOB 데이터  
④ 원래 y를 그대로 반복 학습

<details>
<summary>정답 및 해설</summary>

②

제곱오차에서는 음의 기울기가 잔차와 같은 방향입니다.

</details>

## 문제 8

실제값이 90이고 현재 예측값이 72라면 제곱오차 기반 GBM에서 다음 나무가 보완할 방향은?

① -18  
② 0  
③ +18  
④ +162

<details>
<summary>정답 및 해설</summary>

③

$$90-72=18$$

현재 예측을 위쪽으로 보완해야 합니다.

</details>

## 문제 9

XGBoost가 일반 GBM보다 추가로 강조하는 것은?

① 2차 미분과 규제  
② OOB 평가  
③ 깊이 1 트리만 사용  
④ 범주형 순서 통계

<details>
<summary>정답 및 해설</summary>

①

XGBoost는 1차·2차 미분과 모델 복잡도 규제를 사용합니다.

</details>

## 문제 10

XGBoost에서 다음 식이 주어졌습니다.

$$w^*=-\frac{G}{H+\lambda}$$

λ가 커질수록 일반적으로 어떻게 되는가?

① 잎 값의 절댓값이 작아지는 방향으로 규제된다.  
② 잎 값의 절댓값이 반드시 커진다.  
③ 트리가 병렬화된다.  
④ 특징 수가 자동 감소한다.

<details>
<summary>정답 및 해설</summary>

①

분모가 커지므로 같은 G와 H라면 잎 값의 절댓값이 작아집니다.

</details>

## 문제 11

XGBoost에서 γ와 가장 가까운 역할은?

① 학습률  
② 최소 분할 이득 기준  
③ 표본 초기 가중치  
④ 범주형 평균값

<details>
<summary>정답 및 해설</summary>

②

충분한 이득이 없으면 새 가지를 만들지 않도록 제어합니다.

</details>

## 문제 12

LightGBM의 히스토그램 기반 분할의 목적은?

① 연속값을 구간으로 묶어 계산량과 메모리를 줄이기 위해  
② 모든 범주형을 순서형으로 만들기 위해  
③ OOB를 만들기 위해  
④ 표본 가중치를 초기화하기 위해

<details>
<summary>정답 및 해설</summary>

①

연속값을 구간화해 분할 탐색 비용을 줄입니다.

</details>

## 문제 13

CatBoost가 특히 강점을 가지는 상황은?

① 범주형 변수가 많고 타깃 인코딩 누수가 걱정되는 경우  
② 모든 특징이 이미 동일한 숫자 범위를 가지는 경우  
③ OOB만으로 평가해야 하는 경우  
④ 선형 외삽이 반드시 필요한 경우

<details>
<summary>정답 및 해설</summary>

①

CatBoost는 범주형 처리와 순서 기반 누수 완화에 강합니다.

</details>

## 문제 14

CatBoost의 순서 기반 범주 통계의 핵심은?

① 현재 데이터보다 뒤의 정답만 사용  
② 현재 데이터의 정답까지 포함해 평균  
③ 현재 데이터보다 앞선 정보만 이용  
④ OOB 표본만 이용

<details>
<summary>정답 및 해설</summary>

③

자기 자신의 정답이 자신의 변환값에 직접 들어가는 누수를 줄이기 위한 방식입니다.

</details>

## 문제 15

세 모델의 양성 확률이 다음과 같습니다.

```text
0.49, 0.49, 0.90
```

각 모델을 0.5 기준으로 Hard Voting하면?

① 양성  
② 음성  
③ 동점  
④ 계산 불가

<details>
<summary>정답 및 해설</summary>

②

0.49와 0.49는 음성, 0.90은 양성이므로 음성 2표입니다.

반면 Soft Voting의 확률 평균은 약 0.627이므로 양성이 될 수 있습니다.

</details>

## 문제 16

Stacking의 핵심 설명으로 가장 적절한 것은?

① 1층 모델 예측을 새 특징으로 만들고 2층 모델이 결합 규칙을 학습한다.  
② 모델들의 라벨을 단순 다수결한다.  
③ 부트스트랩 표본마다 같은 나무를 만든다.  
④ 틀린 데이터의 가중치를 키운다.

<details>
<summary>정답 및 해설</summary>

①

Voting은 고정 규칙, Stacking은 메타 모델이 결합 규칙을 학습합니다.

</details>

## 문제 17

Stacking에서 OOF 예측을 사용하는 이유는?

① 1층이 학습에 사용한 행의 예측을 그대로 2층에 넣는 누수를 막기 위해  
② OOB 비율을 높이기 위해  
③ 특징 수를 1개로 줄이기 위해  
④ 트리를 깊게 만들기 위해

<details>
<summary>정답 및 해설</summary>

①

각 행은 자신을 학습에 쓰지 않은 1층 모델의 예측을 받아야 합니다.

</details>

## 문제 18

100행을 5겹으로 나누었습니다.

첫 번째 OOF 구간이 1~20행이라면 올바른 방식은?

① 1~20행으로 학습하고 21~100행 예측  
② 21~100행으로 학습하고 1~20행 예측  
③ 100행 전체로 학습하고 1~20행 예측  
④ 1~20행으로 학습하고 1~20행 예측

<details>
<summary>정답 및 해설</summary>

②

1~20행을 학습에서 제외한 뒤 예측해야 OOF가 됩니다.

</details>

## 문제 19

Stacking에서 1~20행의 OOF 예측을 2층 입력으로 사용했다면 2층의 정답은?

① 21~40행 정답  
② 81~100행 정답  
③ 1~20행 정답  
④ 임의의 20행 정답

<details>
<summary>정답 및 해설</summary>

③

<mark>2층 입력과 정답은 반드시 같은 행이어야 합니다.</mark>

</details>

## 문제 20

다음 연결 중 틀린 것은?

① Bagging → 부트스트랩  
② Random Forest → 특징 무작위  
③ Extra Trees → 임계값 무작위  
④ AdaBoost → OOF 잔차 학습

<details>
<summary>정답 및 해설</summary>

④

AdaBoost의 핵심은 OOF가 아니라 틀린 데이터의 표본 가중치 증가입니다.

</details>

## 문제 21

다음 연결 중 옳은 것을 모두 고르면?

ㄱ. AdaBoost → 표본 가중치  
ㄴ. GBM → 손실의 음의 기울기  
ㄷ. XGBoost → 2차 미분과 규제  
ㄹ. LightGBM → 이득 큰 잎 우선  
ㅁ. CatBoost → 순서 기반 범주 통계

① ㄱ, ㄴ  
② ㄱ, ㄴ, ㄷ  
③ ㄱ, ㄴ, ㄷ, ㄹ  
④ ㄱ, ㄴ, ㄷ, ㄹ, ㅁ

<details>
<summary>정답 및 해설</summary>

④

모두 핵심 구분입니다.

</details>

## 문제 22

다음 상황에 가장 적절한 모델은?

```text
범주형 변수가 매우 많음
원핫 인코딩으로 열이 크게 늘어남
타깃 평균 인코딩의 누수가 걱정됨
```

① Extra Trees  
② CatBoost  
③ Bagging  
④ Hard Voting

<details>
<summary>정답 및 해설</summary>

② CatBoost

범주형 처리와 순서 기반 누수 완화가 핵심 강점입니다.

</details>

## 잘 놓치는 핵심

- Bagging → 부트스트랩, 주로 분산 감소
- Random Forest → 특징 무작위
- Extra Trees → 임계값까지 무작위
- AdaBoost → 표본 가중치
- GBM → 손실의 음의 기울기
- XGBoost → 2차 미분 + 규제
- LightGBM → 이득 큰 잎 우선
- CatBoost → 범주형 + 순서 기반 누수 완화
- Voting → 고정 결합
- Stacking → OOF 예측 + 메타 모델
- OOB와 OOF는 다른 개념

## 시험 직전 암기

```text
Bagging → 가방
RF → 특징
Extra Trees → 임계값

AdaBoost → 사람의 무게
GBM → 기울기
XGBoost → 2차 미분
LightGBM → 잎
CatBoost → 범주형

Voting → 표를 센다
Stacking → 표를 특징으로 다시 배운다
```

<blockquote class="prompt-info">
<p>파이널 핵심: 병렬 앙상블은 서로 다르게 만들고 평균하며, 순차 앙상블은 앞 단계의 부족함을 다음 단계가 보완합니다.</p>
</blockquote>
