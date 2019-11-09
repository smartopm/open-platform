Rails.application.routes.draw do

  if Rails.env.development?
    mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql"
  end
  post "/graphql", to: "graphql#execute"
  get 'login', to: 'login#index'
  post 'login/sms'
  post 'login/sms_complete'
  get  'login/sms_complete/:user_id/:token', to: "login#sms_one_time_login"

  # Oauth routes
  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }
  devise_scope :user do
    get 'login_oauth', :to => 'users/omniauth_callbacks#passthru'
    get 'login', :to => 'login#index', :as => :new_user_session
    get 'logout', :to => 'devise/sessions#destroy', :as => :destroy_user_session
  end

  resources :users
  resources :members do
    resources :activity_logs, only: [:index]
  end
  resources :communities do
    resources :activity_logs, only: [:index]
  end

  resources :activity_logs, only: [:show, :create]

  get 'qr_code', to: 'home#qr_code'
  get 'hold', to: 'home#hold'
  get '*path', to: 'home#react', constraints: lambda { |req|
    req.path.exclude? 'rails/active_storage'
  }
  root 'home#react'
end
