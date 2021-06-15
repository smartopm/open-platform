# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Users::ActivityPoint, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:user) }
  end

  describe '#total' do
    it 'computes total of all logged points' do
      user = create(:user_with_community)
      activity_point = create(:activity_point, user: user, article_read: 2, referral: 10)
      expect(activity_point.total).to eq(12)
    end
  end
end
