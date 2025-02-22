import json
import csv

# load JSON data
with open('companies.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# write to output.csv with proper quoting
with open('output.csv', 'w', newline='', encoding='utf-8') as output_file:
    writer = csv.writer(output_file, delimiter='\t', quoting=csv.QUOTE_MINIMAL)
    writer.writerow(['id', 'name', 'industries', 'founded_date', 'num_employees', 'website', 'about'])  # Header

    for company in data:
        industries = company.get("industries", [])
        if not isinstance(industries, list):  # If it's not a list, default to empty list
            industries = []

        # extract the 'value' field of each industry
        industries_values = [industry.get("value", "") for industry in industries]

        # for every field except 'id', insert NULL if the value is missing or empty
        def get_value_or_null(field):
            return field if field else "NULL"

        writer.writerow([
            company.get("id", ""),  # ID should not be NULL, as it's the primary key
            get_value_or_null(company.get("name", "")),
            get_value_or_null(', '.join(industries_values)),  # join industries values as a string
            get_value_or_null(company.get("founded_date", "")),
            get_value_or_null(company.get("num_employees", "")),
            get_value_or_null(company.get("website", "")),
            get_value_or_null(company.get("about", ""))
        ])



