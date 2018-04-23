#!/bin/sh
export FLASK_APP=./app.py
source $(pipenv --venv)/bin/activate
nohup flask run --host=0.0.0.0
