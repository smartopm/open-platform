# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ActionFlows::Actions::Sms do
  let!(:user) { create(:user_with_community, name: 'some name') }
  let!(:acting_user) do
    create(:user_with_community, community: user.community,
                                 phone_number: '2341234567',
                                 user_type: 'custodian')
  end
  let!(:user_note) do
    create(:note, community_id: user.community_id,
                  user_id: user.id, author_id: user.id, body: 'some body')
  end
  let!(:event_log) do
    create(:event_log, subject: 'task_create', ref_type: 'Notes::Note', ref_id: user_note.id,
                       acting_user: acting_user, community: user.community)
  end

  let!(:action_flow) do
    create(:action_flow, event_action: {
             action_name: 'Sms', action_fields: {}
           },
                         community: user.community, event_type: 'task_create')
  end

  it 'executes action' do
    flow = ActionFlows::WebFlow.new(action_flow.description, action_flow.event_type,
                                    action_flow.event_condition, action_flow.event_action)

    event = flow.event_object.new
    event.preload_data(event_log)
    expect(Sms).to receive(:send).with('2341234567', "some name just created a task 'some body'")
    described_class.execute_action(event.data_set)
  end
end
