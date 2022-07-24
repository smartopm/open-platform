# frozen_string_literal: true
require 'twilio-ruby'

# Twilio controller
class TwilioController < ApplicationController
  include ApplicationHelper
  protect_from_forgery except: :webhook

    def webhook
      response = Twilio::TwiML::MessagingResponse.new
      response.message(body: "Hi #{params['ProfileName']}, Thank you for your message! A member of our team will be in touch with you soon.")
      user = current_community.users.find_by(phone_number: params['WaId'])
      # Check if there is a task created by this user
      task = current_community.notes.where(category: 'whatsapp', completed: false).find_by(author_id: user.id)
      # If there is a task then add comments to that task
      if task.present?
        create_comments(params, task)
      else
        # If there is no task then go ahead and create the task
        create_task(params, user)
      end
      # Respond to the user who's sent the message
      render xml: response
    rescue StandardError => e
      Rollbar.error(e)
      head :ok
    end

    # private
    def create_task(params, user)
     note = current_community.notes.create!(
        author_id: user.id,
        user_id: user.id,
        body: params['Body'],
        flagged: true,
        category: 'whatsapp',
        completed: false
      )
    # note.assign_or_unassign_user('1ce39aa1-57bd§-49e3-a3a8-6bc0d1446a5a')
    end

    def create_comments(params, task)
      comment = task.note_comments.create!(
        note_id: task.id,
        body: params['Body'],
        user_id: task.user.id,
        status: 'active'
      )
    end

end

