---
title: LEFT OUTER JOIN
date: 2026-09-18 21:25:00 +0900
slug: left-outer-join
permalink: /posts/left-outer-join/
categories: [CS, 데이터베이스]
tags: [LEFTOUTERJOIN, LEFTJOIN, JOIN, SQL, NULL, ON, WHERE, 정보처리기사, NCS]
math: true
---

LEFT OUTER JOIN은 왼쪽 Table의 모든 Row를 유지하고 오른쪽 Table에서 조건이 일치하는 Row를 연결하는 JOIN입니다.

이 글에서는 실습 데이터베이스를 기준으로 결과가 어떻게 만들어지는지 단계별로 확인합니다.

<blockquote class="prompt-info">
<p>한 줄: LEFT OUTER JOIN은 왼쪽 Table을 전부 남기고 오른쪽에서 일치하는 값만 붙입니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

LEFT OUTER JOIN = 왼쪽 전체 + 오른쪽 일치

</details>

## 실습 데이터 전체 보기

아래 실습 데이터베이스를 기준으로 예시를 설명합니다.

<div style="width:100%; overflow:hidden; border:1px solid var(--main-border-color,#ddd); border-radius:12px; margin:1rem 0;">
<iframe
  src="https://docs.google.com/spreadsheets/d/1mtu6pFcGyOfwpFizaJskfFD87GxyjAmB/preview"
  width="100%"
  height="500"
  style="border:0;"
  loading="lazy">
</iframe>
</div>

주요 Table은 다음과 같습니다.

| Table | 핵심 Column | 역할 |
| --- | --- | --- |
| DEPARTMENT | DEPT_ID, DEPT_NAME, REGION | 부서 |
| EMPLOYEE | EMP_ID, EMP_NAME, DEPT_ID, SALARY | 직원 |
| CUSTOMER | CUSTOMER_ID, NAME, REGION, GRADE | 고객 |
| PRODUCT | PRODUCT_ID, PRODUCT_NAME, CATEGORY, PRICE | 상품 |
| ORDERS | ORDER_ID, CUSTOMER_ID, ORDER_DATE, STATUS | 주문 |
| ORDER_ITEM | ORDER_ID, PRODUCT_ID, QTY | 주문 상세 |

## 핵심 구조

가장 먼저 다음 한 줄을 기억합니다.

```text
LEFT OUTER JOIN = 왼쪽 전체 + 오른쪽 일치
```

대표 SQL은 다음과 같습니다.

```sql
SELECT E.EMP_NAME, D.DEPT_NAME\nFROM EMPLOYEE E\nLEFT JOIN DEPARTMENT D\n    ON E.DEPT_ID = D.DEPT_ID;
```

<mark>LEFT OUTER JOIN은 왼쪽 Table을 전부 남기고 오른쪽에서 일치하는 값만 붙입니다.</mark>

## 실습 DB의 연결 관계

실습 DB에서는 다음 관계를 반복해서 사용합니다.

```text
EMPLOYEE.DEPT_ID
↓
DEPARTMENT.DEPT_ID
```

```text
ORDERS.CUSTOMER_ID
↓
CUSTOMER.CUSTOMER_ID
```

```text
ORDER_ITEM.ORDER_ID
↓
ORDERS.ORDER_ID
```

```text
ORDER_ITEM.PRODUCT_ID
↓
PRODUCT.PRODUCT_ID
```

JOIN 문제를 보면 먼저 어느 관계를 사용해야 하는지 찾습니다.

## 핵심 규칙

- 왼쪽 Row는 모두 보존한다
- 오른쪽에 짝이 없으면 오른쪽 Column이 NULL이다
- 오른쪽 Key IS NULL로 미연결 왼쪽 Row를 찾을 수 있다
- 오른쪽 조건을 WHERE에 두면 NULL Row가 제거될 수 있다
- OUTER는 생략 가능하다
- 보존하고 싶은 대상 Table을 왼쪽에 둔다

### 핵심 규칙 1. 왼쪽 Row는 모두 보존한다

이 규칙은 `LEFT OUTER JOIN`의 결과를 예측할 때 먼저 확인해야 합니다.

```text
조건 확인
→ 연결되는 Row 확인
→ 보존되는 Row 확인
→ NULL 발생 여부 확인
```

SQL을 보기 전에 작은 표를 그려 Row가 남는지 제거되는지 표시하면 문제를 빠르게 풀 수 있습니다.

특히 JOIN에서는 Column 개수보다 **결과 Row의 생존 여부**를 먼저 판단하는 것이 중요합니다.

### 핵심 규칙 2. 오른쪽에 짝이 없으면 오른쪽 Column이 NULL이다

이 규칙은 `LEFT OUTER JOIN`의 결과를 예측할 때 먼저 확인해야 합니다.

```text
조건 확인
→ 연결되는 Row 확인
→ 보존되는 Row 확인
→ NULL 발생 여부 확인
```

SQL을 보기 전에 작은 표를 그려 Row가 남는지 제거되는지 표시하면 문제를 빠르게 풀 수 있습니다.

특히 JOIN에서는 Column 개수보다 **결과 Row의 생존 여부**를 먼저 판단하는 것이 중요합니다.

### 핵심 규칙 3. 오른쪽 Key IS NULL로 미연결 왼쪽 Row를 찾을 수 있다

이 규칙은 `LEFT OUTER JOIN`의 결과를 예측할 때 먼저 확인해야 합니다.

```text
조건 확인
→ 연결되는 Row 확인
→ 보존되는 Row 확인
→ NULL 발생 여부 확인
```

SQL을 보기 전에 작은 표를 그려 Row가 남는지 제거되는지 표시하면 문제를 빠르게 풀 수 있습니다.

특히 JOIN에서는 Column 개수보다 **결과 Row의 생존 여부**를 먼저 판단하는 것이 중요합니다.

### 핵심 규칙 4. 오른쪽 조건을 WHERE에 두면 NULL Row가 제거될 수 있다

이 규칙은 `LEFT OUTER JOIN`의 결과를 예측할 때 먼저 확인해야 합니다.

```text
조건 확인
→ 연결되는 Row 확인
→ 보존되는 Row 확인
→ NULL 발생 여부 확인
```

SQL을 보기 전에 작은 표를 그려 Row가 남는지 제거되는지 표시하면 문제를 빠르게 풀 수 있습니다.

특히 JOIN에서는 Column 개수보다 **결과 Row의 생존 여부**를 먼저 판단하는 것이 중요합니다.

### 핵심 규칙 5. OUTER는 생략 가능하다

이 규칙은 `LEFT OUTER JOIN`의 결과를 예측할 때 먼저 확인해야 합니다.

```text
조건 확인
→ 연결되는 Row 확인
→ 보존되는 Row 확인
→ NULL 발생 여부 확인
```

SQL을 보기 전에 작은 표를 그려 Row가 남는지 제거되는지 표시하면 문제를 빠르게 풀 수 있습니다.

특히 JOIN에서는 Column 개수보다 **결과 Row의 생존 여부**를 먼저 판단하는 것이 중요합니다.

### 핵심 규칙 6. 보존하고 싶은 대상 Table을 왼쪽에 둔다

이 규칙은 `LEFT OUTER JOIN`의 결과를 예측할 때 먼저 확인해야 합니다.

```text
조건 확인
→ 연결되는 Row 확인
→ 보존되는 Row 확인
→ NULL 발생 여부 확인
```

SQL을 보기 전에 작은 표를 그려 Row가 남는지 제거되는지 표시하면 문제를 빠르게 풀 수 있습니다.

특히 JOIN에서는 Column 개수보다 **결과 Row의 생존 여부**를 먼저 판단하는 것이 중요합니다.

## 주요 개념 비교

### 비교 1. INNER JOIN

핵심은 다음과 같습니다.

```text
INNER JOIN
→ 불일치 왼쪽 Row 제거
```

`LEFT OUTER JOIN`과 함께 비교할 때는 연결 조건, 보존 방향, NULL 발생 여부를 따로 확인합니다.

시험에서는 이름만 보고 답하지 말고 작은 예시 Row를 직접 대입하는 것이 안전합니다.

### 비교 2. LEFT OUTER JOIN

핵심은 다음과 같습니다.

```text
LEFT OUTER JOIN
→ 불일치 왼쪽 Row 보존
```

`LEFT OUTER JOIN`과 함께 비교할 때는 연결 조건, 보존 방향, NULL 발생 여부를 따로 확인합니다.

시험에서는 이름만 보고 답하지 말고 작은 예시 Row를 직접 대입하는 것이 안전합니다.

### 비교 3. RIGHT OUTER JOIN

핵심은 다음과 같습니다.

```text
RIGHT OUTER JOIN
→ 오른쪽 보존
```

