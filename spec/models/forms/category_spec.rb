# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Forms::Category, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:id).of_type(:uuid) }
    it { is_expected.to have_db_column(:field_name).of_type(:string) }
    it { is_expected.to have_db_column(:description).of_type(:string) }
    it { is_expected.to have_db_column(:order).of_type(:integer) }
    it { is_expected.to have_db_column(:header_visible).of_type(:boolean) }
    it { is_expected.to have_db_column(:rendered_text).of_type(:text) }
    it { is_expected.to have_db_column(:general).of_type(:boolean).with_options(default: false) }
    it { is_expected.to have_db_column(:form_property_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:form_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:display_condition).of_type(:json) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:form) }
    it { is_expected.to have_many(:form_properties).dependent(:destroy) }
  end

  describe 'validations' do
    let!(:user) { create(:user_with_community) }
    let!(:form) { create(:form, community: user.community) }
    let!(:category) { create(:category, field_name: 'Business Info', form: form) }
    it do
      is_expected.to validate_presence_of(:field_name)
      is_expected.to validate_uniqueness_of(:field_name).scoped_to(:form_id)
    end
  end
end
