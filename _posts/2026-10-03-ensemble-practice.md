---
title: 앙상블 종합 필기 문제
date: 2026-10-03 15:40:00 +0900
slug: ensemble-practice
permalink: /posts/ensemble-practice/
categories: [AI, 머신러닝]
tags: [앙상블, Bagging, RandomForest, ExtraTrees, Bootstrap, OOB, 분산, 편향, 문제풀이]
math: true
---

배깅, 랜덤포레스트, 엑스트라 트리를 중심으로 앙상블 전 범위를 점검하는 필기 문제입니다.

<blockquote class="prompt-info">
<p>범위: Bagging · Bootstrap · OOB · 분산 · 편향 · Random Forest · Extra Trees · 병렬 앙상블</p>
</blockquote>

## 문제 1. Bagging의 뜻

Bagging의 원래 의미로 가장 적절한 것은?

① Boost Aggregating  
② Bootstrap Aggregating  
③ Binary Aggregating  
④ Balanced Aggregating

<details>
<summary>정답 및 해설</summary>

② Bootstrap Aggregating

부트스트랩 표본마다 같은 종류의 모델을 학습한 뒤 예측을 합칩니다.

</details>

## 문제 2. 부트스트랩 표본

원 데이터가 5개이고 다음과 같습니다.

```text
A, B, C, D, E
```

다음 중 가능한 부트스트랩 표본은?

① A, B, C, D, E  
② A, A, C, D, D  
③ A, B, C  
④ A, B, C, D, E, F

<details>
<summary>정답 및 해설</summary>

①, ②

복원추출이므로 중복은 가능하지만 표본 크기는 원 데이터와 같습니다.

</details>

## 문제 3. 한 점이 한 번에 안 뽑힐 확률

데이터가 n개일 때 한 번 추출에서 특정 데이터가 선택되지 않을 확률은?

① 1/n  
② 1-1/n  
③ n-1  
④ 1/n²

<details>
<summary>정답 및 해설</summary>

②

한 번 뽑을 때 특정 점이 뽑힐 확률이 1/n이므로 안 뽑힐 확률은 다음과 같습니다.

$$1-\frac{1}{n}$$

</details>

## 문제 4. OOB 비율

n이 충분히 클 때 한 데이터가 n번의 부트스트랩 추출 동안 한 번도 선택되지 않을 확률은?

① 약 0.132  
② 약 0.368  
③ 약 0.500  
④ 약 0.632

<details>
<summary>정답 및 해설</summary>

② 약 0.368

$$\left(1-\frac{1}{n}\right)^n\approx\frac{1}{e}\approx0.368$$

따라서 한 부트스트랩 표본에서 약 36.8%가 OOB가 됩니다.

</details>

## 문제 5. OOB의 의미

OOB 데이터에 대한 설명으로 옳은 것은?

① 다음 나무를 학습시키는 데이터  
② 해당 나무의 부트스트랩 표본에 포함되지 않은 데이터  
③ 항상 최종 테스트셋과 동일한 데이터  
④ 모든 나무가 반드시 보지 못한 데이터

<details>
<summary>정답 및 해설</summary>

②

OOB는 특정 나무의 가방에 들어가지 않은 데이터입니다.

나무마다 OOB 집합은 다릅니다.

</details>

## 문제 6. 배깅 회귀

세 회귀나무의 예측값이 다음과 같습니다.

```text
10
14
16
```

배깅의 최종 회귀 예측값은?

① 10  
② 13.33  
③ 14  
④ 16

<details>
<summary>정답 및 해설</summary>

② 약 13.33

$$\hat{y}=\frac{10+14+16}{3}=\frac{40}{3}\approx13.33$$

회귀 배깅은 각 모델의 예측을 평균합니다.

</details>

## 문제 7. 배깅이 주로 줄이는 것

배깅의 대표적인 효과는?

① 편향만 증가  
② 분산 감소  
③ 특징 수 감소  
④ 학습 데이터 크기 증가

