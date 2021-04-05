# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Payment, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:id).of_type(:uuid) }
    it { is_expected.to have_db_column(:user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:invoice_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:amount).of_type(:float) }
    it { is_expected.to have_db_column(:payment_status).of_type(:integer) }
    it { is_expected.to have_db_column(:payment_type).of_type(:string) }
  end

  describe 'validations' do
    it { is_expected.to validate_inclusion_of(:payment_type).in_array(Payment::VALID_TYPES) }
  end

  describe 'associations' do
    it { is_expected.to have_many(:invoices) }
  end

  describe 'callbacks' do
    it { is_expected.to callback(:set_precision).before(:save) }
  end
end
