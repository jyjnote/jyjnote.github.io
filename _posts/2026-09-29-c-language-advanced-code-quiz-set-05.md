---
title: C 언어 심화 코드 추론 문제 세트 5
date: 2026-09-29 18:01:11 +0900
slug: c-language-advanced-code-quiz-set-05
permalink: /posts/c-language-advanced-code-quiz-set-05/
categories: [프로그래밍, C언어]
tags: [C언어, 심화C, 알고리즘, 자료구조, 레드블랙트리, B트리, 그래프, 동적계획법]
math: true
---

이번 세트는 **균형 탐색 트리, 고급 그래프 알고리즘, 문자열 해싱처럼 구현 원리 자체를 이해해야 추론할 수 있는 문제**를 중심으로 구성했습니다.

단순히 코드를 한 줄씩 계산하는 수준을 넘어, 회전과 색상 불변식, 노드 분할, 전처리 테이블, 잔여 그래프, 상태 압축 등 알고리즘이 유지하는 구조적 조건을 함께 분석합니다.

<blockquote class="prompt-info">
<p>한 줄: 자료구조의 내부 불변식과 알고리즘의 중간 상태를 정확히 추적해야 정답에 도달할 수 있는 고난도 세트입니다.</p>
</blockquote>

<details markdown="1">
<summary>풀이 방법</summary>

1. 균형 트리는 삽입할 때마다 구조와 색상 또는 키 분할 상태를 다시 그립니다.
2. 전처리 기반 알고리즘은 전처리 테이블이 무엇을 의미하는지 먼저 정의합니다.
3. 그래프 알고리즘은 거리·선행 정점·잔여 용량 같은 상태 배열을 단계별로 갱신합니다.
4. 동적 계획법은 상태의 의미와 이미 방문한 정점 집합의 표현을 먼저 확인합니다.
5. 문자열 해시는 해시 일치와 실제 문자열 일치를 구분합니다.
6. 결과만 계산하지 말고 해당 알고리즘이 왜 그 시간복잡도를 가지는지도 함께 확인합니다.

</details>

## 문제 1. 레드-블랙 트리 삽입과 회전·재색칠

다음 코드는 일반적인 레드-블랙 트리 삽입 알고리즘입니다.

```c
#include <stdio.h>
#include <stdlib.h>

enum {
    BLACK,
    RED
};

typedef struct Node {
    int key;
    int color;
    struct Node *left;
    struct Node *right;
    struct Node *parent;
} Node;

int color_of(Node *p)
{
    return p ? p->color : BLACK;
}

Node *new_node(int key)
{
    Node *n = malloc(sizeof *n);

    n->key = key;
    n->color = RED;
    n->left = NULL;
    n->right = NULL;
    n->parent = NULL;

    return n;
}

void rotate_left(Node **root, Node *x)
{
    Node *y = x->right;

    x->right = y->left;

    if (y->left)
        y->left->parent = x;

    y->parent = x->parent;

    if (x->parent == NULL)
        *root = y;
    else if (x == x->parent->left)
        x->parent->left = y;
    else
        x->parent->right = y;

    y->left = x;
    x->parent = y;
}

void rotate_right(Node **root, Node *y)
{
    Node *x = y->left;

    y->left = x->right;

    if (x->right)
        x->right->parent = y;

    x->parent = y->parent;

    if (y->parent == NULL)
        *root = x;
    else if (y == y->parent->left)
        y->parent->left = x;
    else
        y->parent->right = x;

    x->right = y;
    y->parent = x;
}

void insert(Node **root, int key)
{
    Node *z = new_node(key);

    Node *parent = NULL;
    Node *p = *root;

    while (p) {
        parent = p;

        if (key < p->key)
            p = p->left;
        else
            p = p->right;
    }

    z->parent = parent;

    if (parent == NULL)
        *root = z;
    else if (key < parent->key)
        parent->left = z;
    else
        parent->right = z;

    while (z != *root &&
           color_of(z->parent) == RED) {

        if (z->parent ==
            z->parent->parent->left) {

            Node *u =
                z->parent->parent->right;

            if (color_of(u) == RED) {
                z->parent->color = BLACK;
                u->color = BLACK;
                z->parent->parent->color = RED;
                z = z->parent->parent;
            }
            else {
                if (z == z->parent->right) {
                    z = z->parent;
                    rotate_left(root, z);
                }

                z->parent->color = BLACK;
                z->parent->parent->color = RED;

                rotate_right(
                    root,
                    z->parent->parent);
            }
        }
        else {
            Node *u =
                z->parent->parent->left;

            if (color_of(u) == RED) {
                z->parent->color = BLACK;
                u->color = BLACK;
                z->parent->parent->color = RED;
                z = z->parent->parent;
            }
            else {
                if (z == z->parent->left) {
                    z = z->parent;
                    rotate_right(root, z);
                }

                z->parent->color = BLACK;
                z->parent->parent->color = RED;

                rotate_left(
                    root,
                    z->parent->parent);
            }
        }
    }

    (*root)->color = BLACK;
}

void preorder(Node *p)
{
    if (p == NULL)
        return;

    printf("%d%c ",
           p->key,
           p->color == BLACK ? 'B' : 'R');

    preorder(p->left);
    preorder(p->right);
}

int main(void)
{
    int input[] = {
        10, 20, 30, 15, 25, 5, 1
    };

    Node *root = NULL;

    for (int i = 0; i < 7; i++)
        insert(&root, input[i]);

    printf("%d%c | ",
           root->key,
           root->color == BLACK ? 'B' : 'R');

    preorder(root);

    return 0;
}
```

① `20B | 20B 10R 5B 1R 15B 30B 25R`  
② `20B | 20B 10B 5R 1B 15R 30B 25R`  
③ `10B | 10B 5B 1R 20R 15B 30B 25R`  
④ `20R | 20R 10B 5R 1B 15B 30B 25R`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>20B | 20B 10R 5B 1R 15B 30B 25R</code></strong>입니다.</p>

