# README

Will add more notes here as we grow

## Development / Docker

### Docker

#### Setting up Docker

Requires Docker and docker-compose to be installed

- `docker-compose build`
- `./bin/rails_docker db:create db:schema:load`
- `docker-compose up`

### Updating gems

- `docker-compose run --rm rails bundle add gemfileyouwant`
- `bin/rebuild_rails_image.sh`
  - This performs
    - Stop the existing 'rails' service
    - Run `bundle` to update Gemfile.lock
    - Runs `bundle install` install gems
    - Starts the 'rails' service

### Testing

#### Run Rspec tests

`docker-compose run --rm rails rake`

#### Run Rubocop for linting

`docker-compose run --rm rails rake lint`

To autofix

`docker-compose run --rm rails rake lint:fix`

#### Before a merge/pull request

Before you submit a merge or pull request, please ensure that both
Rubocop and the tests pass.

`bin/all.sh`

