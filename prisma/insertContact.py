import sqlite3
import psycopg2
from datetime import datetime
import unicodedata

# Kết nối CSDL
SQLITE_PATH = r"D:\db_edit\db4.db"

sqlite_conn = sqlite3.connect(SQLITE_PATH)
sqlite_cursor = sqlite_conn.cursor()

pg_conn = psycopg2.connect(
    dbname="nextjsHQ",
    user="postgres",
    password="91Nguyenvantroi",
    host="localhost",
    port="5432"
)
pg_cursor = pg_conn.cursor()

# Loại bỏ dấu tiếng Việt
def to_lowercase_non_accent_vietnamese(s):
    s = s.lower()
    s = unicodedata.normalize('NFD', s)
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    s = s.replace('đ', 'd')
    return s

# Truy vấn tất cả transactions Q1/2025
sqlite_cursor.execute("""
    SELECT 
        c.id, c.name, c.issuenumber, c.address, c.phone,
        t.transaction_type_id, t.note
    FROM customers AS c
    JOIN transactions AS t ON c.id = t.customer_id
    WHERE t.id != 1
      AND t.transaction_type_id IN (1, 2)
      AND strftime('%Y', t.date) = '2025'
      AND strftime('%m', t.date) IN ('01', '02', '03')
""")

rows = sqlite_cursor.fetchall()

# Gom thông tin theo unique customer.id
from collections import defaultdict

unique_customers = {}

for row in rows:
    cust_id, name, cccd, address, phone, trans_type_id, note = row

    if cust_id not in unique_customers:
        unique_customers[cust_id] = {
            'name': name,
            'unaccentName': to_lowercase_non_accent_vietnamese(name),
            'cccd': cccd,
            'address': address,
            'phone': phone,
            'types': set(),
            'has_signed_sell': False,
            'has_unsigned_sell': False,
        }

    data = unique_customers[cust_id]
    data['types'].add(trans_type_id)

    if trans_type_id == 2:  # bán
        if note and "ký" in note.lower():
            data['has_signed_sell'] = True
        else:
            data['has_unsigned_sell'] = True

pg_cursor.execute('TRUNCATE TABLE "ContactGroup" RESTART IDENTITY CASCADE;')

contact_groups = [
    ("Bình thường", "Khách hàng thông thường", "gray"),
    ("Khách quen", "Khách giao dịch thường xuyên", "blue"),
    ("Thân thiết", "Khách hàng thân thiết", "green"),
    ("VIP", "Khách hàng VIP", "yellow")
]

for name, description, color in contact_groups:
    pg_cursor.execute("""
        INSERT INTO "ContactGroup" (name, description, color)
        VALUES (%s, %s, %s)
    """, (name, description, color))

pg_cursor.execute('TRUNCATE TABLE "Contact" RESTART IDENTITY CASCADE;')

# Insert vào PostgreSQL
inserted = 0

for data in unique_customers.values():
    types = data['types']

    # Ghi chú
    if 1 in types and 2 in types:
        note = "Khách mua và bán Q1/2025"
    elif 1 in types:
        note = "Khách mua Q1/2025"
    elif 2 in types:
        if data['has_signed_sell']:
            note = "Khách bán Q1/2025 đã ký"
        elif data['has_unsigned_sell']:
            note = "Khách bán Q1/2025 chưa ký"
        else:
            note = "Khách bán Q1/2025"
    else:
        note = None

    pg_cursor.execute("""
        INSERT INTO "Contact" ("groupId", "name", "unaccentName", "cccd", "address", "phone", "note")
        VALUES (1, %s, %s, %s, %s, %s, %s)
    """, (
        data['name'],
        data['unaccentName'],
        data['cccd'],
        data['address'],
        data['phone'],
        note
    ))
    inserted += 1

pg_conn.commit()
sqlite_conn.close()
pg_conn.close()

print(f"✅ Đã import {inserted} khách hàng duy nhất từ SQLite vào PostgreSQL.")
