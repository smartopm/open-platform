# frozen_string_literal: true

# Updates associated records to deleted when form status is updated to deleted
module FormRecordsDeletable
  extend ActiveSupport::Concern

  included do
    after_update :delete_form_user, if: proc { saved_changes[:status]&.last.eql? 'deleted' }
  end

  def delete_form_user
    form_users.map(&:deleted!)
  end
end
