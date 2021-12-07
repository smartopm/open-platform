# frozen_string_literal: true

require 'email_msg'

# its a campaign class
class Campaign < ApplicationRecord
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

  default_scope { order(created_at: :desc) }

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

  def target_list_user
    label = community.labels.find_by(short_desc: "com_news_#{campaign_type}")
    user_ids = target_list.uniq - already_sent_user_ids.uniq
    return [] if label.nil? || user_ids.empty?

    label.users.where(state: 'valid', id: user_ids)
  end

  def update_campaign(**vals)
    campaign = Campaign.find(vals[:id])
    return if campaign.nil?

    campaign.update!(vals)
    campaign
  end

  def send_messages(campaign_user, acc)
    success_codes = [0, 7, 3, 6, 22, 29, 33]
    sms_log = Notifications::Message.new
    sms_log.assign_attributes(
      receiver: acc.phone_number, message: message, user_id: acc.id,
      sender_id: campaign_user.id, category: 'sms', campaign_id: id
    )
    result = sms_log.send_sms(add_prefix: false)
    sms_delivered = result.messages.select { |mm| success_codes.include?(mm.status.to_i) }.present?
    sms_log.save if sms_delivered
  end

  def send_email(user_email)
    template = community.email_templates.find(email_templates_id)
    return unless template

    # we will add more data here when needed
    template_data = [
      { key: '%community%', value: community.name.to_s },
      { key: '%logo_url%', value: community.logo_url.to_s },
      { key: '%message%', value: message },
    ]
    EmailMsg.send_mail_from_db(user_email, template, template_data)
  end

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  def run_campaign
    admin_user = campaign_admin_user
    update(start_time: Time.current, status: 'in_progress')
    users = target_list_user
    CampaignMetricsJob.set(wait: 2.hours).perform_later(id, users.pluck(:id).join(','))

    users.each do |acc|
      if campaign_type.eql?('email')
        send_email(acc.email)
      elsif acc.phone_number.present?
        send_messages(admin_user, acc)
      end
    end

    update({ end_time: Time.current, status: :done })
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength

  def label_users
    labels.map(&:users)
  end

  def campaign_metrics
    {
      batch_time: batch_time,
      start_time: start_time,
      end_time: end_time,
      total_scheduled: user_id_list.split(',').count,
      total_sent: message_count,
      total_clicked: total_clicked || 0,
    }
  end

  def expired?
    return false if start_time.nil?

    Time.zone.now > (start_time + EXPIRATION_DAYS.days)
  end
end
