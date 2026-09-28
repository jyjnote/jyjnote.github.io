---
title: C 언어 코드 추론 문제 세트 3
date: 2026-09-28 20:45:00 +0900
slug: c-language-code-quiz-set-03
permalink: /posts/c-language-code-quiz-set-03/
categories: [프로그래밍, C언어]
tags: [C언어, 포인터, 문자열, 구조체, 함수포인터, 비트연산, 재귀, 메모리]
math: true
---

이번 세트는 **코드를 한 줄씩 실행하는 능력보다 자료형과 주소 관계를 먼저 파악하는 능력**을 요구합니다.

포인터가 여러 단계로 연결되거나 배열과 함수가 섞인 문제를 중심으로 구성했습니다.

<blockquote class="prompt-info">
<p>한 줄: 주소 관계를 먼저 그리지 않으면 실수하기 쉬운 고난도 C 언어 코드 추론 문제 10개입니다.</p>
</blockquote>

<details>
<summary>풀이 방법</summary>

포인터 문제는 값부터 계산하지 않습니다.

먼저 `누가 누구를 가리키는지`를 적고, 그다음 값이 변경되는 순서를 추적합니다.

배열 문제에서는 포인터가 한 번 증가할 때 몇 바이트가 아니라 **몇 개의 원소 단위로 이동하는지**를 확인합니다.

</details>

## 문제 1. 이중 포인터와 포인터 이동

다음 코드의 출력 결과는 무엇입니까?

```c
#include <stdio.h>

int main(void)
{
    int a[] = {10, 20, 30, 40};

    int *p = a;
    int **pp = &p;

    (*pp)++;
    **pp += 5;
    (*pp)++;
    **pp -= 10;

    printf("%d %d %d %d\n",
           a[0], a[1], a[2], a[3]);

    return 0;
}
```

① `10 20 20 40`  
② `10 25 20 40`  
③ `15 25 20 40`  
④ `10 25 30 30`

<details>
<summary>정답 및 해설</summary>

정답은 **② `10 25 20 40`**입니다.

처음에는 다음과 같습니다.

```text
p → a[0]
pp → p
```

첫 번째:

```c
(*pp)++;
```

`*pp`는 `p`이므로 포인터 `p`가 한 칸 이동합니다.

```text
p → a[1]
```

두 번째:

```c
**pp += 5;
```

현재 `p`가 `a[1]`을 가리키므로:

```text
a[1] = 20 + 5 = 25
```

세 번째:

```c
(*pp)++;
```

다시 포인터가 한 칸 이동합니다.

```text
p → a[2]
```

네 번째:

```c
**pp -= 10;
```

따라서:

```text
a[2] = 30 - 10 = 20
```

최종 결과는 다음과 같습니다.

```text
10 25 20 40
```

</details>

## 문제 2. 문자 포인터 배열

다음 코드의 출력 결과는 무엇입니까?

```c
#include <stdio.h>

int main(void)
{
    const char *s[] = {
        "APPLE",
        "BANANA",
        "CHERRY"
    };

    const char **p = s + 1;

    printf("%c %s %c\n",
           (*p)[2],
           *(p + 1),
           *(*(p - 1) + 4));

    return 0;
}
```

① `N CHERRY E`  
② `A BANANA L`  
③ `N BANANA E`  
④ `A CHERRY E`

<details>
<summary>정답 및 해설</summary>

정답은 **① `N CHERRY E`**입니다.

`p = s + 1`이므로 `p`는 `s[1]`, 즉 `"BANANA"`를 가리키는 포인터의 위치를 가리킵니다.

첫 번째:

```c
(*p)[2]
```

`*p`는 `"BANANA"`입니다.

인덱스 `2`의 문자는 `N`입니다.

두 번째:

```c
*(p + 1)
```

다음 문자열 포인터인 `"CHERRY"`입니다.

세 번째:

```c
*(*(p - 1) + 4)
```

`p - 1`은 `s[0]`, 즉 `"APPLE"`입니다.

`APPLE`의 인덱스 `4`는 `E`입니다.

</details>

## 문제 3. 구조체 배열과 포인터 연산

다음 코드의 출력 결과를 구하십시오.

```c
#include <stdio.h>

typedef struct {
    int id;
    int score;
} Student;

int main(void)
{
    Student s[3] = {
        {1, 70},
        {2, 80},
        {3, 90}
    };

    Student *p = s + 1;

    p->score += (p - 1)->score / 10;
    (p + 1)->score -= p->id * 5;

    printf("%d %d %d\n",
           s[0].score,
           s[1].score,
           s[2].score);

    return 0;
}
```

① `70 87 80`  
② `70 87 85`  
③ `77 80 80`  
④ `70 80 85`

