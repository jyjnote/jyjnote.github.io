---
title: Voting · Stacking 파이널 모의고사
date: 2026-10-03 21:20:00 +0900
slug: voting-stacking-final-mock-exam
permalink: /posts/voting-stacking-final-mock-exam/
categories: [AI, 머신러닝]
tags: [Voting, Stacking, Blending, OOF, 앙상블, 모의고사]
math: true
---

Voting과 Stacking의 차이, Hard·Soft Voting, OOF 예측, 메타 모델, Blending까지 한 번에 점검하는 파이널 모의고사입니다.

<blockquote class="prompt-info">
<p>핵심: Voting은 정해진 규칙으로 결합하고, Stacking은 결합 방법 자체를 다시 학습합니다.</p>
</blockquote>

<details>
<summary>풀이 방법</summary>

먼저 정답을 가리고 풀고, 각 문제 아래의 정답 및 해설을 펼쳐 확인합니다.

</details>

## 문제 1

Voting에 대한 설명으로 가장 적절한 것은?

① 동일한 모델만 사용할 수 있다.  
② 여러 모델의 예측을 정해진 규칙으로 결합한다.  
③ 반드시 메타 모델을 추가한다.  
④ 이전 모델의 오차를 다음 모델이 학습한다.

<details>
<summary>정답 및 해설</summary>

②

Voting은 여러 모델의 예측을 다수결이나 확률 평균 같은 규칙으로 결합합니다.

</details>

## 문제 2

Hard Voting이 사용하는 값은?

① 클래스 확률  
② 예측 클래스  
③ 잔차  
④ 기울기

<details>
<summary>정답 및 해설</summary>

②

Hard Voting은 각 모델이 최종적으로 선택한 클래스를 모아 다수결합니다.

</details>

## 문제 3

세 분류기가 각각 A, A, B를 예측했습니다.

Hard Voting의 결과는?

① A  
② B  
③ 확률을 알아야 결정 가능  
④ 결정할 수 없음

<details>
<summary>정답 및 해설</summary>

①

A가 2표, B가 1표이므로 A가 선택됩니다.

</details>

## 문제 4

Soft Voting이 사용하는 것은?

① 클래스 라벨만 사용  
② 각 모델의 클래스별 예측 확률  
③ 각 모델의 학습 손실  
④ 각 모델의 잔차

<details>
<summary>정답 및 해설</summary>

②

Soft Voting은 클래스별 확률을 평균하거나 가중평균합니다.

</details>

## 문제 5

세 모델이 양성 클래스에 대해 각각 0.49, 0.49, 0.90을 출력했습니다.

기준이 0.5라면 Hard Voting과 단순 Soft Voting 결과는?

① 둘 다 음성  
② 둘 다 양성  
③ Hard는 음성, Soft는 양성  
④ Hard는 양성, Soft는 음성

<details>
<summary>정답 및 해설</summary>

③

Hard Voting에서는 음성 2표, 양성 1표입니다.

Soft Voting 평균은 다음과 같습니다.

$$\frac{0.49+0.49+0.90}{3}\approx0.627$$

따라서 Soft Voting은 양성입니다.

</details>

## 문제 6

Soft Voting에서 확률 보정이 중요한 이유는?

① 모든 모델의 특징 수를 같게 만들기 위해  
② 모델별 확률 크기를 비교하고 평균하기 때문  
③ 클래스 개수를 줄이기 위해  
④ 표준화를 대신하기 위해

<details>
<summary>정답 및 해설</summary>

②

확률을 직접 평균하므로 어떤 모델이 지나치게 자신감 있는 확률을 출력하면 결과에 큰 영향을 줄 수 있습니다.

</details>

## 문제 7

Voting에서 서로 비슷한 오차를 내는 모델만 여러 개 모았을 때의 문제는?

① 다양성이 부족해 앙상블 이득이 작을 수 있다.  
② 항상 과소적합한다.  
③ 확률 출력이 불가능하다.  
④ OOF가 자동 생성된다.

<details>
<summary>정답 및 해설</summary>

①

