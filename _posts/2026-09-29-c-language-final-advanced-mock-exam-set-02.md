---
title: C 언어 최종 초고난도 모의고사 세트 2
date: 2026-09-29 18:54:04 +0900
slug: c-language-final-advanced-mock-exam-set-02
permalink: /posts/c-language-final-advanced-mock-exam-set-02/
categories: [프로그래밍, C언어]
tags: [C언어, 최종모의고사, 초고난도, 함수포인터, 메모리, 알고리즘, 자료구조, C17]
math: true
---

이번 세트는 파이널 세트 1보다 한 문제 안에 들어가는 개념 수를 더 늘린 **최종 초고난도 종합 모의고사**입니다.

가변 길이 배열 함수 포인터, 다중 포인터 한정자, 로빈후드 해싱, 영속 자료구조, 최소 비용 유량, 강한 연결 요소, 접미사 배열, 부분 수열 복원, 객체 수명과 트립까지 C 언어 규칙과 알고리즘을 동시에 추적해야 합니다.

<blockquote class="prompt-info">
<p>한 줄: 문법·포인터·메모리·자료구조·그래프·문자열·동적 알고리즘 중 하나라도 약하면 중간 추적이 무너지도록 구성한 최종 초고난도 세트입니다.</p>
</blockquote>

<details markdown="1">
<summary>풀이 방법</summary>

1. 복합 선언은 변수 이름에서 시작해 함수·포인터·배열 단계를 분해합니다.
2. 포인터와 배열은 현재 기준 객체와 이동 단위를 먼저 표시합니다.
3. `const`, `restrict`, 객체 수명 문제는 출력 계산보다 코드의 유효성을 먼저 판단합니다.
4. 해시·영속 트리·트립은 연산이 끝날 때마다 전체 논리 구조를 갱신합니다.
5. 그래프 문제는 거리뿐 아니라 잔여 용량·컴포넌트 번호·축약 그래프까지 추적합니다.
6. 문자열 알고리즘은 전처리 배열과 원본 인덱스의 의미를 구분합니다.
7. 복원 알고리즘은 최적값과 실제 복원 경로가 어떻게 연결되는지 확인합니다.
8. 정의되지 않은 동작이 포함된 선택지는 특정 숫자 결과를 계산하지 않습니다.

</details>

## 문제 1. 가변 길이 배열 함수 포인터와 포인터 반환

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>
#include <stddef.h>

typedef int *(*Picker)(
    size_t c,
    int (*a)[c],
    size_t r,
    size_t col
);

int *same(
    size_t c,
    int (*a)[c],
    size_t r,
    size_t col)
{
    return &a[r][col];
}

int *shift(
    size_t c,
    int (*a)[c],
    size_t r,
    size_t col)
{
    return
        &a[(r + 1) % 3]
          [(col + 2) % c];
}

Picker choose(int key)
{
    static Picker table[2] = {
        same,
        shift
    };

    return table[key & 1];
}

int main(void)
{
    int a[3][4] = {
        {1,  2,  3,  4},
        {5,  6,  7,  8},
        {9, 10, 11, 12}
    };

    Picker (*factory)(int) = choose;

    int *p =
        factory(1)(
            4, a, 0, 1);

    *p += 5;

    int *q =
        factory(*p & 1)(
            4, a, 1, 0);

    *q +=
        *factory(0)(
            4, a, 0, 2);

    int (*row)[4] =
        a + 2;

    (*row)[0] += *p;

    printf("%d %d %d %d\n",
           *p,
           *q,
           row[-2][1],
           a[2][0]);

    return 0;
}
```

① `13 14 2 22`  
② `13 11 2 22`  
③ `8 14 6 17`  
④ `13 14 10 22`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>13 14 2 22</code></strong>입니다.</p>

### 1. 가장 먼저 선언자를 해석

```c
typedef int *(*Picker)(
    size_t c,
    int (*a)[c],
    size_t r,
    size_t col
);
```

`Picker`는 다음 함수를 가리키는 포인터형입니다.

```text
열 개수 c
가변 길이 행을 가리키는 배열 포인터
행 인덱스
열 인덱스
```

를 받고:

```text
int *
```

를 반환합니다.

그리고:

```c
Picker (*factory)(int) = choose;
```

에서 `factory`는:

```text
int를 받는 함수
→ Picker를 반환
```

하는 함수의 포인터입니다.

즉:

```c
factory(1)(4, a, 0, 1)
```

은:

```text
1단계: factory(1)로 함수 주소 선택
2단계: 그 함수를 다시 호출
3단계: int * 반환
```

입니다.

### 2. 최초 행렬

```text
행0   1   2   3   4
행1   5   6   7   8
행2   9  10  11  12
```

### 3. p 계산

```c
factory(1)
```

에서:

```text
1 & 1 = 1
```

이므로:

```text
shift
```

가 선택됩니다.

호출:

```c
shift(4, a, 0, 1)
```

행:

```text
(0 + 1) % 3 = 1
```

열:

```text
(1 + 2) % 4 = 3
```

따라서:

```text
p → a[1][3] → 8
```

입니다.

### 4. *p += 5

```text
a[1][3]
= 8 + 5
= 13
```

현재:

```text
p → a[1][3] → 13
```

### 5. q 계산

```c
factory(*p & 1)
```

현재:

```text
*p = 13
13 & 1 = 1
```

따라서 다시 `shift`가 선택됩니다.

```c
shift(4, a, 1, 0)
```

행:

```text
(1 + 1) % 3 = 2
```

열:

```text
(0 + 2) % 4 = 2
```

따라서:

```text
q → a[2][2] → 11
```

입니다.

### 6. q가 가리키는 값 변경

```c
factory(0)
```

은:

```text
same
```

입니다.

```c
same(4, a, 0, 2)
```

는:

```text
&a[0][2]
```

를 반환합니다.

현재 값:

```text
3
```

따라서:

```text
*q
= 11 + 3
= 14
```

입니다.

즉:

```text
a[2][2] = 14
```

### 7. row 배열 포인터

```c
int (*row)[4] =
    a + 2;
