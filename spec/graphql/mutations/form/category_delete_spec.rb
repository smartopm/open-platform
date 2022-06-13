# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Form::FormCreate do
  describe 'create categories' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'forms',
                          role: admin_role,
                          permissions: %w[can_delete_category])
    end

    let!(:user) { create(:user_with_community, user_type: 'resident', role: resident_role) }
    let!(:admin) do
      create(:user, user_type: 'admin', community_id: user.community_id, role: admin_role)
    end

    let!(:community) { user.community }
    let!(:form) { create(:form, community: community) }
    let!(:category) { create(:category, form: form, general: true) }
    let!(:other_category) { create(:category, form: form, general: true) }
    let!(:form_property) do
      create(:form_property, form: form, field_type: 'text', category: category,
                             field_name: 'Select Business')
    end
    let(:form_user) do
      create(:form_user, form: form, user: user, status: :approved, status_updated_by: admin)
    end

    let(:mutation) do
      <<~GQL
        mutation categoryDelete(
          $formId: ID!,
          $categoryId: ID!
        ) {
          categoryDelete(
            formId: $formId,
            categoryId: $categoryId
          ){
            message
          }
        }
      GQL
    end

    context 'when category id is invalid' do
      it 'raises category not found error' do
        variables = {
          formId: form.id,
          categoryId: 'zzzzzyyyy558',
        }

        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                     user_role: admin.role,
                                                   }).as_json
        expect(result.dig('errors', 0, 'message')).to eql 'Category not found'
      end
    end

    context 'when form has no submissions' do
      it 'deletes the category for the form' do
        variables = {
          formId: form.id,
          categoryId: category.id,
        }

        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                     user_role: admin.role,
                                                   }).as_json
        expect(result.dig('errors', 0, 'message')).to be_nil
        expect(result.dig('data', 'categoryDelete', 'message')).to eql 'Category deleted '\
                    'successfully'
      end

      it 'deletes the category for the form' do
        variables = {
          formId: form.id,
          categoryId: other_category.id,
        }

        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                     user_role: admin.role,
                                                   }).as_json
        expect(result.dig('errors', 0, 'message')).to be_nil
        expect(result.dig('data', 'categoryDelete', 'message')).to eql 'Category deleted '\
                    'successfully'
      end
    end

    context 'when form has submissions' do
      before { form_user }

      it 'does not delete the form property and duplicates the form except the property' do
        variables = {
          formId: form.id,
          categoryId: category.id,
        }

        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                     user_role: admin.role,
                                                   }).as_json
        expect(result.dig('errors', 0, 'message')).to be_nil
        expect(result.dig('data', 'categoryDelete', 'message')).to eql 'New version created'
        new_form = Forms::Form.where.not(id: form.id).first
        expect(new_form.categories.reload.count).to eql 1
        expect(new_form.form_properties.reload.count).to eql 0
      end

      it 'does not delete the form property and duplicates the form except the property' do
        variables = {
          formId: form.id,
          categoryId: other_category.id,
        }

        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                     user_role: admin.role,
                                                   }).as_json
        expect(result.dig('errors', 0, 'message')).to be_nil
        expect(result.dig('data', 'categoryDelete', 'message')).to eql 'New version created'
        new_form = Forms::Form.where.not(id: form.id).first
        expect(new_form.categories.reload.count).to eql 1
        expect(new_form.form_properties.reload.count).to eql 1
      end
    end

    context 'when current user is not admin' do
      it 'raises unauthorized error' do
        variables = {
          formId: form.id,
          categoryId: category.id,
        }

        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: user,
                                                     site_community: community,
                                                     user_role: user.role,
                                                   }).as_json
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end
  end
end