앙상블은 서로 다른 실수를 하는 모델을 결합할 때 효과가 커질 수 있습니다.

</details>

## 문제 8

회귀 Voting의 일반적인 결합 방식은?

① 다수결  
② 평균 또는 가중평균  
③ 최댓값만 선택  
④ 중앙값만 사용

<details>
<summary>정답 및 해설</summary>

②

회귀에서는 각 모델의 연속형 예측값을 평균하거나 가중평균하는 방식이 일반적입니다.

</details>

## 문제 9

Stacking의 핵심 아이디어는?

① 모든 모델의 파라미터를 동일하게 만든다.  
② 기본 모델들의 예측값을 새로운 특징으로 사용한다.  
③ 가장 좋은 모델 하나만 선택한다.  
④ 모든 모델의 클래스를 단순 다수결한다.

<details>
<summary>정답 및 해설</summary>

②

기본 모델의 예측 결과를 새로운 입력 특징으로 만들어 메타 모델이 최종 결합법을 학습합니다.

</details>

## 문제 10

Stacking에서 메타 모델이 받는 입력으로 가장 적절한 것은?

① 원래 라벨만  
② 각 기본 모델의 예측값  
③ 기본 모델의 학습률  
④ 각 모델의 파라미터 개수

<details>
<summary>정답 및 해설</summary>

②

1단계 모델들의 예측값이 2단계 메타 모델의 입력 특징이 됩니다.

</details>

## 문제 11

Stacking 학습에서 기본 모델의 학습 데이터에 대한 자체 예측값을 그대로 메타 모델 입력으로 사용하면 안 되는 주된 이유는?

① 특징 수가 너무 적어서  
② 데이터 누수가 생길 수 있어서  
③ 표준화가 불가능해서  
④ 확률값을 사용할 수 없어서

<details>
<summary>정답 및 해설</summary>

②

자신이 이미 학습한 행을 다시 예측하면 지나치게 좋은 예측값이 메타 모델에 전달될 수 있습니다.

</details>

## 문제 12

OOF 예측의 핵심은?

① 모든 데이터를 학습한 뒤 같은 데이터에 예측  
② 해당 행을 학습하지 않은 모델로 그 행을 예측  
③ 테스트 데이터로 기본 모델을 학습  
④ 한 모델만 반복 사용

<details>
<summary>정답 및 해설</summary>

②

각 행은 자신을 학습에 포함하지 않은 기본 모델로 예측되어야 합니다.

</details>

## 문제 13

5겹 교차검증으로 Stacking용 OOF 예측을 만든다고 하자.

1번 묶음의 OOF 예측을 만들 때 올바른 방식은?

① 1번 묶음으로 학습하고 1번 묶음 예측  
② 나머지 4개 묶음으로 학습하고 1번 묶음 예측  
③ 전체 데이터로 학습하고 1번 묶음 예측  
④ 테스트 데이터로 학습하고 1번 묶음 예측

<details>
<summary>정답 및 해설</summary>

②

해당 행이 학습에 들어가지 않은 상태의 예측값을 만들어야 합니다.

</details>

## 문제 14

Stacking에서 여러 기본 모델이 OOF 예측을 만들 때 중요한 조건은?

① 서로 다른 행을 예측해야 한다.  
② 같은 검증 행에 대한 예측을 나란히 만들어야 한다.  
③ 모두 같은 알고리즘이어야 한다.  
④ 반드시 선형 모델이어야 한다.

<details>
<summary>정답 및 해설</summary>

②

메타 모델의 한 행에는 같은 원본 데이터에 대한 여러 기본 모델의 예측이 들어가야 합니다.

</details>

## 문제 15

OOF 예측으로 메타 모델 학습을 마친 뒤 실제 서비스용 기본 모델은 보통 어떻게 하는가?

① 각 폴드 모델 중 하나만 선택  
② 전체 학습 데이터로 다시 학습  
③ 메타 모델만 남기고 제거  
④ 테스트 데이터까지 포함해 다시 학습

<details>
<summary>정답 및 해설</summary>

②

OOF는 메타 모델 학습용 예측을 만들기 위한 절차입니다.

