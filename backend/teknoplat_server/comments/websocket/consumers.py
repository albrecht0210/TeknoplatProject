import json

from channels.generic.websocket import AsyncWebsocketConsumer

class CommentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['meeting_room']
        self.room_group_name = f'comment_{self.room_name}'
        print(self.room_group_name)
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        comment = text_data_json['comment']
        await self.channel_layer.group_send(
            self.room_group_name, {'type': 'new.comment.message', 'comment': comment}
        )
    
    async def new_comment_message(self, event):
        comment = event['comment']
        await self.send(text_data=json.dumps({'comment': comment}))