```

따라서:

```text
row     → a[2]
row - 1 → a[1]
row - 2 → a[0]
```

입니다.

### 8. (*row)[0] 변경

```c
(*row)[0] += *p;
```

왼쪽:

```text
a[2][0] = 9
```

오른쪽:

```text
*p = 13
```

따라서:

```text
a[2][0] = 22
```

### 9. row[-2][1]

```text
row - 2 → a[0]
```

이므로:

```text
row[-2][1]
= a[0][1]
= 2
```

입니다.

### 10. 최종 출력

```text
13 14 2 22
```

### 반드시 알아야 할 개념

이 문제는:

```text
가변 길이 배열 포인터
함수 포인터
함수 포인터를 반환하는 함수
데이터 포인터 반환
배열 포인터 음수 인덱스
```

를 한 번에 결합합니다.

`row[-2]`가 무조건 잘못된 것은 아닙니다.

현재 `row == a + 2`이므로 같은 배열 객체 범위 안에서 `row - 2 == a`가 성립합니다.

### 자주 하는 실수

`factory(1)`이 정수 결과를 반환한다고 생각하면 안 됩니다.

첫 번째 호출의 반환값은 **다시 호출 가능한 함수 주소**입니다.

</details>

## 문제 2. 다중 포인터 const와 restrict 계약

다음 함수와 변수가 있습니다.

```c
#include <stddef.h>

void blend(
    size_t n,
    int *restrict dst,
    const int *restrict src)
{
    for (size_t i = 0; i < n; i++)
        dst[i] =
            dst[i] * 2
            + src[i];
}

int a[8] = {0};
int b[8] = {0};

int *p = a;
const int *cp = a;
```

다음 중 C17의 포인터 형식 제약과 `restrict` 사용 계약을 모두 위반하지 않는 것은 무엇입니까?

①

```c
blend(3, a, a + 3);
```

②

```c
const int **pp = &p;
```

③

```c
int **qq = &cp;
```

④

```c
blend(3, a + 1, a);
```

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>①</strong>입니다.</p>

### 1. 보기 ①의 접근 범위

```c
blend(3, a, a + 3);
```

함수 내부에서 `dst`가 접근하는 객체:

```text
a[0]
a[1]
a[2]
```

`src`가 접근하는 객체:

```text
a[3]
a[4]
a[5]
```

입니다.

실제로 수정되는 객체와 다른 `restrict` 기반 포인터를 통해 읽는 객체가 겹치지 않습니다.

따라서 이 호출은 해당 접근 범위에서 `restrict` 계약을 위반하지 않습니다.

### 2. 보기 ②

```c
const int **pp = &p;
```

`&p`의 형식은:

```text
int **
```

입니다.

이를:

```text
const int **
```

로 직접 변환하는 것은 일반적인 안전한 한정자 추가가 아닙니다.

만약 이것이 자유롭게 허용된다면 `const int` 객체 주소를 `int *` 객체 안에 주입하는 경로를 만들 수 있고, 이후 `const` 객체를 수정하려는 상황이 생길 수 있습니다.

따라서 다단계 포인터에서:

```text
int ** → const int **
```

를 단순한 `const` 추가로 보면 안 됩니다.

### 3. 보기 ③

```c
int **qq = &cp;
```

`cp`의 형식:

```text
const int *
```

이므로:

```text
&cp
```

는:

```text
const int **
```

입니다.

이를 `int **`에 저장하면 `const` 안전성을 잃습니다.

올바른 호환 형식이 아닙니다.

### 4. 보기 ④

```c
blend(3, a + 1, a);
```

`dst`가 수정하는 범위:

```text
a[1], a[2], a[3]
```

`src`가 읽는 범위:

```text
a[0], a[1], a[2]
```

입니다.

겹치는 객체:

```text
a[1], a[2]
```

가 존재합니다.

`src`가 `const int *`라는 사실은 `restrict` 문제를 없애지 않습니다.

같은 수정 대상 객체를 독립적인 `restrict` 기반 접근 경로로 함께 접근하게 되므로 계약을 위반합니다.

### 반드시 알아야 할 개념

```text
const
→ 해당 접근 경로에서 쓰기 가능 여부

restrict
→ 동일 객체에 대한 별칭 접근 계약
```

을 다룹니다.

두 개념은 서로 다른 문제입니다.

### 자주 하는 실수

단일 포인터에서:

```c
int *p;
const int *q = p;
```

가 가능하다는 이유로:

```text
int ** → const int **
```

도 같은 방식으로 안전하다고 일반화하면 안 됩니다.

</details>

## 문제 3. 로빈후드 해싱과 후방 이동 삭제

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

#define SIZE 7

typedef struct {
    int key;
    int dist;
    int used;
} Slot;

Slot table[SIZE];

void insert(int key)
{
    int i = key % SIZE;
    int dist = 0;

    while (1) {
        if (!table[i].used) {
            table[i] =
                (Slot){
                    key,
                    dist,
                    1
                };

            return;
        }

        if (table[i].dist < dist) {
            int old_key =
                table[i].key;

            int old_dist =
                table[i].dist;

            table[i].key = key;
            table[i].dist = dist;

            key = old_key;
            dist = old_dist;
        }

        i = (i + 1) % SIZE;
        dist++;
    }
}

int find(int key)
{
    int i = key % SIZE;
    int dist = 0;

    while (1) {
        if (!table[i].used)
            return -1;

        if (table[i].dist < dist)
            return -1;

        if (table[i].key == key)
            return i;

        i = (i + 1) % SIZE;
        dist++;
    }
}

void erase(int key)
{
    int i = find(key);

    if (i < 0)
        return;

    int current = i;
    int next =
        (current + 1) % SIZE;

    while (table[next].used &&
           table[next].dist > 0) {

        table[current] =
            table[next];

        table[current].dist--;

        current = next;
        next =
            (next + 1) % SIZE;
    }

    table[current].used = 0;
}

int main(void)
{
    int input[] = {
        10, 17, 24,
        5, 12, 19
    };

    for (int i = 0; i < 6; i++)
        insert(input[i]);

    erase(17);

    insert(26);

    printf("%d %d | ",
           find(26),
           find(17));

    for (int i = 0; i < SIZE; i++) {
        if (table[i].used)
            printf("%d:%d ",
                   table[i].key,
                   table[i].dist);
        else
            printf("- ");
    }

    return 0;
}
```

