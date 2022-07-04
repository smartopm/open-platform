# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Amenity::AmenityDelete do
  describe 'delete amenity entry' do
    let(:user) { create(:user_with_community) }
    let(:community) { user.community }
    let(:admin) { create(:admin_user, community: community) }
    let!(:permission) do
      create(:permission, module: 'amenity',
                          role: admin.role,
                          permissions: %w[can_delete_amenities])
    end
    let(:amenity) { create(:amenity, community: community, user: admin) }
    let(:mutation) do
      <<~GQL
        mutation amenityDelete(
          $id: ID!
          $status: String!
        ) {
          amenityDelete(
            id: $id
            status: $status
          ) {
            amenity{
              id
              name
            }
          }
        }
      GQL
    end

    context 'when amenity is deleted' do
      it 'updates amenity' do
        variables = { id:  amenity.id, status: 'deleted' }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                   })
        expect(result['errors']).to be_nil
        expect(result.dig('data', 'amenityDelete', 'amenity', 'id')).to eql amenity.id
      end
    end

    context 'when amenity does not exist' do
      it 'raises error' do
        variables = { id: '123', status: 'deleted' }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                   })
        expect(result['errors']).to_not be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Amenity not found'
      end
    end

    context 'when user is unauthorized' do
      it 'raises unauthorized error' do
        variables = { id: amenity.id, status: 'deleted' }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: user,
                                                     site_community: community,
                                                   })
        expect(result['errors']).to_not be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end
  end
end
