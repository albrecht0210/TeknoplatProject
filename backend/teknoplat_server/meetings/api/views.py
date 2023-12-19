from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response

from ..models import Meeting, MeetingCriteria
from .serializers import CreateMeetingSerializer, MeetingSerializer, MeetingCriteriaSerializer

from pitches.models import Pitch
from pitches.api.serializers import PitchSerializer

from criteria.models import Criteria

from comments.api.serializers import CommentSerializer

from teknoplat_server.permissions import IsStaffOrReadOnly

class MeetingCreateAPIView(generics.CreateAPIView):
    serializer_class = CreateMeetingSerializer
    permission_classes = (permissions.IsAuthenticated, IsStaffOrReadOnly, )

class MeetingViewSet(viewsets.ModelViewSet):
    queryset = Meeting.objects.all()
    pagination_class = LimitOffsetPagination
    serializer_class = MeetingSerializer
    permission_classes = (permissions.IsAuthenticated, IsStaffOrReadOnly, )

    def get_queryset(self):
        queryset = self.queryset
        status_param = self.request.query_params.get('status', None)
        course_param = self.request.query_params.get('course', None)

        if course_param:
            queryset = queryset.filter(course=course_param)

        if status_param:
            queryset = queryset.filter(status=status_param)

        return queryset
    
    @action(detail=True, methods=['post'])
    def add_meeting_presentor(self, request, pk=None):
        meeting = self.get_object()
        pitch_id = request.data.get('pitch')

        if meeting is None:
            return Response({'error': 'Meeting not found.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            pitch = Pitch.objects.get(id=pitch_id)
            if pitch in meeting.presentors.all():
                return Response({'error': 'Presentor is already added to the meeting'}, status=status.HTTP_400_BAD_REQUEST)
            
            meeting.presentors.add(pitch)
            meeting.save()

            return Response(PitchSerializer(pitch).data, status=status.HTTP_201_CREATED)
        except Pitch.DoesNotExist:
            return Response({'error': 'Pitch not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['get'])
    def get_meeting_presentors(self, request, pk=None):
        meeting = self.get_object()
        
        if meeting is None:
            return Response({'error': 'Meeting not found.'}, status=status.HTTP_404_NOT_FOUND)

        presentors = meeting.presentors.all()

        if not presentors.exists():
            return Response([], status=status.HTTP_200_OK)

        serializer = PitchSerializer(presentors, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def add_meeting_criteria(self, request, pk=None):
        meeting = self.get_object()  # Get the Meeting instance
        criteria_id = request.data.get('criteria')
        weight = request.data.get('weight')

        if meeting is None:
            return Response({'error': 'Meeting not found.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            criteria = Criteria.objects.get(id=criteria_id)

            existing_criteria = MeetingCriteria.objects.filter(meeting=meeting, criteria=criteria.pk)

            if existing_criteria.exists():
                return Response({'error': 'Criteria is already added to the meeting'}, status=status.HTTP_400_BAD_REQUEST)
            
            meeting_criteria = MeetingCriteria.objects.create(meeting=meeting, criteria=criteria, weight=weight)

            meeting.criterias.add(meeting_criteria)
            meeting.save()

            return Response(MeetingCriteriaSerializer(meeting_criteria).data, status=status.HTTP_201_CREATED)
        except Criteria.DoesNotExist:
            return Response({'error': 'Criteria not found'}, status=status.HTTP_404_NOT_FOUND)
        
    @action(detail=True, methods=['get'])
    def get_meeting_criteria(self, request, pk=None):
        meeting = self.get_object()
        
        if meeting is None:
            return Response({'error': 'Meeting not found.'}, status=status.HTTP_404_NOT_FOUND)

        criterias = meeting.criterias.all()

        if not criterias.exists():
            return Response([], status=status.HTTP_200_OK)

        serializer = MeetingCriteriaSerializer(criterias, many=True) 

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def add_meeting_comment(self, request, pk=None):
        meeting = self.get_object()  # Get the Meeting instance

        if meeting is None:
            return Response({'error': 'Meeting not found.'}, status=status.HTTP_404_NOT_FOUND)

        comment_serializer = CommentSerializer(data=request.data)

        if comment_serializer.is_valid(): 
            comment_serializer.save()
            return Response(comment_serializer.data, status=status.HTTP_201_CREATED)
        return Response(comment_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def get_meeting_comments(self, request, pk=None):
        meeting = self.get_object()
        
        if meeting is None:
            return Response({'error': 'Meeting not found.'}, status=status.HTTP_404_NOT_FOUND)

        comments = meeting.comments.all()

        if not comments.exists():
            return Response([], status=status.HTTP_200_OK)

        serializer = CommentSerializer(comments, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    