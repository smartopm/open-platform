# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::EntryRequest do
  describe 'entry_request queries' do
    let!(:community) { current_user.community }
    let(:guest) do
      create(:entry_request, user: admin, name: 'Jose', is_guest: true,
                             community: community, visitation_date: Time.zone.today,
                             granted_at: Time.zone.today)
    end
    let(:another_guest) do
      create(:entry_request, user: admin, name: 'Josè', is_guest: true,
                             community: community, visitation_date: Time.zone.today,
                             granted_at: Time.zone.today, exited_at: Time.zone.today)
    end

    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:visitor_role) { create(:role, name: 'visitor') }
    let!(:permission) do
      create(:permission, module: 'entry_request',
                          role: admin_role,
                          permissions: %w[can_view_entry_requests can_view_entry_request])
    end

    let!(:current_user) { create(:user_with_community, role: visitor_role) }
    let!(:admin) { create(:admin_user, community_id: current_user.community_id, role: admin_role) }

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
      %(query ($offset: Int, $limit: Int, $query: String){
        scheduledRequests(offset: $offset, limit: $limit, query: $query) {
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
      %(query($offset: Int, $limit: Int, $query: String) {
        scheduledGuestList(offset: $offset, limit: $limit, query: $query) {
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
    let(:current_guest_list_query) do
      %(query {
        currentGuests {
          id
          name
          guest {
            id
            name
          }
        }
        })
    end

    let(:community_people_statistics_query) do
      <<~GQL
        query communityPeopleStatistics {
          communityPeopleStatistics {
            peoplePresent
            peopleEntered {
              id
            }
            peopleExited {
              id
            }
          }
        }
      GQL
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
                                           visitation_date: Time.zone.now, guest_id: admin.id)
      end
      result = DoubleGdpSchema.execute(scheduledRequests_query, context: {
                                         current_user: admin,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('data', 'scheduledRequests').length).to eql 2
    end

    # Skipping this test because the implementation has changed, this scope is currently N/A
    xit 'retrieves list of registered guests by end_time scope' do
      2.times do
        current_user.entry_requests.create(reason: 'Visiting', name: 'Visitor Joe', nrc: '012345',
                                           visitation_date: Time.zone.now, guest_id: admin.id,
                                           ends_at: Time.zone.now + 1.hour)
      end
      current_user.entry_requests.create(reason: 'client', name: 'Jane Doe', nrc: '012345',
                                         visitation_date: 8.days.ago, guest_id: admin.id,
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
        visitation_date: Time.zone.now, end_time: '2021-09-23 14:00', guest_id: admin.id
      )

      result = DoubleGdpSchema.execute(
        scheduledRequests_query,
        variables: variables,
        context: {
          current_user: admin,
          site_community: current_user.community,
        },
      ).as_json

      expect(result.dig('data', 'scheduledRequests').length).to eq 1
    end

    it 'searches by ends_at not equal to date' do
      variables = { query: "ends_at != '2021-09-23 18:52'" }
      current_user.entry_requests.create(
        reason: 'Visiting', name: 'Visitor Jane', nrc: '012345', guest_id: admin.id,
        visitation_date: Time.zone.now, ends_at: '2021-09-28T20:52:00+02:00'
      )
      current_user.entry_requests.create(
        reason: 'Visiting', name: 'Visitor Mary', nrc: '012345',
        visitation_date: Time.zone.now, end_time: '2021-09-28 12:00',
        visit_end_date: '2021-09-28T11:00:19+02:00', guest_id: admin.id
      )
      current_user.entry_requests.create(
        reason: 'Visiting', name: 'Visitor John', nrc: '012345',
        visitation_date: Time.zone.now, end_time: '2021-09-23 18:52', guest_id: admin.id
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
        reason: 'Visiting', name: 'Visitor Jane', nrc: '012345', guest_id: admin.id,
        visitation_date: Time.zone.now, ends_at: '2021-09-25T11:00:19+02:00'
      )
      current_user.entry_requests.create(
        reason: 'Visiting', name: 'Visitor Mary', nrc: '012345', guest_id: admin.id,
        visitation_date: Time.zone.now, ends_at: '2021-09-29T09:00:19+02:00'
      )
      current_user.entry_requests.create(
        reason: 'Visiting', name: 'Visitor John', nrc: '012345', guest_id: admin.id,
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

    context 'when guest are present with special characters' do
      before do
        guest
        another_guest
      end

      it 'returns the list of guests with name matching with normal and special characters' do
        variables = { query: 'Jose' }
        result = DoubleGdpSchema.execute(scheduled_guest_list_query,
                                         variables: variables,
                                         context: {
                                           current_user: admin,
                                           site_community: community,
                                         }).as_json
        expect(result.dig('data', 'scheduledGuestList').length).to eql 2
        guest_data = result.dig('data', 'scheduledGuestList')
        expect(%w[Jose Josè]).to include(guest_data[0]['name'])
        expect(%w[Jose Josè]).to include(guest_data[1]['name'])
      end
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

    it 'should retrieve list of current guests' do
      3.times do
        admin.entry_requests.create(reason: 'Visiting', name: 'Visitor Joe', nrc: '012345',
                                    visitation_date: Time.zone.now, granted_at: Time.zone.now,
                                    granted_state: 1, guest_id: admin.id)
      end
      result = DoubleGdpSchema.execute(current_guest_list_query, context: {
                                         current_user: admin,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('data', 'currentGuests').length).to eql 3
    end
    it 'should return an error when not properly authenticated' do
      2.times do
        admin.entry_requests.create(reason: 'Visiting', name: 'Visitor Joe', nrc: '012345',
                                    visitation_date: Time.zone.now, granted_at: Time.zone.now,
                                    granted_state: 2)
      end
      result = DoubleGdpSchema.execute(current_guest_list_query, context: {
                                         current_user: nil,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
      expect(result.dig('data', 'currentGuests')).to be_nil
    end

    it 'should not retrieve list of registered guests when authentication is missing' do
      result = DoubleGdpSchema.execute(scheduledRequests_query, context: {
                                         current_user: current_user,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
      expect(result.dig('data', 'scheduledRequests')).to be_nil
    end

    describe '#community_people_statistics' do
      context 'when current user is verified' do
        before do
          guest
          another_guest
        end
        it 'returns statistics for the community' do
          result = DoubleGdpSchema.execute(community_people_statistics_query, context: {
                                             current_user: admin,
                                             site_community: current_user.community,
                                           }).as_json
          data = result.dig('data', 'communityPeopleStatistics')
          expect(data['peoplePresent']).to eql 1
          expect(data['peopleEntered'].count).to eql 2
          expect(data['peopleExited'].count).to eql 1
        end
      end
    end
  end
end
