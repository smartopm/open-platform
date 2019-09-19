# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Community, type: :model do
  it 'should be associated with members' do
    community = FactoryBot.create(:community)
    member = FactoryBot.build(:member)
    community.members << member
    expect(community.members).to_not be_empty
  end
end
