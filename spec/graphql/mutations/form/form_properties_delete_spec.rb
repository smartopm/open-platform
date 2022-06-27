# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Form::FormPropertiesDelete do
  describe 'deletes form property' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'forms',
                          role: admin_role,
                          permissions: %w[can_delete_form_properties])
    end

    let!(:user) { create(:user_with_community, user_type: 'resident', role: resident_role) }
    let(:community) { user.community }
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
    let(:form_user) do
      create(:form_user, form: form, user: user, status: :approved, status_updated_by: admin)
    end
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
                                                     site_community: community,
                                                     user_role: admin.role,
                                                   }).as_json
        expect(result.dig('data', 'formPropertiesDelete', 'formProperty', 'id')).not_to be_nil
        expect(form.form_properties.count).to eql 0
        expect(other_category.reload.display_condition['grouping_id']).to eql ''
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
                                                     site_community: community,
                                                     user_role: admin.role,
                                                   }).as_json
        expect(result.dig('data', 'formPropertiesDelete', 'formProperty', 'id')).to be_nil
        expect(Forms::Form.count).to eql(previous_form_count + 1)
        new_form = Forms::Form.where.not(id: form.id).first
        expect(new_form.categories.reload.count).to eql 2
        expect(new_form.form_properties.reload.count).to eql 0
        updated_category = new_form.categories.where.not(display_condition: nil).first
        expect(updated_category.reload.display_condition['grouping_id']).to eql ''
      end

      it 'retains associated process for new form version' do
        process = create(:process, form_id: form.id, name: 'Test Process', community: community)
        create(:note_list, community: community, process_id: process.id, name: 'Test Note List')

        variables = {
          formId: form.id,
          formPropertyId: form_property.id,
        }

        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                     user_role: admin.role,
                                                   }).as_json

        expect(result.dig('errors', 0, 'message')).to be_nil
        new_form = Forms::Form.where.not(id: form.id).first
        expect(process.reload.form_id).to eq(new_form.id)
        expect(new_form.associated_process?).to eq(true)
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
                                                   site_community: community,
                                                   user_role: user.role,
                                                 }).as_json
      expect(result.dig('data', 'formPropertiesDelete', 'form', 'id')).to be_nil
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
    end
  end
end
