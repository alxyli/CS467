#!/bin/sh
export FLASK_APP=./crawler.py
nohup flask run --host=0.0.0.0
