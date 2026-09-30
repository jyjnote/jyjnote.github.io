#!/usr/bin/env python3
"""읽기 전용 통계 조회. 인증 정보는 출력하거나 공개 파일에 저장하지 않습니다."""
import datetime as dt
import json
import os
from pathlib import Path
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from zoneinfo import ZoneInfo

SEOUL = ZoneInfo('Asia/Seoul')


def request_json(code, token, endpoint, params=None):
    suffix = '?' + urllib.parse.urlencode(params) if params else ''
    url = f'https://{code}.goatcounter.com/api/v0/{endpoint}{suffix}'
    for attempt in range(3):
        request = urllib.request.Request(url, headers={
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
            'User-Agent': 'BlogInsights/1.0',
        })
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                data = json.load(response)
            if not isinstance(data, dict) or 'error' in data or 'errors' in data:
                raise ValueError('통계 서비스의 응답을 확인해 주세요.')
            return data
        except urllib.error.HTTPError as error:
            if error.code in (429, 500, 502, 503, 504) and attempt < 2:
                time.sleep(2 ** (attempt + 1))
                continue
            raise ValueError(f'통계 조회 실패: 응답 번호 {error.code}. 접근 권한을 확인해 주세요.') from None
        except (urllib.error.URLError, TimeoutError):
            if attempt < 2:
                time.sleep(2 ** (attempt + 1))
                continue
            raise ValueError('통계 서비스에 연결하지 못했습니다. 기존 기록은 보존됩니다.') from None


def normalize(payload, start, end):
    stats = payload.get('stats')
    if not isinstance(stats, list):
        raise ValueError('날짜별 통계가 없습니다. 기존 기록은 보존됩니다.')
    counts = {}
    for row in stats:
        if not isinstance(row, dict):
            raise ValueError('날짜별 통계 형식이 올바르지 않습니다.')
        try:
            date = dt.date.fromisoformat(row['day'])
        except (KeyError, TypeError, ValueError):
            raise ValueError('집계 날짜 형식이 올바르지 않습니다.') from None
        count = row.get('daily')
        if type(count) is not int or count < 0 or date in counts:
            raise ValueError('방문 수가 올바르지 않거나 날짜가 중복되어 있습니다.')
        counts[date] = count
    days = []
    date = start
    while date <= end:
        # 공식 응답에는 방문이 없는 날도 포함됩니다. 누락을 0으로 바꾸지 않습니다.
        if date not in counts:
            raise ValueError('집계 날짜가 누락되었습니다. 시간대 설정을 확인해 주세요.')
        days.append({'date': date.isoformat(), 'visits': counts[date]})
        date += dt.timedelta(days=1)
    return days


def main():
    code = os.environ.get('GOATCOUNTER_CODE', '').strip()
    token = os.environ.get('GOATCOUNTER_TOKEN', '').strip()
    start_text = os.environ.get('GOATCOUNTER_START_DATE', '').strip()
    if not code or not token or not start_text:
        raise ValueError('통계 사이트 식별자, 조회용 인증 정보, 집계 시작일을 설정해 주세요.')
    if not re.fullmatch(r'[a-z0-9][a-z0-9-]{0,62}', code):
        raise ValueError('통계 사이트 식별자가 올바르지 않습니다. 전체 주소 대신 식별자만 입력하세요.')
    try:
        registered = dt.date.fromisoformat(start_text)
    except ValueError:
        raise ValueError('집계 시작일은 연도-월-일 형식으로 입력해 주세요.') from None
    now = dt.datetime.now(SEOUL)
    end = now.date() - dt.timedelta(days=1)
    if registered > end:
        print('아직 집계가 끝난 날짜가 없습니다. 내일부터 자동으로 기록됩니다.')
        return
    start = max(registered, end - dt.timedelta(days=59))
    start_at = dt.datetime.combine(start, dt.time(), SEOUL)
    end_at = dt.datetime.combine(end, dt.time(23), SEOUL)
    payload = request_json(code, token, 'stats/total', {
        'start': start_at.isoformat(), 'end': end_at.isoformat(),
    })
    days = normalize(payload, start, end)
    result = {
        'schema_version': 1, 'status': 'ready', 'timezone': 'Asia/Seoul',
        'metric': 'daily_visits', 'updated_at': now.isoformat(timespec='seconds'),
        'start_date': registered.isoformat(), 'end_date': end.isoformat(),
        'days': days,
    }
    output = Path(__file__).resolve().parents[1] / 'assets/data/visits.json'
    temporary = output.with_suffix('.json.tmp')
    temporary.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    temporary.replace(output)
    print(f'{len(days)}일의 방문 기록을 갱신했습니다. 마지막 집계일: {end}')


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, json.JSONDecodeError) as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
