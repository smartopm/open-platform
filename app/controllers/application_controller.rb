# frozen_string_literal: true

class ApplicationController < ActionController::Base

  def new_session_path(scope)
    user_google_oauth2_omniauth_authorize_path
  end

end
