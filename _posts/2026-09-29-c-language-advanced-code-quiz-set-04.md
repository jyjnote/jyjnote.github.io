---
title: C 언어 심화 코드 추론 문제 세트 4
date: 2026-09-29 17:45:00 +0900
slug: c-language-advanced-code-quiz-set-04
permalink: /posts/c-language-advanced-code-quiz-set-04/
categories: [프로그래밍, C언어]
tags: [C언어, 심화C, 알고리즘, 자료구조, 트라이, 세그먼트트리, 그래프, 동적계획법]
math: true
---

이번 세트는 **자료구조 내부 상태와 알고리즘의 불변식을 동시에 추적하는 문제**를 중심으로 구성했습니다.

트라이, 세그먼트 트리, 펜윅 트리, 이분 탐색, 우선순위 큐 기반 최단 경로, 최소 신장 트리, 강한 연결 요소, 동적 계획법, 단조 스택까지 실제 알고리즘 구현을 코드 수준에서 분석합니다.

<blockquote class="prompt-info">
<p>한 줄: 구현 코드를 외우는 것이 아니라 왜 그 인덱스·노드·거리·누적값이 그렇게 변하는지를 추론하는 심화 알고리즘 세트입니다.</p>
</blockquote>

<details markdown="1">
<summary>풀이 방법</summary>

1. 자료구조마다 유지해야 하는 불변식을 먼저 적습니다.
2. 트리·그래프 문제는 배열 값만 보지 말고 논리적 구조를 함께 그립니다.
3. 지연 전파나 메모이제이션처럼 상태를 저장하는 알고리즘은 저장 시점과 적용 시점을 구분합니다.
4. 이분 탐색은 구간의 의미가 닫힌 구간인지 반열린 구간인지 먼저 확인합니다.
5. 우선순위 큐 기반 그래프 알고리즘은 오래된 항목이 큐에 남을 수 있음을 고려합니다.
6. 동적 계획법은 상태 정의와 점화식의 의존 방향을 먼저 확인합니다.
7. 정답 계산 뒤에는 시간복잡도와 왜 그 구조를 사용하는지도 확인합니다.

</details>

## 문제 1. 트라이와 접두사 개수

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Trie {
    struct Trie *next[26];
    int pass;
    int terminal;
} Trie;

Trie *new_node(void)
{
    return calloc(1, sizeof(Trie));
}

void insert(Trie *root, const char *s)
{
    Trie *p = root;

    while (*s) {
        int k = *s - 'a';

        if (p->next[k] == NULL)
            p->next[k] = new_node();

        p = p->next[k];
        p->pass++;
        s++;
    }

    p->terminal++;
}

int prefix_count(Trie *root, const char *s)
{
    Trie *p = root;

    while (*s) {
        int k = *s - 'a';

        if (p->next[k] == NULL)
            return 0;

        p = p->next[k];
        s++;
    }

    return p->pass;
}

int exact_count(Trie *root, const char *s)
{
    Trie *p = root;

    while (*s) {
        int k = *s - 'a';

        if (p->next[k] == NULL)
            return 0;

        p = p->next[k];
        s++;
    }

    return p->terminal;
}

int main(void)
{
    Trie *root = new_node();

    const char *words[] = {
        "car",
        "card",
        "care",
        "cat",
        "car"
    };

    for (int i = 0; i < 5; i++)
        insert(root, words[i]);

    printf("%d %d %d %d\n",
           prefix_count(root, "ca"),
           prefix_count(root, "car"),
           exact_count(root, "car"),
           exact_count(root, "care"));

    return 0;
}
```

① `5 4 2 1`  
② `5 3 2 1`  
③ `4 4 1 1`  
④ `5 4 1 1`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>5 4 2 1</code></strong>입니다.</p>

### 1. 삽입되는 문자열

```text
car
card
care
cat
car
```

총 5개가 삽입됩니다.

중복 문자열 `"car"`도 두 번 삽입됩니다.

### 2. pass의 의미

코드에서 `pass`는 해당 노드를 실제로 통과한 삽입 횟수입니다.

예를 들어 `"ca"`까지의 경로는 모든 단어가 공유합니다.

```text
car
card
care
cat
car
```

모두 `"ca"`로 시작하므로:

```text
prefix_count("ca") = 5
```

입니다.

### 3. "car" 접두사

`"car"`로 시작하는 문자열은:

```text
car
card
care
car
```

총 4개입니다.

따라서:

```text
prefix_count("car") = 4
```

입니다.

### 4. terminal의 의미

`terminal`은 해당 노드에서 끝난 문자열의 개수입니다.

`"car"` 자체는 두 번 삽입되었습니다.

따라서:

```text
exact_count("car") = 2
```

입니다.

### 5. "care"

`"care"`는 한 번만 삽입되었습니다.

```text
exact_count("care") = 1
```

입니다.

### 6. 최종 출력

```text
5 4 2 1
```

### 반드시 알아야 할 개념

트라이에서는 노드 하나가 문자 하나의 위치를 나타내며, 문자열 탐색 시간은 문자열 길이를 `L`이라 할 때 보통:

```text
O(L)
```

입니다.

`pass`와 `terminal`을 분리하면:

```text
접두사 개수
정확한 문자열 개수
```

를 동시에 관리할 수 있습니다.

### 자주 하는 실수

`"car"` 노드의 `pass`와 `terminal`을 같은 값이라고 생각하면 안 됩니다.

`card`, `care`도 `"car"` 노드를 통과하지만 그 노드에서 문자열이 끝나지는 않습니다.

</details>

## 문제 2. 지연 전파 세그먼트 트리

다음 코드는 구간 덧셈과 구간 합을 처리하는 세그먼트 트리입니다.

```c
#include <stdio.h>

