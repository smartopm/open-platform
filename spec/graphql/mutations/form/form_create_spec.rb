# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Form::FormCreate do
  describe 'create for forms' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }

    let(:mutation) do
      <<~GQL
        mutation formCreate(
          $name: String!,
          $expiresAt: String!,
          $description: String,
          $preview: Boolean!,
          $multipleSubmissionsAllowed: Boolean!
        ){
          formCreate(
            name: $name,
            expiresAt: $expiresAt,
            description: $description,
            preview: $preview,
            multipleSubmissionsAllowed: $multipleSubmissionsAllowed
          ){
            form {
              id
              name
              multipleSubmissionsAllowed
            }
          }
        }
      GQL
    end

    context 'when user is an admin' do
      it 'creates a form' do
        variables = {
          name: 'Form Name',
          expiresAt: (rand * 10).to_i.day.from_now.to_s,
          preview: true,
          multipleSubmissionsAllowed: true,
        }
        expect(Logs::EventLog.count).to eql 0
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: user.community,
                                                   }).as_json
        expect(Logs::EventLog.count).to eql 1
        expect(Logs::EventLog.first.subject).to include 'form_create'
        form_details = result.dig('data', 'formCreate', 'form')
        expect(form_details['id']).not_to be_nil
        expect(form_details['name']).to eql 'Form Name'
        expect(form_details['multipleSubmissionsAllowed']).to eql true
        expect(result['errors']).to be_nil
      end
    end

    context 'when user is not an admin' do
      it 'throws unauthorized error when user is not admin' do
        variables = {
          name: 'Form Name',
          expiresAt: (rand * 10).to_i.day.from_now.to_s,
          preview: true,
          multipleSubmissionsAllowed: true,
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
end
