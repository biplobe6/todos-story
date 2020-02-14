#!/bin/bash


python_path="$( which python3 )"
python_path_exists="true"


if [ "$python_path" == "" ]; then
  python_path_exists="false"
fi




python_version_matched="false"
python_version="$( python -c 'import sys; print(sys.version_info[0])' )"


if [ "$python_version" -ge "3" ]; then
  python_version_matched="true"
fi


if [ "$python_version_matched" == "true" ] || [ "$python_path_exists" == "true" ]; then
  python3 backend/app.py $@
else
  echo "Python 3 is required!"
fi

