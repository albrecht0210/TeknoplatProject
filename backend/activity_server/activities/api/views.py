import json

from django.contrib.auth import get_user_model

from rest_framework import permissions, status, viewsets
from rest_framework.response import Response

from ..models import Activity
from .serializers import ActivitySerializer
from activity_server.permissions import IsStaffOrReadOnly
from .external_services import validate_course, push_activity_to_teknoplat_meeting

Account = get_user_model()

class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = (permissions.IsAuthenticated, IsStaffOrReadOnly, )
    
    def create(self, request, *args, **kwargs):
        course_code = request.data.pop('course_code')
        course_section = request.data.pop('course_section')
        
        course = validate_course(code=course_code, section=course_section, request=self.request)

        course_response = json.loads(course.content.decode('utf-8'))

        if course.status_code == 404:
            return Response(course_response, status=status.HTTP_404_NOT_FOUND)
        elif course.status_code == 500:
            return Response({'error': 'Team Management Server is down.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if request.data.get('service') == 'teknoplat':
            meeting_data = {
                'name': request.data.get('name'),
                'description': request.data.get('description'),
                'course': course_response['id'],
                'status':  request.data.get('status'),
                'owner': request.data.get('owner')
            }

            meeting = push_activity_to_teknoplat_meeting(data=meeting_data, request=self.request)

            meeting_response = json.loads(meeting.content.decode('utf-8'))

            if meeting.status_code == 400:
                return Response(meeting_response, status=status.HTTP_400_BAD_REQUEST)
            elif meeting.status_code == 500:
                return Response({'error': 'Teknoplat Server is down.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        request.data['course'] = course_response['id']

        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
