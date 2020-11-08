class ActionFlow < ApplicationRecord
  VALID_EVENT_TYPES = ActionFlows::EventPop.event_list.map { |event| event::EVENT_TYPE }

  validates :title, :description, :event_type, :event_condition, :event_action, :active, presence: true
  validates :event_type, inclusion: { in: VALID_EVENT_TYPES, allow_nil: false }
  # ToDo: Find a good way to validate the content of event_action: Nurudeen
end
