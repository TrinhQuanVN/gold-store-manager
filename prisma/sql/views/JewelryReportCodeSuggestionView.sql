DROP VIEW IF EXISTS "JewelryReportCodeSuggestionView";

CREATE OR REPLACE VIEW "JewelryReportCodeSuggestionView" AS
SELECT DISTINCT ON (j."reportProductCode")
  j."reportProductCode",
  j.name,
  j."categoryId",
  j."typeId",
  j.description,
  j."goldWeight",
  j."gemWeight",
  j."totalWeight",
  j."gemName",
  j.size,
  j."madeIn",
  j."supplierId"
FROM "Jewelry" j
LEFT JOIN "JewelryType" jt ON j."typeId" = jt.id
LEFT JOIN "JewelryCategory" jc ON j."categoryId" = jc.id
WHERE j."reportProductCode" IS NOT NULL
ORDER BY j."reportProductCode", jt.id ASC, jc.id ASC;


DROP VIEW IF EXISTS "JewelryReportCodeSuggestionView";

CREATE OR REPLACE VIEW "JewelryReportCodeSuggestionView" AS
WITH ranked AS (
  SELECT
    j."reportProductCode",
    j.name,
    j."categoryId",
    j."typeId",
    j.description,
    j."goldWeight",
    j."gemWeight",
    j."totalWeight",
    j."gemName",
    j.size,
    j."madeIn",
    j."supplierId",
    ROW_NUMBER() OVER (
      PARTITION BY j."reportProductCode"
      ORDER BY jt.id ASC, jc.id ASC
    ) AS rn
  FROM "Jewelry" j
  LEFT JOIN "JewelryType" jt ON j."typeId" = jt.id
  LEFT JOIN "JewelryCategory" jc ON j."categoryId" = jc.id
  WHERE j."reportProductCode" IS NOT NULL
)
SELECT *
FROM ranked
WHERE rn = 1;