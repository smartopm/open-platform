# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ActionFlows::Actions::CustomEmail do
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
               email: { name: 'email', value: 'email@gmail.com', type: 'string' },
               template: { name: 'template', value: template.id, type: 'string' },
             }
           },
                         community: user.community, event_type: 'user_login')
  end

  it 'executes action' do
    flow = ActionFlows::WebFlow.new(action_flow.description, action_flow.event_type,
                                    action_flow.event_condition, action_flow.event_action)

    event = flow.event_object.new
    event.preload_data(event_log)
    expect(EmailMsg).to receive(:send_mail_from_db).with(
      email: 'email@gmail.com',
      template: template,
      template_data: [],
    )
    described_class.execute_action(event.data_set, flow.action_fields, event_log)
  end
end
