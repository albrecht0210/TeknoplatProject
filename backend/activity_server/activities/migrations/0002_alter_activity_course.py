# Generated by Django 5.0 on 2023-12-19 15:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('activities', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='activity',
            name='course',
            field=models.CharField(max_length=100),
        ),
    ]