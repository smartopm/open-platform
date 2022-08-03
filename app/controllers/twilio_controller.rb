# frozen_string_literal: true

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
end
