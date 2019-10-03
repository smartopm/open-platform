# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::QueryType do
  describe 'member' do
    let!(:member) { create(:member_with_community) }
    let!(:current_user) { member.user }

    let(:query) do
      %(query {
        member(id:"#{member.id}") {
          id
          memberType
          user {
            email
            name
          }
        }
      })
    end

    it 'returns all items' do
      result = DoubleGdpSchema.execute(query, context: { current_user: current_user }).as_json
      expect(result.dig('data', 'member', 'id')).to eql member.id
    end

    it 'should fail if no logged in' do
      result = DoubleGdpSchema.execute(query, context: { current_user: nil }).as_json
      expect(result.dig('data', 'member')).to be_nil
    end
  end

  describe 'entry_logs' do
    before :each do
      @member = create(:member_with_community)
      @reporting_member = create(:member_with_community, community_id: @member.community_id)
      @current_user = @reporting_member.user

      3.times do
        @member.activity_logs.create(reporting_member_id: @reporting_member.id)
      end
      @query =
        %(query {
        entryLogs(memberId:"#{@member.id}") {
          id
          createdAt
          note
          reportingMember {
            user {
              name
            }
          }
        }
      })
    end

    it 'returns all entry logs' do
      result = DoubleGdpSchema.execute(@query, context: {
                                         current_user: @current_user,
                                         current_member: @member,
                                       }).as_json
      expect(result.dig('data', 'entryLogs').length).to eql 3
    end

    it 'should fail if no logged in' do
      result = DoubleGdpSchema.execute(@query, context: { current_user: nil }).as_json
      expect(result.dig('data', 'entryLogs')).to be_nil
    end
  end

  describe 'member_search' do
    before :each do
      @member = create(:member_with_community)
      @member.user.update(name: 'Joe User')
      @admin_member = create(:member_with_community,
                             member_type: 'admin',
                             community_id: @member.community_id)
      @current_user = @admin_member.user

      @query =
        %(query($name: String!) {
          memberSearch(name: $name) {
            id
            memberType
            user {
              id
              name
            }
          }
        })
    end

    it 'returns all entry logs' do
      result = DoubleGdpSchema.execute(@query, context: {
                                         current_user: @current_user,
                                         current_member: @admin_member,
                                       },
                                               variables: { name: 'Joe' }).as_json
      expect(result.dig('data', 'memberSearch').length).to eql 1
      result = DoubleGdpSchema.execute(@query, context: {
                                         current_user: @current_user,
                                         current_member: @admin_member,
                                       },
                                               variables: { name: 'Steve' }).as_json
      expect(result.dig('data', 'memberSearch').length).to eql 0
    end

    it 'should fail if no logged in' do
      result = DoubleGdpSchema.execute(@query, context: { current_user: nil }).as_json
      expect(result.dig('data', 'memberSearch')).to be_nil
    end
  end
end