### 1. 레드-블랙 트리의 핵심 조건

대표적으로 다음 조건을 유지합니다.

```text
루트는 검정
NULL 리프는 검정으로 취급
빨강 노드의 자식은 빨강일 수 없음
어떤 노드에서 모든 NULL 리프까지의 검정 노드 수가 같음
```

따라서 단순 이진 탐색 트리 삽입 후 색만 붙이는 것이 아니라 회전과 재색칠이 필요합니다.

### 2. 10, 20, 30 삽입

10은 루트가 되며 검정으로 바뀝니다.

20은 10의 오른쪽 빨강 자식입니다.

30을 넣으면:

```text
10B
  \
  20R
    \
    30R
```

이 되어 빨강-빨강 위반이 발생합니다.

오른쪽-오른쪽 형태이므로 10을 기준으로 왼쪽 회전합니다.

결과:

```text
   20B
  /   \
10R   30R
```

### 3. 15 삽입

15는 10의 오른쪽에 들어갑니다.

```text
   20B
  /   \
10R   30R
  \
  15R
```

부모 10과 삼촌 30이 모두 빨강입니다.

따라서 10과 30을 검정, 20을 빨강으로 바꿉니다.

루트는 마지막에 다시 검정이 됩니다.

```text
   20B
  /   \
10B   30B
  \
  15R
```

### 4. 25 삽입

25는 30의 왼쪽 자식입니다.

부모 30이 검정이므로 추가 수정이 필요 없습니다.

```text
   20B
  /   \
10B   30B
  \    /
 15R 25R
```

### 5. 5 삽입

5는 10의 왼쪽에 들어갑니다.

부모가 검정이므로 그대로입니다.

```text
      20B
     /   \
   10B   30B
   / \    /
  5R 15R 25R
```

### 6. 1 삽입

1은 5의 왼쪽에 들어갑니다.

```text
      20B
     /   \
   10B   30B
   / \    /
  5R 15R 25R
 /
1R
```

부모 5와 삼촌 15가 모두 빨강입니다.

따라서:

```text
5 → 검정
15 → 검정
10 → 빨강
```

으로 재색칠합니다.

최종:

```text
        20B
       /   \
     10R   30B
     / \    /
    5B 15B 25R
   /
  1R
```

### 7. 전위 순회

전위 순회:

```text
루트 → 왼쪽 → 오른쪽
```

순서이므로:

```text
20B
10R
5B
1R
15B
30B
25R
```

입니다.

### 반드시 알아야 할 개념

레드-블랙 트리는 완벽히 높이를 맞추는 트리가 아닙니다.

색상 불변식을 통해 가장 긴 경로가 가장 짧은 경로의 두 배를 크게 넘지 않도록 제한하여 탐색·삽입·삭제를:

```text
O(log n)
```

으로 유지합니다.

### 자주 하는 실수

AVL 트리처럼 모든 노드의 좌우 높이 차이가 1 이하여야 한다고 생각하면 안 됩니다.

레드-블랙 트리의 균형 조건은 **색상과 검정 높이**를 이용합니다.

</details>

## 문제 2. 최소 차수 2인 B-트리의 노드 분할

다음 코드는 최소 차수 2인 B-트리에 키를 삽입합니다.

```c
#include <stdio.h>
#include <stdlib.h>

#define T 2
#define MAX_KEYS (2 * T - 1)
#define MAX_CHILD (2 * T)

typedef struct BNode {
    int n;
    int leaf;
    int key[MAX_KEYS];
    struct BNode *child[MAX_CHILD];
} BNode;

BNode *new_node(int leaf)
{
    BNode *p = calloc(1, sizeof *p);
    p->leaf = leaf;
    return p;
}

void split_child(
    BNode *parent,
    int index)
{
    BNode *left = parent->child[index];
    BNode *right = new_node(left->leaf);

    right->n = T - 1;

    for (int j = 0; j < T - 1; j++)
        right->key[j] =
            left->key[j + T];

    if (!left->leaf) {
        for (int j = 0; j < T; j++)
            right->child[j] =
                left->child[j + T];
    }

    left->n = T - 1;

    for (int j = parent->n;
         j >= index + 1;
         j--)
        parent->child[j + 1] =
            parent->child[j];

    parent->child[index + 1] = right;

    for (int j = parent->n - 1;
         j >= index;
         j--)
        parent->key[j + 1] =
            parent->key[j];

    parent->key[index] =
        left->key[T - 1];

    parent->n++;
}

void insert_nonfull(
    BNode *x,
    int key)
{
    int i = x->n - 1;

    if (x->leaf) {
        while (i >= 0 &&
               key < x->key[i]) {
            x->key[i + 1] =
                x->key[i];
            i--;
        }

        x->key[i + 1] = key;
        x->n++;
    }
    else {
        while (i >= 0 &&
               key < x->key[i])
            i--;

        i++;

        if (x->child[i]->n ==
            MAX_KEYS) {

            split_child(x, i);

            if (key > x->key[i])
                i++;
        }

        insert_nonfull(
            x->child[i],
            key);
    }
}

void insert(
    BNode **root,
    int key)
{
    BNode *r = *root;

    if (r->n == MAX_KEYS) {
        BNode *s = new_node(0);

        *root = s;
        s->child[0] = r;

        split_child(s, 0);
        insert_nonfull(s, key);
    }
    else {
        insert_nonfull(r, key);
    }
}

int main(void)
{
    BNode *root = new_node(1);

    int input[] = {
        10, 20, 5, 6,
        12, 30, 7, 17
    };

    for (int i = 0; i < 8; i++)
        insert(&root, input[i]);

    printf("%d | ",
           root->n);

    for (int i = 0; i < root->n; i++)
        printf("%d ", root->key[i]);

    printf("| ");

    for (int i = 0;
         i <= root->n;
         i++)
        printf("%d ",
               root->child[i]->n);

    return 0;
}
```

