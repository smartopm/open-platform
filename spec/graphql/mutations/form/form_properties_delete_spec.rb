# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Form::FormPropertiesDelete do
  describe 'deletes form property' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:form) { create(:form, community_id: user.community_id) }
    let!(:category) { create(:category, form: form, field_name: 'Business Info') }
    let!(:form_property) do
      create(:form_property, form: form, category: category, field_type: 'text')
    end
    let(:form_user) { create(:form_user, form: form, user: user, status: :approved) }
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

    context 'when there are no submissions made for the form' do
      it 'deletes the form property' do
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
        expect(result['errors']).to be_nil
      end
    end

    context 'when form has entries' do
      before { form_user }

      it 'does not delete the form property and duplicates the form except the property' do
        variables = {
          formId: form.id,
          formPropertyId: form_property.id,
        }
        previous_form_count = Forms::Form.count
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: user.community,
                                                   }).as_json
        expect(result.dig('data', 'formPropertiesDelete', 'formProperty', 'id')).to be_nil
        expect(Forms::Form.count).to eql(previous_form_count + 1)
        new_form = Forms::Form.where.not(id: form.id).first
        expect(new_form.categories.reload.count).to eql 1
        expect(new_form.form_properties.reload.count).to eql 0
      end
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
