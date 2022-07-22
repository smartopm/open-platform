# frozen_string_literal: true
require 'twilio-ruby'

# Twilio controller
class TwilioController < ApplicationController
  include ApplicationHelper
  protect_from_forgery except: :webhook

    def webhook
      response = Twilio::TwiML::MessagingResponse.new
      response.message(body: "Hi #{params['ProfileName']}, Thank you for your message! A member of our team will be in touch with you soon.")
      puts "==================hrlllop========================"
      # "ProfileName": "OlivierJM",
      # "WaId": "260971500748",
      # "Body": "Test",

      user = current_community.users.find_by(phone_number: params['WaId'])
      puts user.to_json
      # Check if there is a task created by this user
      task = task_exists?(params['WaId'])
      puts "====================#{task}================"
      create_task(params) unless task
      # If there is a task then add comments to that task
      # If there is no task then go ahead and create the task
      render xml: response
    rescue StandardError => e
      Rollbar.error(e)
      head :ok
    end

    # private

    def task_exists?(phone_number)
      user = current_community.users.find_by(phone_number: phone_number)
      task = current_community.notes.find_by(author_id: user.id)
      task.present?
    end

    def create_task(params)
      user = current_community.users.find_by(phone_number: params['WaId'])
      current_community.notes.create!(
        author_id: user.id,
        body: params['Body'],
        flagged: true,
        category: 'whatsapp',
      )
    end


end

