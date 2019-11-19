# frozen_string_literal: true

# Let's us notify slack asyncronously
class SlackNotification < ApplicationJob
  queue_as :default

  def perform(community, message)
    community.notify_slack(message)
  end
end
