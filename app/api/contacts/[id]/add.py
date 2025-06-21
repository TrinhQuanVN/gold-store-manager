import sqlite3

import unicodedata
import re

def to_lowercase_non_accent_vietnamese(s):
    s = s.lower()
    s = re.sub(r'[àáạảãâầấậẩẫăằắặẳẵ]', 'a', s)
    s = re.sub(r'[èéẹẻẽêềếệểễ]', 'e', s)
    s = re.sub(r'[ìíịỉĩ]', 'i', s)
    s = re.sub(r'[òóọỏõôồốộổỗơờớợởỡ]', 'o', s)
    s = re.sub(r'[ùúụủũưừứựửữ]', 'u', s)
    s = re.sub(r'[ỳýỵỷỹ]', 'y', s)
    s = re.sub(r'đ', 'd', s)
    s = unicodedata.normalize('NFD', s)
    s = s.encode('ascii', 'ignore').decode('utf-8')
    return s

# Đường dẫn database
path1 = r'D:\db_edit\db4.db'
path2 = r'D:\Code\nextjs\gold-store-manager\prisma\dev.db'

# Kết nối
conn1 = sqlite3.connect(path1)
conn2 = sqlite3.connect(path2)

cur1 = conn1.cursor()
cur2 = conn2.cursor()

# ✅ 1. Xóa toàn bộ dữ liệu cũ trong bảng customers của path2
cur2.execute("DELETE FROM Contact")
conn2.commit()

# ✅ 2. Lấy dữ liệu từ path1 (giữ nguyên ID, bỏ id 1 và 447)
cur1.execute("""
SELECT id, name, phone, address, issuenumber, taxcode
FROM customers
WHERE id IN (
    SELECT DISTINCT customer_id FROM transactions
)
AND id NOT IN (1, 447)
""")

rows = cur1.fetchall()
inserted = 0

# ✅ 3. Chèn dữ liệu vào path2, giữ nguyên ID
for row in rows:
    id, name, phone, address, cccd, taxcode = row 
    if not name:
        continue

    group_id = 1
    try:
        unaccent_name = to_lowercase_non_accent_vietnamese(name)
        cur2.execute("""
            INSERT INTO Contact (id, name, unaccentName, phone, address, cccd, taxcode, groupId)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (id, name, unaccent_name, phone, address, cccd, taxcode, group_id))
        inserted += 1
    except sqlite3.IntegrityError as e:
        print(f"Lỗi khi chèn ID {id}: {e}")
        continue

# ✅ 4. Kết thúc
conn2.commit()
conn1.close()
conn2.close()

print(f"Đã chèn {inserted} khách hàng từ path1 sang path2.")


