SELECT
  th.id,
  th."createdAt",
  th.note,
  th."paymentMethode",
  th."isExport",
  th."goldPrice",
  th."contactId",
  c.name AS "contactName",
  COALESCE(sum(gtd.amount), (0) :: numeric) AS "goldAmount",
  COALESCE(sum(jtd.amount), (0) :: numeric) AS "jewelryAmount",
  (
    COALESCE(sum(gtd.amount), (0) :: numeric) + COALESCE(sum(jtd.amount), (0) :: numeric)
  ) AS "totalAmount",
  jsonb_agg(
    DISTINCT CASE
      WHEN (
        (g.name IS NOT NULL)
        AND (gtd.weight IS NOT NULL)
      ) THEN jsonb_build_object(
        'name',
        g.name,
        'weight',
        (gtd.weight - (0) :: numeric)
      )
      ELSE NULL :: jsonb
    END
  ) FILTER (
    WHERE
      (
        (g.name IS NOT NULL)
        AND (gtd.weight IS NOT NULL)
      )
  ) AS "goldDetails",
  jsonb_agg(
    DISTINCT CASE
      WHEN (
        (j.name IS NOT NULL)
        AND (j."goldWeight" IS NOT NULL)
      ) THEN jsonb_build_object(
        'name',
        j.name,
        'weight',
        (j."goldWeight" - (0) :: numeric)
      )
      ELSE NULL :: jsonb
    END
  ) FILTER (
    WHERE
      (
        (j.name IS NOT NULL)
        AND (j."goldWeight" IS NOT NULL)
      )
  ) AS "jewelryDetails",
  COALESCE(
    sum(
      CASE
        WHEN (pd.type = 'TM' :: "PaymentType") THEN pd.amount
        ELSE (0) :: numeric
      END
    ),
    (0) :: numeric
  ) AS "cashAmount",
  COALESCE(
    sum(
      CASE
        WHEN (pd.type = 'CK' :: "PaymentType") THEN pd.amount
        ELSE (0) :: numeric
      END
    ),
    (0) :: numeric
  ) AS "bankAmount"
FROM
  (
    (
      (
        (
          (
            (
              "TransactionHeader" th
              LEFT JOIN "Contact" c ON ((th."contactId" = c.id))
            )
            LEFT JOIN "GoldTransactionDetail" gtd ON ((gtd."transactionHeaderId" = th.id))
          )
          LEFT JOIN "Gold" g ON ((g.id = gtd."goldId"))
        )
        LEFT JOIN "JewelryTransactionDetail" jtd ON ((jtd."transactionHeaderId" = th.id))
      )
      LEFT JOIN "Jewelry" j ON ((j.id = jtd."jewelryId"))
    )
    LEFT JOIN "PaymentDetail" pd ON ((pd."transactionHeaderId" = th.id))
  )
GROUP BY
  th.id,
  th."createdAt",
  th.note,
  th."paymentMethode",
  th."isExport",
  th."goldPrice",
  th."contactId",
  c.name;