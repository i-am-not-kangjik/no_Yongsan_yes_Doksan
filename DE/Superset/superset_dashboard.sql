-- superset 중고가_평균가격
SELECT product_name AS product_name,
       AVG(price) AS "평균가"
FROM
  (select *
   from product.chart_data) AS virtual_table
GROUP BY product_name
ORDER BY "평균가" DESC
LIMIT 50000;

-- superset 중고가_총판매량
SELECT product_name AS product_name,
       sum(sum) AS "총 판매량"
FROM
  (SELECT product_name,
          SUM(crawling)
   FROM product.phone_info2
   WHERE product_name IS NOT NULL
   GROUP BY product_name) AS virtual_table
GROUP BY product_name
ORDER BY "총 판매량" DESC
LIMIT 1000;

-- superset_날짜별 거래량
SELECT product_name AS product_name,
       DATE_TRUNC('day', transaction_date) AS transaction_date,
       sum(transaction_count) AS "날짜별 판매 갯수"
FROM
  (SELECT product_name,
          CASE
              WHEN categorized_hours LIKE '%일 전' THEN CURRENT_DATE - INTERVAL '1 day' * CAST(SUBSTRING(categorized_hours, 1, POSITION('일 전' IN categorized_hours) - 1) AS INTEGER)
              WHEN categorized_hours LIKE '%달 전' THEN CURRENT_DATE - INTERVAL '1 month' * CAST(SUBSTRING(categorized_hours, 1, POSITION('달 전' IN categorized_hours) - 1) AS INTEGER)
              ELSE NULL
          END AS transaction_date,
          COUNT(*) AS transaction_count
   FROM product.chart_data cd
   WHERE (categorized_hours LIKE '%일 전'
          OR categorized_hours LIKE '%달 전')
     and product_name LIKE '갤럭시%'
     AND CASE
             WHEN categorized_hours LIKE '%일 전' THEN CURRENT_DATE - INTERVAL '1 day' * CAST(SUBSTRING(categorized_hours, 1, POSITION('일 전' IN categorized_hours) - 1) AS INTEGER)
             WHEN categorized_hours LIKE '%달 전' THEN CURRENT_DATE - INTERVAL '1 month' * CAST(SUBSTRING(categorized_hours, 1, POSITION('달 전' IN categorized_hours) - 1) AS INTEGER)
             ELSE NULL
         END >= '2023-05-28'
   GROUP BY product_name,
            transaction_date
   ORDER BY product_name,
            transaction_date) AS virtual_table
GROUP BY product_name,
         DATE_TRUNC('day', transaction_date)
LIMIT 1000;

-- superset_날짜별_거래량(아이폰)
SELECT product_name AS product_name,
       DATE_TRUNC('day', transaction_date) AS transaction_date,
       AVG("날짜별 판매 갯수") AS "날짜별 판매 갯수"
FROM
  (SELECT product_name AS product_name,
          DATE_TRUNC('day', transaction_date) AS transaction_date,
          sum(transaction_count) AS "날짜별 판매 갯수"
   FROM
     (SELECT product_name,
             CASE
                 WHEN categorized_hours LIKE '%일 전' THEN CURRENT_DATE - INTERVAL '1 day' * CAST(SUBSTRING(categorized_hours, 1, POSITION('일 전' IN categorized_hours) - 1) AS INTEGER)
                 WHEN categorized_hours LIKE '%달 전' THEN CURRENT_DATE - INTERVAL '1 month' * CAST(SUBSTRING(categorized_hours, 1, POSITION('달 전' IN categorized_hours) - 1) AS INTEGER)
                 ELSE NULL
             END AS transaction_date,
             COUNT(*) AS transaction_count
      FROM product.chart_data cd
      WHERE (categorized_hours LIKE '%일 전'
             OR categorized_hours LIKE '%달 전')
        and product_name LIKE '아이폰%'
        AND CASE
                WHEN categorized_hours LIKE '%일 전' THEN CURRENT_DATE - INTERVAL '1 day' * CAST(SUBSTRING(categorized_hours, 1, POSITION('일 전' IN categorized_hours) - 1) AS INTEGER)
                WHEN categorized_hours LIKE '%달 전' THEN CURRENT_DATE - INTERVAL '1 month' * CAST(SUBSTRING(categorized_hours, 1, POSITION('달 전' IN categorized_hours) - 1) AS INTEGER)
                ELSE NULL
            END >= '2023-05-28'
      GROUP BY product_name,
               transaction_date
      ORDER BY product_name,
               transaction_date) AS virtual_table
   GROUP BY product_name,
            DATE_TRUNC('day', transaction_date)
   LIMIT 1000) AS virtual_table
GROUP BY product_name,
         DATE_TRUNC('day', transaction_date)
LIMIT 1000;

--가격 하락이 낮은 제품 랭킹
SELECT "순번" AS "순번",
       "상품명" AS "상품명",
       "용량" AS "용량",
       "원가" AS "원가",
       "평균" AS "평균"
FROM
  (SELECT "순번" AS "순번",
          "상품명" AS "상품명",
          "용량" AS "용량",
          "원가" AS "원가",
          "평균" AS "평균"
   FROM
     (SELECT cast(ROW_NUMBER() OVER (
                                     ORDER BY cost - avg(price) ASC) as TEXT) as 순번,
             product_name as 상품명,
             CAST(capacity AS TEXT) as 용량,
             cost as 원가,
             round(cost - avg(price), 0) as 잔존가치,
             ROUND(avg(price), 0) AS 평균
      FROM product.chart_data
      GROUP BY product_name,
               cost,
               capacity
      ORDER BY cost - avg(price) ASC) AS virtual_table
   LIMIT 1000) AS virtual_table
LIMIT 1000;