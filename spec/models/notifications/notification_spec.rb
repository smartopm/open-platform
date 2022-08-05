# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Notifications::Notification, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:notifable_type).of_type(:string) }
    it { is_expected.to have_db_column(:seen_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:notifable_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:description).of_type(:string) }
    it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:community_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:url).of_type(:string) }
  end
  describe 'Associations' do
    it { is_expected.to belong_to(:notifable) }
  end

  describe 'enums' do
    it do
      is_expected.to define_enum_for(:category)
        .with_values(
          task: 0, comment: 1, reply_requested: 2, message: 3,
        )
    end
  end
end
