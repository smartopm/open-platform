# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Form::FormCreate do
  describe 'create categories' do
    let!(:user) { create(:user_with_community) }
    let!(:community) { user.community }
    let!(:admin) { create(:admin_user, community: community) }
    let!(:form) { create(:form, community: community) }
    let!(:category) { create(:category, form: form, general: true) }
    let(:mutation) do
      <<~GQL
        mutation categoryUpdate(
          $id: ID!,
          $fieldName: String!
          $order: Int!,
          $headerVisible: Boolean!,
          $general: Boolean!,
          $description: String,
          $renderedText: String
        ) {
          categoryUpdate(
            id: $id,
            fieldName: $fieldName,
            order: $order,
            headerVisible: $headerVisible,
            general: $general,
            description: $description,
            renderedText: $renderedText
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

    context 'when category id is invalid' do
      it 'raises category not found error' do
        variables = {
          id: 'zzzzzyyyy558',
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
        expect(result.dig('errors', 0, 'message')).to eql 'Category not found'
      end
    end

    context 'when category is valid' do
      it 'updates category for the form' do
        variables = {
          id: category.id,
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
        category_result = result.dig('data', 'categoryUpdate', 'category')
        expect(category_result['fieldName']).to eql 'personal info'
        expect(category_result['order']).to eql 1
        expect(category_result['headerVisible']).to eql true
        expect(category_result['general']).to eql false
      end
    end

    context 'when current user is not admin' do
      it 'raises unauthorized error' do
        variables = {
          id: category.id,
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
