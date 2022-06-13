# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Logs::LeadLog, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:id).of_type(:uuid) }
    it { is_expected.to have_db_column(:user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:community_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:acting_user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:name).of_type(:string) }
    it { is_expected.to have_db_column(:log_type).of_type(:integer) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:community) }
    it { is_expected.to belong_to(:user).class_name('Users::User') }
    it { is_expected.to belong_to(:acting_user).class_name('Users::User') }
  end

  describe '#enums' do
    it do
      is_expected.to define_enum_for(:log_type)
        .with_values(
          event: 0, meeting: 1, signed_deal: 2, lead_status: 3,
        )
    end
  end
end
