# frozen_string_literal: true

require 'rails_helper'

RSpec.describe EmailTemplate, type: :model do
  let!(:community) { create(:community) }

  describe 'create email templates' do
    it 'should extract and store template variables' do
      variables = { body: ['name'], subject: ['subject_variable'] }.to_json
      community.email_templates.create(
        name: 'Test Email Template',
        subject: 'This is a ${subject_variable}',
        body: '<h1> Hello ${name}</h1>',
      )
      expect(community.email_templates.length).to eql 1
      expect(community.email_templates[0].template_variables).to eql variables
    end
  end

  describe 'schema' do
    it { is_expected.to have_db_column(:community_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:name).of_type(:string) }
    it { is_expected.to have_db_column(:body).of_type(:text) }
    it { is_expected.to have_db_column(:template_variables).of_type(:json) }
    it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:community) }
  end

  describe 'callbacks' do
    it { is_expected.to callback(:set_template_variables).before(:save) }
  end

  describe 'validations' do
    let!(:template) { create(:email_template, community: community) }
    it { is_expected.to validate_uniqueness_of(:name) }
    it { is_expected.to validate_presence_of(:name) }
  end
end
