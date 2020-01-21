from django.shortcuts import render
from rest_framework import generics
from core import serializer, models


class ProjectListCreateView(generics.ListCreateAPIView):
    serializer_class = serializer.ProjectSerializer
    queryset = models.Project.objects.all()


class ProjectDetailsView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializer.ProjectSerializer
    queryset = models.Project.objects.all()
    lookup_field = 'id'


class TodoListCreateView(generics.ListCreateAPIView):
    serializer_class = serializer.TodoSerializer
    queryset = models.Todo.objects.all()


class TodoDetailsView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializer.TodoSerializer
    queryset = models.Todo.objects.all()
    lookup_field = 'id'


