# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Business::BusinessUpdate do
  describe 'creating a business' do
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident) { create(:resident, role: resident_role) }
    let!(:permission) do
      create(:permission, module: 'business',
                          role: admin_role,
                          permissions: %w[can_update_business])
    end

    let!(:current_user) { create(:user_with_community, user_type: 'admin', role: admin_role) }

    let!(:non_admin) { create(:user_with_community, user_type: 'resident', role: resident_role) }
    let!(:user_business) do
      create(:business, user_id: current_user.id, community_id: current_user.community_id,
                        status: 'verified')
    end

    let(:mutation) do
      <<~GQL
        mutation businessUpdate(
          $id: ID!
          $userId: ID!
          $name: String!
          $email: String!
          $phoneNumber: String!
        ) {
          businessUpdate(
            id: $id
            userId: $userId
            name: $name
            email: $email
            phoneNumber: $phoneNumber

          ){
              business{
                id
                name
              }
            }
          }
      GQL
    end

    describe '#authorized?' do
      context 'when user does not have permission to update business' do
        it 'raises unauthorized error' do
          variables = {
            id: user_business.id,
            userId: current_user.id,
            name: 'DGDP',
            email: 'biz@email.com',
            phoneNumber: '99887766',
          }
          result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                     context: {
                                                       current_user: resident,
                                                       site_community: current_user.community,
                                                     }).as_json
          expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
        end
      end
    end

    describe '#resolve' do
      context 'when user have permissions' do
        it 'updates the business' do
          variables = {
            id: user_business.id,
            userId: current_user.id,
            name: 'DGDP',
            email: 'biz@email.com',
            phoneNumber: '99887766',
          }

          result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                     context: {
                                                       current_user: current_user,
                                                       site_community: current_user.community,
                                                     }).as_json
          business_result = result.dig('data', 'businessUpdate', 'business')
          expect(business_result['name']).to eql 'DGDP'
          expect(result['errors']).to be_nil
        end
      end

      context 'when business is not found' do
        it 'raises business not found error' do
          variables = {
            id: SecureRandom.uuid,
            userId: current_user.id,
            name: 'DGDP',
            email: 'biz@email.com',
            phoneNumber: '99887766',
          }

          result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                     context: {
                                                       current_user: current_user,
                                                       site_community: current_user.community,
                                                     }).as_json
          expect(result.dig('errors', 0, 'message')).to eql 'Business not found'
        end
      end
    end
  end
end
