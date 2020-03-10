# Deploying to Heroku

We have three Heroku instances:

- `double-gdp-fe` - Our Production server
- `double-gdp-staging` - Our Staging server (Tied to the production database)
- `double-gdp-dev` - Development instance, using it's own database

From this point on, it is assumed that you have installed the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

If you have the correct permissions, you can push to any of these. In order to deploy code to them, you must push to a master branch to their git repository.

You can setup a remote heroku git repository using the Heroku CLI.

`heroku git:remote -a double-gdp-staging` for example, will add the staging instance as a remote repository named `heroku`. You should rename this to something clearer, like heroku-staging. You can do this with `git` using the command `git remote rename heroku heroku-staging`

## Pushing a branch other than master

In some cases you made need to push a specific branch other than `master`, you can do this with the following `git` command - `git push heroku-staging mybranch:master -f`

Notice the `forced` push flag `-f`. You should never use this flag with Gitlab, but it's OK with Heroku, as we aren't using it as a code versioning system and overwriting history is not an issue.

## Procedures

Normally, you'll want to push to `staging`, ensure that things are working normally, then push to production.

### Running migrations

Migrations are tricky on Heroku. If you push to production and the code requires a migration, Rails will refuse to start until the migration is run. In order to avoid downtime, you should push to staging, run the migrations, then push to production.

#### Breaking migrations

Breaking migrations are migrations that would break the previous version of the codebase. For example, if we were to rename a field, and the previous version of the codebase relied on it, you could break the production version of the code. In cases like this, you may need to deploy the migration in steps, or schedule downtime in the application to make the changes.

### Rolling back changes

Heroku will let you rollback a release of the application if neccesary. The rollback is not based on git revision, but instead tied to a deployment version which is incremented each time you push a change to heroku.

To see a list of releases run:

`heroku releases --app double-gdp-fe`

To rollback to another version:

`heroku rollback vXX --app double-gdp-fe`

# Database

A full list of information about Heroku's Database Backups can be found [here](https://devcenter.heroku.com/articles/heroku-postgres-backups)

## Backing up the Database

`heroku pg:backups:capture --app double-gdp-fe`

Which can then be downloaded with:

`heroku pg:backups:download --app double-gdp-fe`

A list of backups can be obtained with:

`heroku pg:backups --app double-gdp-fe`

## Restoring the database

This should obvously be done with extreme caution:

`heroku pg:backups:restore bXXX DATABASE_URL --app double-gdp-fe`

# Debugging Heroku

The most important two commands for debugging on Heroku are

`heroku logs -t --app double-gdp-fe` - To display the logs

and

`heroku run rails console --app double-gdp-fe` - In order to drop into Rails console to do something like look at a database record or run a command

# Debugging the Front-end

## From the browser

The first place to look is inside of your browsers development console, specifically the Javascript Console, which can be reached from 'View > Developer > Javascript Console'

In the console you'll see any errors that may be happening.

## GraphQL

If you want to run a GraphQL query to test something out, you can use the [GraphiQL stand-alone program](https://electronjs.org/apps/graphiql). In order to get your authetication token, inside the Javascript Console on doublegdp.com, run `localStorage.getItem('dgdp_auth_token')`

The token can then be used in GraphiQL with the following header value:

`Authorization: "Bearer your_token_here"`
