# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Business::BusinessDelete do
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
