# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Wallet, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:id).of_type(:uuid) }
    it { is_expected.to have_db_column(:user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:balance).of_type(:float) }
    it { is_expected.to have_db_column(:pending_balance).of_type(:float) }
    it { is_expected.to have_db_column(:currency).of_type(:string) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:user) }
  end
end
