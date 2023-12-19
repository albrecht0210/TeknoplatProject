import uuid

from django.db import models
from django.utils.crypto import get_random_string

def service_token_generator():
    return get_random_string(Service.token.field.max_length)

# Create your models here.
class Service(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, serialize=False)
    name = models.CharField(max_length=100, unique=True)
    identifier = models.CharField(max_length=50, unique=True)
    token = models.CharField(max_length=128, unique=True, default=service_token_generator)
    base_url = models.URLField()

    created_at = models.DateTimeField(auto_now_add=True, auto_created=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.name} ({self.identifier})'
    