① `1 -1 | 19:2 26:3 - 10:0 24:1 5:0 12:1`  
② `1 -1 | 12:2 26:3 - 10:0 24:1 5:0 19:1`  
③ `0 -1 | 26:2 19:3 - 10:0 24:1 5:0 12:1`  
④ `1 4 | 19:2 26:3 - 10:0 17:1 5:0 12:1`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>1 -1 | 19:2 26:3 - 10:0 24:1 5:0 12:1</code></strong>입니다.</p>

### 1. dist의 의미

각 슬롯의 `dist`는 해당 키의 원래 해시 위치에서 현재 위치까지의 탐사 거리입니다.

로빈후드 해싱에서는 새로 들어오는 키의 탐사 거리가 현재 슬롯의 키보다 더 크면 서로 교환합니다.

즉 더 오래 떠돌아다닌 키가 앞쪽 슬롯을 가져갑니다.

### 2. 초기 삽입 후 상태

여섯 키를 순서대로 삽입하면 최종적으로:

```text
인덱스  0      1      2   3      4      5     6
값     12:2   19:3    -  10:0   17:1   24:2  5:1
```

이 됩니다.

### 3. 17 삭제

17은 인덱스 4에 있습니다.

단순히 슬롯 4를 비우면 탐사 체인이 깨질 수 있습니다.

따라서 뒤쪽 슬롯을 앞으로 당깁니다.

먼저:

```text
24:2
```

가 한 칸 앞으로 이동하여:

```text
24:1
```

이 됩니다.

그 다음:

```text
5:1
```

도 앞으로 이동해:

```text
5:0
```

이 됩니다.

그 뒤:

```text
12:2 → 12:1
19:3 → 19:2
```

순으로 랩어라운드하면서 이동합니다.

삭제 후:

```text
인덱스  0      1   2   3      4      5     6
값     19:2    -   -  10:0   24:1   5:0  12:1
```

입니다.

### 4. 26 삽입

```text
26 % 7 = 5
```

에서 시작합니다.

탐사하면서 기존 슬롯과 거리를 비교하고 로빈후드 교환 규칙을 적용하면 최종적으로 빈 인덱스 1에:

```text
26:3
```

이 들어갑니다.

최종 상태:

```text
인덱스  0      1      2   3      4      5     6
값     19:2   26:3    -  10:0   24:1   5:0  12:1
```

### 5. find 결과

```text
find(26) = 1
find(17) = -1
```

입니다.

### 반드시 알아야 할 개념

일반 선형 조사와 달리 로빈후드 해싱은 탐사 거리 분포를 평준화하는 방향으로 키를 교환합니다.

검색 중:

```c
table[i].dist < 현재 탐사 거리
```

가 되면 찾는 키가 그 뒤에 존재할 수 없다는 성질을 이용해 조기 종료할 수 있습니다.

### 자주 하는 실수

삭제 후 빈 칸 하나만 만들면 된다고 생각하면 안 됩니다.

후방 이동 삭제를 사용하는 구현에서는 뒤쪽 클러스터를 앞으로 당기며 `dist`도 함께 줄여야 합니다.

</details>

## 문제 4. 영속 세그먼트 트리와 구간 k번째 원소

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

typedef struct {
    int left;
    int right;
    int sum;
} Node;

Node seg[128];
int nodes = 1;

int update(
    int prev,
    int left,
    int right,
    int pos)
{
    int current = nodes++;

    seg[current] =
        seg[prev];

    seg[current].sum++;

    if (left != right) {
        int mid =
            (left + right) / 2;

        if (pos <= mid) {
            seg[current].left =
                update(
                    seg[prev].left,
                    left,
                    mid,
                    pos);
        }
        else {
            seg[current].right =
                update(
                    seg[prev].right,
                    mid + 1,
                    right,
                    pos);
        }
    }

    return current;
}

int kth(
    int left_root,
    int right_root,
    int left,
    int right,
    int k)
{
    if (left == right)
        return left;

    int mid =
        (left + right) / 2;

    int left_count =
        seg[
            seg[right_root].left
        ].sum
        -
        seg[
            seg[left_root].left
        ].sum;

    if (k <= left_count) {
        return kth(
            seg[left_root].left,
            seg[right_root].left,
            left,
            mid,
            k);
    }

    return kth(
        seg[left_root].right,
        seg[right_root].right,
        mid + 1,
        right,
        k - left_count);
}

