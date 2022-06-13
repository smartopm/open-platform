# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Campaign, type: :model do
  let!(:community) { create(:community) }

  describe '#clean_message' do
    let!(:campaign) do
      community.campaigns.new(community_id: community.id,
                              message: 'should replace strange double “ ' \
                              " and single quotes ’ with single quotes')")
    end

    context 'when non ascii quotes are used in message' do
      before { campaign.save }
      it 'is expected to replace strange double “ and single quotes ’ with single quotes' do
        expect(campaign.reload.message).not_to include '’'
        expect(campaign.message).not_to include '“'
      end
    end
  end

  describe 'associations' do
    it { is_expected.to belong_to(:community) }
    it { is_expected.to have_many(:labels).class_name('Labels::Label') }
    it do
      is_expected
        .to have_many(:campaign_labels)
        .class_name('Labels::CampaignLabel')
        .dependent(:destroy)
    end
    it { is_expected.to have_many(:messages).class_name('Notifications::Message') }
  end

  describe 'validations' do
    it { is_expected.to validate_inclusion_of(:campaign_type).in_array(%w[email sms]) }
  end

  describe '#run_campaign' do
    let!(:user) { create(:user, community: community, phone_number: '99999999', state: 'valid') }
    let!(:admin) { create(:admin_user, community: community) }
    let!(:campaign) do
      create(:campaign, community_id: community.id, campaign_type: 'sms',
                        status: 'draft', user_id_list: user.id.to_s)
    end

    before :each do
      community.update!(sub_administrator_id: admin.id)
      campaign.reload
    end
    context 'when run_campaign method is executed for sms campaigns' do
      before { campaign.run_campaign }

      it 'updates sends the campaign and update status of campaign to done' do
        expect(campaign.status).to eql 'done'
      end
    end

    context 'when run_campaign method is executed for email campaigns' do
      before do
        campaign.update(campaign_type: 'email')
        campaign.run_campaign
      end

      it 'updates sends the campaign and update status of campaign to done' do
        expect(campaign.status).to eql 'done'
      end
    end
  end

  describe '#send_messages' do
    let!(:user) { create(:user, community: community) }
    let!(:admin) { create(:admin_user, community: community) }
    let!(:campaign) do
      create(:campaign, community_id: community.id, campaign_type: 'sms',
                        status: 'draft')
    end
    before :each do
      community.update!(sub_administrator_id: admin.id)
      campaign.reload
    end

    context 'when status in nexemo result belongs to success codes' do
      it 'creates a new message' do
        prev_message_count = Notifications::Message.count
        allow(Sms).to receive(:send).and_return(OpenStruct.new({ messages: [campaign] }))

        campaign.send_messages(user)

        expect(Notifications::Message.count).to eq(prev_message_count + 1)
      end
    end

    context 'when status in nexemo result does not belongs to success codes' do
      it 'does not create the message' do
        prev_message_count = Notifications::Message.count
        allow(Sms).to receive(:send).and_return(OpenStruct.new({ messages: [] }))

        campaign.send_messages(user)

        expect(Notifications::Message.count).to eq prev_message_count
      end
    end
  end

  describe '#send_email' do
    let!(:user) { create(:user, community: community) }
    let!(:admin) { create(:admin_user, community: community) }
    let!(:template) { create(:email_template, community: community) }
    let!(:campaign) do
      create(:campaign,
             community_id: community.id, campaign_type: 'email',
             email_templates_id: template.id)
    end

    before :each do
      community.update!(sub_administrator_id: admin.id)
      campaign.reload
    end

    context 'when status code in sendgrid response is 202' do
      it 'creates a message' do
        prev_message_count = Notifications::Message.count
        template_data = [
          { key: '%community%', value: community.name },
          { key: '%logo_url%', value: '' },
          { key: '%message%', value: campaign.message },
        ]

        expect(EmailMsg).to receive(:send_mail_from_db).with(
          email: user.email,
          template: template,
          template_data: template_data,
          custom_key: 'campaign_id',
          custom_value: "#{campaign.id}*0",
        )
        allow(EmailMsg).to receive(:send_mail_from_db).and_return(
          OpenStruct.new(status_code: '202'),
        )
        campaign.send_email(user, 0)
        expect(Notifications::Message.count).to eq(prev_message_count + 1)
      end
    end

    context 'when status code in sendgrid response is not 202' do
      it 'does not create the message' do
        prev_message_count = Notifications::Message.count
        template_data = [
          { key: '%community%', value: community.name },
          { key: '%logo_url%', value: '' },
          { key: '%message%', value: campaign.message },
        ]

        expect(EmailMsg).to receive(:send_mail_from_db).with(
          email: user.email,
          template: template,
          template_data: template_data,
          custom_key: 'campaign_id',
          custom_value: "#{campaign.id}*0",
        )
        allow(EmailMsg).to receive(:send_mail_from_db).and_return(
          OpenStruct.new(status_code: '400'),
        )
        campaign.send_email(user, 0)
        expect(Notifications::Message.count).to eq prev_message_count
      end
    end
  end

  describe '#expired?' do
    let!(:user) { create(:user, community: community) }
    let!(:campaign) { create(:campaign, community_id: community.id, start_time: 10.days.ago) }

    context 'when start time of a campaign is 7+ days earlier from today' do
      it 'is expected to return true' do
        expect(campaign.expired?).to eq(true)
      end
    end

    context 'when start time of a campaign is 10 days from now' do
      before { campaign.update(start_time: 10.days.from_now) }
      it 'is expected to return false' do
        expect(campaign.expired?).to eq(false)
      end
    end
  end
end
