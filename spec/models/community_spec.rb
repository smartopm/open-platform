# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Community, type: :model do
  it 'should be associated with users' do
    community = FactoryBot.create(:community)
    FactoryBot.create(:user, community: community)
    expect(community.users).to_not be_empty
  end
end
