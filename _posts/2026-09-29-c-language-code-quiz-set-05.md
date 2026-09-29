---
title: C 언어 코드 추론 문제 세트 5
date: 2026-09-29 10:55:00 +0900
slug: c-language-code-quiz-set-05
permalink: /posts/c-language-code-quiz-set-05/
categories: [프로그래밍, C언어]
tags: [C언어, 코드추론, 이중포인터, 동적메모리, 연결리스트, 함수포인터, 콜백, 구조체]
math: true
---

이번 세트는 **동적 메모리와 포인터 구조를 실제 코드 흐름 속에서 추적하는 능력**을 집중적으로 다룹니다.

이중 포인터 기반 2차원 배열, 동적 문자열 배열, 콜백 함수, 자기참조 구조체, 연결 리스트, 함수 포인터 반환, 해제된 메모리 접근까지 포함합니다.

<blockquote class="prompt-info">
<p>한 줄: 포인터가 여러 단계로 연결된 상태에서 값과 주소가 어떻게 바뀌는지 추적하는 고난도 문제 10개입니다.</p>
</blockquote>

<details markdown="1">
<summary>풀이 방법</summary>

1. 동적 메모리는 각 `malloc`이 어떤 공간을 만드는지 따로 적습니다.
2. 이중 포인터는 `pp → p → 값`처럼 관계를 먼저 그립니다.
3. 연결 리스트는 각 노드의 `next`가 어디를 가리키는지 순서대로 표시합니다.
4. 함수 포인터는 먼저 어떤 함수와 연결되어 있는지 적습니다.
5. `free`가 등장하면 그 시점 이후 포인터가 유효한지 반드시 확인합니다.
6. 앞에서 바뀐 포인터와 값은 뒤 코드에서 변경된 상태로 사용합니다.

</details>

## 문제 1. 이중 포인터 기반 동적 2차원 배열

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
        a[i] = malloc(3 * sizeof(int));

        if (a[i] == NULL)
            return 1;
    }

    int value = 1;

    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 3; j++) {
            a[i][j] = value++;
        }
    }

    a[1][0] += a[0][2];
    a[0][1] = a[1][2] - a[0][0];

    printf("%d %d %d\n",
           a[0][1],
           a[1][0],
           a[1][2]);

    for (int i = 0; i < 2; i++)
        free(a[i]);

    free(a);

    return 0;
}
```

① `5 7 6`  
② `5 4 6`  
③ `6 7 5`  
④ `5 7 5`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>5 7 6</code></strong>입니다.</p>

### 1. 첫 번째 동적 할당

```c
int **a = malloc(2 * sizeof(int *));
```

이 코드는 정수 배열을 바로 만드는 것이 아닙니다.

먼저 **정수 포인터 2개를 저장할 공간**을 만듭니다.

개념적으로:

```text
a
↓
+------+------+
| a[0] | a[1] |
+------+------+
```

아직 `a[0]`, `a[1]`이 가리킬 정수 배열은 만들어지지 않았습니다.

### 2. 각 행 메모리 할당

반복문에서:

```c
a[i] = malloc(3 * sizeof(int));
```

를 실행합니다.

결과:

```text
a
↓
+------+------+
|  ↓   |  ↓   |
+------+------+
   |      |
   |      +→ [ ? ][ ? ][ ? ]
   |
   +--------→ [ ? ][ ? ][ ? ]
