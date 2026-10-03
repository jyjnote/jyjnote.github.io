---
title: 선형 모델 종합 정리
date: 2026-10-03 12:30:00 +0900
slug: linear-models-overview
permalink: /posts/linear-models-overview/
categories: [AI, 머신러닝]
tags: [선형모델, 단순선형회귀, 다중선형회귀, 다항회귀, 로지스틱회귀, 소프트맥스회귀, Ridge, Lasso, ElasticNet]
math: true
---

선형 모델은 **입력 변수들의 선형 결합을 이용해 값을 예측하거나 범주를 분류하는 모델군**입니다.

단순·다중·다항 회귀에서 로지스틱·소프트맥스, Ridge·Lasso·Elastic Net까지 하나의 흐름으로 연결할 수 있습니다.

<blockquote class="prompt-info">
<p>한 줄: 선형식은 유지하고 문제에 따라 손실 함수, 연결 함수, 벌점을 바꿉니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

단순회귀 → 다중회귀 → 다항회귀 → 로지스틱 → 소프트맥스 → Ridge·Lasso·Elastic Net

</details>

## 1. 전체 지도

| 모델 | 출력 | 핵심 |
| --- | --- | --- |
| 단순선형회귀 | 숫자 | 설명변수 1개 |
| 다중선형회귀 | 숫자 | 설명변수 여러 개 |
| 다항회귀 | 숫자 | x의 거듭제곱 특성 |
| 로지스틱회귀 | 이진 범주 | 로그오즈가 선형 |
| 소프트맥스회귀 | 다중 범주 | 클래스 확률 합이 1 |
| Ridge | 숫자 | L2 벌점 |
| Lasso | 숫자 | L1 벌점 |
| Elastic Net | 숫자 | L1 + L2 |

## 2. 단순선형회귀

$$y_i=\beta_0+\beta_1x_i+\epsilon_i$$

$$\hat{y}_i=\hat{\beta}_0+\hat{\beta}_1x_i$$

절편은 x=0일 때의 예측값이고, 기울기는 x가 1 증가할 때 y가 평균적으로 얼마나 변하는지를 뜻합니다.

최소제곱법은 잔차 제곱합을 최소화합니다.

$$SSE=\sum_{i=1}^{n}(y_i-\hat{y}_i)^2=\sum_{i=1}^{n}(y_i-\hat{\beta}_0-\hat{\beta}_1x_i)^2$$

$$e_i=y_i-\hat{y}_i$$

<mark>OLS는 잔차 합이 아니라 잔차 제곱합을 최소화합니다.</mark>

## 3. SST, SSR, SSE

$$SST=\sum(y_i-\bar{y})^2$$

$$SSR=\sum(\hat{y}_i-\bar{y})^2$$

$$SSE=\sum(y_i-\hat{y}_i)^2$$

$$SST=SSR+SSE$$

| 항 | 의미 |
| --- | --- |
| SST | y의 전체 변동 |
| SSR | 직선이 설명한 변동 |
| SSE | 직선이 설명하지 못한 변동 |

## 4. R2와 상관계수

$$R^2=1-\frac{SSE}{SST}=\frac{SSR}{SST}$$

단순선형회귀에서는 다음이 성립합니다.

$$R^2=r^2$$

r=0.8이면 R2=0.64입니다.

<mark>상관 0.8이 설명력 80%라는 뜻은 아닙니다.</mark>

기울기는 다음과 같이도 쓸 수 있습니다.

$$\hat{\beta}_1=r\frac{s_y}{s_x}$$

기울기는 단위의 영향을 받으므로 숫자가 크다고 변수가 더 중요하다는 뜻은 아닙니다.

## 5. 단순회귀에서 자주 틀리는 것

y를 x에 회귀한 직선과 x를 y에 회귀한 직선은 일반적으로 다르며, 회귀식을 x에 대해 푼다고 반대 회귀식이 되지 않습니다.

$$\sum e_i=0$$

$$\sum e_ix_i=0$$

단순회귀 기울기는 빠진 변수의 영향이 섞일 수 있어 자동으로 인과효과가 아니며, 높은 R2도 선형성을 보장하지 않습니다. 신뢰구간은 평균 y, 예측구간은 개별 y를 다루며 예측구간이 더 넓습니다.



