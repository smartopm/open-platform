require 'sidekiq/web'
Rails.application.routes.draw do

  mount Sidekiq::Web => '/sidekiq'

  # GraphQL controller
  if Rails.env.development?
    mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql"
  end
  post "/graphql", to: "graphql#execute"
  get "/csv_export/event_logs", to: "csv_export#event_logs"
  get "/csv_import_sample/download", to: "csv_export#download_sample_csv"
  post "/sendgrid/webhook/:token", to: "sendgrid#webhook"

  # Oauth routes
  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }
  devise_scope :user do
    get 'login_oauth', :to => 'users/omniauth_callbacks#passthru'
    get 'fb_oauth', :to => 'users/omniauth_callbacks#fblogin'
  end

  get 'qr_code', to: 'home#qr_code'
  get 'hold', to: 'home#hold'
  get '*path', to: 'home#react', constraints: lambda { |req|
    req.path.exclude? 'rails/active_storage'
  }
  root 'home#react'

  if Rails.env.test?
    namespace :cypress do
      delete 'cleanup', to: 'cleanup#destroy'

      resource :factories, only: %i[create]
    end
  end
end
