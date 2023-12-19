from .views import CreateMeetingView, ValidateMeetingView, VideoAuthenticateTokenView
from django.urls import path

urlpatterns = [
    path('video/create-meeting/', CreateMeetingView.as_view(), name='create-meeting'),
    path('video/validate-meeting/<str:video_meeting_id>/', ValidateMeetingView.as_view(), name='validate-meeting'),
    path('video/authenticate/', VideoAuthenticateTokenView.as_view(), name='authenticate'),
]