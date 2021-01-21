#!/bin/bash

echo "Starting services..."
# TODO(Nurudeen): Figure out a way to detect if we need to rebuild or not
docker-compose -f docker-compose.ci.yml build rails && docker-compose -f docker-compose.ci.yml up -d

sleep 60
echo "Services are up and ready"

echo "Preparing test DB..."
./bin/docker_rails db:test:prepare

echo "Running Cypress tests..."
docker-compose -f docker-compose.ci.yml -f cypress.yml up --exit-code-from cypress

echo "Stopping docker compose..."
docker-compose -f docker-compose.ci.yml -f cypress.yml down
