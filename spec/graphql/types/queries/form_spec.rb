# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Form do
  describe 'Form queries' do
    let!(:admin) { create(:admin_user, community_id: current_user.community_id) }
    let!(:current_user) { create(:user_with_community, name: 'John Test') }
    let!(:form) { create(:form, community_id: current_user.community_id) }
    let!(:another_form) { create(:form, community_id: current_user.community_id, status: 2) }
    let!(:form_property_text) { create(:form_property, form: form, field_type: 'text') }
    let!(:form_property_date) { create(:form_property, form: form, field_type: 'date') }
    let!(:form_user) { create(:form_user, form: form, user: current_user, status: 'approved') }
    let!(:another_form_user) { create(:form_user, form: form, user: admin, status: 'pending') }

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
        query formUser ($userId: ID!, $formUserId: ID!) {
          formUser(userId: $userId, formUserId: $formUserId) {
            id
          }
        }
      GQL
    end

    let(:form_entries_query) do
      <<~GQL
        query formEntries ($formId: ID!, $query: String) {
          formEntries(formId: $formId, query: $query) {
            formName
            formUsers{
              id
              status
              user{
                name
              }
            }
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

    it 'should retrieve form user y form user id' do
      variables = { userId: current_user.id, formUserId: form_user.id }
      result = DoubleGdpSchema.execute(form_user_query, variables: variables,
                                                        context: {
                                                          current_user: current_user,
                                                          site_community: current_user.community,
                                                        }).as_json
      expect(result.dig('data', 'formUser', 'id')).to eql form_user.id
    end

    context 'when current user is not an admin' do
      it 'raises unauthorized error' do
        variables = { formId: form.id }
        result = DoubleGdpSchema.execute(form_entries_query, variables: variables,
                                                             context: {
                                                               current_user: current_user,
                                                               site_community: admin.community,
                                                             }).as_json
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end
    context 'when form entries is called without query' do
      it 'return list of all form users associated with that form' do
        variables = { formId: form.id }
        result = DoubleGdpSchema.execute(form_entries_query, variables: variables,
                                                             context: {
                                                               current_user: admin,
                                                               site_community: admin.community,
                                                             }).as_json
        form_entries = result.dig('data', 'formEntries')
        expect(form_entries['formName']).to eql form.name
        expect(form_entries['formUsers'].size).to eql 2
        expect(form_entries['formUsers'][0]['id']).to eql another_form_user.id
      end
    end

    context 'when form entries are searched by user name' do
      it 'returns list of all form users associated with user name' do
        variables = { formId: form.id, query: 'John' }
        result = DoubleGdpSchema.execute(form_entries_query, variables: variables,
                                                             context: {
                                                               current_user: admin,
                                                               site_community: admin.community,
                                                             }).as_json
        form_entries = result.dig('data', 'formEntries')
        expect(form_entries['formUsers'].size).to eql 1
        expect(form_entries['formUsers'][0]['user']['name']).to eql 'John Test'
      end

      context 'when form entries are searched by status' do
        it 'returns list of all form users associated with that status' do
          variables = { formId: form.id, query: 'approved' }
          result = DoubleGdpSchema.execute(form_entries_query, variables: variables,
                                                               context: {
                                                                 current_user: admin,
                                                                 site_community: admin.community,
                                                               }).as_json
          form_entries = result.dig('data', 'formEntries')
          expect(form_entries['formUsers'].size).to eql 1
          expect(form_entries['formUsers'][0]['user']['name']).to eql 'John Test'
          expect(form_entries['formUsers'][0]['status']).to eql 'approved'
        end
      end
    end
  end
end
