-- 1. 문제 설명
-- NH농협은행은 고객의 비정상적인 자금 이체를 탐지하기 위해 2026년 9월 거래 내역을 분석하려고 한다.
-- 다음 조건을 모두 만족하는 고객을 이상 거래 의심 고객으로 분류한다.
-- 1. 고객 상태가 ACTIVE여야 한다.
-- 2. 계좌 상태가 ACTIVE여야 한다.
-- 3. 거래 상태가 SUCCESS인 거래만 인정한다.
-- 4. 거래 유형이 EXTERNAL_OUT(타행 이체)인 거래만 대상으로 한다.
-- 5. 거래 기간은 2026년 9월 1일 이상, 2026년 10월 1일 미만이다.
-- 6. 해당 기간 타행 이체 금액의 합계가 3,000,000원 이상이어야 한다.
-- 7. 해당 기간에 1,000,000원 이상의 타행 이체가 2건 이상 존재해야 한다.
-- 8. 해당 기간에 타행 이체가 발생한 서로 다른 날짜가 2일 이상이어야 한다.


SELECT                                                       -- 최종 출력할 컬럼 선택
    c.customer_id,                                            -- 고객 고유번호 출력
    c.customer_name,                                          -- 고객 이름 출력
    SUM(t.amount) AS transfer_total,                          -- 고객별 타행 이체 금액 합산
    SUM(                                                       -- 고액 이체 건수 계산 시작
        CASE                                                   -- 조건에 따라 값을 반환
            WHEN t.amount >= 1000000 THEN 1                   -- 100만 원 이상이면 1건
            ELSE 0                                            -- 100만 원 미만이면 0건
        END                                                    -- CASE 조건문 종료
    ) AS high_value_count,                                    -- 고액 이체 건수 별칭 지정
    COUNT(DISTINCT DATE(t.transacted_at)) AS transfer_days,    -- 서로 다른 거래 날짜 수 계산
    MAX(t.amount) AS max_transfer                              -- 고객의 최대 타행 이체 금액
FROM customers AS c                                           -- 고객 테이블을 c로 지정
INNER JOIN accounts AS a                                      -- 계좌 테이블 연결
    ON c.customer_id = a.customer_id                          -- 고객 ID로 두 테이블 연결
INNER JOIN transactions AS t                                  -- 거래 내역 테이블 연결
    ON a.account_id = t.account_id                            -- 계좌 ID로 거래 내역 연결
WHERE c.customer_status = 'ACTIVE'                             -- 활성 고객만 조회
    AND a.account_status = 'ACTIVE'                           -- 활성 계좌만 조회
    AND t.transaction_status = 'SUCCESS'                      -- 성공한 거래만 조회
    AND t.transaction_type = 'EXTERNAL_OUT'                    -- 타행 이체 거래만 조회
    AND t.transacted_at >= '2026-09-01 00:00:00'             -- 9월 1일 0시부터 포함
    AND t.transacted_at < '2026-10-01 00:00:00'              -- 10월 1일 0시부터 제외
GROUP BY c.customer_id, c.customer_name                       -- 고객별로 모든 거래를 묶음
HAVING transfer_total >= 3000000                              -- 타행 이체 총액 300만 원 이상
    AND high_value_count >= 2                                 -- 100만 원 이상 이체가 2건 이상
    AND transfer_days >= 2                                    -- 서로 다른 날짜에 2일 이상 이체
ORDER BY transfer_total DESC, c.customer_id ASC;              -- 합계 내림차순, 고객 ID 오름차순
