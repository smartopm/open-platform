# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Form::FormPropertiesUpdate do
  describe 'updates form property' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'forms',
                          role: admin_role,
                          permissions: %w[can_update_form_properties])
    end

    let!(:user) { create(:user_with_community, user_type: 'resident', role: resident_role) }
    let!(:admin) do
      create(:admin_user, community_id: user.community_id, role: admin_role, user_type: 'admin')
    end
    let!(:form) { create(:form, community_id: user.community_id) }
    let!(:category) { create(:category, form: form, field_name: 'Business Info') }
    let!(:form_property) do
      create(:form_property, form: form, field_type: 'radio', category: category,
                             field_name: 'Select Business',
                             field_value: [{ 'value': 'Fishing' }])
    end
    let!(:other_category) do
      create(:category, form: form, field_name: 'Fishing',
                        display_condition: { 'grouping_id': form_property.reload.grouping_id,
                                             'value': 'Fishing' })
    end
    let!(:other_property) do
      create(:form_property, form: form, field_type: 'text', category: other_category,
                             field_name: 'Upload fishing license')
    end
    let(:form_user) do
      create(:form_user, form: form, user: user, status: :approved, status_updated_by: admin)
    end

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
              category{
                displayCondition
              }
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
          fieldValue: [{ 'value': 'Farming' }],
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: user.community,
                                                     user_role: admin.role,
                                                   }).as_json
        expect(
          result.dig('data', 'formPropertiesUpdate', 'formProperty', 'fieldName'),
        ).to eql 'Updated Name'
        expect(other_category.reload.display_condition['grouping_id']).to eql ''
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
          fieldValue: [{ 'value': 'Farming' }],
        }
        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: user.community,
                                                     user_role: admin.role,
                                                   }).as_json
        expect(
          result.dig('data', 'formPropertiesUpdate', 'message'),
        ).to eql 'New version created'
        expect(Forms::Form.count).to eql(previous_form_count + 1)
        new_form = Forms::Form.where.not(id: form.id).first
        updated_form_property = new_form.categories.where(field_name: 'Business Info')
                                        .first.form_properties.first
        expect(updated_form_property.field_name).to eql 'Updated Name'
        updated_category = new_form.categories.where.not(display_condition: nil).first
        expect(updated_category.reload.display_condition['grouping_id']).to eql ''
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
                                                     user_role: admin.role,
                                                   }).as_json
        expect(result['error']).to be_nil
        expect(category.form_properties.reload.count).to eql 0
        expect(other_category.form_properties.reload.count).to eql 2
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
                                                   user_role: user.role,
                                                 }).as_json
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
    end
  end
end
