import os
import json
import time
import logging
import datetime

from django.db import transaction
from celery import shared_task, signals
from celery.signals import worker_ready
from celery.contrib.abortable import AbortableTask
from celery.contrib.abortable import AbortableAsyncResult
from celery.signals import worker_shutting_down

from core import models
from core.todo_helper import TodoHelper
from core.todo_helper import ProjectDoesNotExist


UPDATE_INTERVAL = 1
BASE = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..")
)
UPDATE_TODO = 'update_todo'

logger = logging.getLogger(__name__)
tasks_path = os.path.abspath(
    os.path.join(BASE, 'tmp/tasks.json')
)


@worker_shutting_down.connect
def shutdown_hook(*args, **kwargs):
    with open(tasks_path, 'r') as tasks_file:
        tasks = json.loads(tasks_file.read())
    for task_id in tasks[UPDATE_TODO]:
        task = AbortableAsyncResult(task_id)
        task.abort()
    with open(tasks_path, 'w') as tasks_file:
        tasks_file.write(
            json.dumps({})
        )

def save_task_id(task_id, name):
    try:
        with open(tasks_path, 'r') as tasks_file:
            tasks = json.loads(tasks_file.read())
    except FileNotFoundError:
        tasks = {}
        os.makedirs(os.path.dirname(tasks_path), exist_ok=True)
    if name not in tasks:
        tasks[name] = []
    tasks[name].append(task_id)

    with open(tasks_path, 'w') as tasks_file:
        tasks_file.write(
            json.dumps(tasks)
        )



@shared_task
def export_project(project_alias):
    try:
        todo_helper = TodoHelper()
        todo_helper.export_todos(project_alias)
        logger.info('Project exported: "{}"'.format(todo_helper.container))
    except ProjectDoesNotExist:
        logger.error('Project "{}" does not exist'.format(project_alias))


@shared_task
def import_project(project_alias):
    try:
        todo_helper = TodoHelper()
        todo_helper.import_todos(project_alias)
        logger.info('Project imported: "{}"'.format(todo_helper.container))
    except ProjectDoesNotExist:
        logger.error('Project "{}" does not exist'.format(project_alias))
    except FileNotFoundError:
        logger.error("File not found: '{}'".format(todo_helper.file_path()))


@shared_task(bind=True, base=AbortableTask)
def update_todo(self):
    task_id = str(self.request.id)
    save_task_id(task_id, UPDATE_TODO)
    logger.info('Updating todo.')
    update_interval_delta = UPDATE_INTERVAL
    while not self.is_aborted():
        try:
            time.sleep(UPDATE_INTERVAL)
            todos = models.Todo.objects.filter(
                wip=True
            )
            with transaction.atomic():
                for todo in todos:
                    todo.time_span += update_interval_delta
                    todo.save()
        except Exception as e:
            logger.error(str(e))
    logger.warning('todo stopped updating.')



@worker_ready.connect
def at_start(sender, *args, **kwargs):
    with sender.app.connection() as conn:
        sender.app.send_task('core.tasks.update_todo')
