# README

Will add more notes here as we grow

## Development setup

To avoid consuming alot more resources on development machine, we recommend development through ssh tunnel to a developer owned space on Digital Ocean

Reach out to your manager for setup and login credentials and follow the `DEV_PLAYBOOK.md` instructions

## Getting the project on your local development environment

Navigate to your desired working directory or you can create one or even home directory is okay.

Git clone `https://gitlab.com/doublegdp/app.git` then change directory to the project directory.
### Docker

#### Setting up Docker

Requires Docker and docker-compose to be installed

- `docker-compose build`
- `./bin/docker_rails db:create db:schema:load`
- `docker-compose run --rm webpacker yarn install --check-files`
- `docker-compose up`

If you're a member of the DoubleGDP team, request the development key
and place it in `config/credentials/development.key`

To generate the environment variables required to run the app, run:

`docker-compose run rails credentials:edit --environment development`

Please look at `config/credentials/development.yml.sample` for a list of credentials
that will be needed to run the app and created by running the same `credentials:edit` function as above.

Run this for db migration to apply unapplied migrations or new migrations

`./bin/docker_rails db:migrate RAILS_ENV=development`

_SSL Setup_

Caddy is being used to serve the application via SSL. If you like, you can rely
on its own self signed certificates which are available on localhost:443

Rather than rely on self-signed certificates, we include certificates for
dev.dgdp.site. They are encrypted with the development.key from above, and you should
decrypt them by running `./bin/cert_setup.sh` on your development environment.

The application will be available at custom set url for you. Example `https://<custom_name>.dgdp.site/`.

Incase you do not know the url, consult your manager.

dev.dgdp.site points to 127.0.0.1, if your development server is somewhere else
please update /etc/hosts to point dev.dgdp.site to the appropriate IP address.

The site is now available as https://dev.dgdp.site and https://localhost incase of local development

### Updating gems or node_modules

- Adding a Gemfile

  - `docker-compose run --rm rails bundle add gemfileyouwant`

- Adding a javascript dependency
  - `docker-compose run --rm webpacker yarn add modulename`

Then rebuild the images:

- `./bin/rebuild.sh`
  - This performs
    - Stop the existing 'rails' and 'webpacker' service
    - Runs `bundle install` install gems
    - Runs `yarn install` install javascript dependencies
    - Starts the 'rails' and 'webpacker' service

### Deployment on Heroku

#### Setup

This assumes you are a collaborator on our Heroku instance

1. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
1. Login with `heroku login`
1. Assuming you already have this project checked out:
   1. Change directories to the root of this project
   1. Add the following Heroku remotes
      - `heroku git:remote --app double-gdp-dev && git remote rename heroku heroku-dev`
      - `heroku git:remote --app double-gdp-staging && git remote rename heroku heroku-staging`
      - `heroku git:remote --app double-gdp-fe && git remote rename heroku heroku-prod`

#### Deploy

To deploy master to staging: `git push heroku-staging master -f`

To deploy another_branch to staging: `git push heroku-staging another_branch:staging -f`

To deploy master to production: `git push heroku-prod master -f`

#### Rollback

You can rollback a release as follows:

1. View the releases - `heroku releases`
1. Pick the release you want to rollback to - `heroku rollback v40`

### Testing

#### Run Rspec tests

`docker-compose run --rm rails rake`

To run an individual test

`docker-compose run --rm rails bundle exec rspec test_file`

test_file should be the relative path to the file being tested e.g: `spec/graphql/mutations/user_spec.rb`
#### Run Rubocop for linting

`docker-compose run --rm rails rake lint`

To autofix

`docker-compose run --rm rails rake lint:fix`

#### ESLint for React linting

`docker-compose run --rm rails eslint app/javascript/src`

#### You can also add aliases
if you are on a UNIX based OS, edit ~/.bashrc file and add these lines

`alias rlint='docker-compose run --rm rails rake lint:fix'`
`alias rtest='docker-compose run --rm rails rake'`
`alias ytest='docker-compose run --rm webpacker yarn run test'`
`alias ylint='docker-compose run --rm webpacker yarn run lint'`

You can customize aliases according to your liking

### Pushing to Gitlab with HTTP
Gitlab requires to authenticate using the gitlab token to be able to push code.

Make sure you have the role of a maintainer to organization repository and confirm from your manager.

Go to your Gitlab Profile and click on `Access Tokens` tab and from here create a token.

Copy the token and in your terminal replace `mytoken` with your token. Run the command

`git remote set-url origin https://oauth2:<mytoken>@gitlab.com/doublegdp/app.git`

You should be good to push code and make your first merge request.

#### Before a merge/pull request

Before you submit a merge or pull request, please ensure that both
Rubocop, ESLint, and the tests pass.

`bin/all.sh`

#### Enable / Disable Community Feature

To ENABLE a feature for a community run:
```
docker-compose run --rm rails bundle exec rake enable_community_feature['CommunityName','Feature'] # NB: whitespace not allowed between arguments
```
To DISABLE a feature for a community run:
```
docker-compose run --rm rails bundle exec rake disable_community_feature['CommunityName','Feature'] # NB: whitespace not allowed between arguments
```

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
