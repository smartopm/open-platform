# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Note::NoteListUpdate do
  describe 'update for note list' do
    let(:admin_role) { create(:role, name: 'admin') }
    let!(:permission) do
      create(:permission, module: 'note',
                          role: admin_role,
                          permissions: %w[can_edit_task_list])
    end
    let(:user) { create(:user_with_community) }
    let(:community) { user.community }
    let(:admin) { create(:admin_user, community_id: community.id, role: admin_role) }
    let(:note_list) { create(:note_list, name: 'DRC LIST', community: community) }

    let!(:note) do
      create(:note,
             note_list_id: note_list.id,
             body: note_list.name,
             user_id: admin.id,
             author_id: admin.id)
    end

    let(:mutation) do
      <<~GQL
        mutation noteListUpdate($id: ID!, $name: String) {
          noteListUpdate(id: $id, name: $name){
            noteList{
              name
            }
          }
        }
      GQL
    end

    context 'when user is authrorized and note list is present' do
      it 'should update the note list' do
        variables = {
          id: note_list.id,
          name: 'DRC',
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: admin.community,
                                                   }).as_json
        expect(result['errors']).to be_nil
        expect(result.dig('data', 'noteListUpdate', 'noteList', 'name')).to eql 'DRC'
        expect(note_list.notes.first.body).to eql 'DRC'
      end
    end

    context 'when note list is not found' do
      it 'raises note list not found error' do
        variables = {
          id: '1234',
          name: 'DRC',
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: admin.community,
                                                   }).as_json
        expect(result['errors']).to_not be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'No such task list exists'
      end
    end

    context 'when user is not authorized' do
      it 'raises unauthorized error' do
        variables = {
          id: note_list.id,
          name: 'DRC',
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: user,
                                                     site_community: user.community,
                                                   }).as_json
        expect(result['errors']).to_not be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end
  end
end
