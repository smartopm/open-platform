# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ImportLog, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:community_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:failed).of_type(:boolean) }
    it { is_expected.to have_db_column(:file_name).of_type(:string) }
    it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:community) }
    it { is_expected.to belong_to(:user) }
  end

  describe 'callbacks' do
    it { is_expected.to callback(:send_import_status_email).after(:create) }
  end

  describe '#import_error_message' do
    let!(:user) { create(:user_with_community) }
    let!(:import_log) do
      create(:import_log, failed: true, user: user, community: user.community,
                          file_name: 'name.csv', import_errors: '{"1":["User already exists"]}')
    end
    it 'does this' do
      expected_result = "The following errors occurred: <br><br>Row 1: <br>&nbsp; \
User already exists <br><br>Fix the errors and try again."
      actual_result = import_log.send(:import_error_message, '{"1":["User already exists"]}')
      expect(actual_result).to eq(expected_result)
    end
  end
end
