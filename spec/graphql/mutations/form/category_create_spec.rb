# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Form::FormCreate do
  describe 'create categories' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'forms',
                          role: admin_role,
                          permissions: %w[can_create_category])
    end

    let!(:user) { create(:user_with_community, user_type: 'resident', role: resident_role) }
    let!(:admin) do
      create(:user, user_type: 'admin', community_id: user.community_id, role: admin_role)
    end

    let!(:community) { user.community }
    let!(:form) { create(:form, community: community) }
    let!(:category) { create(:category, form: form) }
    let!(:form_property) { create(:form_property, form: form, category: category) }
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
          $displayCondition: JSON
        ) {
          categoryCreate(
            formId: $formId,
            fieldName: $fieldName,
            order: $order,
            headerVisible: $headerVisible,
            general: $general,
            description: $description,
            renderedText: $renderedText,
            displayCondition: $displayCondition
          ){
            category{
              fieldName
              order
              headerVisible
              general
              displayCondition
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
                                                     user_role: admin.role,
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
          displayCondition: {
            'grouping_id': form_property.grouping_id,
            'condition': '===',
            'value': 'Fishing',
          },
        }

        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                     user_role: admin.role,
                                                   }).as_json
        expect(result.dig('errors', 0, 'message')).to be_nil
        category_result = result.dig('data', 'categoryCreate', 'category')
        expect(category_result['fieldName']).to eql 'personal info'
        expect(category_result['order']).to eql 1
        expect(category_result['headerVisible']).to eql true
        expect(category_result['general']).to eql false
        expect(category_result['displayCondition']['grouping_id']).to eql form_property.grouping_id
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
                                                     user_role: user.role,
                                                   }).as_json
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end
  end
end
