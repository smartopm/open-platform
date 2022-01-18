# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ActionFlows::ActionFlow, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:title).of_type(:string) }
    it { is_expected.to have_db_column(:description).of_type(:string) }
    it { is_expected.to have_db_column(:event_type).of_type(:string) }
    it { is_expected.to have_db_column(:event_condition).of_type(:string) }
    it { is_expected.to have_db_column(:event_condition_query).of_type(:string) }
    it { is_expected.to have_db_column(:event_action).of_type(:json) }
  end

  describe 'validations' do
    it do
      is_expected
        .to validate_inclusion_of(:event_type)
        .in_array(ActionFlows::ActionFlow::VALID_EVENT_TYPES)
    end

    it do
      is_expected
        .to validate_uniqueness_of(:title)
        .ignoring_case_sensitivity
        .scoped_to(:community_id)
    end
  end

  describe 'associations' do
    it { is_expected.to belong_to(:community) }
  end

  describe 'scoped validations' do
    let!(:community) { create(:community) }
    let!(:action_flow) do
      create(:action_flow, event_type: 'form_submit', title: 'NAME', community: community)
    end

    context 'when same title is used in a community' do
      it 'raises validation error' do
        expect do
          create(:action_flow, event_type: 'form_submit', title: 'NAME', community: community)
        end.to raise_error(
          ActiveRecord::RecordInvalid,
          'Validation failed: Title has already been taken',
        )
      end
    end

    context 'when same title is used in a different community' do
      before do
        create(:action_flow, event_type: 'form_submit', title: 'NAME')
      end

      it 'creates action flow without any error' do
        expect(ActionFlows::ActionFlow.count).to eql 2
      end
    end
  end

  describe 'Actionflow event' do
    it 'defines all required methods' do
      ActionFlows::EventPop.event_list.each do |event|
        expect(event).to respond_to(:event_metadata, :event_description, :event_type)
        expect(event.new).to respond_to(:preload_data)
      end
    end
  end
end
