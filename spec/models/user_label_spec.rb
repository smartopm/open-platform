# frozen_string_literal: true

require 'rails_helper'

RSpec.describe UserLabel, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:label_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:user_id).of_type(:uuid) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:label) }
  end
end
