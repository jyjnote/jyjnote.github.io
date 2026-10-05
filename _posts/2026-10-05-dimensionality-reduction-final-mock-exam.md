---
title: 차원 축소 파이널 모의고사
date: 2026-10-05 18:30:00 +0900
slug: dimensionality-reduction-final-mock-exam
permalink: /posts/dimensionality-reduction-final-mock-exam/
categories: [AI, 머신러닝]
tags: [차원축소, PCA, KernelPCA, SVD, tSNE, UMAP, NMF, ICA, 필기시험]
math: true
---

PCA · Kernel PCA · SVD · t-SNE · UMAP · NMF · ICA를 계산형과 개념 혼합형으로 점검하는 파이널 모의고사입니다.

<blockquote class="prompt-info">
<p>한 줄: PCA는 분산, Kernel PCA는 비선형 구조, SVD는 저랭크, t-SNE·UMAP은 이웃, NMF는 양의 부분, ICA는 독립 신호를 묻습니다.</p>
</blockquote>

<details>
<summary>풀이 방법</summary>
정답을 먼저 가리고 풉니다.  
계산형은 숫자를 직접 적어 보고, 개념형은 “무엇을 보존하려는 방법인가”를 먼저 떠올립니다.
</details>

# 1. PCA
## 문제 1
두 변수의 평균이 다음과 같습니다.
```text
평균 = (3, 5)
관측값 = (7, 9)
```
PCA에 넣기 전 평균을 제거한 벡터는?
① (3, 4)  
② (4, 4)  
③ (7, 9)  
④ (10, 14)

<details>
<summary>정답 및 풀이</summary>
②. 각 변수 평균을 빼므로 \((7-3,9-5)=(4,4)\)입니다.
</details>

## 문제 2
평균 제거된 관측값이
$$x=(2,2)$$
이고 첫 번째 주성분 방향이
$$v_1=\left(\frac{1}{\sqrt2},\frac{1}{\sqrt2}\right)$$
일 때 첫 번째 주성분 점수는?
① \(\sqrt2\)  
② \(2\)  
③ \(2\sqrt2\)  
④ \(4\)

<details>
<summary>정답 및 풀이</summary>
③. $$z=x^\top v_1=2\sqrt2$$
</details>

## 문제 3
PCA 고유값이 다음과 같습니다.
```text
λ₁ = 6
λ₂ = 3
λ₃ = 1
```
첫 번째 주성분의 설명분산비는?
① 10%  
② 30%  
③ 60%  
④ 90%

<details>
<summary>정답 및 풀이</summary>
③. $$6/(6+3+1)=0.6$$
</details>

## 문제 4
문제 3에서 첫 두 주성분의 누적 설명분산비는?
① 60%  
② 70%  
③ 90%  
④ 100%

<details>
<summary>정답 및 풀이</summary>
③. $$(6+3)/10=0.9$$
</details>

## 문제 5
PCA에 대한 설명으로 틀린 것은?
① 라벨을 사용하지 않는다.  
② 첫 주성분은 분산이 가장 큰 방향이다.  
③ 주성분은 원래 변수 중 하나를 그대로 선택한다.  
④ 서로 다른 주성분은 직교한다.

<details>
<summary>정답 및 풀이</summary>
③. 주성분은 원래 변수들의 선형결합입니다.
</details>

## 문제 6
다음 두 변수의 범위가 크게 다릅니다.
```text
키: 150 ~ 190
소득: 2,000 ~ 20,000
```
PCA 전에 가장 먼저 점검할 것은?
① 클래스 수  
② 변수 스케일  
③ 라벨 불균형  
④ 혼동행렬

<details>
<summary>정답 및 풀이</summary>
②. 분산이 큰 단위의 변수가 주성분을 지배할 수 있으므로 표준화를 고려합니다.
</details>

# 2. Kernel PCA
## 문제 7
RBF 커널에서 두 점이 완전히 같을 때 커널 값은?
$$k(x,x')=\exp(-\gamma\|x-x'\|^2)$$
① 0  
② 0.5  
③ 1  
④ \(\gamma\)

