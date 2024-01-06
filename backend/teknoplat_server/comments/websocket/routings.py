from django.urls import re_path

from .consumers import CommentConsumer

websocket_urlpatterns = [
    re_path(r"ws/comments/(?P<meeting_room>[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/$", CommentConsumer.as_asgi()),
]