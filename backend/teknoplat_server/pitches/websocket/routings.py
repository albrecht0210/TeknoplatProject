from django.urls import re_path

from .consumers import PitcConsumer

websocket_urlpatterns = [
    re_path(r"ws/pitches/(?P<meeting_room>\w+)/$", PitcConsumer.as_asgi()),
]