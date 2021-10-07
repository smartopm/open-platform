# frozen_string_literal: true

module Mutations
  module EntryRequest
    # Add an observation note to an entry request
    class EntryRequestNote < BaseMutation
      argument :id, ID, required: false
      argument :event_log_id, ID, required: false
      argument :ref_type, String, required: false
      argument :note, String, required: false
      argument :attached_images, GraphQL::Types::JSON, required: false

      field :event, Types::EventLogType, null: true

      # rubocop:disable Metrics/AbcSize
      # rubocop:disable Metrics/MethodLength
      def resolve(vals)
        if vals[:note].blank?
          raise GraphQL::ExecutionError, I18n.t('errors.entry_request.empty_note')
        end

        ActiveRecord::Base.transaction do
          log = vals[:ref_type]&.constantize&.find_by(
            id: vals[:id],
            community_id: context[:site_community].id,
          )
          update_prev_log(vals[:event_log_id], vals[:note])

          evt = context[:current_user].generate_events('observation_log', log, note: vals[:note])
          evt.attach_images(vals[:attached_images]) if vals[:attached_images].present?
          raise GraphQL::ExecutionError, evt.errors.full_messages if evt.blank?

          { event: evt }
        end
      end
      # rubocop:enable Metrics/AbcSize
      # rubocop:enable Metrics/MethodLength

      def update_prev_log(event_id, note)
        return unless note.eql?('Exited')

        event = context[:site_community].event_logs.find_by(id: event_id)
        return if event.nil?

        event.data['exited'] = true
        event.save!
      end

      # Verifies if current user is present or not.
      def authorized?(_vals)
        return true if context[:current_user]&.role?(%i[security_guard admin])

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
