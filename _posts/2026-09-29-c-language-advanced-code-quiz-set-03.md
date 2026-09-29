---
title: C 언어 심화 코드 추론 문제 세트 3
date: 2026-09-29 17:39:00 +0900
slug: c-language-advanced-code-quiz-set-03
permalink: /posts/c-language-advanced-code-quiz-set-03/
categories: [프로그래밍, C언어]
tags: [C언어, 심화C, 알고리즘, 자료구조, 연결리스트, 힙, AVL트리, 그래프]
math: true
---

이번 세트는 문법 자체보다 **자료구조의 불변식과 알고리즘의 상태 변화를 C 코드로 추적하는 능력**을 집중적으로 다룹니다.

연결 리스트 순환 탐지, 서로소 집합, 힙, AVL 트리, 해시 테이블, 원형 덱, 병합 정렬, 최단 경로, 위상 정렬, 문자열 탐색까지 주요 알고리즘을 코드 수준에서 직접 추론합니다.

<blockquote class="prompt-info">
<p>한 줄: 자료구조가 왜 그 상태가 되는지와 알고리즘이 어떤 불변식을 유지하는지를 이해해야 풀 수 있는 심화 문제 세트입니다.</p>
</blockquote>

<details markdown="1">
<summary>풀이 방법</summary>

1. 자료구조 문제는 각 연산 뒤의 전체 상태를 갱신합니다.
2. 포인터 구조는 노드 연결을 화살표로 그립니다.
3. 힙과 AVL 트리는 단순 값 집합이 아니라 배열·트리의 구조까지 추적합니다.
4. 해시 테이블은 탐사 경로와 삭제 표식의 의미를 구분합니다.
5. 그래프 알고리즘은 방문 여부, 거리, 진입 차수 등 핵심 상태 배열을 매 단계 갱신합니다.
6. 재귀 알고리즘은 호출 구간과 병합·반환 단계를 분리합니다.
7. 결과만 외우지 말고 각 알고리즘의 불변식과 시간복잡도도 함께 확인합니다.

</details>

## 문제 1. 플로이드 순환 탐지와 순환 길이

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>
#include <stddef.h>

typedef struct Node {
    int value;
    struct Node *next;
} Node;

Node *analyze_cycle(Node *head,
                    size_t *mu,
                    size_t *lambda)
{
    Node *slow = head;
    Node *fast = head;

    do {
        slow = slow->next;
        fast = fast->next->next;
    } while (slow != fast);

    *mu = 0;
    slow = head;

    while (slow != fast) {
        slow = slow->next;
        fast = fast->next;
        (*mu)++;
    }

    Node *entry = slow;

    *lambda = 1;
    fast = entry->next;

    while (fast != entry) {
        fast = fast->next;
        (*lambda)++;
    }

    return entry;
}

int main(void)
{
    Node n[7];

    for (int i = 0; i < 7; i++)
        n[i].value = (i + 1) * 10;

    int next_index[7] = {
        1, 2, 3, 4, 5, 6, 2
    };

    for (int i = 0; i < 7; i++)
        n[i].next = &n[next_index[i]];

    size_t mu;
    size_t lambda;

    Node *entry =
        analyze_cycle(&n[0], &mu, &lambda);

    printf("%d %zu %zu\n",
           entry->value,
           mu,
           lambda);

    return 0;
}
```

① `20 1 6`  
② `30 2 5`  
③ `30 3 4`  
④ `70 2 5`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>② <code>30 2 5</code></strong>입니다.</p>

### 1. 연결 구조부터 그리기

`next_index`에 따라 연결하면 다음과 같습니다.

```text
n[0](10)
  ↓
n[1](20)
  ↓
n[2](30)
  ↓
n[3](40)
  ↓
n[4](50)
  ↓
n[5](60)
  ↓
n[6](70)
  ↓
n[2](30)
```

즉 순환 밖에는:

```text
n[0], n[1]
```

두 노드가 있고 순환은:

```text
n[2] → n[3] → n[4] → n[5] → n[6] → n[2]
```

입니다.

### 2. 순환 진입점

순환의 첫 노드는:

```text
n[2]
```

입니다.

따라서 반환되는 `entry`는:

```text
entry → n[2]
```

이고:

```text
entry->value = 30
```

입니다.

### 3. mu의 의미

코드에서 `mu`는 시작 노드에서 순환 진입점까지 이동해야 하는 간선 수입니다.

```text
n[0] → n[1] → n[2]
```

따라서:

```text
mu = 2
```

입니다.

### 4. lambda의 의미

`lambda`는 순환 자체의 길이입니다.

순환 노드:

```text
n[2]
n[3]
n[4]
n[5]
n[6]
```

총 5개입니다.

따라서:

```text
lambda = 5
```

### 5. 왜 slow와 fast가 만나는가

플로이드 알고리즘에서:

```text
slow → 한 번에 1칸
fast → 한 번에 2칸
```

이동합니다.

두 포인터가 순환 내부에 들어가면 상대 속도는 한 단계 차이이므로 유한한 순환 안에서 결국 같은 노드에서 만나게 됩니다.

그 후 한 포인터를 다시 `head`로 옮기고 두 포인터를 한 칸씩 움직이면 순환 진입점에서 만납니다.

### 6. 최종 출력

```text
30 2 5
```

### 반드시 알아야 할 개념

플로이드 순환 탐지는 별도의 방문 배열 없이:

```text
시간복잡도 O(n)
공간복잡도 O(1)
```

로 순환 존재 여부와 진입점을 찾을 수 있습니다.

`mu`와 `lambda`를 구분하는 것도 중요합니다.

```text
mu     → 시작점에서 순환 진입점까지 거리
lambda → 순환 자체의 길이
```

### 자주 하는 실수

`n[6]`이 다시 `n[2]`를 가리키므로 순환 길이를 7이라고 생각하면 안 됩니다.

순환에 포함되는 노드는 `n[2]`부터 `n[6]`까지 5개뿐입니다.

</details>

## 문제 2. 서로소 집합과 경로 압축

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

int parent[7];
int rank_value[7];

int find_set(int x)
{
    if (parent[x] != x)
        parent[x] = find_set(parent[x]);

    return parent[x];
}

void unite(int a, int b)
{
    int ra = find_set(a);
    int rb = find_set(b);

    if (ra == rb)
        return;

    if (rank_value[ra] < rank_value[rb]) {
        parent[ra] = rb;
    }
    else if (rank_value[ra] > rank_value[rb]) {
        parent[rb] = ra;
    }
    else {
        parent[rb] = ra;
        rank_value[ra]++;
    }
}

int main(void)
{
    for (int i = 0; i < 7; i++) {
        parent[i] = i;
        rank_value[i] = 0;
    }

    unite(0, 1);
    unite(2, 3);
    unite(1, 2);

    unite(4, 5);
    unite(5, 6);

    unite(3, 6);

    (void)find_set(5);
    (void)find_set(3);

    for (int i = 0; i < 7; i++)
        printf("%d ", parent[i]);

    return 0;
}
```

