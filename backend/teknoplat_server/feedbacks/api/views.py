from rest_framework import permissions, viewsets
from ..models import Feedback
from .serializers import FeedbackSerializer
from teknoplat_server.permissions import IsStaffOrReadOnly

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = (permissions.IsAuthenticated, IsStaffOrReadOnly, )
    
    def get_queryset(self):
        queryset = self.queryset
        meeting_param = self.request.query_params.get('meeting', None)

        if meeting_param:
            queryset = queryset.filter(meeting=meeting_param)
        
        return queryset