## 6. 회귀 오차 지표와 가정

| 지표 | 의미 |
| --- | --- |
| MSE | 잔차 제곱 평균, 큰 오차에 민감 |
| RMSE | MSE의 제곱근, y와 단위가 같음 |
| MAE | 잔차 절댓값 평균 |
| MAPE | 실제값 대비 비율 오차 |

$$MSE=\frac{1}{n}\sum(y_i-\hat{y}_i)^2$$

$$RMSE=\sqrt{\frac{1}{n}\sum(y_i-\hat{y}_i)^2}$$

$$MAE=\frac{1}{n}\sum|y_i-\hat{y}_i|$$

주요 가정은 선형성, 잔차 독립성, 등분산성, 추론 시 잔차 정규성입니다.

가정이 깨져도 적합 자체는 되지만 해석과 검정이 위험해질 수 있습니다. 이상치, 지렛대점, 영향점도 함께 확인하며 영향점은 Cook's distance 등으로 볼 수 있습니다.



## 7. 다중선형회귀

$$y_i=\beta_0+\beta_1x_{i1}+\cdots+\beta_px_{ip}+\epsilon_i$$

$$\hat{y}_i=\hat{\beta}_0+\hat{\beta}_1x_{i1}+\cdots+\hat{\beta}_px_{ip}$$

OLS 목표와 정규방정식은 다음과 같습니다.

$$\min_{\boldsymbol{\beta}}\|\mathbf{y}-\mathbf{X}\boldsymbol{\beta}\|^2$$

$$\mathbf{X}^{\top}\mathbf{X}\hat{\boldsymbol{\beta}}=\mathbf{X}^{\top}\mathbf{y}$$

역행렬이 존재하면 다음과 같습니다.

$$\hat{\boldsymbol{\beta}}=(\mathbf{X}^{\top}\mathbf{X})^{-1}\mathbf{X}^{\top}\mathbf{y}$$

## 8. 다중회귀 계수 해석

```text
점수 = 40 + 5×공부 + 2×수면 - 3×결석
```

공부 1시간 증가 시 나머지를 고정하면 +5점입니다. 수면과 결석 계수도 같은 방식으로 해석합니다.

<mark>다중회귀 계수에는 반드시 다른 변수를 고정한다는 조건이 붙습니다.</mark>

## 9. 자유도와 조정 R2

| 제곱합 | 자유도 |
| --- | ---: |
| SST | n - 1 |
| SSR | p |
| SSE | n - p - 1 |

$$MSR=\frac{SSR}{p}$$

$$MSE=\frac{SSE}{n-p-1}$$

변수를 추가하면 R2는 일반적으로 감소하지 않습니다.

$$R^2_{adj}=1-(1-R^2)\frac{n-1}{n-p-1}$$

조정 R2는 변수 수 증가에 대한 벌점을 반영합니다.

## 10. 다중공선성과 VIF

설명변수 x_j를 나머지 설명변수로 회귀한 결정계수를 R_j의 제곱이라 하면 다음과 같습니다.

$$VIF_j=\frac{1}{1-R_j^2}$$

R_j의 제곱이 1에 가까울수록 VIF가 커집니다.

n=20, p=18이면 잔차 자유도는 다음과 같습니다.

$$n-p-1=1$$

표본에 비해 변수가 지나치게 많으면 계수 추정이 불안정하고 과적합 위험이 커집니다.

## 11. 다항회귀

$$y=\beta_0+\beta_1x+\beta_2x^2+\cdots+\beta_dx^d+\epsilon$$

x에 대해서는 곡선이지만 beta에 대해서는 선형이므로 선형 모델에 포함됩니다.

직선 적합 후 잔차가 U자, 뒤집힌 U자, 활 모양처럼 체계적으로 휘면 다항항을 고려할 수 있습니다.

다항회귀는 전체 구간을 하나의 다항식으로 구부리고, 스플라인은 구간을 나누어 낮은 차수의 다항식을 이어 붙입니다.

## 12. 로지스틱회귀

로지스틱회귀는 이진 분류 모델입니다.

$$P(y=1\mid x)=\pi(x)=\frac{1}{1+e^{-(\beta_0+\beta_1x)}}$$

