# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Form::FormUpdate do
  describe 'Update for forms' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:form) { create(:form, community_id: user.community_id) }

    let(:mutation) do
      <<~GQL
        mutation formUpdate($id: ID!, $name: String!) {
          formUpdate(id: $id, name: $name){
            form {
              id
              name
            }
          }
        }
      GQL
    end

    it 'updates form name' do
      variables = {
        id: form.id,
        name: 'Updated Name',
      }
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: admin,
                                                   site_community: user.community,
                                                 }).as_json
      expect(result.dig('data', 'formUpdate', 'form', 'name')).to eql 'Updated Name'
      expect(result.dig('errors')).to be_nil
    end

    it 'throws unauthorized error when user is not admin' do
      variables = {
        id: form.id,
        name: 'Updated Name',
      }
      result = DoubleGdpSchema.execute(mutation, variables: variables,
                                                 context: {
                                                   current_user: user,
                                                   site_community: user.community,
                                                 }).as_json
      expect(result.dig('errors', 0, 'message')).to eql 'Unauthorized'
    end
  end
end
