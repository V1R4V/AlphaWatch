import sys
import json
import sqlite3
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from transformers import BertTokenizer, BertModel
import torch
from langchain.agents import initialize_agent
from langchain_community.llms import Ollama
from langchain.tools import Tool

# Load pre-trained BERT model and tokenizer
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertModel.from_pretrained('bert-base-uncased')
model.eval()

# Initialize the Ollama LLM
llm = Ollama(model="deepseek-r1:1.5b")  # Replace with your preferred model

# Connect to the SQLite database
DATABASE_PATH = "Backend/companies.db"

@tool
def query_by_company_name(company_name: str) -> str:
    """
    Query the database to retrieve records based on the company name.

    Args:
        company_name (str): The name of the company to search for.

    Returns:
        str: A string representation of the matching records.
    """
    conn = sqlite3.connect(DATABASE_PATH)
    query = "SELECT * FROM companies WHERE company_name = ?"
    df = pd.read_sql_query(query, conn, params=(company_name,))
    conn.close()
    return df.to_string(index=False)

@tool
def query_by_industry(industry: str) -> str:
    """
    Query the database to retrieve records based on the industry.

    Args:
        industry (str): The industry to search for.

    Returns:
        str: A string representation of the matching records.
    """
    conn = sqlite3.connect(DATABASE_PATH)
    query = "SELECT * FROM companies WHERE industry = ?"
    df = pd.read_sql_query(query, conn, params=(industry,))
    conn.close()
    return df.to_string(index=False)

@tool
def semantic_search(user_input: str, top_k: int = 5) -> str:
    """
    Perform semantic search on the database using a user's text input.

    Args:
        user_input (str): The text input provided by the user.
        top_k (int, optional): The number of top results to return. Defaults to 5.

    Returns:
        str: A string representation of the top-k most similar records.
    """
    # Compute the embedding for the user input
    user_embedding = get_bert_embeddings([user_input], tokenizer, model)
    user_embedding = user_embedding.squeeze().numpy()

    # Fetch all embeddings from the database
    conn = sqlite3.connect(DATABASE_PATH)
    query = "SELECT id, company_name, industry, description, embedding FROM companies"
    df = pd.read_sql_query(query, conn)
    conn.close()

    # Deserialize the embeddings
    df['embedding'] = df['embedding'].apply(lambda x: np.array(json.loads(x)))

    # Compute cosine similarity
    similarities = cosine_similarity([user_embedding], df['embedding'].tolist())[0]
    df['similarity'] = similarities

    # Sort by similarity and return the top-k results
    df = df.sort_values(by='similarity', ascending=False).head(top_k)
    return df.to_string(index=False)

def get_bert_embeddings(texts, tokenizer, model, max_length=512):
    """
    Compute BERT embeddings for a list of text inputs.

    Args:
        texts (list of str): A list of text descriptions.
        tokenizer: The tokenizer for the BERT model.
        model: The BERT model.
        max_length (int, optional): The maximum length of the tokenized input. Defaults to 512.

    Returns:
        torch.Tensor: A tensor containing the embeddings for the input texts.
    """
    inputs = tokenizer(
        texts,
        padding=True,
        truncation=True,
        max_length=max_length,
        return_tensors='pt'
    )
    with torch.no_grad():
        outputs = model(**inputs)
    embeddings = outputs.last_hidden_state[:, 0, :].squeeze()
    return embeddings

# Define LangChain tools
tools = [
    Tool(
        name="Query by Company Name",
        func=query_by_company_name,
        description="Useful for querying the database by company name."
    ),
    Tool(
        name="Query by Industry",
        func=query_by_industry,
        description="Useful for querying the database by industry."
    ),
    Tool(
        name="Semantic Search",
        func=semantic_search,
        description="Useful for finding similar records based on a text description."
    )
]

# Initialize the LangChain agent
agent = initialize_agent(tools=tools, llm=llm, agent="zero-shot-react-description", verbose=True)

def main():
    """
    Main function to handle input from stdin and return the agent's response.
    """
    # Read input from stdin
    input_data = sys.stdin.read()
    data = json.loads(input_data)
    user_query = data.get('query')

    if not user_query:
        print(json.dumps({"error": "No query provided"}))
        return

    # Get the response from the agent
    response = agent.run(user_query)

    # Send the response back to the frontend
    print(json.dumps({"response": response}))

if __name__ == '__main__':
    main()