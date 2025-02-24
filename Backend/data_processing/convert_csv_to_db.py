import sqlite3
import pandas as pd

# Load CSV file
csv_file = "output.csv" 
df = pd.read_csv(csv_file, delimiter="\t") 

conn = sqlite3.connect("companies.db")
cursor = conn.cursor()

# create table
cursor.execute("""
    CREATE TABLE IF NOT EXISTS companies (
        id TEXT PRIMARY KEY,
        name TEXT,
        industries TEXT,
        founded_date DATE,
        num_employees TEXT,
        website TEXT,
        about TEXT
    );
""")

# insert data into table
df.to_sql("companies", conn, if_exists="replace", index=False)

# commit and close connection
conn.commit()
conn.close()

print("Data successfully imported into companies.db")
