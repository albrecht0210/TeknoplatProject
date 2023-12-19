from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeamViewSet, AccountTeamAPIView, TeamValidateAPIView

# Create a router for the CourseViewSet
router = DefaultRouter()
router.register(r'teams', TeamViewSet, basename='team')

urlpatterns = [
    # Include the router's URL patterns
    path('', include(router.urls)),
    
    path('teams/<int:pk>/add_team_member/', TeamViewSet.as_view({'post': 'add_team_member'}), name='add-team-member'),
    
    path('account/profile/teams/', AccountTeamAPIView.as_view(), name='teams-by-account'),
    
    path('team/validate/', TeamValidateAPIView.as_view(), name='team-validate'),
]