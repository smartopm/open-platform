# frozen_string_literal: true

require 'rails_helper'

RSpec.describe FormUser, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:form_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:status_updated_by_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:status).of_type(:integer) }
    it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:form) }
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:status_updated_by) }
    it { is_expected.to have_many(:user_form_properties) }
  end
end
