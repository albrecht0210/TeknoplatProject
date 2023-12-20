import uuid

from django.db import models
from django.contrib.auth import get_user_model

Account = get_user_model()

# Create your models here.
class Chatbot(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, serialize=False)
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    messages = models.ManyToManyField('Chat', related_name='Messages')

    created_at = models.DateTimeField(auto_now_add=True) 
    updated_at = models.DateTimeField(auto_now=True)

class Chat(models.Model):
    chatbot = models.ForeignKey(Account, on_delete=models.CASCADE)
    ROLE_CHOICES = (
        ('system', 'System'),
        ('assistant', 'Assistant'),
        ('user', 'User'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='synchronous')
    content = models.TextField()

    def __str__(self):
        return self.content