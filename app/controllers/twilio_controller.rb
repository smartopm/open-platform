# frozen_string_literal: true

require 'host_env'

# Twilio controller
class TwilioController < ApplicationController
  include ApplicationHelper
  protect_from_forgery except: :webhook

  # rubocop:disable Metrics/MethodLength
  def webhook
    user = current_community.users.find_by(phone_number: params['WaId'])
    return if user.nil?

    # Check if there is a whatsapp task created by this user that's not resolved yet
    task = user.whatsapp_task
    # If there is a task then add comments to that task
    if task.present?
      create_comments(params, task)
    else
      # If there is no task then go ahead and create the task
      create_task(params, user)
    end
    send_qr_code(params, user)
  rescue StandardError => e
    Rollbar.error(e)
    head :ok
  end
  # rubocop:enable Metrics/MethodLength

  private

  def create_task(params, user)
    current_community.notes.create!(
      author_id: user.id,
      user_id: user.id,
      body: params['Body'],
      flagged: true,
      category: 'whatsapp',
      completed: false,
    )
  end

  def create_comments(params, task)
    task.note_comments.create!(
      note_id: task.id,
      body: params['Body'],
      user_id: task.user.id,
      status: 'active',
    )
  end

  def send_qr_code(params, user)
    # Attempt to get the most recent invitation for this user
    request = user.invites&.first&.entry_request
    base_url = HostEnv.base_url(current_community)
    # rubocop:disable Layout/LineLength
    qrcode_url = "https://api.qrserver.com/v1/create-qr-code/?data=#{CGI.escape("https://#{base_url}/request/#{request.id}?type=scan")}&size=256x256"
    # rubocop:enable Layout/LineLength
    # Here we check if a user replied to our message to request for the QR Code
    # send whatsapp message here
    return unless params['Body'] == I18n.t('general.accept_qrcode')

    Sms.send_whatsapp_message(params['WaId'], current_community, qrcode_url)
  end
end
