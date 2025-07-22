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
cur.execute("TRUNCATE TABLE \"TaxPayer\" RESTART IDENTITY CASCADE;")

taxpayer = [["Tên người nộp thuế: Doanh nghiệp tư nhân vàng bạc đá quý Hồng Quân",
             "0700756585",
             "SN 91, đường Nguyễn Văn Trỗi, phường Phủ Lý, tỉnh Ninh Bình"],
          ]
for name, taxcode, address in taxpayer:
    cur.execute(
        """
        INSERT INTO "TaxPayer" ("name", "taxCode", "address")
        VALUES (%s, %s, %s)
        """,
        (name, taxcode, address),
    )

cur.execute("TRUNCATE TABLE \"Gold\" RESTART IDENTITY CASCADE;")

gold = [["Nhẫn tròn 24K",
             "99.99"],
          ]

for name, goldPercent in gold:
    cur.execute(
        """
        INSERT INTO "Gold" ("name", "goldPercent")
        VALUES (%s, %s)
        """,
        (name, goldPercent),
    )

conn.commit()

cur.close()
conn.close()