# frozen_string_literal: true

module Logs
  # Lead logs
  class LeadLog < ApplicationRecord
    RED_COLOR = '#ec2b2a'
    GREEN_COLOR = '#5CB85C'

    belongs_to :community
    belongs_to :user, class_name: 'Users::User'
    belongs_to :acting_user, class_name: 'Users::User'

    scope :ordered, -> { order(created_at: :desc) }

    after_create :associate_investment_label, if: -> { log_type.eql?('investment') }

    enum log_type: { event: 0, meeting: 1, signed_deal: 2,
                     lead_status: 3, investment: 4, deal_details: 5 }

    validates :deal_size, :investment_target,
              presence: true,
              numericality: { greater_than_or_equal_to: 0 },
              if: -> { log_type.eql?('deal_details') }
    validates :amount,
              presence: true,
              numericality: { greater_than_or_equal_to: 0 },
              if: -> { log_type.eql?('investment') }

    def associate_investment_label
      deal_details_log = user.lead_logs.deal_details.ordered.first
      return if deal_details_log.nil?

      label_title = investment_status(deal_details_log)
      color = label_title.eql?('On Target') ? GREEN_COLOR : RED_COLOR
      label = community.labels.find_or_create_by(short_desc: label_title,
                                                 grouping_name: 'Investment')
      label.update(color: color)
      destroy_existing_investment_user_label(label_title)
      generate_user_label(label)
    end

    def generate_user_label(label)
      label.user_labels.find_or_create_by(user_id: user_id)
    end

    # Destroys existing investment user label
    #
    # @param [String]
    #
    # @return [UserLabel]
    def destroy_existing_investment_user_label(label_title)
      existing_label_status = label_title.eql?('On Target') ? 'Over Target' : 'On Target'
      existing_label = community.labels.find_by(short_desc: existing_label_status,
                                                grouping_name: 'Investment')
      return if existing_label.nil?

      user_label = existing_label.user_labels.find_by(user_id: user_id)
      user_label.destroy if user_label.present?
    end

    def investment_title
      return unless log_type.eql?('deal_details')

      investment_status(self)
    end

    def investment_status(deal_details_log)
      total_spent = user.lead_logs.investment.sum(:amount)
      investment_target = deal_details_log.investment_target
      total_spent > investment_target ? 'Over Target' : 'On Target'
    end
  end
end
