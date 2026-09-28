---
title: C 언어 코드 추론 문제 세트 1
date: 2026-09-28 20:16:00 +0900
slug: c-language-code-quiz-set-01
permalink: /posts/c-language-code-quiz-set-01/
categories: [프로그래밍, C언어]
tags: [C언어, 코드추론, 포인터, 배열, 문자열, 재귀, 매크로, 동적메모리]
math: true
---

C 언어는 문법 암기보다 **코드를 직접 추적하는 연습**이 중요합니다.

이번 세트는 포인터, 배열, 문자열, 재귀, 매크로, 함수 포인터, 동적 메모리를 섞은 고난도 코드 문제 10개입니다.

<blockquote class="prompt-info">
<p>한 줄: 코드를 보고 값·주소·실행 순서를 직접 추적하는 문제 세트입니다.</p>
</blockquote>

<details>
<summary>풀이 방법</summary>

정답을 펼치기 전에 변수값과 포인터 위치를 손으로 추적합니다.

출력 문제는 최종 출력만 맞히지 말고 중간 상태까지 적어보는 것이 좋습니다.

</details>

## 문제 1. 2차원 배열과 배열 포인터

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

int main(void)
{
    int a[3][4] = {
        {1, 2, 3, 4},
        {5, 6, 7, 8},
        {9, 10, 11, 12}
    };

    int (*p)[4] = a;

    printf("%d %d %d\n",
           p[1][2],
           *(*(p + 2) + 1),
           *(*(p + 1) + 3 - 2));

    return 0;
}
```

① `6 9 5`  
② `7 10 6`  
③ `7 11 7`  
④ `8 10 6`

<details>
<summary>정답 및 해설</summary>

정답은 **② `7 10 6`**입니다.

- `p[1][2]` → 두 번째 행 세 번째 값 → `7`
- `*(*(p + 2) + 1)` → 세 번째 행 두 번째 값 → `10`
- `*(*(p + 1) + 3 - 2)` → 두 번째 행 두 번째 값 → `6`

<mark>`p + 1`은 정수 하나가 아니라 한 행 전체만큼 이동합니다.</mark>

</details>

## 문제 2. 포인터 증가 연산

다음 코드의 출력 결과를 구하십시오.

```c
#include <stdio.h>

int main(void)
{
    int a[] = {10, 20, 30, 40, 50};
    int *p = a + 1;

    int x = *p++;
    int y = *++p;
    int z = (*p)++;

    printf("%d %d %d %d %d\n",
           x, y, z, *p, a[3]);

    return 0;
}
```

<details>
<summary>정답 및 해설</summary>

```text
20 40 40 41 41
```

흐름은 다음과 같습니다.

```text
처음 p → a[1] = 20
*p++   → x = 20, 이후 p → a[2]
*++p   → 먼저 p → a[3], y = 40
(*p)++ → z = 40, a[3]은 41
```

<mark>`*p++`, `*++p`, `(*p)++`를 반드시 구분합니다.</mark>

</details>

## 문제 3. 정적 지역 변수

다음 코드의 출력 결과는 무엇입니까?

```c
#include <stdio.h>

int calc(int x)
{
    static int s = 2;

    s += x;

    if (s % 2 == 0)
        s /= 2;
    else
        s += 3;

    return s;
}

int main(void)
{
    int a = calc(2);
    int b = calc(3);
    int c = calc(1);

    printf("%d %d %d\n", a, b, c);

    return 0;
}
```

① `2 4 4`  
② `2 8 12`  
③ `4 8 12`  
④ `2 5 3`

<details>
<summary>정답 및 해설</summary>

정답은 **② `2 8 12`**입니다.

```text
처음 s = 2
calc(2): 2 + 2 = 4 → 짝수 → 2
calc(3): 2 + 3 = 5 → 홀수 → 8
calc(1): 8 + 1 = 9 → 홀수 → 12
```

`static` 지역 변수는 함수 호출이 끝나도 값이 유지됩니다.

</details>

## 문제 4. 문자열 종료 문자

다음 코드의 출력 결과로 옳은 것은 무엇입니까?

```c
#include <stdio.h>
#include <string.h>

