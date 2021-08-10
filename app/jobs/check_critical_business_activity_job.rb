# frozen_string_literal: true

require 'nokogiri'
require 'json'
require 'net/http'
require 'email_msg'
require 'host_env'

# alert user if there is new posts related to the the tag a user is subscribed to
class CheckCriticalBusinessActivityJob < ApplicationJob
  queue_as :default
  def perform(communities)
    return unless Rails.env.production?

    
  end

  private
end
