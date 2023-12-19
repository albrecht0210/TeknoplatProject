from django.urls import re_path

from .consumers import CommentConsumer

websocket_urlpatterns = [
    re_path(r"ws/comments/(?P<meeting_room>\w+)/$", CommentConsumer.as_asgi()),
]