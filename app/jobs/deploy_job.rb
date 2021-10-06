# frozen_string_literal: true

require 'deploy'

# Handle tag creation in Gitlab
class DeployJob < ApplicationJob
  queue_as :default

  def perform
    return unless Rails.env.production?
    Deploy.create_tag!
  end
end