$$0<\pi(x)<1$$

0과 1을 OLS로 직접 맞추면 예측값이 범위를 벗어날 수 있고, 이항 분산 때문에 등분산 가정도 맞지 않습니다.

## 13. 오즈와 로짓

$$Odds=\frac{\pi}{1-\pi}$$

| 확률 | 오즈 |
| ---: | ---: |
| 0.5 | 1 |
| 0.75 | 3 |
| 0.25 | 1/3 |
| 0.8 | 4 |
| 0.9 | 9 |

$$\pi=\frac{o}{1+o}$$

$$logit(\pi)=\log\frac{\pi}{1-\pi}=\beta_0+\beta_1x$$

<mark>로지스틱회귀는 확률이 아니라 로그오즈가 설명변수의 선형식입니다.</mark>

## 14. 로지스틱 계수 해석

$$\frac{Odds(x+1)}{Odds(x)}=e^{\beta_1}$$

e의 beta1승은 오즈비입니다.

| beta1 | 오즈비 | 의미 |
| --- | ---: | --- |
| 0 | 1 | 오즈 변화 없음 |
| ln2 | 2 | 오즈 2배 |
| -ln2 | 0.5 | 오즈 절반 |
| 양수 | 1보다 큼 | y=1 쪽 |
| 음수 | 1보다 작음 | y=1에서 멀어짐 |

<blockquote class="prompt-danger">
<p>오즈가 1.49배라는 말을 확률이 1.49배라고 쓰면 틀립니다.</p>
</blockquote>

시그모이드 양 끝은 평평하므로 오즈비가 일정해도 확률 증가량은 현재 확률에 따라 달라집니다.

## 15. 로지스틱 추정과 손실

로지스틱회귀는 OLS가 아니라 최대우도추정을 사용합니다.

$$L(\boldsymbol{\beta})=\prod_{i=1}^{n}\pi_i^{y_i}(1-\pi_i)^{1-y_i}$$

$$\ell(\boldsymbol{\beta})=\sum_{i=1}^{n}[y_i\log\pi_i+(1-y_i)\log(1-\pi_i)]$$

$$LogLoss=-\frac{1}{n}\sum[y\log\pi+(1-y)\log(1-\pi)]$$

닫힌 해가 없어 반복 최적화로 풉니다.

## 16. 분류 지표와 컷오프

|  | 실제 1 | 실제 0 |
| --- | --- | --- |
| 예측 1 | TP | FP |
| 예측 0 | FN | TN |

$$Accuracy=\frac{TP+TN}{TP+TN+FP+FN}$$

$$Precision=\frac{TP}{TP+FP}$$

$$Recall=\frac{TP}{TP+FN}$$

$$Specificity=\frac{TN}{TN+FP}$$

$$F1=2\frac{Precision\times Recall}{Precision+Recall}$$

FN이 비싸면 컷오프를 낮추고, FP가 비싸면 컷오프를 높일 수 있습니다.

0.5는 기본값일 뿐 절대적인 기준은 아닙니다.

## 17. ROC와 AUC

$$FPR=
rac{FP}{FP+TN}=1-Specificity$$

ROC는 컷오프를 바꾸며 위양성률과 재현율을 보고, AUC는 그 아래 넓이입니다. 0.5는 무작위 분류와 비슷하고 1에 가까울수록 분리 능력이 좋습니다.

로지스틱에서는 오즈비, 컷오프, 선형 결정경계, 유사 R2 해석을 특히 주의합니다.

## 18. 소프트맥스회귀

세 개 이상의 클래스에 사용하는 다중 로지스틱회귀입니다.

$$P(y=k\mid\mathbf{x})=\pi_k(\mathbf{x})=\frac{e^{\mathbf{x}^{\top}\boldsymbol{\beta}_k}}{\sum_{j=1}^{K}e^{\mathbf{x}^{\top}\boldsymbol{\beta}_j}}$$

$$\sum_{k=1}^{K}\pi_k=1$$

소프트맥스의 모든 출력은 0과 1 사이이고 합은 1입니다.

모든 로짓에 같은 상수를 더해도 확률은 변하지 않습니다.

## 19. 이진 로지스틱과 소프트맥스

