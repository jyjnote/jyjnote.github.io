---
title: C 언어 코드 추론 문제 세트 6
date: 2026-09-29 11:10:00 +0900
slug: c-language-code-quiz-set-06
permalink: /posts/c-language-code-quiz-set-06/
categories: [프로그래밍, C언어]
tags: [C언어, 코드추론, 동적메모리, realloc, 연결리스트, 함수포인터, 문자열, 재귀]
math: true
---

이번 세트는 **동적 메모리와 연결 구조가 중간에 바뀌는 코드**를 집중적으로 다룹니다.

값만 계산하지 않고 `realloc` 이후 주소의 유효성, 연결 리스트의 포인터 변경, 재귀 반환 순서, 함수 포인터 배열까지 함께 추적합니다.

<blockquote class="prompt-info">
<p>한 줄: 값의 변화뿐 아니라 주소와 메모리의 유효성까지 판단하는 고난도 C 언어 문제 10개입니다.</p>
</blockquote>

<details markdown="1">
<summary>풀이 방법</summary>

1. `malloc`과 `realloc`이 나오면 어떤 메모리 블록을 만드는지 먼저 적습니다.
2. 포인터 배열은 각 원소가 무엇을 가리키는지 따로 표시합니다.
3. 연결 리스트는 `next`가 바뀔 때마다 연결 구조를 다시 그립니다.
4. 재귀는 내려가는 과정과 되돌아오는 과정을 분리합니다.
5. 함수 포인터는 인덱스별로 연결된 함수를 먼저 적습니다.
6. 출력값 계산 전에 포인터가 여전히 유효한지 먼저 확인합니다.

</details>

## 문제 1. 동적 포인터 배열 확장과 행 교환

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int **a = malloc(2 * sizeof(int *));

    if (a == NULL)
        return 1;

    for (int i = 0; i < 2; i++) {
        a[i] = malloc(2 * sizeof(int));

        if (a[i] == NULL)
            return 1;
    }

    a[0][0] = 1;
    a[0][1] = 2;
    a[1][0] = 3;
    a[1][1] = 4;

    int **tmp = realloc(a, 3 * sizeof(int *));

    if (tmp == NULL)
        return 1;

    a = tmp;

    a[2] = malloc(2 * sizeof(int));

    if (a[2] == NULL)
        return 1;

    a[2][0] = a[0][1] + a[1][0];
    a[2][1] = a[2][0] + a[1][1];

    int *row = a[0];
    a[0] = a[2];
    a[2] = row;

    printf("%d %d %d\n",
           a[0][1],
           a[1][0],
           a[2][1]);

    for (int i = 0; i < 3; i++)
        free(a[i]);

    free(a);

    return 0;
}
```

① `9 3 2`  
② `5 3 4`  
③ `9 4 2`  
④ `5 3 9`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>9 3 2</code></strong>입니다.</p>

### 1. 첫 번째 동적 할당

```c
int **a = malloc(2 * sizeof(int *));
```

이 코드는 정수 배열 두 행을 바로 만드는 것이 아닙니다.

먼저 **정수 포인터 2개를 저장할 배열**을 만듭니다.

```text
a
↓
+------+------+
| a[0] | a[1] |
+------+------+
```

### 2. 각 행 할당

반복문에서 각 포인터가 정수 2개짜리 공간을 가리키게 합니다.

초기값까지 대입한 후:

```text
a[0] → [1][2]
a[1] → [3][4]
```

입니다.

### 3. 포인터 배열 자체 확장

```c
int **tmp = realloc(a, 3 * sizeof(int *));
```

확장 대상은 각 행이 아니라 **행 주소를 저장하는 포인터 배열**입니다.

성공 후:

```c
a = tmp;
```

를 실행합니다.

기존의:

```text
a[0] → [1][2]
a[1] → [3][4]
```

라는 행 포인터 값은 새 포인터 배열에 보존됩니다.

새로 생긴 `a[2]`에는 아직 유효한 행 주소가 없습니다.

### 4. 세 번째 행 생성

```c
a[2] = malloc(2 * sizeof(int));
```

따라서:

```text
a[2] → [ ? ][ ? ]
```

가 됩니다.

### 5. 세 번째 행 첫 번째 값

```c
a[2][0] = a[0][1] + a[1][0];
```

현재:

```text
a[0][1] = 2
a[1][0] = 3
```

따라서:

```text
a[2][0] = 2 + 3 = 5
```

### 6. 세 번째 행 두 번째 값

```c
a[2][1] = a[2][0] + a[1][1];
```

현재:

```text
a[2][0] = 5
a[1][1] = 4
```

따라서:

```text
a[2][1] = 5 + 4 = 9
```

현재 상태:

```text
a[0] → [1][2]
a[1] → [3][4]
a[2] → [5][9]
```

### 7. 행 포인터 교환

```c
int *row = a[0];
a[0] = a[2];
a[2] = row;
```

행의 실제 정수 값을 하나씩 복사하는 것이 아닙니다.

행 시작 주소를 교환합니다.

결과:

```text
a[0] → [5][9]
a[1] → [3][4]
a[2] → [1][2]
```

### 8. 최종 출력

```text
a[0][1] = 9
a[1][0] = 3
a[2][1] = 2
```

따라서:

```text
9 3 2
```

### 반드시 알아야 할 개념

`int **` 방식의 동적 2차원 배열에서는:

```text
포인터 배열
+
각 행의 실제 데이터
```

가 별도의 동적 메모리일 수 있습니다.

이번 `realloc`은 행 데이터가 아니라 **행 포인터 배열만 확장**합니다.

### 자주 하는 실수

`realloc(a, ...)`를 실행하면 각 행의 정수 배열까지 새로 재할당된다고 생각하면 안 됩니다.

`a[0]`, `a[1]`이 가리키는 개별 행 메모리는 별도의 `malloc`으로 만들어졌습니다.

</details>

## 문제 2. realloc과 구조체 내부 포인터

다음 코드에 대한 설명으로 가장 옳은 것은 무엇입니까?

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int value;
    int *ref;
} Item;

int main(void)
{
    Item *a = malloc(2 * sizeof(Item));

    if (a == NULL)
        return 1;

    a[0].value = 10;
    a[1].value = 20;

    a[0].ref = &a[1].value;

    Item *tmp = realloc(a, 3 * sizeof(Item));

    if (tmp == NULL) {
        free(a);
        return 1;
    }

    a = tmp;

    a[2].value = 30;

    printf("%d\n", *a[0].ref);

    free(a);

    return 0;
}
```

