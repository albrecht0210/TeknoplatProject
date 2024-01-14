from rest_framework import permissions, status, views, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from ..models import Chatbot, Chat
from .serializers import ChatbotSerializer, ChatSerializer
from .external_services import create_chat_completions

class ChatbotViewSet(viewsets.ModelViewSet):
    queryset = Chatbot.objects.all()
    serializer_class = ChatbotSerializer
    permission_classes = (permissions.IsAuthenticated, )

    def get_queryset(self):
        queryset = self.queryset
        account_param = self.request.query_params.get('account')

        if account_param:
            queryset = queryset.filter(account=account_param)
        
        return queryset

    @action(detail=True, methods=['post'])
    def add_new_content(self, request, pk=None):
        chatbot = self.get_object()
        chat_serializer = ChatSerializer(data=request.data)
        if chat_serializer.is_valid():
            chat_serializer.save()
            chatbot.messages.add(chat_serializer.data['id'])
            constant_messages = [
                {
                    'role': 'system', 
                    'content': 'You are an expert panelist. You are going to evaluate the pitch. Your responses vary based on configured settings, ranging from leniency to harshness, generality to specificity, and optimism to pessimism. Explore different scenarios that illustrate how these configured settings impact your nuanced responses, considering the specified ranges from 0 to 1.'
                },
                {
                    'role': 'system',
                    'content': f'Configure the panelist with a leniency-to-harsh setting of {request.data.get('leniency')}.'
                },
                {
                    'role': 'system',
                    'content': f'Now, set the generality-to-specificity configuration to {request.data.get('generality')}.'
                },
                {
                    'role': 'system',
                    'content': f'Finally, adjust the optimism-to-pessimism setting to {request.data.get('optimism')}.'
                },
                {
                    'role': 'system',
                    'content': 'Give comments and suggestions on the sent pitch.'
                },
            ]
            chats = ChatSerializer(instance=Chat.objects.filter(chatbot=chatbot.id), many=True).data
            messages = []
            for chat in chats:
                message = {}
                for key, value in chat.items():
                    if (key == 'role'):
                        message['role'] = value
                    if (key == 'content'):
                        message['content'] = value
                    if 'role' in message and 'content' in message:
                        messages = messages + [message]
                        break
            final_messages = constant_messages + messages
            openai_response = create_chat_completions(messages=final_messages)
            new_chat = {
                'chatbot': chatbot.id,
                'role': openai_response.choices[0].message.role,
                'content': openai_response.choices[0].message.content
            }

            new_chat_serializer = ChatSerializer(data=new_chat)
            if new_chat_serializer.is_valid():
                new_chat_serializer.save()
                chatbot.messages.add(new_chat_serializer.data['id'])
                return Response(new_chat_serializer.data, status=status.HTTP_201_CREATED)
            return Response(new_chat_serializer.error_messages, status=status.HTTP_400_BAD_REQUEST)
        print(chat_serializer.error_messages)
        return Response(chat_serializer.error_messages, status=status.HTTP_400_BAD_REQUEST)