`LEFT OUTER JOIN`과 함께 비교할 때는 연결 조건, 보존 방향, NULL 발생 여부를 따로 확인합니다.

시험에서는 이름만 보고 답하지 말고 작은 예시 Row를 직접 대입하는 것이 안전합니다.

### 비교 4. FULL OUTER JOIN

핵심은 다음과 같습니다.

```text
FULL OUTER JOIN
→ 양쪽 보존
```

`LEFT OUTER JOIN`과 함께 비교할 때는 연결 조건, 보존 방향, NULL 발생 여부를 따로 확인합니다.

시험에서는 이름만 보고 답하지 말고 작은 예시 Row를 직접 대입하는 것이 안전합니다.

### 비교 5. ON의 오른쪽 조건

핵심은 다음과 같습니다.

```text
ON의 오른쪽 조건
→ 왼쪽 보존 유지 가능
```

`LEFT OUTER JOIN`과 함께 비교할 때는 연결 조건, 보존 방향, NULL 발생 여부를 따로 확인합니다.

시험에서는 이름만 보고 답하지 말고 작은 예시 Row를 직접 대입하는 것이 안전합니다.

### 비교 6. WHERE의 오른쪽 조건

핵심은 다음과 같습니다.

```text
WHERE의 오른쪽 조건
→ NULL Row 제거 가능
```

`LEFT OUTER JOIN`과 함께 비교할 때는 연결 조건, 보존 방향, NULL 발생 여부를 따로 확인합니다.

시험에서는 이름만 보고 답하지 말고 작은 예시 Row를 직접 대입하는 것이 안전합니다.

### 비교 7. COUNT(*)

핵심은 다음과 같습니다.

```text
COUNT(*)
→ 왼쪽 보존 Row도 셈
```

`LEFT OUTER JOIN`과 함께 비교할 때는 연결 조건, 보존 방향, NULL 발생 여부를 따로 확인합니다.

시험에서는 이름만 보고 답하지 말고 작은 예시 Row를 직접 대입하는 것이 안전합니다.

### 비교 8. COUNT(오른쪽Key)

핵심은 다음과 같습니다.

```text
COUNT(오른쪽Key)
→ NULL은 세지 않음
```

`LEFT OUTER JOIN`과 함께 비교할 때는 연결 조건, 보존 방향, NULL 발생 여부를 따로 확인합니다.

시험에서는 이름만 보고 답하지 말고 작은 예시 Row를 직접 대입하는 것이 안전합니다.

## 실전 SQL 패턴

### 실전 패턴 1. 직원과 부서

먼저 요구사항에서 어떤 Table을 기준으로 볼지 판단합니다.

```sql
SELECT E.EMP_NAME, D.DEPT_NAME
FROM EMPLOYEE E
JOIN DEPARTMENT D ON E.DEPT_ID = D.DEPT_ID;
```

이 예시를 `LEFT OUTER JOIN` 관점에서 다시 볼 때는 다음 순서로 확인합니다.

```text
1. 연결 조건
2. 일치 Row
3. 불일치 Row
4. 보존 방향
5. NULL
```

문법만 외우지 말고 최종 결과에 남을 Row를 직접 예상하는 것이 핵심입니다.

### 실전 패턴 2. 주문과 고객

먼저 요구사항에서 어떤 Table을 기준으로 볼지 판단합니다.

```sql
SELECT O.ORDER_ID, C.NAME
FROM ORDERS O
JOIN CUSTOMER C ON O.CUSTOMER_ID = C.CUSTOMER_ID;
```

이 예시를 `LEFT OUTER JOIN` 관점에서 다시 볼 때는 다음 순서로 확인합니다.

```text
1. 연결 조건
2. 일치 Row
3. 불일치 Row
4. 보존 방향
5. NULL
```

문법만 외우지 말고 최종 결과에 남을 Row를 직접 예상하는 것이 핵심입니다.

### 실전 패턴 3. 주문 상세와 상품

먼저 요구사항에서 어떤 Table을 기준으로 볼지 판단합니다.

```sql
SELECT I.ORDER_ID, P.PRODUCT_NAME, I.QTY
FROM ORDER_ITEM I
JOIN PRODUCT P ON I.PRODUCT_ID = P.PRODUCT_ID;
```

이 예시를 `LEFT OUTER JOIN` 관점에서 다시 볼 때는 다음 순서로 확인합니다.

```text
1. 연결 조건
2. 일치 Row
3. 불일치 Row
4. 보존 방향
5. NULL
```

문법만 외우지 말고 최종 결과에 남을 Row를 직접 예상하는 것이 핵심입니다.

### 실전 패턴 4. 세 Table 연결

먼저 요구사항에서 어떤 Table을 기준으로 볼지 판단합니다.

```sql
SELECT O.ORDER_ID, P.PRODUCT_NAME, I.QTY
FROM ORDERS O
JOIN ORDER_ITEM I ON O.ORDER_ID = I.ORDER_ID
JOIN PRODUCT P ON I.PRODUCT_ID = P.PRODUCT_ID;
```

이 예시를 `LEFT OUTER JOIN` 관점에서 다시 볼 때는 다음 순서로 확인합니다.

```text
1. 연결 조건
2. 일치 Row
3. 불일치 Row
4. 보존 방향
5. NULL
```

문법만 외우지 말고 최종 결과에 남을 Row를 직접 예상하는 것이 핵심입니다.

### 실전 패턴 5. 급여 조건

먼저 요구사항에서 어떤 Table을 기준으로 볼지 판단합니다.

```sql
SELECT E.EMP_NAME, D.DEPT_NAME
FROM EMPLOYEE E
JOIN DEPARTMENT D ON E.DEPT_ID = D.DEPT_ID
WHERE E.SALARY >= 3000;
```

이 예시를 `LEFT OUTER JOIN` 관점에서 다시 볼 때는 다음 순서로 확인합니다.

```text
1. 연결 조건
2. 일치 Row
3. 불일치 Row
4. 보존 방향
5. NULL
```

문법만 외우지 말고 최종 결과에 남을 Row를 직접 예상하는 것이 핵심입니다.

### 실전 패턴 6. 서울 부서

먼저 요구사항에서 어떤 Table을 기준으로 볼지 판단합니다.

```sql
SELECT E.EMP_NAME, D.DEPT_NAME
FROM EMPLOYEE E
JOIN DEPARTMENT D ON E.DEPT_ID = D.DEPT_ID
WHERE D.REGION = '서울';
```

이 예시를 `LEFT OUTER JOIN` 관점에서 다시 볼 때는 다음 순서로 확인합니다.

```text
1. 연결 조건
2. 일치 Row
3. 불일치 Row
4. 보존 방향
5. NULL
```

문법만 외우지 말고 최종 결과에 남을 Row를 직접 예상하는 것이 핵심입니다.

### 실전 패턴 7. 고객별 주문

먼저 요구사항에서 어떤 Table을 기준으로 볼지 판단합니다.

```sql
SELECT C.NAME, O.ORDER_ID
FROM CUSTOMER C
LEFT JOIN ORDERS O ON C.CUSTOMER_ID = O.CUSTOMER_ID;
```

이 예시를 `LEFT OUTER JOIN` 관점에서 다시 볼 때는 다음 순서로 확인합니다.

```text
1. 연결 조건
2. 일치 Row
3. 불일치 Row
4. 보존 방향
5. NULL
```

문법만 외우지 말고 최종 결과에 남을 Row를 직접 예상하는 것이 핵심입니다.

### 실전 패턴 8. 주문 없는 고객

먼저 요구사항에서 어떤 Table을 기준으로 볼지 판단합니다.

```sql
SELECT C.NAME
FROM CUSTOMER C
LEFT JOIN ORDERS O ON C.CUSTOMER_ID = O.CUSTOMER_ID
WHERE O.ORDER_ID IS NULL;
```

이 예시를 `LEFT OUTER JOIN` 관점에서 다시 볼 때는 다음 순서로 확인합니다.

```text
1. 연결 조건
2. 일치 Row
3. 불일치 Row
4. 보존 방향
5. NULL
```

문법만 외우지 말고 최종 결과에 남을 Row를 직접 예상하는 것이 핵심입니다.

### 실전 패턴 9. 모든 상품과 주문

먼저 요구사항에서 어떤 Table을 기준으로 볼지 판단합니다.

```sql
SELECT P.PRODUCT_NAME, I.ORDER_ID
FROM PRODUCT P
LEFT JOIN ORDER_ITEM I ON P.PRODUCT_ID = I.PRODUCT_ID;
```

이 예시를 `LEFT OUTER JOIN` 관점에서 다시 볼 때는 다음 순서로 확인합니다.

```text
1. 연결 조건
2. 일치 Row
3. 불일치 Row
4. 보존 방향
5. NULL
```

