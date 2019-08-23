#!/bin/bash

set -e

docker-compose stop rails
docker-compose build rails
docker-compose up -d rails
