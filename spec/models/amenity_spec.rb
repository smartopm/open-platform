# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Amenity, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:id).of_type(:uuid) }
    it { is_expected.to have_db_column(:user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:community_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:name).of_type(:string) }
    it { is_expected.to have_db_column(:description).of_type(:text) }
    it { is_expected.to have_db_column(:location).of_type(:string) }
    it { is_expected.to have_db_column(:hours).of_type(:string) }
    it { is_expected.to have_db_column(:invitation_link).of_type(:string) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:user).class_name('Users::User') }
    it { is_expected.to belong_to(:community) }
  end
  describe 'enums' do
    it do
      is_expected.to define_enum_for(:status).with_values(published: 0, deleted: 1, deprecated: 2)
    end
  end
end
