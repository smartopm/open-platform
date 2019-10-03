#!/bin/bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

docker-compose run --rm rails ./node_modules/.bin/eslint app/javascript/src --ext .js --ext .jsx app/javascript/packs/react_main.jsx
$DIR/docker_rake lint
$DIR/docker_rake
