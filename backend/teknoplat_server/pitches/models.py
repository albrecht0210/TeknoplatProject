import uuid

from django.db import models

# Create your models here.
class Pitch(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, serialize=False)
    name = models.CharField(max_length=100)
    description = models.TextField()

    team = models.CharField(max_length=100)
    course = models.CharField(max_length=100, blank=True, null=True)

    open_rate = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True) 
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
