# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Discussion::PostCreate do
  describe 'create a post for discussion' do
    let(:admin_role) { create(:role, name: 'admin') }
    let(:contractor_role) { create(:role, name: 'contractor') }
    let!(:admin_permission) do
      create(:permission, module: 'discussion',
                          role: admin_role,
                          permissions: %w[can_create_post can_set_accessibility])
    end
    let!(:contractor_permission) do
      create(:permission, module: 'discussion',
                          role: contractor_role,
                          permissions: %w[can_create_post])
    end
    let(:user) { create(:user_with_community) }

    let(:community) { user.community }
    let(:contractor) do
      create(:user,
             user_type: 'contractor',
             community_id: community.id,
             role: contractor_role)
    end

    let(:admin) do
      create(:admin_user, user_type: 'admin', community_id: community.id, role: admin_role)
    end
    let(:discussion) { create(:discussion, community: community, user_id: admin.id) }

    let(:image_blob) do
      file = fixture_file_upload(Rails.root.join('public/apple-touch-icon.png'), 'image/png')
      ActiveStorage::Blob.create_and_upload!(
        io: file,
        filename: 'test.jpg',
        content_type: 'image/jpg',
      )
    end

    let(:mutation) do
      <<~GQL
        mutation CreatePost($discussionId: ID!, $content: String, $imageBlobIds: [String!], $accessibility: String) {
          postCreate(content: $content, discussionId: $discussionId, imageBlobIds: $imageBlobIds, accessibility: $accessibility){
            post {
              content
              accessibility
              discussion {
                title
              }
              imageUrls
            }
          }
        }
      GQL
    end

    context 'when user is authorized and discussion is present' do
      it 'creates new post' do
        variables = {
          content: 'New Post',
          discussionId: discussion.id,
          imageBlobIds: [image_blob.signed_id],
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                   }).as_json
        expect(result['errors']).to be_nil
        expect(result.dig('data', 'postCreate', 'post', 'content')).to eql 'New Post'
      end
    end

    context 'when content and image blob ids are empty' do
      it 'raises content must exist error' do
        variables = { discussionId: discussion.id }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                   }).as_json
        expect(result['errors']).to_not be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Content must exist.'
      end
    end

    context 'when discussion is not present' do
      it 'raises discussion not found error' do
        variables = {
          content: 'New post',
          discussionId: '1234',
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                   }).as_json
        expect(result['errors']).to_not be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Discussion not found'
      end
    end

    context 'when user have permission to apply accessibility' do
      it 'creates post with accessibility' do
        variables = {
          content: 'New post',
          discussionId: discussion.id,
          accessibility: 'admins',
        }

        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                   }).as_json
        expect(result['errors']).to be_nil
        expect(result.dig('data', 'postCreate', 'post', 'accessibility')).to eql 'admins'
      end
    end

    context 'when user can create post but does not have permission to apply accessibility' do
      it 'raises error' do
        variables = {
          content: 'New post',
          discussionId: discussion.id,
          accessibility: 'admins',
        }

        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: contractor,
                                                     site_community: community,
                                                   }).as_json
        expect(result['errors']).to_not be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end

    context 'when accessibility is not valid' do
      it 'raises error' do
        variables = {
          content: 'New post',
          discussionId: discussion.id,
          accessibility: 'me',
        }

        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                   }).as_json
        error_message = 'Accessibility is not included in the list'
        expect(result['errors']).to_not be_nil
        expect(result.dig('errors', 0, 'message')).to eql error_message
      end
    end

    context 'when user is unauthorized' do
      it 'raises unauthorized error' do
        variables = {
          content: 'New post',
          discussionId: discussion.id,
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: user,
                                                     site_community: community,
                                                   }).as_json
        expect(result['errors']).to_not be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end
  end
end
