# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Form::FormPropertiesCreate do
  describe 'creates form property' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:form) { create(:form, community_id: user.community_id) }

    let(:mutation) do
      <<~GQL
        mutation formPropertiesCreate(
          $formId: ID!,
          $order: String!,
          $fieldName: String!,
          $fieldType: String!,
        ) {
          formPropertiesCreate(
            formId: $formId,
            order: $order,
            fieldName: $fieldName,
            fieldType: $fieldType,
          ){
            formProperty {
              id
              fieldName
              fieldType
            }
          }
        }
      GQL
    end

    it 'creates a form' do
      variables = {
        fieldName: 'Field Name',
        fieldType: %w[text date image signature display_text display_image].sample,
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
      expect(result.dig('errors')).to be_nil
    end

    it 'throws unauthorized error when user is not admin' do
      variables = {
        fieldName: 'Field Name',
        fieldType: %w[text date image signature display_text display_image].sample,
        formId: form.id,
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
