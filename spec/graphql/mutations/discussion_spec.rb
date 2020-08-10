# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Discussion do
  describe 'creating a Discussion' do
    let!(:current_user) { create(:user_with_community, user_type: 'admin') }
    let!(:non_admin) { create(:user_with_community, user_type: 'resident') }
    let!(:guard) { create(:user_with_community, user_type: 'security_guard') }
    let(:query) do
      <<~GQL
        mutation discussionCreate(
          $title: String!
          $description: String
          $postId: String
        ) {
            discussionCreate(postId:$postId, title:$title, description:$description){
                discussion {
                id
                title
                postId
                userId
                description
                }
            }
          }
      GQL
    end

    it 'returns a created Discussion' do
      variables = {
        postId: '21',
        title: 'Welcome to Discussion',
        description: 'Lets finish it right now',
      }

      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: current_user,
                                                site_community: current_user.community,
                                              }).as_json
      expect(result.dig('data', 'discussionCreate', 'discussion', 'id')).not_to be_nil
      expect(result.dig('data', 'discussionCreate', 'discussion', 'title')).to include 'Welcome'
      expect(result.dig('data', 'discussionCreate', 'discussion', 'userId')).to eql current_user.id
      expect(result.dig('data', 'discussionCreate', 'discussion', 'postId')).to eql '21'
      expect(result.dig('data', 'discussionCreate', 'discussion', 'description')).to include 'Lets'
      expect(result.dig('errors')).to be_nil
    end

    it 'doesnt allow non admin users to create a discussion' do
      variables = {
        postId: '21',
        title: 'Welcome to Discussion',
        description: 'Lets finish it right now',
      }

      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: non_admin,
                                                site_community: non_admin.community,
                                              }).as_json
      expect(result.dig('data', 'discussionCreate', 'discussion', 'id')).to be_nil
      expect(result.dig('data', 'discussionCreate', 'discussion', 'userId')).to be_nil
      expect(result.dig('data', 'discussionCreate', 'discussion', 'postId')).to be_nil
      expect(result.dig('errors')).not_to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'Not authorized'
    end

    it 'returns error when not supplied properly' do
      variables = {
        titl: 'Welcome to Discussion',
        description: 'Lets finish it right now',
      }

      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: current_user,
                                                site_community: current_user.community,
                                              }).as_json
      expect(result.dig('errors')).not_to be_nil
      expect(result.dig('data', 'result', 'discussionCreate', 'discussion', 'id')).to be_nil
      expect(result.dig('errors', 0, 'message'))
        .to eql 'Variable title of type String! was provided invalid value'
    end
    it 'returns error when user is not resident, client or admin' do
      variables = {
        title: 'Welcome to Discussion',
        description: 'Lets finish it right now',
      }

      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: guard,
                                                site_community: guard.community,
                                              }).as_json
      expect(result.dig('errors')).not_to be_nil
      expect(result.dig('data', 'result', 'discussionCreate', 'discussion', 'id')).to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end
  end
end
