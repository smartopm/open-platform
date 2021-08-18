# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Form::FormPropertiesCreate do
  describe 'creates form property' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
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
          fieldValue: [{ 'category_name': other_category.field_name.to_s, 'condition': '< 15' }],
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: user.community,
                                                   }).as_json
        expect(result.dig('data', 'formPropertiesCreate', 'formProperty', 'id')).not_to be_nil
        expect(
          result.dig('data', 'formPropertiesCreate', 'formProperty', 'fieldName'),
        ).to eql 'Field Name'
        updated_property = category.form_properties.first
        expect(updated_property.field_value[0]['category_name']).to eql 'personal info'
        expect(updated_property.field_value[0]['condition']).to eql '< 15'
        expect(result['errors']).to be_nil
      end
    end

    context 'when category name of field value does not exist' do
      it 'raises category not found error' do
        variables = {
          fieldName: 'Field Name',
          fieldType: %w[text date file_upload signature display_text display_image].sample,
          formId: form.id,
          categoryId: category.id,
          order: '1',
          fieldValue: [{ 'category_name': 'new_info' }],
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: user.community,
                                                   }).as_json
        expect(result['errors'][0]['message']).to eql 'Category not found'
      end
    end

    context 'when category name of field value is same as parent category' do
      it 'raises parent category cannot be linked error' do
        variables = {
          fieldName: 'Field Name',
          fieldType: %w[text date file_upload signature display_text display_image].sample,
          formId: form.id,
          categoryId: category.id,
          order: '1',
          fieldValue: [{ 'category_name': category.field_name.to_s }],
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: user.community,
                                                   }).as_json
        expect(result['errors'][0]['message']).to eql 'Category cannot be linked'
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
                                                   }).as_json
        expect(result.dig('errors', 0, 'message')).to eql 'Forms::Form not found'
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
                                                   }).as_json
        expect(result.dig('data', 'formPropertiesCreate', 'form', 'id')).to be_nil
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end
  end
end