<details>
<summary>정답 및 풀이</summary>
③. 같은 점이면 거리가 0이므로 \(e^0=1\)입니다.
</details>

## 문제 8
두 점 사이 제곱거리가 4이고 \(\gamma=0.5\)일 때 RBF 커널 값은?
① \(e^{-1}\)  
② \(e^{-2}\)  
③ \(e^{-4}\)  
④ \(e^{-8}\)

<details>
<summary>정답 및 풀이</summary>
②. $$k=e^{-2}$$
</details>

## 문제 9
RBF Kernel PCA에서 \(\gamma\)를 매우 크게 하면 가장 적절한 설명은?
① 먼 점까지 강하게 비슷하다고 본다.  
② 가까운 점만 강하게 비슷하다고 본다.  
③ 반드시 선형 PCA와 같아진다.  
④ 라벨을 더 많이 사용한다.

<details>
<summary>정답 및 풀이</summary>
②. \(\gamma\)가 크면 거리 증가에 따라 커널 값이 빠르게 0으로 떨어집니다.
</details>

## 문제 10
Kernel PCA에 대한 설명으로 옳은 것은?
① \(\phi(x)\)를 반드시 직접 계산한다.  
② 커널 값으로 특징공간의 내적을 대신 계산할 수 있다.  
③ 지도학습 분류기이다.  
④ 커널 행렬 중심화는 필요 없다.

<details>
<summary>정답 및 풀이</summary>
②. 특징공간 벡터를 직접 만들지 않고 커널 값만 계산하는 것이 커널 트릭입니다.
</details>

# 3. SVD
## 문제 11
SVD의 기본 형태로 옳은 것은?
① \(A=UV\)  
② \(A=U\Sigma V^\top\)  
③ \(A=V\Sigma U\)  
④ \(A=\Sigma U^\top V\)

<details>
<summary>정답 및 풀이</summary>
②. $$A=U\Sigma V^\top$$
</details>

## 문제 12
특잇값이 다음과 같습니다.
```text
σ₁ = 5
σ₂ = 2
σ₃ = 0
```
행렬의 랭크는?
① 1  
② 2  
③ 3  
④ 5

<details>
<summary>정답 및 풀이</summary>
②. 0이 아닌 특잇값이 2개이므로 랭크는 2입니다.
</details>

## 문제 13
평균 제거된 데이터 행렬의 특잇값이 \(\sigma=6\), 표본 수가 \(n=5\)일 때 PCA 고유값은?
$$\lambda=\frac{\sigma^2}{n-1}$$
① 3  
② 6  
③ 9  
④ 36

<details>
<summary>정답 및 풀이</summary>
③. $$\lambda=36/4=9$$
</details>

## 문제 14
저랭크 근사에서 일반적으로 먼저 남기는 성분은?
① 가장 작은 특잇값  
② 가장 큰 특잇값  
③ 음수 특잇값  
④ 특잇값과 무관한 임의 성분

<details>
<summary>정답 및 풀이</summary>
②. 큰 특잇값에 해당하는 방향이 행렬의 주요 구조를 더 많이 담습니다.
</details>

## 문제 15
SVD에 대한 설명으로 틀린 것은?
① 직사각형 행렬에도 적용할 수 있다.  
② 특잇값은 0 이상이다.  
③ PCA 계산과 연결된다.  
④ 특잇값은 항상 공분산 고유값과 동일하다.

<details>
<summary>정답 및 풀이</summary>
④. PCA 고유값은 표본 공분산 기준으로 \(\lambda=\sigma^2/(n-1)\) 관계를 가집니다.
</details>

# 4. t-SNE
## 문제 16
t-SNE가 가장 직접적으로 보존하려는 것은?
① 전체 분산  
② 클래스 평균 차이  
③ 가까운 점들의 이웃 관계  
④ 원래 변수의 단위

<details>
<summary>정답 및 풀이</summary>
③.
</details>

## 문제 17
t-SNE에서 퍼플렉서티를 작게 설정했을 때 일반적인 경향은?
① 매우 가까운 이웃을 강조한다.  
② 전역 구조만 본다.  
③ PCA와 동일해진다.  
④ 축의 의미가 생긴다.

