# frozen_string_literal: true

require 'user_validator'

# Execute user bulk import
class UserImportJob < ApplicationJob
  queue_as :default

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/BlockLength
  # rubocop:disable Metrics/CyclomaticComplexity
  # rubocop:disable Metrics/PerceivedComplexity
  def perform(csv_string, csv_file_name, current_user)
    errors = {}
    separator = ACSV::Detect.separator(csv_string).presence || ','
    csv = CSV.new(csv_string, headers: true, col_sep: separator)

    ActiveRecord::Base.transaction do
      csv.each_with_index do |row, index|
        name       = row['Name']&.strip
        email      = row['Email primary']&.strip.presence
        phone      = row['Phone number primary']&.strip
        phone1     = row['Phone number secondary 1']&.strip
        phone2     = row['Phone number secondary 2']&.strip
        user_type  = row['User type']&.strip&.parameterize&.underscore
        labels     = Array.wrap(row['Labels']&.split(',')&.map(&:strip)) + ['import']
        state      = row['State']&.strip&.downcase
        expires_at = row['Expiration date']&.strip&.to_datetime
        notes      = row['Notes on client']&.strip
        phone_list = [phone, phone1, phone2].reject(&:blank?)

        if phone_list.empty? && email.nil?
          errors[index + 1] = ['A contact info must be present']
          next
        end

        dup_user = UserValidator.duplicate_user(email, phone_list, current_user.community)
        if dup_user.present?
          labels.each do |lab|
            new_or_existing_label = dup_user.community.labels.find_or_create_by(short_desc: lab)
            next if dup_user.labels.find_by(id: new_or_existing_label.id)

            Labels::UserLabel.create(user: dup_user, label: new_or_existing_label)
          end

          errors[index + 1] = ['Contact info already exists']
          next
        end

        user = current_user.enroll_user(name: name, email: email,
                                        phone_number: phone, state: state,
                                        user_type: user_type,
                                        expires_at: expires_at)

        user.contact_infos.build(contact_type: 'email', info: email) if email.present?
        phone_list.each do |p|
          user.contact_infos.build(contact_type: 'phone', info: p)
        end

        if notes.present?
          user.notes.build(body: notes, author_id: current_user.id, community: user.community)
        end

        labels.each do |l|
          label = user.community.labels.find_or_create_by(short_desc: l)
          user.labels << label unless user.labels.exists?(label.id)
        end

        errors[index + 1] = user.errors.full_messages unless user.save
      end

      raise ActiveRecord::Rollback unless errors.empty?
    end

    current_user.import_logs.create!(
      import_errors: errors.to_json,
      file_name: csv_file_name,
      failed: !errors.empty?,
      community: current_user.community,
    )
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/BlockLength
  # rubocop:enable Metrics/CyclomaticComplexity
  # rubocop:enable Metrics/PerceivedComplexity
end
