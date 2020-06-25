# frozen_string_literal: true

# Our ApplicationPolicy
class ApplicationPolicy
  attr_reader :user, :record, :role_list

  # rubocop:disable Metrics/MethodLength
  def initialize(user, record)
    @user = user
    @record = record
    @role_list = {
      'admin' => { 'ability_list' => ['*@*'], 'can_see_self' => true },
      'prospective_client' => { 'ability_list' => ['admin@can_see?'], 'can_see_self' => true },
      'client' => { 'ability_list' => ['admin@can_see?'], 'can_see_self' => true },
      'custodian' => {
        'ability_list' => ['admin@can_see?', 'contractor@can_see?', 'security_guard@can_see?'],
        'can_see_self' => true,
      },
      'security_guard' => { 'ability_list' => ['*@*'], 'can_see_self' => true },
      'contractor' => {
        'ability_list' => ['admin@can_see?', 'custodian@can_see?'],
        'can_see_self' => true,
      },
      'resident' => { 'ability_list' => ['admin@can_see?'], 'can_see_self' => true },
      'visitor' => { 'ability_list' => ['admin@can_see?'], 'can_see_self' => true },
    }
  end
  # rubocop:enable Metrics/MethodLength

  def ability?(perms_to_check)
    @abilities ||= user_role_category('ability_list')
    @abilities.include?('*@*') ||
      @abilities.include?("#{target_user.user_type}@*") ||
      @abilities.include?("*@#{perms_to_check}") ||
      @abilities.include?("#{target_user.user_type}@#{perms_to_check}")
  end

  def contains_obj?(perms_list, perms_to_check)
    # perms_to_check and perms_list must be arrays
    perms_to_check = (perms_to_check << 'all')
    perms_list != (perms_list - perms_to_check)
  end

  def user_role_category(category)
    @role_list.dig(a_user.user_type, category) || []
  end
end
