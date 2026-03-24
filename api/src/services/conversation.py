import os
from dotenv import load_dotenv
from langfuse.openai import openai
from langfuse import observe

load_dotenv()

model = os.getenv("OPENAI_MODEL", "gpt-5-nano")


@observe()
def execute_ia_query(question):
    response = openai.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": "You are an expert programming assistant."},
            {"role": "user", "content": question},
        ],
    )
    return response.choices[0].message.content
