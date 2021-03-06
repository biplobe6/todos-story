# Generated by Django 2.2.10 on 2020-03-15 08:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='todo',
            name='duration',
            field=models.PositiveIntegerField(default=180),
        ),
        migrations.AddField(
            model_name='todo',
            name='time_span',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='todo',
            name='wip',
            field=models.BooleanField(default=False),
        ),
    ]
