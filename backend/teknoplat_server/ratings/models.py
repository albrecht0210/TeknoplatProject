import uuid

from django.db import models
from django.contrib.auth import get_user_model

Account = get_user_model()

# Create your models here.
class Rating(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, serialize=False)
    rating = models.DecimalField(max_digits=3, decimal_places=2)
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    pitch = models.ForeignKey('pitches.Pitch', on_delete=models.CASCADE)
    meeting = models.ForeignKey('meetings.Meeting', on_delete=models.CASCADE)
    criteria = models.ForeignKey('criteria.Criteria', on_delete=models.CASCADE)

    def __str__(self):
        return f'Rating: {self.account} on {self.pitch.name}'