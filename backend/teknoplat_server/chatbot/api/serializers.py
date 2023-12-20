from rest_framework import serializers

from ..models import Chatbot, Chat

class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = '__all__'

class ChatbotSerializer(serializers.ModelSerializer):
    messages = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Chatbot
        fields = '__all__'

    def get_messages(self, obj):
        return ChatSerializer(obj.messages, many=True).data
    