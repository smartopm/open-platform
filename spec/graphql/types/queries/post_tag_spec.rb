# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::PostTag do
  describe 'PostTag queries' do
    let!(:current_user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: current_user.community_id) }
    let!(:comm_post_tag) do
      current_user.community.post_tags.create(name: 'Architecture')
    end
    let!(:user_tag) { create(:post_tag_user, post_tag: comm_post_tag, user: current_user) }

    let(:user_tags_query) do
      <<~GQL
        {
            userTags(tagName: "#{comm_post_tag.name}"){
                id
                postTagId
                userId
            }
        }
      GQL
    end

    it 'should retrieve list of post tags a user is subscribed' do
      result = DoubleGdpSchema.execute(user_tags_query, context: {
                                         current_user: current_user,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('data', 'userTags')).to_not be_nil
      expect(result.dig('data', 'userTags', 'postTagId')).to eql comm_post_tag.id
      expect(result.dig('data', 'userTags', 'userId')).to eql current_user.id
    end

    it 'admin is not following any tag' do
      result = DoubleGdpSchema.execute(user_tags_query,
                                       context: {
                                         current_user: admin,
                                         site_community: admin.community,
                                       }).as_json
      expect(result.dig('data', 'userTags')).to be_nil
    end
  end
end
