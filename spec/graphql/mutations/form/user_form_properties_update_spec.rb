# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Form::UserFormPropertiesUpdate do
  describe 'update user form property' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'forms',
                          role: admin_role,
                          permissions: %w[can_update_user_form_properties])
    end

    let!(:user) { create(:user_with_community, user_type: 'resident', role: resident_role) }
    let!(:admin) do
      create(:admin_user, community_id: user.community_id, role: admin_role, user_type: 'admin')
    end

    let!(:another_user) do
      create(:user_with_community, role: resident_role, user_type: 'resident')
    end
    let!(:form) { create(:form, community_id: user.community_id) }
    let!(:form_property) { create(:form_property, form: form, field_type: 'text') }
    let!(:form_user) do
      admin.form_users.create!(form_id: form.id, status: 1, status_updated_by_id: admin.id)
    end
    let!(:user_form_property) do
      admin.user_form_properties.create!(form_user_id: form_user.id,
                                         form_property_id: form_property.id, value: 'some value')
    end

    let(:mutation) do
      <<~GQL
        mutation userFormPropertiesUpdate($id: ID!, $value: String!) {
          userFormPropertiesUpdate(id: $id, value: $value){
            userFormProperty {
              id
              value
            }
          }
        }
      GQL
    end

    it 'creates a user form property' do
      variables = {
        id: user_form_property.id,
        value: 'some other text value',
      }
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: admin,
                                                   site_community: admin.community,
                                                   user_role: admin.role,
                                                 }).as_json

      expect(result['errors']).to be_nil
      expect(
        result.dig('data', 'userFormPropertiesUpdate', 'userFormProperty', 'id'),
      ).to_not be_nil
      expect(
        result.dig('data', 'userFormPropertiesUpdate', 'userFormProperty', 'value'),
      ).to eql 'some other text value'
    end

    it 'throws unauthorized error when user is different' do
      variables = {
        id: user_form_property.id,
        value: 'some other text value',
      }
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: another_user,
                                                   site_community: another_user.community,
                                                   user_role: another_user.role,
                                                 }).as_json
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
    end
  end
end
