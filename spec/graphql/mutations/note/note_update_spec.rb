# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Note::NoteUpdate do
  describe 'update for note' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:permission) do
      create(:permission, module: 'note',
                          role: admin_role,
                          permissions: %w[can_update_note])
    end

    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id, role: admin_role) }

    let!(:note) do
      admin.notes.create!(
        body: 'Note body',
        user_id: user.id,
        community_id: user.community_id,
        author_id: admin.id,
      )
    end

    let(:query) do
      <<~GQL
        mutation noteUpdate($id: ID!, $body: String) {
          noteUpdate(id: $id, body: $body){
            note {
              id
              body
            }
          }
        }
      GQL
    end

    it 'updates a note' do
      variables = {
        id: note.id,
        body: 'Updated body',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin,
                                                site_community: user.community,
                                              }).as_json

      expect(result.dig('data', 'noteUpdate', 'note', 'id')).not_to be_nil
      expect(result.dig('data', 'noteUpdate', 'note', 'body')).to eql 'Updated body'
      expect(result['errors']).to be_nil
    end

    it 'throws unauthorized error for invalid user' do
      variables = {
        id: note.id,
        body: 'Updated body',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: nil,
                                                site_community: user.community,
                                              }).as_json
      expect(result.dig('errors', 0, 'message')).to include('Unauthorized')
      expect(result['errors']).not_to be_nil
    end
  end
end
