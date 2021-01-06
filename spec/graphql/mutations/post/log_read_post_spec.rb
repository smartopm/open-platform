# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Post::LogReadPost do
  describe 'LogReadPost' do
    let!(:user) { create(:user_with_community) }

    let(:query) do
      <<~GQL
        mutation LogReadPost($postId: String!) {
          logReadPost(postId: $postId) {
            eventLog {
              id
              data
            }
          }
        }
      GQL
    end

    it 'creates a post_read log' do
      prev_log_count = EventLog.count
      variables = {
        postId: '111',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                              }).as_json
      expect(result['errors']).to be_nil
      expect(result.dig('data', 'logReadPost', 'eventLog', 'id')).not_to be_nil
      expect(result.dig('data', 'logReadPost', 'eventLog', 'data', 'post_id')).to eql('111')
      expect(EventLog.count).to eql(prev_log_count + 1)
    end

    it 'ignores if a post has already been read by a user in the same community' do
      create(:event_log, acting_user: user, community: user.community,
                         subject: 'post_read',
                         data: {
                           post_id: '112',
                         })
      prev_log_count = EventLog.count

      variables = {
        postId: '112',
      }
      DoubleGdpSchema.execute(query, variables: variables,
                                     context: {
                                       current_user: user,
                                     }).as_json
      expect(EventLog.count).to eql(prev_log_count)
    end

    it "raises 'Unauthorized' error if user is not logged in" do
      variables = {
        postId: '112',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: nil,
                                              }).as_json
      expect(result['errors']).not_to be_nil
      expect(result.dig('errors', 0, 'message')).to eq('Unauthorized')
    end
  end
end
