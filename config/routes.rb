Rails.application.routes.draw do

  # GraphQL controller
  if Rails.env.development?
    mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql"
  end
  post "/graphql", to: "graphql#execute"
  get "/csv_export/event_logs", to: "csv_export#event_logs"

  # Oauth routes
  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }
  devise_scope :user do
    get 'login_oauth', :to => 'users/omniauth_callbacks#passthru'
  end

  get 'qr_code', to: 'home#qr_code'
  get 'hold', to: 'home#hold'
  get '*path', to: 'home#react', constraints: lambda { |req|
    req.path.exclude? 'rails/active_storage'
  }
  root 'home#react'
end