```

따라서 `a`는 포인터 2개를 가지고 있고 각 포인터가 정수 3개짜리 배열 하나씩을 가리킵니다.

### 3. 값 채우기

```c
int value = 1;
```

이후 중첩 반복문으로 값을 차례대로 넣습니다.

결과:

```text
a[0] = {1, 2, 3}
a[1] = {4, 5, 6}
```

### 4. 첫 번째 값 변경

```c
a[1][0] += a[0][2];
```

현재:

```text
a[1][0] = 4
a[0][2] = 3
```

따라서:

```text
a[1][0] = 4 + 3 = 7
```

현재 상태:

```text
a[0] = {1, 2, 3}
a[1] = {7, 5, 6}
```

### 5. 두 번째 값 변경

```c
a[0][1] = a[1][2] - a[0][0];
```

현재:

```text
a[1][2] = 6
a[0][0] = 1
```

따라서:

```text
a[0][1] = 6 - 1 = 5
```

최종 상태:

```text
a[0] = {1, 5, 3}
a[1] = {7, 5, 6}
```

### 6. 최종 출력

```text
a[0][1] = 5
a[1][0] = 7
a[1][2] = 6
```

따라서:

```text
5 7 6
```

### 반드시 알아야 할 개념

`int **a` 방식의 2차원 동적 배열은 보통 다음 두 단계로 만듭니다.

```text
1단계: 행 포인터 배열 생성
2단계: 각 행마다 실제 정수 배열 생성
```

따라서 각 행은 서로 다른 위치에 할당될 수 있습니다.

### 자주 하는 실수

`malloc(2 * sizeof(int *))`만 실행하면 정수 6개짜리 배열이 생긴다고 생각하면 안 됩니다.

첫 번째 할당은 **포인터 2개를 저장하는 공간**일 뿐입니다.

</details>

## 문제 2. 동적 문자열 배열과 포인터 교환

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void)
{
    char **s = malloc(3 * sizeof(char *));

    if (s == NULL)
        return 1;

    s[0] = malloc(6);
    s[1] = malloc(6);
    s[2] = malloc(6);

    strcpy(s[0], "APPLE");
    strcpy(s[1], "GRAPE");
    strcpy(s[2], "MANGO");

    char *tmp = s[0];
    s[0] = s[2];
    s[2] = tmp;

    s[1][1] = 'R';

    printf("%s %s %s\n",
           s[0],
           s[1],
           s[2]);

    free(s[0]);
    free(s[1]);
    free(s[2]);
    free(s);

    return 0;
}
```

① `MANGO GRAPE APPLE`  
② `APPLE GRAPE MANGO`  
③ `MANGO APPLE GRAPE`  
④ `GRAPE MANGO APPLE`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>MANGO GRAPE APPLE</code></strong>입니다.</p>

### 1. 포인터 배열 할당

```c
char **s = malloc(3 * sizeof(char *));
```

먼저 문자 포인터 3개를 저장할 공간을 만듭니다.

```text
s[0]
s[1]
s[2]
```

각 원소는 문자열 시작 주소를 저장할 수 있습니다.

### 2. 문자열 저장 공간 할당

```c
s[0] = malloc(6);
s[1] = malloc(6);
s[2] = malloc(6);
```

각 문자열은 문자 5개와 종료 문자 `\0`까지 총 6바이트가 필요합니다.

### 3. 문자열 복사 후 상태

```text
s[0] → "APPLE"
s[1] → "GRAPE"
s[2] → "MANGO"
```

### 4. 문자열 포인터 교환

```c
char *tmp = s[0];
s[0] = s[2];
s[2] = tmp;
```

여기서 문자열 내용 자체를 복사하지 않습니다.

문자열 시작 주소만 서로 교환합니다.

결과:

```text
s[0] → "MANGO"
s[1] → "GRAPE"
s[2] → "APPLE"
```

### 5. 두 번째 문자열 변경

```c
s[1][1] = 'R';
```

현재 `s[1]`은 `"GRAPE"`입니다.

인덱스:

```text
인덱스   0   1   2   3   4
문자     G   R   A   P   E
```

인덱스 1의 문자는 이미 `R`입니다.

따라서 이 코드는 결과적으로 문자열을 바꾸지 않습니다.

즉:

```text
s[1] = "GRAPE"
```

입니다.

### 6. 최종 출력

따라서 실제 출력은:

```text
MANGO GRAPE APPLE
```

입니다.

### 반드시 알아야 할 개념

