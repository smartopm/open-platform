# frozen_string_literal: true

require 'rails_helper'
require 'task_create'

RSpec.describe TaskCreate do
  let!(:user) { create(:user_with_community) }
  let(:form) { create(:form, community: user.community) }
  let!(:category) { create(:category, form: form) }
  let!(:form_property) { create(:form_property, form: form, category: category) }
  let!(:form_user) { create(:form_user, form: form, user: user, status_updated_by: user) }
  let!(:process) { create(:process, community: user.community, form: form) }

  data = {
    body: 'New Task',
    category: 'call',
    description: 'New Task Description',
    flagged: true,
    due_date: nil,
  }

  it 'should return a community when user_id is given' do
    community = TaskCreate.community(user.id)
    expect(community).not_to be_nil
    expect(community.id).to eq user.community_id
  end

  it '#new_from_action should not create new task when author_id is blank' do
    data[:user_id] = ''
    data[:author_id] = ''

    TaskCreate.new_from_action(data)
    expect(Notes::Note.count).to eq 0
    expect(Notes::AssigneeNote.count).to eq 0
  end

  it '#new_from_action should not create new task when body is blank' do
    data[:body] = ''
    data[:user_id] = user.id
    data[:author_id] = user.id

    TaskCreate.new_from_action(data)
    expect(Notes::Note.count).to eq 0
    expect(Notes::AssigneeNote.count).to eq 0
  end

  it '#new_from_action should not create task without community' do
    data[:body] = 'New Task'
    data[:user_id] = user.id
    data[:author_id] = '123'

    TaskCreate.new_from_action(data)
    expect(Notes::Note.count).to eq 0
    expect(Notes::AssigneeNote.count).to eq 0
  end

  it '#new_from_action should create a new task' do
    data[:body] = 'New Task'
    data[:user_id] = user.id
    data[:author_id] = user.id

    expect do
      TaskCreate.new_from_action(data)
    end.to change { Notes::Note.count }.by(1)
  end

  it '#new_from_action should assign task to assignees' do
    data[:body] = 'New Task'
    data[:assignees] = user.id.to_s
    data[:user_id] = user.id
    data[:author_id] = user.id
    data[:form_user_id] = form_user.id

    expect do
      TaskCreate.new_from_action(data)
    end.to change { Notes::Note.count }.by(1)

    expect do
      TaskCreate.new_from_action(data)
    end.to change { Notes::AssigneeNote.count }.by(1)

    assigned_note = user.assignee_notes.map(&:note).select { |n| n[:body] = data[:body] }

    expect(assigned_note[0]).not_to be_nil
    expect(assigned_note[0][:body]).to eq 'New Task'
  end
end
