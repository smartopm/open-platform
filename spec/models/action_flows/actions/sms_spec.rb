# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ActionFlows::Actions::Sms do
  let(:community) { create(:community, name: 'DoubleGDP') }
  let!(:user) { create(:user, name: 'some name', phone_number: '2341234567', community: community) }
  let!(:acting_user) do
    create(:store_custodian, community: community)
  end
  let!(:user_note) do
    create(:note, community_id: community.id,
                  user_id: acting_user.id, author_id: user.id, body: 'some body')
  end

  let!(:assign_note) do
    create(:assignee_note, user_id: user.id, note_id: user_note.id)
  end

  let!(:task_assign_event_log) do
    create(:event_log, subject: 'task_assign',
                       ref_type: 'Notes::AssigneeNote', ref_id: assign_note.id,
                       acting_user: acting_user, community: community)
  end

  let!(:user_create_event_log) do
    create(:event_log, subject: 'user_create',
                       ref_type: 'Users::User', ref_id: user.id,
                       acting_user: acting_user, community: community)
  end

  let!(:action_flow) do
    create(:action_flow, event_action: {
             action_name: 'Sms',
             action_fields: { phone_number:
             { name: 'phone_number', value: '1234567', type: 'string' } },
           }, community: community, event_type: 'task_assign')
  end

  context 'when event type is task assign' do
    it 'executes action' do
      id = assign_note.note_id
      user_note.record_note_history(user)
      assign_note.versions.first.update(whodunnit: acting_user.id)
      flow = ActionFlows::WebFlow.new(action_flow.description, action_flow.event_type,
                                      action_flow.event_condition, action_flow.event_action)

      event = flow.event_object.new
      event.preload_data(task_assign_event_log)
      expect(Sms).to receive(:send)
        .with(
          '2341234567',
          "Task 'some body' was assigned to you\nhttps:///tasks/#{id}\n",
          acting_user.community,
        )

      expect(Sms).to receive(:send)
        .with(
          '1234567',
          "some name just assigned a task 'some body'\nto some name https:///tasks/#{id}\n",
          acting_user.community,
        )
      described_class.execute_action(event.data_set, flow.action_fields, task_assign_event_log)
    end
  end

  context 'when event type is user create' do
    before { action_flow.update(event_type: 'user_create') }

    it 'executes action' do
      flow = ActionFlows::WebFlow.new(action_flow.description, action_flow.event_type,
                                      action_flow.event_condition, action_flow.event_action)

      event = flow.event_object.new
      event.preload_data(user_create_event_log)
      url = "https://#{HostEnv.base_url(community)}"
      expect(Sms).to receive(:send)
        .with(
          '1234567',
          "Welcome to the DoubleGDP online community. Please access the app using #{url}",
          community,
        )
      described_class.execute_action(event.data_set, flow.action_fields, user_create_event_log)
    end
  end
end