int main(void)
{
    char s[] = "ABCDE";
    char *p = s + 1;

    p[2] = '\0';

    printf("%zu %zu %s %s\n",
           sizeof(s),
           strlen(s),
           s,
           p);

    return 0;
}
```

① `5 3 ABC BC`  
② `6 3 ABC BC`  
③ `6 5 ABCDE BCDE`  
④ `5 2 AB B`

<details>
<summary>정답 및 해설</summary>

정답은 **② `6 3 ABC BC`**입니다.

원래 배열은 다음과 같습니다.

```text
A B C D E \0
```

`p = s + 1`이므로 `p[2]`는 `s[3]`입니다.

따라서 배열은 다음처럼 바뀝니다.

```text
A B C \0 E \0
```

`sizeof(s) = 6`, `strlen(s) = 3`, `s`는 `ABC`, `p`는 `BC`를 출력합니다.

</details>

## 문제 5. 비트 연산

다음 코드가 출력하는 십진수 값을 구하십시오.

```c
#include <stdio.h>

int main(void)
{
    unsigned int x = 0xB6;

    unsigned int y =
        ((x >> 2) & 0x0F) |
        ((x << 4) & 0xF0);

    printf("%u\n", y);

    return 0;
}
```

<details>
<summary>정답 및 해설</summary>

정답은 **109**입니다.

```text
x = 1011 0110

(x >> 2) & 0000 1111
= 0000 1101

(x << 4) & 1111 0000
= 0110 0000

OR
= 0110 1101
```

`0110 1101`은 `0x6D`, 십진수 `109`입니다.

</details>

## 문제 6. 재귀 호출 추적

다음 코드에서 `f(13)`의 반환값은 무엇입니까?

```c
#include <stdio.h>

int f(int n)
{
    if (n == 0)
        return 0;

    if (n % 2 == 0)
        return f(n / 2) + 1;

    return f(n - 1) + 2;
}

int main(void)
{
    printf("%d\n", f(13));

    return 0;
}
```

① `7`  
② `8`  
③ `9`  
④ `10`

<details>
<summary>정답 및 해설</summary>

정답은 **③ `9`**입니다.

```text
f(0) = 0
f(1) = 2
f(2) = 3
f(3) = 5
f(6) = 6
f(12) = 7
f(13) = 9
```

<mark>재귀 문제는 필요한 호출 경로만 아래에서 위로 계산하면 빠릅니다.</mark>

</details>

## 문제 7. 매크로와 연산자 우선순위

다음 코드의 출력 결과는 무엇입니까?

```c
#include <stdio.h>

#define SQR(x) x * x

int main(void)
{
    int a = 3;

    printf("%d %d\n",
           SQR(a + 1),
           16 / SQR(2));

    return 0;
}
```

① `16 4`  
② `7 4`  
③ `7 16`  
④ `16 16`

<details>
<summary>정답 및 해설</summary>

정답은 **③ `7 16`**입니다.

첫 번째 식은 매크로 치환 후 다음과 같습니다.

```c
a + 1 * a + 1
```

따라서 `3 + 3 + 1 = 7`.

두 번째 식은 다음과 같습니다.

```c
16 / 2 * 2
```

곱셈과 나눗셈은 같은 우선순위이므로 왼쪽부터 계산하여 `16`입니다.

안전한 매크로는 다음과 같습니다.

```c
#define SQR(x) ((x) * (x))
```

</details>

## 문제 8. 함수 포인터 배열

빈칸에 들어갈 코드로 옳은 것은 무엇입니까?

```c
#include <stdio.h>

int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }
int mul(int a, int b) { return a * b; }