① 항상 `20`을 출력한다.  
② `realloc`이 메모리를 이동했다면 `a[0].ref`가 이전 메모리를 가리킬 수 있어 안전하지 않다.  
③ `realloc`은 구조체 내부 포인터도 자동으로 새 주소로 수정한다.  
④ `a[0].ref`는 `realloc` 이후 자동으로 `NULL`이 된다.

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>②</strong>입니다.</p>

### 1. 초기 동적 구조체 배열

```c
Item *a = malloc(2 * sizeof(Item));
```

두 개의 `Item`이 연속된 메모리에 만들어집니다.

값을 대입한 뒤:

```text
a[0].value = 10
a[1].value = 20
```

입니다.

### 2. 구조체 내부 포인터 설정

```c
a[0].ref = &a[1].value;
```

따라서:

```text
a[0].ref → a[1].value → 20
```

입니다.

여기서 `ref`가 가리키는 주소는 같은 동적 메모리 블록 **내부의 주소**입니다.

### 3. realloc 호출

```c
Item *tmp = realloc(a, 3 * sizeof(Item));
```

`realloc`은 기존 위치에서 메모리를 확장할 수 있으면 같은 주소를 사용할 수 있습니다.

하지만 공간이 부족하면 새로운 위치에 더 큰 블록을 만들고 기존 내용을 옮길 수도 있습니다.

### 4. 메모리가 이동한 경우

예를 들어 기존 구조가:

```text
기존 주소
[a[0]][a[1]]
```

였는데 새 블록으로 이동하면:

```text
새 주소
[a[0]][a[1]][a[2]]
```

가 됩니다.

`value`, `ref` 같은 구조체 멤버 값 자체는 복사됩니다.

문제는 `ref` 안에 저장된 주소입니다.

```text
a[0].ref = 예전 &a[1].value 주소
```

라는 숫자값까지 자동으로 새 내부 주소로 변환되는 것은 아닙니다.

### 5. 이후 대입

```c
a = tmp;
```

를 통해 `a`는 새 블록을 가리키게 됩니다.

하지만 구조체 내부에 저장되어 있던 `ref`가 자동으로:

```text
새 &a[1].value
```

를 가리키게 되는 것은 아닙니다.

### 6. 출력문의 위험성

```c
*a[0].ref
```

는 `realloc`이 블록을 이동시켰다면 이미 유효하지 않은 이전 블록 내부 주소를 역참조할 수 있습니다.

따라서:

```text
항상 20
```

이라고 보장할 수 없습니다.

### 반드시 알아야 할 개념

`realloc`을 사용할 때 특히 주의해야 하는 것은 **동적 블록 내부를 가리키는 별도 포인터**입니다.

