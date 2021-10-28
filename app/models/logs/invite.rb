# frozen_string_literal: true

module Logs
  # invites for hosts and guests
  class Invite < ApplicationRecord
    has_one :entry_time, as: :visitable, dependent: :destroy
    belongs_to :host, class_name: 'Users::User'
    belongs_to :guest, class_name: 'Users::User'
  end
end
