class AddCompletedAtToNotes < ActiveRecord::Migration[6.1]
  def change
    add_column :notes, :completed_at, :datetime
  end
end
