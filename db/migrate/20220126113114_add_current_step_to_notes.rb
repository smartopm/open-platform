class AddCurrentStepToNotes < ActiveRecord::Migration[6.1]
  def change
    add_column :notes, :current_step, :uuid
    add_column :notes, :current_step_body, :string
  end
end
