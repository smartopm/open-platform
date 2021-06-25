# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Users::Feedback, type: :model do
  describe 'Associations' do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:community) }
  end
end
