# frozen_string_literal: true

module Mutations
  module User
    # Import users in bulk
    class Import < BaseMutation
      argument :csv_string, String, required: true

      field :message, String, null: true

      # rubocop:disable Metrics/AbcSize
      # rubocop:disable Metrics/MethodLength
      # rubocop:disable Metrics/BlockLength
      def resolve(csv_string:)
        current_user = context[:current_user]
        errors = {}
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
            phone_list = [phone, phone1, phone2].compact

            if user_already_present?(email, phone_list)
              errors[index + 1] = ['User already present']
              next
            end

            user = current_user.enroll_user(name: name, email: email,
                                            phone_number: phone, state: state,
                                            user_type: user_type,
                                            expires_at: expires_at, request_note: notes)

            user.contact_infos.build(contact_type: 'email', info: email) if email.present?
            phone_list.each do |p|
              user.contact_infos.build(contact_type: 'phone', info: p)
            end

            labels.each do |l|
              label = user.community.labels.find_or_create_by(short_desc: l)
              user.labels << label unless user.labels.exists?(label.id)
            end

            errors[index + 1] = user.errors.full_messages unless user.save
          end

          raise ActiveRecord::Rollback unless errors.empty?
        end

        { message: errors.to_json }
      end
      # rubocop:enable Metrics/AbcSize
      # rubocop:enable Metrics/MethodLength
      # rubocop:enable Metrics/BlockLength

      def user_already_present?(email, phone_list)
        ::User.where(email: email).or(
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