문법만 외우지 말고 최종 결과에 남을 Row를 직접 예상하는 것이 핵심입니다.

### 실전 패턴 10. 부서별 직원 수

먼저 요구사항에서 어떤 Table을 기준으로 볼지 판단합니다.

```sql
SELECT D.DEPT_NAME, COUNT(E.EMP_ID)
FROM DEPARTMENT D
LEFT JOIN EMPLOYEE E ON D.DEPT_ID = E.DEPT_ID
GROUP BY D.DEPT_NAME;
```

이 예시를 `LEFT OUTER JOIN` 관점에서 다시 볼 때는 다음 순서로 확인합니다.

```text
1. 연결 조건
2. 일치 Row
3. 불일치 Row
4. 보존 방향
5. NULL
```

문법만 외우지 말고 최종 결과에 남을 Row를 직접 예상하는 것이 핵심입니다.

### 실전 패턴 11. 별칭 확인

먼저 요구사항에서 어떤 Table을 기준으로 볼지 판단합니다.

```sql
SELECT E.EMP_ID, E.EMP_NAME, D.DEPT_NAME
FROM EMPLOYEE E
JOIN DEPARTMENT D ON E.DEPT_ID = D.DEPT_ID;
```

이 예시를 `LEFT OUTER JOIN` 관점에서 다시 볼 때는 다음 순서로 확인합니다.

```text
1. 연결 조건
2. 일치 Row
3. 불일치 Row
4. 보존 방향
5. NULL
```

문법만 외우지 말고 최종 결과에 남을 Row를 직접 예상하는 것이 핵심입니다.

### 실전 패턴 12. 연결 Key 출력

먼저 요구사항에서 어떤 Table을 기준으로 볼지 판단합니다.

```sql
SELECT E.DEPT_ID, D.DEPT_ID, E.EMP_NAME
FROM EMPLOYEE E
JOIN DEPARTMENT D ON E.DEPT_ID = D.DEPT_ID;
```

이 예시를 `LEFT OUTER JOIN` 관점에서 다시 볼 때는 다음 순서로 확인합니다.

```text
1. 연결 조건
2. 일치 Row
3. 불일치 Row
4. 보존 방향
5. NULL
```

문법만 외우지 말고 최종 결과에 남을 Row를 직접 예상하는 것이 핵심입니다.

### 실전 패턴 13. 상태 조건

먼저 요구사항에서 어떤 Table을 기준으로 볼지 판단합니다.

```sql
SELECT O.ORDER_ID, C.NAME
FROM ORDERS O
JOIN CUSTOMER C ON O.CUSTOMER_ID = C.CUSTOMER_ID
WHERE O.STATUS = 'DONE';
```

이 예시를 `LEFT OUTER JOIN` 관점에서 다시 볼 때는 다음 순서로 확인합니다.

```text
1. 연결 조건
2. 일치 Row
3. 불일치 Row
4. 보존 방향
5. NULL
```

문법만 외우지 말고 최종 결과에 남을 Row를 직접 예상하는 것이 핵심입니다.

### 실전 패턴 14. 상품 가격 조건

먼저 요구사항에서 어떤 Table을 기준으로 볼지 판단합니다.

```sql
SELECT I.ORDER_ID, P.PRODUCT_NAME
FROM ORDER_ITEM I
JOIN PRODUCT P ON I.PRODUCT_ID = P.PRODUCT_ID
WHERE P.PRICE >= 10000;
```

이 예시를 `LEFT OUTER JOIN` 관점에서 다시 볼 때는 다음 순서로 확인합니다.

```text
1. 연결 조건
2. 일치 Row
3. 불일치 Row
4. 보존 방향
5. NULL
```

문법만 외우지 말고 최종 결과에 남을 Row를 직접 예상하는 것이 핵심입니다.

### 실전 패턴 15. 정렬 결합

먼저 요구사항에서 어떤 Table을 기준으로 볼지 판단합니다.

```sql
SELECT E.EMP_NAME, D.DEPT_NAME
FROM EMPLOYEE E
JOIN DEPARTMENT D ON E.DEPT_ID = D.DEPT_ID
ORDER BY D.DEPT_NAME;
```

이 예시를 `LEFT OUTER JOIN` 관점에서 다시 볼 때는 다음 순서로 확인합니다.

```text
1. 연결 조건
2. 일치 Row
3. 불일치 Row
4. 보존 방향
5. NULL
```

문법만 외우지 말고 최종 결과에 남을 Row를 직접 예상하는 것이 핵심입니다.

### 실전 패턴 16. 일부 결과

먼저 요구사항에서 어떤 Table을 기준으로 볼지 판단합니다.

```sql
SELECT E.EMP_NAME, D.DEPT_NAME
FROM EMPLOYEE E
JOIN DEPARTMENT D ON E.DEPT_ID = D.DEPT_ID
LIMIT 10;
```

이 예시를 `LEFT OUTER JOIN` 관점에서 다시 볼 때는 다음 순서로 확인합니다.

```text
1. 연결 조건
2. 일치 Row
3. 불일치 Row
4. 보존 방향
5. NULL
```

문법만 외우지 말고 최종 결과에 남을 Row를 직접 예상하는 것이 핵심입니다.

## 결과 예측 연습

### 결과 예측 1. 왼쪽 Row는 모두 보존한다

가상의 왼쪽 Table은 2개 Row, 오른쪽 Table은 3개 Row가 있다고 가정합니다.

```text
왼쪽 Row 수 = 2
오른쪽 Row 수 = 3
```

여기서 바로 Row 수를 단정하지 않습니다.

`LEFT OUTER JOIN`의 연결 조건과 중복 여부에 따라 실제 결과가 달라질 수 있기 때문입니다.

먼저 어떤 Row가 연결되고 어떤 Row가 보존되는지 표시한 뒤 결과 Row 수를 셉니다.

시험에서는 이 순서를 지키면 방향을 반대로 보는 실수를 줄일 수 있습니다.

### 결과 예측 2. 오른쪽에 짝이 없으면 오른쪽 Column이 NULL이다

가상의 왼쪽 Table은 3개 Row, 오른쪽 Table은 4개 Row가 있다고 가정합니다.

```text
왼쪽 Row 수 = 3
오른쪽 Row 수 = 4
```

여기서 바로 Row 수를 단정하지 않습니다.

`LEFT OUTER JOIN`의 연결 조건과 중복 여부에 따라 실제 결과가 달라질 수 있기 때문입니다.

먼저 어떤 Row가 연결되고 어떤 Row가 보존되는지 표시한 뒤 결과 Row 수를 셉니다.

시험에서는 이 순서를 지키면 방향을 반대로 보는 실수를 줄일 수 있습니다.

### 결과 예측 3. 오른쪽 Key IS NULL로 미연결 왼쪽 Row를 찾을 수 있다

가상의 왼쪽 Table은 4개 Row, 오른쪽 Table은 5개 Row가 있다고 가정합니다.

```text
왼쪽 Row 수 = 4
오른쪽 Row 수 = 5
```

여기서 바로 Row 수를 단정하지 않습니다.

`LEFT OUTER JOIN`의 연결 조건과 중복 여부에 따라 실제 결과가 달라질 수 있기 때문입니다.

먼저 어떤 Row가 연결되고 어떤 Row가 보존되는지 표시한 뒤 결과 Row 수를 셉니다.

시험에서는 이 순서를 지키면 방향을 반대로 보는 실수를 줄일 수 있습니다.

### 결과 예측 4. 오른쪽 조건을 WHERE에 두면 NULL Row가 제거될 수 있다

가상의 왼쪽 Table은 1개 Row, 오른쪽 Table은 1개 Row가 있다고 가정합니다.

```text
왼쪽 Row 수 = 1
오른쪽 Row 수 = 1
```

여기서 바로 Row 수를 단정하지 않습니다.

`LEFT OUTER JOIN`의 연결 조건과 중복 여부에 따라 실제 결과가 달라질 수 있기 때문입니다.

먼저 어떤 Row가 연결되고 어떤 Row가 보존되는지 표시한 뒤 결과 Row 수를 셉니다.

시험에서는 이 순서를 지키면 방향을 반대로 보는 실수를 줄일 수 있습니다.

### 결과 예측 5. OUTER는 생략 가능하다

가상의 왼쪽 Table은 2개 Row, 오른쪽 Table은 2개 Row가 있다고 가정합니다.

```text
왼쪽 Row 수 = 2
오른쪽 Row 수 = 2
```

여기서 바로 Row 수를 단정하지 않습니다.

`LEFT OUTER JOIN`의 연결 조건과 중복 여부에 따라 실제 결과가 달라질 수 있기 때문입니다.

먼저 어떤 Row가 연결되고 어떤 Row가 보존되는지 표시한 뒤 결과 Row 수를 셉니다.

