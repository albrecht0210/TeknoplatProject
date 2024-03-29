import os

from openai import OpenAI
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(os.path.join(Path(BASE_DIR).parent, '.env.dev'))

def create_summary(prompt):
    client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))
    response = client.completions.create(model="gpt-3.5-turbo-instruct", prompt=prompt)

    return response