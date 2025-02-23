import sys
import json
import sqlite3
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from transformers import BertTokenizer, BertModel
import torch
from langchain.agents import Tool
from langchain_ollama import ChatOllama
from langgraph.prebuilt import create_react_agent
from langchain_core.tools import tool
from langchain_core.messages import HumanMessage

# Load pre-trained BERT model and tokenizer
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertModel.from_pretrained('bert-base-uncased')
model.eval()

# Connect to the SQLite database
DATABASE_PATH = "Backend/companies.db"

def query_by_company_name(company_name: str) -> str:
    """Query database by company name"""
    conn = sqlite3.connect(DATABASE_PATH)
    df = pd.read_sql_query("SELECT * FROM companies WHERE company_name = ?", 
                          conn, params=(company_name,))
    conn.close()
    return df.to_string(index=False)

def query_by_industry(industry: str) -> str:
    """Query database by industry"""
    conn = sqlite3.connect(DATABASE_PATH)
    df = pd.read_sql_query("SELECT * FROM companies WHERE industry = ?",
                          conn, params=(industry,))
    conn.close()
    return df.to_string(index=False)

def semantic_search(user_input: str, top_k: int = 5) -> str:
    """Perform semantic search using BERT embeddings"""
    # Compute embedding
    user_embedding = get_bert_embeddings([user_input], tokenizer, bert_model)
    user_embedding = user_embedding.squeeze().numpy()

    # Get database entries
    conn = sqlite3.connect(DATABASE_PATH)
    df = pd.read_sql_query("SELECT id, company_name, industry, description, embedding FROM companies", conn)
    conn.close()

    # Process embeddings
    df['embedding'] = df['embedding'].apply(lambda x: np.array(json.loads(x)))
    similarities = cosine_similarity([user_embedding], df['embedding'].tolist())[0]
    df['similarity'] = similarities
    return df.sort_values(by='similarity', ascending=False).head(top_k).to_string(index=False)

def get_bert_embeddings(texts, tokenizer, model, max_length=512):
    """Generate BERT embeddings"""
    inputs = tokenizer(texts, padding=True, truncation=True, max_length=max_length, return_tensors='pt')
    with torch.no_grad():
        outputs = model(**inputs)
    return outputs.last_hidden_state[:, 0, :].squeeze()


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

# Initialize the Ollama LLM
llm = ChatOllama(model="llama3.1:8b").bind_tools(tools)

# Initialize the agent
agent = create_react_agent(llm, tools=tools)

def main():
    """
    Main function to handle input from stdin and return the agent's response.
    """
    # Read input from stdin
    input_data = sys.stdin.read()
    data = json.loads(input_data)
    user_query = data.get('query')

    # Check if query is provided
    if not user_query:
        print(json.dumps({"error": "No query provided"}))
        return

    # Invoke the agent with the correct state format
    state = agent.invoke({"messages": [HumanMessage(content=user_query)]})

    # Extract the final response from the state
    final_messages = state.get("messages", [])
    if final_messages:
        final_response = final_messages[-1].content
    else:
        final_response = "No response generated"

    # Send the response back to the frontend
    print(json.dumps({"response": final_response}))

if __name__ == '__main__':
    main()