① `2 | 10 20 | 3 2 1`  
② `1 | 10 | 3 3`  
③ `2 | 6 20 | 1 3 2`  
④ `2 | 10 17 | 3 1 2`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>2 | 10 20 | 3 2 1</code></strong>입니다.</p>

### 1. 최소 차수 2의 의미

`T = 2`이면 한 노드가 가질 수 있는 최대 키 수는:

```text
2T - 1 = 3
```

입니다.

노드가 가득 찬 상태에서 더 내려가야 하면 미리 분할합니다.

### 2. 10, 20, 5 삽입

루트 리프에 세 키가 들어갑니다.

```text
[5 10 20]
```

루트가 가득 찼습니다.

### 3. 6 삽입 전 루트 분할

기존 루트의 가운데 키 10이 새로운 루트로 올라갑니다.

```text
        [10]
       /    \
     [5]    [20]
```

그 후 6은 왼쪽 자식에 들어갑니다.

```text
        [10]
       /    \
   [5 6]    [20]
```

### 4. 12, 30 삽입

둘 다 오른쪽 자식에 들어갑니다.

```text
        [10]
       /    \
   [5 6] [12 20 30]
```

### 5. 7 삽입

7은 왼쪽 자식으로 들어갑니다.

```text
        [10]
       /    \
 [5 6 7] [12 20 30]
```

### 6. 17 삽입

17은 오른쪽 자식으로 내려가야 합니다.

하지만 오른쪽 자식:

```text
[12 20 30]
```

은 이미 가득 찼습니다.

따라서 먼저 분할합니다.

가운데 키 20이 부모로 올라갑니다.

```text
           [10 20]
          /   |   \
   [5 6 7]  [12] [30]
```

이제 17은:

```text
10 < 17 < 20
```

이므로 가운데 자식에 들어갑니다.

```text
           [10 20]
          /   |    \
   [5 6 7] [12 17] [30]
```

### 7. 최종 루트

루트의 키 개수:

```text
2
```

키:

```text
10 20
```

자식의 키 개수:

```text
3 2 1
```

### 반드시 알아야 할 개념

B-트리는 한 노드에 여러 키를 저장해 트리 높이를 크게 줄이는 다방향 탐색 트리입니다.

디스크·데이터베이스 인덱스처럼 한 번의 노드 접근 비용이 큰 환경에서 특히 중요합니다.

### 자주 하는 실수

가득 찬 노드에 키를 먼저 넣어 4개로 만든 뒤 나누는 코드라고 생각하면 안 됩니다.

이 구현은 **하강하기 전에 가득 찬 자식을 먼저 분할**하는 방식입니다.

</details>

## 문제 3. 희소 테이블을 이용한 정적 구간 최솟값

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

#define N 8
#define LOG 4

int min_int(int a, int b)
{
    return a < b ? a : b;
}

int main(void)
{
    int a[N] = {
        7, 2, 5, 1,
        9, 3, 6, 4
    };

    int st[LOG][N] = {0};
    int lg[N + 1] = {0};

    for (int i = 0; i < N; i++)
        st[0][i] = a[i];

    for (int i = 2; i <= N; i++)
        lg[i] = lg[i / 2] + 1;

    for (int k = 1; k < LOG; k++) {
        for (int i = 0;
             i + (1 << k) <= N;
             i++) {

            st[k][i] =
                min_int(
                    st[k - 1][i],
                    st[k - 1]
                      [i + (1 << (k - 1))]);
        }
    }

    int query[3][2] = {
        {1, 6},
        {4, 7},
        {0, 2}
    };

    for (int q = 0; q < 3; q++) {
        int left = query[q][0];
        int right = query[q][1];

        int len = right - left + 1;
        int k = lg[len];

        int answer =
            min_int(
                st[k][left],
                st[k]
                  [right - (1 << k) + 1]);

        printf("%d ", answer);
    }

    printf("| %d\n", st[2][1]);

    return 0;
}
```

① `1 3 2 | 1`  
② `1 4 2 | 2`  
③ `2 3 1 | 1`  
④ `1 3 2 | 2`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>1 3 2 | 1</code></strong>입니다.</p>

### 1. 희소 테이블의 의미

```text
st[k][i]
```

는 인덱스 `i`에서 시작하는 길이:

```text
2^k
```

구간의 최솟값을 저장합니다.

예를 들어:

```text
st[2][1]
```

은 길이 4인 구간:

```text
a[1] ~ a[4]
```

의 최솟값입니다.

### 2. st[2][1]

해당 구간:

```text
2, 5, 1, 9
```

최솟값은:

```text
1
```

입니다.

### 3. 첫 번째 질의 [1,6]

구간:

```text
2, 5, 1, 9, 3, 6
```

최솟값:

```text
1
```

### 4. 두 번째 질의 [4,7]

구간:

```text
9, 3, 6, 4
```

최솟값:

```text
3
```

### 5. 세 번째 질의 [0,2]

구간:

```text
7, 2, 5
```

최솟값:

```text
2
```

### 6. 왜 두 구간이 겹쳐도 되는가

최솟값 연산은 같은 원소가 중복 포함되어도 결과가 달라지지 않습니다.

따라서 길이 `2^k`인 두 구간으로 질의 범위를 덮을 때 서로 겹쳐도 됩니다.

### 7. 최종 출력

```text
1 3 2 | 1
```

### 반드시 알아야 할 개념

희소 테이블은 배열이 변경되지 않는 **정적 구간 질의**에 적합합니다.

전처리:

```text
O(n log n)
```

구간 최솟값 질의:

```text
O(1)
```

로 처리할 수 있습니다.

### 자주 하는 실수

세그먼트 트리처럼 갱신까지 효율적으로 지원한다고 생각하면 안 됩니다.

기본 희소 테이블은 원본 배열이 자주 변경되는 문제에는 적합하지 않습니다.

</details>

## 문제 4. 이진 리프팅을 이용한 최소 공통 조상

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

#define N 9
#define LOG 4

int graph[N][N];
int depth[N];
int up[LOG][N];

void dfs(int u, int parent)
{
    up[0][u] = parent;

    for (int k = 1; k < LOG; k++)
        up[k][u] =
            up[k - 1][up[k - 1][u]];

    for (int v = 0; v < N; v++) {
        if (!graph[u][v] ||
            v == parent)
            continue;

        depth[v] = depth[u] + 1;
        dfs(v, u);
    }
}

int lca(int a, int b)
{
    if (depth[a] < depth[b]) {
        int tmp = a;
        a = b;
        b = tmp;
    }

    int diff =
        depth[a] - depth[b];

    for (int k = 0; k < LOG; k++) {
        if (diff & (1 << k))
            a = up[k][a];
    }

    if (a == b)
        return a;

    for (int k = LOG - 1;
         k >= 0;
         k--) {

        if (up[k][a] !=
            up[k][b]) {

            a = up[k][a];
            b = up[k][b];
        }
    }

    return up[0][a];
}

int kth_parent(int u, int k)
{
    for (int bit = 0;
         bit < LOG;
         bit++) {

        if (k & (1 << bit))
            u = up[bit][u];
    }

    return u;
}

int main(void)
{
    int edge[][2] = {
        {0,1}, {0,2},
        {1,3}, {1,4},
        {2,5}, {2,6},
        {5,7}, {5,8}
    };

    for (int i = 0; i < 8; i++) {
        int a = edge[i][0];
        int b = edge[i][1];

        graph[a][b] =
        graph[b][a] = 1;
    }

    for (int k = 0; k < LOG; k++)
        up[k][0] = 0;

    dfs(0, 0);

    int x = lca(7, 8);
    int y = lca(4, 7);

    int d =
        depth[3]
        + depth[8]
        - 2 * depth[lca(3, 8)];

    int p = kth_parent(8, 2);

    printf("%d %d %d %d\n",
           x, y, d, p);

    return 0;
}
```