① `0 0 0 0 0 0 0`  
② `0 0 0 0 0 0 4`  
③ `0 0 0 2 0 4 4`  
④ `0 0 0 0 4 4 4`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>② <code>0 0 0 0 0 0 4</code></strong>입니다.</p>

### 1. 초기 상태

처음에는 각 원소가 자기 자신을 대표합니다.

```text
인덱스   0 1 2 3 4 5 6
parent   0 1 2 3 4 5 6
rank     0 0 0 0 0 0 0
```

### 2. unite(0, 1)

두 루트의 랭크가 같습니다.

코드상 두 번째 루트를 첫 번째 루트 밑에 붙입니다.

```text
parent[1] = 0
rank[0] = 1
```

상태:

```text
parent = 0 0 2 3 4 5 6
```

### 3. unite(2, 3)

같은 방식으로:

```text
parent[3] = 2
rank[2] = 1
```

```text
parent = 0 0 2 2 4 5 6
```

### 4. unite(1, 2)

`find_set(1)`은 0을 반환합니다.

`find_set(2)`는 2입니다.

현재:

```text
rank[0] = 1
rank[2] = 1
```

같으므로:

```text
parent[2] = 0
rank[0] = 2
```

이 됩니다.

주의할 점은 `parent[3]`은 아직 2입니다.

```text
parent = 0 0 0 2 4 5 6
```

### 5. 4, 5, 6 집합 만들기

`unite(4, 5)` 후:

```text
parent = 0 0 0 2 4 4 6
rank[4] = 1
```

`unite(5, 6)`에서 `find_set(5)`는 4입니다.

따라서:

```text
parent[6] = 4
```

상태:

```text
parent = 0 0 0 2 4 4 4
```

### 6. unite(3, 6)

`find_set(3)`을 호출합니다.

현재:

```text
3 → 2 → 0
```

경로 압축이 수행되어:

```text
parent[3] = 0
```

이 됩니다.

`find_set(6)`은:

```text
6 → 4
```

이므로 루트는 4입니다.

현재 랭크:

```text
rank[0] = 2
rank[4] = 1
```

따라서 작은 트리의 루트 4를 0 밑에 붙입니다.

```text
parent[4] = 0
```

이때 중요한 상태:

```text
parent[5] = 4
parent[6] = 4
```

는 자동으로 모두 0으로 바뀌지 않습니다.

현재:

```text
parent = 0 0 0 0 0 4 4
```

### 7. find_set(5)

```text
5 → 4 → 0
```

경로 압축이 수행됩니다.

```text
parent[5] = 0
```

따라서:

```text
parent = 0 0 0 0 0 0 4
```

### 8. find_set(3)

`parent[3]`은 이미 0입니다.

변화가 없습니다.

### 9. 왜 parent[6]은 4인가

`6`에 대해 마지막에 `find_set(6)`를 다시 호출하지 않았습니다.

따라서:

```text
6 → 4 → 0
```

이라는 논리적 집합 관계는 존재하지만 배열 내부의 직접 부모 값은 여전히:

```text
parent[6] = 4
```

입니다.

### 10. 최종 출력

```text
0 0 0 0 0 0 4
```

### 반드시 알아야 할 개념

경로 압축은 모든 노드를 자동으로 루트에 붙이는 전역 연산이 아닙니다.

<mark>실제로 find 연산의 경로에 포함된 노드만 압축됩니다.</mark>

랭크 기반 합치기와 경로 압축을 함께 사용하면 상각 시간복잡도는 매우 작아져 실질적으로 거의 상수 시간처럼 동작합니다.

### 자주 하는 실수

모든 원소가 같은 집합에 속하게 되면 `parent[]`도 전부 같은 숫자가 되어야 한다고 생각하면 안 됩니다.

`parent[]`는 현재 트리 표현이고 대표 원소 조회 결과와 반드시 동일한 모양일 필요는 없습니다.

</details>

## 문제 3. 최소 힙의 삽입과 삭제

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

typedef struct {
    int data[32];
    int size;
} Heap;

void push(Heap *h, int x)
{
    int i = h->size++;
    h->data[i] = x;

    while (i > 0) {
        int parent = (i - 1) / 2;

        if (h->data[parent] <= h->data[i])
            break;

        int tmp = h->data[parent];
        h->data[parent] = h->data[i];
        h->data[i] = tmp;

        i = parent;
    }
}

int pop_min(Heap *h)
{
    int result = h->data[0];

    h->size--;

    if (h->size == 0)
        return result;

    h->data[0] = h->data[h->size];

    int i = 0;

    while (1) {
        int left = i * 2 + 1;
        int right = left + 1;
        int smallest = i;

        if (left < h->size &&
            h->data[left] < h->data[smallest])
            smallest = left;

        if (right < h->size &&
            h->data[right] < h->data[smallest])
            smallest = right;

        if (smallest == i)
            break;

        int tmp = h->data[i];
        h->data[i] = h->data[smallest];
        h->data[smallest] = tmp;

        i = smallest;
    }

    return result;
}

