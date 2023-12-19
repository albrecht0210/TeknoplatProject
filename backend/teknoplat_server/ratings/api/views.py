from rest_framework import views, generics, permissions, status, viewsets
from rest_framework.response import Response

from ..models import Rating
from .serializers import RatingSerializer

from meetings.models import Meeting

from pitches.api.serializers import PitchSerializer
from accounts.api.serializers import AccountSerializer

class RatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = (permissions.IsAuthenticated, )

class AccountRatingAPIView(generics.ListCreateAPIView):
    serializer_class = RatingSerializer
    permission_classes = (permissions.IsAuthenticated, )

    def get_queryset(self):
        meeting_param = self.request.query_params.get('meeting', None)
        if meeting_param:
            try:
                queryset = Rating.objects.filter(account=self.request.user.id, meeting=meeting_param)
                return queryset
            except Rating.DoesNotExist:
                return Response({'error', 'Rating does not exists.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error', 'Add parameter meeting.'}, status=status.HTTP_400_BAD_REQUEST)

class MeetingRatingOverallAPIView(views.APIView):
    permission_classes = (permissions.IsAuthenticated, )

    def get(self, request, format=None):
        meeting_param = self.request.query_params.get('meeting', None)

        if not meeting_param:
            return Response({'error': 'Add parameter meeting.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            meeting = Meeting.objects.get(id=meeting_param)
        except Meeting.DoesNotExist:
            return Response({'error': 'Meeting does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        
        pitches = meeting.presentors.all()

        response_data = []

        for pitch in pitches:
            pitch_data = PitchSerializer(pitch).data
            ratings = Rating.objects.filter(pitch=pitch_data['id'], meeting=meeting_param)

            if not ratings.exists():
                continue

            current_account = ratings[0].account
            account = AccountSerializer(current_account).data
            total_score = 0
            overall = 0
            data = []
            criteria = []

            for rating in ratings:
                meeting_criteria = meeting.criterias.all().filter(criteria=rating.criteria)

                if current_account != rating.account:
                    data.append({'account': account, 'criteria': criteria, 'total': total_score})

                    role_weight_score = (
                        meeting.teacher_weight_score if account['role'] in ['Teacher', 'Admin'] else meeting.student_weight_score
                    )

                    overall += total_score * role_weight_score
                    total_score = 0
                    current_account = rating.account
                    account = AccountSerializer(current_account).data
                    criteria = []

                criteria.append({'name': rating.criteria.name, 'value': rating.rating})
                total_score += rating.rating * meeting_criteria.weight

            data.append({'account': account, 'criteria': criteria, 'total': total_score})
            pitch_data['ratings'] = data
            pitch_data['overall'] = overall
            response_data.append(pitch_data)

        return Response(response_data, status=status.HTTP_200_OK)
    