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
        ) {
          noteUpdate(
            id: $id
            body: $body
            flagged: $flagged
            completed: $completed
            dueDate: $dueDate
            parentNoteId: $parentNoteId
            documentBlobId: $documentBlobId
          ) {
            note {
              flagged
              body
              id
              dueDate
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
      )
    end

    it 'updates a note' do
      variable_updates = {
        id: note.id,
        body: 'A modified note about the user',
      }

      result = DoubleGdpSchema.execute(update_query, variables: variable_updates,
                                                     context: {
                                                       current_user: admin,
                                                       site_community: user.community,
                                                     }).as_json

      expect(result.dig('data', 'noteUpdate', 'note', 'id')).not_to be_nil
      expect(result.dig('data', 'noteUpdate', 'note', 'body')).to include 'modified'
      expect(Notes::NoteHistory.count).to eql 1
      expect(result['errors']).to be_nil

      result = DoubleGdpSchema.execute(update_query, variables: variable_updates,
                                                     context: {
                                                       current_user: user,
                                                       site_community: user.community,
                                                     }).as_json

      expect(result.dig('data', 'noteUpdate', 'note', 'id')).to be_nil
      expect(Notes::NoteHistory.count).to eql 1
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
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
