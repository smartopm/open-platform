# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Payments::TransactionLog, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:id).of_type(:uuid) }
    it { is_expected.to have_db_column(:user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:community_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:amount).of_type(:decimal) }
    it { is_expected.to have_db_column(:paid_amount).of_type(:decimal) }
    it { is_expected.to have_db_column(:invoice_number).of_type(:string) }
    it { is_expected.to have_db_column(:integration_type).of_type(:integer) }
    it { is_expected.to have_db_column(:transaction_id).of_type(:string) }
    it { is_expected.to have_db_column(:transaction_ref).of_type(:string) }
    it { is_expected.to have_db_column(:description).of_type(:string) }
    it { is_expected.to have_db_column(:currency).of_type(:string) }
    it { is_expected.to have_db_column(:account_name).of_type(:string) }
    it { is_expected.to have_db_column(:meta_data).of_type(:json) }
    it { is_expected.to have_db_column(:payment_link).of_type(:string) }
    it do
      is_expected.to have_db_column(:status).of_type(:integer).with_options(default: :pending)
    end
  end

  describe 'enums' do
    it { is_expected.to define_enum_for(:integration_type).with_values(flutterwave: 0) }
    it do
      is_expected.to define_enum_for(:status)
        .with_values(pending: 0, successful: 1, failed: 2, cancelled: 3)
    end
  end

  describe 'associations' do
    it { is_expected.to belong_to(:user).class_name('Users::User') }
    it { is_expected.to belong_to(:community) }
  end
end