int main(void)
{
    int a[] = {
        5, 1, 4,
        2, 3, 2
    };

    int root[7] = {0};

    for (int i = 0; i < 6; i++) {
        root[i + 1] =
            update(
                root[i],
                1,
                5,
                a[i]);
    }

    int x =
        kth(
            root[2],
            root[6],
            1,
            5,
            2);

    int y =
        kth(
            root[0],
            root[4],
            1,
            5,
            3);

    printf("%d %d %d %d\n",
           x,
           y,
           seg[root[6]].sum,
           nodes);

    return 0;
}
```

① `2 4 6 22`  
② `2 3 6 21`  
③ `3 4 6 22`  
④ `2 4 5 22`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>2 4 6 22</code></strong>입니다.</p>

### 1. 영속 세그먼트 트리의 핵심

각 `root[i]`는 처음 `i`개의 원소를 삽입한 버전을 나타냅니다.

```text
root[0] → 아무 원소도 없음
root[1] → a[0]까지
root[2] → a[1]까지
...
root[6] → 전체 배열
```

새 원소를 삽입할 때 기존 트리 전체를 복사하지 않고 **변경되는 경로의 노드만 새로 복제**합니다.

### 2. x의 구간

```c
kth(root[2], root[6], ..., 2)
```

은:

```text
root[6] - root[2]
```

의 빈도 차이를 사용합니다.

즉 원본 인덱스:

```text
2, 3, 4, 5
```

의 값:

```text
4, 2, 3, 2
```

만 남습니다.

정렬:

```text
2, 2, 3, 4
```

두 번째 값:

```text
2
```

따라서:

```text
x = 2
```

### 3. y의 구간

```c
kth(root[0], root[4], ..., 3)
```

은 앞의 네 값:

```text
5, 1, 4, 2
```

를 의미합니다.

정렬하면:

```text
1, 2, 4, 5
```

세 번째 값은:

```text
4
```

입니다.

따라서:

```text
y = 4
```

### 4. root[6]의 합

모든 원소 여섯 개가 삽입되었습니다.

따라서:

```text
seg[root[6]].sum = 6
```

입니다.

### 5. nodes 계산

`nodes`는 0번 빈 노드를 예약하기 위해 1에서 시작합니다.

값 범위는:

```text
[1,5]
```

입니다.

각 삽입에서 복제되는 경로 길이는 값에 따라 다릅니다.

```text
5 → 3개 노드
1 → 4개 노드
4 → 3개 노드
2 → 4개 노드
3 → 3개 노드
2 → 4개 노드
```

총 새 노드:

```text
3 + 4 + 3 + 4 + 3 + 4
= 21
```

예약된 0번 노드를 포함해 다음 사용 가능 번호는:

```text
22
```

입니다.

즉:

```text
nodes = 22
```

### 반드시 알아야 할 개념

영속 세그먼트 트리는 이전 버전을 파괴하지 않습니다.

두 버전의 빈도 차이를 이용하면 구간의 빈도 분포를 얻을 수 있고, 이를 이용해 구간 k번째 원소 질의를:

```text
O(log M)
```

에 처리할 수 있습니다.

여기서 `M`은 값 좌표 범위입니다.

### 자주 하는 실수

`root[2]`부터 `root[6]`까지 네 개의 루트를 모두 합치는 것으로 생각하면 안 됩니다.

실제로는:

```text
prefix 6개 버전
-
prefix 2개 버전
```

의 노드 합 차이를 재귀적으로 계산합니다.

</details>

## 문제 5. 최소 비용 최대 유량과 잔여 그래프

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

#define N 5
#define MAXE 64
#define INF 1000000

typedef struct {
    int to;
    int cap;
    int cost;
    int next;
} Edge;

Edge edge[MAXE];

int head[N];
int edge_count;

void add_edge(
    int u,
    int v,
    int cap,
    int cost)
{
    edge[edge_count] =
        (Edge){
            v,
            cap,
            cost,
            head[u]
        };

    head[u] = edge_count++;

    edge[edge_count] =
        (Edge){
            u,
            0,
            -cost,
            head[v]
        };

    head[v] = edge_count++;
}

int main(void)
{
    for (int i = 0; i < N; i++)
        head[i] = -1;

    add_edge(0, 1, 2, 1);
    add_edge(0, 2, 2, 2);

    add_edge(1, 2, 1, 0);
    add_edge(1, 3, 1, 3);

    add_edge(2, 3, 2, 1);
    add_edge(2, 4, 1, 4);

    add_edge(3, 4, 3, 1);

    int flow = 0;
    int cost = 0;

    while (1) {
        int dist[N];
        int prev_vertex[N];
        int prev_edge[N];
        int in_queue[N] = {0};

        int queue[128];
        int front = 0;
        int rear = 0;

        for (int i = 0; i < N; i++) {
            dist[i] = INF;
            prev_vertex[i] = -1;
            prev_edge[i] = -1;
        }

        dist[0] = 0;
        queue[rear++] = 0;
        in_queue[0] = 1;

        while (front < rear) {
            int u = queue[front++];
            in_queue[u] = 0;

            for (int e = head[u];
                 e != -1;
                 e = edge[e].next) {

                int v =
                    edge[e].to;

                if (edge[e].cap > 0 &&
                    dist[v] >
                        dist[u]
                        + edge[e].cost) {

                    dist[v] =
                        dist[u]
                        + edge[e].cost;

                    prev_vertex[v] = u;
                    prev_edge[v] = e;

                    if (!in_queue[v]) {
                        in_queue[v] = 1;
                        queue[rear++] = v;
                    }
                }
            }
        }

        if (dist[4] == INF)
            break;

        int add = INF;

        for (int v = 4;
             v != 0;
             v = prev_vertex[v]) {

            if (edge[
                    prev_edge[v]
                ].cap < add)
                add =
                    edge[
                        prev_edge[v]
                    ].cap;
        }

        for (int v = 4;
             v != 0;
             v = prev_vertex[v]) {

            int e =
                prev_edge[v];

            edge[e].cap -= add;

            edge[e ^ 1].cap += add;
        }

        flow += add;
        cost += add * dist[4];
    }

    printf("%d %d | %d %d\n",
           flow,
           cost,
           edge[0].cap,
           edge[2].cap);

    return 0;
}
```

① `4 18 | 0 0`  
② `4 16 | 0 0`  
③ `3 12 | 1 0`  
④ `4 18 | 1 1`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>4 18 | 0 0</code></strong>입니다.</p>

### 1. 최대 유량부터 확인

source 0에서 나가는 용량:

```text
0 → 1 : 2
0 → 2 : 2
```

총:

```text
4
```

입니다.

sink 4로 들어가는 용량은:

```text
2 → 4 : 1
3 → 4 : 3
```

총 4입니다.

실제로 네 단위 모두 보낼 수 있으므로 최대 유량:

```text
flow = 4
```

입니다.

### 2. 최소 비용을 만드는 흐름 분해

최종 유량은 다음 네 경로로 분해할 수 있습니다.

#### 첫 번째

```text
0 → 1 → 2 → 3 → 4
```

비용:

```text
1 + 0 + 1 + 1
= 3
```

#### 두 번째

```text
0 → 2 → 3 → 4
```

비용:

```text
2 + 1 + 1
= 4
```

#### 세 번째

```text
0 → 1 → 3 → 4
```

비용:

```text
1 + 3 + 1
= 5
```

#### 네 번째

```text
0 → 2 → 4
```

비용:

```text
2 + 4
= 6
```

전체 비용:

```text
3 + 4 + 5 + 6
= 18
```

따라서:

```text
cost = 18
```

### 3. source 간선 잔여 용량

원래:

```text
edge[0]
→ 0 → 1
→ 용량 2
```

입니다.

최종적으로 두 단위가 모두 사용되어:

```text
edge[0].cap = 0
```

입니다.

`edge[2]`는:

```text
0 → 2
```

