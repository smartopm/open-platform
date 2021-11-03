
require 'rails_helper'

RSpec.describe Logs::Invite, type: :model do
  let!(:current_user) { create(:user_with_community) }

  describe 'schema' do
    it { is_expected.to have_db_column(:id).of_type(:uuid) }
    it { is_expected.to have_db_column(:host_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:guest_id).of_type(:uuid) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:host).class_name('Users::User') }
    it { is_expected.to belong_to(:guest).class_name('Users::User')}
    it { is_expected.to have_one(:entry_time).dependent(:destroy)}
  end
end
