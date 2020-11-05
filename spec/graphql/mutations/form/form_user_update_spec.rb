# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Form::FormUserUpdate do
  describe 'update mutation for forms' do
    let!(:current_user) { create(:user_with_community) }
    let!(:another_user) { create(:user, community_id: current_user.community_id) }
    let!(:admin) { create(:admin_user, community_id: current_user.community_id) }
    let!(:form) { create(:form, community_id: current_user.community_id) }
    let!(:form_property) { create(:form_property, form: form, field_type: 'text') }
    let!(:form_user) do
      current_user.form_users.create!(form_id: form.id, status: 1, status_updated_by_id: admin.id)
    end

    let(:mutation) do
      <<~GQL
        mutation formUserUpdate($formId: ID!, $userId: ID!, $propValues: JSON!) {
            formUserUpdate(formId: $formId, userId: $userId, propValues: $propValues){
            formUser {
              id
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
        formId: form.id,
        userId: current_user.id,
        propValues: values.to_json,
      }
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: admin,
                                                   site_community: current_user.community,
                                                 }).as_json
      expect(result.dig('data', 'formUserUpdate', 'formUser', 'id')).not_to be_nil
      expect(result.dig('data', 'formUserUpdate', 'formUser', 'form', 'id')).to eql form.id
      expect(result.dig('errors')).to be_nil
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
        formId: '3453rsnjsdi-43rdf34-sdf43',
        userId: current_user.id,
        propValues: values.to_json,
      }
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: admin,
                                                   site_community: current_user.community,
                                                 }).as_json

      expect(result.dig('errors', 0, 'message')).to eql 'Form not found'
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
        formId: form.id,
        userId: current_user.id,
        propValues: values.to_json,
      }
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: another_user,
                                                   site_community: current_user.community,
                                                 }).as_json
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
    end
  end
end
