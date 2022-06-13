# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Properties::LandParcel, type: :model do
  let!(:current_user) { create(:admin_user) }
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

  describe 'enums' do
    it do
      is_expected.to define_enum_for(:status)
        .with_values(active: 0, deleted: 1, general: 2, planned: 3, in_construction: 4, built: 5)
    end
    it do
      is_expected.to define_enum_for(:object_type)
        .with_values(land: 0, poi: 1, house: 3)
    end
  end

  describe 'associations' do
    it { is_expected.to belong_to(:community) }
    it { is_expected.to have_many(:land_parcel_accounts).dependent(:destroy) }
    it { is_expected.to have_many(:accounts).through(:land_parcel_accounts) }
    it { is_expected.to have_many(:valuations).dependent(:destroy).inverse_of(:land_parcel) }
    it { is_expected.to have_many(:payment_plans).dependent(:destroy) }
  end
end
