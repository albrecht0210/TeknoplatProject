import uuid

from django.db import models
from django.contrib.auth import get_user_model

Account = get_user_model()

# Create your models here.
class Activity(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, serialize=False)
    name = models.CharField(max_length=100)
    description = models.TextField()
    due_date = models.DateTimeField(null=True, blank=True)

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    course = models.CharField(max_length=100)

    SERVICE_CHOICES = (
        ('team', 'Team Management'),
        ('activity', 'Activity Management'),
        ('teknoplat', 'Teknoplat'),
    )
    service = models.CharField(max_length=50, choices=SERVICE_CHOICES, default='teknplat')
    
    owner = models.ForeignKey(Account, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True) 
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    