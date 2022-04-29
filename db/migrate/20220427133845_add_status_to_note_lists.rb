class AddStatusToNoteLists < ActiveRecord::Migration[6.1]
  def change
    add_column :note_lists, :status, :integer, default: 0
  end
end
