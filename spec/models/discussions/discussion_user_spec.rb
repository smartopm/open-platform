# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Discussions::DiscussionUser, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:discussion_id).of_type(:uuid) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:user).class_name('Users::User') }
    it { is_expected.to belong_to(:discussion) }
  end
end