포인터 배열에서 다음과 같은 교환:

```c
char *tmp = s[0];
s[0] = s[2];
s[2] = tmp;
```

은 문자열 데이터 자체를 이동하는 것이 아니라 **주소만 교환**합니다.

### 자주 하는 실수

문자열 `"GRAPE"`의 두 번째 문자가 `R`이므로:

```c
s[1][1] = 'R';
```

은 실제 값을 바꾸지 않습니다.

인덱스를 직접 확인해야 합니다.

</details>

## 문제 3. 콜백 함수와 배열 변환

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

int add2(int x)
{
    return x + 2;
}

int square(int x)
{
    return x * x;
}

void transform(int *a, int n, int (*f)(int))
{
    for (int i = 0; i < n; i++)
        a[i] = f(a[i]);
}

int main(void)
{
    int a[] = {1, 2, 3};

    transform(a, 3, add2);
    transform(a + 1, 2, square);

    printf("%d %d %d\n",
           a[0], a[1], a[2]);

    return 0;
}
```

① `3 16 25`  
② `9 16 25`  
③ `3 4 9`  
④ `3 8 10`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>3 16 25</code></strong>입니다.</p>

### 1. 실행 전 배열

```text
인덱스   0   1   2
값       1   2   3
```

### 2. 첫 번째 transform 호출

```c
transform(a, 3, add2);
```

여기서 콜백 함수는:

```text
f → add2
```

입니다.

각 원소에 `add2`를 적용합니다.

```text
a[0] = add2(1) = 3
a[1] = add2(2) = 4
a[2] = add2(3) = 5
```

현재 배열:

```text
3 4 5
```

### 3. 두 번째 transform 호출

```c
transform(a + 1, 2, square);
```

이번에는 시작 주소가 `a + 1`입니다.

따라서 함수 내부의 배열은 다음처럼 대응됩니다.

```text
함수 내부 a[0] → 원본 a[1]
함수 내부 a[1] → 원본 a[2]
```

콜백 함수는:

```text
f → square
```

입니다.

### 4. 첫 번째 원소 처리

```text
원본 a[1] = 4
```

따라서:

```text
square(4) = 16
```

### 5. 두 번째 원소 처리

```text
원본 a[2] = 5
```

따라서:

```text
square(5) = 25
```

### 6. 최종 배열

```text
a[0] = 3
a[1] = 16
a[2] = 25
```

최종 출력:

```text
3 16 25
```

### 반드시 알아야 할 개념

콜백 함수는 다른 함수에 전달되어 호출되는 함수입니다.

```c
int (*f)(int)
```

는 정수 하나를 받아 정수 하나를 반환하는 함수의 주소를 저장합니다.

또한 배열 시작 주소를 `a + 1`처럼 넘기면 배열 일부에만 함수를 적용할 수 있습니다.

### 자주 하는 실수

두 번째 `transform`에서도 처음 배열 `{1, 2, 3}`을 사용하면 안 됩니다.

첫 번째 호출이 끝난 뒤 배열은 이미 `{3, 4, 5}`로 변경되었습니다.

</details>

## 문제 4. 자기참조 구조체와 연결 리스트 이동

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

typedef struct Node {
    int value;
    struct Node *next;
} Node;

int main(void)
{
    Node n4 = {40, NULL};
    Node n3 = {30, &n4};
    Node n2 = {20, &n3};
    Node n1 = {10, &n2};

    Node *p = &n1;

    p = p->next;
    p->value += p->next->value / 10;
    p->next = p->next->next;

    printf("%d %d %d\n",
           n2.value,
           p->next->value,
           n3.value);

    return 0;
}
```

① `23 40 30`  
② `22 30 40`  
③ `23 30 40`  
④ `20 40 30`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>23 40 30</code></strong>입니다.</p>

### 1. 실행 전 연결 상태

```text
n1(10) → n2(20) → n3(30) → n4(40) → NULL
```