int main(void)
{
    Heap h = {{0}, 0};

    int input[] = {
        4, 1, 7, 3, 8, 5
    };

    for (int i = 0; i < 6; i++)
        push(&h, input[i]);

    int first = pop_min(&h);

    push(&h, 2);
    push(&h, 6);

    int second = pop_min(&h);

    printf("%d %d | ", first, second);

    for (int i = 0; i < h.size; i++)
        printf("%d ", h.data[i]);

    return 0;
}
```

① `1 2 | 3 4 5 7 8 6`  
② `1 2 | 3 5 4 6 7 8`  
③ `1 3 | 2 4 5 7 8 6`  
④ `2 1 | 3 4 5 6 7 8`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>1 2 | 3 4 5 7 8 6</code></strong>입니다.</p>

### 1. 최소 힙의 불변식

배열 기반 최소 힙에서 인덱스 `i`의 자식은:

```text
왼쪽  = 2i + 1
오른쪽 = 2i + 2
```

입니다.

그리고 항상:

```text
부모 값 ≤ 자식 값
```

을 만족해야 합니다.

다만 배열 전체가 오름차순일 필요는 없습니다.

### 2. 4 삽입

```text
[4]
```

### 3. 1 삽입

처음 배열 끝에 붙습니다.

```text
[4, 1]
```

부모 4보다 작으므로 교환합니다.

```text
[1, 4]
```

### 4. 7 삽입

```text
[1, 4, 7]
```

부모 1보다 크므로 그대로입니다.

### 5. 3 삽입

끝에 추가:

```text
[1, 4, 7, 3]
```

부모 4와 비교 후 교환:

```text
[1, 3, 7, 4]
```

### 6. 8 삽입

```text
[1, 3, 7, 4, 8]
```

### 7. 5 삽입

추가 직후:

```text
[1, 3, 7, 4, 8, 5]
```

부모 7과 교환합니다.

```text
[1, 3, 5, 4, 8, 7]
```

초기 힙 완성:

```text
1 3 5 4 8 7
```

### 8. 첫 번째 pop_min

루트 1을 제거합니다.

```text
first = 1
```

마지막 원소 7을 루트로 올립니다.

```text
7 3 5 4 8
```

작은 자식 3과 교환:

```text
3 7 5 4 8
```

다시 작은 자식 4와 교환:

```text
3 4 5 7 8
```

### 9. 2 삽입

끝에 2 추가:

```text
3 4 5 7 8 2
```

부모 5와 교환:

```text
3 4 2 7 8 5
```

다시 루트 3과 교환:

```text
2 4 3 7 8 5
```

### 10. 6 삽입

```text
2 4 3 7 8 5 6
```

부모 3보다 크므로 그대로입니다.

### 11. 두 번째 pop_min

루트:

```text
second = 2
```

마지막 값 6을 루트로 올립니다.

```text
6 4 3 7 8 5
```

자식 4와 3 중 작은 값은 3입니다.

교환:

```text
3 4 6 7 8 5
```

현재 인덱스 2의 자식은 값 5입니다.

```text
5 < 6
```

이므로 다시 교환합니다.

```text
3 4 5 7 8 6
```

### 12. 최종 출력

```text
1 2 | 3 4 5 7 8 6
```

### 반드시 알아야 할 개념

힙은 정렬 배열이 아닙니다.

최소 힙이 보장하는 것은:

```text
각 부모가 자신의 자식보다 작거나 같다
```

뿐입니다.

삽입은 위로 올리기, 삭제는 아래로 내리기를 사용하며 각각:

```text
O(log n)
```

입니다.

### 자주 하는 실수

최종 힙을:

```text
3 4 5 6 7 8
```

처럼 오름차순으로 정렬해 버리면 안 됩니다.

힙의 내부 배열은 완전 정렬을 보장하지 않습니다.

</details>

## 문제 4. AVL 트리의 연속 회전

다음 코드는 일반적인 AVL 트리 삽입 알고리즘의 핵심 부분입니다.

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

Node *new_node(int key)
{
    Node *n = malloc(sizeof *n);

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

    y->height =
        1 + max_int(height(y->left),
                    height(y->right));

    x->height =
        1 + max_int(height(x->left),
                    height(x->right));

    return x;
}

Node *rotate_left(Node *x)
{
    Node *y = x->right;
    Node *t = y->left;

    y->left = x;
    x->right = t;

    x->height =
        1 + max_int(height(x->left),
                    height(x->right));

    y->height =
        1 + max_int(height(y->left),
                    height(y->right));

    return y;
}

Node *insert(Node *root, int key)
{
    if (root == NULL)
        return new_node(key);

    if (key < root->key)
        root->left =
            insert(root->left, key);
    else
        root->right =
            insert(root->right, key);

    root->height =
        1 + max_int(height(root->left),
                    height(root->right));

    int balance =
        height(root->left)
        - height(root->right);

    if (balance > 1 &&
        key < root->left->key)
        return rotate_right(root);

    if (balance < -1 &&
        key > root->right->key)
        return rotate_left(root);

    if (balance > 1 &&
        key > root->left->key) {
        root->left =
            rotate_left(root->left);

        return rotate_right(root);
    }

    if (balance < -1 &&
        key < root->right->key) {
        root->right =
            rotate_right(root->right);

        return rotate_left(root);
    }

    return root;
}

void preorder(Node *root)
{
    if (root == NULL)
        return;

    printf("%d ", root->key);
    preorder(root->left);
    preorder(root->right);
}

int main(void)
{
    int input[] = {
        30, 20, 25, 40, 50, 45
    };

    Node *root = NULL;

    for (int i = 0; i < 6; i++)
        root = insert(root, input[i]);

    printf("%d | ", root->height);
    preorder(root);

    return 0;
}
```

출력 결과로 옳은 것은 무엇입니까?

① `3 | 40 25 20 30 50 45`  
② `3 | 25 20 40 30 50 45`  
③ `4 | 40 25 20 30 50 45`  
④ `3 | 40 30 25 20 50 45`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>3 | 40 25 20 30 50 45</code></strong>입니다.</p>

### 1. 30, 20 삽입

처음:

```text
30
/
20
```

아직 균형 인수의 절댓값은 1 이하입니다.

### 2. 25 삽입

25는:

```text
30보다 작고
20보다 큼
```

따라서:

```text
    30
   /
  20
    \
     25
```

형태가 됩니다.

루트 30에서:

```text
왼쪽 높이 2
오른쪽 높이 0
```

이므로 균형 인수는 2입니다.

삽입 키 25는 왼쪽 자식 20보다 큽니다.

따라서 **좌우 회전** 상황입니다.

먼저 20을 왼쪽 회전한 뒤 30을 오른쪽 회전합니다.

결과:

```text
   25
  /  \
20    30
```

### 3. 40 삽입

```text
   25
  /  \
20    30
        \
         40
```

아직 전체 균형은 허용 범위입니다.

### 4. 50 삽입

먼저 일반 이진 탐색 트리 삽입:

