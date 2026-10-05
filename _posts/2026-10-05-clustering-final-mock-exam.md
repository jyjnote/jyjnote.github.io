---
title: 군집 알고리즘 파이널 모의고사
date: 2026-10-05 18:20:00 +0900
slug: clustering-final-mock-exam
permalink: /posts/clustering-final-mock-exam/
categories: [AI, 머신러닝]
tags: [군집, KMeans, KMedoids, KModes, KPrototypes, 계층적군집, DBSCAN, MeanShift, SpectralClustering, 필기시험]
math: true
---

군집 알고리즘을 실제 수치 데이터와 개념 혼합 문제로 점검하는 파이널 모의고사입니다.  
계산형은 손으로 풀 수 있는 크기로 구성하고, 개념형은 공기업·전산직 필기에서 헷갈리기 쉬운 차이를 중심으로 묶었습니다.

<blockquote class="prompt-info">
<p>한 줄: 중심·대표점·범주 불일치·링키지·밀도·봉우리·그래프 연결을 계산과 개념으로 동시에 구분합니다.</p>
</blockquote>

<details>
<summary>풀이 방법</summary>
먼저 정답을 가리고 풉니다.  
계산 문제에서는 제곱거리, 거리 합, 이웃 수, 평균 이동, 라플라시안 행렬을 직접 적어 보는 것이 좋습니다.
</details>

# 1. K-means
## 문제 1
다음 네 점을 \(K=2\)로 K-means 군집하려고 합니다.
| 점 | 좌표 |
| --- | --- |
| A | (1, 1) |
| B | (1, 2) |
| C | (4, 4) |
| D | (5, 4) |
초기 중심이 \(\mu_1=A\), \(\mu_2=C\)일 때 첫 배정 결과로 옳은 것은?
① {A, C}, {B, D}    
② {A, B}, {C, D}    
③ {A, D}, {B, C}    
④ {A}, {B, C, D}

<details>
<summary>정답 및 풀이</summary>
②. 제곱거리 순위로 A·B는 \(\mu_1\), C·D는 \(\mu_2\)에 배정됩니다.
</details>

## 문제 2
문제 1의 첫 배정 뒤 새 중심은?
① \((1,1.5)\), \((4.5,4)\)    
② \((1,2)\), \((5,4)\)    
③ \((2,2)\), \((4,4)\)    
④ \((2.5,2.5)\), \((4.5,4)\)

<details>
<summary>정답 및 풀이</summary>
①. $$\mu_1=(1,1.5),\qquad \mu_2=(4.5,4)$$
</details>

## 문제 3
문제 2의 새 중심을 기준으로 군집 내부 제곱거리 합은?
① 0.5    
② 1    
③ 2    
④ 4

<details>
<summary>정답 및 풀이</summary>
②. 각 점의 제곱거리가 모두 0.25이므로 $$J=0.25\times4=1$$ <mark>K-means의 목적함수에는 루트 거리가 아니라 제곱거리를 더합니다.</mark>
</details>

## 문제 4
다음은 같은 데이터에 대해 K를 바꾸며 얻은 군집 내부 제곱거리 합입니다.
| K | J |
| ---: | ---: |
| 1 | 120 |
| 2 | 70 |
| 3 | 40 |
| 4 | 35 |
| 5 | 32 |
엘보우 관점에서 가장 먼저 고려할 K는?
① 1    
② 2    
③ 3    
④ 5

<details>
<summary>정답 및 풀이</summary>
③. K=3까지는 감소 폭이 크지만 그 이후 감소 폭이 급격히 작아집니다. 따라서 꺾이는 지점인 K=3을 우선 후보로 볼 수 있습니다.
</details>

# 2. K-medoids
## 문제 5
한 군집 안의 1차원 데이터가 다음과 같습니다.
```text
1, 2, 4
```
거리 합이 가장 작은 메도이드는?
① 1    
② 2    
③ 4    
④ 평균 7/3

<details>
<summary>정답 및 풀이</summary>
②. 각 점을 대표로 둘 때 거리 합은 ```text 1 → 0 + 1 + 3 = 4 2 → 1 + 0 + 2 = 3 4 → 3 + 2 + 0 = 5 ``` 따라서 실제 데이터 점 2가 메도이드입니다. 평균 \(7/3\)은 실제 관측점이 아니므로 메도이드 후보가 아닙니다.
</details>

## 문제 6
이상치가 많고 “대표 고객 한 명”을 직접 제시해야 하는 상황에서 K-means보다 먼저 고려하기 좋은 방법은?
① K-medoids    
② Mean Shift    
③ K-modes    
④ Spectral Clustering

