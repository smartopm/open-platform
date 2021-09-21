# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Users::TimeSheet, type: :model do
  describe 'Associations' do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:community) }
    it { is_expected.to belong_to(:shift_start_event_log).class_name('Logs::EventLog').optional }
    it { is_expected.to belong_to(:shift_end_event_log).class_name('Logs::EventLog').optional }
  end
end
