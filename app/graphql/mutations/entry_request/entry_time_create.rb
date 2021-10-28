# frozen_string_literal: true

module Mutations
    module EntryRequest
      # Create a new entry time
      class EntryTimeCreate < BaseMutation
        argument :visitation_date, String, required: true
        argument :starts_at, String, required: false
        argument :ends_at, String, required: false
        argument :occurs_on, [String], required: false
        argument :visit_end_date, String, required: false
        argument :visitable_id, ID, required: true
        argument :visitable_type, String, required: true

        field :entry_time, Types::EntryTimeType, null: true

        def resolve(vals)
            entry_time = context[:site_community].entry_times.create!(vals)

            return { entry_time: entry_time } if entry_time

          raise GraphQL::ExecutionError, user.errors.full_messages
        end

        # Verifies if current user admin or security guard.
        def authorized?(_vals)
          return true if ::Policy::ApplicationPolicy.new(
            context[:current_user], nil
          ).permission?(
            module: :entry_request,
            permission: :can_create_entry_request, # update the role
          ) || context[:current_user]&.role?(%i[security_guard admin custodian client resident])

          raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
        end
      end
    end
  end
