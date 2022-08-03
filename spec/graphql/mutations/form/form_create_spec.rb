# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Form::FormCreate do
  describe 'create for forms' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'forms',
                          role: admin_role,
                          permissions: %w[can_create_form can_fetch_form])
    end

    let!(:user) { create(:user_with_community, user_type: 'resident', role: resident_role) }
    let!(:admin) do
      create(:admin_user, community_id: user.community_id, role: admin_role, user_type: 'admin')
    end

    let(:mutation) do
      <<~GQL
        mutation formCreate(
          $name: String!,
          $expiresAt: String!,
          $description: String,
          $preview: Boolean!,
          $isPublic: Boolean!,
          $multipleSubmissionsAllowed: Boolean!
          $hasTermsAndConditions: Boolean!
          $roles: [String]
        ){
          formCreate(
            name: $name,
            expiresAt: $expiresAt,
            description: $description,
            preview: $preview,
            isPublic: $isPublic,
            multipleSubmissionsAllowed: $multipleSubmissionsAllowed
            hasTermsAndConditions: $hasTermsAndConditions
            roles: $roles
          ){
            form {
              id
              name
              multipleSubmissionsAllowed
              roles
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
          isPublic: false,
          multipleSubmissionsAllowed: true,
          hasTermsAndConditions: true,
          roles: %w[admin resident],
        }
        expect(Logs::EventLog.count).to eql 2
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: user.community,
                                                     user_role: admin.role,
                                                   }).as_json
        expect(Logs::EventLog.count).to eql 3
        expect(Logs::EventLog.first.subject).to include 'form_create'
        form_details = result.dig('data', 'formCreate', 'form')
        expect(form_details['id']).not_to be_nil
        expect(form_details['name']).to eql 'Form Name'
        expect(form_details['multipleSubmissionsAllowed']).to eql true
        expect(form_details['roles'].size).to eql 2
        expect(form_details['roles'][0]).to eql 'admin'
        expect(form_details['roles'][1]).to eql 'resident'
        expect(result['errors']).to be_nil
      end
    end

    context 'when user is not an admin' do
      it 'throws unauthorized error when user is not admin' do
        variables = {
          name: 'Form Name',
          expiresAt: (rand * 10).to_i.day.from_now.to_s,
          preview: true,
          isPublic: true,
          multipleSubmissionsAllowed: true,
          hasTermsAndConditions: true,
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: user,
                                                     site_community: user.community,
                                                     user_role: user.role,
                                                   }).as_json
        expect(result.dig('data', 'formCreate', 'form', 'id')).to be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end
  end
end
