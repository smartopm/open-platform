# frozen_string_literal: true

# Our omniauth controller for Google oauth callbacks
class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def passthru
    redirect_to user_google_oauth2_omniauth_authorize_path
  end

  def google_oauth2
    @user = User.from_omniauth(request.env['omniauth.auth'])
    if @user.persisted?
      redirect_to "/google/#{@user.auth_token}"
    else
      session['devise.google_data'] = request.env['omniauth.auth']
    end
  end
end
