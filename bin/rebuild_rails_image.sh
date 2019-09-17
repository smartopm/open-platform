#!/bin/bash

set -e

docker-compose stop rails
docker-compose run --rm rails bundle
docker-compose run --rm rails yarn install
docker-compose build rails
docker-compose up -d rails
