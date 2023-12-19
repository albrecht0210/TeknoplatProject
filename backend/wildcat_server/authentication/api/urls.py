from django.urls import path

from rest_framework_simplejwt import views as jwt_views

from .views import PublicKeyAPIView, WildcatTokenObtainPairView

app_name = 'authentication'

urlpatterns = [
    path('token/public-key/', PublicKeyAPIView.as_view(), name='public-key'),
    path('token/', WildcatTokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token-refresh'),
]