# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Payments::Transaction, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:id).of_type(:uuid) }
    it { is_expected.to have_db_column(:user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:depositor_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:community_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:amount).of_type(:decimal) }
    it { is_expected.to have_db_column(:receipt_number).of_type(:string) }
    it { is_expected.to have_db_column(:status).of_type(:integer) }
    it { is_expected.to have_db_column(:source).of_type(:string) }
    it { is_expected.to have_db_column(:bank_name).of_type(:string) }
    it { is_expected.to have_db_column(:cheque_number).of_type(:string) }
    it { is_expected.to have_db_column(:originally_created_at).of_type(:datetime) }
  end

  describe 'enums' do
    it do
      is_expected.to define_enum_for(:status)
        .with_values(accepted: 0, pending: 1, denied: 2, cancelled: 3)
    end
  end

  describe 'validations' do
    it do
      is_expected.to validate_inclusion_of(:source)
        .in_array(Payments::Transaction::VALID_SOURCES)
    end
  end

  describe 'associations' do
    it { is_expected.to belong_to(:community) }
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:depositor).optional }
    it { is_expected.to have_many(:plan_payments) }
  end
end