<details>
<summary>정답 및 해설</summary>

② 분산 감소

서로 다른 표본에서 생기는 예측 흔들림을 평균해 분산을 줄입니다.

</details>

## 문제 8. 왜 편향은 남는가

모든 나무를 최대 깊이 2로 제한했습니다.

나무를 1,000개로 늘려도 구조적 편향이 남을 수 있는 이유는?

① 모든 나무가 같은 구조적 제약을 가지기 때문  
② OOB가 사라지기 때문  
③ 부트스트랩이 비복원추출이기 때문  
④ 특징 수가 자동으로 1이 되기 때문

<details>
<summary>정답 및 해설</summary>

①

같은 구조적 한계를 공유하면 평균해도 그 편향은 남습니다.

</details>

## 문제 9. Random Forest의 추가 무작위성

랜덤포레스트가 일반 배깅에 추가하는 핵심은?

① 노드마다 일부 특징만 무작위로 선택  
② 정답 라벨을 무작위로 변경  
③ 손실함수를 매번 변경  
④ 나무 깊이를 항상 1로 고정

<details>
<summary>정답 및 해설</summary>

①

각 노드에서 특징 일부만 공개해 트리 사이 상관을 줄입니다.

</details>

## 문제 10. p와 m

전체 특징 수가 p=12이고, 각 노드에서 m=4개를 뽑습니다.

의미로 가장 적절한 것은?

① 한 나무 전체에서 특징 4개만 사용  
② 각 노드마다 12개 중 4개를 다시 뽑음  
③ 한 번 뽑힌 특징은 영구 제거  
④ 매 노드에서 항상 같은 4개 사용

<details>
<summary>정답 및 해설</summary>

②

특징 후보는 노드마다 다시 뽑습니다.

</details>

## 문제 11. m=p

랜덤포레스트에서 m=p로 설정하면 어떻게 되는가?

① 특징 무작위성이 거의 사라져 배깅과 가까워진다.  
② 임계값이 무조건 무작위가 된다.  
③ OOB가 사라진다.  
④ 부스팅으로 변한다.

<details>
<summary>정답 및 해설</summary>

①

모든 특징을 보므로 특징 무작위성이 사라집니다.

</details>

## 문제 12. m이 너무 작을 때

m이 지나치게 작으면 생길 수 있는 현상은?

① 좋은 특징을 자주 못 봐 편향이 커질 수 있다.  
② 모든 트리가 완전히 동일해진다.  
③ OOB가 100%가 된다.  
④ 항상 학습 시간이 길어진다.

<details>
<summary>정답 및 해설</summary>

①

좋은 특징을 못 보는 노드가 늘어 편향이 커질 수 있습니다.

</details>

## 문제 13. 병렬과 순차

다음 중 옳은 것은?

① 랜덤포레스트는 앞 나무의 잔차를 다음 나무가 학습한다.  
② 랜덤포레스트는 나무들을 독립적으로 학습할 수 있다.  
③ 배깅은 반드시 순차 학습이다.  
④ 부스팅은 항상 병렬이다.

<details>
<summary>정답 및 해설</summary>

②

배깅·랜덤포레스트는 병렬, 부스팅은 순차 방식입니다.

</details>

## 문제 14. 확률 평균과 다수결

세 나무의 양성 확률이 다음과 같습니다.

```text
0.49, 0.49, 0.90
```

0.5를 기준으로 각 나무를 투표시키면 최종 다수결은?

① 양성  
② 음성  
③ 동점  
④ 계산 불가

<details>
<summary>정답 및 해설</summary>

② 음성

0.49는 음성, 0.49도 음성, 0.90은 양성이므로 음성 2표입니다.

하지만 확률 평균은 약 0.627이므로 확률 평균 방식에서는 양성이 될 수 있습니다.

</details>

## 문제 15. Extra Trees의 핵심

