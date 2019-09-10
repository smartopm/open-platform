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
