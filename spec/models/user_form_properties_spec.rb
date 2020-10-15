# frozen_string_literal: true

require 'rails_helper'

RSpec.describe UserFormProperty, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:form_property_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:form_user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:value).of_type(:string) }
    it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:form_property) }
    it { is_expected.to belong_to(:form_user) }
    it { is_expected.to belong_to(:user) }
  end
end
