import psycopg2
import random
import datetime
from collections import defaultdict

weight_config = {
    1: 11, 1.5: 11, 2: 15, 2.5: 10, 3: 11, 3.5: 12, 4: 9,
    4.5: 11, 5: 14, 5.5: 10, 6: 11, 6.5: 12, 7: 4, 7.5: 5,
    8: 4, 8.5: 5, 9: 3, 9.5: 3, 10.5: 3, 11: 3
}

# Bước 1: Tạo list tất cả các trọng lượng
all_weights = []
for weight, count in weight_config.items():
    all_weights.extend([weight] * count)

# Bước 2: Sắp xếp giảm dần để greedy phân phối khối lượng lớn trước
all_weights.sort(reverse=True)

# Bước 3: Greedy phân chia vào 3 tháng
array_weights_apr = []
array_weights_may = []
array_weights_jun = []
sums = [0, 0, 0]

for w in all_weights:
    # Chọn tháng có tổng trọng lượng nhỏ nhất
    min_index = sums.index(min(sums))
    if min_index == 0:
        array_weights_apr.append(w)
    elif min_index == 1:
        array_weights_may.append(w)
    else:
        array_weights_jun.append(w)
    sums[min_index] += w

# Shuffle từng tháng
random.shuffle(array_weights_apr)
random.shuffle(array_weights_may)
random.shuffle(array_weights_jun)

# Gộp lại
array_weights = array_weights_apr + array_weights_may + array_weights_jun
# print(array_weights)

print(f"Tổng tháng 4: {round(sum(array_weights_apr), 2)}")
print(f"Tổng tháng 5: {round(sum(array_weights_may), 2)}")
print(f"Tổng tháng 6: {round(sum(array_weights_jun), 2)}")

assert len(array_weights) == 167

# Tạo danh sách ngày random từ 1/4 đến 30/6
start_date = datetime.date(2025, 4, 1)
end_date = datetime.date(2025, 6, 30)
date_range = [start_date + datetime.timedelta(days=i) for i in range((end_date - start_date).days + 1)]

# Phân bố số lượng giao dịch mỗi ngày
array_transaction_date = []
for date in date_range:
    for _ in range(random.randint(0, 4)):
        hour = random.randint(9, 18)
        minute = random.randint(0, 59)
        second = random.randint(0, 59)

        if hour == 18 and minute > 30:
            minute = random.randint(0, 30)

        dt = datetime.datetime.combine(date, datetime.time(hour, minute, second)).isoformat()
        array_transaction_date.append(dt)

array_transaction_date = array_transaction_date[:167]  # Cắt đúng 167 giao dịch
assert len(array_transaction_date) == 167

# print(array_transaction_date)

# Kết nối DB
conn = psycopg2.connect(
    dbname="nextjsHQ",
    user="postgres",
    password="91Nguyenvantroi",
    host="localhost",
    port="5432"
)
cur = conn.cursor()

cur.execute("""
    SELECT th.id FROM "TransactionHeader" th
    LEFT JOIN "JewelryTransactionDetail" jtd ON jtd."transactionHeaderId" = th.id
    WHERE th."isExport" = false
      AND jtd.id IS NULL
      AND (th.note IS NULL OR th.note NOT IN ('006A','006B','006C','013','020'))
""")
array_transaction_created = [row[0] for row in cur.fetchall()]

# Tạo array mới nếu thiếu
array_transaction_new_create = [None] * (167 - len(array_transaction_created))
assert len(array_transaction_created) + len(array_transaction_new_create) == 167

# Hàm lấy goldPrice theo ngày gần nhất
def get_gold_price(date_iso):
    cur.execute("""
        SELECT "sell" FROM "GoldPrice"
        WHERE "createdAt" <= %s
        ORDER BY "createdAt" DESC
        LIMIT 1
    """, (date_iso,))
    result = cur.fetchone()
    return int(result[0]) if result else 111111  # fallback

# Xoá detail và payment
def delete_related(transaction_id):
    cur.execute('DELETE FROM "GoldTransactionDetail" WHERE "transactionHeaderId" = %s', (transaction_id,))
    cur.execute('DELETE FROM "PaymentDetail" WHERE "transactionHeaderId" = %s', (transaction_id,))

# Tạo mới gold detail
def insert_gold_detail(transaction_id, price, weight, created_at):
    amount = int(price * weight)
    cur.execute("""
        INSERT INTO "GoldTransactionDetail" 
        ("goldId", "price", "weight", "discount", "amount", "transactionHeaderId", "createdAt") 
        VALUES (1, %s, %s, 0, %s, %s, %s)
    """, (price, weight, amount, transaction_id, created_at))

# Tạo mới payment (tiền mặt)
def insert_payment_detail(transaction_id, amount, created_at):
    cur.execute("""
        INSERT INTO "PaymentDetail"
        ("amount", "transactionHeaderId", "type", "createdAt")
        VALUES (%s, %s, 'TM', %s)
    """, (amount, transaction_id, created_at))

# Tạo mới transaction
def insert_transaction(date_iso, price):
    cur.execute("""
        INSERT INTO "TransactionHeader"
        ("note", "isExport", "paymentMethode", "contactId", "createdAt", "goldPrice")
        VALUES (NULL, false, 'TM', 992, %s, %s)
        RETURNING id
    """, (date_iso, price))
    return cur.fetchone()[0]

try:
    # Loop để xử lý hoặc tạo mới
    for i in range(167):
        date = array_transaction_date[i]
        weight = array_weights[i]
        goldPrice = get_gold_price(date) - 50_000

        if i < len(array_transaction_created):
            tid = array_transaction_created[i]
            delete_related(tid)
            cur.execute("""
                UPDATE "TransactionHeader" SET "createdAt" = %s, "goldPrice" = %s WHERE id = %s
            """, (date, goldPrice, tid))
        else:
            tid = insert_transaction(date, goldPrice)

        insert_gold_detail(tid, goldPrice, weight, date)
        insert_payment_detail(tid, int(goldPrice * weight), date)

except Exception as e:
    conn.rollback()
    print("Đã xảy ra lỗi, rollback toàn bộ giao dịch.")
    print("Lỗi:", e)
else:
    conn.commit()
    print("Hoàn thành cập nhật hoặc tạo 167 giao dịch.")

finally:
    cur.close()
    conn.close()

print("Hoàn thành cập nhật hoặc tạo 167 giao dịch.")