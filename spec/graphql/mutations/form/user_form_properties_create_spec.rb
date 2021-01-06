# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Form::UserFormPropertiesCreate do
  describe 'creates user form property' do
    let!(:user) { create(:user_with_community) }
    let!(:another_user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:form) { create(:form, community_id: user.community_id) }
    let!(:form_property) { create(:form_property, form: form, field_type: 'text') }
    let!(:form_user) do
      user.form_users.create!(form_id: form.id, status: 1, status_updated_by_id: admin.id)
    end

    let(:mutation) do
      <<~GQL
        mutation userFormPropertiesCreate($formPropertyId: ID!, $formUserId: ID!, $value: String!) {
          userFormPropertiesCreate(formPropertyId: $formPropertyId, value: $value, formUserId: $formUserId){
            userFormProperty {
              id
            }
          }
        }
      GQL
    end

    it 'creates a user form property' do
      variables = {
        formPropertyId: form_property.id,
        formUserId: form_user.id,
        value: 'some text value',
      }
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: admin,
                                                   site_community: user.community,
                                                 }).as_json
      expect(
        result.dig('data', 'userFormPropertiesCreate', 'userFormProperty', 'id'),
      ).to_not be_nil
      expect(result['errors']).to be_nil
    end

    it 'throws unauthorized error when user is different' do
      variables = {
        formPropertyId: form_property.id,
        formUserId: form_user.id,
        value: 'some text value',
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
