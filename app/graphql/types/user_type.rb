# frozen_string_literal: true

require 'host_env'

module Types
  # UserType
  # rubocop: disable Metrics/ClassLength
  class UserType < Types::BaseObject
    field :id, ID, null: false
    field :community, Types::CommunityType, null: false
    field :email, String, null: true, visible: { roles: %i[admin security_guard
                                                           security_supervisor], user: :id }
    field :name, String, null: false
    field :address, String, null: true
    field :image_url, String, null: true
    field :user_type, String, null: true
    field :vehicle, String, null: true, visible: { roles: %i[admin security_guard
                                                             security_supervisor], user: :id }
    field :request_reason, String, null: true,
                                   visible: { roles: %i[admin security_guard security_supervisor],
                                              user: :id }
    field :phone_number, String, null: true, visible: { roles: %i[admin security_guard client
                                                                  security_supervisor], user: :id }
    field :request_note, String, null: true, visible: { roles: %i[admin security_guard
                                                                  security_supervisor], user: :id }
    field :role_name, String, null: true, visible: { roles: %i[admin security_guard custodian
                                                               security_supervisor], user: :id }
    field :state, String, null: true
    field :sub_status, String, null: true
    field :expires_at, GraphQL::Types::ISO8601DateTime, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :last_activity_at, GraphQL::Types::ISO8601DateTime, null: true
    field :avatar_url, String, null: true
    field :source, String, null: true, visible: { roles: %i[admin security_guard
                                                            security_supervisor], user: :id }
    field :stage, String, null: true, visible: { roles: %i[admin security_guard
                                                           security_supervisor], user: :id }
    field :owner_id, ID, null: true, visible: { roles: %i[admin security_guard
                                                          security_supervisor], user: :id }
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
    field :permissions, [Types::PermissionType], null: false
    field :invites, [Types::InviteType], null: true, visible: { roles: %i[admin], user: :id }
    field :invitees, [Types::InviteType], null: true, visible: { roles: %i[admin], user: :id }
    field :request, Types::EntryRequestType, null: true
    field :title, String, null: true
    field :linkedin_url, String, null: true
    field :country, String, null: true
    field :company_name, String, null: true
    field :company_description, String, null: true
    field :company_linkedin, String, null: true
    field :company_website, String, null: true
    field :company_annual_revenue, String, null: true
    field :company_contacted, String, null: true
    field :industry, String, null: true
    field :industry_sub_sector, String, null: true
    field :industry_business_activity, String, null: true
    field :level_of_internationalization, String, null: true
    field :lead_temperature, String, null: true
    field :lead_status, String, null: true
    field :lead_source, String, null: true
    field :lead_owner, String, null: true
    field :lead_type, String, null: true
    field :client_category, String, null: true
    field :next_steps, String, null: true
    field :created_by, String, null: true
    field :modified_by, String, null: true
    field :relevant_link, String, null: true
    field :first_contact_date, GraphQL::Types::ISO8601DateTime, null: true
    field :last_contact_date, GraphQL::Types::ISO8601DateTime, null: true
    field :followup_at, GraphQL::Types::ISO8601DateTime, null: true
    field :company_employees, String, null: true
    field :secondary_email, String, null: true
    field :secondary_phone_number, String, null: true
    field :contact_details, GraphQL::Types::JSON, null: true
    field :secondary_email, String, null: true
    field :secondary_phone_number, String, null: true
    field :african_presence, String, null: true
    field :region, String, null: true

    def avatar_url
      return nil unless object.avatar.attached?

      host_url(object.avatar)
    end

    def host_url(type)
      base_url = HostEnv.base_url(object.community)
      path = Rails.application.routes.url_helpers.rails_blob_path(type)
      "https://#{base_url}#{path}"
    end

    def payment_plan
      object.payment_plans.active.present? || object.plan_payments.present?
    end

    def permissions
      context[:current_user].role.permissions
    end

    # Field for lead secondary mail
    def secondary_email
      secondary_details('email')&.info
    end

    # Field for lead secondary phone number
    def secondary_phone_number
      secondary_details('phone')&.info
    end

    def secondary_details(contact_type)
      object.contact_infos.find { |info| info.contact_type.eql?(contact_type) }
    end
  end
  # rubocop: enable Metrics/ClassLength
end
