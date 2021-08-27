# frozen_string_literal: true

module Mutations
  module Community
    # Create a ticket and send SMSs
    class CommunityEmergency < BaseMutation
      argument :google_map_url, String, required: false

      field :success, Boolean, null: true

      # rubocop:disable Metrics/AbcSize
      # rubocop:disable Metrics/MethodLength
      # rubocop:disable Layout/LineLength
      def resolve(vals)
        if context[:current_user].blank?
          raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
        end

        body = vals[:google_map_url] != nil ? "#{context[:current_user].name} has initiated an emergency support request from this approximate location #{vals[:google_map_url]}. Please confirm the person is safe and the emergency is resolved." : "#{context[:current_user].name} has initiated an emergency support request and do not have a location in our system. Please confirm the person is safe and the emergency is resolved."
        note = context[:site_community].notes.new(
          body: body,
          description: 'Emergency SOS', category: 'emergency', flagged: true, due_date: (Time.zone.today + 1).to_s,
          author: context[:current_user], user: context[:current_user], community: context[:site_community],
          assignees: context[:site_community].users.where(user_type: %w[security_guard custodian])
        )

        raise GraphQL::ExecutionError, note.errors.full_messages unless note.save

        return { success: true } if context[:site_community]
                                    .craft_sms(
                                      { note_id: note.id,
                                        current_user: context[:current_user],
                                        google_map_url: vals[:google_map_url]},
                                    )

        raise GraphQL::ExecutionError, community.errors.full_messages
      end
      # rubocop:enable Metrics/AbcSize
      # rubocop:enable Metrics/MethodLength
      # rubocop:enable Layout/LineLength
    end
  end
end
