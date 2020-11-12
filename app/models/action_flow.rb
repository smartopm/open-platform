# frozen_string_literal: true

# Table to save new flows
class ActionFlow < ApplicationRecord
  VALID_EVENT_TYPES = ActionFlows::EventPop.event_list.map { |event| event::EVENT_TYPE }

  belongs_to :community

  validates :title, :description, :event_type, :event_condition, :event_action, presence: true
  validates :title, uniqueness: true
  validates :event_type, inclusion: { in: VALID_EVENT_TYPES, allow_nil: false }
  # TODO: Find a good way to validate the content of event_action: Nurudeen
end
