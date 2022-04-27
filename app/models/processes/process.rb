# frozen_string_literal: true

# Processes Entity
class Processes::Process < ApplicationRecord
  belongs_to :community
  belongs_to :form, class_name: 'Forms::Form', optional: true
  has_one :note_list, class_name: 'Notes::NoteList', dependent: :destroy

  enum status: { active: 0, deleted: 1 }

  default_scope { where.not(status: 'deleted') }
end
