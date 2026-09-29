---
title: C 언어 최종 초고난도 모의고사 세트 1
date: 2026-09-29 18:37:02 +0900
slug: c-language-final-advanced-mock-exam-set-01
permalink: /posts/c-language-final-advanced-mock-exam-set-01/
categories: [프로그래밍, C언어]
tags: [C언어, 최종모의고사, 초고난도, 함수포인터, 메모리, 알고리즘, 자료구조, C17]
math: true
---

지금까지 다룬 **C 언어 문법·포인터·함수 포인터·메모리 모델·비트 연산·자료구조·그래프·문자열·동적 계획법**을 한 세트에 종합한 최종 초고난도 모의고사입니다.

단순 계산보다 먼저 코드의 유효성, 자료형, 포인터 대상, 자료구조의 불변식과 알고리즘 상태를 판별해야 하며, 한 문제 안에서 여러 개념이 연쇄적으로 결합됩니다.

<blockquote class="prompt-info">
<p>한 줄: 한 개념만 알아서는 풀리지 않도록 C17 언어 규칙과 고급 알고리즘·자료구조를 복합적으로 결합한 최종 모의고사입니다.</p>
</blockquote>

<details markdown="1">
<summary>풀이 방법</summary>

1. 출력값을 계산하기 전에 C17에서 정의된 동작인지 먼저 확인합니다.
2. 복합 선언자는 변수 이름에서 시작하여 함수·배열·포인터 단계를 한 단계씩 해석합니다.
3. 포인터 문제는 현재 포인터가 어느 객체의 어느 원소를 가리키는지 매 문장마다 갱신합니다.
4. 작은 정수형은 산술 전에 정수 승격이 일어나는지 확인합니다.
5. `realloc` 이후에는 이전 객체를 가리키던 별칭 포인터의 유효성을 다시 판정합니다.
6. 힙·트리·서로소 집합·세그먼트 트리는 각 연산 뒤의 내부 상태를 다시 적습니다.
7. 그래프 알고리즘은 거리·선행 정점·큐 상태를 함께 추적합니다.
8. 문자열 알고리즘은 전처리 자료구조와 현재 상태 번호를 구분합니다.
9. 비트마스크 동적 계획법은 비트 집합과 마지막 정점의 의미를 먼저 정의합니다.
10. 정의되지 않은 동작이 포함되면 특정 출력값을 계산하지 않습니다.

</details>

## 문제 1. 함수 포인터 반환 함수와 배열 포인터의 제자리 갱신

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

typedef int (*Op)(
    int (*)[3],
    int
);

int row_sum(
    int (*a)[3],
    int r)
{
    return
        a[r][0]
        + a[r][1]
        + a[r][2];
}

int twist(
    int (*a)[3],
    int r)
{
    a[r][1] +=
        a[(r + 1) % 3][0];

    return a[r][1];
}

Op pick(int key)
{
    static Op table[2] = {
        row_sum,
        twist
    };

    return table[key & 1];
}

int main(void)
{
    int a[3][3] = {
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9}
    };

    Op (*factory)(int) = pick;

    int x =
        factory(1)(a, 1);

    int (*p)[3] = a + 1;

    p[1][0] +=
        factory(x)(a, 0);

    int y =
        factory(a[2][0] & 1)(
            a, 2);

    printf("%d %d %d %d %d\n",
           x,
           y,
           a[2][0],
           a[2][1],
           p[-1][1]);

    return 0;
}
```

① `12 9 13 9 2`  
② `12 8 13 8 2`  
③ `12 9 7 9 5`  
④ `5 9 13 9 2`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>12 9 13 9 2</code></strong>입니다.</p>

### 1. 함수 포인터 구조부터 해석

```c
typedef int (*Op)(
    int (*)[3],
    int
);
```

`Op`는 다음 함수를 가리키는 포인터형입니다.

```text
입력 1: 정수 3개짜리 행을 가리키는 포인터
입력 2: 정수
반환:   정수
```

그리고:

```c
Op (*factory)(int) = pick;
```

에서 `factory`는:

```text
int를 입력받고
Op를 반환하는 함수
```

를 가리키는 포인터입니다.

즉:

```c
factory(1)(a, 1)
```

은 두 단계입니다.

```text
factory(1)
→ 함수 포인터 반환

반환된 함수(a, 1)
→ 실제 함수 호출
```

### 2. 최초 행렬

```text
        열0  열1  열2
행0      1    2    3
행1      4    5    6
행2      7    8    9
```

### 3. x 계산

```c
factory(1)
```

은:

```text
pick(1)
→ table[1]
→ twist
```

입니다.

따라서:

```c
twist(a, 1)
```

을 실행합니다.

함수 내부:

```c
a[1][1] +=
    a[2][0];
```

즉:

```text
5 + 7 = 12
```

입니다.

행렬:

```text
1   2   3
4  12   6
7   8   9
```

반환값:

```text
x = 12
```

### 4. 배열 포인터 p

```c
int (*p)[3] = a + 1;
```

따라서:

```text
p     → a[1]
p + 1 → a[2]
p - 1 → a[0]
```

입니다.

### 5. p[1][0] 갱신

```c
p[1][0] +=
    factory(x)(a, 0);
```

왼쪽:

```text
p[1][0]
= a[2][0]
= 7
```

현재:

```text
x = 12
12 & 1 = 0
```

따라서:

```text
factory(12)
→ row_sum
```

입니다.

`row_sum(a, 0)`:

```text
1 + 2 + 3
= 6
```

따라서:

```text
a[2][0]
= 7 + 6
= 13
```

현재:

```text
1   2   3
4  12   6
13  8   9
```

### 6. y 계산

```c
a[2][0] & 1
```

현재 값은 13입니다.

```text
13 & 1 = 1
```

따라서 다시:

```text
twist(a, 2)
```

를 호출합니다.

함수 내부:

```c
a[2][1] +=
    a[0][0];
