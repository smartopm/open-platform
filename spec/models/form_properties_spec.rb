# frozen_string_literal: true

require 'rails_helper'

RSpec.describe FormProperty, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:form_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:order).of_type(:string) }
    it { is_expected.to have_db_column(:field_name).of_type(:string) }
    it { is_expected.to have_db_column(:field_type).of_type(:integer) }
    it { is_expected.to have_db_column(:short_desc).of_type(:string) }
    it { is_expected.to have_db_column(:long_desc).of_type(:string) }
    it { is_expected.to have_db_column(:admin_use).of_type(:boolean) }
    it { is_expected.to have_db_column(:required).of_type(:boolean) }
    it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:form) }
    it { is_expected.to have_many(:user_form_properties) }
  end
end
