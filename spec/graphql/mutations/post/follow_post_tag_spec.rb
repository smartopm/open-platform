# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Post::FollowPostTag do
  describe 'FollowPostTag' do
    let!(:user) { create(:user_with_community) }
    let!(:comm_post_tag) do
      user.community.post_tags.create(name: 'Architecture')
    end

    let(:query) do
      <<~GQL
        mutation ($tagName: String!) {
            followPostTag(tagName: $tagName){
                postTagUser {
                    id
                }
            }
        }
      GQL
    end

    it 'follows or unfollows a post tag' do
      variables = {
        tagName: 'Architecture',
      }
      expect(user.post_tags.length).to eql 0
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                                site_community: user.community,
                                              }).as_json
      expect(result.dig('data', 'followPostTag', 'postTagUser', 'id')).to_not be_nil
    end

    it 'should not follow when tag does not exist' do
      variables = {
        tagName: 'Residency',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                                site_community: user.community,
                                              }).as_json
      expect(result.dig('data', 'followPostTag', 'postTagUser', 'id')).to be_nil
    end
  end
end
