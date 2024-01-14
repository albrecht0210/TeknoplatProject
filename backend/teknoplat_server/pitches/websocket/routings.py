from django.urls import re_path

from .consumers import PitcConsumer

websocket_urlpatterns = [
    re_path(r"ws/pitches/(?P<meeting_room>[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/$", PitcConsumer.as_asgi()),
]