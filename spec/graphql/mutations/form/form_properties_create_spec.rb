# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Form::FormPropertiesCreate do
  describe 'creates form property' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:form) { create(:form, community_id: user.community_id) }
    let!(:category) { create(:category, form: form) }

    let(:mutation) do
      <<~GQL
        mutation formPropertiesCreate(
          $formId: ID!,
          $categoryId: ID,
          $order: String!,
          $fieldName: String!,
          $fieldType: String!,
        ) {
          formPropertiesCreate(
            formId: $formId,
            categoryId: $categoryId,
            order: $order,
            fieldName: $fieldName,
            fieldType: $fieldType,
          ){
            formProperty {
              id
              fieldName
              fieldType
              category{
                fieldName
                general
                headerVisible
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
          order: 'order',
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
        expect(result['errors']).to be_nil
      end
    end

    context 'when category id is not present' do
      it 'creates a general category and associates form property with it' do
        variables = {
          fieldName: 'Field Name',
          fieldType: %w[text date file_upload signature display_text display_image].sample,
          formId: form.id,
          order: 'order',
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
        category_result = result.dig('data', 'formPropertiesCreate', 'formProperty', 'category')
        expect(category_result['fieldName']).to eql 'General Category'
        expect(category_result['general']).to eql true
        expect(category_result['headerVisible']).to eql false
        expect(result['errors']).to be_nil
      end
    end

    context 'when form id is invalid' do
      it 'raises form not found error' do
        variables = {
          fieldName: 'Field Name',
          fieldType: %w[text date file_upload signature display_text display_image].sample,
          formId: 'zzzyyy555',
          categoryId: category.id,
          order: 'order',
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
          order: 'order',
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
