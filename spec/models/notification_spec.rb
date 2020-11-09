# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Notification, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:notifable_type).of_type(:string) }
    it { is_expected.to have_db_column(:seen_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:notifable_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:description).of_type(:string) }
    it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:community_id).of_type(:uuid) }
  end
end