의 정방향 간선이며 역시 두 단위를 모두 사용합니다.

```text
edge[2].cap = 0
```

### 4. 역방향 간선의 의미

각 정방향 간선을 추가할 때 비용 부호가 반대인 역방향 간선도 만듭니다.

이 역방향 간선은 이전에 선택한 흐름을 나중에 부분적으로 취소하여 더 좋은 전체 비용 구성으로 재배치할 수 있게 합니다.

### 반드시 알아야 할 개념

최소 비용 최대 유량 문제에서는:

```text
최대 유량을 얼마나 보낼 수 있는가
```

와:

```text
그 최대 유량을 보내는 방법 중 비용이 최소인가
```

를 동시에 만족해야 합니다.

잔여 그래프의 역방향 간선은 단순 구현상의 보조 데이터가 아니라 최적화 가능성을 보장하는 핵심 요소입니다.

### 자주 하는 실수

각 순간 가장 싼 원래 경로만 독립적으로 고르면 된다고 생각하면 안 됩니다.

경로들이 용량을 공유하므로 잔여 그래프를 통해 앞선 선택이 다시 조정될 수 있습니다.

</details>

## 문제 6. 타잔 강한 연결 요소와 축약 그래프

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

#define N 8

int graph[N][N];

int index_value[N];
int low[N];
int on_stack[N];

int stack[N];
int top;

int timer = 1;

int component[N];
int component_count;

void dfs(int u)
{
    index_value[u] =
        low[u] = timer++;

    stack[top++] = u;
    on_stack[u] = 1;

    for (int v = 0;
         v < N;
         v++) {

        if (!graph[u][v])
            continue;

        if (index_value[v] == 0) {
            dfs(v);

            if (low[v] < low[u])
                low[u] = low[v];
        }
        else if (on_stack[v] &&
                 index_value[v]
                    < low[u]) {

            low[u] =
                index_value[v];
        }
    }

    if (low[u] ==
        index_value[u]) {

        while (1) {
            int v =
                stack[--top];

            on_stack[v] = 0;

            component[v] =
                component_count;

            if (v == u)
                break;
        }

        component_count++;
    }
}

int main(void)
{
    int edge[][2] = {
        {0,1},
        {1,2},
        {2,0},

        {2,3},

        {3,4},
        {4,3},

        {4,5},

        {5,6},
        {6,5},

        {6,7},

        {1,5}
    };

    for (int i = 0; i < 11; i++)
        graph[
            edge[i][0]
        ][
            edge[i][1]
        ] = 1;

    for (int i = 0; i < N; i++) {
        if (index_value[i] == 0)
            dfs(i);
    }

    int indegree[N] = {0};
    int outdegree[N] = {0};
    int condensed[N][N] = {0};

    for (int u = 0; u < N; u++) {
        for (int v = 0; v < N; v++) {

            if (!graph[u][v])
                continue;

            int a = component[u];
            int b = component[v];

            if (a != b &&
                !condensed[a][b]) {

                condensed[a][b] = 1;
                outdegree[a]++;
                indegree[b]++;
            }
        }
    }

    int source_count = 0;
    int sink_count = 0;

    for (int c = 0;
         c < component_count;
         c++) {

        if (indegree[c] == 0)
            source_count++;

        if (outdegree[c] == 0)
            sink_count++;
    }

    printf(
        "%d %d %d | %d %d %d %d\n",
        component_count,
        source_count,
        sink_count,
        component[0],
        component[3],
        component[5],
        component[7]);

    return 0;
}
```

① `4 1 1 | 3 2 1 0`  
② `4 1 1 | 0 1 2 3`  
③ `3 1 1 | 2 1 1 0`  
④ `4 2 1 | 3 2 1 0`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>4 1 1 | 3 2 1 0</code></strong>입니다.</p>

### 1. 실제 강한 연결 요소

그래프를 묶으면:

```text
{0,1,2}
{3,4}
{5,6}
{7}
```

네 개의 SCC가 있습니다.

따라서:

```text
component_count = 4
```

입니다.

### 2. 타잔에서 컴포넌트 번호가 붙는 순서

정점 0부터 DFS가 깊게 진행됩니다.

가장 깊은 쪽 정점 7이 먼저 SCC로 완성됩니다.

따라서:

```text
{7} → component 0
```

그 다음:

```text
{5,6} → component 1
```

다음:

```text
{3,4} → component 2
```

마지막:

```text
{0,1,2} → component 3
```

입니다.

따라서:

```text
component[0] = 3
component[3] = 2
component[5] = 1
component[7] = 0
```

입니다.

### 3. 축약 그래프 간선

SCC 간 중복 간선을 하나로 합치면:

```text
3 → 2
3 → 1
2 → 1
1 → 0
```

입니다.

### 4. source 컴포넌트

진입 차수가 0인 컴포넌트는:

```text
component 3
```

하나입니다.

```text
source_count = 1
```

### 5. sink 컴포넌트

진출 차수가 0인 컴포넌트는:

```text
component 0
```

하나입니다.

```text
sink_count = 1
```

### 6. 최종 출력

```text
4 1 1 | 3 2 1 0
```

### 반드시 알아야 할 개념

SCC 축약 그래프는 항상 방향 비순환 그래프가 됩니다.

만약 축약 후에도 서로 돌아갈 수 있는 사이클이 존재한다면 그 컴포넌트들은 처음부터 하나의 더 큰 SCC였어야 하기 때문입니다.

### 자주 하는 실수

컴포넌트 번호가 정점 번호 순서대로 붙는다고 생각하면 안 됩니다.

이 구현은 **SCC가 DFS 스택에서 완성되어 빠지는 순서**대로 0부터 번호를 부여합니다.

</details>

## 문제 7. 접미사 배열과 최장 공통 접두사

다음 코드는 문자열 `"mississippi"`의 접미사 배열과 최장 공통 접두사 배열을 계산합니다.

최종 접미사 배열이 다음과 같이 만들어졌다고 하겠습니다.

```text
순위    시작 인덱스
0       10
1        7
2        4
3        1
4        0
5        9
6        8
7        6
8        3
9        5
10       2
```

그리고 `lcp[r]`는 접미사 배열의 `r-1`번째 접미사와 `r`번째 접미사의 최장 공통 접두사 길이를 저장합니다.

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>
#include <string.h>

int main(void)
{
    const char *s =
        "mississippi";

    int sa[] = {
        10, 7, 4, 1, 0,
         9, 8, 6, 3, 5, 2
    };

    int n =
        (int)strlen(s);

    int rank[11];

    for (int i = 0; i < n; i++)
        rank[sa[i]] = i;

    int lcp[11] = {0};

    int h = 0;
    int max_lcp = 0;

    for (int i = 0; i < n; i++) {
        int r = rank[i];

        if (r == 0)
            continue;

        int j = sa[r - 1];

        while (i + h < n &&
               j + h < n &&
               s[i + h] == s[j + h])
            h++;

        lcp[r] = h;

        if (h > max_lcp)
            max_lcp = h;

        if (h > 0)
            h--;
    }

    printf("%d %d %d %d %d\n",
           sa[0],
           sa[3],
           sa[10],
           max_lcp,
           rank[0]);

    return 0;
}
```

