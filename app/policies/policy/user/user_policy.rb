# frozen_string_literal: true

# ::Policy::User::UserPolicy
module Policy
  module User
    # UserPolicy class
    class UserPolicy < ApplicationPolicy
      attr_reader :target_user

      # rubocop:disable Metrics/MethodLength
      def initialize(user, target_user)
        super
        @target_user = target_user
        @abilities = nil
        @role_list = {
          'admin' => { 'ability_list' => ['*@*'], 'can_see_self' => true },
          'prospective_client' => { 'ability_list' => ['admin@can_see?'], 'can_see_self' => true },
          'client' => { 'ability_list' => ['admin@can_see?'], 'can_see_self' => true },
          'custodian' => {
            'ability_list' => ['admin@can_see?', 'contractor@can_see?', 'security_guard@can_see?',
                               'custodian@can_see?', 'site_worker@can_see?'],
            'can_see_self' => true,
          },
          'security_guard' => { 'ability_list' => ['*@*'], 'can_see_self' => true },
          'security_supervisor' => { 'ability_list' => ['*@*'], 'can_see_self' => true },
          'contractor' => {
            'ability_list' => ['admin@can_see?', 'custodian@can_see?'],
            'can_see_self' => true,
          },
          'site_worker' => {
            'ability_list' => ['admin@can_see?', 'site_worker@can_see?'],
            'can_see_self' => true,
          },
          'resident' => { 'ability_list' => ['admin@can_see?'], 'can_see_self' => true },
          'visitor' => { 'ability_list' => ['admin@can_see?'], 'can_see_self' => true },
          'site_manager' => {
            'ability_list' => ['admin@can_see?', 'site_manager@can_see?'],
            'can_see_self' => true,
          },
          'consultant' => { 'ability_list' => ['admin@can_see?'], 'can_see_self' => true },
          'developer' => {
            'ability_list' => ['admin@can_see?', 'developer@can_see?'],
            'can_see_self' => true,
          },
          'marketing_manager' => { 'ability_list' => ['*@*'], 'can_see_self' => true },
          'marketing_admin' => { 'ability_list' => ['*@*'], 'can_see_self' => true },
        }
      end
      # rubocop:enable Metrics/MethodLength

      def add_user?
        ability?(__method__.to_s)
      end

      def update_user?
        ability?(__method__.to_s)
      end

      def can_see_self?
        user.id == @target_user.id && role_can_see_self?
      end

      def role_can_see_self?
        !user_role_category('can_see_self').nil?
      end

      def can_see?
        ability?(__method__.to_s)
      end

      # based on can see ability
      def roles_user_can_see
        @abilities ||= user_role_category('ability_list')
        can_see_abilities = @abilities.select do |ab|
          ab.include?('can_see?') || ab.include?('*')
        end
        data = can_see_abilities.collect do |ability|
          ability.split('@')[0]
        end
        return '*' if data.include?('*')

        data
      end

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
        @role_list.dig(user.user_type, category) || []
      end
    end
  end
end