```

즉:

```text
8 + 1 = 9
```

따라서:

```text
y = 9
```

입니다.

최종 행렬:

```text
1   2   3
4  12   6
13  9   9
```

### 7. p[-1][1]

현재:

```text
p → a[1]
```

이므로:

```text
p - 1 → a[0]
```

입니다.

따라서:

```text
p[-1][1]
= a[0][1]
= 2
```

입니다.

이 포인터 연산은 같은 2차원 배열 객체 내부에서 이루어지므로 유효합니다.

### 8. 최종 출력

```text
x          = 12
y          = 9
a[2][0]    = 13
a[2][1]    = 9
p[-1][1]   = 2
```

따라서:

```text
12 9 13 9 2
```

### 반드시 알아야 할 개념

이 문제는 네 계층을 동시에 사용합니다.

```text
함수 포인터
→ 함수 포인터를 반환하는 함수
→ 배열 포인터
→ 원본 행렬의 제자리 변경
```

특히 `p[1][0]`처럼 배열 포인터의 인덱스는 현재 포인터가 가리키는 행을 기준으로 계산됩니다.

### 자주 하는 실수

`factory(x)`를 함수 실행 결과인 정수라고 생각하면 안 됩니다.

첫 호출의 결과가 **다른 함수의 주소**이고, 그 반환된 함수를 다시 호출합니다.

</details>

## 문제 2. C17 시퀀싱과 정의되지 않은 동작

초기값이 다음과 같습니다.

```c
int i = 1;
```

다음 중 **C17에서 정의되지 않은 동작을 일으키지 않으면서 실행 후 `i == 3`이 보장되는 코드**는 무엇입니까?

①

```c
i = i++ + 1;
```

②

```c
i = (i++, i + 1);
```

③

```c
printf("%d %d\n",
       i++,
       i++);
```

④

```c
int a[4] = {0};

a[i] = i++;
```

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>②</strong>입니다.</p>

### 1. 이 문제에서 숫자 계산보다 먼저 볼 것

같은 스칼라 객체 `i`가 하나의 완전 표현식 안에서 여러 번 읽히거나 수정됩니다.

따라서 단순히:

```text
후위 증가니까 먼저 사용
```

정도로 풀면 안 됩니다.

수정과 다른 접근 사이에 **시퀀싱 관계가 보장되는지**를 확인해야 합니다.

### 2. 보기 ①

```c
i = i++ + 1;
```

`i++`에 의한 수정과 대입에 의한 `i` 수정 사이에 필요한 시퀀싱 관계가 없습니다.

따라서 C17에서 정의되지 않은 동작입니다.

특정 최종값을 계산하면 안 됩니다.

### 3. 보기 ②

```c
i = (i++, i + 1);
```

여기서 쉼표는 함수 인자 구분 쉼표가 아니라 **쉼표 연산자**입니다.

쉼표 연산자는 왼쪽 표현식의 평가와 부수 효과를 완료한 뒤 오른쪽 표현식을 평가합니다.

초기:

```text
i = 1
```

먼저:

```c
i++
```

가 완료됩니다.

```text
i = 2
```

그 다음:

```c
i + 1
```

을 계산합니다.

```text
3
```

마지막으로:

```text
i = 3
```

이 됩니다.

따라서 이 코드는 잘 정의되어 있고 결과도 3입니다.

### 4. 보기 ③

```c
printf("%d %d\n",
       i++,
       i++);
```

함수 인자 평가 순서는 필요한 방식으로 시퀀싱되지 않습니다.

같은 객체 `i`를 두 인자에서 수정하므로 정의되지 않은 동작입니다.

### 5. 보기 ④

```c
a[i] = i++;
```

왼쪽 배열 인덱스를 계산하기 위해 `i`를 읽고 오른쪽에서 `i`를 수정합니다.

이 접근과 수정 사이에도 필요한 시퀀싱 관계가 없습니다.

따라서 정의되지 않은 동작입니다.

### 반드시 알아야 할 개념

<mark>고난도 C 코드에서는 출력값을 계산하기 전에 코드가 표준상 정의된 동작인지부터 판별해야 합니다.</mark>

함수 인자 사이의 쉼표와 쉼표 연산자도 구분해야 합니다.

### 자주 하는 실수

컴파일러에서 특정 값이 우연히 출력되었다는 사실을 C 표준이 그 값을 보장한다는 의미로 해석하면 안 됩니다.

</details>

## 문제 3. 정수 승격·축소 변환·비트 조합

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>
#include <stdint.h>

int main(void)
{
    uint8_t a = 250;
    uint8_t b = 20;

    int8_t c = -5;

    int x = a + b;

    uint8_t y =
        (uint8_t)x;

    uint8_t z =
        (uint8_t)(c * 3);

    uint16_t w =
        (uint16_t)(
            (y << 4)
            | (z & 0x0F)
        );

    printf("%d %u %u %u\n",
           x,
           (unsigned)y,
           (unsigned)z,
           (unsigned)w);

    return 0;
}
```

① `14 14 241 225`  
② `270 14 241 225`  
③ `270 14 15 239`  
④ `270 270 241 225`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>② <code>270 14 241 225</code></strong>입니다.</p>

### 1. 작은 정수형의 핵심 함정

`uint8_t`, `int8_t`로 선언되어 있다고 해서 모든 중간 산술 연산이 8비트에서 수행되는 것은 아닙니다.

산술 전에 정수 승격이 적용됩니다.

### 2. x 계산

```text
a = 250
b = 20
```

두 값은 산술식에서 `int`로 승격됩니다.

따라서:

```text
250 + 20
= 270
```

입니다.

즉:

```text
x = 270
```

입니다.

### 3. y 계산

```c
uint8_t y =
    (uint8_t)x;
```

270을 8비트 부호 없는 정수로 변환합니다.

```text
270 mod 256
= 14
```

따라서:

```text
y = 14
```

### 4. z 계산

```c
c * 3
```

에서 `c` 역시 `int`로 승격됩니다.

```text
-5 × 3
= -15
```

이를 `uint8_t`로 변환합니다.

```text
-15 mod 256
= 241
```

따라서:

```text
z = 241
```

### 5. w 계산

먼저:

```text
y << 4
= 14 << 4
= 224
```

입니다.

다음:

```text
z & 0x0F
```

241을 16진수로 보면:

