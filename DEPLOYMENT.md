## Deployment on Heroku

1. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Login with `heroku login`
3. Create a new app: `heroku create --stack heroku-20 <your-app-name>` - Skip this if you already have an app created. Also note that heroku stack 20 is used here because this app still runs on Ruby 2, you should upgrade to Ruby 3 to run on latest Heroku stack.
4. Register your app as the remote repository: `heroku git:remote --app <your-app-name>`
5. Add the necessary buildpacks:
```
heroku buildpacks:add --index 1 https://github.com/heroku/heroku-buildpack-activestorage-preview --app <your-app-name>
heroku buildpacks:add --index 2 heroku/nodejs --app <your-app-name>
heroku buildpacks:add --index 3 heroku/ruby --app <your-app-name>
```
5. Set RACK_ENV and HOST: `heroku config:set RACK_ENV=production HOST=production --app <your-app-name>`
6. Deploy the master branch: `git push heroku master`
7. Load database schema: `heroku run rake db:schema:load --app <your-app-name>`
8. Create your community: `heroku run rake db:create_community[your-community-name] --app <your-app-name>`
9. Create a default admin user: `heroku run rake db:create_default_admin[email,username,password] --app <your-app-name>`
10. Set necessary secret keys as explained here. `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are required to load the app.