포인터:

```text
p → n1
```

### 2. 첫 번째 이동

```c
p = p->next;
```

따라서:

```text
p → n2
```

현재 연결 구조는 그대로입니다.

### 3. n2 값 변경

```c
p->value += p->next->value / 10;
```

현재:

```text
p->value = n2.value = 20
p->next->value = n3.value = 30
```

정수 나눗셈:

```text
30 / 10 = 3
```

따라서:

```text
n2.value = 20 + 3 = 23
```

### 4. 연결 구조 변경

```c
p->next = p->next->next;
```

현재:

```text
p → n2
p->next → n3
p->next->next → n4
```

따라서:

```text
n2.next = &n4
```

가 됩니다.

연결 리스트에서 `n3`이 건너뛰어집니다.

새 연결 구조:

```text
n1 → n2(23) → n4(40) → NULL
```

하지만 `n3` 객체 자체가 사라진 것은 아닙니다.

```text
n3.value = 30
```

은 그대로 존재합니다.

### 5. 출력값

첫 번째:

```text
n2.value = 23
```

두 번째:

```text
p->next->value = n4.value = 40
```

세 번째:

```text
n3.value = 30
```

따라서:

```text
23 40 30
```

### 반드시 알아야 할 개념

연결 리스트에서 `next`를 바꾸는 것은 노드 자체를 삭제하는 것과 다릅니다.

이번 문제에서 `n3`은 리스트 연결에서 제외되었지만 변수 자체는 여전히 존재합니다.

### 자주 하는 실수

`n2.next`가 `n4`로 바뀌었다고 해서 `n3.value`까지 사라졌다고 생각하면 안 됩니다.

</details>

## 문제 5. 이중 포인터로 연결 리스트 첫 노드 제거

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

typedef struct Node {
    int value;
    struct Node *next;
} Node;

void remove_first(Node **head)
{
    if (*head != NULL)
        *head = (*head)->next;
}

int main(void)
{
    Node n3 = {30, NULL};
    Node n2 = {20, &n3};
    Node n1 = {10, &n2};

    Node *head = &n1;

    remove_first(&head);

    head->value += head->next->value / 10;

    printf("%d %d %d\n",
           head->value,
           head->next->value,
           n1.value);

    return 0;
}
```

① `23 30 10`  
② `20 30 10`  
③ `23 30 20`  
④ `13 20 10`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>23 30 10</code></strong>입니다.</p>

### 1. 실행 전 연결 리스트

```text
head → n1(10) → n2(20) → n3(30) → NULL
```

### 2. 함수 호출

```c
remove_first(&head);
```

함수는 `head` 포인터 변수 자체를 바꿔야 하므로 이중 포인터를 받습니다.

함수 내부:

```text
head → main의 head 변수
*head → n1
```

### 3. 첫 노드 건너뛰기

```c
*head = (*head)->next;
```

현재:

```text
*head → n1
(*head)->next → n2
```

따라서:

```text
main의 head → n2
```

가 됩니다.

새 연결 시작점:

```text
head → n2(20) → n3(30) → NULL
```

`n1` 변수 자체는 여전히 존재합니다.

### 4. 값 변경

```c
head->value += head->next->value / 10;
```

현재:

```text
head->value = n2.value = 20
head->next->value = n3.value = 30
```

따라서:

```text
30 / 10 = 3
```

```text
n2.value = 20 + 3 = 23
```

### 5. 최종 출력

```text
head->value = 23
head->next->value = 30
n1.value = 10
```

따라서:

```text
23 30 10
```

### 반드시 알아야 할 개념

함수 안에서 연결 리스트의 시작 포인터 자체를 변경하려면:

```c
Node **head
```

형태가 필요합니다.

일반 `Node *head`만 받으면 함수 내부의 복사된 포인터만 변경됩니다.

### 자주 하는 실수

리스트의 첫 노드가 제거되었다고 해서 `n1` 객체 자체가 사라진 것은 아닙니다.

단지 `head`가 더 이상 `n1`을 가리키지 않을 뿐입니다.

</details>

## 문제 6. 함수 포인터를 반환하는 함수

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

int add3(int x)
{
    return x + 3;
}

int mul3(int x)
{
    return x * 3;
}

int (*choose(int mode))(int)
{
    if (mode == 0)
        return add3;

    return mul3;
}

int main(void)
{
    int (*f)(int) = choose(0);
    int a = f(4);

    f = choose(1);
    int b = f(a);

    printf("%d %d\n", a, b);

    return 0;
}
```

