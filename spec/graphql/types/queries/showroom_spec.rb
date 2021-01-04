# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Showroom do
  describe 'showroom queries' do
    let!(:current_user) { create(:user_with_community) }
    let!(:showroom) { create(:showroom) }

    let(:showroom_entries) do
      %(
        query {
          showroomEntries {
            id
          }
      })
    end

    it 'should retrieve list of all showroom entries' do
      result = DoubleGdpSchema.execute(showroom_entries,
                                       context: {
                                         current_user: current_user,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('data', 'showroomEntries').length).to eql 1
      expect(result.dig('data', 'showroomEntries', 0, 'id')).to eql showroom.id
    end
  end
end
