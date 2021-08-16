# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Form::FormPropertiesUpdate do
  describe 'updates form property' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:form) { create(:form, community_id: user.community_id) }
    let!(:category) { create(:category, form: form, field_name: 'Business Info') }
    let!(:form_property) do
      create(:form_property, form: form, field_type: 'text', category: category,
                             field_name: 'Select Business')
    end
    let!(:sub_category) do
      create(:category, form: form, form_property_id: form_property.id, field_name: 'Fishing')
    end
    let!(:sub_property) do
      create(:form_property, form: form, field_type: 'text', category: sub_category,
                             field_name: 'Upload fishing license')
    end
    let(:form_user) { create(:form_user, form: form, user: user, status: :approved) }

    let(:mutation) do
      <<~GQL
        mutation formPropertiesUpdate(
          $formPropertyId: ID!,
          $fieldName: String!,
          $fieldType: String!) {
          formPropertiesUpdate(
            formPropertyId: $formPropertyId,
            fieldName: $fieldName,
            fieldType: $fieldType
          ){
            formProperty {
              fieldName
              fieldType
            }
            message
          }
        }
      GQL
    end

    context 'when form does not have any submissions' do
      it 'updates the form property' do
        variables = {
          formPropertyId: form_property.id,
          fieldName: 'Updated Name',
          fieldType: %w[date file_upload signature display_text display_image].sample,
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: user.community,
                                                   }).as_json
        expect(
          result.dig('data', 'formPropertiesUpdate', 'formProperty', 'fieldName'),
        ).to eql 'Updated Name'
        expect(result['errors']).to be_nil
      end
    end

    context 'when form has submissions' do
      before { form_user }

      it 'creates a new form with updated form property' do
        previous_form_count = Forms::Form.count
        variables = {
          formPropertyId: sub_property.id,
          fieldName: 'Updated Name',
          fieldType: %w[date file_upload signature display_text display_image].sample,
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: user.community,
                                                   }).as_json
        expect(
          result.dig('data', 'formPropertiesUpdate', 'message'),
        ).to eql 'New version created'
        expect(Forms::Form.count).to eql(previous_form_count + 1)
        new_form = Forms::Form.where.not(id: form.id).first
        updated_form_property = new_form.categories.where.not(form_property_id: nil)
                                        .first.form_properties.first
        expect(updated_form_property.field_name).to eql 'Updated Name'
      end
    end

    it 'throws unauthorized error when user is not admin' do
      variables = {
        formPropertyId: form_property.id,
        fieldName: 'Updated Name',
        fieldType: %w[date file_upload signature display_text display_image].sample,
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
