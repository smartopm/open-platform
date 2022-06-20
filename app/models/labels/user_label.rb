# frozen_string_literal: true

module Labels
  # UserLabel
  class UserLabel < ApplicationRecord
    class UserLabelError < StandardError; end

    RESERVED_LEAD_GROUPS = %w[Investment Status Division].freeze
    belongs_to :user, class_name: 'Users::User'
    belongs_to :label

    validate :label_grouping_name,
             on: :create,
             if: -> { user.user_type.eql?('lead') }
    validate :lead_specific_labels, unless: -> { user.user_type.eql?('lead') }

    # Validate label grouping name
    # * Validates if the lead is already associated with the same type of label group.
    #
    # @return [ActiveRecord::RecordInvalid]
    def label_grouping_name
      return if label.nil? || RESERVED_LEAD_GROUPS.exclude?(label.grouping_name)

      existing_label = user.labels.find_by(grouping_name: label.grouping_name)
      errors.add(:base, I18n.t('errors.user_label.lead.already_exist')) if existing_label.present?
    end

    # Lead specific labels
    # * User cannot associate with labels that are reserved for leads
    #
    # @return [ActiveRecord::RecordInvalid]
    def lead_specific_labels
      return if label.nil? || RESERVED_LEAD_GROUPS.exclude?(label.grouping_name)

      errors.add(:base, I18n.t('errors.user_label.lead.reserved'))
    end
  end
end
