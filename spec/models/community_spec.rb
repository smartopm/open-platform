# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Community, type: :model do
  describe 'associations' do
    it { is_expected.to have_many(:users) }
    it { is_expected.to have_many(:event_logs) }
    it { is_expected.to have_many(:campaigns) }
    it { is_expected.to have_many(:discussions) }
    it { is_expected.to have_many(:labels) }
    it { is_expected.to have_many(:transactions) }
    it { is_expected.to have_many(:plan_payments) }
  end

  it 'should be associated with users' do
    community = FactoryBot.create(:community)
    FactoryBot.create(:user, community: community)
    expect(community.users).to_not be_empty
  end

  it 'should be associated with users' do
    community = FactoryBot.create(:community)
    user = FactoryBot.create(:user, community: community)
    community.default_users = [user.id]
    community.save
    expect(community.default_users).to_not be_empty
  end

  describe '#notify_slack' do
    let!(:community) { create(:community, slack_webhook_url: 'https://something.com') }

    it 'invokes Slack class' do
      expect(Slack).to receive(:new).with(
        'https://something.com',
      )
      community.notify_slack('Helloo')
    end

    it "sends to Rollbar if there's exception" do
      err = StandardError.new('One stupid error!')
      allow(Slack).to receive(:new).and_raise(err)
      expect(Rollbar).to receive(:error).with(err)
      community.notify_slack('Helloo')
    end
  end
end
