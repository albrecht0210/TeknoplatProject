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

def validate_course(code, section, request):
    headers = get_auth_headers(request)
    response = requests.get(f'{os.environ.get('TEAM_BASE_URL')}/api/course/validate/?code={code}&section={section}', headers=headers)
    return response

def push_activity_to_teknoplat_meeting(data, request):
    headers = get_auth_headers(request)
    response = requests.post(f'{os.environ.get('TEKNOPLAT_BASE_URL')}/api/meeting/create/', data=data, headers=headers)
    return response