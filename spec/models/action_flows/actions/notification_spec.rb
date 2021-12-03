# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ActionFlows::Actions::Notification do
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
               label: { name: 'label', value: 'com_news', type: 'string' },
               user_id: { name: 'user_id', value: '123', type: 'string' },
               message: { name: 'message', value: 'A message to com-news', type: 'string' },
             }
           },
                         community: user.community, event_type: 'user_login')
  end

  it 'executes action' do
    flow = ActionFlows::WebFlow.new(action_flow.description, action_flow.event_type,
                                    action_flow.event_condition, action_flow.event_action)

    event = flow.event_object.new
    event.preload_data(event_log)
    expect(Notifier).to receive(:send_from_action).with(
      'A message to com-news',
      label: 'com_news',
      user_id: '123',
    )
    described_class.execute_action(event.data_set, flow.action_fields)
  end
end
