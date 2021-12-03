# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ActionFlows::Actions::Sms do
  let!(:user) { create(:user_with_community, name: 'some name', phone_number: '2341234567') }
  let!(:acting_user) do
    create(:store_custodian, community: user.community)
  end
  let!(:user_note) do
    create(:note, community_id: user.community_id,
                  user_id: acting_user.id, author_id: user.id, body: 'some body')
  end

  let!(:assign_note) do
    create(:assignee_note, user_id: user.id, note_id: user_note.id)
  end

  let!(:event_log) do
    create(:event_log, subject: 'task_assign',
                       ref_type: 'Notes::AssigneeNote', ref_id: assign_note.id,
                       acting_user: acting_user, community: user.community)
  end

  let!(:action_flow) do
    create(:action_flow, event_action: {
             action_name: 'Sms',
             action_fields: { phone_number:
             { name: 'phone_number', value: '1234567', type: 'string' } },
           }, community: user.community, event_type: 'task_assign')
  end

  it 'executes action' do
    id = assign_note.note_id
    user_note.record_note_history(user)
    flow = ActionFlows::WebFlow.new(action_flow.description, action_flow.event_type,
                                    action_flow.event_condition, action_flow.event_action)

    event = flow.event_object.new
    event.preload_data(event_log)

    expect(Sms).to receive(:send)
      .with(
        '2341234567',
        "Task 'some body' was assigned to you\nhttps:///tasks/#{id}\n",
      )

    expect(Sms).to receive(:send)
      .with(
        '1234567',
        "some name just assigned a task 'some body'\nto some name https:///tasks/#{id}\n",
      )
    described_class.execute_action(event.data_set, flow.action_fields)
  end
end
