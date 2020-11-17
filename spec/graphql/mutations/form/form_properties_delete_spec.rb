# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Form::FormPropertiesDelete do
  describe 'deletes form property' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:form) { create(:form, community_id: user.community_id) }
    let!(:form_property) { create(:form_property, form: form, field_type: 'text') }

    let(:mutation) do
      <<~GQL
        mutation formPropertiesDelete($formId: ID!, $formPropertyId: ID!){
            formPropertiesDelete(formId: $formId, formPropertyId: $formPropertyId){
            formProperty {
                    id
                }
            }
        }
      GQL
    end

    it 'deletes a form property' do
      variables = {
        formId: form.id,
        formPropertyId: form_property.id,
      }
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: admin,
                                                   site_community: user.community,
                                                 }).as_json
      expect(result.dig('data', 'formPropertiesDelete', 'formProperty', 'id')).not_to be_nil
      expect(form.form_properties.count).to eql 0
      expect(result.dig('errors')).to be_nil
    end

    it 'throws unauthorized error when user is not admin' do
      variables = {
        formId: form.id,
        formPropertyId: form_property.id,
      }
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: user,
                                                   site_community: user.community,
                                                 }).as_json
      expect(result.dig('data', 'formPropertiesDelete', 'form', 'id')).to be_nil
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
    end
  end
end
