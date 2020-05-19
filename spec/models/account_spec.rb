# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Account, type: :model do
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
    it { is_expected.to have_many(:land_parcel_accounts) }
    it { is_expected.to have_many(:land_parcels) }
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:community) }
  end
end