배열의 시작 포인터만 새 주소로 갱신해도 내부 주소를 따로 저장한 포인터는 자동으로 갱신되지 않습니다.

### 안전하게 처리하려면

재할당 후 다시 내부 주소를 설정하는 방법을 사용할 수 있습니다.

```c
a[0].ref = &a[1].value;
```

처럼 새 배열 기준으로 주소를 다시 계산합니다.

### 자주 하는 실수

`realloc`이 구조체 전체를 복사하므로 내부 포인터도 알아서 올바른 위치를 가리킬 것이라고 생각하면 안 됩니다.

포인터에 저장된 것은 **주소값**입니다.

</details>

## 문제 3. 연결 리스트 중간 삽입

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

typedef struct Node {
    int value;
    struct Node *next;
} Node;

void insert_after(Node *pos, Node *new_node)
{
    new_node->next = pos->next;
    pos->next = new_node;
}

int main(void)
{
    Node n3 = {30, NULL};
    Node n2 = {20, &n3};
    Node n1 = {10, &n2};

    Node n4 = {15, NULL};

    insert_after(&n1, &n4);

    Node *p = n1.next;

    p->value += p->next->value / 10;

    printf("%d %d %d %d\n",
           n1.value,
           n4.value,
           n2.value,
           n3.value);

    return 0;
}
```

① `10 17 20 30`  
② `10 15 22 30`  
③ `10 17 22 30`  
④ `15 17 20 30`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>10 17 20 30</code></strong>입니다.</p>

### 1. 삽입 전 연결 구조

```text
n1(10) → n2(20) → n3(30) → NULL
```

새 노드:

```text
n4(15) → NULL
```

### 2. 함수 호출

```c
insert_after(&n1, &n4);
```

함수 내부:

```text
pos      → n1
new_node → n4
```

### 3. 새 노드의 next 설정

```c
new_node->next = pos->next;
```

현재:

```text
pos->next → n2
```

따라서:

```text
n4.next → n2
```

이 됩니다.

중간 상태:

```text
n4(15) → n2(20) → n3(30)
```

### 4. 기존 노드의 next 변경

```c
pos->next = new_node;
```

따라서:

```text
n1.next → n4
```

최종 연결:

```text
n1(10) → n4(15) → n2(20) → n3(30) → NULL
```

### 5. 포인터 p 설정

```c
Node *p = n1.next;
```

현재 `n1.next`는 `n4`입니다.

```text
p → n4
```

### 6. n4의 값 변경

```c
p->value += p->next->value / 10;
```

현재:

```text
p->value       = n4.value = 15
p->next->value = n2.value = 20
```

정수 나눗셈:

```text
20 / 10 = 2
```

따라서:

```text
n4.value = 15 + 2 = 17
```

### 7. 최종 출력

```text
n1.value = 10
n4.value = 17
n2.value = 20
n3.value = 30
```

따라서:

```text
10 17 20 30
```

### 반드시 알아야 할 개념

단일 연결 리스트에서 중간 삽입은 보통 다음 순서로 합니다.

```text
1. 새 노드가 기존 다음 노드를 가리킨다.
2. 기존 노드가 새 노드를 가리킨다.
```

이 순서를 사용하면 기존 연결 주소를 잃지 않습니다.

### 자주 하는 실수

먼저:

```c
pos->next = new_node;
```

를 실행한 뒤 기존 다음 노드를 찾으려고 하면 원래 `n2` 주소를 잃을 수 있습니다.

</details>

## 문제 4. 이중 포인터를 이용한 연결 리스트 삭제

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

typedef struct Node {
    int value;
    struct Node *next;
} Node;

void remove_value(Node **head, int target)
{
    Node **cur = head;

    while (*cur != NULL && (*cur)->value != target)
        cur = &(*cur)->next;

    if (*cur != NULL)
        *cur = (*cur)->next;
}

int main(void)
{
    Node n4 = {40, NULL};
    Node n3 = {30, &n4};
    Node n2 = {20, &n3};
    Node n1 = {10, &n2};

    Node *head = &n1;

    remove_value(&head, 20);

    printf("%d %d %d\n",
           head->value,
           head->next->value,
           n2.value);

    return 0;
}
```

① `10 30 20`  
② `10 20 30`  
③ `30 40 20`  
④ `10 40 20`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>10 30 20</code></strong>입니다.</p>

### 1. 실행 전 연결 구조

```text
head → n1(10) → n2(20) → n3(30) → n4(40) → NULL
```

### 2. 이중 포인터 cur

```c
Node **cur = head;
```

