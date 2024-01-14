import os

from openai import OpenAI
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(os.path.join(Path(BASE_DIR).parent, '.env.dev'))

def create_completions(prompt):
    complete_prompt = f'Please provide a concise summary of the remarks. Highlight key strengths and areas for improvement mentioned by each evaluator. Provide it into a single paragraph.{prompt}'
    client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{
            'role': 'user', 'content': complete_prompt
        }],
        temperature=0
    )

    return response