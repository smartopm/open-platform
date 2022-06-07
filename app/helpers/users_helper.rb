# frozen_string_literal: true

# Helper Module
module UsersHelper
  VALID_USER_TYPES = %w[security_guard admin resident contractor
                        prospective_client client visitor developer consultant
                        custodian site_worker site_manager security_supervisor
                        lead marketing_manager public_user code_scanner marketing_admin].freeze

  VALID_STATES = %w[valid pending banned expired].freeze

  DEFAULT_PREFERENCE = %w[com_news_sms com_news_email weekly_point_reminder_email].freeze

  VALID_LEAD_STATUSES = ['Qualified Lead', 'Interest Shown', 'Investment Motive Verified',
                         'Signed MOU', 'Signed Lease', 'Evaluation', 'Stakeholder Meetings',
                         'Site Visit'].freeze
end