함수의 매개변수 `head`는 `main`의 `head` 변수 주소를 받았습니다.

따라서 처음에는:

```text
cur
↓
main의 head
↓
n1
```

입니다.

### 3. 첫 번째 while 검사

현재:

```text
(*cur)->value = n1.value = 10
```

목표는 20이므로 계속합니다.

```c
cur = &(*cur)->next;
```

`(*cur)->next`는 `n1.next`입니다.

따라서 이제:

```text
cur → n1.next
```

입니다.

`n1.next` 안에는 `n2`의 주소가 저장되어 있습니다.

### 4. 두 번째 while 검사

현재:

```text
*cur → n2
(*cur)->value = 20
```

목표값과 같으므로 반복을 종료합니다.

### 5. 삭제 처리

```c
*cur = (*cur)->next;
```

현재 `*cur`는 `n2`입니다.

```text
(*cur)->next → n3
```

따라서 실제로는:

```text
n1.next = &n3
```

이 됩니다.

새 연결 구조:

```text
head → n1(10) → n3(30) → n4(40) → NULL
```

`n2` 객체 자체는 여전히 존재하지만 리스트 연결에서 제외되었습니다.

### 6. 최종 출력

```text
head->value       = 10
head->next->value = 30
n2.value          = 20
```

따라서:

```text
10 30 20
```

### 반드시 알아야 할 개념

`Node **cur`를 사용하면 현재 노드를 가리키는 **포인터 변수 자체의 주소**를 추적할 수 있습니다.

이 방식은 첫 노드 삭제와 중간 노드 삭제를 거의 같은 코드로 처리할 수 있다는 장점이 있습니다.

### 자주 하는 실수

노드가 리스트에서 빠졌다고 해서 `n2` 객체 자체가 자동으로 삭제되는 것은 아닙니다.

이번 문제의 노드는 지역 변수이므로 `n2.value`는 여전히 20입니다.

</details>

## 문제 5. 재귀와 연결 리스트 값 변경

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

typedef struct Node {
    int value;
    struct Node *next;
} Node;

int process(Node *p)
{
    if (p == NULL)
        return 0;

    int tail = process(p->next);

    p->value += tail % 10;

    return p->value + tail;
}

int main(void)
{
    Node n3 = {3, NULL};
    Node n2 = {2, &n3};
    Node n1 = {1, &n2};

    int result = process(&n1);

    printf("%d %d %d %d\n",
           result,
           n1.value,
           n2.value,
           n3.value);

    return 0;
}
```

① `17 9 5 3`  
② `14 6 5 3`  
③ `17 1 5 3`  
④ `11 4 4 3`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>17 9 5 3</code></strong>입니다.</p>

### 1. 실행 전 연결 구조

```text
n1(1) → n2(2) → n3(3) → NULL
```

함수는 먼저 다음 노드로 재귀 호출한 뒤 **되돌아오는 과정에서** 값을 변경합니다.

### 2. 재귀가 내려가는 과정

첫 호출:

```text
process(n1)
```

안에서 먼저:

```text
process(n2)
```

를 호출합니다.

그 안에서:

```text
process(n3)
```

를 호출합니다.

그 안에서:

```text
process(NULL)
```

을 호출합니다.

### 3. 종료 조건

```c
if (p == NULL)
    return 0;
```

따라서:

```text
process(NULL) = 0
```

입니다.

### 4. n3 처리

`n3` 호출로 돌아옵니다.

```text
tail = 0
```

다음:

```c
p->value += tail % 10;
```

따라서:

```text
n3.value = 3 + 0 = 3
```

반환값:

```text
3 + 0 = 3
```

즉:

```text
process(n3) = 3
```

### 5. n2 처리

이제 `n2` 호출로 돌아옵니다.

```text
tail = 3
```

값 변경:

```text
n2.value = 2 + (3 % 10)
         = 2 + 3
         = 5
```

반환값:

```text
5 + 3 = 8
```

따라서:

```text
process(n2) = 8
```

### 6. n1 처리

마지막으로 `n1` 호출로 돌아옵니다.

```text
tail = 8
```

값 변경:

```text
n1.value = 1 + (8 % 10)
         = 9
```

반환값:

```text
9 + 8 = 17
```

### 7. 최종 상태

```text
result   = 17
n1.value = 9
n2.value = 5
n3.value = 3
```

최종 출력:

```text
17 9 5 3
```

### 반드시 알아야 할 개념

재귀 함수는 **호출이 내려가는 순서**와 **반환되며 실행되는 순서**가 다를 수 있습니다.

이번 코드에서 값 변경 코드는:

```c
int tail = process(p->next);

