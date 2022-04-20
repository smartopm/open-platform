# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Form do
  describe 'Form queries' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:visitor_role) { create(:role, name: 'visitor') }
    let!(:permission) do
      create(:permission, module: 'forms',
                          role: admin_role,
                          permissions: %w[
                            can_view_own_forms can_access_forms
                            can_view_own_forms can_view_form_user
                            can_view_form_user_properties
                            can_view_form_form_submissions can_view_form_entries
                            can_fetch_form
                            can_fetch_form_property
                            can_fetch_form_properties
                            can_fetch_form_categories
                          ])
    end

    let!(:current_user_permission) do
      create(:permission, module: 'forms',
                          role: visitor_role,
                          permissions: %w[
                            can_fetch_form
                            can_fetch_form_property
                            can_fetch_form_properties
                            can_fetch_form_categories
                          ])
    end

    let!(:current_user) { create(:user_with_community, name: 'John Test', role: visitor_role) }
    let!(:admin) { create(:admin_user, community_id: current_user.community_id, role: admin_role) }

    let!(:form) do
      create(:form, community_id: current_user.community_id, status: :published,
                    roles: %w[client resident])
    end
    let!(:category) { create(:category, form: form, order: 1) }
    let!(:another_form) do
      create(:form, community_id: current_user.community_id, status: :published,
                    roles: ['resident'])
    end
    let!(:second_form) do
      create(:form, community_id: current_user.community_id, status: :published, roles: [])
    end
    let!(:form_property_text) do
      create(:form_property, form: form, category: category, field_type: 'text')
    end
    let!(:other_category) do
      create(:category, form: form, form_property_id: form_property_text.id, order: 2)
    end
    let!(:form_property_date) do
      create(:form_property, form: form, category: other_category, field_type: 'date')
    end
    let!(:form_user) do
      create(:form_user, form: form, user: current_user, status: 'approved',
                         status_updated_by: admin)
    end
    let(:user_form_property) do
      create(:user_form_property, form_property: form_property_text, form_user: form_user,
                                  user: current_user, value: 'name')
    end
    let!(:blob) do
      ActiveStorage::Blob.create(filename: 'doc.pdf', content_type: 'application/pdf',
                                 byte_size: 2123, checksum: '9JiwSyvzZeqDSV')
    end
    let!(:attachment) { user_form_property.attachments.create(blob_id: blob.id) }
    let!(:another_form_user) do
      create(:form_user, form: form, user: admin, status: 'pending', status_updated_by: admin)
    end
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:client_role) { create(:role, name: 'client') }

    let!(:resident_permission) do
      create(:permission, module: 'forms',
                          role: resident_role,
                          permissions: %w[
                            can_access_forms
                            can_view_own_forms can_view_form_user
                            can_view_form_user_properties
                            can_fetch_form
                            can_fetch_form_property
                            can_fetch_form_properties
                            can_fetch_form_categories
                          ])
    end

    let!(:client_permission) do
      create(:permission, module: 'forms',
                          role: client_role,
                          permissions: %w[
                            can_access_forms
                            can_view_own_forms can_view_form_user
                            can_view_form_user_properties
                            can_fetch_form
                            can_fetch_form_property
                            can_fetch_form_properties
                            can_fetch_form_categories
                          ])
    end

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

    let(:form_property_query) do
      <<~GQL
        query formProperty (
          $formId: ID!, $formPropertyId: ID!
        ) {
          formProperty(formId: $formId, formPropertyId: $formPropertyId) {
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

    let(:form_user_properties_query) do
      <<~GQL
        query userFormProperties($userId: ID!, $formUserId: ID!) {
          formUserProperties(userId: $userId, formUserId: $formUserId) {
            value
            attachments
            user {
              name
            }
            formProperty {
              fieldName
              fieldType
              fieldValue
              order
              id
              adminUse
              category{
                fieldName
                order
                headerVisible
              }
            }
          }
        }
      GQL
    end

    let(:form_categories_query) do
      <<~GQL
        query formCategories ($formId: ID!) {
          formCategories(formId: $formId) {
            fieldName
            order
            headerVisible
            formProperties{
              fieldName
              fieldType
              order
            }
          }
        }
      GQL
    end

    context 'when current user is an admin' do
      it 'retrieves all list of forms' do
        result = DoubleGdpSchema.execute(forms_query, context: {
                                           current_user: admin,
                                           site_community: current_user.community,
                                         }).as_json
        expect(result.dig('data', 'forms').length).to eql 3
        expect(result.dig('data', 'forms', 0, 'id')).to eql second_form.id
      end
    end

    context 'when current user is a client' do
      before { current_user.update(user_type: :client) }
      it 'retrieves list of forms where either client role is present or no role is present' do
        result = DoubleGdpSchema.execute(forms_query, context: {
                                           current_user: current_user,
                                           site_community: current_user.community,
                                         }).as_json
        expect(result.dig('data', 'forms').length).to eql 2
      end
    end

    context 'when current user is a resident' do
      before { current_user.update(user_type: :resident) }
      it 'retrieves list of forms where either residentt role is present or no role is present' do
        result = DoubleGdpSchema.execute(forms_query, context: {
                                           current_user: current_user,
                                           site_community: current_user.community,
                                         }).as_json
        expect(result.dig('data', 'forms').length).to eql 3
      end
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

    it 'should retrieve a form property by form id and it\'s form_property_id' do
      community = current_user.community
      variables = {
        formPropertyId: form_property_text.id,
        formId: form.id,
      }
      result = DoubleGdpSchema.execute(form_property_query, variables: variables,
                                                            context: {
                                                              current_user: current_user,
                                                              site_community: community,
                                                            }).as_json
      expect(result['errors']).to be_nil
      expect(result.dig('data', 'formProperty', 'id')).to eql form_property_text.id
    end
    it 'should throw an error when retrieving a form property without a user' do
      community = current_user.community
      variables = {
        formPropertyId: form_property_text.id,
        formId: form.id,
      }
      result = DoubleGdpSchema.execute(form_property_query, variables: variables,
                                                            context: {
                                                              current_user: nil,
                                                              site_community: community,
                                                            }).as_json
      expect(result['errors']).to_not be_nil
      expect(result.dig('data', 'formProperty', 'id')).to be_nil
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

    it 'should not retrieve form user when not authorized' do
      variables = { userId: current_user.id, formUserId: form_user.id }
      result = DoubleGdpSchema.execute(form_user_query, variables: variables,
                                                        context: {
                                                          current_user: nil,
                                                          site_community: current_user.community,
                                                        }).as_json
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
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

      it 'returns no form found when wrong form is provided' do
        variables = { formId: SecureRandom.uuid, query: 'John' }
        result = DoubleGdpSchema.execute(form_entries_query, variables: variables,
                                                             context: {
                                                               current_user: admin,
                                                               site_community: admin.community,
                                                             }).as_json
        expect(result.dig('errors', 0, 'message')).to eql 'Form not found'
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

      context 'when form user properties query is fetched' do
        before { user_form_property }
        it 'returns list of all form user properties' do
          variables = { userId: current_user.id, formUserId: form_user.id }
          result = DoubleGdpSchema.execute(form_user_properties_query,
                                           variables: variables,
                                           context: {
                                             current_user: admin,
                                             site_community: admin.community,
                                           }).as_json
          expect(result['errors']).to be_nil
          user_property = result.dig('data', 'formUserProperties', 0)
          expect(user_property['value']).to eql 'name'
          expect(user_property['formProperty']['fieldName']).to eql form_property_text.field_name
          expect(user_property['formProperty']['category']['fieldName']).to eql category.field_name
          expect(user_property['user']['name']).to eql current_user.name
        end

        it 'returns Unauthorized when no user for form user properties' do
          variables = { userId: current_user.id, formUserId: form_user.id }
          result = DoubleGdpSchema.execute(form_user_properties_query,
                                           variables: variables,
                                           context: {
                                             current_user: nil,
                                             site_community: admin.community,
                                           }).as_json
          expect(result['errors']).to_not be_nil
          expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
        end
      end

      context 'when form categories query is called' do
        it 'returns list of all the form categories that are associated with the form' do
          variables = { formId: form.id }
          result = DoubleGdpSchema.execute(form_categories_query, variables: variables,
                                                                  context: {
                                                                    current_user: admin,
                                                                    site_community: admin.community,
                                                                  }).as_json
          expect(result['errors']).to be_nil
          category_result = result.dig('data', 'formCategories', 0)
          expect(category_result['fieldName']).to eql category.field_name
          expect(category_result['order']).to eql 1
          form_property_result = category_result['formProperties'][0]
          expect(form_property_result['fieldName']).to eql form_property_text.field_name
          expect(form_property_result['fieldType']).to eql 'text'
          other_category_result = result.dig('data', 'formCategories', 1)
          expect(other_category_result['fieldName']).to eql other_category.field_name
          expect(other_category_result['order']).to eql 2
          other_form_property = other_category_result['formProperties'][0]
          expect(other_form_property['fieldName']).to eql form_property_date.field_name
          expect(other_form_property['fieldType']).to eql 'date'
        end
      end
    end
  end
end
