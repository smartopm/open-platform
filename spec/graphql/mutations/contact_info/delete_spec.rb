# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::ContactInfo::Delete do
  describe 'delete a contact info' do
    let!(:user) { create(:user_with_community) }
    let!(:contact_info) { create(:contact_info, user_id: user.id) }

    let(:mutation) do
      <<~GQL
        mutation contactInfoDelete($id: ID!, $userId: ID!){
          contactInfoDelete(id: $id, userId: $userId){
            success
          }
        }
      GQL
    end

    it 'deletes a contact info record for a user' do
      variables = {
        userId: user.id,
        id: contact_info.id,
      }
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: user,
                                                   site_community: user.community,
                                                   user_role: user.role,
                                                 }).as_json
      expect(result.dig('data', 'contactInfoDelete', 'success')).to be_truthy
      expect(result['errors']).to be_nil
    end
  end
end
