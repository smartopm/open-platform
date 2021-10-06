# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::Permission do
  describe 'permission queries' do
    let!(:site_worker) { create(:site_worker) }
    let(:permissions_query) do
      %(query {
        permissions(module: "note", role: "admin")
        })
    end

    let(:bad_permissions_query) do
      %(query {
        permissions(module: "fake_module", role: "fake_role")
        })
    end

    let(:permissions_object) do
      { note: { admin: { permissions: %i[can_create_note can_update_note] } } }
    end

    before do
      allow_any_instance_of(
        ::Policy::ApplicationPolicy,
      )
        .to receive(:permission_list)
        .and_return(permissions_object)
    end

    it 'should retrieve list of permissions for note module and admin role' do
      result = DoubleGdpSchema.execute(permissions_query, context: {
                                         current_user: site_worker,
                                       }).as_json
      expect(result.dig('data', 'permissions').length).to eql 2
      expect(result.dig('data', 'permissions', 0)).to eql 'can_create_note'
      expect(result.dig('data', 'permissions', 1)).to eql 'can_update_note'
    end

    it 'should raise an error when the current user is null' do
      result = DoubleGdpSchema.execute(permissions_query, context: {
                                         current_user: nil,
                                       }).as_json
      expect(result.dig('errors', 0, 'message'))
        .to include('Unauthorized')
    end

    it 'should return a bad query error when bad query' do
      result = DoubleGdpSchema.execute(bad_permissions_query,
                                       context: {
                                         current_user: site_worker,
                                       }).as_json
      expect(result.dig('errors', 0, 'message')).to eql 'Bad query, invalid role or module'
    end
  end
end