시험에서는 이 순서를 지키면 방향을 반대로 보는 실수를 줄일 수 있습니다.

### 결과 예측 6. 보존하고 싶은 대상 Table을 왼쪽에 둔다

가상의 왼쪽 Table은 3개 Row, 오른쪽 Table은 3개 Row가 있다고 가정합니다.

```text
왼쪽 Row 수 = 3
오른쪽 Row 수 = 3
```

여기서 바로 Row 수를 단정하지 않습니다.

`LEFT OUTER JOIN`의 연결 조건과 중복 여부에 따라 실제 결과가 달라질 수 있기 때문입니다.

먼저 어떤 Row가 연결되고 어떤 Row가 보존되는지 표시한 뒤 결과 Row 수를 셉니다.

시험에서는 이 순서를 지키면 방향을 반대로 보는 실수를 줄일 수 있습니다.

### 결과 예측 7. 왼쪽 Row는 모두 보존한다

가상의 왼쪽 Table은 4개 Row, 오른쪽 Table은 4개 Row가 있다고 가정합니다.

```text
왼쪽 Row 수 = 4
오른쪽 Row 수 = 4
```

여기서 바로 Row 수를 단정하지 않습니다.

`LEFT OUTER JOIN`의 연결 조건과 중복 여부에 따라 실제 결과가 달라질 수 있기 때문입니다.

먼저 어떤 Row가 연결되고 어떤 Row가 보존되는지 표시한 뒤 결과 Row 수를 셉니다.

시험에서는 이 순서를 지키면 방향을 반대로 보는 실수를 줄일 수 있습니다.

### 결과 예측 8. 오른쪽에 짝이 없으면 오른쪽 Column이 NULL이다

가상의 왼쪽 Table은 1개 Row, 오른쪽 Table은 5개 Row가 있다고 가정합니다.

```text
왼쪽 Row 수 = 1
오른쪽 Row 수 = 5
```

여기서 바로 Row 수를 단정하지 않습니다.

`LEFT OUTER JOIN`의 연결 조건과 중복 여부에 따라 실제 결과가 달라질 수 있기 때문입니다.

먼저 어떤 Row가 연결되고 어떤 Row가 보존되는지 표시한 뒤 결과 Row 수를 셉니다.

시험에서는 이 순서를 지키면 방향을 반대로 보는 실수를 줄일 수 있습니다.

### 결과 예측 9. 오른쪽 Key IS NULL로 미연결 왼쪽 Row를 찾을 수 있다

가상의 왼쪽 Table은 2개 Row, 오른쪽 Table은 1개 Row가 있다고 가정합니다.

```text
왼쪽 Row 수 = 2
오른쪽 Row 수 = 1
```

여기서 바로 Row 수를 단정하지 않습니다.

`LEFT OUTER JOIN`의 연결 조건과 중복 여부에 따라 실제 결과가 달라질 수 있기 때문입니다.

먼저 어떤 Row가 연결되고 어떤 Row가 보존되는지 표시한 뒤 결과 Row 수를 셉니다.

시험에서는 이 순서를 지키면 방향을 반대로 보는 실수를 줄일 수 있습니다.

### 결과 예측 10. 오른쪽 조건을 WHERE에 두면 NULL Row가 제거될 수 있다

가상의 왼쪽 Table은 3개 Row, 오른쪽 Table은 2개 Row가 있다고 가정합니다.

```text
왼쪽 Row 수 = 3
오른쪽 Row 수 = 2
```

여기서 바로 Row 수를 단정하지 않습니다.

`LEFT OUTER JOIN`의 연결 조건과 중복 여부에 따라 실제 결과가 달라질 수 있기 때문입니다.

먼저 어떤 Row가 연결되고 어떤 Row가 보존되는지 표시한 뒤 결과 Row 수를 셉니다.

시험에서는 이 순서를 지키면 방향을 반대로 보는 실수를 줄일 수 있습니다.

### 결과 예측 11. OUTER는 생략 가능하다

가상의 왼쪽 Table은 4개 Row, 오른쪽 Table은 3개 Row가 있다고 가정합니다.

```text
왼쪽 Row 수 = 4
오른쪽 Row 수 = 3
```

여기서 바로 Row 수를 단정하지 않습니다.

`LEFT OUTER JOIN`의 연결 조건과 중복 여부에 따라 실제 결과가 달라질 수 있기 때문입니다.

먼저 어떤 Row가 연결되고 어떤 Row가 보존되는지 표시한 뒤 결과 Row 수를 셉니다.

시험에서는 이 순서를 지키면 방향을 반대로 보는 실수를 줄일 수 있습니다.

### 결과 예측 12. 보존하고 싶은 대상 Table을 왼쪽에 둔다

가상의 왼쪽 Table은 1개 Row, 오른쪽 Table은 4개 Row가 있다고 가정합니다.

```text
왼쪽 Row 수 = 1
오른쪽 Row 수 = 4
```

여기서 바로 Row 수를 단정하지 않습니다.

`LEFT OUTER JOIN`의 연결 조건과 중복 여부에 따라 실제 결과가 달라질 수 있기 때문입니다.

먼저 어떤 Row가 연결되고 어떤 Row가 보존되는지 표시한 뒤 결과 Row 수를 셉니다.

시험에서는 이 순서를 지키면 방향을 반대로 보는 실수를 줄일 수 있습니다.

### 결과 예측 13. 왼쪽 Row는 모두 보존한다

가상의 왼쪽 Table은 2개 Row, 오른쪽 Table은 5개 Row가 있다고 가정합니다.

```text
왼쪽 Row 수 = 2
오른쪽 Row 수 = 5
```

여기서 바로 Row 수를 단정하지 않습니다.

`LEFT OUTER JOIN`의 연결 조건과 중복 여부에 따라 실제 결과가 달라질 수 있기 때문입니다.

먼저 어떤 Row가 연결되고 어떤 Row가 보존되는지 표시한 뒤 결과 Row 수를 셉니다.

시험에서는 이 순서를 지키면 방향을 반대로 보는 실수를 줄일 수 있습니다.

### 결과 예측 14. 오른쪽에 짝이 없으면 오른쪽 Column이 NULL이다

가상의 왼쪽 Table은 3개 Row, 오른쪽 Table은 1개 Row가 있다고 가정합니다.

```text
왼쪽 Row 수 = 3
오른쪽 Row 수 = 1
```

여기서 바로 Row 수를 단정하지 않습니다.

`LEFT OUTER JOIN`의 연결 조건과 중복 여부에 따라 실제 결과가 달라질 수 있기 때문입니다.

먼저 어떤 Row가 연결되고 어떤 Row가 보존되는지 표시한 뒤 결과 Row 수를 셉니다.

시험에서는 이 순서를 지키면 방향을 반대로 보는 실수를 줄일 수 있습니다.

### 결과 예측 15. 오른쪽 Key IS NULL로 미연결 왼쪽 Row를 찾을 수 있다

가상의 왼쪽 Table은 4개 Row, 오른쪽 Table은 2개 Row가 있다고 가정합니다.

```text
왼쪽 Row 수 = 4
오른쪽 Row 수 = 2
```

여기서 바로 Row 수를 단정하지 않습니다.

`LEFT OUTER JOIN`의 연결 조건과 중복 여부에 따라 실제 결과가 달라질 수 있기 때문입니다.

먼저 어떤 Row가 연결되고 어떤 Row가 보존되는지 표시한 뒤 결과 Row 수를 셉니다.

시험에서는 이 순서를 지키면 방향을 반대로 보는 실수를 줄일 수 있습니다.

### 결과 예측 16. 오른쪽 조건을 WHERE에 두면 NULL Row가 제거될 수 있다

가상의 왼쪽 Table은 1개 Row, 오른쪽 Table은 3개 Row가 있다고 가정합니다.

```text
왼쪽 Row 수 = 1
오른쪽 Row 수 = 3
```

여기서 바로 Row 수를 단정하지 않습니다.

`LEFT OUTER JOIN`의 연결 조건과 중복 여부에 따라 실제 결과가 달라질 수 있기 때문입니다.

먼저 어떤 Row가 연결되고 어떤 Row가 보존되는지 표시한 뒤 결과 Row 수를 셉니다.

시험에서는 이 순서를 지키면 방향을 반대로 보는 실수를 줄일 수 있습니다.

## ON · WHERE · NULL

JOIN에서는 `ON`, `WHERE`, `NULL`을 따로 구분해서 봅니다.

```text
ON
→ 어떤 Row끼리 연결할지 결정

WHERE
→ 만들어진 결과에서 어떤 Row를 남길지 결정
```

특히 OUTER JOIN 계열에서는 반대쪽에 연결 Row가 없을 때 NULL이 생길 수 있습니다.

