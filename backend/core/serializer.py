from core import models
from rest_framework import serializers


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Project
        fields = '__all__'


class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Todo
        fields = '__all__'