① `5 0 5 2`  
② `5 1 4 2`  
③ `2 0 5 5`  
④ `5 0 4 2`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>5 0 5 2</code></strong>입니다.</p>

### 1. 트리 구조

```text
          0
        /   \
       1     2
      / \   / \
     3   4 5   6
          / \
         7   8
```

깊이:

```text
0: 0
1,2: 1
3,4,5,6: 2
7,8: 3
```

### 2. lca(7,8)

두 노드는 모두 5의 자식입니다.

따라서:

```text
LCA(7,8) = 5
```

### 3. lca(4,7)

4의 조상:

```text
4 → 1 → 0
```

7의 조상:

```text
7 → 5 → 2 → 0
```

가장 가까운 공통 조상은:

```text
0
```

입니다.

### 4. 3과 8의 거리

공식:

```text
depth[a]
+ depth[b]
- 2 × depth[LCA]
```

입니다.

```text
depth[3] = 2
depth[8] = 3
LCA(3,8) = 0
depth[0] = 0
```

따라서:

```text
2 + 3 - 0
= 5
```

입니다.

### 5. 8의 두 번째 조상

```text
8 → 5 → 2
```

따라서:

```text
kth_parent(8, 2) = 2
```

### 6. 최종 출력

```text
5 0 5 2
```

### 반드시 알아야 할 개념

이진 리프팅은:

```text
2^0번째 조상
2^1번째 조상
2^2번째 조상
...
```

을 미리 저장합니다.

전처리 후 LCA 질의를:

```text
O(log n)
```

에 처리할 수 있습니다.

### 자주 하는 실수

`up[k][u]`를 `k번째 조상`이라고 생각하면 안 됩니다.

정확히는:

```text
2^k번째 조상
```

입니다.

</details>

## 문제 5. 벨만-포드와 음수 간선

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

#define N 5
#define INF 1000000

typedef struct {
    int from;
    int to;
    int weight;
} Edge;

int main(void)
{
    Edge edge[] = {
        {0,1,6},
        {0,2,7},
        {1,2,8},
        {1,3,5},
        {1,4,-4},
        {2,3,-3},
        {2,4,9},
        {3,1,-2},
        {4,0,2},
        {4,3,7}
    };

    int dist[N];

    for (int i = 0; i < N; i++)
        dist[i] = INF;

    dist[0] = 0;

    for (int pass = 0;
         pass < N - 1;
         pass++) {

        int changed = 0;

        for (int i = 0; i < 10; i++) {
            int u = edge[i].from;
            int v = edge[i].to;
            int w = edge[i].weight;

            if (dist[u] != INF &&
                dist[v] >
                    dist[u] + w) {

                dist[v] =
                    dist[u] + w;

                changed = 1;
            }
        }

        if (!changed)
            break;
    }

    int negative_cycle = 0;

    for (int i = 0; i < 10; i++) {
        int u = edge[i].from;
        int v = edge[i].to;
        int w = edge[i].weight;

        if (dist[u] != INF &&
            dist[v] >
                dist[u] + w) {

            negative_cycle = 1;
        }
    }

    for (int i = 0; i < N; i++)
        printf("%d ", dist[i]);

    printf("| %d\n",
           negative_cycle);

    return 0;
}
```

① `0 2 7 4 -2 | 0`  
② `0 6 7 4 2 | 0`  
③ `0 2 7 4 -2 | 1`  
④ `0 4 7 5 0 | 0`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>0 2 7 4 -2 | 0</code></strong>입니다.</p>

### 1. 시작 정점

```text
dist[0] = 0
```

나머지는 무한대로 시작합니다.

### 2. 주요 최단 경로

정점 2:

```text
0 → 2
비용 7
```

따라서:

```text
dist[2] = 7
```

정점 3:

```text
0 → 2 → 3
7 + (-3)
= 4
```

따라서:

```text
dist[3] = 4
```

### 3. 정점 1

직접 간선:

```text
0 → 1 = 6
```

보다:

```text
0 → 2 → 3 → 1
```

이 더 짧습니다.

비용:

```text
7 - 3 - 2
= 2
```

따라서:

```text
dist[1] = 2
```

### 4. 정점 4

경로:

```text
0 → 2 → 3 → 1 → 4
```

비용:

```text
7 - 3 - 2 - 4
= -2
```

따라서:

```text
dist[4] = -2
```

### 5. 최종 거리

```text
0: 0
1: 2
2: 7
3: 4
4: -2
```

### 6. 음수 사이클 검사

벨만-포드는 `V-1`번 완화 후에도 더 줄어드는 간선이 있으면 시작점에서 도달 가능한 음수 사이클이 존재한다고 판단합니다.

이 그래프에서는 추가 완화가 발생하지 않습니다.

따라서:

```text
negative_cycle = 0
```

입니다.

### 반드시 알아야 할 개념

벨만-포드는 음수 간선을 허용합니다.

대표 시간복잡도:

```text
O(VE)
```

이며 음수 사이클 탐지까지 할 수 있습니다.

### 자주 하는 실수

음수 간선이 있다는 사실만으로 음수 사이클이 있다고 판단하면 안 됩니다.

사이클 전체 가중치 합이 음수인지가 중요합니다.

</details>

## 문제 6. 플로이드-워셜과 경유 정점

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

#define N 4
#define INF 1000000

int main(void)
{
    int dist[N][N] = {
        {0,   5, INF, 10},
        {INF, 0,   3, INF},
        {INF, INF, 0,   1},
        {2, INF, INF,   0}
    };

    int next[N][N];

    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            if (i != j &&
                dist[i][j] < INF)
                next[i][j] = j;
            else
                next[i][j] = -1;
        }
    }

    for (int k = 0; k < N; k++) {
        for (int i = 0; i < N; i++) {
            for (int j = 0; j < N; j++) {

                if (dist[i][k] == INF ||
                    dist[k][j] == INF)
                    continue;

                int candidate =
                    dist[i][k]
                    + dist[k][j];

                if (candidate <
                    dist[i][j]) {

                    dist[i][j] =
                        candidate;

                    next[i][j] =
                        next[i][k];
                }
            }
        }
    }

    printf("%d %d %d\n",
           dist[0][3],
           dist[3][2],
           next[0][3]);

    return 0;
}
```