long long tree[32];
long long lazy[32];

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

    int mid = (left + right) / 2;

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
        (right - left + 1LL) * value;

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

    int mid = (left + right) / 2;

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

        apply(node,
              left,
              right,
              value);

        return;
    }

    push(node, left, right);

    int mid = (left + right) / 2;

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

    int mid = (left + right) / 2;

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
        2, 1, 3, 4, 5, 2
    };

    build(1, 0, 5, a);

    update(1, 0, 5,
           1, 4, 3);

    long long x =
        query(1, 0, 5,
              0, 2);

    update(1, 0, 5,
           2, 5, -2);

    long long y =
        query(1, 0, 5,
              3, 5);

    long long z =
        query(1, 0, 5,
              0, 5);

    printf("%lld %lld %lld\n",
           x, y, z);

    return 0;
}
```

① `12 14 25`  
② `12 13 23`  
③ `15 13 23`  
④ `12 11 21`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>④ <code>12 11 21</code></strong>입니다.</p>

### 1. 초기 배열

```text
인덱스   0  1  2  3  4  5
값       2  1  3  4  5  2
```

초기 전체 합:

```text
17
```

### 2. 첫 번째 구간 갱신

```c
update(..., 1, 4, 3);
```

인덱스 1부터 4까지 각각 3을 더합니다.

논리적인 배열 상태는:

```text
2 4 6 7 8 2
```

입니다.

지연 전파를 사용하므로 실제 리프 노드 모두가 즉시 갱신되지 않을 수 있지만, 세그먼트 트리의 논리적 값은 위와 같습니다.

### 3. 첫 번째 질의

```c
query(..., 0, 2);
```

범위:

```text
2 + 4 + 6
```

따라서:

```text
x = 12
```

입니다.

### 4. 두 번째 구간 갱신

```c
update(..., 2, 5, -2);
```

인덱스 2부터 5까지 2씩 감소합니다.

현재 배열:

```text
2 4 4 5 6 0
```

### 5. 두 번째 질의

```c
query(..., 3, 5);
```

계산:

```text
5 + 6 + 0 = 11
```

따라서 코드만 보면 `y = 11`입니다.

### 6. 전체 합

최종 배열의 전체 합:

```text
2 + 4 + 4 + 5 + 6 + 0
= 21
```

따라서:

```text
z = 21
```

즉 실제 정답은:

```text
12 11 21
```

입니다.


### 반드시 알아야 할 개념

지연 전파의 핵심은 구간 전체가 갱신 범위에 포함될 때 자식 노드까지 즉시 내려가지 않고:

```text
현재 구간 합
지연 값
```

만 갱신해 두는 것입니다.

필요해지는 순간 `push`를 통해 자식에게 전달합니다.

구간 갱신과 구간 합 질의를 모두:

```text
O(log n)
```

수준으로 처리할 수 있습니다.

### 자주 하는 실수

세그먼트 트리 내부 배열 `tree[]`의 모든 자식 값이 항상 최신 상태라고 생각하면 안 됩니다.

지연 값이 부모에 남아 있을 수 있습니다.

</details>

## 문제 3. 펜윅 트리와 누적 빈도 기반 순위 탐색

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

#define N 8

int bit[N + 1];

void add(int index, int delta)
{
    while (index <= N) {
        bit[index] += delta;
        index += index & -index;
    }
}

int prefix_sum(int index)
{
    int result = 0;

    while (index > 0) {
        result += bit[index];
        index -= index & -index;
    }

    return result;
}

int kth(int k)
{
    int index = 0;

    for (int step = 8;
         step > 0;
         step >>= 1) {

        int next = index + step;

        if (next <= N &&
            bit[next] < k) {

            index = next;
            k -= bit[next];
        }
    }

    return index + 1;
}

int main(void)
{
    int freq[N + 1] = {
        0,
        2, 0, 1, 3,
        0, 2, 1, 1
    };

    for (int i = 1; i <= N; i++)
        add(i, freq[i]);

    add(2, 2);
    add(4, -1);

    int a = prefix_sum(4);
    int b = kth(5);
    int c = kth(8);

    printf("%d %d %d\n", a, b, c);

    return 0;
}
```

① `7 3 6`  
② `7 4 6`  
③ `8 4 7`  
④ `7 4 7`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>7 3 6</code></strong>입니다.</p>

### 1. 초기 빈도

인덱스별 빈도는:

```text
1: 2
2: 0
3: 1
4: 3
5: 0
6: 2
7: 1
8: 1
```

### 2. add(2, 2)

2번 위치 빈도가 2 증가합니다.

```text
2: 2
```

### 3. add(4, -1)

4번 위치 빈도는:

```text
3 → 2
```

가 됩니다.

