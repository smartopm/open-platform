# frozen_string_literal: true

# ApplicationPolicy, accessed by ::Policy::ApplicationPolicy from other modules
module Policy
  # class ApplicationPolicy
  class ApplicationPolicy
    attr_reader :user, :record, :permission_list

    # rubocop:disable Layout/LineLength
    # Food for thought, think of a resource. only the owner can update in the future.
    # We can capture the curent user and curent record and return true or false
    def initialize(user = nil, record = nil)
      @user = user
      @record = record
      @permission_list = {
        note: { admin: { permissions: %i[can_create_note can_update_note can_set_note_reminder can_assign_note can_bulk_assign_note can_create_note_comment can_update_note_comment can_delete_note_comment can_fetch_flagged_note can_fetch_task_by_id can_fetch_task_comments can_fetch_task_histories can_get_task_count can_get_task_stats can_get_user_tasks] }, contractor: { permissions: %i[can_create_note can_update_note can_set_note_reminder can_assign_note can_bulk_assign_note can_create_note_comment can_update_note_comment can_fetch_flagged_note can_fetch_task_by_id can_fetch_task_comments can_fetch_task_histories can_get_task_count can_get_task_stats can_get_user_tasks] }, custodian: { permissions: %i[can_create_note can_update_note can_set_note_reminder can_assign_note can_bulk_assign_note can_create_note_comment can_update_note_comment can_fetch_flagged_note can_fetch_task_by_id can_fetch_task_comments can_fetch_task_histories can_get_task_count can_get_task_stats can_get_user_tasks] }, security_guard: { permissions: %i[can_create_note can_update_note can_set_note_reminder can_assign_note can_bulk_assign_note can_create_note_comment can_update_note_comment can_fetch_flagged_note can_fetch_task_by_id can_fetch_task_comments can_fetch_task_histories can_get_task_count can_get_task_stats can_get_user_tasks] }, visitor: { permissions: %i[] }, resident: { permissions: %i[] }, client: { permissions: %i[] }, prospective_client: { permissions: %i[] }, site_worker: { permissions: %i[can_create_note can_update_note can_set_note_reminder can_assign_note can_bulk_assign_note can_create_note_comment can_update_note_comment can_fetch_flagged_notes can_fetch_task_by_id can_fetch_task_comments can_fetch_task_histories can_get_task_count can_get_task_stats can_get_user_tasks] } },
      }
    end

    # rubocop:enable Layout/LineLength
    def permission?
      raise NotImplementedError, 'Not allowed to call this method'
    end
  end
end