① `9 10 1`  
② `10 10 3`  
③ `9 8 1`  
④ `8 10 2`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>9 10 1</code></strong>입니다.</p>

### 1. 0에서 3까지

직접 간선:

```text
0 → 3 = 10
```

이 있습니다.

하지만:

```text
0 → 1 → 2 → 3
```

경로의 비용은:

```text
5 + 3 + 1
= 9
```

입니다.

따라서:

```text
dist[0][3] = 9
```

### 2. 3에서 2까지

경로:

```text
3 → 0 → 1 → 2
```

비용:

```text
2 + 5 + 3
= 10
```

따라서:

```text
dist[3][2] = 10
```

### 3. next[0][3]

최단 경로는:

```text
0 → 1 → 2 → 3
```

입니다.

`next[i][j]`는 `i`에서 `j`까지 최단 경로로 갈 때 **i 다음에 방문할 정점**을 저장합니다.

따라서:

```text
next[0][3] = 1
```

입니다.

### 반드시 알아야 할 개념

플로이드-워셜은 각 단계에서:

```text
0..k까지의 정점만 중간 정점으로 사용할 수 있을 때의 최단 거리
```

를 갱신합니다.

대표 시간복잡도:

```text
O(V³)
```

이며 모든 정점 쌍 최단 거리를 구합니다.

### 자주 하는 실수

`next[0][3]`를 최종 목적지 3이라고 생각하면 안 됩니다.

이 배열은 경로 복원을 위해 **바로 다음 정점**을 저장합니다.

</details>

## 문제 7. 디닉 알고리즘과 최대 유량

다음 코드는 디닉 알고리즘으로 최대 유량을 구합니다.

```c
#include <stdio.h>

#define N 6
#define MAXE 64
#define INF 1000000

typedef struct {
    int to;
    int cap;
    int next;
} Edge;

Edge edge[MAXE];
int head[N];
int level[N];
int work[N];
int edge_count;

void add_edge(
    int u,
    int v,
    int cap)
{
    edge[edge_count] =
        (Edge){v, cap, head[u]};

    head[u] = edge_count++;

    edge[edge_count] =
        (Edge){u, 0, head[v]};

    head[v] = edge_count++;
}

int bfs(int source, int sink)
{
    int queue[N];
    int front = 0;
    int rear = 0;

    for (int i = 0; i < N; i++)
        level[i] = -1;

    level[source] = 0;
    queue[rear++] = source;

    while (front < rear) {
        int u = queue[front++];

        for (int e = head[u];
             e != -1;
             e = edge[e].next) {

            int v = edge[e].to;

            if (edge[e].cap > 0 &&
                level[v] < 0) {

                level[v] =
                    level[u] + 1;

                queue[rear++] = v;
            }
        }
    }

    return level[sink] >= 0;
}

int dfs(
    int u,
    int sink,
    int flow)
{
    if (u == sink)
        return flow;

    for (int *pe = &work[u];
         *pe != -1;
         *pe = edge[*pe].next) {

        int e = *pe;
        int v = edge[e].to;

        if (edge[e].cap <= 0 ||
            level[v] != level[u] + 1)
            continue;

        int send =
            flow < edge[e].cap
            ? flow
            : edge[e].cap;

        int pushed =
            dfs(v, sink, send);

        if (pushed > 0) {
            edge[e].cap -= pushed;
            edge[e ^ 1].cap += pushed;
            return pushed;
        }
    }

    return 0;
}

int max_flow(
    int source,
    int sink)
{
    int result = 0;

    while (bfs(source, sink)) {

        for (int i = 0; i < N; i++)
            work[i] = head[i];

        while (1) {
            int pushed =
                dfs(source,
                    sink,
                    INF);

            if (pushed == 0)
                break;

            result += pushed;
        }
    }

    return result;
}

int main(void)
{
    for (int i = 0; i < N; i++)
        head[i] = -1;

    add_edge(0, 1, 16);
    add_edge(0, 2, 13);
    add_edge(1, 2, 10);
    add_edge(2, 1, 4);
    add_edge(1, 3, 12);
    add_edge(3, 2, 9);
    add_edge(2, 4, 14);
    add_edge(4, 3, 7);
    add_edge(3, 5, 20);
    add_edge(4, 5, 4);

    int answer = max_flow(0, 5);

    bfs(0, 5);

    int reachable = 0;

    for (int i = 0; i < N; i++) {
        if (level[i] >= 0)
            reachable++;
    }

    printf("%d %d\n",
           answer,
           reachable);

    return 0;
}
```