최종 빈도:

```text
인덱스   1 2 3 4 5 6 7 8
빈도     2 2 1 2 0 2 1 1
```

### 4. prefix_sum(4)

1번부터 4번까지:

```text
2 + 2 + 1 + 2
= 7
```

따라서:

```text
a = 7
```

### 5. 누적 빈도

누적합을 적으면:

```text
인덱스   1 2 3 4 5 6 7 8
누적     2 4 5 7 7 9 10 11
```

### 6. kth(5)

`kth(k)`는 누적 빈도가 처음으로 `k` 이상이 되는 인덱스를 찾습니다.

5번째 원소는 누적합이 정확히 5가 되는:

```text
인덱스 3
```

입니다.

따라서 실제로:

```text
b = 3
```

입니다.

### 7. kth(8)

누적합이 처음 8 이상이 되는 인덱스는:

```text
인덱스 6
```

입니다.

따라서:

```text
c = 6
```

### 8. 최종 출력

실제 결과는:

```text
7 3 6
```

입니다.


### 반드시 알아야 할 개념

펜윅 트리는:

```text
점 갱신
누적합
```

을 각각:

```text
O(log n)
```

에 처리할 수 있습니다.

또한 누적 빈도가 단조 증가한다는 성질을 이용하면 내부 트리 구조를 따라가며 `k`번째 원소의 위치를:

```text
O(log n)
```

에 찾을 수 있습니다.

### 자주 하는 실수

`kth(k)`를 빈도값이 `k`인 인덱스를 찾는 함수라고 생각하면 안 됩니다.

누적 빈도 기준으로 **k번째 원소가 위치한 인덱스**를 찾습니다.

</details>

## 문제 4. 이분 탐색의 lower_bound와 upper_bound

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

int lower_bound(
    const int *a,
    int n,
    int target)
{
    int left = 0;
    int right = n;

    while (left < right) {
        int mid =
            left + (right - left) / 2;

        if (a[mid] < target)
            left = mid + 1;
        else
            right = mid;
    }

    return left;
}

int upper_bound(
    const int *a,
    int n,
    int target)
{
    int left = 0;
    int right = n;

    while (left < right) {
        int mid =
            left + (right - left) / 2;

        if (a[mid] <= target)
            left = mid + 1;
        else
            right = mid;
    }

    return left;
}

int main(void)
{
    int a[] = {
        1, 2, 2, 2, 4, 4, 7, 9
    };

    int l = lower_bound(a, 8, 2);
    int r = upper_bound(a, 8, 2);

    int x = lower_bound(a, 8, 5);
    int y = upper_bound(a, 8, 4);

    printf("%d %d %d %d\n",
           l, r, x, y);

    return 0;
}
```

① `1 4 6 6`  
② `1 3 6 5`  
③ `2 4 5 6`  
④ `1 4 5 6`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>1 4 6 6</code></strong>입니다.</p>

### 1. 배열 상태

```text
인덱스   0 1 2 3 4 5 6 7
값       1 2 2 2 4 4 7 9
```

### 2. lower_bound(2)

`lower_bound`는:

```text
target 이상이 처음 나타나는 위치
```

를 반환합니다.

값 2가 처음 나타나는 인덱스는:

```text
1
```

입니다.

따라서:

```text
l = 1
```

### 3. upper_bound(2)

`upper_bound`는:

```text
target보다 큰 값이 처음 나타나는 위치
```

입니다.

2보다 큰 첫 값은 인덱스 4의 값 4입니다.

```text
r = 4
```

따라서 2의 개수는:

```text
r - l
= 4 - 1
= 3
```

입니다.

### 4. lower_bound(5)

배열에 5는 없습니다.

5 이상인 첫 값은:

```text
인덱스 6의 7
```

입니다.

따라서:

```text
x = 6
```

### 5. upper_bound(4)

4보다 큰 첫 값은:

```text
인덱스 6의 7
```

입니다.

따라서:

```text
y = 6
```

### 6. 최종 출력

```text
1 4 6 6
```

### 반드시 알아야 할 개념

이 구현의 탐색 구간은:

```text
[left, right)
```

인 반열린 구간입니다.

따라서 초기 `right = n`이 가능하며, 찾는 값이 배열의 모든 값보다 큰 경우 결과로 `n`이 반환될 수 있습니다.

### 자주 하는 실수

`lower_bound`가 반드시 정확히 같은 값을 찾는 함수라고 생각하면 안 됩니다.

값이 존재하지 않아도 **삽입 위치**를 반환합니다.

</details>

## 문제 5. 우선순위 큐 기반 다익스트라와 오래된 항목

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

#define N 5
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

Item pop(void)
{
    Item result = heap[0];

    heap[0] = heap[--heap_size];

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
    int w[N][N] = {
        {0, 10, 3, 0, 0},
        {0, 0, 1, 2, 0},
        {0, 4, 0, 8, 2},
        {0, 0, 0, 0, 7},
        {0, 0, 0, 9, 0}
    };

    int dist[N];

    for (int i = 0; i < N; i++)
        dist[i] = INF;

    dist[0] = 0;
    push((Item){0, 0});

    int stale = 0;

    while (heap_size > 0) {
        Item cur = pop();

        if (cur.dist !=
            dist[cur.vertex]) {
            stale++;
            continue;
        }

        int u = cur.vertex;

        for (int v = 0; v < N; v++) {
            if (w[u][v] == 0)
                continue;

            int nd =
                dist[u] + w[u][v];

            if (nd < dist[v]) {
                dist[v] = nd;
                push((Item){v, nd});
            }
        }
    }

    printf("%d %d %d | %d\n",
           dist[1],
           dist[3],
           dist[4],
           stale);

    return 0;
}
```

