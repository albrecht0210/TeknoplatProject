# urls.py
from rest_framework import routers
from django.urls import path, include
from .views import ChatbotViewSet

router = routers.DefaultRouter()
router.register(r'chatbots', ChatbotViewSet, basename='chatbot')

urlpatterns = [
    path('', include(router.urls)),

    path('chatbots/<int:pk>/add_new_content/', ChatbotViewSet.as_view({'post': 'add_new_content'}), name='add-new-chat'),
]
