#!/bin/bash


CWD="$( pwd )"
BASE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd $BASE_DIR
yarn build
cd ../backend
rm -rf static_files
python manage.py collectstatic --noinput -i rest_framework -i django_extensions

cd $CWD