① `23 4`  
② `23 2`  
③ `24 4`  
④ `20 3`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>23 4</code></strong>입니다.</p>

### 1. 최대 유량 값

이 네트워크는 최대 유량의 대표 예제 구조입니다.

최종적으로 source 0에서 sink 5까지 보낼 수 있는 최대 유량은:

```text
23
```

입니다.

### 2. 최소 컷과의 관계

최대 유량-최소 컷 정리에 의해:

```text
최대 유량 = 최소 컷 용량
```

입니다.

최종 잔여 그래프에서 source에서 도달 가능한 정점 집합은:

```text
{0, 1, 2, 4}
```

입니다.

도달하지 못하는 쪽은:

```text
{3, 5}
```

입니다.

### 3. 컷을 가로지르는 원래 간선

도달 가능 집합에서 반대편으로 가는 간선은:

```text
1 → 3 : 12
4 → 3 : 7
4 → 5 : 4
```

입니다.

합:

```text
12 + 7 + 4 = 23
```

으로 최대 유량과 같습니다.

### 4. bfs 재호출

최대 유량 계산 후:

```c
bfs(0, 5);
```

를 다시 호출합니다.

sink 5에는 도달할 수 없지만 `level[]`에는 source에서 잔여 용량을 따라 도달 가능한 정점이 표시됩니다.

그 수는:

```text
4
```

입니다.

### 5. 최종 출력

```text
23 4
```

### 반드시 알아야 할 개념

디닉 알고리즘은:

```text
레벨 그래프 생성
→ 차단 유량 전송
→ 다시 레벨 그래프 생성
```

을 반복합니다.

일반적인 시간복잡도 상한은:

```text
O(V²E)
```

로 알려져 있습니다.

### 자주 하는 실수

최종 BFS가 sink에 도달하지 못하므로 모든 `level` 값이 -1이라고 생각하면 안 됩니다.

source에서 **일부 정점에는 여전히 잔여 간선을 따라 도달**할 수 있습니다.

</details>

## 문제 8. 비트마스크 동적 계획법과 외판원 순회

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

#define N 4
#define INF 1000000

int min_int(int a, int b)
{
    return a < b ? a : b;
}

int main(void)
{
    int w[N][N] = {
        {0, 10, 15, 20},
        {10, 0, 35, 25},
        {15, 35, 0, 30},
        {20, 25, 30, 0}
    };

    int dp[1 << N][N];

    for (int mask = 0;
         mask < (1 << N);
         mask++) {

        for (int i = 0; i < N; i++)
            dp[mask][i] = INF;
    }

    dp[1][0] = 0;

    for (int mask = 0;
         mask < (1 << N);
         mask++) {

        if (!(mask & 1))
            continue;

        for (int u = 0; u < N; u++) {

            if (!(mask & (1 << u)) ||
                dp[mask][u] == INF)
                continue;

            for (int v = 0; v < N; v++) {

                if (mask & (1 << v))
                    continue;

                int next =
                    mask | (1 << v);

                dp[next][v] =
                    min_int(
                        dp[next][v],
                        dp[mask][u]
                        + w[u][v]);
            }
        }
    }

    int full = (1 << N) - 1;
    int answer = INF;

    for (int u = 1; u < N; u++) {
        answer =
            min_int(
                answer,
                dp[full][u]
                + w[u][0]);
    }

    printf("%d | %d %d %d\n",
           answer,
           dp[full][1],
           dp[full][2],
           dp[full][3]);

    return 0;
}
```

① `80 | 70 65 75`  
② `80 | 65 70 75`  
③ `75 | 70 65 55`  
④ `95 | 70 65 75`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>80 | 70 65 75</code></strong>입니다.</p>

### 1. 상태의 의미

```text
dp[mask][u]
```

는:

```text
도시 0에서 출발
mask에 포함된 도시를 모두 방문
현재 도시 u에서 끝나는 최소 비용
```

입니다.

시작 상태:

```text
dp[0001][0] = 0
```

입니다.

### 2. 모든 도시를 방문하고 1에서 끝나는 경우

가장 좋은 경로는:

```text
0 → 2 → 3 → 1
```

비용:

```text
15 + 30 + 25
= 70
```

따라서:

```text
dp[1111][1] = 70
```

### 3. 2에서 끝나는 경우

경로:

```text
0 → 1 → 3 → 2
```

비용:

```text
10 + 25 + 30
= 65
```

따라서:

```text
dp[1111][2] = 65
```

### 4. 3에서 끝나는 경우

대표 최적 경로:

```text
0 → 1 → 2 → 3
```

비용:

```text
10 + 35 + 30
= 75
```

또는:

```text
0 → 2 → 1 → 3
= 15 + 35 + 25
= 75
```

따라서:

```text
dp[1111][3] = 75
```

### 5. 시작 도시로 복귀

각 마지막 도시에서 0으로 돌아옵니다.

끝이 1:

```text
70 + 10 = 80
```

끝이 2:

```text
65 + 15 = 80
```

끝이 3:

```text
75 + 20 = 95
```

따라서 최솟값:

```text
80
```

입니다.

### 반드시 알아야 할 개념

외판원 문제를 단순 순열 탐색하면:

```text
O(n!)
```

입니다.

비트마스크 동적 계획법을 사용하면 상태 수를:

```text
2^n × n
```

으로 만들 수 있으며 전이는 일반적으로:

```text
O(n² 2^n)
```

입니다.

### 자주 하는 실수

`dp[full][u]` 자체를 완전한 순회의 비용으로 생각하면 안 됩니다.

문제는 시작 도시 0으로 돌아와야 하므로 마지막:

```text
w[u][0]
```

비용까지 더해야 합니다.

</details>

## 문제 9. 롤링 해시와 해시 충돌

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>
#include <string.h>

int value_of(char c)
{
    return c - 'a' + 1;
}

int same_text(
    const char *a,
    const char *b,
    int length)
{
    for (int i = 0; i < length; i++) {
        if (a[i] != b[i])
            return 0;
    }

    return 1;
}

int main(void)
{
    const char *text =
        "abaddbbbaba";

    const char *pattern =
        "aba";

    const int base = 31;
    const int mod = 13;

    int n = (int)strlen(text);
    int m = (int)strlen(pattern);

    int power = 1;

    for (int i = 0; i < m - 1; i++)
        power =
            (power * base) % mod;

    int pattern_hash = 0;
    int window_hash = 0;

    for (int i = 0; i < m; i++) {
        pattern_hash =
            (pattern_hash * base
             + value_of(pattern[i]))
            % mod;

        window_hash =
            (window_hash * base
             + value_of(text[i]))
            % mod;
    }

    int hash_hit = 0;
    int exact_hit = 0;
    int first = -1;
    int last = -1;

    for (int i = 0;
         i <= n - m;
         i++) {

        if (window_hash ==
            pattern_hash) {

            hash_hit++;

            if (same_text(
                    text + i,
                    pattern,
                    m)) {

                exact_hit++;

                if (first < 0)
                    first = i;

                last = i;
            }
        }

        if (i < n - m) {
            window_hash -=
                value_of(text[i])
                * power;

            window_hash %= mod;

            if (window_hash < 0)
                window_hash += mod;

            window_hash =
                (window_hash * base
                 + value_of(text[i + m]))
                % mod;
        }
    }

    printf("%d %d %d %d\n",
           hash_hit,
           exact_hit,
           first,
           last);

    return 0;
}
```