```text
불일치 Row
→ 보존 대상이면 남음
→ 반대쪽 Column은 NULL 가능
```

`LEFT OUTER JOIN` 문제를 풀 때도 이 세 요소를 순서대로 확인합니다.

<blockquote class="prompt-warning">
<p>OUTER JOIN에서는 ON과 WHERE에 같은 조건을 둔다고 항상 같은 결과가 되는 것은 아닙니다.</p>
</blockquote>

## 자주 하는 실수

### 실수 1. 연결 Column을 확인하지 않고 이름만 비슷한 Column을 JOIN한다.

이 실수를 피하려면 SQL을 읽기 전에 관계를 먼저 적습니다.

```text
Table
→ Key
→ 연결 대상
→ 보존 여부
```

그 다음 실제 SQL의 `ON` 조건이 이 관계와 맞는지 확인합니다.

`LEFT OUTER JOIN`에서는 특히 `왼쪽 Row는 모두 보존한다`를 함께 확인합니다.

### 실수 2. INNER와 OUTER의 보존 범위를 반대로 기억한다.

이 실수를 피하려면 SQL을 읽기 전에 관계를 먼저 적습니다.

```text
Table
→ Key
→ 연결 대상
→ 보존 여부
```

그 다음 실제 SQL의 `ON` 조건이 이 관계와 맞는지 확인합니다.

`LEFT OUTER JOIN`에서는 특히 `오른쪽에 짝이 없으면 오른쪽 Column이 NULL이다`를 함께 확인합니다.

### 실수 3. NULL을 0이나 빈 문자열과 같은 값으로 본다.

이 실수를 피하려면 SQL을 읽기 전에 관계를 먼저 적습니다.

```text
Table
→ Key
→ 연결 대상
→ 보존 여부
```

그 다음 실제 SQL의 `ON` 조건이 이 관계와 맞는지 확인합니다.

`LEFT OUTER JOIN`에서는 특히 `오른쪽 Key IS NULL로 미연결 왼쪽 Row를 찾을 수 있다`를 함께 확인합니다.

### 실수 4. 중복 Key가 있어도 결과 Row가 하나만 생긴다고 생각한다.

이 실수를 피하려면 SQL을 읽기 전에 관계를 먼저 적습니다.

```text
Table
→ Key
→ 연결 대상
→ 보존 여부
```

그 다음 실제 SQL의 `ON` 조건이 이 관계와 맞는지 확인합니다.

`LEFT OUTER JOIN`에서는 특히 `오른쪽 조건을 WHERE에 두면 NULL Row가 제거될 수 있다`를 함께 확인합니다.

### 실수 5. ON과 WHERE의 역할을 완전히 같다고 생각한다.

이 실수를 피하려면 SQL을 읽기 전에 관계를 먼저 적습니다.

```text
Table
→ Key
→ 연결 대상
→ 보존 여부
```

그 다음 실제 SQL의 `ON` 조건이 이 관계와 맞는지 확인합니다.

`LEFT OUTER JOIN`에서는 특히 `OUTER는 생략 가능하다`를 함께 확인합니다.

### 실수 6. 별칭 없이 같은 이름 Column을 사용해 출처를 헷갈린다.

이 실수를 피하려면 SQL을 읽기 전에 관계를 먼저 적습니다.

```text
Table
→ Key
→ 연결 대상
→ 보존 여부
```

그 다음 실제 SQL의 `ON` 조건이 이 관계와 맞는지 확인합니다.

`LEFT OUTER JOIN`에서는 특히 `보존하고 싶은 대상 Table을 왼쪽에 둔다`를 함께 확인합니다.

### 실수 7. 결과 Row 수를 원본 Table 크기만 보고 단정한다.

이 실수를 피하려면 SQL을 읽기 전에 관계를 먼저 적습니다.

```text
Table
→ Key
→ 연결 대상
→ 보존 여부
```

그 다음 실제 SQL의 `ON` 조건이 이 관계와 맞는지 확인합니다.

`LEFT OUTER JOIN`에서는 특히 `왼쪽 Row는 모두 보존한다`를 함께 확인합니다.

### 실수 8. Foreign Key가 없으면 JOIN 자체가 불가능하다고 생각한다.

이 실수를 피하려면 SQL을 읽기 전에 관계를 먼저 적습니다.

```text
Table
→ Key
→ 연결 대상
→ 보존 여부
```

그 다음 실제 SQL의 `ON` 조건이 이 관계와 맞는지 확인합니다.

`LEFT OUTER JOIN`에서는 특히 `오른쪽에 짝이 없으면 오른쪽 Column이 NULL이다`를 함께 확인합니다.

### 실수 9. 다중 JOIN을 한 번에 보다가 연결 순서를 놓친다.

이 실수를 피하려면 SQL을 읽기 전에 관계를 먼저 적습니다.

```text
Table
→ Key
→ 연결 대상
→ 보존 여부
```

그 다음 실제 SQL의 `ON` 조건이 이 관계와 맞는지 확인합니다.

`LEFT OUTER JOIN`에서는 특히 `오른쪽 Key IS NULL로 미연결 왼쪽 Row를 찾을 수 있다`를 함께 확인합니다.

### 실수 10. 보존해야 하는 대상 Table의 위치를 반대로 둔다.

이 실수를 피하려면 SQL을 읽기 전에 관계를 먼저 적습니다.

```text
Table
→ Key
→ 연결 대상
→ 보존 여부
```

그 다음 실제 SQL의 `ON` 조건이 이 관계와 맞는지 확인합니다.

`LEFT OUTER JOIN`에서는 특히 `오른쪽 조건을 WHERE에 두면 NULL Row가 제거될 수 있다`를 함께 확인합니다.

## 잘 놓치는 핵심

### 1. 왼쪽 Row는 모두 보존한다

이 항목은 객관식에서 문장을 살짝 바꾸어 자주 틀리게 만드는 부분입니다.

```text
핵심
→ 왼쪽 Row는 모두 보존한다
```

문제에서 `항상`, `반드시`, `모두`, `절대` 같은 표현이 나오면 실제 JOIN 규칙과 맞는지 다시 확인합니다.

### 2. 오른쪽에 짝이 없으면 오른쪽 Column이 NULL이다

이 항목은 객관식에서 문장을 살짝 바꾸어 자주 틀리게 만드는 부분입니다.

```text
핵심
→ 오른쪽에 짝이 없으면 오른쪽 Column이 NULL이다
```

문제에서 `항상`, `반드시`, `모두`, `절대` 같은 표현이 나오면 실제 JOIN 규칙과 맞는지 다시 확인합니다.

### 3. 오른쪽 Key IS NULL로 미연결 왼쪽 Row를 찾을 수 있다

이 항목은 객관식에서 문장을 살짝 바꾸어 자주 틀리게 만드는 부분입니다.

```text
핵심
→ 오른쪽 Key IS NULL로 미연결 왼쪽 Row를 찾을 수 있다
```

문제에서 `항상`, `반드시`, `모두`, `절대` 같은 표현이 나오면 실제 JOIN 규칙과 맞는지 다시 확인합니다.

### 4. 오른쪽 조건을 WHERE에 두면 NULL Row가 제거될 수 있다

이 항목은 객관식에서 문장을 살짝 바꾸어 자주 틀리게 만드는 부분입니다.

```text
핵심
→ 오른쪽 조건을 WHERE에 두면 NULL Row가 제거될 수 있다
```

문제에서 `항상`, `반드시`, `모두`, `절대` 같은 표현이 나오면 실제 JOIN 규칙과 맞는지 다시 확인합니다.

### 5. OUTER는 생략 가능하다

이 항목은 객관식에서 문장을 살짝 바꾸어 자주 틀리게 만드는 부분입니다.

```text
핵심
→ OUTER는 생략 가능하다
```

문제에서 `항상`, `반드시`, `모두`, `절대` 같은 표현이 나오면 실제 JOIN 규칙과 맞는지 다시 확인합니다.

### 6. 보존하고 싶은 대상 Table을 왼쪽에 둔다

이 항목은 객관식에서 문장을 살짝 바꾸어 자주 틀리게 만드는 부분입니다.

```text
핵심
→ 보존하고 싶은 대상 Table을 왼쪽에 둔다
```

문제에서 `항상`, `반드시`, `모두`, `절대` 같은 표현이 나오면 실제 JOIN 규칙과 맞는지 다시 확인합니다.

## 시험·면접

### 핵심 암기

```text
LEFT OUTER JOIN = 왼쪽 전체 + 오른쪽 일치
```

### 자주 나오는 문장

`LEFT OUTER JOIN은 왼쪽 Table을 전부 남기고 오른쪽에서 일치하는 값만 붙입니다.`

### 시험 접근 순서

