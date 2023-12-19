from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import AccessToken

from ..models import Account
from .serializers import AccountSerializer

from team_server.permissions import IsOwner

class AccountProfileAPIView(generics.RetrieveUpdateAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = (permissions.IsAuthenticated, IsOwner, )

    def get_object(self):
        return self.request.user

class AccountTokenAPIView(views.APIView):
    def post(self, request):
        access_token_string = request.data.get('access')
        try:
            access_token = AccessToken(access_token_string)
            decoded_payload = access_token.payload

            account_id_payload = decoded_payload['user_id']
            account_payload = decoded_payload['account']

            try:
                account = Account.objects.get(id=account_id_payload)
                return Response({'message': 'Account retrieved successfully.'}, status=status.HTTP_200_OK)
            except Account.DoesNotExist:
                account = Account(
                    id=account_id_payload,
                    first_name=account_payload['first_name'],
                    last_name=account_payload['last_name'],
                    email=account_payload['email'],
                    username=account_payload['username'],
                    is_superuser=True if account_payload['role'] == 'admin' else False,
                    is_staff=True if account_payload['role'] == 'admin' or account_payload['role'] == 'teacher' else False,
                    is_active=True
                )
                account.save()
                return Response({'message': 'Account created successfully.'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': 'Invalid access token.'}, status=status.HTTP_400_BAD_REQUEST)
        