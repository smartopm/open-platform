# frozen_string_literal: true

module Mutations
    module User
      # invite a user
      class Invite < BaseMutation
        argument :id, ID, required: true

        field :success, Boolean, null: true

        def resolve(id:)
          user = context[:site_community].users.find(id)
          raise GraphQL::ExecutionError, I18n.t('errors.not_found') unless user

          begin
            host = context[:current_user]
            return { success: true } if host.invite_user(user.id)
          rescue ActiveRecord::RecordNotUnique
            raise GraphQL::ExecutionError, I18n.t('errors.duplicate.guest')
          end
          raise GraphQL::ExecutionError, user.errors.full_messages
        end

        def authorized?(_vals)
            return true if ::Policy::ApplicationPolicy.new(
              context[:current_user], nil
            ).permission?(
              admin: true,
              module: :user,
              permission: :can_invite_user,
            )

            raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
          end
      end
    end
end
