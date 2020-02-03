from __future__ import absolute_import
import os

from django.conf import settings

from celery import Celery


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.settings')


app = Celery('tasks')


app.config_from_object('django.conf:settings', namespace='CELERY')


app.autodiscover_tasks(
	settings.INSTALLED_APPS
)

@app.task(bind=True)
def debug_task(self):
	print('Request: {0!r}'.format(self.request))
