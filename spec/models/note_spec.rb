# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Note, type: :model do
  let!(:current_user) { create(:user_with_community) }
  let!(:admin) { create(:admin_user, community_id: current_user.community_id) }

  it 'should let an admin create a note for a user' do
    current_user.notes.create(author_id: admin.id, body: 'Test Note')
    expect(current_user.notes.length).to eql 1
  end
end
