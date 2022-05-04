# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Discussion::PostCreate do
  describe 'deletes post image' do
    let(:admin_role) { create(:role, name: 'admin') }
    let!(:permission) do
      create(:permission, module: 'discussion',
                          role: admin_role,
                          permissions: %w[can_delete_post_image])
    end

    let(:user) { create(:user_with_community) }
    let(:community) { user.community }
    let!(:admin) do
      create(:admin_user, user_type: 'admin', community_id: community.id, role: admin_role)
    end
    let(:discussion) { create(:discussion, community: community, user_id: admin.id) }
    let!(:post) { create(:post, community: community, discussion: discussion, user: admin) }

    let!(:blob) do
      ActiveStorage::Blob.create(filename: 'image.jpg', content_type: 'application',
                                 byte_size: 2123, checksum: '9JiwSyvzZeqDSV')
    end
    let!(:image) { post.images.create(blob_id: blob.id) }

    let(:mutation) do
      <<~GQL
        mutation PostImageDelete($imageId: ID!){
          postImageDelete(imageId: $imageId){
            success
          }
        }
      GQL
    end

    context 'when user is authorized and image is present' do
      it 'deletes post image' do
        variables = { imageId: image.id }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                     user_role: admin.role,
                                                   }).as_json
        expect(result['errors']).to be_nil
        expect(result.dig('data', 'postImageDelete', 'success')).to eql true
      end
    end

    context 'when image is not present' do
      it 'raises attachment not found error' do
        variables = { imageId: '1234' }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                     user_role: admin.role,
                                                   }).as_json
        expect(result['errors']).to_not be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Attachment not found'
      end
    end

    context 'when user is unauthorized' do
      it 'raises unauthorized error' do
        variables = { imageId: image.id }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: user,
                                                     site_community: community,
                                                     user_role: user.role,
                                                   }).as_json
        expect(result['errors']).to_not be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end
  end
end
