"""
WSGI config for main project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/howto/deployment/wsgi/
"""

import os
from django.core.wsgi import get_wsgi_application
import djcelery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.settings')

djcelery.setup_loader()
application = get_wsgi_application()
