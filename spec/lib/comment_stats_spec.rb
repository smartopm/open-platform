# frozen_string_literal: true

require 'rails_helper'
require 'comment_alert'

RSpec.describe Users::User, type: :model do
  let!(:community) do
    create(:community, name: 'Nkwashi', templates: {
             discussion_template_id: 'uuid123',
           })
  end
  let!(:current_user) { create(:user_with_community, community_id: community.id) }
  let!(:another) { create(:user, community_id: community.id, role: current_user.role) }
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

  before { Rails.env.stub(test?: false) }

  it 'should find list of discussions that were commented on today' do
    # this returns a hash with templates and discussion ids
    discussions = CommentsAlert.updated_discussions('Nkwashi')
    expect(discussions[:discussion_ids]).not_to be_nil
    expect(discussions[:discussion_ids].length).to eql 1
  end

  it 'sends email alert' do
    admin.discussions << user_discussion
    expect(EmailMsg).to receive(:send_mail).with(
      admin.email, 'uuid123', {
        community: 'Nkwashi',
        count: 0,
        discussions: Discussions::Discussion.where(id: user_discussion.id),
        name: admin.name,
      }
    )
    CommentsAlert.send_email_alert('Nkwashi')
  end
end
