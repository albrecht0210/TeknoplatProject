from django.urls import path
from .views import AccountProfileAPIView, AccountTokenAPIView

urlpatterns = [
    path('account/profile/', AccountProfileAPIView.as_view(), name='account-profile'),
    path('account/token/', AccountTokenAPIView.as_view(), name='account-verify-token')
]