from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MeetingCreateAPIView, MeetingViewSet

router = DefaultRouter()
router.register(r'meetings', MeetingViewSet, basename='meeting')

urlpatterns = [
    path('', include(router.urls)),

    path('meetings/<int:pk>/add_meeting_presentor/', MeetingViewSet.as_view({'post': 'add_meeting_presentor'}), name='add-meeting-presentor'),
    path('meetings/<int:pk>/get_meeting_presentors/', MeetingViewSet.as_view({'get': 'get_meeting_presentors'}), name='get-meeting-presentors'),

    path('meetings/<int:pk>/add_meeting_criteria/', MeetingViewSet.as_view({'post': 'add_meeting_criteria'}), name='add-meeting-criteria'),
    path('meetings/<int:pk>/get_meeting_criteria/', MeetingViewSet.as_view({'get': 'get_meeting_criteria'}), name='get-meeting-criterias'),

    path('meetings/<int:pk>/add_meeting_comment/', MeetingViewSet.as_view({'post': 'add_meeting_comment'}), name='add-meeting-comment'),
    path('meetings/<int:pk>/get_meeting_comments/', MeetingViewSet.as_view({'get': 'get_meeting_comments'}), name='get-meeting-comments'),

    path('meeting/create/', MeetingCreateAPIView.as_view(), name='meeting-create'),
]
