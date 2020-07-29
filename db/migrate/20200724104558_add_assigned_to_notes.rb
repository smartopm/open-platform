class AddAssignedToNotes < ActiveRecord::Migration[6.0]
  def change
    add_column :notes, :assigned_to, :uuid
  end
end
