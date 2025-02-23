import json
import csv

# To-do:
# 1. remove ID with 'university'
# 2. remove ID values with 'not available'


# load JSON data
with open('companies.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# write to output.csv with proper quoting
with open('output.csv', 'w', newline='', encoding='utf-8') as output_file:
    writer = csv.writer(output_file, delimiter='\t', quoting=csv.QUOTE_MINIMAL)
    writer.writerow([
        'id', 'name', 'industries', 'investors', 'value_usd', 'last_funding_type', 
        'founded_date', 'num_employees', 'website', 'social_media_links', 'monthly_visits',
        'about', 'address', 'country_code', 'cb_rank', 'full_description', 'image'
    ])  # Header

    for company in data:
        industries = company.get("industries", [])
        if not isinstance(industries, list):
            industries = []
        industries_values = [industry.get("value", "") for industry in industries]

        investors = company.get("investors", [])
        if not isinstance(investors, list):
            investors = []
        investor_names = [investor.get("investor", {}).get("value", "") for investor in investors]
        
        social_media_links = company.get("social_media_links", [])
        if not isinstance(social_media_links, list):
            social_media_links = []
        social_links_str = ', '.join(social_media_links)
        
        funding_rounds = company.get("funding_rounds", {})
        last_funding_type = funding_rounds.get("last_funding_type", "") if funding_rounds else {}
        value = funding_rounds.get("value", {}) if funding_rounds else {}
        value_usd = value.get("value_usd", "") if value else ""

        def get_value_or_null(field):
            return field if field else "NULL"

        writer.writerow([
            company.get("id", ""),
            get_value_or_null(company.get("name", "")),
            get_value_or_null(', '.join(industries_values)),
            get_value_or_null(', '.join(investor_names)),
            get_value_or_null(value_usd),
            get_value_or_null(last_funding_type),
            get_value_or_null(company.get("founded_date", "")),
            get_value_or_null(company.get("num_employees", "")),
            get_value_or_null(company.get("website", "")),
            get_value_or_null(social_links_str),
            get_value_or_null(company.get("monthly_visits", "")),
            get_value_or_null(company.get("about", "")),
            get_value_or_null(company.get("address", "")),
            get_value_or_null(company.get("country_code", "")),
            get_value_or_null(company.get("cb_rank", "")),
            get_value_or_null(company.get("full_description", "")),
            get_value_or_null(company.get("image", "")),
        ])
