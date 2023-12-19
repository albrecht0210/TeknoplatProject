import requests
import json

def validate_token(base_url, data, request):
    headers = {'Content-Type': 'application/json'}
    response = requests.post(f'{base_url}/api/account/token/', data=json.dumps(data), headers=headers)
    return response