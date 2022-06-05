# frozen_string_literal: true

# Manages TransactionLog
module Payments
    # TransactionLog Record
    class TransactionLog < ApplicationRecord
      belongs_to :user, class_name: 'Users::User'
      belongs_to :community

      enum integration_type: { flutterwave: 0 }
      has_paper_trail
    end
  end
  