# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Temperature::TemperatureUpdate do
  describe 'record temperature' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:entry_request) { user.entry_requests.create(name: 'John', reason: 'Visiting') }

    let(:query) do
      <<~GQL
        mutation TemperatureUpdate($refId: ID!, $temp: String!, $refName: String!, $refType: String!){
          temperatureUpdate(refId: $refId, temp: $temp, refName: $refName, refType: $refType){
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
        refType: 'User',
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
        refType: 'User',
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

    it 'should  record temperature on manual entries' do
      variables = {
        refId: entry_request.id,
        temp: '40',
        refName: 'oljm',
        refType: 'EntryRequest',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin,
                                              }).as_json

      expect(result.dig('data', 'temperatureUpdate', 'eventLog', 'refId')).to eql entry_request.id
      expect(result.dig('data', 'temperatureUpdate', 'eventLog', 'sentence')).to eql "Temperature
                                        for #{variables[:refName]} was recorded by #{admin.name}"
      expect(result.dig('data', 'temperatureUpdate', 'eventLog', 'data', 'ref_name')).to eql 'oljm'
      expect(result.dig('data', 'temperatureUpdate', 'eventLog', 'data', 'note')).to eql '40'
      expect(result.dig('errors')).to be_nil
    end

    it 'should not record temperature when an entry request does not exist' do
      variables = {
        refId: SecureRandom.uuid,
        temp: '40',
        refName: 'oljm',
        refType: 'EntryRequest',
      }
      result = DoubleGdpSchema.execute(query, variables: variables,
                                              context: {
                                                current_user: admin,
                                              }).as_json

      expect(result.dig('data', 'temperatureUpdate', 'eventLog', 'refId')).to be_nil
      expect(result.dig('data', 'temperatureUpdate', 'eventLog', 'sentence')).to be_nil
      expect(result.dig('data', 'temperatureUpdate', 'eventLog', 'data')).to be_nil
      expect(result.dig('errors', 0, 'message')).to eql "For some reason,
                                            I can't process your request"
    end
  end
end
