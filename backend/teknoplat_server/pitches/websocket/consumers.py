import json

from channels.generic.websocket import AsyncWebsocketConsumer

class PitcConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['meeting_room']
        self.room_group_name = f'pitch_{self.room_name}'

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        pitch = text_data_json['pitch']
        await self.channel_layer.group_send(
            self.room_group_name, {'type': 'pitch.open.rate.message', 'pitch': pitch}
        )
    
    async def pitch_open_rate_message(self, event):
        pitchID = event['pitch']
        await self.send(text_data=json.dumps({'pitch': pitchID}))