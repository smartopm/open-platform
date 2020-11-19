# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Form::UserFormPropertiesUpdate do
  describe 'update user form property' do
    let!(:user) { create(:user_with_community) }
    let!(:another_user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
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
                                                 }).as_json

      expect(result.dig('errors')).to be_nil
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
                                                 }).as_json
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
    end
  end
end
