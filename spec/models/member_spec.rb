# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Member, type: :model do
  describe 'A member' do
    it 'should be associated properly with a user and a community' do
      user = FactoryBot.create(:user_with_membership)
      member = user.members.first
      expect(member.community).not_to be_nil
    end
  end
end
