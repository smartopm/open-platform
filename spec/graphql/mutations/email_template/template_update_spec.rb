# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::EmailTemplate::TemplateUpdate do
  describe 'create an email template' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }
    let!(:comm_templates) do
      user.community.email_templates.create(
        name: 'welcome',
        subject: 'Welcome Email',
        body: '<h2>some html %variable% </h2>',
      )
    end

    let(:template_mutation) do
      <<~GQL
        mutation template($id: ID!, $name: String!, $subject: String!, $body: String!) {
          emailTemplateUpdate(id: $id, name: $name, subject: $subject, body: $body){
            emailTemplate {
              name
              id
            }
          }
        }
      GQL
    end

    it 'updates an email template for the community' do
      variables = {
        id: comm_templates.id,
        name: 'W Again',
        subject: 'Welcome back',
        body: '<h2>Hello there, welcome to our community</h2>',
      }
      result = DoubleGdpSchema.execute(template_mutation, variables: variables,
                                                          context: {
                                                            current_user: admin,
                                                            site_community: user.community,
                                                          }).as_json
      expect(result.dig('data', 'emailTemplateUpdate', 'emailTemplate', 'id')).not_to be_nil
      expect(result.dig('data', 'emailTemplateUpdate', 'emailTemplate', 'name')).to eql 'W Again'
      expect(result['errors']).to be_nil
    end

    it 'should return unauthorized when user is not admin' do
      variables = {
        id: comm_templates.id,
        name: 'welcome',
        subject: 'Welcome back',
        body: '<h2>Hello there, welcome to our community</h2>',
      }
      result = DoubleGdpSchema.execute(template_mutation, variables: variables,
                                                          context: {
                                                            current_user: user,
                                                            site_community: user.community,
                                                          }).as_json
      expect(result.dig('data', 'emailTemplateUpdate', 'emailTemplate', 'id')).to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end
    it 'should value the requirement of the given argument' do
      variables = {
        id: comm_templates.id,
        name: 23_232,
        subject: 'Welcome back',
        body: '<h2>Hello there, welcome to our community</h2>',
      }
      result = DoubleGdpSchema.execute(template_mutation, variables: variables,
                                                          context: {
                                                            current_user: user,
                                                            site_community: user.community,
                                                          }).as_json
      expect(result.dig('data', 'emailTemplateUpdate', 'emailTemplate', 'id')).to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'String! was provided invalid value'
    end

    it 'should not update when template is not available' do
      variables = {
        id: '34342342',
        name: 'Template name',
        subject: 'Welcome back',
        body: '<h2>Hello there, welcome to our community</h2>',
      }
      result = DoubleGdpSchema.execute(template_mutation, variables: variables,
                                                          context: {
                                                            current_user: admin,
                                                            site_community: user.community,
                                                          }).as_json
      expect(result.dig('data', 'emailTemplateUpdate', 'emailTemplate', 'id')).to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'Template not found'
    end
  end
end
