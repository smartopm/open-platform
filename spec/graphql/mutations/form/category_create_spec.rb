# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Form::FormCreate do
  describe 'create categories' do
    let!(:user) { create(:user_with_community) }
    let!(:community) { user.community }
    let!(:admin) { create(:admin_user, community: community) }
    let!(:form) { create(:form, community: community) }
    let(:category) { create(:category, field_name: 'Business Info', form: form) }
    let(:form_property) { create(:form_property, form: form, category: category) }
    let(:mutation) do
      <<~GQL
        mutation categoryCreate(
          $formId: ID!,
          $fieldName: String!
          $order: Int!,
          $headerVisible: Boolean!,
          $general: Boolean!,
          $description: String,
          $renderedText: String,
          $formPropertyId: ID
        ) {
          categoryCreate(
            formId: $formId,
            fieldName: $fieldName,
            order: $order,
            headerVisible: $headerVisible,
            general: $general,
            description: $description,
            renderedText: $renderedText,
            formPropertyId: $formPropertyId
          ){
            category{
              fieldName
              order
              headerVisible
              general
            }
          }
        }
      GQL
    end

    context 'when form id is invalid' do
      it 'raises form not found error' do
        variables = {
          formId: 'zzzzzyyyy558',
          fieldName: 'personal info',
          order: 1,
          headerVisible: true,
          general: false,
        }

        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                   }).as_json
        expect(result.dig('errors', 0, 'message')).to eql 'Form not found'
      end
    end

    context 'when form is valid' do
      it 'creates category for the form' do
        variables = {
          formId: form.id,
          fieldName: 'personal info',
          order: 1,
          headerVisible: true,
          general: false,
        }

        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                   }).as_json
        expect(result.dig('errors', 0, 'message')).to be_nil
        category_result = result.dig('data', 'categoryCreate', 'category')
        expect(category_result['fieldName']).to eql 'personal info'
        expect(category_result['order']).to eql 1
        expect(category_result['headerVisible']).to eql true
        expect(category_result['general']).to eql false
      end
    end

    context 'when a category is grouped under a form property' do
      before do
        category
        form_property
      end
      it 'creates a category associated with the form property' do
        variables = {
          formId: form.id,
          fieldName: 'Pharmacy',
          order: 1,
          headerVisible: true,
          general: false,
          formPropertyId: form_property.id,
        }

        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                   }).as_json
        expect(result.dig('errors', 0, 'message')).to be_nil
        category_result = result.dig('data', 'categoryCreate', 'category')
        expect(category_result['fieldName']).to eql 'Pharmacy'
        expect(category_result['order']).to eql 1
        expect(category_result['headerVisible']).to eql true
        expect(category_result['general']).to eql false
        expect(form_property.sub_categories.reload.first.field_name).to eql 'Pharmacy'
      end
    end

    context 'when current user is not admin' do
      it 'raises unauthorized error' do
        variables = {
          formId: form.id,
          fieldName: 'personal info',
          order: 1,
          headerVisible: true,
          general: false,
        }

        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: user,
                                                     site_community: community,
                                                   }).as_json
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end
  end
end
