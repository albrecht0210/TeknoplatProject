import uuid

from django.db import models
from django.contrib.auth import get_user_model

Account = get_user_model()

# Create your models here.
class Remark(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, serialize=False)
    remark = models.TextField()
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    pitch = models.ForeignKey('pitches.Pitch', on_delete=models.CASCADE)
    meeting = models.ForeignKey('meetings.Meeting', on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True) 
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.remark