DROP VIEW IF EXISTS "TransactionListView";

CREATE OR REPLACE VIEW "TransactionListView" AS
WITH gold_sum AS (
  SELECT "transactionHeaderId", SUM(amount) AS goldAmount
  FROM "GoldTransactionDetail"
  GROUP BY "transactionHeaderId"
),
jewelry_sum AS (
  SELECT "transactionHeaderId", SUM(amount) AS jewelryAmount
  FROM "JewelryTransactionDetail"
  GROUP BY "transactionHeaderId"
),
payment_sum AS (
  SELECT 
    "transactionHeaderId",
    SUM(CASE WHEN type = 'TM' THEN amount ELSE 0 END) AS cashAmount,
    SUM(CASE WHEN type = 'CK' THEN amount ELSE 0 END) AS bankAmount
  FROM "PaymentDetail"
  GROUP BY "transactionHeaderId"
)
SELECT 
  th.id,
  th."createdAt",
  th.note,
  th."paymentMethode",
  th."isExport",
  th."goldPrice",
  th."contactId",
  c.name AS "contactName",

  COALESCE(gs.goldAmount, 0) AS "goldAmount",
  COALESCE(js.jewelryAmount, 0) AS "jewelryAmount",
  COALESCE(gs.goldAmount, 0) + COALESCE(js.jewelryAmount, 0) AS "totalAmount",

  -- goldDetails giữ nguyên như cũ
  (
    SELECT jsonb_agg(DISTINCT jsonb_build_object('name', g.name, 'weight', gtd.weight))
    FROM "GoldTransactionDetail" gtd
    JOIN "Gold" g ON g.id = gtd."goldId"
    WHERE gtd."transactionHeaderId" = th.id
  ) AS "goldDetails",

  (
    SELECT jsonb_agg(DISTINCT jsonb_build_object('name', j.name, 'weight', j."goldWeight"))
    FROM "JewelryTransactionDetail" jtd
    JOIN "Jewelry" j ON j.id = jtd."jewelryId"
    WHERE jtd."transactionHeaderId" = th.id
  ) AS "jewelryDetails",

  COALESCE(ps.cashAmount, 0) AS "cashAmount",
  COALESCE(ps.bankAmount, 0) AS "bankAmount"

FROM "TransactionHeader" th
LEFT JOIN "Contact" c ON th."contactId" = c.id
LEFT JOIN gold_sum gs ON gs."transactionHeaderId" = th.id
LEFT JOIN jewelry_sum js ON js."transactionHeaderId" = th.id
LEFT JOIN payment_sum ps ON ps."transactionHeaderId" = th.id;

