import uuid

from django.db import models
from django.contrib.auth import get_user_model

Account = get_user_model()

# Create your models here.

class Meeting(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, serialize=False)
    name = models.CharField(max_length=100)
    description = models.TextField()
    
    teacher_weight_score = models.DecimalField(max_digits=3, decimal_places=2, default=1)
    student_weight_score = models.DecimalField(max_digits=3, decimal_places=2, default=0)

    MODE_CHOICES = (
        ('asynchronous', 'Asynchronous'),
        ('synchronous', 'Synchronous')
    )

    mode = models.CharField(max_length=20, choices=MODE_CHOICES, default='synchronous')

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    course = models.CharField(max_length=100)

    presentors = models.ManyToManyField('pitches.Pitch')
    comments = models.ManyToManyField('comments.Comment', blank=True)
    owner = models.ForeignKey(Account, on_delete=models.CASCADE, null=True, blank=True)
    video = models.CharField(max_length=50, blank=True, null=True)
    criterias = models.ManyToManyField('MeetingCriteria')

    created_at = models.DateTimeField(auto_now_add=True) 
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class MeetingCriteria(models.Model):
    criteria = models.ForeignKey('criteria.Criteria', on_delete=models.CASCADE)
    weight = models.DecimalField(max_digits=3, decimal_places=2)

    