CREATE OR REPLACE FUNCTION import_report_xnt(old_id BIGINT, new_id BIGINT) RETURNS VOID AS $$
DECLARE
  g RECORD; -- từng group trong old_header
  new_group_id INT;
BEGIN
  -- 1. Xoá toàn bộ dữ liệu của header mới
  DELETE FROM "ReportXNT" WHERE "groupId" IN (
    SELECT id FROM "ReportXNTGroup" WHERE "headerId" = new_id
  );
  DELETE FROM "ReportXNTGroup" WHERE "headerId" = new_id;

  -- 2. Lặp qua từng group trong header cũ
  FOR g IN
    SELECT g.*, COUNT(r.*) FILTER (
      WHERE r."tonCuoiKyQuantity" > 0 OR r."tonCuoiKyValue" > 0
    ) AS report_count
    FROM "ReportXNTGroup" g
    LEFT JOIN "ReportXNT" r ON r."groupId" = g."id"
    WHERE g."headerId" = old_id
    GROUP BY g.id
    ORDER BY g.stt
  LOOP
    -- 2.1 Nếu không có report có tồn cuối kỳ → bỏ qua group này
    IF g.report_count = 0 THEN
      CONTINUE;
    END IF;

    -- 2.2 Tạo group mới trong header mới
    INSERT INTO "ReportXNTGroup" ("name", "stt", "headerId", "createdAt", "updatedAt")
    VALUES (g."name", g."stt", new_id, now(), now())
    RETURNING id INTO new_group_id;

    -- 2.3 Copy report từ group cũ → group mới
    INSERT INTO "ReportXNT" (
      "groupId", "stt", "productCode", "name", "unit",
      "tonDauKyQuantity", "tonDauKyValue",
      "nhapQuantity", "nhapValue",
      "xuatQuantity", "xuatValue",
      "tonCuoiKyQuantity", "tonCuoiKyValue",
      "createdAt", "updatedAt"
    )
    SELECT
      new_group_id,
      r."stt",
      r."productCode",
      r."name",
      COALESCE(r."unit", 'chỉ'),
      r."tonCuoiKyQuantity",
      r."tonCuoiKyValue",
      0, 0, 0, 0, 0, 0,
      now(), now()
    FROM "ReportXNT" r
    WHERE r."groupId" = g."id"
      AND (r."tonCuoiKyQuantity" > 0 OR r."tonCuoiKyValue" > 0);
  END LOOP;
END;
$$ LANGUAGE plpgsql;
