# frozen_string_literal: true

module Logs
  # Lead logs
  class LeadLog < ApplicationRecord
    belongs_to :community
    belongs_to :user, class_name: 'Users::User'
    belongs_to :acting_user, class_name: 'Users::User'

    default_scope { order(created_at: :desc) }

    enum log_type: { event: 0, meeting: 1, signed_deal: 2 }
  end
end
