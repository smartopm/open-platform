# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Form, type: :model do
  describe 'form crud' do
    let!(:current_user) { create(:user_with_community, user_type: 'admin') }
    let(:form) { create(:form, community_id: current_user.community_id) }

    it 'should create a form record' do
      current_user.community.forms.create!(
        name: 'Form Name',
        expires_at: (rand * 10).to_i.day.from_now,
      )
      expect(current_user.community.forms.length).to eql 1
      expect(current_user.community.forms.last.name).to eql 'Form Name'
    end

    it 'should update a form record' do
      expect(form.name).to_not eql 'Updated Name'
      form.update(name: 'Updated Name')
      expect(form.name).to eql 'Updated Name'
    end
  end

  describe 'schema' do
    it { is_expected.to have_db_column(:community_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:name).of_type(:string) }
    it { is_expected.to have_db_column(:expires_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:community) }
    it { is_expected.to have_many(:form_properties) }
    it { is_expected.to have_many(:form_users) }
  end
end
