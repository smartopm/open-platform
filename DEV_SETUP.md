## Development Setup

- Git clone `https://gitlab.com/doublegdp/open-platform.git` then change directory to the project directory.
- Generate `.env.docker` file: `cp .env.docker.sample .env.docker`

### Docker

#### Setting up Docker

Requires Docker and docker-compose to be installed

- `docker-compose build`
- `./bin/docker_rails db:create db:schema:load`
- `./bin/docker_rails db:create_community[your-community-name-here]`
- `./bin/docker_rails db:create_default_admin[email,username,password]`
- `./bin/docker_rails db:add_permissions_to_global_roles`
- `docker-compose run --rm webpacker yarn install --check-files`
- `docker-compose up`

The site is now available at http://localhost:3000, and you can login with the username and password supplied above.

### Updating Dependecies

- Adding a Gem
  - `docker-compose run --rm rails bundle add gemyouwant`

- Adding a javascript dependency
  - `docker-compose run --rm webpacker yarn add modulename`

Then rebuild the images:

- `./bin/rebuild.sh`
  - This performs
    - Stop the existing 'rails' and 'webpacker' service
    - Runs `bundle install` install gems
    - Runs `yarn install` install javascript dependencies
    - Starts the 'rails' and 'webpacker' service


### Testing

#### Run Rspec tests

`docker-compose run --rm rails rake`

To run an individual test

`docker-compose run --rm rails bundle exec rspec test_file`

test_file should be the relative path to the file being tested e.g: `spec/graphql/mutations/user_spec.rb`

#### Run Frontend tests

`docker-compose run --rm webpacker yarn test`

To run individual frontend test

`docker-compose run --rm webpacker yarn test test_file`

#### Run Cypress end-to-end tests

`./bin/integration_tests.sh`

To rebuild images before running the tests, pass an argument:

`./bin/integration_tests.sh 'ci'`

#### Run Rubocop for linting

`docker-compose run --rm rails rake lint`

To autofix

`docker-compose run --rm rails rake lint:fix`

#### ESLint for React linting

`docker-compose run --rm rails eslint app/javascript/src`
