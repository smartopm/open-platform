# frozen_string_literal: true

# Handle all the user authentication here
class LoginController < ApplicationController
  before_action :find_user_by_phone, only: %i[sms sms_complete]
  before_action :find_user_by_id, only: %i[sms_one_time_login]
  before_action :ignore_logged_in, only: %i[sms_one_time_login]

  def index
    # Present login options to the user
  end

  # POST with phone_number to verify
  def sms
    @user.send_phone_token
    # Present form for entering in code
  end

  # POST with phone_number and verification code
  def sms_complete
    @user.verify_phone_token!(params[:token])
    sign_in(@user)
    redirect_to root_path
  rescue Users::User::PhoneTokenResultInvalid
    flash[:error] = 'Invalid code'
    redirect_to login_sms_path
  rescue Users::User::PhoneTokenResultExpired
    flash[:error] = 'This code has expired, please try again'
    redirect_to login_sms_path
  end

  # Login with a one time code that was sent to the user
  # GET /l/:user_id/:token
  def sms_one_time_login
    @user.verify_phone_token!(params[:token])
    sign_in(@user)
    redirect_to root_path
  rescue Users::User::PhoneTokenResultInvalid
    flash[:error] = 'Invalid code'
    redirect_to login_sms_path
  rescue Users::User::PhoneTokenResultExpired
    flash[:error] = 'This code has expired, please try again'
    redirect_to login_sms_path
  end

  private

  def find_user_by_phone
    @user = @current_community.users.find_by!(phone_number: params[:phone_number])
  rescue ActiveRecord::RecordNotFound
    flash[:error] = 'User not found'
    redirect_to login_path
  end

  def find_user_by_id
    @user = @current_community.users.find(params[:user_id])
  rescue ActiveRecord::RecordNotFound
    flash[:error] = 'User not found'
    redirect_to login_sms_path
  end

  # Let logged in users continue to use the one time passcode link
  def ignore_logged_in
    redirect_to root_path if current_user
  end
end