① `2 2 0 8`  
② `4 2 0 8`  
③ `4 4 0 8`  
④ `3 2 2 8`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>② <code>4 2 0 8</code></strong>입니다.</p>

### 1. 패턴

```text
pattern = "aba"
```

입니다.

실제로 텍스트 안에 `"aba"`가 존재하는 위치는:

```text
0
8
```

두 곳입니다.

### 2. 작은 나머지값 사용의 의미

이 코드는 일부러:

```text
mod = 13
```

이라는 매우 작은 나머지값을 사용합니다.

따라서 서로 다른 문자열이 같은 해시값을 가질 가능성이 높습니다.

### 3. 길이 3인 각 창

텍스트:

```text
abaddbbbaba
```

길이 3 창을 보면:

```text
0: aba
1: bad
2: add
3: ddb
4: dbb
5: bbb
6: bba
7: bab
8: aba
```

입니다.

### 4. 패턴과 같은 해시를 가지는 창

이 해시 함수와 `mod = 13`에서 패턴 `"aba"`와 같은 해시가 나오는 창은:

```text
aba
add
bbb
aba
```

입니다.

따라서:

```text
hash_hit = 4
```

입니다.

### 5. 실제 문자열 비교

해시값이 같다고 해서 바로 일치로 확정하지 않습니다.

```c
same_text(...)
```

를 통해 실제 문자를 다시 비교합니다.

실제로 `"aba"`와 같은 것은:

```text
위치 0
위치 8
```

두 곳뿐입니다.

따라서:

```text
exact_hit = 2
first = 0
last = 8
```

입니다.

### 6. 최종 출력

```text
4 2 0 8
```

### 반드시 알아야 할 개념

롤링 해시는 창을 한 칸 이동할 때 문자열 전체 해시를 다시 계산하지 않고 기존 해시에서:

```text
맨 앞 문자 제거
→ 한 자리 이동
→ 새 문자 추가
```

방식으로 갱신합니다.

하지만 일반 해시는 충돌 가능성이 있습니다.

따라서 정확성이 반드시 필요한 경우:

```text
실제 문자열 재검증
이중 해시
```

같은 방법을 사용할 수 있습니다.

### 자주 하는 실수

해시가 같다는 사실을 문자열이 반드시 같다는 뜻으로 해석하면 안 됩니다.

<mark>해시 일치는 후보 판별이고, 충돌 가능성을 어떻게 다룰지가 별도의 문제입니다.</mark>

</details>

## 문제 10. 0-1 너비 우선 탐색

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

#define N 6
#define INF 1000000
#define CAP 64

typedef struct {
    int to;
    int weight;
} Edge;

Edge graph[N][8];
int degree[N];

void add_edge(
    int u,
    int v,
    int w)
{
    graph[u][degree[u]++] =
        (Edge){v, w};
}

