# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Invoice, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:id).of_type(:uuid) }
    it { is_expected.to have_db_column(:community_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:land_parcel_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:created_by_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:amount).of_type(:float) }
    it { is_expected.to have_db_column(:note).of_type(:string) }
    it { is_expected.to have_db_column(:description).of_type(:string) }
    it { is_expected.to have_db_column(:invoice_number).of_type(:integer) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:community) }
    it { is_expected.to belong_to(:land_parcel) }
    it { is_expected.to belong_to(:created_by).optional }
  end
end
