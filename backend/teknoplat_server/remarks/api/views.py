from rest_framework import generics, permissions, status, views, viewsets
from rest_framework.response import Response

from ..models import Remark
from .serializers import RemarkSerializer
from .external_services import create_summary

from feedbacks.api.serializers import FeedbackSerializer

class RemarkViewSet(viewsets.ModelViewSet):
    queryset = Remark.objects.all()
    serializer_class = RemarkSerializer
    permission_classes = (permissions.IsAuthenticated, )

class AccountRemarkAPIView(generics.ListCreateAPIView):
    serializer_class = RemarkSerializer
    permission_classes = (permissions.IsAuthenticated, )

    def get_queryset(self):
        meeting_param = self.request.query_params.get('meeting', None)
        pitch_param = self.request.query_params.get('pitch', None)

        if meeting_param:
            try:
                queryset = Remark.objects.filter(account=self.request.user.id, meeting=meeting_param)
                if pitch_param:
                    queryset = queryset.filter(pitch=pitch_param)
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
    
class RemarkSummaryAPIView(views.APIView):
    def post(self, request):
        meeting_param = self.request.query_params.get('meeting', None)
        pitch_param = self.request.query_params.get('pitch', None)

        if meeting_param and pitch_param:
            base_prompt = 'Please provide a concise summary of the remarks. Highlight key strengths and areas for improvement mentioned by each evaluator. Provide it into a single paragraph.'
            try:
                remarks = Remark.objects.filter(meeting=meeting_param, pitch=pitch_param)
                if not remarks.exists():
                    raise Remark.DoesNotExist
                remarks_data = [f'\n\n{remark.remark}' for remark in remarks]
                prompt = base_prompt + remarks_data
                openai_response = create_summary(prompt=prompt)
                feedback_new_data = {
                    'pitch': pitch_param,
                    'meeting': meeting_param,
                    'feedback': openai_response.choices[0].text
                }
                feedback_serializer = FeedbackSerializer(data=feedback_new_data)
                if feedback_serializer.is_valid():
                    feedback_serializer.save()
                return Response({'message': 'Remark summarization done.', 'success': True}, status=status.HTTP_201_CREATED)
            except Remark.DoesNotExist:
                return Response({'error': 'No remarks for this selected pitch in this specific meeting.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Required parameters \'meeting\' and \'pitch\'.'}, status=status.HTTP_400_BAD_REQUEST)

