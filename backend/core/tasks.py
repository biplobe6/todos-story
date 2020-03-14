import os
import time
import logging
import datetime

from django.db import transaction
from celery import shared_task, signals
from celery.signals import worker_ready

from core import models
from core.todo_helper import TodoHelper
from core.todo_helper import ProjectDoesNotExist


logger = logging.getLogger(__name__)
UPDATE_INTERVAL = 1


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


@shared_task
def update_todo():
    logger.info('Updating todo.')
    update_interval_delta = datetime.timedelta(seconds=UPDATE_INTERVAL)
    while True:
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
