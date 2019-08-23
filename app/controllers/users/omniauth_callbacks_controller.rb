# frozen_string_literal: true

# Our omniauth controller for Google oauth callbacks
class Users
  # Handles all our Oauth requestsh
  class OmniauthCallbacksController < Devise::OmniauthCallbacksController
    def passthru
      redirect_to user_google_oauth2_omniauth_authorize_path
    end

    def google_oauth2
      @user = User.from_omniauth(request.env['omniauth.auth'])
      if @user.persisted?
        sign_in @user, event: :authentication # this will throw if @user is not activated
        set_flash_message(:notice, :success, kind: 'Google') if is_navigational_format?
      else
        session['devise.google_data'] = request.env['omniauth.auth']
      end
      redirect_to '/'
    end
  end
end
