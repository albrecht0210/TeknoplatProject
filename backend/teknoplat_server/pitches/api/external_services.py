import os
import requests

from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(os.path.join(Path(BASE_DIR).parent, '.env.dev'))

def get_auth_headers(request):
    authorization_header = request.META.get('HTTP_AUTHORIZATION', None)
    _, token = authorization_header.split()
    return {'Authorization': f"Bearer {token}"}

def validate_team(name, request):
    headers = get_auth_headers(request)
    response = requests.get(f'{os.environ.get('TEAM_BASE_URL')}/api/team/validate/?name={name}', headers=headers)
    return response

def fetch_team(id, request):
    headers = get_auth_headers(request)
    response = requests.get(f'{os.environ.get('TEAM_BASE_URL')}/api/teams/{id}/', headers=headers)
    return response
