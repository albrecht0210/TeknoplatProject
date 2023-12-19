from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status, views, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from ..models import Course
from .serializers import CourseSerializer
from team_server.permissions import IsAdminOrReadOnly, IsStaffOrReadOnly
from accounts.api.serializers import AccountSerializer

Account = get_user_model()

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = (permissions.IsAuthenticated, IsAdminOrReadOnly, )

    @action(detail=True, methods=['post'])
    def add_course_member(self, request, pk=None):
        course = self.get_object()
        account_id = request.data.get('account')

        if course is None:
            return Response({'error': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)
        if account_id is None:
            return Response({'error': 'Account username is missing from the request data.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            account = get_object_or_404(Account, pk=account_id)
            course_members = course.members.all()
            list_account_courses = Course.objects.filter(code=course.code, name=course.name, members__in=[account]).exclude(pk=course.pk)

            if account.is_staff and course_members.filter(is_staff=True).exists():
                return Response({'error': 'A teacher is already a member of the course.'}, status=status.HTTP_400_BAD_REQUEST)

            if list_account_courses.exists() and not account.is_staff:
                return Response({'error': 'Account has already enrolled in a course with the same name.'}, status=status.HTTP_400_BAD_REQUEST)

            if account in course_members:
                return Response({'message': 'Member already added to the course.'}, status=status.HTTP_200_OK)

            course.members.add(account)
            course.save()

            return Response(AccountSerializer(account).data, status=status.HTTP_201_CREATED)
        except Account.DoesNotExist:
            return Response({"error": "Account not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": "An error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AccountCourseListAPIView(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = (permissions.IsAuthenticated, )

    def get_queryset(self):
        try:
            queryset = Course.objects.filter(members__in=[self.request.user.id])
            if not queryset.exists():
                raise Course.DoesNotExist
            return queryset
        except Course.DoesNotExist:
            return Response({'error', 'Course does not exists.'}, status=status.HTTP_404_NOT_FOUND)

class AccountCourseRetrieveAPIView(generics.RetrieveAPIView):
    serializer_class = CourseSerializer
    permission_classes = (permissions.IsAuthenticated, )

    def get_object(self):
        course = Course.objects.filter(members__in=[self.request.user.id])
        code_param = self.request.query_params.get("code")
        section_param = self.request.query_params.get("section")

        if code_param:
            course = course.filter(code=code_param)

        if section_param: 
            course = course.filter(section=section_param)

        return course.first()
    
class CourseValidateAPIView(views.APIView):
    permission_classes = (permissions.IsAuthenticated, IsStaffOrReadOnly, )

    def get(self, request, format=None):
        code_param = self.request.query_params.get("code")
        section_param = self.request.query_params.get("section")
        try:
            course = get_object_or_404(Course, code=code_param, section=section_param)
            return Response({ 'id': course.id }, status=status.HTTP_200_OK)
        except Course.DoesNotExist:
            return Response({'error': 'Course does not exists.'}, status=status.HTTP_404_NOT_FOUND)