① `10 1 2 4 4`  
② `10 4 2 3 4`  
③ `7 1 5 4 0`  
④ `10 1 2 3 5`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>10 1 2 4 4</code></strong>입니다.</p>

### 1. sa 값은 그대로 읽을 수 있음

주어진 접미사 배열:

```text
sa[0]  = 10
sa[3]  = 1
sa[10] = 2
```

입니다.

### 2. rank[0]

`rank[i]`는 원본 인덱스 `i`에서 시작하는 접미사가 접미사 배열에서 몇 번째인지 나타냅니다.

접미사 배열에서:

```text
시작 인덱스 0
```

은 순위 4에 있습니다.

따라서:

```text
rank[0] = 4
```

입니다.

### 3. 가장 긴 LCP

주요 접미사를 보면:

```text
4: issippi
1: ississippi
```

두 문자열의 공통 접두사는:

```text
issi
```

입니다.

길이:

```text
4
```

입니다.

다른 인접 접미사 쌍보다 큽니다.

따라서:

```text
max_lcp = 4
```

입니다.

### 4. 왜 인접 접미사만 보는가

어떤 두 접미사의 공통 접두사가 길다면 사전순으로 정렬했을 때 그 사이에 있는 접미사들도 해당 접두사 관계와 연결됩니다.

따라서 가장 긴 반복 부분 문자열의 길이를 찾을 때 접미사 배열의 인접 원소 LCP 중 최댓값을 보면 됩니다.

### 5. h를 1 줄이는 이유

카사이 방식에서는 다음 시작 위치로 이동할 때 이전 LCP가 적어도 한 문자만큼 줄어든 상태에서 재사용될 수 있다는 성질을 이용합니다.

이 덕분에 전체 LCP 계산을:

```text
O(n)
```

에 수행할 수 있습니다.

### 반드시 알아야 할 개념

접미사 배열은 모든 접미사의 시작 인덱스를 사전순으로 정렬한 배열입니다.

LCP 배열을 함께 사용하면:

```text
반복 부분 문자열
부분 문자열 비교
문자열 구간 문제
```

등을 효율적으로 처리할 수 있습니다.

### 자주 하는 실수

`rank[0]`을 첫 번째 접미사의 시작 인덱스라고 생각하면 안 됩니다.

```text
sa[순위] = 시작 인덱스
rank[시작 인덱스] = 순위
```

로 서로 역관계입니다.

</details>

## 문제 8. 최장 증가 부분 수열 복원

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

int lower_bound_int(
    const int *a,
    int n,
    int x)
{
    int left = 0;
    int right = n;

    while (left < right) {
        int mid =
            left
            + (right - left) / 2;

        if (a[mid] < x)
            left = mid + 1;
        else
            right = mid;
    }

    return left;
}

int main(void)
{
    int a[] = {
        3, 1, 5, 2,
        6, 4, 9, 7
    };

    int n = 8;

    int tails[8];
    int tail_index[8];
    int previous[8];

    int length = 0;

    for (int i = 0; i < n; i++) {
        int pos =
            lower_bound_int(
                tails,
                length,
                a[i]);

        tails[pos] = a[i];
        tail_index[pos] = i;

        previous[i] =
            pos == 0
            ? -1
            : tail_index[pos - 1];

        if (pos == length)
            length++;
    }

    int sequence[8];

    int index =
        tail_index[length - 1];

    for (int i = length - 1;
         i >= 0;
         i--) {

        sequence[i] = a[index];
        index = previous[index];
    }

    printf("%d | ", length);

    for (int i = 0;
         i < length;
         i++)
        printf("%d ", sequence[i]);

    printf("| %d %d\n",
           tails[0],
           tails[length - 1]);

    return 0;
}
```

① `4 | 1 2 4 7 | 1 7`  
② `4 | 1 2 6 9 | 1 7`  
③ `5 | 1 2 4 7 9 | 1 9`  
④ `4 | 3 5 6 9 | 1 7`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>4 | 1 2 4 7 | 1 7</code></strong>입니다.</p>

### 1. tails의 의미

`tails[k]`는 길이 `k+1`인 증가 부분 수열 중 현재까지 발견된 것들의 **가능한 최소 마지막 값**을 저장합니다.

이 배열 자체가 항상 실제 LIS 하나를 그대로 의미하는 것은 아닙니다.

복원을 위해 별도로:

```text
tail_index
previous
```

를 관리합니다.

### 2. 3 처리

```text
tails = [3]
length = 1
```

### 3. 1 처리

1은 3을 대체합니다.

```text
tails = [1]
```

### 4. 5 처리

5는 뒤에 추가됩니다.

```text
tails = [1,5]
```

5의 이전 원소 인덱스는 현재 길이 1 꼬리인 값 1의 위치입니다.

### 5. 2 처리

2는 5를 대체합니다.

```text
tails = [1,2]
```

이제 길이 2 수열의 더 좋은 꼬리는 2입니다.

### 6. 6 처리

```text
tails = [1,2,6]
```

### 7. 4 처리

4는 6을 대체합니다.

```text
tails = [1,2,4]
```

### 8. 9 처리

```text
tails = [1,2,4,9]
```

길이는 4가 됩니다.

### 9. 7 처리

7은 9를 대체합니다.

```text
tails = [1,2,4,7]
```

최종:

```text
length = 4
```

입니다.

### 10. previous를 따라 복원

마지막 꼬리 인덱스는 값 7의 위치입니다.

`previous[]`를 역으로 따라가면:

```text
7
← 4
← 2
← 1
```

입니다.

역순으로 배열에 넣으면:

```text
1 2 4 7
```

이 됩니다.

### 11. 최종 출력

```text
4 | 1 2 4 7 | 1 7
```

### 반드시 알아야 할 개념

이분 탐색 기반 LIS는 길이를:

```text
O(n log n)
```

에 구할 수 있습니다.

실제 수열까지 복원하려면 단순 `tails` 값만 저장해서는 부족하고 어떤 원소가 어떤 이전 원소에서 이어졌는지를 기록해야 합니다.

### 자주 하는 실수

`tails[]`의 모든 중간 상태가 원본 배열에서 실제 하나의 증가 부분 수열을 구성한다고 일반화하면 안 됩니다.

`tails`의 주목적은 각 길이의 최소 꼬리를 유지하는 것입니다.

</details>

## 문제 9. C17 객체 수명과 메모리 복사

다음 네 코드 조각 중 **C17에서 제시된 연산 자체가 정의된 방식으로 사용된 것**은 무엇입니까?

①

```c
int a[5] = {
    1, 2, 3, 4, 5
};

