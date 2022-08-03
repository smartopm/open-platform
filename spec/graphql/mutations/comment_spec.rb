# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Comment do
  describe 'creating a Comment' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community.id) }
    let!(:another_community) { create(:community) }
    let!(:another_admin) do
      create(:user, user_type: 'admin', role: admin.role, community: another_community)
    end
    let!(:u_discussion) { create(:discussion, user_id: user.id, community_id: user.community_id) }
    let!(:user_comments) do
      user.comments.create(content: 'This is an awesome comment',
                           discussion_id: u_discussion.id, status: 'valid')
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

    let(:update_comment) do
      <<~GQL
        mutation updateComment($commentId: ID!, $discussionId: ID!, $status: String!){
          commentUpdate(commentId: $commentId, discussionId: $discussionId, status: $status){
            success
          }
        }
      GQL
    end

    it 'returns a created Comment' do
      variables = {
        discussionId: u_discussion.id,
        content: 'This is your first and last comment',
      }

      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                                site_community: admin.community,
                                              }).as_json
      expect(result.dig('data', 'commentCreate', 'comment', 'id')).not_to be_nil
      expect(result.dig('data', 'commentCreate', 'comment', 'content')).to include 'last comment'
      expect(result.dig('data', 'commentCreate', 'comment', 'userId')).to eql user.id
      expect(result.dig('data', 'commentCreate', 'comment', 'discussionId'))
        .to eql u_discussion.id
      expect(result['errors']).to be_nil
    end

    it 'should allow attaching images to a comment' do
      file = fixture_file_upload(Rails.root.join('public/apple-touch-icon.png'), 'image/png')
      image_blob = ActiveStorage::Blob.create_and_upload!(
        io: file,
        filename: 'test.jpg',
        content_type: 'image/jpg',
      )
      variables = {
        discussionId: u_discussion.id,
        content: 'This is your last comment',
        imageBlobId: image_blob.signed_id,
      }

      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                site_community: admin.community,
                                                current_user: user,
                                              }).as_json

      expect(result.dig('data', 'commentCreate', 'comment', 'imageUrl')).not_to be_nil
      expect(result.dig('data', 'commentCreate', 'comment',
                        'imageUrl')).to include image_blob.signed_id
      expect(result['errors']).to be_nil
    end

    it 'returns error when not supplied properly' do
      variables = {
        discussion_id: u_discussion.id,
        content: 'This is your first and last comment',
        status: 'deleted',
      }

      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                                site_community: admin.community,
                                              }).as_json
      expect(result['errors']).not_to be_nil
      expect(result.dig('data', 'commentCreate', 'comment', 'id')).to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'invalid value'
    end

    it 'does not allow non admin to delete comments' do
      variables = {
        discussionId: u_discussion.id,
        commentId: user_comments.id,
        status: 'deleted',
      }

      result = DoubleGdpSchema.execute(update_comment, variables: variables,
                                                       context: {
                                                         current_user: user,
                                                         site_community: admin.community,
                                                       }).as_json
      expect(result['errors']).not_to be_nil
      expect(result.dig('data', 'commentUpdate', 'success')).to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end

    it 'allows admins to delete comments' do
      variables = {
        discussionId: u_discussion.id,
        commentId: user_comments.id,
        status: 'deleted',
      }

      result = DoubleGdpSchema.execute(update_comment, variables: variables,
                                                       context: {
                                                         current_user: admin,
                                                         site_community: admin.community,
                                                       }).as_json
      expect(result['errors']).to be_nil
      expect(result.dig('data', 'commentUpdate', 'success')).to include 'updated'
    end

    it 'allows admins to delete comments' do
      variables = {
        discussion_Id: u_discussion.id,
        comment_Id: user_comments.id,
        status: 'deleted',
      }

      result = DoubleGdpSchema.execute(update_comment, variables: variables,
                                                       context: {
                                                         current_user: admin,
                                                         site_community: admin.community,
                                                       }).as_json
      expect(result['errors']).not_to be_nil
      expect(result.dig('data', 'commentUpdate', 'success')).to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'invalid value'
    end

    it 'does not allow admins from other community to delete comments' do
      variables = {
        discussionId: u_discussion.id,
        commentId: user_comments.id,
        status: 'deleted',
      }

      result = DoubleGdpSchema.execute(update_comment, variables: variables,
                                                       context: {
                                                         current_user: another_admin,
                                                         site_community: admin.community,
                                                       }).as_json
      expect(result['errors']).not_to be_nil
      expect(result.dig('data', 'commentUpdate', 'success')).to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end
  end
end
