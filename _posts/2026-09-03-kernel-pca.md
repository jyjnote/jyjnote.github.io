---
title: Kernel PCA
date: 2026-09-03 13:30:00 +0900
slug: kernel-pca
permalink: /posts/kernel-pca/
categories: [AI, 머신러닝]
tags: [차원축소, PCA, 커널PCA, RBF, 커널트릭, 빅분기]
math: true
---
선형 PCA는 분산이 큰 **직선** 축만 찾습니다.
초승달처럼 휘어진 데이터는 축을 돌려도 안 펴집니다.
Kernel PCA는 점을 더 높은 차원의 $$\phi(x)$$로 보낸 뒤, 그 공간에서 PCA를 합니다.
$$\phi(x)$$ 자체는 안 만들고, 점 사이 커널 값 $$k(x,x')$$만 씁니다.

<blockquote class="prompt-info">
<p>Kernel PCA = 커널 행렬을 가운데 맞춘 뒤 고유분해하는 PCA. 선형 커널이면 보통 PCA와 같습니다. sklearn은 <code>sklearn.decomposition.KernelPCA</code>입니다. 차트는 <code>https://jyjnote.github.io/assets/plotly/kernel-pca-charts.html</code> 입니다.</p>
</blockquote>

## 선형 PCA가 못 하는 것

앞 글의 PCA는 공분산 $$S$$의 고유벡터를 축으로 씁니다.

$$
S v = \lambda v
$$

- $$S$$: 평균을 뺀 점들의 공분산
- $$v$$: 직선 축
- $$\lambda$$: 그 직선 위의 분산

초승달 두 개가 껴 있으면, 긴 방향은 달의 길이이고 두 클래스를 가르는 방향이 아닙니다.
축을 돌려도 달은 달입니다.

[차트 새 탭]({{ '/assets/plotly/kernel-pca-charts.html' | relative_url }}#orig)

<iframe src="{{ '/assets/plotly/kernel-pca-charts.html' | relative_url }}#orig" title="원래 초승달 좌표" width="100%" height="760" style="border:0;border-radius:12px;background:#f7f9fb" loading="lazy"></iframe>

탭 **1. 원래 좌표**가 그 데이터입니다.
탭 **2. 선형 PCA**로 넘기면 축만 바뀌고, 두 클래스가 여전히 겹칩니다.

## 사상 $$\phi$$와 커널 $$k$$

점을 $$\phi(x)$$로 보냅니다.
그 공간에서 평균을 빼고 PCA를 하면 됩니다.
문제는 $$\phi(x)$$의 차원이 매우 클 수 있다는 점입니다.

커널 함수는 두 점의 $$\phi$$ 내적만 줍니다.

$$
k(x,x')=\phi(x)^\top \phi(x')
$$

- $$x$$, $$x'$$: 원래 공간의 두 점. 예: 학생 A, 학생 B의 점수
- $$\phi(x)$$: 그 점을 보낸 벡터. 직접 계산하지 않음
- $$k(x,x')$$: 두 점이 새 공간에서 얼마나 같은 방향인지
- 자기 자신 $$k(x,x)=\lVert\phi(x)\rVert^2$$

$$\phi$$를 만들지 않고 $$k$$만 계산하는 것이 **커널 트릭**입니다.

자주 쓰는 커널:

$$
k_{\mathrm{lin}}(x,x') = x^\top x'
$$

$$
k_{\mathrm{poly}}(x,x') = (\gamma\, x^\top x' + c)^d
$$

$$
k_{\mathrm{rbf}}(x,x') = \exp(-\gamma\lVert x-x'\rVert^2)
$$

- $$k_{\mathrm{lin}}$$: 선형 커널. 그냥 PCA
- $$\gamma$$: 스케일. 다항에서는 내적에 곱하는 수, RBF에서는 거리 민감도
- $$c$$: 다항 커널의 상수항. 보통 1
- $$d$$: 다항 차수. $$d=2$$면 이차식까지 포함
- $$\lVert x-x'\rVert^2$$: 두 점 사이 거리의 제곱
- RBF: 거리가 0이면 $$k=1$$, 멀수록 $$k$$가 0에 가까움

선형 커널을 쓰면 Kernel PCA는 (스케일만 다를 수 있는) PCA와 같습니다.

RBF에서 $$\gamma$$가 하는 일:

- $$\gamma$$가 작음: 먼 점도 $$k$$가 큼. 거의 직선 PCA
- $$\gamma$$가 큼: 가까운 점만 $$k$$가 큼. 점 하나하나에 붙음

## 커널 행렬

학습 점 $$n$$개가 있으면 $$n \times n$$ 커널 행렬을 만듭니다.

$$
K_{ij}=k(x_i,x_j)
$$

- $$i$$, $$j$$: 학생 번호 1부터 $$n$$
- $$K_{ij}$$: i번과 j번의 커널 값
- 대각 $$K_{ii}=k(x_i,x_i)$$. RBF면 전부 1
- $$K$$는 대칭입니다. $$K_{ij}=K_{ji}$$

## 커널 행렬을 가운데 맞추기

입력에서 평균을 빼듯, $$\phi$$ 공간에서도 평균을 빼야 합니다.
$$\phi(x_i)$$를 안 만들므로 $$K$$를 고칩니다.

$$
\tilde{K}=K-\mathbf{1}_n K-K\mathbf{1}_n+\mathbf{1}_n K\mathbf{1}_n
$$

- $$\mathbf{1}_n$$: 모든 원소가 $$1/n$$인 $$n \times n$$ 행렬
- $$K\mathbf{1}_n$$: 각 행의 평균을 행마다 반복
- $$\mathbf{1}_n K$$: 각 열의 평균을 열마다 반복
- $$\mathbf{1}_n K\mathbf{1}_n$$: 전체 평균

원소로 쓰면

$$
\tilde{K}_{ij}=K_{ij}-\bar{K}_{i\cdot}-\bar{K}_{\cdot j}+\bar{K}
$$

- $$\bar{K}_{i\cdot}$$: i번 행의 평균. i번이 다른 점들과 맺는 커널의 평균
- $$\bar{K}_{\cdot j}$$: j번 열의 평균
- $$\bar{K}$$: $$K$$ 전체 평균

이 과정을 빼먹으면 원점과 $$\phi$$ 평균을 잇는 방향이 1축에 섞입니다.
선형 PCA에서 평균을 안 빼는 것과 같은 실수입니다.

## 고유분해와 스코어

가운데 맞춘 커널 행렬을 고유분해합니다.

$$
\tilde{K}\alpha_j=\lambda_j\alpha_j
$$

- $$\alpha_j$$: 길이 $$n$$인 고유벡터. j번째 주성분의 계수
- $$\lambda_j$$: 고유값. $$\phi$$ 공간에서 그 축의 분산에 해당
- $$\alpha_j$$는 보통 $$\alpha_j^\top\alpha_j=1$$로 정규화

학습 점 $$x_i$$의 j번째 Kernel PCA 좌표:

$$
z_{ij}=\sqrt{\lambda_j}\,\alpha_{ij}
$$

또는 고유벡터를 $$\alpha_j/\sqrt{\lambda_j}$$로 다시 스케일한 뒤 $$(\tilde{K}\alpha)_i$$로 읽기도 합니다.
sklearn `KernelPCA`의 `alphas_`, `lambdas_`가 이 쌍입니다.

새 점 $$x$$의 j번째 좌표:

$$
z_j(x)=\frac{1}{\sqrt{\lambda_j}}\sum_{i=1}^{n}\alpha_{ij}\,\tilde{k}(x_i,x)
$$

- $$\tilde{k}(x_i,x)$$: 새 점과 학습 점 i의 커널 값을, 학습 평균 기준으로 가운데 맞춘 값
- 합: 모든 학습 점이 새 점에 기여
- $$\lambda_j=0$$이면 나눌 수 없음. 그 축은 버림

새 점을 쓰려면 학습 점과 커널 값을 **다시** 계산해야 합니다.
선형 PCA처럼 $$v^\top(x-\bar{x})$$ 한 줄로 끝나지 않습니다.

## 점 3개, $$\gamma=1$$ RBF로 끝까지

| 점 | $$x$$ | $$y$$ |
| :---: | ---: | ---: |
| A | 0 | 0 |
| B | 1 | 0 |
| C | 0 | 1 |

거리 제곱:

$$
\lVert A-B\rVert^2=(0-1)^2+(0-0)^2=1
$$

$$
\lVert A-C\rVert^2=(0-0)^2+(0-1)^2=1
$$

$$
\lVert B-C\rVert^2=(1-0)^2+(0-1)^2=2
$$

$$
\lVert A-A\rVert^2=0
$$

RBF, $$\gamma=1$$:

$$
k(x,x')=\exp(-\lVert x-x'\rVert^2)
$$

$$
k(A,A)=e^{0}=1
$$

$$
k(A,B)=e^{-1}\approx 0.3679
$$

$$
k(A,C)=e^{-1}\approx 0.3679
$$

$$
k(B,C)=e^{-2}\approx 0.1353
$$

커널 행렬 $$K$$:

| | A | B | C |
| :---: | ---: | ---: | ---: |
| A | 1 | 0.3679 | 0.3679 |
| B | 0.3679 | 1 | 0.1353 |
| C | 0.3679 | 0.1353 | 1 |

행 합:
A: $$1+0.3679+0.3679=1.7358$$
B: $$1.5032$$
C: $$1.5032$$

행 평균:

$$
\bar{K}_{A\cdot}=\frac{1.7358}{3}\approx 0.5786
$$

$$
\bar{K}_{B\cdot}=\bar{K}_{C\cdot}\approx 0.5011
$$

전체 평균 $$\bar{K}\approx 0.5269$$.

A-A 원소를 가운데 맞춤:

$$
\tilde{K}_{AA}=1-0.5786-0.5786+0.5269\approx 0.3697
$$

같은 방식으로 나머지 원소를 계산하면 $$\tilde{K}$$는 대략

| | A | B | C |
| :---: | ---: | ---: | ---: |
| A | 0.3697 | −0.1849 | −0.1849 |
| B | −0.1849 | 0.5248 | −0.3399 |
| C | −0.1849 | −0.3399 | 0.5248 |

고유값(큰 것부터):

$$
\lambda_1\approx 0.865,\quad \lambda_2\approx 0.555,\quad \lambda_3\approx 0
$$

$$\lambda_3=0$$인 이유: 가운데 맞추면 자유도가 $$n-1=2$$로 줄어듭니다.
의미 있는 축은 최대 $$n-1$$개입니다. 선형 PCA와 같은 상한입니다.

고유벡터 예(부호는 구현마다 뒤집힘):

$$
\alpha_1\approx (0, -0.707, 0.707)
$$

A의 계수가 0에 가깝고, B와 C가 반대 부호입니다.
B$$(1,0)$$과 C$$(0,1)$$를 1축에서 갈라 읽습니다.

A의 1축 스코어(정규화 방식에 따라 스케일은 달라질 수 있음):

$$
z_{A1}=\sqrt{\lambda_1}\,\alpha_{A1}\approx\sqrt{0.865}\cdot 0=0
$$

B:

$$
z_{B1}\approx\sqrt{0.865}\cdot(-0.707)\approx -0.658
$$

C는 부호만 반대입니다.

선형 PCA로 같은 3점을 보면 평균은 $$(1/3, 1/3)$$이고 1축은 대략 $$(1,-1)$$ 방향입니다.
RBF도 이 예에서는 B와 C를 갈라 읽는 점이 비슷합니다.
점이 초승달처럼 휘면, 선형과 RBF의 축이 갈라집니다.

[차트 새 탭]({{ '/assets/plotly/kernel-pca-charts.html' | relative_url }}#pca)

<iframe src="{{ '/assets/plotly/kernel-pca-charts.html' | relative_url }}#pca" title="선형 PCA" width="100%" height="760" style="border:0;border-radius:12px;background:#f7f9fb" loading="lazy"></iframe>

[차트 새 탭]({{ '/assets/plotly/kernel-pca-charts.html' | relative_url }}#rbf)

<iframe src="{{ '/assets/plotly/kernel-pca-charts.html' | relative_url }}#rbf" title="RBF Kernel PCA" width="100%" height="760" style="border:0;border-radius:12px;background:#f7f9fb" loading="lazy"></iframe>

탭 **3. RBF Kernel PCA** (감마=12)에서 두 클래스가 거의 갈라집니다.

## 감마

RBF:

$$
k=\exp(-\gamma\lVert x-x'\rVert^2)
$$

거리를 $$1$$로 두고 $$\gamma$$만 바꿉니다.

- $$\gamma=0.5$$: $$e^{-0.5}\approx 0.607$$. 꽤 먼 점도 남음
- $$\gamma=1$$: $$e^{-1}\approx 0.368$$
- $$\gamma=12$$: $$e^{-12}\approx 6\times 10^{-6}$$. 거리 1이면 거의 0
- $$\gamma=40$$: 아주 가까운 점만 남음

[차트 새 탭]({{ '/assets/plotly/kernel-pca-charts.html' | relative_url }}#gamma)

<iframe src="{{ '/assets/plotly/kernel-pca-charts.html' | relative_url }}#gamma" title="RBF 감마" width="100%" height="760" style="border:0;border-radius:12px;background:#f7f9fb" loading="lazy"></iframe>

탭 **4. 감마** 슬라이더:

- 0.5: 선형 PCA와 비슷한 겹침
- 40: 점이 퍼지거나 한쪽에 몰림. 과한 국소

$$\gamma$$는 데이터 스케일에 묶입니다.
점수가 0–100이면 거리 제곱이 커서, $$\gamma=12$$가 너무 클 수 있습니다.
표준화한 뒤 $$\gamma$$를 고르는 편이 안전합니다.

## sklearn

```python
from sklearn.decomposition import KernelPCA
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("kpca", KernelPCA(
        n_components=2,
        kernel="rbf",
        gamma=1.0,
        fit_inverse_transform=False,
    )),
])
```

- `kernel`: `"linear"`, `"poly"`, `"rbf"`, `"sigmoid"`, `"cosine"`
- `gamma`: RBF·다항의 $$\gamma$$. `None`이면 $$1/p$$
- `degree`, `coef0`: 다항의 $$d$$, $$c$$
- `n_components`: 남길 축 수. 최대 $$n-1$$
- `fit_inverse_transform`: True면 대략적인 역변환을 학습. 기본 PCA처럼 정확하지 않음
- `eigenvalues_`, `eigenvectors_` (버전에 따라 `lambdas_`, `alphas_`)

커널 행렬은 $$n \times n$$입니다.
사람이 1만이면 행렬 원소가 1억 개입니다.
선형 PCA보다 메모리와 시간이 훨씬 큽니다.

## 선형 PCA와 비교

| | PCA | Kernel PCA |
| :--- | :--- | :--- |
| 축 | 원래 공간의 직선 | $$\phi$$ 공간의 직선 |
| 평균 | $$x$$에서 뺌 | $$K$$를 가운데 맞춤 |
| 새 점 | $$v^\top(x-\bar{x})$$ | 학습 점과 커널을 다시 계산 |
| 역변환 | $$\bar{x}+V_k z$$ | 근사만 가능 |
| 비용 | $$p$$에 비례하는 편이 흔함 | $$n^2$$ 커널 + $$n^3$$ 고유분해 |
| 초모수 | 성분 수, 표준화 | 커널 종류, $$\gamma$$, $$d$$ |

둘 다 정답 라벨을 보지 않습니다.
Kernel PCA가 클래스를 잘 가르는 것은 데이터가 그 커널과 맞을 때뿐입니다.

## 시험·면접에서 자주 걸리는 점

**1. Kernel PCA는 지도학습이 아니다**
라벨을 안 봅니다. 분류기가 아닙니다.

**2. 선형 커널 = PCA**
$$k=x^\top x'$$이면 결과가 보통 PCA와 같습니다.

**3. $$\phi(x)$$를 직접 안 만든다**
커널 값만 계산합니다. 이것이 커널 트릭입니다.

**4. $$K$$를 가운데 맞춰야 한다**
입력만 표준화하고 $$K$$를 그대로 고유분해하면 PCA의 “평균 미제거”와 같습니다.

**5. 유효 축은 최대 $$n-1$$**
가운데 맞추면 상수 방향이 빠집니다.

**6. $$\gamma$$가 크면 가까운 점만 본다**
너무 크면 각 점이 따로 놉니다. 너무 작으면 선형에 가깝습니다.

**7. 새 점은 학습 커널이 필요하다**
모델에 학습 점을 들고 있어야 합니다.

**8. 정확한 역변환이 없다**
`fit_inverse_transform`은 근사입니다.

**9. $$n$$이 크면 비싸다**
커널 행렬 $$n\times n$$을 못 올리면 Nyström 근사 등을 씁니다.

**10. 스케일에 민감하다**
거리 커널은 단위를 먼저 맞춥니다.

## 언제 쓰나

쓰는 때:

- 데이터가 휘어 있고, 2D/3D로 펴서 보고 싶을 때
- 선형 PCA 뒤에도 클래스가 겹칠 때
- $$n$$이 수천 이하

약한 때:

- 원래 변수 이름 그대로 해석해야 할 때
- 사람 수가 매우 클 때
- 클래스를 가르는 축이 목표면(그때는 커널 SVM·LDA 계열을 검토)
- 새 점을 아주 빠르게 올려야 하고 학습 점을 못 들고 있을 때

## 잘 놓치는 핵심

- Kernel PCA = $$\phi$$ 공간의 PCA를 커널로 계산
- $$K_{ij}=k(x_i,x_j)$$
- $$\tilde{K}$$를 고유분해
- 스코어는 $$\sqrt{\lambda}\alpha$$ 또는 같은 스케일
- 새 점은 $$\sum_i \alpha_i \tilde{k}(x_i,x)$$
- RBF의 $$\gamma$$는 거리 민감도
- 선형 커널이면 PCA
- 정답을 안 봄
- 비용은 $$n$$에 묶임

## 객관식 10문제

**1.** Kernel PCA가 선형 PCA와 다른 점은?

- ① 정답 라벨을 쓴다
- ② 커널로 $$\phi$$ 공간의 내적만 계산한다
- ③ 평균을 빼면 안 된다
- ④ 고유값을 쓰지 않는다

<details>
<summary>정답</summary>

②  
라벨은 안 봅니다.

</details>

**2.** RBF 커널 $$e^{-\gamma\lVert x-x'\rVert^2}$$에서 두 점이 같으면?

- ① 0
- ② 1
- ③ $$\gamma$$
- ④ $$n$$

<details>
<summary>정답</summary>

②  
$$e^{0}=1$$입니다.

</details>

**3.** 선형 커널
