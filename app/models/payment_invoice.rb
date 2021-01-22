# frozen_string_literal: true

# PaymentInvoice
class PaymentInvoice < ApplicationRecord
  belongs_to :payment
  belongs_to :invoice

  has_one :wallet_transaction
end
  