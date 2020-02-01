from celery import shared_task
from core.models import Todo


@shared_task
def count():
    return Todo.objects.count()
