#!/bin/bash

set -e

docker-compose -f docker-compose.ci.yml stop rails webpacker
docker-compose -f docker-compose.ci.yml build rails
docker-compose -f docker-compose.ci.yml run rails bundle
docker-compose -f docker-compose.ci.yml run rails yarn install
docker-compose -f docker-compose.ci.yml up -d rails webpacker
