# frozen_string_literal: true

# Twilio controller
class TwilioController < ApplicationController
    include ApplicationHelper
    protect_from_forgery except: :webhook

    def webhook
      signature = request.headers
      puts "=========================================="
      puts signature
      puts params.inspect
    rescue StandardError => e
      Rollbar.error(e)
    #   head :ok
    end
end
