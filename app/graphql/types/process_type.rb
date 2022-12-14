# frozen_string_literal: true

module Types
  # ProcessType
  class ProcessType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :process_type, String, null: true
    field :form, Types::FormType, null: true, resolve: Resolvers::BatchResolver.load(:form)
    field :note_list, Types::NoteListType, null: true,
                                           resolve: Resolvers::BatchResolver.load(:note_list)
  end
end
