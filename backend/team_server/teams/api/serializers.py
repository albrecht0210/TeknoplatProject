from rest_framework import serializers
from ..models import Team

from accounts.api.serializers import AccountSerializer

class TeamSerializer(serializers.ModelSerializer):
    members = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Team
        fields = '__all__'

    def get_members(self, obj):
        return AccountSerializer(obj.members, many=True).data