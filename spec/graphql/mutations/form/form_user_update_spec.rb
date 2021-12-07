# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Form::FormUserUpdate do
  describe 'update mutation for forms' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'forms',
                          role: admin_role,
                          permissions: %w[can_update_form_user])
    end

    let!(:current_user) { create(:user_with_community, role: resident_role, user_type: 'resident') }
    let!(:admin) do
      create(:admin_user, community_id: current_user.community_id, role: admin_role,
                          user_type: 'admin')
    end
    let!(:another_user) do
      create(:user, community_id: current_user.community_id,
                    role: resident_role, user_type: 'resident')
    end
    let!(:form) { create(:form, community_id: current_user.community_id) }
    let!(:form_property) { create(:form_property, form: form, field_type: 'text') }
    let!(:form_user) do
      current_user.form_users.create!(form_id: form.id, status: 1, status_updated_by_id: admin.id)
    end

    let(:mutation) do
      <<~GQL
        mutation formUserUpdate($userId: ID!, $formUserId: ID!, $propValues: JSON!) {
            formUserUpdate(userId: $userId, formUserId: $formUserId, propValues: $propValues){
            formUser {
              id
              status
              form {
                id
              }
            }
          }
        }
      GQL
    end
    it 'should update a form ' do
      values = {
        user_form_properties: [
          {
            form_property_id: form_property.id,
            value: 'something new',
          },
        ],
      }
      variables = {
        formUserId: form_user.id,
        userId: current_user.id,
        propValues: values.to_json,
      }
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: admin,
                                                   site_community: current_user.community,
                                                   user_role: admin.role,
                                                 }).as_json
      expect(result.dig('data', 'formUserUpdate', 'formUser', 'id')).not_to be_nil
      expect(result.dig('data', 'formUserUpdate', 'formUser', 'form', 'id')).to eql form.id
      expect(result['errors']).to be_nil
    end

    it 'should err when form provided is not valid' do
      values = {
        user_form_properties: [
          {
            form_property_id: form_property.id,
            value: 'something new',
          },
        ],
      }
      variables = {
        formUserId: '3453rsnjsdi-43rdf34-sdf43',
        userId: current_user.id,
        propValues: values.to_json,
      }
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: admin,
                                                   site_community: current_user.community,
                                                   user_role: admin.role,
                                                 }).as_json

      expect(result.dig('errors', 0, 'message')).to eql 'Record not found'
    end

    it 'should err when user not admin and user_id is different' do
      values = {
        user_form_properties: [
          {
            form_property_id: form_property.id,
            value: 'something new',
          },
        ],
      }
      variables = {
        formUserId: form_user.id,
        userId: current_user.id,
        propValues: values.to_json,
      }
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: another_user,
                                                   site_community: current_user.community,
                                                   user_role: another_user.role,
                                                 }).as_json
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
    end

    it 'should update form-user to pending if it was previously draft' do
      form_user.update!(status: 'draft')
      values = {
        user_form_properties: [
          {
            form_property_id: form_property.id,
            value: 'something new',
          },
        ],
      }
      variables = {
        formUserId: form_user.id,
        userId: current_user.id,
        propValues: values.to_json,
      }
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: current_user,
                                                   site_community: current_user.community,
                                                   user_role: current_user.role,
                                                 }).as_json

      expect(result.dig('data', 'formUserUpdate', 'formUser', 'status')).to eq('pending')
      expect(result.dig('errors', 0, 'message')).to be_nil
    end
  end
end
