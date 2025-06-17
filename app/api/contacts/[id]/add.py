import sqlite3
import requests
import random

# 1. API endpoints
BASE_URL = "http://localhost:3000"
GROUP_URL = f"{BASE_URL}/api/contact-groups"
CONTACT_URL = f"{BASE_URL}/api/contacts"

# 2. Contact group names to create
contact_groups = ["bình thường", "khách quen", "thân thiết", "VIP"]

# 3. Create contact groups
group_ids = []

for name in contact_groups:
    res = requests.post(GROUP_URL, json={"name": name})
    if res.status_code == 200 or res.status_code == 201:
        group_id = res.json().get("id")
        group_ids.append(group_id)
        print(f"Created group '{name}' with ID {group_id}")
    else:
        print(f"Failed to create group '{name}':", res.text)

# 4. Connect to SQLite and read customer data
DB_PATH = r"D:\Cursor\new_app\database\new_db3.db"
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

cursor.execute("SELECT id, name, phone, address, issuenumber, taxcode FROM customers WHERE id BETWEEN 2 AND 200")
rows = cursor.fetchall()

# 6. Post contacts
for row in rows:
    _id, name, phone, address, cccd, taxcode = row
    if not name:
        continue  # Skip if name is missing
    group_id = random.choice(group_ids)
    payload = {
        "name": name,
        "phone": phone,
        "address": address,
        "cccd": cccd,
        "taxcode": taxcode,
        "groupId": f"{group_id}"
    }
    res = requests.post(CONTACT_URL, json=payload)
    if res.status_code in (200, 201):
        print(f"Created contact: {name}")
    else:
        print(f"❌ Failed to create contact {name}: {res.status_code} {res.text}")