<details>
<summary>정답 및 해설</summary>

정답은 **① `70 87 80`**입니다.

처음 `p`는 `s[1]`을 가리킵니다.

첫 번째 식:

```c
p->score += (p - 1)->score / 10;
```

`p->score`는 `80`.

`(p - 1)->score`는 `s[0].score`, 즉 `70`.

정수 나눗셈이므로:

```text
70 / 10 = 7
```

따라서:

```text
s[1].score = 87
```

다음 식:

```c
(p + 1)->score -= p->id * 5;
```

`p + 1`은 `s[2]`.

`p->id`는 `2`.

따라서:

```text
s[2].score = 90 - 2 × 5 = 80
```

</details>

## 문제 4. 재귀와 포인터

다음 코드의 출력 결과는 무엇입니까?

```c
#include <stdio.h>

int sum(int *p, int n)
{
    if (n == 0)
        return 0;

    return *p + sum(p + 1, n - 1);
}

int main(void)
{
    int a[] = {2, 4, 6, 8, 10};

    printf("%d\n", sum(a + 1, 3));

    return 0;
}
```

① `12`  
② `18`  
③ `24`  
④ `28`

<details>
<summary>정답 및 해설</summary>

정답은 **② `18`**입니다.

호출은 `sum(a + 1, 3)`에서 시작합니다.

따라서 사용되는 값은:

```text
a[1] = 4
a[2] = 6
a[3] = 8
```

재귀 흐름은 다음과 같습니다.

```text
sum(a + 1, 3)
= 4 + sum(a + 2, 2)

= 4 + 6 + sum(a + 3, 1)

= 4 + 6 + 8 + sum(a + 4, 0)

= 18
```

</details>

## 문제 5. 함수 포인터 배열

다음 코드의 출력 결과를 구하십시오.

```c
#include <stdio.h>

int f1(int x)
{
    return x + 2;
}

int f2(int x)
{
    return x * 3;
}

int f3(int x)
{
    return x - 4;
}

int main(void)
{
    int (*f[3])(int) = {f1, f2, f3};

    int x = 5;

    x = f[0](x);
    x = f[1](x);
    x = f[2](x);

    printf("%d\n", x);

    return 0;
}
```

① `13`  
② `15`  
③ `17`  
④ `21`

<details>
<summary>정답 및 해설</summary>

정답은 **③ `17`**입니다.

순서대로 계산합니다.

```text
처음 x = 5

f1(5) = 7
f2(7) = 21
f3(21) = 17
```

따라서 최종 출력값은 `17`입니다.

</details>

## 문제 6. 비트 마스크

다음 코드의 출력 결과는 무엇입니까?

```c
#include <stdio.h>

int main(void)
{
    unsigned int x = 0xAC;

    unsigned int a = x & 0x0F;
    unsigned int b = (x >> 4) & 0x0F;

    printf("%u %u %u\n",
           a,
           b,
           a + b);

    return 0;
}
```

① `10 12 22`  
② `12 10 22`  
③ `12 10 20`  
④ `10 12 20`

<details>
<summary>정답 및 해설</summary>

정답은 **② `12 10 22`**입니다.

`0xAC`는 16진수 두 자리입니다.

```text
A = 10
C = 12
```

첫 번째:

```c
x & 0x0F
```

하위 4비트만 남기므로 `C`, 즉 `12`.

두 번째:

```c
(x >> 4) & 0x0F
```

상위 4비트를 아래로 이동시키므로 `A`, 즉 `10`.

따라서 합은:

```text
12 + 10 = 22
```

</details>

## 문제 7. 배열 복사와 겹치는 메모리

다음 코드에 대한 설명으로 옳은 것은 무엇입니까?

```c
#include <stdio.h>
#include <string.h>

int main(void)
{
    char s[] = "ABCDE";

    memcpy(s + 1, s, 4);

    printf("%s\n", s);

    return 0;
}
```

① 반드시 `AABCD`를 출력한다.  
② 반드시 `ABCDE`를 출력한다.  
③ 원본과 목적지 영역이 겹치므로 올바른 사용이 아니다.  
④ 컴파일되지 않는다.

<details>
<summary>정답 및 해설</summary>

정답은 **③**입니다.

`memcpy`는 원본 영역과 목적지 영역이 겹치는 경우를 안전하게 처리하도록 보장되지 않습니다.

이 코드에서는:

```text
원본: s[0] ~ s[3]
목적지: s[1] ~ s[4]
```

영역이 서로 겹칩니다.

이럴 때는 `memmove`를 사용해야 합니다.

```c
memmove(s + 1, s, 4);
```

<mark>메모리 영역이 겹칠 가능성이 있으면 `memcpy`가 아니라 `memmove`를 생각합니다.</mark>

