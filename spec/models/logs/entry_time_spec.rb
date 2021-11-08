# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Logs::EntryTime, type: :model do
  let!(:current_user) { create(:user_with_community) }

  describe 'schema' do
    it { is_expected.to have_db_column(:id).of_type(:uuid) }
    it { is_expected.to have_db_column(:community_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:visitation_date).of_type(:datetime) }
    it { is_expected.to have_db_column(:visit_end_date).of_type(:datetime) }
    it { is_expected.to have_db_column(:starts_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:ends_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:occurs_on).of_type(:string) }
    it { is_expected.to have_db_column(:visitable_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:visitable_type).of_type(:string) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:community) }
    it { is_expected.to belong_to(:visitable) }
  end
end
