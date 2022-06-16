# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Amenity do
  describe 'Amenity queries' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:client_role) { create(:role, name: 'client') }
    let!(:permission) do
      create(:permission, module: 'amenity',
                          role: admin_role,
                          permissions: %w[can_access_amenities])
    end

    let!(:admin) { create(:user_with_community, role: admin_role, user_type: 'admin') }
    let!(:client) { create(:user_with_community, role: client_role, user_type: 'client') }
    let!(:amenity) do
      admin.community.amenities.create!(name: 'Some name', user: admin)
    end
    let(:amenities_query) do
      <<~GQL
        {
          amenities {
            id
            name
            description
            location
            hours
            invitationLink
          }
        }
      GQL
    end

    it 'should retrieve all amenities in current communities' do
      result = DoubleGdpSchema.execute(amenities_query, context: {
                                         current_user: admin,
                                         site_community: admin.community,
                                       }).as_json
      expect(result.dig('data', 'amenities', 0, 'id')).to eql amenity.id
      expect(result.dig('data', 'amenities').length).to eql 1
    end

    it 'should retrieve only when user is admin' do
      result = DoubleGdpSchema.execute(amenities_query, context: {
                                         current_user: client,
                                         site_community: client.community,
                                       }).as_json
      expect(result.dig('data', 'amenities')).to be_nil
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
    end
  end
end
