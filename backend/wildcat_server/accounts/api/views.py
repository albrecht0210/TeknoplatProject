from rest_framework import generics, permissions, viewsets
from ..models import Account
from .serializers import AccountSerializer
from wildcat_server.permissions import IsAdminOrReadOnly, IsOwner

class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = (permissions.IsAuthenticated, IsAdminOrReadOnly, )
    
class AccountRegisterAPIView(generics.CreateAPIView):
    serializer_class = AccountSerializer

class AccountProfileAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = (permissions.IsAuthenticated, IsOwner, )

    def get_object(self):
        return self.request.user