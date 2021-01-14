# frozen_string_literal: true

module Mutations
  module User
    # Import users in bulk
    class Import < BaseMutation
      argument :csv_string, String, required: true

      field :errors, String, null: false
      field :no_of_duplicates, Int, null: false
      field :no_of_invalid, Int, null: false
      field :no_of_valid, Int, null: false

      # rubocop:disable Metrics/AbcSize
      # rubocop:disable Metrics/MethodLength
      # rubocop:disable Metrics/BlockLength
      # rubocop:disable Metrics/CyclomaticComplexity
      # rubocop:disable Metrics/PerceivedComplexity
      def resolve(csv_string:)
        current_user = context[:current_user]
        errors = {}
        no_of_duplicates = 0
        no_of_invalid = 0
        no_of_valid = 0

        csv = CSV.new(csv_string, headers: true)
        ActiveRecord::Base.transaction do
          csv.each_with_index do |row, index|
            name       = row['Name']&.strip
            email      = row['Email primary']&.strip
            phone      = row['Phone number primary']&.strip
            phone1     = row['Phone number secondary 1']&.strip
            phone2     = row['Phone number secondary 2']&.strip
            user_type  = row['User type']&.strip&.parameterize&.underscore
            labels     = Array.wrap(row['Labels']&.split(',')&.map(&:strip)) + ['import']
            state      = row['State']&.strip&.downcase
            expires_at = row['Expiration date']&.strip&.to_datetime
            notes      = row['Notes on client']&.strip
            phone_list = [phone, phone1, phone2].reject(&:blank?)

            if user_already_present?(email, phone_list)
              no_of_duplicates += 1
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

            if user.save
              no_of_valid += 1
            else
              errors[index + 1] = user.errors.full_messages
              no_of_invalid += 1
            end
          end

          raise ActiveRecord::Rollback if !errors.empty? || no_of_duplicates.positive?
        end

        {
          errors: errors.to_json,
          no_of_duplicates: no_of_duplicates,
          no_of_invalid: no_of_invalid,
          no_of_valid: no_of_valid,
        }
      end
      # rubocop:enable Metrics/AbcSize
      # rubocop:enable Metrics/MethodLength
      # rubocop:enable Metrics/BlockLength
      # rubocop:enable Metrics/CyclomaticComplexity
      # rubocop:enable Metrics/PerceivedComplexity

      def user_already_present?(email, phone_list)
        ::User.where.not(email: nil).where(email: email).or(
          ::User.where(phone_number: phone_list),
        ).present? ||
          ::User.joins(:contact_infos).where(contact_infos:
            { contact_type: 'email', info: email }).or(
              ::User.joins(:contact_infos).where(contact_infos:
              { contact_type: 'phone', info: phone_list }),
            ).present?
      end

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

        true
      end
    end
  end
end
