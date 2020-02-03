from django.shortcuts import render
from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from core import serializer, models


class ProjectListCreateView(generics.ListCreateAPIView):
    serializer_class = serializer.ProjectSerializer
    queryset = models.Project.objects.all()


class ProjectDetailsView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializer.ProjectSerializer
    queryset = models.Project.objects.all()
    lookup_field = 'alias'


class TodoListCreateView(generics.ListCreateAPIView):
    serializer_class = serializer.TodoSerializer
    queryset = models.Todo.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ('project', 'parent')


class TodoDetailsView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializer.TodoSerializer
    queryset = models.Todo.objects.all()
    lookup_field = 'alias'