```text
   25
  /  \
20    30
        \
         40
           \
            50
```

노드 30에서 오른쪽으로 치우칩니다.

이는 우우 형태입니다.

30에서 왼쪽 회전을 수행하면:

```text
    25
   /  \
 20    40
      /  \
     30   50
```

### 5. 45 삽입

45는:

```text
25보다 큼
40보다 큼
50보다 작음
```

따라서:

```text
    25
   /  \
 20    40
      /  \
     30   50
         /
        45
```

가 됩니다.

이제 루트 25의 오른쪽 서브트리 높이가 너무 커집니다.

삽입 키 45는 25의 오른쪽 자식 40보다 큽니다.

최종적으로 25에 대해 오른쪽 치우침이 해소되도록 왼쪽 회전이 일어납니다.

결과:

```text
        40
       /  \
     25    50
    / \    /
   20 30  45
```

### 6. 최종 높이

리프 노드:

```text
20, 30, 45
```

의 높이는 1입니다.

```text
25의 높이 = 2
50의 높이 = 2
```

따라서 루트 40의 높이는:

```text
3
```

입니다.

### 7. 전위 순회

전위 순회는:

```text
루트
→ 왼쪽
→ 오른쪽
```

순서입니다.

따라서:

```text
40
25
20
30
50
45
```

입니다.

### 8. 최종 출력

```text
3 | 40 25 20 30 50 45
```

### 반드시 알아야 할 개념

AVL 트리는 모든 노드에서:

```text
왼쪽 서브트리 높이 - 오른쪽 서브트리 높이
```

의 절댓값이 1 이하가 되도록 유지합니다.

삽입 시 네 가지 회전 유형을 구분해야 합니다.

```text
좌좌
우우
좌우
우좌
```

탐색·삽입·삭제의 높이를:

```text
O(log n)
```

수준으로 유지하는 것이 목적입니다.

### 자주 하는 실수

모든 불균형에서 한 번만 회전한다고 생각하면 안 됩니다.

25 삽입 시에는 좌우 회전처럼 **두 단계 회전**이 필요합니다.

</details>

## 문제 5. 선형 조사 해시와 삭제 표식

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

#define SIZE 7

enum {
    EMPTY,
    USED,
    DELETED
};

typedef struct {
    int key;
    int state;
} Slot;

Slot table[SIZE];

int hash_value(int key)
{
    return key % SIZE;
}

void insert(int key)
{
    int start = hash_value(key);
    int first_deleted = -1;

    for (int step = 0;
         step < SIZE;
         step++) {

        int i = (start + step) % SIZE;

        if (table[i].state == USED) {
            if (table[i].key == key)
                return;
        }
        else if (table[i].state == DELETED) {
            if (first_deleted < 0)
                first_deleted = i;
        }
        else {
            if (first_deleted >= 0)
                i = first_deleted;

            table[i].key = key;
            table[i].state = USED;
            return;
        }
    }

    if (first_deleted >= 0) {
        table[first_deleted].key = key;
        table[first_deleted].state = USED;
    }
}

int search(int key)
{
    int start = hash_value(key);

    for (int step = 0;
         step < SIZE;
         step++) {

        int i = (start + step) % SIZE;

        if (table[i].state == EMPTY)
            return -1;

        if (table[i].state == USED &&
            table[i].key == key)
            return i;
    }

    return -1;
}

void erase(int key)
{
    int i = search(key);

    if (i >= 0)
        table[i].state = DELETED;
}

int main(void)
{
    insert(10);
    insert(17);
    insert(24);
    insert(31);

    erase(17);

    insert(38);

    erase(24);

    insert(45);

    printf("%d %d | ",
           search(38),
           search(24));

    for (int i = 3; i <= 6; i++)
        printf("%d ", table[i].key);

    return 0;
}
```

① `4 -1 | 10 38 45 31`  
② `5 -1 | 10 17 38 45`  
③ `4 5 | 10 38 24 31`  
④ `6 -1 | 10 38 31 45`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>4 -1 | 10 38 45 31</code></strong>입니다.</p>

### 1. 해시 함수

```c
key % 7
```

을 사용합니다.

네 초기 키:

```text
10 % 7 = 3
17 % 7 = 3
24 % 7 = 3
31 % 7 = 3
```

모두 같은 시작 위치 3을 가집니다.

### 2. 10 삽입

3번 슬롯이 비어 있으므로:

```text
3: 10
```

### 3. 17 삽입

3번은 사용 중이므로 다음 슬롯 4를 확인합니다.

```text
3: 10
4: 17
```

### 4. 24 삽입

3, 4가 사용 중입니다.

5번에 들어갑니다.

```text
3: 10
4: 17
5: 24
```

### 5. 31 삽입

3, 4, 5가 사용 중이므로:

```text
6: 31
```

현재:

```text
3: 10
4: 17
5: 24
6: 31
```

### 6. 17 삭제

4번 슬롯을 완전히 EMPTY로 바꾸지 않습니다.

```text
4: DELETED
```

가 됩니다.

이 삭제 표식이 중요한 이유는 뒤쪽의 충돌 체인을 유지해야 하기 때문입니다.

### 7. 38 삽입

```text
38 % 7 = 3
```

탐사를 시작합니다.

```text
3 → 10 사용 중
4 → DELETED
```

4를 첫 삭제 위치로 기억합니다.

그 뒤:

```text
5 → 24
6 → 31
0 → EMPTY
```

를 만납니다.

이때 기억해 둔 첫 삭제 위치 4에 삽입합니다.

```text
4: 38
```

### 8. 24 삭제

5번이:

```text
DELETED
```

가 됩니다.

### 9. 45 삽입

```text
45 % 7 = 3
```

탐사:

```text
3 → 10
4 → 38
5 → DELETED
6 → 31
0 → EMPTY
```

따라서 첫 삭제 위치였던 5를 재사용합니다.

```text
5: 45
```

최종:

```text
3: 10
4: 38
5: 45
6: 31
```

### 10. search(38)

38은 4번 슬롯에 있습니다.

```text
search(38) = 4
```

### 11. search(24)

24가 있었던 5번은 삭제되었지만 탐색은 삭제 표식에서 멈추지 않습니다.

뒤를 계속 조사합니다.

결국 24를 찾지 못하고 빈 슬롯을 만나므로:

```text
search(24) = -1
```

### 12. 최종 출력

```text
4 -1 | 10 38 45 31
```

### 반드시 알아야 할 개념

개방 주소 방식의 해시에서 삭제 시 슬롯을 바로 EMPTY로 만들면 탐사 체인이 끊어질 수 있습니다.

그래서:

```text
EMPTY
USED
DELETED
```

를 구분하는 삭제 표식을 사용합니다.

평균 탐색은 좋은 적재율에서:

```text
O(1)
```

을 기대하지만 충돌이 심하면 최악의 경우:

```text
O(n)
```

까지 갈 수 있습니다.

### 자주 하는 실수

삭제된 슬롯을 만나자마자 검색 실패라고 판단하면 안 됩니다.

검색이 멈출 수 있는 것은 **처음부터 사용된 적이 없는 EMPTY 슬롯**을 만났을 때입니다.

</details>

## 문제 6. 원형 덱과 랩어라운드

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

#define CAP 6

typedef struct {
    int data[CAP];
    int front;
    int size;
} Deque;

void push_back(Deque *q, int x)
{
    int i =
        (q->front + q->size) % CAP;

    q->data[i] = x;
    q->size++;
}

void push_front(Deque *q, int x)
{
    q->front =
        (q->front + CAP - 1) % CAP;

    q->data[q->front] = x;
    q->size++;
}

int pop_front(Deque *q)
{
    int x = q->data[q->front];

    q->front =
        (q->front + 1) % CAP;

    q->size--;

    return x;
}

int pop_back(Deque *q)
{
    int i =
        (q->front + q->size - 1) % CAP;

    int x = q->data[i];

    q->size--;

    return x;
}

int main(void)
{
    Deque q = {{0}, 0, 0};

    push_back(&q, 10);
    push_back(&q, 20);
    push_front(&q, 5);

    int a = pop_back(&q);

    push_back(&q, 30);
    push_front(&q, 1);
    push_back(&q, 40);

    int b = pop_front(&q);

    printf("%d %d %d | ",
           a, b, q.front);

    for (int i = 0; i < q.size; i++) {
        int index =
            (q.front + i) % CAP;

        printf("%d ", q.data[index]);
    }

    return 0;
}
```

