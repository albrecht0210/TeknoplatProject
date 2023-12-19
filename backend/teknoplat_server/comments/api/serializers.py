from rest_framework import serializers
from ..models import Comment
from accounts.api.serializers import AccountSerializer

class CommentSerializer(serializers.ModelSerializer):
    account_detail = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'

    def get_account_detail(self, obj):
        return AccountSerializer(obj.account).data