int main(void)
{
    int (*op[3])(int, int) = {add, sub, mul};

    int x = 2;
    int y = 3;

    int result = ____________;

    printf("%d\n", result);

    return 0;
}
```

출력값은 `20`이어야 합니다.

① `op[0](op[2](x, y), 4)`  
② `op[2](op[0](x, y), 4)`  
③ `op[1](op[2](x, y), 4)`  
④ `op[2](op[1](x, y), 4)`

<details>
<summary>정답 및 해설</summary>

정답은 **②**입니다.

```c
op[2](op[0](x, y), 4)
```

먼저 `op[0](2, 3)`은 `add(2, 3)`이므로 `5`입니다.

그다음 `op[2](5, 4)`는 `mul(5, 4)`이므로 `20`입니다.

```c
int (*op[3])(int, int)
```

이는 정수 두 개를 받아 정수를 반환하는 함수의 주소를 3개 저장하는 배열입니다.

</details>

## 문제 9. 동적 메모리 재할당

다음 빈칸에 들어갈 코드로 가장 안전한 것은 무엇입니까?

```c
#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int *p = malloc(4 * sizeof(int));

    if (p == NULL)
        return 1;

    for (int i = 0; i < 4; i++)
        p[i] = i + 1;

    int *tmp = realloc(p, 6 * sizeof(int));

    ___________________________

    p[4] = p[1] + p[3];
    p[5] = p[4] - p[0];

    printf("%d\n", p[5]);

    free(p);

    return 0;
}
```

① `p = tmp;`

②

```c
if (tmp == NULL)
    return 1;
p = tmp;
```

③

```c
if (tmp == NULL) {
    free(p);
    return 1;
}
p = tmp;
```

④

```c
free(p);
p = tmp;
```

<details>
<summary>정답 및 해설</summary>

정답은 **③**입니다.

`realloc` 실패 시 기존 `p`가 가리키는 메모리는 유지됩니다.

따라서 실패하면 기존 메모리를 해제한 뒤 종료하고, 성공한 경우에만 `p = tmp`로 바꿉니다.

성공 후 계산은 다음과 같습니다.

```text
p[4] = 2 + 4 = 6
p[5] = 6 - 1 = 5
```

출력값은 `5`입니다.

<mark>`realloc` 결과를 기존 포인터에 바로 덮어쓰지 않는 것이 핵심입니다.</mark>

</details>

## 문제 10. 연결 리스트와 변경된 값의 전파

다음 코드의 출력 결과를 구하십시오.

```c
#include <stdio.h>

typedef struct Node {
    int value;
    struct Node *next;
} Node;

int main(void)
{
    Node n3 = {30, NULL};
    Node n2 = {20, &n3};
    Node n1 = {10, &n2};

    Node *p = &n1;

    while (p != NULL && p->next != NULL) {
        p->next->value += p->value / 10;
        p = p->next;
    }

    printf("%d %d %d\n",
           n1.value,
           n2.value,
           n3.value);

    return 0;
}
```

<details>
<summary>정답 및 해설</summary>

정답은 다음과 같습니다.

```text
10 21 32
```

첫 번째 반복:

```text
n2.value = 20 + 10 / 10 = 21
```

두 번째 반복에서는 이미 변경된 `n2.value`를 사용합니다.

```text
n3.value = 30 + 21 / 10
         = 30 + 2
         = 32
```

정수 나눗셈에서는 소수점 이하가 버려집니다.

</details>

## 잘 놓치는 핵심

### 1. 포인터 연산

```c
*p++
*++p
(*p)++
```

세 표현의 의미를 구분해야 합니다.

### 2. 배열과 문자열

문자열 배열의 크기에는 종료 문자도 포함됩니다.

`sizeof`와 `strlen`은 같은 개념이 아닙니다.

### 3. 정적 지역 변수

`static` 지역 변수는 함수 호출 사이에 값이 유지됩니다.

### 4. 매크로

매크로는 함수가 아니라 단순 치환입니다.

매개변수와 전체 식에 괄호를 넣어야 합니다.

### 5. 동적 메모리

`realloc`은 실패할 수 있으므로 임시 포인터를 사용하는 습관이 중요합니다.

## 다음에 이을 글

다음 세트에서는 난도를 더 높여 **이중 포인터, 포인터 배열과 배열 포인터, 구조체 포인터, 전처리기, 파일 입출력, 정의되지 않은 동작 판별**을 중심으로 구성합니다.
