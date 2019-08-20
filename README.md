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
- Rebuild the image `docker-compose build rails`

### Testing

- `docker-compose run --rm -e ENV="test" rails bundle exec rails test`
