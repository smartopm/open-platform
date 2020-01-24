class AddCompletedToNote < ActiveRecord::Migration[6.0]
  def change
    add_column :notes, :completed, :boolean
  end
end
