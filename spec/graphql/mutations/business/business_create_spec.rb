# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Business::BusinessCreate do
  describe 'creating a business' do
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident) { create(:resident, role: resident_role) }
    let!(:permission) do
      create(:permission, module: 'business',
                          role: admin_role,
                          permissions: %w[can_create_business can_delete_business])
    end

    let!(:current_user) { create(:user_with_community, user_type: 'admin', role: admin_role) }

    let!(:non_admin) { create(:user_with_community, user_type: 'resident', role: resident_role) }
    # using a few fields to test since there is a lot
    let(:query) do
      <<~GQL
        mutation businessCreate($name: String!, $email: String!, $phoneNumber: String!, $status: String,
         $userId: ID!, $imageUrl: String, $operationHours: String, $description: String, $links: String,
         $homeUrl: String, $category: String, $address: String) {
          businessCreate(name: $name, email: $email, phoneNumber: $phoneNumber, status: $status, userId:
          $userId, imageUrl: $imageUrl, links: $links, category: $category, operationHours: $operationHours,
          description: $description, homeUrl: $homeUrl, address: $address) {
            business {
              id
              userId
              name
            }
          }
        }
      GQL
    end

    it 'returns a created Discussion' do
      variables = {
        name: 'Named 21',
        email: 'user@nkwashi.com',
        phoneNumber: '3754937492',
        userId: non_admin.id,
      }

      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: current_user,
                                                site_community: current_user.community,
                                              }).as_json
      expect(result.dig('data', 'businessCreate', 'business', 'id')).not_to be_nil
      expect(result.dig('data', 'businessCreate', 'business', 'name')).to include 'Named 21'
      expect(result.dig('data', 'businessCreate', 'business', 'userId')).to eql non_admin.id
      expect(result['errors']).to be_nil
    end

    it 'doesnt create a business when user is not admin' do
      variables = {
        name: 'Named 22',
        email: 'user@nkwashi.coma',
        phoneNumber: '3754937492',
        userId: current_user.id,
      }

      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: non_admin,
                                                site_community: non_admin.community,
                                              }).as_json
      expect(result.dig('data', 'businessCreate', 'business', 'id')).to be_nil
      expect(result.dig('data', 'businessCreate', 'business', 'name')).to be_nil
      expect(result.dig('data', 'businessCreate', 'business', 'userId')).to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end
    describe 'creating a business' do
      # create a business for the user
      let!(:user_business) do
        create(:business, user_id: current_user.id, community_id: current_user.community_id,
                          status: 'verified')
      end

      let(:query) do
        <<~GQL
          mutation DeleteBusiness(
            $id: ID!
          ) {
            businessDelete(
              id: $id
              ){
                businessDelete
              }
            }
        GQL
      end

      it 'deletes a business' do
        variables = {
          id: user_business.id,
        }

        result = DoubleGdpSchema.execute(query, variables: variables,
                                                context: {
                                                  current_user: current_user,
                                                  site_community: current_user.community,
                                                }).as_json

        expect(result.dig('data', 'businessDelete', 'businessDelete')).to eql true
        expect(result['errors']).to be_nil
      end

      it 'returns authorized if there is no current user' do
        variables = {
          id: user_business.id,
        }

        result = DoubleGdpSchema.execute(query, variables: variables,
                                                context: {
                                                  current_user: nil,
                                                }).as_json

        expect(result.dig('data', 'businessDelete')).to be_nil
        expect(result['errors']).to_not be_nil
      end

      it 'returns error when provided wrong id' do
        variables = {
          id: SecureRandom.uuid,
        }

        result = DoubleGdpSchema.execute(query, variables: variables,
                                                context: {
                                                  current_user: current_user,
                                                  site_community: current_user.community,
                                                }).as_json

        expect(result.dig('data', 'businessDelete')).to be_nil
        expect(result['errors']).to_not be_nil
      end
    end
  end
end
