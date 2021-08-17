# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Form::FormCreate do
  describe 'create categories' do
    let!(:user) { create(:user_with_community) }
    let!(:community) { user.community }
    let!(:admin) { create(:admin_user, community: community) }
    let!(:form) { create(:form, community: community) }
    let!(:category) { create(:category, form: form, general: true) }
    let!(:form_property) do
      create(:form_property, form: form, field_type: 'text', category: category,
                             field_name: 'Select Business')
    end
    let(:form_user) { create(:form_user, form: form, user: user, status: :approved) }

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
                                                   }).as_json
        expect(result.dig('errors', 0, 'message')).to be_nil
        expect(result.dig('data', 'categoryDelete', 'message')).to eql 'New version created'
        new_form = Forms::Form.where.not(id: form.id).first
        expect(new_form.categories.reload.count).to eql 0
        expect(new_form.form_properties.reload.count).to eql 0
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
                                                   }).as_json
        expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
      end
    end
  end
end