```text
1. 왼쪽 Table 확인
2. 오른쪽 Table 확인
3. ON 조건 확인
4. 일치 Row 표시
5. 불일치 Row 처리 확인
6. NULL 여부 확인
7. WHERE 적용
```

### 면접에서 짧게 답한다면

LEFT OUTER JOIN은 왼쪽 Table의 모든 Row를 유지하고 오른쪽 Table에서 조건이 일치하는 Row를 연결하는 JOIN입니다.

핵심은 연결 조건을 만족하는 Row와 만족하지 않는 Row를 어떤 방식으로 처리하는지 이해하는 것입니다.

## 예시로 한 바퀴

EMPLOYEE와 DEPARTMENT를 생각합니다.

```text
EMPLOYEE.DEPT_ID
=
DEPARTMENT.DEPT_ID
```

먼저 직원 Row 하나를 고릅니다.

```text
EMP_ID = 1001
DEPT_ID = 10
```

DEPARTMENT에서 `DEPT_ID = 10`인 Row를 찾습니다.

```text
10 | 개발 | 서울
```

연결 여부를 판단한 다음 `LEFT OUTER JOIN`의 보존 규칙을 적용합니다.

그 뒤 SELECT Column만 남기고 WHERE 조건이 있으면 마지막으로 필터링합니다.

이 한 바퀴를 이해하면 더 큰 Table에서도 같은 방식으로 확장할 수 있습니다.

## 객관식 문제

### 1. JOIN 문제에서 가장 먼저 확인할 것은?

① 연결할 Table과 연결 Column  
② 글자 수  
③ 파일 이름  
④ 정렬 방향

<details>
<summary>정답</summary>

①

</details>

해설: `LEFT OUTER JOIN`에서는 연결 조건과 Row 보존 규칙을 먼저 확인해야 합니다.

### 2. LEFT OUTER JOIN에서 핵심 규칙으로 가장 적절한 것은?

① 왼쪽 Row는 모두 보존한다  
② 항상 모든 Row 제거  
③ 항상 CROSS JOIN  
④ Primary Key 삭제

<details>
<summary>정답</summary>

①

</details>

해설: `LEFT OUTER JOIN`에서는 연결 조건과 Row 보존 규칙을 먼저 확인해야 합니다.

### 3. JOIN 조건을 주로 작성하는 절은?

① ON  
② ORDER BY  
③ LIMIT  
④ VACUUM

<details>
<summary>정답</summary>

①

</details>

해설: `LEFT OUTER JOIN`에서는 연결 조건과 Row 보존 규칙을 먼저 확인해야 합니다.

### 4. Foreign Key가 JOIN에서 주는 도움은?

① 자연스러운 연결 기준을 찾는 힌트  
② 정렬 자동 수행  
③ 모든 NULL 제거  
④ Table 삭제

<details>
<summary>정답</summary>

①

</details>

해설: `LEFT OUTER JOIN`에서는 연결 조건과 Row 보존 규칙을 먼저 확인해야 합니다.

### 5. 중복 연결 값이 있으면?

① 결과 Row가 여러 개로 늘 수 있다  
② 항상 1 Row  
③ JOIN이 불가능하다  
④ 자동 DISTINCT

<details>
<summary>정답</summary>

①

</details>

해설: `LEFT OUTER JOIN`에서는 연결 조건과 Row 보존 규칙을 먼저 확인해야 합니다.

### 6. OUTER JOIN에서 연결 상대가 없을 때 나타날 수 있는 값은?

① NULL  
② 항상 0  
③ 항상 빈 문자열  
④ 항상 1

<details>
<summary>정답</summary>

①

</details>

해설: `LEFT OUTER JOIN`에서는 연결 조건과 Row 보존 규칙을 먼저 확인해야 합니다.

### 7. ON의 주된 역할은?

① Row 연결 조건 지정  
② 최종 정렬  
③ 출력 개수 제한  
④ Table 삭제

<details>
<summary>정답</summary>

①

</details>

해설: `LEFT OUTER JOIN`에서는 연결 조건과 Row 보존 규칙을 먼저 확인해야 합니다.

### 8. WHERE의 주된 역할은?

① 결과 Row 필터링  
② Foreign Key 생성  
③ Table 이름 변경  
④ Index 삭제

<details>
<summary>정답</summary>

①

</details>

해설: `LEFT OUTER JOIN`에서는 연결 조건과 Row 보존 규칙을 먼저 확인해야 합니다.

### 9. JOIN 결과 Row 수에 대한 설명으로 옳은 것은?

① 중복과 조건에 따라 원본보다 많아질 수 있다  
② 항상 작은 Table과 같다  
③ 항상 큰 Table과 같다  
④ 항상 두 Table 합이다

<details>
<summary>정답</summary>

①

</details>

해설: `LEFT OUTER JOIN`에서는 연결 조건과 Row 보존 규칙을 먼저 확인해야 합니다.

### 10. Table 별칭을 쓰는 이유는?

① Column 출처와 역할을 명확히 하기 위해  
② Row를 자동 삭제하기 위해  
③ NULL을 0으로 만들기 위해  
④ JOIN을 없애기 위해

<details>
<summary>정답</summary>

①

</details>

해설: `LEFT OUTER JOIN`에서는 연결 조건과 Row 보존 규칙을 먼저 확인해야 합니다.

### 11. 다중 JOIN을 볼 때 좋은 방법은?

① JOIN을 하나씩 연결해 생각한다  
② 모든 조건을 무시한다  
③ SELECT만 본다  
④ ORDER BY부터 본다

<details>
<summary>정답</summary>

①

</details>

해설: `LEFT OUTER JOIN`에서는 연결 조건과 Row 보존 규칙을 먼저 확인해야 합니다.

### 12. 시험에서 방향 실수를 줄이는 방법은?

① 왼쪽·오른쪽 Table을 먼저 적는다  
② SQL을 뒤에서만 읽는다  
③ Key를 무시한다  
④ NULL을 0으로 본다

<details>
<summary>정답</summary>

①

</details>

해설: `LEFT OUTER JOIN`에서는 연결 조건과 Row 보존 규칙을 먼저 확인해야 합니다.

## 추가 반복 연습

### 반복 연습 1. 왼쪽 Row는 모두 보존한다

이번에는 `INNER JOIN`과 함께 비교합니다.

```text
INNER JOIN
→ 불일치 왼쪽 Row 제거

LEFT OUTER JOIN
→ 왼쪽 Row는 모두 보존한다
```

문제에서 두 개념이 섞여 나오면 먼저 **어느 Row를 반드시 남겨야 하는지**를 찾습니다.

그다음 연결되지 않는 Row에서 NULL이 어느 쪽에 생기는지 확인합니다.

마지막으로 중복 Key가 있는지 보고 결과 Row가 여러 조합으로 늘어나는지 판단합니다.

이 순서를 반복하면 긴 SQL도 작은 JOIN 단위로 나누어 읽을 수 있습니다.

### 반복 연습 2. 오른쪽에 짝이 없으면 오른쪽 Column이 NULL이다

이번에는 `LEFT OUTER JOIN`과 함께 비교합니다.

```text
LEFT OUTER JOIN
→ 불일치 왼쪽 Row 보존

LEFT OUTER JOIN
→ 오른쪽에 짝이 없으면 오른쪽 Column이 NULL이다
```

문제에서 두 개념이 섞여 나오면 먼저 **어느 Row를 반드시 남겨야 하는지**를 찾습니다.

그다음 연결되지 않는 Row에서 NULL이 어느 쪽에 생기는지 확인합니다.

마지막으로 중복 Key가 있는지 보고 결과 Row가 여러 조합으로 늘어나는지 판단합니다.

이 순서를 반복하면 긴 SQL도 작은 JOIN 단위로 나누어 읽을 수 있습니다.

### 반복 연습 3. 오른쪽 Key IS NULL로 미연결 왼쪽 Row를 찾을 수 있다

이번에는 `RIGHT OUTER JOIN`과 함께 비교합니다.

```text
RIGHT OUTER JOIN
→ 오른쪽 보존

LEFT OUTER JOIN
→ 오른쪽 Key IS NULL로 미연결 왼쪽 Row를 찾을 수 있다
```

문제에서 두 개념이 섞여 나오면 먼저 **어느 Row를 반드시 남겨야 하는지**를 찾습니다.

그다음 연결되지 않는 Row에서 NULL이 어느 쪽에 생기는지 확인합니다.

마지막으로 중복 Key가 있는지 보고 결과 Row가 여러 조합으로 늘어나는지 판단합니다.

이 순서를 반복하면 긴 SQL도 작은 JOIN 단위로 나누어 읽을 수 있습니다.

### 반복 연습 4. 오른쪽 조건을 WHERE에 두면 NULL Row가 제거될 수 있다

