# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Note::NoteDelete do
  let(:user) { create(:user_with_community) }
  let(:community) { user.community }
  let(:admin) { create(:admin_user, community: community) }
  let(:resident) { create(:resident, community: community) }
  let(:role) { resident.role }
  let!(:permission) do
    create(:permission, module: 'note',
                        role: role,
                        permissions: 'can_delete_note')
  end
  let(:resident_note) { create(:note, community: community, user: resident, author: resident) }
  let(:admin_note) { create(:note, community: community, user: admin, author: admin) }
  let!(:admin_sub_note) do
    create(:note, community: community, user: admin, author: admin, parent_note: admin_note)
  end
  let(:mutation) do
    <<~GQL
      mutation NoteDelete($id: ID!){
        noteDelete(id: $id){
          success
        }
      }
    GQL
  end

  context 'when admin tries to delete note' do
    let(:role) { admin.role }

    it 'returns success for deleting note' do
      variables = { id: admin_sub_note.id }
      result = DoubleGdpSchema.execute(mutation, variables: variables, context: {
                                         current_user: admin,
                                         site_community: community,
                                       }).as_json
      expect(result['errors']).to be_nil
      expect(result.dig('data', 'noteDelete', 'success')).to eql true
    end

    it 'returns success for deleting other users note' do
      variables = { id: resident_note.id }
      result = DoubleGdpSchema.execute(mutation, variables: variables, context: {
                                         current_user: admin,
                                         site_community: community,
                                       }).as_json
      expect(result['errors']).to be_nil
      expect(result.dig('data', 'noteDelete', 'success')).to eql true
    end
  end

  context 'when user deletes note' do
    it "returns success for deleting user's own note" do
      variables = { id: resident_note.id }
      result = DoubleGdpSchema.execute(mutation, variables: variables, context: {
                                         current_user: resident,
                                         site_community: community,
                                       }).as_json
      expect(result['errors']).to be_nil
      expect(result.dig('data', 'noteDelete', 'success')).to eql true
    end

    it 'raises error on deleting other users note' do
      variables = { id: admin_note.id }
      result = DoubleGdpSchema.execute(mutation, variables: variables, context: {
                                         current_user: resident,
                                         site_community: community,
                                       }).as_json
      expect(result['errors']).to_not be_nil
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
    end
  end

  context 'when all sub notes are not deleted' do
    let(:role) { admin.role }

    it 'raises error on deleting parent note' do
      variables = { id: admin_note.id }
      result = DoubleGdpSchema.execute(mutation, variables: variables, context: {
                                         current_user: admin,
                                         site_community: community,
                                       }).as_json
      error_message = 'Cannot delete this task as sub-tasks are present'
      expect(result['errors']).to_not be_nil
      expect(result.dig('errors', 0, 'message')).to eql error_message
    end
  end

  context 'when user is unauthorized' do
    it 'raises unauthorized error' do
      variables = { id: admin_note.id }
      result = DoubleGdpSchema.execute(mutation, variables: variables, context: {
                                         current_user: user,
                                         site_community: community,
                                       }).as_json
      expect(result['errors']).to_not be_nil
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
    end
  end
end