① `7 21`  
② `12 21`  
③ `7 12`  
④ `4 21`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>7 21</code></strong>입니다.</p>

### 1. choose 함수의 반환형

선언:

```c
int (*choose(int mode))(int)
```

처음 보면 복잡하지만 단계별로 보면:

```text
choose는 함수
→ int mode를 입력받음
→ 함수 포인터를 반환함
```

반환되는 함수는:

```text
정수 하나를 받아 정수 하나를 반환하는 함수
```

입니다.

### 2. 첫 번째 함수 선택

```c
int (*f)(int) = choose(0);
```

`mode == 0`이므로:

```text
f → add3
```

### 3. 첫 번째 호출

```c
int a = f(4);
```

즉:

```text
add3(4) = 7
```

따라서:

```text
a = 7
```

### 4. 두 번째 함수 선택

```c
f = choose(1);
```

이번에는 `mode != 0`이므로:

```text
f → mul3
```

### 5. 두 번째 호출

```c
int b = f(a);
```

현재:

```text
a = 7
```

따라서:

```text
mul3(7) = 21
```

```text
b = 21
```

### 6. 최종 출력

```text
7 21
```

### 반드시 알아야 할 개념

C에서는 함수 포인터를 반환하는 함수도 만들 수 있습니다.

복잡한 선언은 이름부터 읽습니다.

```c
choose(int mode)
```

가 함수라는 것을 먼저 확인한 뒤 바깥쪽 `(* ... )(int)`를 해석합니다.

### 자주 하는 실수

`choose`가 직접 계산 결과를 반환한다고 생각하면 안 됩니다.

반환값은 정수가 아니라 **함수의 주소**입니다.

</details>

## 문제 7. 메모리 해제 후 접근

다음 코드에 대한 설명으로 가장 옳은 것은 무엇입니까?

```c
#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int *p = malloc(3 * sizeof(int));

    if (p == NULL)
        return 1;

    p[0] = 10;
    p[1] = 20;
    p[2] = 30;

    int *q = p + 1;

    free(p);

    printf("%d\n", *q);

    return 0;
}
```

① 항상 `20`을 출력한다.  
② `q`가 가리키는 값만 남으므로 안전하다.  
③ `free` 이후 해제된 메모리를 접근하므로 올바르지 않다.  
④ `free(p)`를 실행하면 `q`는 자동으로 `NULL`이 된다.

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>③</strong>입니다.</p>

### 1. 동적 메모리 할당 후 상태

```text
p → [10][20][30]
```

### 2. 보조 포인터 생성

```c
int *q = p + 1;
```

따라서:

```text
p → p[0] = 10
q → p[1] = 20
```

두 포인터 모두 같은 동적 메모리 블록 안을 가리킵니다.

### 3. 메모리 해제

```c
free(p);
```

이 순간 `p`가 가리키던 전체 동적 메모리 블록의 사용이 종료됩니다.

즉:

```text
[10][20][30]
```

전체가 더 이상 프로그램이 유효하게 접근할 수 있는 메모리가 아닙니다.

### 4. q는 어떻게 되는가

`q` 변수 자체의 비트 값이 자동으로 바뀌는 것은 아닙니다.

따라서 `q`에 어떤 주소값이 남아 있을 수 있습니다.

하지만 그 주소는 이미 해제된 메모리를 가리킵니다.

