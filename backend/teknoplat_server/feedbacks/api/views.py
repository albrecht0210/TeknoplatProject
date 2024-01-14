from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from ..models import Feedback
from .serializers import FeedbackSerializer
from teknoplat_server.permissions import IsStaffOrReadOnly
from remarks.models import Remark
from remarks.api.serializers import RemarkSerializer
from .external_services import create_completions

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

    def create(self, request, *args, **kwargs):
        meeting = request.data.get('meeting')
        pitch = request.data.get('pitch')
        
        if not meeting:
            return Response({'meeting': 'This is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if not pitch:
            return Response({'pitch': 'This is required.'}, status=status.HTTP_400_BAD_REQUEST)

        remarks = RemarkSerializer(instance=Remark.objects.filter(meeting=meeting, pitch=pitch), many=True).data
        prompt = ""
        for remark in remarks:
            for key, value in remark.items():
                if (key == 'remark'):
                    prompt = prompt + '\n\n' + value
                    break

        openai_response = create_completions(prompt=prompt)
        feedback_data = {
            'pitch': pitch,
            'meeting': meeting,
            'feedback': openai_response.choices[0].message.content
        }
            
        feedback_serializer = FeedbackSerializer(data=feedback_data)
        if feedback_serializer.is_valid():
            feedback_serializer.save()
            return Response(feedback_serializer.data, status=status.HTTP_201_CREATED)
        return Response(feedback_serializer.error_messages, status=status.HTTP_400_BAD_REQUEST)
        # return Response({'prompt': prompt}, status=status.HTTP_400_BAD_REQUEST)


