# frozen_string_literal: true

# Manages payments specific tasks.
module Payments
  # PaymentInvoice
  class PaymentInvoice < ApplicationRecord
    belongs_to :payment
    belongs_to :invoice
  end
end
