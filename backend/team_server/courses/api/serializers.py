from rest_framework import serializers
from ..models import Course

from accounts.api.serializers import AccountSerializer

class CourseSerializer(serializers.ModelSerializer):
    members = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Course
        fields = '__all__'

    def get_members(self, obj):
        return AccountSerializer(obj.members, many=True).data
