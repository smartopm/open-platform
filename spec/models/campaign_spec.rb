# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Campaign, type: :model do
  let!(:community) { create(:community) }

  describe 'community campaigns' do
    it 'should allow to create campaigns for the community' do
      community.campaigns.create(
        name: 'This is a Campaign',
        message: 'Visiting',
        batch_time: '17/06/2020 03:49',
        user_id_list: '23fsafsafa1147,2609adf61sfsdfs871fd147,2saf60afsfdad9618af7114sfda7',
      )
      expect(community.campaigns.length).to eql 1
      expect(community.campaigns[0].community_id).to eql community.id
      expect(community.campaigns[0].message).to eql 'Visiting'
      expect(community.campaigns[0].name).to eql 'This is a Campaign'
    end
  end
  describe 'associations' do
    it { is_expected.to belong_to(:community) }
    it { is_expected.to have_many(:labels) }
    it { is_expected.to have_many(:campaign_labels) }
  end
end
