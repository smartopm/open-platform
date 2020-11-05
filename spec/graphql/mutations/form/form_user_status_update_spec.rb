# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Form::FormUserStatusUpdate do
  describe 'Update form status ' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:form) { create(:form, community_id: user.community_id) }
    let!(:form_user) do
      user.form_users.create!(form_id: form.id, status: 1, status_updated_by_id: admin.id)
    end

    let(:mutation) do
      <<~GQL
        mutation formUserStatusUpdate($formId: ID!, $userId: ID!, $status: String!){
          formUserStatusUpdate(formId: $formId, userId: $userId, status:$status){
            formUser {
              id
              status
            }
          }
        }
      GQL
    end

    it 'updates form status when user is admin' do
      variables = {
        formId: form.id,
        userId: user.id,
        status: 'approved',
      }
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: admin,
                                                   site_community: user.community,
                                                 }).as_json
      expect(result.dig('data', 'formUserStatusUpdate', 'formUser', 'id')).to eql form_user.id
      expect(result.dig('data', 'formUserStatusUpdate', 'formUser', 'status')).to eql 'approved'
      expect(result.dig('errors')).to be_nil
    end

    it 'throws unauthorized error when user is not admin' do
      variables = {
        formId: form.id,
        userId: user.id,
        status: 'approved',
      }
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: user,
                                                   site_community: user.community,
                                                 }).as_json
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
    end

    it 'throws not found error when form user does not exist' do
      variables = {
        formId: '53bhb-j4bnrh-34rfs3',
        userId: user.id,
        status: 'approved',
      }
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: admin,
                                                   site_community: user.community,
                                                 }).as_json
      expect(result.dig('errors', 0, 'message')).to eql 'Form not found'
    end
  end
end
