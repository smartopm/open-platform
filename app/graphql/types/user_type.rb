# frozen_string_literal: true

require 'host_env'

module Types
  # UserType
  # rubocop: disable Metrics/ClassLength
  class UserType < Types::BaseObject
    field :id, ID, null: false
    field :community, Types::CommunityType, null: false
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
                                     visible: { roles: %i[admin marketing_admin], user: :id }
    field :tasks, [Types::NoteType], null: true,
                                     visible: { roles: %i[admin marketing_admin], user: :id }
    field :accounts, [Types::AccountType], null: true,
                                           visible: { roles: %i[admin marketing_admin], user: :id }
    field :messages, [Types::MessageType], null: true,
                                           visible: { roles: %i[admin], user: :id }
    field :time_sheets, [Types::TimeSheetType], null: true, visible: { roles: %i[admin custodian],
                                                                       user: :id }
    field :businesses, [Types::BusinessType], null: true,
                                              visible: { roles: %i[admin marketing_admin],
                                                         user: :id }
    field :labels, [Types::LabelType], null: true,
                                       visible: { roles: %i[admin marketing_admin], user: :id }
    field :form_users, [Types::FormUsersType], null: true,
                                               visible: { roles: %i[admin marketing_admin],
                                                          user: :id }
    field :contact_infos, [Types::ContactInfoType], null: true,
                                                    visible: { roles: %i[admin marketing_admin],
                                                               user: :id }
    field :invoices, [Types::InvoiceType], null: true, visible: { roles: %i[admin],
                                                                  user: :id }
    field :substatus_logs, [Types::SubstatusLogType], null: true,
                                                      visible: { roles: %i[admin marketing_admin],
                                                                 user: :id }
    field :ext_ref_id, String, null: true,
                               visible: { roles: %i[admin custodian marketing_admin], user: :id }
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

    def form_users
      object.form_users.order(created_at: :desc)
    end

    # Field for lead secondary mail
    def secondary_email
      secondary_details('email').first&.info
    end

    # Field for lead secondary phone number
    def secondary_phone_number
      secondary_details('phone').first&.info
    end

    def secondary_details(contact_type)
      object.contact_infos.select { |info| info.contact_type.eql?(contact_type) }
    end

    def accounts
      BatchLoader::GraphQL.for(object.id).batch(cache: false, default_value: []) do |ids, loader|
        Properties::Account.where(user_id: ids).each do |account|
          loader.call(account.user_id) { |memo| memo << account }
        end
      end
    end

    def notes
      BatchLoader::GraphQL.for(object.id).batch(cache: false, default_value: []) do |ids, loader|
        Notes::Note.where(user_id: ids).each do |note|
          loader.call(note.user_id) { |memo| memo << note }
        end
      end
    end

    def form_users
      BatchLoader::GraphQL.for(object.id).batch(cache: false, default_value: []) do |ids, loader|
        Forms::FormUser.where(user_id: ids).each do |form_user|
          loader.call(form_user.user_id) { |memo| memo << form_user }
        end
      end
    end

    def invoices
      BatchLoader::GraphQL.for(object.id).batch(cache: false, default_value: []) do |ids, loader|
        Payments::Invoice.where(user_id: ids).each do |invoice|
          loader.call(invoice.user_id) { |memo| memo << invoice }
        end
      end
    end

    def messages
      BatchLoader::GraphQL.for(object.id).batch(cache: false, default_value: []) do |ids, loader|
        Notifications::Message.where(user_id: ids).each do |message|
          loader.call(message.user_id) { |memo| memo << message }
        end
      end
    end

    def time_sheets
      BatchLoader::GraphQL.for(object.id).batch(cache: false, default_value: []) do |ids, loader|
        Users::TimeSheet.where(user_id: ids).each do |time_sheet|
          loader.call(time_sheet.user_id) { |memo| memo << time_sheet }
        end
      end
    end

    def businesses
      BatchLoader::GraphQL.for(object.id).batch(cache: false, default_value: []) do |ids, loader|
        Business.where(user_id: ids).each do |business|
          loader.call(business.user_id) { |memo| memo << business }
        end
      end
    end

    def contact_infos
      BatchLoader::GraphQL.for(object.id).batch(cache: false, default_value: []) do |ids, loader|
        Users::ContactInfo.where(user_id: ids).each do |contact_info|
          loader.call(contact_info.user_id) { |memo| memo << contact_info }
        end
      end
    end

    def substatus_logs
      BatchLoader::GraphQL.for(object.id).batch(cache: false, default_value: []) do |ids, loader|
        Logs::SubstatusLog.where(user_id: ids).each do |substatus_log|
          loader.call(substatus_log.user_id) { |memo| memo << substatus_log }
        end
      end
    end

    def invites
      BatchLoader::GraphQL.for(object.id).batch(cache: false, default_value: []) do |ids, loader|
        Logs::Invite.where(guest_id: ids).each do |contact_info|
          loader.call(contact_info.guest_id) { |memo| memo << contact_info }
        end
      end
    end

    def invitees
      BatchLoader::GraphQL.for(object.id).batch(cache: false, default_value: []) do |ids, loader|
        Logs::Invite.where(host_id: ids).each do |contact_info|
          loader.call(contact_info.host_id) { |memo| memo << contact_info }
        end
      end
    end

    def tasks
      BatchLoader::GraphQL.for(object.id).batch(cache: false, default_value: []) do |ids, loader|
        assignee_notes = Notes::AssigneeNote.where(user_id: ids).includes(:note)
        assignee_notes.each do |assignee_note|
          loader.call(assignee_note.user_id) { |memo| memo << assignee_note.note }
        end
      end
    end

    def labels
      BatchLoader::GraphQL.for(object.id).batch(cache: false, default_value: []) do |ids, loader|
        user_labels = Labels::UserLabel.where(user_id: ids).includes(:label)
        user_labels.each do |user_label|
          loader.call(user_label.user_id) { |memo| memo << user_label.label }
        end
      end
    end

    def request
      BatchLoader::GraphQL.for(object.id).batch(cache: false) do |ids, loader|
        Logs::EntryRequest.where(guest_id: ids).each { |user| loader.call(user.id, user) }
      end
    end

    def community
      BatchLoader::GraphQL.for(object.community_id).batch(cache: false) do |ids, loader|
        Community.where(id: ids).each { |community| loader.call(community.id, community) }
      end
    end
  end
  # rubocop: enable Metrics/ClassLength
end