```text
0xF1
```

입니다.

하위 4비트만 남기면:

```text
0x01
= 1
```

따라서:

```text
224 | 1
= 225
```

입니다.

```text
w = 225
```

### 6. 최종 출력

```text
270 14 241 225
```

### 반드시 알아야 할 개념

이 문제는:

```text
정수 승격
→ 부호 없는 형으로의 모듈러 변환
→ 시프트
→ 비트 마스크
```

가 연속으로 적용됩니다.

저장 자료형과 **실제 산술이 수행되는 자료형**을 분리해서 생각해야 합니다.

### 자주 하는 실수

`uint8_t` 두 값을 더하므로:

```text
250 + 20 = 14
```

라고 바로 계산하면 안 됩니다.

14는 덧셈 자체의 결과가 아니라 270을 다시 8비트 형으로 축소했을 때의 값입니다.

</details>

## 문제 4. 유연 배열 멤버·realloc·내부 별칭 포인터

다음 코드에 대한 설명으로 가장 옳은 것은 무엇입니까?

```c
#include <stdio.h>
#include <stdlib.h>
#include <stddef.h>

typedef struct {
    size_t n;
    int data[];
} Block;

int main(void)
{
    Block *p =
        malloc(
            sizeof *p
            + 3 * sizeof p->data[0]
        );

    if (p == NULL)
        return 1;

    p->n = 3;

    p->data[0] = 10;
    p->data[1] = 20;
    p->data[2] = 30;

    int *alias =
        &p->data[1];

    Block *tmp =
        realloc(
            p,
            sizeof *p
            + 5 * sizeof p->data[0]
        );

    if (tmp == NULL) {
        free(p);
        return 1;
    }

    p = tmp;
    p->n = 5;

    printf("%d\n", *alias);

    free(p);

    return 0;
}
```

① `realloc`은 기존 내용을 보존하므로 `alias`를 계속 역참조해도 항상 안전하다.  
② `tmp == p`인 경우에만 `alias` 역참조가 C17에서 보장된다.  
③ 성공한 `realloc` 이후에는 기존 객체 내부를 가리키던 `alias`를 사용하지 말고 새 `p`를 기준으로 다시 계산해야 한다.  
④ `p = tmp`를 실행하면 C 언어가 `alias`도 자동으로 새 내부 주소로 수정한다.

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>③</strong>입니다.</p>

### 1. realloc 전 상태

개념적으로:

```text
p
↓
[n][10][20][30]
       ↑
     alias
```

입니다.

`alias`는 동적 할당 블록 내부의:

```text
p->data[1]
```

을 가리킵니다.

### 2. realloc의 중요한 의미

```c
realloc(p, new_size)
```

가 성공하면 새 크기의 객체를 반환하고 기존 내용은 규칙에 따라 보존됩니다.

하지만 이전 객체는 더 이상 기존 객체로서 살아 있는 것이 아닙니다.

따라서 이전 객체 또는 그 내부를 가리키던 포인터를 이후 코드에서 계속 사용하면 안 됩니다.

### 3. 숫자 주소가 같아 보여도 문제

일부 구현에서는 재할당 후 반환된 주소가 우연히 이전 주소와 같을 수 있습니다.

그러나 다음 식의 안전성을:

```c
*alias
```

단순히 숫자 주소가 같다는 이유로 보장할 수 없습니다.

기존 객체를 기준으로 만들어 둔 별칭은 성공한 `realloc` 이후 다시 사용하지 않는 것이 표준적으로 올바른 처리입니다.

### 4. 안전한 방식

성공 후:

```c
p = tmp;
```

를 수행한 다음 필요한 내부 포인터를 새 객체 기준으로 다시 계산합니다.

```c
alias =
    &p->data[1];
```

그 후:

```c
*alias
```

를 사용합니다.

### 5. 실패한 realloc

반대로 `realloc`이 실패하여 `NULL`을 반환했다면 기존 블록 `p`는 여전히 유효합니다.

그래서 코드가:

```c
Block *tmp = realloc(...);

if (tmp == NULL) {
    free(p);
    return 1;
}

p = tmp;
```

형태로 작성되어 있습니다.

### 반드시 알아야 할 개념

`realloc` 문제는 단순히 데이터가 복사되는지만 보면 안 됩니다.

```text
객체 수명
기존 포인터의 유효성
내부 별칭
실패 시 기존 블록 보존
```

을 함께 봐야 합니다.

### 자주 하는 실수

`realloc`이 구조체 내부 포인터나 외부 별칭까지 자동으로 수정한다고 생각하면 안 됩니다.

C 포인터에 저장된 주소 관계는 프로그래머가 직접 다시 구성해야 합니다.

</details>

## 문제 5. 최소 힙 기반 다익스트라와 오래된 큐 항목

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

#define N 6
#define INF 1000000

typedef struct {
    int vertex;
    int dist;
} Item;

Item heap[64];
int heap_size;

void push(Item x)
{
    int i = heap_size++;
    heap[i] = x;

    while (i > 0) {
        int p = (i - 1) / 2;

        if (heap[p].dist <=
            heap[i].dist)
            break;

        Item tmp = heap[p];
        heap[p] = heap[i];
        heap[i] = tmp;

        i = p;
    }
}

Item pop_min(void)
{
    Item result = heap[0];

    heap_size--;

    if (heap_size == 0)
        return result;

    heap[0] =
        heap[heap_size];

    int i = 0;

    while (1) {
        int left = i * 2 + 1;
        int right = left + 1;
        int best = i;

        if (left < heap_size &&
            heap[left].dist <
                heap[best].dist)
            best = left;

        if (right < heap_size &&
            heap[right].dist <
                heap[best].dist)
            best = right;

        if (best == i)
            break;

        Item tmp = heap[i];
        heap[i] = heap[best];
        heap[best] = tmp;

        i = best;
    }

    return result;
}

