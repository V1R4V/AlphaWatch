from flask import Flask, jsonify
import sqlite3

app = Flask(__name__)

def get_data():
    conn = sqlite3.connect('companies.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM companies")
    rows = cursor.fetchall()
    conn.close()
    return rows

@app.route('/api/data', methods=['GET'])
def fetch_data():
    data = get_data()
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