① `20 1 5 | 5 10 30 40`  
② `20 5 0 | 1 10 30 40`  
③ `10 1 5 | 5 20 30 40`  
④ `20 1 4 | 5 10 30 40`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>20 1 5 | 5 10 30 40</code></strong>입니다.</p>

### 1. 초기 상태

```text
front = 0
size  = 0
```

### 2. push_back(10)

삽입 위치:

```text
(front + size) % 6
= 0
```

따라서:

```text
data[0] = 10
size = 1
```

논리적 덱:

```text
10
```

### 3. push_back(20)

삽입 위치:

```text
(0 + 1) % 6 = 1
```

```text
data[1] = 20
```

논리적 상태:

```text
10 20
```

### 4. push_front(5)

새 front:

```text
(0 + 6 - 1) % 6
= 5
```

따라서:

```text
data[5] = 5
front = 5
```

논리적 덱:

```text
5 10 20
```

실제 배열 위치는:

```text
index 5 → 5
index 0 → 10
index 1 → 20
```

처럼 랩어라운드되어 있습니다.

### 5. pop_back

현재:

```text
front = 5
size = 3
```

뒤쪽 인덱스:

```text
(5 + 3 - 1) % 6
= 1
```

따라서:

```text
a = 20
```

논리적 덱:

```text
5 10
```

### 6. push_back(30)

현재 뒤 삽입 위치:

```text
(5 + 2) % 6 = 1
```

따라서:

```text
data[1] = 30
```

논리적:

```text
5 10 30
```

### 7. push_front(1)

새 front:

```text
(5 + 5) % 6
= 4
```

```text
data[4] = 1
```

논리적:

```text
1 5 10 30
```

### 8. push_back(40)

현재:

```text
front = 4
size = 4
```

삽입 위치:

```text
(4 + 4) % 6
= 2
```

따라서:

```text
data[2] = 40
```

논리적:

```text
1 5 10 30 40
```

### 9. pop_front

현재 앞 값은:

```text
data[4] = 1
```

따라서:

```text
b = 1
```

front를 한 칸 이동합니다.

```text
front = 5
```

최종 논리적 덱:

```text
5 10 30 40
```

### 10. 최종 출력

```text
a = 20
b = 1
front = 5
```

그리고 논리적 순서:

```text
5 10 30 40
```

따라서:

```text
20 1 5 | 5 10 30 40
```

### 반드시 알아야 할 개념

원형 큐·덱에서는 물리적 배열 인덱스와 논리적 순서가 다를 수 있습니다.

```text
논리적 다음 위치
=
(index + 1) % CAP
```

형태의 모듈러 연산으로 배열 끝에서 다시 처음으로 돌아갑니다.

### 자주 하는 실수

실제 `data[]` 배열을 인덱스 0부터 읽어서 덱의 논리적 순서라고 판단하면 안 됩니다.

항상 `front`부터 시작해야 합니다.

</details>

## 문제 7. 병합 정렬과 역전쌍 개수

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

long long merge_count(
    int *a,
    int *tmp,
    int left,
    int mid,
    int right)
{
    int i = left;
    int j = mid + 1;
    int k = left;

    long long count = 0;

    while (i <= mid &&
           j <= right) {

        if (a[i] <= a[j]) {
            tmp[k++] = a[i++];
        }
        else {
            tmp[k++] = a[j++];

            count +=
                (long long)(mid - i + 1);
        }
    }

    while (i <= mid)
        tmp[k++] = a[i++];

    while (j <= right)
        tmp[k++] = a[j++];

    for (i = left; i <= right; i++)
        a[i] = tmp[i];

    return count;
}

long long sort_count(
    int *a,
    int *tmp,
    int left,
    int right)
{
    if (left >= right)
        return 0;

    int mid =
        left + (right - left) / 2;

    long long count = 0;

    count +=
        sort_count(a, tmp, left, mid);

    count +=
        sort_count(a, tmp, mid + 1, right);

    count +=
        merge_count(
            a, tmp, left, mid, right);

    return count;
}

