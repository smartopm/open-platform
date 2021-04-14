# frozen_string_literal: true

# PaymentInvoice
class PaymentInvoice < ApplicationRecord
  belongs_to :payment
  belongs_to :invoice
end
