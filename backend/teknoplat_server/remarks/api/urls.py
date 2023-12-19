from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import RemarkViewSet, AccountRemarkAPIView, MeetingRemarkAPIView

router = DefaultRouter()
router.register(r'remarks', RemarkViewSet, basename='remark')

urlpatterns = [
    path('', include(router.urls)),
    path('account/remarks/', AccountRemarkAPIView.as_view(), name='account-remarks'),
    path('meeting/remarks/', MeetingRemarkAPIView.as_view(), name='meeting-remarks'),
]
