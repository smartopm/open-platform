# frozen_string_literal: true

# Execute actionflows
class ActionFlowJob < ApplicationJob
  queue_as :default

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  def perform(event_log)
    # include (status: 'active') once the active/inactive functionality is implemented
    action_flows = event_log.community.action_flows.where(event_type: event_log.subject).map do |f|
      ActionFlows::WebFlow.new(f.description, f.event_type,
                               f.event_condition, f.event_action)
    end

    return if action_flows.blank?

    action_flows.compact.each do |af|
      next if skip_action?(event_log, af)

      event = af.event_object.new
      event.preload_data(event_log)
      cond = event.event_condition
      next unless cond.run_condition(af.condition)

      af.action.execute_action(event.data_set,
                               af.action_fields,
                               event_log)
    end
  end
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/AbcSize

  # Verifies whether to execute action or not.
  # * If reference is autogenerated from action, returns false.
  # * If action is recursive, returns false.
  # * Otherwise, true.
  #
  def skip_action?(event_log, action_flow)
    return false if event_log.ref_type.nil?

    reference = event_log.ref_type.constantize.find_by(id: event_log.ref_id)
    reference.try(:autogenerated) && action_flow.recursive_action?
  end
end
