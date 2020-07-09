# frozen_string_literal: true

# Our omniauth controller for Google oauth callbacks
class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def passthru
    redirect_to user_google_oauth2_omniauth_authorize_path
  end

  def fblogin
    redirect_to user_facebook_omniauth_authorize_path
  end

  def google_oauth2
    @user = User.from_omniauth(request.env['omniauth.auth'], @site_community)
    if @user.persisted?
      @user.generate_events('user_login', @user)
      redirect_to "/google/#{@user.auth_token}"
    else
      session['devise.google_data'] = request.env['omniauth.auth']
    end
  end

  # facebook callback
  def facebook
    @user = User.from_omniauth(request.env['omniauth.auth'], @site_community)
    if @user.persisted?
      @user.generate_events('user_login', @user)
      redirect_to "/facebook/#{@user.auth_token}"
    else
      session['devise.facebook_data'] = request.env['omniauth.auth']
    end
  end
end
