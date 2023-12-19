from rest_framework import serializers
from ..models import Remark

class RemarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Remark
        fields = '__all__'