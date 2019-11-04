# frozen_string_literal: true

# Handle all the user authentication here
class LoginController < ApplicationController
  before_action :find_user, except: [:index]

  def index
    # Present login options to the user
  end

  # POST with phone_number to verify
  def sms
    # Proceed with sms login
    unless @user
      flash[:error] = 'Phone number not found'
      return redirect_to login_path
    end
    @user.send_phone_token
    # Present form for entering in code
  end

  # POST with phone_number and verification code
  def sms_complete
    @user.verify_phone_token!(params[:token])
    sign_in(@user)
    redirect_to root_path
  rescue User::PhoneTokenResultInvalid
    flash[:error] = 'Invalid code'
    redirect_to login_sms_path
  rescue User::PhoneTokenResultExpired
    flash[:error] = 'This code has expired, please try again'
    redirect_to login_sms_path
  end

  private

  def find_user
    @user = User.find_via_phone_number(params[:phone_number])
  end
end
