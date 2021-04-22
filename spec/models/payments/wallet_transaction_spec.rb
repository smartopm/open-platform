# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Payments::WalletTransaction, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:id).of_type(:uuid) }
    it { is_expected.to have_db_column(:payment_plan_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:depositor_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:amount).of_type(:decimal) }
    it { is_expected.to have_db_column(:current_wallet_balance).of_type(:decimal) }
    it { is_expected.to have_db_column(:status).of_type(:integer) }
    it { is_expected.to have_db_column(:source).of_type(:string) }
    it { is_expected.to have_db_column(:destination).of_type(:string) }
    it { is_expected.to have_db_column(:bank_name).of_type(:string) }
    it { is_expected.to have_db_column(:cheque_number).of_type(:string) }
  end

  describe 'validations' do
    it do
      is_expected
        .to validate_inclusion_of(:source)
        .in_array(Payments::WalletTransaction::VALID_SOURCES)
    end
  end

  describe 'associations' do
    it { is_expected.to belong_to(:user).class_name('Users::User') }
    it { is_expected.to belong_to(:community) }
    it { is_expected.to belong_to(:depositor).class_name('Users::User').optional }
    it { is_expected.to belong_to(:payment_plan).class_name('Properties::PaymentPlan').optional }
    it { is_expected.to have_one(:payment_invoice).dependent(:destroy) }
  end

  describe 'callbacks' do
    it { is_expected.to callback(:revert_payments).after(:update) }
    it { is_expected.to callback(:update_wallet_balance).before(:update) }
  end
end
