# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Logs::Invite, type: :model do
  let!(:current_user) { create(:user_with_community) }

  describe 'schema' do
    it { is_expected.to have_db_column(:id).of_type(:uuid) }
    it { is_expected.to have_db_column(:host_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:guest_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:entry_request_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:status).of_type(:integer).with_options(default: :active) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:host).class_name('Users::User') }
    it { is_expected.to belong_to(:guest).class_name('Users::User') }
    it { is_expected.to have_one(:entry_time).dependent(:destroy) }
    it { is_expected.to belong_to(:entry_request) }
  end

  describe 'enums' do
    it do
      is_expected.to define_enum_for(:status)
        .with_values(active: 0, cancelled: 1)
    end
  end
end
