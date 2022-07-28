# frozen_string_literal: true

# Our omniauth controller for Google oauth callbacks
class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  skip_before_action :verify_authenticity_token, only: %i[google_oauth2 facebook]

  def passthru
    redirect_post(
      user_google_oauth2_omniauth_authorize_path,
      options: { authenticity_token: :auto },
    )
  end

  def fblogin
    redirect_post(
      user_facebook_omniauth_authorize_path,
      options: { authenticity_token: :auto },
    )
  end

  def google_oauth2
    @user = Users::User.from_omniauth(request.env['omniauth.auth'], @current_community)
    if @user.persisted?
      @user.generate_events('user_login', @user)
      redirect_to URI.parse(url_for("/google/#{@user.auth_token}")).path
    else
      session['devise.google_data'] = request.env['omniauth.auth']
    end
  end

  # facebook callback
  def facebook
    @user = Users::User.from_omniauth(request.env['omniauth.auth'], @current_community)
    if @user.persisted?
      @user.generate_events('user_login', @user)
      redirect_to URI.parse(url_for("/facebook/#{@user.auth_token}")).path
    else
      session['devise.facebook_data'] = request.env['omniauth.auth']
    end
  end
end
