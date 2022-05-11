# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ActionFlows::Actions::Task do
  let!(:user) { create(:user_with_community) }
  let!(:acting_user) { create(:user, community: user.community, role: user.role) }
  let!(:event_log) do
    create(:event_log, subject: 'user_login', ref_type: 'Users::User', ref_id: user.id,
                       acting_user: acting_user, community: user.community)
  end
  let!(:template) { create(:email_template, community: user.community) }

  let!(:action_flow) do
    create(:action_flow, event_action: {
             action_name: 'Email', action_fields: {
               body: { name: 'body', value: 'A task here', type: 'string' },
               description: { name: 'description', value: 'Some description', type: 'string' },
               assignees: { name: 'assigness', value: 'assignee1@gmail.com', type: 'string' },
             }
           },
                         community: user.community, event_type: 'user_login')
  end

  it 'executes action' do
    flow = ActionFlows::WebFlow.new(action_flow.description, action_flow.event_type,
                                    action_flow.event_condition, action_flow.event_action)

    event = flow.event_object.new
    event.preload_data(event_log)
    expect(TaskCreate).to receive(:new_from_action).with({
                                                           description: 'Some description',
                                                           body: 'A task here',
                                                           assignees: 'assignee1@gmail.com',
                                                           author_id: nil,
                                                           category: nil,
                                                           user_id: nil,
                                                           due_date: nil,
                                                         })
    described_class.execute_action(event.data_set, flow.action_fields, event_log)
  end
end
