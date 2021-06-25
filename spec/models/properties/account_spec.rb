# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Properties::Account, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:id).of_type(:uuid) }
    it { is_expected.to have_db_column(:full_name).of_type(:string) }
    it { is_expected.to have_db_column(:address1).of_type(:string) }
    it { is_expected.to have_db_column(:address2).of_type(:string) }
    it { is_expected.to have_db_column(:city).of_type(:string) }
    it { is_expected.to have_db_column(:postal_code).of_type(:string) }
    it { is_expected.to have_db_column(:state_province).of_type(:string) }
    it { is_expected.to have_db_column(:country).of_type(:string) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:user).class_name('Users::User') }
    it { is_expected.to belong_to(:community) }
    it { is_expected.to have_many(:land_parcel_accounts).dependent(:destroy) }
    it { is_expected.to have_many(:land_parcels).through(:land_parcel_accounts) }
  end
end
