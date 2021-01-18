# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Valuation, type: :model do
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
end
