# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Post::LogSharedPost do
  describe 'LogSharedPost' do
    let!(:user) { create(:user_with_community) }

    let(:query) do
      <<~GQL
        mutation LogSharedPost($postId: String!) {
          logSharedPost(postId: $postId) {
            eventLog {
              id
              data
            }
          }
        }
      GQL
    end

    it 'creates a post_shared log' do
      prev_log_count = EventLog.count
      variables = {
        postId: '111',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                              }).as_json
      expect(result.dig('errors')).to be_nil
      expect(result.dig('data', 'logSharedPost', 'eventLog', 'id')).not_to be_nil
      expect(result.dig('data', 'logSharedPost', 'eventLog', 'data', 'post_id')).to eql('111')
      expect(EventLog.count).to eql(prev_log_count + 1)
    end

    it "raises 'Unauthorized' error if user is not logged in" do
      variables = {
        postId: '112',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: nil,
                                              }).as_json
      expect(result.dig('errors')).not_to be_nil
      expect(result.dig('errors', 0, 'message')).to eq('Unauthorized')
    end
  end
end
