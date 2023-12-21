import json

from rest_framework import serializers
from ..models import Pitch
from .external_services import fetch_team

class PitchSerializer(serializers.ModelSerializer):
    team_json = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Pitch
        fields = '__all__'

    def get_team_json(self, obj):
        team = fetch_team(obj.team, self.context.get('request'))
        team_response = json.loads(team.content.decode('utf-8'))

        if team.status_code == 404:
            raise serializers.ValidationError(team_response)
        elif team.status_code == 500:
            raise serializers.ValidationError({'error': 'Team Management Server is down.'})

        return team_response