이번에는 `FULL OUTER JOIN`과 함께 비교합니다.

```text
FULL OUTER JOIN
→ 양쪽 보존

LEFT OUTER JOIN
→ 오른쪽 조건을 WHERE에 두면 NULL Row가 제거될 수 있다
```

문제에서 두 개념이 섞여 나오면 먼저 **어느 Row를 반드시 남겨야 하는지**를 찾습니다.

그다음 연결되지 않는 Row에서 NULL이 어느 쪽에 생기는지 확인합니다.

마지막으로 중복 Key가 있는지 보고 결과 Row가 여러 조합으로 늘어나는지 판단합니다.

이 순서를 반복하면 긴 SQL도 작은 JOIN 단위로 나누어 읽을 수 있습니다.

### 반복 연습 5. OUTER는 생략 가능하다

이번에는 `ON의 오른쪽 조건`과 함께 비교합니다.

```text
ON의 오른쪽 조건
→ 왼쪽 보존 유지 가능

LEFT OUTER JOIN
→ OUTER는 생략 가능하다
```

문제에서 두 개념이 섞여 나오면 먼저 **어느 Row를 반드시 남겨야 하는지**를 찾습니다.

그다음 연결되지 않는 Row에서 NULL이 어느 쪽에 생기는지 확인합니다.

마지막으로 중복 Key가 있는지 보고 결과 Row가 여러 조합으로 늘어나는지 판단합니다.

이 순서를 반복하면 긴 SQL도 작은 JOIN 단위로 나누어 읽을 수 있습니다.

### 반복 연습 6. 보존하고 싶은 대상 Table을 왼쪽에 둔다

이번에는 `WHERE의 오른쪽 조건`과 함께 비교합니다.

```text
WHERE의 오른쪽 조건
→ NULL Row 제거 가능

LEFT OUTER JOIN
→ 보존하고 싶은 대상 Table을 왼쪽에 둔다
```

문제에서 두 개념이 섞여 나오면 먼저 **어느 Row를 반드시 남겨야 하는지**를 찾습니다.

그다음 연결되지 않는 Row에서 NULL이 어느 쪽에 생기는지 확인합니다.

마지막으로 중복 Key가 있는지 보고 결과 Row가 여러 조합으로 늘어나는지 판단합니다.

이 순서를 반복하면 긴 SQL도 작은 JOIN 단위로 나누어 읽을 수 있습니다.

### 반복 연습 7. 왼쪽 Row는 모두 보존한다

이번에는 `COUNT(*)`과 함께 비교합니다.

```text
COUNT(*)
→ 왼쪽 보존 Row도 셈

LEFT OUTER JOIN
→ 왼쪽 Row는 모두 보존한다
```

문제에서 두 개념이 섞여 나오면 먼저 **어느 Row를 반드시 남겨야 하는지**를 찾습니다.

그다음 연결되지 않는 Row에서 NULL이 어느 쪽에 생기는지 확인합니다.

마지막으로 중복 Key가 있는지 보고 결과 Row가 여러 조합으로 늘어나는지 판단합니다.

이 순서를 반복하면 긴 SQL도 작은 JOIN 단위로 나누어 읽을 수 있습니다.

### 반복 연습 8. 오른쪽에 짝이 없으면 오른쪽 Column이 NULL이다

이번에는 `COUNT(오른쪽Key)`과 함께 비교합니다.

```text
COUNT(오른쪽Key)
→ NULL은 세지 않음

LEFT OUTER JOIN
→ 오른쪽에 짝이 없으면 오른쪽 Column이 NULL이다
```

문제에서 두 개념이 섞여 나오면 먼저 **어느 Row를 반드시 남겨야 하는지**를 찾습니다.

그다음 연결되지 않는 Row에서 NULL이 어느 쪽에 생기는지 확인합니다.

마지막으로 중복 Key가 있는지 보고 결과 Row가 여러 조합으로 늘어나는지 판단합니다.

이 순서를 반복하면 긴 SQL도 작은 JOIN 단위로 나누어 읽을 수 있습니다.

### 반복 연습 9. 오른쪽 Key IS NULL로 미연결 왼쪽 Row를 찾을 수 있다

이번에는 `INNER JOIN`과 함께 비교합니다.

```text
INNER JOIN
→ 불일치 왼쪽 Row 제거

LEFT OUTER JOIN
→ 오른쪽 Key IS NULL로 미연결 왼쪽 Row를 찾을 수 있다
```

문제에서 두 개념이 섞여 나오면 먼저 **어느 Row를 반드시 남겨야 하는지**를 찾습니다.

그다음 연결되지 않는 Row에서 NULL이 어느 쪽에 생기는지 확인합니다.

마지막으로 중복 Key가 있는지 보고 결과 Row가 여러 조합으로 늘어나는지 판단합니다.

이 순서를 반복하면 긴 SQL도 작은 JOIN 단위로 나누어 읽을 수 있습니다.

### 반복 연습 10. 오른쪽 조건을 WHERE에 두면 NULL Row가 제거될 수 있다

이번에는 `LEFT OUTER JOIN`과 함께 비교합니다.

```text
LEFT OUTER JOIN
→ 불일치 왼쪽 Row 보존

LEFT OUTER JOIN
→ 오른쪽 조건을 WHERE에 두면 NULL Row가 제거될 수 있다
```

문제에서 두 개념이 섞여 나오면 먼저 **어느 Row를 반드시 남겨야 하는지**를 찾습니다.

그다음 연결되지 않는 Row에서 NULL이 어느 쪽에 생기는지 확인합니다.

마지막으로 중복 Key가 있는지 보고 결과 Row가 여러 조합으로 늘어나는지 판단합니다.

이 순서를 반복하면 긴 SQL도 작은 JOIN 단위로 나누어 읽을 수 있습니다.

### 반복 연습 11. OUTER는 생략 가능하다

이번에는 `RIGHT OUTER JOIN`과 함께 비교합니다.

```text
RIGHT OUTER JOIN
→ 오른쪽 보존

LEFT OUTER JOIN
→ OUTER는 생략 가능하다
```

문제에서 두 개념이 섞여 나오면 먼저 **어느 Row를 반드시 남겨야 하는지**를 찾습니다.

그다음 연결되지 않는 Row에서 NULL이 어느 쪽에 생기는지 확인합니다.

마지막으로 중복 Key가 있는지 보고 결과 Row가 여러 조합으로 늘어나는지 판단합니다.

이 순서를 반복하면 긴 SQL도 작은 JOIN 단위로 나누어 읽을 수 있습니다.

### 반복 연습 12. 보존하고 싶은 대상 Table을 왼쪽에 둔다

이번에는 `FULL OUTER JOIN`과 함께 비교합니다.

```text
FULL OUTER JOIN
→ 양쪽 보존

LEFT OUTER JOIN
→ 보존하고 싶은 대상 Table을 왼쪽에 둔다
```

문제에서 두 개념이 섞여 나오면 먼저 **어느 Row를 반드시 남겨야 하는지**를 찾습니다.

그다음 연결되지 않는 Row에서 NULL이 어느 쪽에 생기는지 확인합니다.

마지막으로 중복 Key가 있는지 보고 결과 Row가 여러 조합으로 늘어나는지 판단합니다.

이 순서를 반복하면 긴 SQL도 작은 JOIN 단위로 나누어 읽을 수 있습니다.

### 반복 연습 13. 왼쪽 Row는 모두 보존한다

이번에는 `ON의 오른쪽 조건`과 함께 비교합니다.

```text
ON의 오른쪽 조건
→ 왼쪽 보존 유지 가능

LEFT OUTER JOIN
→ 왼쪽 Row는 모두 보존한다
```

문제에서 두 개념이 섞여 나오면 먼저 **어느 Row를 반드시 남겨야 하는지**를 찾습니다.

그다음 연결되지 않는 Row에서 NULL이 어느 쪽에 생기는지 확인합니다.

마지막으로 중복 Key가 있는지 보고 결과 Row가 여러 조합으로 늘어나는지 판단합니다.

이 순서를 반복하면 긴 SQL도 작은 JOIN 단위로 나누어 읽을 수 있습니다.

### 반복 연습 14. 오른쪽에 짝이 없으면 오른쪽 Column이 NULL이다

이번에는 `WHERE의 오른쪽 조건`과 함께 비교합니다.

```text
WHERE의 오른쪽 조건
→ NULL Row 제거 가능

LEFT OUTER JOIN
→ 오른쪽에 짝이 없으면 오른쪽 Column이 NULL이다
```

문제에서 두 개념이 섞여 나오면 먼저 **어느 Row를 반드시 남겨야 하는지**를 찾습니다.

그다음 연결되지 않는 Row에서 NULL이 어느 쪽에 생기는지 확인합니다.

