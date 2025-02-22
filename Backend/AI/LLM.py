from dotenv import load_dotenv
import os

load_dotenv()

OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "deepseek-r1:1.5b")

from ollama import chat

class LlamaChat:
  def get_response(self, messages):
    response = chat(
        model=OLLAMA_MODEL,
        messages=messages,
    )
    return response.message.content

def main():
    # Read input from stdin
    input_data = sys.stdin.read()
    data = json.loads(input_data)
    user_message = data.get('message')

    if not user_message:
        print(json.dumps({"error": "No message provided"}))
        return

    # Create the messages list
    messages = [{"role": "user", "content": user_message}]

    # Get the response from LlamaChat
    llama_chat = LlamaChat()
    response = llama_chat.get_response(messages)

    # Send the response back to the frontend
    print(json.dumps({"response": response}))

if __name__ == '__main__':
    main()
