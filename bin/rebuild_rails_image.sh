#!/bin/bash

set -e

docker-compose stop rails
docker-compose run rails bundle
docker-compose run rails yarn install
docker-compose build rails
docker-compose up -d rails
