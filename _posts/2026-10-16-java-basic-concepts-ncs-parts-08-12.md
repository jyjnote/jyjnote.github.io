---
title: 자바 기본개념 종합 정리 — NCS 전산직 필기 대비 8~12부
date: 2026-10-16 21:00:00 +0900
slug: java-basic-concepts-ncs-parts-08-12
permalink: /posts/java-basic-concepts-ncs-parts-08-12/
categories: [프로그래밍, 자바]
tags: [자바, NCS, 전산직, 문자열, 컬렉션, 스트림, 예외처리, 입출력, 데이터베이스]
math: true
---

자바의 표준 라이브러리는 문자열·자료구조·파일·통신처럼 반복해서 필요한 기능을 제공합니다. 이 글은 앞편의 문법·객체지향·제네릭을 바탕으로, 데이터를 저장하고 가공하며 외부 자원과 연결하는 방법을 정리한 학습노트입니다.

<blockquote class="prompt-info">
<p>한 줄: 어떤 자료를 담는지, 무엇을 기준으로 비교하는지, 원본이 바뀌는지, 언제 실행되고 닫히는지를 구분합니다.</p>
</blockquote>

<details markdown="1">
<summary>한 줄로</summary>

문자열과 값 처리 → 컬렉션에 저장 → 람다와 스트림으로 가공 → 예외와 자원 관리 → 파일·통신·데이터베이스 연결 순서로 공부합니다.

</details>

## 이 글의 범위와 읽는 방법

기존 전체 목차의 **8~12부, 056~100번 45개 주제**를 이어서 다룹니다. 앞편은 [자바 기본개념 종합 정리 1~7부](/posts/java-basic-concepts-ncs-parts-01-07/)입니다.

여기서 **NCS 수준**은 기초 개념을 설명하고, 짧은 코드의 결과와 개념형 선택지를 판별하는 학습 깊이를 뜻합니다. 특정 기관의 공식 출제 범위나 출제 빈도를 보장한다는 뜻은 아닙니다.

| 표시 | 읽는 깊이 |
| --- | --- |
| 핵심 | 정의·비교표·짧은 코드 결과를 설명합니다. |
| 보충 | 비슷한 기능과의 차이를 확인합니다. |
| 선택 심화 | 이름과 목적을 먼저 익히고 구현 세부사항은 다음 회독으로 미룹니다. |

**기본 예제는 자바 21의 정식 기능**을 기준으로 합니다. 083번의 스트림 개더러는 자바 24 보충으로 분리했습니다. 최신 버전을 암기하기 위한 문서가 아니라, 각 버전에서 보장하는 동작을 구분하는 문서입니다.[^gatherers]

코드는 블록마다 독립적입니다. `public class Main` 형태는 클래스 전체를 보여줍니다. 짧은 명령문은 `main` 안에 넣고 필요한 패키지를 가져옵니다. 아래 패키지 지도와 각 절의 설명을 참고합니다. 입출력 예제의 `main`에는 학습 편의를 위해 `throws Exception`을 붙일 수 있습니다. 실제 프로그램에서는 처리할 수 있는 예외를 적절한 경계에서 처리합니다.

외부 연동 절의 **호출용 메서드**는 실행 진입점이 아닙니다. 서버·드라이버·데이터베이스 설정과 해당 메서드를 호출하는 코드가 필요하며, 이 글에서는 컴파일만 확인한 예제로 명시했습니다.

**자주 쓰는 패키지 지도**

| 패키지 | 사용하는 영역 |
| --- | --- |
| `java.lang` | 문자열·기본 래퍼·시스템 기능. 기본으로 가져옵니다. |
| `java.util` | 컬렉션·배열 도구·입력 분석기 등 |
| `java.math` | 큰 정수·정밀한 십진수 |
| `java.time`, `java.time.format` | 날짜·시간·형식 지정 |
| `java.util.function`, `java.util.stream` | 함수형 인터페이스·스트림 |
| `java.util.regex` | 정규 표현식 |
| `java.io`, `java.nio`, `java.nio.file` | 입출력·버퍼·파일 |
| `java.net`, `java.net.http` | 주소·소켓·웹 통신 |
| `java.sql`, `javax.sql` | 데이터베이스 연결 |

`import java.util.*;`는 `java.util.stream`까지 가져오지 않습니다. 하위 패키지는 별도로 가져옵니다.

<mark>이 편의 핵심은 메서드 이름을 많이 외우는 것이 아니라, 메서드의 반환값·변경 대상·실행 시점·예외 조건을 함께 읽는 것입니다.</mark>

## 전체 구성

