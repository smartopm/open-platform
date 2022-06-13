# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Form::FormPropertiesCreate do
  describe 'creates form property' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'forms',
                          role: admin_role,
                          permissions: %w[can_create_form_properties])
    end

    let!(:user) { create(:user_with_community, user_type: 'resident', role: resident_role) }
    let!(:admin) do
      create(:admin_user, community_id: user.community_id, role: admin_role, user_type: 'admin')
    end

    let!(:form) { create(:form, community_id: user.community_id) }
    let!(:category) { create(:category, form: form, field_name: 'info') }
    let!(:other_category) { create(:category, form: form, field_name: 'personal info') }

    let(:mutation) do
      <<~GQL
        mutation formPropertiesCreate(
          $formId: ID!,
          $categoryId: ID!,
          $order: String!,
          $fieldName: String!,
          $fieldType: String!,
          $fieldValue: JSON
        ) {
          formPropertiesCreate(
            formId: $formId,
            categoryId: $categoryId,
            order: $order,
            fieldName: $fieldName,
            fieldType: $fieldType,
            fieldValue: $fieldValue
          ){
            formProperty {
              id
              fieldName
              fieldType
              fieldValue
              groupingId
              category{
                fieldName
                general
                headerVisible
                order
              }
            }
          }
        }
      GQL
    end

    context 'when form and category is valid' do
      it 'creates a form property' do
        variables = {
          fieldName: 'Field Name',
          fieldType: %w[text date file_upload signature display_text display_image].sample,
          formId: form.id,
          categoryId: category.id,
          order: '1',
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: user.community,
                                                     user_role: admin.role,
                                                   }).as_json
        expect(result['errors']).to be_nil
        property_result = result.dig('data', 'formPropertiesCreate', 'formProperty')
        expect(property_result['id']).not_to be_nil
        expect(property_result['groupingId']).not_to be_nil
        expect(property_result['fieldName']).to eql 'Field Name'
      end
    end

    context 'when form id is invalid' do
      it 'raises form not found error' do
        variables = {
          fieldName: 'Field Name',
          fieldType: %w[text date file_upload signature display_text display_image].sample,
          formId: 'zzzyyy555',
          categoryId: category.id,
          order: '1',
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: user.community,
                                                     user_role: admin.role,
                                                   }).as_json
        expect(result.dig('errors', 0, 'message')).to eql 'Form not found'
      end
    end

    context 'when category id is invalid' do
      it 'raises category not found error' do
        variables = {
          fieldName: 'Field Name',
          fieldType: %w[text date file_upload signature display_text display_image].sample,
          formId: form.id,
          categoryId: 'zzzyyy555',
          order: '1',
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: user.community,
                                                     user_role: admin.role,
                                                   }).as_json
        expect(result.dig('errors', 0, 'message')).to eql 'Category not found'
      end
    end

    context 'when current user is not an admin' do
      it 'throws unauthorized error' do
        variables = {
          fieldName: 'Field Name',
          fieldType: %w[text date file_upload signature display_text display_image].sample,
          formId: form.id,
          categoryId: category.id,
          order: 'order',
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: user,
                                                     site_community: user.community,
                                                     user_role: user.role,
                                                   }).as_json
        expect(result.dig('data', 'formPropertiesCreate', 'form', 'id')).to be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end
  end
end
