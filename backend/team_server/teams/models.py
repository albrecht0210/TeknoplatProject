import uuid

from django.db import models
from django.contrib.auth import get_user_model
from courses.models import Course

Account = get_user_model()

# Create your models here.
class Team(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, serialize=False)
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField()
    max_members = models.IntegerField()
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    members = models.ManyToManyField(Account)
    
    created_at = models.DateTimeField(auto_now_add=True) 
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name