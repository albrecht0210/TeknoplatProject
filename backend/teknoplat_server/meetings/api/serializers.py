from rest_framework import serializers
from ..models import Meeting, MeetingCriteria
from pitches.api.serializers import PitchSerializer
from comments.api.serializers import CommentSerializer

class CreateMeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meeting
        fields = ('id', 'name', 'description', 'course', 'status', 'owner')

class MeetingCriteriaSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    description = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = MeetingCriteria
        fields = ('id', 'name', 'description', 'weight', 'criteria')

    def get_name(self, obj):
        return obj.criteria.name
    
    def get_description(self, obj):
        return obj.criteria.description

class MeetingSerializer(serializers.ModelSerializer):
    presentors = serializers.SerializerMethodField(read_only=True)
    comments = serializers.SerializerMethodField(read_only=True)
    criterias = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Meeting
        fields = '__all__'
        
    def get_presentors(self, obj):
        return PitchSerializer(obj.presentors, many=True, context=self.context).data
    
    def get_comments(self, obj):
        return CommentSerializer(obj.comments, many=True).data
    
    def get_criterias(self, obj):
        return MeetingCriteriaSerializer(obj.criterias, many=True).data

# class CreatedMeetingSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Meeting
#         fields = '__all__'