p->value += tail % 10;
```

처럼 재귀 호출 뒤에 있습니다.

따라서 실제 값 변경 순서는:

```text
n3 → n2 → n1
```

입니다.

### 자주 하는 실수

코드가 `n1`에서 시작한다고 해서 `n1`의 값이 먼저 변경된다고 생각하면 안 됩니다.

재귀 호출이 먼저 끝난 뒤에 현재 노드의 값이 변경됩니다.

</details>

## 문제 6. 함수 포인터 배열 일부 적용

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

int add2(int x)
{
    return x + 2;
}

int twice(int x)
{
    return x * 2;
}

int sub3(int x)
{
    return x - 3;
}

int apply_chain(int x, int (**ops)(int), int n)
{
    for (int i = 0; i < n; i++)
        x = ops[i](x);

    return x;
}

int main(void)
{
    int (*ops[3])(int) = {
        add2,
        twice,
        sub3
    };

    int a = apply_chain(5, ops + 1, 2);
    int b = apply_chain(a, ops, 2);

    printf("%d %d\n", a, b);

    return 0;
}
```

① `7 18`  
② `7 14`  
③ `9 18`  
④ `10 24`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>7 18</code></strong>입니다.</p>

### 1. 함수 포인터 배열 구성

```text
ops[0] → add2
ops[1] → twice
ops[2] → sub3
```

### 2. 첫 번째 호출의 시작 위치

```c
apply_chain(5, ops + 1, 2);
```

`ops + 1`은 함수 포인터 배열의 두 번째 원소 위치입니다.

함수 내부에서는:

```text
ops[0] → 원본 ops[1] → twice
ops[1] → 원본 ops[2] → sub3
```

처럼 보입니다.

### 3. 첫 번째 호출 첫 연산

초기값:

```text
x = 5
```

첫 함수:

```text
twice(5) = 10
```

따라서:

```text
x = 10
```

### 4. 첫 번째 호출 두 번째 연산

다음 함수는 `sub3`입니다.

```text
sub3(10) = 7
```

따라서:

```text
a = 7
```

### 5. 두 번째 apply_chain 호출

```c
apply_chain(a, ops, 2);
```

현재:

```text
a = 7
```

이번에는 배열 처음부터 함수 2개를 사용합니다.

```text
ops[0] → add2
ops[1] → twice
```

### 6. add2 적용

```text
add2(7) = 9
```

### 7. twice 적용

```text
twice(9) = 18
```

따라서:

```text
b = 18
```

### 8. 최종 출력

```text
7 18
```

### 반드시 알아야 할 개념

함수 포인터 배열도 일반 배열처럼 시작 주소를 중간으로 이동시킬 수 있습니다.

```c
ops + 1
```

을 전달하면 함수 내부의 `ops[0]`이 원본의 `ops[1]`을 의미합니다.

### 자주 하는 실수

첫 번째 호출에서 `add2`부터 실행한다고 생각하면 안 됩니다.

시작 주소가 `ops + 1`이므로 `twice`부터 실행합니다.

</details>

## 문제 7. 문자 포인터 배열 원소 자체 변경

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

