import psycopg2
import re
from datetime import datetime, timedelta

# Cấu hình kết nối PostgreSQL
conn = psycopg2.connect(
    dbname="nextjsHQ",
    user="postgres",
    password="91Nguyenvantroi",  # thay bằng mật khẩu thật
    host="localhost",
    port="5432"
)
cur = conn.cursor()

# 👉 Xoá toàn bộ dữ liệu bảng GoldPrice
cur.execute('TRUNCATE TABLE "GoldPrice" RESTART IDENTITY CASCADE;')
print("🧹 Đã xoá toàn bộ dữ liệu cũ trong bảng GoldPrice")

# Đọc nội dung file s.sql
with open(r"C:\Users\Admin\Downloads\GiaVangBanLe (1).sql", "r", encoding="utf-8") as f:
    content = f.read()

# Regex bắt từng dòng giá trị (bỏ id)
pattern = re.compile(r"\(\s*\d+,\s*'([^']+)',\s*'([^']+)',\s*(\d+),\s*(\d+)\s*\)")
matches = pattern.findall(content)

print(f"🔍 Tìm thấy {len(matches)} dòng dữ liệu")

for date_str, gold_type, buy, sell in matches:
    buy = int(buy) * 1000
    sell = int(sell) * 1000

    if buy> 99_999_999 or sell> 99_999_999 :
        continue

    # 👉 Chuyển từ chuỗi ngày sang UTC (trừ 7 giờ)
    local_time = datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
    utc_time = local_time - timedelta(hours=7)

    cur.execute("""
        INSERT INTO "GoldPrice" ("name", "buy", "sell", "createdAt")
        VALUES (%s, %s, %s, %s)
    """, (gold_type, buy, sell, utc_time))

conn.commit()
cur.close()
conn.close()

print("✅ Đã insert toàn bộ dữ liệu vào bảng GoldPrice")
