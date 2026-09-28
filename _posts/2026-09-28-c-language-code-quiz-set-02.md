---
title: C 언어 코드 추론 문제 세트 2
date: 2026-09-28 20:30:00 +0900
slug: c-language-code-quiz-set-02
permalink: /posts/c-language-code-quiz-set-02/
categories: [프로그래밍, C언어]
tags: [C언어, 포인터, 이중포인터, 구조체, 함수포인터, 전처리기, 문자열, 코드추론]
math: true
---

이번 세트는 단순 문법보다 **포인터의 단계, 메모리 접근, 실행 순서, 코드의 안전성**을 읽는 문제에 집중합니다.

<blockquote class="prompt-info">
<p>한 줄: 세트 1보다 포인터와 메모리 추적 비중을 높인 고난도 문제 10개입니다.</p>
</blockquote>

<details>
<summary>풀이 방법</summary>

코드를 바로 계산하지 말고 먼저 각 포인터가 무엇을 가리키는지 적습니다.

특히 `*`, `**`, `[]`, `->`, 전위·후위 증가 연산자가 섞이면 한 줄씩 분해해서 추적합니다.

</details>

## 문제 1. 이중 포인터

다음 코드의 출력 결과를 구하십시오.

```c
#include <stdio.h>

int main(void)
{
    int a = 10;
    int b = 20;

    int *p = &a;
    int **pp = &p;

    **pp += 5;
    *pp = &b;
    **pp -= 3;

    printf("%d %d\n", a, b);

    return 0;
}
```

① `10 17`  
② `15 17`  
③ `15 20`  
④ `12 17`

<details>
<summary>정답 및 해설</summary>

정답은 **② `15 17`**입니다.

처음에는 다음과 같습니다.

```text
p → a
pp → p
```

`**pp += 5`는 결국 `a += 5`이므로 `a = 15`가 됩니다.

그다음:

```c
*pp = &b;
```

`*pp`는 `p` 자체이므로 `p`가 `b`를 가리키도록 바뀝니다.

따라서 `**pp -= 3`은 `b -= 3`이므로 `b = 17`입니다.

</details>

## 문제 2. 포인터 배열과 배열 포인터

다음 코드의 출력 결과는 무엇입니까?

```c
#include <stdio.h>

int main(void)
{
    int a[2][3] = {
        {1, 2, 3},
        {4, 5, 6}
    };

    int *p[2] = {a[0], a[1]};
    int (*q)[3] = a;

    printf("%d %d %d\n",
           p[1][0],
           q[0][2],
           *(*(q + 1) + 1));

    return 0;
}
```

① `4 3 5`  
② `4 2 6`  
③ `5 3 4`  
④ `1 3 5`

<details>
<summary>정답 및 해설</summary>

정답은 **① `4 3 5`**입니다.

`p`는 **정수 포인터 2개를 저장하는 배열**입니다.

```text
p[0] → a[0]
p[1] → a[1]
```

따라서 `p[1][0] = 4`.

`q`는 **정수 3개짜리 배열을 가리키는 포인터**입니다.

```text
q[0][2] = 3
*(*(q + 1) + 1) = a[1][1] = 5
```

<mark>`int *p[2]`와 `int (*q)[3]`은 전혀 다른 선언입니다.</mark>

</details>

## 문제 3. 배열을 함수에 전달했을 때

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

void change(int a[], int n)
{
    for (int i = 0; i < n; i++)
        a[i] += i;
}

int main(void)
{
    int x[] = {10, 10, 10, 10};

    change(x + 1, 3);

    printf("%d %d %d %d\n",
           x[0], x[1], x[2], x[3]);

    return 0;
}
```

① `10 10 11 12`  
② `10 11 12 13`  
③ `10 10 10 10`  
④ `10 10 12 14`

<details>
<summary>정답 및 해설</summary>

정답은 **① `10 10 11 12`**입니다.

함수에 전달되는 시작 위치는 `x + 1`입니다.

따라서 함수 안에서:

```text
a[0] → x[1]
a[1] → x[2]
a[2] → x[3]
```

반복 결과:

```text
x[1] += 0 → 10
x[2] += 1 → 11
x[3] += 2 → 12
```

따라서 출력은 다음과 같습니다.

```text
10 10 11 12
```

</details>

## 문제 4. 구조체 포인터와 후위 증가

다음 코드의 출력 결과는 무엇입니까?

```c
#include <stdio.h>

