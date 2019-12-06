#!/bin/bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

docker-compose run --rm webpacker yarn lint
docker-compose run --rm webpacker yarn test
$DIR/docker_rake lint
$DIR/docker_rake
