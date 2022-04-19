# frozen_string_literal: true

module Logs
  class LeadLog < ApplicationRecord
    belongs_to :community
    belongs_to :user, class_name: 'Users::User'

    enum log_type: { event: 0, meeting: 1, signed_deal: 2 }
  end
end
