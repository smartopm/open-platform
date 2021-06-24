# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Payments::PlanPayment, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:id).of_type(:uuid) }
    it { is_expected.to have_db_column(:amount).of_type(:decimal) }
    it { is_expected.to have_db_column(:status).of_type(:integer) }
    it { is_expected.to have_db_column(:transaction_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:community_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:payment_plan_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:manual_receipt_number).of_type(:string) }
    it { is_expected.to have_db_column(:automated_receipt_number).of_type(:integer) }
  end

  describe 'enums' do
    it do
      is_expected.to define_enum_for(:status).with_values(paid: 0, cancelled: 1)
    end
  end

  describe 'validations' do
    it { is_expected.to validate_numericality_of(:amount).is_greater_than(0) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:user_transaction) }
    it { is_expected.to belong_to(:user).class_name('Users::User') }
    it { is_expected.to belong_to(:community) }
    it { is_expected.to belong_to(:payment_plan).class_name('Properties::PaymentPlan') }
  end
end
