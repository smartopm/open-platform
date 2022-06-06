# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Message do
  describe 'creating a message record' do
    let(:resident_role) { create(:role, name: 'resident') }
    let!(:non_admin) { create(:user_with_community) }
    let(:receiver) do
      create(:user,
             name: 'Mark',
             phone_number: '',
             role: resident_role,
             email: 'mark@test.com',
             user_type: 'resident',
             community_id: non_admin.community_id)
    end
    let!(:admin) do
      create(:admin_user, community_id: non_admin.community_id, phone_number: '260971500748')
    end
    let!(:note) do
      admin.notes.create!(
        body: 'This is a note',
        user_id: non_admin.id,
        community_id: non_admin.community_id,
        author_id: admin.id,
      )
    end

    let(:query) do
      <<~GQL
        mutation messageCreate($receiver: String!, $message: String!, $userId: ID!) {
            messageCreate(receiver:$receiver, message: $message, userId: $userId){
                message {
                    id
                    message
                    category
                }
            }
        }
      GQL
    end

    let(:query_with_note) do
      <<~GQL
        mutation messageCreate($receiver: String!, $message: String!, $userId: ID!, $noteId: ID!){
          messageCreate(receiver:$receiver, message: $message, userId: $userId, noteId: $noteId){
            message {
                id
                message
            }
          }
        }
      GQL
    end

    it 'admin sends a message to a client' do
      variables = {
        receiver: '260971500748',
        message: 'Hello You, hope you are well',
        userId: non_admin.id,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin,
                                                site_community: non_admin.community,
                                              }).as_json
      expect(result.dig('data', 'messageCreate', 'message', 'id')).not_to be_nil
      expect(result.dig('data', 'messageCreate', 'message',
                        'message')).to eql variables[:message]
      expect(result.dig('data', 'messageCreate', 'message', 'category')).to eql 'sms'
      expect(result['errors']).to be_nil
      message_in_db = Notifications::Message.first
      expect(Notifications::Message.all.count).to eql 1
      expect(message_in_db[:receiver]).to eql '260971500748'
      expect(message_in_db[:message]).to eql 'Hello You, hope you are well'
      expect(message_in_db[:user_id]).to eql non_admin.id
      expect(message_in_db[:sender_id]).to eql admin.id
    end

    it 'client sends a message to an admin' do
      variables = {
        receiver: '260971500748',
        message: 'Hello You, hope you are well',
        userId: admin.id,
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                site_community: non_admin.community,
                                                current_user: non_admin,
                                              }).as_json
      expect(result.dig('data', 'messageCreate', 'message', 'id')).not_to be_nil
      expect(result.dig('data', 'messageCreate', 'message',
                        'message')).to eql variables[:message]
      expect(result['errors']).to be_nil
      message_in_db = Notifications::Message.first
      expect(Notifications::Message.all.count).to eql 1
      expect(message_in_db[:receiver]).to eql '260971500748'
      expect(message_in_db[:message]).to eql 'Hello You, hope you are well'
      expect(message_in_db[:user_id]).to eql admin.id
      expect(message_in_db[:sender_id]).to eql non_admin.id
    end

    it 'create message with note association should create Note History record' do
      variables = {
        receiver: '260971500748',
        message: 'Hello You, hope you are well',
        userId: admin.id,
        noteId: note.id,
      }
      result = DoubleGdpSchema.execute(query_with_note, variables: variables,
                                                        context: {
                                                          site_community: non_admin.community,
                                                          current_user: non_admin,
                                                        }).as_json
      expect(result.dig('data', 'messageCreate', 'message', 'id')).not_to be_nil
      expect(Notes::NoteHistory.count).to eql 1
      expect(Notes::NoteHistory.last.note_id).to eql note.id
      expect(Notes::NoteHistory.last.user_id).to eql non_admin.id
      expect(result['errors']).to be_nil
    end

    context 'when message is sent' do
      it 'creates notification for receiver' do
        variables = {
          receiver: admin.phone_number,
          message: 'Hello You, hope you are well',
          userId: admin.id,
        }
        result = DoubleGdpSchema.execute(query, variables: variables,
                                                context: {
                                                  site_community: non_admin.community,
                                                  current_user: non_admin,
                                                }).as_json
        expect(result['errors']).to be_nil
        expect(admin.notifications.count).to eql 1
      end
    end

    context 'when receiver phone number is blank' do
      it 'raises error' do
        variables = {
          receiver: '',
          message: 'Hello you, hope you are well',
          userId: receiver.id,
        }
        result = DoubleGdpSchema.execute(query, variables: variables,
                                                context: {
                                                  current_user: admin,
                                                  site_community: receiver.community,
                                                }).as_json
        expect(result['errors']).to_not be nil
        expect(result.dig('errors', 0, 'message')).to eql 'No phone number to send message'
      end
    end
  end
end
