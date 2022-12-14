# frozen_string_literal: true

module Mutations
  module Showroom
    # Create showroom
    class ShowroomCreate < BaseMutation
      argument :name, String, required: false
      argument :email, String, required: false
      argument :phone_number, String, required: false
      argument :home_address, String, required: false
      argument :nrc, String, required: false
      argument :reason, String, required: false
      argument :source, String, required: false

      field :showroom, Types::ShowroomType, null: true

      def resolve(vals)
        showroom = ::Showroom.create(vals)

        return { showroom: showroom } if showroom.persisted?

        raise GraphQL::ExecutionError, showroom.errors.full_messages
      end

      # TODO: Better auth here
      def authorized?(_vals)
        return true if context[:current_user].present?

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
