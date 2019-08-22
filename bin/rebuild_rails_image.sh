#!/bin/bash

set -e

docker-compstop rails
docker-compose build rails
docker-compose up -d rails
