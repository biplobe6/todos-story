#!/bin/bash

rm -rf static_files
python manage.py collectstatic --noinput -i rest_framework


