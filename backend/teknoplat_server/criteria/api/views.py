from rest_framework import permissions, viewsets
from ..models import Criteria
from .serializers import CriteriaSerializer
from teknoplat_server.permissions import IsStaffOrReadOnly

class CriteriaViewSet(viewsets.ModelViewSet):
    queryset = Criteria.objects.all()
    serializer_class = CriteriaSerializer
    permission_classes = (permissions.IsAuthenticated, IsStaffOrReadOnly, )
