# frozen_string_literal: true

# ::Policy::Note

module Policy
  module Note
    #  NotePolicy Class
    class NotePolicy < ApplicationPolicy
      def permission?(permission)
        return false if user.nil?

        permission_list[:note][user.user_type.to_sym][:permissions].include? permission
      end
    end
  end
end