<details>
<summary>정답 및 풀이</summary>
①. K-medoids는 실제 데이터 점을 대표로 사용하고 평균보다 이상치의 영향을 상대적으로 덜 받습니다.
</details>

# 3. K-modes · K-prototypes
## 문제 7
다음 고객들의 범주형 정보가 한 군집에 들어 있습니다.
| 고객 | 지역 | 요금제 |
| --- | --- | --- |
| A | 서울 | 기본 |
| B | 서울 | 기본 |
| C | 부산 | 기본 |
| D | 서울 | 프리미엄 |
이 군집의 K-modes 중심은?
① 서울, 기본    
② 부산, 기본    
③ 서울, 프리미엄    
④ 평균 지역, 평균 요금제

<details>
<summary>정답 및 풀이</summary>
①. 지역 최빈값은 서울, 요금제 최빈값은 기본입니다. 따라서 모드는 `(서울, 기본)`입니다.
</details>

## 문제 8
두 고객의 정보가 다음과 같습니다.
```text
A = (서울, 남, 기본)
B = (서울, 여, 프리미엄)
```
K-modes의 단순 불일치 거리는?
① 0    
② 1    
③ 2    
④ 3

<details>
<summary>정답 및 풀이</summary>
③. 지역은 같고 성별과 요금제가 다릅니다. 따라서 다른 열의 개수는 2입니다.
</details>

## 문제 9
숫자형 변수와 범주형 변수가 함께 있는 고객 데이터를 군집하려고 합니다.
가장 직접적인 방법은?
① K-means    
② K-modes    
③ K-prototypes    
④ 단일 연결만 가능

<details>
<summary>정답 및 풀이</summary>
③. K-prototypes는 숫자형 부분에는 평균·거리, 범주형 부분에는 최빈값·불일치를 함께 사용합니다.
</details>

# 4. 계층적 군집
## 문제 10
1차원에서 두 군집이 다음과 같습니다.
```text
A = {0, 2}
B = {5, 9}
```
단일 연결 거리는?
① 3    
② 5    
③ 7    
④ 9

<details>
<summary>정답 및 풀이</summary>
①. 모든 쌍의 거리는 5, 9, 3, 7입니다. 단일 연결은 가장 가까운 한 쌍만 보므로 $$D(A,B)=3$$ 입니다.
</details>

## 문제 11
같은 두 군집의 완전 연결 거리는?
① 3    
② 5    
③ 7    
④ 9

<details>
<summary>정답 및 풀이</summary>
④. 완전 연결은 가장 먼 점 쌍의 거리를 사용합니다. 따라서 9입니다.
</details>

## 문제 12
같은 두 군집의 평균 연결 거리는?
① 4    
② 5    
③ 6    
④ 7

<details>
<summary>정답 및 풀이</summary>
③. $$\frac{5+9+3+7}{4}=6$$ 입니다.
</details>

## 문제 13
다음 두 군집을 Ward 방식으로 합친다고 합시다.
```text
A = {0, 2}
B = {6, 8}
```
합치기 전 각 군집의 SSE 합은 4이고, 합친 뒤 SSE가 40이라면 Ward가 보는 증가는?
① 4    
② 18    
③ 36    
④ 40

<details>
<summary>정답 및 풀이</summary>
③. Ward는 합친 뒤 SSE 자체가 아니라 **증가량**을 봅니다. $$40-4=36$$ 입니다.
</details>

## 문제 14
계층적 군집에 대한 설명으로 틀린 것은?
① 병합식은 각 점을 하나의 군집으로 시작할 수 있다.    
② 단일 연결은 사슬 효과가 나타날 수 있다.    
③ 덴드로그램 높이는 단순 반복 횟수이다.    
④ Ward는 SSE 증가와 연결된다.

<details>
<summary>정답 및 풀이</summary>
③. 덴드로그램 높이는 단순한 시간 순서가 아니라 군집이 합쳐질 때의 거리 또는 연결 기준의 크기를 나타냅니다.
</details>

# 5. DBSCAN
## 문제 15
1차원 데이터가 다음과 같습니다.
```text
0, 0.4, 0.8, 2.0, 5.0
```
\(\varepsilon=0.5\), 최소 표본 수가 3이고 자기 자신도 이웃 수에 포함합니다.
핵심점은?
① 0만    
② 0.4만    
③ 0.4와 0.8    
④ 모두

<details>
<summary>정답 및 풀이</summary>
②. 이웃 수는 각각 2, 3, 2, 1, 1이므로 최소 표본 수 3을 만족하는 핵심점은 0.4 하나입니다.
</details>

## 문제 16
문제 15에서 0과 0.8의 상태는?
① 둘 다 핵심점    
② 둘 다 경계점    
③ 둘 다 노이즈    
④ 0은 경계, 0.8은 노이즈

