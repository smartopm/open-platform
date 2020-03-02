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

      field :entries, Types::ShowroomType, null: true

      def resolve(vals)
        showroom = ::Showroom.new(vals)
        showroom.save
       
        return { showroom: showroom } if showroom.persisted?

        raise GraphQL::ExecutionError, showroom.errors.full_messages
      end

    end
  end
end
