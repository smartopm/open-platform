# frozen_string_literal: true

# Manages TransactionLog
module Payments
  # TransactionLog Record
  class TransactionLog < ApplicationRecord
    belongs_to :user, class_name: 'Users::User'
    belongs_to :community

    enum integration_type: { flutterwave: 0 }
    enum status: { pending: 0, successful: 1, failed: 2, cancelled: 3 }
    has_paper_trail
  end
end
