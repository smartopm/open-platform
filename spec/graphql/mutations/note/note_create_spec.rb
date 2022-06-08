# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Note::NoteCreate do
  let!(:admin_role) { create(:role, name: 'admin') }
  let!(:resident_role) { create(:role, name: 'resident') }
  let!(:site_worker_role) { create(:role, name: 'site_worker') }
  let!(:permission) do
    create(:permission, module: 'note',
                        role: admin_role,
                        permissions: %w[can_create_note can_assign_note can_update_note])
  end
  let!(:site_worker_permission) do
    create(:permission, module: 'note',
                        role: site_worker_role,
                        permissions: %w[can_create_note can_assign_note])
  end

  let!(:user) { create(:user_with_community, role: resident_role, user_type: 'resident') }
  let!(:admin) do
    create(:admin_user, community_id: user.community_id, role: admin_role, user_type: 'admin')
  end

  let!(:site_worker) do
    create(:site_worker, community_id: user.community_id,
                         role: site_worker_role, user_type: 'site_worker')
  end

  let(:user_note) do
    create(:note,
           community_id: user.community_id,
           user_id: user.id,
           author_id: admin.id,
           body: 'Feedback')
  end

  let(:task) do
    create(:note,
           body: 'A test task',
           description: 'Test parent task',
           user_id: site_worker.id,
           category: 'to_do',
           flagged: true,
           community_id: user.community.id,
           author_id: site_worker.id,
           completed: false)
  end

  let(:create_query) do
    <<~GQL
      mutation CreateNote(
        $userId: ID!,
        $body: String!,
        $category: String,
        $parentNoteId: ID,
        $flagged: Boolean,
        $attachedDocuments: JSON,
        $status: String,
        $order: Int,
        ) {
        result:  noteCreate(
          userId: $userId,
          body:$body,
          category: $category,
          flagged: $flagged,
          parentNoteId: $parentNoteId,
          attachedDocuments: $attachedDocuments,
          status: $status,
          order: $order
          ){
          note {
              id
              body
              category
              status
          }
        }
      }
    GQL
  end

  describe 'creating a note' do
    let(:note_assign_query) do
      <<~GQL
        mutation noteAssign($noteId: ID!, $userId: ID!){
          noteAssign(noteId: $noteId, userId: $userId){
            assigneeNote
          }
        }
      GQL
    end

    it 'returns a created note with category' do
      variables = {
        userId: user.id,
        body: 'A note about the user',
        category: 'email',
        status: 'in_progress',
      }
      result = DoubleGdpSchema.execute(create_query, variables: variables,
                                                     context: {
                                                       current_user: admin,
                                                       site_community: user.community,
                                                     }).as_json

      note_result = result.dig('data', 'result', 'note')
      expect(note_result['id']).not_to be_nil
      expect(note_result['category']).to eql 'email'
      expect(note_result['status']).to eql 'in_progress'
      expect(result['errors']).to be_nil
    end

    it 'returns a created note with category when current user is a site worker' do
      variables = {
        userId: user.id,
        body: 'A note by site worker',
        category: 'email',
      }
      result = DoubleGdpSchema.execute(create_query, variables: variables,
                                                     context: {
                                                       current_user: site_worker,
                                                       site_community: user.community,
                                                     }).as_json
      expect(result.dig('data', 'result', 'note', 'id')).not_to be_nil
      expect(result.dig('data', 'result', 'note', 'category')).to eql 'email'
      expect(result['errors']).to be_nil
    end

    it 'raises unauthorized if current user is nil' do
      variables = {
        userId: user.id,
        body: 'A note by site worker',
        category: 'email',
      }
      result = DoubleGdpSchema.execute(create_query, variables: variables,
                                                     context: {
                                                       current_user: nil,
                                                       site_community: user.community,
                                                     }).as_json
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end

    it 'does not return a created note with the right category' do
      variables = {
        userId: user.id,
        body: 'A note about the user',
        category: 'anything',
      }
      result = DoubleGdpSchema.execute(create_query, variables: variables,
                                                     context: {
                                                       current_user: admin,
                                                       site_community: user.community,
                                                     }).as_json
      expect(result['errors']).not_to be_nil
      expect(result.dig('data', 'result', 'note', 'id')).to be_nil
      expect(result.dig('data', 'result', 'note', 'category')).to be_nil
    end

    it 'assigns or unassigns user' do
      variables = {
        userId: user.id,
        noteId: user_note.id,
      }

      result = DoubleGdpSchema.execute(note_assign_query, variables: variables,
                                                          context: {
                                                            current_user: admin,
                                                            site_community: user.community,
                                                          }).as_json

      expect(result.dig('data', 'noteAssign', 'assigneeNote')).not_to be_nil
      expect(result.dig('data', 'noteAssign', 'assigneeNote')).to include 'success'
      expect(Notes::NoteHistory.count).to eql 1
      expect(result['errors']).to be_nil
    end

    context 'when task is assigned to user' do
      it 'creates notification for the assigned user' do
        variables = {
          userId: user.id,
          noteId: user_note.id,
        }

        result = DoubleGdpSchema.execute(note_assign_query, variables: variables,
                                                            context: {
                                                              current_user: admin,
                                                              site_community: admin.community,
                                                            }).as_json

        expect(result['errors']).to be_nil
        expect(user.notifications.count).to eql 1
        expect(user.notifications.first.description).to eql 'Feedback task is assigned to you.'
      end
    end

    it 'assigns or unassigns user when current user is site worker' do
      variables = {
        userId: user.id,
        noteId: user_note.id,
      }

      result = DoubleGdpSchema.execute(note_assign_query, variables: variables,
                                                          context: {
                                                            current_user: site_worker,
                                                            site_community: user.community,
                                                          }).as_json

      expect(result.dig('data', 'noteAssign', 'assigneeNote')).not_to be_nil
      expect(result.dig('data', 'noteAssign', 'assigneeNote')).to include 'success'
      expect(Notes::NoteHistory.count).to eql 1
      expect(result['errors']).to be_nil
    end

    describe 'tasks' do
      it 'creates sub task' do
        variables = {
          userId: user.id,
          body: 'A sub task',
          category: 'other',
          flagged: true,
          parentNoteId: task.id,
        }

        result = DoubleGdpSchema.execute(
          create_query,
          variables: variables,
          context: {
            current_user: admin,
            site_community: user.community,
          },
        ).as_json

        expect(result.dig('data', 'result', 'note', 'id')).not_to be_nil
        expect(task.sub_tasks.first.id).to eq(result.dig('data', 'result', 'note', 'id'))
      end

      it 'creates a task with order number' do
        variables = {
          userId: user.id,
          body: 'Sub task with order number',
          category: 'other',
          flagged: true,
          parentNoteId: task.id,
          order: 2,
        }

        result = DoubleGdpSchema.execute(create_query, variables: variables,
                                                       context: {
                                                         current_user: admin,
                                                         site_community: user.community,
                                                       }).as_json

        note_id = result.dig('data', 'result', 'note', 'id')

        expect(note_id).not_to be_nil
        note = user.community.notes.find(note_id)
        expect(note.order).to eq(2)
      end
    end
  end
end
