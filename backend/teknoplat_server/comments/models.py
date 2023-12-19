import uuid

from django.db import models
from django.contrib.auth import get_user_model

Account = get_user_model()

# Create your models here.
class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, serialize=False)
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    # meeting = models.ForeignKey('meetings.Meeting', on_delete=models.CASCADE)

    comment = models.TextField()

    team = models.PositiveBigIntegerField(null=True, blank=True)
    all_team = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True) 
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.comment
        