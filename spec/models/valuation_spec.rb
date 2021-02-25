# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Valuation, type: :model do
  let!(:user) { create(:user_with_community) }
  let!(:land_parcel) { create(:land_parcel, community_id: user.community_id) }

  describe 'schema' do
    it { is_expected.to have_db_column(:id).of_type(:uuid) }
    it { is_expected.to have_db_column(:start_date).of_type(:date) }
    it { is_expected.to have_db_column(:amount).of_type(:decimal) }
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:amount) }
    it { is_expected.to validate_presence_of(:start_date) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:land_parcel) }
  end

  describe 'scopes' do
    let!(:valuation) { create(:valuation, land_parcel_id: land_parcel.id) }

    it 'fetches the latest applicable valuation record' do
      expect(Valuation.latest.id).to eql valuation.id
    end
  end

  describe 'custom validations' do
    it 'fails validation with large amount' do
      valuation = described_class.create(
        amount: 20_000_000_000,
        start_date: 2.days.from_now,
        land_parcel: land_parcel,
      )

      expect(valuation).to_not be_valid
      expect(valuation.errors.messages[:amount]).to include('is too large')
    end

    it 'passes validation with small amount' do
      valuation = described_class.create(
        amount: 20_000,
        start_date: 2.days.from_now,
        land_parcel: land_parcel,
      )

      expect(valuation).to be_valid
      expect(valuation.errors.messages).to be_empty
    end
  end
end
