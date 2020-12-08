# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Form::FormCreate do
  describe 'create for forms' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }

    let(:mutation) do
      <<~GQL
        mutation formCreate($name: String!, $expiresAt: String!) {
          formCreate(name: $name, expiresAt: $expiresAt){
            form {
              id
              name
            }
          }
        }
      GQL
    end

    it 'creates a form' do
      variables = {
        name: 'Form Name',
        expiresAt: (rand * 10).to_i.day.from_now.to_s,
      }
      expect(EventLog.count).to eql 0
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: admin,
                                                   site_community: user.community,
                                                 }).as_json
      expect(EventLog.count).to eql 1
      expect(EventLog.first.subject).to include 'form_create'
      expect(result.dig('data', 'formCreate', 'form', 'id')).not_to be_nil
      expect(result.dig('data', 'formCreate', 'form', 'name')).to eql 'Form Name'
      expect(result.dig('errors')).to be_nil
    end

    it 'throws unauthorized error when user is not admin' do
      variables = {
        name: 'Form Name',
        expiresAt: (rand * 10).to_i.day.from_now.to_s,
      }
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: user,
                                                   site_community: user.community,
                                                 }).as_json
      expect(result.dig('data', 'formCreate', 'form', 'id')).to be_nil
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
    end
  end
end
