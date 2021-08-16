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
    let!(:sub_category) do
      create(:category, form: form, form_property_id: form_property.id, field_name: 'Fishing')
    end
    let!(:sub_property) do
      create(:form_property, form: form, field_type: 'text', category: sub_category,
                             field_name: 'Upload fishing license')
    end
    let(:form_user) { create(:form_user, form: form, user: user, status: :approved) }

    let(:mutation) do
      <<~GQL
        mutation categoryUpdate(
          $categoryId: ID!,
          $fieldName: String!
          $order: Int!,
          $headerVisible: Boolean!,
          $general: Boolean!,
          $description: String,
          $renderedText: String
        ) {
          categoryUpdate(
            categoryId: $categoryId,
            fieldName: $fieldName,
            order: $order,
            headerVisible: $headerVisible,
            general: $general,
            description: $description,
            renderedText: $renderedText
          ){
            category{
              fieldName
              order
              headerVisible
              general
            }
            message
          }
        }
      GQL
    end

    context 'when category id is invalid' do
      it 'raises category not found error' do
        variables = {
          categoryId: 'zzzzzyyyy558',
          fieldName: 'personal info',
          order: 1,
          headerVisible: true,
          general: false,
        }

        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                   }).as_json
        expect(result.dig('errors', 0, 'message')).to eql 'Category not found'
      end
    end

    context 'when no submissions are made for the form' do
      it 'updates category for the form' do
        variables = {
          categoryId: category.id,
          fieldName: 'personal info',
          order: 1,
          headerVisible: true,
          general: false,
        }

        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                   }).as_json
        expect(result.dig('errors', 0, 'message')).to be_nil
        category_result = result.dig('data', 'categoryUpdate', 'category')
        expect(category_result['fieldName']).to eql 'personal info'
        expect(category_result['order']).to eql 1
        expect(category_result['headerVisible']).to eql true
        expect(category_result['general']).to eql false
      end
    end

    context 'when there are submissions made for the form' do
      before { form_user }

      it 'creates a new form with update category fields instead of deleting the category' do
        previous_form_count = Forms::Form.count
        variables = {
          categoryId: category.id,
          fieldName: 'personal info',
          order: 1,
          headerVisible: true,
          general: false,
        }

        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                   }).as_json
        expect(result.dig('errors', 0, 'message')).to be_nil
        expect(
          result.dig('data', 'categoryUpdate', 'message'),
        ).to eql 'New version created'
        expect(Forms::Form.count).to eql(previous_form_count + 1)
        new_form = Forms::Form.where.not(id: form.id).first
        updated_category = new_form.categories.where(form_property_id: nil)
                                   .first
        expect(updated_category.field_name).to eql 'personal info'
      end

      it 'creates a new form with update category fields instead of deleting the category' do
        previous_form_count = Forms::Form.count
        variables = {
          categoryId: sub_category.id,
          fieldName: 'Pharmacy',
          order: 1,
          headerVisible: true,
          general: false,
        }

        result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                   context: {
                                                     current_user: admin,
                                                     site_community: community,
                                                   }).as_json
        expect(result.dig('errors', 0, 'message')).to be_nil
        expect(
          result.dig('data', 'categoryUpdate', 'message'),
        ).to eql 'New version created'
        expect(Forms::Form.count).to eql(previous_form_count + 1)
        new_form = Forms::Form.where.not(id: form.id).first
        updated_category = new_form.categories.where.not(form_property_id: nil)
                                   .first
        expect(updated_category.field_name).to eql 'Pharmacy'
      end
    end

    context 'when current user is not admin' do
      it 'raises unauthorized error' do
        variables = {
          categoryId: category.id,
          fieldName: 'personal info',
          order: 1,
          headerVisible: true,
          general: false,
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