int main(void)
{
    char a[] = "ABCD";
    char b[] = "WXYZ";

    char *s[] = {a, b};

    char **p = s;

    (*p)++;

    p++;

    (*p)[1] = 'Q';

    printf("%s %s %c\n",
           s[0],
           s[1],
           a[0]);

    return 0;
}
```

① `BCD WQYZ A`  
② `ABCD WQYZ A`  
③ `BCD WXYZ B`  
④ `BCD WQYZ B`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>BCD WQYZ A</code></strong>입니다.</p>

### 1. 실행 전 문자열 배열

문자 배열:

```text
a = "ABCD"
b = "WXYZ"
```

문자 포인터 배열:

```text
s[0] → a[0] → "ABCD"
s[1] → b[0] → "WXYZ"
```

포인터:

```text
p → s[0]
```

### 2. 첫 번째 코드 실행

```c
(*p)++;
```

현재:

```text
p → s[0]
*p = s[0]
```

따라서 `(*p)++`는 문자값을 증가시키는 것이 아니라 **s[0]에 저장된 문자 포인터를 한 칸 이동**시킵니다.

원래:

```text
s[0] → a[0] → 'A'
```

였지만 실행 후:

```text
s[0] → a[1] → 'B'
```

가 됩니다.

따라서 `%s`로 `s[0]`을 출력하면:

```text
BCD
```

가 됩니다.

중요한 점은 실제 배열 `a`의 내용은 바뀌지 않았다는 것입니다.

```text
a = "ABCD"
```

는 그대로입니다.

### 3. p 자체 이동

```c
p++;
```

현재 `p`는 `s[0]`을 가리키고 있었습니다.

한 칸 이동하면:

```text
p → s[1]
```

입니다.

### 4. 두 번째 문자열 변경

```c
(*p)[1] = 'Q';
```

현재:

```text
*p = s[1] → b
```

따라서:

```text
(*p)[1] = b[1]
```

입니다.

원래:

```text
b = W X Y Z
```

이므로 `b[1]`의 `X`가 `Q`로 바뀝니다.

```text
b = "WQYZ"
```

### 5. 최종 출력

첫 번째:

```text
s[0] → a[1]
```

따라서:

```text
BCD
```

두 번째:

```text
s[1] → b[0]
```

따라서:

```text
WQYZ
```

세 번째:

```text
a[0] = 'A'
```

따라서 최종 출력:

```text
BCD WQYZ A
```

### 반드시 알아야 할 개념

다음 두 표현은 다릅니다.

```c
(*p)++
```

는 `p`가 가리키는 **포인터 값**을 증가시킵니다.

반면:

```c
(**p)++
```

라면 그 포인터가 가리키는 문자 값을 증가시킵니다.

### 자주 하는 실수

`s[0]`이 `a + 1`로 바뀌었다고 해서 `a[0]` 문자가 사라지는 것은 아닙니다.

문자 배열 자체는 그대로이고 **문자열을 보기 시작하는 주소만 바뀐 것**입니다.

</details>

## 문제 8. 함수 매개변수 배열과 sizeof

다음 코드에 대한 설명으로 가장 옳은 것은 무엇입니까?

```c
#include <stdio.h>

size_t count(int a[])
{
    return sizeof(a) / sizeof(a[0]);
}

int main(void)
{
    int x[] = {10, 20, 30, 40, 50};

    printf("%zu\n", count(x));

    return 0;
}
```

① 항상 `5`를 출력한다.  
② 함수 매개변수의 `a`는 포인터로 조정되므로 이 방법으로 원본 배열 길이를 구할 수 없다.  
③ `sizeof(a)`는 함수 안에서도 배열 전체 크기를 반환한다.  
④ 배열을 함수에 전달하면 배열 전체가 복사되므로 `sizeof(a)`는 20이다.

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>②</strong>입니다.</p>

### 1. main에서의 배열

```c
int x[] = {10, 20, 30, 40, 50};
```

`main` 안에서 직접:

```c
sizeof(x)
```

를 사용한다면 배열 전체 크기를 구할 수 있습니다.

정수가 4바이트인 환경을 예로 들면:

```text
5 × 4 = 20바이트
```

입니다.

### 2. 함수 매개변수 선언

```c
size_t count(int a[])
```

겉으로는 배열처럼 보이지만 함수 매개변수에서는 다음과 같이 조정됩니다.

```c
size_t count(int *a)
```

즉 함수 안의 `a`는 배열 자체가 아니라 **포인터 변수**입니다.

### 3. sizeof(a)

따라서:

```c
sizeof(a)
```

는 원본 배열 전체 크기가 아니라 포인터 크기를 구합니다.

포인터 크기는 실행 환경에 따라 달라질 수 있습니다.

### 4. sizeof(a[0])

```c
sizeof(a[0])
```

는 정수 하나의 크기입니다.

따라서:

```c
sizeof(a) / sizeof(a[0])
```

는 원본 배열 원소 개수 5를 의미하지 않습니다.

### 5. 왜 항상 결과를 정할 수 없는가

예를 들어:

```text
포인터 크기 = 8
int 크기    = 4
```

인 환경이라면 결과가 2가 될 수 있습니다.

다른 환경에서는 다른 값이 될 수 있습니다.

따라서 배열 길이를 구하는 코드로 사용할 수 없습니다.

### 안전한 방법

배열 길이를 함수에 따로 전달합니다.

```c
void func(int *a, size_t n)
```

처럼 사용합니다.

### 반드시 알아야 할 개념

함수 매개변수에서:

```c
int a[]
```

와:

```c
int *a
```

는 배열 인자를 받을 때 같은 방식으로 처리됩니다.

### 자주 하는 실수

다음 공식을 무조건 사용할 수 있다고 생각하면 안 됩니다.

```c
sizeof(a) / sizeof(a[0])
```

이 공식은 **실제 배열 객체가 보이는 범위**에서 사용할 때 의미가 있습니다.

</details>

## 문제 9. memmove와 겹치는 문자열 이동

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>
#include <string.h>

int main(void)
{
    char s[10] = "ABCDE";

    memmove(s + 2, s, 4);

    s[1] = 'X';

    printf("%s %c\n", s, s[4]);

    return 0;
}
```

