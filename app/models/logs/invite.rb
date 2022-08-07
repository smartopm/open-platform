# frozen_string_literal: true

module Logs
  # invites for hosts and guests
  class Invite < ApplicationRecord
    include SearchCop
    include QueryFetchable

    has_one :entry_time, as: :visitable, dependent: :destroy
    belongs_to :host, class_name: 'Users::User'
    belongs_to :guest, class_name: 'Users::User'
    belongs_to :entry_request

    enum status: { active: 0, cancelled: 1 }
    default_scope { order(created_at: :desc) }

    # rubocop:disable Style/RedundantInterpolation
    search_scope :search do
      attributes guest: ['guest.phone_number', 'guest.email', 'guest.name']

      generator :matches do |column_name, raw_value|
        pattern = "%#{raw_value}%"
        QueryFetchable.accent_insensitive_search(column_name, "#{quote pattern}")
      end
    end
    # rubocop:enable Style/RedundantInterpolation
  end
end
