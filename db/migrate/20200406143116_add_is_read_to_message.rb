class AddIsReadToMessage < ActiveRecord::Migration[6.0]
  def change
    add_column :messages, :is_read, :boolean
  end
end
