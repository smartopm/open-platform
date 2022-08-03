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
  let(:note_list) do
    create(:note_list, name: 'DRC LIST', community: user.community, status: 'active',
                       process_id: process.id)
  end
  let!(:note) do
    create(:note,
           note_list_id: note_list.id,
           parent_note_id: nil,
           category: 'task_list',
           body: note_list.name,
           user_id: user.id,
           author_id: user.id)
  end

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
    prev_note_count = Notes::Note.count
    prev_assignee_note_count = Notes::AssigneeNote.count

    TaskCreate.new_from_action(data)
    expect(Notes::Note.count).to eq(prev_note_count)
    expect(Notes::AssigneeNote.count).to eq(prev_assignee_note_count)
  end

  it '#new_from_action should not create new task when body is blank' do
    data[:body] = ''
    data[:user_id] = user.id
    data[:author_id] = user.id
    prev_note_count = Notes::Note.count
    prev_assignee_note_count = Notes::AssigneeNote.count

    TaskCreate.new_from_action(data)
    expect(Notes::Note.count).to eq(prev_note_count)
    expect(Notes::AssigneeNote.count).to eq(prev_assignee_note_count)
  end

  it '#new_from_action should not create task without community' do
    data[:body] = 'New Task'
    data[:user_id] = user.id
    data[:author_id] = '123'

    prev_note_count = Notes::Note.count
    prev_assignee_note_count = Notes::AssigneeNote.count
    TaskCreate.new_from_action(data)
    expect(Notes::Note.count).to eq(prev_note_count)
    expect(Notes::AssigneeNote.count).to eq(prev_assignee_note_count)
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

  describe '#new_from_process' do
    data = {
      body: 'Task Triggered from Form',
      category: 'form',
      description: 'Description',
      flagged: true,
      due_date: nil,
    }

    it 'should not create task when author is blank' do
      data[:author_id] = ''
      expect do
        TaskCreate.new_from_process(data, process)
      end.not_to(change { Notes::Note.count })
    end
    it 'should not create task when body is blank' do
      data[:body] = ''
      expect do
        TaskCreate.new_from_process(data, process)
      end.not_to(change { Notes::Note.count })
    end

    it 'creates parent note' do
      data[:user_id] = user.id
      data[:author_id] = user.id
      data[:body] = 'Task Triggered from Form'
      data[:form_user_id] = form_user.id

      expect do
        TaskCreate.new_from_process(data, process)
      end.to change { Notes::Note.where(parent_note_id: nil).count }.by(1)
    end

    it 'assignes note list id to respective notes' do
      data = {
        body: 'Task Triggered from Form',
        category: 'form',
        description: 'Description',
        author_id: user.id,
        user_id: user.id,
        form_user_id: form_user.id,
      }
      expect do
        TaskCreate.new_from_process(data, process)
      end.to change { Notes::NoteList.first.notes.count }.by(1)
    end
  end
end
