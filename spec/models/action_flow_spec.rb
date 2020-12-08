# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ActionFlow, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:title).of_type(:string) }
    it { is_expected.to have_db_column(:description).of_type(:string) }
    it { is_expected.to have_db_column(:event_type).of_type(:string) }
    it { is_expected.to have_db_column(:event_condition).of_type(:string) }
    it { is_expected.to have_db_column(:event_condition_query).of_type(:string) }
    it { is_expected.to have_db_column(:event_action).of_type(:json) }
  end

  describe 'validations' do
    it { is_expected.to validate_inclusion_of(:event_type).in_array(ActionFlow::VALID_EVENT_TYPES) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:community) }
  end

  describe 'Actionflow event' do
    it 'defines all required methods' do
      ActionFlows::EventPop.event_list.each do |event|
        expect(event).to respond_to(:event_metadata, :event_description, :event_type)
      end

      ActionFlows::EventPop.event_list.each do |event|
        expect(event.new).to respond_to(:preload_data)
      end
    end
  end
end
