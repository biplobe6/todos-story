import os
import json
import django
import sys
import logging

CWD = os.path.abspath(
    os.path.dirname(__file__)
)

BASE_DIR = os.path.abspath(
    os.path.join(CWD, '..')
)



def django_setup():
    if BASE_DIR not in sys.path:
        sys.path.append(BASE_DIR)
    if CWD not in sys.path:
        sys.path.append(CWD)



    if 'DJANGO_SETTINGS_MODULE' not in os.environ:
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.settings')
        django.setup()


def enable_db_log():
    logger = logging.getLogger('django.db.backends')
    logger.setLevel(logging.DEBUG)


def disable_db_log():
    logger = logging.getLogger('django.db.backends')
    logger.setLevel(logging.ERROR)


def dumps(data):
    print(json.dumps(data, indent=2))
