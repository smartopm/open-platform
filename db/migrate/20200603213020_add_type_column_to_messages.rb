class AddTypeColumnToMessages < ActiveRecord::Migration[6.0]
  def change
    rename_column :messages, :message_type, :type
    add_column :messages, :source_system_id, :string
  end
end
