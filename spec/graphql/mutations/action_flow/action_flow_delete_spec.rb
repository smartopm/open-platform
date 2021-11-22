# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::ActionFlow::ActionFlowDelete do
  describe 'delete actionflows' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:action_flow) do
      create(:action_flow, event_type: 'task_update',
                           community_id: user.community_id)
    end

    let(:mutation) do
      <<~GQL
        mutation actionFlowDelete($id: ID!) {
          actionFlowDelete(id: $id){
            success
          }
        }
      GQL
    end

    let(:variables) do
      {
        id: action_flow.id,
      }
    end

    it 'deletes an action flow' do
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: admin,
                                                   site_community: user.community,
                                                   user_role: admin.role,
                                                 }).as_json

      expect(result.dig('data', 'actionFlowDelete', 'success')).to eql true
      expect(result['errors']).to be_nil
    end

    it 'throws unauthorized error when user is not admin' do
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: user,
                                                   site_community: user.community,
                                                   user_role: user.role,
                                                 }).as_json

      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
    end
  end
end
