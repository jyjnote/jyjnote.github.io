-- 1. 문제 문항
-- NH농협은행은 2026년 9월 거래 실적을 기준으로 수수료 우대 고객을 선정하려고 한다.
-- 고객 테이블 customers, 계좌 테이블 accounts, 거래 테이블 transactions를 사용하여 다음 조건을 모두 만족하는 고객을 조회하시오.
-- 조건	내용
-- 고객 상태	ACTIVE
-- 계좌 상태	ACTIVE
-- 거래 상태	SUCCESS
-- 거래 기간	2026-09-01 이상, 2026-10-01 미만
-- 급여 입금 합계	1,000,000원 이상
-- 타행 이체 건수	3건 이상
-- 타행 이체 합계	500,000원 이상
-- 고객이 여러 계좌를 보유하고 있다면 모든 활성 계좌의 거래를 고객 단위로 합산한다.
-- 출력 컬럼은 customer_id, customer_name, salary_total, transfer_count, transfer_total이다.
-- transfer_total 내림차순으로 정렬하고, 금액이 같으면 customer_id 오름차순으로 정렬한다.
SELECT -- 최종 결과에 출력할 컬럼을 선택
    c.customer_id, -- 고객 ID
    c.customer_name, -- 고객 이름
    SUM(CASE WHEN t.transaction_type = 'SALARY_IN' THEN t.amount ELSE 0 END) AS salary_total, -- 급여 입금 금액만 합산
    SUM(CASE WHEN t.transaction_type = 'EXTERNAL_OUT' THEN 1 ELSE 0 END) AS transfer_count, -- 타행 이체 거래 건수 계산
    SUM(CASE WHEN t.transaction_type = 'EXTERNAL_OUT' THEN t.amount ELSE 0 END) AS transfer_total -- 타행 이체 금액만 합산
FROM customers AS c -- 고객 테이블을 c라는 별칭으로 사용
JOIN accounts AS a -- 고객과 계좌 테이블 연결
    ON c.customer_id = a.customer_id -- 고객 ID가 같은 계좌 연결
    AND a.account_status = 'ACTIVE' -- 정상 계좌만 인정
JOIN transactions AS t -- 계좌와 거래 내역 테이블 연결
    ON a.account_id = t.account_id -- 계좌 ID가 같은 거래 연결
WHERE c.customer_status = 'ACTIVE' -- 정상 고객만 조회
    AND t.transaction_status = 'SUCCESS' -- 성공한 거래만 인정
    AND t.transacted_at >= '2026-09-01 00:00:00' -- 9월 1일 0시부터 포함
    AND t.transacted_at < '2026-10-01 00:00:00' -- 10월 1일 0시부터 제외
GROUP BY c.customer_id, c.customer_name -- 고객별로 거래를 하나의 그룹으로 묶음
HAVING salary_total >= 1000000 -- 급여 입금 합계 100만 원 이상
    AND transfer_count >= 3 -- 타행 이체 성공 건수 3건 이상
    AND transfer_total >= 500000 -- 타행 이체 합계 50만 원 이상
ORDER BY transfer_total DESC, c.customer_id ASC; -- 이체 합계 내림차순, 동점이면 고객 ID 오름차순
  