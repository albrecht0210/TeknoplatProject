import re
from rest_framework import permissions, viewsets
from ..models import Comment
from .serializers import CommentSerializer

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = (permissions.IsAuthenticated, )

    def get_queryset(self):
        queryset = self.queryset
        meeting_param = self.request.query_params.get('meeting', None)

        if meeting_param:
            queryset = queryset.filter(meeting=meeting_param)

        return queryset