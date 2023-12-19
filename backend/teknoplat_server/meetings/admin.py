from django.contrib import admin
from .models import Meeting, MeetingCriteria

# Register your models here.
admin.site.register(Meeting)
admin.site.register(MeetingCriteria)