# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Types::Queries::EmailTemplate do
  describe 'EmailTemplate queries' do
    let!(:current_user) { create(:user_with_community) }
    let!(:another_user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: current_user.community_id) }
    let!(:comm_templates) do
      current_user.community.email_templates.create(
        name: 'welcome',
        subject: 'Welcome Email',
        body: '<h2>some html %variable% </h2>',
      )
    end

    let(:email_templates) do
      <<~GQL
        {
            emailTemplates {
                name
                id
              }
        }
      GQL
    end

    let(:email_template) do
      <<~GQL
        query emailTemplate (
          $id: ID!
        ) {
          emailTemplate(id: $id) {
              id
              name
            }
          }
      GQL
    end

    it 'should retrieve list of email templates' do
      result = DoubleGdpSchema.execute(email_templates, context: {
                                         current_user: admin,
                                         site_community: current_user.community,
                                       }).as_json
      expect(result['errors']).to be_nil
      expect(result.dig('data', 'emailTemplates')).to_not be_nil
      expect(result.dig('data', 'emailTemplates', 0, 'name')).to eql 'welcome'
      expect(result.dig('data', 'emailTemplates', 0, 'id')).to_not be_nil
    end

    it 'should query a template' do
      result = DoubleGdpSchema.execute(email_template,
                                       variables: { id: comm_templates.id },
                                       context: {
                                         current_user: admin,
                                         site_community: current_user.community,
                                       }).as_json

      expect(result['errors']).to be_nil
      expect(result.dig('data', 'emailTemplate', 'id')).to eq(comm_templates.id)
    end

    it 'should raise unauthorized error if user is not available' do
      result = DoubleGdpSchema.execute(email_template,
                                       variables: { id: comm_templates.id },
                                       context: {
                                         current_user: nil,
                                         site_community: current_user.community,
                                       }).as_json

      expect(result.dig('data', 'emailTemplate')).to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end

    it 'should raise unauthorized error if user is not an admin' do
      result = DoubleGdpSchema.execute(email_template,
                                       variables: { id: comm_templates.id },
                                       context: {
                                         current_user: another_user,
                                         site_community: current_user.community,
                                       }).as_json

      expect(result.dig('data', 'emailTemplate')).to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end

    it 'should return unauthorized when not admin' do
      result = DoubleGdpSchema.execute(email_templates,
                                       context: {
                                         current_user: another_user,
                                         site_community: another_user.community,
                                       }).as_json
      expect(result.dig('data', 'emailTemplates')).to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end

    it 'should return unauthorized when current user is nil' do
      result = DoubleGdpSchema.execute(email_templates,
                                       context: {
                                         current_user: nil,
                                         site_community: another_user.community,
                                       }).as_json
      expect(result.dig('data', 'emailTemplates')).to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end
  end
end
