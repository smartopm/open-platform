# frozen_string_literal: true

namespace :db do
  desc 'Add division and lead status labels to lead users'
  task add_division_and_lead_status_labels: :environment do
    VALID_LEAD_STATUSES = ['Qualified Lead', 'Interest shown', 'Investment motive verified',
                           'Signed MOU', 'Signed Lease', 'Evaluation', 'Stakeholder meetings',
                           'Site Visit', 'Ready to sign'].freeze

    VALID_LEAD_DIVISIONS = %w[India China Europe].freeze

    ActiveRecord::Base.transaction do
      Community.find_each do |community|
        VALID_LEAD_STATUSES.each do |name|
          community.labels.find_or_create_by(short_desc: name, grouping_name: 'Status',
                                             color: community.theme_colors['secondaryColor'])
        end
        VALID_LEAD_DIVISIONS.each do |name|
          community.labels.find_or_create_by(short_desc: name, grouping_name: 'Division',
                                             color: community.theme_colors['secondaryColor'])
        end

        leads = community.users.where(user_type: 'lead')
        leads.find_each do |user|
          status_label = community.labels.find_by(short_desc: user.lead_status)
          user.user_labels.find_or_create_by(label_id: status_label.id) if status_label.present?
          lead_label = community.labels.find_by(short_desc: user.division)
          user.user_labels.find_or_create_by(label_id: lead_label.id) if lead_label.present?
        end

        puts "Successfully added labels for #{community.name}"
      end
    end
    puts 'Added labels for all communities'
  rescue StandardError => e
    puts 'Failed to add label for the user'
    puts e.message.to_s
  end
end