$$\pi_1=
rac{e^{z_1}}{e^{z_1}+e^{z_2}}=
rac{1}{1+e^{-(z_1-z_2)}}$$

이진 로지스틱은 K=2인 소프트맥스의 특수한 경우이며, 소프트맥스는 크로스엔트로피 손실을 사용합니다.

$$L=-\sum_i\sum_k t_{ik}\log\pi_{ik}$$

## 20. Ridge

Ridge는 OLS 손실에 L2 벌점을 추가합니다.

$$\min_{\boldsymbol{\beta}}\|\mathbf{y}-\mathbf{X}\boldsymbol{\beta}\|^2+\lambda\|\boldsymbol{\beta}\|_2^2$$

$$\hat{\boldsymbol{\beta}}_{ridge}=(\mathbf{X}^{\top}\mathbf{X}+\lambda\mathbf{I})^{-1}\mathbf{X}^{\top}\mathbf{y}$$

lambda가 커질수록 계수는 0 쪽으로 줄지만 일반적으로 정확히 0이 되지는 않습니다.

<mark>Ridge는 변수 선택보다 계수 축소와 안정화가 핵심입니다.</mark>

## 21. Ridge와 편향-분산

lambda가 커지면 계수와 분산은 줄고 편향은 커질 수 있습니다. 너무 작으면 OLS처럼 과적합할 수 있고 너무 크면 지나치게 단순해질 수 있으며, 적절한 lambda는 교차검증으로 선택합니다.

## 22. Lasso

Lasso는 OLS 손실에 L1 벌점을 추가합니다.

$$\min_{\boldsymbol{\beta}}\|\mathbf{y}-\mathbf{X}\boldsymbol{\beta}\|^2+\lambda\|\boldsymbol{\beta}\|_1$$

$$\|\boldsymbol{\beta}\|_1=\sum_{j=1}^{p}|\beta_j|$$

일부 계수를 정확히 0으로 만들 수 있어 변수 선택이 가능합니다.

## 23. Ridge와 Lasso 비교

| 구분 | Ridge | Lasso |
| --- | --- | --- |
| 벌점 | L2 | L1 |
| 계수 축소 | O | O |
| 정확히 0 | 보통 X | 가능 |
| 변수 선택 | X | O |
| 제약 모양 | 원 | 마름모 |

L1 제약은 마름모라 축 방향 꼭짓점에 닿기 쉬워 일부 계수가 0이 됩니다.

L1은 0에서 매끄럽게 미분되지 않아 Ridge처럼 단순한 닫힌 해가 없습니다.

## 24. 표준화와 상관된 변수

Ridge와 Lasso는 계수 크기에 벌점을 주므로 설명변수 표준화가 중요합니다.

상관된 두 변수가 모두 y와 관련되면 Ridge는 둘 다 남기는 경향이 있고, Lasso는 한쪽을 0으로 만들 수 있습니다.

## 25. Elastic Net

Elastic Net은 L1과 L2를 함께 사용합니다.

$$\min_{\boldsymbol{\beta}}\frac{1}{2n}\|\mathbf{y}-\mathbf{X}\boldsymbol{\beta}\|^2+\lambda\left(\alpha\|\boldsymbol{\beta}\|_1+\frac{1-\alpha}{2}\|\boldsymbol{\beta}\|_2^2\right)$$

Lasso의 변수 선택과 Ridge의 계수 안정화를 함께 노립니다.

| 항 | 효과 |
| --- | --- |
| L1 | 작은 계수를 0으로 만들어 변수 선택 |
| L2 | 계수를 고르게 줄여 공선성 완화 |

## 26. Elastic Net의 초매개변수

lambda는 전체 벌점 크기, alpha는 L1과 L2의 혼합 비율입니다.

```text
alpha = 1 → Lasso
alpha = 0 → Ridge
```

둘 다 교차검증으로 선택합니다.

## 27. Elastic Net을 쓰기 좋은 경우

변수가 많고 서로 상관되며 변수 선택도 필요하거나 p가 n보다 큰 상황에 유용합니다. 설명변수 표준화가 중요합니다.

## 28. 규제 모델 비교

