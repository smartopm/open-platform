# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Note::SetNoteReminder do
  describe 'set note reminder' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:site_worker_role) { create(:role, name: 'site_worker') }
    let!(:permission) do
      create(:permission, module: 'note',
                          role: admin_role,
                          permissions: %w[can_set_note_reminder])
    end
    let!(:site_worker_permission) do
      create(:permission, module: 'note',
                          role: site_worker_role,
                          permissions: %w[can_set_note_reminder])
    end

    let!(:user) { create(:user_with_community, role: resident_role, user_type: 'resident') }
    let!(:admin) do
      create(:admin_user, community_id: user.community_id,
                          role: admin_role, user_type: 'admin')
    end
    let!(:second_admin) do
      create(:admin_user, community_id: user.community_id,
                          role: admin_role, user_type: 'admin')
    end
    let!(:site_worker) do
      create(:site_worker, community_id: user.community_id,
                           role: site_worker_role, user_type: 'site_worker')
    end

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
            }
          }
        }
      GQL
    end

    it 'sets a 24 hour reminder and 1 hour reminder time on assigned note for 2 assignees' do
      # First assignee
      note.assign_or_unassign_user(admin.id)

      variables = {
        noteId: note.id,
        hour: 24,
      }

      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin,
                                                site_community: admin.community,
                                              }).as_json

      assigned_note = admin.assignee_notes.find_by(note: note)
      expect(assigned_note.reminder_time).not_to be_nil
      expect(assigned_note.reminder_time.to_datetime
        .strftime('%d %b %Y, %H:%M')).to eql 24.hours.from_now.strftime('%d %b %Y, %H:%M')
      expect(result['errors']).to be_nil

      # Second Assignee
      note.assign_or_unassign_user(second_admin.id)

      variables = {
        noteId: note.id,
        hour: 1,
      }

      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: second_admin,
                                                site_community: second_admin.community,
                                              }).as_json

      assigned_note = second_admin.assignee_notes.find_by(note: note)
      expect(assigned_note.reminder_time).not_to be_nil
      expect(assigned_note.reminder_time.to_datetime
        .strftime('%d %b %Y, %H:%M')).to eql 1.hour.from_now.strftime('%d %b %Y, %H:%M')
      expect(result['errors']).to be_nil
    end

    it 'site worker sets a 24 hour reminder and 1 hour/
     reminder time on assigned note for 2 assignees' do
      # First assignee
      note.assign_or_unassign_user(site_worker.id)

      variables = {
        noteId: note.id,
        hour: 24,
      }

      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: site_worker,
                                                site_community: admin.community,
                                              }).as_json

      assigned_note = site_worker.assignee_notes.find_by(note: note)
      expect(assigned_note.reminder_time).not_to be_nil
      expect(assigned_note.reminder_time.to_datetime
        .strftime('%d %b %Y, %H:%M')).to eql 24.hours.from_now.strftime('%d %b %Y, %H:%M')
      expect(result['errors']).to be_nil
    end

    it 'throws authorization error if not an site manager' do
      note.assign_or_unassign_user(user.id)

      variables = {
        noteId: note.id,
        hour: 24,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                                site_community: admin.community,
                                              }).as_json
      expect(result['errors']).not_to be_nil
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
                                                site_community: admin.community,
                                              }).as_json
      expect(result['errors']).not_to be_nil
      expect(result.dig('errors', 0, 'message')).to eq('Unauthorized')
    end

    it 'enqueues reminder job' do
      note.assign_or_unassign_user(admin.id)

      variables = {
        noteId: note.id,
        hour: 24,
      }

      DoubleGdpSchema.execute(query, variables: variables,
                                     context: {
                                       current_user: admin,
                                       site_community: admin.community,
                                     }).as_json
      expect(TaskReminderUpdateJob).to have_been_enqueued
    end
  end
end
