# README

Will add more notes here as we grow

## Development / Docker

### Docker

#### Setting up Docker

Requires Docker and docker-compose to be installed

- `docker-compose build`
- `./bin/docker_rails db:create db:schema:load`
- `docker-compose up`

If you're a member of the DoubleGDP team, request the development key
and place it in `config/credentials/development.key`

At this point you will have access to the environment variables required
to run the app.

They can be seen and edited by running

`docker-compose run --rm rails credentials:edit --environment development`

If you don't have access to this key, please look at
`config/credentials/development.yml.sample` for a list of credentials
that will be needed to run the app and create the development credentials
by running the same `credentials:edit` function as above.

Run this for db migration

`./bin/docker_rails db:migrate RAILS_ENV=development`

_SSL Setup_

Caddy is being used to serve the application via SSL. If you like, you can rely
on it's own self signed certificates which are available on localhost:443

Rather than rely on self-signed certificates, we include certificates for
dev.dgdp.site. They are encrypted with the development.key from above, and may
be decrypted by running `./bin/cert_setup.sh`

The site is now available as https://dev.dgdp.site and https://localhost

dev.dgdp.site points to 127.0.0.1, if you're development server is somewhere else
please update /etc/hosts to point dev.dgdp.site to the appropriate IP address.

### Updating gems or node_modules

- Adding a Gemfile
  - `docker-compose run --rm rails bundle add gemfileyouwant`

- Adding a javascript dependency
  - `docker-compose run --rm webpacker yarn add modulename`

Then rebuild the images:

- `bin/build.sh`
  - This performs
    - Stop the existing 'rails' and 'webpacker' service
    - Runs `bundle install` install gems
    - Runs `yarn install` install javascript dependencies
    - Starts the 'rails' and 'webpacker' service

### Testing

#### Run Rspec tests

`docker-compose run --rm rails rake`

#### Run Rubocop for linting

`docker-compose run --rm rails rake lint`

To autofix

`docker-compose run --rm rails rake lint:fix`

#### ESLint for React linting

`docker-compose run --rm rails eslint app/javascript/src

#### Before a merge/pull request

Before you submit a merge or pull request, please ensure that both
Rubocop, ESLint, and the tests pass.

`bin/all.sh`

# Reporting a security issue

Please report to us any issues you find to security@doublegdp.com. Your email will be acknowledged
within 24 hours, and you'll receive a more detailed response to your email within 72 hours
indicating the next steps in handling your report.

After the initial reply to your report, the security team will endeavor to keep you informed of the
progress being made towards a fix and full announcement. These updates will be sent at least every
five days.

Please note that Gitlab issues are public, please do not use them to disclose the details of the security issue.

## Disclosure Process

DoubleGDP uses the following disclosure process:

- Once the security report is received it is assigned a primary handler. This person coordinates the
  fix and release process.
- The issue is confirmed and a list of affected software is determined.
- Code is audited to find any potential similar problems.
- An update is released, addressing the security issue.
- Details of the security issue will be released to the public after 60 days, or once we release a
  fix, whichever comes first.
