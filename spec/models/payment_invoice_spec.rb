# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PaymentInvoice, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:invoice_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:payment_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:wallet_transaction_id).of_type(:uuid) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:invoice) }
    it { is_expected.to belong_to(:payment) }
  end
end
