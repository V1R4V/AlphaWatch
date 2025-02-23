import sqlite3

conn = sqlite3.connect("Backend/companies.db")
cur = conn.cursor()

query = """
DELETE FROM companies
WHERE name LIKE '%university%' OR name LIKE '%universidad%';
"""

cur.execute(query)
conn.commit()