<details>
<summary>정답 및 풀이</summary>
①. 작은 퍼플렉서티는 더 국소적인 이웃을 강조하는 방향입니다.
</details>

## 문제 18
t-SNE 그림에서 가장 위험한 해석은?
① 가까운 점끼리 묶였는지 본다.  
② 군집 내부의 이웃 관계를 본다.  
③ 서로 다른 군집 사이의 절대 거리를 직접 비교한다.  
④ 시각적 패턴을 탐색한다.

<details>
<summary>정답 및 풀이</summary>
③. 군집 사이 거리를 실제 원공간 거리처럼 해석하면 안 됩니다.
</details>

# 5. UMAP
## 문제 19
UMAP에서 `n_neighbors`가 주로 조절하는 것은?
① 한 점이 바라보는 이웃 범위  
② 행렬의 랭크  
③ 클래스 수  
④ PCA 고유값

<details>
<summary>정답 및 풀이</summary>
①. 작으면 국소 구조, 크면 더 넓은 구조를 반영하는 경향이 있습니다.
</details>

## 문제 20
UMAP의 `min_dist`를 작게 하면 일반적으로?
① 같은 묶음의 점들이 더 빽빽하게 놓일 수 있다.  
② 모든 점이 멀어진다.  
③ 원래 차원이 증가한다.  
④ 라벨이 필요해진다.

<details>
<summary>정답 및 풀이</summary>
①.
</details>

## 문제 21
t-SNE와 비교한 UMAP의 특징으로 가장 적절한 것은?
① 새 점을 같은 임베딩으로 변환하는 기능을 사용할 수 있다.  
② 반드시 지도학습이다.  
③ 항상 선형이다.  
④ 공분산 고유벡터만 사용한다.

<details>
<summary>정답 및 풀이</summary>
①.
</details>

# 6. NMF
## 문제 22
다음 중 NMF에 그대로 넣기 가장 자연스러운 데이터는?
① 평균 제거 후 음수가 많이 생긴 행렬  
② 단어 빈도처럼 모든 값이 0 이상인 행렬  
③ 클래스 라벨만 있는 벡터  
④ 부호가 중요한 독립 신호

<details>
<summary>정답 및 풀이</summary>
②. NMF는 입력과 분해 행렬의 비음수 조건을 사용합니다.
</details>

## 문제 23
문서 100개, 단어 500개인 행렬을 성분 20개로 NMF 한다고 합시다.
$$X\approx WH$$
\(W\)와 \(H\)의 크기로 옳은 것은?
① \(W:100\times20,\ H:20\times500\)  
② \(W:20\times100,\ H:500\times20\)  
③ 둘 다 \(100\times500\)  
④ 둘 다 \(20\times20\)

<details>
<summary>정답 및 풀이</summary>
①. $$X_{100\times500}\approx W_{100\times20}H_{20\times500}$$
</details>

## 문제 24
NMF와 PCA의 차이로 옳은 것은?
① PCA는 음수를 사용할 수 있지만 NMF는 비음수 제약이 있다.  
② NMF는 반드시 직교 성분을 만든다.  
③ PCA는 라벨을 사용한다.  
④ NMF는 독립성을 최대화한다.

<details>
<summary>정답 및 풀이</summary>
①.
</details>

# 7. ICA
## 문제 25
두 독립 신호가 다음 혼합을 거쳐 관측됩니다.
$$x_1=0.8s_1+0.2s_2$$
$$x_2=0.3s_1+0.7s_2$$
어떤 순간 \(s_1=2,\ s_2=0\)이면 관측값은?
① \((0.8,0.3)\)  
② \((1.6,0.6)\)  
③ \((2,0)\)  
④ \((1,1)\)

<details>
<summary>정답 및 풀이</summary>
②. \(x_1=1.6,\ x_2=0.6\).
</details>

## 문제 26
ICA가 PCA보다 더 강하게 요구하는 관계는?
① 평균 0  
② 무상관  
③ 독립  
④ 동일 분산

