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
    let!(:visitor) do
      create(:user_with_community, user_type: 'visitor', email: 'visiting@admin.com',
                                   community_id: admin.community_id, role: visitor_role)
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

    let!(:invite) { admin.invite_guest(visitor.id, another_guest.id) }
    let!(:entry_time) do
      admin.community.entry_times.create(
        visitation_date: '2021-11-16 10:02:25',
        starts_at: '2021-11-16 10:02:25',
        ends_at: '2021-11-16 12:02:25',
        occurs_on: [],
        visit_end_date: nil,
        visitable_id: invite.id,
        visitable_type: 'Logs::Invite',
      )
    end

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
            videoUrl
            imageUrls
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
          imageUrls
          videoUrl
          guest {
            id
          }
          thumbnailUrl
          multipleInvites
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
          imageUrls
          videoUrl
        }
        })
    end
    let(:current_guest_list_query) do
      <<~GQL
        query currentGuests($type: String, $duration: String){
          currentGuests(type: $type, duration: $duration) {
            id
            name
            guest {
              id
              name
            }
            user {
              id
            }
          }
          }
      GQL
    end

    let(:community_people_statistics_query) do
      <<~GQL
        query communityPeopleStatistics($duration: String) {
          communityPeopleStatistics(duration: $duration) {
            peoplePresent
            peopleEntered
            peopleExited
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
      expect(result.dig('data', 'entryRequests').length).to eql 3
    end

    it 'should retrieve list of registered guests' do
      request = current_user.entry_requests.create!(reason: 'Visiting', name: 'Visitor Joe',
                                                    nrc: '012345', guest_id: admin.id,
                                                    community: current_user.community,
                                                    visitation_date: Time.zone.now)

      current_user.invites.create!(guest_id: admin.id, host_id: current_user.id,
                                   entry_request_id: request.id, status: :active)
      result = DoubleGdpSchema.execute(scheduledRequests_query, context: {
                                         current_user: admin,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('data', 'scheduledRequests').length).to eql 1
      expect(result.dig('data', 'scheduledRequests', 0, 'multipleInvites')).to eql false
    end

    it 'searches by end_time and ends_at' do
      variables = { query: "ends_at : '2021-09-23 14:00'" }
      current_user.entry_requests.create(
        reason: 'Visiting', name: 'Visitor Jane', nrc: '012345',
        visitation_date: Time.zone.now, ends_at: '2021-09-23T16:00:00+02:00'
      )
      request = current_user.entry_requests.create(
        reason: 'Visiting', name: 'Visitor John', nrc: '012345',
        visitation_date: Time.zone.now, end_time: '2021-09-23 14:00', guest_id: admin.id
      )
      admin.invites.create!(guest_id: visitor.id, host_id: current_user.id,
                            entry_request_id: request.id)
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
      request = current_user.entry_requests.create(
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

      current_user.invites.create!(guest_id: admin.id, host_id: current_user.id,
                                   entry_request_id: request.id)
      current_user.invites.create!(guest_id: visitor.id, host_id: admin.id,
                                   entry_request_id: request.id)
      result = DoubleGdpSchema.execute(
        scheduledRequests_query,
        variables: variables,
        context: {
          current_user: admin,
          site_community: current_user.community,
        },
      ).as_json

      expect(result.dig('data', 'scheduledRequests').length).to eq 1
      expect(result.dig('data', 'scheduledRequests')
        .find { |visitor| visitor['name'] == 'Visitor John' }).to be_nil
    end

    it 'searches by ends_at date range' do
      variables = { query: "ends_at >= '2021-09-25 00:45' AND ends_at <= '2021-09-29 12:00'" }
      request1 = current_user.entry_requests.create(
        reason: 'Visiting', name: 'Visitor Jane', nrc: '012345', guest_id: admin.id,
        visitation_date: Time.zone.now, ends_at: '2021-09-25T11:00:19+02:00'
      )
      request2 = current_user.entry_requests.create(
        reason: 'Visiting', name: 'Visitor Mary', nrc: '012345', guest_id: admin.id,
        visitation_date: Time.zone.now, ends_at: '2021-09-29T09:00:19+02:00'
      )
      current_user.entry_requests.create(
        reason: 'Visiting', name: 'Visitor John', nrc: '012345', guest_id: admin.id,
        visitation_date: Time.zone.now, ends_at: '2021-09-30T11:00:19+02:00'
      )

      current_user.invites.create!(guest_id: admin.id, host_id: current_user.id,
                                   entry_request_id: request1.id)
      current_user.invites.create!(guest_id: visitor.id, host_id: admin.id,
                                   entry_request_id: request2.id)

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
      expect(result.dig('data', 'scheduledGuestList').length).to eql 3
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
      expect(result.dig('data', 'currentGuests').length).to eql 4
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

    context 'when type is used to filter current guests' do
      # let(:another_guest) is being used here to test all 3 it blocks
      context 'when type is for people present' do
        before { guest }

        it 'returns the list of people present in the community' do
          variables = { type: 'peoplePresent' }
          result = DoubleGdpSchema.execute(current_guest_list_query,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: current_user.community,
                                           }).as_json
          expect(result['errors']).to be_nil
          expect(result.dig('data', 'currentGuests').size).to eql 1
        end
      end

      context 'when type is for people entered' do
        it 'returns the list of people entered in the community' do
          variables = { type: 'peopleEntered' }
          result = DoubleGdpSchema.execute(current_guest_list_query,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: current_user.community,
                                           }).as_json
          expect(result['errors']).to be_nil
          expect(result.dig('data', 'currentGuests').size).to eql 1
        end
      end

      context 'when type is for people exited' do
        it 'returns the list of people exited from the community' do
          variables = { type: 'peopleExited' }
          result = DoubleGdpSchema.execute(current_guest_list_query,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: current_user.community,
                                           }).as_json
          expect(result['errors']).to be_nil
          expect(result.dig('data', 'currentGuests').size).to eql 1
        end
      end

      context 'when no type is provided but duration is provided' do
        it 'returns list of entry requests created in the given duration' do
          variables = { duration: 'past7Days' }
          result = DoubleGdpSchema.execute(current_guest_list_query,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: current_user.community,
                                           }).as_json
          expect(result['errors']).to be_nil
          expect(result.dig('data', 'currentGuests').size).to eql 1
        end
      end
    end

    describe '#community_people_statistics' do
      context 'when current user is verified' do
        before do
          guest
          another_guest
        end

        context 'when duration is for present day' do
          it 'returns statistics for the community' do
            variables = { duration: 'today' }
            result = DoubleGdpSchema.execute(community_people_statistics_query,
                                             variables: variables,
                                             context: {
                                               current_user: admin,
                                               site_community: current_user.community,
                                             }).as_json
            data = result.dig('data', 'communityPeopleStatistics')
            expect(data['peoplePresent']).to eql 1
            expect(data['peopleEntered']).to eql 2
            expect(data['peopleExited']).to eql 1
          end
        end

        context 'when duration is for past 7 days' do
          before do
            guest.update(granted_at: Time.zone.now - 5.days)
          end
          it 'returns statistics for the community' do
            variables = { duration: 'past7Days' }
            result = DoubleGdpSchema.execute(community_people_statistics_query,
                                             variables: variables,
                                             context: {
                                               current_user: admin,
                                               site_community: current_user.community,
                                             }).as_json
            data = result.dig('data', 'communityPeopleStatistics')
            expect(data['peoplePresent']).to eql 1
            expect(data['peopleEntered']).to eql 2
            expect(data['peopleExited']).to eql 1
          end
        end

        context 'when duration is for past 30 days' do
          before do
            guest.update(granted_at: Time.zone.now - 22.days)
          end
          it 'returns statistics for the community' do
            variables = { duration: 'past30Days' }
            result = DoubleGdpSchema.execute(community_people_statistics_query,
                                             variables: variables,
                                             context: {
                                               current_user: admin,
                                               site_community: current_user.community,
                                             }).as_json
            data = result.dig('data', 'communityPeopleStatistics')
            expect(data['peoplePresent']).to eql 1
            expect(data['peopleEntered']).to eql 2
            expect(data['peopleExited']).to eql 1
          end
        end
      end
    end
  end
end
