---
title: Elastic Net
date: 2026-08-31 09:00:00 +0900
slug: elastic-net
permalink: /posts/elastic-net/
categories: [AI, 머신러닝]
tags: [선형모델, ElasticNet, Ridge, Lasso, 빅분기]
math: true
---

Ridge의 L2와 Lasso의 L1을 **같이** 넣는 선형 모형입니다.  
계수를 줄이면서, 필요하면 0으로도 만듭니다.

<blockquote class="prompt-info">
  <p>한 줄: Lasso처럼 변수를 고르고, Ridge처럼 서로 상관된 변수를 같이 살립니다.</p>
</blockquote>

$$
\min_{\boldsymbol{\beta}}
\frac{1}{2n}\|\mathbf{y}-\mathbf{X}\boldsymbol{\beta}\|^2
+ \lambda\bigl(\alpha\|\boldsymbol{\beta}\|_1 + \tfrac{1-\alpha}{2}\|\boldsymbol{\beta}\|_2^2\bigr)
$$

- $$\lambda \ge 0$$: 벌점을 얼마나 줄지
- $$\alpha \in [0,1]`: L1과 L2의 비율
- $$\alpha=1$$: Lasso
- $$\alpha=0$$: Ridge

<mark>Elastic Net은 새로운 회귀식이 아니라, OLS 손실에 L1+L2 벌점을 더한 것입니다.</mark>

<details>
<summary>한 줄로</summary>

예측은 선형회귀와 같고, 계수를 줄이고 고르는 방식만 Ridge와 Lasso를 섞습니다.

</details>

## 왜 중간이 필요한가

Ridge: 계수를 0에 가깝게만 줄임. 변수 선택을 못 함.  
Lasso: 계수를 진짜 0으로 만들어 변수를 고름.

Lasso만 쓰면 생기는 구멍:

1. 변수끼리 상관이 크면 **하나만** 고르고 나머지는 버림
2. $$p > n$$이면 최대 $$n$$개 정도만 고를 수 있음
3. 변수가 많을 때 경로가 불안정

Ridge만 쓰면 생기는 구멍:

- 필요 없는 변수도 0이 안 됨
- 해석용 변수 선택이 안 됨

Elastic Net은 둘을 동시에 써서 이 구멍을 메웁니다.

<blockquote class="prompt-warning">
  <p>상관된 변수 그룹이 있으면 Lasso는 그중 하나, Elastic Net은 그룹을 같이 남기는 경향이 있습니다.</p>
</blockquote>

## 벌점이 하는 일

OLS만:

$$
\min \|\mathbf{y}-\mathbf{X}\boldsymbol{\beta}\|^2
$$

여기 더하는 것:

$$
\lambda\alpha\sum_j |\beta_j|
+ \lambda\frac{1-\alpha}{2}\sum_j \beta_j^2
$$

| 항 | 효과 |
| --- | --- |
| L1 $$\|\beta\|_1$$ | 작은 계수를 0으로. 변수 선택 |
| L2 $$\|\beta\|_2^2$$ | 계수를 골고루 줄임. 공선성에 강함 |

기하로 보면 Lasso 제약 영역은 마름모, Ridge는 원, Elastic Net은 **둥근 마름모**입니다.  
꼭짓점이 있어 0에 닿고, 모서리가 둥글어 상관된 계수를 같이 줄입니다.

## 이름 주의: $$\alpha$$가 두 뜻

시험·라이브러리가 단어를 바꿔 씁니다.

**glmnet / 통계 쪽**

- $$\lambda$$: 전체 벌점 크기
- $$\alpha$$: L1 비율. $$1$$=Lasso, $$0$$=Ridge

**sklearn**

- `alpha`: 전체 벌점 크기 (위의 $$\lambda$$)
- `l1_ratio`: L1 비율 (위의 $$\alpha$$)

<blockquote class="prompt-danger">
  <p>sklearn의 `alpha`를 glmnet의 $$\alpha$$로 읽으면 완전히 다른 값이 됩니다.</p>
</blockquote>

이 글의 식은 glmnet 표기입니다.

## 언제 쓰나

- 변수가 많고 서로 상관됨
- 변수 선택도 하고 싶음
- $$p$$가 $$n$$보다 큼
- Lasso가 변수 하나를 너무 과감하게 버릴 때

잘 안 쓰는 때:

- 변수 몇 개뿐이고 공선성도 약함 → OLS
- 선택 없이 예측만, 상관만 문제 → Ridge
- 아주 희소한 해만 필요 → Lasso

## 반드시 표준화

벌점은 $$|\beta_j|$$, $$\beta_j^2$$의 크기입니다.  
단위가 km인 변수와 mm인 변수를 같이 넣으면 벌점이 단위를 차별합니다.

<mark>Ridge / Lasso / Elastic Net은 설명변수를 표준화한 뒤 적합합니다.</mark>

$$y$$를 표준화할지 여부는 구현마다 다릅니다.  
절편에는 보통 벌점을 안 줍니다.

## 하이퍼파라미터

두 개를 같이 고릅니다.

1. $$\lambda$$: 커질수록 계수가 더 줄어듦. $$0$$이면 OLS에 가까움
2. $$\alpha$$: $$1$$에 가까울수록 Lasso, $$0$$에 가까울수록 Ridge

보통 교차검증으로 고릅니다.  
학습 SSE만 보면 $$\lambda=0$$이 이깁니다.

경로(path): $$\lambda$$를 크게 → 작게 바꾸며 계수가 0에서 살아나는 그림.  
Lasso보다 Elastic Net 경로가 그룹 단위로 붙는 경우가 많습니다.

## 로지스틱에도 붙는다

손실만 바꾸면 됩니다.

- 선형: SSE + Elastic Net 벌점
- 로지스틱: 로그손실 + Elastic Net 벌점

분류에서 변수가 많을 때도 같은 이유입니다.

## 다른 모델과의 위치

| 모델 | 벌점 | 계수를 0으로 | 상관 그룹 |
| --- | --- | --- | --- |
| OLS | 없음 | 안 함 | 약함 |
| Ridge | L2 | 안 함 | 잘 나눔 |
| Lasso | L1 | 함 | 하나만 고르기 쉬움 |
| Elastic Net | L1+L2 | 함 | 같이 남기기 쉬움 |

다항회귀에서 $$x, x^2, x^3$$가 겹칠 때도 Elastic Net을 쓸 수 있습니다.

## 잘 놓치는 핵심

### 1. 예측식은 여전히 선형

$$
\hat{y}=\hat{\beta}_0+\hat{\beta}_1 x_1+\cdots+\hat{\beta}_p x_p
$$

굽은 관계를 만드는 모델이 아닙니다.

### 2. $$\lambda=0$$이면 OLS

벌점이 있어야 Elastic Net입니다.

### 3. 표준화 없이 돌리면 단위가 변수 선택을 결정

큰 숫자 변수가 살아남거나 죽는 이유가 중요도가 아닐 수 있습니다.

### 4. Lasso의 하위호환

$$\alpha=1$$이면 Lasso와 같습니다. 따로 외울 식이 아닙니다.

### 5. 인과 모형이 아님

0이 된 변수 = 원인 없음, 이 아닙니다.  
상관·스케일·$$\lambda$$에 따라 잘립니다.

## 시험·면접

<blockquote class="prompt-info">
  <p>단골: L1 vs L2 차이, Lasso가 상관 변수에서 하나를 고르는 문제, Elastic Net이 그 보완, 표준화 필요.</p>
</blockquote>

자주 나오는 문장:

- L2는 축소, L1은 축소+선택
- Elastic Net = L1 + L2
- $$p>n$$에서 Lasso 제한을 Elastic Net이 완화

## 숫자 직관

두 변수 $$x_1, x_2$$가 거의 같고 둘 다 $$y$$와 관련됨.

- Lasso: $$\hat{\beta}_1$$만 남고 $$\hat{\beta}_2=0$$이 되기 쉬움
- Ridge: 둘 다 비슷한 작은 값
- Elastic Net: 둘 다 남기되 크기는 줄임

“어느 변수가 정답인가”가 아니라 “같이 움직이는 묶음”을 살리는 쪽입니다.

## 객관식 5문제

**1.** Elastic Net 벌점은?

- ① L1만
- ② L2만
- ③ L1과 L2를 섞음
- ④ SST만

<details>
<summary>정답</summary>

③

</details>

**2.** glmnet 표기에서 $$\alpha=1$$이면?

- ① Ridge
- ② Lasso
- ③ OLS
- ④ PCA

<details>
<summary>정답</summary>

②

</details>

**3.** 상관된 변수 여러 개를 Lasso에 넣으면 자주 일어나는 일은?

- ① 모두 동일한 큰 계수
- ② 그중 일부만 남기고 나머지를 0으로
- ③ SSE가 음수
- ④ $$y$$가 범주가 됨

<details>
<summary>정답</summary>

②

</details>

**4.** Ridge/Lasso/Elastic Net을 쓰기 전에 할 일은?

- ① $$y$$를 삭제
- ② 설명변수 표준화
- ③ 차수를 $$n-1$$로
- ④ 더미를 $$k$$개 모두+절편

<details>
<summary>정답</summary>

②

</details>

**5.** sklearn `alpha`와 glmnet $$\alpha$$는?

- ① 항상 같은 뜻
- ② 다를 수 있음. sklearn `alpha`는 벌점 크기
- ③ 둘 다 L1 비율만
- ④ 둘 다 학습률

<details>
<summary>정답</summary>

②

</details>

## 다음에 이을 글

거리 기반의 KNN입니다.  
식을 세우지 않고, 가까운 점의 정답을 빌려 옵니다.