int main(void)
{
    add_edge(0, 1, 1);
    add_edge(0, 2, 0);

    add_edge(2, 1, 0);
    add_edge(2, 3, 1);
    add_edge(2, 4, 1);

    add_edge(1, 3, 0);
    add_edge(1, 5, 1);

    add_edge(3, 4, 0);
    add_edge(4, 5, 1);

    int dist[N];

    for (int i = 0; i < N; i++)
        dist[i] = INF;

    int deque[CAP];
    int front = CAP / 2;
    int back = CAP / 2;

    dist[0] = 0;
    deque[back++] = 0;

    while (front < back) {
        int u = deque[front++];

        for (int i = 0;
             i < degree[u];
             i++) {

            int v =
                graph[u][i].to;

            int w =
                graph[u][i].weight;

            if (dist[v] >
                dist[u] + w) {

                dist[v] =
                    dist[u] + w;

                if (w == 0)
                    deque[--front] = v;
                else
                    deque[back++] = v;
            }
        }
    }

    for (int i = 0; i < N; i++)
        printf("%d ", dist[i]);

    return 0;
}
```

① `0 0 0 0 0 1`  
② `0 1 0 1 1 2`  
③ `0 0 0 0 1 1`  
④ `0 1 0 0 0 1`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>0 0 0 0 0 1</code></strong>입니다.</p>

### 1. 0-1 너비 우선 탐색의 전제

모든 간선 가중치가:

```text
0 또는 1
```

일 때 사용할 수 있습니다.

가중치 0 간선으로 완화한 정점은 덱의 앞쪽에 넣고, 가중치 1이면 뒤쪽에 넣습니다.

이렇게 하면 작은 거리의 정점이 우선적으로 처리됩니다.

### 2. 시작 정점

```text
dist[0] = 0
```

### 3. 정점 2

간선:

```text
0 → 2
```

의 비용은 0입니다.

따라서:

```text
dist[2] = 0
```

입니다.

### 4. 정점 1

직접:

```text
0 → 1
```

비용은 1입니다.

하지만:

```text
0 → 2 → 1
```

의 비용은:

```text
0 + 0 = 0
```

입니다.

따라서 최종적으로:

```text
dist[1] = 0
```

입니다.

### 5. 정점 3

경로:

```text
0 → 2 → 1 → 3
```

비용:

```text
0 + 0 + 0
= 0
```

따라서:

```text
dist[3] = 0
```

### 6. 정점 4

경로:

```text
0 → 2 → 1 → 3 → 4
```

모두 0 가중치 간선입니다.

따라서:

```text
dist[4] = 0
```

### 7. 정점 5

가능한 경로:

```text
0 → 2 → 1 → 5
```

비용:

```text
0 + 0 + 1
= 1
```

또는:

```text
0 → 2 → 1 → 3 → 4 → 5
```

역시 마지막 간선만 1이므로:

```text
1
```

입니다.

따라서:

```text
dist[5] = 1
```

### 8. 최종 출력

```text
0 0 0 0 0 1
```

### 반드시 알아야 할 개념

0-1 너비 우선 탐색은 일반 다익스트라보다 특수한 조건을 이용합니다.

간선 가중치가 0과 1뿐일 때 덱을 이용해:

```text
O(V + E)
```

시간에 최단 거리를 구할 수 있습니다.

### 자주 하는 실수

가중치가 있기 때문에 일반 BFS는 사용할 수 없지만, 그렇다고 반드시 이진 힙 기반 다익스트라가 필요한 것도 아닙니다.

가중치 집합이 `{0,1}`이라는 특수 조건을 활용할 수 있습니다.

</details>

## 잘 놓치는 핵심

### 1. 레드-블랙 트리는 색상 불변식으로 높이를 제한한다

AVL처럼 완전한 높이 균형을 유지하는 것이 아니라 회전과 재색칠을 조합합니다.

### 2. B-트리는 가득 찬 노드를 분할하면서 위쪽으로 키를 승격한다

한 노드에 여러 키를 저장하여 트리 높이를 줄입니다.

### 3. 희소 테이블은 정적 구간 질의에 매우 강하다

멱등 연산인 최솟값·최댓값에서는 겹치는 두 구간을 이용해 O(1) 질의가 가능합니다.

### 4. 이진 리프팅은 2의 거듭제곱 단위 조상을 미리 저장한다

LCA와 k번째 조상 질의를 O(log n)에 처리할 수 있습니다.

### 5. 벨만-포드는 음수 간선을 허용하고 음수 사이클도 탐지한다

단순히 음수 간선이 존재하는 것과 음수 사이클이 존재하는 것은 다릅니다.

### 6. 플로이드-워셜은 중간 정점 집합을 단계적으로 확장한다

모든 정점 쌍 최단 거리와 경로 복원 정보를 함께 계산할 수 있습니다.

### 7. 최대 유량 알고리즘은 잔여 그래프를 이해해야 한다

역방향 간선은 이미 보낸 유량을 취소하거나 다른 경로로 재배치할 수 있게 합니다.

### 8. 비트마스크 DP는 방문 집합 자체를 상태로 압축한다

외판원 문제처럼 부분집합 상태가 중요한 문제에서 강력합니다.

### 9. 문자열 해시는 충돌 가능성을 가진다

해시값 일치와 실제 문자열 일치를 구분해야 합니다.

### 10. 간선 가중치가 0과 1뿐이면 덱을 이용할 수 있다

0 가중치는 앞에, 1 가중치는 뒤에 넣어 최단 거리 순서를 유지합니다.

## 시험·면접에서 바로 보는 포인트

- 균형 트리는 삽입 결과만 보지 말고 어떤 불변식이 깨졌는지 먼저 찾습니다.
- B-트리는 노드 최대 키 수와 분할 시 승격되는 가운데 키를 확인합니다.
- 희소 테이블에서 `st[k][i]`가 담당하는 구간 길이는 `2^k`입니다.
- LCA에서 깊이를 먼저 맞춘 뒤 두 정점을 동시에 올립니다.
- 벨만-포드는 V-1회 이후 추가 완화 가능 여부를 확인합니다.
- 플로이드-워셜은 `i → k → j` 경유 경로와 기존 경로를 비교합니다.
- 최대 유량에서는 원래 그래프와 잔여 그래프를 구분합니다.
- 비트마스크 DP는 비트 하나가 어떤 도시·원소를 의미하는지 먼저 정의합니다.
- 롤링 해시 문제는 작은 나머지값에서 충돌이 쉽게 발생할 수 있습니다.
- 0-1 BFS는 가중치 0 간선의 정점을 덱 앞쪽에 넣는 이유를 이해해야 합니다.

## 다음에 이을 글

심화 세트 6에서는 **B+트리, 이항 힙·피보나치 힙의 개념, 최소 공통 조상 응용, 단절점·단절선, 오일러 경로, 이분 매칭, 아호-코라식, 접미사 배열, 트리 동적 계획법**을 중심으로 더 높은 난도의 문제를 구성합니다.
