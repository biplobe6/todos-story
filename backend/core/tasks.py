from celery import shared_task
import os
import logging
from core.todo_helper import TodoHelper
from core.todo_helper import ProjectDoesNotExist


logger = logging.getLogger(__name__)


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

