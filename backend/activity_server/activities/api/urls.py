from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ActivityViewSet

# Create a router for the ActivityViewSet
router = DefaultRouter()
router.register(r'activities', ActivityViewSet, basename='activity')

urlpatterns = [
    # Include the router's URL patterns
    path('', include(router.urls)),
]