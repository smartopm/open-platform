# frozen_string_literal: true

module Mutations
  module User
    ATTACHMENTS = {
      avatar_blob_id: :avatar,
      document_blob_id: :document,
    }.freeze

    # Create a new request/pending member
    class Create < BaseMutation
      argument :name, String, required: true
      argument :email, String, required: false
      argument :phone_number, String, required: true
      argument :address, String, required: false
      argument :user_type, String, required: true
      argument :state, String, required: false
      argument :request_reason, String, required: false
      argument :vehicle, String, required: false
      argument :avatar_blob_id, String, required: false
      argument :document_blob_id, String, required: false
      argument :sub_status, String, required: false
      argument :secondary_info, GraphQL::Types::JSON, required: false
      argument :ext_ref_id, String, required: false

      field :user, Types::UserType, null: true

      ALLOWED_PARAMS_FOR_ROLES = {
        admin: {}, # Everything
        security_guard: { except: %i[state user_type] },
        client: { except: %i[state user_type phone_number email] },
        resident: { except: %i[state user_type phone_number email] },
        contractor: { except: %i[state user_type phone_number email] },
        site_worker: { except: %i[state user_type phone_number email] },
        custodian: { except: %i[state user_type phone_number email] },
        prospective_client: { except: %i[state user_type phone_number email] },
        visitor: { except: %i[state user_type phone_number email] },
        site_manager: { except: %i[state user_type phone_number email] },
        security_supervisor: { except: %i[state user_type phone_number email] },
        consultant: { except: %i[state user_type phone_number email] },

      }.freeze

      def resolve(vals)
        user = nil
        raise_duplicate_number_error(vals[:phone_number])

        begin
          user = context[:current_user].enroll_user(vals)
          return { user: user } if user.present? && user.errors.blank?
        rescue ActiveRecord::RecordNotUnique
          raise GraphQL::ExecutionError, I18n.t('errors.duplicate.email')
        end

        raise GraphQL::ExecutionError, user.errors.full_messages
      end

      def authorized?(_vals)
        # allowing all users to create clients
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless current_user

        true
      end
    end
  end
end