① `7 9 5 | 1`  
② `7 9 5 | 2`  
③ `10 9 5 | 1`  
④ `7 11 5 | 2`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>② <code>7 9 5 | 2</code></strong>입니다.</p>

### 1. 시작 정점 0

초기:

```text
dist[0] = 0
```

0에서:

```text
0 → 1 : 10
0 → 2 : 3
```

따라서:

```text
dist[1] = 10
dist[2] = 3
```

힙에는 대략:

```text
(2,3)
(1,10)
```

이 들어갑니다.

### 2. 정점 2 처리

거리 3인 정점 2가 먼저 나옵니다.

간선:

```text
2 → 1 : 4
2 → 3 : 8
2 → 4 : 2
```

완화 후:

```text
dist[1] = 7
dist[3] = 11
dist[4] = 5
```

힙에는 기존 `(1,10)`도 남아 있고 새로운 `(1,7)`도 들어갑니다.

### 3. 정점 4 처리

거리 5입니다.

```text
4 → 3 : 9
```

새 거리:

```text
5 + 9 = 14
```

기존 11보다 길므로 갱신하지 않습니다.

### 4. 정점 1 처리

거리 7입니다.

간선:

```text
1 → 2 : 1
1 → 3 : 2
```

2는 이미 거리 3이므로 변화 없습니다.

정점 3은:

```text
7 + 2 = 9
```

이므로:

```text
dist[3] = 9
```

로 갱신됩니다.

기존 힙에는 `(3,11)`이 남아 있고 새로운 `(3,9)`가 추가됩니다.

### 5. 정점 3 처리

거리 9가 정상 항목입니다.

```text
3 → 4 : 7
```

후보 거리:

```text
16
```

이므로 변화 없습니다.

### 6. 오래된 항목

이제 힙에 남아 있는 대표적인 오래된 항목은:

```text
(1,10)
(3,11)
```

입니다.

현재 최단 거리:

```text
dist[1] = 7
dist[3] = 9
```

이므로 두 항목 모두:

```c
cur.dist != dist[cur.vertex]
```

조건에 걸립니다.

따라서:

```text
stale = 2
```

입니다.

### 7. 최종 거리

```text
dist[1] = 7
dist[3] = 9
dist[4] = 5
```

따라서:

```text
7 9 5 | 2
```

### 반드시 알아야 할 개념

일반적인 이진 힙 구현에는 우선순위 감소 연산을 직접 구현하지 않는 경우가 많습니다.

그 대신 더 짧은 거리를 발견할 때 새 항목을 다시 넣고, 나중에 예전 항목이 나오면 버립니다.

이를 흔히 **지연 삭제** 또는 오래된 항목 무시 방식으로 구현합니다.

### 자주 하는 실수

정점 하나가 우선순위 큐에 한 번만 들어간다고 생각하면 안 됩니다.

더 짧은 경로가 발견될 때 같은 정점이 여러 거리값으로 큐에 존재할 수 있습니다.

</details>

## 문제 6. 크루스칼 최소 신장 트리

다음 코드에서 간선 배열은 가중치 오름차순으로 이미 정렬되어 있다고 하겠습니다.

```c
#include <stdio.h>

typedef struct {
    int u;
    int v;
    int w;
} Edge;

int parent[6];
int rank_value[6];

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

    if (rank_value[a] <
        rank_value[b]) {

        parent[a] = b;
    }
    else if (rank_value[a] >
             rank_value[b]) {

        parent[b] = a;
    }
    else {
        parent[b] = a;
        rank_value[a]++;
    }

    return 1;
}

int main(void)
{
    Edge edges[] = {
        {0, 2, 1},
        {1, 2, 2},
        {1, 3, 3},
        {0, 1, 4},
        {2, 3, 5},
        {3, 4, 6},
        {2, 4, 7},
        {3, 5, 8},
        {4, 5, 9}
    };

    for (int i = 0; i < 6; i++) {
        parent[i] = i;
        rank_value[i] = 0;
    }

    int total = 0;
    int chosen = 0;
    int skipped = 0;

    for (int i = 0;
         i < 9 && chosen < 5;
         i++) {

        if (unite(
                edges[i].u,
                edges[i].v)) {

            total += edges[i].w;
            chosen++;
        }
        else {
            skipped++;
        }
    }

    printf("%d %d %d\n",
           total,
           chosen,
           skipped);

    return 0;
}
```

① `20 5 2`  
② `18 5 2`  
③ `20 5 3`  
④ `24 5 1`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>③ <code>20 5 3</code></strong>입니다.</p>

### 1. 최소 신장 트리의 목표

정점은 6개입니다.

연결된 그래프의 신장 트리는:

```text
정점 수 - 1
= 5
```

개의 간선을 가져야 합니다.

