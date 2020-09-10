# frozen_string_literal: true

require 'rails_helper'
require 'comment_alert'

RSpec.describe User, type: :model do
  let!(:community) { create(:community, name: 'Nkwashi') }
  let!(:current_user) { create(:user_with_community, community_id: community.id) }
  let!(:another) { create(:user_with_community, community_id: community.id) }
  let!(:admin) { create(:admin_user, community_id: community.id) }

  let!(:user_discussion) do
    create(:discussion, user_id: current_user.id, community_id: current_user.community_id)
  end
  let!(:user_comments) do
    current_user.comments.create(content: 'This is an awesome comment',
                                 discussion_id: user_discussion.id)
  end
  # Test updated_discussions
  # Test list_subscribers

  it 'should find list of discussions that were commented on today' do
    # this returns a hash with templates and discussion ids
    discussions = CommentsAlert.updated_discussions('Nkwashi')
    expect(discussions[:discussion_ids]).not_to be_nil
    expect(discussions[:discussion_ids].length).to eql 1
  end
end
