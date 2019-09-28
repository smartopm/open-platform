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
end
