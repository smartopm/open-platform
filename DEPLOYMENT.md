## Deployment on Heroku

1. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Login with `heroku login`
3. Create a new app: `heroku create <your-app-name>` - Skip this if you already have an app created
4. Register your app as the remote repository: `heroku git:remote --app <your-app-name>`
5. Add the necessary buildpacks:
```
heroku buildpacks:add --index 1 https://github.com/heroku/heroku-buildpack-activestorage-preview --app <your-app-name>
heroku buildpacks:add --index 2 heroku/nodejs --app <your-app-name>
heroku buildpacks:add --index 3 heroku/ruby --app <your-app-name>
```
6. Deploy the master branch: `git push heroku master`
