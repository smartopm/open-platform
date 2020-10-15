# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Form::FormPropertiesUpdate do
  describe 'updates form property' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:form) { create(:form, community_id: user.community_id) }
    let!(:form_property) { create(:form_property, form: form, field_type: 'text') }

    let(:mutation) do
      <<~GQL
        mutation formPropertiesUpdate($id: ID!, $fieldName: String!, $fieldType: String!) {
          formPropertiesUpdate(id: $id, fieldName: $fieldName, fieldType: $fieldType){
            formProperty {
              fieldName
              fieldType
            }
          }
        }
      GQL
    end

    it 'updates a form' do
      variables = {
        id: form_property.id,
        fieldName: 'Updated Name',
        fieldType: %w[date image signature display_text display_image].sample,
      }
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: admin,
                                                   site_community: user.community,
                                                 }).as_json
      expect(
        result.dig('data', 'formPropertiesUpdate', 'formProperty', 'fieldName'),
      ).to eql 'Updated Name'
      expect(result.dig('errors')).to be_nil
    end

    it 'throws unauthorized error when user is not admin' do
      variables = {
        id: form_property.id,
        fieldName: 'Updated Name',
        fieldType: %w[date image signature display_text display_image].sample,
      }
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: user,
                                                   site_community: user.community,
                                                 }).as_json
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
    end
  end
end
