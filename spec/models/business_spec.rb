# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Business, type: :model do
  let!(:current_user) { create(:user_with_community) }

 describe 'crud' do
  it 'should allow to create a business' do
    current_user.businesses.create(name: "artist", community_id: current_user.community_id)
    expect(current_user.businesses.length).to eql 1
    expect(current_user.businesses[0].community_id).to eql current_user.community_id
    expect(current_user.businesses[0].user_id).to eql current_user.id
  end

  end
  describe 'associations' do
    it { is_expected.to belong_to(:community) }
    it { is_expected.to belong_to(:user) }
  end
end
