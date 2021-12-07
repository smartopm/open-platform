# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Form::FormUpdate do
  describe 'Update for forms' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'forms',
                          role: admin_role,
                          permissions: %w[can_update_form])
    end

    let!(:user) { create(:user_with_community, user_type: 'resident', role: resident_role) }
    let!(:admin) do
      create(:admin_user, community_id: user.community_id, role: admin_role, user_type: 'admin')
    end

    let!(:form) { create(:form, community_id: user.community_id, roles: ['resident']) }

    let(:mutation) do
      <<~GQL
        mutation formUpdate(
          $id: ID!,
          $name: String,
          $status: String,
          $preview: Boolean,
          $multipleSubmissionsAllowed: Boolean
          $roles: [String]
          ) {
          formUpdate(id: $id,
            name: $name,
            status: $status,
            preview: $preview,
            multipleSubmissionsAllowed: $multipleSubmissionsAllowed
            roles: $roles
          ){
            form {
              id
              name
              preview
              multipleSubmissionsAllowed
              roles
            }
          }
        }
      GQL
    end

    it 'updates form name' do
      variables = {
        id: form.id,
        name: 'Updated Name',
        preview: true,
        multipleSubmissionsAllowed: false,
        roles: [],
      }
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: admin,
                                                   site_community: user.community,
                                                   user_role: admin.role,
                                                 }).as_json
      form_result = result.dig('data', 'formUpdate', 'form')
      expect(form_result['name']).to eql 'Updated Name'
      expect(form_result['preview']).to eql true
      expect(form_result['multipleSubmissionsAllowed']).to eql false
      expect(form_result['roles']).to eql []
      expect(result['errors']).to be_nil
    end

    it 'updates form status, coould be published or deleted' do
      variables = {
        id: form.id,
        status: 'deleted',
      }
      expect(user.community.forms.count).to eql 1
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: admin,
                                                   site_community: user.community,
                                                   user_role: admin.role,
                                                 }).as_json
      expect(result.dig('data', 'formUpdate', 'form', 'id')).to_not be_nil
      expect(result['errors']).to be_nil
      expect(user.community.forms.count).to eql 0
    end

    it 'throws unauthorized error when user is not admin' do
      variables = {
        id: form.id,
        name: 'Updated Name',
      }
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: user,
                                                   site_community: user.community,
                                                   user_role: user.role,
                                                 }).as_json
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
    end
  end
end
