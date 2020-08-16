# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Comment do
  describe 'creating a Comment' do
    let!(:user) { create(:user_with_community) }
    let!(:user_discussion) do
      create(:discussion, user_id: user.id, community_id: user.community_id)
    end

    let(:query) do
      <<~GQL
        mutation commentCreate(
          $content: String!
          $discussionId: ID!
          $imageBlobId: String
        ) {
            commentCreate(discussionId:$discussionId, content:$content, imageBlobId: $imageBlobId){
                comment {
                id
                discussionId
                content
                userId
                imageUrl
                }
            }
          }
      GQL
    end

    it 'returns a created Comment' do
      variables = {
        discussionId: user_discussion.id,
        content: 'This is your first and last comment',
      }

      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                              }).as_json
      expect(result.dig('data', 'commentCreate', 'comment', 'id')).not_to be_nil
      expect(result.dig('data', 'commentCreate', 'comment', 'content')).to include 'last comment'
      expect(result.dig('data', 'commentCreate', 'comment', 'userId')).to eql user.id
      expect(result.dig('data', 'commentCreate', 'comment', 'discussionId'))
        .to eql user_discussion.id
      expect(result.dig('errors')).to be_nil
    end

    it 'should allow attaching images to a comment' do
      file = fixture_file_upload(Rails.root.join('public', 'apple-touch-icon.png'), 'image/png')
      image_blob = ActiveStorage::Blob.create_after_upload!(
        io: file,
        filename: 'test.jpg',
        content_type: 'image/jpg',
      )
      variables = {
        discussionId: user_discussion.id,
        content: 'This is your last comment',
        imageBlobId: image_blob.signed_id,
      }

      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                              }).as_json

      expect(result.dig('data', 'commentCreate', 'comment', 'imageUrl')).not_to be_nil
      expect(result.dig('data', 'commentCreate', 'comment',
                        'imageUrl')).to include image_blob.signed_id
      expect(result.dig('errors')).to be_nil
    end

    it 'returns error when not supplied properly' do
      variables = {
        discussion_id: user_discussion.id,
        content: 'This is your first and last comment',
      }

      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                              }).as_json
      expect(result.dig('errors')).not_to be_nil
      expect(result.dig('data', 'result', 'commentCreate', 'comment', 'id')).to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'invalid value'
    end
  end
end
