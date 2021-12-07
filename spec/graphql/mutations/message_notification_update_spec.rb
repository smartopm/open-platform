# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Message do
  describe 'update message notification' do
    let!(:current_user) { create(:admin_user) }
    let(:query) do
      <<~GQL
        mutation MsgNotificationUpdate {
          messageNotificationUpdate {
            success
          }
        }
      GQL
    end

    it 'returns an updated notification' do
      result = DoubleGdpSchema.execute(query,
                                       context: {
                                         current_user: current_user,
                                         site_community: current_user.community,
                                       }).as_json

      expect(result.dig('data', 'messageNotificationUpdate', 'success')).to eql true
      expect(result['errors']).to be_nil
    end

    it 'returns an error when not authorized' do
      result = DoubleGdpSchema.execute(query,
                                       context: {
                                         current_user: nil,
                                       }).as_json

      expect(result.dig('data', 'messageNotificationUpdate')).to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end
  end
end