<details>
<summary>정답 및 풀이</summary>
②. 0과 0.8은 핵심점 0.4의 반경 안에 있으므로 경계점이며, 2.0과 5.0은 노이즈입니다.
</details>

## 문제 17
문제 15에서 \(\varepsilon\)을 1.3으로 키우고 최소 표본 수는 3으로 유지했습니다.
2.0의 상태로 가장 적절한 것은?
① 핵심점    
② 경계점    
③ 반드시 노이즈    
④ 군집 수 K가 없어서 판단 불가

<details>
<summary>정답 및 풀이</summary>
②. \(\varepsilon=1.3\)에서는 0.8이 핵심점이 되고 2.0은 그 반경 안에 들어가므로 경계점입니다.
</details>

# 6. Mean Shift
## 문제 18
1차원 데이터가 다음과 같습니다.
```text
3, 4, 5, 8
```
현재 위치가 \(x=5\), bandwidth가 \(h=2\)이고 평평한 창을 사용한다고 합시다.
한 번 이동한 위치는?
① 3    
② 4    
③ 5    
④ 20/4

<details>
<summary>정답 및 풀이</summary>
②. 거리 2 이하인 점은 3, 4, 5이므로 $$x\leftarrow\frac{3+4+5}{3}=4$$
</details>

## 문제 19
Mean Shift에서 bandwidth를 지나치게 크게 하면 나타날 가능성이 가장 높은 것은?
① 작은 봉우리가 더 많이 생김    
② 여러 봉우리가 하나로 합쳐짐    
③ 모든 점이 DBSCAN 노이즈가 됨    
④ K를 직접 지정해야 함

<details>
<summary>정답 및 풀이</summary>
②. 넓은 범위의 점을 한꺼번에 평균 내므로 서로 가까운 봉우리들이 합쳐질 수 있습니다.
</details>

# 7. Spectral Clustering
## 문제 20
세 점의 유사도 행렬이 다음과 같습니다.
$$
W=
\begin{bmatrix}
0&1&0\\
1&0&2\\
0&2&0
\end{bmatrix}
$$
차수 행렬 \(D\)는?
① \(\operatorname{diag}(1,3,2)\)    
② \(\operatorname{diag}(0,0,0)\)    
③ \(\operatorname{diag}(1,2,1)\)    
④ \(\operatorname{diag}(3,3,3)\)

<details>
<summary>정답 및 풀이</summary>
①. 각 행의 합이 1, 3, 2이므로 \(D=\operatorname{diag}(1,3,2)\)입니다.
</details>

## 문제 21
문제 20의 비정규 그래프 라플라시안 \(L=D-W\)는?
①
$$
\begin{bmatrix}
1&-1&0\\
-1&3&-2\\
0&-2&2
\end{bmatrix}
$$
②
$$
\begin{bmatrix}
0&1&0\\
1&0&2\\
0&2&0
\end{bmatrix}
$$
③
$$
\begin{bmatrix}
1&1&0\\
1&3&2\\
0&2&2
\end{bmatrix}
$$
④ 단위행렬

<details>
<summary>정답 및 풀이</summary>
①. $$L=D-W$$ 이므로 대각에는 차수가 들어가고 연결 가중치는 음수로 들어갑니다.
</details>

## 문제 22
Spectral Clustering의 일반적인 흐름으로 가장 적절한 것은?
① 평균 → 중앙값 → 모드    
② 유사도 그래프 → 라플라시안 → 고유벡터 → 새 공간에서 군집    
③ 핵심점 → 경계점 → 노이즈 → 평균    
④ 최빈값 → 불일치 → 덴드로그램

<details>
<summary>정답 및 풀이</summary>
②. 원래 공간에서 잘 나뉘지 않는 달 모양 등의 구조를 그래프 연결 관점에서 새 좌표로 펼친 뒤 군집합니다.
</details>

# 8. 개념 혼합 문제
## 문제 23
다음 상황과 가장 적절한 알고리즘의 연결로 틀린 것은?
① 범주형 변수만 존재 → K-modes    
② 숫자형과 범주형 혼합 → K-prototypes    
③ 군집 수를 모르고 노이즈도 따로 보고 싶음 → DBSCAN    
④ 달 모양이고 그래프 연결 구조가 중요함 → K-means만 가능

<details>
<summary>정답 및 풀이</summary>
④. 달 모양처럼 비선형 구조는 Spectral Clustering이나 밀도 기반 방법이 더 자연스러울 수 있습니다.
</details>

## 문제 24
다음 설명 중 옳은 것은?
① K-means와 DBSCAN 모두 군집 수 K를 반드시 입력한다.    
② K-medoids의 중심은 데이터에 없는 좌표여도 된다.    
③ Mean Shift의 bandwidth는 주변을 얼마나 넓게 볼지 결정한다.    
④ Spectral Clustering은 그래프를 사용하지 않는다.

