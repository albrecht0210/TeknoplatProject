import uuid

from django.db import models

# Create your models here.
class Feedback(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, serialize=False)
    pitch = models.ForeignKey('pitches.Pitch', on_delete=models.CASCADE)
    meeting = models.ForeignKey('meetings.Meeting', on_delete=models.CASCADE, null=True, blank=True)
    feedback = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True) 
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.feedback
    