마지막으로 중복 Key가 있는지 보고 결과 Row가 여러 조합으로 늘어나는지 판단합니다.

이 순서를 반복하면 긴 SQL도 작은 JOIN 단위로 나누어 읽을 수 있습니다.

### 반복 연습 15. 오른쪽 Key IS NULL로 미연결 왼쪽 Row를 찾을 수 있다

이번에는 `COUNT(*)`과 함께 비교합니다.

```text
COUNT(*)
→ 왼쪽 보존 Row도 셈

LEFT OUTER JOIN
→ 오른쪽 Key IS NULL로 미연결 왼쪽 Row를 찾을 수 있다
```

문제에서 두 개념이 섞여 나오면 먼저 **어느 Row를 반드시 남겨야 하는지**를 찾습니다.

그다음 연결되지 않는 Row에서 NULL이 어느 쪽에 생기는지 확인합니다.

마지막으로 중복 Key가 있는지 보고 결과 Row가 여러 조합으로 늘어나는지 판단합니다.

이 순서를 반복하면 긴 SQL도 작은 JOIN 단위로 나누어 읽을 수 있습니다.

### 반복 연습 16. 오른쪽 조건을 WHERE에 두면 NULL Row가 제거될 수 있다

이번에는 `COUNT(오른쪽Key)`과 함께 비교합니다.

```text
COUNT(오른쪽Key)
→ NULL은 세지 않음

LEFT OUTER JOIN
→ 오른쪽 조건을 WHERE에 두면 NULL Row가 제거될 수 있다
```

문제에서 두 개념이 섞여 나오면 먼저 **어느 Row를 반드시 남겨야 하는지**를 찾습니다.

그다음 연결되지 않는 Row에서 NULL이 어느 쪽에 생기는지 확인합니다.

마지막으로 중복 Key가 있는지 보고 결과 Row가 여러 조합으로 늘어나는지 판단합니다.

이 순서를 반복하면 긴 SQL도 작은 JOIN 단위로 나누어 읽을 수 있습니다.

### 반복 연습 17. OUTER는 생략 가능하다

이번에는 `INNER JOIN`과 함께 비교합니다.

```text
INNER JOIN
→ 불일치 왼쪽 Row 제거

LEFT OUTER JOIN
→ OUTER는 생략 가능하다
```

문제에서 두 개념이 섞여 나오면 먼저 **어느 Row를 반드시 남겨야 하는지**를 찾습니다.

그다음 연결되지 않는 Row에서 NULL이 어느 쪽에 생기는지 확인합니다.

마지막으로 중복 Key가 있는지 보고 결과 Row가 여러 조합으로 늘어나는지 판단합니다.

이 순서를 반복하면 긴 SQL도 작은 JOIN 단위로 나누어 읽을 수 있습니다.

### 반복 연습 18. 보존하고 싶은 대상 Table을 왼쪽에 둔다

이번에는 `LEFT OUTER JOIN`과 함께 비교합니다.

```text
LEFT OUTER JOIN
→ 불일치 왼쪽 Row 보존

LEFT OUTER JOIN
→ 보존하고 싶은 대상 Table을 왼쪽에 둔다
```

문제에서 두 개념이 섞여 나오면 먼저 **어느 Row를 반드시 남겨야 하는지**를 찾습니다.

그다음 연결되지 않는 Row에서 NULL이 어느 쪽에 생기는지 확인합니다.

마지막으로 중복 Key가 있는지 보고 결과 Row가 여러 조합으로 늘어나는지 판단합니다.

이 순서를 반복하면 긴 SQL도 작은 JOIN 단위로 나누어 읽을 수 있습니다.

### 반복 연습 19. 왼쪽 Row는 모두 보존한다

이번에는 `RIGHT OUTER JOIN`과 함께 비교합니다.

```text
RIGHT OUTER JOIN
→ 오른쪽 보존

LEFT OUTER JOIN
→ 왼쪽 Row는 모두 보존한다
```

문제에서 두 개념이 섞여 나오면 먼저 **어느 Row를 반드시 남겨야 하는지**를 찾습니다.

그다음 연결되지 않는 Row에서 NULL이 어느 쪽에 생기는지 확인합니다.

마지막으로 중복 Key가 있는지 보고 결과 Row가 여러 조합으로 늘어나는지 판단합니다.

이 순서를 반복하면 긴 SQL도 작은 JOIN 단위로 나누어 읽을 수 있습니다.

### 반복 연습 20. 오른쪽에 짝이 없으면 오른쪽 Column이 NULL이다

이번에는 `FULL OUTER JOIN`과 함께 비교합니다.

```text
FULL OUTER JOIN
→ 양쪽 보존

LEFT OUTER JOIN
→ 오른쪽에 짝이 없으면 오른쪽 Column이 NULL이다
```

문제에서 두 개념이 섞여 나오면 먼저 **어느 Row를 반드시 남겨야 하는지**를 찾습니다.

그다음 연결되지 않는 Row에서 NULL이 어느 쪽에 생기는지 확인합니다.

마지막으로 중복 Key가 있는지 보고 결과 Row가 여러 조합으로 늘어나는지 판단합니다.

이 순서를 반복하면 긴 SQL도 작은 JOIN 단위로 나누어 읽을 수 있습니다.

### 반복 연습 21. 오른쪽 Key IS NULL로 미연결 왼쪽 Row를 찾을 수 있다

이번에는 `ON의 오른쪽 조건`과 함께 비교합니다.

```text
ON의 오른쪽 조건
→ 왼쪽 보존 유지 가능

LEFT OUTER JOIN
→ 오른쪽 Key IS NULL로 미연결 왼쪽 Row를 찾을 수 있다
```

문제에서 두 개념이 섞여 나오면 먼저 **어느 Row를 반드시 남겨야 하는지**를 찾습니다.

그다음 연결되지 않는 Row에서 NULL이 어느 쪽에 생기는지 확인합니다.

마지막으로 중복 Key가 있는지 보고 결과 Row가 여러 조합으로 늘어나는지 판단합니다.

이 순서를 반복하면 긴 SQL도 작은 JOIN 단위로 나누어 읽을 수 있습니다.

### 반복 연습 22. 오른쪽 조건을 WHERE에 두면 NULL Row가 제거될 수 있다

이번에는 `WHERE의 오른쪽 조건`과 함께 비교합니다.

```text
WHERE의 오른쪽 조건
→ NULL Row 제거 가능

LEFT OUTER JOIN
→ 오른쪽 조건을 WHERE에 두면 NULL Row가 제거될 수 있다
```

문제에서 두 개념이 섞여 나오면 먼저 **어느 Row를 반드시 남겨야 하는지**를 찾습니다.

그다음 연결되지 않는 Row에서 NULL이 어느 쪽에 생기는지 확인합니다.

마지막으로 중복 Key가 있는지 보고 결과 Row가 여러 조합으로 늘어나는지 판단합니다.

이 순서를 반복하면 긴 SQL도 작은 JOIN 단위로 나누어 읽을 수 있습니다.

### 반복 연습 23. OUTER는 생략 가능하다

이번에는 `COUNT(*)`과 함께 비교합니다.

```text
COUNT(*)
→ 왼쪽 보존 Row도 셈

LEFT OUTER JOIN
→ OUTER는 생략 가능하다
```

문제에서 두 개념이 섞여 나오면 먼저 **어느 Row를 반드시 남겨야 하는지**를 찾습니다.

그다음 연결되지 않는 Row에서 NULL이 어느 쪽에 생기는지 확인합니다.

마지막으로 중복 Key가 있는지 보고 결과 Row가 여러 조합으로 늘어나는지 판단합니다.

이 순서를 반복하면 긴 SQL도 작은 JOIN 단위로 나누어 읽을 수 있습니다.

### 반복 연습 24. 보존하고 싶은 대상 Table을 왼쪽에 둔다

이번에는 `COUNT(오른쪽Key)`과 함께 비교합니다.

```text
COUNT(오른쪽Key)
→ NULL은 세지 않음

LEFT OUTER JOIN
→ 보존하고 싶은 대상 Table을 왼쪽에 둔다
```

문제에서 두 개념이 섞여 나오면 먼저 **어느 Row를 반드시 남겨야 하는지**를 찾습니다.

그다음 연결되지 않는 Row에서 NULL이 어느 쪽에 생기는지 확인합니다.

마지막으로 중복 Key가 있는지 보고 결과 Row가 여러 조합으로 늘어나는지 판단합니다.

이 순서를 반복하면 긴 SQL도 작은 JOIN 단위로 나누어 읽을 수 있습니다.

## 다음에 이을 글

**RIGHT OUTER JOIN**입니다.

오른쪽 Table의 모든 Row를 유지하면서 왼쪽의 일치 데이터를 붙이는 방법을 알아봅니다.
