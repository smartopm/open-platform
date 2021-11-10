# frozen_string_literal: true

# TODO: @mdp break this class up
# rubocop:disable Metrics/ClassLength

require 'email_msg'
require 'merge_users'
require 'host_env'

module Users
  # User should encompass all users of the system
  # Citizens
  # City Administrators
  # Workers
  # Contractors
  class User < ApplicationRecord
    # General user error to return on actions that are not possible
    class UserError < StandardError; end
    class ExpiredSignature < StandardError; end
    class DecodeError < StandardError; end

    include SearchCop

    search_scope :search do
      attributes :name, :phone_number, :user_type, :email, :sub_status, :ext_ref_id
      attributes labels: ['labels.short_desc']
    end

    search_scope :heavy_search do
      attributes :name, :phone_number, :user_type, :email, :sub_status
      attributes labels: ['labels.short_desc']
      attributes date_filter: ['acting_event_log.created_at']
      scope { joins(:acting_event_log).eager_load(:labels) }
    end

    search_scope :plot_number do
      attributes plot_no: ['land_parcels.parcel_number']
    end

    search_scope :search_by_contact_info do
      attributes :phone_number, :email
      attributes contact_infos: ['contact_infos.info']
    end

    search_scope :search_lite do
      attributes :name, :phone_number, :user_type, :email, :sub_status
    end

    search_scope :search_guest do
      attributes :phone_number, :email, :name
    end

    scope :allowed_users, lambda { |current_user|
      policy = ::Policy::User::UserPolicy.new(current_user, nil)
      allowed_user_types = policy.roles_user_can_see
      relat = where(community_id: current_user.community_id)
      return relat if allowed_user_types == '*'
      if policy.role_can_see_self?
        return relat.where(user_type: allowed_user_types).or(relat.where(id: current_user.id))
      end

      return relat.where(user_type: allowed_user_types)
    }
    scope :by_phone_number, ->(number) { where(phone_number: number&.split(',')) }
    scope :by_type, ->(user_type) { where(user_type: user_type&.split(',')) }
    scope :by_labels, lambda { |label|
                        joins(:labels).where(labels: { short_desc: label&.split(',') })
                      }

    belongs_to :community
    has_many :entry_requests, class_name: 'Logs::EntryRequest', dependent: :destroy
    has_many :granted_entry_requests, class_name: 'Logs::EntryRequest', foreign_key: :grantor_id,
                                      dependent: :destroy, inverse_of: :user
    has_many :revoked_entry_requests, class_name: 'Logs::EntryRequest', foreign_key: :revoker_id,
                                      dependent: :destroy, inverse_of: :user

    has_many :payments, class_name: 'Payments::Payment', dependent: :destroy
    has_many :invoices, class_name: 'Payments::Invoice', dependent: :destroy, inverse_of: :user
    has_many :notes, class_name: 'Notes::Note', dependent: :destroy
    has_many :notifications, class_name: 'Notifications::Notification', dependent: :destroy
    has_many :note_comments, class_name: 'Comments::NoteComment', dependent: :destroy
    has_many :messages, class_name: 'Notifications::Message', dependent: :destroy
    has_many :time_sheets, dependent: :destroy
    has_many :accounts, class_name: 'Properties::Account', dependent: :destroy
    has_many :comments, class_name: 'Comments::Comment', dependent: :destroy
    has_many :discussion_users, class_name: 'Discussions::DiscussionUser', dependent: :destroy
    has_many :discussions, through: :discussion_users, class_name: 'Discussions::Discussion'
    has_many :land_parcels, class_name: 'Properties::LandParcel', through: :accounts
    has_many :businesses, dependent: :destroy
    has_many :user_labels, class_name: 'Labels::UserLabel', dependent: :destroy
    has_many :contact_infos, dependent: :destroy
    has_many :labels, through: :user_labels, class_name: 'Labels::Label'
    has_many :assignee_notes, class_name: 'Notes::AssigneeNote', dependent: :destroy
    has_many :acting_event_log, class_name: 'Logs::EventLog',
                                foreign_key: :acting_user_id, inverse_of: false, dependent: :destroy
    has_many :tasks, through: :assignee_notes, class_name: 'Notes::Note', source: :note
    has_many :activity_points, dependent: :destroy
    has_many :user_form_properties, class_name: 'Forms::UserFormProperty', dependent: :destroy
    has_many :form_users, class_name: 'Forms::FormUser', dependent: :destroy
    has_many :post_tag_users, class_name: 'PostTags::PostTagUser', dependent: :destroy
    has_many :post_tags, through: :post_tag_users, class_name: 'PostTags::PostTag'
    has_many :wallet_transactions, class_name: 'Payments::WalletTransaction', dependent: :destroy
    has_many :wallets, class_name: 'Payments::Wallet', dependent: :destroy
    has_many :payment_plans, class_name: 'Properties::PaymentPlan', dependent: :destroy
    has_many :substatus_logs, class_name: 'Logs::SubstatusLog', dependent: :destroy
    has_many :import_logs, class_name: 'Logs::ImportLog', dependent: :destroy
    has_many :transactions, class_name: 'Payments::Transaction', dependent: :destroy
    has_many :plan_payments, class_name: 'Payments::PlanPayment', dependent: :destroy
    has_many :plan_ownerships, class_name: 'Properties::PlanOwnership', dependent: :destroy
    has_many :co_owned_plans, class_name: 'Properties::PaymentPlan', through: :plan_ownerships,
                              source: :payment_plan

    # TODO: find more about the inverse_of association and if we really need that
    # rubocop:disable Rails/InverseOf
    has_one :request, class_name: 'Logs::EntryRequest', foreign_key: :guest_id,
                      dependent: :destroy
    has_many :invites, class_name: 'Logs::Invite', foreign_key: :guest_id,
                       dependent: :destroy
    has_many :invitees, class_name: 'Logs::Invite', foreign_key: :host_id,
                        dependent: :destroy
    # rubocop:enable Rails/InverseOf
    has_one_attached :avatar
    has_one_attached :document

    before_save :ensure_default_state_and_type
    after_create :send_email_msg

    # Track changes to the User
    has_paper_trail

    VALID_USER_TYPES = %w[security_guard admin resident contractor
                          prospective_client client visitor custodian site_worker].freeze
    VALID_STATES = %w[valid pending banned expired].freeze
    DEFAULT_PREFERENCE = %w[com_news_sms com_news_email weekly_point_reminder_email].freeze

    enum sub_status: {
      plots_fully_purchased: 0,
      eligible_to_start_construction: 1,
      floor_plan_purchased: 2,
      building_permit_approved: 3,
      construction_in_progress: 4,
      construction_completed: 5,
      construction_in_progress_self_build: 6,
    }

    validates :user_type, inclusion: { in: VALID_USER_TYPES, allow_nil: true }
    validates :state, inclusion: { in: VALID_STATES, allow_nil: true }
    validates :sub_status, inclusion: { in: sub_statuses.keys, allow_nil: true }
    validates :name, presence: true
    validates :email, uniqueness: {
      scope: :community_id,
      case_sensitive: true,
      allow_nil: true,
    }
    validate :phone_number_valid?
    after_create :add_notification_preference
    after_update :update_associated_accounts_details, if: -> { saved_changes.key?('name') }

    devise :omniauthable, omniauth_providers: %i[google_oauth2 facebook]

    PHONE_TOKEN_LEN = 6
    PHONE_TOKEN_EXPIRATION_MINUTES = 2880 # Valid for 48 hours

    class PhoneTokenResultInvalid < StandardError; end
    class PhoneTokenResultExpired < StandardError; end
    class TokenGenerationFailed < StandardError; end

    ATTACHMENTS = {
      avatar_blob_id: :avatar,
      document_blob_id: :document,
    }.freeze

    OAUTH_FIELDS_MAP = {
      email: ->(auth) { auth.info.email },
      name: ->(auth) { auth.info.name },
      address: ->(auth) { auth.info.address },
      provider: ->(auth) { auth.provider },
      uid: ->(auth) { auth.uid },
      image_url: ->(auth) { auth.info.image },
      token: ->(auth) { auth.credentials.token },
      oauth_expires: ->(auth) { auth.credentials.expires },
      oauth_expires_at: ->(auth) { Time.zone.at(auth.credentials.expires_at).utc.to_datetime },
      refresh_token: ->(auth) { auth.credentials.refresh_token },
    }.freeze

    ROLE_PRIVILEGES = {
      avatar_rw: ->(user) { %w[security_guard admin].includes(user.user_type) },
    }.freeze

    ALLOWED_PARAMS_FOR_ROLES = {
      admin: {}, # Everything
      security_guard: { except: %i[state user_type] },
    }.freeze

    SITE_MANAGERS = %w[security_guard contractor custodian admin].freeze

    def self.from_omniauth(auth, site_community)
      # Either create a User record or update it based on the provider (Google) and the UID
      user = find_or_initialize_from_oauth(auth, site_community)
      return user unless user.new_record?

      OAUTH_FIELDS_MAP.each_key do |param|
        user[param] = OAUTH_FIELDS_MAP[param][auth]
      end
      user.assign_default_community(site_community)
      user.save!
      user
    end

    def self.find_or_initialize_from_oauth(auth, site_community)
      by_email = site_community.users.find_by(email: auth.info.email)
      return by_email if by_email

      site_community.users.new
    end

    # We may want to do a bit more work here massaing the number entered
    def self.find_any_via_phone_number(phone_number)
      find_by(phone_number: phone_number)
    end

    def self.find_any_via_email(email)
      # exclude users authenticated via any oAuth provider
      find_by(email: email, provider: nil)
    end

    # We may want to do a bit more work here massaing the number entered
    def find_via_phone_number(phone_number)
      community.users.find_by(phone_number: phone_number)
    end

    def self.lookup_by_id_card_token(token)
      find_by(id: token)
    end

    def site_manager?
      SITE_MANAGERS.include?(user_type)
    end

    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/MethodLength
    def enroll_user(vals)
      enrolled_user = User.new(vals.except(*ATTACHMENTS.keys).except(:secondary_info))
      enrolled_user.community_id = community_id
      enrolled_user.expires_at = Time.zone.now + 1.day if vals[:user_type] == 'prospective_client'
      ATTACHMENTS.each_pair do |key, attr|
        enrolled_user.send(attr).attach(vals[key]) if vals[key]
      end
      data = { ref_name: enrolled_user.name, note: '', type: enrolled_user.user_type }
      return enrolled_user unless enrolled_user.save

      record_secondary_info(enrolled_user, vals[:secondary_info])
      generate_events('user_enrolled', enrolled_user, data)
      process_referral(enrolled_user, data)
      enrolled_user
    end

    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/MethodLength

    def record_secondary_info(user, secondary_contact_data)
      return unless secondary_contact_data.present? && user.valid?

      JSON.parse(secondary_contact_data).each do |key, values|
        values.each { |val| user.contact_infos.create(contact_type: key, info: val) }
      end
    end

    def process_referral(enrolled_user, data)
      return if %w[visitor admin].include?(user_type)

      generate_events('user_referred', enrolled_user, data)
      referral_todo(enrolled_user)
    end

    def referral_todo(vals)
      community.notes.create(
        user_id: vals[:id],
        body: "Contact #{vals[:name]}: Prospective client referred by #{self[:name]}.
        Please reach out to the set up a call or visit.",
        flagged: true,
        author_id: self[:id],
        completed: false,
      )
    end

    # Grants the access for entry request.
    #
    # @param entry_request_id [String]
    # @param event_id [String]
    #
    # @return [EntryRequest]
    def grant!(entry_request_id)
      entry = community.entry_requests.find_by(id: entry_request_id)
      return nil if entry.blank?

      entry.grant!(self)
      entry
    end

    def deny!(entry_request_id)
      entry = entry_requests.find(entry_request_id)
      return nil if entry.blank?

      entry.deny!(self)
      entry
    end

    def revoke!(entry_request_object)
      entry_request_object.revoke!(self)
      entry_request_object
    end

    def generate_events(event_tag, target_obj, data = {})
      Logs::EventLog.create(acting_user_id: id,
                            community_id: community_id, subject: event_tag,
                            ref_id: target_obj&.id,
                            ref_type: target_obj&.class&.to_s,
                            data: data)
    end

    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/AbcSize
    def generate_note(vals)
      note = community.notes.create(
        # give the note to the author if no other user
        user_id: vals[:user_id] || self[:id],
        body: vals[:body],
        category: vals[:category],
        description: vals[:description],
        flagged: vals[:flagged],
        author_id: self[:id],
        completed: vals[:completed] || false,
        due_date: vals[:due_date],
        form_user_id: vals[:form_user_id],
        parent_note_id: vals[:parent_note_id],
      )
      note.documents.attach(vals[:attached_documents]) if vals[:attached_documents]
      note
    end
    # rubocop:enable Metrics/AbcSize

    def manage_shift(target_user_id, event_tag)
      user = find_a_user(target_user_id)
      data = { ref_name: user.name, type: user.user_type }
      return unless user

      event = generate_events(event_tag, user, data)

      if event_tag == 'shift_start'
        user.time_sheets.create(started_at: Time.current, shift_start_event_log: event,
                                community_id: community_id)
      else
        timesheet = user.time_sheets.find_by(ended_at: nil)
        return unless timesheet

        timesheet.update(ended_at: Time.current, shift_end_event_log: event)
        timesheet
      end
    end
    # rubocop:enable Metrics/MethodLength

    def construct_message(vals)
      mess = messages.new(vals)
      mess[:user_id] = vals[:user_id]
      mess.sender_id = self[:id]
      mess
    end

    def find_user_discussion(id, type)
      if type == 'post'
        community.discussions.find_by(post_id: id)
      else
        community.discussions.find(id)
      end
    end

    def find_a_user(a_user_id)
      community.users.allowed_users(self).find(a_user_id)
    end

    def find_label_users(ids)
      query = ids.split(',')
      User.allowed_users(self)
          .includes(:user_labels)
          .where(user_labels: { label_id: query }, community_id: community_id)
    end

    def id_card_token
      # May want to do more to secure this in the future with some extra token
      self[:id]
    end

    VALID_USER_TYPES.each do |user_type|
      define_method "#{user_type}?" do
        self[:user_type] == user_type
      end
    end

    def role_name
      return '' unless self[:user_type]

      self[:user_type].humanize.titleize
    end

    # Returns status of a user
    # banned, expired, pending, valid
    def state
      self[:state] || 'pending'
    end

    def pending?
      self[:state] == 'pending'
    end

    def expired?
      return false unless self[:expires_at]

      self[:expires_at] < Time.zone.now
    end

    def ensure_default_state_and_type
      # TODO(Nurudeen): Move these to DB level as default values
      self[:state] ||= 'pending'
      self[:user_type] ||= 'visitor'
    end

    def create_new_phone_token
      token = (Array.new(PHONE_TOKEN_LEN) { SecureRandom.random_number(10) }).join('')
      return token if update(
        phone_token: token,
        phone_token_expires_at: PHONE_TOKEN_EXPIRATION_MINUTES.minutes.from_now,
      )

      nil
    end

    def domain
      self[:email].split('@').last
    end

    # Assign known hardcoded domains to a community
    # TODO: Make this happen from the DB vs hardcoding
    def assign_default_community(site_community)
      return if self[:community_id].present? && self[:user_type].present?
      return unless %w[google_oauth2 facebook].include?(self[:provider])

      if site_community.domain_admin?(domain)
        update(community_id: site_community.id, user_type: 'admin')
      else
        update(community_id: site_community.id,
               user_type: 'visitor',
               expires_at: Time.current)
      end
    end

    def send_phone_token
      raise UserError, 'No phone number to send one time code to' unless self[:phone_number]

      token = create_new_phone_token
      raise TokenGenerationFailed, 'Token generation failed' if token.blank?

      Rails.logger.info "Sending #{token} to #{self[:phone_number]}"
      Sms.send(self[:phone_number], "Your code is #{token}")
      # Send number via Nexmo
    end

    def send_one_time_login
      raise UserError, 'No phone number to send one time code to' unless self[:phone_number]

      token = create_new_phone_token
      raise TokenGenerationFailed, 'Token generation failed' if token.blank?

      url = "https://#{HostEnv.base_url(community)}/l/#{self[:id]}/#{token}"
      msg = "Your login link for #{community.name} is #{url}"
      Rails.logger.info "Sending '#{msg}' to #{self[:phone_number]}"
      Sms.send(self[:phone_number], msg)
      url
    end

    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/AbcSize
    def send_one_time_login_email
      raise UserError, 'No Email to send one time code to' unless self[:email]

      token = create_new_phone_token
      raise TokenGenerationFailed, 'Token generation failed' if token.blank?

      url = "https://#{HostEnv.base_url(community)}/l/#{self[:id]}/#{token}"
      msg = "Your login link for #{community.name} is #{url}"

      template = community.email_templates
      &.system_emails
      &.find_by(name: 'one_time_login_template')
      return unless template

      template_data = [{ key: '%one_time_login%', value: msg }]
      Rails.logger.info "Sending '#{msg}' to #{self[:email]}"
      EmailMsg.send_mail_from_db(self[:email], template, template_data)
      url
    end
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/MethodLength

    def role?(roles)
      user_type = self[:user_type]
      return false unless user_type

      Array(roles).include?(user_type.to_sym)
    end

    def can_become?(user)
      return false unless role?(%i[admin security_guard])

      return false if user.role?([:admin]) # Don't let anyone become an admin

      user.community_id == community_id
    end

    def verify_phone_token!(token)
      if phone_token == token
        return true if phone_token_expires_at > Time.zone.now

        raise PhoneTokenResultExpired
      end
      raise PhoneTokenResultInvalid
    end

    def auth_token
      JWT.encode({ user_id: self[:id] }, Rails.application.credentials.secret_key_base, 'HS256')
    end

    def self.find_via_auth_token(auth_token, community)
      decoded_token = decode_auth_token(auth_token)
      payload = decoded_token[0]
      community.users.find payload['user_id']
    end

    def self.decode_auth_token(auth_token)
      JWT.decode auth_token,
                 Rails.application.credentials.secret_key_base,
                 true,
                 algorithm: 'HS256'
    rescue JWT::ExpiredSignature
      raise ExpiredSignature
    rescue JWT::DecodeError, JWT::VerificationError
      raise DecodeError
    end

    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/MethodLength
    def self.already_existing(email, phone_list, community)
      email = email&.presence
      phone_list = phone_list.reject(&:blank?)
      (where.not(email: nil).where(community: community).where(
        arel_table[:email].matches("#{email || ' '}%"),
      ).or(where(phone_number: phone_list, community: community)) +
        where(community: community).joins(:contact_infos).where(contact_infos:
          { contact_type: 'email', info: email }).or(
            where(community: community).joins(:contact_infos).where(contact_infos:
            { contact_type: 'phone', info: phone_list }),
          )
      ).uniq
    end

    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/AbcSize
    def send_email_msg
      return if self[:email].nil?

      template = community.email_templates.find_by(name: 'welcome')
      return unless template

      template_data = [{ key: '%login_url%', value: HostEnv.base_url(community) || '' }]
      EmailMsg.send_mail_from_db(self[:email], template, template_data)
    end

    # catch exceptions in here to be caught in the mutation
    def merge_user(dup_id)
      MergeUsers.merge(dup_id, self[:id])
    end

    def activity_point_for_current_week
      last_monday = if current_time_in_timezone.monday?
                      current_time_in_timezone.beginning_of_day
                    else
                      current_time_in_timezone.prev_occurring(:monday).beginning_of_day
                    end

      activity_points.find_by('created_at >= ?', last_monday)
    end

    # has a better meaning when used on a logged-in user
    def first_login_today?
      user_logins_today = Logs::EventLog.where(
        'acting_user_id = ? AND subject = ? AND created_at >= ?',
        id, 'user_login', current_time_in_timezone.beginning_of_day
      )
      user_logins_today.length == 1
    end

    def note_assigned?(note_id)
      tasks.where(id: note_id).present?
    end

    def wallet
      wallets.first.presence || wallets.create(balance: 0, pending_balance: 0)
    end

    def active_payment_plan?
      payment_plans.active.present? || wallet_transactions.present? || invoices.present?
    end

    def current_time_in_timezone
      # Should we get timezone from user's community instead?
      Time.now.in_time_zone('Africa/Lusaka')
    end

    def regular_and_govt_plots(property_number, gov_property_number)
      [
        land_parcels.find_by(parcel_number: property_number),
        land_parcels.find_by(parcel_number: gov_property_number),
      ]
    end

    # Update accounts details to their associated user's details
    #
    # @return [Boolean]
    def update_associated_accounts_details
      accounts.where.not(accounts: { full_name: name }).update(full_name: name)
    end

    # Return general land parcel associated with user
    #
    # @return [Properties::LandParcel]
    def general_land_parcel
      land_parcels.unscope(where: :status).general.first.presence || create_general_land_parcel
    end

    # Return general payment plan associated with user
    #
    # @return [Properties::PaymentPlan]
    def general_payment_plan
      payment_plans.general_plans.first.presence || create_general_plan
    end

    def invite_guest(guest_id)
      return unless guest_id

      invite = invitees.find_by(guest_id: guest_id)
      return invite unless invite.nil?

      Logs::Invite.create!(host_id: id, guest_id: guest_id)
    end

    private

    def phone_number_valid?
      return if self[:phone_number].blank?

      unless self[:phone_number].match(/\A[0-9+\s\-]+\z/)
        errors.add(:phone_number, :invalid_phone_number)
      end

      # All phone numbers with country codes are between 8-15 characters long
      errors.add(:phone_number, :invalid_length) unless self[:phone_number]
                                                        .gsub(/[^0-9]/, '')
                                                        .length.between?(8, 15)
    end

    def add_notification_preference
      DEFAULT_PREFERENCE.each do |pref|
        label = community.labels.find_by(short_desc: pref).presence ||
                community.labels.create!(short_desc: pref)
        user_labels.create!(label_id: label.id)
      end
    end

    # Creates general land parcel for user
    #
    # @return [Boolean]
    def create_general_land_parcel
      land_parcel = Properties::LandParcel.create!(parcel_number:
        "Genral Property #{name} - #{id}", community_id: community.id, status: 'general')
      land_parcel.accounts.create!(user_id: id, full_name: name, community_id: community.id)
      land_parcel
    end

    # Creates general payment plan for user
    #
    # @return [Boolean]
    def create_general_plan
      land_parcel = general_land_parcel
      payment_plan = land_parcel.payment_plans.new(user_id: id, frequency: 'monthly',
                                                   installment_amount: 0, duration: 360,
                                                   total_amount: 0, status: 'general',
                                                   start_date: Time.zone.now)
      payment_plan.save!(validate: false)
      payment_plan
    end
  end
  # rubocop:enable Metrics/ClassLength
end
