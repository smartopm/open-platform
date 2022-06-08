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
  end

  describe 'enums' do
    it do
      is_expected.to define_enum_for(:integration_type)
        .with_values(flutterwave: 0)
    end
  end

  describe 'associations' do
    it { is_expected.to belong_to(:user).class_name('Users::User') }
    it { is_expected.to belong_to(:community) }
  end
end