</details>

## 문제 8. 빈칸 채우기 - 배열 원소 역순 접근

다음 코드가 `50 40 30 20 10`을 출력하도록 빈칸에 들어갈 표현으로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

int main(void)
{
    int a[] = {10, 20, 30, 40, 50};
    int *p = a + 5;

    for (int i = 0; i < 5; i++) {
        printf("%d ", ____________);
    }

    return 0;
}
```

① `*p--`  
② `*--p`  
③ `(*p)--`  
④ `*(p++)`

<details>
<summary>정답 및 해설</summary>

정답은 **② `*--p`**입니다.

처음 `p = a + 5`는 배열의 마지막 원소 바로 다음 위치를 가리킵니다.

따라서 값을 읽기 전에 먼저 한 칸 뒤로 이동해야 합니다.

```c
*--p
```

첫 반복:

```text
p → a[4]
출력 50
```

다음 반복에서는 `a[3]`, 그다음 `a[2]` 순서로 이동합니다.

`*p--`를 사용하면 처음에 `a + 5`를 역참조하려 하므로 잘못된 접근이 됩니다.

</details>

## 문제 9. 연산자 우선순위

다음 코드의 출력 결과는 무엇입니까?

```c
#include <stdio.h>

int main(void)
{
    int a[] = {5, 10, 15};
    int *p = a;

    int x = *p + *(p + 1) * 2;
    int y = (*p + *(p + 1)) * 2;

    printf("%d %d\n", x, y);

    return 0;
}
```

① `25 30`  
② `25 40`  
③ `30 30`  
④ `30 40`

<details>
<summary>정답 및 해설</summary>

정답은 **① `25 30`**입니다.

첫 번째:

```c
int x = *p + *(p + 1) * 2;
```

곱셈이 덧셈보다 먼저입니다.

```text
5 + 10 × 2
= 5 + 20
= 25
```

두 번째:

```c
int y = (*p + *(p + 1)) * 2;
```

괄호 안을 먼저 계산합니다.

```text
(5 + 10) × 2
= 15 × 2
= 30
```

</details>

## 문제 10. 종합 포인터 추론

다음 코드의 출력 결과를 구하십시오.

```c
#include <stdio.h>

int main(void)
{
    int a[] = {3, 6, 9, 12};

    int *p = a + 1;
    int *q = a + 3;

    *p += *q / 3;
    q--;
    *q -= *p / 2;

    printf("%d %d %d %d\n",
           a[0], a[1], a[2], a[3]);

    return 0;
}
```

① `3 10 4 12`  
② `3 10 9 12`  
③ `3 9 5 12`  
④ `3 10 5 12`

<details>
<summary>정답 및 해설</summary>

정답은 **① `3 10 4 12`**입니다.

처음:

```text
p → a[1] = 6
q → a[3] = 12
```

첫 번째:

```c
*p += *q / 3;
```

따라서:

```text
a[1] = 6 + 12 / 3
     = 6 + 4
     = 10
```

그다음:

```c
q--;
```

`q`는 `a[2]`를 가리킵니다.

다음:

```c
*q -= *p / 2;
```

현재 `*p`는 변경된 값 `10`입니다.

따라서:

```text
a[2] = 9 - 10 / 2
     = 9 - 5
     = 4
```

최종 배열은:

```text
3 10 4 12
```

<mark>앞에서 변경된 값이 뒤 계산에 다시 사용되는지를 반드시 확인해야 합니다.</mark>

</details>

## 잘 놓치는 핵심

### 1. 포인터를 증가시키는지 값을 증가시키는지 구분

```c
(*p)++
p++
```

두 표현은 완전히 다릅니다.

### 2. 이중 포인터에서는 단계별로 해석

```text
pp → p → 값
```

처럼 가리키는 관계를 먼저 그립니다.

### 3. 문자 포인터 배열

```c
const char *s[3]
```

은 문자열 세 개 자체가 아니라 문자열 시작 주소 세 개를 저장하는 배열로 이해하면 쉽습니다.

### 4. 메모리 복사

`memcpy`는 겹치는 영역에 사용하지 않습니다.

겹칠 수 있으면 `memmove`를 사용합니다.

### 5. 변경된 값을 다시 사용하는지 확인

코드 앞부분에서 배열이나 구조체의 값이 바뀌면 뒤쪽 계산은 변경된 값을 기준으로 수행됩니다.

## 다음에 이을 글

다음 세트에서는 **삼중 포인터, 구조체 내부 포인터, 포인터를 반환하는 함수, 문자열 함수 직접 구현, 동적 2차원 배열, 비트 시프트, 함수 포인터와 구조체 결합, 코드 오류 판별**을 중심으로 구성합니다.