따라서 `chosen == 5`가 되면 종료합니다.

### 2. 가중치 1

```text
0 - 2
```

서로 다른 집합이므로 선택합니다.

```text
total = 1
chosen = 1
```

### 3. 가중치 2

```text
1 - 2
```

다른 집합이므로 선택합니다.

```text
total = 3
chosen = 2
```

현재 0, 1, 2가 같은 연결 요소가 됩니다.

### 4. 가중치 3

```text
1 - 3
```

정점 3은 아직 다른 집합입니다.

선택:

```text
total = 6
chosen = 3
```

현재:

```text
{0,1,2,3}
```

가 하나의 집합입니다.

### 5. 가중치 4

```text
0 - 1
```

이미 같은 집합입니다.

이 간선을 넣으면 사이클이 생깁니다.

따라서:

```text
skipped = 1
```

### 6. 가중치 5

```text
2 - 3
```

역시 같은 집합입니다.

```text
skipped = 2
```

### 7. 가중치 6

```text
3 - 4
```

정점 4는 새로운 집합입니다.

선택합니다.

```text
total = 12
chosen = 4
```

### 8. 가중치 7

```text
2 - 4
```

이제 정점 4도 이미 같은 집합에 속합니다.

따라서 이 간선은 건너뜁니다.

여기서:

```text
skipped = 3
```

이 됩니다.

### 9. 가중치 8

```text
3 - 5
```

정점 5는 아직 연결되지 않았습니다.

선택:

```text
total = 20
chosen = 5
```

이제 최소 신장 트리가 완성되어 반복을 종료합니다.

### 10. 실제 최종 값

따라서:

```text
total = 20
chosen = 5
skipped = 3
```

입니다.


### 반드시 알아야 할 개념

크루스칼 알고리즘은 간선을 가중치 오름차순으로 보면서:

```text
현재 선택된 간선들과 사이클을 만들지 않는다면 선택
```

합니다.

사이클 여부는 서로소 집합 자료구조로 효율적으로 확인합니다.

대표 시간복잡도는 정렬 때문에:

```text
O(E log E)
```

입니다.

### 자주 하는 실수

최종 MST에 포함되지 않은 간선 수 전체를 `skipped`라고 생각하면 안 됩니다.

이 코드는 `chosen == 5`가 되는 순간 반복을 종료하므로 그 이후 간선은 검사조차 하지 않습니다.

</details>

## 문제 7. 타잔 알고리즘과 강한 연결 요소

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

#define N 7

int graph[N][N];

int index_value[N];
int low[N];
int on_stack[N];

int stack[N];
int top;

int next_index = 1;
int component_count;

void dfs(int u)
{
    index_value[u] =
        low[u] = next_index++;

    stack[top++] = u;
    on_stack[u] = 1;

    for (int v = 0; v < N; v++) {
        if (!graph[u][v])
            continue;

        if (index_value[v] == 0) {
            dfs(v);

            if (low[v] < low[u])
                low[u] = low[v];
        }
        else if (on_stack[v]) {
            if (index_value[v] < low[u])
                low[u] =
                    index_value[v];
        }
    }

    if (low[u] == index_value[u]) {
        component_count++;

        while (1) {
            int v = stack[--top];
            on_stack[v] = 0;

            printf("%d", v);

            if (v == u)
                break;
        }

        printf(" ");
    }
}

