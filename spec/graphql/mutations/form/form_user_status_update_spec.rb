# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Form::FormUserStatusUpdate do
  describe 'Update form status ' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'forms',
                          role: admin_role,
                          permissions: %w[can_update_form_user_status])
    end

    let!(:user) { create(:user_with_community, user_type: 'resident', role: resident_role) }
    let!(:admin) do
      create(:admin_user, community_id: user.community_id, role: admin_role, user_type: 'admin')
    end

    let!(:form) { create(:form, community_id: user.community_id) }
    let!(:form_user) do
      user.form_users.create!(form_id: form.id, status: 1, status_updated_by_id: admin.id)
    end

    let(:mutation) do
      <<~GQL
        mutation formUserStatusUpdate($formUserId: ID!, $status: String!){
          formUserStatusUpdate(formUserId: $formUserId, status:$status){
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
        formUserId: form_user.id,
        status: 'approved',
      }
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: admin,
                                                   site_community: user.community,
                                                   user_role: admin.role,
                                                 }).as_json
      expect(result.dig('data', 'formUserStatusUpdate', 'formUser', 'id')).to eql form_user.id
      expect(result.dig('data', 'formUserStatusUpdate', 'formUser', 'status')).to eql 'approved'
      expect(result['errors']).to be_nil
    end

    it 'throws unauthorized error when user is not admin' do
      variables = {
        formUserId: form_user.id,
        status: 'approved',
      }
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: user,
                                                   site_community: user.community,
                                                   user_role: user.role,
                                                 }).as_json
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
    end

    it 'throws not found error when form user does not exist' do
      variables = {
        formUserId: '53bhb-j4bnrh-34rfs3',
        status: 'approved',
      }
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: admin,
                                                   site_community: user.community,
                                                   user_role: admin.role,
                                                 }).as_json
      expect(result.dig('errors', 0, 'message')).to eql 'Record not found'
    end
  end
end
