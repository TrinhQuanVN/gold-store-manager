DROP VIEW IF EXISTS "ContactListView";

CREATE OR REPLACE VIEW "ContactListView" AS
SELECT 
  c.id,
  c."groupId",
  c.name,
  c."unaccentName",
  c.address,
  c.cccd,
  c.taxcode,
  c.phone,
  c.note,
  c."createdAt", 

  g.name AS "groupName",
  g.color AS "groupColor",

  -- Tổng giá trị giao dịch nhập (isExport = false)
  COALESCE((
    SELECT SUM(COALESCE(gtd.amount, 0) + COALESCE(jtd.amount, 0))
    FROM "TransactionHeader" th
    LEFT JOIN "GoldTransactionDetail" gtd ON th.id = gtd."transactionHeaderId"
    LEFT JOIN "JewelryTransactionDetail" jtd ON th.id = jtd."transactionHeaderId"
    WHERE th."contactId" = c.id AND th."isExport" = false
  ), 0) AS "importValue",

  -- Tổng giá trị giao dịch xuất (isExport = true)
  COALESCE((
    SELECT SUM(COALESCE(gtd.amount, 0) + COALESCE(jtd.amount, 0))
    FROM "TransactionHeader" th
    LEFT JOIN "GoldTransactionDetail" gtd ON th.id = gtd."transactionHeaderId"
    LEFT JOIN "JewelryTransactionDetail" jtd ON th.id = jtd."transactionHeaderId"
    WHERE th."contactId" = c.id AND th."isExport" = true
  ), 0) AS "exportValue"

FROM "Contact" c
JOIN "ContactGroup" g ON c."groupId" = g.id;
