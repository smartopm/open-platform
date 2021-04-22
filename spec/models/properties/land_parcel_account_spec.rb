# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Properties::LandParcelAccount, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:land_parcel_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:account_id).of_type(:uuid) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:land_parcel).dependent(:destroy) }
    it { is_expected.to belong_to(:account).dependent(:destroy) }
  end
end