int main(void)
{
    graph[0][1] = 1;
    graph[1][2] = 1;
    graph[2][0] = 1;

    graph[2][3] = 1;

    graph[3][4] = 1;
    graph[4][5] = 1;
    graph[5][3] = 1;

    graph[5][6] = 1;

    for (int i = 0; i < N; i++) {
        if (index_value[i] == 0)
            dfs(i);
    }

    printf("| %d\n", component_count);

    return 0;
}
```

① `6 543 210 | 3`  
② `6 345 012 | 3`  
③ `6543210 | 1`  
④ `6 543 012 | 3`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>6 543 210 | 3</code></strong>입니다.</p>

### 1. 강한 연결 요소 구조

그래프를 구조적으로 보면:

```text
0 → 1 → 2 → 0
```

이므로:

```text
{0,1,2}
```

는 하나의 강한 연결 요소입니다.

또:

```text
3 → 4 → 5 → 3
```

이므로:

```text
{3,4,5}
```

도 하나의 강한 연결 요소입니다.

마지막 정점 6은 자기 자신으로 돌아오는 경로가 없습니다.

따라서:

```text
{6}
```

이 독립된 강한 연결 요소입니다.

총 개수:

```text
3
```

입니다.

### 2. DFS 진행 순서

정점 0에서 시작하면:

```text
0
→ 1
→ 2
→ 3
→ 4
→ 5
→ 6
```

방향으로 깊게 들어갑니다.

### 3. 정점 6

6에서 더 나갈 간선이 없습니다.

따라서:

```text
low[6] == index[6]
```

이 되어 즉시 하나의 SCC 루트가 됩니다.

스택에서:

```text
6
```

을 꺼냅니다.

첫 출력:

```text
6
```

### 4. 3,4,5 SCC

정점 5에서 3으로 돌아가는 간선 때문에:

```text
low[5]
low[4]
low[3]
```

가 정점 3의 탐색 번호까지 내려갑니다.

정점 3에서:

```text
low[3] == index[3]
```

이 성립하면 스택에서 정점 3이 나올 때까지 꺼냅니다.

스택은 후입선출이므로:

```text
5
4
3
```

순서로 출력됩니다.

즉:

```text
543
```

입니다.

### 5. 0,1,2 SCC

마찬가지로:

```text
2 → 0
```

간선 때문에 0,1,2가 같은 SCC로 묶입니다.

스택에서:

```text
2
1
0
```

순서로 꺼냅니다.

따라서:

```text
210
```

입니다.

### 6. 최종 출력

각 SCC 뒤에 공백을 출력하므로:

```text
6 543 210 | 3
```

입니다.

### 반드시 알아야 할 개념

타잔 알고리즘은 DFS 한 번으로 SCC를 찾습니다.

핵심 값:

```text
index → 최초 방문 순서
low   → 현재 DFS 스택 안에서 도달 가능한 가장 작은 index
```

입니다.

대표 시간복잡도:

```text
O(V + E)
```

입니다.

### 자주 하는 실수

SCC 내부 정점이 항상 오름차순으로 출력된다고 생각하면 안 됩니다.

이 코드는 스택에서 꺼내는 순서대로 출력하므로 일반적으로 DFS 종료 구조에 따라 역순 형태가 나타날 수 있습니다.

</details>

## 문제 8. 메모이제이션과 상태 의존 동적 계획법

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

int cost[] = {
    2, 5, 1, 3, 4, 2
};

int memo[7];

int solve(int i)
{
    if (i >= 6)
        return 0;

    if (memo[i] != -1)
        return memo[i];

    int one =
        cost[i] + solve(i + 1);

    int two =
        cost[i] * 2 + solve(i + 2);

    memo[i] =
        one < two ? one : two;

    return memo[i];
}

int main(void)
{
    for (int i = 0; i < 7; i++)
        memo[i] = -1;

    int answer = solve(0);

    printf("%d | ", answer);

    for (int i = 0; i < 6; i++)
        printf("%d ", memo[i]);

    return 0;
}
```

① `16 | 16 14 9 8 6 2`  
② `12 | 12 13 8 8 6 2`  
③ `14 | 14 12 7 8 6 2`  
④ `15 | 15 13 8 7 6 2`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>② <code>12 | 12 13 8 8 6 2</code></strong>입니다.</p>

### 1. 상태 정의

`solve(i)`는 인덱스 `i`부터 끝까지 처리할 때의 최소 비용입니다.

두 선택지가 있습니다.

첫 번째:

```text
현재 비용 1배 지불
→ i + 1로 이동
```

두 번째:

```text
현재 비용 2배 지불
→ i + 2로 이동
```

### 2. 뒤에서부터 계산

#### i = 5

```text
cost[5] = 2
```

첫 선택:

```text
2 + solve(6)
= 2
```

두 번째:

```text
4 + solve(7)
= 4
```

따라서:

```text
memo[5] = 2
```

#### i = 4

```text
cost[4] = 4
```

첫 선택:

```text
4 + memo[5]
= 6
```

두 번째:

```text
8 + solve(6)
= 8
```

따라서:

```text
memo[4] = 6
```

#### i = 3

```text
cost[3] = 3
```

첫 선택:

```text
3 + 6 = 9
```

두 번째:

```text
6 + 2 = 8
```

따라서:

```text
memo[3] = 8
```

#### i = 2

```text
cost[2] = 1
```

첫 선택:

```text
1 + 8 = 9
```

두 번째:

```text
2 + 6 = 8
```

따라서 실제로:

```text
memo[2] = 8
```

입니다.

### 3. i = 1

```text
cost[1] = 5
```

첫 선택:

```text
5 + 8 = 13
```

두 번째:

```text
10 + 8 = 18
```

따라서:

```text
memo[1] = 13
```

### 4. i = 0

```text
cost[0] = 2
```

첫 선택:

```text
2 + 13 = 15
```

두 번째:

```text
4 + 8 = 12
```

따라서:

```text
memo[0] = 12
```

### 5. 실제 최종 메모 배열

```text
memo[0] = 12
memo[1] = 13
memo[2] = 8
memo[3] = 8
memo[4] = 6
memo[5] = 2
```

따라서 실제 출력은:

```text
12 | 12 13 8 8 6 2
```

입니다.

### 반드시 알아야 할 개념

메모이제이션은 같은 상태를 여러 번 계산하지 않게 합니다.

이 문제에서 상태 수는 6개뿐이므로 각 상태를 한 번씩 계산하면 됩니다.

메모이제이션이 없다면 재귀 호출 트리가 겹치는 부분 문제를 반복해서 계산하게 됩니다.

### 자주 하는 실수

점화식을 직관으로만 계산하면 안 됩니다.

각 상태에서:

```text
1칸 이동 비용
2칸 이동 비용
```

두 후보를 모두 정확히 비교해야 합니다.

</details>

## 문제 9. 단조 스택과 가장 큰 직사각형

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

