# frozen_string_literal: true

module Logs
  # invites for hosts and guests
  class Invite < ApplicationRecord
    include SearchCop

    has_one :entry_time, as: :visitable, dependent: :destroy
    belongs_to :host, class_name: 'Users::User'
    belongs_to :guest, class_name: 'Users::User'

    search_scope :search do
      attributes guest: ['guest.phone_number', 'guest.email', 'guest.name']
    end
  end
end
