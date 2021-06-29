# frozen_string_literal: true

module Forms
  # Form User Record
  class FormUser < ApplicationRecord
    belongs_to :form
    belongs_to :user, class_name: 'Users::User'
    belongs_to :status_updated_by, class_name: 'Users::User'
    has_many :user_form_properties, dependent: :destroy
    has_one :note, class_name: 'Notes::Note', dependent: :destroy

    after_create :log_create_event
    after_update :log_update_event

    default_scope { where.not(status: 4) }

    enum status: { draft: 0, pending: 1, approved: 2, rejected: 3, deleted: 4 }

    def create_form_task(hostname)
      user.generate_note(
        body: "<a href=\"https://#{hostname}/user/#{user.id}\">#{user.name}</a> Submitted
                <a href=\"https://#{hostname}/user_form/#{form.id}/#{user.id}/#{form.name}/task\">
                #{form.name}</a>",
        category: 'form',
        form_user_id: id,
        flagged: true,
        completed: false,
      )
    end

    private

    def log_create_event
      user.generate_events('form_submit', self)
    end

    def log_update_event
      if saved_changes.key?('status')
        user.generate_events(
          'form_update_submit', self,
          from_status: saved_changes['status'].first,
          to_status: saved_changes['status'].last
        )
      else
        user.generate_events('form_update_submit', self)
      end
    end
  end
end