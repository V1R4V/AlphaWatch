import sqlite3
import pandas as pd

# Connect to the SQLite database
conn = sqlite3.connect('Backend/companies.db')

# Query the table containing text descriptions
query = "SELECT id, about FROM companies"  # Adjust the query as needed
df = pd.read_sql_query(query, conn)

# Close the connection
conn.close()

# Extract descriptions and IDs
descriptions = df['about'].tolist()
ids = df['id'].tolist()  # Assuming you have an ID column for reference

from transformers import BertTokenizer, BertModel
import torch

# Load pre-trained BERT model and tokenizer
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertModel.from_pretrained('bert-base-uncased')

# Ensure the model is in evaluation mode
model.eval()

# Function to compute BERT embeddings for a batch of texts
def get_bert_embeddings(texts, tokenizer, model, max_length=512):
    # Tokenize the input texts
    inputs = tokenizer(
        texts,
        padding=True,
        truncation=True,
        max_length=max_length,
        return_tensors='pt'
    )

    # Get the embeddings from BERT
    with torch.no_grad():
        outputs = model(**inputs)

    # Use the [CLS] token embeddings as the sentence embedding
    embeddings = outputs.last_hidden_state[:, 0, :].squeeze()

    return embeddings

# Compute embeddings for all descriptions
description_embeddings = get_bert_embeddings(descriptions, tokenizer, model)

# Convert embeddings to a list of lists (for easier storage in SQLite)
embeddings_list = description_embeddings.tolist()

print(embeddings_list)

# Create a DataFrame with IDs and embeddings
embeddings_df = pd.DataFrame({
    'id': ids,
    'embedding': embeddings_list
})

import json

# Convert embeddings to a list of lists (for easier storage in SQLite)
embeddings_list = description_embeddings.tolist()

# Serialize embeddings to JSON strings
serialized_embeddings = [json.dumps(embedding) for embedding in embeddings_list]

# Connect to the SQLite database
conn = sqlite3.connect('Backend/companies.db')
cursor = conn.cursor()

# Update the table with embeddings
for id, embedding in zip(ids, serialized_embeddings):
    cursor.execute('''
    UPDATE companies
    SET embedding = ?
    WHERE id = ?
    ''', (embedding, id))

# Commit changes and close the connection
conn.commit()
conn.close()

# check embeddings

# Connect to the SQLite database
conn = sqlite3.connect('Backend/companies.db')

# Query the embeddings table
query = "SELECT * FROM companies"
embeddings_df = pd.read_sql_query(query, conn)

# Close the connection
conn.close()

# Display the embeddings
print(embeddings_df.head())
