#!/bin/bash

docker-compose run --rm -e ENV="test" rails bundle exec rubocop