Extra Trees가 Random Forest보다 더 강하게 무작위화하는 부분은?

① 클래스 라벨  
② 임계값  
③ 손실함수  
④ OOB 라벨

<details>
<summary>정답 및 해설</summary>

② 임계값

Extra Trees는 특징뿐 아니라 어디에서 자를지도 무작위 후보로 만듭니다.

</details>

## 문제 16. RF와 Extra Trees 비교

다음 설명 중 옳은 것은?

① RF는 선택된 특징 안에서 좋은 임계값을 탐색한다.  
② Extra Trees는 가능한 모든 임계값을 반드시 전부 탐색한다.  
③ RF는 임계값을 완전히 무작위로만 쓴다.  
④ Extra Trees는 특징 무작위화를 하지 않는다.

<details>
<summary>정답 및 해설</summary>

①

RF는 좋은 임계값을 찾고, Extra Trees는 무작위 임계값 후보 중에서 고릅니다.

</details>

## 문제 17. Extra Trees의 기본 부트스트랩

일반적인 Extra Trees 기본 설정에 대한 설명으로 옳은 것은?

① 부트스트랩을 기본적으로 사용한다.  
② 부트스트랩을 기본적으로 사용하지 않는다.  
③ 부트스트랩 사용이 불가능하다.  
④ 항상 OOB 평가를 한다.

<details>
<summary>정답 및 해설</summary>

②

기본적으로 전체 학습 데이터를 사용하며 임계값 무작위성으로 트리를 다르게 만듭니다.

</details>

## 문제 18. Extra Trees와 OOB

Extra Trees에서 OOB 평가를 사용하려면?

① bootstrap=True가 필요하다.  
② max_depth=1이어야 한다.  
③ m=p여야 한다.  
④ 표준화를 해야 한다.

<details>
<summary>정답 및 해설</summary>

①

OOB는 부트스트랩 표본에서 빠진 데이터이므로 bootstrap=True가 필요합니다.

</details>

## 문제 19. 종합 비교

다음 중 옳은 것을 모두 고르면?

① Bagging은 같은 종류의 모델을 다른 부트스트랩 표본에 학습한다.  
② Random Forest는 노드마다 특징 일부를 다시 뽑는다.  
③ Extra Trees는 기본적으로 임계값까지 무작위화한다.  
④ Random Forest와 Extra Trees는 모두 부스팅 계열이다.

<details>
<summary>정답 및 해설</summary>

①, ②, ③

④는 틀렸습니다.

Random Forest와 Extra Trees는 병렬 앙상블 계열입니다.

</details>

## 문제 20. 최종 종합

다음 상황을 봅니다.

- 결정트리 한 그루는 데이터 변화에 매우 민감함
- 여러 나무가 같은 중요 특징만 반복해 사용함
- 나무 사이 상관을 더 줄이고 싶음
- 임계값 탐색 비용도 줄이고 싶음

가장 직접적으로 맞는 모델은?

① 단일 CART  
② Bagging  
③ Random Forest  
④ Extra Trees

<details>
<summary>정답 및 해설</summary>

④ Extra Trees

Bagging은 데이터만, Random Forest는 데이터와 특징 후보에 무작위성을 줍니다.

Extra Trees는 특징뿐 아니라 임계값 후보까지 무작위화해 트리 상관과 임계 탐색 비용을 더 줄일 수 있습니다.

</details>

## 마지막 정리

핵심 흐름은 **부트스트랩 → OOB → Bagging의 분산 감소 → Random Forest의 특징 무작위 → Extra Trees의 임계값 무작위**입니다.

`m=p`이면 RF는 Bagging과 가까워지고, Extra Trees는 기본 부트스트랩이 없지만 `bootstrap=True`면 OOB 평가가 가능합니다.

<blockquote class="prompt-info">
<p>핵심: Bagging은 데이터, Random Forest는 특징, Extra Trees는 임계값까지 무작위성을 확장합니다.</p>
</blockquote>