int main(void)
{
    int h[] = {
        2, 1, 5, 6, 2, 3
    };

    int stack[7];
    int top = 0;

    int max_area = 0;

    for (int i = 0; i <= 6; i++) {

        int current =
            (i == 6) ? 0 : h[i];

        while (top > 0 &&
               h[stack[top - 1]]
                   > current) {

            int height =
                h[stack[--top]];

            int left =
                (top == 0)
                ? 0
                : stack[top - 1] + 1;

            int width = i - left;
            int area = height * width;

            if (area > max_area)
                max_area = area;
        }

        if (i < 6)
            stack[top++] = i;
    }

    printf("%d\n", max_area);

    return 0;
}
```

① `8`  
② `10`  
③ `12`  
④ `15`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>② <code>10</code></strong>입니다.</p>

### 1. 핵심 불변식

스택에는 높이가 비감소하도록 인덱스를 유지합니다.

현재 막대가 스택 꼭대기보다 낮으면, 스택에서 막대를 꺼내며 그 높이가 확장될 수 있는 최대 폭을 계산합니다.

### 2. 높이 배열

```text
인덱스   0 1 2 3 4 5
높이     2 1 5 6 2 3
```

### 3. i = 0

높이 2를 스택에 넣습니다.

```text
stack = [0]
```

### 4. i = 1

현재 높이 1은 꼭대기 높이 2보다 작습니다.

인덱스 0을 꺼냅니다.

높이:

```text
2
```

폭:

```text
1
```

면적:

```text
2
```

그 후 인덱스 1을 넣습니다.

### 5. i = 2, 3

높이 5, 6은 증가하므로 그대로 쌓입니다.

```text
stack = [1, 2, 3]
```

### 6. i = 4

현재 높이는 2입니다.

먼저 높이 6을 꺼냅니다.

폭은 1이므로:

```text
6 × 1 = 6
```

다음 높이 5를 꺼냅니다.

이때 왼쪽 경계는 인덱스 2입니다.

폭:

```text
4 - 2 = 2
```

면적:

```text
5 × 2 = 10
```

현재 최대값은:

```text
10
```

입니다.

높이 1은 현재 2보다 낮으므로 멈추고 인덱스 4를 넣습니다.

### 7. i = 5

높이 3을 추가합니다.

### 8. 마지막 가상 높이 0

`i = 6`에서 높이 0을 사용하여 남아 있는 막대를 모두 꺼냅니다.

높이 3, 2, 1에 대한 면적을 계산하지만 10을 넘지 않습니다.

### 9. 최종 출력

```text
10
```

### 반드시 알아야 할 개념

단조 스택을 사용하면 각 막대가 스택에 한 번 들어가고 한 번 나옵니다.

따라서 전체 시간복잡도는:

```text
O(n)
```

입니다.

### 자주 하는 실수

높이 5와 6을 따로만 계산하면 최대 넓이 10을 놓칠 수 있습니다.

높이 5는 인접한 두 칸:

```text
5, 6
```

전체에 걸쳐 높이 5로 사용할 수 있습니다.

</details>

## 문제 10. 구간 동적 계획법과 행렬 곱셈 순서

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>
#include <limits.h>

int main(void)
{
    int dim[] = {
        10, 30, 5, 60, 2
    };

    int n = 4;

    long long dp[4][4] = {0};
    int split[4][4] = {0};

    for (int len = 2;
         len <= n;
         len++) {

        for (int i = 0;
             i + len - 1 < n;
             i++) {

            int j = i + len - 1;

            dp[i][j] = LLONG_MAX;

            for (int k = i;
                 k < j;
                 k++) {

                long long cost =
                    dp[i][k]
                    + dp[k + 1][j]
                    + 1LL
                      * dim[i]
                      * dim[k + 1]
                      * dim[j + 1];

                if (cost < dp[i][j]) {
                    dp[i][j] = cost;
                    split[i][j] = k;
                }
            }
        }
    }

    printf("%lld %d %lld\n",
           dp[0][3],
           split[0][3],
           dp[1][3]);

    return 0;
}
```

① `1500 0 900`  
② `1500 1 900`  
③ `2200 1 1200`  
④ `3300 2 900`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>1500 0 900</code></strong>입니다.</p>

### 1. 행렬 크기

`dim`이:

```text
10, 30, 5, 60, 2
```

이므로 행렬은:

```text
A0: 10 × 30
A1: 30 × 5
A2: 5 × 60
A3: 60 × 2
```

입니다.

### 2. 길이 2 구간

#### A0 × A1

비용:

```text
10 × 30 × 5
= 1500
```

```text
dp[0][1] = 1500
```

#### A1 × A2

```text
30 × 5 × 60
= 9000
```

```text
dp[1][2] = 9000
```

#### A2 × A3

```text
5 × 60 × 2
= 600
```

```text
dp[2][3] = 600
```

### 3. dp[1][3]

행렬:

```text
A1 A2 A3
```

두 분할을 비교합니다.

#### k = 1

```text
A1 | (A2 A3)
```

비용:

```text
dp[1][1]
+ dp[2][3]
+ 30 × 5 × 2
```

```text
0 + 600 + 300
= 900
```

#### k = 2

```text
(A1 A2) | A3
```

비용:

```text
9000 + 0 + 30 × 60 × 2
```

```text
9000 + 3600
= 12600
```

따라서:

```text
dp[1][3] = 900
```

