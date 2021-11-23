# frozen_string_literal: true

require 'host_env'

module Types
  # UserType
  class UserType < Types::BaseObject
    field :id, ID, null: false
    field :community, Types::CommunityType, null: false
    field :email, String, null: true, visible: { roles: %i[admin security_guard], user: :id }
    field :name, String, null: false
    field :address, String, null: true
    field :image_url, String, null: true
    field :user_type, String, null: true
    field :vehicle, String, null: true, visible: { roles: %i[admin security_guard], user: :id }
    field :request_reason, String, null: true, visible: { roles: %i[admin security_guard],
                                                          user: :id }
    field :phone_number, String, null: true, visible: { roles: %i[admin security_guard client],
                                                        user: :id }
    field :request_note, String, null: true, visible: { roles: %i[admin security_guard], user: :id }
    field :role_name, String, null: true, visible: { roles: %i[admin security_guard custodian],
                                                     user: :id }
    field :state, String, null: true
    field :sub_status, String, null: true
    field :expires_at, GraphQL::Types::ISO8601DateTime, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :last_activity_at, GraphQL::Types::ISO8601DateTime, null: true
    field :avatar_url, String, null: true
    field :document_url, String, null: true
    field :source, String, null: true, visible: { roles: %i[admin security_guard], user: :id }
    field :stage, String, null: true, visible: { roles: %i[admin security_guard], user: :id }
    field :owner_id, ID, null: true, visible: { roles: %i[admin security_guard], user: :id }
    field :followup_at, GraphQL::Types::ISO8601DateTime, null: true
    field :notes, [Types::NoteType], null: true, visible: { roles: %i[admin], user: :id }
    field :tasks, [Types::NoteType], null: true, visible: { roles: %i[admin], user: :id }
    field :accounts, [Types::AccountType], null: true, visible: { roles: %i[admin], user: :id }
    field :messages, [Types::MessageType], null: true, visible: { roles: %i[admin], user: :id }
    field :time_sheets, [Types::TimeSheetType], null: true, visible: { roles: %i[admin custodian],
                                                                       user: :id }
    field :businesses, [Types::BusinessType], null: true, visible: { roles: %i[admin], user: :id }
    field :labels, [Types::LabelType], null: true, visible: { roles: %i[admin], user: :id }
    field :form_users, [Types::FormUsersType], null: true, visible: { roles: %i[admin], user: :id }
    field :contact_infos, [Types::ContactInfoType], null: true, visible: { roles: %i[admin],
                                                                           user: :id }
    field :invoices, [Types::InvoiceType], null: true, visible: { roles: %i[admin],
                                                                  user: :id }
    field :substatus_logs, [Types::SubstatusLogType], null: true, visible: { roles: %i[admin],
                                                                             user: :id }
    field :ext_ref_id, String, null: true, visible: { roles: %i[admin], user: :id }
    field :payment_plan, Boolean, null: false
    field :permissions, GraphQL::Types::JSON, null: true
    field :invites, [Types::InviteType], null: true, visible: { roles: %i[admin], user: :id }
    field :invitees, [Types::InviteType], null: true, visible: { roles: %i[admin], user: :id }
    field :request, Types::EntryRequestType, null: true
    field :community_roles, GraphQL::Types::JSON, null: true

    def avatar_url
      return nil unless object.avatar.attached?

      host_url(object.avatar)
    end

    def document_url
      return nil unless object.document.attached?

      host_url(object.document)
    end

    def host_url(type)
      base_url = HostEnv.base_url(object.community)
      path = Rails.application.routes.url_helpers.rails_blob_path(type)
      "https://#{base_url}#{path}"
    end

    def payment_plan
      object.payment_plans.active.present? || object.plan_payments.present?
    end

    def community_roles
      result = {}
      roles = Role.where(community_id: [nil, context[:site_community].id]).pluck(:name)
      roles.each do |role|
        result[role] = role.capitalize.gsub('_', ' ')
      end
      result
    end

    def permissions
      Permission.where(role: context[:current_user].role)
    end
  end
end
