# frozen_string_literal: true

# Processes Entity
class Processes::Process < ApplicationRecord
  belongs_to :community
  belongs_to :form, class_name: 'Forms::Form', optional: true
  has_one :note_list, class_name: 'Notes::NoteList', dependent: :destroy

  validates :name, presence: true, uniqueness: { scope: :community_id }

  enum status: { active: 0, deleted: 1 }

  default_scope { where.not(status: 'deleted') }

  alias task_list note_list
end
