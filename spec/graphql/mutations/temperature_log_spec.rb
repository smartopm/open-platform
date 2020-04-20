# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Temperature::TemperatureUpdate do
  describe 'record temperature' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }

    let(:query) do
      <<~GQL
        mutation TemperatureUpdate($refId: ID!, $temp: String!, $refName: String!){
          temperatureUpdate(refId: $refId, temp: $temp, refName: $refName,){
            eventLog {
              sentence
              data
              refId
            }
          }
        }
      GQL
    end

    it 'should record temperature and create an event log when an admin is signed in' do
      variables = {
        refId: admin.id,
        temp: '38',
        refName: 'ojm',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin,
                                              }).as_json

      expect(result.dig('data', 'temperatureUpdate', 'eventLog', 'refId')).to eql admin.id
      expect(result.dig('data', 'temperatureUpdate', 'eventLog', 'sentence')).not_to be_nil
      expect(result.dig('data', 'temperatureUpdate', 'eventLog', 'data')).not_to be_nil
      expect(result.dig('errors')).to be_nil
    end

    it 'should not record temperature when not authorized' do
      variables = {
        refId: user.id,
        temp: '40',
        refName: 'oljm',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: user,
                                              }).as_json

      expect(result.dig('data', 'temperatureUpdate', 'eventLog', 'refId')).to be_nil
      expect(result.dig('data', 'temperatureUpdate', 'eventLog', 'sentence')).to be_nil
      expect(result.dig('data', 'temperatureUpdate', 'eventLog', 'data')).to be_nil
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
    end
  end
end
