import json

from django.conf import settings

from rest_framework import status, views
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import WildcatTokenObtainPairSerializer
from .external_services import validate_token
from services.models import Service

PUBLIC_KEY = open(settings.JWT_PUBLIC_KEY_PATH).read()

# Create your views here.
class PublicKeyAPIView(views.APIView):
    def get(self, request):
        return Response({'public_key': PUBLIC_KEY})
    
class WildcatTokenObtainPairView(TokenObtainPairView):
    serializer_class = WildcatTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            service_token_param = self.request.query_params.get('service')
            access_token = response.data.get('access')

            if service_token_param:
                try:
                    service = Service.objects.get(token=service_token_param)
                    validate = validate_token(base_url=service.base_url, data={'access': access_token}, request=self.request)

                    validate_response = json.loads(validate.content.decode('utf-8'))

                    if validate.status_code == 400:
                        return Response({'from': f'{service.name}', 'error': f'{validate_response['detail']}'}, status=status.HTTP_400_BAD_REQUEST)
                    elif validate.status_code == 500:
                        return Response({'error': f'{service.name} is down.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                except Service.DoesNotExist:
                    return Response({'error': 'Service not found.'}, status=status.HTTP_404_NOT_FOUND)
                
            return response