memcpy(
    a + 1,
    a,
    4 * sizeof *a);
```

②

```c
int a[4];

int *p = &a[0];

free(p);
```

③

```c
struct Pair {
    int x;
    int y;
};

struct Pair p = {
    10, 20
};

unsigned char buf[
    sizeof p
];

struct Pair q;

memcpy(
    buf,
    &p,
    sizeof p);

memcpy(
    &q,
    buf,
    sizeof q);

printf("%d %d\n",
       q.x,
       q.y);
```

④

```c
int *make(void)
{
    int value = 7;

    return &value;
}

int *p = make();

printf("%d\n", *p);
```

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>③</strong>입니다.</p>

### 1. 보기 ①

```c
memcpy(
    a + 1,
    a,
    4 * sizeof *a);
```

원본 범위:

```text
a[0] ~ a[3]
```

목적지 범위:

```text
a[1] ~ a[4]
```

가 겹칩니다.

`memcpy`는 원본과 목적지 영역이 겹치는 경우에 사용하면 안 됩니다.

이 경우에는:

```c
memmove
```

를 사용해야 합니다.

### 2. 보기 ②

```c
free(p);
```

에서 `p`는 `malloc`, `calloc`, `realloc` 계열 함수가 반환한 동적 할당 블록을 가리키지 않습니다.

자동 배열:

```c
int a[4];
```

의 내부 주소입니다.

따라서 `free`의 인자로 사용할 수 없습니다.

### 3. 보기 ③

구조체 객체 `p`의 객체 표현을:

```c
unsigned char
```

배열로 `memcpy`한 뒤 동일한 구조체형 객체 `q`에 다시 복사합니다.

`memcpy`는 객체의 바이트 표현을 복사하는 용도로 사용할 수 있습니다.

같은 형식의 정상적인 구조체 객체 사이에서 전체 객체 표현을 왕복 복사한 뒤 `q.x`, `q.y`를 읽는 것은 이 코드에서 정의된 방식입니다.

결과적으로:

```text
q.x = 10
q.y = 20
```

입니다.

### 4. 보기 ④

`value`는 함수 `make`의 자동 지역 변수입니다.

함수가 반환되는 순간 그 객체의 수명이 끝납니다.

반환된 주소를 이후:

```c
*p
```

로 역참조하면 유효한 살아 있는 객체를 가리키지 않습니다.

### 반드시 알아야 할 개념

C 메모리 문제에서는 주소 숫자 자체보다:

```text
그 주소가 어떤 객체를 가리키는가
그 객체의 수명이 아직 지속되는가
해당 라이브러리 함수의 사전 조건을 만족하는가
```

를 봐야 합니다.

### 자주 하는 실수

`memcpy`를 단순히 빠른 복사 함수라고 생각하면 안 됩니다.

겹치는 메모리 영역에서는 별도의 함수인 `memmove`가 필요합니다.

</details>

## 문제 10. 트립의 BST·힙 불변식과 연속 회전

다음 코드는 키에 대해서는 이진 탐색 트리, `priority`에 대해서는 최대 힙 조건을 유지하는 트립입니다.

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int key;
    int priority;
    struct Node *left;
    struct Node *right;
} Node;

Node *new_node(
    int key,
    int priority)
{
    Node *n =
        malloc(sizeof *n);

    n->key = key;
    n->priority = priority;
    n->left = NULL;
    n->right = NULL;

    return n;
}

Node *rotate_right(Node *y)
{
    Node *x = y->left;

    y->left = x->right;
    x->right = y;

    return x;
}

Node *rotate_left(Node *x)
{
    Node *y = x->right;

    x->right = y->left;
    y->left = x;

    return y;
}

Node *insert(
    Node *root,
    int key,
    int priority)
{
    if (root == NULL)
        return new_node(
            key,
            priority);

    if (key < root->key) {
        root->left =
            insert(
                root->left,
                key,
                priority);

        if (root->left->priority >
            root->priority)
            root =
                rotate_right(root);
    }
    else {
        root->right =
            insert(
                root->right,
                key,
                priority);

        if (root->right->priority >
            root->priority)
            root =
                rotate_left(root);
    }

    return root;
}

void preorder(Node *root)
{
    if (root == NULL)
        return;

    printf("%d:%d ",
           root->key,
           root->priority);

    preorder(root->left);
    preorder(root->right);
}

int main(void)
{
    int key[] = {
        50, 30, 70, 20,
        40, 60, 80
    };

    int priority[] = {
        30, 40, 20, 50,
        35, 45, 10
    };

    Node *root = NULL;

    for (int i = 0; i < 7; i++) {
        root =
            insert(
                root,
                key[i],
                priority[i]);
    }

    preorder(root);

    return 0;
}
```

