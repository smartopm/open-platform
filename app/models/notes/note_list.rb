# frozen_string_literal: true

# Notelist
class Notes::NoteList < ApplicationRecord
  belongs_to :community
  belongs_to :process, class_name: 'Processes::Process', optional: true
  has_many :notes, class_name: 'Notes::Note', dependent: :destroy
  validates :name, presence: true, uniqueness: { scope: :community_id }
end
