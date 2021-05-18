# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Campaign, type: :model do
  let!(:community) { create(:community) }

  describe 'community campaigns' do
    it 'should allow to create campaigns for the community' do
      community.campaigns.create(
        name: 'This is a Campaign',
        message: 'Visiting',
        campaign_type: 'sms',
        batch_time: '17/06/2020 03:49',
        user_id_list: '23fsafsafa1147,2609adf61sfsdfs871fd147,2saf60afsfdad9618af7114sfda7',
        subject: 'This is subject',
        pre_header: 'This is pre header',
        template_style: 'This is template style',
      )
      expect(community.campaigns.length).to eql 1
      expect(community.campaigns[0].community_id).to eql community.id
      expect(community.campaigns[0].message).to eql 'Visiting'
      expect(community.campaigns[0].name).to eql 'This is a Campaign'
      expect(community.campaigns[0].campaign_type).to eql 'sms'
      expect(community.campaigns[0].subject).to eql 'This is subject'
      expect(community.campaigns[0].pre_header).to eql 'This is pre header'
      expect(community.campaigns[0].template_style).to eql 'This is template style'
      expect(community.campaigns[0].include_reply_link).to be_falsy
      expect(community.campaigns[0].campaign_metrics[:batch_time]).to be_truthy
      expect(community.campaigns[0].campaign_metrics[:start_time]).to be_nil
      expect(community.campaigns[0].campaign_metrics[:end_time]).to be_nil
      expect(community.campaigns[0].campaign_metrics[:total_scheduled]).to eql 3
      expect(community.campaigns[0].campaign_metrics[:total_sent]).to eql 0
      expect(community.campaigns[0].campaign_metrics[:total_clicked]).to eql 0
    end

    it 'should replace strange double “ and single quotes ’ with single quotes' do
      campaign = FactoryBot.create(:campaign, community_id: community.id, campaign_type: 'sms')
      campaign.message = 'should replace strange double “ and single quotes ’ with single quotes'
      campaign.save
      expect(campaign.message).not_to include '’'
      expect(campaign.message).not_to include '“'
    end
  end

  describe 'associations' do
    it { is_expected.to belong_to(:community) }
    it { is_expected.to have_many(:labels) }
    it { is_expected.to have_many(:campaign_labels) }
    it { is_expected.to have_many(:messages) }
  end

  describe 'validations' do
    it { is_expected.to validate_inclusion_of(:campaign_type).in_array(%w[email sms]) }
  end

  describe '#send_messages' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community: user.community) }
    let!(:campaign) { create(:campaign, community_id: user.community.id, campaign_type: 'sms') }

    it 'creates a new message' do
      prev_message_count = Message.count
      allow(Sms).to receive(:send).and_return(OpenStruct.new({ messages: [] }))

      campaign.send_messages(admin, user)

      expect(Message.count).to eq(prev_message_count + 1)
    end
  end

  describe '#send_email' do
    let!(:user) { create(:user_with_community) }
    let!(:template) { create(:email_template, community: user.community) }
    let!(:campaign) do
      create(:campaign,
             community_id: user.community.id, campaign_type: 'email',
             email_templates_id: template.id)
    end

    it 'invokes send_mail_from_db on EmailMsg' do
      template_data = [
        { key: '%community%', value: user.community.name },
        { key: '%logo_url%', value: '' },
        { key: '%message%', value: campaign.message },
      ]

      expect(EmailMsg).to receive(:send_mail_from_db).with(
        'nurudeen@gmail.com',
        template,
        template_data,
      )
      campaign.send_email('nurudeen@gmail.com')
    end
  end

  describe '#run_campaign' do
    let!(:user) { create(:user_with_community, name: 'Mutale Chibwe', state: 'valid') }
    let!(:campaign) { create(:campaign, community_id: user.community.id) }

    it 'invokes CampaignMetricsJob' do
      expect(CampaignMetricsJob).to receive(:set).with(
        wait: 2.hours,
      ).and_return(CampaignMetricsJob)
      campaign.run_campaign
    end
  end

  describe '#expired?' do
    let!(:user) { create(:user_with_community) }

    it 'returns true' do
      campaign = create(:campaign, community_id: user.community.id, start_time: 10.days.ago)
      expect(campaign.expired?).to eq(true)
    end

    it 'returns false' do
      campaign = create(:campaign, community_id: user.community.id, start_time: 10.days.from_now)
      expect(campaign.expired?).to eq(false)
    end
  end
end
