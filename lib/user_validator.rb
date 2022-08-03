# frozen_string_literal: true

# Helper to for user validations
class UserValidator
  # rubocop:disable Metrics/AbcSize
  def self.duplicate_user(email, phone_list, community)
    users = Users::User.arel_table
    Users::User.where.not(email: nil).where(community: community).where(
      email.present? ? users[:email].matches("#{email}%") : '1 <> 1',
    ).or(Users::User.where(phone_number: phone_list, community: community)).first ||
      Users::User.where(community: community).joins(:contact_infos).where(contact_infos:
        { contact_type: 'email', info: email }).or(
          Users::User.where(community: community).joins(:contact_infos).where(contact_infos:
          { contact_type: 'phone', info: phone_list }),
        ).first
  end
  # rubocop:enable Metrics/AbcSize
end