이런 포인터를 흔히 **댕글링 포인터**라고 부릅니다.

### 5. 잘못된 접근

```c
printf("%d\n", *q);
```

은 이미 해제된 메모리를 역참조합니다.

따라서 결과를 보장할 수 없습니다.

### 반드시 알아야 할 개념

`free`는 메모리를 해제하지만 해당 메모리를 가리키던 모든 포인터를 자동으로 `NULL`로 바꾸지 않습니다.

여러 포인터가 같은 메모리를 가리키고 있었다면 모두 더 이상 안전하게 역참조할 수 없습니다.

### 자주 하는 실수

`q`가 `p + 1`이므로 별도의 메모리를 가리킨다고 생각하면 안 됩니다.

둘 다 같은 할당 블록 내부를 가리킵니다.

</details>

## 문제 8. realloc과 기존 포인터의 위험성

다음 코드에 대한 설명으로 가장 옳은 것은 무엇입니까?

```c
#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int *p = malloc(2 * sizeof(int));

    if (p == NULL)
        return 1;

    p[0] = 10;
    p[1] = 20;

    int *q = p;

    int *tmp = realloc(p, 4 * sizeof(int));

    if (tmp == NULL) {
        free(p);
        return 1;
    }

    p = tmp;

    p[2] = 30;
    p[3] = 40;

    printf("%d %d\n", p[1], q[1]);

    free(p);

    return 0;
}
```

① 항상 `20 20`을 출력한다.  
② `realloc`이 메모리를 이동했다면 `q`는 더 이상 유효하지 않을 수 있다.  
③ `q`는 자동으로 새 주소로 갱신된다.  
④ `realloc`은 절대 기존 주소를 변경하지 않는다.

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>②</strong>입니다.</p>

### 1. 초기 할당

```text
p → [10][20]
q → [10][20]
```

`q = p`이므로 두 포인터가 같은 동적 메모리를 가리킵니다.

### 2. realloc 호출

```c
int *tmp = realloc(p, 4 * sizeof(int));
```

`realloc`은 두 가지 방식으로 성공할 수 있습니다.

첫째, 기존 메모리 뒤에 충분한 공간이 있으면 같은 주소를 유지할 수 있습니다.

둘째, 기존 위치에서 확장이 불가능하면 더 큰 새 메모리 블록을 확보하고 기존 내용을 옮길 수 있습니다.

### 3. 메모리가 이동한 경우

만약 새 주소가 만들어졌다면:

```text
tmp → 새 메모리
```

가 됩니다.

기존 `p`가 가리키던 블록은 더 이상 유효하지 않습니다.

이후:

```c
p = tmp;
```

로 `p`는 새 메모리를 가리킵니다.

하지만:

```text
q
```

는 자동으로 변경되지 않습니다.

따라서 `q`가 이전 주소를 그대로 가지고 있다면 더 이상 유효하지 않을 수 있습니다.

### 4. 출력문 문제

```c
printf("%d %d\n", p[1], q[1]);
```

`p[1]`은 새 메모리에서 안전하게 읽을 수 있습니다.

하지만 `q[1]`은 `realloc`이 메모리를 이동했는지에 따라 안전하지 않을 수 있습니다.

따라서 항상 `20 20`이라고 단정할 수 없습니다.

### 반드시 알아야 할 개념

`realloc`은 성공하더라도 주소가 바뀔 수 있습니다.

따라서 기존 메모리 내부를 가리키던 다른 포인터가 있다면 재할당 이후 더 이상 유효하지 않을 수 있습니다.

### 자주 하는 실수

`p = tmp`를 했으니 다른 포인터 `q`도 자동으로 새 주소를 가리킨다고 생각하면 안 됩니다.

각 포인터 변수는 독립적으로 주소값을 저장합니다.

</details>

## 문제 9. 연결 리스트 순서 뒤집기

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

typedef struct Node {
    int value;
    struct Node *next;
} Node;

