# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::EmailTemplate::TemplateCreate do
  describe 'create an email template' do
    let!(:user) { create(:user_with_community) }
    let!(:admin) { create(:admin_user, community_id: user.community_id) }

    let(:template_mutation) do
      <<~GQL
      mutation template($name: String!, $subject: String!, $body: String!) {
        emailTemplateCreate( name: $name, subject: $subject, body: $body){
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
        body: '<h2>Hello there, welcome to our community</h2>'
      }
      result = DoubleGdpSchema.execute(template_mutation, variables: variables,
                                              context: {
                                                current_user: admin,
                                                site_community: user.community,
                                              }).as_json
      expect(result.dig('data', 'emailTemplateCreate', 'emailTemplate', 'id')).not_to be_nil
      expect(result.dig('data', 'emailTemplateCreate', 'emailTemplate', 'name'),).to eql 'welcome'
      expect(result['errors']).to be_nil
    end

    it 'should return unauthorized when user is not admin' do
      variables = {
        name: 'welcome',
        subject: 'Welcome back',
        body: '<h2>Hello there, welcome to our community</h2>'
      }
      result = DoubleGdpSchema.execute(template_mutation, variables: variables,
                                              context: {
                                                current_user: user,
                                                site_community: user.community,
                                              }).as_json
      expect(result.dig('data', 'emailTemplateCreate', 'emailTemplate', 'id')).to be_nil
      expect(result['errors']0).to include 'Unauthorized'
    end
  end
end
