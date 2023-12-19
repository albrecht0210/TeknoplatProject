from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ServiceViewSet

app_name = 'services'

router = DefaultRouter()
router.register(r'services', ServiceViewSet, basename='service')

urlpatterns = [
    path('', include(router.urls)),
]