typedef struct {
    int x;
    int y;
} Point;

int main(void)
{
    Point p[3] = {
        {1, 2},
        {3, 4},
        {5, 6}
    };

    Point *q = p;

    q->x += 10;
    q++;
    q->y += q[-1].x;

    printf("%d %d %d %d\n",
           p[0].x,
           p[0].y,
           p[1].x,
           p[1].y);

    return 0;
}
```

① `11 2 3 15`  
② `11 2 3 4`  
③ `1 2 3 15`  
④ `11 13 3 4`

<details>
<summary>정답 및 해설</summary>

정답은 **① `11 2 3 15`**입니다.

처음 `q`는 `p[0]`을 가리킵니다.

```c
q->x += 10;
```

따라서 `p[0].x = 11`.

그다음 `q++`으로 `q`는 `p[1]`을 가리킵니다.

```c
q->y += q[-1].x;
```

`q->y`는 `p[1].y`, 즉 `4`.

`q[-1].x`는 바로 앞 구조체인 `p[0].x`, 즉 `11`.

따라서:

```text
p[1].y = 4 + 11 = 15
```

</details>

## 문제 5. 문자열 포인터 이동

다음 코드의 출력 결과를 구하십시오.

```c
#include <stdio.h>

int main(void)
{
    char s[] = "PROGRAM";
    char *p = s;

    while (*p != '\0') {
        if (*p == 'G')
            break;
        p++;
    }

    printf("%c %s %ld\n",
           *p,
           p,
           p - s);

    return 0;
}
```

<details>
<summary>정답 및 해설</summary>

정답은 다음과 같습니다.

```text
G GRAM 3
```

문자열의 인덱스는 다음과 같습니다.

```text
P  R  O  G  R  A  M
0  1  2  3  4  5  6
```

`p`는 `G`를 만날 때 반복을 종료하므로 `s[3]`을 가리킵니다.

따라서:

- `*p` → `G`
- `%s`로 `p` 출력 → `GRAM`
- `p - s` → `3`

</details>

## 문제 6. 전처리기 조건부 컴파일

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

#define MODE 2

int main(void)
{
    int x = 10;

#if MODE == 1
    x += 5;
#elif MODE == 2
    x *= 3;
#else
    x -= 2;
#endif

    printf("%d\n", x);

    return 0;
}
```

① `8`  
② `15`  
③ `30`  
④ 컴파일 오류

<details>
<summary>정답 및 해설</summary>

정답은 **③ `30`**입니다.

전처리 단계에서 `MODE == 2` 조건이 참이므로 다음 코드만 실제 컴파일 대상에 남습니다.

```c
x *= 3;
```

따라서 `10 × 3 = 30`입니다.

<mark>`#if`는 실행 중 조건문이 아니라 컴파일 전에 처리되는 조건입니다.</mark>

</details>

## 문제 7. 함수 포인터를 인자로 전달

다음 코드의 출력 결과는 무엇입니까?

```c
#include <stdio.h>

int add1(int x)
{
    return x + 1;
}

int twice(int x)
{
    return x * 2;
}

int apply(int x, int (*f)(int))
{
    return f(f(x));
}

int main(void)
{
    int a = apply(3, add1);
    int b = apply(3, twice);

    printf("%d %d\n", a, b);

    return 0;
}
```

① `4 6`  
② `5 12`  
③ `5 9`  
④ `6 12`

<details>
<summary>정답 및 해설</summary>

정답은 **② `5 12`**입니다.

`apply`는 받은 함수를 두 번 연속 호출합니다.

첫 번째:

```text
add1(3) = 4
add1(4) = 5
```

따라서 `a = 5`.

두 번째:

```text
twice(3) = 6
twice(6) = 12
```

따라서 `b = 12`.

</details>

## 문제 8. 빈칸 채우기 - 이중 포인터로 값 교환

다음 코드가 `30 10`을 출력하도록 빈칸에 들어갈 코드로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

void swap_ptr(int **a, int **b)
{
    int *tmp = *a;
    ____________;
    *b = tmp;
}

