# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Form do
  describe 'Form queries' do
    let!(:admin) { create(:admin_user, community_id: current_user.community_id) }
    let!(:current_user) { create(:user_with_community) }
    let!(:form) { create(:form, community_id: current_user.community_id) }
    let!(:another_form) { create(:form, community_id: current_user.community_id, status: 2) }
    let!(:form_property_text) { create(:form_property, form: form, field_type: 'text') }
    let!(:form_property_date) { create(:form_property, form: form, field_type: 'date') }
    let!(:form_user) { create(:form_user, form: form, user: current_user) }

    let(:forms_query) do
      <<~GQL
        query {
          forms {
              id
              name
            }
          }
      GQL
    end

    let(:form_query) do
      <<~GQL
        query form (
          $id: ID!
        ) {
          form(id: $id) {
              id
              name
            }
          }
      GQL
    end

    let(:form_properties_query) do
      <<~GQL
        query formProperties (
          $formId: ID!
        ) {
          formProperties(formId: $formId) {
            id
          }
        }
      GQL
    end

    let(:form_user_query) do
      <<~GQL
        query formUser (
          $formId: ID!
          $userId: ID!
        ) {
          formUser(formId: $formId, userId: $userId) {
            id
          }
        }
      GQL
    end

    it 'should retrieve list of forms' do
      result = DoubleGdpSchema.execute(forms_query, context: {
                                         current_user: current_user,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result.dig('data', 'forms').length).to eql 1
      expect(result.dig('data', 'forms', 0, 'id')).to eql form.id
    end

    it 'should retrieve form by id' do
      result = DoubleGdpSchema.execute(form_query, variables: { id: form.id },
                                                   context: {
                                                     current_user: current_user,
                                                     site_community: current_user.community,
                                                   }).as_json
      expect(result.dig('data', 'form', 'id')).to eql form.id
    end

    it 'should retrieve form properties by form id' do
      community = current_user.community
      result = DoubleGdpSchema.execute(form_properties_query, variables: { formId: form.id },
                                                              context: {
                                                                current_user: current_user,
                                                                site_community: community,
                                                              }).as_json
      expect(result.dig('data', 'formProperties', 0, 'id')).to eql form_property_text.id
      expect(result.dig('data', 'formProperties', 1, 'id')).to eql form_property_date.id
    end

    it 'should retrieve form user by form id and user id' do
      variables = { formId: form.id, userId: current_user.id }
      result = DoubleGdpSchema.execute(form_user_query, variables: variables,
                                                        context: {
                                                          current_user: current_user,
                                                          site_community: current_user.community,
                                                        }).as_json
      expect(result.dig('data', 'formUser', 'id')).to eql form_user.id
    end
  end
end
