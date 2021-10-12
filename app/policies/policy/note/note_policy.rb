# frozen_string_literal: true

# ::Policy::Note

module Policy
  module Note
    #  NotePolicy Class
    class NotePolicy < ApplicationPolicy
      def permission?(permission)
        return false if user.nil?

        user_permissions = permission_list.dig(user.user_type.to_sym, :note, :permissions)
        return false if user_permissions.nil?

        user_permissions.include?(permission.to_s)
      end
    end
  end
end
