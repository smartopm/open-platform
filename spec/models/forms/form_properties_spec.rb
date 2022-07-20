# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Forms::FormProperty, type: :model do
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
    it { is_expected.to have_db_column(:grouping_id).of_type(:uuid) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:form) }
    it { is_expected.to belong_to(:category) }
    it { is_expected.to have_many(:user_form_properties).dependent(:destroy) }
  end

  describe 'enums' do
    it do
      is_expected.to define_enum_for(:field_type)
        .with_values(text: 0, date: 1, file_upload: 2, signature: 3, display_text: 4,
                     display_image: 5, radio: 6, checkbox: 7, dropdown: 8, time: 9,
                     datetime: 10, payment: 11, appointment: 12)
    end
  end
end
