# frozen_string_literal: true

# its a campaign class
class Campaign < ApplicationRecord
  belongs_to :community
  has_many :messages, dependent: :restrict_with_exception
  has_many :campaign_labels, dependent: :destroy
  has_many :labels, through: :campaign_labels

  EXPIRATION_DAYS = 7

  default_scope { order(created_at: :desc) }

  def already_sent_user_ids
    messages.collect(&:user_id)
  end

  def campaign_admin_user
    User.find_by(name: 'Mutale Chibwe', state: 'valid')
  end

  def target_list
    return user_id_list.split(',') - already_sent_user_ids if user_id_list.present?

    []
  end

  def target_list_user
    l = target_list
    return User.where(state: 'valid').where(id: l) if l.present?

    []
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

  def check_users_without_sms_label(users)
    users.select do |usr|
      User.find(usr.id).labels.find_by(short_desc: "com_news_sms").present?
    end
  end

  # rubocop:disable Metrics/AbcSize
  def run_campaign
    admin_user = campaign_admin_user
    update(start_time: Time.current)
    users = check_users_without_sms_label(target_list_user)
    CampaignMetricsJob.set(wait: 2.hours).perform_later(id, users.pluck(:id).join(','))
    users.each do |acc|
      if acc.phone_number.present?
        return false unless send_messages(admin_user, acc)
      end
    end
    update(end_time: Time.current)
  end
  # rubocop:enable Metrics/AbcSize

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
