class AddTaggedDocumentsToNoteComment < ActiveRecord::Migration[6.1]
  def change
    add_column :note_comments, :tagged_documents, :string, array: true, default: []
  end
end
