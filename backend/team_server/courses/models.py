import uuid

from django.db import models
from django.contrib.auth import get_user_model

Account = get_user_model()

# Create your models here.
class Course(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, serialize=False)
    code = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    section = models.CharField(max_length=10)

    members = models.ManyToManyField(Account)

    created_at = models.DateTimeField(auto_now_add=True) 
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['name', 'section']

    def __str__(self):
        return f'{self.name} ({self.section})'

    def get_full_name(self):
        return f'{self.name} ({self.section})'
    