require 'rails_helper'

RSpec.describe Community, type: :model do
  it "should be associated roles and members" do
    community = FactoryBot.create(:community_with_roles)
    member = FactoryBot.build(:member)
    community.members << member
    expect(community.members).to_not be_empty
    expect(community.roles).to_not be_empty
  end
end
