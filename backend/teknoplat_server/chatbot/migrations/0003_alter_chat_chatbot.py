# Generated by Django 5.0 on 2024-01-14 08:11

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chatbot', '0002_alter_chat_role'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chat',
            name='chatbot',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='chatbot.chatbot'),
        ),
    ]
