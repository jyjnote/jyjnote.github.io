---
title: "파이썬 실무 품질편 — 29~32부 통합본"
date: 2026-10-16 09:00:00 +0900
slug: python-practical-quality-part-29-32
permalink: /posts/python-practical-quality-part-29-32/
categories: [프로그래밍, Python]
tags: [파이썬, 표준라이브러리, 테스트, 디버깅, 성능, 보안, 유지보수]
math: true
---

파이썬의 실무 품질은 프로그램이 올바르게 동작하고, 실패 원인을 찾기 쉬우며, 안전하게 변경될 수 있는 정도입니다. 이번 편은 표준 라이브러리 선택부터 테스트·성능 측정·외부 언어 연동·유지보수 설계까지 연결합니다.

<blockquote class="prompt-info">
<p>동작을 테스트하고, 병목을 측정하고, 외부 입력과 부작용을 경계에서 관리합니다.</p>
</blockquote>

<details>
<summary>한 줄로</summary>

작게 나누어 검증하고, 측정한 근거로 개선하며, 실패해도 복구할 수 있게 만듭니다.

</details>

| 범위 | 중심 질문 |
| --- | --- |
| 29부. 표준 라이브러리 | 이미 제공되는 도구로 문제를 해결할 수 있는가? |
| 30부. 테스트·디버깅·코드 품질 | 잘못된 결과를 어떻게 발견하고 원인을 좁히는가? |
| 31부. 실행 내부·성능·외부 언어 연동 | 어디서 비용이 생기며 어떤 경계를 넘어야 하는가? |
| 32부. 안전한 사용과 유지보수 설계 | 신뢰하지 않는 입력과 변경의 영향을 어떻게 제한하는가? |

본문 예제는 Python 3.12 이상을 기준으로 합니다. 26~28부의 동시성은 성능 선택의 배경으로만 연결하고, 이번 편에서는 품질과 검증에 집중합니다.

## 핵심 예시: 직접 세기 전에 도구 찾기

```python
from collections import Counter
단어 = "I love AI I love Python".split()
빈도 = Counter(단어)
print(빈도.most_common(2))  # => [('I', 2), ('love', 2)]
print(빈도["없는단어"])  # => 0
```

표준 도구는 의도를 드러내고 직접 작성할 코드와 검증 부담을 줄입니다. 다만 도구의 기본값이 업무 규칙까지 대신 결정하지는 않습니다.

## 왜 필요한가와 작동 방식

정답만 출력하는 프로그램도 시간대, 입력 크기, 실패 처리 조건이 바뀌면 문제가 생깁니다. <mark>실무에서는 정상 결과뿐 아니라 경계 조건과 운영 중 실패도 설계 대상입니다.</mark>

작업 흐름은 **요구 조건 정의 → 도구 선택 → 작은 함수 작성 → 테스트 → 실제 작업 측정 → 개선 → 회귀 검증**입니다. 아래 네 부는 이 흐름에서 각 도구가 맡는 역할을 설명합니다.

## 29부. 표준 라이브러리

### 29-1. 내장 기능·표준 라이브러리·외부 패키지