int main(void)
{
    int a[] = {
        7, 1, 5, 2, 6, 3, 4
    };

    int tmp[7];

    long long count =
        sort_count(a, tmp, 0, 6);

    printf("%lld %d %d\n",
           count,
           a[0],
           a[6]);

    return 0;
}
```

① `9 1 7`  
② `11 1 7`  
③ `11 7 1`  
④ `12 1 7`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>② <code>11 1 7</code></strong>입니다.</p>

### 1. 역전쌍의 의미

인덱스 쌍:

```text
i < j
```

에 대해:

```text
a[i] > a[j]
```

이면 역전쌍 하나입니다.

초기 배열:

```text
7 1 5 2 6 3 4
```

### 2. 직접 개수를 세어 보기

값 7 뒤에는:

```text
1, 5, 2, 6, 3, 4
```

가 모두 7보다 작습니다.

따라서:

```text
6개
```

입니다.

값 1은 뒤의 값보다 작으므로:

```text
0개
```

입니다.

값 5 뒤에서 5보다 작은 값:

```text
2, 3, 4
```

따라서:

```text
3개
```

입니다.

현재 누적:

```text
6 + 3 = 9
```

값 2 뒤에는 2보다 작은 값이 없습니다.

값 6 뒤에서 작은 값:

```text
3, 4
```

두 개입니다.

따라서:

```text
9 + 2 = 11
```

값 3 뒤의 4는 더 크므로 추가 없음.

총:

```text
11
```

입니다.

### 3. 병합 과정에서 왜 한 번에 여러 개를 더하는가

왼쪽 절반과 오른쪽 절반은 재귀적으로 이미 정렬된 상태입니다.

병합 중:

```c
a[i] > a[j]
```

가 발생하면 현재 왼쪽의 `a[i]`뿐 아니라:

```text
a[i]
a[i + 1]
...
a[mid]
```

전체가 정렬 특성상 `a[j]`보다 큽니다.

따라서 역전쌍 수를:

```c
mid - i + 1
```

만큼 한 번에 추가할 수 있습니다.

### 4. 정렬 완료 후 배열

병합 정렬이 끝나면:

```text
1 2 3 4 5 6 7
```

입니다.

따라서:

```text
a[0] = 1
a[6] = 7
```

### 5. 최종 출력

```text
11 1 7
```

### 반드시 알아야 할 개념

역전쌍을 이중 반복문으로 세면:

```text
O(n²)
```

입니다.

병합 정렬 과정에 개수 계산을 합치면:

```text
O(n log n)
```

에 계산할 수 있습니다.

### 자주 하는 실수

오른쪽 원소가 더 작을 때 역전쌍을 1개만 증가시키면 안 됩니다.

왼쪽 정렬 구간에 남아 있는 모든 값과 동시에 역전 관계가 형성됩니다.

</details>

## 문제 8. 다익스트라 최단 경로와 선행 정점

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

#define N 5
#define INF 1000000

int main(void)
{
    int graph[N][N] = {
        {0, 4, 1, 0, 0},
        {4, 0, 2, 1, 7},
        {1, 2, 0, 5, 10},
        {0, 1, 5, 0, 3},
        {0, 7, 10, 3, 0}
    };

    int dist[N];
    int used[N] = {0};
    int pred[N];

    for (int i = 0; i < N; i++) {
        dist[i] = INF;
        pred[i] = -1;
    }

    dist[0] = 0;

    for (int iter = 0;
         iter < N;
         iter++) {

        int u = -1;

        for (int i = 0; i < N; i++) {
            if (!used[i] &&
                (u < 0 ||
                 dist[i] < dist[u]))
                u = i;
        }

        used[u] = 1;

        for (int v = 0; v < N; v++) {
            if (graph[u][v] != 0 &&
                !used[v] &&
                dist[v] >
                    dist[u] + graph[u][v]) {

                dist[v] =
                    dist[u] + graph[u][v];

                pred[v] = u;
            }
        }
    }

    for (int i = 0; i < N; i++)
        printf("%d ", dist[i]);

    printf("| %d\n", pred[4]);

    return 0;
}
```

① `0 4 1 5 8 | 3`  
② `0 3 1 4 7 | 3`  
③ `0 3 1 4 10 | 1`  
④ `0 4 1 4 7 | 1`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>② <code>0 3 1 4 7 | 3</code></strong>입니다.</p>

### 1. 시작 정점

시작점은 0입니다.

초기:

```text
dist[0] = 0
나머지 = INF
```

### 2. 정점 0 처리

0에서 직접 연결:

```text
0 → 1 : 4
0 → 2 : 1
```

따라서:

```text
dist = 0 4 1 INF INF
pred = -1 0 0 -1 -1
```

### 3. 다음 선택 정점

아직 사용하지 않은 정점 중 가장 가까운 것은:

```text
정점 2
거리 1
```

입니다.

### 4. 정점 2에서 완화

2에서:

```text
2 → 1 : 2
2 → 3 : 5
2 → 4 : 10
```

따라서:

```text
0 → 2 → 1
거리 = 1 + 2 = 3
```

기존 4보다 짧습니다.

```text
dist[1] = 3
pred[1] = 2
```

또한:

```text
dist[3] = 6
pred[3] = 2
```

```text
dist[4] = 11
pred[4] = 2
```

현재:

```text
dist = 0 3 1 6 11
```

### 5. 정점 1 선택

거리 3인 정점 1을 확정합니다.

1에서 정점 3으로:

```text
3 + 1 = 4
```

기존 6보다 짧습니다.

```text
dist[3] = 4
pred[3] = 1
```

정점 4로:

```text
3 + 7 = 10
```

기존 11보다 짧습니다.

```text
dist[4] = 10
pred[4] = 1
```

### 6. 정점 3 선택

거리 4입니다.

정점 4로:

```text
4 + 3 = 7
```

기존 10보다 짧습니다.

따라서:

```text
dist[4] = 7
pred[4] = 3
```

### 7. 최종 최단 거리

```text
정점 0 → 0
정점 1 → 3
정점 2 → 1
정점 3 → 4
정점 4 → 7
```

따라서:

```text
0 3 1 4 7
```

입니다.

정점 4의 최종 선행 정점은:

```text
3
```

입니다.

### 8. 실제 최단 경로

`pred`를 거꾸로 추적하면:

```text
4 ← 3 ← 1 ← 2 ← 0
```

따라서:

```text
0 → 2 → 1 → 3 → 4
```

입니다.

비용:

```text
1 + 2 + 1 + 3 = 7
```

