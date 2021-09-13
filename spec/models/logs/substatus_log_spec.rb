# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Logs::SubstatusLog, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:id).of_type(:uuid) }
    it { is_expected.to have_db_column(:community_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:start_date).of_type(:datetime) }
    it { is_expected.to have_db_column(:stop_date).of_type(:datetime) }
    it { is_expected.to have_db_column(:previous_status).of_type(:string) }
    it { is_expected.to have_db_column(:new_status).of_type(:string) }
    it { is_expected.to have_db_column(:updated_by_id).of_type(:uuid) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:community) }
    it { is_expected.to belong_to(:user).class_name('Users::User') }
    it { is_expected.to belong_to(:updated_by).class_name('Users::User') }
  end
end
