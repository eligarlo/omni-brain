import os
from dotenv import load_dotenv
from langfuse.openai import openai
from langfuse import observe

load_dotenv()

model = os.getenv("OPENAI_MODEL", "gpt-5-nano")

# The @observe() decorator automatically creates traces
@observe()
def execute_ia_query(question):
    response = openai.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": "You are an expert programming assistant."},
            {"role": "user", "content": question}
        ]
    )
    return response.choices[0].message.content

print(f"📡 Calling OpenAI with model: {os.getenv('OPENAI_MODEL')}...")

try:
    resultado = execute_ia_query("Briefly explain what a trace is in LLM observability.")
    print(f"\n✨ IA Response:\n{resultado}")
    
    # Aseguramos el envío a Langfuse antes de cerrar
    from langfuse import Langfuse
    Langfuse().flush()
    print("\n✅ Trace sent to Langfuse successfully.")

except Exception as e:
    print(f"❌ Error: {e}")