### 반드시 알아야 할 개념

다익스트라는 음수 가중치가 없는 그래프에서 사용합니다.

배열 구현은:

```text
O(V²)
```

이고 우선순위 큐를 이용하면 희소 그래프에서 일반적으로 더 효율적으로 구현할 수 있습니다.

핵심은 가장 가까운 미확정 정점을 하나씩 확정하고 간선을 **완화**하는 것입니다.

### 자주 하는 실수

직접 간선:

```text
0 → 1 = 4
```

만 보고 정점 1의 최단 거리를 4로 고정하면 안 됩니다.

```text
0 → 2 → 1
```

의 비용 3이 더 짧습니다.

</details>

## 문제 9. 칸 알고리즘 기반 위상 정렬

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

#define N 6

int main(void)
{
    int graph[N][N] = {0};

    graph[0][1] = 1;
    graph[0][3] = 1;

    graph[2][3] = 1;
    graph[2][4] = 1;

    graph[1][4] = 1;

    graph[3][5] = 1;
    graph[4][5] = 1;

    int indegree[N] = {0};

    for (int u = 0; u < N; u++) {
        for (int v = 0; v < N; v++) {
            if (graph[u][v])
                indegree[v]++;
        }
    }

    int queue[N];
    int front = 0;
    int rear = 0;

    for (int i = 0; i < N; i++) {
        if (indegree[i] == 0)
            queue[rear++] = i;
    }

    while (front < rear) {
        int u = queue[front++];

        printf("%d ", u);

        for (int v = 0; v < N; v++) {
            if (!graph[u][v])
                continue;

            indegree[v]--;

            if (indegree[v] == 0)
                queue[rear++] = v;
        }
    }

    return 0;
}
```

① `0 1 2 3 4 5`  
② `0 2 1 3 4 5`  
③ `2 0 3 1 4 5`  
④ `0 2 3 1 4 5`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>② <code>0 2 1 3 4 5</code></strong>입니다.</p>

### 1. 간선 정리

그래프는 다음 간선을 가집니다.

```text
0 → 1
0 → 3

2 → 3
2 → 4

1 → 4

3 → 5
4 → 5
```

### 2. 초기 진입 차수

정점별 진입 차수:

```text
0: 0
1: 1
2: 0
3: 2
4: 2
5: 2
```

따라서 처음 큐에 들어가는 정점은 인덱스 순서대로:

```text
0, 2
```

입니다.

초기 큐:

```text
[0, 2]
```

### 3. 정점 0 처리

먼저 0을 출력합니다.

```text
출력: 0
```

0의 간선 제거:

```text
0 → 1 제거
0 → 3 제거
```

새 진입 차수:

```text
1: 0
3: 1
```

정점 1이 새로 큐 뒤에 들어갑니다.

중요한 점은 기존 큐에 정점 2가 이미 들어 있었다는 것입니다.

현재 큐의 처리 예정 순서:

```text
2, 1
```

### 4. 정점 2 처리

다음 출력은 2입니다.

```text
출력: 0 2
```

간선:

```text
2 → 3
2 → 4
```

를 제거합니다.

정점 3:

```text
1 → 0
```

이 되어 큐에 들어갑니다.

정점 4는:

```text
2 → 1
```

이므로 아직 들어가지 않습니다.

큐:

```text
1, 3
```

### 5. 정점 1 처리

출력:

```text
0 2 1
```

간선:

```text
1 → 4
```

제거 후 정점 4의 진입 차수는 0입니다.

큐 뒤에 4를 추가합니다.

현재:

```text
3, 4
```

### 6. 정점 3 처리

출력:

```text
0 2 1 3
```

`3 → 5` 제거 후 정점 5의 진입 차수는:

```text
1
```

입니다.

### 7. 정점 4 처리

출력:

```text
0 2 1 3 4
```

`4 → 5`를 제거하면:

```text
indegree[5] = 0
```

이 되어 5를 큐에 넣습니다.

### 8. 마지막 정점 5

최종 출력:

```text
0 2 1 3 4 5
```

### 반드시 알아야 할 개념

위상 정렬 결과는 일반적으로 하나로 유일하지 않을 수 있습니다.

이번 코드는 진입 차수가 0인 정점을 **일반 FIFO 큐**에 넣으며, 초기 삽입과 간선 탐색이 인덱스 순서로 이루어집니다.

따라서 이 구현에서 출력 순서를 계산하려면 **큐에 들어간 시점**까지 추적해야 합니다.

시간복잡도는 인접 리스트 구현에서는:

```text
O(V + E)
```

가 대표적입니다.

현재 코드는 인접 행렬이므로 간선 탐색 비용 때문에 더 많은 연산을 수행합니다.

### 자주 하는 실수

정점 번호가 작으므로 매 순간 가장 작은 번호부터 처리한다고 생각하면 안 됩니다.

이 코드는 우선순위 큐가 아니라 FIFO 큐입니다.

0 처리 후 1이 새로 들어가도 이미 큐에 있던 2보다 뒤에 배치됩니다.

</details>

## 문제 10. KMP 실패 함수와 문자열 탐색

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>
#include <string.h>

void build_lps(
    const char *pattern,
    int *lps)
{
    int m = (int)strlen(pattern);

    lps[0] = 0;

    int j = 0;

    for (int i = 1; i < m; i++) {
        while (j > 0 &&
               pattern[i] != pattern[j]) {
            j = lps[j - 1];
        }

        if (pattern[i] == pattern[j]) {
            j++;
            lps[i] = j;
        }
        else {
            lps[i] = 0;
        }
    }
}

int search_kmp(
    const char *text,
    const char *pattern,
    const int *lps)
{
    int n = (int)strlen(text);
    int m = (int)strlen(pattern);

    int j = 0;

    for (int i = 0; i < n; i++) {

        while (j > 0 &&
               text[i] != pattern[j]) {
            j = lps[j - 1];
        }

        if (text[i] == pattern[j]) {
            j++;

            if (j == m)
                return i - m + 1;
        }
    }

    return -1;
}

int main(void)
{
    const char *pattern = "ABABACA";
    const char *text = "BACBABABACAB";

    int lps[7];

    build_lps(pattern, lps);

    int index =
        search_kmp(text, pattern, lps);

    printf("%d | ", index);

    for (int i = 0; i < 7; i++)
        printf("%d ", lps[i]);

    return 0;
}
```