`len` 같은 내장 기능은 가져오기 없이 사용합니다. 표준 라이브러리는 Python과 함께 제공되지만 일부 모듈은 운영체제나 배포판에 따라 없을 수 있습니다. 외부 패키지는 별도 설치와 버전 관리가 필요합니다. [공식 라이브러리 안내](https://docs.python.org/3.14/library/index.html)

| 문제 | 먼저 볼 도구 | 장점과 한계 |
| --- | --- | --- |
| 계수·그룹화·큐 | `Counter`, `defaultdict`, `deque` | 의도가 명확함; 자료구조의 동작을 알아야 함 |
| 반복·캐시·정렬 키 | `itertools`, `functools`, `operator` | 조합하기 쉬움; 지연 평가·저장 비용 주의 |
| 경로·파일·설정 | `pathlib`, `tempfile`, `csv`, `json`, `tomllib` | 의존성 감소; 입력 검증은 별도 |
| 명령행·로그·저장 | `argparse`, `logging`, `sqlite3` | 작은 도구에 충분; 복잡한 서비스 요구는 별도 평가 |

### 29-2. 자료구조: 큐·힙·정렬된 배열

`deque`는 양끝 추가·제거에 적합합니다. `heapq`의 최소 힙은 가장 작은 값을 먼저 꺼내지만 내부 배열 전체가 정렬된 것은 아닙니다. `bisect`는 정렬된 목록에서 삽입 위치를 찾습니다. [큐 문서](https://docs.python.org/3.14/library/collections.html#collections.deque), [힙 문서](https://docs.python.org/3.14/library/heapq.html), [이진 탐색 문서](https://docs.python.org/3.14/library/bisect.html)

```python
from collections import deque
from heapq import heapify, heappop
from bisect import bisect_left
대기열 = deque(["A", "B"])
print(대기열.popleft())  # => A
우선순위 = [3, 1, 2]
heapify(우선순위)
print(heappop(우선순위))  # => 1
print(bisect_left([10, 20, 20, 30], 20))  # => 1
```

목록 앞 삭제는 뒤 원소를 이동시킵니다. 이진 탐색의 위치 찾기는 빠르지만 목록 중간 삽입은 원소 이동 때문에 선형 비용이 듭니다. 자료구조를 바꾸면 미세한 문법 변경보다 큰 개선을 얻을 수 있습니다.

### 29-3. 반복·그룹화·캐시

`islice`는 필요한 구간만 소비합니다. `groupby`는 같은 키의 **연속 구간**을 묶으므로 전체 자료의 동일 키를 모으려면 정렬 등의 준비가 필요합니다. 지연 평가는 모든 중간 저장을 없애는 보장이 아닙니다. [반복 도구 문서](https://docs.python.org/3.14/library/itertools.html)

```python
from itertools import groupby, islice
from functools import lru_cache
print([(키, len(list(묶음))) for 키, 묶음 in groupby("AABA")])  # => [('A', 2), ('B', 1), ('A', 1)]
print(list(islice(range(100), 3)))  # => [0, 1, 2]
@lru_cache(maxsize=32)
def 제곱(수):
    return 수 * 수
print(제곱(4), 제곱(4))  # => 16 16
print(제곱.cache_info().hits)  # => 1
```

캐시는 반복 계산을 줄이는 대신 인자·결과를 보관합니다. 해시 가능한 인자가 필요하고, 외부 상태가 바뀌는 함수에는 무효화 정책이 필요합니다. 같은 변경 가능한 결과 객체가 재사용되는 점도 주의합니다. [캐시 문서](https://docs.python.org/3.14/library/functools.html#functools.lru_cache)

### 29-4. 수치와 시간: 표현 규칙부터 정하기

`Decimal`은 십진 연산을 제공합니다. 문자열로 생성하면 먼저 이진 부동소수점으로 바꾸는 일을 피합니다. 나눗셈 등의 결과는 문맥 정밀도와 반올림 정책에 영향을 받습니다. [수치 문서](https://docs.python.org/3.14/library/decimal.html)

```python
from decimal import Decimal, ROUND_HALF_UP
from datetime import datetime, timezone, timedelta
금액 = Decimal("0.1") + Decimal("0.2")
print(금액 == Decimal("0.3"))  # => True
print(Decimal("2.345").quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))  # => 2.35
시각 = datetime(2026, 10, 16, tzinfo=timezone.utc)
print(시각.astimezone(timezone(timedelta(hours=9))).isoformat())  # => 2026-10-16T09:00:00+09:00
```

| 요구 | 도구 | 놓치기 쉬운 점 |
| --- | --- | --- |
| 십진 반올림 정책 | `decimal` | float로 만든 값을 나중에 옮기면 원래 오차도 옮김 |
| 정확한 유리수 | `fractions` | 큰 분자·분모의 계산 비용 |
| 평균·중앙값 | `statistics` | 빈 자료·이상치의 처리 정책 |
| 실제 시각·지역 시간대 | `datetime`, `zoneinfo` | naive에는 시간대 정보가 없음; IANA 데이터 필요 |
| 경과 시간 | `time.perf_counter` | 기준점보다 두 측정값의 차이에 의미가 있음 |

`replace(tzinfo=...)`는 시간대 정보를 붙이거나 바꾸며 시각을 변환하지 않습니다. 시간대 간 변환에는 `astimezone`을 씁니다. 위 코드는 고정 +09:00이며 지역의 역사적 시간대 규칙은 표현하지 않습니다. [시간 문서](https://docs.python.org/3.14/library/datetime.html)

### 29-5. 문자열·설정·명령행·저장

정규식 `fullmatch`는 문자열 전체가 형식에 맞는지 검사합니다. `search`는 일부 일치를 찾습니다. `\d`는 기본적으로 ASCII 숫자보다 넓으므로 ASCII만 허용하려면 `[0-9]`처럼 의도를 표현합니다. [정규식 문서](https://docs.python.org/3.14/library/re.html)

```python
import argparse, re, tomllib
설정 = tomllib.loads("limit = 3")
파서 = argparse.ArgumentParser()
파서.add_argument("--limit", type=int, default=설정["limit"])
인자 = 파서.parse_args(["--limit", "5"])
print(인자.limit)  # => 5
print(re.fullmatch(r"[0-9]{3}", "123") is not None)  # => True
print(re.fullmatch(r"[0-9]{3}", "123x") is not None)  # => False
```

`tomllib`는 Python 3.11부터 제공되는 읽기 도구이며 TOML 쓰기는 지원하지 않습니다. CLI 값 → 환경변수 → 설정 파일 → 기본값 같은 우선순위는 애플리케이션이 정합니다. 변환 뒤 범위 검증도 필요합니다. [TOML 문서](https://docs.python.org/3.14/library/tomllib.html)

`csv`는 구분자·따옴표가 있는 자료를 직접 `split`하는 실수를 줄입니다. `json`은 교환 자료, `sqlite3`는 조회·트랜잭션이 필요한 로컬 저장에 적합합니다. SQLite 연결의 `with`는 트랜잭션 처리를 돕지만 연결 자체를 닫지는 않습니다. [SQLite 문서](https://docs.python.org/3.14/library/sqlite3.html)

## 30부. 테스트·디버깅·코드 품질

### 30-1. 테스트 수준과 검증 대상

테스트는 기대 동작을 실행 가능한 조건으로 기록합니다. 내부 구현을 그대로 복사하기보다 정상 결과·경계값·실패 계약을 검증합니다. 작은 단위 테스트와 실제 연결을 확인하는 통합 테스트는 서로 보완합니다.

| 수준 | 확인하는 것 | 장점과 한계 |
| --- | --- | --- |
| 단위 | 작은 함수·객체의 계약 | 빠르고 원인 추적 쉬움; 연결 문제는 놓칠 수 있음 |
| 통합 | 파일·DB·모듈 사이의 연결 | 실제 상호작용 확인; 환경 준비 비용 |
| 종단 간 | 사용자의 전체 흐름 | 중요한 경로 확인; 느리고 실패 원인이 넓음 |
| 속성 기반 | 여러 입력에서 유지할 성질 | 경계 탐색에 유용; 올바른 성질 정의가 필요 |

### 30-2. 정상·경계·실패를 같은 계약으로 검사

```python
import io, unittest
def 통과(점수):
    if type(점수) is not int or not 0 <= 점수 <= 100:
        raise ValueError("0~100 정수 필요")
    return 점수 >= 60
class 점수검사(unittest.TestCase):
    def test_boundary(self):
        for 입력, 기대 in [(0, False), (59, False), (60, True), (100, True)]:
            with self.subTest(입력=입력):
                self.assertEqual(통과(입력), 기대)
    def test_invalid(self):
        for 입력 in [-1, 101, True, "60"]:
            with self.subTest(입력=입력), self.assertRaises(ValueError):
                통과(입력)
결과 = unittest.TextTestRunner(stream=io.StringIO()).run(unittest.defaultTestLoader.loadTestsFromTestCase(점수검사))
print(결과.testsRun, 결과.wasSuccessful())  # => 2 True
```

`bool`은 `int`의 하위 클래스입니다. 여기서는 참·거짓 점수를 거부하는 계약이므로 정확한 타입을 확인했습니다. 모든 함수에서 하위 클래스를 거부해야 한다는 뜻은 아닙니다. `unittest`의 검증 메서드는 일반 `assert` 문과 다릅니다. [테스트 문서](https://docs.python.org/3.14/library/unittest.html)

### 30-3. 테스트 대역과 의존성 주입

대역은 느리거나 통제하기 어려운 의존성을 대신합니다. 시계·네트워크·난수·저장소를 인자로 받으면 테스트에서 바꾸기 쉽습니다. 대역만 통과해도 실제 연동이 보장되지는 않습니다.

```python
from unittest.mock import create_autospec
def 읽기(키):
    raise RuntimeError("실제 저장소 연결 필요")
def 표시(로더):
    return 로더("name").upper()
대역 = create_autospec(읽기, return_value="kim")
print(표시(대역))  # => KIM
대역.assert_called_once_with("name")
```

`autospec`은 원본의 호출 서명에 맞추도록 돕지만 업무 의미까지 검증하지 않습니다. `patch`는 정의된 곳이 아니라 **테스트 대상이 이름을 조회하는 곳**을 바꿉니다. `from a import 읽기`로 가져온 `b`라면 보통 `b.읽기`를 바꿉니다. [대역 문서](https://docs.python.org/3.14/library/unittest.mock.html#where-to-patch)

### 30-4. 디버깅과 로그

디버깅은 원인을 좁히는 과정입니다. 재현 입력을 줄이고, 예외 종류와 traceback의 마지막 메시지를 확인한 뒤 호출 경로를 따라갑니다. `breakpoint()`는 기본적으로 디버거를 호출하지만 환경 설정으로 동작이 바뀔 수 있습니다. `pdb`의 `n`은 다음 줄, `s`는 호출 안으로 진입, `p`는 값 확인, `c`는 계속 실행입니다. [디버거 문서](https://docs.python.org/3.14/library/pdb.html)

```python
import io, logging
출력 = io.StringIO()
logging.basicConfig(stream=출력, level=logging.INFO, format="%(levelname)s:%(message)s")
logging.getLogger(__name__).info("처리 건수=%d", 3)
print(출력.getvalue().strip())  # => INFO:처리 건수=3
```

앱 시작점에서 로그를 설정하고 라이브러리는 `getLogger(__name__)`으로 사용합니다. 로거는 이벤트, 처리기는 목적지, 포매터는 출력 모양을 담당합니다. 예외 처리 중 `logger.exception`은 traceback도 기록합니다. `%s` 인자 방식은 문자열 조합을 늦추지만 인자의 함수 호출까지 지연시키지는 않습니다. [로그 문서](https://docs.python.org/3.14/library/logging.html)

### 30-5. 정적 검사·스타일·지속적 통합

| 도구·활동 | 주로 찾는 문제 | 보장하지 않는 것 |
| --- | --- | --- |
| 구문 컴파일 | 문법 오류 | 실행 경로의 성공 |
| 린터 | 의심스러운 코드·규칙 위반 | 업무 결과의 정확성 |
| 포매터 | 일관되지 않은 코드 모양 | 설계의 적절성 |
| 타입 검사기 | 주석과 사용 방식의 불일치 | 외부 입력의 런타임 검증 |
| 커버리지 | 실행되지 않은 코드 위치 | 검증의 질·결함 부재 |

지속적 통합(CI)은 변경마다 검사를 자동 실행합니다. 지원 Python·운영체제, 최소 의존성·잠금 의존성 같은 조합을 요구에 맞게 선택합니다. 시간·난수·실행 순서에 흔들리는 테스트는 입력과 의존성을 통제하고, 버그 수정에는 재현 회귀 테스트를 남깁니다.

## 31부. 실행 내부·성능·외부 언어 연동

### 31-1. 소스·구문 트리·코드 객체·실행

CPython은 소스를 구문 분석하고 컴파일해 코드 객체를 만들고 실행합니다. AST는 문법 구조, 바이트코드는 실행 명령을 살펴보는 관점입니다. Python 언어 규칙과 CPython의 내부 구현은 구분해야 합니다.

```python
import ast, dis
원본 = "결과 = 2 + 3"
트리 = ast.parse(원본)
코드 = compile(트리, "<example>", "exec")
공간 = {}
print("결과" in 공간)  # => False
exec(코드, 공간)
print(공간["결과"])  # => 5
print(len(list(dis.get_instructions(코드))) > 0)  # => True
```

컴파일만으로 대입문이 실행되지는 않습니다. `exec`는 여기서 직접 작성한 고정 코드에만 사용합니다. 바이트코드의 명령 이름·배치는 버전별로 바뀔 수 있으므로 고정 출력으로 외우지 않습니다. [AST 문서](https://docs.python.org/3.14/library/ast.html), [바이트코드 문서](https://docs.python.org/3.14/library/dis.html)

### 31-2. 프레임·캐시·구현 차이

프레임은 실행 중인 코드의 문맥과 연결됩니다. traceback이 프레임을 붙잡으면 지역 객체의 수명도 길어질 수 있습니다. `inspect`로 서명과 실행 객체를 조사할 수 있지만 프레임을 장기간 보관하는 도구는 정리 정책이 필요합니다. [실행 모델](https://docs.python.org/3.14/reference/executionmodel.html), [inspect 문서](https://docs.python.org/3.14/library/inspect.html)

| 개념 | 역할 | 시험 함정 |
| --- | --- | --- |
| 코드 객체 | 실행할 명령과 관련 메타데이터 | 함수 호출의 결과 자체가 아님 |
| 프레임 | 실행 문맥 | 코드 객체와 같은 개념이 아님 |
| `.pyc` | 가져오기 등에 쓰는 컴파일 캐시 | 기계어 실행 파일·소스 보호 수단이 아님 |
| JIT·특수화 | 구현·빌드에 따른 실행 최적화 | 모든 Python에서 같은 성능을 보장하지 않음 |

`.pyc`가 있어도 모듈의 최상위 코드는 실행될 수 있습니다. 캐시는 주로 컴파일 비용을 줄이며, 다른 버전과 무조건 호환되지 않습니다. 최적화 실행 `-O`는 `assert` 문을 제거하므로 필수 입력 검증을 `assert`에 맡기지 않습니다. [컴파일 문서](https://docs.python.org/3.14/library/py_compile.html), [실행 옵션](https://docs.python.org/3.14/using/cmdline.html#cmdoption-O)

### 31-3. 프로파일링과 벤치마크

프로파일러는 비용이 큰 위치를 찾고, 벤치마크는 특정 작업의 소요 시간을 비교합니다. `cProfile`의 `tottime`은 하위 호출을 제외한 시간, `cumtime`은 하위 호출을 포함한 시간입니다. 둘 다 측정 자체의 영향을 고려합니다. [프로파일러 문서](https://docs.python.org/3.14/library/profile.html)

```python
import timeit
값들 = list(range(100))
초 = min(timeit.repeat(lambda: sum(값들), number=1000, repeat=3))
print(초 > 0)  # => True
print(sum(값들) == 4950)  # => True
```

위 시간은 **1,000회 묶음의 시간**이며 1회 시간은 1,000으로 나눕니다. `timeit`은 기본적으로 측정 중 순환 GC를 비활성화합니다. 최소값은 외부 간섭이 작은 실행의 단서이지 운영 지연의 분포가 아닙니다. [측정 문서](https://docs.python.org/3.14/library/timeit.html)

### 31-4. 개선 순서와 메모리 비용

<mark>성능 개선은 알고리즘·자료구조 → 불필요한 작업 제거 → 입출력 묶기 → 필요한 부분의 구현 변경 순으로 검토합니다.</mark> 선형 탐색을 집합 조회로 바꿀 때는 집합 구성 비용과 추가 메모리도 포함해서 측정합니다.

| 선택 | 기대 효과 | 비용·조건 |
| --- | --- | --- |
| 생성기·스트리밍 | 전체 목록 보관 감소 | 재순회 불가·자원 수명·중간 버퍼 확인 |
| 캐시·일괄 처리 | 중복 계산·호출 횟수 감소 | 저장 공간·최신성·배치 지연 |
| 비동기·스레드 | 대기 중 다른 작업 진행 | 동기화·취소·실행 환경 고려 |
| 프로세스·네이티브 코드 | 계산 병렬화·루프 비용 감소 | 직렬화·전송·시작·연동 비용 |

`tracemalloc`은 추적 대상 메모리 할당을 분석합니다. 운영체제가 보는 프로세스 전체 메모리나 모든 네이티브 라이브러리 할당과 같지 않습니다. `sys.getsizeof`도 대체로 해당 객체의 직접 크기이며 참조 대상 전체를 합산하지 않습니다. [메모리 추적 문서](https://docs.python.org/3.14/library/tracemalloc.html)

### 31-5. 외부 언어와 만나는 세 가지 경계

| 방식 | 연결 방법 | 장점과 책임 |
| --- | --- | --- |
| C/C++ 확장 | Python 확장 모듈 작성 | 긴밀한 통합; 빌드·참조 관리·오류 전파·ABI 확인 |
| `ctypes` | 공유 라이브러리의 C ABI 함수 호출 | 별도 Python 확장 없이 연결; 타입·포인터·수명 관리 |
| `subprocess` | 외부 프로그램을 별도 프로세스로 실행 | 프로세스 경계; 전달 형식·종료 코드·시간 제한 관리 |

```python
import ctypes
배열형 = ctypes.c_int * 3
배열 = 배열형(10, 20, 30)
print(list(배열))  # => [10, 20, 30]
print(ctypes.sizeof(배열) == 3 * ctypes.sizeof(ctypes.c_int))  # => True
```

위 예제는 C 호환 메모리 표현만 확인하며 외부 함수를 호출하지 않습니다. 실제 호출에서는 헤더에 맞는 `argtypes`·`restype`, 호출 규약, 포인터 길이·소유자·해제 함수를 확인합니다. 잘못된 포인터는 프로세스를 비정상 종료시킬 수 있습니다. [ctypes 문서](https://docs.python.org/3.14/library/ctypes.html)

네이티브 코드라고 항상 빨라지지는 않습니다. 경계를 자주 넘으며 변환하는 비용을 줄여야 합니다. GIL 해제 여부도 연동 방식과 구현에 달려 있고, C/C++ 확장에서는 Python 객체 접근·참조 소유권·스레드 안전성을 함께 설계합니다. [확장 모듈 문서](https://docs.python.org/3.14/extending/extending.html)

## 32부. 안전한 사용과 유지보수 설계

### 32-1. 외부 입력과 신뢰 경계

신뢰 경계는 외부에서 들어온 값을 내부 규칙에 맞는 값으로 바꾸는 지점입니다. 파싱 성공 뒤에도 타입·범위·길이·중첩 깊이·개수 등을 확인합니다. 타입 힌트는 이 검증을 대신하지 않습니다.

<blockquote class="prompt-danger">
<p>신뢰하지 않는 데이터에 eval·exec를 실행하거나 pickle 역직렬화를 적용하지 않습니다.</p>
</blockquote>

JSON은 일반적인 값 파싱 과정에서 Python 코드를 실행하지 않지만 거대한 입력의 자원 소모와 잘못된 업무 값은 별개입니다. `ast.literal_eval`도 임의 코드 실행용은 아니지만 자원 고갈에 대한 안전장치는 아닙니다. [pickle 문서](https://docs.python.org/3.14/library/pickle.html), [literal_eval 문서](https://docs.python.org/3.14/library/ast.html#ast.literal_eval)

### 32-2. 명령·SQL은 데이터와 분리

```python
import subprocess, sys, sqlite3
from contextlib import closing
결과 = subprocess.run([sys.executable, "-c", "print(2 + 3)"], shell=False,
    check=True, capture_output=True, text=True, timeout=5)
print(결과.stdout.strip())  # => 5
with closing(sqlite3.connect(":memory:")) as 연결:
    연결.execute("CREATE TABLE people (name TEXT)")
    with 연결:
        연결.execute("INSERT INTO people VALUES (?)", ("O'Reilly",))
    print(연결.execute("SELECT name FROM people WHERE name = ?", ("O'Reilly",)).fetchone()[0])  # => O'Reilly
```

인자 목록과 `shell=False`는 셸 문자열 조합을 피합니다. 실행 파일과 허용 옵션도 통제해야 하며, Windows의 배치 파일은 셸이 개입할 수 있어 별도 검토가 필요합니다. `check=True`는 비정상 종료를 예외로 알리며 `timeout`은 작업 대기를 제한합니다. [프로세스 문서](https://docs.python.org/3.14/library/subprocess.html#security-considerations)

SQL 매개변수는 **값**을 바인딩합니다. 테이블·열 이름이나 정렬 방향은 바인딩 대상이 아니므로 허용 목록으로 선택합니다. 문자열을 직접 붙여 쿼리를 만들지 않습니다. [SQL 바인딩 문서](https://docs.python.org/3.14/library/sqlite3.html#sqlite3-placeholders)

### 32-3. 경로·압축 파일·자원 제한

경로는 문자열 접두사로 비교하지 않습니다. `resolve`로 절대 경로와 심볼릭 링크를 해석한 뒤 기준 디렉터리 내부인지 확인할 수 있습니다. 그러나 검사 뒤 사용 전 파일이 바뀌는 경쟁(TOCTOU)까지 제거하지는 못합니다. [경로 문서](https://docs.python.org/3.14/library/pathlib.html)

| 대상 | 적용할 정책 | 남는 검토 사항 |
| --- | --- | --- |
| 파일 접근 | 기준 경로 제한·권한 최소화 | 링크·동시 변경·운영체제별 경로 규칙 |
| 압축 해제 | 멤버 경로·종류·개수·해제 총량 제한 | 필터만으로 디스크 고갈을 막지는 못함 |
| 네트워크·외부 작업 | 연결·읽기 제한, 재시도 횟수·전체 예산 | 재시도가 중복 작업을 만들 수 있음 |
| 큰 입력·정규식 | 입력 길이·복잡도 제한 | 타임아웃·격리가 추가로 필요할 수 있음 |

`tarfile`의 기본 추출 필터는 Python 3.14부터 `data`로 바뀌었습니다. 지원되는 버전에서는 정책을 명시하고, 필터가 모든 악성 자료나 자원 고갈을 막는다고 가정하지 않습니다. 지원 버전과 패치 수준도 확인합니다. [압축 해제 문서](https://docs.python.org/3.14/library/tarfile.html#extraction-filters)

### 32-4. 난수·해시·비밀정보

```python
import secrets, hashlib
토큰 = secrets.token_hex(16)
print(len(토큰))  # => 32
print(secrets.compare_digest(토큰, 토큰))  # => True
print(hashlib.sha256(b"AI").hexdigest() == hashlib.sha256(b"AI").hexdigest())  # => True
```

| 구분 | 목적 | 혼동하면 안 되는 것 |
| --- | --- | --- |
| `random` | 모의실험·일반 난수 | 보안 토큰 생성용이 아님 |
| `secrets` | 예측하기 어려운 토큰 | 인증·권한 정책 자체는 아님 |
| 일반 해시 | 고정 길이 요약·변경 확인 | 암호화가 아님; 공격자가 해시도 바꾸면 진위 확인 불가 |
| 비밀번호 저장 | salt를 사용하는 비밀번호 전용 KDF | 빠른 SHA-256 한 번 적용으로 대체하지 않음 |

실제 토큰은 예측할 수 없어 출력값을 고정하지 않았습니다. `compare_digest`는 비밀 값 비교에 적합한 도구입니다. 비밀번호 KDF의 비용 매개변수는 운영 환경에서 별도 검토합니다. [secrets 문서](https://docs.python.org/3.14/library/secrets.html), [hashlib 문서](https://docs.python.org/3.14/library/hashlib.html)

비밀정보는 저장소에 넣지 않고 환경에 맞는 비밀 저장소와 최소 권한으로 관리합니다. 환경변수도 자동 암호화 저장소는 아닙니다. 로그에 비밀번호·토큰·불필요한 개인정보를 남기지 않습니다.

### 32-5. 변경·실패·호환성을 설계에 포함

순수한 계산과 파일·DB·네트워크 부작용을 분리하면 테스트와 변경이 쉬워집니다. 추상화는 실제로 바뀌는 경계에 두며, 모든 함수에 인터페이스를 추가할 필요는 없습니다.

| 설계 선택 | 기대 효과 | 비용·주의 |
| --- | --- | --- |
| 작은 함수·의존성 주입 | 책임·테스트 범위 명확 | 지나친 분할·인자 증가 경계 |
| 불변 값·명시적 설정 | 숨은 공유 상태 감소 | 복사 비용·설정 검증 필요 |
| 제한된 재시도·멱등성 | 일시 실패 복구·중복 효과 제한 | 모든 오류 재시도 금지; 멱등 키 등의 구현 필요 |
| 트랜잭션·임시 파일 후 교체 | 부분 결과 노출 감소 | 파일 교체와 전원 장애 내구성은 다른 문제 |
| 호환성 정책·폐기 예고 | 사용자 변경 부담 감소 | API·자료 형식·설정 버전 함께 관리 |

의존성은 출처·버전·변경 이력을 관리하고 보안 수정과 회귀 검증을 이어갑니다. 잠금 파일은 재현성을 높이지만 패키지의 안전성을 보장하지 않습니다. 운영 로그·지표·백업·복원 절차도 변경 후 확인합니다.

## 잘 놓치는 핵심

### 1. 도구의 성공과 업무 검증의 성공은 다르다

JSON 파싱, TOML 읽기, 타입 검사, SQL 실행이 성공해도 값이 업무 규칙에 맞는지는 별도 문제입니다. 경계에서는 형식과 의미를 함께 검사합니다.

### 2. 숫자 하나로 품질을 판정하지 않는다

커버리지 100%는 모든 조건을 올바르게 검증했다는 뜻이 아닙니다. 벤치마크 최소 시간과 추적 메모리도 실제 서비스의 지연·전체 메모리를 그대로 대표하지 않습니다.

### 3. 경계를 넘는 비용과 책임이 있다

프로세스·C 함수·DB로 넘길 때 변환·복사·오류 전파·자원 정리가 필요합니다. 내부 코드가 짧아져도 전체 시스템의 책임이 사라지지는 않습니다.

## 시험·면접

| 질문 | 바로 기억할 답 | 함정 |
| --- | --- | --- |
| 표준 라이브러리의 장점은? | 설치 부담과 직접 구현량을 줄인다 | 모든 배포 환경에 모든 모듈이 있다는 뜻은 아님 |
| 단위 테스트와 통합 테스트 차이는? | 작은 계약과 실제 연결을 각각 확인한다 | 대역 통과만으로 실제 연결 보장 불가 |
| patch는 어디에 적용하는가? | 대상 코드가 이름을 조회하는 곳 | 원래 정의 모듈만 바꾸면 안 될 수 있음 |
| `.pyc`가 있으면 실행은 생략되는가? | 컴파일 캐시이며 모듈 코드는 실행될 수 있다 | 기계어 실행 파일로 혼동 |
| 프로파일링과 벤치마크 차이는? | 비용 위치 탐색과 정한 작업의 시간 비교 | 수치만으로 알고리즘의 우수성 일반화 |
| 외부 입력에 assert를 쓰면? | 최적화 실행에서 제거될 수 있다 | 예외를 명시적으로 발생시켜야 함 |
| 멱등성은 무엇인가? | 같은 요청을 반복해도 의도한 효과가 중복되지 않는 성질 | 재시도 기능만 추가하면 생기는 것이 아님 |

면접에서는 “느리니 C로 바꾼다”보다 **정확성 기준 → 재현 입력 → 병목 측정 → 개선 선택 → 비용 비교 → 회귀 검증** 순서로 설명합니다.

## 예시로 한 바퀴: 안전하게 검증하고 요약 저장하기

외부 JSON을 제한된 크기로 읽고, 순수 함수에서 점수를 검증·집계한 뒤 요약만 저장합니다. 표준 도구 선택, 실패 계약, 결정적인 정렬, 부작용 분리를 한 번에 연결합니다.

```python
import json
from collections import Counter
from pathlib import Path
from tempfile import TemporaryDirectory
MAX_BYTES = 4096
MAX_ITEMS = 100
def 요약(자료):
    if type(자료) is not list or len(자료) > MAX_ITEMS:
        raise ValueError("100개 이하 목록 필요")
    for 점수 in 자료:
        if type(점수) is not int or not 0 <= 점수 <= 100:
            raise ValueError("0~100 정수 점수 필요")
    빈도 = Counter("통과" if 점수 >= 60 else "미통과" for 점수 in 자료)
    return {"건수": len(자료), "결과": dict(sorted(빈도.items()))}
def 읽기(경로):
    with 경로.open("rb") as 파일:
        원본 = 파일.read(MAX_BYTES + 1)
    if len(원본) > MAX_BYTES:
        raise ValueError("입력 크기 초과")
    return json.loads(원본.decode("utf-8"))
def 저장(경로, 결과):
    임시 = 경로.with_suffix(경로.suffix + ".tmp")
    try:
        임시.write_text(json.dumps(결과, ensure_ascii=False, sort_keys=True), encoding="utf-8")
        임시.replace(경로)
    finally:
        임시.unlink(missing_ok=True)
with TemporaryDirectory() as 폴더:
    입력 = Path(폴더) / "scores.json"
    출력 = Path(폴더) / "summary.json"
    입력.write_text("[59, 60, 100]", encoding="utf-8")
    결과 = 요약(읽기(입력))
    저장(출력, 결과)
    print(출력.read_text(encoding="utf-8"))  # => {"건수": 3, "결과": {"미통과": 1, "통과": 2}}
```

| 단계 | 검증·설계 의도 |
| --- | --- |
| 제한 읽기 | 크기를 확인하려고 파일 전체를 먼저 메모리에 올리지 않음 |
| 파싱 후 검증 | 목록·개수·정수·범위를 검사하고 bool은 거부 |
| 순수 집계 | 파일 없이 정상·경계·실패를 테스트할 수 있음 |
| 저장 경계 | 임시 결과 작성 후 교체; 저장 오류는 호출자에게 전파 |

학습용으로 단일 작성자와 신뢰하는 로컬 디렉터리를 가정했습니다. 동시 작성에는 고유 임시 파일과 충돌 정책이 필요합니다. 파일 교체의 원자성·내구성은 파일시스템과 동기화 정책에 달려 있습니다. 크기 제한도 JSON의 모든 중첩·복잡도 문제를 해결하지는 않습니다.

## 객관식 문제

### 문제 1. `groupby("AABA")`의 그룹 키 순서는?

- ① A, B
- ② A, A, B, A
- ③ A, B, A
- ④ B, A

<details>
<summary>정답과 모든 선지 해설</summary>

정답: **③**. ①은 전체 동일 키를 합쳤다고 오해했습니다. ②는 각 원소를 별도 그룹으로 본 결과입니다. ③은 연속 구간 AA·B·A를 묶어 맞습니다. ④는 자동 정렬을 가정했지만 `groupby`는 정렬하지 않습니다.

</details>

### 문제 2. `b.py`가 `from a import 읽기`를 사용한다. b의 함수를 테스트할 때 일반적으로 바꿀 대상은?

- ① 언제나 `a.읽기`
- ② `b.읽기`
- ③ 내장 함수 `open` 전체
- ④ 어디를 바꿔도 결과는 같다

<details>
<summary>정답과 모든 선지 해설</summary>

정답: **②**. ①은 b에 이미 바인딩된 이름을 바꾸지 못할 수 있습니다. ②는 대상 코드가 조회하는 이름이라 맞습니다. ③은 불필요하게 넓고 해당 의존성을 바꾼다는 보장도 없습니다. ④는 이름 바인딩과 조회 위치를 무시했습니다.

</details>

### 문제 3. 성능 측정에 관한 올바른 설명은?

- ① `timeit(number=1000)`의 결과는 곧 1회 실행 시간이다
- ② 커버리지가 높으면 실행 시간이 짧다
- ③ `tracemalloc` 수치는 항상 프로세스 전체 메모리와 같다
- ④ `cProfile`은 호출별 비용을 살펴 병목 후보를 찾는 데 사용한다

<details>
<summary>정답과 모든 선지 해설</summary>

정답: **④**. ①은 반복 묶음 시간과 1회 시간을 혼동했습니다. ②는 실행 경로와 성능 사이에 없는 보장을 만들었습니다. ③은 추적 대상 할당과 전체 메모리를 혼동했습니다. ④는 프로파일링의 목적에 맞습니다.

</details>

### 문제 4. 컴파일과 실행에 관한 올바른 설명은?

- ① `compile`로 대입문의 코드 객체를 만들면 변수 대입까지 완료된다
- ② `.pyc`는 기계어이므로 Python 런타임 없이 항상 실행된다
- ③ CPython의 바이트코드 명령은 Python 버전이 바뀌어도 고정된다
- ④ 코드 객체 생성과 그 코드를 실행하는 단계는 구분된다

<details>
<summary>정답과 모든 선지 해설</summary>

정답: **④**. ①은 컴파일과 실행을 혼동했습니다. ②는 컴파일 캐시를 독립 실행 파일로 오해했습니다. ③은 버전 의존적인 구현 세부를 언어 규칙으로 일반화했습니다. ④는 실행 내부 예제의 결과와 일치합니다.

</details>

### 문제 5. SQL과 외부 명령 처리에 관한 올바른 설명은?

- ① SQL 매개변수로 테이블 이름과 모든 문법을 바인딩할 수 있다
- ② `shell=False`이면 어떤 외부 프로그램과 옵션도 안전하다
- ③ SQL 값은 매개변수로 전달하고, 외부 명령은 허용한 실행 파일과 인자 목록으로 구성한다
- ④ 외부 프로세스의 종료 코드는 확인하지 않아도 된다

<details>
<summary>정답과 모든 선지 해설</summary>

정답: **③**. ①은 값 바인딩과 SQL 문법 선택을 혼동했습니다. ②는 실행 파일·옵션 자체의 동작과 Windows 배치 처리 등을 무시했습니다. ③은 명령 구조와 데이터를 분리하는 접근이라 맞습니다. ④는 실패를 성공으로 처리할 수 있어 틀립니다.

</details>

### 문제 6. 안전한 입력 검증과 유지보수에 관한 올바른 설명은?

- ① 타입 힌트가 있으면 JSON 입력의 값 범위도 자동 검증된다
- ② 필수 입력 검증은 명시적인 조건·예외로 구현하고 실패 사례를 회귀 테스트에 포함한다
- ③ 잠금 파일은 모든 의존성이 안전하다는 증명이다
- ④ `random` 토큰과 SHA-256 한 번 적용이면 모든 인증 요구를 충족한다

<details>
<summary>정답과 모든 선지 해설</summary>

정답: **②**. ①은 정적 주석에 런타임 검증 기능을 기대했습니다. ②는 최적화 실행의 영향과 변경 후 재발을 고려해 맞습니다. ③은 재현성과 안전성을 혼동했습니다. ④는 보안 난수·비밀번호 저장·인증 정책의 서로 다른 역할을 무시했습니다.

</details>

## 실행 검증과 참고 기준

**Windows 11의 CPython 3.12.14에서 파이썬 코드블록 14개를 각각 독립 실행했고, 예상 출력 31줄이 모두 일치했습니다.** 테스트 예제의 2개 테스트 메서드와 8개 하위 사례도 통과했습니다.

종합 예제는 빈 목록·경계값·개수 제한·잘못된 타입·바이트 제한·잘못된 JSON과 UTF-8·저장과 교체·저장 실패 시 기존 결과 보존 등 **추가 검증 24건**을 통과했습니다. 프런트매터 필드, 제목·표·리스트·코드·HTML 블록 경계, 접기 태그와 6문제의 선지도 점검했습니다.

성능 예제는 측정 동작을 확인했으며 구현 간 성능 우열은 판정하지 않았습니다. 외부 C/C++ 라이브러리 호출·확장 모듈 빌드·대화형 디버거·외부 정적 검사 도구·다른 Python 버전과 운영체제에서의 실행은 검증 범위에 포함하지 않았습니다.

설명은 2026-10-16에 확인한 Python 공식 문서를 기준으로 작성했습니다. 문서의 버전과 실제 실행 환경은 다를 수 있으므로 새 기능·기본값 변경에는 버전을 명시했습니다. 외부 패키지 설치가 필요한 예제는 없습니다.

## 다음에 이을 글

**종합 실습편: 점수 처리 도구를 명령행 프로그램으로 완성하기**입니다. 이번 편의 검증·집계 함수를 시작점으로 CSV 입력, 설정, 로그, 테스트, 패키징을 연결합니다. 이어서 동일 입력으로 성능을 비교하고 실패·복구 시나리오를 점검합니다.
