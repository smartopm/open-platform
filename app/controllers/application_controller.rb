# frozen_string_literal: true

# Primary ApplicationController
class ApplicationController < ActionController::Base
  helper_method :current_member

  def new_session_path(_scope)
    user_google_oauth2_omniauth_authorize_path
  end

  # For now we can assume that each user is just a member of one community
  def current_member
    current_user.members.first if current_user&.members
  end

  def authenticate_member!
    authenticate_user!
    # Keep out any user that not a member of a community
    redirect_to '/hold' unless current_member
  end
end
