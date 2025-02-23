import sys
import json
from langchain.agents import initialize_agent
from langchain_community.llms import Ollama
from langchain.tools import Tool
import pandas as pd

# Load the CSV file
csv_file_path = "data.csv"
df = pd.read_csv(csv_file_path)

# Initialize the Ollama LLM
llm = Ollama(model="deepseek-r1:1.5b")  # Replace with your preferred model

# Define the CSV query tool
@tool
def query_csv(query: str) -> str:
    try:
        if "Python" in query:
            result = df[df["Skill"] == "Python"]
        elif "JavaScript" in query:
            result = df[df["Skill"] == "JavaScript"]
        elif "Machine Learning" in query:
            result = df[df["Skill"] == "Machine Learning"]
        elif "Data Science" in query:
            result = df[df["Skill"] == "Data Science"]
        else:
            result = "No matching data found."
        return result.to_string(index=False)
    except Exception as e:
        return f"Error: {e}"

# Initialize the agent
tools = [Tool(name="Query CSV", func=query_csv, description="Useful for querying a CSV file.")]
agent = initialize_agent(tools=tools, llm=llm, agent="zero-shot-react-description", verbose=True)

def main():
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