① `AXABCD C`  
② `AXABCDE C`  
③ `AXABCD D`  
④ `ABABCD C`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>AXABCD C</code></strong>입니다.</p>

### 1. 실행 전 문자 배열

`char s[10] = "ABCDE";`이므로 초기 내용은 다음과 같습니다.

```text
인덱스   0   1   2   3   4   5   6 ...
문자     A   B   C   D   E  \0  \0 ...
```

배열 크기가 문자열보다 크므로 뒤쪽 공간은 0으로 초기화됩니다.

### 2. memmove 실행

```c
memmove(s + 2, s, 4);
```

원본 4바이트:

```text
s[0] ~ s[3]
A B C D
```

를 목적지:

```text
s[2] ~ s[5]
```

로 복사합니다.

`memmove`는 영역이 겹쳐도 올바르게 복사되도록 처리합니다.

복사 후:

```text
인덱스   0   1   2   3   4   5   6
문자     A   B   A   B   C   D  \0
```

따라서 문자열은:

```text
ABABCD
```

입니다.

### 3. 문자 하나 변경

```c
s[1] = 'X';
```

따라서:

```text
A X A B C D \0
```

이 됩니다.

문자열:

```text
AXABCD
```

### 4. 두 번째 출력값

```c
s[4]
```

현재 인덱스 4는:

```text
C
```

입니다.

### 5. 최종 출력

```text
AXABCD C
```

### 반드시 알아야 할 개념

`memmove`는 원본과 목적지 영역이 겹쳐도 사용할 수 있습니다.

이번 문제는:

```text
원본     s[0] s[1] s[2] s[3]
목적지             s[2] s[3] s[4] s[5]
```

처럼 영역이 겹칩니다.

`memcpy`가 아니라 `memmove`를 사용한 이유입니다.

### 자주 하는 실수

복사 크기 4에 종료 문자 `\0`이 포함된다고 생각하면 안 됩니다.

원본 네 바이트는:

```text
A B C D
```

이고 종료 문자는 복사하지 않습니다.

다만 원래 배열의 `s[6]`이 0으로 초기화되어 있어 최종 문자열은 정상적으로 끝납니다.

</details>

## 문제 10. 구조체와 콜백 함수 종합

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

typedef struct {
    int value;
    int (*op)(int);
} Item;

int inc(int x)
{
    return x + 1;
}

int twice(int x)
{
    return x * 2;
}

void run(Item *p, int n)
{
    int acc = 0;

    for (int i = 0; i < n; i++) {
        p[i].value = p[i].op(p[i].value);

        acc += p[i].value;

        if (i + 1 < n)
            p[i + 1].value += acc % 4;
    }

    printf("%d\n", acc);
}

