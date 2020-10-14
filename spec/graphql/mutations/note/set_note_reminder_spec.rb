# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Note::SetNoteReminder do
  describe 'set note reminder' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
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
        mutation setNoteReminder($noteId: ID!, $hour: Int!) {
          setNoteReminder(noteId: $noteId, hour: $hour){
            note {
              id
              reminderTime
            }
          }
        }
      GQL
    end

    it 'sets a reminder time' do
      note.assign_or_unassign_user(admin.id)

      variables = {
        noteId: note.id,
        hour: 24,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin,
                                              }).as_json
      expect(result.dig('data', 'setNoteReminder', 'note', 'reminderTime')).not_to be_nil
      expect(result.dig('data', 'setNoteReminder', 'note', 'reminderTime').to_datetime.
        strftime("%d %b %Y, %H:%M")).to eql 24.hours.from_now.strftime("%d %b %Y, %H:%M")
      expect(result.dig('errors')).to be_nil
    end

    it 'throws authorization error if not an admin' do
      note.assign_or_unassign_user(user.id)

      variables = {
        noteId: note.id,
        hour: 24,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                              }).as_json
      expect(result.dig('errors')).not_to be_nil
      expect(result.dig('errors', 0, 'message')).to eq('Unauthorized')
    end

    it 'throws authorization error if admin is not an assignee' do
      variables = {
        noteId: note.id,
        hour: 24,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin,
                                              }).as_json
      expect(result.dig('errors')).not_to be_nil
      expect(result.dig('errors', 0, 'message')).to eq('Unauthorized')
    end
  end
end
