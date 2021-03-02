# frozen_string_literal: true

require 'rails_helper'

RSpec.describe WalletTransaction, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:id).of_type(:uuid) }
    it { is_expected.to have_db_column(:user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:depositor_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:amount).of_type(:float) }
    it { is_expected.to have_db_column(:current_wallet_balance).of_type(:float) }
    it { is_expected.to have_db_column(:status).of_type(:integer) }
    it { is_expected.to have_db_column(:source).of_type(:string) }
    it { is_expected.to have_db_column(:destination).of_type(:string) }
    it { is_expected.to have_db_column(:bank_name).of_type(:string) }
    it { is_expected.to have_db_column(:cheque_number).of_type(:string) }
  end

  describe 'validations' do
    it { is_expected.to validate_inclusion_of(:source).in_array(WalletTransaction::VALID_SOURCES) }
  end

  describe 'associations' do
    it { is_expected.to have_one(:payment_invoice) }
  end
end
