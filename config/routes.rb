Rails.application.routes.draw do

  get 'login', to: 'login#index'
  post 'login/sms'
  post 'login/sms_complete'

  # Oauth routes
  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }
  devise_scope :user do
    get 'login_oauth', :to => 'users/omniauth_callbacks#passthru', :as => :new_user_session
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


  get 'id/:token', to: 'members#id_card', as: :member_id
  get 'id_verify/:token', to: 'members#id_verify', as: :member_id_verify

  get 'scan', to: 'home#scan'
  get 'hold', to: 'home#hold'
  root 'home#index'
end
