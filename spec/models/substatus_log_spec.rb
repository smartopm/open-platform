# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SubstatusLog, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:id).of_type(:uuid) }
    it { is_expected.to have_db_column(:community_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:start_date).of_type(:datetime) }
    it { is_expected.to have_db_column(:stop_date).of_type(:datetime) }
    it { is_expected.to have_db_column(:previous_status).of_type(:string) }
    it { is_expected.to have_db_column(:new_status).of_type(:string) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:community) }
    it { is_expected.to belong_to(:user) }
  end
end
