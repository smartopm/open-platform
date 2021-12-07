# frozen_string_literal: true

require 'rails_helper'

# rubocop:disable Layout/LineLength
RSpec.describe Mutations::ActionFlow::ActionFlowCreate do
  describe 'create actionflows' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'action_flow',
                          role: admin_role,
                          permissions: %w[can_create_action_flow])
    end
    let!(:user) do
      create(:user_with_community, user_type: 'resident',
                                   role: resident_role)
    end
    let!(:admin) do
      create(:admin_user, community_id: user.community_id,
                          user_type: 'admin', role: admin_role)
    end

    let(:mutation) do
      <<~GQL
        mutation actionFlowCreate($title: String!, $description: String!, $eventType: String!, $eventCondition: String, $eventAction: JSON) {
          actionFlowCreate(title: $title, description: $description, eventType: $eventType, eventCondition: $eventCondition, eventAction: $eventAction){
            actionFlow {
              description
            }
          }
        }
      GQL
    end

    let(:variables) do
      {
        title: 'My Flow',
        description: 'Just a flow',
        eventType: 'task_update',
        eventCondition: '{"==":[1,1]}',
        eventAction: {
          action_name: 'email',
          action_fields: {
            email: {
              name: 'email',
              type: 'string',
              value: 'email@gmail.com',
            },
            template: {
              name: 'template',
              type: 'string',
              value: 'ui123786452-d',
            },
          },
        },
      }
    end

    it 'creates an action flow' do
      previous_flow_count = ActionFlows::ActionFlow.count
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: admin,
                                                   site_community: user.community,
                                                   user_role: admin.role,
                                                 }).as_json

      expect(result.dig('data', 'actionFlowCreate', 'actionFlow', 'description')).to eq('Just a flow')
      expect(result['errors']).to be_nil
      expect(ActionFlows::ActionFlow.count).to eq(previous_flow_count + 1)
    end

    it 'throws unauthorized error when user is not admin' do
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: user,
                                                   site_community: user.community,
                                                   user_role: user.role,
                                                 }).as_json
      expect(result.dig('data', 'actionFlowCreate', 'actionFlow', 'description')).to be_nil
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
    end

    it 'throws an error if there\ns a validation issue' do
      variables[:eventType] = 'nonsense'
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: admin,
                                                   site_community: user.community,
                                                   user_role: admin.role,
                                                 }).as_json
      expect(result.dig('data', 'actionFlowCreate', 'actionFlow', 'description')).to be_nil
      expect(JSON.parse(result.dig('errors', 0, 'message'))[0]).to eql 'Event type is not included in the list'
    end
  end
end
# rubocop:enable Layout/LineLength
