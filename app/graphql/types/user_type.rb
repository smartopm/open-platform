# frozen_string_literal: true

require 'host_env'

module Types
  # UserType
  # rubocop: disable Metrics/ClassLength
  class UserType < Types::BaseObject
    field :id, ID, null: false
    field :community, Types::CommunityType, null: false,
                                            resolve: Resolvers::BatchResolver.load(:community)
    field :email, String, null: true, visible: { roles: %i[admin security_guard custodian
                                                           security_supervisor
                                                           marketing_admin], user: :id }
    field :name, String, null: false
    field :address, String, null: true
    field :image_url, String, null: true
    field :user_type, String, null: true
    field :vehicle, String, null: true, visible: { roles: %i[admin security_guard
                                                             custodian marketing_admin
                                                             security_supervisor], user: :id }
    field :request_reason, String, null: true,
                                   visible: { roles: %i[admin security_guard marketing_admin
                                                        security_supervisor custodian],
                                              user: :id }
    field :phone_number, String, null: true, visible: { roles: %i[admin security_guard
                                                                  client custodian
                                                                  security_supervisor
                                                                  marketing_admin], user: :id }
    field :request_note, String, null: true, visible: { roles: %i[admin security_guard custodian
                                                                  security_supervisor], user: :id }
    field :role_name, String, null: true, visible: { roles: %i[admin security_guard custodian
                                                               security_supervisor
                                                               marketing_admin], user: :id }
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
    field :notes, [Types::NoteType], null: true,
                                     visible: { roles: %i[admin marketing_admin], user: :id },
                                     resolve: Resolvers::BatchResolver.load(:notes)
    field :tasks, [Types::NoteType], null: true,
                                     visible: { roles: %i[admin marketing_admin], user: :id },
                                     resolve: Resolvers::BatchResolver.load(:tasks)
    field :accounts, [Types::AccountType], null: true,
                                           visible: { roles: %i[admin marketing_admin], user: :id },
                                           resolve: Resolvers::BatchResolver.load(:accounts)
    field :messages, [Types::MessageType], null: true,
                                           visible: { roles: %i[admin], user: :id },
                                           resolve: Resolvers::BatchResolver.load(:messages)
    field :time_sheets, [Types::TimeSheetType], null: true,
                                                visible: { roles: %i[admin custodian], user: :id },
                                                resolve: Resolvers::BatchResolver.load(:time_sheets)
    field :businesses, [Types::BusinessType], null: true,
                                              visible: { roles: %i[admin marketing_admin],
                                                         user: :id },
                                              resolve: Resolvers::BatchResolver.load(:businesses)
    field :labels, [Types::LabelType], null: true,
                                       visible: { roles: %i[admin marketing_admin], user: :id },
                                       resolve: Resolvers::BatchResolver.load(:labels)
    field :form_users, [Types::FormUsersType], null: true,
                                               visible: { roles: %i[admin marketing_admin],
                                                          user: :id },
                                               resolve: Resolvers::BatchResolver.load(:form_users)
    field :contact_infos, [Types::ContactInfoType],
          null: true,
          visible: { roles: %i[admin marketing_admin], user: :id },
          resolve: Resolvers::BatchResolver.load(:contact_infos)
    field :invoices, [Types::InvoiceType], null: true, visible: { roles: %i[admin], user: :id },
                                           resolve: Resolvers::BatchResolver.load(:invoices)
    field :substatus_logs, [Types::SubstatusLogType],
          null: true,
          visible: { roles: %i[admin marketing_admin], user: :id },
          resolve: Resolvers::BatchResolver.load(:substatus_logs)
    field :ext_ref_id, String, null: true,
                               visible: { roles: %i[admin custodian marketing_admin], user: :id }
    field :payment_plan, Boolean, null: false
    field :permissions, [Types::PermissionType], null: false
    field :invites, [Types::InviteType], null: true, visible: { roles: %i[admin], user: :id },
                                         resolve: Resolvers::BatchResolver.load(:invites)
    field :invitees, [Types::InviteType], null: true, visible: { roles: %i[admin], user: :id },
                                          resolve: Resolvers::BatchResolver.load(:invitees)
    field :request, Types::EntryRequestType, null: true,
                                             resolve: Resolvers::BatchResolver.load(:request)
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
    field :contact_details, GraphQL::Types::JSON, null: true
    field :secondary_phone_number, String, null: true
    field :african_presence, String, null: true
    field :region, String, null: true
    field :division, String, null: true
    field :task_id, String, null: true
    field :capex_amount, String, null: true
    field :jobs_created, String, null: true
    field :jobs_timeline, String, null: true
    field :kick_off_date, GraphQL::Types::ISO8601DateTime, null: true
    field :investment_size, String, null: true
    field :investment_timeline, String, null: true
    field :decision_timeline, String, null: true
    field :status, String, null: true

    def avatar_url
      attachment_load('Users::User', :avatar, object.id).then do |avatar|
        host_url(avatar) if avatar.present?
      end
    end

    def host_url(type)
      base_url = HostEnv.base_url(object.community)
      path = Rails.application.routes.url_helpers.rails_blob_path(type)
      "https://#{base_url}#{path}"
    end

    def payment_plan
      batch_load(object, :payment_plans).then do |payment_plans|
        batch_load(object, :plan_payments).then do |plan_payments|
          active_payment_plan?(payment_plans) || plan_payments.present?
        end
      end
    end

    def active_payment_plan?(payment_plans)
      payment_plans.any? { |plan| plan.status.eql?('active') }
    end

    def permissions
      context[:current_user].role.permissions
    end

    def form_users
      object.form_users.order(created_at: :desc)
    end

    # Field for lead secondary mail
    def secondary_email
      batch_load(object, :contact_infos).then do |contact_infos|
        secondary_details(contact_infos, 'email').first&.info
      end
    end

    # Field for lead secondary phone number
    def secondary_phone_number
      batch_load(object, :contact_infos).then do |contact_infos|
        secondary_details(contact_infos, 'phone').first&.info
      end
    end

    def secondary_details(contact_infos, contact_type)
      contact_infos.select { |info| info.contact_type.eql?(contact_type) }
    end
  end
  # rubocop: enable Metrics/ClassLength
end
