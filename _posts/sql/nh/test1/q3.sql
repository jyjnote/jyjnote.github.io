-- 1. 문제 설명
-- NH농협은행은 장기간 금융 거래가 발생하지 않은 고객을 대상으로 금융 서비스 재이용 안내를 진행하려고 한다.
-- 조회 기준 시각은 2026년 10월 1일 00:00:00이다.
-- 다음 조건을 모두 만족하는 고객을 조회하는 SQL을 작성하시오.
-- 1. 고객 상태가 ACTIVE여야 한다.
-- 2. 현재 ACTIVE 상태인 계좌를 하나 이상 보유해야 한다.
-- 3. 현재 활성 계좌에서 2026년 9월 1일 이상, 10월 1일 미만에 SUCCESS 거래가 한 건도 없어야 한다.
-- 4. 현재 활성 계좌에서 2026년 9월 1일 이전에 성공한 거래가 한 건 이상 있어야 한다.
-- 5. 거래 유형은 구분하지 않으며 SALARY_IN, EXTERNAL_OUT, INTERNAL_OUT 모두 인정한다.
-- 6. 고객의 여러 활성 계좌를 합쳐서 가장 최근에 발생한 성공 거래를 조회한다.
-- 7. 가장 최근 거래가 같은 시각에 여러 건 발생했다면 transaction_id가 가장 큰 거래를 선택한다.


SELECT                                                       -- 최종 결과 컬럼 지정
    c.customer_id,                                            -- 고객 ID 출력
    c.customer_name,                                          -- 고객 이름 출력
    a.account_id,                                             -- 마지막 거래가 발생한 계좌 ID 출력
    t.transaction_id AS last_transaction_id,                  -- 마지막 거래 ID 출력
    t.transacted_at AS last_transaction_date,                 -- 마지막 거래 일시 출력
    t.transaction_type AS last_transaction_type,              -- 마지막 거래 유형 출력
    t.amount AS last_amount                                   -- 마지막 거래 금액 출력
FROM customers AS c                                           -- 고객 테이블 조회
INNER JOIN accounts AS a                                      -- 고객과 계좌 연결
    ON c.customer_id = a.customer_id                          -- 동일한 고객 ID 기준 JOIN
INNER JOIN transactions AS t                                  -- 계좌와 거래 내역 연결
    ON a.account_id = t.account_id                            -- 동일한 계좌 ID 기준 JOIN
WHERE c.customer_status = 'ACTIVE'                             -- 활성 고객만 조회
    AND a.account_status = 'ACTIVE'                           -- 현재 활성 계좌만 인정
    AND t.transaction_status = 'SUCCESS'                      -- 성공한 거래만 선택
    AND t.transacted_at < '2026-09-01 00:00:00'              -- 마지막 거래 후보는 9월 이전
    AND NOT EXISTS (                                          -- 9월 거래가 존재하지 않는지 검사 시작
        SELECT 1                                              -- 존재 여부만 검사하므로 상수 1 선택
        FROM accounts AS a2                                   -- 해당 고객의 모든 계좌 조회
        INNER JOIN transactions AS t2                          -- 계좌에 속한 거래 조회
            ON a2.account_id = t2.account_id                  -- 계좌 ID 기준 연결
        WHERE a2.customer_id = c.customer_id                  -- 바깥쪽 고객과 동일한 고객
            AND a2.account_status = 'ACTIVE'                  -- 활성 계좌만 인정
            AND t2.transaction_status = 'SUCCESS'            -- 성공한 거래만 인정
            AND t2.transacted_at >= '2026-09-01 00:00:00'   -- 9월 1일부터 조회
            AND t2.transacted_at < '2026-10-01 00:00:00'    -- 10월 1일 직전까지 조회
    )                                                         -- 9월 성공 거래가 존재하면 고객 제외
    AND t.transaction_id = (                                  -- 현재 고객의 가장 최근 거래 ID만 선택
        SELECT t3.transaction_id                              -- 마지막 거래의 ID 조회
        FROM accounts AS a3                                   -- 해당 고객의 계좌 조회
        INNER JOIN transactions AS t3                          -- 해당 계좌의 거래 조회
            ON a3.account_id = t3.account_id                  -- 계좌 ID 기준 연결
        WHERE a3.customer_id = c.customer_id                  -- 바깥쪽 고객과 동일한 고객
            AND a3.account_status = 'ACTIVE'                  -- 활성 계좌만 인정
            AND t3.transaction_status = 'SUCCESS'            -- 성공한 거래만 인정
            AND t3.transacted_at < '2026-09-01 00:00:00'    -- 9월 이전 거래만 후보로 선택
        ORDER BY t3.transacted_at DESC, t3.transaction_id DESC -- 최근 일시 우선, 같으면 큰 거래 ID 우선
        LIMIT 1                                               -- 정렬 결과 첫 번째 거래 한 건만 선택
    )                                                         -- 최근 거래 ID 선택 종료
ORDER BY last_transaction_date ASC, c.customer_id ASC;        -- 마지막 거래 일시 오름차순, 고객 ID 오름차순



