# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::EntryRequest do
  describe 'entry_request queries' do
    let!(:current_user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: current_user.community_id) }
    let(:entry_request_query) do
      <<~GQL
        query entryRequest(
          $id: ID!
        ) {
          entryRequest(id: $id) {
            id
            }
          }
      GQL
    end

    let(:entry_requests_query) do
      %(query {
        entryRequests {
            id
          }
        })
    end

    let(:scheduledRequests_query) do
      %(query {
        scheduledRequests {
          id
          name
          user {
            id
            name
            imageUrl
            avatarUrl
          }
          occursOn
          visitEndDate
          visitationDate
          endTime
          startTime
        }
        })
    end

    it 'should retrieve one entry_request' do
      entry_request = current_user.entry_requests.create(reason: 'Visiting',
                                                         name: 'Visitor Joe', nrc: '012345')
      variables = {
        id: entry_request.id,
      }
      result = DoubleGdpSchema.execute(entry_request_query, variables: variables,
                                                            context: {
                                                              current_user: admin,
                                                              site_community: admin.community,
                                                            }).as_json
      expect(result.dig('data', 'entryRequest').length).to eql 1
      expect(result.dig('data', 'entryRequest', 'id')).to eql entry_request.id
    end

    it 'should retrieve list of entry_request' do
      2.times do
        current_user.entry_requests.create(reason: 'Visiting',
                                           name: 'Visitor Joe', nrc: '012345')
      end
      result = DoubleGdpSchema.execute(entry_requests_query, context: {
                                         current_user: admin,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('data', 'entryRequests').length).to eql 2
    end

    it 'should retrieve list of registered guests' do
      2.times do
        current_user.entry_requests.create(reason: 'Visiting', name: 'Visitor Joe', nrc: '012345',
                                           visitation_date: Time.zone.now)
      end
      result = DoubleGdpSchema.execute(scheduledRequests_query, context: {
                                         current_user: admin,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('data', 'scheduledRequests').length).to eql 2
    end

    it 'should not retrieve list of registered guests' do
      # 2.times do
      #   current_user.entry_requests.create(reason: 'Visiting',name: 'Visitor Joe', nrc: '012345',
      #                                      visitation_date: Time.zone.now)
      # end
      result = DoubleGdpSchema.execute(scheduledRequests_query, context: {
                                         current_user: current_user,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
      expect(result.dig('data', 'scheduledRequests')).to be_nil
    end
  end
end
