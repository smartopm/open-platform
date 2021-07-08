# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Form::FormUserCreate do
  describe 'create for forms' do
    let!(:current_user) { create(:user_with_community) }
    let!(:another_user) { create(:user, community_id: current_user.community_id) }
    let!(:admin) { create(:admin_user, community_id: current_user.community_id) }
    let!(:form) { create(:form, community_id: current_user.community_id) }
    let!(:form_property) { create(:form_property, form: form, field_type: 'text') }

    let(:mutation) do
      <<~GQL
        mutation formUserCreate($formId: ID!, $userId: ID!, $propValues: JSON!) {
          formUserCreate(formId: $formId, userId: $userId, propValues: $propValues){
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

    context 'when multiple requests is not allowed in form' do
      it 'creates a form user and raises error if another form submission is made' do
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

        expect(current_user.notes.count).to eql 0
        first_result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                         context: {
                                                           current_user: admin,
                                                           site_community: current_user.community,
                                                         }).as_json

        expect(first_result.dig('data', 'formUserCreate', 'formUser', 'id')).not_to be_nil
        expect(first_result.dig('data', 'formUserCreate', 'formUser', 'form', 'id')).to eql form.id
        expect(current_user.notes.count).to eql 1
        expect(first_result['errors']).to be_nil

        second_result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                          context: {
                                                            current_user: admin,
                                                            site_community: current_user.community,
                                                          }).as_json
        expect(second_result.dig('errors', 0, 'message'))
          .to eql "You've already responded to this form. You can only fill out this form " \
                   'once. Please contact the support team if this is an error'
      end
    end

    context 'when multiple requests is allowed in form' do
      before { form.update(multiple_submissions_allowed: true) }
      it 'allows creation of multiple form users' do
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

        expect(current_user.notes.count).to eql 0
        first_result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                         context: {
                                                           current_user: admin,
                                                           site_community: current_user.community,
                                                         }).as_json

        expect(first_result.dig('data', 'formUserCreate', 'formUser', 'id')).not_to be_nil
        expect(first_result.dig('data', 'formUserCreate', 'formUser', 'form', 'id')).to eql form.id
        expect(current_user.notes.count).to eql 1
        expect(first_result['errors']).to be_nil

        second_result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                          context: {
                                                            current_user: admin,
                                                            site_community: current_user.community,
                                                          }).as_json
        expect(second_result.dig('data', 'formUserCreate', 'formUser', 'id')).not_to be_nil
        expect(second_result.dig('data', 'formUserCreate', 'formUser', 'form', 'id')).to eql form.id
        expect(current_user.notes.count).to eql 2
        expect(second_result['errors']).to be_nil
      end
    end

    it 'should err when form not provided' do
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