int main(void)
{
    int w[N][N] = {0};

    w[0][1] = 9;
    w[0][2] = 2;

    w[2][1] = 3;
    w[2][3] = 6;
    w[2][4] = 8;
    w[2][5] = 12;

    w[1][3] = 2;
    w[1][4] = 5;

    w[3][4] = 1;
    w[3][5] = 7;

    w[4][5] = 2;

    int dist[N];
    int pred[N];

    for (int i = 0; i < N; i++) {
        dist[i] = INF;
        pred[i] = -1;
    }

    dist[0] = 0;
    push((Item){0, 0});

    int stale = 0;

    while (heap_size > 0) {
        Item cur = pop_min();

        if (cur.dist !=
            dist[cur.vertex]) {
            stale++;
            continue;
        }

        int u = cur.vertex;

        for (int v = 0;
             v < N;
             v++) {

            if (w[u][v] == 0)
                continue;

            int nd =
                dist[u] + w[u][v];

            if (nd < dist[v]) {
                dist[v] = nd;
                pred[v] = u;

                push((Item){
                    v,
                    nd
                });
            }
        }
    }

    printf(
        "%d %d %d %d | %d %d\n",
        dist[1],
        dist[3],
        dist[4],
        dist[5],
        stale,
        pred[5]);

    return 0;
}
```

① `5 7 8 10 | 3 4`  
② `5 7 8 10 | 4 4`  
③ `9 8 10 12 | 2 2`  
④ `5 7 10 12 | 4 3`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>② <code>5 7 8 10 | 4 4</code></strong>입니다.</p>

### 1. 시작 정점 0

초기:

```text
dist[0] = 0
```

직접 완화:

```text
0 → 1 : 9
0 → 2 : 2
```

따라서:

```text
dist[1] = 9
dist[2] = 2
```

힙에는:

```text
(2,2)
(1,9)
```

가 들어갑니다.

### 2. 정점 2 처리

거리 2인 정점 2가 먼저 나옵니다.

완화:

```text
2 → 1 : 3
→ 새 거리 5

2 → 3 : 6
→ 새 거리 8

2 → 4 : 8
→ 새 거리 10

2 → 5 : 12
→ 새 거리 14
```

따라서:

```text
dist =
0 5 2 8 10 14
```

입니다.

하지만 힙에는 기존:

```text
(1,9)
```

도 그대로 남아 있습니다.

### 3. 정점 1 처리

정상 거리 5인 항목이 먼저 처리됩니다.

```text
1 → 3 : 2
```

따라서:

```text
dist[3] = 7
```

입니다.

```text
1 → 4 : 5
```

는:

```text
5 + 5 = 10
```

으로 기존 10과 같으므로 엄격한 `<` 조건에서는 갱신되지 않습니다.

### 4. 정점 3 처리

정상 거리:

```text
dist[3] = 7
```

입니다.

```text
3 → 4 : 1
```

따라서:

```text
dist[4] = 8
pred[4] = 3
```

입니다.

```text
3 → 5 : 7
```

후보 14는 기존 14와 같으므로 갱신되지 않습니다.

### 5. 정점 4 처리

```text
dist[4] = 8
```

이고:

```text
4 → 5 : 2
```

이므로:

```text
dist[5] = 10
pred[5] = 4
```

입니다.

### 6. 오래된 항목 개수

최단 거리가 더 짧게 갱신되기 전에 힙에 들어간 오래된 항목은 다음과 같습니다.

```text
(1, 9)
(3, 8)
(4, 10)
(5, 14)
```

각 항목을 꺼낼 때 현재 `dist[]`와 다릅니다.

따라서:

```text
stale = 4
```

입니다.

### 7. 최종 거리

```text
dist[1] = 5
dist[3] = 7
dist[4] = 8
dist[5] = 10
```

정점 5의 직전 정점:

```text
pred[5] = 4
```

입니다.

### 8. 최종 출력

```text
5 7 8 10 | 4 4
```

### 반드시 알아야 할 개념

이 구현은 우선순위 감소 연산을 하지 않습니다.

더 짧은 거리를 찾으면 새로운 항목을 힙에 다시 넣고, 예전 항목은 나중에 꺼냈을 때:

```c
cur.dist != dist[cur.vertex]
```

로 버립니다.

### 자주 하는 실수

정점 하나가 힙에 한 번만 들어간다고 생각하면 안 됩니다.

이 방식에서는 하나의 정점이 여러 거리값으로 동시에 힙에 존재할 수 있습니다.

</details>

## 문제 6. 지연 전파 세그먼트 트리의 연속 갱신

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

long long tree[64];
long long lazy[64];

void build(
    int node,
    int left,
    int right,
    const int *a)
{
    if (left == right) {
        tree[node] = a[left];
        return;
    }

    int mid =
        (left + right) / 2;

    build(node * 2,
          left,
          mid,
          a);

    build(node * 2 + 1,
          mid + 1,
          right,
          a);

    tree[node] =
        tree[node * 2]
        + tree[node * 2 + 1];
}

void apply(
    int node,
    int left,
    int right,
    long long value)
{
    tree[node] +=
        (right - left + 1LL)
        * value;

    lazy[node] += value;
}

void push(
    int node,
    int left,
    int right)
{
    if (lazy[node] == 0 ||
        left == right)
        return;

    int mid =
        (left + right) / 2;

    apply(node * 2,
          left,
          mid,
          lazy[node]);

    apply(node * 2 + 1,
          mid + 1,
          right,
          lazy[node]);

    lazy[node] = 0;
}

void update(
    int node,
    int left,
    int right,
    int ql,
    int qr,
    long long value)
{
    if (qr < left ||
        right < ql)
        return;

    if (ql <= left &&
        right <= qr) {

        apply(
            node,
            left,
            right,
            value);

        return;
    }

    push(node, left, right);

    int mid =
        (left + right) / 2;

    update(node * 2,
           left,
           mid,
           ql,
           qr,
           value);

    update(node * 2 + 1,
           mid + 1,
           right,
           ql,
           qr,
           value);

    tree[node] =
        tree[node * 2]
        + tree[node * 2 + 1];
}

long long query(
    int node,
    int left,
    int right,
    int ql,
    int qr)
{
    if (qr < left ||
        right < ql)
        return 0;

    if (ql <= left &&
        right <= qr)
        return tree[node];

    push(node, left, right);

    int mid =
        (left + right) / 2;

    return
        query(node * 2,
              left,
              mid,
              ql,
              qr)
        +
        query(node * 2 + 1,
              mid + 1,
              right,
              ql,
              qr);
}

int main(void)
{
    int a[] = {
        3, 1, 4, 1,
        5, 9, 2, 6
    };

    build(1, 0, 7, a);

    update(
        1, 0, 7,
        2, 6, 3);

    long long x =
        query(
            1, 0, 7,
            1, 5);

    update(
        1, 0, 7,
        0, 3, -2);

    long long y =
        query(
            1, 0, 7,
            3, 7);

    long long z =
        query(
            1, 0, 7,
            0, 7);

    printf("%lld %lld %lld\n",
           x, y, z);

    return 0;
}
```

