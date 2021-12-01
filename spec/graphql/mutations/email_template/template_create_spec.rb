# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::EmailTemplate::TemplateCreate do
  describe 'create an email template' do
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:resident_role) { create(:role, name: 'resident') }
    let!(:permission) do
      create(:permission, module: 'email_template',
                          role: admin_role,
                          permissions: %w[can_create_email_template])
    end

    let!(:user) { create(:user_with_community, user_type: 'resident', role: resident_role) }
    let!(:admin) do
      create(:admin_user, user_type: 'admin', community_id: user.community_id, role: admin_role)
    end

    let(:template_mutation) do
      <<~GQL
        mutation template($name: String!, $subject: String!, $body: String!, $data: JSON!) {
          emailTemplateCreate( name: $name, subject: $subject, body: $body, data: $data){
            emailTemplate {
              name
              id
            }
          }
        }
      GQL
    end

    it 'creates an email template for the community' do
      variables = {
        name: 'welcome',
        subject: 'Welcome back',
        body: '<h2>Hello there, welcome to our community</h2>',
        data: { "design": { "data": 'something' } },
      }
      result = DoubleGdpSchema.execute(template_mutation, variables: variables,
                                                          context: {
                                                            current_user: admin,
                                                            site_community: user.community,
                                                            user_role: admin.role,
                                                          }).as_json
      expect(result.dig('data', 'emailTemplateCreate', 'emailTemplate', 'id')).not_to be_nil
      expect(result.dig('data', 'emailTemplateCreate', 'emailTemplate', 'name')).to eql 'welcome'
      expect(result['errors']).to be_nil
    end

    it 'should return unauthorized when user is not admin' do
      variables = {
        name: 'welcome',
        subject: 'Welcome back',
        body: '<h2>Hello there, welcome to our community</h2>',
        data: { "design": { "data": 'something' } },
      }
      result = DoubleGdpSchema.execute(template_mutation, variables: variables,
                                                          context: {
                                                            current_user: user,
                                                            site_community: user.community,
                                                            user_role: user.role,
                                                          }).as_json
      expect(result.dig('data', 'emailTemplateCreate', 'emailTemplate', 'id')).to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'Unauthorized'
    end
    it 'should value the requirement of the given argument' do
      variables = {
        name: 23_232,
        subject: 'Welcome back',
        body: '<h2>Hello there, welcome to our community</h2>',
        data: { "design": { "data": 'something' } },
      }
      result = DoubleGdpSchema.execute(template_mutation, variables: variables,
                                                          context: {
                                                            current_user: user,
                                                            site_community: user.community,
                                                            user_role: user.role,
                                                          }).as_json
      expect(result.dig('data', 'emailTemplateCreate', 'emailTemplate', 'id')).to be_nil
      expect(result.dig('errors', 0, 'message')).to include 'String! was provided invalid value'
    end
  end
end