최종 기본 모델은 보통 전체 학습 데이터로 다시 학습합니다.

</details>

## 문제 16

Stacking의 메타 모델을 지나치게 복잡하게 만들면 발생할 수 있는 문제는?

① 기본 모델 수가 자동 감소  
② OOF 데이터에 과적합할 수 있음  
③ 커널 행렬이 사라짐  
④ 다중분류가 불가능해짐

<details>
<summary>정답 및 해설</summary>

②

메타 모델은 기본 모델 예측을 다시 학습하므로 지나치게 복잡하면 2단계에서도 과적합할 수 있습니다.

</details>

## 문제 17

Blending과 Stacking의 대표적인 차이는?

① Blending은 별도의 홀드아웃 데이터를 이용할 수 있다.  
② Blending은 메타 모델을 사용할 수 없다.  
③ Stacking은 분류에 사용할 수 없다.  
④ Blending은 회귀만 가능하다.

<details>
<summary>정답 및 해설</summary>

①

Blending은 일부 데이터를 따로 떼어 기본 모델 예측을 만든 뒤 메타 모델을 학습하는 방식으로 설명되는 경우가 많습니다.

</details>

## 문제 18

OOF와 OOD의 설명으로 옳은 것은?

① 둘은 같은 의미다.  
② OOF는 교차검증 밖 예측, OOD는 학습 분포 밖 데이터와 관련된다.  
③ OOF는 이상치 탐지, OOD는 교차검증이다.  
④ 둘 다 Voting 방식이다.

<details>
<summary>정답 및 해설</summary>

②

OOF와 OOD는 이름이 비슷하지만 완전히 다른 개념입니다.

</details>

## 문제 19

Voting과 Stacking을 비교한 설명으로 옳은 것은?

① Voting은 결합 규칙을 학습하고 Stacking은 고정한다.  
② Voting은 고정된 결합 규칙, Stacking은 메타 모델이 결합법을 학습한다.  
③ 둘 다 반드시 OOF가 필요하다.  
④ 둘 다 반드시 확률 평균만 사용한다.

<details>
<summary>정답 및 해설</summary>

②

Voting은 다수결·평균 같은 규칙을 사용하고, Stacking은 결합 방법 자체를 학습합니다.

</details>

## 문제 20

다음 중 Stacking에서 가장 중요한 데이터 누수 방지 원칙은?

① 기본 모델의 개수를 2개 이하로 제한  
② 메타 모델에 넣는 학습용 예측은 해당 행을 학습하지 않은 모델이 생성  
③ 모든 기본 모델을 같은 알고리즘으로 통일  
④ 원본 특징을 반드시 제거

<details>
<summary>정답 및 해설</summary>

②

Stacking에서 가장 중요한 원칙은 메타 학습용 예측을 OOF 방식으로 만드는 것입니다.

</details>

## 잘 놓치는 핵심

- Hard Voting: 클래스 다수결
- Soft Voting: 확률 평균 또는 가중평균
- Soft Voting은 확률 보정 상태가 중요
- 앙상블은 모델 다양성과 오류 상관이 중요
- Stacking은 예측값을 새로운 특징으로 사용
- 메타 학습용 기본 모델 예측은 OOF로 생성
- 같은 행의 예측끼리 한 메타 입력 행을 구성
- 최종 기본 모델은 전체 학습 데이터로 재학습 가능
- Blending은 별도 홀드아웃을 쓰는 단순화된 방식
- OOF와 OOD는 다른 개념

## 시험 직전 암기

```text
Hard Voting
→ 클래스 다수결

Soft Voting
→ 확률 평균

Stacking
→ 기본 모델 예측을 특징으로 사용
→ 메타 모델이 결합법 학습

OOF
→ 해당 행을 보지 않은 모델의 예측

Blending
→ 별도 홀드아웃으로 메타 학습
```

<blockquote class="prompt-info">
<p>한 줄: Voting은 사람이 결합 규칙을 정하고, Stacking은 결합 규칙도 모델이 학습합니다.</p>
</blockquote>
