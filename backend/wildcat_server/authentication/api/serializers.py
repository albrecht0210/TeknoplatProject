from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from services.models import Service

class WildcatTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        user_payload = {
            'first_name': user.first_name,
            'last_name': user.last_name,
            'username': user.username,
            'email': user.email,
            'role': user.get_role().lower()
        }

        token['aud'] = [service.identifier for service in Service.objects.all()]
        token['account'] = user_payload

        return token