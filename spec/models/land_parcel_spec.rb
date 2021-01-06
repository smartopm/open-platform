# frozen_string_literal: true

require 'rails_helper'

RSpec.describe LandParcel, type: :model do
  let!(:current_user) { create(:user_with_community, user_type: 'admin') }
  let!(:land_parcel) do
    create(:land_parcel, community_id: current_user.community_id)
  end

  describe 'schema' do
    it { is_expected.to have_db_column(:id).of_type(:uuid) }
    it { is_expected.to have_db_column(:parcel_number).of_type(:string) }
    it { is_expected.to have_db_column(:address1).of_type(:string) }
    it { is_expected.to have_db_column(:address2).of_type(:string) }
    it { is_expected.to have_db_column(:city).of_type(:string) }
    it { is_expected.to have_db_column(:postal_code).of_type(:string) }
    it { is_expected.to have_db_column(:state_province).of_type(:string) }
    it { is_expected.to have_db_column(:country).of_type(:string) }
    it { is_expected.to have_db_column(:parcel_type).of_type(:string) }
  end

  describe 'validations' do
    it { is_expected.to validate_uniqueness_of(:parcel_number) }
  end

  describe 'associations' do
    it { is_expected.to have_many(:land_parcel_accounts) }
    it { is_expected.to have_many(:accounts) }
    it { is_expected.to belong_to(:community) }
  end
end
