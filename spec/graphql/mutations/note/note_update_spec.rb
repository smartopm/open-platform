# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Note::NoteUpdate do
  describe('update note') do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:permission) do
      create(:permission, module: 'note',
                          role: admin_role,
                          permissions: %w[can_update_note])
    end

    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id, role: admin_role) }

    let(:update_query) do
      <<~GQL
        mutation noteupdate(
          $id: ID!
          $body: String
          $flagged: Boolean
          $completed: Boolean
          $dueDate: String
          $parentNoteId: ID
          $documentBlobId: String
          $status: String
          $order: Int
        ) {
          noteUpdate(
            id: $id
            body: $body
            flagged: $flagged
            completed: $completed
            dueDate: $dueDate
            parentNoteId: $parentNoteId
            documentBlobId: $documentBlobId
            status: $status
            order: $order
          ) {
            note {
              flagged
              body
              id
              dueDate
              status
              parentNote {
                id
              }
              attachments
            }
          }
        }
      GQL
    end

    let!(:note) do
      admin.notes.create!(
        body: 'A note about the user',
        user_id: user.id,
        community_id: user.community_id,
        author_id: admin.id,
        status: 'in_progress',
      )
    end

    it 'updates a note' do
      variable_updates = {
        id: note.id,
        body: 'A modified note about the user',
        status: 'completed',
      }

      result = DoubleGdpSchema.execute(update_query, variables: variable_updates,
                                                     context: {
                                                       current_user: admin,
                                                       site_community: user.community,
                                                     }).as_json

      note_result = result.dig('data', 'noteUpdate', 'note')
      expect(note_result['id']).not_to be_nil
      expect(note_result['body']).to include 'modified'
      expect(note_result['status']).to include 'completed'
      expect(Notes::NoteHistory.count).to eql 3 # Log event for completed task is created
      expect(result['errors']).to be_nil

      result = DoubleGdpSchema.execute(update_query, variables: variable_updates,
                                                     context: {
                                                       current_user: user,
                                                       site_community: user.community,
                                                     }).as_json
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
      expect(result.dig('data', 'noteUpdate', 'note', 'id')).to be_nil
      expect(Notes::NoteHistory.count).to eql 3
    end

    it 'marks task as completed when status is set to complete' do
      variable_updates = {
        id: note.id,
        body: 'A task marked as complete from select',
        status: 'completed',
      }

      result = DoubleGdpSchema.execute(update_query, variables: variable_updates,
                                                     context: {
                                                       current_user: admin,
                                                       site_community: user.community,
                                                     }).as_json

      note_result = result.dig('data', 'noteUpdate', 'note')
      expect(note_result['status']).to eql('completed')
      note = user.community.notes.find_by(id: note_result['id'])

      expect(note).not_to be_nil
      expect(note.completed).to be true
      expect(note.completed_at).not_to be_nil
    end

    it 'marks task as not completed when status is set to a non complete state' do
      note.update(completed: true)
      variable_updates = {
        id: note.id,
        body: 'A completed task to be changed with status select',
        status: 'in_progress',
      }

      result = DoubleGdpSchema.execute(update_query, variables: variable_updates,
                                                     context: {
                                                       current_user: admin,
                                                       site_community: user.community,
                                                     }).as_json

      note_result = result.dig('data', 'noteUpdate', 'note')
      expect(note_result['status']).to eql('in_progress')
      note = user.community.notes.find_by(id: note_result['id'])

      expect(note).not_to be_nil
      expect(note.completed).to be false
    end

    it 'updates parent_note_id' do
      other_user_note = create(:note, community_id: user.community_id,
                                      user_id: user.id, author_id: admin.id, flagged: true)
      variable_updates = {
        id: note.id,
        body: 'An updated subtask',
        parentNoteId: other_user_note.id,
      }

      result = DoubleGdpSchema.execute(update_query, variables: variable_updates,
                                                     context: {
                                                       current_user: admin,
                                                       site_community: user.community,
                                                     }).as_json

      expect(result.dig('data', 'noteUpdate', 'note', 'id')).not_to be_nil
      expect(result.dig('data', 'noteUpdate', 'note', 'parentNote')['id']).to eq(other_user_note.id)
    end

    it 'updates task order number' do
      variable_updates = {
        id: note.id,
        body: 'Task with updated order',
        order: 2,
      }

      result = DoubleGdpSchema.execute(update_query, variables: variable_updates,
                                                     context: {
                                                       current_user: admin,
                                                       site_community: user.community,
                                                     }).as_json

      expect(result.dig('data', 'noteUpdate', 'note', 'id')).not_to be_nil
      expect(note.reload.order).to eq(2)
    end

    it 'adds attachments to note' do
      upload = ActiveStorage::Blob.create_and_upload!(
        io: File.open(Rails.root.join('spec/support/test_image.png')),
        filename: 'test_image.png',
        content_type: 'image/png',
      )

      variables = {
        id: note.id,
        body: 'Updated note',
        documentBlobId: upload.signed_id,
      }
      result = DoubleGdpSchema.execute(update_query, variables: variables,
                                                     context: {
                                                       current_user: admin,
                                                       site_community: user.community,
                                                     }).as_json

      expect(result.dig('data', 'noteUpdate', 'note', 'id')).not_to be_nil
      expect(result.dig('data', 'noteUpdate', 'note', 'attachments', 0, 'filename')).to eq(
        'test_image.png',
      )
      expect(result.dig('data', 'noteUpdate', 'note', 'attachments', 0, 'uploaded_by')).to eq(
        admin.name,
      )
      expect(result['errors']).to be_nil
    end

    it 'throws unauthorized error for invalid user' do
      variables = {
        id: note.id,
        body: 'Updated body',
      }
      result = DoubleGdpSchema.execute(update_query, variables: variables,
                                                     context: {
                                                       current_user: nil,
                                                       site_community: user.community,
                                                     }).as_json
      expect(result.dig('errors', 0, 'message')).to include('Unauthorized')
      expect(result['errors']).not_to be_nil
    end
  end
end
