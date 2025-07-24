import sqlite3
import psycopg2
from datetime import datetime, timedelta
import os

# --- Cấu hình ---
SQLITE_PATH = os.path.join(os.path.dirname(__file__), "dev.db")

# --- Kết nối ---
sqlite_conn = sqlite3.connect(SQLITE_PATH)
sqlite_cursor = sqlite_conn.cursor()

pg_conn = psycopg2.connect(
    dbname="nextjsHQ",
    user="postgres",
    password="91Nguyenvantroi",  # thay bằng mật khẩu thật
    host="localhost",
    port="5432"
)
pg_cursor = pg_conn.cursor()

# # === JewelryType ===
# sqlite_cursor.execute("SELECT name, goldPercent, description, color FROM JewelryType")
# jewelry_types = sqlite_cursor.fetchall()


# pg_cursor.execute('TRUNCATE TABLE "JewelryType" RESTART IDENTITY CASCADE;')

# for jt in jewelry_types:
#     pg_cursor.execute("""
#         INSERT INTO "JewelryType" ("name", "goldPercent", "description", "color")
#         VALUES (%s, %s, %s, %s)
#     """, jt)

# # === JewelryCategory ===
# sqlite_cursor.execute("SELECT name, description, color FROM JewelryCategory")
# jewelry_categories = sqlite_cursor.fetchall()

# pg_cursor.execute('TRUNCATE TABLE "JewelryCategory" RESTART IDENTITY CASCADE;')

# for jc in jewelry_categories:
#     pg_cursor.execute("""
#         INSERT INTO "JewelryCategory" ("name", "description", "color")
#         VALUES (%s, %s, %s)
#     """, jc)


# --- Lấy dữ liệu từ SQLite ---
sqlite_cursor.execute("""
    SELECT name, totalWeight, categoryId, jewelryTypeId, createdAt
    FROM Jewelry
    WHERE inStock = 1 AND id NOT IN (708)
    ORDER BY jewelryTypeId, categoryId;
""")

rows = sqlite_cursor.fetchall()
print(f"🔍 Tìm thấy {len(rows)} sản phẩm còn hàng trong SQLite")

# pg_cursor.execute('TRUNCATE TABLE "Jewelry" RESTART IDENTITY CASCADE;')


# --- Insert từng dòng vào PostgreSQL ---
for row in rows:
    name, total_weight, category_id, jewelry_type_id, created_at_str = row

    # 👉 Chuyển createdAt từ UTC+7 → UTC ISO string
    local_dt = datetime.strptime(created_at_str, "%Y-%m-%d %H:%M:%S")
    utc_dt = local_dt - timedelta(hours=7)
    utc_created_at_iso = utc_dt.isoformat()

    # 👉 Insert vào PostgreSQL (không dùng id)
    pg_cursor.execute("""
        INSERT INTO "Jewelry" (
            "name", "goldWeight", "categoryId", "typeId",
            "gemWeight", "totalWeight", "createdAt"
        ) VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (
        name,
        total_weight,
        category_id,
        jewelry_type_id,
        0,
        0,
        utc_created_at_iso
    ))

pg_conn.commit()

# --- Đóng kết nối ---
sqlite_cursor.close()
sqlite_conn.close()
pg_cursor.close()
pg_conn.close()

print("✅ Đã import Jewelry từ SQLite sang PostgreSQL (bỏ id, dùng auto-increment)")
