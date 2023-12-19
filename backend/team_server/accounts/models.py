import uuid

from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class Account(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)

    avatar = models.ImageField(upload_to='media', null=True, blank=True)

    def __str__(self):
        return self.username

    def get_role(self):
        if self.is_superuser:
            return 'Admin'
        elif self.is_staff:
            return 'Teacher'
        else:
            return 'Student'