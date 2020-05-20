# frozen_string_literal: true

require 'rails_helper'

RSpec.describe LandParcelAccount, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:land_parcel_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:account_id).of_type(:uuid) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:land_parcel) }
    it { is_expected.to belong_to(:account) }
  end
end
