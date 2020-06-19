# frozen_string_literal: true

# its a campaign class
class Campaign < ApplicationRecord
  belongs_to :community
  has_many :messages, dependent: :restrict_with_exception
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
      # campaign.name = vals[:name]
      # campaign.message = vals[:message]
      # campaign.user_id_list = vals[:user_id_list]
      # campaign.batch_time = vals[:batch_time]
      # campaign.save!
    # end
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

  def run_campaign
    admin_user = campaign_admin_user
    update(start_time: Time.current)
    target_list_user.each do |acc|
      if acc.phone_number.present?
        return false unless send_messages(admin_user, acc)
      end
    end
    update(end_time: Time.current)
  end
end
