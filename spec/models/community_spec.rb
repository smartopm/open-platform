# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Community, type: :model do
  describe 'associations' do
    it { is_expected.to have_many(:users) }
    it { is_expected.to have_many(:event_logs) }
    it { is_expected.to have_many(:campaigns) }
    it { is_expected.to have_many(:discussions) }
    it { is_expected.to have_many(:labels) }
  end

  it 'should be associated with users' do
    community = FactoryBot.create(:community)
    FactoryBot.create(:user, community: community)
    expect(community.users).to_not be_empty
  end
end
