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
    let!(:other_category) { create(:category, form: form, field_name: 'Fishing') }
    let!(:other_property) do
      create(:form_property, form: form, field_type: 'text', category: other_category,
                             field_name: 'Upload fishing license')
    end
    let(:form_user) { create(:form_user, form: form, user: user, status: :approved) }

    let(:mutation) do
      <<~GQL
        mutation formPropertiesUpdate(
          $formPropertyId: ID!,
          $categoryId: ID,
          $fieldName: String!,
          $fieldType: String!,
          $fieldValue: JSON) {
          formPropertiesUpdate(
            formPropertyId: $formPropertyId,
            categoryId: $categoryId,
            fieldName: $fieldName,
            fieldType: $fieldType,
            fieldValue: $fieldValue
          ){
            formProperty {
              fieldName
              fieldType
              fieldValue
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
          fieldValue: [{ 'category_name': other_category.field_name.to_s }],
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: user.community,
                                                   }).as_json
        expect(
          result.dig('data', 'formPropertiesUpdate', 'formProperty', 'fieldName'),
        ).to eql 'Updated Name'
        expect(
          form_property.reload.field_value[0]['category_name'],
        ).to eql other_category.field_name
        expect(result['errors']).to be_nil
      end
    end

    context 'when form has submissions' do
      before { form_user }

      it 'creates a new form with updated form property' do
        previous_form_count = Forms::Form.count
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
          result.dig('data', 'formPropertiesUpdate', 'message'),
        ).to eql 'New version created'
        expect(Forms::Form.count).to eql(previous_form_count + 1)
        new_form = Forms::Form.where.not(id: form.id).first
        updated_form_property = new_form.categories.where(field_name: 'Business Info')
                                        .first.form_properties.first
        expect(updated_form_property.field_name).to eql 'Updated Name'
      end
    end

    context 'when admin wants to assign form property to different category' do
      it 'assigns the form property to another category' do
        variables = {
          fieldName: form_property.field_name,
          fieldType: form_property.field_type,
          formPropertyId: form_property.id,
          categoryId: other_category.id,
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: user.community,
                                                   }).as_json
        expect(result['error']).to be_nil
        expect(category.form_properties.reload.count).to eql 0
        expect(other_category.form_properties.reload.count).to eql 2
      end
    end

    context 'when category name of field value does not exist' do
      it 'raises category not found error' do
        variables = {
          formPropertyId: form_property.id,
          fieldName: 'Field Name',
          fieldType: %w[text date file_upload signature display_text display_image].sample,
          fieldValue: [{ 'category_name': 'new_category' }],
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
          formPropertyId: form_property.id,
          fieldName: 'Field Name',
          fieldType: %w[text date file_upload signature display_text display_image].sample,
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
