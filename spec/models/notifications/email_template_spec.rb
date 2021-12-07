# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Notifications::EmailTemplate, type: :model do
  let!(:community) { create(:community) }
  let!(:another_community) { create(:community, name: 'CM') }

  describe 'create email templates' do
    it 'should extract and store template variables' do
      variables = { body: ['name'], subject: ['subject_variable'] }.to_json
      community.email_templates.create(
        name: 'Test Email Template',
        subject: 'This is a %subject_variable%',
        body: '<h1> Hello %name%</h1>',
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
    let!(:template) { create(:email_template, name: 'Template 1', community_id: community.id) }

    it { is_expected.to validate_presence_of(:name) }
    it {
      is_expected.to validate_uniqueness_of(:name)
        .scoped_to(:community_id)
        .with_message(/Email template with name already exists for community/i)
    }
  end

  describe 'scoped validations' do
    it 'checks for uniqueness of template name per community' do
      community.email_templates.create!(name: 'Template 1', subject: '', body: '')
      community.email_templates.create!(name: 'Template 2', subject: '', body: '')
      another_community.email_templates.create!(name: 'Template 1', subject: '', body: '')

      expect(Notifications::EmailTemplate.count).to eq(3)

      expect(community.email_templates.count).to eq(2)
      expect(another_community.email_templates.count).to eq(1)

      expect(community.email_templates.find_by(name: 'Template 1')).not_to be_nil
      expect(another_community.email_templates.find_by(name: 'Template 1')).not_to be_nil

      expect do
        another_community.email_templates.create!(name: 'Template 1', subject: '', body: '')
      end.to raise_error(
        ActiveRecord::RecordInvalid,
        'Validation failed: Name Email template with name already exists for community',
      )
    end
  end

  describe '#variable_names' do
    it 'extracts all variables into an array' do
      body = '<h1> Hello %name%</h1>'
      subject = 'This is a %subject_variable%'
      template = create(:email_template, body: body, name: 'Template 1', subject: subject,
                                         community_id: community.id)

      expect(template.variable_names).to eql %w[name subject_variable]
    end
  end
end
