# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ContactInfo, type: :model do
  let!(:current_user) { create(:user_with_community) }
  describe 'schema' do
    it { is_expected.to have_db_column(:contact_type).of_type(:string) }
    it { is_expected.to have_db_column(:info).of_type(:string) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:user) }
  end

  # rubocop:disable Metrics/LineLength
  describe 'validations' do
    it { is_expected.to validate_inclusion_of(:contact_type).in_array(ContactInfo::VALID_CONTACT_TYPES) }
  end
  # rubocop:enable Metrics/LineLength

  it 'user can add contactInfo' do
    current_user.contact_infos.create(contact_type: 'email', info: 'nicolas@doublegdp.com')
    retrieved_value = current_user.contact_infos.find_by(contact_type: 'email')
    expect(retrieved_value.info).to eql 'nicolas@doublegdp.com'
  end
end
