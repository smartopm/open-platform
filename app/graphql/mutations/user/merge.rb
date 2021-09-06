# frozen_string_literal: true

module Mutations
  module User
    # merge users
    class Merge < BaseMutation
      argument :id, ID, required: true
      argument :duplicate_id, ID, required: true

      field :success, Boolean, null: true

      def resolve(id:, duplicate_id:)
        user = context[:site_community].users.find(id)
        raise GraphQL::ExecutionError, I18n.t('errors.not_found') unless user

        ActiveRecord::Base.transaction do
          user.merge_user(duplicate_id)
          { success: true }
        end
      rescue StandardError
        raise GraphQL::ExecutionError, I18n.t('errors.user.merge_failed')
      end

      def authorized?(vals)
        user_record = context[:site_community].users.find_by(id: vals[:id])
        current_user = context[:current_user]
        comm_user = user_record&.community_id == current_user.community_id
        unless comm_user && current_user&.admin?
          raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
        end

        true
      end
    end
  end
end
