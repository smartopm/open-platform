# frozen_string_literal: true

# Our UserPolicy
class UserPolicy < ApplicationPolicy
  attr_reader :a_user, :target_user

  def initialize(a_user, target_user)
    super
    @a_user = a_user
    @target_user = target_user
    @abilities = nil
  end

  def add_user?
    ability?(__method__.to_s)
  end

  def update_user?
    ability?(__method__.to_s)
  end

  def can_see_self?
    @a_user.id == @target_user.id && role_can_see_self?
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
end
