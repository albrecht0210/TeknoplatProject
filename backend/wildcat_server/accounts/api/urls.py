from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AccountViewSet, AccountProfileAPIView, AccountRegisterAPIView

app_name = 'accounts'

router = DefaultRouter()
router.register(r'accounts', AccountViewSet, basename='account')

urlpatterns = [
    path('', include(router.urls)),
    path('account/profile/', AccountProfileAPIView.as_view(), name='profile'),
    path('account/register/', AccountRegisterAPIView.as_view(), name='register'),
]