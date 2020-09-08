# frozen_string_literal: true

# its a campaign class
class Campaign < ApplicationRecord
  belongs_to :community
  has_many :messages, dependent: :restrict_with_exception
  has_many :campaign_labels, dependent: :destroy
  has_many :labels, through: :campaign_labels

  EXPIRATION_DAYS = 7
  
  enum status: %i[draft scheduled in_progress deleted done]

  validates :campaign_type, inclusion: { in: %w[sms email] }

  scope :existing, -> { where('status != ?', 3) }
  default_scope { order(created_at: :desc) }

  def already_sent_user_ids
    messages.collect(&:user_id)
  end

  def campaign_admin_user
    User.find_by(name: 'Mutale Chibwe', state: 'valid')
  end

  def target_list
    return [] if user_id_list.blank? && labels.empty?

    user_id_list.split(',') + labels.joins(:users).pluck(:user_id) - already_sent_user_ids
  end

  def target_list_user
    label = Label.find_by(short_desc: "com_news_#{campaign_type}")
    user_ids = target_list.uniq
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
    smess = campaign_user.construct_message(receiver: acc.phone_number,
                                            message: message,
                                            user_id: acc.id,
                                            campaign_id: id)
    smess.save
    result = smess.send_sms(add_prefix: false)
    return false if result.messages.select { |mm| success_codes.include?(mm.status.to_i) }.blank?

    true
  end

  def send_email(user_email)
    EmailMsg.send_campaign_mail(user_email, name, community.name, subject,
                                pre_header, message, template_style)
  end

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  def run_campaign
    admin_user = campaign_admin_user
    update(start_time: Time.current)
    users = target_list_user
    CampaignMetricsJob.set(wait: 2.hours).perform_later(id, users.pluck(:id).join(','))
    users.each do |acc|
      if campaign_type.eql?('email')
        return false unless send_email(acc.email)
      elsif acc.phone_number.present?
        return false unless send_messages(admin_user, acc)
      end
    end
    update(end_time: Time.current)
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
      total_sent: messages.count,
      total_clicked: total_clicked || 0,
    }
  end

  def expired?
    return false if start_time.nil?

    Time.zone.now > (start_time + EXPIRATION_DAYS.days)
  end
end
