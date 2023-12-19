import json

from channels.generic.websocket import AsyncWebsocketConsumer

class MeetingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['course_room']
        self.room_group_name = f'meeting_{self.room_name}'

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action = text_data_json.get('action')
        meeting = text_data_json['meeting']

        if action == 'start_meeting':
            await self.channel_layer.group_send(
                self.room_group_name, {'type': 'start.meeting.message', 'meeting': meeting}
            )
        elif action == 'new_meeting':
            await self.channel_layer.group_send(
                self.room_group_name, {'type': 'new.meeting.message', 'meeting': meeting}
            )
    
    async def new_meeting_message(self, event):
        meeting = event['meeting']

        await self.send(text_data=json.dumps({'meeting': meeting}))

    async def start_meeting_message(self, event):
        meeting = event['meeting']

        await self.send(text_data=json.dumps({'meeting': meeting}))