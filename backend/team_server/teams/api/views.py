from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status, views, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from ..models import Team
from .serializers import TeamSerializer
from team_server.permissions import IsStaffOrReadOnly
from courses.models import Course
from accounts.api.serializers import AccountSerializer

Account = get_user_model()

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = (permissions.IsAuthenticated, IsStaffOrReadOnly, )

    def get_queryset(self):
        queryset = self.queryset
        course_param = self.request.query_params.get('course', None)

        if course_param:
            queryset = queryset.filter(course=course_param)

        return queryset

    @action(detail=True, methods=['post'])
    def add_team_member(self, request, pk=None):
        team = self.get_object()
        account_id = request.data.get('account')

        if team is None:
            return Response({'error': 'Team not found.'}, status=status.HTTP_404_NOT_FOUND)

        if account_id is None:
            return Response({'error': 'Account username is missing from the request data.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Get Account
            account = get_object_or_404(Account, pk=account_id)
            # Get all members in team
            team_members = team.members.all()

            if len(team_members) == 3:
                return Response({'error': 'Team is full.'}, status=status.HTTP_400_BAD_REQUEST)
                
            # Get Account Course
            member_in_course = get_object_or_404(Course, pk=team.course.pk, members__in=[account])
            # List all Team instances where account is a member
            list_account_team = Team.objects.filter(course=member_in_course, members__in=[account]).exclude(pk=team.pk)

            if list_account_team.exists():
                return Response({'error': 'Account is a member of other teams.'}, status=status.HTTP_400_BAD_REQUEST)

            if account in team_members:
                return Response({'message': 'Member already added to the team.'}, status=status.HTTP_200_OK)

            team.members.add(account)
            team.save()

            return Response(AccountSerializer(account).data, status=status.HTTP_201_CREATED)
        except Account.DoesNotExist:
            return Response({'error': 'Account not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Course.DoesNotExist:
            return Response({'error': 'Account is not a member of the course.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': 'An error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class AccountTeamAPIView(generics.ListAPIView):
    serializer_class = TeamSerializer
    permission_classes = (permissions.IsAuthenticated, )

    def get_queryset(self):
        try:
            queryset = Team.objects.filter(members__in=[self.request.user])

            if not queryset.exists():
                raise Team.DoesNotExist
            return queryset
        except Team.DoesNotExist:
            return Response({'error', 'User does not have a team.'}, status=status.HTTP_404_NOT_FOUND)
        
class TeamValidateAPIView(views.APIView):
    permission_classes = (permissions.IsAuthenticated, IsStaffOrReadOnly, )

    def get(self, request, format=None):
        name_param = self.request.query_params.get("name")

        try:
            team = get_object_or_404(Team, name=name_param)
            return Response({ 'id': team.id }, status=status.HTTP_200_OK)
        except Course.DoesNotExist:
            return Response({'error': 'Team does not exists.'}, status=status.HTTP_404_NOT_FOUND)