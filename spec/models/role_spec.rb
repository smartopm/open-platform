# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Role, type: :model do
  it 'should be associated communities and members' do
    role = FactoryBot.build(:role)
    community = FactoryBot.create(:community)
    community.roles << role
    expect(role.community).to eql community
    member = FactoryBot.create(:member, role: role, community: community)
    expect(role.members).to include(member)
  end
end
