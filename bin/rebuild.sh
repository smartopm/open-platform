#!/bin/bash

set -e

docker-compose stop rails webpacker
docker-compose run rails bundle
docker-compose run rails yarn install
docker-compose build rails
docker-compose up -d rails webpacker
