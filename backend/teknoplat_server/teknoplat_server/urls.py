"""
URL configuration for teknoplat_server project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('accounts.api.urls')),
    path('api/', include('pitches.api.urls')),
    path('api/', include('meetings.api.urls')),
    path('api/', include('comments.api.urls')),
    path('api/', include('criteria.api.urls')),
    path('api/', include('feedbacks.api.urls')),
    path('api/', include('ratings.api.urls')),
    path('api/', include('remarks.api.urls')),
    path('api/', include('videosdk.api.urls')),
    path('api/', include('chatbot.api.urls')),
]
