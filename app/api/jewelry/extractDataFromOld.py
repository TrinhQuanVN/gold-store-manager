import sqlite3
from pathlib import Path
from datetime import datetime

# Đường dẫn
db1_path = r"D:\db_edit\db4.db"
output_sql_path = r"C:\Users\Admin\Desktop\sqlite query\import_jewelry.sql"

# Kết nối db1
conn = sqlite3.connect(db1_path)
cursor = conn.cursor()

# Escape string an toàn
def escape(s):
    if s is None:
        return "NULL"
    return "'" + str(s).replace("'", "''") + "'"

# Truy vấn import
cursor.execute("""
    SELECT td.product_id, SUM(td.quantity)
    FROM transaction_details td
    JOIN transactions t ON td.transaction_id = t.id
    WHERE t.transaction_type_id = 1
    GROUP BY td.product_id
""")
imports = {row[0]: row[1] for row in cursor.fetchall()}

# Truy vấn export
cursor.execute("""
    SELECT td.product_id, SUM(td.quantity)
    FROM transaction_details td
    JOIN transactions t ON td.transaction_id = t.id
    WHERE t.transaction_type_id = 2
    GROUP BY td.product_id
""")
exports = {row[0]: row[1] for row in cursor.fetchall()}

# Chỉ lấy sản phẩm có product_category_id từ 2 đến 12
cursor.execute("""
    SELECT id, name, product_category_id, gold_type_id, weight
    FROM products
    WHERE product_category_id BETWEEN 2 AND 12
""")
products = cursor.fetchall()

now = datetime.now().isoformat()
sql_lines = ["BEGIN TRANSACTION;"]

for (
    product_id, name, category_id, gold_type_id, weight
) in products:
    imported = int(imports.get(product_id, 0))
    exported = int(exports.get(product_id, 0))
    in_stock_qty = max(imported - exported, 0)

    for i in range(imported):
        instock = "true" if i < in_stock_qty else "false"
        sql = f"""
INSERT INTO Jewelry (
    name, goldWeight, gemWeight, totalWeight, inStock,
    categoryId, jewelryTypeId, madeIn, createdAt
) VALUES (
    {escape(name)}, 0, 0, {weight}, {instock},
    {category_id - 1}, {gold_type_id}, 'Việt Nam', {escape(now)}
);"""
        sql_lines.append(sql.strip())

sql_lines.append("COMMIT;")

# Ghi ra file
Path(output_sql_path).parent.mkdir(parents=True, exist_ok=True)
with open(output_sql_path, "w", encoding="utf-8") as f:
    f.write("\n".join(sql_lines))

conn.close()
