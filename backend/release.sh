#!/bin/bash

rm -rf static_files
python manage.py collectstatic --noinput -i admin -i rest_framework