입니다.

### 4. 전체 dp[0][3]

세 분할을 비교합니다.

#### k = 0

```text
A0 | (A1 A2 A3)
```

비용:

```text
0
+ 900
+ 10 × 30 × 2
```

```text
= 1500
```

#### k = 1

```text
(A0 A1) | (A2 A3)
```

비용:

```text
1500
+ 600
+ 10 × 5 × 2
```

```text
= 2200
```

#### k = 2

먼저 `dp[0][2]`를 계산해야 합니다.

`(A0 A1) A2`:

```text
1500 + 10 × 5 × 60
= 4500
```

`A0 (A1 A2)`:

```text
9000 + 10 × 30 × 60
= 27000
```

따라서:

```text
dp[0][2] = 4500
```

그 후:

```text
4500 + 10 × 60 × 2
= 5700
```

입니다.

### 5. 최소 분할

세 후보:

```text
k = 0 → 1500
k = 1 → 2200
k = 2 → 5700
```

따라서 최적 분할은:

```text
k = 0
```

이고:

```text
split[0][3] = 0
```

입니다.

즉 실제 최종 출력은:

```text
1500 0 900
```

입니다.


### 반드시 알아야 할 개념

행렬 곱셈은 결합법칙은 성립하지만 곱셈 순서에 따라 필요한 스칼라 곱셈 횟수가 크게 달라집니다.

상태:

```text
dp[i][j]
```

는 `Ai`부터 `Aj`까지 곱하는 최소 비용입니다.

점화식은 모든 분할점 `k`를 비교합니다.

대표 시간복잡도:

```text
O(n³)
```

공간복잡도:

```text
O(n²)
```

입니다.

### 자주 하는 실수

행렬의 실제 숫자 원소를 곱하는 문제가 아닙니다.

행렬의 차원만 이용해 **필요한 스칼라 곱셈 횟수**를 계산합니다.

</details>

## 잘 놓치는 핵심

### 1. 트라이는 접두사 상태를 노드 경로로 공유한다

`pass`와 `terminal`을 분리하면 접두사 개수와 정확한 문자열 개수를 동시에 관리할 수 있습니다.

### 2. 지연 전파는 자식 갱신을 나중으로 미룬다

트리 내부 모든 노드가 항상 즉시 최신 상태인 것은 아닙니다.

### 3. 펜윅 트리의 내부 값은 원본 배열 값 자체가 아니다

각 인덱스는 특정 길이의 누적 구간을 저장합니다.

### 4. lower_bound와 upper_bound는 경계 위치를 찾는다

찾는 값이 존재하지 않아도 유효한 삽입 위치를 반환할 수 있습니다.

### 5. 우선순위 큐 기반 다익스트라는 같은 정점이 여러 번 큐에 들어갈 수 있다

오래된 거리 항목은 꺼낸 뒤 현재 거리와 비교하여 버릴 수 있습니다.

### 6. 크루스칼은 간선을 정렬한 뒤 사이클을 만들지 않는 간선만 선택한다

서로소 집합은 사이클 판별을 빠르게 처리합니다.

### 7. 타잔 SCC는 index와 low의 의미를 구분해야 한다

`low`는 현재 DFS 스택 안에서 도달할 수 있는 가장 이른 방문 번호를 반영합니다.

### 8. 메모이제이션은 상태 정의가 핵심이다

같은 상태를 다시 계산하지 않는 것보다 어떤 값을 상태로 둘 것인지가 더 중요합니다.

### 9. 단조 스택은 원소가 한 번 들어가고 한 번 나오는 구조를 이용한다

겉으로 중첩 반복처럼 보여도 전체 시간복잡도가 O(n)이 될 수 있습니다.

### 10. 구간 동적 계획법은 모든 분할점을 비교한다

부분 문제의 최적해를 조합해 더 큰 구간의 최적해를 구성합니다.

## 시험·면접에서 바로 보는 포인트

- 트라이는 문자별 자식과 문자열 종료 여부를 분리해서 봅니다.
- 세그먼트 트리는 현재 노드의 구간 범위를 먼저 적습니다.
- 펜윅 트리는 `i & -i`가 담당 구간 길이를 결정한다는 점을 기억합니다.
- 이분 탐색은 `[left, right)`인지 `[left, right]`인지 먼저 확인합니다.
- 다익스트라에서는 우선순위 큐에서 나온 거리와 현재 `dist`를 비교합니다.
- MST는 정점 수가 V라면 정확히 V-1개의 간선을 선택합니다.
- SCC는 DFS 순서와 스택에서 빠지는 순서를 구분합니다.
- 메모이제이션은 점화식을 뒤쪽 상태부터 검증하면 계산 실수가 줄어듭니다.
- 단조 스택은 스택이 유지하는 단조 조건부터 찾습니다.
- 구간 DP는 `길이 → 시작점 → 분할점` 순으로 반복 구조를 읽습니다.

## 다음에 이을 글

심화 세트 5에서는 **레드-블랙 트리, B-트리, 희소 테이블, 최소 공통 조상, 벨만-포드, 플로이드-워셜, 네트워크 플로우, 비트마스크 동적 계획법, 문자열 해싱**을 중심으로 더 높은 난도의 문제를 구성합니다.
