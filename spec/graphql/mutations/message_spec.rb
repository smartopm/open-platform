# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Message do
  describe 'creating a message record' do
    let!(:user) { create(:user_with_community) }

    let(:query) do
      <<~GQL
        mutation messageCreate($receiver: String!, $smsContent: String, $receiverId: ID) {
            messageCreate(receiver:$receiver", smsContent: $smsContent, receiverId: $receiverId){
                message {
                    id
                    smsContent
                }
            }
        }
      GQL
    end

    it 'creates a message' do
      variables = {
        receiver: "260971500748",
        smsContent:"Hello You, hope you are well",
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                              }).as_json
      Rails.logger.info result
      Rails.logger.info "Testing the message"
      expect(result.dig('data', 'messageCreate', 'message', 'id')).not_to be_nil
      expect(result.dig('data', 'messageCreate', 'message', 'smsContent')).to eql variables[:smsContent]
      expect(result.dig('errors')).to be_nil
    end
  end
end