| 부 | 범위 | 핵심 질문 |
| --- | --- | --- |
| [8부. 문자열·숫자·날짜·공통 유틸리티](#part-8) | 056~063 | 값의 내용·길이·정밀도·시간을 어떻게 다루는가? |
| [9부. 컬렉션과 자료구조](#part-9) | 064~073 | 순서·중복·조회·수정을 어떻게 관리하는가? |
| [10부. 람다·함수형 인터페이스·스트림](#part-10) | 074~083 | 처리 동작을 전달하고 데이터를 가공하는가? |
| [11부. 예외·자원 관리·입출력](#part-11) | 084~092 | 실패를 처리하고 자원을 언제 해제하는가? |
| [12부. 외부 시스템 연동](#part-12) | 093~100 | 통신·데이터베이스·보안·설정을 어떻게 연결하는가? |
| [잘 놓치는 핵심](#pitfalls) | 오개념 비교 | 비슷한 표현의 차이를 설명하는가? |
| [시험·면접](#exam) | 암기표·판별 순서 | 코드와 선지를 어떤 순서로 확인하는가? |
| [예시로 한 바퀴](#walkthrough) | 통합 예제 | 읽기·검증·저장·가공을 연결하는가? |
| [객관식 문제](#questions) | 25문제 | 모든 선택지의 근거를 설명하는가? |

<span id="part-8"></span>

## 8부. 문자열·숫자·날짜·공통 유틸리티

### 056. 문자열의 불변성과 문자열 풀

**문자열은 문자들의 순서를 나타내는 객체이며, `String`의 내용은 생성 후 바뀌지 않습니다.** 변수에 다른 문자열을 대입하는 것과 기존 객체의 내용을 바꾸는 것은 다릅니다.[^string][^expressions]

```java
String 원본 = "자바";
String 별칭 = 원본;
원본 = 원본 + " 공부";
System.out.println(원본);
System.out.println(별칭);
```

출력:

```text
자바 공부
자바
```

`원본`이 가리키는 대상이 바뀌었을 뿐입니다. `별칭`이 가리키던 문자열은 그대로입니다.

**문자열 풀**은 같은 내용의 문자열에 대한 대표 참조를 재사용하는 구조입니다. 리터럴과 문자열 상수 표현식은 풀의 문자열을 사용합니다.

```java
String 첫째 = "자바";
String 둘째 = "자" + "바";
String 셋째 = new String("자바");
String 앞 = "자";
String 넷째 = 앞 + "바";

System.out.println(첫째 == 둘째);
System.out.println(첫째 == 셋째);
System.out.println(첫째.equals(셋째));
System.out.println(첫째 == 넷째);
System.out.println(첫째 == 셋째.intern());
```

출력:

```text
true
false
true
false
true
```

| 비교 | 질문 |
| --- | --- |
| `==` | 같은 객체를 가리키는 참조인가? |
| `equals` | 문자열의 내용이 같은가? |
| `intern()` | 같은 내용에 대한 풀의 대표 참조는 무엇인가? |

일반 지역 변수 `앞`을 이용한 연결은 위 코드에서 상수 표현식이 아닙니다. `final String 앞 = "자";`처럼 컴파일타임 상수로 선언한 경우와 구분합니다.

**시험 포인트:** 문자열 메서드를 호출했다고 변수가 자동으로 새 결과를 저장하는 것은 아닙니다. `문장.replace(...)`의 결과가 필요하면 반환값을 사용해야 합니다.

### 057. 문자열 처리와 문자 표현

문자열의 위치는 **0부터 시작**합니다. 부분 문자열에서 시작 위치는 포함하고 끝 위치는 제외합니다.[^string]

```java
String 문장 = "가나다라마";
System.out.println(문장.length());
System.out.println(문장.charAt(1));
System.out.println(문장.substring(1, 4));
System.out.println(문장.indexOf("바"));
System.out.println(문장.replace("나", "너"));
System.out.println(문장);
```

출력:

```text
5
나
나다라
-1
가너다라마
가나다라마
```

| 기능 | 대표 메서드 | 확인할 점 |
| --- | --- | --- |
| 길이·위치 | `length`, `charAt`, `substring` | 배열은 `length`, 문자열은 `length()`입니다. |
| 검색 | `indexOf`, `lastIndexOf`, `contains` | 위치 검색 실패는 `-1`입니다. |
| 비었는지 | `isEmpty`, `isBlank` | 길이 0과 공백만 있는 상태를 구분합니다. |
| 양끝 공백 | `trim`, `strip` | `trim`은 문자값 32 이하, `strip`은 자바의 유니코드 공백 판정을 사용합니다. |
| 치환 | `replace`, `replaceAll`, `replaceFirst` | 뒤의 두 메서드는 정규 표현식을 사용합니다. |
| 분리·결합 | `split`, `String.join` | `split`의 구분자는 정규 표현식입니다. |
| 여러 줄 | 텍스트 블록, `lines` | 텍스트 블록도 `String`입니다. 들여쓰기·마지막 줄바꿈을 확인합니다. |

**분리 뒤 빈 문자열**

```java
System.out.println(Arrays.toString("가,나,,".split(",")));
System.out.println(Arrays.toString("가,나,,".split(",", -1)));
System.out.println(Arrays.toString("가.나".split("\\.")));
```

출력:

```text
[가, 나]
[가, 나, , ]
[가, 나]
```

기본 `split`은 뒤에 붙은 빈 문자열을 버립니다. 음수 제한값을 주면 보존합니다. 마침표 자체로 나누려면 정규 표현식의 특별한 의미를 없애야 합니다.[^regex]

**문자 개수와 바이트 개수는 다릅니다.**

```java
String 문자 = "가😀";
System.out.println(문자.length());
System.out.println(문자.codePointCount(0, 문자.length()));
System.out.println(문자.getBytes(StandardCharsets.UTF_8).length);
```

출력:

```text
3
2
7
```

| 단위 | 위 예제 | 뜻 |
| --- | --- | --- |
| `char` 코드 단위 | 3 | 보충 문자인 이모지가 두 코드 단위를 사용합니다. |
| 코드 포인트 | 2 | 유니코드 번호 기준으로 셉니다. |
| 지정 인코딩의 바이트 | 7 | 한글 3바이트와 해당 이모지 4바이트입니다. |

결합 문자·복합 이모지에서는 **눈에 보이는 글자 수와 코드 포인트 수도 다를 수 있습니다.** 문자열의 논리적 문자 표현과 구현체의 내부 저장 배열 형식까지 같은 개념으로 외우지 않습니다.[^normalizer]

### 058. 문자열을 만드는 방법

`StringBuilder`와 `StringBuffer`는 문자열을 누적하면서 내용을 바꿀 수 있는 객체입니다. 여러 조각을 반복해서 붙일 때 사용합니다.[^builder][^bufferstring]

| 구분 | 내용 변경 | 동기화 | 기본 용도 |
| --- | --- | --- | --- |
| `String` | 불가능 | 불변 값의 공유에 유리 | 완성된 문자열 |
| `StringBuilder` | 가능 | 자체 동기화 보장 없음 | 한 작업 안에서 문자열 누적 |
| `StringBuffer` | 가능 | 관련 메서드 동기화 | 공유 변경에 대한 동기화가 필요한 경우 |

```java
StringBuilder 누적 = new StringBuilder("가");
누적.append("나").append(3);
누적.insert(1, "!");
String 저장 = 누적.toString();
누적.append("끝");
System.out.println(저장);
System.out.println(누적);
System.out.println(누적.length());
```

출력:

```text
가!나3
가!나3끝
5
```

`toString()`으로 받은 문자열은 이후 버퍼 변경에 따라 같이 바뀌지 않습니다.

**보충:** `StringBuilder`는 문자열 내용을 비교하는 `equals`를 재정의하지 않습니다. 내용을 비교하려면 필요한 경우 `toString()` 결과를 비교합니다.

**왜 필요한가:** 반복문에서 기존 긴 문자열 전체에 계속 덧붙이면 누적 복사 비용이 커질 수 있습니다. 다만 컴파일러 최적화가 있으므로 “모든 `+`는 언제나 느리다” 또는 “연결은 반드시 특정 클래스로 변환된다”라고 단정하지 않습니다.[^string]

`String.format`, `formatted`, `printf`는 형식을 지정할 때 사용합니다. 정수는 `%d`, 문자열은 `%s`, 소수점 둘째 자리까지는 `%.2f`처럼 지정합니다. 숫자 표현은 지역 설정의 영향을 받을 수 있습니다.

### 059. 정규 표현식

**정규 표현식**은 문자열이 어떤 모양인지 검사하거나, 특정 모양의 부분을 찾는 규칙입니다. `Pattern`은 규칙, `Matcher`는 특정 입력에서 그 규칙을 적용하는 상태를 담당합니다.[^regex][^matcher]

| 규칙 | 의미 | 자바 문자열 예시 |
| --- | --- | --- |
| `[0-9]` | 숫자 한 자리 | `"[0-9]"` |
| `+` | 앞 규칙 1회 이상 | `"[0-9]+"` |
| `*` | 앞 규칙 0회 이상 | `"[0-9]*"` |
| `?` | 앞 규칙 0회 또는 1회 | `"[0-9]?"` |
| `{2,4}` | 앞 규칙 2~4회 | `"[0-9]{2,4}"` |
| `.` | 기본적으로 줄 종결자를 제외한 임의의 문자 | `"."` |
| `^`, `$` | 시작·끝 관련 경계 | `"^[0-9]+$"` |
| `(...)` | 그룹 | `"([0-9]+)개"` |
| `\d`, `\s`, `\b` | 숫자·공백·단어 경계 | `"\\d+"`, `"\\s+"`, `"\\b"` |

```java
Pattern 규칙 = Pattern.compile("([0-9]+)개");
Matcher 검사 = 규칙.matcher("사과 12개");
System.out.println(검사.matches());
System.out.println(검사.find());
System.out.println(검사.group(1));
```

출력:

```text
false
true
12
```

`matches()`는 전체 일치, `find()`는 다음 일치 부분 검색입니다. `group(0)`은 일치 전체이고 `group(1)`은 첫 번째 괄호입니다. 일치가 성공하기 전에 그룹을 읽으면 상태 오류가 날 수 있습니다.

**보충:** `.*`는 가능한 길게, `.*?`는 필요한 만큼 짧게 맞추려는 방식입니다. 이런 차이는 주변 규칙과 함께 판단합니다. 사용자 입력을 규칙의 글자 그대로 취급하려면 `Pattern.quote`를, 치환 문자열의 특별한 해석을 피하려면 `Matcher.quoteReplacement`를 검토합니다.

입력 길이와 규칙을 제한하지 않으면 복잡한 역추적으로 시간이 크게 늘어날 수 있습니다. 같은 규칙을 반복 사용하면 미리 컴파일한 `Pattern`을 재사용할 수 있지만, 변경 상태를 가진 `Matcher`를 여러 작업이 무분별하게 공유하지 않습니다.

### 060. 수학 연산과 큰 정수

`Math`는 기본 수학 연산을 제공합니다. `BigInteger`는 기본 정수형의 범위를 넘어서는 정수를 다룹니다. 큰 정수도 메모리와 구현상 제한까지 없는 것은 아닙니다.[^math][^biginteger]

```java
System.out.println(Math.floor(-2.3));
System.out.println(Math.ceil(-2.3));
System.out.println(Math.round(-2.5));
System.out.println(Math.abs(Integer.MIN_VALUE));
System.out.println(new BigInteger("9223372036854775808").add(BigInteger.ONE));
```

출력:

```text
-3.0
-2.0
-2
-2147483648
9223372036854775809
```

| 기능 | 기준 | 함정 |
| --- | --- | --- |
| `floor` | 해당 값 이하의 가장 큰 정수값 | 음수에서는 절댓값이 커질 수 있습니다. |
| `ceil` | 해당 값 이상의 가장 작은 정수값 | 음수에서는 0 쪽으로 갈 수 있습니다. |
| `round` | 가장 가까운 정수, 중간값은 양의 무한대 방향 | 단순히 소수부를 없애는 것이 아닙니다. |
| 정수 캐스팅 | 소수부를 0 방향으로 버림 | 음수에서 `floor`와 다릅니다. |
| `addExact`, `multiplyExact` | 기본 정수형의 넘침을 검사 | 넘치면 `ArithmeticException`입니다. |
| `abs` | 절댓값 | 최소 정수의 양수 대응값은 같은 타입에 없습니다. |

`BigInteger`는 불변입니다. `add`, `subtract`, `multiply`, `divide`, `remainder`, `pow`, `gcd` 등의 **반환값**을 사용합니다. `divide`는 정수 몫을 구합니다.

**선택 심화:** `StrictMath`는 지정된 수학 함수의 재현성에 관한 더 엄격한 계약을 제공합니다. 자바 17부터 부동소수점 식은 항상 엄격하게 평가되므로 `strictfp`의 과거 역할과 구분합니다. 부호 없는 비교·나눗셈은 `Integer.compareUnsigned`, `divideUnsigned` 같은 메서드로 다루며 새로운 기본형이 생기는 것은 아닙니다.[^strictmath][^strictfp]

### 061. 정밀한 십진수 계산

`BigDecimal`은 십진수 값과 소수 자릿수 정보를 다루는 불변 객체입니다. 정확한 십진수 입력이 중요하면 문자열을 사용하거나 목적에 맞게 `valueOf`를 사용합니다.[^decimal]

```java
BigDecimal 첫째 = new BigDecimal("2.0");
BigDecimal 둘째 = new BigDecimal("2.00");
System.out.println(첫째.equals(둘째));
System.out.println(첫째.compareTo(둘째));
System.out.println(new BigDecimal("0.1").add(new BigDecimal("0.2")));
System.out.println(new BigDecimal("1").divide(new BigDecimal("3"), 2, RoundingMode.HALF_UP));
```

출력:

```text
false
0
0.3
0.33
```

| 개념 | 뜻 | 예시 |
| --- | --- | --- |
| `scale` | 소수 자릿수에 대응하는 정보 | `2.00`의 경우 2입니다. 음수일 수도 있습니다. |
| `precision` | 값의 유효 숫자 개수 | `2.00`의 경우 3입니다. |
| `equals` | 숫자값과 `scale`을 함께 비교 | `2.0`과 `2.00`은 다릅니다. |
| `compareTo` | 숫자 크기 비교 | 둘의 비교 결과는 0입니다. |
| `setScale` | 소수 자릿수 조절 | 필요한 경우 반올림 방법을 지정합니다. |
| `MathContext` | 유효 숫자 개수와 반올림 정책 | 소수점 아래 자리만 지정하는 것이 아닙니다. |

`new BigDecimal(0.1)`은 이미 근사값인 `double` 값을 정확히 옮깁니다. 사용자가 의도한 십진수 `0.1`과 같다고 단정하면 안 됩니다.

`1 ÷ 3`처럼 끝나지 않는 십진수 나눗셈은 정밀도·반올림 지정 없이 정확한 결과를 요구하면 예외가 생깁니다. `DOWN`은 0 방향, `FLOOR`는 음의 무한대 방향입니다.

<mark>정밀한 숫자 클래스를 쓴다는 것과 반올림 기준이 자동으로 결정된다는 것은 다릅니다.</mark>

### 062. 날짜와 시간

날짜, 시각, 시간대, 경과 시간은 서로 다른 정보입니다. `java.time`의 주요 값 클래스는 불변이므로 변경 연산의 반환값을 사용합니다.[^time][^datetimeformat]

| 클래스 | 나타내는 값 | 예시·주의 |
| --- | --- | --- |
| `LocalDate` | 날짜 | 년·월·일 |
| `LocalTime` | 하루 안의 시각 | 시·분·초 |
| `LocalDateTime` | 날짜와 시각 | 시간대 없이 하나의 세계 공통 순간을 확정하지 못합니다. |
| `Instant` | 시간선 위의 한 순간 | 사건 시각 저장·비교 |
| `ZoneId` | 지역의 시간대 규칙 | `Asia/Seoul` |
| `ZoneOffset` | 기준 시각과의 고정 차이 | `+09:00` |
| `ZonedDateTime` | 날짜·시각과 지역 시간대 | 지역 규칙을 적용합니다. |
| `OffsetDateTime` | 날짜·시각과 오프셋 | 지역 규칙 자체와는 다릅니다. |
| `Duration` | 초·나노초 기반 시간량 | 24시간처럼 정확한 시간량 |
| `Period` | 년·월·일 기반 날짜량 | 달력의 하루·한 달 |
| `Clock` | 현재 시각을 제공하는 추상화 | 고정 시계를 사용해 테스트할 수 있습니다. |

```java
LocalDate 날짜 = LocalDate.of(2024, 1, 31);
System.out.println(날짜.plusMonths(1));
System.out.println(날짜);
System.out.println(Period.between(LocalDate.of(2024, 1, 31), LocalDate.of(2024, 3, 2)));
System.out.println(java.time.temporal.ChronoUnit.DAYS.between(
        LocalDate.of(2024, 1, 31), LocalDate.of(2024, 3, 2)));
```

출력:

```text
2024-02-29
2024-01-31
P1M2D
31
```

`Period`의 일 부분과 전체 경과 일수는 다릅니다. 한 달과 이틀을 단순히 이틀로 읽으면 안 됩니다.

**형식 지정:** `DateTimeFormatter.ofPattern("uuuu-MM-dd")`처럼 사용합니다. `MM`은 월, `mm`은 분입니다. `uuuu`는 연도, `yyyy`는 연호 내 연도, `YYYY`는 주 기반 연도이므로 연말·연초에서 차이가 날 수 있습니다.

**보충:** 일광절약시간을 사용하는 지역에서는 달력상의 하루와 정확한 24시간 뒤가 다를 수 있습니다. 기존 `java.util.Date`는 `toInstant`, `Date.from`으로 연결합니다. 기존 `Calendar`의 월은 0부터 시작하지만 `LocalDate.of`의 월은 1부터 시작합니다.[^zoneddatetime][^calendar]

### 063. 공통 유틸리티와 난수

`Objects`는 널 검사와 객체 비교를, `Arrays`는 배열의 정렬·검색·복사·출력을 돕습니다.[^objects][^arrays]

```java
String 이름 = null;
System.out.println(Objects.equals(이름, "가"));
System.out.println(Objects.equals(null, null));
int[] 수들 = {7, 2, 5};
Arrays.sort(수들);
System.out.println(Arrays.toString(수들));
System.out.println(Arrays.binarySearch(수들, 4));
System.out.println(Arrays.toString(Arrays.copyOf(수들, 5)));
```

출력:

```text
false
true
[2, 5, 7]
-2
[2, 5, 7, 0, 0]
```

4의 삽입 위치는 1입니다. 찾지 못하면 **음수 삽입 위치에서 다시 1을 뺀 값**을 반환하므로 `-2`입니다. 정렬되지 않은 배열에 같은 검색을 적용한 결과는 믿을 수 없습니다.

| 도구 | 역할 | 주의 |
| --- | --- | --- |
| `Objects.requireNonNull` | 널이면 즉시 예외 발생 | 널을 자동으로 대체하지 않습니다. |
| `Objects.requireNonNullElse` | 널일 때 대체값 사용 | 대체값 역시 널일 수 없습니다. |
| `Arrays.equals` | 일차원 배열의 요소 비교 | 배열 객체의 `equals`와 다릅니다. |
| `Arrays.deepEquals` | 중첩 배열을 재귀적으로 비교 | 참조 배열에 사용합니다. |
| `Arrays.copyOf`, `System.arraycopy` | 배열 요소 복사 | 참조형 요소의 내부 객체까지 깊게 복사하지 않습니다. |
| `UUID` | 식별자 | 생성 방식·충돌 가능성과 보안 비밀 용도를 구분합니다. |
| `Base64`, `HexFormat` | 바이트의 문자 표현 | 암호화가 아닙니다. |
| `Random`, `RandomGenerator` | 일반 난수 생성 | 시뮬레이션과 보안 비밀값을 구분합니다. |
| `SecureRandom` | 보안 목적의 난수 | 예측 가능한 고정 시드로 보안성을 훼손하지 않습니다. |

`nextInt(6)`의 결과 범위는 0~5입니다. 주사위 눈을 만들면 1을 더합니다. 같은 시드로 재현 가능한 실험을 하는 것과, 공격자가 예측하기 어려운 값을 만드는 것은 목적이 다릅니다.[^random][^securerandom][^base64]

<details markdown="1">
<summary>8부 한 줄로</summary>

문자열은 내용이 바뀌지 않고, 문자 길이와 바이트 길이는 다르며, 숫자 비교·반올림·시간대는 기준을 명시해야 합니다.

</details>

<span id="part-9"></span>

## 9부. 컬렉션과 자료구조

### 064. 컬렉션의 전체 계층

**컬렉션은 여러 요소를 저장하고 다루는 표준 구조**입니다. 인터페이스는 사용할 기능과 계약을, 구현 클래스는 실제 저장 방식을 제공합니다.[^collection][^list][^map]

```text
Iterable
└─ Collection
   ├─ List: 위치·순서를 다루는 목록
   ├─ Set: 중복을 제한하는 집합
   └─ Queue
      └─ Deque: 양끝에서 넣고 꺼내는 구조

Map: 키와 값의 대응을 저장하는 별도 계층
```

위 그림은 기본 분류입니다. 자바 21에는 순서형 인터페이스도 연결되며, 자세한 관계는 072번에서 다룹니다.

| 구분 | 중복 | 순서·조회 | 대표 구현 |
| --- | --- | --- | --- |
| `List` | 보통 허용 | 위치로 접근 | `ArrayList`, `LinkedList` |
| `Set` | 제한 | 순서는 구현체에 따름 | `HashSet`, `LinkedHashSet`, `TreeSet` |
| `Queue` | 보통 허용 | 정해진 꺼내기 규칙 | `ArrayDeque`, `PriorityQueue` |
| `Map` | 키 중복 제한, 값 중복 허용 | 키로 값 조회 | `HashMap`, `LinkedHashMap`, `TreeMap` |

```java
List<String> 이름들 = new ArrayList<>();
이름들.add("민수");
이름들.add("민수");
System.out.println(이름들.size());
System.out.println(이름들.contains("민수"));
```

출력:

```text
2
true
```

`Collection`은 인터페이스이고 `Collections`는 여러 정적 도구를 모은 클래스입니다. 둘은 이름만 비슷합니다.

**시험 포인트:** 모든 컬렉션이 `null`을 허용하는 것은 아닙니다. 모든 구현체가 추가·삭제를 지원하는 것도 아닙니다. `Map` 자체는 `Collection`의 하위 인터페이스가 아니지만, 키·값·엔트리를 컬렉션 뷰로 제공합니다.

### 065. 리스트

`ArrayList`는 크기를 늘릴 수 있는 배열 기반 목록입니다. `LinkedList`는 양방향 연결 구조이며 목록과 덱의 기능을 제공합니다.[^arraylist][^linkedlist]

| 비교 | `ArrayList` | `LinkedList` |
| --- | --- | --- |
| 특정 인덱스 조회 | 바로 접근 | 가까운 끝에서 연결을 따라감 |
| 맨 뒤 추가 | 여러 번을 묶어 보면 평균적으로 상수 시간 | 끝 연결을 조정 |
| 중간 추가·삭제 | 뒤쪽 요소 이동 | 위치를 찾은 뒤 연결 조정 |
| 위치 찾기 | 인덱스 접근이 빠름 | 탐색 비용이 생길 수 있음 |
| 양끝 작업 | 앞쪽 변경 시 이동 비용 | 양끝 처리에 적합 |

<mark>연결 리스트의 중간 삭제가 빠르다는 말에는 삭제할 위치를 이미 알고 있다는 조건이 중요합니다.</mark>

**크기와 용량**

`new ArrayList<>(100)`은 저장 공간의 초기 용량을 지정합니다. 요소 100개가 들어간 목록이 아닙니다. `size()`는 0입니다.

**삭제 메서드의 중복 정의**

```java
List<Integer> 수들 = new ArrayList<>(List.of(10, 20, 10));
System.out.println(수들.remove(1));
System.out.println(수들);
System.out.println(수들.remove(Integer.valueOf(10)));
System.out.println(수들);
```

출력:

```text
20
[10, 10]
true
[10]
```

| 호출 | 뜻 | 반환 |
| --- | --- | --- |
| `remove(1)` | 인덱스 1을 삭제 | 삭제된 요소 |
| `remove(Integer.valueOf(10))` | 값 10과 같은 첫 요소 삭제 | 삭제 성공 여부 |
| `set(1, 값)` | 인덱스 1의 요소 교체 | 교체 전 요소 |
| `subList(시작, 끝)` | 지정 범위의 뷰 | 독립 복사본이 아님 |

`subList`를 거치지 않은 원본의 구조 변경 이후에는 뷰의 동작을 안전하다고 가정하지 않습니다. 독립 목록이 필요하면 `new ArrayList<>(부분목록)`처럼 만듭니다.

`Vector`와 `Stack`은 오래된 동기화 기반 클래스입니다. 스택 용도는 `Deque`를 검토합니다. 개별 메서드가 동기화된다고 여러 호출을 묶은 작업까지 자동으로 안전해지는 것은 아닙니다.

### 066. 집합

집합은 **중복 없는 요소 모음**입니다. 무엇을 중복으로 보는지와 어떤 순서를 보장하는지를 함께 확인합니다.[^hashset][^treeset][^enumset]

| 구현 | 중복 판정의 중심 | 순회 순서 | 널 |
| --- | --- | --- | --- |
| `HashSet` | `hashCode`와 `equals` | 보장하지 않음 | 허용 |
| `LinkedHashSet` | `hashCode`와 `equals` | 삽입 순서 등 정의된 순서 | 허용 |
| `TreeSet` | 자연 순서 또는 비교기에서 결과 0 | 정렬 순서 | 자연 순서 사용 시 불가 |
| `EnumSet` | 같은 열거형 상수 | 열거형 선언 순서 | 불가 |

`TreeSet`의 사용자 정의 비교기가 널을 지원하는 경우는 별도로 봅니다. “모든 집합은 널이 된다” 또는 “모든 집합은 안 된다”는 설명 모두 틀립니다.

```java
Set<String> 삽입순 = new LinkedHashSet<>();
삽입순.add("나");
삽입순.add("가");
System.out.println(삽입순.add("나"));
System.out.println(삽입순);
System.out.println(new TreeSet<>(삽입순));
```

출력:

```text
false
[나, 가]
[가, 나]
```

**정렬상 같음과 객체 동등성의 차이**

```java
BigDecimal 첫째 = new BigDecimal("2.0");
BigDecimal 둘째 = new BigDecimal("2.00");
Set<BigDecimal> 해시집합 = new HashSet<>(List.of(첫째, 둘째));
Set<BigDecimal> 정렬집합 = new TreeSet<>(List.of(첫째, 둘째));
System.out.println(해시집합.size());
System.out.println(정렬집합.size());
```

출력:

```text
2
1
```

이 예제에서는 `equals`와 `compareTo`의 기준이 다릅니다. 일반적인 집합 계약과 일관되게 사용하려면 정렬 기준과 동등성의 관계를 주의해야 합니다.

**집합 연산:** `addAll`은 합집합, `retainAll`은 교집합, `removeAll`은 차집합을 구성할 때 활용합니다. 이 메서드들은 호출 대상 집합을 변경하므로 원본을 보존할지 먼저 결정합니다.

### 067. 맵

맵은 **키 하나에 값 하나를 대응시키는 구조**입니다. 같은 키로 다시 넣으면 보통 기존 값이 교체됩니다. 값 자체는 여러 키에서 중복될 수 있습니다.[^map][^hashmap][^treemap]

```java
Map<String, Integer> 점수 = new LinkedHashMap<>();
System.out.println(점수.put("민수", 70));
System.out.println(점수.put("민수", 90));
점수.put("지수", 90);
점수.put("영희", null);
System.out.println(점수.size());
System.out.println(점수.getOrDefault("영희", 0));
System.out.println(점수.getOrDefault("철수", 0));
```

출력:

```text
null
70
3
null
0
```

`put`은 이전 값을 반환합니다. 이전 값이 널일 때는 **키가 없었는지, 널 값이 있었는지**를 반환값만으로 구분할 수 없습니다.

| 메서드 | 역할 | 함정 |
| --- | --- | --- |
| `get` | 키의 값 조회 | 키가 없을 때도 널이 나올 수 있음 |
| `containsKey` | 키의 존재 확인 | 값의 널 여부와 별개 |
| `getOrDefault` | 키가 없으면 기본값 | 널 값이 저장된 키는 널 반환 |
| `putIfAbsent` | 없거나 널 값이면 넣기 | 널 값도 처리 대상으로 봄 |
| `computeIfAbsent` | 없거나 널 값이면 계산 | 계산 결과가 널이면 새 매핑을 기록하지 않음 |
| `merge` | 값을 결합해 갱신 | 빈도 세기 등에 활용 |
| `keySet`, `values`, `entrySet` | 키·값·엔트리 뷰 | 원본 맵과 연결된 뷰 |

`HashMap`은 순서를 보장하지 않습니다. `LinkedHashMap`은 기본적으로 삽입 순서이며, 설정에 따라 접근 순서를 사용할 수 있습니다. `TreeMap`은 키를 정렬합니다. `EnumMap`은 한 열거형 타입의 키를 사용하고 널 키는 허용하지 않습니다.[^linkedhashmap][^enummap]

**널 허용과 동시성 비교**

| 구현체 | 널 키 | 널 값 | 동시성 관점 |
| --- | --- | --- | --- |
| `HashMap` | 허용 | 허용 | 자체 동기화 없음 |
| `Hashtable` | 불가 | 불가 | 개별 주요 연산이 동기화됨 |
| `ConcurrentHashMap` | 불가 | 불가 | 동시 접근용 연산을 제공 |

동시 접근용 맵이어도 `get` 후 계산하고 `put`하는 여러 단계를 자동으로 한 번의 연산으로 묶지는 않습니다. 목적에 맞는 `compute`·`merge` 등 연산의 계약을 확인합니다.[^hashmap][^hashtable][^concurrenthashmap]

**보충:** `NavigableMap`의 `lowerKey`, `floorKey`, `ceilingKey`, `higherKey`는 각각 미만·이하·이상·초과에서 가까운 키를 찾습니다. 이 기능은 단순 해시 조회와 다릅니다.

### 068. 해시 기반 컬렉션의 내부 원리

해시 구조는 키의 해시값으로 저장 위치 후보를 좁힌 뒤, 동등성 비교로 실제 키를 확인합니다. **해시값이 같다는 것만으로 같은 키는 아닙니다.**[^hashmap][^object]

```text
키 입력
  ↓
해시값 계산
  ↓
버킷 후보 선택
  ↓
그 안에서 동등한 키 확인
  ↓
조회·삽입·갱신
```

| 개념 | 뜻 |
| --- | --- |
| 해시 충돌 | 서로 다른 키가 같은 버킷 후보로 모이는 현상 |
| 버킷 | 요소들을 배치하는 위치 단위 |
| 적재율 | 저장 개수와 내부 용량의 관계를 관리하는 기준 |
| 크기 확장 | 요소 증가에 따라 내부 공간을 늘리고 배치를 조정 |
| 트리화 | 특정 구현에서 충돌 요소를 트리로 관리하는 최적화 |

**가변 키의 문제**

```java
List<Integer> 키 = new ArrayList<>(List.of(1));
Map<List<Integer>, String> 자료 = new HashMap<>();
자료.put(키, "저장");
System.out.println(자료.get(List.of(1)));
키.add(2);
System.out.println(자료.keySet().iterator().next());
```

출력:

```text
저장
[1, 2]
```

맵에 넣은 뒤 키의 내용이 바뀌었습니다. 그 내용이 `equals`·`hashCode`에 사용되면 저장 당시 기준과 조회 기준이 어긋날 수 있습니다. **이후 조회가 어떻게 실패하는지까지 일반 규칙으로 단정하지 않고, 이런 키 변경을 피합니다.**

평균적인 빠른 조회는 좋은 해시 분산 등의 조건을 전제로 합니다. 충돌이 많아도 무조건 동일한 시간이라고 외우면 안 됩니다.

**선택 심화:** 특정 개발 도구 버전의 버킷 개수·트리화 임계값은 구현 세부사항입니다. 언어 자체의 불변 규칙처럼 암기하지 않습니다.

### 069. 큐·덱·우선순위 큐

**큐**는 정해진 규칙에 따라 요소를 꺼내는 구조이고, **덱**은 양끝을 다룹니다. 우선순위 큐는 먼저 넣은 순서보다 비교 기준을 우선합니다.[^deque][^priorityqueue]

`PriorityQueue`는 **우선순위 힙**을 기반으로 합니다. 맨 앞에서 우선순위가 높은 요소를 찾는 구조이지, 내부의 모든 요소를 왼쪽부터 완전히 정렬해 둔 목록은 아닙니다. 기본 자연 순서를 쓰는 정수 큐에서는 작은 값이 먼저 나옵니다.[^priorityqueue]

| 목적 | 동작 | 대표 메서드 |
| --- | --- | --- |
| 선입선출 | 먼저 넣은 것을 먼저 꺼냄 | `offerLast`, `pollFirst` |
| 후입선출 | 나중에 넣은 것을 먼저 꺼냄 | `push`, `pop` |
| 앞 확인 | 제거하지 않고 확인 | `peekFirst` |
| 뒤 확인 | 제거하지 않고 확인 | `peekLast` |

| 상황 | 예외를 쓰는 형태 | 특별한 반환값을 쓰는 형태 |
| --- | --- | --- |
| 넣기 | `add` | `offer` |
| 꺼내기 | `remove` | `poll` |
| 확인 | `element` | `peek` |

빈 큐의 `remove`·`element`는 예외, `poll`·`peek`는 널을 반환합니다. `offer`도 잘못된 요소 등 모든 오류를 무조건 `false`로 바꾸는 것은 아닙니다.

```java
Deque<Integer> 대기 = new ArrayDeque<>();
대기.offerLast(10);
대기.offerLast(20);
System.out.println(대기.pollFirst());
대기.push(30);
System.out.println(대기.pop());
System.out.println(대기.peekFirst());
```

출력:

```text
10
30
20
```

`ArrayDeque`는 널 요소를 허용하지 않습니다.

```java
Queue<Integer> 우선 = new PriorityQueue<>();
우선.offer(30);
우선.offer(10);
우선.offer(20);
while (!우선.isEmpty()) {
    System.out.println(우선.poll());
}
```

출력:

```text
10
20
30
```

기본 자연 순서에서는 작은 값부터 꺼냅니다. 비교기를 반대로 지정하면 큰 값 우선으로 바꿀 수 있습니다. **반복자로 순회하거나 목록처럼 출력한 결과 전체가 정렬되어 있다고 보장하지 않습니다.** 동일 우선순위 요소의 선입선출도 보장하지 않습니다.

### 070. 정렬과 비교 계약

`Comparable`은 객체 자신의 자연 순서를, `Comparator`는 외부에서 지정하는 순서를 나타냅니다.[^comparator][^comparable]

| 비교 결과 | 의미 |
| --- | --- |
| 음수 | 첫 번째가 앞에 옴 |
| 0 | 정렬 기준상 동순위 |
| 양수 | 첫 번째가 뒤에 옴 |

음수·양수의 **부호**가 중요합니다. 반드시 `-1`, `0`, `1`만 반환해야 하는 것은 아닙니다.

```java
List<String> 이름들 = new ArrayList<>(List.of("다다", "나", "가가", "가"));
이름들.sort(Comparator.comparingInt(String::length)
        .thenComparing(Comparator.naturalOrder()));
System.out.println(이름들);
```

출력:

```text
[가, 나, 가가, 다다]
```

먼저 길이, 길이가 같으면 문자 순서로 비교합니다. `reversed()`를 어느 위치에 붙이는지에 따라 앞 기준만 뒤집을지 전체 조합을 뒤집을지가 달라집니다.

**뺄셈 비교는 넘칠 수 있습니다.** `첫째 - 둘째` 대신 `Integer.compare(첫째, 둘째)` 또는 비교기 조합을 사용합니다. 비교 규칙은 대칭적 부호와 추이성 등 계약을 지켜야 합니다.

| 보충 개념 | 핵심 |
| --- | --- |
| 안정 정렬 | 동순위 요소의 기존 순서를 유지 |
| 널 처리 | `nullsFirst`, `nullsLast`로 의도를 지정 |
| 이진 검색 | 정렬할 때 사용한 기준과 검색 기준을 맞춤 |
| 동등성 | 정렬 결과 0과 `equals`가 항상 같지는 않음 |

목록 정렬과 객체 배열 정렬의 안정성 계약을 확인합니다. 기본형 배열에는 객체 정체성이 없으므로 같은 방식의 안정성 문제로 단순 비교하지 않습니다.[^list][^arrays]

### 071. 순회와 수정 정책

반복 중에 컬렉션을 바꾸려면 **그 반복 방식이 허용하는 수정 경로**를 사용해야 합니다.[^iterator][^arraylist][^copyonwrite]

```java
List<Integer> 수들 = new ArrayList<>(List.of(1, 2, 3, 4));
Iterator<Integer> 순회 = 수들.iterator();
while (순회.hasNext()) {
    if (순회.next() % 2 == 0) {
        순회.remove();
    }
}
System.out.println(수들);
수들.removeIf(값 -> 값 > 1);
System.out.println(수들);
```

출력:

```text
[1, 3]
[1]
```

`Iterator.remove()`는 직전에 `next()`로 받은 요소를 삭제합니다. `next()` 없이 호출하거나 같은 요소에 대해 두 번 삭제하면 상태 오류가 날 수 있습니다. 구현체가 삭제를 지원해야 합니다.

| 순회 정책 | 뜻 | 예시 |
| --- | --- | --- |
| 빠른 실패 | 허용되지 않은 구조 변경을 발견하면 예외로 알림 | 일반 목록·해시 구조의 반복자 |
| 스냅샷 | 반복 시작 시점의 복사된 상태를 봄 | 복사 기반 동시성 목록 |
| 약한 일관성 | 동시 변경과 함께 순회하되 하나의 고정 스냅샷은 보장하지 않음 | 일부 동시성 컬렉션 |

<blockquote class="prompt-warning">
<p>빠른 실패는 모든 잘못된 수정을 반드시 탐지한다는 보장이 아닙니다. 단일 스레드에서도 순회 중 원본을 직접 바꾸면 같은 종류의 문제가 생길 수 있습니다.</p>
</blockquote>

`ListIterator`는 앞뒤 이동, 교체, 삽입을 제공합니다. 향상된 반복문에서 반복 변수를 다른 객체로 재대입해도 목록의 해당 요소가 자동으로 교체되지는 않습니다. 요소 객체 내부를 바꾸는 것과 목록 구조를 바꾸는 것도 구분합니다.

### 072. 수정 불가·복사·뷰·순서 보장

**수정할 수 없는 통로, 원본과 분리된 목록, 내부 요소까지 바뀌지 않는 객체는 서로 다릅니다.**[^list][^collections][^arrays][^sequenced]

| 만드는 방법 | 추가·삭제 | 요소 교체 | 원본 구조 변경 반영 | 널 요소 |
| --- | --- | --- | --- | --- |
| `new ArrayList<>(원본)` | 가능 | 가능 | 반영하지 않음 | 허용 |
| `Arrays.asList(배열)` | 불가 | 가능 | 배열 요소와 연결 | 허용 |
| `Collections.unmodifiableList(원본)` | 불가 | 불가 | 원본 뷰이므로 반영 | 원본에 있으면 유지 |
| `List.of(...)` | 불가 | 불가 | 별도 원본 뷰가 아님 | 불가 |
| `List.copyOf(원본)` | 불가 | 불가 | 이후 원본 구조 변경은 반영하지 않음 | 불가 |

```java
List<String> 원본 = new ArrayList<>(List.of("가", "나"));
List<String> 뷰 = Collections.unmodifiableList(원본);
List<String> 복사 = List.copyOf(원본);
원본.set(0, "다");
System.out.println(뷰);
System.out.println(복사);
String[] 배열 = {"가", "나"};
List<String> 고정 = Arrays.asList(배열);
고정.set(1, "라");
System.out.println(Arrays.toString(배열));
```

출력:

```text
[다, 나]
[가, 나]
[가, 라]
```

`List.copyOf`가 항상 새 객체를 할당하는 것은 아닙니다. 이미 조건을 만족하는 목록이면 재사용할 수 있습니다. 위 표의 복사는 요소 객체 내부까지 깊게 복사한다는 의미가 아닙니다.

**기본형 배열의 함정**

```java
int[] 수들 = {1, 2, 3};
System.out.println(Arrays.asList(수들).size());
System.out.println(Arrays.stream(수들).boxed().toList().size());
```

출력:

```text
1
3
```

첫 목록에는 정수 세 개가 아니라 `int[]` 하나가 요소로 들어갑니다.

**순서형 컬렉션 — 자바 21 보충**

`SequencedCollection`·`SequencedSet`·`SequencedMap`은 정의된 만남 순서와 양끝 접근, 역순 뷰를 공통으로 다룹니다. 순서가 있다는 말이 정렬되어 있다는 뜻은 아닙니다.

```java
List<Integer> 원본 = new ArrayList<>(List.of(1, 2, 3));
List<Integer> 역순 = 원본.reversed();
역순.set(0, 9);
System.out.println(원본);
System.out.println(역순);
```

출력:

```text
[1, 2, 9]
[9, 2, 1]
```

`reversed()`는 여기서 연결된 뷰입니다. `Collections.reverse(목록)`처럼 목록 자체의 순서를 바꾸는 도구와 다릅니다. `Set.of`·`Map.of`는 삽입 순서를 보장하는 선택지가 아니며, 생성 인수에 중복 요소·중복 키가 있으면 예외가 발생할 수 있습니다.[^set][^map]

### 073. 특수 컬렉션과 선택 기준

모든 자료를 하나의 구조로 처리하기보다, **조회 방법·순서·변경 패턴·동시성**에 맞춰 고릅니다.[^weakhashmap][^identityhashmap][^concurrent]

| 구조 | 쓰는 이유 | 주의 |
| --- | --- | --- |
| `WeakHashMap` | 키가 다른 곳에서 더 이상 강하게 유지되지 않을 때 회수 가능 | 회수 시점·삭제 시점을 정확한 타이머처럼 사용하지 않음 |
| `IdentityHashMap` | 내용이 아닌 참조 동일성으로 키 구분 | 일반 맵의 동등성 계약과 의도적으로 다름 |
| `BitSet` | 여러 참·거짓 상태를 비트로 관리 | 고정 길이 논리형 배열과 모든 계약이 같지는 않음 |
| `ConcurrentHashMap` | 여러 스레드의 안전한 접근을 위한 맵 | 널 키·널 값 불가, 여러 호출 전체가 자동으로 원자적이지 않음 |
| `CopyOnWriteArrayList` | 읽기가 많고 수정이 적을 때 스냅샷 순회 | 수정마다 복사 비용, 반복자 수정 불가 |
| `BlockingQueue` | 생산자·소비자 사이에 대기 가능한 전달 | 용량·대기·종료 정책 필요 |

**시간 비용의 기본 지도**

| 작업 | 보통 먼저 검토하는 구조 | 조건 |
| --- | --- | --- |
| 위치로 자주 읽기 | `ArrayList` | 인덱스 접근 중심 |
| 앞뒤로 넣고 꺼내기 | `ArrayDeque` | 널 불가, 별도 동시성 보장 없음 |
| 키로 빠르게 찾기 | `HashMap` | 적절한 해시 분산 |
| 중복 제거 | `HashSet` | 동등성·해시 계약 준수 |
| 순서 유지하며 중복 제거 | `LinkedHashSet` | 삽입 순서 등 순서 규칙 확인 |
| 정렬·범위·가까운 값 찾기 | `TreeSet`, `TreeMap` | 일관된 비교 기준 |
| 가장 우선인 값부터 꺼내기 | `PriorityQueue` | 전체 정렬 출력과는 다름 |

**보충:** 해시 조회의 기대 상수 시간, 트리 연산의 로그 시간, 연결 탐색의 선형 시간을 구분합니다. 실제 성능에는 객체 할당·메모리 배치·데이터 크기도 영향을 줍니다. 복잡도 하나만으로 모든 상황의 승자를 정하지 않습니다.

<details markdown="1">
<summary>9부 한 줄로</summary>

위치가 필요하면 목록, 중복을 제한하면 집합, 키로 찾으면 맵, 꺼내는 규칙이 중요하면 큐·덱을 고르고, 원본 공유와 수정 가능성을 따로 확인합니다.

</details>

<span id="part-10"></span>

## 10부. 람다·함수형 인터페이스·스트림

### 074. 함수형 인터페이스와 람다

**람다 표현식은 전달할 동작을 짧게 적는 문법**입니다. 함수형 인터페이스의 추상 메서드에 맞춰 매개변수와 반환값을 정합니다.[^functional][^expressions]

```java
int 기준 = 3;
Predicate<String> 길이검사 = 문장 -> 문장.length() >= 기준;
System.out.println(길이검사.test("자바"));
System.out.println(길이검사.test("자바공부"));
```

출력:

```text
false
true
```

| 문법 | 의미 |
| --- | --- |
| `값 -> 값 * 2` | 값 하나를 받아 두 배 반환 |
| `(첫째, 둘째) -> 첫째 + 둘째` | 값 두 개를 받아 합 반환 |
| `() -> "완료"` | 인수 없이 결과 반환 |
| `값 -> { 처리; return 결과; }` | 여러 문장으로 동작 구성 |

**함수형 인터페이스**는 하나의 추상적인 함수 계약을 갖습니다. 기본·정적 메서드가 더 있어도 됩니다. 공개 `Object` 메서드와 대응하는 선언이나 상속된 동등한 선언을 단순 개수로 더하지 않는 세부 규칙도 있습니다. `@FunctionalInterface`는 조건을 검사하도록 의도를 표시하는 것이며, 붙이지 않아도 조건을 만족하면 함수형 인터페이스입니다.[^functionalinterface]

| 비교 | 람다 | 익명 클래스 |
| --- | --- | --- |
| 사용하는 대상 | 함수형 인터페이스 | 인터페이스·클래스 구현 가능 |
| `this` | 바깥 문맥의 의미를 유지 | 만들어진 익명 객체 자신 |
| 타입 결정 | 대입·인수 등의 타깃 타입 필요 | 생성할 타입을 명시 |
| 지역 변수 캡처 | `final` 또는 실질적 `final` | 같은 제한 적용 |

위 예제의 `기준`을 뒤에서 `기준++`로 바꾸면 캡처 조건을 어깁니다. 반면 `final` 참조가 가리키는 객체의 내부 상태 변경까지 자동으로 금지되는 것은 아닙니다.

`var 동작 = 값 -> 값 + 1;`처럼 타깃 타입 없이 람다만으로 변수를 추론할 수는 없습니다. 함수형 인터페이스의 타입을 알려줘야 합니다.

### 075. 표준 함수형 인터페이스

표준 함수형 인터페이스는 **무엇을 입력받고 무엇을 반환하는가**로 분류하면 외우기 쉽습니다.[^functional]

| 인터페이스 | 입력 | 반환 | 대표 메서드 |
| --- | --- | --- | --- |
| `Predicate<T>` | 값 하나 | 참·거짓 | `test` |
| `Function<T, R>` | 값 하나 | 다른 값 | `apply` |
| `Consumer<T>` | 값 하나 | 없음 | `accept` |
| `Supplier<T>` | 없음 | 값 하나 | `get` |
| `UnaryOperator<T>` | 값 하나 | 같은 타입의 값 | `apply` |
| `BinaryOperator<T>` | 같은 타입의 값 두 개 | 같은 타입의 값 | `apply` |
| `BiFunction<T, U, R>` | 값 두 개 | 결과 하나 | `apply` |
| `IntPredicate` | 기본 정수 | 참·거짓 | `test` |
| `ToIntFunction<T>` | 객체 | 기본 정수 | `applyAsInt` |

```java
Function<Integer, Integer> 두배 = 값 -> 값 * 2;
Function<Integer, Integer> 셋더하기 = 값 -> 값 + 3;
System.out.println(두배.andThen(셋더하기).apply(4));
System.out.println(두배.compose(셋더하기).apply(4));
Predicate<Integer> 양수 = 값 -> 값 > 0;
Predicate<Integer> 짝수 = 값 -> 값 % 2 == 0;
System.out.println(양수.and(짝수).test(6));
```

출력:

```text
11
14
true
```

| 조합 | 순서 |
| --- | --- |
| `첫째.andThen(둘째)` | 첫째를 실행한 뒤 둘째 |
| `첫째.compose(둘째)` | 둘째를 실행한 뒤 첫째 |
| `조건.and(다른조건)` | 둘 다 참인지 단락 평가 |
| `조건.or(다른조건)` | 하나라도 참인지 단락 평가 |
| `조건.negate()` | 결과 반전 |

기본형 특화 인터페이스는 불필요한 박싱을 줄일 수 있습니다.

**검사 예외:** 표준 `Function.apply`에는 임의의 검사 예외를 던진다는 선언이 없습니다. 람다 안에서 검사 예외가 발생할 수 있는 메서드를 호출하면 내부 처리, 적절한 변환, 별도 함수형 인터페이스 등의 설계가 필요합니다. 람다라고 예외 검사 규칙이 사라지지 않습니다.[^exceptions]

### 076. 메서드 참조

메서드 참조는 이미 있는 메서드나 생성자를 함수형 인터페이스의 동작으로 연결하는 문법입니다. **참조를 만드는 시점과 연결된 메서드를 실행하는 시점은 다릅니다.**[^expressions]

| 종류 | 예 | 대응하는 람다 |
| --- | --- | --- |
| 정적 메서드 | `Integer::parseInt` | `문자 -> Integer.parseInt(문자)` |
| 특정 객체의 메서드 | `System.out::println` | `값 -> System.out.println(값)` |
| 타입을 통한 인스턴스 메서드 | `String::length` | `문자 -> 문자.length()` |
| 생성자 | `ArrayList::new` | `() -> new ArrayList<>()` |
| 배열 생성자 | `String[]::new` | `개수 -> new String[개수]` |

```java
Function<String, Integer> 변환 = Integer::parseInt;
ToIntFunction<String> 길이 = String::length;
Supplier<List<String>> 목록생성 = ArrayList::new;
IntFunction<String[]> 배열생성 = String[]::new;
System.out.println(변환.apply("12") + 1);
System.out.println(길이.applyAsInt("자바"));
System.out.println(목록생성.get().size());
System.out.println(배열생성.apply(3).length);
```

출력:

```text
13
2
0
3
```

**시험 포인트:** `String::length`에서는 함수의 입력이 메서드를 호출할 객체가 됩니다. `String::compareTo`처럼 두 객체를 받으면 첫 번째 객체의 메서드에 두 번째 객체를 인수로 넘깁니다.

중복 정의된 메서드를 참조할 때는 타깃 함수형 인터페이스의 매개변수·반환 타입으로 후보를 판단합니다. 문법만 보고 호출될 메서드를 결정하지 않습니다.

### 077. 스트림의 실행 모델

**스트림은 자료 저장소가 아니라, 요소를 어떤 순서로 처리할지 연결한 계산 흐름**입니다. 컬렉션·배열·생성 함수·파일 등에서 요소를 얻습니다.[^streampackage][^stream]

```text
소스: 목록·배열·파일 등
  ↓
중간 연산: 걸러내기·변환·정렬 등
  ↓
최종 연산: 합계·목록 수집·출력 등
```

```java
Stream<Integer> 작업 = Stream.of(1, 2, 3)
        .filter(값 -> {
            System.out.println("검사 " + 값);
            return 값 % 2 == 1;
        })
        .map(값 -> 값 * 10);
System.out.println("준비");
System.out.println(작업.toList());
```

출력:

```text
준비
검사 1
검사 2
검사 3
[10, 30]
```

처리 흐름을 연결할 때가 아니라 최종 연산이 결과를 요구할 때 요소 처리가 진행됩니다. 단, 스트림을 만드는 식에서 수행한 일반 자바 코드까지 전부 지연된다는 뜻은 아닙니다.

| 성질 | 의미 |
| --- | --- |
| 지연 평가 | 중간 연산은 처리 계획을 연결 |
| 일회성 사용 | 같은 스트림을 소비한 뒤 다시 사용하지 않음 |
| 비간섭성 | 처리 도중 소스 자료구조를 잘못 변경하지 않음 |
| 상태 없는 함수 | 외부의 바뀌는 상태에 결과를 의존시키지 않는 것이 기본 |
| 최적화 허용 | 결과에 영향 없는 일부 중간 연산을 생략할 수 있음 |

다시 처리하려면 원본에서 **새 스트림**을 만듭니다. 이미 처리한 스트림을 `count()` 등으로 재사용하면 탐지되는 경우 `IllegalStateException`이 발생합니다.

**보충:** `Stream.generate`·`iterate`는 무한 흐름을 만들 수 있습니다. 종료 가능한 연산 구조를 갖춰야 합니다. `limit`이 있어도 그 앞 단계가 영원히 결과를 내지 못하면 끝나지 않을 수 있습니다.

위 예제의 출력은 실행 순서를 보기 위한 학습 장치입니다. 실제 데이터 누적을 중간 연산의 부수효과에 맡기는 방식은 피합니다.

### 078. 스트림 변환과 탐색

스트림 문제는 **연산 이름보다 요소가 어떻게 바뀌는지**를 한 단계씩 적으면 쉽게 풀 수 있습니다.[^stream]

```java
List<Integer> 결과 = Stream.of(3, 1, 3, 2, 4)
        .filter(값 -> 값 >= 2)
        .distinct()
        .sorted()
        .map(값 -> 값 * 10)
        .limit(2)
        .toList();
System.out.println(결과);
```

출력:

```text
[20, 30]
```

| 단계 | 남은 요소 |
| --- | --- |
| 원본 | 3, 1, 3, 2, 4 |
| 조건 | 3, 3, 2, 4 |
| 중복 제거 | 3, 2, 4 |
| 정렬 | 2, 3, 4 |
| 열 배 | 20, 30, 40 |
| 앞 두 개 | 20, 30 |

| 중간 연산 | 역할 |
| --- | --- |
| `filter` | 조건을 만족한 요소만 통과 |
| `map` | 요소 하나를 결과 하나로 변환 |
| `flatMap` | 요소를 스트림으로 바꾼 뒤 여러 흐름을 평탄화 |
| `mapMulti` | 요소 하나에서 결과를 0개 이상 직접 전달 |
| `distinct` | 동등한 요소의 중복 제거 |
| `sorted` | 순서 정렬 |
| `limit`, `skip` | 앞에서 개수 제한·건너뛰기 |
| `takeWhile`, `dropWhile` | 순서 있는 흐름의 처음 연속 구간을 조건으로 처리 |
| `peek` | 요소가 소비될 때 관찰용 동작. 실행 횟수 보장은 주의 |

```java
System.out.println(Stream.of(1, 2, 5, 3).filter(값 -> 값 < 4).toList());
System.out.println(Stream.of(1, 2, 5, 3).takeWhile(값 -> 값 < 4).toList());
System.out.println(Stream.of(1, 2, 5, 3).dropWhile(값 -> 값 < 4).toList());
System.out.println(Stream.of(List.of(1, 2), List.of(3))
        .flatMap(List::stream).toList());
```

출력:

```text
[1, 2, 3]
[1, 2]
[5, 3]
[1, 2, 3]
```

`takeWhile`는 중간에 조건을 어긴 5를 만난 뒤의 3을 다시 살리지 않습니다.

| 최종 연산 | 빈 스트림에서의 결과·성질 |
| --- | --- |
| `count` | 0 |
| `anyMatch` | `false` |
| `allMatch` | `true` |
| `noneMatch` | `true` |
| `findFirst`, `findAny`, `min`, `max` | 빈 선택값 반환 |
| `forEach` | 요소별 처리 |

**시험 함정:** 빈 흐름의 `allMatch`는 거짓인 반례가 없으므로 참입니다. `findAny`는 항상 첫 요소라는 보장이 없습니다. `peek`에 넣은 작업은 최적화나 단락 종료로 생략될 수 있으므로 반드시 필요한 처리를 넣지 않습니다.

### 079. 축약과 수집

**축약은 여러 요소를 하나의 결과로 합치는 것**입니다. `reduce`는 값의 결합을, `collect`는 누적 통에 모으는 가변 축약을 표현할 때 사용합니다.[^streampackage][^collectors]

```java
int 합 = Stream.of(1, 2, 3).reduce(0, Integer::sum);
String 연결 = Stream.of("가", "나", "다").collect(Collectors.joining("-"));
Map<Integer, Long> 길이별 = Stream.of("가", "나", "다라")
        .collect(Collectors.groupingBy(String::length, TreeMap::new, Collectors.counting()));
System.out.println(합);
System.out.println(연결);
System.out.println(길이별);
```

출력:

```text
6
가-나-다
{1=2, 2=1}
```

| 용어 | 뜻 | 합계 예시 |
| --- | --- | --- |
| 항등원 | 결합 결과를 바꾸지 않는 기본값 | 0 |
| 결합법칙 | 묶는 위치가 달라도 같은 결과 | 덧셈은 성립, 뺄셈은 일반적으로 불성립 |
| 누적기 | 현재 결과에 요소 하나를 반영 | 합에 현재 값 더하기 |
| 결합기 | 나눠 계산한 부분 결과를 합침 | 부분 합끼리 더하기 |

병렬 축약에서는 이 조건이 특히 중요합니다. 합계 항등원을 10으로 주면 작업 분할 때마다 10이 섞일 수 있어 올바른 합계 규칙이 아닙니다.

**수집기의 종류**

| 수집기 | 목적 |
| --- | --- |
| `toList`, `toSet`, `toCollection` | 원하는 자료구조로 수집 |
| `toMap` | 키·값의 맵으로 수집 |
| `groupingBy` | 분류 기준별 묶기 |
| `partitioningBy` | 참·거짓 두 부류로 나누기 |
| `counting`, `summingInt`, `averagingInt` | 개수·합·평균 |
| `mapping`, `filtering`, `flatMapping` | 그룹 내부에서 추가 처리 |
| `joining` | 문자열 연결 |

`toMap`에서 같은 키가 두 번 나오면 병합 방법이 없는 형태에서는 예외가 발생합니다. 키별 합계라면 `Integer::sum`처럼 충돌을 처리할 함수를 지정합니다.

**이름이 비슷한 목록 생성의 차이**

| 표현 | 수정 가능성 계약 |
| --- | --- |
| `흐름.toList()` | 수정 불가 |
| `흐름.collect(Collectors.toList())` | 구현 타입·수정 가능성 보장 없음 |
| `흐름.collect(Collectors.toUnmodifiableList())` | 수정 불가, 널 요소 불가 |
| `흐름.collect(Collectors.toCollection(ArrayList::new))` | 지정한 `ArrayList`로 수집 |

“지금 실행해 보니 수정되었다”와 “문서가 수정을 보장한다”는 다릅니다. 수정할 목록이 필요하면 그 의도가 보장되는 생성 방식을 사용합니다.[^stream]

### 080. 기본형 스트림

`IntStream`·`LongStream`·`DoubleStream`은 기본형 숫자를 다룹니다. `Stream<Integer>`와 달리 기본형 전용 합계·평균 기능을 제공합니다.[^intstream]

```java
System.out.println(IntStream.range(1, 4).sum());
System.out.println(IntStream.rangeClosed(1, 4).sum());
System.out.println(IntStream.empty().average().isPresent());
System.out.println(IntStream.of(2, 4).average().orElse(0));
System.out.println(IntStream.rangeClosed(1, 3).boxed().toList());
```

출력:

```text
6
10
false
3.0
[1, 2, 3]
```

| 메서드 | 결과 |
| --- | --- |
| `range(시작, 끝)` | 시작 포함, 끝 제외 |
| `rangeClosed(시작, 끝)` | 시작·끝 모두 포함 |
| `sum` | 합계, 빈 흐름이면 0 |
| `average` | 평균을 담은 `OptionalDouble` |
| `summaryStatistics` | 개수·합·최소·최대·평균 묶음 |
| `mapToInt` | 객체 흐름을 기본 정수 흐름으로 |
| `boxed` | 기본형을 래퍼 객체 흐름으로 |
| `asLongStream` | 정수 요소를 큰 정수형 흐름으로 |

`IntStream.sum()`도 기본 정수 연산이므로 넘침에서 자유롭지 않습니다. 결과가 클 수 있으면 **합산 전에** 더 큰 타입으로 바꿉니다. 이미 넘친 합계를 나중에 `long`으로 옮겨도 복구되지 않습니다.

**보충:** 빈 통계 객체의 최소·최대에는 초기 경계값이 들어갈 수 있습니다. `count`가 0인지 확인하지 않고 실제 관측값으로 해석하지 않습니다.

### 081. 병렬 스트림과 분할 — 보충

병렬 스트림은 요소를 나누어 처리하고 결과를 결합하도록 요청하는 방식입니다. **병렬화했다고 언제나 빠르거나, 원래 순서가 사라지는 것은 아닙니다.**[^streampackage][^spliterator]

```java
List<Integer> 결과 = IntStream.rangeClosed(1, 5)
        .parallel()
        .map(값 -> 값 * 2)
        .boxed()
        .toList();
System.out.println(결과);
```

출력:

```text
[2, 4, 6, 8, 10]
```

처리는 여러 작업으로 나뉠 수 있지만, 순서 있는 소스를 이 방식으로 수집한 결과는 만남 순서를 유지합니다.

| 비교 | 의미 |
| --- | --- |
| `parallel`, `parallelStream` | 병렬 처리 모드 |
| `sequential` | 순차 처리 모드 |
| `forEach` | 병렬에서 호출 순서를 보장하지 않음 |
| `forEachOrdered` | 정의된 만남 순서를 지켜 최종 동작 수행 |
| `unordered` | 순서 제약을 제거. 무작위 섞기를 뜻하지 않음 |
| `Spliterator` | 요소를 순회하고 분할하는 기반 |

`Spliterator`의 순서·크기·정렬·중복 없음 같은 특성은 실행 방법을 선택하는 데 도움을 줍니다. 일반적인 구현은 공용 분할 정복 작업 풀을 활용하지만, 스트림 인터페이스의 모든 동작을 특정 스레드 구성으로 일반화하지 않습니다.

**피할 코드:** 병렬 `forEach`에서 공유 `ArrayList`에 직접 추가하는 방식입니다. 각각의 추가가 충돌할 수 있습니다. 적절한 수집 연산으로 부분 결과를 안전하게 결합합니다.

작은 자료, 비싼 분할·정렬·순서 유지, 외부 입출력 대기에서는 이득이 없거나 손해일 수 있습니다. 병렬화 결정은 측정과 자원 제한을 함께 봅니다.

### 082. Optional과 값의 부재

`Optional`은 **결과가 없을 수 있음을 표현하는 통**입니다. 예외와 널을 모든 곳에서 자동으로 없애는 기능은 아닙니다.[^optional]

| 생성·처리 | 의미 |
| --- | --- |
| `of(값)` | 값이 반드시 있어야 함. 널이면 예외 |
| `ofNullable(값)` | 널이면 빈 선택값 |
| `empty()` | 빈 선택값 |
| `isPresent`, `isEmpty` | 값의 존재 여부 |
| `map` | 값이 있으면 변환. 변환 결과가 널이면 빈 값 |
| `flatMap` | 선택값을 반환하는 변환과 연결 |
| `filter` | 조건을 만족할 때만 유지 |
| `orElse` | 대체값을 인수로 전달 |
| `orElseGet` | 필요할 때 대체값을 만드는 동작 실행 |
| `orElseThrow` | 없으면 예외 발생 |

```java
class 대체공급 {
    String 만들기() {
        System.out.println("대체 생성");
        return "기본";
    }
}
대체공급 공급 = new 대체공급();
Optional<String> 이름 = Optional.of("민수");
System.out.println(이름.orElse(공급.만들기()));
System.out.println(이름.orElseGet(공급::만들기));
System.out.println(Optional.ofNullable(null).isEmpty());
```

출력:

```text
대체 생성
민수
민수
true
```

`orElse`의 인수는 일반 자바 인수이므로 메서드 호출 전에 계산합니다. `orElseGet`은 값이 없는 경우에만 공급 동작을 호출합니다.

**시험 포인트:** `Optional.empty().get()`은 널을 반환하지 않고 예외를 던집니다. `Optional`을 반환한다고 약속한 메서드가 통 자체를 널로 반환하는 것은 의도를 깨뜨립니다. `OptionalInt`·`OptionalLong`·`OptionalDouble`은 기본형 전용이며 모든 일반 선택값 메서드가 똑같이 있는 것은 아닙니다.

### 083. 스트림 개더러 — 자바 24 선택 심화

개더러는 **사용자 정의 중간 연산을 구성하는 기능**입니다. 여러 요소를 한 묶음으로 보내거나, 앞선 상태를 이어받아 결과를 만드는 중간 단계를 표현할 수 있습니다.[^gatherers][^gatherer]

| 구분 | 개더러 | 수집기 |
| --- | --- | --- |
| 위치 | 중간 연산 | 최종 연산 |
| 대표 연결 | `gather` | `collect` |
| 결과 | 다음 연산으로 흘려보낼 요소 | 최종 결과 객체 |
| 사용 예 | 구간 묶기·누적 변환 | 목록·그룹·맵 만들기 |

```text
입력: 1, 2, 3, 4, 5
고정 길이 2로 묶기: [1, 2], [3, 4], [5]
길이 2의 이동 구간: [1, 2], [2, 3], [3, 4], [4, 5]
```

| 대표 기능 | 의미 |
| --- | --- |
| `windowFixed` | 겹치지 않는 고정 크기 묶음. 마지막은 작을 수 있음 |
| `windowSliding` | 겹치는 이동 구간 |
| `scan` | 누적 중간 결과를 계속 방출 |
| `fold` | 상태에 누적한 뒤 마지막 결과 방출 |
| `mapConcurrent` | 제한된 동시성으로 변환 |

사용자 정의 구성에서는 초기 상태, 요소 통합, 부분 상태 결합, 종료 처리를 다룹니다. 이 글에서는 구조만 익힙니다. **이 기능을 자바 21 기본 코드에 그대로 넣으면 사용할 수 없습니다.** 동시 변환도 자원과 예외 정책을 고려해야 합니다.

<details markdown="1">
<summary>10부 한 줄로</summary>

람다는 동작을 전달하고, 스트림은 처리 계획을 연결하며, 최종 연산이 결과를 요구할 때 계산하고, 값이 없을 가능성은 선택값으로 표현합니다.

</details>

<span id="part-11"></span>

## 11부. 예외·자원 관리·입출력

### 084. 예외 계층과 분류

예외는 정상적인 실행 흐름으로 처리하지 못한 상황을 알리는 객체입니다. **검사 예외도 실행 중 발생하며, 컴파일러가 처리·전파 의무를 확인하는 것**입니다.[^exceptions]

```text
Throwable
├─ Error
└─ Exception
   └─ RuntimeException
```

| 분류 | 컴파일러의 처리·전파 검사 | 예 |
| --- | --- | --- |
| 검사 예외 | 필요 | `IOException`, `SQLException` |
| 비검사 예외 | 의무 없음 | `NullPointerException`, `NumberFormatException` 등 |
| `Error` 계열 | 의무 없음 | 메모리 부족·스택 초과 등의 오류 |

`RuntimeException`과 그 하위 타입, `Error`와 그 하위 타입은 비검사 대상입니다. `Exception` 아래에 있다고 모두 검사 예외인 것은 아닙니다.

```java
try {
    int 값 = Integer.parseInt("십");
    System.out.println(값);
} catch (NumberFormatException 예외) {
    System.out.println("숫자 형식 오류");
}
System.out.println("계속 실행");
```

출력:

```text
숫자 형식 오류
계속 실행
```

| 오류 이름 | 대표 상황 |
| --- | --- |
| `NullPointerException` | 널 참조를 객체처럼 사용 |
| `ArrayIndexOutOfBoundsException` | 배열 범위 밖 접근 |
| `ClassCastException` | 실제 객체와 맞지 않는 형 변환 |
| `NumberFormatException` | 숫자로 해석할 수 없는 문자열 |
| `ArithmeticException` | 정수 0 나눗셈·검사되는 산술 실패 등 |
| `UnsupportedOperationException` | 지원하지 않는 변경 등의 연산 |
| `IllegalArgumentException` | 부적절한 인수 |
| `IllegalStateException` | 현재 상태에서 허용되지 않는 호출 |

**시험 포인트:** 컴파일 오류, 실행 예외, 실행은 되지만 의도가 틀린 논리 오류를 분리합니다. 실수의 0 나눗셈과 정수의 0 나눗셈을 같은 예외 규칙으로 처리하지 않습니다.

### 085. 예외의 발생·전파·처리

`throw`는 실제로 예외를 던지고, `throws`는 호출자에게 전파할 수 있는 예외를 선언합니다.[^exceptions][^throwable]

| 구문 | 역할 |
| --- | --- |
| `try` | 예외가 발생할 수 있는 처리 영역 |
| `catch` | 해당 예외를 잡아 처리 |
| `throw` | 예외 객체를 던짐 |
| `throws` | 메서드 선언에서 전파 가능성을 표시 |
| `finally` | 영역을 떠나는 과정의 정리 |

```java
public class Main {
    static int 변환(String 입력) throws Exception {
        try {
            return Integer.parseInt(입력);
        } catch (NumberFormatException 원인) {
            throw new Exception("숫자 변환 실패", 원인);
        }
    }

    public static void main(String[] args) {
        try {
            System.out.println(변환("가"));
        } catch (Exception 예외) {
            System.out.println(예외.getMessage());
            System.out.println(예외.getCause().getClass().getSimpleName());
        }
    }
}
```

출력:

```text
숫자 변환 실패
NumberFormatException
```

원인 예외를 연결하면 “어디서 다른 예외로 바꾸었는가”와 “처음 무엇이 실패했는가”를 함께 보존할 수 있습니다.

**처리 순서의 규칙**

구체적인 예외를 먼저, 상위 예외를 뒤에서 잡습니다. `Exception`을 먼저 잡고 뒤에서 그 하위 타입을 잡으면 뒤의 처리가 도달할 수 없어서 컴파일 오류가 됩니다.

하나의 처리 블록에서 여러 예외 타입을 묶는 다중 `catch`에서는 서로 상속 관계인 두 타입을 함께 나열할 수 없습니다. 이미 상위 타입이 하위를 포함하기 때문입니다.

사용자 정의 예외는 처리 의도에 따라 `Exception` 또는 `RuntimeException` 등을 상속합니다. 예외를 출력만 하고 실패 사실을 숨기면 호출자가 성공했다고 오해할 수 있습니다. 반대로 같은 예외를 여러 계층에서 반복 기록하면 로그가 중복될 수 있습니다.

**호출 스택 전파:** 현재 메서드에서 처리하지 못한 예외는 호출자로 전달됩니다. 적절한 처리기가 발견되지 않으면 해당 스레드의 실행이 종료될 수 있습니다. 예외가 발생한 줄 다음부터 자동으로 다시 시작하는 것은 아닙니다.

### 086. finally와 자동 자원 해제

`finally`는 예외·반환 등으로 `try` 영역을 떠날 때 정리 코드를 실행합니다. 하지만 강제 프로세스 종료 등 모든 상황에서 실행된다는 절대적인 보장은 아닙니다.[^statements][^autocloseable]

**반환값을 정하는 시점**

```java
public class Main {
    static int 계산() {
        int 값 = 1;
        try {
            return 값;
        } finally {
            값 = 2;
            System.out.println("정리");
        }
    }

    public static void main(String[] args) {
        System.out.println(계산());
    }
}
```

출력:

```text
정리
1
```

정수 반환값 1은 먼저 결정되어 있습니다. `finally`에서 지역 변수만 2로 바꿔도 이미 계산한 반환값은 바뀌지 않습니다. 반환할 객체 내부를 바꾸는 경우는 별도로 판단합니다.

`finally`에서 다시 `return`하거나 새 예외를 던지면 기존 반환·예외가 가려질 수 있으므로 피합니다.

**자동 자원 해제 구문**

`try (자원 선언)`은 `AutoCloseable` 자원을 등록하고, 끝날 때 `close()`를 호출합니다. 선언된 순서의 **역순**으로 닫습니다.

```java
import java.util.Arrays;

public class Main {
    static class 도구 implements AutoCloseable {
        private final String 이름;

        도구(String 이름) {
            this.이름 = 이름;
        }

        @Override
        public void close() throws Exception {
            System.out.println("닫기 " + 이름);
            throw new Exception("닫기 실패 " + 이름);
        }
    }

    public static void main(String[] args) {
        try (도구 첫째 = new 도구("하나"); 도구 둘째 = new 도구("둘")) {
            System.out.println("본문");
            throw new Exception("본문 실패");
        } catch (Exception 예외) {
            System.out.println(예외.getMessage());
            System.out.println(Arrays.stream(예외.getSuppressed())
                    .map(Throwable::getMessage).toList());
        }
    }
}
```

출력:

```text
본문
닫기 둘
닫기 하나
본문 실패
[닫기 실패 둘, 닫기 실패 하나]
```

본문 예외가 기본 예외가 되고, 닫기 중 예외는 억제된 예외로 보존됩니다. 본문이 정상이고 닫기만 실패하면 닫기 예외가 전파될 수 있습니다. 뒤쪽 자원 생성이 실패해도 앞에서 성공적으로 등록된 자원은 정리 대상입니다.

| 비교 | 핵심 |
| --- | --- |
| `AutoCloseable` | 자동 자원 해제의 일반 계약 |
| `Closeable` | 입출력 중심의 더 구체적인 닫기 계약 |
| `getCause` | 다른 예외가 발생한 원인 |
| `getSuppressed` | 주 예외와 함께 기록된 부수적인 예외 |
| 가비지 컬렉션 | 객체 메모리 회수 |
| `close` | 파일·소켓·연결 같은 자원의 명시적 해제 |

**시험 포인트:** 검사 예외가 `close()`에서 발생할 수도 있습니다. 본문에 검사 예외가 없다고 해서 자동 자원 해제 구문 전체에 예외 처리가 필요 없는 것은 아닙니다.

### 087. 바이트·문자 입출력

입출력의 기준은 **바이트를 옮기는가, 문자를 읽고 쓰는가**입니다. 프로그램으로 들어오면 입력, 프로그램 밖으로 보내면 출력입니다.[^io][^inputstream][^reader]

| 구분 | 입력 | 출력 | 용도 |
| --- | --- | --- | --- |
| 바이트 | `InputStream` | `OutputStream` | 이미지·압축·바이너리 등 |
| 문자 | `Reader` | `Writer` | 텍스트 |
| 버퍼 | `BufferedInputStream`, `BufferedReader` 등 | 대응 버퍼 출력 클래스 | 작은 입출력을 묶기 |
| 변환 | `InputStreamReader` | `OutputStreamWriter` | 바이트와 문자 사이 인코딩 변환 |
| 기본값 형식 | `DataInputStream` | `DataOutputStream` | 정수·논리값 등을 대응 형식으로 읽고 쓰기 |

```text
파일의 바이트
  ↓ 바이트 입력 스트림
  ↓ 지정 문자셋으로 해석하는 문자 변환기
  ↓ 문자 버퍼
프로그램의 문자열
```

```java
byte[] 자료 = "가".getBytes(StandardCharsets.UTF_8);
try (Reader 읽기 = new InputStreamReader(
        new ByteArrayInputStream(자료), StandardCharsets.UTF_8)) {
    System.out.println((char) 읽기.read());
    System.out.println(읽기.read());
}
```

출력:

```text
가
-1
```

| 읽기 메서드 | 반환값 |
| --- | --- |
| `InputStream.read()` | 0~255의 바이트값 또는 끝을 뜻하는 `-1` |
| `Reader.read()` | 문자 코드 단위의 정수값 또는 `-1` |
| `read(배열)` | 실제 읽은 개수. 요청 길이를 항상 채우는 것은 아님 |
| `BufferedReader.readLine()` | 줄바꿈을 제외한 한 줄, 입력 끝이면 널 |

`read()`가 정수를 반환하는 이유는 실제 값과 끝 표시를 함께 나타내기 위해서입니다. 먼저 `byte`나 `char`로 바꾸면 끝 표시 판정이 틀어질 수 있습니다.

**데이터 스트림의 순서**

```java
ByteArrayOutputStream 저장 = new ByteArrayOutputStream();
try (DataOutputStream 쓰기 = new DataOutputStream(저장)) {
    쓰기.writeInt(100);
    쓰기.writeUTF("가");
}
try (DataInputStream 읽기 = new DataInputStream(
        new ByteArrayInputStream(저장.toByteArray()))) {
    System.out.println(읽기.readInt());
    System.out.println(읽기.readUTF());
}
```

출력:

```text
100
가
```

쓴 타입과 순서대로 읽어야 합니다. `writeUTF`는 길이 정보와 변형된 문자 인코딩 형식을 사용하므로 임의의 일반 텍스트 파일 쓰기와 동일하지 않습니다.[^dataoutput]

**보충:** `flush()`는 버퍼에 남은 데이터를 아래 단계로 보냅니다. 파일을 닫는 것, 모든 장치에 영구 기록되었음을 보장하는 것과는 다릅니다. `available()`은 전체 파일 길이나 입력 종료를 일반적으로 판정하는 메서드가 아닙니다.

### 088. 표준 입력·출력과 콘솔

`Scanner`는 구분자와 형식에 따라 입력을 해석합니다. `BufferedReader`는 문자를 버퍼에 담아 줄 단위 등으로 읽습니다.[^scanner][^bufferedreader]

```java
try (Scanner 입력 = new Scanner("10\n자바\n")) {
    System.out.println(입력.nextInt());
    System.out.println("[" + 입력.nextLine() + "]");
    System.out.println(입력.nextLine());
}
```

출력:

```text
10
[]
자바
```

`nextInt()`는 숫자 토큰을 읽고, 바로 뒤의 `nextLine()`은 그 줄에 남은 부분을 읽습니다. 위 입력에서는 남은 부분이 없어서 빈 문자열입니다.

| 선택 | 주의점 |
| --- | --- |
| `Scanner.next()` | 다음 토큰 |
| `Scanner.nextLine()` | 현재 위치부터 줄 끝까지 |
| `Scanner.nextInt()` | 숫자 형식이 맞지 않으면 예외 |
| `hasNext`, `hasNextInt` | 다음 입력 가능·형식 여부 확인 |
| `BufferedReader.readLine()` | 문자열로 읽고 필요하면 숫자 변환 |

“숫자 다음에는 무조건 `nextLine`을 한 번 버린다”로 외우기보다, **같은 줄의 나머지 입력을 버려도 되는지** 확인합니다.

`System.in`은 바이트 입력, `System.out`·`System.err`는 출력 스트림입니다. 입력 분석기를 닫으면 연결된 입력도 닫힐 수 있으므로, 프로그램 전체가 계속 쓸 표준 입력의 소유권을 주의합니다.

**형식 출력:** `%n`은 실행 환경의 줄 구분자를 사용합니다. `PrintStream`·`PrintWriter`는 일부 입출력 실패를 직접 검사 예외로 던지지 않고 내부 오류 상태로 기록하므로 `checkError()`가 필요할 수 있습니다.[^printwriter]

`System.console()`은 실행 환경에 따라 널일 수 있습니다. 콘솔의 비밀번호 입력 기능과 일반 문자열 입력을 같은 보안 성질로 보지 않습니다.

### 089. 파일과 경로

`Path`는 경로를 표현하고, `Files`는 파일 읽기·쓰기·복사·탐색 작업을 수행합니다. **경로 객체를 만들었다고 실제 파일이 생성되지는 않습니다.**[^files][^path]

```java
Path 임시 = Files.createTempFile("java-study-", ".txt");
try {
    Files.writeString(임시, "자바\n입출력", StandardCharsets.UTF_8);
    System.out.println(Files.readAllLines(임시, StandardCharsets.UTF_8));
    try (Stream<String> 줄들 = Files.lines(임시, StandardCharsets.UTF_8)) {
        System.out.println(줄들.count());
    }
} finally {
    Files.deleteIfExists(임시);
}
```

출력:

```text
[자바, 입출력]
2
```

예제는 임시 파일을 만든 뒤 삭제합니다. 실제 경로에 쓰기 작업을 할 때는 기존 파일을 덮어쓸 수 있는 옵션을 먼저 확인합니다.

| 기능 | 목적·주의 |
| --- | --- |
| `Path.of` | 경로 구성 |
| `resolve` | 경로 결합. 상대·절대 인수의 차이 확인 |
| `normalize` | `.`·`..` 같은 경로 요소 정리. 실제 파일 확인 아님 |
| `toAbsolutePath` | 절대 경로 형태로 변환 |
| `toRealPath` | 실제 파일과 링크를 고려해 경로 확인 |
| `readString`, `readAllLines` | 전체를 읽으므로 큰 파일은 메모리 주의 |
| `lines` | 줄 스트림. 사용 후 닫기 |
| `list`, `walk`, `find` | 디렉터리 탐색 스트림. 사용 후 닫기 |
| `copy`, `move`, `delete` | 파일 조작. 덮어쓰기·원자성 등 옵션 확인 |
| `createDirectories` | 필요한 상위 디렉터리까지 생성 |

상대 경로는 현재 작업 디렉터리 등을 기준으로 해석됩니다. 운영체제의 경로 구분자를 무조건 한 문자로 가정하지 않습니다.

**보충:** `Files.exists`가 거짓이라고 반드시 “없음”이 확정된 것은 아닙니다. 확인 불가 상태도 고려해야 합니다. 존재 확인과 실제 접근 사이에 파일이 바뀌는 경쟁 조건도 있습니다.

파일 속성·권한, 심볼릭 링크 따라가기 정책, `WatchService`의 변경 이벤트는 별도 기능입니다. 변경 감시는 모든 사건을 빠짐없이 기록하는 감사 로그와 같지 않으며 넘침 이벤트를 처리해야 합니다.[^watchservice]

### 090. 새 입출력 구조 — 보충

버퍼는 데이터를 잠시 담는 공간이고, 채널은 입출력 연결입니다. 선택기는 여러 채널의 **작업 준비 상태**를 감시하는 기반입니다.[^buffer][^channels]

| 버퍼 값 | 뜻 |
| --- | --- |
| `capacity` | 전체 용량 |
| `limit` | 현재 읽거나 쓸 수 있는 범위의 끝 |
| `position` | 다음 읽기·쓰기 위치 |
| `mark` | 되돌아갈 위치를 선택적으로 표시 |

항상 `0 ≤ position ≤ limit ≤ capacity` 관계를 유지합니다.

```java
ByteBuffer 버퍼 = ByteBuffer.allocate(4);
버퍼.put((byte) 10);
버퍼.put((byte) 20);
System.out.println(버퍼.position() + "/" + 버퍼.limit());
버퍼.flip();
System.out.println(버퍼.position() + "/" + 버퍼.limit());
System.out.println(버퍼.get());
버퍼.compact();
System.out.println(버퍼.position() + "/" + 버퍼.limit());
버퍼.flip();
System.out.println(버퍼.get());
```

출력:

```text
2/4
0/2
10
1/4
20
```

| 메서드 | 역할 |
| --- | --- |
| `flip` | 방금 쓴 범위를 읽기 위해 한계와 위치를 조정 |
| `clear` | 다시 쓸 수 있게 위치 0·한계 용량으로 설정 |
| `compact` | 아직 읽지 않은 내용을 앞으로 옮기고 뒤에 쓸 준비 |
| `rewind` | 한계는 유지하고 위치를 처음으로 |

`clear()`는 기존 데이터 바이트를 모두 0으로 지우는 기능이 아닙니다. 직접 버퍼는 힙 밖 메모리를 사용할 수 있으므로 힙 사용량만 보고 전체 메모리를 판단하지 않습니다.

**선택 심화:** 파일 채널·파일 잠금·메모리 매핑, 비블로킹 소켓 채널·선택기, 비동기 파일 채널은 각각 목적이 다릅니다. 새 입출력 패키지를 사용했다고 모두 비동기 또는 비블로킹이 되는 것은 아닙니다.

### 091. 객체 직렬화 — 보충

객체 직렬화는 객체 상태와 참조 관계를 바이트 형태로 기록하고 복원하는 방식입니다. `Serializable`은 일반 직렬화에 참여할 의도를 나타내는 표시 인터페이스입니다.[^serializable][^serialization]

```java
import java.io.*;

public class Main {
    static class 기록 implements Serializable {
        private static final long serialVersionUID = 1L;
        int 점수 = 90;
        transient String 임시값 = "임시";
    }

    public static void main(String[] args) throws Exception {
        ByteArrayOutputStream 저장 = new ByteArrayOutputStream();
        try (ObjectOutputStream 쓰기 = new ObjectOutputStream(저장)) {
            쓰기.writeObject(new 기록());
        }
        try (ObjectInputStream 읽기 = new ObjectInputStream(
                new ByteArrayInputStream(저장.toByteArray()))) {
            기록 복원 = (기록) 읽기.readObject();
            System.out.println(복원.점수);
            System.out.println(복원.임시값);
        }
    }
}
```

출력:

```text
90
null
```

기본 직렬화에서 `transient` 인스턴스 필드는 제외됩니다. 위 클래스의 역직렬화는 해당 클래스의 일반 생성자·필드 초기화식을 다시 실행하는 방식이 아니므로 문자열 초기값이 복원되지 않습니다.

| 개념 | 의미 |
| --- | --- |
| 객체 그래프 | 연결된 객체와 참조 관계까지 따라가며 기록 |
| `serialVersionUID` | 직렬화 호환성 판정에 사용하는 버전 식별자 |
| `transient` | 기본 직렬화에서 해당 인스턴스 필드 제외 |
| `static` | 객체별 상태가 아니므로 기본 객체 상태에 포함되지 않음 |
| `writeObject`, `readObject` | 사용자 정의 기록·복원 처리 |
| `writeReplace`, `readResolve` | 직렬화·복원 과정에서 객체 대체 |
| `Externalizable` | 기록·복원 규칙을 직접 구성. 공개 무인자 생성자 등의 규칙 확인 |
| 직렬화 필터 | 허용 클래스·깊이·크기 등 제한 |

버전 식별자가 같다고 모든 클래스 변경이 안전해지는 것은 아닙니다. 연결된 필드 객체도 직렬화 조건을 만족해야 하며, 정적 필드의 현재 값까지 파일에 저장된다고 가정하면 안 됩니다.

<blockquote class="prompt-danger">
<p>신뢰할 수 없는 바이트를 바로 객체로 역직렬화하지 않습니다. 형식과 입력 경계를 검증하고, 가능한 경우 더 명시적인 데이터 형식을 사용합니다. 직렬화와 암호화는 별개입니다.</p>
</blockquote>

### 092. 압축과 아카이브 입출력 — 보충

압축은 데이터를 더 작은 표현으로 바꾸고, 아카이브는 여러 파일과 이름·정보를 한 컨테이너로 묶습니다. 두 개념은 함께 쓰이지만 동일하지 않습니다.[^zip]

| 형식·도구 | 역할 |
| --- | --- |
| `GZIPInputStream`, `GZIPOutputStream` | 압축된 바이트 흐름 처리 |
| `ZipInputStream`, `ZipOutputStream` | 이름을 가진 여러 엔트리의 순차 처리 |
| `ZipFile` | 파일 형태 아카이브의 엔트리 접근 |
| `JarFile` | 자바 아카이브와 매니페스트 등 처리 |
| `CRC32`, `Adler32` | 오류 탐지용 체크섬 |

```java
ByteArrayOutputStream 저장 = new ByteArrayOutputStream();
try (GZIPOutputStream 압축 = new GZIPOutputStream(저장)) {
    압축.write("자바".getBytes(StandardCharsets.UTF_8));
}
try (GZIPInputStream 해제 = new GZIPInputStream(
        new ByteArrayInputStream(저장.toByteArray()))) {
    System.out.println(new String(해제.readAllBytes(), StandardCharsets.UTF_8));
}
```

출력:

```text
자바
```

**안전한 압축 해제의 기준:** 엔트리 이름이 대상 폴더 밖으로 나가는지, 심볼릭 링크로 우회하는지, 엔트리 개수·누적 해제 크기·중첩 압축·처리 시간이 과도한지 확인합니다. 경로 문자열을 한 번 정리했다고 모든 우회가 막히는 것은 아닙니다.[^securecoding]

체크섬은 우발적인 손상을 발견하는 데 쓰지만, 공격자가 내용을 바꾸지 못하게 인증하는 기능과 같지 않습니다. 압축을 마무리하고 자원을 닫아야 필요한 형식 정보가 완성될 수 있습니다.

<details markdown="1">
<summary>11부 한 줄로</summary>

예외는 실패 흐름, 입출력은 바이트와 문자의 이동, 자원 관리는 닫기 시점의 문제이며, 자동 메모리 회수와 자동 자원 해제를 구분합니다.

</details>

<span id="part-12"></span>

## 12부. 네트워크·데이터베이스·보안·운영체제 연동

### 093. 네트워크와 소켓

소켓은 프로그램이 네트워크로 데이터를 주고받는 연결 지점입니다. 주소, 통신 방식, 연결·읽기 제한 시간을 구분해서 봅니다.[^network][^socket]

| 개념 | 역할 |
| --- | --- |
| `InetAddress` | 인터넷 주소와 이름 해석 |
| `URI` | 자원의 식별자를 구조적으로 표현 |
| `URL` | 자원 위치와 접근에 관련된 표현 |
| `Socket` | 연결형 통신의 한쪽 끝 |
| `ServerSocket` | 연결 요청을 받아 통신 소켓 생성 |
| `DatagramSocket` | 데이터그램 단위 송수신 |
| 소켓 채널 | 채널 방식의 네트워크 입출력 |

```java
URI 주소 = URI.create("https://example.com:8443/study?part=8#note");
System.out.println(주소.getScheme());
System.out.println(주소.getHost());
System.out.println(주소.getPort());
System.out.println(주소.getPath());
System.out.println(주소.getQuery());
```

출력:

```text
https
example.com
8443
/study
part=8
```

이 코드는 주소 문자열만 분석하며 실제 네트워크 요청을 보내지 않습니다.

| 비교 | 연결형 전송 `TCP` | 데이터그램 전송 `UDP` |
| --- | --- | --- |
| 기본 모델 | 연결된 바이트 흐름 | 개별 데이터그램 |
| 순서·재전송 | 규약이 순서 있는 전달과 재전송 등을 처리 | 규약 자체로 같은 보장을 제공하지 않음 |
| 메시지 경계 | 응용 프로그램이 길이·구분자 등으로 정함 | 데이터그램 단위가 있음 |
| 프로그램의 역할 | 끝까지 도착·업무 처리 여부를 별도 확인 | 필요한 신뢰성·순서 처리를 별도 설계 |

한 번 `write`한 데이터가 상대방의 한 번 `read`에 똑같이 대응하지 않습니다. 읽은 길이를 확인하면서 데이터를 모아야 합니다.

**연결 시간 제한과 읽기 시간 제한은 별개**입니다. `Socket.connect`의 제한 시간, `setSoTimeout`의 읽기 제한 등을 구분합니다. 읽기가 시간 초과되었다고 모든 종류의 실패에서 같은 자원 상태가 보장되는 것은 아닙니다.

### 094. 웹 통신 클라이언트

`HttpClient`는 요청 설정과 전송을, `HttpRequest`는 보낼 요청을, `HttpResponse`는 받은 응답을 나타냅니다.[^httpclient][^httprequest]

| 요소 | 확인할 내용 |
| --- | --- |
| 요청 | 주소·메서드·헤더·본문·시간 제한 |
| 응답 | 상태 코드·헤더·본문 |
| 본문 처리기 | 문자열·바이트·파일·스트림 등 처리 방식 |
| `send` | 응답을 기다리는 동기 호출 |
| `sendAsync` | 미래 결과를 돌려주는 비동기 호출 |
| 보안 연결 | 인증서·호스트 이름·신뢰 설정 |

다음은 구조를 보여주는 **호출용 메서드**입니다. 실제 실행에는 접근 가능한 서버가 필요합니다. 필요한 패키지는 `java.net`, `java.net.http`, `java.time`, `java.io`입니다.

<!-- 검증: 컴파일만 -->

```java
import java.io.IOException;
import java.net.URI;
import java.net.http.*;
import java.time.Duration;

public class Main {
    static String 조회(URI 주소) throws IOException, InterruptedException {
        try (HttpClient 통신 = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(3))
                .build()) {
            HttpRequest 요청 = HttpRequest.newBuilder(주소)
                    .timeout(Duration.ofSeconds(5))
                    .GET()
                    .build();
            HttpResponse<String> 응답 = 통신.send(
                    요청, HttpResponse.BodyHandlers.ofString());
            if (응답.statusCode() < 200 || 응답.statusCode() >= 300) {
                throw new IOException("응답 상태: " + 응답.statusCode());
            }
            return 응답.body();
        }
    }
}
```

서버가 404·500 같은 상태를 보냈다고 `send`가 항상 입출력 예외를 던지는 것은 아닙니다. 응답 상태는 프로그램이 판정해야 합니다. 위 코드는 간단한 예제를 위해 호출 안에서 클라이언트를 만들지만, 반복 요청에서는 수명을 관리하며 클라이언트를 재사용하는 구조도 고려합니다.

**보충:** 자바 21 기본 클라이언트는 HTTP/1.1·HTTP/2를 다룹니다. 요청한 선호 버전과 실제 사용 버전은 다를 수 있습니다. 프록시·리다이렉트·인증·웹소켓은 별도 설정과 수명 관리가 필요합니다. 예제의 자원 해제는 자바 21 기준이며, 오래된 자바 버전에 같은 종료 계약을 그대로 적용하지 않습니다.

### 095. 데이터베이스 연결

자바의 데이터베이스 연결 표준 `JDBC`는 드라이버를 통해 데이터베이스와 통신하는 인터페이스입니다. 자바 개발 도구만 설치했다고 모든 데이터베이스 드라이버와 서버가 준비되는 것은 아닙니다.[^jdbc][^prepared][^resultset]

```text
자바 코드
  ↓ 연결 표준 인터페이스
드라이버
  ↓
데이터베이스 서버
```

| 구성 요소 | 역할 |
| --- | --- |
| `DriverManager` | 주소와 등록된 드라이버를 이용한 연결 |
| `DataSource` | 연결을 얻는 표준 통로. 풀과 연결하기에도 적합 |
| `Connection` | 연결과 트랜잭션 문맥 |
| `Statement` | 질의문 실행 |
| `PreparedStatement` | 질의 구조와 매개변수 값을 분리 |
| `CallableStatement` | 저장 프로시저 호출 |
| `ResultSet` | 조회 결과와 현재 행 위치 |
| `RowSet` | 결과 집합을 확장한 구조. 연결 유지·분리 방식은 구현마다 다름 |

**매개변수를 결합한 조회 구조**

다음은 이미 설정된 `DataSource`와 실제 `scores` 테이블이 있어야 호출할 수 있는 메서드입니다. 테이블은 `name`·`score` 열을 가진다는 가정입니다. 드라이버·서버를 연결한 통합 실행 예제는 아닙니다.

<!-- 검증: 컴파일만 -->

```java
import java.sql.*;
import java.util.*;

public class Main {
    static List<String> 합격자(javax.sql.DataSource 공급, int 기준) throws SQLException {
        List<String> 이름들 = new ArrayList<>();
        String 질의 = "SELECT name FROM scores WHERE score >= ? ORDER BY name";
        try (Connection 연결 = 공급.getConnection();
             PreparedStatement 명령 = 연결.prepareStatement(질의)) {
            명령.setInt(1, 기준);
            try (ResultSet 결과 = 명령.executeQuery()) {
                while (결과.next()) {
                    이름들.add(결과.getString("name"));
                }
            }
        }
        return 이름들;
    }
}
```

| 구분 | 기억할 규칙 |
| --- | --- |
| 매개변수 번호 | 1부터 시작 |
| 결과 열 번호 | 숫자로 접근할 때 1부터 시작 |
| 결과 행 커서 | 처음에는 첫 행의 앞. `next()`가 이동 |
| `executeQuery` | 결과 집합을 반환하는 조회 |
| `executeUpdate` | 갱신 개수 등의 결과 |
| `execute` | 첫 결과가 결과 집합인지 등을 나타내는 논리값 |
| 널 처리 | 기본형 조회의 기본값과 데이터베이스 널을 구분 |

`getInt`가 0을 반환했을 때 실제 0인지 널인지 확인하려면 바로 뒤의 `wasNull()` 등을 사용합니다. 형식이 맞는 `getObject` 사용도 검토할 수 있습니다. 데이터베이스의 널은 자바 기본형에 직접 저장할 수 없습니다.

**보안 포인트:** 값은 문자열로 질의문에 이어 붙이지 않고 매개변수로 결합합니다. 그러나 `?`는 임의의 테이블 이름·열 이름까지 대신하는 문법이 아닙니다. 동적 식별자는 허용 목록 등 별도 통제가 필요합니다. 준비된 명령을 만들었다고 그 전에 연결한 위험한 질의 문자열까지 안전해지는 것은 아닙니다.[^securecoding]

현대 드라이버는 자동 등록을 지원할 수 있으므로 모든 환경에서 `Class.forName`이 반드시 필요한 것은 아닙니다. 드라이버의 제공 방식과 실행 환경을 확인합니다.

### 096. 트랜잭션과 데이터 접근 관리

트랜잭션은 여러 변경을 하나의 업무 단위로 다루는 경계입니다. 연결은 기본적으로 자동 커밋 상태이며, 여러 명령을 묶으려면 상태를 확인하고 제어해야 합니다.[^connection][^transactions]

**트랜잭션의 네 가지 성질**

| 성질 | 핵심 의미 | 구분할 점 |
| --- | --- | --- |
| 원자성 | 한 단위의 변경을 모두 확정하거나 모두 취소 | 일부만 업무 결과로 남기지 않음 |
| 일관성 | 올바른 트랜잭션이 데이터의 제약과 규칙을 보존 | 제약 정의와 업무 로직도 올바르게 구성해야 함 |
| 격리성 | 동시에 실행되는 작업 사이의 간섭을 제어 | 실제 읽기 보장은 선택한 격리 수준과 구현을 확인 |
| 지속성 | 확정한 변경을 장애 복구 후에도 유지 | 미확정 변경까지 보존한다는 뜻은 아님 |

예를 들어 계좌 간 이체에서는 출금만 남고 입금이 사라지지 않도록 하나의 업무 단위로 다룹니다. 위 네 성질은 자바 문법이 아니라 데이터베이스 트랜잭션의 기본 개념입니다.[^acid]

| 기능 | 역할 |
| --- | --- |
| `setAutoCommit(false)` | 명시적으로 확정·취소하는 모드 |
| `commit` | 현재 변경 확정 |
| `rollback` | 현재 미확정 변경 취소 |
| 저장점 | 트랜잭션 중간으로 부분 취소할 기준 |
| 격리 수준 | 다른 트랜잭션의 변경을 얼마나 보게 할지 제어 |
| 일괄 실행 | 여러 명령을 묶어 전송·실행 |
| 메타데이터 | 드라이버·데이터베이스·결과 열의 기능과 구조 조회 |

다음은 점수 한 건의 변경을 명시적으로 확정하거나 되돌리는 구조입니다. 앞 절과 같은 테이블·연결 설정이 필요합니다.

<!-- 검증: 컴파일만 -->

```java
import java.sql.*;

public class Main {
    static void 점수변경(javax.sql.DataSource 공급, String 이름, int 점수) throws SQLException {
        try (Connection 연결 = 공급.getConnection()) {
            연결.setAutoCommit(false);
            try {
                try (PreparedStatement 명령 = 연결.prepareStatement(
                        "UPDATE scores SET score = ? WHERE name = ?")) {
                    명령.setInt(1, 점수);
                    명령.setString(2, 이름);
                    if (명령.executeUpdate() != 1) {
                        throw new SQLException("변경 대상이 정확히 한 건이 아닙니다.");
                    }
                }
                연결.commit();
            } catch (SQLException | RuntimeException 예외) {
                try {
                    연결.rollback();
                } catch (SQLException 취소실패) {
                    예외.addSuppressed(취소실패);
                }
                throw 예외;
            }
        }
    }
}
```

이 코드는 메서드가 얻은 연결의 수명을 직접 관리합니다. 이미 바깥에서 시작한 트랜잭션의 연결을 넘겨받아 같은 방식으로 임의 커밋하면 안 됩니다. 연결 풀을 쓰면 반환할 때 자동 커밋·격리 수준 같은 상태를 정리하는 정책이 필요합니다.

**격리 수준의 기본 지도**

| 수준 | 최소한 구분할 읽기 현상 |
| --- | --- |
| 미커밋 읽기 | 다른 작업의 미확정 값을 볼 수 있음 |
| 커밋된 값 읽기 | 미확정 값 읽기 방지 |
| 반복 가능한 읽기 | 같은 행 재조회에서 값이 달라지는 현상까지 방지 |
| 직렬화 가능 | 유령 행을 포함한 더 강한 격리 |

실제 지원 수준·동작은 데이터베이스와 드라이버에 따라 확인합니다. 반복 가능한 읽기에서 유령 행이 반드시 발생한다는 뜻은 아닙니다. 표는 허용 가능한 현상과 최소 보장을 구분하는 학습용 기준입니다.

**시험 함정:** 예외 발생이 자동 롤백을 뜻하지 않고, 연결 닫기가 항상 롤백을 보장하지도 않습니다. 활성 트랜잭션은 명시적으로 끝내야 합니다. 자동 커밋을 거짓에서 참으로 바꾸면 진행 중 트랜잭션을 커밋할 수 있으므로 단순한 설정 복구로만 보지 않습니다.

일괄 실행이 실패하면 일부 명령이 이미 실행되었을 수 있습니다. 연결 풀의 `close()`는 물리 연결 종료가 아니라 풀 반환을 뜻할 수 있습니다. 여러 자원에 걸친 분산 트랜잭션은 별도 조정 기능의 영역입니다.

### 097. 구조화 문서 처리 — 보충

구조화 문서는 태그·계층·속성 등 정해진 형식으로 데이터를 표현합니다. 자바 표준에는 XML의 읽기·검증·변환·질의 기능이 있습니다.[^xml][^xmlmodule]

| 방식 | 처리 구조 | 장점·부담 |
| --- | --- | --- |
| 문서 객체 방식 `DOM` | 문서 전체를 트리로 구성 | 임의 탐색·수정이 쉽지만 메모리 사용 증가 |
| 이벤트 방식 `SAX` | 읽으며 사건을 처리기에 전달 | 전체 트리 없이 처리, 앞뒤 임의 이동은 어려움 |
| 순차 당김 방식 `StAX` | 프로그램이 다음 사건을 요청 | 처리 흐름을 프로그램이 제어 |
| 경로 질의 `XPath` | 구조 안의 위치·조건으로 선택 | 파서 방식과 구분 |
| 스키마 검증 | 문서가 정해진 구조·타입을 따르는지 확인 | 문법적으로 읽힌다고 검증까지 통과한 것은 아님 |
| 변환 `XSLT` | 문서를 다른 형태로 변환 | 외부 참조·확장 기능의 보안 확인 |

```xml
<기록>
    <이름>민수</이름>
    <점수>90</점수>
</기록>
```

**보안:** 외부 엔터티·외부 문서 접근을 필요한 범위로 제한하고, 엔터티 확장 수·깊이·입력 크기를 제한합니다. 안전 처리 기능 하나를 켰다고 모든 외부 접근이 같은 방식으로 차단된다고 가정하지 않습니다. 파서 종류별 속성과 적용 범위를 확인합니다.

XML 디지털 서명은 서명된 데이터와 검증 경계를 함께 이해해야 합니다. 태그가 있다는 사실 자체가 신뢰성을 보장하지 않습니다.

**표준과 외부 기능의 구분:** 자바 표준 플랫폼의 XML 처리 기능과 외부 JSON 처리 라이브러리를 혼동하지 않습니다. 자바 21 표준 플랫폼이 임의 자바 객체와 JSON을 자동으로 연결하는 범용 라이브러리까지 기본 제공하는 것은 아닙니다.[^platform]

### 098. 보안과 암호화

보안에서는 **표현 변환, 비밀 유지, 변경 탐지, 상대 인증**을 구분해야 합니다. 이름에 보안 관련 단어가 있다고 같은 목적을 수행하는 것은 아닙니다.[^crypto][^securerandom]

| 기능 | 목적 | 자바에서 연결되는 이름 |
| --- | --- | --- |
| 인코딩 | 데이터를 다른 표현으로 바꿈 | `Base64`, 문자셋 |
| 해시 | 입력의 요약값 계산 | `MessageDigest` |
| 메시지 인증 | 비밀키를 공유한 상대가 만든 데이터인지·변경되었는지 확인 | `Mac` |
| 대칭키 암호화 | 비밀키로 내용 보호·복원 | `Cipher` |
| 공개키 암호 기술 | 공개키·개인키의 서로 다른 역할 사용 | 키 생성·암호화·서명 기능 |
| 전자서명 | 개인키로 서명하고 대응 공개키로 검증 | `Signature` |
| 보안 난수 | 예측하기 어려운 값 생성 | `SecureRandom` |
| 인증서 | 공개키와 주체 정보를 신뢰 체계에 연결 | 인증서·검증 기능 |

```java
byte[] 원문 = "자바".getBytes(StandardCharsets.UTF_8);
String 표현 = Base64.getEncoder().encodeToString(원문);
String 복원 = new String(Base64.getDecoder().decode(표현), StandardCharsets.UTF_8);
byte[] 요약 = MessageDigest.getInstance("SHA-256").digest(원문);
System.out.println(복원);
System.out.println(요약.length);
```

출력:

```text
자바
32
```

첫 작업은 인코딩이므로 누구나 규칙에 따라 복원할 수 있습니다. 두 번째는 요약값이며 복호화 기능이 아닙니다. **이 코드는 비밀번호 저장이나 완성된 암호 프로토콜의 예제가 아닙니다.**

| 구분 | 핵심 |
| --- | --- |
| 보안 제공자 | 알고리즘의 실제 구현을 공급 |
| 키 저장소 | 키·인증서 항목 등을 관리 |
| 신뢰 저장소 | 신뢰할 인증서·기관을 판단하는 자료 관리 |
| 보안 통신 | 통신 상대 검증과 전송 중 보호 |
| 인증 | 누구인지 확인 |
| 인가 | 어떤 작업을 허용할지 확인 |

인증서를 모두 신뢰하도록 검증을 끄는 방식으로 통신 오류를 해결하지 않습니다. 비밀키·비밀번호를 소스와 로그에 넣지 않습니다. 암호 모드·초기값·키 관리·재사용 금지 조건을 무시한 채 클래스 이름만 선택해도 안전해지는 것은 아닙니다.[^securecoding][^tls]

### 099. 국제화와 지역화 — 보충

국제화는 여러 언어·지역에서 사용할 수 있도록 구조를 준비하는 것이고, 지역화는 특정 언어·지역에 맞는 표현을 적용하는 것입니다.[^locale][^resourcebundle]

| 기능 | 역할 |
| --- | --- |
| `Locale` | 언어·국가·변형 등의 지역 정보 |
| `ResourceBundle` | 지역별 메시지·자원 묶음 선택 |
| `NumberFormat` | 숫자·통화·백분율 표시 |
| `MessageFormat` | 메시지에 값을 넣어 구성 |
| `DateTimeFormatter` | 날짜·시간 형식 |
| `Collator` | 언어·지역 규칙을 고려한 문자열 비교 |
| `Normalizer` | 유니코드의 서로 다른 표현을 정규화 |

```java
String 완성형 = "가";
String 조합형 = "\u1100\u1161";
System.out.println(완성형.equals(조합형));
System.out.println(완성형.length() + "/" + 조합형.length());
System.out.println(완성형.equals(Normalizer.normalize(조합형, Normalizer.Form.NFC)));
```

출력:

```text
false
1/2
true
```

눈에 같아 보인다고 내부 문자 순서까지 같지는 않습니다. 정규화의 목적과 형식을 정하고 적용해야 합니다.[^normalizer]

`Locale.KOREA`가 한국 시간대를 설정한다는 뜻은 아닙니다. 지역·언어, 시간대, 문자 인코딩은 별도 설정입니다. 기계가 읽는 고정 형식에는 기본 지역 설정을 무심코 사용하지 않습니다.

자원 묶음은 요청 지역, 상위 지역, 기본 자원 등의 탐색·대체 규칙을 가집니다. 파일 하나가 없다고 모든 메시지가 바로 사라진다고 단정하지 않습니다. `String.compareTo`와 지역별 자연스러운 정렬은 같은 기준이 아닙니다.

### 100. 시스템·프로세스·설정·로그

운영체제와 연결할 때는 **현재 자바 실행 설정, 상속받은 환경, 별도 프로세스, 로그 기록**을 구분합니다.[^system][^processbuilder][^logging]

| 기능 | 대표 접근 | 주의 |
| --- | --- | --- |
| 시스템 속성 | `System.getProperty` | 자바 실행 설정. `-D`로 지정 가능 |
| 환경 변수 | `System.getenv` | 운영체제에서 받은 환경 정보 |
| 문자열 설정 모음 | `Properties` | 키·값과 기본값 처리 |
| 사용자·시스템 설정 | `Preferences` | 저장 위치·권한·영속화 정책 확인 |
| 외부 프로세스 | `ProcessBuilder` | 명령과 인수, 입출력, 종료 관리 |
| 실행 중 프로세스 | `Process`, `ProcessHandle` | 상태·종료·자식 관계 등 |
| 종료 훅 | `Runtime.addShutdownHook` | 정상 종료 정리용. 모든 강제 종료 보장은 없음 |
| 표준 로그 | `java.util.logging` | 수준·처리기·형식·필터 |

```java
Properties 설정 = new Properties();
설정.setProperty("모드", "연습");
System.out.println(설정.getProperty("모드"));
System.out.println(설정.getProperty("없는값", "기본"));
System.out.println(System.getProperty("java.version") != null);
```

출력:

```text
연습
기본
true
```

시스템 속성을 변경하는 것과 운영체제의 환경 변수를 변경하는 것은 다릅니다. `Preferences`나 평문 설정 파일을 비밀정보 전용 저장소로 취급하지 않습니다.

**프로세스 관리:** 명령 실행 시 허용된 실행 파일과 인수를 분리합니다. 셸의 파이프·리다이렉트 문법이 자동 해석된다고 가정하지 않습니다. 출력·오류 스트림을 소비하지 않으면 버퍼가 차서 자식 프로세스가 멈춘 것처럼 보일 수 있습니다. 시간 제한·종료 상태·정리 정책이 필요합니다.

**시간 측정:** `currentTimeMillis`는 시계 시각, `nanoTime`은 같은 실행 안에서 경과 시간을 측정할 때 쓰는 기준입니다. `nanoTime`을 달력 날짜로 변환하거나 서로 다른 가상 머신의 절대 시각처럼 비교하지 않습니다.

**로그:** 출력 수준만 아니라 처리기 수준·필터도 결과에 영향을 줍니다. 암호·인증 토큰·개인정보는 남기지 않습니다. 외부 로깅 라이브러리와 표준 로그의 역할을 구분하며, 예외를 무조건 여러 계층에서 반복 출력하지 않습니다.

<details markdown="1">
<summary>12부 한 줄로</summary>

통신은 요청·응답, 데이터베이스는 연결·질의·트랜잭션, 보안은 기밀성·검증·신뢰, 운영체제 연동은 설정·프로세스·로그의 경계를 구분합니다.

</details>

<span id="pitfalls"></span>

## 잘 놓치는 핵심

### 1. 반환값과 원본 변경을 분리합니다

`String.replace`·날짜의 `plusDays`·큰 숫자의 `add`는 결과를 돌려줍니다. 반면 `ArrayList.add`·`Arrays.sort`·`StringBuilder.append`는 대상의 상태를 바꿉니다. 메서드 이름만 보고 같은 방식으로 처리하지 않습니다.[^string][^time][^biginteger][^arraylist][^arrays][^builder]

### 2. 순서가 있다는 말과 정렬되었다는 말은 다릅니다

목록의 위치 순서, 연결 해시 구조의 삽입 순서, 트리의 정렬 순서, 우선순위 큐의 꺼내는 순서는 다릅니다. 특히 우선순위 큐의 전체 순회가 정렬 순서라는 보장은 없습니다.[^list][^linkedhashmap][^priorityqueue]

### 3. 같음의 기준은 하나가 아닙니다

| 기준 | 대표 사용 |
| --- | --- |
| 참조가 같은가 | `==`, 참조 동일성 맵 |
| 내용이 같은가 | 문자열의 `equals` |
| 해시 계약상 같은 키인가 | 해시 집합·해시 맵 |
| 정렬 기준에서 동순위인가 | 트리 집합·트리 맵 |

`BigDecimal`처럼 숫자 크기는 같아도 동등성 결과는 다를 수 있습니다.[^decimal][^identityhashmap]

### 4. 수정 불가 목록도 변해 보일 수 있습니다

원본을 보는 수정 불가 뷰는 원본 변경을 반영합니다. 복사본도 요소 객체가 가변이면 그 객체의 내부 변경을 볼 수 있습니다. 통로의 수정 제한, 구조 복사, 깊은 불변성은 별개입니다.[^collection][^collections]

### 5. 빈 결과·널·0은 다릅니다

빈 문자열, 널 문자열, 빈 목록, 빈 선택값, 데이터베이스 널, 정수 0은 다릅니다. 기본값을 넣기 전에 무엇이 비어 있는지 확인합니다.[^optional][^resultset]

### 6. 람다의 캡처 제한은 객체의 깊은 불변성을 뜻하지 않습니다

캡처한 지역 참조를 다시 대입할 수 없어도, 참조 대상의 변경 가능한 내부 상태는 바뀔 수 있습니다. 이런 공유 변경이 병렬 처리에서 문제가 될 수 있습니다.[^expressions][^streampackage]

### 7. 스트림의 중간 연산은 실행 보장 위치가 아닙니다

최종 결과에 필요 없는 연산은 최적화로 생략될 수 있습니다. `peek`·`map` 내부의 출력·외부 상태 변경 횟수를 프로그램의 핵심 규칙으로 사용하지 않습니다.[^stream]

### 8. 병렬화와 원자성은 다릅니다

여러 작업으로 나눈다고 공유 목록 추가나 합계 갱신이 자동으로 안전해지는 것은 아닙니다. 적절한 축약·수집 규칙과 동시성 도구를 사용합니다.[^streampackage][^concurrent]

### 9. 검사 예외는 컴파일할 때 발생하는 예외라는 뜻이 아닙니다

컴파일러가 “처리했는가, 호출자에게 선언했는가”를 검사한다는 뜻입니다. 예외 상황 자체는 실행 중 발생합니다.[^exceptions]

### 10. finally가 반환을 가릴 수 있습니다

정리 영역에서 다시 반환하거나 예외를 던지면 원래 결과를 잃을 수 있습니다. 자원 닫기는 가능하면 자동 자원 해제 구문으로 표현하고 주 예외·억제된 예외를 구분합니다.[^statements]

### 11. 입력이 끝났는지 확인한 뒤 형 변환합니다

바이트·문자 읽기는 `-1`, 줄 읽기는 널이 입력 끝입니다. 먼저 작은 타입으로 바꾸거나 빈 문자열과 혼동하면 판정이 틀어집니다.[^inputstream][^reader][^bufferedreader]

### 12. 새 입출력이라고 전부 비동기는 아닙니다

버퍼·채널·선택기·비동기 채널은 다른 추상화입니다. 버퍼의 `clear`도 데이터 삭제가 아니라 위치·범위 상태 변경입니다.[^buffer][^channels]

### 13. 통신 성공과 업무 성공은 다릅니다

연결이 열려도 응답 상태가 실패일 수 있고, 응답을 받았어도 원하는 데이터가 아닐 수 있습니다. 전송·상태 코드·본문 검증·업무 결과를 구분합니다.[^httpclient]

### 14. 예외가 났다고 트랜잭션이 자동으로 취소되지는 않습니다

자동 커밋 여부, 명시적 롤백, 연결 소유자, 풀 반환 시 상태를 확인합니다. 일괄 실행과 트랜잭션도 같은 개념이 아닙니다.[^connection]

### 15. 인코딩·압축·체크섬은 암호화나 인증을 대신하지 않습니다

표현을 바꾸거나 크기를 줄이는 것과, 비밀을 보호하고 위조를 막는 것은 목적이 다릅니다. 신뢰할 수 없는 직렬화·문서·압축 입력은 크기와 해석 범위를 제한합니다.[^base64][^zip][^crypto][^securecoding]

<span id="exam"></span>

## 시험·면접

### 1. 코드 문제를 푸는 순서

| 순서 | 먼저 볼 질문 |
| --- | --- |
| 1 | 필요한 타입·메서드·버전이 맞고 컴파일 가능한가? |
| 2 | 실제 구현체가 무엇이며 널·수정을 허용하는가? |
| 3 | 비교가 참조·동등성·정렬 중 무엇을 기준으로 하는가? |
| 4 | 반환값을 쓰는가, 원본을 바꾸는가, 원본과 연결된 뷰인가? |
| 5 | 지금 실행되는가, 최종 연산에서 실행되는가? |
| 6 | 순서가 보장되는가, 이미 소비한 스트림인가? |
| 7 | 예외가 발생하면 어디로 이동하며 어떤 출력이 건너뛰어지는가? |
| 8 | 자원은 어떤 순서로 닫히고 어떤 예외·결과가 남는가? |

이 순서는 이 학습노트의 문제를 풀기 위한 제안입니다. 모든 문제를 기계적으로 같은 순서로 읽어야 한다는 규칙은 아닙니다.

### 2. 핵심 암기표

| 질문 | 한 문장 답 |
| --- | --- |
| 문자열 내용 비교는? | `equals`를 사용합니다. |
| 문자열 길이는? | `char` 코드 단위 개수이며 바이트 수와 다릅니다. |
| 십진수 `2.0`과 `2.00`은? | 숫자 비교는 같지만 동등성은 다를 수 있습니다. |
| `ArrayList` 초기 용량 100의 크기는? | 요소를 넣기 전에는 0입니다. |
| `remove(1)`과 값 1 삭제는? | 인덱스 삭제와 객체 값 삭제를 구분합니다. |
| 해시 맵의 순서는? | 보장하지 않습니다. |
| 우선순위 큐의 반복 순서는? | 전체 정렬 순서 보장이 없습니다. |
| 배열을 목록으로 감싸면? | 고정 크기·원본 공유 여부를 확인합니다. |
| `Map`은 `Collection` 하위인가? | 아닙니다. |
| 함수형 인터페이스의 핵심은? | 하나의 추상적인 함수 계약입니다. |
| 스트림의 최종 연산이 없으면? | 연결한 중간 계산은 보통 진행되지 않습니다. |
| 빈 스트림의 전체 조건 검사는? | `allMatch`는 참입니다. |
| 수정할 수집 목록이 필요하면? | 원하는 구현체로 모으는 방식을 명시합니다. |
| 대체값 계산을 늦추려면? | `orElseGet`처럼 공급 동작을 넘깁니다. |
| 검사 예외의 뜻은? | 처리·전파 의무를 컴파일러가 검사합니다. |
| 여러 자동 자원은? | 등록의 역순으로 닫습니다. |
| 읽기 끝의 값은? | 단일 읽기는 `-1`, 줄 읽기는 널입니다. |
| 데이터베이스 매개변수 번호는? | 1부터 시작합니다. |
| 결과 집합의 첫 행을 읽으려면? | 먼저 `next()`로 이동합니다. |
| 트랜잭션 성공·실패 처리는? | 소유 경계에서 커밋·롤백을 명시합니다. |

표의 세부 조건은 해당 본문 절을 함께 확인합니다.

### 3. 1회독과 2회독

| 회독 | 우선 내용 |
| --- | --- |
| 1회독 | 문자열 비교·대표 메서드, 목록·집합·맵, 람다의 입출력, 기본 스트림, 예외 흐름, 자원 닫기, 바이트·문자, 데이터베이스 기본 순서 |
| 2회독 | 십진수 정밀도, 날짜·시간대, 컬렉션 뷰, 비교 계약, 병렬 축약, 버퍼 상태, 트랜잭션과 널 처리 |
| 선택 심화 | 개더러, 직렬화 내부, 압축·문서 보안, 통신 세부 설정, 암호 제공자, 운영체제 연동 |

기관이 제시한 실제 전공 범위가 있으면 이 구분보다 해당 범위를 우선합니다.

<span id="walkthrough"></span>

## 예시로 한 바퀴

### 1. 입력을 읽어 이름별 최신 점수를 저장합니다

아래 데이터는 설명을 위한 가상 입력입니다. 쉼표를 이름 안에 쓰지 않는 단순한 형식이며, 따옴표·줄바꿈을 포함하는 모든 표준 쉼표 구분 파일을 처리하는 범용 분석기는 아닙니다.

```java
import java.io.BufferedReader;
import java.io.StringReader;
import java.util.*;

public class Main {
    public static void main(String[] args) throws Exception {
        String 입력 = "민수,70\n지수,90\n민수,80\n잘못된줄\n영희,오류\n";
        Map<String, Integer> 최신점수 = new LinkedHashMap<>();
        int 오류수 = 0;

        try (BufferedReader 읽기 = new BufferedReader(new StringReader(입력))) {
            String 줄;
            while ((줄 = 읽기.readLine()) != null) {
                String[] 항목 = 줄.split(",", -1);
                if (항목.length != 2) {
                    오류수++;
                    continue;
                }
                String 이름 = 항목[0].strip();
                try {
                    int 점수 = Integer.parseInt(항목[1].strip());
                    if (이름.isBlank() || 점수 < 0 || 점수 > 100) {
                        오류수++;
                        continue;
                    }
                    최신점수.put(이름, 점수);
                } catch (NumberFormatException 예외) {
                    오류수++;
                }
            }
        }

        List<String> 합격자 = 최신점수.entrySet().stream()
                .filter(항목 -> 항목.getValue() >= 80)
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .map(Map.Entry::getKey)
                .toList();
        double 평균 = 최신점수.values().stream()
                .mapToInt(Integer::intValue)
                .average()
                .orElse(0.0);

        System.out.println("최신 점수: " + 최신점수);
        System.out.println("합격자: " + 합격자);
        System.out.println("평균: " + 평균);
        System.out.println("오류: " + 오류수);
    }
}
```

출력:

```text
최신 점수: {민수=80, 지수=90}
합격자: [지수, 민수]
평균: 85.0
오류: 2
```

전체 프로그램에는 `java.io.*`, `java.util.*`를 가져옵니다.

### 2. 실행 과정을 따라갑니다

| 입력 | 처리 | 현재 맵 |
| --- | --- | --- |
| 민수,70 | 새 이름 저장 | 민수 70 |
| 지수,90 | 새 이름 저장 | 민수 70, 지수 90 |
| 민수,80 | 같은 키의 값 갱신 | 민수 80, 지수 90 |
| 잘못된줄 | 항목 개수 오류 | 변경 없음 |
| 영희,오류 | 숫자 변환 예외 | 변경 없음 |

같은 이름의 새 점수는 기존 값을 교체합니다. 평균은 모든 입력 행이 아니라 **최종적으로 남은 사람별 점수**의 평균입니다.

### 3. 연결되는 개념을 확인합니다

| 사용한 코드 | 연결 개념 |
| --- | --- |
| `split`, `strip`, `isBlank` | 문자열 분석·검증 |
| `LinkedHashMap.put` | 키 중복과 값 교체·순서 |
| `try`와 `catch` | 잘못된 숫자 입력 처리 |
| 자동 자원 해제 | 읽기 자원 수명 |
| `filter` | 합격 기준 적용 |
| 비교기와 `sorted` | 점수 내림차순 |
| 메서드 참조 | 이름 추출 |
| `mapToInt`, `average` | 기본형 계산·빈 결과 |
| `toList` | 수정 불가 결과 목록 |

`합격자`에 요소를 추가해야 한다면 수집 방식을 바꿔야 합니다. 빈 자료의 평균을 0으로 정한 것은 **이 예제의 선택**이며, 실제 업무에서는 결과 없음으로 유지하는 것이 더 적절할 수도 있습니다.

<span id="questions"></span>

## 객관식 문제

다음은 이 학습노트를 위해 직접 구성한 **25문제**입니다. 실제 기출문제라는 뜻은 아닙니다. 별도 설명이 없으면 자바 21, 필요한 패키지를 가져온 상태이며 코드 블록은 독립적으로 실행합니다.

정답을 보기 전에 **컴파일 가능 여부 → 처리 기준 → 실행 결과** 순서로 판단합니다.

### 문제 1. 문자열 풀과 내용 비교

다음 코드의 출력으로 옳은 것은?

```java
String 원본 = "자바";
String 새값 = new String("자바");
System.out.println(원본 == 새값);
System.out.println(원본.equals(새값));
```

| 번호 | 선택지 |
| --- | --- |
| ① | `true`, `true` |
| ② | `false`, `true` |
| ③ | `false`, `false` |
| ④ | 컴파일 오류 |

<details markdown="1">
<summary>정답과 모든 선택지 해설</summary>

**정답: ②**

출력:

```text
false
true
```

| 선택지 | 판정 | 이유 |
| --- | --- | --- |
| ① | 틀림 | 첫 비교는 새 객체와 리터럴의 참조 비교라서 거짓입니다. |
| ② | 맞음 | 새 객체의 참조는 다르지만 문자열 내용은 같습니다. |
| ③ | 틀림 | 내용이 같으므로 두 번째 비교는 참입니다. |
| ④ | 틀림 | 문법과 타입이 모두 유효합니다. |

**기억할 점:** 문자열 내용이 같은지와 참조가 같은지를 분리합니다.[^string]

</details>

### 문제 2. 문자열 분리

다음 두 값의 출력으로 옳은 것은?

```java
System.out.println("가,나,,".split(",").length);
System.out.println("가,나,,".split(",", -1).length);
```

| 번호 | 선택지 |
| --- | --- |
| ① | `2`, `2` |
| ② | `4`, `4` |
| ③ | `2`, `4` |
| ④ | `4`, `2` |

<details markdown="1">
<summary>정답과 모든 선택지 해설</summary>

**정답: ③**

출력:

```text
2
4
```

| 선택지 | 판정 | 이유 |
| --- | --- | --- |
| ① | 틀림 | 두 번째는 뒤쪽 빈 문자열을 보존하므로 4입니다. |
| ② | 틀림 | 첫 번째는 뒤쪽 빈 문자열을 버리므로 2입니다. |
| ③ | 맞음 | 기본 분리는 뒤의 빈 값을 버리고 음수 제한값은 보존합니다. |
| ④ | 틀림 | 두 메서드의 정책을 반대로 적용했습니다. |

**기억할 점:** 분리 결과의 빈 문자열을 세는 문제입니다.[^string]

</details>

### 문제 3. 정밀한 십진수의 비교

다음 출력으로 옳은 것은?

```java
BigDecimal 첫째 = new BigDecimal("3.0");
BigDecimal 둘째 = new BigDecimal("3.00");
System.out.println(첫째.equals(둘째));
System.out.println(첫째.compareTo(둘째));
```

| 번호 | 선택지 |
| --- | --- |
| ① | `false`, `0` |
| ② | `true`, `0` |
| ③ | `false`, `-1` |
| ④ | `true`, `1` |

<details markdown="1">
<summary>정답과 모든 선택지 해설</summary>

**정답: ①**

출력:

```text
false
0
```

| 선택지 | 판정 | 이유 |
| --- | --- | --- |
| ① | 맞음 | 동등성은 소수 자릿수 정보까지 보고 숫자 크기는 같게 봅니다. |
| ② | 틀림 | 동등성 검사에서는 두 값의 소수 자릿수가 다릅니다. |
| ③ | 틀림 | 숫자 크기가 같으므로 비교 결과는 0입니다. |
| ④ | 틀림 | 동등성과 숫자 비교 결과가 모두 틀렸습니다. |

**기억할 점:** 동등성과 정렬상 같음을 같은 규칙으로 외우지 않습니다.[^decimal]

</details>

### 문제 4. 날짜·시각·시간대

옳은 설명은?

| 번호 | 선택지 |
| --- | --- |
| ① | `LocalDateTime`만 있으면 전 세계의 한 순간이 항상 확정된다. |
| ② | `Period`의 일 부분은 항상 전체 경과 일수이다. |
| ③ | `Locale.KOREA`는 한국 시간대를 자동 지정한다. |
| ④ | 달력상의 하루와 정확한 24시간은 지역 시간대 규칙에 따라 다를 수 있다. |

<details markdown="1">
<summary>정답과 모든 선택지 해설</summary>

**정답: ④**

| 선택지 | 판정 | 이유 |
| --- | --- | --- |
| ① | 틀림 | 지역 시간대나 오프셋 정보가 없으므로 항상 확정할 수 없습니다. |
| ② | 틀림 | 년·월·일의 구성 요소와 전체 일수를 구분해야 합니다. |
| ③ | 틀림 | 언어·지역 설정과 시간대는 별개입니다. |
| ④ | 맞음 | 일광절약시간 변화 같은 시간대 규칙에서 차이가 생길 수 있습니다. |

**기억할 점:** 날짜량·시간량·지역·시간대를 구분합니다.[^time][^zoneddatetime][^locale]

</details>

### 문제 5. 배열의 이진 검색

다음 코드의 출력으로 옳은 것은?

```java
int[] 수들 = {2, 5, 7, 9};
System.out.println(Arrays.binarySearch(수들, 6));
```

| 번호 | 선택지 |
| --- | --- |
| ① | `-1` |
| ② | `-3` |
| ③ | `2` |
| ④ | `3` |

<details markdown="1">
<summary>정답과 모든 선택지 해설</summary>

**정답: ②**

출력:

```text
-3
```

| 선택지 | 판정 | 이유 |
| --- | --- | --- |
| ① | 틀림 | -1은 삽입 위치가 0인 실패를 뜻합니다. |
| ② | 맞음 | 6의 삽입 위치는 2이므로 음수로 바꾸고 1을 더 빼면 -3입니다. |
| ③ | 틀림 | 2는 삽입 위치이지만 실패 시 그대로 반환하지 않습니다. |
| ④ | 틀림 | 3은 기존 요소의 인덱스이며 찾는 값이 없습니다. |

**기억할 점:** 검색 실패의 음수값에서 삽입 위치를 구분합니다.[^arrays]

</details>

### 문제 6. 리스트의 삭제

다음 출력으로 옳은 것은?

```java
List<Integer> 수들 = new ArrayList<>(List.of(10, 20, 30));
수들.remove(1);
수들.remove(Integer.valueOf(10));
System.out.println(수들);
```

| 번호 | 선택지 |
| --- | --- |
| ① | `[20, 30]` |
| ② | `[10, 30]` |
| ③ | `[30]` |
| ④ | 빈 목록 |

<details markdown="1">
<summary>정답과 모든 선택지 해설</summary>

**정답: ③**

출력:

```text
[30]
```

| 선택지 | 판정 | 이유 |
| --- | --- | --- |
| ① | 틀림 | 첫 호출은 값 1이 아니라 인덱스 1의 값 20을 지웁니다. |
| ② | 틀림 | 두 번째 호출이 값 10을 추가로 지웁니다. |
| ③ | 맞음 | 인덱스 1 삭제 뒤 값 10 삭제이므로 30만 남습니다. |
| ④ | 틀림 | 30은 어느 호출에서도 삭제되지 않습니다. |

**기억할 점:** 인수의 타입으로 선택되는 중복 정의를 구분합니다.[^list]

</details>

### 문제 7. 집합의 중복 판정

다음 두 집합의 크기는?

```java
List<BigDecimal> 값들 = List.of(new BigDecimal("1.0"), new BigDecimal("1.00"));
System.out.println(new HashSet<>(값들).size());
System.out.println(new TreeSet<>(값들).size());
```

| 번호 | 선택지 |
| --- | --- |
| ① | `1`, `1` |
| ② | `1`, `2` |
| ③ | `2`, `2` |
| ④ | `2`, `1` |

<details markdown="1">
<summary>정답과 모든 선택지 해설</summary>

**정답: ④**

출력:

```text
2
1
```

| 선택지 | 판정 | 이유 |
| --- | --- | --- |
| ① | 틀림 | 해시 집합은 두 값의 동등성 결과가 달라 둘 다 저장합니다. |
| ② | 틀림 | 두 집합의 비교 기준을 반대로 보았습니다. |
| ③ | 틀림 | 트리 집합은 숫자 비교에서 같으므로 하나로 봅니다. |
| ④ | 맞음 | 해시 집합은 동등성, 트리 집합은 정렬 비교 결과를 사용합니다. |

**기억할 점:** 같은 데이터도 선택한 자료구조의 비교 기준에 따라 결과가 다릅니다.[^decimal][^treeset]

</details>

### 문제 8. 맵의 널 값과 키 부재

다음 출력으로 옳은 것은?

```java
Map<String, Integer> 자료 = new HashMap<>();
자료.put("가", null);
System.out.println(자료.getOrDefault("가", 0));
System.out.println(자료.getOrDefault("나", 0));
```

| 번호 | 선택지 |
| --- | --- |
| ① | `0`, `0` |
| ② | `null`, `0` |
| ③ | `null`, `null` |
| ④ | 널 포인터 예외 |

<details markdown="1">
<summary>정답과 모든 선택지 해설</summary>

**정답: ②**

출력:

```text
null
0
```

| 선택지 | 판정 | 이유 |
| --- | --- | --- |
| ① | 틀림 | 첫 키는 존재하고 널 값이 연결되어 있습니다. |
| ② | 맞음 | 존재하는 널 값은 그대로, 없는 키만 기본값을 사용합니다. |
| ③ | 틀림 | 두 번째 키는 없으므로 지정한 기본값 0을 반환합니다. |
| ④ | 틀림 | 예제는 널 래퍼를 기본형에 대입하지 않고 그대로 출력합니다. |

**기억할 점:** 널 반환과 키 없음은 같은 상태가 아닙니다.[^map]

</details>

### 문제 9. 우선순위 큐

옳은 설명은?

| 번호 | 선택지 |
| --- | --- |
| ① | 기본 자연 순서의 정수 큐는 반복해서 꺼내면 작은 값부터 나온다. |
| ② | 반복자로 순회하면 항상 전체 정렬 순서이다. |
| ③ | 같은 우선순위에서는 언제나 먼저 넣은 값이 먼저 나온다. |
| ④ | 빈 큐의 `poll()`은 반드시 예외를 던진다. |

<details markdown="1">
<summary>정답과 모든 선택지 해설</summary>

**정답: ①**

| 선택지 | 판정 | 이유 |
| --- | --- | --- |
| ① | 맞음 | 기본 비교 기준에서 최소값이 머리에 오므로 반복 제거 시 작은 값부터 나옵니다. |
| ② | 틀림 | 반복자의 전체 순서는 정렬되어 있다고 보장하지 않습니다. |
| ③ | 틀림 | 동순위의 선입선출은 보장하지 않습니다. |
| ④ | 틀림 | 빈 큐의 poll은 널을 반환합니다. |

**기억할 점:** 꺼내기 순서와 순회 순서, 동순위 처리까지 따로 봅니다.[^priorityqueue]

</details>

### 문제 10. 복사본과 수정 불가 뷰

다음 두 출력으로 옳은 것은?

```java
List<String> 원본 = new ArrayList<>(List.of("가", "나"));
List<String> 뷰 = Collections.unmodifiableList(원본);
List<String> 복사 = List.copyOf(원본);
원본.set(0, "다");
System.out.println(뷰);
System.out.println(복사);
```

| 번호 | 선택지 |
| --- | --- |
| ① | `[가, 나]`, `[가, 나]` |
| ② | `[다, 나]`, `[다, 나]` |
| ③ | `[다, 나]`, `[가, 나]` |
| ④ | 첫 번째 `set`에서 수정 불가 예외 |

<details markdown="1">
<summary>정답과 모든 선택지 해설</summary>

**정답: ③**

출력:

```text
[다, 나]
[가, 나]
```

| 선택지 | 판정 | 이유 |
| --- | --- | --- |
| ① | 틀림 | 수정 불가 뷰는 원본의 변경을 반영합니다. |
| ② | 틀림 | copyOf의 결과는 원본 목록의 이후 교체를 반영하지 않습니다. |
| ③ | 맞음 | 뷰는 원본을 보고 복사 결과는 기존 요소를 유지합니다. |
| ④ | 틀림 | set의 대상은 변경 가능한 원본 ArrayList입니다. |

**기억할 점:** 수정 금지 통로가 독립된 저장소를 뜻하지는 않습니다.[^collections][^list]

</details>

### 문제 11. 반복 중 수정

옳은 설명은?

| 번호 | 선택지 |
| --- | --- |
| ① | 빠른 실패는 모든 잘못된 변경을 반드시 감지한다. |
| ② | 삭제를 지원하는 반복자는 `next()`로 받은 요소를 `remove()`로 지울 수 있다. |
| ③ | 동시 수정 예외는 반드시 두 개 이상의 스레드에서만 발생한다. |
| ④ | 복사 기반 목록의 스냅샷 반복자는 모든 원본 변경을 즉시 반영한다. |

<details markdown="1">
<summary>정답과 모든 선택지 해설</summary>

**정답: ②**

| 선택지 | 판정 | 이유 |
| --- | --- | --- |
| ① | 틀림 | 빠른 실패는 최선의 탐지 방식이며 절대 보장이 아닙니다. |
| ② | 맞음 | 반복자의 상태·삭제 지원 조건을 지키면 허용되는 삭제 경로입니다. |
| ③ | 틀림 | 한 스레드에서 반복 중 원본을 잘못 바꿔도 발생할 수 있습니다. |
| ④ | 틀림 | 스냅샷은 생성 당시의 내용을 순회합니다. |

**기억할 점:** 허용되는 수정 통로와 순회 정책을 구분합니다.[^iterator][^arraylist][^copyonwrite]

</details>

### 문제 12. 함수 합성

다음 출력으로 옳은 것은?

```java
Function<Integer, Integer> 두배 = 값 -> 값 * 2;
Function<Integer, Integer> 더하기 = 값 -> 값 + 3;
System.out.println(두배.andThen(더하기).apply(4));
System.out.println(두배.compose(더하기).apply(4));
```

| 번호 | 선택지 |
| --- | --- |
| ① | `8`, `8` |
| ② | `14`, `11` |
| ③ | `11`, `11` |
| ④ | `11`, `14` |

<details markdown="1">
<summary>정답과 모든 선택지 해설</summary>

**정답: ④**

출력:

```text
11
14
```

| 선택지 | 판정 | 이유 |
| --- | --- | --- |
| ① | 틀림 | 두 번째 함수의 덧셈을 빠뜨렸습니다. |
| ② | 틀림 | andThen과 compose의 순서를 반대로 적용했습니다. |
| ③ | 틀림 | compose에서는 3을 먼저 더하므로 14입니다. |
| ④ | 맞음 | andThen은 두 배 뒤 3 더하기, compose는 3 더한 뒤 두 배입니다. |

**기억할 점:** 이름을 외우기보다 함수가 적용되는 순서를 그립니다.[^functional]

</details>

### 문제 13. 스트림의 처리 순서

다음 출력으로 옳은 것은?

```java
System.out.println(Stream.of(4, 1, 3, 2)
        .filter(값 -> 값 > 1)
        .limit(2)
        .map(값 -> 값 * 2)
        .toList());
```

| 번호 | 선택지 |
| --- | --- |
| ① | `[4, 6]` |
| ② | `[6, 8]` |
| ③ | `[8, 6]` |
| ④ | `[8, 6, 4]` |

<details markdown="1">
<summary>정답과 모든 선택지 해설</summary>

**정답: ③**

출력:

```text
[8, 6]
```

| 선택지 | 판정 | 이유 |
| --- | --- | --- |
| ① | 틀림 | 원본을 자동으로 정렬하지 않습니다. |
| ② | 틀림 | 원본의 만남 순서는 4가 3보다 앞입니다. |
| ③ | 맞음 | 조건을 통과한 4·3·2 중 앞 두 개만 남겨 두 배로 만듭니다. |
| ④ | 틀림 | limit 때문에 2에서 나온 4는 포함되지 않습니다. |

**기억할 점:** 정렬 연산이 없다면 임의로 크기순으로 바꾸지 않습니다.[^stream]

</details>

### 문제 14. 빈 스트림의 조건 검사

다음 출력으로 옳은 것은?

```java
System.out.println(Stream.<Integer>empty().allMatch(값 -> 값 > 0));
System.out.println(Stream.<Integer>empty().anyMatch(값 -> 값 > 0));
```

| 번호 | 선택지 |
| --- | --- |
| ① | `false`, `false` |
| ② | `true`, `false` |
| ③ | `false`, `true` |
| ④ | `true`, `true` |

<details markdown="1">
<summary>정답과 모든 선택지 해설</summary>

**정답: ②**

출력:

```text
true
false
```

| 선택지 | 판정 | 이유 |
| --- | --- | --- |
| ① | 틀림 | 전체 조건 검사는 거짓인 요소가 없으므로 참입니다. |
| ② | 맞음 | 모두 만족하지 않는 반례는 없고, 조건을 만족한 실제 요소도 없습니다. |
| ③ | 틀림 | 두 결과가 반대입니다. |
| ④ | 틀림 | 아무 요소도 없으므로 anyMatch는 거짓입니다. |

**기억할 점:** 빈 입력의 전체 조건과 존재 조건을 구분합니다.[^stream]

</details>

### 문제 15. 스트림의 목록 수집

수정 가능한 `ArrayList`로 수집하려는 의도를 가장 명확히 보장하는 것은?

| 번호 | 선택지 |
| --- | --- |
| ① | `흐름.toList()` |
| ② | `흐름.collect(Collectors.toList())` |
| ③ | `흐름.collect(Collectors.toUnmodifiableList())` |
| ④ | `흐름.collect(Collectors.toCollection(ArrayList::new))` |

<details markdown="1">
<summary>정답과 모든 선택지 해설</summary>

**정답: ④**

| 선택지 | 판정 | 이유 |
| --- | --- | --- |
| ① | 틀림 | 반환 목록은 수정 불가입니다. |
| ② | 틀림 | 수정 가능성이나 구현체를 명세가 보장하지 않습니다. |
| ③ | 틀림 | 이름 그대로 수정 불가 목록을 만듭니다. |
| ④ | 맞음 | 원하는 저장소의 생성자를 명시합니다. |

**기억할 점:** 특정 실행에서 우연히 되는 것과 보장된 계약을 구분합니다.[^collectors][^stream]

</details>

### 문제 16. 대체값의 계산 시점

다음 코드에서 `생성`이 출력되는 횟수는?

```java
class 공급자 {
    String 생성() {
        System.out.println("생성");
        return "대체";
    }
}
공급자 공급 = new 공급자();
Optional<String> 값 = Optional.of("존재");
값.orElse(공급.생성());
값.orElseGet(공급::생성);
```

| 번호 | 선택지 |
| --- | --- |
| ① | 0회 |
| ② | 2회 |
| ③ | 1회 |
| ④ | 값이 있으므로 컴파일 오류 |

<details markdown="1">
<summary>정답과 모든 선택지 해설</summary>

**정답: ③**

출력:

```text
생성
```

| 선택지 | 판정 | 이유 |
| --- | --- | --- |
| ① | 틀림 | orElse 인수의 메서드는 호출 전에 평가됩니다. |
| ② | 틀림 | orElseGet의 공급 함수는 값이 있어 실행되지 않습니다. |
| ③ | 맞음 | orElse 인수 계산에서만 한 번 실행됩니다. |
| ④ | 틀림 | 존재하는 값에 두 메서드를 호출해도 정상 문법입니다. |

**기억할 점:** 대체 결과를 넘기는가, 대체 결과를 만드는 동작을 넘기는가를 봅니다.[^optional]

</details>

### 문제 17. 병렬 스트림

옳은 설명은?

| 번호 | 선택지 |
| --- | --- |
| ① | 병렬 처리하면 결과 목록의 순서가 반드시 무작위가 된다. |
| ② | 순서 있는 스트림을 `toList()`로 수집하면 정의된 만남 순서를 유지한다. |
| ③ | 병렬 `forEach`로 공유 `ArrayList`에 추가하면 자동으로 안전하다. |
| ④ | 처리할 요소가 적을수록 병렬 방식이 항상 빠르다. |

<details markdown="1">
<summary>정답과 모든 선택지 해설</summary>

**정답: ②**

| 선택지 | 판정 | 이유 |
| --- | --- | --- |
| ① | 틀림 | 처리 스레드의 실행 순서와 결과의 만남 순서는 다릅니다. |
| ② | 맞음 | toList는 존재하는 만남 순서를 유지하는 결과를 제공합니다. |
| ③ | 틀림 | 일반 ArrayList의 동시 변경은 안전하게 보장되지 않습니다. |
| ④ | 틀림 | 분할·조정 비용으로 더 느려질 수 있습니다. |

**기억할 점:** 병렬 여부만으로 순서·안전성·성능을 모두 결정하지 않습니다.[^stream][^streampackage]

</details>

### 문제 18. 검사 예외

옳은 설명은?

| 번호 | 선택지 |
| --- | --- |
| ① | 검사 예외는 처리하거나 전파 선언을 해야 하는지를 컴파일러가 확인한다. |
| ② | 검사 예외는 프로그램 실행 중에는 발생하지 않는다. |
| ③ | RuntimeException은 반드시 catch해야 한다. |
| ④ | Exception의 모든 하위 타입은 검사 예외이다. |

<details markdown="1">
<summary>정답과 모든 선택지 해설</summary>

**정답: ①**

| 선택지 | 판정 | 이유 |
| --- | --- | --- |
| ① | 맞음 | 검사의 대상은 처리·전파 의무입니다. |
| ② | 틀림 | 예외 상황은 실행 중 발생합니다. |
| ③ | 틀림 | 비검사 예외이므로 컴파일러의 처리 의무가 없습니다. |
| ④ | 틀림 | RuntimeException 계열은 예외입니다. |

**기억할 점:** 컴파일 시 검사와 실행 시 발생을 구분합니다.[^exceptions]

</details>

### 문제 19. 정리 영역의 반환

다음 출력으로 옳은 것은? 이 코드는 권장 설계가 아니라 동작 판별용입니다.

```java
public class Main {
    static int 계산() {
        try {
            return 1;
        } finally {
            return 2;
        }
    }
    public static void main(String[] args) {
        System.out.println(계산());
    }
}
```

| 번호 | 선택지 |
| --- | --- |
| ① | 1 |
| ② | 컴파일 오류 |
| ③ | 2 |
| ④ | 아무것도 출력되지 않음 |

<details markdown="1">
<summary>정답과 모든 선택지 해설</summary>

**정답: ③**

출력:

```text
2
```

| 선택지 | 판정 | 이유 |
| --- | --- | --- |
| ① | 틀림 | finally의 새 반환이 기존 반환을 덮습니다. |
| ② | 틀림 | 이 구조는 경고 대상이 될 수 있지만 자바 21에서 컴파일됩니다. |
| ③ | 맞음 | 정리 영역에서 2를 반환하므로 기존 결과 1이 가려집니다. |
| ④ | 틀림 | 메서드가 2를 반환하고 출력합니다. |

**기억할 점:** 정리 코드에서 반환·예외를 새로 만들면 이전 결과를 잃을 수 있습니다.[^statements]

</details>

### 문제 20. 자동 자원 닫기 순서

다음 출력 순서로 옳은 것은?

```java
class 자원 implements AutoCloseable {
    private final String 이름;
    자원(String 이름) { this.이름 = 이름; }
    public void close() { System.out.println(이름); }
}
try (자원 첫째 = new 자원("하나"); 자원 둘째 = new 자원("둘")) {
    // 본문은 비어 있습니다.
}
```

| 번호 | 선택지 |
| --- | --- |
| ① | 하나, 둘 |
| ② | 둘만 출력 |
| ③ | 하나만 출력 |
| ④ | 둘, 하나 |

<details markdown="1">
<summary>정답과 모든 선택지 해설</summary>

**정답: ④**

출력:

```text
둘
하나
```

| 선택지 | 판정 | 이유 |
| --- | --- | --- |
| ① | 틀림 | 등록 순서가 아니라 역순으로 닫습니다. |
| ② | 틀림 | 첫째도 등록된 자원이므로 닫습니다. |
| ③ | 틀림 | 둘째도 등록된 자원이므로 닫습니다. |
| ④ | 맞음 | 둘째를 먼저 닫고 첫째를 닫습니다. |

**기억할 점:** 닫는 순서와 닫기 실패 시 예외 보존까지 연결해 복습합니다.[^statements]

</details>

### 문제 21. 빈 줄과 입력 종료

다음 출력으로 옳은 것은?

```java
try (BufferedReader 읽기 = new BufferedReader(new StringReader("\n"))) {
    System.out.println("[" + 읽기.readLine() + "]");
    System.out.println(읽기.readLine());
}
```

| 번호 | 선택지 |
| --- | --- |
| ① | `[]`, `null` |
| ② | `[null]`, 빈 줄 |
| ③ | `[-1]`, `-1` |
| ④ | 첫 읽기에서 예외 |

<details markdown="1">
<summary>정답과 모든 선택지 해설</summary>

**정답: ①**

출력:

```text
[]
null
```

| 선택지 | 판정 | 이유 |
| --- | --- | --- |
| ① | 맞음 | 첫 줄은 빈 문자열이고 그다음은 입력 끝이므로 널입니다. |
| ② | 틀림 | 빈 줄은 널이 아니라 길이 0의 문자열입니다. |
| ③ | 틀림 | readLine의 종료값은 정수 -1이 아닙니다. |
| ④ | 틀림 | 빈 줄은 정상 입력입니다. |

**기억할 점:** 바이트 읽기·문자 읽기·줄 읽기의 반환 계약을 구분합니다.[^bufferedreader]

</details>

### 문제 22. 버퍼의 상태

다음 코드 마지막의 위치와 한계는?

```java
ByteBuffer 버퍼 = ByteBuffer.allocate(5);
버퍼.put((byte) 1).put((byte) 2).put((byte) 3);
버퍼.flip();
System.out.println(버퍼.position() + "/" + 버퍼.limit());
```

| 번호 | 선택지 |
| --- | --- |
| ① | `3/5` |
| ② | `0/5` |
| ③ | `0/3` |
| ④ | `3/3` |

<details markdown="1">
<summary>정답과 모든 선택지 해설</summary>

**정답: ③**

출력:

```text
0/3
```

| 선택지 | 판정 | 이유 |
| --- | --- | --- |
| ① | 틀림 | flip 이전 쓰기 상태입니다. |
| ② | 틀림 | clear의 대표 결과와 혼동한 것입니다. |
| ③ | 맞음 | 쓴 위치 3을 한계로 두고 읽기 위치를 0으로 돌립니다. |
| ④ | 틀림 | 위치를 처음으로 돌리는 동작을 빠뜨렸습니다. |

**기억할 점:** flip은 내용 뒤집기가 아니라 읽을 범위·위치 조정입니다.[^buffer]

</details>

### 문제 23. 데이터베이스 조회

옳은 설명은?

| 번호 | 선택지 |
| --- | --- |
| ① | 첫 매개변수는 `setInt(0, 값)`으로 지정한다. |
| ② | 결과 집합을 받으면 첫 행에 이미 위치하므로 바로 읽는다. |
| ③ | 준비된 명령의 물음표에 테이블 이름을 일반 값처럼 결합하면 된다. |
| ④ | 매개변수 번호는 1부터 시작하고 결과 행은 `next()`로 이동한다. |

<details markdown="1">
<summary>정답과 모든 선택지 해설</summary>

**정답: ④**

| 선택지 | 판정 | 이유 |
| --- | --- | --- |
| ① | 틀림 | 매개변수 번호는 1부터입니다. |
| ② | 틀림 | 초기 커서는 첫 행 앞에 있으므로 먼저 이동해야 합니다. |
| ③ | 틀림 | 물음표는 일반적으로 값의 자리이며 식별자를 대신하지 않습니다. |
| ④ | 맞음 | 두 규칙 모두 맞습니다. |

**기억할 점:** 배열의 인덱스 규칙과 데이터베이스 표준의 번호 규칙을 혼동하지 않습니다.[^prepared][^resultset]

</details>

### 문제 24. 트랜잭션

옳은 설명은?

| 번호 | 선택지 |
| --- | --- |
| ① | 자동 커밋을 끄면 모든 예외에서 자동으로 롤백된다. |
| ② | 트랜잭션 소유 경계에서 성공 시 커밋, 실패 시 롤백을 명시적으로 관리한다. |
| ③ | 연결을 닫으면 모든 데이터베이스에서 활성 트랜잭션이 반드시 커밋된다. |
| ④ | 자동 커밋을 참으로 되돌려도 진행 중 작업의 확정에는 절대 영향이 없다. |

<details markdown="1">
<summary>정답과 모든 선택지 해설</summary>

**정답: ②**

| 선택지 | 판정 | 이유 |
| --- | --- | --- |
| ① | 틀림 | 예외와 롤백은 별도 처리입니다. |
| ② | 맞음 | 어느 계층이 트랜잭션을 소유하는지 정하고 확정·취소합니다. |
| ③ | 틀림 | 활성 트랜잭션은 명시적으로 종료해야 하며 닫기 결과를 일괄 단정하지 않습니다. |
| ④ | 틀림 | 자동 커밋 전환은 진행 중 트랜잭션을 커밋할 수 있습니다. |

**기억할 점:** 설정 변경·예외·연결 해제와 트랜잭션 종료를 분리합니다.[^connection]

</details>

### 문제 25. 보안 기능의 목적

옳은 설명은?

| 번호 | 선택지 |
| --- | --- |
| ① | Base64는 키 없이 복원 가능한 표현 변환이며 암호화가 아니다. |
| ② | 일반 체크섬만 맞으면 공격자가 내용을 바꾸지 않았음이 인증된다. |
| ③ | 객체를 직렬화하면 외부에서 내용을 읽을 수 없도록 자동 암호화된다. |
| ④ | 통신이 실패하면 모든 인증서를 신뢰하도록 검증을 끄는 것이 기본 해결책이다. |

<details markdown="1">
<summary>정답과 모든 선택지 해설</summary>

**정답: ①**

| 선택지 | 판정 | 이유 |
| --- | --- | --- |
| ① | 맞음 | 표현 규칙을 아는 누구나 복원할 수 있습니다. |
| ② | 틀림 | 우발적 손상 확인과 공격자에 대한 인증은 다릅니다. |
| ③ | 틀림 | 직렬화는 상태 표현이며 기밀성 보호가 아닙니다. |
| ④ | 틀림 | 상대 검증을 무력화하므로 원인과 신뢰 설정을 올바르게 점검해야 합니다. |

**기억할 점:** 인코딩·압축·직렬화·인증·암호화의 목적을 구분합니다.[^base64][^zip][^serializable][^tls]

</details>

### 정답 모아 보기

<details markdown="1">
<summary>25문제 정답표</summary>

| 문제 | 정답 | 문제 | 정답 | 문제 | 정답 | 문제 | 정답 | 문제 | 정답 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | ② | 2 | ③ | 3 | ① | 4 | ④ | 5 | ② |
| 6 | ③ | 7 | ④ | 8 | ② | 9 | ① | 10 | ③ |
| 11 | ② | 12 | ④ | 13 | ③ | 14 | ② | 15 | ④ |
| 16 | ③ | 17 | ② | 18 | ① | 19 | ③ | 20 | ④ |
| 21 | ① | 22 | ③ | 23 | ④ | 24 | ② | 25 | ① |

</details>


## 예제 확인 범위와 참고 자료

이 글의 코드는 설명을 위한 학습 예제입니다. 특정 기관의 기출문제를 복제한 것이 아니며, 객관식 25문제도 이 글의 개념을 확인하도록 직접 구성했습니다.

| 확인 항목 | 결과와 한계 |
| --- | --- |
| 기준 | 자바 21, 한글 소스는 UTF-8 인코딩 |
| 컴파일 | 자바 코드 블록 69개 확인. 짧은 조각 예제에는 가져오기 구문과 실행 틀을 추가 |
| 실행·출력 | 실행 예제 66개를 각각 실행하고 본문에 적힌 출력과 대조 |
| 외부 연동 | 웹 요청 메서드 1개·데이터베이스 메서드 2개는 컴파일만 확인 |
| 개더러 | 자바 24 공식 문서로 개념 확인. 자바 21 실행 예제에 섞지 않음 |
| 통합 환경 | 실제 서버·드라이버·연결 풀·데이터베이스 조합을 시험했다는 뜻은 아님 |

사용한 컴파일 기준은 다음과 같습니다.

```text
javac --release 21 -encoding UTF-8
```

본문 각주는 자바 언어 명세와 공식 표준 라이브러리 문서로 연결됩니다. 오래된 공식 학습 자료는 구조 이해용으로 사용하며, 현재 버전의 정확한 메서드 계약은 자바 21 문서를 우선합니다. 버전·구현·외부 시스템에 따라 달라지는 사항은 본문에서 별도로 구분했습니다.

## 다음에 이을 글

**자바 동시성·가상 머신·실행 구조 정리 — 13~16부**입니다.

스레드와 동기화에서 시작해 자바 메모리 모델·가상 스레드·가비지 컬렉션·클래스 로딩·리플렉션·모듈까지 연결합니다. 이번 편의 “데이터를 어떻게 처리하는가”에서 다음 편의 “그 코드가 동시에, 어떤 실행 구조에서 동작하는가”로 이어집니다.

[^gatherers]: [Gatherers — 자바 24 표준 문서](https://docs.oracle.com/en/java/javase/24/docs/api/java.base/java/util/stream/Gatherers.html)

[^string]: [String — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/String.html)

[^expressions]: [자바 언어 명세 21 — 15장 표현식](https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html)

[^regex]: [Pattern — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/regex/Pattern.html)

[^normalizer]: [Normalizer — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/text/Normalizer.html)

[^builder]: [StringBuilder — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/StringBuilder.html)

[^bufferstring]: [StringBuffer — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/StringBuffer.html)

[^matcher]: [Matcher — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/regex/Matcher.html)

[^math]: [Math — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Math.html)

[^biginteger]: [BigInteger — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/math/BigInteger.html)

[^strictmath]: [StrictMath — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/StrictMath.html)

[^strictfp]: [자바 17 변경 사항 — 항상 엄격한 부동소수점 계산](https://docs.oracle.com/en/java/javase/17/migrate/significant-changes-jdk-release.html)

[^decimal]: [BigDecimal — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/math/BigDecimal.html)

[^time]: [java.time 패키지 — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/package-summary.html)

[^datetimeformat]: [DateTimeFormatter — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/format/DateTimeFormatter.html)

[^zoneddatetime]: [ZonedDateTime — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/ZonedDateTime.html)

[^calendar]: [Calendar — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Calendar.html)

[^objects]: [Objects — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Objects.html)

[^arrays]: [Arrays — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Arrays.html)

[^random]: [java.util.random 패키지 — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/random/package-summary.html)

[^securerandom]: [SecureRandom — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/security/SecureRandom.html)

[^base64]: [Base64 — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Base64.html)

[^collection]: [Collection — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Collection.html)

[^list]: [List — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/List.html)

[^map]: [Map — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Map.html)

[^arraylist]: [ArrayList — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/ArrayList.html)

[^linkedlist]: [LinkedList — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/LinkedList.html)

[^hashset]: [HashSet — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/HashSet.html)

[^treeset]: [TreeSet — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/TreeSet.html)

[^enumset]: [EnumSet — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/EnumSet.html)

[^hashmap]: [HashMap — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/HashMap.html)

[^treemap]: [TreeMap — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/TreeMap.html)

[^linkedhashmap]: [LinkedHashMap — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/LinkedHashMap.html)

[^enummap]: [EnumMap — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/EnumMap.html)

[^hashtable]: [Hashtable — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Hashtable.html)

[^concurrenthashmap]: [ConcurrentHashMap — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html)

[^object]: [Object — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Object.html)

[^deque]: [Deque — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Deque.html)

[^priorityqueue]: [PriorityQueue — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/PriorityQueue.html)

[^comparator]: [Comparator — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Comparator.html)

[^comparable]: [Comparable — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Comparable.html)

[^iterator]: [Iterator — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Iterator.html)

[^copyonwrite]: [CopyOnWriteArrayList — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/CopyOnWriteArrayList.html)

[^collections]: [Collections — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Collections.html)

[^sequenced]: [SequencedCollection — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/SequencedCollection.html)

[^set]: [Set — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Set.html)

[^weakhashmap]: [WeakHashMap — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/WeakHashMap.html)

[^identityhashmap]: [IdentityHashMap — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/IdentityHashMap.html)

[^concurrent]: [java.util.concurrent 패키지 — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/package-summary.html)

[^functional]: [java.util.function 패키지 — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/function/package-summary.html)

[^functionalinterface]: [FunctionalInterface — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/FunctionalInterface.html)

[^exceptions]: [자바 언어 명세 21 — 11장 예외](https://docs.oracle.com/javase/specs/jls/se21/html/jls-11.html)

[^streampackage]: [java.util.stream 패키지 — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/package-summary.html)

[^stream]: [Stream — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Stream.html)

[^collectors]: [Collectors — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Collectors.html)

[^intstream]: [IntStream — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/IntStream.html)

[^spliterator]: [Spliterator — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Spliterator.html)

[^optional]: [Optional — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Optional.html)

[^gatherer]: [Gatherer — 자바 24 표준 문서](https://docs.oracle.com/en/java/javase/24/docs/api/java.base/java/util/stream/Gatherer.html)

[^throwable]: [Throwable — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Throwable.html)

[^statements]: [자바 언어 명세 21 — 14장 블록과 문장](https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html)

[^autocloseable]: [AutoCloseable — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/AutoCloseable.html)

[^io]: [java.io 패키지 — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/package-summary.html)

[^inputstream]: [InputStream — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/InputStream.html)

[^reader]: [Reader — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/Reader.html)

[^dataoutput]: [DataOutput — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/DataOutput.html)

[^scanner]: [Scanner — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Scanner.html)

[^bufferedreader]: [BufferedReader — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/BufferedReader.html)

[^printwriter]: [PrintWriter — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/PrintWriter.html)

[^files]: [Files — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/nio/file/Files.html)

[^path]: [Path — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/nio/file/Path.html)

[^watchservice]: [WatchService — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/nio/file/WatchService.html)

[^buffer]: [Buffer — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/nio/Buffer.html)

[^channels]: [java.nio.channels 패키지 — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/nio/channels/package-summary.html)

[^serializable]: [Serializable — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/Serializable.html)

[^serialization]: [자바 21 객체 직렬화 명세 — 구조](https://docs.oracle.com/en/java/javase/21/docs/specs/serialization/serial-arch.html)

[^zip]: [java.util.zip 패키지 — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/zip/package-summary.html)

[^securecoding]: [오라클 자바 보안 코딩 지침](https://www.oracle.com/java/technologies/javase/seccodeguide.html)

[^network]: [java.net 패키지 — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/net/package-summary.html)

[^socket]: [Socket — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/net/Socket.html)

[^httpclient]: [HttpClient — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.net.http/java/net/http/HttpClient.html)

[^httprequest]: [HttpRequest — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.net.http/java/net/http/HttpRequest.html)

[^jdbc]: [java.sql 패키지 — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.sql/java/sql/package-summary.html)

[^prepared]: [PreparedStatement — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.sql/java/sql/PreparedStatement.html)

[^resultset]: [ResultSet — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.sql/java/sql/ResultSet.html)

[^connection]: [Connection — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.sql/java/sql/Connection.html)

[^transactions]: [공식 자바 학습 자료 — 데이터베이스 트랜잭션](https://docs.oracle.com/javase/tutorial/jdbc/basics/transactions.html)

[^acid]: [오라클 데이터베이스 21 개념 설명 — 트랜잭션의 네 가지 성질](https://docs.oracle.com/en/database/oracle/oracle-database/21/cncpt/transactions.html)

[^xml]: [자바 21 문서 처리 보안 지침](https://docs.oracle.com/en/java/javase/21/security/java-api-xml-processing-jaxp-security-guide.html)

[^xmlmodule]: [java.xml 모듈 — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/module-summary.html)

[^platform]: [자바 21 표준 모듈·패키지 전체 목록](https://docs.oracle.com/en/java/javase/21/docs/api/index.html)

[^crypto]: [자바 21 암호화 구조 참조](https://docs.oracle.com/en/java/javase/21/security/java-cryptography-architecture-jca-reference-guide.html)

[^tls]: [자바 21 보안 소켓 확장 참조](https://docs.oracle.com/en/java/javase/21/security/java-secure-socket-extension-jsse-reference-guide.html)

[^locale]: [Locale — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Locale.html)

[^resourcebundle]: [ResourceBundle — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/ResourceBundle.html)

[^system]: [System — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/System.html)

[^processbuilder]: [ProcessBuilder — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/ProcessBuilder.html)

[^logging]: [java.util.logging 패키지 — 자바 21 표준 문서](https://docs.oracle.com/en/java/javase/21/docs/api/java.logging/java/util/logging/package-summary.html)

