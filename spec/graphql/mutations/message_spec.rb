# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Message do
  describe 'creating a message record' do
    let!(:non_admin) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: non_admin.community_id, email: "mutale@doublegdp.com") }

    let(:query) do
      <<~GQL
        mutation messageCreate($receiver: String!, $message: String!, $userId: ID!) {
            messageCreate(receiver:$receiver, message: $message, userId: $userId){
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
                                                current_user: admin
                                              }).as_json
      expect(result.dig('data', 'messageCreate', 'message', 'id')).not_to be_nil
      expect(result.dig('data', 'messageCreate', 'message',
                        'message')).to eql variables[:message]
      expect(result.dig('errors')).to be_nil
      message_in_db = Message.first
      expect(Message.all.count).to eql 1
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
                                                current_user: non_admin,
                                              }).as_json
      expect(result.dig('data', 'messageCreate', 'message', 'id')).not_to be_nil
      expect(result.dig('data', 'messageCreate', 'message',
                        'message')).to eql variables[:message]
      expect(result.dig('errors')).to be_nil
      message_in_db = Message.first
      expect(Message.all.count).to eql 1
      expect(message_in_db[:receiver]).to eql '260971500748'
      expect(message_in_db[:message]).to eql 'Hello You, hope you are well'
      expect(message_in_db[:user_id]).to eql admin.id
      expect(message_in_db[:sender_id]).to eql non_admin.id
    end
  end
end
