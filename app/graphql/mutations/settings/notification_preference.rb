# frozen_string_literal: true

module Mutations
  module Settings
    # Set notification preference for users
    class NotificationPreference < BaseMutation
      argument :preferences, String, required: false
      field :success, Boolean, null: true

      def resolve(vals)
        preferences = vals[:preferences]&.split(',') || []
        default_preference = ::User::DEFAULT_PREFERENCE
        raise GraphQL::ExecutionError, 'Invalid Value' if (preferences - default_preference).any?

        unselected_values = context[:current_user].labels
                                                  .where('short_desc IN (?)', default_preference)
                                                  .pluck(:short_desc) - preferences
        remove_preference(unselected_values)
        add_preference(preferences)
      end

      private

      def add_preference(preferences)
        preferences.each do |pref|
          label = label_record(pref)
          next if preference_exists?(label) ||
                  context[:current_user].user_labels.create!(label_id: label.id)

          raise GraphQL::ExecutionError, 'Preference Update Failed'
        end
        { success: true }
      end

      def remove_preference(unselected_values)
        unselected_values.each do |pref|
          label_id = context[:site_community].labels.find_by(short_desc: pref)&.id
          context[:current_user].user_labels.find_by(label_id: label_id).delete
        end
      end

      def label_record(pref)
        context[:site_community].labels.find_by(short_desc: pref).presence ||
          context[:site_community].labels.create!(short_desc: pref)
      end

      def preference_exists?(label)
        context[:current_user].labels.include?(label)
      end

      def authorized?(_vals)
        return true if context[:current_user].present?

        raise GraphQL::ExecutionError, 'Unauthorized'
      end
    end
  end
end
