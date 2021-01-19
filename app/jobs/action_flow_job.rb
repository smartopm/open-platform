# frozen_string_literal: true

# Execute actionflows
class ActionFlowJob < ApplicationJob
  queue_as :default

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  def perform(event_log)
    # include (status: 'active') once the active/inactive functionality is implemented
    action_flows = ActionFlow.where(event_type: event_log.subject).map do |f|
      ActionFlows::ActionFlow.new(f.description, f.event_type,
                                  f.event_condition, f.event_action)
    end

    return if action_flows.blank?

    action_flows.each do |af|
      event = af.event_object.new
      event.preload_data(event_log)
      cond = event.event_condition
      af.action.execute_action(event.data_set, af.action_fields) if cond.run_condition(af.condition)
    end
  end
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/AbcSize
end
