import psycopg2
from openpyxl import load_workbook

# === Kết nối PostgreSQL ===
conn = psycopg2.connect(
    dbname="nextjsHQ",
    user="postgres",
    password="91Nguyenvantroi",
    host="localhost",
    port="5432"
)
cur = conn.cursor()

# === 1. RESET bảng ReportXNT ===
cur.execute("TRUNCATE TABLE \"ReportXNT\" RESTART IDENTITY CASCADE;")
conn.commit()
print("✅ Đã reset bảng ReportXNT.")

# === 2. Đọc file Excel ===
excel_path = r"C:\Users\Admin\Desktop\duLieuVangQ1_2025.xlsx"  # 👉 thay bằng đường dẫn thật
wb = load_workbook(excel_path)
ws = wb.active

header_id = 1

# Bỏ qua dòng header nếu có
row_start = 2 if isinstance(ws["A1"].value, str) else 1

inserted_count = 0

for row in ws.iter_rows(min_row=row_start, values_only=True):
    if not row or not row[0]:  # Bỏ dòng rỗng
        continue

    (
        id, name,
        tonDauKyQuantity, tonDauKyValue,
        nhapQuantity, nhapValue,
        xuatQuantity, xuatValue,
        tonCuoiKyQuantity, tonCuoiKyValue
    ) = row[:10]

    cur.execute("""
        INSERT INTO "ReportXNT" (
            "id", "headerId", "name", "unit",
            "tonDauKyQuantity", "tonDauKyValue",
            "nhapQuantity", "nhapValue",
            "xuatQuantity", "xuatValue",
            "tonCuoiKyQuantity", "tonCuoiKyValue"
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        str(id), header_id, str(name), "chỉ",
        tonDauKyQuantity or 0, tonDauKyValue or 0,
        nhapQuantity or 0, nhapValue or 0,
        xuatQuantity or 0, xuatValue or 0,
        tonCuoiKyQuantity or 0, tonCuoiKyValue or 0
    ))

    inserted_count += 1

conn.commit()
print(f"✅ Đã chèn {inserted_count} dòng từ Excel vào PostgreSQL.")

# === Đóng kết nối ===
cur.close()
conn.close()
