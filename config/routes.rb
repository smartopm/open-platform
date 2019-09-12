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

  root 'home#index'
end
