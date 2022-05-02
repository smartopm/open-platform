# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Discussions::Post, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:content).of_type(:text) }
    it { is_expected.to have_db_column(:status).of_type(:integer) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:user).class_name('Users::User') }
    it { is_expected.to belong_to(:discussion) }
    it { is_expected.to belong_to(:community) }
  end

  describe 'enums' do
    it { is_expected.to define_enum_for(:status).with_values(active: 0, deleted: 1) }
  end
end
