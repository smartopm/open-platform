#!/bin/bash

docker-compose run --rm rails node_modules/.bin/webpack --config config/webpack/production.js --profile --json > stats.json
docker-compose run --rm -p 8899:8888 rails node_modules/.bin/webpack-bundle-analyzer --host 0.0.0.0 stats.json
