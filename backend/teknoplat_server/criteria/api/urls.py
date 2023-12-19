from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import CriteriaViewSet

router = DefaultRouter()
router.register(r'criteria', CriteriaViewSet, basename='criteria')

urlpatterns = [
    path('', include(router.urls)),
]