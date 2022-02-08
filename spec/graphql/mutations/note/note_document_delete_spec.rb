# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Note::NoteDocumentDelete do
  describe 'delete note document' do
    let!(:admin) { create(:admin_user) }
    let!(:visitor) { create(:user, community: admin.community) }
    let!(:note) { create(:note, user: admin, author: admin) }
    let!(:blob) do
      ActiveStorage::Blob.create(filename: 'doc.pdf', content_type: 'application/pdf',
                                 byte_size: 2123, checksum: '9JiwSyvzZeqDSV')
    end
    let!(:attachment) { note.documents.create(blob_id: blob.id) }
    let!(:permission) do
      create(:permission, module: 'note',
                          role: admin.role,
                          permissions: %w[can_delete_note_document])
    end

    let(:mutation) do
      <<~GQL
        mutation noteDocumentDelete($documentId: ID!) {
          noteDocumentDelete(documentId: $documentId){
            documentDeleted
          }
        }
      GQL
    end

    context 'when user is not authorized to delete document' do
      it 'raises unauthorized error' do
        variables = { documentId: attachment.id }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: visitor,
                                                   }).as_json
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end

    context 'when user is authorized to delete the document' do
      it 'marks the status of attachment as 1' do
        variables = { documentId: attachment.id }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                   }).as_json
        expect(result.dig('data', 'noteDocumentDelete', 'documentDeleted')).to eql true
        expect(attachment.reload.status).to eql 1
      end
    end
  end
end
