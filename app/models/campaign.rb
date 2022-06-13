# frozen_string_literal: true

require 'email_msg'

# its a campaign class
# rubocop: disable Metrics/ClassLength
class Campaign < ApplicationRecord
  include SearchCop

  belongs_to :community
  has_many :messages, class_name: 'Notifications::Message', dependent: :restrict_with_exception
  has_many :campaign_labels, class_name: 'Labels::CampaignLabel', dependent: :destroy
  has_many :labels, through: :campaign_labels, class_name: 'Labels::Label'

  EXPIRATION_DAYS = 7
  enum status: { draft: 0, scheduled: 1, in_progress: 2, deleted: 3, done: 4 }

  validates :campaign_type, inclusion: { in: %w[sms email] }
  before_save :clean_message

  scope :existing, -> { where.not(status: 3) }

  scope :still_pending, -> { where(status: %i[in_progress scheduled]) }

  scope :email_campaigns, -> { where(campaign_type: :email) }

  default_scope { order(created_at: :desc) }

  search_scope :search do
    attributes :name, :created_at
  end

  def clean_message
    self.user_id_list = '' if user_id_list.blank?
    self.message = message.gsub(/[\u2019\u201c\u201d]/, '\'') if campaign_type == 'sms' &&
                                                                 message.present?
  end

  def already_sent_user_ids
    messages.collect(&:user_id)
  end

  def campaign_admin_user
    community.sub_administrator || Users::User.find_by(name: 'Mutale Chibwe', state: 'valid')
  end

  def target_list
    return [] if user_id_list.blank? && labels.empty?

    user_id_list.split(',') + labels.joins(:users).pluck(:user_id)
  end

  def target_list_users
    label = community.labels.find_by(short_desc: "com_news_#{campaign_type}")
    user_ids = target_list.uniq - already_sent_user_ids.uniq
    return [] if label.nil? || user_ids.empty?

    label.users.where(state: 'valid', id: user_ids)
  end

  def send_messages(user)
    success_codes = [0, 7, 3, 6, 22, 29, 33]
    message_log = initialize_message(user)
    result = message_log.send_sms(add_prefix: false)
    sms_delivered = result&.messages&.select do |msg|
      success_codes.include?(msg.status.to_i)
    end.present?
    message_log.save if sms_delivered
  end

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  def send_email(user, batch)
    template = community.email_templates.find_by(id: email_templates_id)
    return if template.nil? || user.email.blank?

    message_log = initialize_message(user)
    # we will add more data here when needed
    template_data = [
      { key: '%community%', value: community.name.to_s },
      { key: '%logo_url%', value: community.logo_url.to_s },
      { key: '%message%', value: message },
    ]
    response = EmailMsg.send_mail_from_db(
      email: user.email,
      template: template,
      template_data: template_data,
      custom_key: 'campaign_id',
      custom_value: "#{id}*#{batch}",
    )
    message_log.save if response&.status_code.eql?('202')
  end

  def run_campaign
    update(start_time: Time.current, status: 'in_progress')
    target_list_users.each_with_index do |user, index|
      if campaign_type.eql?('email')
        send_email(user, index / 1000)
      elsif user.phone_number.present?
        send_messages(user)
      end
    end

    update({ end_time: Time.current, status: :done })
  end

  def label_users
    labels.map(&:users)
  end

  def campaign_metrics
    {
      batch_time: batch_time,
      start_time: start_time,
      end_time: end_time,
      total_scheduled: target_list.uniq.size,
      total_sent: message_count,
      total_clicked: total_clicked,
      total_opened: total_opened,
    }
  end

  def expired?
    return false if start_time.nil?

    Time.zone.now > (start_time + EXPIRATION_DAYS.days)
  end

  def initialize_message(user)
    receiver = campaign_type.eql?('sms') ? user.phone_number : user.email
    message_log = Notifications::Message.new
    message_log.assign_attributes(
      receiver: receiver, message: message, user_id: user.id,
      sender_id: campaign_admin_user.id, category: campaign_type, campaign_id: id
    )
    message_log
  end

  def schedule_campaign_job(old_status = 'draft')
    return unless status.eql?('scheduled') && old_status.eql?('draft') && batch_time.present?

    if batch_time < Time.zone.now
      CampaignSchedulerJob.perform_later(id)
    else
      CampaignSchedulerJob.set(wait_until: batch_time)
                          .perform_later(id)
    end
  end

  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength
  # rubocop: enable Metrics/ClassLength
end