<details>
<summary>정답 및 풀이</summary>
③. 독립이면 무상관이지만 무상관이라고 반드시 독립은 아닙니다.
</details>

## 문제 27
ICA의 화이트닝에 대한 설명으로 옳은 것은?
① 화이트닝 자체가 ICA의 최종 독립분리이다.  
② 평균 0, 분산 1, 공분산 0에 가깝게 만드는 전처리다.  
③ 클래스 라벨을 추가하는 과정이다.  
④ 모든 성분을 정규분포로 만드는 과정이다.

<details>
<summary>정답 및 풀이</summary>
②. 화이트닝은 ICA 전처리이며, 그 뒤 추가 회전으로 독립성을 찾습니다.
</details>

# 8. 개념 혼합
## 문제 28
다음 연결 중 틀린 것은?
① PCA → 전체 분산  
② Kernel PCA → 비선형 구조  
③ NMF → 양의 부분 기반 표현  
④ ICA → 클래스 사이 산포 최대화

<details>
<summary>정답 및 풀이</summary>
④. 클래스 사이 산포 최대화는 선형판별분석의 핵심입니다. ICA는 독립 성분을 찾습니다.
</details>

## 문제 29
다음 상황에 가장 적절한 방법은?
```text
마이크 여러 개에 두 사람 목소리가 섞여 녹음되었다.
원래 독립 목소리를 분리하고 싶다.
```
① PCA  
② ICA  
③ t-SNE  
④ Kernel PCA

<details>
<summary>정답 및 풀이</summary>
②.
</details>

## 문제 30
다음 상황에 가장 적절한 방법은?
```text
문서-단어 빈도 행렬이 모두 0 이상이다.
몇 개의 부분 주제로 문서를 표현하고 싶다.
```
① NMF  
② ICA  
③ t-SNE  
④ QDA

<details>
<summary>정답 및 풀이</summary>
①.
</details>

# 잘 놓치는 핵심
- PCA는 평균 제거가 기본입니다.
- PCA의 고유값은 주성분 분산입니다.
- 설명분산비는 고유값 비율입니다.
- Kernel PCA는 라벨을 사용하지 않습니다.
- RBF의 \(\gamma\)가 크면 매우 가까운 점만 강하게 연결합니다.
- Kernel PCA에서는 커널 행렬 중심화가 중요합니다.
- SVD 특잇값은 0 이상입니다.
- PCA 고유값과 SVD 특잇값은 동일한 숫자가 아닙니다.
- t-SNE는 이웃 관계를 우선합니다.
- t-SNE 군집 사이 거리를 절대거리처럼 해석하지 않습니다.
- UMAP의 `n_neighbors`는 이웃 범위입니다.
- UMAP의 `min_dist`는 저차원 내부 밀집 정도와 관련됩니다.
- NMF는 비음수 제약이 핵심입니다.
- NMF 성분은 직교할 필요가 없습니다.
- ICA는 무상관보다 강한 독립을 목표로 합니다.
- 화이트닝은 ICA 전체가 아니라 전처리입니다.
- ICA 성분의 순서·부호·크기는 달라질 수 있습니다.

# 시험 직전 1분 압축
```text
PCA
→ 평균 제거
→ 공분산
→ 고유벡터
→ 분산 최대
Kernel PCA
→ 커널
→ 비선형 특징공간
→ 커널 행렬 중심화
SVD
→ UΣVᵀ
→ 큰 특잇값
→ 저랭크 근사
t-SNE
→ 가까운 점
→ 퍼플렉서티
→ 시각화
UMAP
→ 이웃 그래프
→ n_neighbors
→ min_dist
NMF
→ X ≈ WH
→ 모두 0 이상
→ 부분 기반
ICA
→ x = As
→ 화이트닝
→ 독립 성분
```

<blockquote class="prompt-info">
<p>암기: 분산이면 PCA, 휘어진 분산이면 Kernel PCA, 행렬 압축이면 SVD, 이웃 그림이면 t-SNE·UMAP, 양의 부분이면 NMF, 독립 신호면 ICA입니다.</p>
</blockquote>
