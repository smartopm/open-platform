# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Amenity::AmenityCreate do
  describe 'create amenity entry' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:client_role) { create(:role, name: 'client') }
    let!(:permission) do
      create(:permission, module: 'amenity',
                          role: admin_role,
                          permissions: %w[can_create_amenity])
    end

    let!(:admin) { create(:user_with_community, role: admin_role, user_type: 'admin') }
    let!(:client) { create(:user_with_community, role: client_role, user_type: 'client') }

    let(:create_amenity) do
      <<~GQL
        mutation amenityCreate(
          $name: String!
          $description: String
          $location: String!
          $hours: String!
          $invitationLink: String
        ) {
          amenityCreate(
            name: $name
            description: $description
            location: $location
            hours: $hours
            invitationLink: $invitationLink
          ) {
            success
          }
        }
      GQL
    end

    describe '#resolve' do
      context 'create amenity by admin' do
        it 'creates a record with correct variable and right permission' do
          variables = {
            name: 'Test Name',
            description: 'mock description',
            location: '20 lsk',
            hours: '20:00',
            invitationLink: 'http://calendly.com',
          }
          result = DoubleGdpSchema.execute(create_amenity,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: admin.community,
                                           }).as_json
          expect(result['errors']).to be_nil
          expect(result.dig('data', 'amenityCreate', 'success')).to eql true
        end
        it 'throws an error when wrong data is provided' do
          variables = {
            name: 'Test Name',
            description: 'mock description',
            location: '20 lsk',
            hours: 20_00,
            invitationLink: 'http://calendly.com',
          }
          result = DoubleGdpSchema.execute(create_amenity,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: admin.community,
                                           }).as_json
          expect(result.dig('errors', 0, 'message'))
            .to include 'Variable $hours of type String! was provided invalid value'
          expect(result.dig('data', 'amenityCreate')).to be_nil
        end
      end
    end

    describe '#authorized?' do
      context 'when current user is not allowed create an amenity' do
        it 'raises unauthorized error' do
          variables = {
            name: 'Test Name',
            description: 'mock description',
            location: '20 lsk',
            hours: '20_00',
            invitationLink: 'http://calendly.com',
          }
          result = DoubleGdpSchema.execute(create_amenity,
                                           variables: variables,
                                           context: {
                                             current_user: client,
                                             site_community: client.community,
                                           }).as_json
          expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
        end
      end
    end
  end
end
