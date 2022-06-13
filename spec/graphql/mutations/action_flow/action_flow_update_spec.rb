# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::ActionFlow::ActionFlowUpdate do
  describe 'update actionflows' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'action_flow',
                          role: admin_role,
                          permissions: %w[can_update_action_flow])
    end
    let!(:user) do
      create(:user_with_community, user_type: 'resident',
                                   role: resident_role)
    end
    let!(:admin) do
      create(:admin_user, community_id: user.community_id,
                          user_type: 'admin', role: admin_role)
    end
    let!(:action_flow) do
      create(:action_flow, event_type: 'task_update',
                           community_id: user.community_id)
    end

    let(:mutation) do
      <<~GQL
        mutation actionFlowUpdate($id: ID!, $eventType: String!) {
          actionFlowUpdate(id: $id, eventType: $eventType){
            actionFlow {
              eventType
            }
          }
        }
      GQL
    end

    let(:variables) do
      {
        id: action_flow.id,
        eventType: 'note_comment_create',
      }
    end

    it 'updates an action flow' do
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: admin,
                                                   site_community: user.community,
                                                   user_role: admin.role,
                                                 }).as_json

      expect(result.dig('data', 'actionFlowUpdate', 'actionFlow', 'eventType')).to eq(
        'note_comment_create',
      )
      expect(result['errors']).to be_nil
    end

    it 'throws unauthorized error when user is not admin' do
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: user,
                                                   site_community: user.community,
                                                   user_role: user.role,
                                                 }).as_json
      expect(result.dig('data', 'actionFlowUpdate', 'actionFlow', 'eventType')).to be_nil
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
    end

    it 'throws an error if there is a validation issue' do
      variables[:eventType] = 'nonsense'
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: admin,
                                                   site_community: user.community,
                                                   user_role: admin.role,
                                                 }).as_json
      expect(result.dig('data', 'actionFlowUpdate', 'actionFlow', 'eventType')).to be_nil
      expect(JSON.parse(result.dig('errors', 0, 'message'))[0]).to eql(
        'Event type is not included in the list',
      )
    end
  end
end