① `20:50 60:45 30:40 40:35 50:30 70:20 80:10`  
② `60:50 20:45 30:40 40:35 50:30 70:20 80:10`  
③ `20:50 30:40 40:35 50:30 60:45 70:20 80:10`  
④ `50:50 30:40 20:30 40:35 60:45 70:20 80:10`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>20:50 60:45 30:40 40:35 50:30 70:20 80:10</code></strong>입니다.</p>

### 1. 트립의 두 불변식

키 기준으로는 이진 탐색 트리입니다.

```text
왼쪽 키 < 부모 키 < 오른쪽 키
```

동시에 우선순위는 최대 힙입니다.

```text
부모 priority > 자식 priority
```

새 키는 BST 규칙으로 삽입하고 우선순위 조건이 깨지면 회전으로 위로 올립니다.

### 2. 50:30

첫 노드:

```text
50:30
```

### 3. 30:40

키 30은 왼쪽에 들어갑니다.

하지만 우선순위 40이 부모 30보다 큽니다.

오른쪽 회전 후:

```text
30:40
   \
   50:30
```

### 4. 70:20

BST 규칙에 따라 50의 오른쪽에 들어갑니다.

우선순위가 작으므로 회전 없습니다.

### 5. 20:50

20은 30의 왼쪽에 삽입됩니다.

우선순위:

```text
50 > 40
```

이므로 오른쪽 회전합니다.

새 루트:

```text
20:50
```

입니다.

### 6. 40:35

경로:

```text
20
→ 30
→ 50의 왼쪽
```

에 삽입됩니다.

`40:35`는 `50:30`보다 우선순위가 높으므로 50을 기준으로 오른쪽 회전합니다.

부분 트리:

```text
40:35
   \
   50:30
```

가 됩니다.

30의 우선순위 40보다 35가 작으므로 더 올라가지는 않습니다.

### 7. 60:45

60은 BST 기준으로 오른쪽 깊숙이 들어갑니다.

삽입 뒤 우선순위 45 때문에 여러 번 회전합니다.

결국:

```text
20:50
   \
   60:45
```

구조까지 올라옵니다.

60의 왼쪽에는 기존:

```text
30:40
→ 오른쪽 40:35
→ 오른쪽 50:30
```

구조가 남습니다.

오른쪽에는:

```text
70:20
```

이 위치합니다.

### 8. 80:10

80은 70의 오른쪽에 들어갑니다.

우선순위 10은 부모보다 낮으므로 회전이 없습니다.

### 9. 최종 구조

```text
20:50
   \
   60:45
   /    \
30:40   70:20
   \       \
   40:35   80:10
      \
      50:30
```

### 10. 전위 순회

```text
20:50
60:45
30:40
40:35
50:30
70:20
80:10
```

입니다.

### 반드시 알아야 할 개념

트립은:

```text
BST의 키 순서
+
힙의 우선순위
```

를 동시에 유지합니다.

우선순위를 무작위로 부여하면 기대 높이가 로그 수준이 되어 평균적으로 효율적인 탐색·삽입·삭제가 가능합니다.

### 자주 하는 실수

키가 작은 노드가 무조건 위로 올라간다고 생각하면 안 됩니다.

트리의 상하 관계는 우선순위가 결정하고, 좌우 관계는 키가 결정합니다.

</details>

## 잘 놓치는 핵심

### 1. 함수 포인터 문제는 반환형을 끝까지 추적한다

첫 호출의 반환값이 정수인지 데이터 포인터인지 다시 호출할 함수 주소인지 구분해야 합니다.

### 2. 포인터 한정자는 단계별로 해석한다

단일 포인터에서 가능한 `const` 변환을 다중 포인터에 그대로 일반화하면 안 되며 `restrict`는 별칭 계약을 따로 판단해야 합니다.

### 3. 고급 자료구조는 내부 불변식이 곧 풀이 기준이다

로빈후드 해시의 탐사 거리, 트립의 BST·힙 조건처럼 구조가 유지해야 하는 규칙부터 찾습니다.

### 4. 영속 자료구조는 버전 간 차이를 이용한다

전체 구조를 매번 복사하는 것이 아니라 변경 경로만 복제하고 이전 루트를 그대로 보존합니다.

### 5. 그래프 최적화는 원본 그래프만 보면 안 된다

최소 비용 유량의 잔여 그래프, SCC 축약 그래프처럼 알고리즘이 새로 만드는 구조가 실제 풀이 대상이 됩니다.

### 6. 문자열·수열 알고리즘은 값과 인덱스 정보를 분리한다

접미사 배열과 순위 배열, LIS의 꼬리값과 복원 인덱스처럼 같은 알고리즘 안에서도 서로 다른 의미의 배열을 구분해야 합니다.

## 시험·면접에서 바로 보는 포인트

- 복합 선언은 이름에서 시작해 오른쪽 괄호와 왼쪽 별표를 단계적으로 읽습니다.
- 다중 포인터 `const` 문제는 한 단계만 제거해 보며 실제 수정 가능 객체를 확인합니다.
- 해시 삭제 후에는 검색 불변식이 계속 유지되는지 확인합니다.
- 영속 트리에서는 두 루트의 합 차이가 어느 구간을 의미하는지 먼저 정합니다.
- 유량 문제는 정방향 용량뿐 아니라 역방향 잔여 간선을 함께 봅니다.
- SCC 문제는 실제 컴포넌트와 구현이 붙인 컴포넌트 번호를 구분합니다.
- 접미사 배열과 `rank`는 서로 역관계입니다.
- LIS에서 길이 계산용 `tails`와 실제 수열 복원용 인덱스 연결을 구분합니다.
- 메모리 문제는 주소값보다 객체 수명과 라이브러리 함수의 사전 조건을 먼저 확인합니다.
- 트립은 키의 BST 조건과 우선순위의 힙 조건을 동시에 검사합니다.

## 다음에 이을 글

파이널 초고난도 세트 3에서는 **복합 선언자·재귀 콜백·원자적 연산 기초·메모리 표현·B-트리 삭제·동적 연결성·최소 비용 경로·접미사 자동자·트리 동적 계획법**까지 결합하여 문제당 추적 단계와 개념 밀도를 더 높입니다.
