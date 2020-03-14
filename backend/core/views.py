import os
from rest_framework.views import APIView
from rest_framework import generics, status
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from core import serializer, models
from core import tasks
from utils.validator import Validator, FieldValidator
from core.todo_helper import TodoFileHelper
from rest_framework.response import Response


class TodoRunDuplicateException(Exception):
    pass


class AssetsDirValidator(FieldValidator):
    def validate_permission(self):
        assets_dir = self.data[self.key]
        if os.path.exists(assets_dir) and not os.access(assets_dir, os.W_OK):
            self.validator.add_error(self.key, 'Permission Error.')

    def validate_duplication(self):
        assets_dir = self.data[self.key]
        assets_dirs = [os.path.abspath(assets_dir)]
        assets_dirs.append(assets_dirs[0] + '/')
        dir_count = models.Project.objects.filter(
            assets_dir__in=assets_dirs
        ).count()
        if dir_count > 0:
            self.validator.add_error(self.key, 'Duplicate Exist.')

    def pre_check(self):
        self.validate_permission()
        self.validate_duplication()


class ProjectListCreateView(generics.ListCreateAPIView):
    serializer_class = serializer.ProjectSerializer
    queryset = models.Project.objects.all()

    @staticmethod
    def find_old_project(container):
        project_file = TodoFileHelper()
        project_file.container = container
        data = None

        try:
            data = project_file.project_json()
        except FileNotFoundError:
            pass
        return data

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validator = Validator()
        AssetsDirValidator(
            serializer.validated_data,
            'assets_dir',
            validator
        )
        validator.is_valid()

        data = serializer.validated_data
        old_data = self.find_old_project(data.get('assets_dir'))
        if old_data is not None:
            del old_data['title']
            del old_data['description']

            old_data.update(data)
            with models.suppress_auto_now(models.Project, ['created_at', 'updated_at']):
                project = models.Project.objects.create(**old_data)
            serializer = self.get_serializer_class()(project)
            tasks.import_project.delay(old_data['alias'])
        else:
            self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


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



def project_export_view(request, alias):
    tasks.export_project.delay(alias)
    return HttpResponse()


def project_import_view(request, alias):
    task = tasks.import_project.delay(alias)
    task.wait(timeout=None, interval=0.5)
    return HttpResponse()


class TodoStart(APIView):
    def get(self, request, alias):
        try:
            todo = models.Todo.objects.get(alias=alias)
            if todo.wip:
                raise TodoRunDuplicateException('Already running.')
            todo.wip = True
            todo.save()
            return Response()
        except models.Todo.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except TodoRunDuplicateException as e:
            return Response(
                data={"error": [str(e)]},
                status=status.HTTP_400_BAD_REQUEST,
            )


class TodoStop(APIView):
    def get(self, request, alias):
        try:
            todo = models.Todo.objects.get(alias=alias)
            if not todo.wip:
                raise TodoRunDuplicateException('Not running.')
            todo.wip = False
            todo.save()
            return Response()
        except models.Todo.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except TodoRunDuplicateException as e:
            return Response(
                data={"error": [str(e)]},
                status=status.HTTP_400_BAD_REQUEST,
            )
