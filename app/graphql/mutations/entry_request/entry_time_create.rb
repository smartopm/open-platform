# frozen_string_literal: true

module Mutations
    module EntryRequest
      # Create a new entry time
      class EntryTimeCreate < BaseMutation
        argument :guest_id, ID, required: true
        argument :visitation_date, String, required: true
        argument :starts_at, String, required: false
        argument :ends_at, String, required: false
        argument :occurs_on, [String], required: false
        argument :visit_end_date, String, required: false

        field :entry_time, Types::EntryTimeType, null: true

        def resolve(vals)
            user = context[:site_community].users.find(vals[:guest_id])
            raise GraphQL::ExecutionError, I18n.t('errors.not_found') unless user

            ActiveRecord::Base.transaction do
                invite = context[:current_user].invite_guest(user.id)
                entry_time = generate_entry_time(vals.except(:guest_id), invite)
                return { entry_time: entry_time } if entry_time

            rescue ActiveRecord::RecordNotUnique
              raise GraphQL::ExecutionError, I18n.t('errors.duplicate.guest')
            end

          raise GraphQL::ExecutionError, user.errors.full_messages
        end

        def generate_entry_time(vals, invite)
            invite_times = context[:site_community].entry_times.create!(
                                                    **vals,
                                                    visitable_id: invite.id,
                                                    visitable_type: 'Logs::Invite'
                                                    )
            invite_times
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
