import io
import os
import logging
from core.models import Todo, Project
from rest_framework.parsers import JSONParser
from rest_framework.renderers import JSONRenderer
from django.utils.dateparse import parse_datetime
from core.serializer import TodoSerializer, ProjectIOSerializer


logger = logging.getLogger(__name__)


class ProjectDoesNotExist(Project.DoesNotExist):
    def __init__(self, *args, **kwargs):
        super(ProjectDoesNotExist, self).__init__(*args, **kwargs)


class TodoFileHelper:
    _file_path = None
    _file_data_json = None
    _project_json = None
    _todos_json = None

    container = None
    file_name = 'todo.json'

    def file_path(self):
        if self._file_path is None:
            self._file_path = os.path.join(
                self.container,
                self.file_name
            )
        return self._file_path

    def file_data_json(self):
        if self._file_data_json is None:
            file_path = self.file_path()
            with io.open(file_path, 'rb') as todo_file:
                self._file_data_json = JSONParser().parse(
                    todo_file
                )
        return self._file_data_json

    def file_data_json_update(self, container):
        self.container = container
        file_path = self.file_path()
        with open(file_path, 'w') as todo_file:
            todo_file.write(
                JSONRenderer().render(
                    self._file_data_json,
                    renderer_context={'indent': 2}
                ).decode('utf-8')
            )

    def project_json(self):
        if self._project_json is None:
            file_data_json = self.file_data_json()
            self._project_json = file_data_json['project_info']
        return self._project_json

    def project_json_update(self, project_json):
        self._project_json = project_json
        if self._file_data_json is None:
            self._file_data_json = {}
        self._file_data_json['project_info'] = project_json

    def todos_json(self):
        if self._todos_json is None:
            file_data_json = self.file_data_json()
            self._todos_json = file_data_json['todos']
        return self._todos_json

    def todos_json_update(self, todos_json):
        self._todos_json = todos_json
        if self._file_data_json is None:
            self._file_data_json = {}
        self._file_data_json['todos'] = todos_json


class TodoHelper(TodoFileHelper):
    _project_obj = None
    project_alias = None

    def get_project(self, alias=None):
        if alias is not None:
            self.project_alias = alias
        if self.project_alias is None:
            self.project_alias = self.project_json()['alias']
        if self._project_obj is None:
            try:
                self._project_obj = Project.objects.get(
                    alias=self.project_alias
                )
            except Project.DoesNotExist as exception:
                raise ProjectDoesNotExist(exception)
        return self._project_obj

    def is_require_project_update(self):
        project_updated_at = parse_datetime(
            self.project_json()['updated_at']
        )
        project = self.get_project()
        return project_updated_at > project.updated_at

    def update_project(self):
        project_json = self.project_json()
        Project.objects.filter(
            alias=project_json['alias']
        ).update(**project_json)
        return

    def strip_old_todos(self):
        deleted_todo_count, summary = Todo.objects.only(
            'alias'
        ).filter(
            project=self.project_json()['alias']
        ).exclude(
            alias__in=[todo['alias'] for todo in self.todos_json()]
        ).delete()
        logger.info("{} todo deleted.".format(deleted_todo_count))
        return (deleted_todo_count, summary)

    def _update_old_todos(self):
        todos_alias = []
        todos_hash = {}
        for todo in self.todos_json():
            alias = todo['alias']
            todos_alias.append(alias)
            todos_hash[alias] = todo

        updated_todos = []
        old_todos = Todo.objects.filter(
            project=self.project_json()['alias'],
            alias__in=todos_alias
        ).only('updated_at')
        for todo in old_todos:
            todo_json = todos_hash[str(todo.alias)]
            updated_at = parse_datetime(
                todo_json['updated_at']
            )
            if updated_at > todo.updated_at:
                Todo.objects.filter(
                    alias=todo.alias
                ).update(**todo_json)
            updated_todos.append(todo_json['alias'])
        return updated_todos

    def add_or_update_todos(self):
        updated_todos = self._update_old_todos()
        created_todos = []
        for todo in self.todos_json():
            if todo['alias'] not in updated_todos:
                todo['project_id'] = todo['project']
                del todo['project']
                Todo.objects.create(**todo)
                created_todos.append(todo['alias'])
        logger.info("{} todo imported.".format(len(created_todos)))
        return created_todos

    def export_todos(self, alias):
        project = self.get_project(alias)
        self.project_json_update(
            ProjectIOSerializer(project).data
        )
        self.todos_json_update(
            TodoSerializer(
                Todo.objects.filter(
                    project=project.alias
                ),
                many=True
            ).data
        )
        os.makedirs(project.assets_dir, exist_ok=True)
        self.file_data_json_update(
            project.assets_dir
        )

    def import_todos(self, alias):
        if self.container is None:
            project = self.get_project(alias)
            self.container = project.assets_dir
        self.strip_old_todos()
        self.add_or_update_todos()
