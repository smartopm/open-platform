class AddCurrentStepToNotes < ActiveRecord::Migration[6.1]
  def change
    add_column :notes, :current_step, :uuid
  end
end
