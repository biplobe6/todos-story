# Generated by Django 2.2.9 on 2020-02-03 16:09

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('alias', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('title', models.TextField()),
                ('description', models.TextField(blank=True, default='')),
                ('assets_dir', models.CharField(max_length=300)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Todo',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('alias', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('rq', models.IntegerField(blank=True)),
                ('title', models.TextField()),
                ('story', models.TextField(blank=True, default='')),
                ('done', models.BooleanField(blank=True, default=False)),
                ('position', models.FloatField()),
                ('parent', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='core.Todo')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Project')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
