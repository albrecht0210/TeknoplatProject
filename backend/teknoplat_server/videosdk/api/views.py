import datetime, os, requests, jwt
from rest_framework import permissions, status, views
from rest_framework.response import Response

from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(os.path.join(Path(BASE_DIR).parent, '.env.dev'))

VIDEOSDK_API_ENDPOINT=os.environ.get('VIDEOSDK_API_ENDPOINT')

class CreateMeetingView(views.APIView):
    def post(self, request, *args, **kwargs):
        data = request.data
        res = requests.post(f'{VIDEOSDK_API_ENDPOINT}/api/meetings',
                            headers={'Authorization': data['token']})
        return Response(res.json(), status=res.status_code)

class ValidateMeetingView(views.APIView):
    def post(self, request, video_meeting_id, *args, **kwargs):
        data = request.data
        res = requests.post(f'{VIDEOSDK_API_ENDPOINT}/api/meetings/{video_meeting_id}',
                            headers={'Authorization': data['token']})
        if res.status_code == 400:
            return Response({ 'error': 'Video ID is not valid.' }, status=res.status_code)
        return Response(res.json(), status=res.status_code)    

class VideoAuthenticateTokenView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)
    VIDEOSDK_API_KEY  = os.environ.get('VIDEOSDK_API_KEY')
    VIDEOSDK_SECRET_KEY = os.environ.get('VIDEOSDK_SECRET_KEY')
    
    def post(self, request, *args, **kwargs):
        expiration_in_seconds = 600
        expiration = datetime.datetime.now() + datetime.timedelta(seconds=expiration_in_seconds)
        token = jwt.encode(payload={
            'exp': expiration,
            'apikey': self.VIDEOSDK_API_KEY,
            'permissions': ['allow_join', 'allow_mod'],
        }, key=self.VIDEOSDK_SECRET_KEY, algorithm="HS256")

        return Response(token, status=status.HTTP_200_OK)