<details>
<summary>정답 및 풀이</summary>
③. Mean Shift의 bandwidth는 주변 평균을 계산할 범위를 결정합니다.
</details>

## 문제 25
다음 중 **대표 또는 핵심 구조**의 연결이 모두 옳은 것은?
① K-means-평균 / K-medoids-실제 점 / K-modes-최빈값    
② K-means-최빈값 / DBSCAN-평균 중심 / Mean Shift-메도이드    
③ K-modes-평균 / Spectral-중앙값 / DBSCAN-K개의 중심    
④ K-prototypes-범주형만 / 계층적-평균 중심만

<details>
<summary>정답 및 풀이</summary>
①. 세 방법의 대표값 차이는 매우 자주 출제되는 구분입니다.
</details>

# 9. 종합 판단 문제
## 문제 26
고객 데이터를 군집하려고 합니다.
```text
연령: 20~70
연소득: 2,000~20,000
방문횟수: 1~20
```
이 데이터를 K-means로 바로 군집할 때 가장 먼저 점검할 것은?
① 정답 라벨    
② 변수 스케일    
③ 클래스 사전확률    
④ 판별축 개수

<details>
<summary>정답 및 풀이</summary>
②. 거리 기반 군집에서는 큰 단위의 변수가 거리를 지배할 수 있으므로 스케일을 먼저 확인해야 합니다.
</details>

## 문제 27
다음 중 K를 미리 직접 지정하지 않고 시작할 수 있는 방법만으로 묶인 것은?
① K-means, K-medoids    
② DBSCAN, Mean Shift    
③ K-modes, Spectral Clustering    
④ K-prototypes, K-means

<details>
<summary>정답 및 풀이</summary>
②. DBSCAN은 \(\varepsilon\)과 최소 표본 수, Mean Shift는 bandwidth를 사용합니다. 계층적 군집도 트리 생성 자체는 K 없이 시작할 수 있지만 최종 절단 수준은 별도로 정합니다.
</details>

## 문제 28
다음 설명 중 틀린 것은?
① K-means에서 K를 늘리면 SSE는 일반적으로 감소한다.    
② K=N이면 K-means SSE가 0이 될 수 있다.    
③ DBSCAN의 노이즈는 반드시 알고리즘 실패를 뜻한다.    
④ Spectral Clustering은 그래프 라플라시안의 고유벡터를 이용할 수 있다.

<details>
<summary>정답 및 풀이</summary>
③. DBSCAN에서 노이즈는 정상적인 결과입니다. 모든 점을 반드시 어느 군집에 넣는 알고리즘이 아닙니다.
</details>

# 잘 놓치는 핵심
- K-means는 분류 정확도가 아니라 군집 내부 제곱거리 합을 줄입니다.
- K-means 배정에서는 제곱거리만 비교해도 되지만 SSE에는 제곱거리를 더합니다.
- K-medoids의 대표는 반드시 실제 데이터 점입니다.
- K-modes는 범주별 최빈값과 불일치 개수를 사용합니다.
- K-prototypes는 숫자형과 범주형을 함께 다룹니다.
- 단일 연결은 최소 거리, 완전 연결은 최대 거리입니다.
- Ward는 합친 뒤 SSE의 증가를 봅니다.
- DBSCAN의 최소 표본 수 계산에는 자기 자신이 포함됩니다.
- DBSCAN의 노이즈 \(-1\)은 정상적인 결과입니다.
- Mean Shift의 bandwidth는 학습률이 아니라 주변 범위입니다.
- Spectral은 유사도 행렬 → 차수 행렬 → 라플라시안 → 고유벡터 흐름입니다.
- 거리 기반 방법은 변수 스케일의 영향을 크게 받습니다.

# 시험 직전 1분 압축
```text
평균 중심 + SSE
→ K-means
실제 대표점 + 거리 합
→ K-medoids
범주 최빈값 + 불일치
→ K-modes
숫자 + 범주
→ K-prototypes
링키지 + 덴드로그램
→ 계층적 군집
eps + 최소 표본 수 + 노이즈
→ DBSCAN
bandwidth + 밀도 봉우리
→ Mean Shift
W → D → L → 고유벡터
→ Spectral Clustering
```

<blockquote class="prompt-info">
<p>계산 문제에서는 “무엇을 합치는가”를 먼저 확인합니다. K-means는 제곱거리, K-medoids는 거리 합, DBSCAN은 이웃 수, Mean Shift는 주변 평균, Spectral은 그래프 행렬입니다.</p>
</blockquote>