① `29 33 38`  
② `32 33 38`  
③ `32 35 40`  
④ `32 31 36`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>② <code>32 33 38</code></strong>입니다.</p>

### 1. 초기 배열

```text
인덱스   0  1  2  3  4  5  6  7
값       3  1  4  1  5  9  2  6
```

### 2. 첫 번째 구간 갱신

```text
[2,6]에 +3
```

논리적 배열은:

```text
3 1 7 4 8 12 5 6
```

입니다.

지연 전파를 사용하므로 모든 리프 노드가 즉시 수정되지 않을 수 있지만 질의 결과는 이 논리적 상태와 같습니다.

### 3. x 계산

범위:

```text
[1,5]
```

입니다.

```text
1 + 7 + 4 + 8 + 12
= 32
```

따라서:

```text
x = 32
```

### 4. 두 번째 구간 갱신

```text
[0,3]에 -2
```

현재 배열:

```text
1 -1 5 2 8 12 5 6
```

입니다.

### 5. y 계산

범위:

```text
[3,7]
```

```text
2 + 8 + 12 + 5 + 6
= 33
```

따라서:

```text
y = 33
```

### 6. z 계산

전체 합:

```text
1 - 1 + 5 + 2
+ 8 + 12 + 5 + 6
= 38
```

따라서:

```text
z = 38
```

### 반드시 알아야 할 개념

세그먼트 트리의 `tree[node]`는 구간 합을 나타내고 `lazy[node]`는 아직 자식에게 전달하지 않은 구간 갱신량입니다.

부분적으로 내려가야 할 때만:

```c
push(...)
```

를 통해 자식에게 전달합니다.

### 자주 하는 실수

`lazy[]`가 남아 있다는 이유로 현재 구간 합 `tree[node]`도 아직 갱신되지 않았다고 생각하면 안 됩니다.

이 구현에서는 `apply`가 현재 노드의 합은 즉시 갱신하고 **자식으로의 전달만 지연**합니다.

</details>

## 문제 7. 크루스칼과 서로소 집합의 랭크 대신 크기 병합

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

typedef struct {
    int u;
    int v;
    int w;
} Edge;

int parent[7];
int size_value[7];

int find_set(int x)
{
    if (parent[x] != x)
        parent[x] =
            find_set(parent[x]);

    return parent[x];
}

int unite(int a, int b)
{
    a = find_set(a);
    b = find_set(b);

    if (a == b)
        return 0;

    if (size_value[a] <
        size_value[b]) {

        int tmp = a;
        a = b;
        b = tmp;
    }

    parent[b] = a;

    size_value[a] +=
        size_value[b];

    return 1;
}

