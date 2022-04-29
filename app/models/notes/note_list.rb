# frozen_string_literal: true

# Notelist
class Notes::NoteList < ApplicationRecord
  belongs_to :community
  belongs_to :process, class_name: 'Processes::Process', optional: true
  has_many :notes, class_name: 'Notes::Note', dependent: :destroy
  validates :name, presence: true, uniqueness: { scope: :community_id }

  enum status: { active: 0, deleted: 1 }

  default_scope { where.not(status: 'deleted') }

  after_update :update_associated_note_body, if: -> { saved_changes.key?('name') }

  def update_associated_note_body
    note = notes.find_by(body: attribute_before_last_save('name'))
    note.update(body: name) if note.present?
  end
end
