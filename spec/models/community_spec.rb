# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Community, type: :model do
  describe 'associations' do
    it { is_expected.to have_many(:users).class_name('Users::User').dependent(:destroy) }
    # Refer todo in model.
    # it { is_expected.to have_many(:roles).dependent(:destroy) }
    it { is_expected.to have_many(:event_logs).class_name('Logs::EventLog').dependent(:destroy) }
    it { is_expected.to have_many(:campaigns).dependent(:destroy) }
    it do
      is_expected
        .to have_many(:discussions)
        .class_name('Discussions::Discussion')
        .dependent(:destroy)
    end
    it { is_expected.to have_many(:labels).class_name('Labels::Label').dependent(:destroy) }
    it { is_expected.to have_many(:businesses).dependent(:destroy) }
    it { is_expected.to have_many(:entry_requests).dependent(:destroy) }
    it { is_expected.to have_many(:notes).class_name('Notes::Note').dependent(:destroy) }
    it { is_expected.to have_many(:forms).class_name('Forms::Form').dependent(:destroy) }
    it do
      is_expected
        .to have_many(:land_parcels)
        .class_name('Properties::LandParcel')
        .dependent(:destroy)
    end
    it { is_expected.to have_many(:accounts).class_name('Properties::Account').dependent(:destroy) }
    it do
      is_expected
        .to have_many(:notifications)
        .class_name('Notifications::Notification')
        .dependent(:destroy)
    end
    it do
      is_expected
        .to have_many(:action_flows)
        .class_name('ActionFlows::ActionFlow')
        .dependent(:destroy)
    end
    it { is_expected.to have_many(:comments).class_name('Comments::Comment').dependent(:destroy) }
    it { is_expected.to have_many(:post_tags).class_name('PostTags::PostTag').dependent(:destroy) }
    it { is_expected.to have_many(:invoices).class_name('Payments::Invoice').dependent(:destroy) }
    it do
      is_expected
        .to have_many(:email_templates)
        .class_name('Notifications::EmailTemplate')
        .dependent(:destroy)
    end
    it do
      is_expected
        .to have_many(:substatus_logs)
        .class_name('Logs::SubstatusLog')
        .dependent(:destroy)
    end
    it do
      is_expected
        .to have_many(:wallet_transactions)
        .class_name('Payments::WalletTransaction')
        .dependent(:destroy)
    end
    it { is_expected.to have_many(:payments).class_name('Payments::Payment').dependent(:destroy) }
    it { is_expected.to have_many(:import_logs).class_name('Logs::ImportLog').dependent(:destroy) }
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
