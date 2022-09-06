# frozen_string_literal: true

# Method responsible for handling sendgrid inbound emails
class SendgridController < ApplicationController
  skip_before_action :verify_authenticity_token, if: :valid_webhook_token?

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  def webhook
    begin
      # email comes like this "user <user@gdp.com>" we need email and name separately
      user_email = params['from']
      name, email = user_email.split(/\s*<|>/)
      message_body = "#{params['subject']} \n \n #{params['text']}"
      # Find a user
      sender = @current_community.users.find_by(email: email)
      if sender.nil?
        user = @current_community.users.create!(name: name, email: email, user_type: 'visitor')
        generate_msg_and_assign(user, message_body)
      end

      generate_msg_and_assign(sender, message_body)
    rescue StandardError => e
      render(json: { status: 400, error: e }) && (return)
    end
    render json: { status: 200 }
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength

  private

  def valid_webhook_token?
    params[:token] == ENV['SENDGRID_WEBHOOK_TOKEN']
  end

  def generate_msg_and_assign(user, body)
    options = {
      user_id: user.id,
      category: 'email',
      message: body,
    }
    message = user.construct_message(options)
    message.create_message_task(body)
  end
end
