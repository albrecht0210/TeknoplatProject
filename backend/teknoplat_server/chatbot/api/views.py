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
        request.data['chatbot'] = chatbot.id

        chat_serializer = ChatSerializer(data=request.data)

        if chat_serializer.is_valid():
            chat_serializer.save()
            chats = Chat.objects.filter(chatbot=chatbot.id)
            messages = [{'role': chat.role, 'content': chat.content} for chat in chats]
            openai_response = create_chat_completions(messages=messages)
            new_chat = {
                'chatbot': chatbot.id,
                'role': openai_response.choices[0].message['role'],
                'content': openai_response.choices[0].message['content']
            }

            new_chat_serializer = ChatSerializer(data=new_chat)
            if new_chat_serializer.is_valid():
                new_chat_serializer.save()
                return Response(new_chat_serializer.data, status=status.HTTP_201_CREATED)
            return Response(new_chat_serializer.error_messages, status=status.HTTP_400_BAD_REQUEST)
        return Response(new_chat_serializer.error_messages, status=status.HTTP_400_BAD_REQUEST)