int main(void)
{
    Edge edge[] = {
        {0,1,1},
        {1,2,2},
        {0,2,3},
        {2,3,4},
        {3,4,5},
        {2,4,6},
        {4,5,7},
        {5,6,8},
        {3,6,9}
    };

    for (int i = 0; i < 7; i++) {
        parent[i] = i;
        size_value[i] = 1;
    }

    int total = 0;
    int chosen = 0;
    int skipped = 0;

    for (int i = 0;
         i < 9 && chosen < 6;
         i++) {

        if (unite(
                edge[i].u,
                edge[i].v)) {

            total += edge[i].w;
            chosen++;
        }
        else {
            skipped++;
        }
    }

    int root6 =
        find_set(6);

    printf("%d %d %d %d\n",
           total,
           chosen,
           skipped,
           root6);

    return 0;
}
```

① `27 6 2 0`  
② `24 6 2 0`  
③ `27 6 3 0`  
④ `27 5 2 4`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>27 6 2 0</code></strong>입니다.</p>

### 1. 필요한 간선 개수

정점은 7개입니다.

신장 트리는:

```text
7 - 1
= 6
```

개의 간선을 사용합니다.

### 2. 가중치 1

```text
0 - 1
```

서로 다른 집합이므로 선택합니다.

```text
total = 1
chosen = 1
```

크기가 같은 경우 코드상 첫 번째 루트 0이 대표가 됩니다.

### 3. 가중치 2

```text
1 - 2
```

1의 루트는 0입니다.

2를 0 집합에 합칩니다.

```text
total = 3
chosen = 2
```

### 4. 가중치 3

```text
0 - 2
```

두 정점은 이미 같은 집합입니다.

따라서:

```text
skipped = 1
```

### 5. 가중치 4

```text
2 - 3
```

3을 기존 집합에 합칩니다.

```text
total = 7
chosen = 3
```

### 6. 가중치 5

```text
3 - 4
```

선택합니다.

```text
total = 12
chosen = 4
```

### 7. 가중치 6

```text
2 - 4
```

이미 같은 집합입니다.

```text
skipped = 2
```

### 8. 가중치 7

```text
4 - 5
```

선택:

```text
total = 19
chosen = 5
```

### 9. 가중치 8

```text
5 - 6
```

선택:

```text
total = 27
chosen = 6
```

이제 반복 조건 때문에 종료됩니다.

### 10. root6

크기 병합 과정에서 큰 집합의 루트는 계속 0으로 유지됩니다.

`find_set(6)`은 경로 압축까지 수행하여:

```text
root6 = 0
```

을 반환합니다.

### 11. 최종 출력

```text
27 6 2 0
```

### 반드시 알아야 할 개념

크루스칼 알고리즘에서는:

```text
가중치가 작은 간선부터
→ 서로 다른 연결 요소를 잇는 경우에만 선택
```

합니다.

서로소 집합의 크기 기반 병합과 경로 압축을 함께 사용하면 매우 효율적으로 사이클 여부를 판정할 수 있습니다.

### 자주 하는 실수

마지막까지 모든 간선을 검사한다고 생각하면 안 됩니다.

`chosen == 6`이 되면 이미 신장 트리가 완성되어 반복이 종료됩니다.

</details>

## 문제 8. AVL 트리의 연속 삭제와 재균형

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int key;
    int height;
    struct Node *left;
    struct Node *right;
} Node;

int height(Node *n)
{
    return n ? n->height : 0;
}

int max_int(int a, int b)
{
    return a > b ? a : b;
}

void update(Node *n)
{
    n->height =
        1 + max_int(
                height(n->left),
                height(n->right));
}

Node *new_node(int key)
{
    Node *n =
        malloc(sizeof *n);

    n->key = key;
    n->height = 1;
    n->left = NULL;
    n->right = NULL;

    return n;
}

Node *rotate_right(Node *y)
{
    Node *x = y->left;
    Node *t = x->right;

    x->right = y;
    y->left = t;

    update(y);
    update(x);

    return x;
}

Node *rotate_left(Node *x)
{
    Node *y = x->right;
    Node *t = y->left;

    y->left = x;
    x->right = t;

    update(x);
    update(y);

    return y;
}

Node *rebalance(Node *n)
{
    if (n == NULL)
        return NULL;

    update(n);

    int balance =
        height(n->left)
        - height(n->right);

    if (balance > 1) {
        if (height(n->left->left) <
            height(n->left->right))
            n->left =
                rotate_left(n->left);

        return rotate_right(n);
    }

    if (balance < -1) {
        if (height(n->right->right) <
            height(n->right->left))
            n->right =
                rotate_right(n->right);

        return rotate_left(n);
    }

    return n;
}

Node *insert(Node *n, int key)
{
    if (n == NULL)
        return new_node(key);

    if (key < n->key)
        n->left =
            insert(n->left, key);
    else
        n->right =
            insert(n->right, key);

    return rebalance(n);
}

Node *min_node(Node *n)
{
    while (n->left)
        n = n->left;

    return n;
}

Node *erase(Node *n, int key)
{
    if (n == NULL)
        return NULL;

    if (key < n->key) {
        n->left =
            erase(n->left, key);
    }
    else if (key > n->key) {
        n->right =
            erase(n->right, key);
    }
    else {
        if (n->left == NULL) {
            Node *r = n->right;
            free(n);
            return r;
        }

        if (n->right == NULL) {
            Node *l = n->left;
            free(n);
            return l;
        }

        Node *s =
            min_node(n->right);

        n->key = s->key;

        n->right =
            erase(n->right, s->key);
    }

    return rebalance(n);
}

void preorder(Node *n)
{
    if (n == NULL)
        return;

    printf("%d ", n->key);

    preorder(n->left);
    preorder(n->right);
}

int main(void)
{
    int input[] = {
        30, 20, 40, 10,
        25, 35, 50, 5
    };

    Node *root = NULL;

    for (int i = 0; i < 8; i++)
        root =
            insert(root, input[i]);

    root = erase(root, 50);
    root = erase(root, 40);

    printf("%d | ",
           root->height);

    preorder(root);

    return 0;
}
```

① `3 | 20 10 5 30 25 35`  
② `4 | 30 20 10 5 25 35`  
③ `3 | 30 20 10 5 25 35`  
④ `3 | 20 10 5 25 30 35`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>3 | 20 10 5 30 25 35</code></strong>입니다.</p>

### 1. 삽입 완료 후 구조

주어진 키를 AVL 규칙에 따라 삽입하면 삭제 직전 트리는 다음 구조를 가집니다.

```text
        30
       /  \
     20    40
    / \    / \
   10 25  35 50
  /
 5
```

높이는 4입니다.

### 2. 50 삭제

50은 리프 노드이므로 바로 제거됩니다.

```text
        30
       /  \
     20    40
    / \    /
   10 25  35
  /
 5
```

이 단계에서는 루트 전체가 아직 AVL 허용 범위에 있습니다.

### 3. 40 삭제

40은 왼쪽 자식 35만 가진 노드입니다.

삭제 후 오른쪽 서브트리는 사실상 35 하나가 됩니다.

구조:

```text
        30
       /  \
     20    35
    / \
   10 25
  /
 5
```

### 4. 루트 30의 균형

왼쪽 서브트리 높이가 오른쪽보다 2만큼 커집니다.

왼쪽 자식 20은 왼쪽 쪽이 더 높거나 같은 좌좌 형태입니다.

따라서 30을 기준으로 오른쪽 회전합니다.

### 5. 회전 후

```text
        20
       /  \
     10    30
     /    /  \
    5    25  35
```

입니다.

### 6. 높이 계산

리프:

```text
5, 25, 35
```

의 높이는 1입니다.

```text
10의 높이 = 2
30의 높이 = 2
20의 높이 = 3
```

입니다.

### 7. 전위 순회

```text
루트
→ 왼쪽
→ 오른쪽
```

순서입니다.

따라서:

```text
20 10 5 30 25 35
```

입니다.

### 반드시 알아야 할 개념

AVL 삭제는 삽입보다 까다롭습니다.

삭제 후 균형 붕괴가 조상 방향으로 연속해서 전파될 수 있기 때문에 반환 경로마다 높이를 다시 계산하고 회전을 검사해야 합니다.

### 자주 하는 실수

삭제 대상 노드만 제거하면 끝난다고 생각하면 안 됩니다.

자료구조의 불변식은 **삭제 후 조상 노드에서도 다시 검증**해야 합니다.

</details>

## 문제 9. 트라이·실패 링크를 결합한 아호-코라식 상태 추적

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

#define MAXNODE 32

int next_node[MAXNODE][26];
int fail[MAXNODE];
int output[MAXNODE];

int nodes = 1;

int new_node(void)
{
    return nodes++;
}

