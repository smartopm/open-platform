require 'rails_helper'

RSpec.describe Member, type: :model do
  describe 'A member' do
    it "should be associated properly with a user and a community" do
      member = FactoryBot.create(:member_with_community_and_roles)
      expect(member.community).not_to be_nil
      expect(member.role).not_to be_nil
    end
  end
end
