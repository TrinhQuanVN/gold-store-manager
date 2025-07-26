CREATE OR REPLACE PROCEDURE import_report_xnt_from_transaction(
  in_header_id BIGINT,
  in_start_date TIMESTAMP,
  in_end_date TIMESTAMP
)
LANGUAGE plpgsql
AS $$
DECLARE
  r RECORD;
  gold_ids INT[];
  jewelry_ids INT[];

  nhap_quantity DECIMAL(9,4);
  nhap_value    DECIMAL(13,2);
  xuat_quantity DECIMAL(9,4);

  avg_price     DECIMAL(13,2);
  xuat_value    DECIMAL(13,2);
BEGIN
  FOR r IN
    SELECT *
    FROM "ReportXNT" report
    JOIN "ReportXNTGroup" g ON report."groupId" = g."id"
    WHERE g."headerId" = in_header_id
  LOOP
    -- Lấy danh sách gold / jewelry có reportProductCode khớp
    SELECT array_agg(id) INTO gold_ids FROM "Gold" WHERE "reportProductCode" = r."productCode";
    SELECT array_agg(id) INTO jewelry_ids FROM "Jewelry" WHERE "reportProductCode" = r."productCode";

    -- ===== NHẬP =====
    SELECT
      COALESCE(SUM(gtd."weight"), 0),
      COALESCE(SUM(gtd."amount"), 0)
    INTO nhap_quantity, nhap_value
    FROM "GoldTransactionDetail" gtd
    JOIN "TransactionHeader" th ON gtd."transactionHeaderId" = th.id
    WHERE
      gold_ids IS NOT NULL AND gtd."goldId" = ANY(gold_ids)
      AND th."isExport" = false
      AND th."createdAt" BETWEEN in_start_date AND in_end_date;

    SELECT
      nhap_quantity + COALESCE(SUM(j."goldWeight"), 0),
      nhap_value + COALESCE(SUM(jtd."amount"), 0)
    INTO nhap_quantity, nhap_value
    FROM "JewelryTransactionDetail" jtd
    JOIN "Jewelry" j ON jtd."jewelryId" = j.id
    JOIN "TransactionHeader" th ON jtd."transactionHeaderId" = th.id
    WHERE
      jewelry_ids IS NOT NULL AND j.id = ANY(jewelry_ids)
      AND th."isExport" = false
      AND th."createdAt" BETWEEN in_start_date AND in_end_date;

    -- ===== XUẤT =====
    SELECT
      COALESCE(SUM(gtd."weight"), 0)
    INTO xuat_quantity
    FROM "GoldTransactionDetail" gtd
    JOIN "TransactionHeader" th ON gtd."transactionHeaderId" = th.id
    WHERE
      gold_ids IS NOT NULL AND gtd."goldId" = ANY(gold_ids)
      AND th."isExport" = true
      AND th."createdAt" BETWEEN in_start_date AND in_end_date;

    SELECT
      xuat_quantity + COALESCE(SUM(j."goldWeight"), 0)
    INTO xuat_quantity
    FROM "JewelryTransactionDetail" jtd
    JOIN "Jewelry" j ON jtd."jewelryId" = j.id
    JOIN "TransactionHeader" th ON jtd."transactionHeaderId" = th.id
    WHERE
      jewelry_ids IS NOT NULL AND j.id = ANY(jewelry_ids)
      AND th."isExport" = true
      AND th."createdAt" BETWEEN in_start_date AND in_end_date;

    -- ===== GIÁ TRỊ & CẬP NHẬT =====
    IF (r."tonDauKyQuantity" + nhap_quantity) > 0 THEN
      avg_price := ROUND((r."tonDauKyValue" + nhap_value) / (r."tonDauKyQuantity" + nhap_quantity));
    ELSE
      avg_price := 0;
    END IF;

    xuat_value := ROUND(avg_price * xuat_quantity);

    UPDATE "ReportXNT"
    SET
      "nhapQuantity" = nhap_quantity,
      "nhapValue" = nhap_value,
      "xuatQuantity" = xuat_quantity,
      "xuatValue" = xuat_value,
      "tonCuoiKyQuantity" = r."tonDauKyQuantity" + nhap_quantity - xuat_quantity,
      "tonCuoiKyValue" = r."tonDauKyValue" + nhap_value - xuat_value,
      "updatedAt" = now()
    WHERE id = r.id;
  END LOOP;
END;