void insert(const char *s)
{
    int p = 0;

    while (*s) {
        int c = *s - 'a';

        if (next_node[p][c] == 0)
            next_node[p][c] =
                new_node();

        p = next_node[p][c];
        s++;
    }

    output[p]++;
}

void build(void)
{
    int queue[MAXNODE];
    int front = 0;
    int rear = 0;

    for (int c = 0; c < 26; c++) {
        int v = next_node[0][c];

        if (v != 0)
            queue[rear++] = v;
    }

    while (front < rear) {
        int u = queue[front++];

        output[u] +=
            output[fail[u]];

        for (int c = 0;
             c < 26;
             c++) {

            int v =
                next_node[u][c];

            if (v == 0)
                continue;

            int f = fail[u];

            while (f != 0 &&
                   next_node[f][c] == 0)
                f = fail[f];

            if (next_node[f][c] != 0)
                fail[v] =
                    next_node[f][c];

            queue[rear++] = v;
        }
    }
}

int main(void)
{
    const char *patterns[] = {
        "he",
        "she",
        "his",
        "hers"
    };

    for (int i = 0; i < 4; i++)
        insert(patterns[i]);

    build();

    const char *text =
        "ahishers";

    int state = 0;
    int total = 0;
    int peak = 0;

    for (const char *p = text;
         *p;
         p++) {

        int c = *p - 'a';

        while (state != 0 &&
               next_node[state][c] == 0)
            state = fail[state];

        if (next_node[state][c] != 0)
            state =
                next_node[state][c];

        total += output[state];

        if (output[state] > peak)
            peak = output[state];
    }

    printf("%d %d %d\n",
           total,
           peak,
           state);

    return 0;
}
```

① `3 1 9`  
② `4 2 9`  
③ `4 1 7`  
④ `5 2 9`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>② <code>4 2 9</code></strong>입니다.</p>

### 1. 삽입되는 패턴

```text
he
she
his
hers
```

입니다.

노드 번호는 삽입 순서에 따라 다음처럼 만들어집니다.

```text
0 : 루트

he
h → 1
e → 2

she
s → 3
h → 4
e → 5

his
h → 1
i → 6
s → 7

hers
h → 1
e → 2
r → 8
s → 9
```

### 2. 실패 링크의 핵심

`"she"`의 끝 노드 5는 접미사 `"he"`도 동시에 패턴입니다.

따라서 실패 링크를 따라 출력 개수를 합치면:

```text
output[5] = 2
```

가 됩니다.

즉 텍스트가 `"she"` 상태에 도달하면:

```text
she
he
```

두 패턴이 동시에 발견됩니다.

### 3. 텍스트 처리

텍스트:

```text
a h i s h e r s
```

입니다.

#### `"his"`

`h → i → s`에서 패턴 `"his"`가 발견됩니다.

누적:

```text
total = 1
```

#### `"she"`와 `"he"`

그 다음 문자 흐름이 `"she"`에 도달합니다.

노드 5에서:

```text
output[5] = 2
```

이므로 두 패턴을 동시에 셉니다.

```text
total = 3
peak = 2
```

#### `"hers"`

마지막으로 `"hers"`가 완성됩니다.

```text
total = 4
```

입니다.

최종 상태는 `"hers"` 끝 노드:

```text
state = 9
```

입니다.

### 4. 최종 출력

```text
4 2 9
```

### 반드시 알아야 할 개념

아호-코라식은:

```text
트라이
+
KMP와 유사한 실패 링크
```

를 결합합니다.

여러 패턴을 동시에 탐색하면서 실패했을 때 처음부터 다시 시작하지 않고 가장 긴 유효 접미사 상태로 이동합니다.

### 자주 하는 실수

한 문자 위치에서 패턴 하나만 매칭된다고 생각하면 안 됩니다.

`"she"`가 끝나는 위치에서는 실패 링크를 통해 `"he"`도 동시에 끝납니다.

</details>

## 문제 10. 비트마스크 동적 계획법과 최적 순회 개수

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

#define N 5
#define INF 1000000000

int main(void)
{
    int w[N][N] = {
        {0, 9, 4, 7, 3},
        {9, 0, 6, 2, 8},
        {4, 6, 0, 5, 7},
        {7, 2, 5, 0, 6},
        {3, 8, 7, 6, 0}
    };

    int dp[1 << N][N];
    int ways[1 << N][N];

    for (int mask = 0;
         mask < (1 << N);
         mask++) {

        for (int i = 0;
             i < N;
             i++) {

            dp[mask][i] = INF;
            ways[mask][i] = 0;
        }
    }

    dp[1][0] = 0;
    ways[1][0] = 1;

    for (int mask = 0;
         mask < (1 << N);
         mask++) {

        if (!(mask & 1))
            continue;

        for (int u = 0;
             u < N;
             u++) {

            if (!(mask & (1 << u)) ||
                dp[mask][u] == INF)
                continue;

            for (int v = 1;
                 v < N;
                 v++) {

                if (mask & (1 << v))
                    continue;

                int next =
                    mask | (1 << v);

                int nd =
                    dp[mask][u]
                    + w[u][v];

                if (nd <
                    dp[next][v]) {

                    dp[next][v] = nd;

                    ways[next][v] =
                        ways[mask][u];
                }
                else if (nd ==
                         dp[next][v]) {

                    ways[next][v] +=
                        ways[mask][u];
                }
            }
        }
    }

    int full =
        (1 << N) - 1;

    int answer = INF;
    int count = 0;

    for (int u = 1;
         u < N;
         u++) {

        int total =
            dp[full][u]
            + w[u][0];

        if (total < answer) {
            answer = total;
            count =
                ways[full][u];
        }
        else if (total == answer) {
            count +=
                ways[full][u];
        }
    }

    printf("%d %d | %d %d\n",
           answer,
           count,
           dp[full][1],
           dp[full][4]);

    return 0;
}
```

① `21 1 | 17 18`  
② `21 2 | 17 18`  
③ `22 2 | 18 18`  
④ `21 2 | 18 17`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>② <code>21 2 | 17 18</code></strong>입니다.</p>

### 1. 상태 정의

```text
dp[mask][u]
```

