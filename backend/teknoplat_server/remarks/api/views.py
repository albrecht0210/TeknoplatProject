from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response

from ..models import Remark
from .serializers import RemarkSerializer

class RemarkViewSet(viewsets.ModelViewSet):
    queryset = Remark.objects.all()
    serializer_class = RemarkSerializer
    permission_classes = (permissions.IsAuthenticated, )

class AccountRemarkAPIView(generics.ListCreateAPIView):
    serializer_class = RemarkSerializer
    permission_classes = (permissions.IsAuthenticated, )

    def get_queryset(self):
        meeting_param = self.request.query_params.get('meeting', None)
        if meeting_param:
            try:
                queryset = Remark.objects.filter(account=self.request.user.id, meeting=meeting_param)
                return queryset
            except Remark.DoesNotExist:
                return Response({'error', 'Remark does not exists.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error', 'Add parameter meeting.'}, status=status.HTTP_400_BAD_REQUEST)
    
class MeetingRemarkAPIView(generics.ListAPIView):
    serializer_class = RemarkSerializer
    permission_classes = (permissions.IsAuthenticated, )

    def get_queryset(self):
        meeting_param = self.request.query_params.get('meeting', None)

        if meeting_param:
            try:
                queryset = Remark.objects.filter(meeting=meeting_param)
                
                return queryset
            except Remark.DoesNotExist:
                return Response({'error', 'Remark does not exists.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error', 'Add parameter meeting.'}, status=status.HTTP_400_BAD_REQUEST)