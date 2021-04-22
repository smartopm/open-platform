# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Payments::Payment, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:id).of_type(:uuid) }
    it { is_expected.to have_db_column(:user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:invoice_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:amount).of_type(:decimal) }
    it { is_expected.to have_db_column(:payment_status).of_type(:integer) }
    it { is_expected.to have_db_column(:payment_type).of_type(:string) }
  end

  describe 'validations' do
    it do
      is_expected.to validate_inclusion_of(:payment_type).in_array(Payments::Payment::VALID_TYPES)
    end
  end

  describe 'associations' do
    it { is_expected.to belong_to(:user).class_name('Users::User') }
    it { is_expected.to belong_to(:community) }
    it { is_expected.to have_many(:payment_invoices).dependent(:destroy) }
    it { is_expected.to have_many(:invoices).through(:payment_invoices) }
  end
end
