## Development Setup

Git clone `https://gitlab.com/doublegdp/open-platform.git` then change directory to the project directory.

### Docker

#### Setting up Docker

Requires Docker and docker-compose to be installed

- `docker-compose build`
- `./bin/docker_rails db:create db:schema:load`
- `./bin/docker_rails db:seed`
- `./bin/docker_rails db:add_permissions_to_global_roles`
- `docker-compose run --rm webpacker yarn install --check-files`
- `docker-compose up`

The site is now available at http://localhost:3000, and you can login with the details below:
```
username: admin1
password: admin12345
```

If you're a member of the DoubleGDP team, request the development key
and place it in `config/credentials/development.key`

To generate the environment variables required to run the app, run:

`docker-compose run rails credentials:edit --environment development`

Please look at `config/credentials/development.yml.sample` for a list of credentials
that will be needed to run the app and created by running the same `credentials:edit` function as above.

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
