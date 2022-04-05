# frozen_string_literal: true

# Notelist
class Notes::NoteList < ApplicationRecord
  belongs_to :community
  belongs_to :process, class_name: 'Processes::Process'
  has_many :notes, class_name: 'Notes::Note', dependent: :destroy
end