int main(void)
{
    int x = 10;
    int y = 30;

    int *p = &x;
    int *q = &y;

    swap_ptr(&p, &q);

    printf("%d %d\n", *p, *q);

    return 0;
}
```

① `a = b;`  
② `*a = *b;`  
③ `**a = **b;`  
④ `*a = b;`

<details>
<summary>정답 및 해설</summary>

정답은 **② `*a = *b;`**입니다.

함수 안에서 `a`와 `b`는 각각 `p`, `q`의 주소를 받습니다.

따라서 포인터 변수 자체를 서로 교환하려면 다음과 같이 해야 합니다.

```c
int *tmp = *a;
*a = *b;
*b = tmp;
```

교환 후:

```text
p → y
q → x
```

따라서 출력은:

```text
30 10
```

</details>

## 문제 9. 정의되지 않은 동작 찾기

다음 코드에 대한 설명으로 가장 옳은 것은 무엇입니까?

```c
#include <stdio.h>

int main(void)
{
    int i = 1;

    int x = i++ + ++i;

    printf("%d %d\n", x, i);

    return 0;
}
```

① 항상 `4 3`을 출력한다.  
② 항상 `5 3`을 출력한다.  
③ 컴파일 오류가 반드시 발생한다.  
④ 결과를 일정하게 예측할 수 없는 코드이다.

<details>
<summary>정답 및 해설</summary>

정답은 **④**입니다.

하나의 식 안에서 `i`를 여러 번 변경하면서, 변경 사이의 평가 순서가 보장되지 않는 형태입니다.

따라서 특정 출력값을 정답으로 정하면 안 됩니다.

<mark>시험에서 이런 코드는 직접 계산하려 하지 말고 먼저 안전하게 정의된 코드인지 확인합니다.</mark>

안전하게 작성하려면 연산을 분리해야 합니다.

```c
int a = i++;
int b = ++i;
int x = a + b;
```

</details>

## 문제 10. 포인터와 조건식 종합

다음 코드의 출력 결과를 구하십시오.

```c
#include <stdio.h>

int main(void)
{
    int a[] = {2, 4, 6, 8, 10};
    int *p = a;
    int sum = 0;

    for (int i = 0; i < 5; i++) {
        if (*(p + i) % 4 == 0)
            sum += *(p + i);
        else
            sum -= i;
    }

    printf("%d\n", sum);

    return 0;
}
```

① `5`  
② `6`  
③ `9`  
④ `12`

<details>
<summary>정답 및 해설</summary>

정답은 **② `6`**입니다.

각 반복을 추적하면 다음과 같습니다.

```text
i = 0, 값 2  → 4의 배수 아님 → sum = 0 - 0 = 0
i = 1, 값 4  → 4의 배수     → sum = 0 + 4 = 4
i = 2, 값 6  → 4의 배수 아님 → sum = 4 - 2 = 2
i = 3, 값 8  → 4의 배수     → sum = 2 + 8 = 10
i = 4, 값 10 → 4의 배수 아님 → sum = 10 - 4 = 6
```

따라서 실제 출력값은 `6`입니다.

</details>

## 잘 놓치는 핵심

### 1. 이중 포인터

`**pp`는 최종 값에 접근하고, `*pp`를 바꾸면 중간 포인터가 가리키는 대상 자체가 바뀝니다.

### 2. 포인터 배열과 배열 포인터

```c
int *p[3];
int (*p)[3];
```

괄호 위치에 따라 완전히 다른 선언입니다.

### 3. 구조체 포인터

```c
p->x
```

는 다음과 같습니다.

```c
(*p).x
```

### 4. 함수 포인터

함수를 다른 함수의 인자로 넘기면 실행할 동작 자체를 전달할 수 있습니다.

### 5. 정의되지 않은 동작

결과값 계산보다 먼저 코드가 정상적으로 정의된 동작인지 확인해야 합니다.

특히 하나의 식에서 같은 변수를 여러 번 변경하는 코드는 주의합니다.

## 다음에 이을 글

다음 세트에서는 **문자 포인터 배열, 함수 포인터 배열, 재귀와 포인터 결합, 메모리 할당 오류, 구조체 배열, 비트 마스크, 파일 입출력 코드 추론**을 중심으로 더 어렵게 구성합니다.