| 모델 | 벌점 | 변수 선택 | 공선성 대응 |
| --- | --- | --- | --- |
| OLS | 없음 | X | 약함 |
| Ridge | L2 | X | 강함 |
| Lasso | L1 | O | 상관 변수에서 불안정할 수 있음 |
| Elastic Net | L1 + L2 | O | 상관 변수 그룹에 유리 |

규제를 강화하면 일반적으로 계수가 줄고 분산은 낮아지며 편향은 증가할 수 있습니다.

학습 SSE만 보면 lambda=0이 유리하지만 목표는 새로운 데이터의 예측오차를 줄이는 것입니다.

## 29. 손실 함수로 전체 연결

| 모델 | 대표 손실 |
| --- | --- |
| 선형회귀 | SSE 또는 MSE |
| Ridge | SSE + L2 |
| Lasso | SSE + L1 |
| Elastic Net | SSE + L1 + L2 |
| 로지스틱 | 로그손실 |
| 로지스틱 Lasso | 로그손실 + L1 |
| 로지스틱 Elastic Net | 로그손실 + L1 + L2 |

<mark>선형 모델의 차이는 예측 구조, 손실 함수, 벌점의 조합으로 정리할 수 있습니다.</mark>

## 30. 잘 놓치는 핵심

1. 높은 R2가 선형성을 보장하지는 않습니다.
2. 기울기 크기는 단위 영향을 받으므로 중요도와 같지 않습니다.
3. 단순회귀 기울기는 자동으로 인과효과가 아닙니다.
4. 로지스틱의 e의 beta승은 확률비가 아니라 오즈비입니다.
5. Ridge는 주로 축소, Lasso는 축소와 변수 선택을 합니다.
6. Elastic Net은 상관된 변수 그룹에서 L1과 L2를 함께 활용합니다.

## 31. 시험·면접 핵심

- 단순회귀: R2=r의 제곱, 기울기 t검정과 회귀 F검정 결론 동일
- 다중회귀: 다른 변수 고정 후 계수 해석, 변수 추가 시 R2는 감소하지 않음
- 조정 R2: 변수 수 벌점, VIF: 다중공선성
- 다항회귀: x에는 비선형, beta에는 선형
- 로지스틱: 로그오즈가 선형, 계수는 오즈비
- 소프트맥스: 클래스 확률 합이 1
- Ridge=L2, Lasso=L1, Elastic Net=L1+L2

## 32. 객관식 문제

### 문제 1

단순선형회귀에서 r=0.8일 때 R2는? ① 0.4 ② 0.64 ③ 0.8 ④ 1.6

<details>
<summary>정답</summary>

②

</details>

### 문제 2

다중회귀에서 설명변수를 추가했을 때 R2는? ① 반드시 감소 ② 감소하지 않음 ③ 항상 0 ④ 항상 1

<details>
<summary>정답</summary>

②

</details>

### 문제 3

로지스틱회귀에서 e의 beta1승의 의미는? ① 확률비 ② 오즈비 ③ 결정계수 ④ 잔차

<details>
<summary>정답</summary>

②

</details>

### 문제 4

변수 선택이 가능한 규제 회귀는? ① OLS ② Ridge ③ Lasso ④ 단순회귀

<details>
<summary>정답</summary>

③

</details>

### 문제 5

Ridge와 Lasso를 함께 사용하는 모델은? ① 다항회귀 ② Elastic Net ③ 소프트맥스 ④ 단순회귀

<details>
<summary>정답</summary>

②

</details>

### 문제 6

다항회귀에 대한 설명으로 옳은 것은? ① beta에도 비선형 ② 선형 모델 아님 ③ x에는 곡선, beta에는 선형 ④ 분류 전용

<details>
<summary>정답</summary>

③

</details>

## 33. 마지막 정리

단순회귀에서 다중·다항 회귀로 확장하고, 분류에서는 로지스틱·소프트맥스를 사용하며, 규제가 필요하면 Ridge·Lasso·Elastic Net을 연결합니다.

<blockquote class="prompt-info">
<p>핵심 흐름: OLS → 다중·다항 → 로지스틱·소프트맥스 → Ridge·Lasso·Elastic Net</p>
</blockquote>

## 다음에 이을 글

**의사결정나무**입니다. 선형식 대신 조건 분기를 이용하는 대표적인 비선형 모델로 이어갑니다.
