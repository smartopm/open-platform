# frozen_string_literal: true

require 'task_create'

module Forms
  # Form User Record
  class FormUser < ApplicationRecord
    include SearchCop

    belongs_to :form
    belongs_to :user, class_name: 'Users::User'
    belongs_to :status_updated_by, class_name: 'Users::User'
    has_many :user_form_properties, dependent: :destroy
    has_many :note, class_name: 'Notes::Note', dependent: :destroy

    after_create :log_create_event
    after_update :log_update_event

    default_scope { where.not(status: 4) }

    enum status: { draft: 0, pending: 1, approved: 2, rejected: 3, deleted: 4 }

    search_scope :search do
      attributes :status, :created_at
      attributes user: ['user.name']
    end

    def create_form_task
      # TODO: Consider allowing other communities to engage processes
      allowed_community = %w[DoubleGDP Tilisi].include?(form.community.name)
      if allowed_community && form.associated_process?
        return TaskCreate.new_from_process(task_params, form.process)
      end

      TaskCreate.new_from_action(task_params)
    end

    def comments
      Comments::NoteComment.joins(:note).where(note: { form_user_id: id }, send_to_resident: true)
    end

    private

    def description
      return unless form.report_an_issue?

      form_property = form.form_properties.find_by(field_name: 'Description')
      user_form_properties.find_by(form_property_id: form_property&.id)&.value
    end

    def body
      if form.process_type == 'drc'
        project_developer_field = form.form_properties.find_by(field_name: 'Project Developer')
        user_form_properties.find_by(form_property_id: project_developer_field&.id)&.value
      else
        form.name
      end
    end

    # rubocop:disable Metrics/MethodLength
    def task_params
      {
        body: body || form.name,
        description: description,
        category: 'form',
        form_user_id: id,
        flagged: true,
        completed: false,
        user_id: user.id,
        author_id: user.id,
        assignees: user.community.sub_administrator_id,
      }
    end
    # rubocop:enable Metrics/MethodLength

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