① `4 | 0 0 1 2 3 0 1`  
② `5 | 0 0 1 2 3 0 1`  
③ `4 | 0 0 1 2 0 1 2`  
④ `5 | 0 0 1 2 0 1 2`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>4 | 0 0 1 2 3 0 1</code></strong>입니다.</p>

### 1. LPS의 의미

`lps[i]`는 패턴의:

```text
pattern[0..i]
```

구간에 대해 **접두사이면서 접미사인 가장 긴 진부분 문자열의 길이**를 저장합니다.

패턴:

```text
A B A B A C A
0 1 2 3 4 5 6
```

### 2. lps[0]

한 문자만 있는 구간에는 진부분 접두·접미사가 없습니다.

```text
lps[0] = 0
```

### 3. i = 1

문자:

```text
B
```

와 시작 문자:

```text
A
```

가 다릅니다.

```text
lps[1] = 0
```

### 4. i = 2

현재 문자:

```text
A
```

가 패턴 시작 문자 `A`와 같습니다.

```text
lps[2] = 1
```

부분 문자열 `"ABA"`에서:

```text
접두사 "A"
접미사 "A"
```

가 일치합니다.

### 5. i = 3

현재까지:

```text
ABAB
```

가장 긴 일치:

```text
AB
```

따라서:

```text
lps[3] = 2
```

### 6. i = 4

부분 문자열:

```text
ABABA
```

에서:

```text
접두사 ABA
접미사 ABA
```

가 일치합니다.

따라서:

```text
lps[4] = 3
```

### 7. i = 5

문자 `C`에서 이전 접두사 후보와 불일치합니다.

실패 함수를 따라 길이를 줄여도 `C`와 대응되는 접두 문자가 없습니다.

따라서:

```text
lps[5] = 0
```

### 8. i = 6

문자:

```text
A
```

가 패턴 첫 문자와 일치합니다.

```text
lps[6] = 1
```

최종 LPS:

```text
0 0 1 2 3 0 1
```

### 9. 텍스트에서 패턴 찾기

텍스트:

```text
B A C B A B A B A C A B
0 1 2 3 4 5 6 7 8 9 10 11
```

인덱스 4부터 보면:

```text
text[4..10]
=
A B A B A C A
```

패턴:

```text
A B A B A C A
```

와 정확히 일치합니다.

따라서 첫 일치 시작 위치는:

```text
4
```

입니다.

### 10. 최종 출력

```text
4 | 0 0 1 2 3 0 1
```

### 반드시 알아야 할 개념

KMP의 핵심은 불일치가 발생했을 때 텍스트 인덱스를 뒤로 되돌리지 않고 패턴의 접두·접미사 정보를 이용해 비교 위치를 이동하는 것입니다.

전처리와 탐색을 합쳐:

```text
O(n + m)
```

시간에 문자열 탐색을 수행할 수 있습니다.

### 자주 하는 실수

LPS를 단순히 앞에서 같은 문자가 몇 개 나오는지를 세는 배열로 생각하면 안 됩니다.

항상:

```text
접두사이면서 접미사
```

라는 조건을 동시에 만족해야 합니다.

</details>

## 잘 놓치는 핵심

### 1. 순환 연결 리스트는 방문 배열 없이 탐지할 수 있다

플로이드 알고리즘은 느린 포인터와 빠른 포인터의 상대 속도를 이용합니다.

### 2. 경로 압축은 호출된 경로만 압축한다

같은 집합의 모든 `parent` 값이 항상 즉시 대표 원소로 바뀌는 것은 아닙니다.

### 3. 힙은 정렬 배열이 아니다

부모와 자식 사이의 순서 불변식만 보장합니다.

### 4. AVL 트리는 삽입 경로와 회전 유형을 함께 판단한다

좌좌·우우뿐 아니라 좌우·우좌의 이중 회전도 구분해야 합니다.

### 5. 개방 주소 해시에서 삭제 표식은 탐사 체인을 유지한다

삭제된 슬롯과 처음부터 빈 슬롯은 의미가 다릅니다.

### 6. 원형 덱은 논리적 순서와 실제 배열 인덱스가 다르다

항상 `front`와 모듈러 연산을 기준으로 추적합니다.

### 7. 병합 정렬로 역전쌍을 O(n log n)에 셀 수 있다

오른쪽 값이 먼저 선택되면 왼쪽에 남은 원소 수만큼 역전쌍이 생깁니다.

### 8. 다익스트라는 가장 가까운 미확정 정점을 확정하고 완화한다

직접 간선보다 우회 경로가 더 짧을 수 있습니다.

### 9. 위상 정렬은 진입 차수 0 정점의 처리 자료구조에 따라 결과가 달라질 수 있다

FIFO 큐인지 최소 힙인지에 따라 가능한 위상 순서 중 실제 출력이 달라집니다.

### 10. KMP는 접두사·접미사 정보를 이용해 비교를 재사용한다

실패 시 텍스트를 되돌리는 것이 아니라 패턴 내부의 다음 비교 위치를 결정합니다.

## 시험·면접에서 바로 보는 포인트

- 연결 리스트 문제는 노드 값을 보기 전에 `next` 연결부터 그립니다.
- 서로소 집합은 `parent` 배열과 실제 대표 원소를 구분합니다.
- 힙은 매 삽입·삭제 후 배열 상태를 다시 적습니다.
- 균형 트리는 어느 노드에서 최초로 균형이 깨지는지 확인합니다.
- 해시는 시작 해시값뿐 아니라 전체 탐사 경로를 추적합니다.
- 원형 큐·덱은 `% 용량` 연산을 생략하지 않습니다.
- 분할 정복 문제는 재귀 구간과 병합 단계에서 발생하는 추가 계산을 구분합니다.
- 최단 경로 문제는 현재 거리와 확정 여부를 표로 추적합니다.
- 위상 정렬은 큐에 들어간 시점을 기록합니다.
- 문자열 탐색은 전처리 배열이 무엇을 의미하는지 이해한 뒤 코드를 추적합니다.

## 다음에 이을 글

심화 세트 4에서는 **트라이, 세그먼트 트리, 펜윅 트리, 이진 탐색 변형, 우선순위 큐 기반 그래프 알고리즘, 최소 신장 트리, 강한 연결 요소, 동적 계획법과 메모이제이션**을 중심으로 난도를 더 높입니다.