는:

```text
도시 0에서 출발
mask에 포함된 도시를 모두 정확히 한 번씩 방문
현재 도시 u에서 끝나는 최소 비용
```

입니다.

`ways[mask][u]`는 그 최소 비용을 만드는 경로 수입니다.

### 2. 모든 도시를 방문하고 1에서 끝나는 최소 비용

한 최적 경로는:

```text
0 → 4 → 3 → 2 → 1
```

입니다.

비용:

```text
3 + 6 + 5 + 6
= 20
```

처럼 보이지만 이 경로의 실제 끝은 1이며 다른 순서와 비교해야 합니다.

동적 계획법 전체 비교 결과:

```text
dp[full][1] = 17
```

입니다.

대표 경로:

```text
0 → 4 → 3 → 1 → 2
```

는 2에서 끝나므로 다른 상태입니다.

`dp`는 마지막 도시까지 포함하여 각각 별도로 최소값을 유지합니다.

### 3. 완전 상태의 핵심 값

전체 상태를 계산하면:

```text
dp[full][1] = 17
dp[full][2] = 17
dp[full][3] = 18
dp[full][4] = 18
```

입니다.

### 4. 시작 도시로 복귀

마지막 도시가 1:

```text
17 + w[1][0]
= 17 + 9
= 26
```

마지막 도시가 2:

```text
17 + 4
= 21
```

마지막 도시가 3:

```text
18 + 7
= 25
```

마지막 도시가 4:

```text
18 + 3
= 21
```

따라서 전체 최적 순회 비용은:

```text
21
```

입니다.

### 5. 최적 순회 개수

비용 21을 만드는 마지막 정점은:

```text
2
4
```

두 경우입니다.

대칭적인 두 최적 순회:

```text
0 → 2 → 1 → 3 → 4 → 0
0 → 4 → 3 → 1 → 2 → 0
```

가 존재합니다.

따라서:

```text
count = 2
```

입니다.

### 6. 최종 출력

```text
21 2 | 17 18
```

### 반드시 알아야 할 개념

비트마스크 동적 계획법에서 상태는 단순히 방문 도시 집합만으로 충분하지 않습니다.

같은 방문 집합이라도 현재 마지막 도시가 어디인지에 따라 다음 비용이 달라집니다.

그래서:

```text
방문 집합 × 마지막 도시
```

를 상태로 사용합니다.

### 자주 하는 실수

정방향과 역방향 순회를 같은 경로 하나로 자동 합치면 안 됩니다.

이 코드의 `ways`는 **서로 다른 방문 순서**를 각각 세므로 두 순회는 별개의 경우입니다.

</details>

## 잘 놓치는 핵심

### 1. 복합 함수 포인터는 호출 단계와 반환형을 분리해서 읽는다

함수가 값을 반환하는지, 데이터 포인터를 반환하는지, 다시 함수 포인터를 반환하는지를 먼저 판별해야 합니다.

### 2. C17에서는 계산 전에 정의된 동작인지 확인한다

같은 객체의 수정·접근이 시퀀싱되지 않았다면 출력값 자체를 계산하면 안 됩니다.

### 3. 작은 정수형의 산술은 정수 승격을 거친다

`uint8_t`와 `int8_t`를 사용해도 중간 계산은 더 넓은 정수형에서 수행될 수 있습니다.

### 4. realloc은 기존 내부 별칭의 유효성을 다시 판단해야 한다

성공 후에는 새 객체 기준으로 내부 포인터를 다시 계산하는 것이 중요합니다.

### 5. 우선순위 큐 다익스트라는 오래된 항목을 허용할 수 있다

더 짧은 거리 항목을 새로 넣고 예전 항목을 나중에 폐기하는 구현이 흔합니다.

### 6. 지연 전파 세그먼트 트리는 현재 노드 값과 자식 전파 시점을 구분한다

논리적 배열 상태와 실제 내부 노드 상태가 항상 동일한 형태로 펼쳐져 있는 것은 아닙니다.

### 7. 서로소 집합은 최소 신장 트리의 사이클 판정에 사용된다

경로 압축과 크기·랭크 기반 병합을 함께 추적해야 합니다.

### 8. 균형 트리 삭제는 조상까지 다시 균형을 검사한다

노드 하나를 지우는 것과 자료구조 불변식을 복구하는 것은 별개의 단계입니다.

### 9. 다중 문자열 탐색은 트라이와 실패 링크를 결합한다

한 위치에서 여러 패턴이 동시에 끝날 수 있습니다.

### 10. 비트마스크 동적 계획법은 집합뿐 아니라 마지막 상태까지 필요할 수 있다

같은 방문 집합이라도 마지막 정점이 다르면 이후 비용이 달라집니다.

## 시험·면접에서 바로 보는 포인트

- 첫 줄부터 계산하지 말고 자료형과 선언 구조를 먼저 해석합니다.
- 한 표현식에 같은 변수의 증감이 반복되면 시퀀싱부터 확인합니다.
- 작은 정수형은 연산 전에 어떤 형으로 승격되는지 확인합니다.
- `realloc`이 나오면 기존 별칭 포인터를 따로 표시합니다.
- 힙 기반 최단 경로에서는 같은 정점의 여러 큐 항목을 허용하는지 확인합니다.
- 구간 자료구조에서는 현재 노드 구간과 지연값의 의미를 함께 적습니다.
- 최소 신장 트리는 선택된 간선 수가 정점 수보다 하나 적어지는 순간을 확인합니다.
- 균형 트리는 삽입·삭제 후 어느 조상에서 최초로 균형이 깨지는지 찾습니다.
- 문자열 자동자는 현재 상태와 실패 상태를 분리해서 추적합니다.
- 부분집합 동적 계획법에서는 비트 하나가 무엇을 의미하는지 먼저 정의합니다.

## 다음에 이을 글

최종 모의고사 세트 2에서는 **다중 포인터의 const·restrict, 유효 형식과 객체 표현, 함수 포인터 기반 파서, B-트리·해시·최대 유량·강한 연결 요소·구간 동적 계획법**까지 다시 결합해 문제당 개념 수를 더 늘립니다.
