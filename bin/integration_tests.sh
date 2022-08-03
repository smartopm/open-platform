#!/bin/bash

set -e

export env $(cat cypress/.env.ci)

echo "Starting services..."
[ ! -z $1 ] && docker-compose -f docker-compose.ci.yml build
docker-compose -f docker-compose.ci.yml up -d

echo "Preparing test DB..."
docker-compose -f docker-compose.ci.yml run --rm rails rails db:create db:schema:load

echo "Creating build..."
[ ! -z $1 ] && docker-compose run --rm webpacker yarn build

echo "Running Cypress tests..."
docker-compose -f docker-compose.ci.yml -f cypress.yml up --exit-code-from cypress

echo "Stopping docker compose..."
docker-compose -f docker-compose.ci.yml -f cypress.yml down