int main(void)
{
    Item a[3] = {
        {2, inc},
        {3, twice},
        {4, inc}
    };

    run(a, 3);

    printf("%d %d %d\n",
           a[0].value,
           a[1].value,
           a[2].value);

    return 0;
}
```

① 첫 줄 `23`, 둘째 줄 `3 12 8`  
② 첫 줄 `14`, 둘째 줄 `3 6 5`  
③ 첫 줄 `18`, 둘째 줄 `3 12 3`  
④ 첫 줄 `23`, 둘째 줄 `3 9 11`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>23 / 3 12 8</code></strong>입니다.</p>

### 1. 실행 전 상태

```text
a[0] = {value = 2, op → inc}
a[1] = {value = 3, op → twice}
a[2] = {value = 4, op → inc}
```

누적값:

```text
acc = 0
```

### 2. i = 0에서 콜백 실행

```c
p[0].value = p[0].op(p[0].value);
```

`p[0].op`은 `inc`입니다.

```text
inc(2) = 3
```

따라서:

```text
a[0].value = 3
```

### 3. 누적값 갱신

```c
acc += p[0].value;
```

따라서:

```text
acc = 0 + 3 = 3
```

### 4. 다음 원소 사전 변경

```c
p[1].value += acc % 4;
```

현재:

```text
acc % 4 = 3
```

따라서:

```text
a[1].value = 3 + 3 = 6
```

현재 상태:

```text
a[0] = 3
a[1] = 6
a[2] = 4
acc = 3
```

### 5. i = 1에서 콜백 실행

`a[1].op`은 `twice`입니다.

현재 `a[1].value`는 원래 3이 아니라 앞에서 변경된 6입니다.

```text
twice(6) = 12
```

따라서:

```text
a[1].value = 12
```

### 6. 누적값 갱신

```text
acc = 3 + 12 = 15
```

### 7. 다음 원소 변경

```text
acc % 4 = 15 % 4 = 3
```

따라서:

```text
a[2].value = 4 + 3 = 7
```

현재:

```text
a[0] = 3
a[1] = 12
a[2] = 7
acc = 15
```

### 8. i = 2에서 콜백 실행

`a[2].op`은 `inc`입니다.

현재 값은 7입니다.

```text
inc(7) = 8
```

따라서:

```text
a[2].value = 8
```

### 9. 마지막 누적값

```text
acc = 15 + 8 = 23
```

마지막 원소이므로 다음 원소 변경은 없습니다.

### 10. 함수 내부 출력

```c
printf("%d\n", acc);
```

첫 번째 출력 줄:

```text
23
```

### 11. main의 출력

최종 구조체 배열:

```text
a[0].value = 3
a[1].value = 12
a[2].value = 8
```

두 번째 출력 줄:

```text
3 12 8
```

### 반드시 알아야 할 개념

이 문제는 두 가지 상태가 동시에 누적됩니다.

```text
각 구조체의 value
acc 누적값
```

그리고 현재 반복의 `acc`가 **다음 구조체의 value를 미리 변경**합니다.

따라서 각 반복을 독립적으로 계산할 수 없습니다.

### 자주 하는 실수

`i = 1`에서 `twice(3)`을 계산하면 안 됩니다.

`i = 0` 단계에서 이미 `a[1].value`가 6으로 변경되었습니다.

</details>

## 잘 놓치는 핵심

### 1. int ** 동적 2차원 배열은 포인터 배열과 행 데이터가 분리될 수 있다

첫 번째 `malloc`과 각 행의 `malloc` 역할을 구분해야 합니다.

### 2. realloc은 내부 포인터까지 자동 수정하지 않는다

재할당되는 블록 내부 주소를 다른 포인터에 저장했다면 재할당 이후 다시 확인해야 합니다.

### 3. 연결 리스트 삽입은 기존 연결을 잃지 않는 순서가 중요하다

새 노드의 `next`를 먼저 설정한 뒤 이전 노드와 연결합니다.

### 4. 이중 포인터를 사용하면 현재 연결을 저장하는 포인터 자체를 수정할 수 있다

연결 리스트의 첫 노드 삭제와 중간 노드 삭제를 같은 방식으로 처리할 수 있습니다.

### 5. 재귀는 반환되는 순서까지 추적한다

재귀 호출 뒤에 있는 코드는 가장 깊은 호출부터 실행됩니다.

### 6. 함수 포인터 배열도 시작 위치를 이동시킬 수 있다

`ops + 1`처럼 배열 중간부터 콜백을 적용할 수 있습니다.

### 7. (*p)++와 (**p)++는 다르다

하나는 포인터 자체를 이동시키고 다른 하나는 실제 값을 증가시킵니다.

### 8. 함수 매개변수의 배열 표기는 실제 배열 객체가 아니다

함수 안에서 `sizeof`로 원본 배열 길이를 구할 수 없습니다.

### 9. memmove는 겹치는 메모리 영역을 처리할 수 있다

복사 바이트 수에 종료 문자가 포함되는지도 따로 확인해야 합니다.

### 10. 반복문의 앞 단계가 다음 구조체 값을 미리 바꿀 수 있다

항상 현재 메모리 상태를 갱신하면서 추적해야 합니다.

## 시험·면접에서 바로 보는 포인트

- 동적 2차원 배열에서 포인터 배열과 행 데이터의 할당을 분리해서 봅니다.
- `realloc` 전후로 블록 내부를 가리키는 포인터가 있는지 확인합니다.
- 연결 리스트 삽입은 기존 `next` 보존 여부를 확인합니다.
- 연결 리스트 삭제에서 `Node **`가 무엇을 가리키는지 단계별로 그립니다.
- 재귀는 내려가는 과정과 반환되는 과정을 분리합니다.
- 함수 포인터 배열은 원본 인덱스와 전달된 시작 주소를 구분합니다.
- 함수 매개변수의 `int a[]`는 `int *a`처럼 처리됩니다.
- `memmove` 문제에서는 복사 전후 인덱스를 직접 적습니다.
- 누적값이 다음 반복의 입력값을 변경하는지 확인합니다.

## 다음에 이을 글

세트 7에서는 **동적 연결 리스트의 실제 malloc/free, 더미 헤드 노드, 이중 연결 리스트, 포인터를 반환하는 콜백, 함수 포인터 테이블, 구조체 내부 동적 배열, 메모리 누수 판별**을 중심으로 더 복합적인 문제를 다룹니다.