Node *reverse(Node *head)
{
    Node *prev = NULL;

    while (head != NULL) {
        Node *next = head->next;
        head->next = prev;
        prev = head;
        head = next;
    }

    return prev;
}

int main(void)
{
    Node n3 = {30, NULL};
    Node n2 = {20, &n3};
    Node n1 = {10, &n2};

    Node *head = reverse(&n1);

    printf("%d %d %d\n",
           head->value,
           head->next->value,
           head->next->next->value);

    return 0;
}
```

① `10 20 30`  
② `30 20 10`  
③ `30 10 20`  
④ `20 30 10`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>② <code>30 20 10</code></strong>입니다.</p>

### 1. 실행 전 연결 구조

```text
n1(10) → n2(20) → n3(30) → NULL
```

초기 상태:

```text
head → n1
prev = NULL
```

### 2. 첫 번째 반복

현재:

```text
head → n1
```

먼저 기존 다음 노드를 저장합니다.

```c
Node *next = head->next;
```

따라서:

```text
next → n2
```

다음:

```c
head->next = prev;
```

현재 `prev = NULL`이므로:

```text
n1.next = NULL
```

다음:

```c
prev = head;
```

```text
prev → n1
```

마지막:

```c
head = next;
```

```text
head → n2
```

현재:

```text
n1 → NULL
head → n2 → n3
prev → n1
```

### 3. 두 번째 반복

현재:

```text
head → n2
```

기존 다음 노드 저장:

```text
next → n3
```

연결 반전:

```text
n2.next → n1
```

포인터 이동:

```text
prev → n2
head → n3
```

현재 연결:

```text
n2 → n1 → NULL
```

### 4. 세 번째 반복

현재:

```text
head → n3
```

기존 다음 노드:

```text
next = NULL
```

연결 반전:

```text
n3.next → n2
```

포인터 이동:

```text
prev → n3
head = NULL
```

반복 종료.

### 5. 반환값

```c
return prev;
```

따라서 새 시작점:

```text
head → n3
```

최종 연결:

```text
n3(30) → n2(20) → n1(10) → NULL
```

### 6. 최종 출력

```text
30 20 10
```

### 반드시 알아야 할 개념

연결 리스트를 뒤집을 때는 기존 `next` 주소를 잃지 않도록 먼저 저장해야 합니다.

```c
Node *next = head->next;
```

이 줄이 매우 중요합니다.

### 자주 하는 실수

먼저:

```c
head->next = prev;
```

를 실행하고 나서 기존 다음 노드를 찾으려고 하면 원래 연결 정보를 잃어버립니다.

</details>

## 문제 10. 구조체 배열과 콜백 함수 종합

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
    for (int i = 0; i < n; i++) {
        p[i].value = p[i].op(p[i].value);

        if (i > 0)
            p[i].value += p[i - 1].value;
    }
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

① `3 9 14`  
② `3 6 5`  
③ `3 9 10`  
④ `2 9 14`

<details markdown="1">
<summary>정답 및 해설</summary>

<p>정답은 <strong>① <code>3 9 14</code></strong>입니다.</p>

### 1. 실행 전 구조체 배열

```text
a[0] = {value = 2, op → inc}
a[1] = {value = 3, op → twice}
a[2] = {value = 4, op → inc}
```

### 2. i = 0

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

`i > 0`이 아니므로 추가 덧셈은 없습니다.

현재:

```text
3, 3, 4
```

### 3. i = 1

먼저 콜백 실행:

```text
p[1].op → twice
```

따라서:

```text
twice(3) = 6
```

```text
a[1].value = 6
```

그다음:

```c
p[1].value += p[0].value;
```

앞에서 `a[0].value`가 이미 3으로 변경되었습니다.

따라서:

```text
a[1].value = 6 + 3 = 9
```

현재:

```text
3, 9, 4
```

### 4. i = 2

먼저:

```text
p[2].op → inc
```

따라서:

```text
inc(4) = 5
```

```text
a[2].value = 5
```

그다음:

```c
p[2].value += p[1].value;
```

현재 `a[1].value`는 9입니다.

따라서:

```text
a[2].value = 5 + 9 = 14
```

### 5. 최종 상태

```text
a[0].value = 3
a[1].value = 9
a[2].value = 14
```

최종 출력:

```text
3 9 14
```

### 반드시 알아야 할 개념

구조체 안에 함수 포인터를 저장하면 각 원소마다 다른 동작을 적용할 수 있습니다.

또한 반복문 안에서 앞 원소의 값이 변경되면 뒤 원소는 그 **변경된 값**을 사용할 수 있습니다.

### 자주 하는 실수

`a[1]` 계산에서 원래 `a[0].value = 2`를 사용하면 안 됩니다.

`i = 0` 단계에서 이미 3으로 변경되었습니다.

</details>

## 잘 놓치는 핵심

### 1. 동적 2차원 배열은 두 단계로 할당할 수 있다

먼저 행 포인터 배열을 만들고 각 행마다 별도로 정수 배열을 할당합니다.

### 2. 문자열 포인터 배열의 교환은 주소 교환이다

문자열 전체를 복사하지 않고 포인터 값만 교환할 수 있습니다.

### 3. 콜백 함수는 동작을 인자로 넘긴다

함수 포인터를 이용하면 같은 반복 구조에 다른 연산을 적용할 수 있습니다.

### 4. 자기참조 구조체는 연결 구조를 만든다

`next`가 같은 구조체 자료형의 다른 객체를 가리킬 수 있습니다.

### 5. 리스트 시작점을 바꾸려면 이중 포인터가 필요하다

함수 안에서 `head` 자체를 변경하려면 `Node **`를 사용합니다.

### 6. 함수 포인터를 반환할 수도 있다

함수는 데이터뿐 아니라 다른 함수의 주소를 반환할 수도 있습니다.

### 7. free 이후 같은 메모리를 가리키던 다른 포인터도 위험하다

포인터 변수가 남아 있어도 메모리는 이미 해제된 상태일 수 있습니다.

### 8. realloc 이후 기존 내부 포인터는 무효가 될 수 있다

재할당 과정에서 메모리 주소가 바뀔 수 있습니다.

### 9. 연결 리스트 반전은 기존 next를 먼저 저장한다

연결을 바꾸기 전에 다음 노드 주소를 잃지 않아야 합니다.

### 10. 앞에서 변경된 구조체 값은 뒤 계산에 그대로 사용된다

각 반복을 독립적으로 계산하면 안 됩니다.

## 시험·면접에서 바로 보는 포인트

- `int **` 동적 2차원 배열에서 첫 번째 할당과 행 할당을 구분합니다.
- 문자열 배열에서 데이터 복사와 포인터 교환을 구분합니다.
- 콜백 함수는 함수 포인터 매개변수의 자료형부터 확인합니다.
- 자기참조 구조체는 `next` 연결을 그림으로 그립니다.
- 리스트 시작점 변경은 이중 포인터 사용 여부를 확인합니다.
- 함수 포인터 반환 선언은 함수 이름부터 안쪽에서 바깥쪽으로 읽습니다.
- `free` 이후 댕글링 포인터를 역참조하지 않습니다.
- `realloc` 이후 다른 포인터가 이전 주소를 들고 있지 않은지 확인합니다.
- 연결 리스트 반전은 `next 저장 → 연결 반전 → 포인터 이동` 순서를 기억합니다.

## 다음에 이을 글

세트 6에서는 **포인터 배열을 동적으로 확장하는 코드, 구조체 동적 배열, 연결 리스트 삽입·삭제, 재귀와 연결 리스트, 함수 포인터 배열과 콜백 조합, 이중 포인터 문자열 처리**를 중심으로 더 복합적인 문제를 다룹니다.
