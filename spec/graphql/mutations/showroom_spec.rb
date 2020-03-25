# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Note do
  describe 'creating a showroom entry' do
    let!(:user) { create(:user_with_community) }

    let(:query) do
      <<~GQL
        mutation ShowroomCreate($name: String) {
            showroomEntryCreate(name:$name){
                showroom {
                    name
                    id
                }
            }
        }
      GQL
    end

    it 'creates entry for showroom' do
      variables = {
        name: 'Olivier',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                              }).as_json
      expect(result.dig('data', 'showroomEntryCreate', 'showroom', 'id')).not_to be_nil
      expect(result.dig('data', 'showroomEntryCreate', 'showroom', 'name')).to eql 'Olivier'
      expect(result.dig('errors')).to be_nil
    end
  end
end
