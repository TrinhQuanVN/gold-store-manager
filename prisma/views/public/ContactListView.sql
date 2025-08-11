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
  COALESCE(
    (
      SELECT
        sum(
          (
            COALESCE(gtd.amount, (0) :: numeric) + COALESCE(jtd.amount, (0) :: numeric)
          )
        ) AS sum
      FROM
        (
          (
            "TransactionHeader" th
            LEFT JOIN "GoldTransactionDetail" gtd ON ((th.id = gtd."transactionHeaderId"))
          )
          LEFT JOIN "JewelryTransactionDetail" jtd ON ((th.id = jtd."transactionHeaderId"))
        )
      WHERE
        (
          (th."contactId" = c.id)
          AND (th."isExport" = false)
        )
    ),
    (0) :: numeric
  ) AS "importValue",
  COALESCE(
    (
      SELECT
        sum(
          (
            COALESCE(gtd.amount, (0) :: numeric) + COALESCE(jtd.amount, (0) :: numeric)
          )
        ) AS sum
      FROM
        (
          (
            "TransactionHeader" th
            LEFT JOIN "GoldTransactionDetail" gtd ON ((th.id = gtd."transactionHeaderId"))
          )
          LEFT JOIN "JewelryTransactionDetail" jtd ON ((th.id = jtd."transactionHeaderId"))
        )
      WHERE
        (
          (th."contactId" = c.id)
          AND (th."isExport" = TRUE)
        )
    ),
    (0) :: numeric
  ) AS "exportValue"
FROM
  (
    "Contact" c
    JOIN "ContactGroup" g ON ((c."groupId" = g.id))
  );