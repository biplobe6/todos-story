from django.shortcuts import render
from rest_framework import generics
from django.http import HttpResponse
from django_filters.rest_framework import DjangoFilterBackend
from core import serializer, models
from core.tasks import export_projects, import_projects


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



def export_project(request, alias):
    export_projects.delay(alias)
    return HttpResponse()


def import_project(request, alias):
    task = import_projects.delay(alias)
    task.wait(timeout=None, interval=0.5)
    return HttpResponse()
