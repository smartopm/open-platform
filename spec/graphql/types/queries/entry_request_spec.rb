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

    let(:guest_list_entry) do
      <<~GQL
        query guestListEntry(
          $id: ID!
        ) {
          guestListEntry(id: $id) {
            id
            name
            revokedAt
            revoked
            active
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
      %(query ($offset: Int, $limit: Int, $query: String, $scope: Int){
        scheduledRequests(offset: $offset, limit: $limit, query: $query, scope: $scope) {
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
          endsAt
          startsAt
        }
        })
    end

    let(:scheduled_guest_list_query) do
      %(query {
        scheduledGuestList {
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
          revokedAt
          revoked
          active
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

    it 'should retrieve one guest list entry request' do
      entry_request = current_user.entry_requests.create(reason: 'Visiting',
                                                         name: 'Visitor Joe',
                                                         nrc: '012345',
                                                         is_guest: true)
      variables = {
        id: entry_request.id,
      }
      result = DoubleGdpSchema.execute(guest_list_entry, variables: variables,
                                                         context: {
                                                           current_user: current_user,
                                                           site_community: current_user.community,
                                                         }).as_json
      expect(result.dig('data', 'guestListEntry', 'name')).to eql 'Visitor Joe'
      expect(result.dig('data', 'guestListEntry', 'id')).to eql entry_request.id
    end

    it 'should raise unauthorized if current user is missing' do
      entry_request = current_user.entry_requests.create(reason: 'Visiting',
                                                         name: 'Visitor Joe',
                                                         nrc: '012345',
                                                         is_guest: true)
      variables = {
        id: entry_request.id,
      }
      result = DoubleGdpSchema.execute(guest_list_entry, variables: variables,
                                                         context: {
                                                           current_user: nil,
                                                           site_community: current_user.community,
                                                         }).as_json
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
      expect(result.dig('data', 'guestListEntry')).to be_nil
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

    it 'retrieves list of registered guests by end_time scope' do
      2.times do
        current_user.entry_requests.create(reason: 'Visiting', name: 'Visitor Joe', nrc: '012345',
                                           visitation_date: Time.zone.now,
                                           ends_at: Time.zone.now + 1.hour)
      end
      current_user.entry_requests.create(reason: 'client', name: 'Jane Doe', nrc: '012345',
                                         visitation_date: 8.days.ago,
                                         ends_at: 8.days.ago)

      result = DoubleGdpSchema.execute(scheduledRequests_query, variables: { scope: 7 }, context: {
                                         current_user: admin,
                                         site_community: current_user.community,
                                       }).as_json

      expect(result.dig('data', 'scheduledRequests').length).to eql 2
      expect(
        result['data']['scheduledRequests'].find { |guest| guest['name'] == 'Jane Doe' },
      ).to be_nil
    end

    it 'searches by end_time and ends_at' do
      variables = { query: "ends_at : '2021-09-23 14:00'" }
      current_user.entry_requests.create(
        reason: 'Visiting', name: 'Visitor Jane', nrc: '012345',
        visitation_date: Time.zone.now, ends_at: '2021-09-23T16:00:00+02:00'
      )
      current_user.entry_requests.create(
        reason: 'Visiting', name: 'Visitor John', nrc: '012345',
        visitation_date: Time.zone.now, end_time: '2021-09-23 14:00'
      )

      result = DoubleGdpSchema.execute(
        scheduledRequests_query,
        variables: variables,
        context: {
          current_user: admin,
          site_community: current_user.community,
        },
      ).as_json

      expect(result.dig('data', 'scheduledRequests').length).to eq 2
    end

    it 'searches by ends_at not equal to date' do
      variables = { query: "ends_at != '2021-09-23 18:52'" }
      current_user.entry_requests.create(
        reason: 'Visiting', name: 'Visitor Jane', nrc: '012345',
        visitation_date: Time.zone.now, ends_at: '2021-09-28T20:52:00+02:00'
      )
      current_user.entry_requests.create(
        reason: 'Visiting', name: 'Visitor Mary', nrc: '012345',
        visitation_date: Time.zone.now, end_time: '2021-09-28 12:00',
        visit_end_date: '2021-09-28T11:00:19+02:00'
      )
      current_user.entry_requests.create(
        reason: 'Visiting', name: 'Visitor John', nrc: '012345',
        visitation_date: Time.zone.now, end_time: '2021-09-23 18:52'
      )

      result = DoubleGdpSchema.execute(
        scheduledRequests_query,
        variables: variables,
        context: {
          current_user: admin,
          site_community: current_user.community,
        },
      ).as_json

      expect(result.dig('data', 'scheduledRequests').length).to eq 2
      expect(result.dig('data', 'scheduledRequests')
        .find { |visitor| visitor['name'] == 'Visitor John' }).to be_nil
    end

    it 'searches by ends_at date range' do
      variables = { query: "ends_at >= '2021-09-25 00:45' AND ends_at <= '2021-09-29 12:00'" }
      current_user.entry_requests.create(
        reason: 'Visiting', name: 'Visitor Jane', nrc: '012345',
        visitation_date: Time.zone.now, ends_at: '2021-09-25T11:00:19+02:00'
      )
      current_user.entry_requests.create(
        reason: 'Visiting', name: 'Visitor Mary', nrc: '012345',
        visitation_date: Time.zone.now, ends_at: '2021-09-29T09:00:19+02:00'
      )
      current_user.entry_requests.create(
        reason: 'Visiting', name: 'Visitor John', nrc: '012345',
        visitation_date: Time.zone.now, ends_at: '2021-09-30T11:00:19+02:00'
      )

      result = DoubleGdpSchema.execute(
        scheduledRequests_query,
        variables: variables,
        context: {
          current_user: admin,
          site_community: current_user.community,
        },
      ).as_json

      expect(result.dig('data', 'scheduledRequests').length).to eq 2
      expect(
        result['data']['scheduledRequests'].find { |guest| guest['name'] == 'Visitor John' },
      ).to be_nil
    end

    it 'should retrieve list of guest list entries' do
      2.times do
        admin.entry_requests.create(reason: 'Visiting', name: 'Visitor Joe', nrc: '012345',
                                    visitation_date: Time.zone.now, is_guest: true)
      end
      result = DoubleGdpSchema.execute(scheduled_guest_list_query, context: {
                                         current_user: admin,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('data', 'scheduledGuestList').length).to eql 2
    end

    it 'should raise unauthorized if current user is missing' do
      2.times do
        admin.entry_requests.create(reason: 'Visiting', name: 'Visitor Joe', nrc: '012345',
                                    visitation_date: Time.zone.now, is_guest: true)
      end
      result = DoubleGdpSchema.execute(scheduled_guest_list_query, context: {
                                         current_user: nil,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
      expect(result.dig('data', 'scheduledGuestList')).to be_nil
    end

    it 'should not retrieve list of registered guests when authentication is missing' do
      result = DoubleGdpSchema.execute(scheduledRequests_query, context: {
                                         current_user: current_user,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
      expect(result.dig('data', 'scheduledRequests')).to be_nil
    end
  end
end
