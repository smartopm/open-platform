# frozen_string_literal: true

require 'deploy'

# Handle tag creation in Gitlab
class DeployJob < ApplicationJob
  queue_as :default

  def perform(gitlab_token)
    Deploy.create_tag!(gitlab_token)
  end
end
